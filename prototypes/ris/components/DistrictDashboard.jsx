import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import {
  RMI_TRENDS,
  SESSION_TRENDS,
  BOOK_TALKS_TRENDS,
  LEXILE_DATA,
  SCHOOLS,
  DISTRICT,
  DISTRICT_HEALTH,
  SCHOOLS_TO_WATCH,
} from '../data'
import { ReadingHealth } from '@components/ReadingHealth/ReadingHealth'
import { Hero } from '@components/Hero/Hero'
import { Pill } from '@components/Pill/Pill'
import { ChartCard } from '@components/Cards/Cards'
import './DistrictDashboard.css'
import { Table } from '@components/Table/Table'
import { SchoolCell } from './SchoolCell'
import { ChartLegend, NIVO_THEME, AXIS_BOTTOM, AXIS_LEFT } from '@components/charts/charts'
import { TrendChart } from '@components/TrendChart/TrendChart'

function scoreColor(v) {
  if (v < 65) return '#E8866A'
  if (v < 78) return '#D97706'
  return '#16A97A'
}

function ScoreCell({ value }) {
  return <span style={{ color: scoreColor(value), fontWeight: 700, fontSize: 15 }}>{value}</span>
}

const STW_COLUMNS = [
  {
    key: 'school',
    label: 'School',
    render: (_, r) => <SchoolCell id={r.id} name={r.name} meta={r.grades} />,
  },
  {
    key: 'status',
    label: 'Status',
    render: (_, r) => (
      <Pill color={r.concernType === 'critical' ? '#DC2626' : '#D97706'} size="sm">
        {r.concernType === 'critical' ? 'Action needed' : 'Watch'}
      </Pill>
    ),
  },
  { key: 'concern', label: 'Concern' },
  {
    key: 'motivation',
    label: 'M',
    align: 'center',
    render: (_, r) => <ScoreCell value={r.health.motivation} />,
  },
  {
    key: 'integrity',
    label: 'I',
    align: 'center',
    render: (_, r) => <ScoreCell value={r.health.integrity} />,
  },
  {
    key: 'habits',
    label: 'H',
    align: 'center',
    render: (_, r) => <ScoreCell value={r.health.habits} />,
  },
  {
    key: 'skills',
    label: 'S',
    align: 'center',
    render: (_, r) => <ScoreCell value={r.health.skills} />,
  },
  {
    key: 'action',
    label: '',
    align: 'right',
    render: () => (
      <button className="rc-card-drill" disabled>
        View →
      </button>
    ),
  },
]

