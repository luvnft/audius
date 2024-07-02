const request = require('supertest')
const assert = require('assert')

const { getApp } = require('./lib/app')
const models = require('../src/models')

describe('test authentication routes', function () {
  let app, server
  beforeEach(async () => {
    const appInfo = await getApp()
    app = appInfo.app
    server = appInfo.server
    await app.get('redis').flushdb()
  })
  afterEach(async () => {
    await server.close()
  })

  async function signUpUser() {
    await request(app).post('/authentication').send({
      iv: 'a7407b91ccb1a09a270e79296c88a990',
      cipherText:
        '00b1684fe58f95ef7bca1442681a61b8aa817a136d3c932dcee2bdcb59454205b73174e71b39fa1d532ee915b6d4ba24e8487603fa63e738de35d3505085a142',
      lookupKey:
        '9bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77'
    })

    await request(app).post('/user').send({
      username: 'dheeraj@audius.co',
      walletAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaa'
    })
  }

  it('responds 400 for sign up with incorrect body', function (done) {
    request(app)
      .post('/authentication')
      .send({
        iv: 'a7407b91ccb1a09a270e79296c88a990',
        cipherText:
          '00b1684fe58f95ef7bca1442681a61b8aa817a136d3c932dcee2bdcb59454205b73174e71b39fa1d532ee915b6d4ba24e8487603fa63e738de35d3505085a142'
      })
      .expect(400, done)
  })

  it('responds 200 for sign up with correct body', function (done) {
    request(app)
      .post('/authentication')
      .send({
        iv: 'a7407b91ccb1a09a270e79296c88a990',
        cipherText:
          '00b1684fe58f95ef7bca1442681a61b8aa817a136d3c932dcee2bdcb59454205b73174e71b39fa1d532ee915b6d4ba24e8487603fa63e738de35d3505085a142',
        lookupKey:
          '9bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77'
      })
      .expect(200, done)
  })

  it('changes passwords for the user', async function () {
    await signUpUser()

    await request(app)
      .post('/authentication')
      .send({
        iv: 'b7407b91ccb1a09a270e79296c88a990',
        cipherText:
          '10b1684fe58f95ef7bca1442681a61b8aa817a136d3c932dcee2bdcb59454205b73174e71b39fa1d532ee915b6d4ba24e8487603fa63e738de35d3505085a142',
        lookupKey:
          '1bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77',
        oldLookupKey:
          '9bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77'
      })
      .expect(200)

    const redis = app.get('redis')
    await redis.set('otp:dheeraj@audius.co', '123456')
    // old lookup key doesn't work
    await request(app)
      .get('/authentication')
      .query({
        lookupKey:
          '9bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77',
        username: 'dheeraj@audius.co',
        otp: '123456'
      })
      .expect(400)

    // New lookup key works
    await request(app)
      .get('/authentication')
      .query({
        lookupKey:
          '1bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77',
        username: 'dheeraj@audius.co',
        otp: '123456'
      })
      .expect(200)

    // Change back
    await request(app)
      .post('/authentication')
      .send({
        iv: 'b7407b91ccb1a09a270e79296c88a990',
        cipherText:
          '10b1684fe58f95ef7bca1442681a61b8aa817a136d3c932dcee2bdcb59454205b73174e71b39fa1d532ee915b6d4ba24e8487603fa63e738de35d3505085a142',
        lookupKey:
          '9bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77',
        oldLookupKey:
          '1bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77'
      })
      .expect(200)

    // old lookup key doesn't work
    await request(app)
      .get('/authentication')
      .query({
        lookupKey:
          '1bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77',
        username: 'dheeraj@audius.co',
        otp: '123456'
      })
      .expect(400)

    // New lookup key works
    await request(app)
      .get('/authentication')
      .query({
        lookupKey:
          '9bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77',
        username: 'dheeraj@audius.co',
        otp: '123456'
      })
      .expect(200)
  })

  it('responds 400 for lookup authentication with invalid lookupKey', async function () {
    // Try getting data without the correct query params, should fail
    await request(app)
      .get('/authentication')
      .query({
        lookupKey:
          '9bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77',
        username: 'dheeraj@audius.co',
        otp: '123456'
      })
      .expect(400, { error: 'Invalid credentials' })
  })

  it('responds 200 for lookup authentication with correct params', async function () {
    await signUpUser()

    const redis = app.get('redis')
    await redis.set('otp:dheeraj@audius.co', '123456')
    // Try getting data with the right params
    const response = await request(app).get('/authentication').query({
      lookupKey:
        '9bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77',
      username: 'dheeraj@audius.co',
      otp: '123456'
    })

    assert.deepStrictEqual(response.statusCode, 200)
  })

  it('sends otp code to authenticating users', async function () {
    await signUpUser()

    await request(app)
      .get('/authentication')
      .query({
        lookupKey:
          '9bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77',
        username: 'dheeraj@audius.co'
      })
      .expect(403, { error: 'Missing otp' })

    const redis = app.get('redis')
    const otp = await redis.get('otp:dheeraj@audius.co')

    assert.ok(otp)
  })

  it('sends up to 2 otp codes every 10 minutes', async function () {
    const redis = app.get('redis')
    await signUpUser()

    async function requestSignUp() {
      await request(app).get('/authentication').query({
        lookupKey:
          '9bdc91e1bb7ef60177131690b18349625778c14656dc17814945b52a3f07ac77',
        username: 'dheeraj@audius.co'
      })
    }

    await requestSignUp()
    const otp1 = await redis.get('otp:dheeraj@audius.co')

    await requestSignUp()
    const otp2 = await redis.get('otp:dheeraj@audius.co')
    assert.notStrictEqual(otp1, otp2)

    // After the second request, we don't send any more new otp emails
    await requestSignUp()
    const otp3 = await redis.get('otp:dheeraj@audius.co')
    assert.strictEqual(otp2, otp3)
  })

  it('associates user record on sign up', async function () {
    const expectedWalletAddress = '0x1ea101eccdc55a2db6196eff5440ece24ecb55af'
    const iv = 'ebc1d6a0f87fdf108fb42ec6a5bee016'
    const cipherText = '771d5472aa8cb0e29626d55939bc7c3a56dd2c9bf5fa279b411a0cc52d8ddbb1052ff4564ee14171c406224bfaf2116304e4c4c46f9e183332c343e4dcf27284'
    const lookupKey = '397ae50c24d10abd257dafc5e3b75b78c425ad4a3901bc753acec5aa11cd6536'
    const username = "test@audius.co"

    await request(app).post('/authentication')
      .set('Encoded-Data-Message', 'Click sign to authenticate with identity service: 1719845800')
      .set('Encoded-Data-Signature', '0x60029425041bdabf5f1805a5c41d889df480670a9db1a69f18e74f83650a490b6b36b17cc36cc9c71c915a451e24dde3657e96e198b29991361fdb8d2d46a4c11c')
      .send({
        iv,
        cipherText,
        lookupKey
      })

    await request(app).post('/user').send({
      username,
      walletAddress: expectedWalletAddress
    })

    const authRecord = await models.Authentication.findOne({ where: { lookupKey } })
    assert.strictEqual(authRecord.walletAddress, expectedWalletAddress)

    const userRecord = await models.User.findOne({ where: { walletAddress: expectedWalletAddress } })
    assert.strictEqual(userRecord.email, username)

    await request(app)
      .get('/authentication')
      .query({
        lookupKey,
        username: "wrongemail@audius.co"
      })
      .expect(400)

    await authRecord.destroy()
    await userRecord.destroy()
  })

  it('associates user record on sign in', async function () {
    const walletAddress = '0x1ea101eccdc55a2db6196eff5440ece24ecb55af'
    const iv = 'ebc1d6a0f87fdf108fb42ec6a5bee016'
    const cipherText = '771d5472aa8cb0e29626d55939bc7c3a56dd2c9bf5fa279b411a0cc52d8ddbb1052ff4564ee14171c406224bfaf2116304e4c4c46f9e183332c343e4dcf27284'
    const lookupKey = '397ae50c24d10abd257dafc5e3b75b78c425ad4a3901bc753acec5aa11cd6536'
    const username = "test@audius.co"

    await request(app).post('/authentication')
      .send({
        iv,
        cipherText,
        lookupKey
      })

    const authRecord = await models.Authentication.findOne({ where: { lookupKey } })
    assert.strictEqual(authRecord.walletAddress, null)

    await request(app).post('/user').send({
      username,
      walletAddress
    })

    await request(app)
      .get('/authentication')
      .query({
        lookupKey,
        username
      })
      .expect(403)

    const redis = app.get('redis')
    let otp = await redis.get(`otp:${username}`)

    await request(app)
      .get('/authentication')
      .query({
        lookupKey,
        username,
        otp,
      })
      .expect(200)

    const updatedAuthRecord = await models.Authentication.findOne({ where: { lookupKey } })
    assert.strictEqual(updatedAuthRecord.walletAddress, walletAddress)

    const userRecord = await models.User.findOne({ where: { walletAddress } })
    assert.strictEqual(userRecord.email, username)

    await request(app)
      .get('/authentication')
      .query({
        lookupKey,
        username: "wrongemail@audius.co"
      })
      .expect(400)

    await request(app)
      .get('/authentication')
      .query({
        lookupKey,
        username,
      })
      .expect(403)

    otp = await redis.get(`otp:${username}`)

    await request(app)
      .get('/authentication')
      .query({
        lookupKey,
        username,
        otp,
      })
      .expect(200)

    await updatedAuthRecord.destroy()
    await userRecord.destroy()
  })
})
