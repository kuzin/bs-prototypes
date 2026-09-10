import { Icon } from '@components/Icon/Icon'
import { Tooltip } from '@components/Primitives/Primitives'
import '@components/Primitives/Primitives.css'
import './TrendChip.css'

/**
 * The one way a trend is drawn: a pastel chip holding an arrow, and nothing
 * else. The figure it stands for lives in the tooltip.
 *
 * A direction, not a second number — wherever a trend appears it sits beside a
 * value that's already the number, and repeating a delta there makes the eye
 * read two figures per line. So the chip says which way it moved, hovering says
 * by how much, and every trend in the system looks identical whether it's a
 * profile stat row, a Lexile delta or a bar-list row.
 *
 * Colours are the app's own tag pairs — a hue's `50` fill under its `500`/`800`
 * text (bs-product `admin/_admin_flagged_entries.scss`): `#cbfce5`/`#017841`
 * good, `#fdd2ce`/`#df3f30` bad.
 *
 *   <TrendChip delta={26} format={(n) => `${n}%`} />
 *   <TrendChip delta={-15} format={(n) => `${n}L`} suffix="vs Apr" />
 *   <TrendChip delta={2} inverse />   // fewer is better (flags, concerns)
 *
 * Renders nothing for a null or zero delta — a flat week isn't a trend.
 *
 * @param {number}   delta     signed change; sign picks the arrow
 * @param {function} format    (magnitude) => string, for the tooltip reading
 * @param {string}   suffix    appended to the reading ("vs Apr")
 * @param {boolean}  inverse   flip which direction counts as good
 */
export function TrendChip({ delta, format, suffix, inverse = false, className = '' }) {
  if (delta == null || delta === 0) return null
  const up = delta > 0
  const good = inverse ? !up : up
  const n = Math.abs(delta)
  const reading = `${format ? format(n) : n}${suffix ? ` ${suffix}` : ''}`
  const label = `${up ? 'Up' : 'Down'} ${reading}`

  return (
    <Tooltip content={label} className={`trend-tip ${className}`.trim()}>
      <span className={`trend-chip trend-chip--${good ? 'good' : 'bad'}`} aria-label={label}>
        <Icon name={up ? 'arrow-up' : 'arrow-down'} size={15} stroke={2.6} />
      </span>
    </Tooltip>
  )
}
