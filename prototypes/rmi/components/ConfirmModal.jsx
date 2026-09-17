import { Modal } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import '@components/Modal/Modal.css'

/**
 * `.modal--small` — the app's confirm dialogue: a title, a paragraph saying what
 * the action costs, and Cancel / confirm in the footer. Both of the roster's
 * destructive actions use it, and the copy is theirs.
 *
 * Structure is the shared Modal's own — `.modal-header` / `.modal-body` /
 * `.modal-footer` as direct children — so the panel, its corners, the footer's
 * rule and ground, and the scroll cap all come from Modal.css.
 *
 * No close badge: Cancel is already the way out, and a second one in the corner
 * is a second answer to the same question. The backdrop and Escape still close
 * it, as they do on any Modal.
 */
export function ConfirmModal({ open, onClose, title, children, confirmLabel, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel={title}>
      <div className="modal-header">
        <div className="modal-header-text">
          <h2 className="modal-title">{title}</h2>
        </div>
      </div>

      <div className="modal-body">{children}</div>

      <div className="modal-footer">
        <Button variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            onConfirm?.()
            onClose()
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
