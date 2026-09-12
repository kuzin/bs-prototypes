import { useState, useRef, useEffect, useCallback, useId } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@components/Icon/Icon'
import '@components/Primitives/Primitives.css'

/**
 * Small reusable primitives that didn't warrant their own file each.
 * Export from here, import named:
 *   import { Divider, Spinner, IconButton, Tooltip, Banner,
 *            Breadcrumb, Accordion, EmptyState, Skeleton } from '@components/Primitives/Primitives'
 */

// ── Divider ─────────────────────────────────────────────────────────────
/**
 * <Divider />
 * <Divider label="OR" />
 * <Divider orientation="vertical" />
 */
export function Divider({ label, orientation = 'horizontal', className = '' }) {
  if (orientation === 'vertical') {
    return <span className={`dvd dvd--vertical ${className}`.trim()} aria-hidden="true" />
  }
  if (label) {
    return (
      <div className={`dvd dvd--labeled ${className}`.trim()} role="separator">
        <span className="dvd-line" />
        <span className="dvd-label">{label}</span>
        <span className="dvd-line" />
      </div>
    )
  }
  return <hr className={`dvd ${className}`.trim()} />
}

// ── Spinner ─────────────────────────────────────────────────────────────
/**
 * <Spinner />            // md size, current color
 * <Spinner size="sm" color="#196DD5" />
 */
export function Spinner({ size = 'md', color, className = '' }) {
  return (
    <span
      className={`spn spn--${size} ${className}`.trim()}
      style={color ? { color } : undefined}
      role="status"
      aria-label="Loading"
    />
  )
}

// ── IconButton ──────────────────────────────────────────────────────────
/**
 * <IconButton aria-label="Close" onClick={fn}>
 *   <svg ... />
 * </IconButton>
 *
 * variants: secondary (default) | primary | ghost | danger
 * sizes:    sm | md | lg
 */
