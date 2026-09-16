#!/usr/bin/env node
/**
 * Generate `mobile/tokens.generated.css` from the React Native app's theme source.
 *
 * The mobile prototypes are a *visual* mirror of `zoobean/beanstack_mobile` — we do not run its
 * code. What has to stay exact is the vocabulary: a design handed to mobile engineering is only
 * mechanical to build if "that pill is `brandColors.purpleLight`, the title is
 * `fontStyles.sectionTitle`" names something real. So colors and the type ladder — the two things
 * that ARE declared data in the RN source — are generated here and committed, and everything else
 * (spacing, radii, shadows) is hand-authored in `mobile/base.css` because it was never centralised
 * in the app to generate from: `spacing.js` holds four values, and the real system lives as
 * literals across ~240 style files.
 *
 * Source of truth: <mobile>/src/assets/themes/{brandColors.js,colors.ts,fontStyles.tsx}
 * Point at a checkout with BEANSTACK_MOBILE (default ~/code/beanstack_mobile). The checkout is
 * only needed to RE-SYNC — the generated CSS is committed, so dev, CI and the build never need it.
 *
 * The source is parsed as text, not imported: fontStyles.tsx calls StyleSheet.create and imports
 * from 'react-native', so it cannot be required from Node.
 *
 *   node scripts/sync-mobile-tokens.js [--check]
 *
 * --check exits non-zero if the committed output is stale, without writing.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, join } from 'path'
import { homedir } from 'os'

const ROOT = resolve(import.meta.dirname, '..')
const MOBILE = process.env.BEANSTACK_MOBILE || join(homedir(), 'code', 'beanstack_mobile')
const THEMES = join(MOBILE, 'src', 'assets', 'themes')
const OUT = join(ROOT, 'mobile', 'tokens.generated.css')

// The app renders in the platform system face — it ships no custom font at all (no fontFamily
// anywhere, no .ttf/.otf, no UIAppFonts). Nine of the ~30 type roles fork on Platform.OS; we
// resolve every fork to the iOS branch, which reads as the design intent (Android is the
// fallback, e.g. weight 'bold' where iOS asks for '800').
const PLATFORM = 'ios'

// -- helpers ---------------------------------------------------------------

const kebab = (s) =>
  s
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .toLowerCase()

/** `Platform.OS === 'ios' ? A : B` -> A (or B when the test names android). */
function resolvePlatform(expr) {
  const m = expr.match(/Platform\.OS\s*===?\s*'(ios|android)'\s*\?\s*(.+?)\s*:\s*(.+)$/s)
  if (!m) return expr.trim()
  const [, tested, whenTrue, whenFalse] = m
  return (tested === PLATFORM ? whenTrue : whenFalse).trim()
}

