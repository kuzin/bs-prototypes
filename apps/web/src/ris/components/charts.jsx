// Shared Nivo chart helpers used by SchoolDashboard, Motivation, and other pages.
// Pairs with .sdb-tooltip / .sdb-legend styles in SchoolDashboard.css.
// Tooltips are hidden on mobile via CSS — too cramped to be useful.

export const NIVO_THEME = {
  axis: {
    ticks: {
      line: { stroke: 'transparent' },
      text: { fontSize: 13, fill: '#94A3B8', fontFamily: 'inherit' },
    },
    legend: {
      text: {
        fontSize: 11,
        fontWeight: 700,
        fill: '#64748B',
        fontFamily: 'inherit',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      },
    },
    domain: { line: { stroke: '#EDE8E3' } },
  },
  grid: {
    line: { stroke: '#EDE8E3', strokeDasharray: '3 3' },
  },
}

// Nivo margins — tuned to match the effective plot width of Recharts
// charts (which use { left: -32, right: 8 } against a 60px-wide default
// Y axis = 28px effective left margin). Keep the bottom big enough for
// X axis labels. Top matches RCHART_MARGIN.top so Nivo line charts have
// the same breathing room as Recharts TrendCharts.
export const LINE_MARGIN = { top: 16, right: 16, bottom: 32, left: 44 }
export const BAR_MARGIN  = { top: 16, right: 16, bottom: 32, left: 44 }
export const AXIS_BOTTOM = { tickSize: 0, tickPadding: 10 }
export const AXIS_LEFT   = { tickSize: 0, tickPadding: 8 }

// ── Shared Recharts presets ──────────────────────────────────────────────
// Use these in every Recharts <AreaChart|LineChart|BarChart> so margins,
// tick fonts, and tooltips look identical across the app.

export const RCHART_MARGIN  = { top: 16, right: 8, left: -20, bottom: 0 }
export const RCHART_TICK    = { fontSize: 13, fill: '#94A3B8' }
export const RCHART_GRID    = { strokeDasharray: '3 3', stroke: '#F1F5F9' }
export const RCHART_TOOLTIP = { fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0' }
export const RCHART_X_PADDING = { left: 0, right: 0 }

// Standard chart heights. Use these instead of one-off numbers so cards
// in the same grid row line up.
export const CHART_H = {
  sm: 180,   // inside a card that also has mini-stats above
  md: 240,   // single-column trend chart
  lg: 320,   // span=2 trend chart
  xl: 380,   // scatter / span=2 chart with axis legends
}

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
