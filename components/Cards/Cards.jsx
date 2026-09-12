import { Icon } from '@components/Icon/Icon'
import { Tooltip } from '@components/Primitives/Primitives'
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
 * One shape: a flat pastel card with the figure, bold, over its label. No
 * border and no shadow — the fill is the card. `color` supplies the hue and
 * everything else is derived from it, so a caller states one colour.
 *
 * `icon` is optional; without one the tile is just figure, label and action.
 *
 * `action` puts a link at the foot of the tile — `{ label, href, onClick }` —
 * for the stats that lead somewhere (Insights, Number Cruncher, a Lexile
 * report). It takes the card's own colour.
 *
 * `trend` puts a <TrendChip> beside the figure — the system's one trend
 * treatment, a pastel pill whose reading is in its tooltip. Pass it instead of
 * spelling a delta out in `footer`: "+101 in the last 7 days" next to a 490 put
 * two numbers on the tile and made the eye pick between them. `footer` stays
 * for the things that aren't trends ("79% of the class").
 */
export function StatCard({ value, unit, label, footer, footerColor, color, icon, trend, action }) {
  // Explicit `color` wins by setting --rc-stat-color inline. Otherwise the
  // card inherits --rc-accent from the page / enclosing ChartCard via the
  // CSS variable cascade — see .rc-stat in Cards.css. The tile's fill is a light
  // tint of that same one authored hex, so a caller still states one colour.
  const style = color ? { '--rc-stat-color': color } : undefined

  return (
    <div className="rc-stat" style={style}>
      {icon && <span className="rc-stat-ico">{icon}</span>}
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
        {action && (
          <a className="rc-stat-action" href={action.href} onClick={action.onClick}>
            {action.label}
            <Icon name="chevron-right" size={16} stroke={2.6} />
          </a>
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
 *   info="Averaged across every logged session."
 *   footer={<ChartLegend items={...} />}
 * >
 *   <ResponsiveLine ... />
 * </ChartCard>
 *
 * `info` is the app's own header affordance — a 15px disc with a white "i"
 * that carries a tooltip (`.info-icon` in `.insights-metric-label`). It's what
 * sits at the right of a module header in the product; `action` is the escape
 * hatch for the cases that genuinely need a control there instead. Pass it
 * `{ label, href }` for the standard chevron link, or any node to render your
 * own control in the slot.
 */
export function ChartCard({
  title,
  subtitle,
  icon,
  accent,
  action,
  info,
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
        {action &&
          (action.label ? (
            <a className="rc-card-action-link" href={action.href} onClick={action.onClick}>
              {action.label}
              <Icon name="chevron-right" size={18} stroke={2.6} />
            </a>
          ) : (
            <div className="rc-card-action">{action}</div>
          ))}
        {info && (
          <Tooltip content={info}>
            <button type="button" className="rc-card-info" aria-label={info}>
              i
            </button>
          </Tooltip>
        )}
      </div>
      <div className={`rc-card-body rc-card-body--${bodyPad}`} style={bodyStyle}>
        {children}
      </div>
      {footer && <div className="rc-card-foot">{footer}</div>}
    </div>
  )
}

/** A simple text/JSX inline note that sits inside a ChartCard body. */
// Each tone's default glyph, matching the app's own `*-icon` classes:
// information / alarm / high-importance / checkmark.
const NOTE_TONE_ICON = {
  info: 'info',
  warning: 'alert-triangle',
  success: 'circle-check',
  error: 'alert-hexagon',
}

/**
 * Inline note inside a card body — the app's `.infobox` (lib/_infobox.scss):
 * 15px/1.5 on a flat tint, `12px 16px`, radius 10, no border. The tone IS the
 * fill.
 *
 * `tone` names the intent, and each maps to one of the app's boxes:
 *   neutral  `.greybox`     $gray250   (default)
 *   info     `.helpbox`     $blue50
 *   warning  `.alertbox`    $yellow200
 *   success  `.successbox`  $green50
 *   error    `.errorbox`    $red50
 *   accent   the card's own --rc-accent, for a note tied to its chart
 *
 * `icon` takes an <Icon> name. Every tone but `neutral` and `accent` supplies
 * its own by default — pass `icon` to override, or `icon={false}` to drop it.
 *
 * @param {'neutral'|'info'|'warning'|'success'|'error'|'accent'} tone
 * @param {string|false} icon  semantic Icon name; defaults per tone
 */
export function CardNote({ tone = 'neutral', icon, children }) {
  const glyph = icon === undefined ? NOTE_TONE_ICON[tone] : icon
  return (
    <div className={`rc-card-note rc-card-note--${tone}${glyph ? ' rc-card-note--with-icon' : ''}`}>
      {glyph && <Icon name={glyph} size={20} stroke={2} className="rc-card-note-icon" />}
      <div className="rc-card-note-body">{children}</div>
    </div>
  )
}
