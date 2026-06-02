import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { LEXILE_DATA, LEXILE_BY_GRADE, SCHOOLS } from '../data'
import { Hero } from '@components/Hero/Hero'
import { StatCard, ChartCard, CardNote } from '@components/Cards/Cards'
import { Table } from '@components/Table/Table'
import { Pill } from '@components/Pill/Pill'
import { SchoolCell } from './SchoolCell'
import { ChartLegend, RCHART_TICK, RCHART_GRID, RCHART_TOOLTIP } from '@components/charts/charts'
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
          <ResponsiveContainer width="100%" height={380}>
            <ScatterChart margin={{ top: 16, right: 16, left: 8, bottom: 24 }}>
              <CartesianGrid {...RCHART_GRID} />
              <XAxis
                dataKey="volume"
                name="Books/mo"
                type="number"
                domain={[15, 50]}
                tick={RCHART_TICK}
                label={{
                  value: 'Avg books/month',
                  position: 'insideBottom',
                  offset: -12,
                  fontSize: 13,
                  fill: '#64748B',
                }}
              />
              <YAxis
                dataKey="lexileGrowth"
                name="Lexile growth"
                type="number"
                domain={[-25, 130]}
                tick={RCHART_TICK}
                label={{
                  value: 'Lexile growth (L)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 12,
                  fontSize: 13,
                  fill: '#64748B',
                }}
              />
              <ReferenceLine y={0} stroke="#94A3B8" strokeDasharray="5 4" />
              <Tooltip
                contentStyle={RCHART_TOOLTIP}
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: 8,
                        padding: '8px 12px',
                        fontSize: 13,
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.school}</div>
                      <div>
                        Lexile change:{' '}
                        <b style={{ color: d.lexileGrowth >= 0 ? '#15803D' : '#DC2626' }}>
                          {signedL(d.lexileGrowth)}
                        </b>
                      </div>
                      <div>
                        Avg books/mo: <b>{d.volume}</b>
                      </div>
                      <div>
                        Students: <b>{d.students.toLocaleString()}</b>
                      </div>
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 13,
                          color: d.lexileGrowth >= 0 ? '#15803D' : '#DC2626',
                          fontWeight: 600,
                        }}
                      >
                        {d.lexileGrowth >= 0 ? '✓ Growth' : '⚠ Decline'}
                      </div>
                    </div>
                  )
                }}
              />
              <Scatter
                data={LEXILE_DATA}
                isAnimationActive={false}
                shape={({ cx, cy, payload }) => {
                  const r = Math.sqrt(payload.students / 65)
                  const fill = payload.lexileGrowth >= 0 ? GROWTH_COLOR : DECLINE_COLOR
                  return (
                    <g>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill={fill}
                        opacity={0.85}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                      <text
                        x={cx}
                        y={cy - r - 4}
                        textAnchor="middle"
                        fontSize={10}
                        fill="#475569"
                        fontWeight={600}
                      >
                        {payload.school.split(' ')[0]}
                      </text>
                    </g>
                  )
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
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
