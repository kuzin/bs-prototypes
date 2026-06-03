import { useId } from 'react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { NIVO_THEME, AXIS_BOTTOM, AXIS_LEFT, CHART_H } from '@components/charts/charts'

/**
 * Standardized Nivo trend chart with locked-in margins, tick fonts, tooltip
 * styling, and height. The single place where the trend-chart look is defined
 * — use this for every Area/Line/Bar chart in the app instead of writing
 * <ResponsiveLine>/<ResponsiveBar> by hand.
 *
 * Line/area series are rendered through a custom Nivo layer so each series can
 * carry its own dashed pattern, stroke width, and area-gradient opacity, and
 * so a right-hand Y axis can use a second scale (Nivo has no native dual axis).
 * Bars use a stock <ResponsiveBar>; right-axis bar series are pre-scaled into
 * the left domain so they render and hit-test natively, with a custom layer
 * drawing the right axis.
 *
 * Vertical bars / line / area:
 *   <TrendChart
 *     type="bar"
 *     data={STREAK_DATA}
 *     xKey="milestone"
 *     yDomain={[0, 100]}
 *     yUnit="%"
 *     height="lg"
 *     series={[
 *       { key: 'school',   name: 'School',       color: '#16A97A' },
 *       { key: 'district', name: 'District avg', color: '#CBD5E1' },
 *     ]}
 *   />
 *
 * Horizontal bars (category list on Y, value axis on X):
 *   <TrendChart
 *     type="bar"
 *     layout="horizontal"
 *     data={ranked}
 *     xKey="name"               // category field (renders on Y)
 *     yDomain={[0, 100]}        // applies to the value axis
 *     yUnit="%"
 *     leftMargin={128}          // room for long category labels
 *     series={[
 *       { key: 'completionRate', name: 'Completion', color: '#1D4ED8', colorFn: r => r.isThis ? school.color : '#CBD5E1' },
 *     ]}
 *   />
 *
 * Series shape:
 *   key            — data field
 *   name           — display name (tooltip / legend)
 *   color          — stroke color (line/area) or fill color (bar)
 *   dashed         — render as a dashed line / area stroke
 *   strokeWidth    — defaults to 2.5 for the first series, 1.5 for others
 *   fillOpacity    — area gradient opacity (default 0.2). Pass 0 for line-only.
 *   colorFn(row)   — per-row bar coloring
 *   yAxisId        — 'left' | 'right' when `yRight` is set
 *
 * Custom tooltip:
 *   Pass `tooltipContent={({ payload }) => <YourTooltip ... />}` to render a
 *   custom component. `payload` matches Recharts' shape — each item has
 *   `{ payload, value, name, color, dataKey }` and the first item's `payload`
 *   is the full data row. Or pass `tooltipFormatter` for a simple value mapper
 *   with Recharts semantics: `(value, name) => string | [value, name]`.
 */
