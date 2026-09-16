#!/usr/bin/env node
/**
 * Copy the React Native app's image assets into `public/mobile/images/` and generate the key map
 * that mirrors its registry.
 *
 * The mobile app has no icon font and almost no SVG: 326 PNGs, surfaced through a 308-entry
 * `images` map in `src/assets/themes/images.ts` and referenced by string key
 * (`source?: keyof typeof images`). So "the icon system" is an asset registry, and the faithful
 * move is to mirror it rather than redraw ~300 glyphs in a different style.
 *
 * Only assets the registry actually names are copied — an unreferenced PNG is dead weight, and
 * the run reports any it finds so they do not silently accumulate.
 *
 * Source of truth: <mobile>/src/assets/themes/images.ts + <mobile>/src/assets/images/
 * Point at a checkout with BEANSTACK_MOBILE (default ~/code/beanstack_mobile). Only re-syncing
 * needs it — the copied assets and the generated map are committed.
 *
 *   node scripts/sync-mobile-images.js [--check]
 *
 * --check verifies the committed output is current without writing.
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  readdirSync,
  statSync,
  rmSync,
} from 'fs'
import { resolve, join, dirname, relative } from 'path'
import { homedir } from 'os'

const ROOT = resolve(import.meta.dirname, '..')
const MOBILE = process.env.BEANSTACK_MOBILE || join(homedir(), 'code', 'beanstack_mobile')
const REGISTRY = join(MOBILE, 'src', 'assets', 'themes', 'images.ts')
// A SECOND registry, easy to miss: bennyReactions.ts declares Benny's five faces with ESM
// `import` rather than `require()`, so a parser that only knows the require shape drops them.
const BENNY_REGISTRY = join(MOBILE, 'src', 'assets', 'themes', 'bennyReactions.ts')
const SRC_IMAGES = join(MOBILE, 'src', 'assets', 'images')
const OUT_DIR = join(ROOT, 'public', 'mobile', 'images')
const OUT_MAP = join(ROOT, 'mobile', 'images.generated.js')
// The 13 real SVGs are a separate story from the PNGs: they ship as React components (via
// react-native-svg-transformer) and already draw with fill="currentColor", so they can be
// generated as components here rather than served as files.
const SVG_DIR = join(MOBILE, 'src', 'assets', 'svg')
const SVG_INDEX = join(SVG_DIR, 'index.ts')
const OUT_SVG = join(ROOT, 'mobile', 'svg.generated.jsx')

const isCheck = process.argv.includes('--check')

if (!existsSync(REGISTRY)) {
  console.error(`\n[x] Cannot read ${REGISTRY}`)
  console.error(`    Set BEANSTACK_MOBILE to a checkout of zoobean/beanstack_mobile.`)
  console.error(`    Only re-syncing needs it — the assets and map are committed.\n`)
  process.exit(1)
}

// ── parse the registry ─────────────────────────────────────────────────────
// Entries look like:  key: require('../images/settings_gear_icon.png'),
// plus a handful of standalone exports (emptyChallengeImage) that use the same require shape.
const src = readFileSync(REGISTRY, 'utf8')
const entries = new Map()
for (const m of src.matchAll(
  /([A-Za-z_][A-Za-z0-9_]*)\s*:\s*require\(\s*'\.\.\/images\/([^']+)'\s*\)/g,
)) {
  entries.set(m[1], m[2])
}
for (const m of src.matchAll(
  /export const ([A-Za-z_][A-Za-z0-9_]*)[^=]*=\s*require\(\s*'\.\.\/images\/([^']+)'\s*\)/g,
)) {
  entries.set(m[1], m[2])
}

if (entries.size === 0) {
  console.error('[x] Parsed zero entries from images.ts -- the registry shape must have changed.')
  process.exit(1)
}

// bennyReactions.ts: `import happy from '../images/bookTalks/benny/happy.png'` then an object
// literal keyed by those local names. The import name IS the key.
const benny = new Map()
if (existsSync(BENNY_REGISTRY)) {
  const bsrc = readFileSync(BENNY_REGISTRY, 'utf8')
  for (const m of bsrc.matchAll(
    /import\s+([A-Za-z_][A-Za-z0-9_]*)\s+from\s+'\.\.\/images\/([^']+)'/g,
  )) {
    benny.set(m[1], m[2])
    entries.set(m[1], m[2])
  }
}

// A THIRD pattern: a component importing a PNG straight from assets/images, bypassing both
// registries (MotivatorSurveyCard does this). Sweep the whole tree rather than name the files,
// so a new one is picked up instead of silently landing in the orphan list.
const SRC = join(MOBILE, 'src')
function sweepImports(dir) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '__snapshots__') continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      sweepImports(full)
      continue
    }
    if (!/\.(tsx?|jsx?)$/.test(name) || /\.test\./.test(name)) continue
    const text = readFileSync(full, 'utf8')
    for (const m of text.matchAll(
      /import\s+([A-Za-z_][A-Za-z0-9_]*)\s+from\s+'[^']*images\/([^']+\.(?:png|jpe?g|gif))'/g,
    )) {
      if (!entries.has(m[1])) entries.set(m[1], m[2])
    }
  }
}
if (existsSync(SRC)) sweepImports(SRC)

// ── copy the referenced files ──────────────────────────────────────────────
const missing = []
const copied = []
let bytes = 0

if (!isCheck) {
  // Start clean so a removed asset does not linger in the committed output.
  if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true })
}

for (const [key, rel] of [...entries].sort((a, b) => a[0].localeCompare(b[0]))) {
  const from = join(SRC_IMAGES, rel)
  if (!existsSync(from)) {
    missing.push(`${key} -> ${rel}`)
    continue
  }
  bytes += statSync(from).size
  copied.push([key, rel])
  if (!isCheck) {
    const to = join(OUT_DIR, rel)
    mkdirSync(dirname(to), { recursive: true })
    copyFileSync(from, to)
  }
}

// ── report anything the registry never names ───────────────────────────────
const referenced = new Set(copied.map(([, rel]) => rel))
const walk = (dir, acc = []) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, acc)
    else acc.push(relative(SRC_IMAGES, p))
  }
  return acc
}
const orphans = walk(SRC_IMAGES).filter((f) => !referenced.has(f) && /\.(png|jpe?g|gif)$/i.test(f))

// ── generate the key map ───────────────────────────────────────────────────
const out = `/* ----------------------------------------------------------------------------
 * GENERATED FILE -- do not edit by hand.
 *
 * Source: zoobean/beanstack_mobile src/assets/themes/images.ts
 * Regenerate: pnpm mobile:images  (needs a mobile checkout; see scripts/sync-mobile-images.js)
 *
 * The app has no icon font and only 13 SVGs -- its icon system IS this registry of raster PNGs,
 * addressed by string key. Components there type the prop as \`source?: keyof typeof images\`, so
 * the same key works here: <Img name="settings_gear_icon" />.
 *
 * Paths go through import.meta.env.BASE_URL so they survive the deployed base path.
 * ------------------------------------------------------------------------- */

