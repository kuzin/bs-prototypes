import { Img, ProfileRow } from '@mobile/components'
import './SwitchReadersSheet.css'

/**
 * `modals/profilesModalsComponents/profilesModal/ProfilesModal.tsx` — what the header avatar
 * opens.
 *
 * It is a reader SWITCHER, not a link to a profile page: an account holds several readers, and
 * this is how one of them takes over the app. The current reader is pinned to the top
 * (`setFirstProfileByCurrent`) with a check beside them, and every other row switches.
 *
 * Anatomy from the source: a sheet pinned to the bottom at 17pt top radius over a 50% black
 * backdrop, capped at 55% of the device; a 66pt head with a hairline under it, "Switch Readers"
 * centred at 17/bold/-0.4 and Cancel absolutely placed at `left: 20` in the tenant's colour.
 *
 * `isSingleReader` is the app's own fork and it is not a no-op: with one reader there is no check
 * mark and no rule under the row, because there is nothing to switch between — the sheet is then
 * only a way to edit yourself.
 */
export function SwitchReadersSheet({ open, profiles, currentId, onSelect, onEdit, onClose }) {
  if (!open) return null

  const current = profiles.find((p) => p.id === currentId)
  const others = profiles.filter((p) => p.id !== currentId)
  const isSingleReader = profiles.length === 1

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

        <div className="m-swr-list">
          {current && (
            <div className={`m-swr-current${isSingleReader ? ' is-only' : ''}`}>
              <ProfileRow
                name={current.name}
                imgURL={current.imgURL}
                size="large"
                showName
                onPress={() => onEdit?.(current)}
              />
              {!isSingleReader && (
                <span className="m-swr-check" aria-label="Current reader">
                  <Img name="check_mark_switch_reader" size={20} />
                </span>
              )}
            </div>
          )}

          {others.map((profile) => (
            <button
              key={profile.id}
              type="button"
              className="m-swr-row"
              onClick={() => {
                onSelect?.(profile.id)
                onClose?.()
              }}
            >
              <ProfileRow name={profile.name} imgURL={profile.imgURL} size="medium" showName />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
