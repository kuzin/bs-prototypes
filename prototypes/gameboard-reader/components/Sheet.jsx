import { useEffect } from 'react'
import { Icon } from '@components/Icon/Icon'

/**
 * A full-screen white overlay — the shape Beanstack's reader flows take when
 * they take over the page (log reading, the "You did it!" celebration).
 *
 * Deliberately not `@components/Modal`: that one is a centered card capped at
 * 520px, which is the right primitive for a dialog and the wrong one for a
 * flow that owns the whole viewport. Closes on Escape and on the × ; `onBack`
 * adds the ‹ that steps back inside the flow.
 */
export function Sheet({ open, onClose, onBack, ariaLabel, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    // Freeze the page behind the sheet so only the sheet scrolls.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="gr-sheet" role="dialog" aria-modal="true" aria-label={ariaLabel}>
      {onBack && (
        <button
          type="button"
          className="gr-sheet-btn gr-sheet-back"
          onClick={onBack}
          aria-label="Back"
        >
          <Icon name="chevron-left" size={18} stroke={2.2} />
        </button>
      )}
      <button
        type="button"
        className="gr-sheet-btn gr-sheet-close"
        onClick={onClose}
        aria-label="Close"
      >
        <Icon name="x" size={18} stroke={2.2} />
      </button>
      {children}
    </div>
  )
}
