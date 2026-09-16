import { Img } from '../Img/Img'
import './SheetHeader.css'

/**
 * The bar at the top of every modal sheet — three slots: dismiss, centre, actions.
 *
 * The app builds this inline in five places and the numbers agree every time, so it is a pattern
 * rather than a coincidence: `BadgeDetail.tsx` and `Achievements.styles.js` both define
 * `MODAL_HEADER_HEIGHT = 60` with `MODAL_HEADER_OVERLAP = -1`, and `AchievementDetailScreen.tsx`
 * repeats the same `headerRowStyle` literal.
 *
 * Four things it fixes by existing:
 *   - the `-1` overlap is easy to drop, and without it the header and band show a seam at some
 *     device scales
 *   - the dismiss glyph is `dropdown_arrow`, NOT a back arrow: a sheet is dismissed downward
 *   - the 15pt inset comes from the GLYPH's own `marginLeft` inside `ImageHeaderButton`, not from
 *     padding on the row, so a row with horizontal padding puts the chevron in the wrong place
 *   - dismiss goes LEFT and actions go RIGHT, every time. Book Talks had them the other way round
 *     — a close button on the right and its action on the left — which is the sort of thing that
 *     only reads as wrong when you see the sheets side by side
 *
 * `center` takes a string (rendered as a title) or a node (Book Talks puts Benny's 56pt face
 * there). The three slots are equal width so the centre lands on the true centre whatever sits
 * either side of it.
 *
 * `onOptions` is the optional `...` — the app has one on the title panel, and Book Talks keeps
 * its "Finish Later" behind it now that the right side is no longer a close button.
 */
export function SheetHeader({
  onClose,
  center,
  onOptions,
  right,
  background,
  label = 'Close',
  glyph = 'dropdown_arrow',
  tint,
  className = '',
}) {
  return (
    <div className={`m-sheethead ${className}`} style={background ? { background } : undefined}>
      <span className="m-sheethead-slot m-sheethead-slot--start">
        <button type="button" className="m-sheethead-btn" onClick={onClose} aria-label={label}>
          <Img name={glyph} size={24} tint={tint} />
        </button>
      </span>

      <span className="m-sheethead-slot m-sheethead-slot--center">
        {typeof center === 'string' ? (
          <span className="m-t-item-title m-sheethead-title">{center}</span>
        ) : (
          center
        )}
      </span>

      <span className="m-sheethead-slot m-sheethead-slot--end">
        {right ??
          (onOptions ? (
            <button
              type="button"
              className="m-sheethead-options"
              onClick={onOptions}
              aria-label="Options"
            >
              <Img name="option_dots" size={24} tint={tint ?? 'var(--m-c-dove-gray)'} />
            </button>
          ) : null)}
      </span>
    </div>
  )
}
