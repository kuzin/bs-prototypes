import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
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
 *   color="#F26430"
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
/**
 * The ring a progress figure wears in its tile's icon slot —
 * `fundraisers/overview/_progress_card`, `programs/_overview_list_goals`.
 *
 * It fills the slot it is given, so a caller sizes it by sizing `.rc-stat-ico`.
 * A drawn graphic rather than a glyph, which is why it is inline SVG: the
 * percentage *is* the reading, and a number in a footer is not the same thing
 * as an arc you can take in at a glance.
 *
 *   <StatCard icon={<ProgressRing pct={62} />} value="620" unit="/1,000" … />
 */
export function ProgressRing({ pct, done = false }) {
  return (
    <span className={`rc-ring${done ? ' is-done' : ''}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="rc-ring-track" cx="50" cy="50" r="44" />
        <circle
          className="rc-ring-fill"
          cx="50"
          cy="50"
          r="44"
          pathLength="100"
          strokeDasharray={`${pct} 100`}
        />
      </svg>
      <span className="rc-ring-pct">{pct}%</span>
    </span>
  )
}

export function StatCard({
  value,
  unit,
  label,
  footer,
  footerColor,
  color,
  icon,
  /* `{ value, max }` — the figure drawn again as a bar under the label, for a
     tile whose number is a position in something rather than a total. A ring in
     the mark's slot says the same thing, but small and to one side; a bar says
     it at the tile's full width, which is what "how far through" wants. */
  progress,
  trend,
  action,
  onClick,
}) {
  // Explicit `color` wins by setting --rc-stat-color inline. Otherwise the
  // card inherits --rc-accent from the page / enclosing ChartCard via the
  // CSS variable cascade — see .rc-stat in Cards.css. The tile's fill is a light
  // tint of that same one authored hex, so a caller still states one colour.
  const style = color ? { '--rc-stat-color': color } : undefined
  // A tile that goes somewhere puts the whole card in the button, so the hit
  // area is the card rather than the four words in it.
  const Tag = onClick ? 'button' : 'div'
  /* A name draws the house glyph rather than whatever the caller imported —
     Plumpy on an admin surface, the stroked `<Icon>` only where the pack has
     nothing, which is the contract `RowAction` already keeps. A node is still
     accepted for the reader-facing cards, whose icon language is the stroked
     one by design. */
  const glyph = typeof icon === 'string' ? <PlumpyIcon name={icon} size={22} /> : icon

  return (
    <Tag
      className={`rc-stat${onClick ? ' rc-stat--hit' : ''}${trend ? ' rc-stat--trend' : ''}`}
      style={style}
      type={onClick ? 'button' : undefined}
      onClick={onClick}
    >
      {glyph && <span className="rc-stat-ico">{glyph}</span>}
      <div className="rc-stat-main">
        <div className="rc-stat-val">
          {value}
          {unit && (
            // "3 Days" is a figure and a word, and wants the row's gap. "/40"
            // is a denominator, and "26 /40" is not a fraction — it closes up
            // and drops a rung, so the figure stays the figure.
            <span
              className={`rc-stat-unit${String(unit).startsWith('/') ? ' rc-stat-unit--denom' : ''}`}
            >
              {unit}
            </span>
          )}
        </div>
        <div className="rc-stat-lbl">{label}</div>
        {progress && (
          <span className="rc-stat-bar">
            <span
              className="rc-stat-bar-fill"
              style={{
                width: `${Math.min(100, Math.round(((progress.value || 0) / (progress.max || 1)) * 100))}%`,
              }}
            />
          </span>
        )}
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
      {trend && (
        <TrendChip {...trend} className={`rc-stat-trend ${trend.className ?? ''}`.trim()} />
      )}
    </Tag>
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
 *   accent="#F26430"
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
