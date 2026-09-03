import { useEffect, useRef, useState } from 'react'
import '@components/Flyout/Flyout.css'

// The box the popover has to fit inside: the intersection of every clipping
// ancestor, bounded by the viewport. Not just the innermost one — a tall table
// with `overflow: hidden` sitting in a short scroll pane doesn't constrain
// anything by itself, while the pane very much does. One axis is enough to
// make a box clip on both: `overflow-y: auto` forces the used value of
// `overflow-x` to `auto` too.
function clipRect(node) {
  const box = { top: 0, left: 0, bottom: window.innerHeight, right: window.innerWidth }
  let el = node.parentElement
  while (el && el !== document.body) {
    const cs = getComputedStyle(el)
    if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
      const r = el.getBoundingClientRect()
      box.top = Math.max(box.top, r.top)
      box.left = Math.max(box.left, r.left)
      box.bottom = Math.min(box.bottom, r.bottom)
      box.right = Math.min(box.right, r.right)
    }
    el = el.parentElement
  }
  return box
}

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
  const [open, setOpen] = useState(false)
  const [resolvedPlacement, setRP] = useState(placement === 'auto' ? 'bottom-start' : placement)
  const wrapRef = useRef(null)
  const popRef = useRef(null)

  const toggle = () => setOpen((o) => !o)
  const close = () => setOpen(false)

  // Click-outside / Escape
  useEffect(() => {
    if (!open) return
    function onClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close()
    }
    function onKey(e) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Placement: measure after the pop renders. The box to fit inside is the
  // nearest thing that would clip the pop, not the viewport — a scroll pane, or
  // a card body with `overflow: hidden` (a table's, say, which is a good deal
  // shorter than the window). Measuring the viewport is how a menu on a
  // table's last row ended up cut off by its own card.
  useEffect(() => {
    if (!open || !wrapRef.current || !popRef.current) return
    const trigger = wrapRef.current.getBoundingClientRect()
    const pop = popRef.current.getBoundingClientRect()
    const clip = clipRect(popRef.current)

    const roomBelow = clip.bottom - trigger.bottom >= pop.height + 10
    const roomAbove = trigger.top - clip.top >= pop.height + 10
    const vert = roomBelow ? 'bottom' : roomAbove ? 'top' : 'bottom'

    if (placement === 'auto') {
      const horiz = clip.right - trigger.left >= pop.width ? 'start' : 'end'
      setRP(`${vert}-${horiz}`)
      return
    }

    // An explicit placement keeps the side the author chose on the axis that
    // was a deliberate choice, and only flips the one that ran out of room.
    const match = /^(top|bottom)-(start|end)$/.exec(placement)
    if (!match) {
      setRP(placement)
      return
    }
    const [, wantVert, horiz] = match
    const flipped = wantVert === 'bottom' ? vert : roomAbove ? 'top' : roomBelow ? 'bottom' : 'top'
    setRP(`${flipped}-${horiz}`)
  }, [open, placement])

  const activePlacement = resolvedPlacement

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
