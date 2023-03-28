package crudr

import (
	"encoding/json"
	"fmt"
	"reflect"
	"sync"

	"github.com/inconshreveable/log15"
	"github.com/oklog/ulid/v2"
	"github.com/r3labs/sse/v2"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

const (
	ActionCreate = "create"
	ActionUpdate = "update"
	ActionDelete = "delete"
)

const (
	LocalStreamName  = "ops"
	GlobalStreamName = "global"
)

type Crudr struct {
	DB        *gorm.DB
	SSEServer *sse.Server

	host    string
	logger  log15.Logger
	typeMap map[string]reflect.Type

	mu        sync.Mutex
	callbacks []func(op *Op, records interface{})
}

func New(host string, db *gorm.DB) *Crudr {
	err := db.AutoMigrate(&Op{})
	if err != nil {
		panic(err)
	}

	sseServer := sse.New()

	// ojala falso
	sseServer.AutoReplay = false

	sseServer.CreateStream(LocalStreamName)
	sseServer.CreateStream(GlobalStreamName)

	c := &Crudr{
		DB:        db,
		SSEServer: sseServer,

		host:    host,
		logger:  log15.New("module", "crud", "from", host),
		typeMap: map[string]reflect.Type{},
	}

	return c
}

// RegisterModels accepts a instance of a GORM model and registers it
// to work with Op apply.
func (c *Crudr) RegisterModels(tables ...interface{}) *Crudr {
	c.mu.Lock()
	defer c.mu.Unlock()
	for _, t := range tables {
		tableName := c.tableNameFor(t)
		c.typeMap[tableName] = reflect.TypeOf(t)
	}
	return c
}

func (c *Crudr) AddOpCallback(cb func(op *Op, records interface{})) {
	c.mu.Lock()
	c.callbacks = append(c.callbacks, cb)
	c.mu.Unlock()
}

func (c *Crudr) callOpCallbacks(op *Op, records interface{}) {
	for _, cb := range c.callbacks {
		cb(op, records)
	}
}

func (c *Crudr) Create(data interface{}, opts ...withOption) error {
	op := c.newOp(ActionCreate, data, opts...)
	return c.doOp(op)
}

func (c *Crudr) Update(data interface{}, opts ...withOption) error {
	op := c.newOp(ActionUpdate, data, opts...)
	return c.doOp(op)
}

func (c *Crudr) Patch(data interface{}, opts ...withOption) error {
	opts = append(opts, WithTransient())
	op := c.newOp(ActionUpdate, data, opts...)
	return c.doOp(op)
}

func (c *Crudr) Delete(data interface{}, opts ...withOption) error {
	op := c.newOp(ActionDelete, data, opts...)
	return c.doOp(op)
}

func (c *Crudr) newOp(action string, data interface{}, opts ...withOption) *Op {
	tableName := c.tableNameFor(data)

	j := jsonArrayMarshal(data)

	op := &Op{
		ULID:   ulid.Make().String(),
		Host:   c.host,
		Action: action,
		Table:  tableName,
		Data:   j,
	}
	for _, opt := range opts {
		opt(op)
	}

	return op
}

func (c *Crudr) doOp(op *Op) error {
	// apply locally
	err := c.apply(op)
	if err != nil {
		c.logger.Warn("apply failed", "op", op, "err", err)
		return err
	}

	return nil
}

func jsonArrayMarshal(data interface{}) []byte {
	j, err := json.Marshal(data)
	// panic here because data is always provided by app dev
	if err != nil {
		panic(err)
	}

	// ensure array
	if j[0] != '[' {
		j = append([]byte{'['}, j...)
		j = append(j, ']')
	}

	return j
}

// tableNameFor finds the struct at the heart of a thing
// and gets the gorm table name for it.
// will continually unwrap slices / pointers till it gets
// to the named struct type
func (c *Crudr) tableNameFor(obj interface{}) string {
	t := reflect.TypeOf(obj)
	for t.Kind() != reflect.Struct {
		t = t.Elem()
	}
	typeName := t.Name()
	return c.DB.NamingStrategy.TableName(typeName)
}

func (c *Crudr) apply(op *Op) error {
	elemType, ok := c.typeMap[op.Table]
	if !ok {
		return fmt.Errorf("no type registered for %s", op.Table)
	}

	// deserialize op.Data to proper go type
	records := reflect.New(reflect.SliceOf(elemType)).Interface()
	err := json.Unmarshal(op.Data, &records)
	if err != nil {
		return fmt.Errorf("invalid crud data: %v %s", err, op.Data)
	}

	// create op + records in a db transaction

	// using a mutex here to force one tx at a time
	// due to sqlite perf issues in prod.
	// it should not really be necessary tho.
	// see: https://github.com/AudiusProject/mediorum/issues/1
	c.mu.Lock()
	err = c.DB.Transaction(func(tx *gorm.DB) error {
		if !op.Transient {
			res := tx.Clauses(clause.OnConflict{DoNothing: true}).Create(op)
			if res.Error != nil {
				return res.Error
			}

			// if ulid already in ops table
			// it is already applied... move on
			if res.RowsAffected == 0 {
				c.logger.Debug("already have ulid", "ulid", op.ULID)
				return nil
			}
		}

		switch op.Action {
		case ActionCreate:
			res := tx.Clauses(clause.OnConflict{DoNothing: true}).Create(records)
			if res.RowsAffected == 0 {
				c.logger.Debug("create had no effect", "ulid", op.ULID)
				return nil
			}
			err = res.Error
		case ActionUpdate:
			res := tx.Clauses(clause.OnConflict{UpdateAll: true}).Create(records)
			err = res.Error
		case ActionDelete:
			err = tx.Delete(records).Error
		default:
			return fmt.Errorf("unknown action: %s", op.Action)
		}

		return err
	})
	c.mu.Unlock()

	if err != nil {
		return err
	}

	msg, _ := json.Marshal(op)
	sseEvent := &sse.Event{
		Data: msg,
	}

	// if this host is origin...
	// broadcast op to local outbox
	if op.Host == c.host {
		if op.Transient {
			c.SSEServer.TryPublish(LocalStreamName, sseEvent)
		} else {
			c.SSEServer.Publish(LocalStreamName, sseEvent)
		}
	}

	// broadcast op to global feed
	// atm global feed is just used by status UI
	// so it's okay to always TryPublish
	c.SSEServer.TryPublish(GlobalStreamName, sseEvent)

	// notify any local (in memory) subscribers
	c.callOpCallbacks(op, records)

	return nil
}
