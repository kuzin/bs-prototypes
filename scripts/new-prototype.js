#!/usr/bin/env node
// Scaffold a new prototype: creates prototypes/<id>/{main.jsx,App.jsx,index.css}
// and wires it into the two registries the build relies on — components/prototypes.js
// (landing card + switcher + page title) and landing/App.jsx (card glyph).
//
//   pnpm new <id> [--name="…"] [--section=Prototypes|Experiments]
//                 [--accent=#hex] [--icon=<icon-name>] [--desc="…"]
//
// Example:  pnpm new reading-streaks --name="Reading Streaks" --icon=flame
//
// Run `pnpm check` / `pnpm format` afterwards — both are safe and the generated
// files are already written to match the repo's Prettier config.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { PROTOTYPES } from '../components/prototypes.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = '/bs-prototypes/'

// ── Parse args ───────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
const id = argv.find((a) => !a.startsWith('--'))
const flags = {}
for (const a of argv) {
  if (!a.startsWith('--')) continue
  const [k, ...rest] = a.slice(2).split('=')
  flags[k] = rest.length ? rest.join('=') : true
}

function die(msg) {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

if (!id || flags.help) {
  console.log(
    [
      'Usage: pnpm new <id> [options]',
      '',
      '  <id>              kebab-case folder/url slug (e.g. reading-streaks)',
      '  --name="…"        display name        (default: Title Case of <id>)',
      '  --section=…       Prototypes | Experiments   (default: Prototypes)',
      '  --accent=#hex     landing-card accent color   (default: #0DA7BC)',
      '  --icon=<name>     <Icon> registry name        (default: layout-grid)',
      '  --desc="…"        one-line description',
    ].join('\n'),
  )
  process.exit(id ? 0 : 1)
}

// ── Validate ─────────────────────────────────────────────────────────────
if (!/^[a-z][a-z0-9-]*$/.test(id)) {
  die(
    `Invalid id "${id}" — use lowercase kebab-case (letters, digits, hyphens), e.g. reading-streaks.`,
  )
}
const slugOf = (href) => href.replace(BASE, '').replace(/\/$/, '')
if (PROTOTYPES.some((p) => p.id === id || slugOf(p.href) === id)) {
  die(`A prototype with id/slug "${id}" already exists in components/prototypes.js.`)
}
const dir = resolve(ROOT, 'prototypes', id)
if (existsSync(dir)) die(`prototypes/${id}/ already exists.`)

const esc = (s) => String(s).replace(/'/g, "\\'")
const name =
  flags.name ||
  id
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
const section = flags.section === 'Experiments' ? 'Experiments' : 'Prototypes'
const accent = flags.accent || '#0DA7BC'
const icon = flags.icon || 'layout-grid'
const description = flags.desc || `TODO: describe the ${name} prototype.`
const href = `${BASE}${id}/`

// ── 1. Create the prototype folder + files ───────────────────────────────
mkdirSync(dir, { recursive: true })

writeFileSync(
  resolve(dir, 'main.jsx'),
  `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`,
)

writeFileSync(
  resolve(dir, 'App.jsx'),
  `import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'

export function App() {
  return (
    <>
      <PrototypeNav currentHref="${href}" />
      <main className="proto">
        <h1>${name}</h1>
        <p>Start building the ${name} prototype here.</p>
      </main>
    </>
  )
}
`,
)

writeFileSync(
  resolve(dir, 'index.css'),
  `/* ─── Base ─────────────────────────────────────────────────────────────── */
*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family:
    'Nunito',
    'Trebuchet MS',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  background: #f3f4f6;
  color: #1e293b;
  -webkit-font-smoothing: antialiased;
}
h1,
h2,
h3,
h4 {
  margin: 0;
}
p {
  margin: 0;
}
button {
  font-family: inherit;
  cursor: pointer;
}
html,
body,
#root {
  height: 100%;
}

/* ─── Layout ───────────────────────────────────────────────────────────── */
.proto {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 100vh;
  padding: 48px 24px;
  text-align: center;
}
.proto h1 {
  font-size: 28px;
  font-weight: 800;
  color: #0f766e;
}
.proto p {
  color: #64748b;
  font-size: 15px;
}
`,
)

// ── 2. Register it in components/prototypes.js (insert before the closing ]) ─
const registryPath = resolve(ROOT, 'components/prototypes.js')
const entry = `  {
    id: '${esc(id)}',
    name: '${esc(name)}',
    section: '${section}',
    href: '${href}',
    accent: '${accent}',
    description: '${esc(description)}',
  },
`
const registry = readFileSync(registryPath, 'utf8')
if (!/\n\]\s*$/.test(registry))
  die('Could not find the end of the PROTOTYPES array in components/prototypes.js.')
writeFileSync(registryPath, registry.replace(/\n\]\s*$/, `\n${entry}]\n`))

// ── 3. Add a landing-card glyph in landing/App.jsx (ICON_NAMES, keyed by id) ─
const landingPath = resolve(ROOT, 'landing/App.jsx')
const landing = readFileSync(landingPath, 'utf8')
if (!/const ICON_NAMES = \{[\s\S]*?\n\}/.test(landing)) {
  die('Could not find the ICON_NAMES map in landing/App.jsx.')
}
writeFileSync(
  landingPath,
  landing.replace(/(const ICON_NAMES = \{[\s\S]*?)\n\}/, `$1\n  '${id}': '${icon}',\n}`),
)

// ── Done ─────────────────────────────────────────────────────────────────
console.log(`✓ Created prototype "${id}"

  prototypes/${id}/main.jsx, App.jsx, index.css
  + components/prototypes.js entry  (${section}, accent ${accent})
  + landing/App.jsx icon            ('${id}': '${icon}')

Next:
  pnpm check      verify the registry is in sync
  pnpm dev        open http://localhost:5173/${id}/
`)
