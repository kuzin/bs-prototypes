import { useCallback, useState } from 'react'
import { LAYOUTS, KEY_LABEL } from './layouts'
import './Keyboard.css'

/**
 * The iOS software keyboard — and a working one.
 *
 * Device chrome, not app chrome: it belongs next to the status bar and the home indicator rather
 * than to any screen. It matters for a design platform because the keyboard takes roughly a third
 * of the screen, so a layout that only works with it down does not work — and because being able
 * to actually type into a prototype is the difference between showing a screen and demonstrating a
 * flow.
 *
 * It types into whatever field currently has focus, going through the native value setter so React
 * sees the change (assigning to `.value` alone does not fire React's onChange).
 *
 * Behaviour that matches iOS: shift is a one-shot that clears after the next letter, double-tapping
 * it locks caps, the layout switches through letters → 123 → #+=, and returning from either
 * numeric layout always lands back on letters.
 */
const CAPS_DOUBLE_TAP_MS = 300

function setNativeValue(el, value) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement : HTMLInputElement
  const setter = Object.getOwnPropertyDescriptor(proto.prototype, 'value')?.set
  setter?.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

export function Keyboard({ onDismiss }) {
  const [layout, setLayout] = useState('letters')
  const [shift, setShift] = useState(false)
  const [caps, setCaps] = useState(false)
  const [pressed, setPressed] = useState(null)
  const [lastShiftAt, setLastShiftAt] = useState(0)

  const field = () => {
    const el = document.activeElement
    return el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement ? el : null
  }

  const insert = useCallback((text) => {
    const el = field()
    if (!el) return
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    const max = el.maxLength > 0 ? el.maxLength : Infinity
    const next = (el.value.slice(0, start) + text + el.value.slice(end)).slice(0, max)
    setNativeValue(el, next)
    const caret = Math.min(start + text.length, max)
    el.setSelectionRange?.(caret, caret)
  }, [])

  const backspace = useCallback(() => {
    const el = field()
    if (!el) return
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    if (start === 0 && start === end) return
    const from = start === end ? start - 1 : start
    setNativeValue(el, el.value.slice(0, from) + el.value.slice(end))
    el.setSelectionRange?.(from, from)
  }, [])

  const handleKey = useCallback(
    (key) => {
      if (key === 'shift') {
        const now = Date.now()
        if (now - lastShiftAt < CAPS_DOUBLE_TAP_MS) {
          setCaps(true)
          setShift(false)
        } else if (caps) {
          setCaps(false)
          setShift(false)
        } else {
          setShift((v) => !v)
        }
        setLastShiftAt(now)
        return
      }
      if (key === 'delete') return backspace()
      if (key === 'numbers' || key === 'symbols' || key === 'letters') return setLayout(key)

      // Return SUBMITS. On device the key is `returnKeyType` and pressing it fires
      // `onSubmitEditing` — which is how a search screen searches and a code screen accepts. A
      // newline typed into a single-line field is not that: the browser drops it and the screen
      // never hears anything, so the only way to submit was a hardware keyboard the phone does
      // not have. A textarea still gets its newline, because there return really is a line break.
      if (key === '\n') {
        const el = field()
        if (!el) return
        if (el instanceof HTMLTextAreaElement) return insert('\n')
        el.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }),
        )
        el.form?.requestSubmit?.()
        return
      }

      insert(layout === 'letters' && (shift || caps) ? key.toUpperCase() : key)
      // A one-shot shift clears after the letter it capitalised; caps lock does not.
      if (shift && !caps) setShift(false)
    },
    [backspace, caps, insert, lastShiftAt, layout, shift],
  )

  const spec = LAYOUTS[layout]
  const upper = layout === 'letters' && (shift || caps)

  const keyClass = (key) => {
    const mod = ['shift', 'delete', 'numbers', 'symbols'].includes(key)
    return [
      'm-kb-key',
      mod ? 'm-kb-mod' : '',
      key === 'shift' && (shift || caps) ? 'is-active' : '',
      pressed === key ? 'is-pressed' : '',
    ]
      .filter(Boolean)
      .join(' ')
  }

  const press = (key) => ({
    // The field must not lose focus, or there is nothing to type into.
    onMouseDown: (e) => {
      e.preventDefault()
      setPressed(key)
    },
    onMouseUp: () => setPressed(null),
    onMouseLeave: () => setPressed(null),
    onClick: () => handleKey(key),
  })

  return (
    <div className="m-kb" onMouseDown={(e) => e.preventDefault()}>
      {spec.rows.map((row, i) => (
        <div
          key={i}
          className={`m-kb-row${spec.inset === i ? ' m-kb-row-inset' : ''}${
            i === spec.rows.length - 1 ? ' m-kb-row-mods' : ''
          }`}
        >
          {row.map((key) => (
            <button
              key={key}
              type="button"
              className={keyClass(key)}
              aria-label={key}
              {...press(key)}
            >
              {key === 'shift' ? (
                <ShiftIcon locked={caps} />
              ) : key === 'delete' ? (
                <DeleteIcon />
              ) : (
                (KEY_LABEL[key] ?? (upper ? key.toUpperCase() : key))
              )}
            </button>
          ))}
        </div>
      ))}

      <div className="m-kb-row m-kb-row-bottom">
        <button
          type="button"
          className="m-kb-key m-kb-mod m-kb-wide"
          {...press(spec.switchTo === 'letters' ? 'letters' : 'numbers')}
        >
          {spec.switchKey}
        </button>
        <button type="button" className="m-kb-key m-kb-space" {...press(' ')}>
          space
        </button>
        <button type="button" className="m-kb-key m-kb-mod m-kb-wide" {...press('\n')}>
          return
        </button>
      </div>

      <div className="m-kb-tray">
        <button type="button" className="m-kb-tray-icon" aria-label="Emoji" {...press('')}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 14.5a4.5 4.5 0 0 0 7 0" strokeLinecap="round" />
            <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
          </svg>
        </button>
        <button
          type="button"
          className="m-kb-tray-icon"
          aria-label="Dismiss keyboard"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onDismiss}
        >
          <svg
            width="20"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/** Filled once shift is on, with a rule under it when caps is locked. */
function ShiftIcon({ locked }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3 3.5 12H8v6.5h8V12h4.5Z" />
      {locked && <rect x="8" y="20" width="8" height="1.6" rx="0.8" />}
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg width="20" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8L2 12Zm3.7 3.3a1 1 0 0 0 0 1.4L13.6 12l-1.9 2.3a1 1 0 1 0 1.4 1.4L15 13.4l1.9 1.9a1 1 0 0 0 1.4-1.4L16.4 12l1.9-2.3a1 1 0 0 0-1.4-1.4L15 10.6l-1.9-1.9a1 1 0 0 0-1.4 0Z" />
    </svg>
  )
}

/** iOS portrait keyboard height, including the emoji/mic tray and the home-indicator area. */
export const KEYBOARD_HEIGHT = 291
