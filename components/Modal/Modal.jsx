import { useEffect, useState, useCallback, useRef } from 'react'
import '@components/Modal/Modal.css'

const ANIM_DURATION = 220

/**
 * Two variants:
 *   <Modal open={open} onClose={fn} variant="side">…</Modal>   // right-slide panel
 *   <Modal open={open} onClose={fn} variant="center">…</Modal> // centered overlay
 *
 * Closes on Escape and backdrop click. Renders nothing when !open and the
 * closing animation finishes.
 */
export function Modal({ open, onClose, variant = 'side', children, ariaLabel }) {
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

  return (
    <>
      <div
        className={`modal-backdrop modal-backdrop--${variant}${closingClass}`}
        onClick={handleClose}
      />
      <div
        className={`modal modal--${variant}${closingClass}`}
        role="dialog"
        aria-label={ariaLabel}
        aria-modal="true"
      >
        {typeof content === 'function' ? content({ close: handleClose }) : content}
      </div>
    </>
  )
}
