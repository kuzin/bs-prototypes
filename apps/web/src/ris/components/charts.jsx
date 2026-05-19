// Shared Nivo chart helpers used by SchoolDashboard, Motivation, and other pages.
// Pairs with .sdb-tooltip / .sdb-legend styles in SchoolDashboard.css.

export const NIVO_THEME = {
  axis: {
    ticks: {
      line: { stroke: 'transparent' },
      text: { fontSize: 13, fill: '#94A3B8' },
    },
    domain: { line: { stroke: '#EDE8E3' } },
  },
  grid: {
    line: { stroke: '#EDE8E3', strokeDasharray: '3 3' },
  },
}

export const LINE_MARGIN = { top: 16, right: 28, bottom: 36, left: 52 }
export const AXIS_BOTTOM = { tickSize: 0, tickPadding: 10 }
export const AXIS_LEFT   = { tickSize: 0, tickPadding: 8 }

function deltaParts(curr, prev, { inverse = false } = {}) {
  if (prev == null) return { delta: null, cls: 'neutral', arrow: null }
  const delta = curr - prev
  if (delta === 0) return { delta, cls: 'neutral', arrow: '→' }
  const good = inverse ? delta < 0 : delta > 0
  return { delta, cls: good ? 'up' : 'down', arrow: delta > 0 ? '▲' : '▼' }
}

export function SliceTooltip({ slice, allData, seriesMap, accent, inverseSeries = [], formatY, formatDelta, context, deltaLabel = 'vs' }) {
  const month = slice.points[0]?.data.x
  const monthIdx = allData ? allData.findIndex(d => d.month === month) : -1
  const prev = monthIdx > 0 ? allData[monthIdx - 1] : null

  return (
    <div className="sdb-tooltip" style={{ '--tip-accent': accent }}>
      <div className="sdb-tooltip-header">{month}</div>
      {slice.points.map(pt => {
        const field = seriesMap?.[pt.serieId]
        const prevVal = field && prev ? prev[field] : null
        const isInverse = inverseSeries.includes(pt.serieId)
        const { delta, cls, arrow } = deltaParts(pt.data.y, prevVal, { inverse: isInverse })
        return (
          <div key={pt.id} className="sdb-tooltip-series" style={{ '--series-color': pt.serieColor }}>
            <div className="sdb-tooltip-row">
              <span className="sdb-tooltip-dot" />
              <span className="sdb-tooltip-label">{pt.serieId}</span>
              <span className="sdb-tooltip-val">{formatY ? formatY(pt.data.y) : pt.data.y}</span>
            </div>
            {delta != null && (
              <div className={`sdb-tooltip-delta sdb-tooltip-delta--${cls}`}>
                <span className="sdb-tooltip-arrow">{arrow}</span>
                <span>{formatDelta ? formatDelta(delta) : (delta > 0 ? `+${delta}` : delta)} {deltaLabel} {prev.month}</span>
              </div>
            )}
          </div>
        )
      })}
      {context && <div className="sdb-tooltip-context">{context(slice)}</div>}
    </div>
  )
}

export function GradeTooltip({ data, accent }) {
  const delta = data.growth - data.expected
  const isAbove = delta >= 0
  const cls = delta === 0 ? 'neutral' : isAbove ? 'up' : 'down'
  const arrow = delta === 0 ? '→' : isAbove ? '▲' : '▼'
  return (
    <div className="sdb-tooltip" style={{ '--tip-accent': accent }}>
      <div className="sdb-tooltip-header">{data.grade} grade</div>
      <div className="sdb-tooltip-series" style={{ '--series-color': accent }}>
        <div className="sdb-tooltip-row">
          <span className="sdb-tooltip-dot" />
          <span className="sdb-tooltip-label">Actual growth</span>
          <span className="sdb-tooltip-val">+{data.growth}L</span>
        </div>
      </div>
      <div className="sdb-tooltip-series" style={{ '--series-color': '#CBD5E1' }}>
        <div className="sdb-tooltip-row">
          <span className="sdb-tooltip-dot" />
          <span className="sdb-tooltip-label">Expected</span>
          <span className="sdb-tooltip-val">+{data.expected}L</span>
        </div>
      </div>
      <div className={`sdb-tooltip-delta sdb-tooltip-delta--${cls}`} style={{ marginLeft: 0, marginTop: 8, paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
        <span className="sdb-tooltip-arrow">{arrow}</span>
        <span>{isAbove ? '+' : ''}{delta}L {isAbove ? 'above' : 'below'} target</span>
      </div>
    </div>
  )
}

// Rich bar tooltip — value per key, optional MoM delta vs `allData`/`indexBy`, optional context line.
export function BarTooltip({
  data, indexValue, accent,
  format = v => v, formatDelta,
  keys, labels = {},
  allData, indexBy = 'month',
  inverseKeys = [],
  context,
  deltaLabel = 'vs',
}) {
  const rowIdx = allData ? allData.findIndex(d => d[indexBy] === indexValue) : -1
  const prev = rowIdx > 0 ? allData[rowIdx - 1] : null
  return (
    <div className="sdb-tooltip" style={{ '--tip-accent': accent }}>
      <div className="sdb-tooltip-header">{indexValue}</div>
      {keys.map(key => {
        const val = data[key]
        const prevVal = prev ? prev[key] : null
        const isInverse = inverseKeys.includes(key)
        let cls = 'neutral', arrow = null, delta = null
        if (prevVal != null && val != null) {
          delta = val - prevVal
          if (delta === 0) { arrow = '→' }
          else {
            const good = isInverse ? delta < 0 : delta > 0
            cls = good ? 'up' : 'down'
            arrow = delta > 0 ? '▲' : '▼'
          }
        }
        const seriesColor = labels[key]?.color || accent
        return (
          <div key={key} className="sdb-tooltip-series" style={{ '--series-color': seriesColor }}>
            <div className="sdb-tooltip-row">
              <span className="sdb-tooltip-dot" />
              <span className="sdb-tooltip-label">{labels[key]?.label || key}</span>
              <span className="sdb-tooltip-val">{format(val)}</span>
            </div>
            {delta != null && (
              <div className={`sdb-tooltip-delta sdb-tooltip-delta--${cls}`}>
                <span className="sdb-tooltip-arrow">{arrow}</span>
                <span>{formatDelta ? formatDelta(delta) : (delta > 0 ? `+${delta}` : delta)} {deltaLabel} {prev[indexBy]}</span>
              </div>
            )}
          </div>
        )
      })}
      {context && <div className="sdb-tooltip-context">{context(data)}</div>}
    </div>
  )
}

export function ChartLegend({ items }) {
  return (
    <div className="sdb-legend">
      {items.map(({ color, label, dashed }) => (
        <span key={label} className="sdb-legend-item">
          <span
            className="sdb-legend-swatch"
            style={dashed
              ? { backgroundImage: `repeating-linear-gradient(to right, ${color} 0, ${color} 4px, transparent 4px, transparent 8px)` }
              : { background: color }
            }
          />
          {label}
        </span>
      ))}
    </div>
  )
}
