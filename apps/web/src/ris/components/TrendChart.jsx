import {
  ResponsiveContainer, AreaChart, LineChart, BarChart,
  Area, Line, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts'
import {
  RCHART_MARGIN, RCHART_TICK, RCHART_GRID, RCHART_TOOLTIP, RCHART_X_PADDING,
  CHART_H,
} from './charts'

/**
 * Standardized Recharts trend chart with locked-in margins, tick fonts,
 * tooltip styling, axis padding, and height. The single place where the
 * chart look is defined — use this for every Area/Line/Bar chart in the
 * app instead of writing <AreaChart>/<LineChart>/<BarChart> by hand.
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
 *   colorFn(row)   — per-row bar coloring (replaces <Cell> boilerplate)
 *   yAxisId        — 'left' | 'right' when `yRight` is set
 *
 * Custom tooltip:
 *   Pass `tooltipContent={({ payload }) => <YourTooltip ... />}` to render a
 *   custom component. The first payload item's `payload` field is the full
 *   data row. Or pass `tooltipFormatter` for a simple value mapper.
 */
export function TrendChart({
  type = 'area',
  layout = 'vertical',   // 'vertical' (default — value axis on Y, category on X) | 'horizontal' (swap)
  data,
  xKey = 'month',        // category field. In horizontal layout this becomes the Y axis dataKey.
  yDomain,               // value-axis domain
  yUnit,                 // value-axis unit suffix
  yTickCount,
  yTicks,                // explicit value-axis tick values (overrides tickCount)
  yRight,                // optional { domain, unit, tickCount } for a right-side Y axis (vertical layout only)
  yAxisHidden = false,   // hide the Y axis tick labels and axis line (vertical layout)
  height = 'md',
  series,
  tooltipFormatter,
  tooltipContent,        // ({ payload }) => JSX — wins over tooltipFormatter when set
  barCategoryGap,
  barGap,
  xPadding = RCHART_X_PADDING,
  leftMargin,            // override left margin (horizontal layout often needs more room for category labels)
}) {
  const h = typeof height === 'string' ? CHART_H[height] : height
  const ChartType = type === 'area' ? AreaChart : type === 'bar' ? BarChart : LineChart
  const isHorizontal = layout === 'horizontal'

  // Recharts uses opposite naming: layout="vertical" actually draws bars
  // horizontally. We expose Nivo-style naming ('horizontal' = bars run
  // left-to-right) and translate here.
  const rechartsLayout = isHorizontal ? 'vertical' : 'horizontal'

  // Stable gradient IDs per series for area charts.
  const gradients = type === 'area'
    ? series.map(s => ({
        id: `tc-grad-${s.key}`,
        color: s.color,
        opacity: s.fillOpacity ?? 0.2,
      }))
    : []

  // Recharts stacks the left margin AND the YAxis width on top of each
  // other to position the plot. So for a horizontal-bar chart where the
  // caller asks for a `leftMargin` gutter, we split that gutter between
  // a tiny chart margin (4px) and the YAxis width (leftMargin - 4). For
  // vertical charts the chart margin is the standard RCHART_MARGIN.left
  // (-32) so the plot hugs the SVG's left edge — the YAxis (default 60
  // wide) absorbs the offset so labels stay in positive SVG coords.
  // When `yAxisHidden` is true there's no Y axis to absorb the offset,
  // so we use a 0 left margin to keep the plot inside the SVG bounds.
  const margin = isHorizontal && leftMargin != null
    ? { ...RCHART_MARGIN, left: 4 }
    : leftMargin != null
      ? { ...RCHART_MARGIN, left: leftMargin }
      : yAxisHidden
        ? { ...RCHART_MARGIN, left: 0 }
        : RCHART_MARGIN

  // Build the axis pair. In horizontal layout the category axis is Y and
  // the value axis is X (numeric); in vertical layout it's the reverse.
  // For vertical layouts we pin the value-Y axis to `width: 32` so the
  // tick-label gutter is the same on every chart regardless of how wide
  // the largest label happens to render (otherwise Recharts auto-grows
  // the gutter and charts with wider labels — e.g. "140L" — appear to
  // have a bigger left margin than charts with shorter labels).
  const valueAxisProps = {
    type: 'number',
    domain: yDomain,
    unit: yUnit,
    tick: RCHART_TICK,
    tickCount: yTickCount,
    ticks: yTicks,
  }
  const categoryAxisProps = {
    type: 'category',
    dataKey: xKey,
    tick: RCHART_TICK,
    padding: xPadding,
  }

  return (
    <ResponsiveContainer width="100%" height={h}>
      <ChartType
        data={data}
        layout={rechartsLayout}
        margin={margin}
        barCategoryGap={barCategoryGap}
        barGap={barGap}
      >
        {gradients.length > 0 && (
          <defs>
            {gradients.map(g => (
              <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={g.color} stopOpacity={g.opacity} />
                <stop offset="95%" stopColor={g.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
        )}
        <CartesianGrid
          {...RCHART_GRID}
          horizontal={!isHorizontal}
          vertical={isHorizontal}
        />
        {isHorizontal ? (
          <>
            <XAxis {...valueAxisProps} />
            {/* `leftMargin - 4` matches the 4px chart margin we set
                above so the total left gutter (YAxis + margin) equals
                what the caller asked for. */}
            <YAxis {...categoryAxisProps} width={leftMargin ? leftMargin - 4 : 60} />
          </>
        ) : (
          <>
            <XAxis {...categoryAxisProps} />
            <YAxis
              {...valueAxisProps}
              hide={yAxisHidden}
              {...(yAxisHidden ? { width: 0 } : {})}
              yAxisId={yRight ? 'left' : undefined}
            />
            {yRight && (
              <YAxis
                yAxisId="right"
                orientation="right"
                width={20}
                domain={yRight.domain}
                tick={RCHART_TICK}
                unit={yRight.unit}
                tickCount={yRight.tickCount}
              />
            )}
          </>
        )}
        <Tooltip
          cursor={type === 'bar' ? false : undefined}
          formatter={tooltipFormatter}
          content={tooltipContent}
          contentStyle={RCHART_TOOLTIP}
        />
        {series.map((s, i) => {
          const strokeWidth = s.strokeWidth ?? (i === 0 ? 2.5 : 1.5)
          const strokeDasharray = s.dashed ? '4 3' : undefined
          const yAxisId = (!isHorizontal && yRight) ? (s.yAxisId || 'left') : undefined
          if (type === 'area') {
            return (
              <Area
                key={s.key}
                yAxisId={yAxisId}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                fill={s.fillOpacity === 0 ? 'none' : `url(#tc-grad-${s.key})`}
                dot={false}
              />
            )
          }
          if (type === 'bar') {
            // Bar corner radius differs by orientation so the rounded
            // edges are always on the "value end" of the bar.
            const radius = isHorizontal ? [0, 3, 3, 0] : [3, 3, 0, 0]
            return (
              <Bar
                key={s.key}
                yAxisId={yAxisId}
                dataKey={s.key}
                name={s.name}
                fill={s.color}
                radius={radius}
              >
                {/* Per-row coloring: pass `colorFn(row) => color` on a series. */}
                {s.colorFn && data.map((row, j) => (
                  <Cell key={j} fill={s.colorFn(row)} />
                ))}
              </Bar>
            )
          }
          return (
            <Line
              key={s.key}
              yAxisId={yAxisId}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              dot={false}
            />
          )
        })}
      </ChartType>
    </ResponsiveContainer>
  )
}
