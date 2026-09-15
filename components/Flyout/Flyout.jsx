import { useEffect, useRef, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
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

    // An explicit placement keeps the side the author chose for as long as it
    // fits, and flips whichever axis ran out of room — both of them, not just
    // the vertical. `bottom-end` means right-aligned to the trigger, so on a
    // trigger near the left edge the menu grows leftwards and off the box; the
    // author's choice was "hug this side", and honouring it past the edge just
    // clips the menu.
    const match = /^(top|bottom)-(start|end)$/.exec(placement)
    if (!match) {
      setRP(placement)
      return
    }
    const [, wantVert, wantHoriz] = match
    const flipVert = wantVert === 'bottom' ? vert : roomAbove ? 'top' : roomBelow ? 'bottom' : 'top'

    // `start` puts the pop's left edge at the trigger's left and grows right;
    // `end` puts its right edge at the trigger's right and grows left.
    const fitsStart = trigger.left + pop.width <= clip.right
    const fitsEnd = trigger.right - pop.width >= clip.left
    const flipHoriz =
      wantHoriz === 'start'
        ? fitsStart || !fitsEnd
          ? 'start'
          : 'end'
        : fitsEnd || !fitsStart
          ? 'end'
          : 'start'

    setRP(`${flipVert}-${flipHoriz}`)
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

/**
 * The list inside a flyout, and one row of it. Every menu in the app was
 * rebuilding this locally — the reader chrome had its own `.wa-more-menu` at a
 * different type size and hover — so these are the one shape.
 *
 *   <FlyoutMenu>
 *     <FlyoutMenuItem icon={<Icon name="check" size={16} />} onClick={…}>Complete Activity</FlyoutMenuItem>
 *     <FlyoutMenuItem danger onClick={…}>Un-enroll</FlyoutMenuItem>
 *   </FlyoutMenu>
 */
export function FlyoutMenu({ children, role = 'menu', className = '' }) {
  return (
    <div className={`flyout-menu ${className}`.trim()} role={role}>
      {children}
    </div>
  )
}

export function FlyoutMenuItem({
  icon,
  active = false,
  danger = false,
  onClick,
  role = 'menuitem',
  children,
  ...rest
}) {
  return (
    <button
      type="button"
      role={role}
      className={`flyout-menu-item${active ? ' flyout-menu-item--active' : ''}${danger ? ' flyout-menu-item--danger' : ''}`}
      onClick={onClick}
      {...rest}
    >
      {icon && <span className="flyout-menu-icon">{icon}</span>}
      <span className="flyout-menu-label">{children}</span>
    </button>
  )
}

/**
 * A flyout that picks one of a set — a period, a unit, a grade band.
 *
 * It shows **every** option with the current one ticked, rather than listing
 * only the alternatives. Hiding the current value was how four of these were
 * written, and it means a menu of two opens onto a single row with nothing to
 * say which of the two you are on.
 *
 *   <FlyoutSelect
 *     options={[{ id: 'week', label: 'This Week' }, …]}
 *     value={range}
 *     onChange={setRange}
 *     close={close}
 *   />
 *
 * `value` is matched against each option's `id`; `close` is the render prop's
 * own, so picking closes the flyout.
 */
export function FlyoutSelect({ options, value, onChange, close, ariaLabel }) {
  return (
    <div className="flyout-menu flyout-select" role="listbox" aria-label={ariaLabel}>
      {options.map((o) => {
        const on = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            role="option"
            aria-selected={on}
            className={`flyout-menu-item${on ? ' flyout-menu-item--active' : ''}`}
            onClick={() => {
              onChange(o.id)
              close?.()
            }}
          >
            <span className="flyout-menu-label">{o.label}</span>
            {on && <Icon name="check" size={15} stroke={2.4} />}
          </button>
        )
      })}
    </div>
  )
}
