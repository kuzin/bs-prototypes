import './SelectSheet.css'

/**
 * `components/shared/selectSheet/SelectSheet.tsx` — the app's SECOND bottom sheet, and not a
 * variant of the first.
 *
 * `ActionsModal` is a menu: react-native-modal, a titled 60pt head with Cancel, icon rows, and it
 * closes on Cancel or the backdrop. This is a PICKER: `@gorhom/bottom-sheet`, snap points at 25%
 * and 50%, `enablePanDownToClose`, a drag handle instead of a head, and plain text rows with no
 * icons. Reading Motivation's survey filter is its caller — you are choosing which month's index
 * to look at, not choosing an action.
 *
 * Worth keeping them apart: a picker that grows a Cancel button starts to read like a menu, and a
 * menu you can drag starts to read like a picker.
 *
 * NOTE for handoff — the sheet's own chrome (the handle's exact size, the corner radius, the
 * backdrop opacity) is `@gorhom/bottom-sheet`'s default, not anything this app sets. The package
 * is not installed in the reference checkout, so these are drawn to the library's shape and should
 * be confirmed on device before anyone treats them as a spec. The CONTENT metrics below are the
 * app's own and are exact.
 */
export function SelectSheet({ open, items = [], selectedId, onSelect, onClose }) {
  if (!open) return null

  return (
    <div className="m-ss">
      <button type="button" className="m-ss-backdrop" onClick={onClose} aria-label="Close" />

      <div className="m-ss-sheet" role="dialog" aria-label="Select">
        {/* gorhom's default handle. `enablePanDownToClose` is what it affords. */}
        <span className="m-ss-handle" aria-hidden="true" />

        <ul className="m-ss-list">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`m-ss-item${item.id === selectedId ? ' is-selected' : ''}`}
                onClick={() => {
                  onSelect?.(item.id)
                  onClose?.()
                }}
              >
                <span className="m-t-body-regular">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
