import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import {
  RMI_TOTAL_TRENDS,
  RMI_TOTAL_BAND_TRENDS,
  RMI_GRADE_BANDS,
  SESSION_BAND_TRENDS,
  SESSION_BANDS,
  BOOK_TALKS_TRENDS,
  LEXILE_DATA,
  DISTRICT,
  DISTRICT_RMI,
  READERS_THIS_WEEK,
  FLAGGED_LOGS,
  LEXILE_WEEK,
  SCHOOLS_TO_WATCH,
  signedL,
} from '../data'
import { Icon } from '@components/Icon/Icon'
import { SECTIONS } from '@components/ReadingHealth/ReadingHealth'
import { Hero } from '@components/Hero/Hero'
import { Pill } from '@components/Pill/Pill'
import { ChartCard } from '@components/Cards/Cards'
import './DistrictDashboard.css'
import { Table } from '@components/Table/Table'
import { SchoolCell } from './SchoolCell'
import { ChartLegend, NIVO_THEME, AXIS_BOTTOM, AXIS_LEFT } from '@components/charts/charts'
import { TrendChart } from '@components/TrendChart/TrendChart'

const SEC = Object.fromEntries(SECTIONS.map((s) => [s.key, s]))
const GROWTH_COLOR = '#16A97A'
const DECLINE_COLOR = '#E8866A'

// AA-safe text shade per section (the raw SECTIONS colors fail 4.5:1 on white
// for the small eyebrow / "View more" text — icon + border keep the brand hue).
const SEC_TEXT = {
  motivation: '#C2410C',
  integrity: '#1D4ED8',
  habits: '#15803D',
  skills: '#7C3AED',
}

// ── Top summary tiles: one workable metric per area (no 1–100 score) ────────
const SUMMARY_TILES = [
  {
    key: 'motivation',
    value: DISTRICT_RMI.value.toFixed(1),
    unit: '/40',
    metric: 'Avg RMI total',
    sub: (
      <span className="ds-tile-trend ds-tile-trend--good">
        ↑ {DISTRICT_RMI.delta} vs last month
      </span>
    ),
  },
  {
    key: 'integrity',
    value: `${FLAGGED_LOGS.pct}%`,
    metric: 'Flagged logs this week',
    sub: (
      <span className="ds-tile-trend ds-tile-trend--good">
        ↓ {Math.abs(FLAGGED_LOGS.delta)}pp vs last week
      </span>
    ),
  },
  {
    key: 'habits',
    value: READERS_THIS_WEEK.count.toLocaleString(),
    metric: 'Readers logged this week',
    sub: (
      <span className="ds-tile-sub">
        {READERS_THIS_WEEK.pct}% of {DISTRICT.students.toLocaleString()} students
      </span>
    ),
  },
  {
    key: 'skills',
    value: signedL(LEXILE_WEEK.growth),
    metric: 'Lexile growth this week',
    sub: (
      <span className="ds-tile-sub">
        {LEXILE_WEEK.lastWeek}L → {LEXILE_WEEK.thisWeek}L avg
      </span>
    ),
  },
]

function SummaryTiles({ onNavigate }) {
  return (
    <div className="rh-grid ds-summary">
      {SUMMARY_TILES.map((t) => {
        const sec = SEC[t.key]
        return (
          <button
            key={t.key}
            type="button"
            className="rh-stat rh-stat--clickable ds-tile"
            style={{ '--sec-color': sec.color, '--sec-bg': sec.bg, '--sec-text': SEC_TEXT[t.key] }}
            onClick={() => onNavigate(t.key)}
          >
            <div className="ds-tile-head">
              <span className="ds-tile-icon" aria-hidden="true">
                {sec.icon}
              </span>
              <span className="ds-tile-sec">{sec.label}</span>
            </div>
            <div className="ds-tile-val">
              {t.value}
              {t.unit && <span className="ds-tile-unit">{t.unit}</span>}
            </div>
            <div className="ds-tile-metric">{t.metric}</div>
            <div className="ds-tile-sub-wrap">{t.sub}</div>
            <div className="rh-stat-more">
              View more
              <Icon name="chevron-right" size={10} stroke={2} />
            </div>
          </button>
        )
      })}
    </div>
  )
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

// District RMI trend merged with grade-band lines for the overview chart
const RMI_OVERVIEW = RMI_TOTAL_BAND_TRENDS.map((row, i) => ({
  ...row,
  district: RMI_TOTAL_TRENDS[i].district,
}))

export function DistrictDashboard({ onNavigate }) {
  return (
    <div className="rc-page">
      <Hero
        initials="RUSD"
        title={DISTRICT.name}
        subtitle={`${DISTRICT.schools} schools · ${DISTRICT.students.toLocaleString()} students`}
      />

      <SummaryTiles onNavigate={onNavigate} />

      {/* 2×2 chart grid */}
      <div className="sv-grid">
        {/* RMI Trends — by grade band */}
        <ChartCard
          title="Reading Motivation Index (RMI)"
          subtitle="Avg RMI total (0–40) by grade band"
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
                ...RMI_GRADE_BANDS.map((b) => ({ color: b.color, label: b.key, dashed: true })),
              ]}
            />
          }
        >
          <TrendChart
            type="area"
            data={RMI_OVERVIEW}
            yDomain={[14, 28]}
            height="md"
            tooltipFormatter={(v) => v.toFixed(1)}
            series={[
              { key: 'district', name: 'District avg', color: '#0DA7BC' },
              ...RMI_GRADE_BANDS.map((b) => ({
                key: b.key,
                name: b.key,
                color: b.color,
                dashed: true,
                fillOpacity: 0,
              })),
            ]}
          />
        </ChartCard>

        {/* Reading Habits — avg session length */}
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
            <ChartLegend items={SESSION_BANDS.map((b) => ({ color: b.color, label: b.label }))} />
          }
        >
          <div className="dash-inline-stats dash-inline-stats--2">
            <div className="dash-inline-stat">
              <span className="dash-inline-val">
                20<span className="dash-inline-unit">min</span>
              </span>
              <span className="dash-inline-lbl">avg session</span>
            </div>
            <div className="dash-inline-stat">
              <span className="dash-inline-val">3.2</span>
              <span className="dash-inline-lbl">days/week avg</span>
            </div>
          </div>
          <TrendChart
            type="area"
            data={SESSION_BAND_TRENDS}
            yDomain={[8, 30]}
            height="sm"
            tooltipFormatter={(v) => `${v} min`}
            series={SESSION_BANDS.map((b) => ({ key: b.key, name: b.label, color: b.color }))}
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

        {/* Lexile scatter — growth vs. decline */}
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
                { color: GROWTH_COLOR, label: 'Growth' },
                { color: DECLINE_COLOR, label: 'Decline' },
              ]}
            />
          }
        >
          <div style={{ flex: 1, minHeight: 240 }}>
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
              margin={{ top: 16, right: 28, bottom: 56, left: 72 }}
              xScale={{ type: 'linear', min: 15, max: 50 }}
              yScale={{ type: 'linear', min: -20, max: 130 }}
              colors={({ serieId }) => (serieId === 'Growth' ? GROWTH_COLOR : DECLINE_COLOR)}
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
                    '--tip-accent': node.serieId === 'Growth' ? GROWTH_COLOR : DECLINE_COLOR,
                  }}
                >
                  <div className="sdb-tooltip-header">{node.data.school}</div>
                  <div
                    className="sdb-tooltip-series"
                    style={{
                      '--series-color': node.serieId === 'Growth' ? GROWTH_COLOR : DECLINE_COLOR,
                    }}
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
