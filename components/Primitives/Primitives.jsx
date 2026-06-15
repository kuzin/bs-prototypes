import { useState, useRef } from 'react'
import { Icon } from '@components/Icon/Icon'
import '@components/Primitives/Primitives.css'

/**
 * Small reusable primitives that didn't warrant their own file each.
 * Export from here, import named:
 *   import { Divider, Spinner, IconButton, Tooltip, Banner,
 *            Breadcrumb, Accordion, EmptyState, Skeleton, SectionHeading } from '@components/Primitives/Primitives'
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
 * <Spinner size="sm" color="#1D4ED8" />
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
export function Tooltip({ content, placement = 'top', delay = 0, followCursor = false, children }) {
  const wrapRef = useRef(null)
  const [resolved, setResolved] = useState('top')
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  function onEnter() {
    if (placement !== 'auto' || !wrapRef.current) return
    const r = wrapRef.current.getBoundingClientRect()
    // Prefer top; fall back to bottom if too close to viewport top.
    setResolved(r.top < 60 ? 'bottom' : 'top')
  }

  function onMove(e) {
    if (!followCursor) return
    setCursor({ x: e.clientX, y: e.clientY })
  }

  if (!content) return children
  const pos = placement === 'auto' ? resolved : placement
  // When following the cursor we use fixed positioning and skip the
  // placement-specific CSS classes — JS sets x/y per mousemove.
  const bubbleStyle = followCursor
    ? { position: 'fixed', left: cursor.x + 12, top: cursor.y - 32 }
    : undefined
  return (
    <span
      className={`ttp${followCursor ? ' ttp--cursor' : ` ttp--${pos}`}`}
      style={{ '--ttp-delay': `${delay}ms` }}
      ref={wrapRef}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
    >
      {children}
      <span className="ttp-bubble" role="tooltip" style={bubbleStyle}>
        {content}
      </span>
    </span>
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
              <Icon name="chevron-down" size={14} className="acd-caret" />
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

// ── SectionHeading ──────────────────────────────────────────────────────
/**
 * Recurring h2/h3 + optional subtitle + optional right-side action.
 *
 * <SectionHeading title="Students to Watch" subtitle="Last 30 days" action={<Button>View all</Button>} />
 */
export function SectionHeading({ title, subtitle, action, level = 'h3', className = '' }) {
  const Tag = level
  return (
    <div className={`sct ${className}`.trim()}>
      <div className="sct-text">
        <Tag className="sct-title">{title}</Tag>
        {subtitle && <div className="sct-sub">{subtitle}</div>}
      </div>
      {action && <div className="sct-action">{action}</div>}
    </div>
  )
}
