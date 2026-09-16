import { Img } from '../Img/Img'
import './FilterBar.css'

/**
 * `components/readingMotivation/components/readingMotivationFilter/ReadingMotivationFilter.tsx` —
 * a full-bleed bar naming the current selection, which opens a `SelectSheet` to change it.
 *
 * Generalised out of Reading Motivation because the Reviews tab wants the same thing: one value
 * chosen from a short list. A `ToggleTabs` was tried there first and four options do not fit it —
 * the pill is built for two, and at four each label has about 80pt, which is how you end up
 * abbreviating "Rejected".
 *
 * Two divergences from the source, both in its own file's comments as well:
 *   - `justify-content: space-between`, so the chevron goes to the far edge. The source leaves
 *     the label and its glyph huddled at the left with ~200pt of dead bar beside them, which
 *     makes the strip look decorative rather than tappable.
 *   - `down_chevron` in place of `filterArrow`. That asset is a solid triangle from
 *     `challengesIcons`, where it marks a FILTER; this picks a value, and everything else in the
 *     app that picks from a list uses the chevron.
 */
export function FilterBar({ label, onPress, className = '' }) {
  return (
    <button type="button" className={`m-filterbar ${className}`} onClick={onPress}>
      <span className="m-filterbar-label">{label}</span>
      <Img name="down_chevron" size={20} tint="var(--m-grey-dark-2)" />
    </button>
  )
}
