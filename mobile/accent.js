/**
 * The tenant accent, and the states the app derives from it.
 *
 * `state.authentication.primaryColor` is per-microsite, arrives from the API, and is referenced in
 * 221 component files. The app derives every interactive state at runtime with the `color` npm
 * package, so a static CSS palette cannot reproduce it — and `color-mix()` is not a substitute:
 * `Color(c).lightness(90)` SETS HSL lightness to 90, while `color-mix(in srgb, c, white 90%)`
 * interpolates in RGB. They disagree, often badly, for saturated hues.
 *
 * These four functions mirror `color`'s semantics directly rather than adding the dependency —
 * each is a few lines of HSL, and the exactness matters more than the indirection.
 *
 * Call sites in the app this reproduces:
 *   PressableButton   pressed        Color(c).darken(0.15)
 *   PressableButton   activeTab bg   Color(c).lightness(90)   pressed: lightness(66)
 *   PressableButton   activeTab text Color(c).darken(0.3)
 *   SmallButton       pressed        Color(c).mix(black, 0.2)
 *   BadgeDetail       header + band  Color('white').mix(c, 0.2)
 */

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

function toRgb(hex) {
  let h = String(hex).trim().replace(/^#/, '')
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null
  const n = parseInt(h, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

const toHex = ({ r, g, b }) =>
  '#' + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('')

function rgbToHsl({ r, g, b }) {
  const R = r / 255
  const G = g / 255
  const B = b / 255
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: l * 100 }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === R) h = ((G - B) / d + (G < B ? 6 : 0)) / 6
  else if (max === G) h = ((B - R) / d + 2) / 6
  else h = ((R - G) / d + 4) / 6
  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToRgb({ h, s, l }) {
  const H = (((h % 360) + 360) % 360) / 360
  const S = clamp(s, 0, 100) / 100
  const L = clamp(l, 0, 100) / 100
  if (S === 0) return { r: L * 255, g: L * 255, b: L * 255 }
  const q = L < 0.5 ? L * (1 + S) : L + S - L * S
  const p = 2 * L - q
  const channel = (t) => {
    let T = t
    if (T < 0) T += 1
    if (T > 1) T -= 1
    if (T < 1 / 6) return p + (q - p) * 6 * T
    if (T < 1 / 2) return q
    if (T < 2 / 3) return p + (q - p) * (2 / 3 - T) * 6
    return p
  }
  return { r: channel(H + 1 / 3) * 255, g: channel(H) * 255, b: channel(H - 1 / 3) * 255 }
}

/** `Color(c).darken(ratio)` — scales HSL lightness DOWN by a ratio of itself. */
export function darken(hex, ratio) {
  const rgb = toRgb(hex)
  if (!rgb) return hex
  const hsl = rgbToHsl(rgb)
  return toHex(hslToRgb({ ...hsl, l: hsl.l - hsl.l * ratio }))
}

/** `Color(c).lightness(value)` — SETS HSL lightness absolutely. Not a mix. */
export function lightness(hex, value) {
  const rgb = toRgb(hex)
  if (!rgb) return hex
  return toHex(hslToRgb({ ...rgbToHsl(rgb), l: value }))
}

/** `Color(c).mix(other, weight)` — linear RGB interpolation, `weight` toward `other`. */
export function mix(hex, otherHex, weight) {
  const a = toRgb(hex)
  const b = toRgb(otherHex)
  if (!a || !b) return hex
  const w = clamp(weight, 0, 1)
  return toHex({
    r: a.r + (b.r - a.r) * w,
    g: a.g + (b.g - a.g) * w,
    b: a.b + (b.b - a.b) * w,
  })
}

/** brandColors.denim — what the app falls back to when primaryColor is not a usable hex. */
export const DEFAULT_ACCENT = '#196dd5'

/**
 * The custom properties a tenant's colours resolve to. Spread onto any `.m-app` element as inline
 * style; every mobile component reads these rather than a hardcoded colour.
 *
 * A microsite carries TWO colours, and they are not interchangeable: `primaryColor` fills buttons
 * and the FAB, while `ctaColor` draws the top-tab indicator (see navigation/sharedComponents/Tab.tsx,
 * which pulls `ctaColor` specifically). They are often the same value, so `cta` defaults to the
 * primary — but the distinction is real and worth keeping addressable.
 */
export function accentVars(hex, ctaHex) {
  const accent = toRgb(hex) ? hex : DEFAULT_ACCENT
  const cta = toRgb(ctaHex) ? ctaHex : accent
  return {
    '--m-accent': accent,
    '--m-accent-pressed': darken(accent, 0.15),
    '--m-accent-tab-bg': lightness(accent, 90),
    '--m-accent-tab-bg-pressed': lightness(accent, 66),
    '--m-accent-tab-text': darken(accent, 0.3),
    /* BadgeDetail.tsx: `Color('white').mix(Color(primaryColor), 0.2)` — 80% white, so the accent
     * only tints it. One value paints the modal header, the iOS overscroll spacer and the band
     * under the medallion, which is why they read as one surface. */
    '--m-accent-wash': mix('#ffffff', accent, 0.2),
    '--m-accent-ink': '#ffffff',
    '--m-cta': cta,
  }
}

/** The microsite accents worth designing against — real Beanstack tenant colours. */
export const ACCENT_PRESETS = [
  { id: 'denim', name: 'Denim (default)', value: DEFAULT_ACCENT },
  { id: 'teal', name: 'Beanstack teal', value: '#19bfd5' },
  { id: 'green', name: 'Green', value: '#0ba85f' },
  { id: 'orange', name: 'Orange', value: '#f26430' },
  { id: 'purple', name: 'Purple', value: '#b43dd0' },
  { id: 'red', name: 'Red', value: '#e85648' },
]
