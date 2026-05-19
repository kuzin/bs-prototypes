import { useEffect, useState, useCallback } from 'react'
import './Modal.css'

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

  const handleClose = useCallback(() => {
    if (!onClose) return
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      setMounted(false)
      onClose()
    }, ANIM_DURATION)
  }, [onClose])

  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
    }
  }, [open])

  useEffect(() => {
    if (!mounted) return
    function onKey(e) { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mounted, handleClose])

  if (!mounted) return null

  const closingClass = closing ? ' modal--closing' : ''

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
        {typeof children === 'function' ? children({ close: handleClose }) : children}
      </div>
    </>
  )
}
