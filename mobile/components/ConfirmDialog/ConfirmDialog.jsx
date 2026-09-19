import { FramePortal } from '../FramePortal/FramePortal'
import { PressableButton } from '../PressableButton/PressableButton'
import './ConfirmDialog.css'

/**
 * `friendsAndLeaderboards/components/modals/ConfirmationModal.tsx` — the app's own dialog, and
 * not [[Alert]].
 *
 * `Alert` is iOS's: the OS draws it, the app only supplies strings, and it looks like every other
 * alert on the phone. This one is the app's own and behaves differently in the way that matters —
 * the confirm is a full-width branded button and the cancel is small text under it, so the two
 * answers are not equal. It is what the app reaches for when it is asking permission rather than
 * warning you: a privacy notice, a code you are about to invalidate.
 *
 * `fadeIn` rather than a slide, 20 either side, 16 radius, and the backdrop dismisses.
 */
export function ConfirmDialog({
  open,
  title,
  text,
  confirmText = 'Accept',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
}) {
  if (!open) return null

  /* Portals to the frame root, the way RN's `Modal` does — see FramePortal. Rendering in
     place leaves the dialog inside whatever stacking context its caller happens to sit in. */
  return (
    <FramePortal>
      <div className="m-cd">
        <button type="button" className="m-cd-backdrop" onClick={onClose} aria-label="Close" />
        <div className="m-cd-box" role="dialog" aria-label={title}>
          <p className="m-t-header-bar-title m-cd-title">{title}</p>
          <p className="m-cd-text">{text}</p>
          <PressableButton fullWidth buttonText={confirmText} onButtonPress={onConfirm} />
          <button type="button" className="m-cd-cancel" onClick={onClose}>
            {cancelText}
          </button>
        </div>
      </div>
    </FramePortal>
  )
}
