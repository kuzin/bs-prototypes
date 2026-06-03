import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { LEXILE_DATA, LEXILE_BY_GRADE, SCHOOLS } from '../data'
import { Hero } from '@components/Hero/Hero'
import { StatCard, ChartCard, CardNote } from '@components/Cards/Cards'
import { Table } from '@components/Table/Table'
import { Pill } from '@components/Pill/Pill'
import { SchoolCell } from './SchoolCell'
import { ChartLegend, NIVO_THEME, AXIS_BOTTOM, AXIS_LEFT } from '@components/charts/charts'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { SECTIONS } from '@components/ReadingHealth/ReadingHealth'

const ACCENT = '#7C3AED'
const ABOVE_COLOR = '#0DA7BC'
const BELOW_COLOR = '#E8866A'
const GROWTH_COLOR = '#16A97A'
const DECLINE_COLOR = '#E8866A'
const SKL_ICON = SECTIONS.find((s) => s.key === 'skills')?.icon

const signedL = (v) => `${v >= 0 ? '+' : ''}${v}L`

const STUCK_COLUMNS = [
  { key: 'school', label: 'School', render: (_, r) => <SchoolCell id={r.id} name={r.school} /> },
  { key: 'avgLexile', label: 'Avg Lexile', align: 'right', render: (v) => `${v}L` },
  {
    key: 'lexileGrowth',
    label: 'YTD Growth',
    align: 'center',
    render: (v) => (
      <Pill color={v < 0 ? '#DC2626' : '#D97706'} size="sm">
        {signedL(v)}
      </Pill>
    ),
  },
  {
    key: 'engagement',
    label: 'Engagement',
    align: 'right',
    render: (_, r) => {
      const inSchools = SCHOOLS.find((sc) => sc.id === r.id)
      return inSchools ? `${Math.round(r.lexileGrowth * 2.8 + 55)}%` : '—'
    },
  },
  {
    key: 'action',
    label: '',
    align: 'right',
    render: () => <button className="rc-card-drill">Review →</button>,
  },
]

