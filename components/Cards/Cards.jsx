import { TrendChip } from '@components/TrendChip/TrendChip'
import '@components/Cards/Cards.css'

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
 *
 * Two shapes:
 *
 * **plain** (default) — a white card with the figure centred and large. It's
 * the row-of-four across the top of a report page, where the numbers are the
 * headline and there is nothing above them competing.
 *
 * **tinted** — the admin dashboard's own stat (`.adm-stat`): the whole card
 * washed in the accent, an icon chip, and a smaller figure ranged left over
 * its label. Use it where the stats sit *inside* a page that already has a
 * heading and other cards, and a row of big centred numerals would shout over
 * all of it. Takes an `icon`.
 *
 * `trend` puts a <TrendChip> beside the figure — the system's one trend
 * treatment, a pastel pill whose reading is in its tooltip. Pass it instead of
 * spelling a delta out in `footer`: "+101 in the last 7 days" next to a 490 put
 * two numbers on the tile and made the eye pick between them. `footer` stays
 * for the things that aren't trends ("79% of the class").
 */
export function StatCard({
  value,
  unit,
  label,
  footer,
  footerColor,
  color,
  icon,
  trend,
  variant = 'plain',
}) {
  // Explicit `color` wins by setting --rc-stat-color inline. Otherwise the
  // card inherits --rc-accent from the page / enclosing ChartCard via the
  // CSS variable cascade — see .rc-stat in Cards.css. The tinted shape derives
  // its wash and border from that same one authored hex, the way ChartCard
  // derives its accent background, so a caller still states one colour.
  const style = color ? { '--rc-stat-color': color } : undefined
  return (
    <div className={`rc-stat rc-stat--${variant}`} style={style}>
      {variant === 'tinted' && icon && <span className="rc-stat-ico">{icon}</span>}
      <div className="rc-stat-main">
        <div className="rc-stat-val">
          {value}
          {unit && <span className="rc-stat-unit">{unit}</span>}
          {trend && <TrendChip {...trend} />}
        </div>
        <div className="rc-stat-lbl">{label}</div>
        {footer && (
          <div className="rc-stat-foot" style={footerColor ? { color: footerColor } : undefined}>
            {footer}
          </div>
        )}
      </div>
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
  bodyPad = 'flush', // 'flush' | 'padded'
  bodyMaxHeight, // px — when set, caps body height and scrolls vertically (sticky header inside table/bar-list stays visible)
  className = '',
  span = 1, // 1 = normal, 2 = wide (spans the sv-grid)
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
      <div className={`rc-card-body rc-card-body--${bodyPad}`} style={bodyStyle}>
        {children}
      </div>
      {footer && <div className="rc-card-foot">{footer}</div>}
    </div>
  )
}

/** A simple text/JSX inline note that sits inside a ChartCard body. */
export function CardNote({ tone = 'neutral', children }) {
  return <div className={`rc-card-note rc-card-note--${tone}`}>{children}</div>
}
