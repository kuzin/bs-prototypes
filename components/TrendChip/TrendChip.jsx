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
 * `showValue` is the exception: it prints the magnitude inside the chip
 * ("3% ↑"), for the places where the trend stands on its own with no value
 * beside it to read it against — a lone cell, a caption, a summary line. Don't
 * reach for it next to a figure; that's the two-numbers-per-line problem the
 * default shape exists to avoid.
 *
 * Colours are the app's own tag pairs — a hue's `50` fill under its `500`/`800`
 * text (bs-product `admin/_admin_flagged_entries.scss`): `#cbfce5`/`#017841`
 * good, `#fdd2ce`/`#df3f30` bad.
 *
 *   <TrendChip delta={26} format={(n) => `${n}%`} />
 *   <TrendChip delta={-15} format={(n) => `${n}L`} suffix="vs Apr" />
 *   <TrendChip delta={2} inverse />   // fewer is better (flags, concerns)
 *
 * A zero delta is flat, not absent: it draws a grey chip holding a dash, so a
 * row that genuinely didn't move still lines up with the rows that did instead
 * of leaving a hole. A null delta is the different case — no reading at all —
 * and renders nothing.
 *
 * @param {number}   delta     signed change; sign picks the arrow
 * @param {function} format    (magnitude) => string, for the tooltip reading
 * @param {string}   suffix    appended to the reading ("vs Apr")
 * @param {boolean}  inverse   flip which direction counts as good
 */
export function TrendChip({
  delta,
  format,
  suffix,
  inverse = false,
  showValue = false,
  className = '',
}) {
  if (delta == null) return null

  const flat = delta === 0
  const up = delta > 0
  const good = inverse ? !up : up
  const tone = flat ? 'flat' : good ? 'good' : 'bad'
  const n = Math.abs(delta)
  const reading = `${format ? format(n) : n}${suffix ? ` ${suffix}` : ''}`
  const label = flat ? `No change${suffix ? ` ${suffix}` : ''}` : `${up ? 'Up' : 'Down'} ${reading}`

  return (
    <Tooltip content={label} className={`trend-tip ${className}`.trim()}>
      <span
        className={`trend-chip trend-chip--${tone}${showValue ? ' trend-chip--with-value' : ''}`}
        aria-label={label}
      >
        {showValue && !flat && <span className="trend-chip-value">{format ? format(n) : n}</span>}
        <Icon name={flat ? 'minus' : up ? 'arrow-up' : 'arrow-down'} size={15} stroke={2.6} />
      </span>
    </Tooltip>
  )
}