export function DistrictLexile() {
  const stuckSchools = LEXILE_DATA.filter((s) => s.lexileGrowth < 0)

  return (
    <div className="rc-page" style={{ '--rc-accent': ACCENT }}>
      <Hero bucket="skills" />

      <div className="rc-stats-row">
        <StatCard label="District avg Lexile growth" value="+82L" footer="YTD vs. expected +65L" />
        <StatCard
          label="Schools declining"
          value={`${stuckSchools.length} of 6`}
          footer="negative Lexile growth"
          color="#DC2626"
        />
        <StatCard label="Top-growth school" value="Adams High" footer="+112L YTD" color="#15803D" />
        <StatCard
          label="Students flagged (stuck)"
          value="~1,490"
          footer="12% of total enrollment"
          color="#D97706"
        />
      </div>

      <div className="sv-grid">
        {/* Lexile scatter — full width */}
        <ChartCard
          title="Lexile Growth vs. Reading Volume — by School"
          subtitle="Bubble size = student count · above the line = growth, below = decline"
          icon={SKL_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
          footer={
            <ChartLegend
              items={[
                { color: GROWTH_COLOR, label: 'Growth' },
                { color: DECLINE_COLOR, label: 'Decline' },
              ]}
            />
          }
        >
          <div style={{ flex: 1, minHeight: 380 }}>
            <ResponsiveScatterPlot
              data={[
                {
                  id: 'Growth',
                  data: LEXILE_DATA.filter((d) => d.lexileGrowth >= 0).map((d) => ({
                    x: d.volume,
                    y: d.lexileGrowth,
                    school: d.school,
                    students: d.students,
                    id: d.id,
                  })),
                },
                {
                  id: 'Decline',
                  data: LEXILE_DATA.filter((d) => d.lexileGrowth < 0).map((d) => ({
                    x: d.volume,
                    y: d.lexileGrowth,
                    school: d.school,
                    students: d.students,
                    id: d.id,
                  })),
                },
              ]}
              ariaLabel="Lexile growth versus average books read per month, by school. Growth is shown in green above the zero line; decline in coral below."
              theme={NIVO_THEME}
              margin={{ top: 24, right: 28, bottom: 56, left: 72 }}
              xScale={{ type: 'linear', min: 15, max: 50 }}
              yScale={{ type: 'linear', min: -25, max: 130 }}
              colors={({ serieId }) => (serieId === 'Growth' ? GROWTH_COLOR : DECLINE_COLOR)}
              nodeSize={(d) => 2 * Math.sqrt(d.data.students / 65)}
              axisBottom={{
                ...AXIS_BOTTOM,
                legend: 'Avg books/month',
                legendOffset: 44,
                legendPosition: 'middle',
                tickValues: 5,
              }}
              axisLeft={{
                ...AXIS_LEFT,
                format: (v) => `${v}L`,
                legend: 'Lexile growth',
                legendOffset: -58,
                legendPosition: 'middle',
                tickValues: 6,
              }}
              enableGridX={false}
              markers={[
                {
                  axis: 'y',
                  value: 0,
                  lineStyle: { stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '5 4' },
                },
              ]}
              layers={[
                'grid',
                'axes',
                'markers',
                'nodes',
                ({ nodes }) => (
                  <g>
                    {nodes.map((node) => (
                      <text
                        key={node.id}
                        x={node.x}
                        y={node.y - node.size / 2 - 4}
                        textAnchor="middle"
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          fill: '#475569',
                          pointerEvents: 'none',
                        }}
                      >
                        {node.data.school.split(' ')[0]}
                      </text>
                    ))}
                  </g>
                ),
                'mesh',
              ]}
              tooltip={({ node }) => (
                <div
                  className="sdb-tooltip"
                  style={{ '--tip-accent': node.data.y >= 0 ? GROWTH_COLOR : DECLINE_COLOR }}
                >
                  <div className="sdb-tooltip-header">{node.data.school}</div>
                  <div
                    className="sdb-tooltip-series"
                    style={{ '--series-color': node.data.y >= 0 ? GROWTH_COLOR : DECLINE_COLOR }}
                  >
                    <div className="sdb-tooltip-row">
                      <span className="sdb-tooltip-dot" />
                      <span className="sdb-tooltip-label">Lexile change</span>
                      <span className="sdb-tooltip-val">{signedL(node.data.y)}</span>
                    </div>
                  </div>
                  <div className="sdb-tooltip-series" style={{ '--series-color': '#94A3B8' }}>
                    <div className="sdb-tooltip-row">
                      <span className="sdb-tooltip-dot" />
                      <span className="sdb-tooltip-label">Avg books/mo</span>
                      <span className="sdb-tooltip-val">{node.data.x}</span>
                    </div>
                  </div>
                  <div className="sdb-tooltip-context">
                    {node.data.students.toLocaleString()} students ·{' '}
                    {node.data.y >= 0 ? '✓ Growth' : '⚠ Decline'}
                  </div>
                </div>
              )}
            />
          </div>
        </ChartCard>

        {/* Stuck Lexile Alerts */}
        <ChartCard
          title="Stuck Lexile Alerts"
          subtitle="Schools below expected growth — needs follow-up"
          icon={SKL_ICON}
          accent={ACCENT}
          bodyPad="flush"
          span={2}
          footer={
            <CardNote tone="accent">
              Lincoln Elementary has shown 6 consecutive weeks with &lt;10L growth despite high
              engagement. Curriculum review recommended.
            </CardNote>
          }
        >
          <Table flush columns={STUCK_COLUMNS} rows={stuckSchools} getRowKey={(r) => r.id} />
        </ChartCard>

        {/* Lexile growth by grade */}
        <ChartCard
          title="Lexile Growth by Grade — District-Wide"
          subtitle="Actual vs. expected growth per grade level"
          icon={SKL_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
          footer={
            <ChartLegend
              items={[
                { color: ABOVE_COLOR, label: 'Met/exceeded expected' },
                { color: BELOW_COLOR, label: 'Below expected' },
                { color: '#64748B', label: 'Expected baseline' },
              ]}
            />
          }
        >
          <TrendChart
            type="bar"
            data={LEXILE_BY_GRADE}
            xKey="grade"
            yDomain={[0, 140]}
            height="lg"
            yAxisHidden
            tooltipFormatter={(v) => `+${v}L`}
            xPadding={{ left: 12, right: 12 }}
            series={[
              {
                key: 'growth',
                name: 'Actual growth',
                color: ABOVE_COLOR,
                colorFn: (d) => (d.growth >= d.expected ? ABOVE_COLOR : BELOW_COLOR),
              },
              { key: 'expected', name: 'Expected growth', color: '#E2E8F0' },
            ]}
          />
        </ChartCard>
      </div>
    </div>
  )
}
