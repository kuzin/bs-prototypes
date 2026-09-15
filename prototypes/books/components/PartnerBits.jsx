import { Icon } from '@components/Icon/Icon'
import { PARTNER_BRANDS, PartnerMark as BrandMark } from '@components/PartnerBrand/PartnerBrand'
import '@components/PartnerBrand/PartnerBrand.css'
import { PARTNERS } from '../data'

// ── Brand lockups ────────────────────────────────────────────────────────────
// Comics Plus uses the real brand assets in /public/comicsplus. Scholastic and
// Sora are tasteful wordmark approximations (partner logos may be inline).

function ComicsPlusBrand() {
  return (
    <span className="bk-brand bk-brand--cp">
      <img src={PARTNERS.comicsplus.mark} alt="" className="bk-brand-cp-mark" />
      <img src={PARTNERS.comicsplus.wordmark} alt="Comics Plus" className="bk-brand-cp-word" />
    </span>
  )
}

function ScholasticBrand() {
  return (
    <span className="bk-brand bk-brand--scholastic" aria-label="Scholastic">
      <span className="bk-brand-sun" aria-hidden="true">
        <Icon name="sparkles" size={15} />
      </span>
      <span className="bk-brand-word">Scholastic</span>
    </span>
  )
}

function SoraBrand() {
  return (
    <span className="bk-brand bk-brand--sora" aria-label="Sora">
      <span className="bk-brand-sora-mark" aria-hidden="true" />
      <span className="bk-brand-word">sora</span>
    </span>
  )
}

export function PartnerBrand({ id }) {
  if (id === 'comicsplus') return <ComicsPlusBrand />
  if (id === 'scholastic') return <ScholasticBrand />
  if (id === 'sora') return <SoraBrand />
  return null
}

// Per-partner glyph so each mark is distinct (Scholastic/Sora both start with "S").
const PARTNER_GLYPH = {
  scholastic: 'news',
  sora: 'device-tablet',
  libby: 'headphones',
  library: 'building-community',
}

// A square brand mark. The shared registry carries the real art for the
// partners that have it — Comics Plus's bubble, Scholastic's S, Sora's own mark
// — so those come from there rather than from a glyph standing in for them; the
// two it doesn't know (Libby, the school library) keep the coloured badge.
// Used at the corner of covers, in "where to read", and in the settings list.
export function PartnerMark({ id, size = 22 }) {
  if (PARTNER_BRANDS[id]) return <BrandMark id={id} size={size} />
  const p = PARTNERS[id]
  if (!p) return null
  return (
    <span
      className="bk-pmark bk-pmark--glyph"
      title={p.name}
      style={{ width: size, height: size, background: p.accent }}
    >
      <Icon name={PARTNER_GLYPH[id] || 'book'} size={Math.round(size * 0.52)} color="#fff" />
    </span>
  )
}

// Inline availability tag, e.g. "Read now · Comics Plus".
export function PartnerTag({ partner, action, format }) {
  const p = PARTNERS[partner]
  if (!p) return null
  const icon =
    partner === 'comicsplus'
      ? 'bolt'
      : partner === 'sora'
        ? 'device-tablet'
        : partner === 'library'
          ? 'building-community'
          : 'list'
  return (
    <span className="bk-ptag" style={{ '--p': p.accent, '--p-soft': p.soft }}>
      <Icon name={format === 'audiobook' ? 'headphones' : icon} size={13} />
      <span>
        {action || p.kind} · {p.name}
      </span>
    </span>
  )
}
