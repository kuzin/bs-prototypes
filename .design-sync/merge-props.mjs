// Merge dtsPropsFor bodies + cardMode overrides recorded by the preview-authoring
// subagents (in .design-sync/learnings/*.md) into .design-sync/config.json.
// Idempotent: re-running with the same learnings produces the same config.
// Two learnings formats are supported:
//   inline:  Name: "escaped\\nprop body"
//   fenced:  ### Name\n```\nprop body\n```
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const CONFIG = join(HERE, 'config.json')
const LEARN = join(HERE, 'learnings')

const props = {}
for (const f of readdirSync(LEARN).filter((n) => n.endsWith('.md'))) {
  const txt = readFileSync(join(LEARN, f), 'utf8')
  // inline: Name: "..."
  for (const m of txt.matchAll(/^([A-Z][A-Za-z0-9]*): "((?:[^"\\]|\\.)*)"\s*$/gm)) {
    props[m[1]] = JSON.parse(`"${m[2]}"`)
  }
  // fenced: ### Name \n ```[lang]\n body \n```
  for (const m of txt.matchAll(/^###\s+([A-Z][A-Za-z0-9]*)\s*\n```[a-z]*\n([\s\S]*?)\n```/gm)) {
    props[m[1]] = m[2].replace(/\s+$/, '')
  }
}

const cfg = JSON.parse(readFileSync(CONFIG, 'utf8'))
cfg.dtsPropsFor = { ...(cfg.dtsPropsFor ?? {}), ...props }
cfg.overrides = { ...(cfg.overrides ?? {}) }
// Wide components → column (full card width, ALL variant cells kept).
for (const name of [
  'Table', 'Banner', // wave 1
  'AlertRow', 'AlertsBanner', 'ReadingHealth', // wave 2 domain (wide panels)
  'AppShell', 'Sidebar', 'MainRail', 'Hero', // wave 2 layout (full-page shells)
  'ChartCard', 'TrendChart', // validate [GRID_OVERFLOW]: wide charts
  'PrototypeNav', // fixed-nav neutralized to static in its preview → column shows all 3 states
]) {
  cfg.overrides[name] = { cardMode: 'column' }
}
// Escape components (position:fixed / portaled content) → single + primaryStory.
// column can't present these (the skill's [GRID_OVERFLOW] escape verdict); the
// other variants stay documented in the .prompt.md + .d.ts.
Object.assign(cfg.overrides, {
  Modal: { cardMode: 'single', primaryStory: 'Center' },
  Funnel: { cardMode: 'single', primaryStory: 'ChallengeFunnel' },
})
writeFileSync(CONFIG, JSON.stringify(cfg, null, 2) + '\n')

console.log(`merged ${Object.keys(props).length} prop bodies this run`)
console.log(`dtsPropsFor total: ${Object.keys(cfg.dtsPropsFor).length}`)
console.log('names:', Object.keys(props).sort().join(', '))