export function IconButton({
  variant = 'secondary',
  size = 'md',
  disabled,
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type="button"
      className={`icnb icnb--${variant} icnb--${size} ${className}`.trim()}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

// ── Tooltip ─────────────────────────────────────────────────────────────
/**
 * Lightweight hover tooltip. Pass any element as children; tooltip shows
 * on hover/focus.
 *
 * <Tooltip content="Mark as read">
 *   <IconButton><MailIcon /></IconButton>
 * </Tooltip>
 *
 * placement: top (default) | bottom | left | right | auto
 *   'auto' detects the nearest viewport edge and flips accordingly.
 *
 * Pass `followCursor` to position the bubble at the pointer and have it
 * track the cursor as it moves — best for chart-like surfaces where the
 * tooltip explains the value under the cursor.
 */
// A tooltip is rendered into `document.body`, not beside its trigger. Anything
// with `overflow` other than `visible` clips an absolutely positioned child —
// a table's scroll pane, a card, a chart body — and a bubble on an anchor near
// that box's edge got cut in half. Nudging it back inside only traded the clip
// for a bubble that no longer pointed at anything, and it still couldn't cross
// the container. A fixed-position portal has no clipping ancestor at all, so
// the only thing left to fit inside is the viewport.
//
// It also means an idle tooltip has no box in the layout: the bubble simply
// isn't mounted until you hover it, which is what used to inflate a card's
// scroll extent and grow phantom scrollbars.
const TTP_MARGIN = 8 // keep this far off the viewport edge
const TTP_GAP = 8 // distance from the trigger

export function Tooltip({
  content,
  placement = 'top',
  delay = 0,
  followCursor = false,
  className = '',
  children,
}) {
  const wrapRef = useRef(null)
  const bubbleRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false) // drives the fade, one frame behind
  const [pos, setPos] = useState(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const id = useId()

  // Measure once the bubble is mounted, then place it: pick the side with room,
  // clamp along the cross axis to the viewport, and tell the arrow how far the
  // clamp moved it so it still points at the trigger.
  const place = useCallback(() => {
    const wrap = wrapRef.current
    const bubble = bubbleRef.current
    if (!wrap || !bubble) return
    const t = wrap.getBoundingClientRect()
    const b = bubble.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    let side = placement === 'auto' ? 'top' : placement
    // Flip to the opposite side when this one has no room for the bubble.
    if (side === 'top' && t.top - b.height - TTP_GAP < TTP_MARGIN) side = 'bottom'
    else if (side === 'bottom' && t.bottom + b.height + TTP_GAP > vh - TTP_MARGIN) side = 'top'
    else if (side === 'left' && t.left - b.width - TTP_GAP < TTP_MARGIN) side = 'right'
    else if (side === 'right' && t.right + b.width + TTP_GAP > vw - TTP_MARGIN) side = 'left'

    const vertical = side === 'top' || side === 'bottom'
    let left = vertical
      ? t.left + t.width / 2 - b.width / 2
      : side === 'left'
        ? t.left - b.width - TTP_GAP
        : t.right + TTP_GAP
    let top = vertical
      ? side === 'top'
        ? t.top - b.height - TTP_GAP
        : t.bottom + TTP_GAP
      : t.top + t.height / 2 - b.height / 2

    // Clamp inside the viewport, and record the correction so the arrow can
    // counter it and keep pointing at the trigger's centre.
    const clampedLeft = Math.min(Math.max(left, TTP_MARGIN), vw - b.width - TTP_MARGIN)
    const clampedTop = Math.min(Math.max(top, TTP_MARGIN), vh - b.height - TTP_MARGIN)
    const shiftX = vertical ? left - clampedLeft : 0
    const shiftY = vertical ? 0 : top - clampedTop

    setPos({ side, left: Math.round(clampedLeft), top: Math.round(clampedTop), shiftX, shiftY })
  }, [placement])

  // Place after mount, then keep up with scroll and resize while open — the
  // trigger moves under a fixed bubble otherwise.
  useEffect(() => {
    if (!open || followCursor) return
    place()
    const frame = requestAnimationFrame(() => setShown(true))
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open, followCursor, place])

  useEffect(() => {
    if (!open || !followCursor) return
    const frame = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(frame)
  }, [open, followCursor])

  function show() {
    setOpen(true)
  }
  function hide() {
    setOpen(false)
    setShown(false)
    setPos(null)
  }
  function onMove(e) {
    if (followCursor) setCursor({ x: e.clientX, y: e.clientY })
  }

  if (!content) return children

  const side = followCursor ? 'cursor' : (pos?.side ?? (placement === 'auto' ? 'top' : placement))
  const style = followCursor
    ? { left: cursor.x + 12, top: cursor.y - 32 }
    : // Off-screen until measured, so the first frame never flashes at 0,0.
      {
        left: pos ? pos.left : -9999,
        top: pos ? pos.top : -9999,
        '--ttp-shift': `${pos?.shiftX ?? 0}px`,
        '--ttp-shift-y': `${pos?.shiftY ?? 0}px`,
      }

  return (
    <>
      <span
        className={`ttp${className ? ` ${className}` : ''}`}
        ref={wrapRef}
        aria-describedby={open ? id : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onMouseMove={onMove}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
      {open &&
        createPortal(
          <span
            id={id}
            className={`ttp-pop ttp-pop--${side}${shown ? ' is-shown' : ''}`}
            role="tooltip"
            style={{ ...style, '--ttp-delay': `${delay}ms` }}
            ref={bubbleRef}
          >
            {content}
          </span>,
          document.body,
        )}
    </>
  )
}

// ── Banner ──────────────────────────────────────────────────────────────
/**
 * Page-level alert / banner.
 *
 * <Banner level="info" title="Heads up" onDismiss={fn}>
 *   The new dashboard is rolling out next week.
 * </Banner>
 *
 * levels: info | success | warning | error
 */
const BANNER_ICONS = {
  info: <Icon name="info" size={18} />,
  success: <Icon name="circle-check" size={18} />,
  warning: <Icon name="alert-triangle" size={18} />,
  error: <Icon name="circle-x" size={18} />,
}

export function Banner({
  level = 'info',
  title,
  icon,
  onDismiss,
  action,
  children,
  className = '',
}) {
  return (
    <div className={`bnr bnr--${level} ${className}`.trim()} role="status">
      <span className="bnr-icon" aria-hidden="true">
        {icon ?? BANNER_ICONS[level]}
      </span>
      <div className="bnr-body">
        {title && <div className="bnr-title">{title}</div>}
        {children && <div className="bnr-msg">{children}</div>}
      </div>
      {action && <div className="bnr-action">{action}</div>}
      {onDismiss && (
        <IconButton
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="bnr-close"
        >
          <Icon name="x" size={14} />
        </IconButton>
      )}
    </div>
  )
}

// ── Breadcrumb ──────────────────────────────────────────────────────────
/**
 * <Breadcrumb
 *   items={[
 *     { label: 'Schools', href: '/schools' },
 *     { label: 'Lincoln Elementary', href: '/schools/lincoln' },
 *     { label: 'Motivation' },   // current page — no href
 *   ]}
 * />
 */
export function Breadcrumb({ items = [], className = '' }) {
  return (
    <nav className={`bcb ${className}`.trim()} aria-label="Breadcrumb">
      <ol className="bcb-list">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="bcb-item">
              {item.href && !last ? (
                <a href={item.href} className="bcb-link">
                  {item.label}
                </a>
              ) : (
                <span
                  className={`bcb-current${last ? ' bcb-current--last' : ''}`}
                  aria-current={last ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!last && <Icon name="chevron-right" size={11} className="bcb-sep" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// ── Accordion ───────────────────────────────────────────────────────────
/**
 * <Accordion items={[
 *   { id: 'a', title: 'Section A', content: <>…</> },
 *   { id: 'b', title: 'Section B', content: <>…</> },
 * ]} />
 *
 * allowMultiple: true → multiple sections can be open at once.
 */
export function Accordion({
  items = [],
  defaultOpen = [],
  allowMultiple = false,
  accent,
  className = '',
}) {
  const [open, setOpen] = useState(new Set(defaultOpen))

  const toggle = (id) => {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : [])
      if (prev.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const style = accent ? { '--acd-accent': accent } : undefined

  return (
    <div className={`acd ${className}`.trim()} style={style}>
      {items.map((item) => {
        const isOpen = open.has(item.id)
        return (
          <div key={item.id} className={`acd-item${isOpen ? ' acd-item--open' : ''}`}>
            <button
              type="button"
              className="acd-trigger"
              aria-expanded={isOpen}
              onClick={() => toggle(item.id)}
            >
              <span className="acd-title">{item.title}</span>
              <Icon name="chevron-down" size={18} stroke={2.2} className="acd-caret" />
            </button>
            {isOpen && <div className="acd-content">{item.content}</div>}
          </div>
        )
      })}
    </div>
  )
}

// ── EmptyState ──────────────────────────────────────────────────────────
/**
 * <EmptyState
 *   icon={<svg/>}
 *   title="No students to watch"
 *   description="Students appear here when they trip an alert."
 *   action={<Button>Set thresholds</Button>}
 * />
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'plain',
  className = '',
}) {
  return (
    <div className={`emp emp--${variant} ${className}`.trim()}>
      {icon && (
        <div className="emp-icon" aria-hidden="true">
          {icon}
        </div>
      )}
      {title && <div className="emp-title">{title}</div>}
      {description && <div className="emp-desc">{description}</div>}
      {action && <div className="emp-action">{action}</div>}
    </div>
  )
}

// ── Skeleton ────────────────────────────────────────────────────────────
/**
 * Animated loading placeholder.
 *
 * <Skeleton width={120} height={16} />
 * <Skeleton shape="circle" width={36} height={36} />
 * <Skeleton lines={3} />          // multi-line text skeleton
 */
export function Skeleton({ width, height = 14, shape = 'rect', lines, className = '', style }) {
  if (lines && lines > 1) {
    return (
      <div className={`skl-lines ${className}`.trim()} style={style}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className="skl skl--rect"
            style={{ width: i === lines - 1 ? '70%' : '100%', height }}
          />
        ))}
      </div>
    )
  }
  return (
    <span className={`skl skl--${shape} ${className}`.trim()} style={{ width, height, ...style }} />
  )
}