/** RN fontWeight is a string; 'bold' is 700 and 'normal' 400. */
const cssWeight = (v) => {
  const raw = v.replace(/['"]/g, '').trim()
  if (raw === 'bold') return '700'
  if (raw === 'normal') return '400'
  return raw
}

function read(file) {
  const path = join(THEMES, file)
  if (!existsSync(path)) {
    console.error(`\n[x] Cannot read ${path}`)
    console.error(`    Set BEANSTACK_MOBILE to a checkout of zoobean/beanstack_mobile.`)
    console.error(`    The checkout is only needed to re-sync -- the generated CSS is committed.\n`)
    process.exit(1)
  }
  return readFileSync(path, 'utf8')
}

// -- colors ----------------------------------------------------------------

/** Pull `key: '#hex' | 'white' | 'transparent'` pairs out of a palette object literal. */
function parsePalette(src) {
  const out = new Map()
  for (const m of src.matchAll(/^\s{2}([A-Za-z][A-Za-z0-9]*)\s*:\s*'([^']+)'\s*,?\s*$/gm)) {
    out.set(m[1], m[2])
  }
  return out
}

/** CSS-normalise a value so two spellings of the same colour compare equal. */
const normalise = (v) => {
  const s = v.trim().toLowerCase()
  if (s === 'black') return '#000000'
  if (s === 'white') return '#ffffff'
  if (/^#[0-9a-f]{3}$/.test(s)) return `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`
  return s
}

const brandColors = parsePalette(read('brandColors.js'))
const colors = parsePalette(read('colors.ts'))

// brandColors is the real design system (hue ramps + a grey ladder). colors.ts is an older
// paint-chip palette that re-spells many of the same hexes under different names
// (colors.secondary === greyDark2 === #424242). Emitting both token-for-token would reproduce the
// mess, so colors.ts entries that duplicate a brandColors hex become aliases pointing at the
// brand token, which keeps them resolvable without minting a second name for one colour.
const byHex = new Map()
for (const [name, value] of brandColors) {
  const key = normalise(value)
  if (!byHex.has(key)) byHex.set(key, name)
}

const brandLines = []
for (const [name, value] of brandColors) {
  brandLines.push(`  --m-${kebab(name)}: ${normalise(value)};`)
}

const legacyLines = []
const aliasLines = []
for (const [name, value] of colors) {
  const hex = normalise(value)
  const brand = byHex.get(hex)
  if (brand) {
    if (kebab(name) !== kebab(brand)) {
      aliasLines.push(`  --m-c-${kebab(name)}: var(--m-${kebab(brand)});`)
    }
  } else {
    legacyLines.push(`  --m-c-${kebab(name)}: ${hex};`)
  }
}

// -- type ladder -----------------------------------------------------------

const fontSrc = read('fontStyles.tsx')
const body = fontSrc.slice(fontSrc.indexOf('StyleSheet.create('))

/** Resolve `brandColors.greyDark1` / `colors.mineBlack` to the custom property they became. */
function colorRef(expr) {
  const m = expr.match(/(brandColors|colors)\.([A-Za-z0-9]+)/)
  if (!m) return normalise(expr.replace(/['"]/g, ''))
  const [, palette, name] = m
  if (palette === 'brandColors') return `var(--m-${kebab(name)})`
  // A colors.ts name that deduped into a brand token resolves straight to it.
  const hex = colors.get(name)
  const brand = hex && byHex.get(normalise(hex))
  return brand ? `var(--m-${kebab(brand)})` : `var(--m-c-${kebab(name)})`
}

const roles = []
for (const block of body.matchAll(/^ {2}([A-Za-z][A-Za-z0-9]*)\s*:\s*\{([^}]*)\}/gm)) {
  const [, name, inner] = block
  const decls = []
  for (const line of inner.split('\n')) {
    const m = line.match(/^\s*([A-Za-z]+)\s*:\s*(.+?),?\s*$/)
    if (!m) continue
    const prop = m[1]
    const value = resolvePlatform(m[2].replace(/,$/, ''))
    if (prop === 'fontSize') decls.push(`font-size: ${value}px;`)
    else if (prop === 'fontWeight') decls.push(`font-weight: ${cssWeight(value)};`)
    else if (prop === 'lineHeight') decls.push(`line-height: ${value}px;`)
    // RN letterSpacing is absolute points, not em.
    else if (prop === 'letterSpacing') decls.push(`letter-spacing: ${value}px;`)
    else if (prop === 'color') decls.push(`color: ${colorRef(value)};`)
    else if (prop === 'textAlign') decls.push(`text-align: ${value.replace(/['"]/g, '')};`)
  }
  if (decls.length) roles.push({ name, decls })
}

// `headerBarTitleStyle` -> `.m-t-header-bar-title`: the `Style` suffix is noise on a class name.
const roleClass = (name) => `m-t-${kebab(name.replace(/Style$/, ''))}`

// -- emit ------------------------------------------------------------------

const banner = `/* ----------------------------------------------------------------------------
 * GENERATED FILE -- do not edit by hand.
 *
 * Source: zoobean/beanstack_mobile src/assets/themes/
 *   brandColors.js - colors.ts - fontStyles.tsx
 * Regenerate: pnpm mobile:tokens   (needs a mobile checkout; see scripts/sync-mobile-tokens.js)
 *
 * Platform forks are resolved to ${PLATFORM.toUpperCase()}. The app ships no custom font, so the
 * family is the platform system face -- set once on .m-app in mobile/base.css, not here.
 *
 * Spacing, radii and shadows are NOT generated: they were never centralised in the app.
 * They are hand-authored in mobile/base.css from the real usage histogram.
 * ------------------------------------------------------------------------- */

`

const out = [
  banner,
  '.m-app {',
  '  /* brandColors.js -- the real design system: hue ramps + the grey ladder. */',
  ...brandLines,
  '',
  '  /* colors.ts -- only the entries that do NOT duplicate a brandColors hex. */',
  ...legacyLines,
  '',
  '  /* colors.ts names that ARE a brandColors hex under another spelling. */',
  ...aliasLines,
  '}',
  '',
  '/* -- Type ladder -- fontStyles.tsx, one class per role ------------------- */',
  '',
  ...roles.map((r) => `.${roleClass(r.name)} {\n${r.decls.map((d) => `  ${d}`).join('\n')}\n}`),
  '',
].join('\n')

const prev = existsSync(OUT) ? readFileSync(OUT, 'utf8') : null

if (process.argv.includes('--check')) {
  if (prev !== out) {
    console.error('[x] mobile/tokens.generated.css is stale -- run `pnpm mobile:tokens`.')
    process.exit(1)
  }
  console.log('[ok] mobile/tokens.generated.css is up to date.')
  process.exit(0)
}

writeFileSync(OUT, out)
console.log(
  `[ok] mobile/tokens.generated.css -- ${brandLines.length} brand colors, ` +
    `${legacyLines.length} legacy, ${aliasLines.length} aliases, ${roles.length} type roles` +
    (prev === out ? ' (unchanged)' : ''),
)
