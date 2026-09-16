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
export function ActionsModal({ open, title = '', options = [], onClose }) {
  if (!open) return null

  return (
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

        <ul className="m-am-list">
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
                {o.source && <Img name={o.source} size={20} className="m-am-icon" />}
                <span className="m-am-label">{o.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
