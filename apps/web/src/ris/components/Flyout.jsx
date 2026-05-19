import { useEffect, useRef, useState } from 'react'
import './Flyout.css'

/**
 * Click-anchored dropdown. Trigger is rendered inline; popover is positioned
 * absolutely below (or above, if there's no room) the trigger.
 *
 * <Flyout
 *   trigger={({ open, toggle }) => (
 *     <button className="my-btn" onClick={toggle}>Lincoln ▼</button>
 *   )}
 *   placement="bottom-start"
 * >
 *   {({ close }) => (
 *     <ul>
 *       <li onClick={close}>One</li>
 *       <li onClick={close}>Two</li>
 *     </ul>
 *   )}
 * </Flyout>
 */
export function Flyout({ trigger, children, placement = 'bottom-start', offset = 6 }) {
  const [open, setOpen]  = useState(false)
  const wrapRef          = useRef(null)
  const popRef           = useRef(null)

  const toggle = () => setOpen(o => !o)
  const close  = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    function onClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close()
    }
    function onKey(e) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown',   onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown',   onKey)
    }
  }, [open])

  return (
    <div className="flyout" ref={wrapRef}>
      {trigger({ open, toggle, close })}
      {open && (
        <div
          ref={popRef}
          className={`flyout-pop flyout-pop--${placement}`}
          style={{ '--fl-offset': `${offset}px` }}
          role="dialog"
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      )}
    </div>
  )
}