export function DistrictDashboard({ onNavigate }) {
  return (
    <div className="rc-page">
      <Hero
        initials="RUSD"
        title={DISTRICT.name}
        subtitle={`${DISTRICT.schools} schools · ${DISTRICT.students.toLocaleString()} students`}
      />

      <ReadingHealth title={null} data={DISTRICT_HEALTH} onNavigate={onNavigate} />

      {/* 2×2 chart grid */}
      <div className="sv-grid">
        {/* RMI Trends */}
        <ChartCard
          title="Reading Motivation Index (RMI)"
          accent="#0DA7BC"
          bodyPad="padded"
          action={
            <button className="rc-card-drill" onClick={() => onNavigate('motivation')}>
              View details →
            </button>
          }
          footer={
            <ChartLegend
              items={[
                { color: '#0DA7BC', label: 'District avg' },
                ...SCHOOLS.map((s) => ({
                  color: s.color,
                  label: s.name.split(' ')[0],
                  dashed: true,
                })),
              ]}
            />
          }
        >
          <TrendChart
            type="area"
            data={RMI_TRENDS}
            yDomain={[55, 90]}
            height="md"
            series={[
              { key: 'district', name: 'District avg', color: '#0DA7BC' },
              ...SCHOOLS.map((s) => ({
                key: s.id,
                name: s.name,
                color: s.color,
                dashed: true,
                fillOpacity: 0,
              })),
            ]}
          />
        </ChartCard>

        {/* Reading Habits */}
        <ChartCard
          title="Reading Habits"
          accent="#16A97A"
          bodyPad="padded"
          action={
            <button className="rc-card-drill" onClick={() => onNavigate('habits')}>
              View details →
            </button>
          }
          footer={
            <ChartLegend items={[{ color: '#16A97A', label: 'District avg session length' }]} />
          }
        >
          <div className="dash-inline-stats">
            <div className="dash-inline-stat">
              <span className="dash-inline-val">
                20<span className="dash-inline-unit">min</span>
              </span>
              <span className="dash-inline-lbl">avg session</span>
            </div>
            <div className="dash-inline-stat">
              <span className="dash-inline-val">
                41<span className="dash-inline-unit">%</span>
              </span>
              <span className="dash-inline-lbl">active streaks</span>
            </div>
            <div className="dash-inline-stat">
              <span className="dash-inline-val">3.2</span>
              <span className="dash-inline-lbl">days/week avg</span>
            </div>
          </div>
          <TrendChart
            type="area"
            data={SESSION_TRENDS}
            yDomain={[8, 30]}
            height="sm"
            tooltipFormatter={(v) => `${v} min`}
            series={[{ key: 'district', name: 'District avg', color: '#16A97A' }]}
          />
        </ChartCard>

        {/* Book Talks */}
        <ChartCard
          title="Book Talks Engagement"
          accent="#1D4ED8"
          bodyPad="padded"
          action={
            <button className="rc-card-drill" onClick={() => onNavigate('integrity')}>
              View details →
            </button>
          }
          footer={
            <ChartLegend
              items={[
                { color: '#1D4ED8', label: 'Completion rate' },
                { color: '#E8866A', label: 'Flag rate', dashed: true },
              ]}
            />
          }
        >
          <TrendChart
            type="line"
            data={BOOK_TALKS_TRENDS}
            yDomain={[0, 100]}
            yUnit="%"
            height="md"
            tooltipFormatter={(v) => `${v}%`}
            series={[
              { key: 'completionRate', name: 'Completion Rate', color: '#1D4ED8' },
              { key: 'flagRate', name: 'Flag Rate', color: '#E8866A', dashed: true },
            ]}
          />
        </ChartCard>

        {/* Lexile scatter */}
        <ChartCard
          title="Lexile Growth vs. Reading Volume"
          accent="#7C3AED"
          bodyPad="padded"
          action={
            <button className="rc-card-drill" onClick={() => onNavigate('skills')}>
              View details →
            </button>
          }
          footer={
            <ChartLegend
              items={[
                { color: '#0DA7BC', label: 'Above expected growth' },
                { color: '#E8866A', label: 'Below expected growth' },
              ]}
            />
          }
        >
          <div style={{ flex: 1, minHeight: 240 }}>
            <ResponsiveScatterPlot
              data={[
                {
                  id: 'Above expected',
                  data: LEXILE_DATA.filter((d) => d.aboveExpected).map((d) => ({
                    x: d.volume,
                    y: d.lexileGrowth,
                    school: d.school,
                    students: d.students,
                    id: d.id,
                  })),
                },
                {
                  id: 'Below expected',
                  data: LEXILE_DATA.filter((d) => !d.aboveExpected).map((d) => ({
                    x: d.volume,
                    y: d.lexileGrowth,
                    school: d.school,
                    students: d.students,
                    id: d.id,
                  })),
                },
              ]}
              theme={NIVO_THEME}
              margin={{ top: 16, right: 28, bottom: 56, left: 72 }}
              xScale={{ type: 'linear', min: 15, max: 50 }}
              yScale={{ type: 'linear', min: 0, max: 130 }}
              colors={({ serieId }) => (serieId === 'Above expected' ? '#0DA7BC' : '#E8866A')}
              nodeSize={(d) => Math.sqrt(d.data.students / 5)}
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
                tickValues: 5,
              }}
              enableGridX={false}
              tooltip={({ node }) => (
                <div
                  className="sdb-tooltip"
                  style={{
                    '--tip-accent': node.serieId === 'Above expected' ? '#0DA7BC' : '#E8866A',
                  }}
                >
                  <div className="sdb-tooltip-header">{node.data.school}</div>
                  <div
                    className="sdb-tooltip-series"
                    style={{
                      '--series-color': node.serieId === 'Above expected' ? '#0DA7BC' : '#E8866A',
                    }}
                  >
                    <div className="sdb-tooltip-row">
                      <span className="sdb-tooltip-dot" />
                      <span className="sdb-tooltip-label">Lexile growth</span>
                      <span className="sdb-tooltip-val">+{node.data.y}L</span>
                    </div>
                  </div>
                  <div className="sdb-tooltip-series" style={{ '--series-color': '#94A3B8' }}>
                    <div className="sdb-tooltip-row">
                      <span className="sdb-tooltip-dot" />
                      <span className="sdb-tooltip-label">Books / mo</span>
                      <span className="sdb-tooltip-val">{node.data.x}</span>
                    </div>
                  </div>
                  <div className="sdb-tooltip-context">
                    {node.data.students.toLocaleString()} students
                  </div>
                </div>
              )}
            />
          </div>
        </ChartCard>
      </div>

      {/* Schools to Watch */}
      <ChartCard
        title="Schools to Watch"
        subtitle="Sites with signals requiring attention this month"
        bodyPad="flush"
        span={2}
      >
        <Table flush columns={STW_COLUMNS} rows={SCHOOLS_TO_WATCH} getRowKey={(r) => r.id} />
      </ChartCard>
    </div>
  )
}
