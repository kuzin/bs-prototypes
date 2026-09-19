import { FramePortal } from '../FramePortal/FramePortal'
import { Img } from '../Img/Img'
import './ActionsModal.css'

/**
 * `components/ActionsModal.jsx` — the bottom action sheet behind every “…” in the app.
 *
 * It has eight-plus consumers (`TitleOptionsModal`, `ReviewOptionsModal`, the challenge
 * `OptionsModal`, `AdditionalLoggingOptionsModal`, `CoverImageModal`, `EditReaderModal`,
 * `RemoveFriendModal`, `AddFriendsModal`, `DateRangeModal`), which is why it is a shared component
 * here rather than something each screen draws for itself.
 *
 * Anatomy, all from the source:
 *   - a 17pt top-corner radius, pinned to the bottom, white
 *   - a 60pt head with a hairline rule under it: “Cancel” absolutely placed at `left: 20` in the
 *     tenant's primaryColor, and the title CENTRED in `titleHeavy`. The Cancel is positioned
 *     rather than laid out, so the title centres on the SHEET, not on the space beside it
 *   - rows 56pt tall at `marginLeft: 22`, a 20pt icon at radius 2 with 20pt to its right, and a
 *     16/500 label at `letterSpacing: -0.29`
 *   - hairline separators BETWEEN rows only (`ItemSeparatorComponent`), never top or bottom
 *   - `paddingBottom: Math.max(insets.bottom, 16)` — the floor is what keeps the last row clear of
 *     the home indicator on a device that reports no inset
 *
 * A row's pressed state is a `TouchableHighlight` underlay, not an opacity fade: `formGrayBackground`
 * by default, and a destructive row overrides it to `mistyRose` alongside its `mediumCarmine` text.
 *
 * Dismissal is the backdrop (a `TouchableWithoutFeedback` over everything above the sheet) or
 * Cancel. There is no drag-to-dismiss.
 */
/**
 * `DateRangeListItem` — the row the sheet uses when it is CHOOSING rather than DOING.
 *
 * A 26pt control on the right: a filled green disc with a tick when active, and otherwise a 2pt
 * gainsboro ring. It is a radio, and it reads as one, which is the point — the same sheet
 * chrome carries both a menu of actions and a list of values, and this is the only thing that
 * tells them apart.
 */
function SelectMark({ active }) {
  if (!active) return <span className="m-am-mark" aria-hidden="true" />
  return (
    <span className="m-am-mark is-active" aria-hidden="true">
      <Img name="check_mark_switch_reader" className="m-am-mark-tick" />
    </span>
  )
}

/**
 * @param {boolean} selectable  `isDateRangeItem` — rows become radios and carry no icon. The
 *                              app's two callers are the leaderboard's Date Range and the
 *                              challenge list's View Options.
 */
export function ActionsModal({ open, title = '', options = [], selectable = false, onClose }) {
  if (!open) return null

  /* Portals to the frame root, the way RN's `Modal` does — see FramePortal. Rendering in
     place leaves the sheet inside whatever stacking context its caller happens to sit in. */
  return (
    <FramePortal>
      <div className="m-am">
        {/* The backdrop is its own press target above the sheet — `animationIn="slideInUp"` on the
            sheet, and the StatusBar goes light-content over `black.fade(0.305)`. */}
        <button type="button" className="m-am-backdrop" onClick={onClose} aria-label="Close menu" />

        <div className="m-am-sheet" role="dialog" aria-label={`${title} Modal`}>
          <div className="m-am-head">
            <button type="button" className="m-am-cancel" onClick={onClose}>
              Cancel
            </button>
            <span className="m-t-title-heavy m-am-title">{title}</span>
          </div>

          <ul className={`m-am-list${selectable ? ' is-selectable' : ''}`}>
            {options.map((o) => (
              <li key={o.title}>
                <button
                  type="button"
                  className={`m-am-row${o.destructive ? ' is-destructive' : ''}`}
                  onClick={() => {
                    onClose?.()
                    o.onPress?.()
                  }}
                >
                  {!selectable && o.source && (
                    <Img name={o.source} size={20} className="m-am-icon" />
                  )}
                  <span className="m-am-label">{o.title}</span>
                  {selectable && <SelectMark active={o.isActive} />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FramePortal>
  )
}
