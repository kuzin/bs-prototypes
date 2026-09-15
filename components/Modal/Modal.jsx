import { useEffect, useState, useCallback, useRef } from 'react'
import { Icon } from '@components/Icon/Icon'
import '@components/Modal/Modal.css'

const ANIM_DURATION = 220

/**
 * Three variants:
 *   <Modal open={open} onClose={fn} variant="side">…</Modal>   // right-slide panel
 *   <Modal open={open} onClose={fn} variant="center">…</Modal> // centered overlay
 *   <Modal open={open} onClose={fn} variant="full">…</Modal>   // full-screen surface
 *
 * `full` is the reader app's own full-screen flow — a white page over the
 * whole app area with a corner close, which is what the logging flow is and
 * what `reviews/new.html.erb` renders into (the app gives both the same
 * `#logged-books--new` shell). Use it for a task that takes the screen rather
 * than a dialogue that sits over it; it has no backdrop, because there is
 * nothing behind it to click.
 *
 * Closes on Escape and backdrop click. Renders nothing when !open and the
 * closing animation finishes.
 */
export function Modal({
  open,
  onClose,
  variant = 'side',
  closeBadge = false,
  children,
  ariaLabel,
}) {
  const [closing, setClosing] = useState(false)
  const [mounted, setMounted] = useState(open)
  // Keep the last children so the panel still shows its content while it
  // animates closed (parents often null out the content + `open` together,
  // which would otherwise leave an empty panel collapsing to a line).
  const lastChildren = useRef(children)
  if (open) lastChildren.current = children

  // Request a close — let the parent flip `open`; the effect below plays the
  // exit animation and unmounts. (Backdrop/Escape route through here too.)
  const handleClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  // Drive mount/unmount from `open` so closing works whether it's the backdrop,
  // Escape, OR the parent setting open=false directly (otherwise the overlay
  // would linger after a button-driven close).
  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
      return
    }
    setClosing(true)
    const t = setTimeout(() => {
      setClosing(false)
      setMounted(false)
    }, ANIM_DURATION)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!mounted) return
    function onKey(e) {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mounted, handleClose])

  if (!mounted) return null

  const closingClass = closing ? ' modal--closing' : ''
  const content = open ? children : lastChildren.current

  // The full-screen surface covers everything, so there is no backdrop to
  // click and none is drawn.
  const full = variant === 'full'

  return (
    <>
      {!full && (
        <div
          className={`modal-backdrop modal-backdrop--${variant}${closingClass}`}
          onClick={handleClose}
        />
      )}
      <div
        className={`modal modal--${variant}${closeBadge ? ' modal--has-close-badge' : ''}${closingClass}`}
        role="dialog"
        aria-label={ariaLabel}
        aria-modal="true"
      >
        {typeof content === 'function' ? content({ close: handleClose }) : content}
      </div>
    </>
  )
}

/**
 * The admin's modal close control: a floating white disc pinned just outside
 * the modal's top-right corner (bs-product `.mfp-close-badge-modal`). Give the
 * Modal `closeBadge` so it stops clipping the overhang:
 *
 *   <Modal open={open} onClose={close} variant="center" closeBadge>
 *     <ModalClose onClick={close} />
 *     …
 *   </Modal>
 */
export function ModalClose({ onClick, label = 'Close', className = '' }) {
  return (
    <button
      type="button"
      className={`modal-close-badge ${className}`.trim()}
      onClick={onClick}
      aria-label={label}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  )
}

/**
 * The corner controls a full-screen modal carries — close at the top right,
 * and an optional back at the top left for a flow with steps behind it.
 *
 *   <Modal variant="full" open={open} onClose={close}>
 *     <ModalFullClose onClick={close} />
 *     <ModalFullBack onClick={back} />          // only where there is a back
 *     <div className="modal-full-panel">…</div>
 *   </Modal>
 */
export function ModalFullClose({ onClick, label = 'Close' }) {
  return (
    <button
      type="button"
      className="modal-full-btn modal-full-close"
      onClick={onClick}
      aria-label={label}
    >
      <Icon name="x" size={16} stroke={2.2} />
    </button>
  )
}

export function ModalFullBack({ onClick, label = 'Back' }) {
  return (
    <button
      type="button"
      className="modal-full-btn modal-full-back"
      onClick={onClick}
      aria-label={label}
    >
      <Icon name="chevron-left" size={18} stroke={2.2} />
    </button>
  )
}
