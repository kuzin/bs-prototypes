import { Icon } from '@components/Icon/Icon'
import '@components/PartnerBrand/PartnerBrand.css'

/**
 * Reading-partner brand identity — the registry plus the two ways a partner
 * shows up inside Beanstack UI:
 *
 *   <PartnerBrand id="comicsplus" />          // full lockup (mark + wordmark)
 *   <PartnerMark id="comicsplus" size={26} /> // square app mark
 *
 * Comics Plus renders its real brand assets from `/public/comicsplus`; the
 * others are tasteful wordmark approximations (partner logos are often
 * delivered inline, so approximating keeps the prototype self-contained).
 */
export const PARTNER_BRANDS = {
  comicsplus: {
    id: 'comicsplus',
    name: 'Comics Plus',
    accent: '#0DA7BC',
    soft: '#E6F7FA',
    mark: '/bs-prototypes/comicsplus/Mark.svg',
    wordmark: '/bs-prototypes/comicsplus/Wordmark.svg',
  },
  scholastic: {
    id: 'scholastic',
    name: 'Scholastic',
    accent: '#E6000D',
    soft: '#FDECEC',
    // Real wordmark (Wikimedia Commons); Mark.svg crops its "S" to a square.
    mark: '/bs-prototypes/scholastic/Mark.svg',
    wordmark: '/bs-prototypes/scholastic/Wordmark.svg',
    // The wordmark is white-on-red, so it needs no plate on dark chrome.
    solidWordmark: true,
  },
  sora: {
    id: 'sora',
    name: 'Sora',
    accent: '#2C6BED',
    soft: '#EAF0FE',
    glyph: 'device-tablet',
  },
}

/**
 * Full brand lockup. `size`: sm | md | lg. `invert` for dark backgrounds.
 * `wordmarkOnly` drops the leading app mark (how partner logos appear in
 * Beanstack's own App Integrations list).
 */
export function PartnerBrand({ id, size = 'md', invert = false, wordmarkOnly = false }) {
  const p = PARTNER_BRANDS[id]
  if (!p) return null

  // A wordmark that carries its own solid plate (Scholastic's white-on-red bar)
  // needs neither a separate mark nor a backing plate on dark chrome. A dark-ink
  // wordmark (Comics Plus) gets a white plate instead of being recolored — which
  // is how Comics Plus present it themselves.
  const plate = invert && !p.solidWordmark
  const showMark = Boolean(p.mark) && !wordmarkOnly && !p.solidWordmark && !invert
  const cls = `pb-brand pb-brand--${size}${plate ? ' pb-brand--plate' : ''}`

  if (p.wordmark) {
    return (
      <span className={`${cls} pb-brand--asset`} aria-label={p.name}>
        {showMark && <img src={p.mark} alt="" className="pb-brand-mark" />}
        <img src={p.wordmark} alt={p.name} className="pb-brand-word" />
      </span>
    )
  }
  return (
    <span className={cls} aria-label={p.name}>
      <span className="pb-brand-glyph" style={{ color: p.accent }} aria-hidden="true">
        <Icon name={p.glyph || 'book'} />
      </span>
      <span className="pb-brand-text" style={{ color: invert ? '#fff' : p.accent }}>
        {p.name}
      </span>
    </span>
  )
}

/** Square app mark — real asset where we have one, else a colored glyph badge. */
export function PartnerMark({ id, size = 22 }) {
  const p = PARTNER_BRANDS[id]
  if (!p) return null
  if (p.mark) {
    return (
      <img src={p.mark} alt={p.name} className="pb-mark" style={{ width: size, height: size }} />
    )
  }
  return (
    <span
      className="pb-mark pb-mark--glyph"
      title={p.name}
      style={{ width: size, height: size, background: p.accent }}
    >
      <Icon name={p.glyph || 'book'} size={Math.round(size * 0.52)} color="#fff" />
    </span>
  )
}
