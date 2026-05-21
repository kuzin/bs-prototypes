import './Cards.css'

/**
 * Small at-a-glance metric tile shown in a row near the top of a page.
 *
 * <StatCard
 *   value={26.0}
 *   unit="/40"
 *   label="School RMI score"
 *   footer="↑ 7 pts since Sep 2024"
 *   color="#E8866A"
 * />
 */
export function StatCard({ value, unit, label, color }) {
  // Explicit `color` wins by setting --rc-stat-color inline. Otherwise the
  // card inherits --rc-accent from the page / enclosing ChartCard via the
  // CSS variable cascade — see .rc-stat in Cards.css.
  const style = color ? { '--rc-stat-color': color } : undefined
  return (
    <div className="rc-stat" style={style}>
      <div className="rc-stat-val">
        {value}
        {unit && <span className="rc-stat-unit">{unit}</span>}
      </div>
      <div className="rc-stat-lbl">{label}</div>
    </div>
  )
}

/**
 * Wide card with a consistent header / body / footer. Matches the visual
 * pattern of the overview dashboard cards. Use for chart cards, breakdowns,
 * any rectangle with a title.
 *
 * <ChartCard
 *   title="RMI Trend — Lincoln vs. District"
 *   subtitle="Sep 2024 – May 2025"
 *   icon={<svg ... />}
 *   accent="#E8866A"
 *   action={<button>View →</button>}
 *   footer={<ChartLegend items={...} />}
 * >
 *   <ResponsiveLine ... />
 * </ChartCard>
 */
export function ChartCard({
  title,
  subtitle,
  icon,
  accent,
  action,
  footer,
  children,
  bodyPad = 'flush',  // 'flush' | 'padded'
  bodyMaxHeight,      // px — when set, caps body height and scrolls vertically (sticky header inside table/bar-list stays visible)
  className = '',
  span = 1,           // 1 = normal, 2 = wide (spans the sv-grid)
}) {
  const cardStyle = accent
    ? { '--rc-accent': accent, '--rc-accent-bg': `color-mix(in srgb, ${accent} 12%, white)` }
    : undefined
  const bodyStyle = bodyMaxHeight ? { maxHeight: bodyMaxHeight, overflowY: 'auto' } : undefined
  return (
    <div className={`rc-card${span === 2 ? ' rc-card--wide' : ''} ${className}`} style={cardStyle}>
      <div className="rc-card-head">
        {icon && <div className="rc-card-icon">{icon}</div>}
        <div className="rc-card-title-wrap">
          <span className="rc-card-title">{title}</span>
          {subtitle && <span className="rc-card-sub">{subtitle}</span>}
        </div>
        {action && <div className="rc-card-action">{action}</div>}
      </div>
      <div className={`rc-card-body rc-card-body--${bodyPad}`} style={bodyStyle}>{children}</div>
      {footer && <div className="rc-card-foot">{footer}</div>}
    </div>
  )
}

/** A simple text/JSX inline note that sits inside a ChartCard body. */
export function CardNote({ tone = 'neutral', children }) {
  return <div className={`rc-card-note rc-card-note--${tone}`}>{children}</div>
}
