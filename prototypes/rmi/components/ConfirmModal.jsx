import { Modal, ModalClose } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import '@components/Modal/Modal.css'
import './ConfirmModal.css'

/**
 * `.modal.modal--small` — the app's confirm dialogue: a title, a paragraph
 * saying what the action costs, and Cancel / confirm at the foot. Both of the
 * roster's destructive actions use it, and the copy is theirs.
 */
export function ConfirmModal({ open, onClose, title, children, confirmLabel, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel={title}>
      <div className="rmi-confirm">
        {/* `.modal-close-badge` — a disc pinned half-off the panel's corner, so
            it's positioned against the panel, not laid out in the header. */}
        <ModalClose onClick={onClose} />
        <header className="rmi-confirm-head">
          <h2 className="rmi-confirm-title">{title}</h2>
        </header>
        <div className="rmi-confirm-body">{children}</div>
        <footer className="rmi-confirm-foot">
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
        </footer>
      </div>
    </Modal>
  )
}