const BASE = \`\${import.meta.env.BASE_URL}mobile/images/\`

/** Registry key -> served URL. ${copied.length} assets. */
export const IMAGES = {
${copied.map(([key, rel]) => `  ${key}: BASE + '${rel}',`).join('\n')}
}

/** Every key in the registry, for a gallery or a lookup guard. */
export const IMAGE_NAMES = Object.keys(IMAGES)

/**
 * Benny's reaction faces -- a separate registry in the app (assets/themes/bennyReactions.ts),
 * keyed by mood and used by the Book Talks chat.
 */
export const BENNY_REACTIONS = {
${[...benny.keys()]
  .sort()
  .map((k) => `  ${k}: IMAGES.${k},`)
  .join('\n')}
}
`

// ── SVG components ─────────────────────────────────────────────────────────
// The app's own index.ts decides the component names, so read them from there rather than
// inventing a naming scheme that would drift from the source.
const svgAttrMap = {
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-opacity': 'strokeOpacity',
  'fill-opacity': 'fillOpacity',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  gradientUnits: 'gradientUnits',
  'xlink:href': 'xlinkHref',
}

function toJsxAttrs(markup) {
  let out = markup
  for (const [from, to] of Object.entries(svgAttrMap)) {
    out = out.replaceAll(new RegExp(`\\b${from.replace(':', '\\:')}=`, 'g'), `${to}=`)
  }
  // JSX has no xmlns:xlink and self-closing tags must be explicit; the source already
  // self-closes, so only the namespace declarations need dropping.
  return out.replace(/\s+xmlns(:xlink)?="[^"]*"/g, '')
}