export function TrendChart({
  type = 'area',
  layout = 'vertical', // 'vertical' (default — value axis on Y, category on X) | 'horizontal' (swap)
  data,
  xKey = 'month', // category field. In horizontal layout this becomes the Y axis dataKey.
  yDomain, // value-axis domain [min, max]
  yUnit, // value-axis unit suffix
  yTickCount,
  yTicks, // explicit value-axis tick values (overrides tickCount)
  yRight, // optional { domain, unit, tickCount } for a right-side Y axis (vertical layout only)
  yAxisHidden = false, // hide the Y axis tick labels and axis line (vertical layout)
  height = 'md',
  series,
  tooltipFormatter,
  tooltipContent, // ({ payload }) => JSX — wins over tooltipFormatter when set
  barCategoryGap, // accepted for API compatibility (unused by Nivo grouping)
  barGap, // accepted for API compatibility (unused by Nivo grouping)
  xPadding, // accepted for API compatibility (Nivo handles edge insets via band padding)
  leftMargin, // override left margin (horizontal layout often needs more room for category labels)
}) {
  void barCategoryGap
  void barGap
  void xPadding
  const h = typeof height === 'string' ? CHART_H[height] : height
  const isHorizontal = layout === 'horizontal'
  const hasRight = !isHorizontal && !!yRight
  const accent = series[0]?.color
  const gid = useId()

  // value formatter with Recharts semantics: (value, name) => string | [value, name]
  const applyFmt = (value, name, isRight) => {
    if (tooltipFormatter) {
      const r = tooltipFormatter(value, name)
      return Array.isArray(r) ? r : [r, name]
    }
    const unit = (isRight ? yRight?.unit : yUnit) ?? ''
    return [`${value}${unit}`, name]
  }

  const rowByX = new Map(data.map((r) => [r[xKey], r]))

  const wrapStyle = { flex: '1 1 auto', width: '100%', minHeight: h }

  // ── Bar ────────────────────────────────────────────────────────────────
  if (type === 'bar') {
    const keys = series.map((s) => s.key)
    const cfgByKey = new Map(series.map((s) => [s.key, s]))

    // Nivo bars always grow from a value of 0, so to reproduce Recharts' zoomed
    // (non-zero-baseline) bars we shift every value down by the domain minimum
    // and render on a [0, span] scale. Right-axis series are mapped onto the
    // same span by fraction so they line up with the custom right axis. The
    // original values are looked up by index for tooltips and colorFn.
    const shift = yDomain ? yDomain[0] : 0
    const span = yDomain ? yDomain[1] - yDomain[0] : null
    const barData = yDomain
      ? data.map((row) => {
          const r = { ...row }
          series.forEach((s) => {
            r[s.key] =
              hasRight && s.yAxisId === 'right'
                ? ((row[s.key] - yRight.domain[0]) / (yRight.domain[1] - yRight.domain[0])) * span
                : row[s.key] - shift
          })
          return r
        })
      : data

    const gridVals = yTicks ? yTicks.map((t) => t - shift) : (yTickCount ?? 5)
    const valueAxis = {
      tickSize: 0,
      tickPadding: isHorizontal ? 10 : 8,
      format: (v) => `${v + shift}${yUnit ?? ''}`,
      tickValues: gridVals,
    }
    const categoryAxis = { tickSize: 0, tickPadding: 10 }

    const margin = isHorizontal
      ? { top: 16, right: 28, bottom: 32, left: leftMargin ?? 44 }
      : {
          top: 16,
          right: hasRight ? 44 : 16,
          bottom: 32,
          left: yAxisHidden ? 8 : longUnit(yUnit) ? 56 : 44,
        }

    const layers = ['grid', 'axes', 'bars', 'markers', 'legends']
    if (hasRight) layers.push(makeRightAxis(yRight.domain, yRight.unit))

    return (
      <div style={wrapStyle}>
        <ResponsiveBar
          data={barData}
          keys={keys}
          indexBy={xKey}
          layout={isHorizontal ? 'horizontal' : 'vertical'}
          groupMode="grouped"
          theme={NIVO_THEME}
          margin={margin}
          padding={0.3}
          innerPadding={keys.length > 1 ? 2 : 0}
          valueScale={{ type: 'linear', min: yDomain ? 0 : 'auto', max: yDomain ? span : 'auto' }}
          indexScale={{ type: 'band', round: true }}
          borderRadius={3}
          colors={({ id, data: row }) => {
            const cfg = cfgByKey.get(id)
            const orig = rowByX.get(row[xKey]) ?? row
            return cfg?.colorFn ? cfg.colorFn(orig) : cfg?.color
          }}
          enableLabel={false}
          enableGridX={isHorizontal}
          enableGridY={!isHorizontal}
          gridXValues={isHorizontal ? gridVals : undefined}
          gridYValues={!isHorizontal ? gridVals : undefined}
          axisBottom={isHorizontal ? valueAxis : categoryAxis}
          axisLeft={isHorizontal ? categoryAxis : yAxisHidden ? null : valueAxis}
          axisRight={null}
          layers={layers}
          isInteractive
          animate={false}
          tooltip={({ indexValue }) => {
            const orig = rowByX.get(indexValue) ?? {}
            if (tooltipContent) {
              const payload = series.map((s) => ({
                payload: orig,
                value: orig[s.key],
                name: s.name,
                color: s.color,
                dataKey: s.key,
              }))
              return tooltipContent({ payload, label: indexValue })
            }
            const rows = series.map((s) => {
              const [v, n] = applyFmt(orig[s.key], s.name, hasRight && s.yAxisId === 'right')
              return { name: n, value: v, color: s.color }
            })
            return <TcTooltip header={indexValue} rows={rows} accent={accent} />
          }}
        />
      </div>
    )
  }

  // ── Line / Area ──────────────────────────────────────────────────────────
  const withArea = type === 'area'

  // Per-series render config, keyed by display name (= Nivo serie id).
  const cfgByName = new Map(
    series.map((s, i) => [
      s.name,
      {
        key: s.key,
        color: s.color,
        width: s.strokeWidth ?? (i === 0 ? 2.5 : 1.5),
        dashed: !!s.dashed,
        fillOpacity: s.fillOpacity ?? 0.2,
        isRight: hasRight && s.yAxisId === 'right',
        gradId: `${gid}-grad-${i}`,
      },
    ]),
  )

  const nivoData = series.map((s) => ({
    id: s.name,
    color: s.color,
    data: data.map((row) => ({ x: row[xKey], y: row[s.key] })),
  }))

  // Custom layer: draws every series' area fill + stroke, honoring per-series
  // dash/width/opacity and routing right-axis series through a second scale.
  const SeriesLayer = ({ series: computed, lineGenerator, innerHeight }) => {
    const rightY = hasRight ? makeScale(yRight.domain, innerHeight) : null
    return (
      <g>
        <defs>
          {withArea &&
            series.map((s, i) => {
              const cfg = cfgByName.get(s.name)
              if (cfg.fillOpacity === 0) return null
              return (
                <linearGradient key={i} id={cfg.gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={cfg.fillOpacity} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              )
            })}
        </defs>
        {computed.map((serie) => {
          const cfg = cfgByName.get(serie.id)
          if (!cfg) return null
          const points = serie.data.map((d) =>
            cfg.isRight ? { x: d.position.x, y: rightY(d.data.y) } : d.position,
          )
          if (points.length === 0) return null
          const linePath = lineGenerator(points)
          const showFill = withArea && cfg.fillOpacity !== 0
          const baseY = innerHeight
          const areaPath = showFill
            ? `${linePath} L ${points[points.length - 1].x},${baseY} L ${points[0].x},${baseY} Z`
            : null
          return (
            <g key={serie.id}>
              {areaPath && <path d={areaPath} fill={`url(#${cfg.gradId})`} stroke="none" />}
              <path
                d={linePath}
                fill="none"
                stroke={cfg.color}
                strokeWidth={cfg.width}
                strokeDasharray={cfg.dashed ? '4 3' : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )
        })}
      </g>
    )
  }

  const layers = ['grid', 'axes', SeriesLayer, 'crosshair', 'slices', 'mesh']
  if (hasRight) layers.push(makeRightAxis(yRight.domain, yRight.unit))

  const margin = {
    top: 16,
    right: hasRight ? 44 : 16,
    bottom: 32,
    left: yAxisHidden ? 8 : longUnit(yUnit) ? 56 : 44,
  }

  return (
    <div style={wrapStyle}>
      <ResponsiveLine
        data={nivoData}
        theme={NIVO_THEME}
        margin={margin}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: yDomain ? yDomain[0] : 'auto',
          max: yDomain ? yDomain[1] : 'auto',
        }}
        curve="monotoneX"
        colors={(d) => d.color}
        enablePoints={false}
        enableGridX={false}
        gridYValues={yTicks ?? yTickCount ?? 5}
        axisBottom={AXIS_BOTTOM}
        axisLeft={
          yAxisHidden
            ? null
            : {
                ...AXIS_LEFT,
                format: yUnit ? (v) => `${v}${yUnit}` : undefined,
                tickValues: yTicks ?? yTickCount ?? 5,
              }
        }
        layers={layers}
        animate={false}
        enableSlices="x"
        sliceTooltip={({ slice }) => {
          const header = slice.points[0]?.data?.x
          if (tooltipContent) {
            const payload = slice.points.map((p) => {
              const cfg = cfgByName.get(p.serieId)
              return {
                payload: rowByX.get(p.data.x),
                value: p.data.y,
                name: p.serieId,
                color: p.serieColor,
                dataKey: cfg?.key,
              }
            })
            return tooltipContent({ payload, label: header })
          }
          const rows = slice.points.map((p) => {
            const cfg = cfgByName.get(p.serieId)
            const [v, n] = applyFmt(p.data.y, p.serieId, cfg?.isRight)
            return { name: n, value: v, color: p.serieColor }
          })
          return <TcTooltip header={header} rows={rows} accent={accent} />
        }}
      />
    </div>
  )
}

