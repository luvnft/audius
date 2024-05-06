import 'dotenv/config'

import { serve } from '@hono/node-server'
import { fileTypeFromBuffer } from 'file-type'
import { Context, Hono } from 'hono'
import { deleteCookie, getSignedCookie, setSignedCookie } from 'hono/cookie'
import { html } from 'hono/html'
import { decode } from 'hono/jwt'
import { prettyJSON } from 'hono/pretty-json'
import { HtmlEscapedString } from 'hono/utils/html'
import { ReleaseProcessingStatus, releaseRepo, userRepo, xmlRepo } from './db'
import {
  DDEXContributor,
  DDEXRelease,
  parseDdexXml,
  reParsePastXml,
} from './parseDelivery'
import { prepareAlbumMetadata, prepareTrackMetadatas } from './publishRelease'
import { readAssetWithCaching } from './s3poller'
import { parseBool } from './util'

const { NODE_ENV, DDEX_KEY, DDEX_URL, COOKIE_SECRET } = process.env
const COOKIE_NAME = 'audiusUser'

const IS_PROD = NODE_ENV == 'production'
const API_HOST = IS_PROD
  ? 'https://discoveryprovider2.audius.co'
  : 'https://discoveryprovider2.staging.audius.co'

const app = new Hono()
app.use(prettyJSON({ space: 4 }))

app.get('/', async (c) => {
  const me = await getAudiusUser(c)

  return c.html(
    Layout(html`
      <div class="container">
        <h1>ddexer</h1>

        ${c.req.query('loginRequired')
          ? html`<mark>Please login to continue</mark><br />`
          : ''}
        ${me
          ? html`
              <h4>Welcome back ${me.name}</h4>
              <a href="/auth/logout" role="button">log out</a>
            `
          : html` <a role="button" href="/auth">login</a> `}
      </div>
    `)
  )
})

app.get('/auth', (c) => {
  if (!DDEX_KEY) {
    return c.text('DDEX_KEY is required', 500)
  }
  const myUrl = DDEX_URL || 'http://localhost:8989'
  const base = IS_PROD
    ? 'https://audius.co/oauth/auth?'
    : 'https://staging.audius.co/oauth/auth?'
  const params = new URLSearchParams({
    scope: 'write',
    redirect_uri: `${myUrl}/auth/success`,
    api_key: DDEX_KEY!,
    response_mode: 'query',
  })
  const u = base + params.toString()
  return c.redirect(u)
})

app.get('/auth/redirect', async (c) => {
  try {
    const uri = c.req.query('redirect_uri')
    const token = c.req.query('token')
    if (!token) {
      throw new Error('no token')
    }

    const { payload } = decode(token!)
    if (!payload.userId) {
      throw new Error('invalid payload')
    }

    // upsert user record
    userRepo.upsert({
      id: payload.userId,
      handle: payload.handle,
      name: payload.name,
    })

    const params = new URLSearchParams({ token })
    return c.redirect(`${uri}/?` + params.toString())
  } catch (e) {
    console.log(e)
    return c.body('invalid jwt', 400)
  }
})

app.get('/auth/success', async (c) => {
  try {
    const token = c.req.query('token')
    if (!token) {
      throw new Error('no token')
    }

    const { payload } = decode(token!)
    if (!payload.userId) {
      throw new Error('invalid payload')
    }

    // upsert user record
    userRepo.upsert({
      id: payload.userId,
      handle: payload.handle,
      name: payload.name,
    })

    const j = JSON.stringify(payload)
    await setSignedCookie(c, COOKIE_NAME, j, COOKIE_SECRET!)
    return c.redirect('/')
  } catch (e) {
    console.log(e)
    return c.body('invalid jwt', 400)
  }
})

// ====================== AUTH REQUIRED ======================

app.use('*', async (c, next) => {
  const me = await getAudiusUser(c)
  if (!me) return c.redirect('/?loginRequired=true')
  await next()
})

app.get('/auth/whoami', async (c) => {
  const me = await getAudiusUser(c)
  return c.json({ me })
})

app.get('/auth/logout', async (c) => {
  deleteCookie(c, COOKIE_NAME)
  return c.redirect('/')
})