const svgComponents = []
if (existsSync(SVG_INDEX)) {
  const idx = readFileSync(SVG_INDEX, 'utf8')
  for (const m of idx.matchAll(/export \{ default as ([A-Za-z0-9_]+) \} from '\.\/([^']+)'/g)) {
    const [, componentName, file] = m
    const svgPath = join(SVG_DIR, file)
    if (!existsSync(svgPath)) continue
    const raw = readFileSync(svgPath, 'utf8').trim()
    const open = raw.match(/<svg([^>]*)>/)
    if (!open) continue
    const viewBox = (open[1].match(/viewBox="([^"]+)"/) || [])[1] || '0 0 24 24'
    const w = (open[1].match(/\bwidth="([^"]+)"/) || [])[1] || '24'
    const h = (open[1].match(/\bheight="([^"]+)"/) || [])[1] || '24'
    const inner = raw.slice(raw.indexOf('>', raw.indexOf('<svg')) + 1, raw.lastIndexOf('</svg>'))
    svgComponents.push({ componentName, file, viewBox, w, h, inner: toJsxAttrs(inner).trim() })
  }
}

const svgOut = `/* ----------------------------------------------------------------------------
 * GENERATED FILE -- do not edit by hand.
 *
 * Source: zoobean/beanstack_mobile src/assets/svg/ (names from its own index.ts)
 * Regenerate: pnpm mobile:images
 *
 * The app has only ${svgComponents.length} real SVGs; everything else in its icon system is a PNG.
 * These already draw with fill="currentColor", so \`color\` sets the fill exactly as the
 * react-native-svg version's \`color\` prop does.
 * ------------------------------------------------------------------------- */

${svgComponents
  .map(
    (
      c,
    ) => `export function ${c.componentName}({ width = ${c.w}, height = ${c.h}, color = 'currentColor', ...rest }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="${c.viewBox}"
      fill="none"
      style={{ color }}
      aria-hidden="true"
      {...rest}
    >
      ${c.inner.split('\n').join('\n      ')}
    </svg>
  )
}`,
  )
  .join('\n\n')}
`

const prevSvg = existsSync(OUT_SVG) ? readFileSync(OUT_SVG, 'utf8') : null

const prev = existsSync(OUT_MAP) ? readFileSync(OUT_MAP, 'utf8') : null

if (isCheck) {
  if (prev !== out || prevSvg !== svgOut) {
    console.error('[x] mobile image output is stale -- run `pnpm mobile:images`.')
    process.exit(1)
  }
  console.log(
    `[ok] mobile images are up to date (${copied.length} assets, ${svgComponents.length} svg).`,
  )
  process.exit(0)
}

writeFileSync(OUT_MAP, out)
writeFileSync(OUT_SVG, svgOut)

const mb = (bytes / 1024 / 1024).toFixed(1)
console.log(`[ok] ${copied.length} assets -> public/mobile/images/ (${mb} MB)`)
console.log(`[ok] mobile/images.generated.js -- ${copied.length} keys`)
console.log(`[ok] mobile/svg.generated.jsx -- ${svgComponents.length} components`)
if (missing.length) {
  console.log(`\n[!] ${missing.length} registry entries point at a file that does not exist:`)
  for (const m of missing) console.log(`      ${m}`)
}
if (orphans.length) {
  console.log(`\n[i] ${orphans.length} image files the registry never names (not copied):`)
  for (const o of orphans.slice(0, 12)) console.log(`      ${o}`)
  if (orphans.length > 12) console.log(`      ... and ${orphans.length - 12} more`)
}
