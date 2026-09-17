import { Img } from '@mobile/components'
import './SwitchReadersSheet.css'

const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

/**
 * `modals/profilesModalsComponents/profilesModal/ProfilesModal.tsx` — what the header avatar
 * opens.
 *
 * It is a reader SWITCHER, not a link to a profile page: an account holds several readers, and
 * this is how one of them takes over the app. It is also a RADIO LIST — every row carries a 26pt
 * circle on its right, filled green with a check for the reader you are, empty with a hairline
 * ring for the ones you are not. Without the empty rings the list reads as a menu and gives no
 * sense that picking one replaces the other.
 *
 * Sheet: pinned to the bottom at 17pt top corners over a 50% black backdrop, capped at 55% of the
 * device. A 66pt head with a hairline under it, "Switch Readers" centred at 17/bold/-0.4 and
 * Cancel absolutely placed at `left: 20` — positioned rather than laid out, so the title centres
 * on the sheet rather than on the space beside it.
 *
 * DIVERGENCE — one row, one size. The app gives the current reader a taller row (100 against 70),
 * a larger avatar (64 against 45) and an edit badge that opens `editProfileAvatar`. Three
 * differences to say "this is you", where the green check already says it — and the odd row out
 * read as a header for the list rather than a member of it. Editing an avatar belongs on the
 * screen that edits a reader, not on the control that switches between them.
 *
 * `setFirstProfileByCurrent` still pins the current reader to the top, which is the app's own
 * ordering and the reason the list never reshuffles under a tap.
 */
export function SwitchReadersSheet({ open, profiles, currentId, onSelect, onClose }) {
  if (!open) return null

  const current = profiles.find((p) => p.id === currentId)
  const ordered = current ? [current, ...profiles.filter((p) => p.id !== currentId)] : profiles

  return (
    <div className="m-swr">
      <button type="button" className="m-swr-backdrop" onClick={onClose} aria-label="Close" />

      <div className="m-swr-sheet" role="dialog" aria-label="Switch Readers">
        <div className="m-swr-head">
          <button type="button" className="m-swr-cancel" onClick={onClose}>
            Cancel
          </button>
          <span className="m-swr-title">Switch Readers</span>
        </div>

        <div className="m-swr-list" role="radiogroup" aria-label="Readers">
          {ordered.map((profile, i) => {
            const isCurrent = profile.id === currentId

            return (
              <button
                key={profile.id}
                type="button"
                role="radio"
                aria-checked={isCurrent}
                className={`m-swr-row${i === ordered.length - 1 ? ' is-last' : ''}`}
                onClick={() => {
                  if (!isCurrent) onSelect?.(profile.id)
                  onClose?.()
                }}
              >
                <span className="m-swr-avatar">
                  {profile.imgURL ? <img src={profile.imgURL} alt="" /> : initialsOf(profile.name)}
                </span>
                <span className="m-swr-name">{profile.name}</span>
                <span className={`m-swr-mark${isCurrent ? ' is-on' : ''}`} aria-hidden="true">
                  {isCurrent && <Img name="check_mark_switch_reader" className="m-swr-check" />}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
