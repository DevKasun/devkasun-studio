import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import entry from '../dist/server/server.js'

const app = new Hono()
app.use('/assets/*', async (ctx, next) => {
  await next()
  if (ctx.res.ok)
    ctx.header('Cache-Control', 'public, max-age=31536000, immutable')
})
app.use('*', serveStatic({ root: './dist/client', precompressed: true }))
app.use('*', compress({ encoding: 'gzip' }))
app.all('*', (ctx) => {
  // Use the socket peer unless deployment explicitly trusts a sanitising proxy.
  ctx.req.raw.headers.set(
    'x-studio-peer',
    ctx.env.incoming.socket.remoteAddress || 'unknown',
  )
  return entry.fetch(ctx.req.raw)
})
serve(
  { fetch: app.fetch, port: Number(process.env.PORT || 3000) },
  ({ port }) => {
    console.log(`DevKasun Studio listening on http://localhost:${port}`)
  },
)
