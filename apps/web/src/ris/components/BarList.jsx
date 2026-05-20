import './BarList.css'

function BarListRow({
  prefix,
  icon,
  iconColor,
  label,
  labelColor,
  sublabel,
  value,
  max = 100,
  color = '#94A3B8',
  valueLabel,
  subValue,
  delta,
  showBar,
}) {
  const pct = value != null ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  const hasDelta = delta != null && delta !== 0
  const deltaPos = hasDelta && delta > 0

  const cls = [
    'bl-row',
    icon   != null ? 'bl-row--icon'   : '',
    prefix != null ? 'bl-row--prefix' : '',
    !showBar       ? 'bl-row--no-bar' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cls}>
      {prefix != null && <span className="bl-prefix">{prefix}</span>}
      {icon != null && (
        <span
          className="bl-icon"
          style={{
            '--bl-ic':    iconColor || color,
            '--bl-ic-bg': `color-mix(in srgb, ${iconColor || color} 10%, white)`,
          }}
        >
          {icon}
        </span>
      )}
      <div className="bl-meta">
        {label != null && (
          <span className="bl-label" style={labelColor ? { color: labelColor } : undefined}>
            {label}
          </span>
        )}
        {sublabel != null && <span className="bl-sublabel">{sublabel}</span>}
      </div>
      {showBar && (
        <div className="bl-track">
          <div className="bl-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
      )}
      {(valueLabel != null || hasDelta || subValue != null) && (
        <div className="bl-right">
          {valueLabel != null && <span className="bl-value">{valueLabel}</span>}
          {subValue != null && <span className="bl-subvalue">{subValue}</span>}
          {hasDelta && (
            <span className={`bl-delta bl-delta--${deltaPos ? 'pos' : 'neg'}`}>
              {deltaPos ? '↑' : '↓'}{Math.abs(delta)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Horizontal bar-list for ranked breakdowns, factor scores, and icon lists.
 *
 * Flat list:
 *   <BarList items={[{ label, value, max, color, valueLabel, delta? }]} />
 *
 * Grouped two-column (e.g. Intrinsic / Extrinsic):
 *   <BarList groups={[{ label, labelColor, items }]} layout="columns" />
 *
 * Icon list, no bar (e.g. Top Factor by grade band):
 *   <BarList items={[{ prefix, icon, iconColor, label, labelColor, sublabel }]} showBar={false} />
 *
 * Set labelWidth (px) to fix the meta column width and align bars across rows.
 */
export function BarList({
  items,
  groups,
  layout = 'stack',
  showBar = true,
  labelWidth,
  barAlign,      // 'start' (default) | 'center' — center the fill + drop track bg for a funnel taper
  barHeight,     // px override for bar thickness
}) {
  const style = {}
  if (labelWidth) style['--bl-meta-w'] = `${labelWidth}px`
  if (barHeight)  style['--bl-bar-h']  = `${barHeight}px`
  if (barAlign === 'center') {
    style['--bl-bar-justify'] = 'center'
    style['--bl-bar-bg']      = 'transparent'
    style['--bl-bar-radius']  = '0'
  }

  if (groups) {
    const nodes = []
    groups.forEach((g, i) => {
      if (i > 0) nodes.push(<div key={`d${i}`} className="bl-divider" />)
      nodes.push(
        <div key={`g${i}`} className="bl-group">
          {g.label && (
            <div className="bl-group-label" style={{ color: g.labelColor }}>
              {g.label}
            </div>
          )}
          {(g.items || []).map((item, j) => (
            <BarListRow key={j} {...item} showBar={showBar} />
          ))}
        </div>
      )
    })
    return (
      <div className="bl-cq">
        <div className={`bl bl--grouped bl--${layout}`} style={style}>
          {nodes}
        </div>
      </div>
    )
  }

  return (
    <div className="bl" style={style}>
      {(items || []).map((item, i) => (
        <BarListRow key={i} {...item} showBar={showBar} />
      ))}
    </div>
  )
}
