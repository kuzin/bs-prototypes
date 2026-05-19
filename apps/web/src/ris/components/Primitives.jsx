import { useState } from 'react'
import './Primitives.css'

/**
 * Small reusable primitives that didn't warrant their own file each.
 * Export from here, import named:
 *   import { Divider, Spinner, IconButton, Tooltip, Banner,
 *            Breadcrumb, Accordion, EmptyState, Skeleton, SectionHeading } from './Primitives'
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
 * placement: top (default) | bottom | left | right
 */
export function Tooltip({ content, placement = 'top', delay = 0, children }) {
  if (!content) return children
  return (
    <span className={`ttp ttp--${placement}`} style={{ '--ttp-delay': `${delay}ms` }}>
      {children}
      <span className="ttp-bubble" role="tooltip">{content}</span>
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
  info:    <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" fillOpacity="0.18"/><circle cx="8" cy="4.5" r="0.9"/><path d="M7 7.2h1.4v5H7z"/></svg>,
  success: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="7"/><polyline points="5,8 7.3,10.3 11.2,5.8"/></svg>,
  warning: <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.4l7.5 13H0.5z" fillOpacity="0.18"/><path d="M8 1.4l7.5 13H0.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><circle cx="8" cy="12.4" r="0.9"/><path d="M7.3 6.2h1.4v4.4H7.3z"/></svg>,
  error:   <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="7"/><line x1="5.5" y1="5.5" x2="10.5" y2="10.5"/><line x1="10.5" y1="5.5" x2="5.5" y2="10.5"/></svg>,
}

export function Banner({ level = 'info', title, icon, onDismiss, action, children, className = '' }) {
  return (
    <div className={`bnr bnr--${level} ${className}`.trim()} role="status">
      <span className="bnr-icon" aria-hidden="true">{icon ?? BANNER_ICONS[level]}</span>
      <div className="bnr-body">
        {title && <div className="bnr-title">{title}</div>}
        {children && <div className="bnr-msg">{children}</div>}
      </div>
      {action && <div className="bnr-action">{action}</div>}
      {onDismiss && (
        <button className="bnr-close" onClick={onDismiss} aria-label="Dismiss">
          <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="3" x2="11" y2="11" />
            <line x1="11" y1="3" x2="3" y2="11" />
          </svg>
        </button>
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
              {item.href && !last
                ? <a href={item.href} className="bcb-link">{item.label}</a>
                : <span className={`bcb-current${last ? ' bcb-current--last' : ''}`} aria-current={last ? 'page' : undefined}>{item.label}</span>
              }
              {!last && (
                <svg className="bcb-sep" viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6,3 11,8 6,13" />
                </svg>
              )}
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
export function Accordion({ items = [], defaultOpen = [], allowMultiple = false, className = '' }) {
  const [open, setOpen] = useState(new Set(defaultOpen))

  const toggle = (id) => {
    setOpen(prev => {
      const next = new Set(allowMultiple ? prev : [])
      if (prev.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className={`acd ${className}`.trim()}>
      {items.map(item => {
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
              <svg className="acd-caret" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="4,6 8,10 12,6" />
              </svg>
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
export function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div className={`emp ${className}`.trim()}>
      {icon && <div className="emp-icon" aria-hidden="true">{icon}</div>}
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
export function Skeleton({ width, height = 14, shape = 'rect', lines, className = '' }) {
  if (lines && lines > 1) {
    return (
      <div className={`skl-lines ${className}`.trim()}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className="skl skl--rect"
            style={{
              width: i === lines - 1 ? '70%' : '100%',
              height,
            }}
          />
        ))}
      </div>
    )
  }
  return (
    <span
      className={`skl skl--${shape} ${className}`.trim()}
      style={{ width, height }}
    />
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
