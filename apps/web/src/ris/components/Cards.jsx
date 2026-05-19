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
export function StatCard({ value, unit, label, footer, color, footerColor }) {
  return (
    <div className="rc-stat">
      <div className="rc-stat-val" style={color ? { color } : undefined}>
        {value}
        {unit && <span className="rc-stat-unit">{unit}</span>}
      </div>
      <div className="rc-stat-lbl">{label}</div>
      {footer && (
        <div className="rc-stat-sub" style={footerColor ? { color: footerColor } : undefined}>
          {footer}
        </div>
      )}
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
  className = '',
  span = 1,           // 1 = normal, 2 = wide (spans the sv-grid)
}) {
  const style = accent
    ? { '--rc-accent': accent, '--rc-accent-bg': `color-mix(in srgb, ${accent} 12%, white)` }
    : undefined
  return (
    <div className={`rc-card${span === 2 ? ' rc-card--wide' : ''} ${className}`} style={style}>
      <div className="rc-card-head">
        {icon && <div className="rc-card-icon">{icon}</div>}
        <div className="rc-card-title-wrap">
          <span className="rc-card-title">{title}</span>
          {subtitle && <span className="rc-card-sub">{subtitle}</span>}
        </div>
        {action && <div className="rc-card-action">{action}</div>}
      </div>
      <div className={`rc-card-body rc-card-body--${bodyPad}`}>{children}</div>
      {footer && <div className="rc-card-foot">{footer}</div>}
    </div>
  )
}

/** A simple text/JSX inline note that sits inside a ChartCard body. */
export function CardNote({ tone = 'neutral', children }) {
  return <div className={`rc-card-note rc-card-note--${tone}`}>{children}</div>
}
