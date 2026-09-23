import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import './Toast.css'

/**
 * Toasts — a bottom-right stack of short confirmations.
 *
 * For the thing that just happened and needs acknowledging but not deciding
 * about: an activity ticked off, a badge awarded, a goal saved. It says so and
 * gets out of the way. Anything the user has to answer is a Modal, not this.
 *
 *   const { toasts, push, dismiss } = useToasts()
 *   push({ title: 'Badge earned', body: 'Space', tone: 'success' })
 *   <ToastStack toasts={toasts} onDismiss={dismiss} />
 *
 * `action` is an optional `{ label, onClick }` — one way on from the thing that
 * just happened ("View", "Undo"). It dismisses the toast as it fires.
 *
 * `tone` is `success` (default) | `info` | `warning`. Each toast carries its own
 * timer and clears itself; hovering the stack pauses nothing, because a toast
 * short enough to read in four seconds shouldn't need pausing — put anything
 * longer in the page.
 *
 * The stack is `position: fixed`, so mount it once per page rather than per
 * row, or several will overlap in the same corner.
 */

const TOAST_MS = 4000

const TONES = {
  success: { icon: 'circle-check' },
  info: { icon: 'info' },
  warning: { icon: 'alert-triangle' },
}

/**
 * Owns the queue. Kept as a hook rather than a context so a page can hold its
 * own toasts without the whole prototype needing a provider.
 */
export function useToasts() {
  const [toasts, setToasts] = useState([])
  const seq = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((toast) => {
    const id = ++seq.current
    setToasts((list) => [...list, { tone: 'success', ...toast, id }])
    return id
  }, [])

  return { toasts, push, dismiss }
}

function Toast({ toast, onDismiss }) {
  const { id, title, body, tone, action } = toast
  const cfg = TONES[tone] ?? TONES.success

  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), TOAST_MS)
    return () => clearTimeout(t)
  }, [id, onDismiss])

  return (
    // `polite`, not `assertive`: a confirmation shouldn't interrupt whatever a
    // screen reader is in the middle of saying.
    <div className={`toast toast--${tone ?? 'success'}`} role="status" aria-live="polite">
      <span className="toast-icon">
        <Icon name={cfg.icon} size={18} stroke={2.2} />
      </span>
      <span className="toast-text">
        <span className="toast-title">{title}</span>
        {body && <span className="toast-body">{body}</span>}
      </span>
      {/* One optional way on — "View", "Undo". It dismisses as it fires, or the
          toast sits there after the thing it offered has already happened. */}
      {action && (
        <button
          type="button"
          className="toast-action"
          onClick={() => {
            action.onClick?.()
            onDismiss(id)
          }}
        >
          {action.label}
        </button>
      )}
      <button
        type="button"
        className="toast-close"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss"
      >
        <Icon name="x" size={14} stroke={2.4} />
      </button>
    </div>
  )
}

export function ToastStack({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