app.get('/releases', (c) => {
  const queryStatus = c.req.query('status')
  const rows = releaseRepo.all({
    status: queryStatus,
    pendingPublish: parseBool(c.req.query('pendingPublish')),
  })

  let lastXmlUrl = ''
  const xmlSpacer = (xmlUrl: string) => {
    if (xmlUrl != lastXmlUrl) {
      lastXmlUrl = xmlUrl
      return html`<tr>
        <td colspan="10" style="background: black">
          <kbd>${xmlUrl}</kbd>
        </td>
      </tr>`
    }
  }

  return c.html(
    Layout(html`
      <h1>Releases</h1>

      <div style="display: flex; gap: 10px;">
        <!-- filters -->
        <form>
          <select
            name="status"
            aria-label="Select"
            onchange="this.form.submit()"
          >
            <option selected value="">All</option>
            ${Object.values(ReleaseProcessingStatus).map(
              (s) =>
                html`<option ${queryStatus == s ? 'selected' : ''}>
                  ${s}
                </option>`
            )}
          </select>
        </form>

        <div style="flex-grow: 1"></div>

        <!-- actions -->
        <form method="POST" action="/releases/reparse">
          <button class="outline">re-parse</button>
        </form>
      </div>

      <table class="striped">
        <thead>
          <tr>
            <th></th>
            <th>Key</th>
            <th>Release Type</th>
            <th>Is Main</th>
            <th>Audius User</th>
            <th>Audius Genre</th>
            <th>Status</th>
            <th>Publish Errors</th>
            <th>Published?</th>
            <th>debug</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(
            (row) =>
              html` ${xmlSpacer(row.xmlUrl!)}
                <tr>
                  <td>${row._parsed?.ref}</td>
                  <td>
                    <a href="/releases/${encodeURIComponent(row.key)}"
                      >${row.key}</a
                    >
                  </td>
                  <td>${row._parsed?.releaseType}</td>
                  <td>${row._parsed?.isMainRelease ? 'Yes' : ''}</td>
                  <td>${row._parsed?.audiusUser}</td>
                  <td>${row._parsed?.audiusGenre}</td>
                  <td>
                    <mark><b>${row.status}</b></mark>
                    ${row._parsed?.problems?.map(
                      (p) => html`<mark>${p}</mark>`
                    )}
                  </td>
                  <td>
                    ${row.publishErrorCount > 0 &&
                    html`<a
                      href="/releases/${encodeURIComponent(row.key)}/error"
                      >${row.publishErrorCount}</a
                    >`}
                  </td>
                  <td>
                    ${row.entityType == 'track' &&
                    html` <a href="${API_HOST}/v1/full/tracks/${row.entityId}">
                      ${row.entityId}
                    </a>`}
                    ${row.entityType == 'album' &&
                    html` <a
                      href="${API_HOST}/v1/full/playlists/${row.entityId}"
                    >
                      ${row.entityId}
                    </a>`}
                  </td>
                  <td>
                    <a href="/xmls/${encodeURIComponent(row.xmlUrl)}">xml</a>

                    <a
                      href="/releases/${encodeURIComponent(
                        row.key
                      )}/json?pretty"
                      >parsed</a
                    >

                    <a href="/xmls/${encodeURIComponent(row.xmlUrl)}?parse=sdk"
                      >sdk</a
                    >
                  </td>
                </tr>`
          )}
        </tbody>
      </table>
    `)
  )
})

app.post('/releases/reparse', async (c) => {
  await reParsePastXml()
  return c.redirect('/releases')
})

app.get('/releases/:key', (c) => {
  const row = releaseRepo.get(c.req.param('key'))
  if (!row) return c.json({ error: 'not found' }, 404)
  if (c.req.query('json') != undefined) {
    return c.json(row)
  }

  const parsedRelease = row._parsed!

  const mapArtist = (c: DDEXContributor) =>
    html`<li><span>${c.name}</span>: <em>${c.role}</em></li>`

  return c.html(
    Layout(html`
      <div style="display: flex; gap: 20px">
        <div style="text-align: center">
          <img
            src="/release/${row.key}/images/${parsedRelease.images[0].ref}"
            style="width: 200px; height: 200px; display: block; margin-bottom: 10px"
          />
          <mark>${parsedRelease.parentalWarningType}</mark>
        </div>

        <div style="flex-grow: 1">
          <h3>${parsedRelease.title}</h3>
          <h5>
            ${parsedRelease.artists.map(
              (a) =>
                html`<em style="margin-right: 5px" data-tooltip="${a.role}"
                  >${a.name}</em
                >`
            )}
          </h5>
          ${parsedRelease.soundRecordings.map(
            (sr) => html`
              <article style="display: flex; gap: 20px">
                <div>
                  <button
                    class="outline contrast"
                    onClick="play('/release/${row.key}/soundRecordings/${sr.ref}')"
                  >
                    play
                  </button>
                </div>
                <div style="flex-grow: 1">
                  <div>
                    <a href="/release/${row.key}/soundRecordings/${sr.ref}">
                      <h4 style="margin-top: 10px">${sr.title}</h4>
                    </a>
                  </div>

                  <div style="margin-left: 10px">
                    <h6>Artists</h6>
                    <ul>
                      ${sr.artists.map(mapArtist)}
                    </ul>
                    <h6>Contributors</h6>
                    <ul>
                      ${sr.contributors.map(mapArtist)}
                    </ul>
                    <h6>Indirect Contributors</h6>
                    <ul>
                      ${sr.indirectContributors.map(mapArtist)}
                    </ul>
                  </div>
                </div>
              </article>
            `
          )}

          <audio id="playa" controls />
        </div>
      </div>
      <script>
        function play(url) {
          playa.onloadstart = () => {
            console.log('loading...')
          }
          playa.oncanplay = () => {
            console.log('OK')
          }
          if (playa.src.includes(url)) {
            playa.paused ? playa.play() : playa.pause()
          } else {
            playa.src = url
            playa.play()
          }
        }
      </script>
    `)
  )
})

