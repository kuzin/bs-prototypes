import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { existsSync, readdirSync, statSync, mkdirSync, writeFileSync, rmSync, rmdirSync } from 'fs'
import { PROTOTYPES } from './components/prototypes.js'

const ROOT = __dirname
const BASE = '/bs-prototypes/'
const PROTO_DIR = resolve(ROOT, 'prototypes')

// slug (folder name / url segment) -> display name, derived from the registry href
const TITLES = Object.fromEntries(
  PROTOTYPES.map((p) => [p.href.replace(BASE, '').replace(/\/$/, ''), p.name]),
)

function htmlTemplate(title, scriptSrc) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="${BASE}bs.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${scriptSrc}"></script>
  </body>
</html>
`
}

// One entry per prototype folder (those with a main.jsx) + the landing page.
function discoverEntries() {
  const entries = [
    {
      name: 'landing',
      urlPath: '/',
      file: 'index.html',
      script: '/landing/main.jsx',
      title: 'Beanstack · Prototypes',
    },
  ]
  for (const slug of readdirSync(PROTO_DIR).sort()) {
    const dir = resolve(PROTO_DIR, slug)
    if (!statSync(dir).isDirectory() || !existsSync(resolve(dir, 'main.jsx'))) continue
    entries.push({
      name: slug,
      urlPath: `/${slug}/`,
      file: `${slug}/index.html`,
      script: `/prototypes/${slug}/main.jsx`,
      title: `Beanstack · ${TITLES[slug] ?? slug}`,
    })
  }
  return entries
}

// Strip the configured base so middleware matching works whether or not Vite
// has already stripped it. Idempotent.
function stripBase(url) {
  const p = url.split('?')[0]
  if (p === BASE.slice(0, -1)) return '/'
  if (p.startsWith(BASE)) return '/' + p.slice(BASE.length)
  return p
}

// Entry HTML pages don't exist in the repo — they're generated. In dev they're
// served from memory; for build they're written to disk as rollup inputs and
// removed again once the bundle closes, so nothing ever lands in version control.
function generatedEntries() {
  const entries = discoverEntries()
  let isBuild = false
  const written = []
  return {
    name: 'bs:generated-entries',
    config(_, env) {
      isBuild = env.command === 'build'
      if (isBuild) {
        for (const e of entries) {
          const abs = resolve(ROOT, e.file)
          mkdirSync(dirname(abs), { recursive: true })
          writeFileSync(abs, htmlTemplate(e.title, e.script))
          written.push(abs)
        }
      }
      return {
        build: {
          rollupOptions: {
            input: Object.fromEntries(entries.map((e) => [e.name, resolve(ROOT, e.file)])),
          },
        },
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()
        const path = stripBase(req.url || '/')
        const match = entries.find(
          (e) => path === e.urlPath || path === e.urlPath.replace(/\/$/, ''),
        )
        if (!match) return next()
        try {
          const html = await server.transformIndexHtml(
            req.url,
            htmlTemplate(match.title, match.script),
            req.originalUrl,
          )
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html')
          res.end(html)
        } catch (err) {
          next(err)
        }
      })
    },
    closeBundle() {
      if (!isBuild) return
      for (const abs of written) {
        rmSync(abs, { force: true })
        const dir = dirname(abs)
        if (dir !== ROOT) {
          try {
            rmdirSync(dir)
          } catch {
            /* keep non-empty dirs */
          }
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), generatedEntries()],
  base: BASE,
  optimizeDeps: {
    // Entry HTML is generated in memory (see generatedEntries), so Vite's dep
    // scanner has no on-disk .html to crawl — and Vite 8's scanner errors trying
    // to resolve the build inputs. Point it at the real entry modules instead.
    entries: ['landing/main.jsx', 'prototypes/*/main.jsx'],
  },
  resolve: {
    alias: [{ find: '@components', replacement: resolve(ROOT, 'components') }],
    // Force a single React instance across every entry + pre-bundled dep —
    // standard hygiene for a multi-entry app with many React-dependent libs
    // (Radix, dnd-kit, nivo, react-spring).
    dedupe: ['react', 'react-dom'],
  },
})
