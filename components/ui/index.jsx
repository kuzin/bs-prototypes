import { Icon } from '@components/Icon/Icon'

export { C, LABEL, GENRE_COLORS, I8_TOKEN, I8_IDS, COVER_PALETTES } from './tokens.js'

// ─── Icon ─────────────────────────────────────────────────────────────────────
// Legacy shim: `ti-*` names now render crisp Tabler glyphs via the shared <Icon>
// registry (no more remote Icons8 PNGs). Stripping the `ti-` prefix yields the
// registry's semantic name. Prefer <Icon name="…"> directly in new code.
export function Ic({ name, size = 16, style = {} }) {
  return <Icon name={name.replace(/^ti-/, '')} size={size} style={style} />
}