app.get('/release/:key/:type/:ref/:name?', async (c) => {
  const key = c.req.param('key')!
  const type = c.req.param('type')
  const ref = c.req.param('ref')
  const row = releaseRepo.get(key)
  if (!row) return c.json({ error: 'not found' }, 404)

  const collection =
    type == 'images' ? row._parsed?.images : row._parsed?.soundRecordings
  const asset = collection!.find((i) => i.ref == ref)
  if (!asset) return c.json({ error: 'not found' }, 404)

  const ok = await readAssetWithCaching(
    row.xmlUrl,
    asset.filePath,
    asset.fileName
  )

  // some mime stuff
  if (asset.fileName.endsWith('flac')) {
    c.header('Content-Type', 'audio/flac')
  } else {
    const ft = await fileTypeFromBuffer(ok.buffer)
    if (ft) {
      c.header('Content-Type', ft.mime)
    }
  }
  return c.body(ok.buffer)
})

app.get('/xmls/:xmlUrl', (c) => {
  const xmlUrl = c.req.param('xmlUrl')
  const row = xmlRepo.get(xmlUrl)
  if (!row) return c.json({ error: 'not found' }, 404)

  // parse=true will parse the xml to internal representation
  if (parseBool(c.req.query('parse'))) {
    const parsed = parseDdexXml(xmlUrl, row.xmlText) as DDEXRelease[]

    // parse=sdk will convert internal representation to SDK friendly format
    if (c.req.query('parse') == 'sdk') {
      const sdkReleases = parsed.map((release) => {
        const tracks = prepareTrackMetadatas(release)
        if (tracks.length > 1) {
          const album = prepareAlbumMetadata(release)
          return {
            ref: release.ref,
            album,
            tracks,
          }
        } else {
          return {
            ref: release.ref,
            track: tracks[0],
          }
        }
      })
      return c.json(sdkReleases)
    }
    return c.json(parsed)
  }
  c.header('Content-Type', 'text/xml')
  return c.body(row.xmlText)
})

app.get('/releases/:key/json', (c) => {
  const row = releaseRepo.get(c.req.param('key'))
  if (!row) return c.json({ error: 'not found' }, 404)
  c.header('Content-Type', 'application/json')
  return c.body(row?.json)
})

app.get('/releases/:key/error', (c) => {
  const row = releaseRepo.get(c.req.param('key'))
  if (!row) return c.json({ error: 'not found' }, 404)
  return c.text(row.lastPublishError)
})

app.get('/users', (c) => {
  const users = userRepo.all()
  return c.html(
    Layout(
      html`<h1>Users</h1>

        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>handle</th>
              <th>name</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(
              (user) =>
                html`<tr>
                  <td>${user.id}</td>
                  <td>${user.handle}</td>
                  <td>${user.name}</td>
                </tr>`
            )}
          </tbody>
        </table> `
    )
  )
})

type JwtUser = {
  userId: string
  email: string
  name: string
  handle: string
  verified: boolean
  profilePicture: {
    '150x150': string
    '480x480': string
    '1000x1000': string
  }
}

async function getAudiusUser(c: Context) {
  const j = await getSignedCookie(c, COOKIE_SECRET!, COOKIE_NAME)
  if (!j) return
  return JSON.parse(j) as JwtUser
}

function Layout(inner: HtmlEscapedString | Promise<HtmlEscapedString>) {
  return html`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ddex</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
        />
        <style>
          :root {
            --pico-font-size: 16px;
            --pico-line-height: 1.3;
            // --pico-border-radius: 1rem;
            // --pico-spacing: 0.5rem;
            // --pico-form-element-spacing-vertical: 0.5rem;
          }
          h1 {
            --pico-typography-spacing-vertical: 0.5rem;
          }
          button {
            --pico-font-weight: 700;
          }
          mark {
            margin-right: 5px;
          }
        </style>
      </head>
      <body>
        <div style="display: flex; gap: 15px; padding: 10px;">
          <b>ddex</b>
          <a href="/">home</a>
          <a href="/auth/whoami">whoami</a>
          <a href="/releases">releases</a>
          <a href="/users">users</a>
        </div>
        <div style="padding: 50px;">${inner}</div>
      </body>
    </html>
  `
}

export function startServer() {
  const port = 8989
  console.log(`Server is running on port ${port}`)

  serve({
    fetch: app.fetch,
    port,
  })
}