// Default tooltip — matches the shared .sdb-tooltip look (defined in
// SchoolDashboard.css, loaded app-wide) and is recognized by useTooltipFlip.
function TcTooltip({ header, rows, accent }) {
  return (
    <div className="sdb-tooltip" style={{ '--tip-accent': accent }}>
      <div className="sdb-tooltip-header">{header}</div>
      {rows.map((r, i) => (
        <div key={i} className="sdb-tooltip-series" style={{ '--series-color': r.color }}>
          <div className="sdb-tooltip-row">
            <span className="sdb-tooltip-dot" />
            <span className="sdb-tooltip-label">{r.name}</span>
            <span className="sdb-tooltip-val">{r.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Linear value→pixel scale for a manually-managed right axis (top = 0).
function makeScale([min, max], innerHeight) {
  return (v) => innerHeight - ((v - min) / (max - min)) * innerHeight
}

// d3-style "nice" ticks within [min, max] without pulling in d3-scale.
function ticksFor([min, max], count = 5) {
  if (!(max > min)) return [min]
  const step0 = (max - min) / count
  const mag = Math.pow(10, Math.floor(Math.log10(step0)))
  const norm = step0 / mag
  const step = (norm >= 5 ? 5 : norm >= 2 ? 2 : 1) * mag
  const start = Math.ceil(min / step) * step
  const out = []
  for (let v = start; v <= max + step * 1e-6; v += step) out.push(Math.round(v * 1e6) / 1e6)
  return out
}

// Custom Nivo layer drawing a second (right-hand) Y axis with its own domain.
function makeRightAxis(domain, unit) {
  const RightAxis = ({ innerWidth, innerHeight }) => {
    const y = makeScale(domain, innerHeight)
    return (
      <g>
        <line x1={innerWidth} x2={innerWidth} y1={0} y2={innerHeight} stroke="#EDE8E3" />
        {ticksFor(domain).map((t) => (
          <text
            key={t}
            x={innerWidth + 8}
            y={y(t)}
            textAnchor="start"
            dominantBaseline="central"
            style={{ fontSize: 13, fill: '#64748B', fontFamily: 'inherit' }}
          >
            {t}
            {unit ?? ''}
          </text>
        ))}
      </g>
    )
  }
  return RightAxis
}

// Multi-character units (" min", " bks", " pts") need a wider left gutter than
// the single-char "%" / "L" the default 44px margin is tuned for.
function longUnit(unit) {
  return !!unit && unit.trim().length >= 3
}
