#!/usr/bin/env node
// Guard against drift between the three places a prototype is registered:
//   1. its folder         prototypes/<slug>/main.jsx   (auto-discovered by the build)
//   2. the registry       components/prototypes.js     (landing card, switcher, title)
//   3. its landing glyph  landing/App.jsx ICON_NAMES   (keyed by prototype id)
//
// Each can drift independently and the failure is silent — a folder with no
// registry entry builds with a fallback title and no card; a missing icon just
// renders no glyph. This fails the build instead. Run via `pnpm check` (and CI).

import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { PROTOTYPES } from '../components/prototypes.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = '/bs-prototypes/'
const slugOf = (href) => href.replace(BASE, '').replace(/\/$/, '')

// 1. Folders that are real prototype entries (contain a main.jsx).
const PROTO_DIR = resolve(ROOT, 'prototypes')
const folders = readdirSync(PROTO_DIR).filter(
  (slug) =>
    statSync(resolve(PROTO_DIR, slug)).isDirectory() &&
    existsSync(resolve(PROTO_DIR, slug, 'main.jsx')),
)

// 2. Registry entries, indexed by url slug and by id.
const bySlug = new Map(PROTOTYPES.map((p) => [slugOf(p.href), p]))
const ids = new Set(PROTOTYPES.map((p) => p.id))

// 3. Landing-card icon keys (ICON_NAMES is keyed by prototype id).
const landing = readFileSync(resolve(ROOT, 'landing/App.jsx'), 'utf8')
const block = landing.match(/const ICON_NAMES = \{([\s\S]*?)\n\}/)
const iconIds = new Set()
if (block) {
  for (const m of block[1].matchAll(/(?:^|\n)\s*(?:'([^']+)'|([A-Za-z0-9_-]+))\s*:/g)) {
    iconIds.add(m[1] ?? m[2])
  }
}

const errors = []

// Every folder must have a registry entry…
for (const slug of folders) {
  if (!bySlug.has(slug)) {
    errors.push(
      `prototypes/${slug}/ has a main.jsx but no entry in components/prototypes.js (expected href "${BASE}${slug}/").`,
    )
  }
}
// …and every registry entry must point at a real folder.
for (const [slug, p] of bySlug) {
  if (!folders.includes(slug)) {
    errors.push(
      `prototypes.js entry "${p.id}" → "${p.href}", but prototypes/${slug}/main.jsx does not exist.`,
    )
  }
}
// Every prototype must have a landing-card glyph…
for (const p of PROTOTYPES) {
  if (!iconIds.has(p.id)) {
    errors.push(
      `prototypes.js entry "${p.id}" has no icon in landing/App.jsx ICON_NAMES (card renders with no glyph).`,
    )
  }
}
// …and no icon should be left orphaned.
for (const id of iconIds) {
  if (!ids.has(id)) {
    errors.push(
      `landing/App.jsx ICON_NAMES has "${id}", but no prototype with that id exists in prototypes.js.`,
    )
  }
}

if (errors.length) {
  console.error(
    `✗ Prototype registry out of sync (${errors.length} issue${errors.length > 1 ? 's' : ''}):\n`,
  )
  for (const e of errors) console.error(`  • ${e}`)
  console.error(
    '\nFix components/prototypes.js / landing/App.jsx, or use `pnpm new <id>` to scaffold correctly.',
  )
  process.exit(1)
}

console.log(
  `✓ Prototypes in sync — ${folders.length} folders, ${bySlug.size} registry entries, ${iconIds.size} icons.`,
)
