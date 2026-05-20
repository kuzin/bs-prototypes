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
 *   placement="bottom-start"   // bottom-start | bottom-end | top-start | top-end | auto
 * >
 *   {({ close }) => (
 *     <ul>
 *       <li onClick={close}>One</li>
 *       <li onClick={close}>Two</li>
 *     </ul>
 *   )}
 * </Flyout>
 *
 * placement="auto" picks the quadrant with the most space after the popover mounts.
 */
export function Flyout({ trigger, children, placement = 'bottom-start', offset = 6 }) {
  const [open, setOpen]              = useState(false)
  const [resolvedPlacement, setRP]   = useState('bottom-start')
  const wrapRef                      = useRef(null)
  const popRef                       = useRef(null)

  const toggle = () => setOpen(o => !o)
  const close  = () => setOpen(false)

  // Click-outside / Escape
  useEffect(() => {
    if (!open) return
    function onClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close()
    }
    function onKey(e) { if (e.key === 'Escape') close() }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown',   onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown',   onKey)
    }
  }, [open])

  // Auto-placement: measure after the pop renders
  useEffect(() => {
    if (!open || placement !== 'auto' || !wrapRef.current || !popRef.current) return
    const trigger = wrapRef.current.getBoundingClientRect()
    const pop     = popRef.current.getBoundingClientRect()
    const vh = window.innerHeight
    const vw = window.innerWidth

    const vert  = (vh - trigger.bottom) >= pop.height + 10 ? 'bottom'
                : trigger.top           >= pop.height + 10 ? 'top'
                : 'bottom'
    const horiz = (vw - trigger.left)   >= pop.width       ? 'start' : 'end'
    setRP(`${vert}-${horiz}`)
  }, [open, placement])

  const activePlacement = placement === 'auto' ? resolvedPlacement : placement

  return (
    <div className="flyout" ref={wrapRef}>
      {trigger({ open, toggle, close })}
      {open && (
        <div
          ref={popRef}
          className={`flyout-pop flyout-pop--${activePlacement}`}
          style={{ '--fl-offset': `${offset}px` }}
          role="dialog"
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      )}
    </div>
  )
}
