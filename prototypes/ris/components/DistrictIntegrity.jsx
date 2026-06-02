import { BOOK_TALKS_TRENDS, BOOK_TALKS_BY_SCHOOL, SCHOOLS, FLAGGED_LOGS } from '../data'
import { Hero } from '@components/Hero/Hero'
import { StatCard, ChartCard, CardNote } from '@components/Cards/Cards'
import { BarList } from '@components/BarList/BarList'
import { Table } from '@components/Table/Table'
import { Pill } from '@components/Pill/Pill'
import { SchoolCell } from './SchoolCell'
import { ChartLegend } from '@components/charts/charts'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { SECTIONS } from '@components/ReadingHealth/ReadingHealth'

const ACCENT = '#1D4ED8'
const FLAG_COLOR = '#E8866A'
const INT_ICON = SECTIONS.find((s) => s.key === 'integrity')?.icon

function schoolColor(id) {
  return SCHOOLS.find((s) => s.id === id)?.color ?? '#94A3B8'
}

const REVIEW_COLUMNS = [
  {
    key: 'school',
    label: 'School',
    render: (_, r) => <SchoolCell id={r.id} name={r.name} />,
  },
  {
    key: 'flagRate',
    label: 'Flag rate',
    align: 'center',
    render: (_, r) => (
      <Pill color={r.flagRate >= 15 ? '#DC2626' : '#475569'} size="sm">
        {r.flagRate}% flagged
      </Pill>
    ),
  },
  {
    key: 'trend',
    label: 'Trend',
    align: 'center',
    render: (_, r) => (
      <Pill color={r.trend < 0 ? '#DC2626' : '#16A97A'} size="sm">
        {r.trend < 0 ? `↓${Math.abs(r.trend)}pp` : `↑${r.trend}pp`}
      </Pill>
    ),
  },
  {
    key: 'totalTalks',
    label: 'Volume',
    align: 'center',
    render: (_, r) => <Pill size="sm">{r.totalTalks} talks</Pill>,
  },
  {
    key: 'action',
    label: '',
    align: 'right',
    render: () => <button className="rc-card-drill">Review →</button>,
  },
]

export function DistrictIntegrity() {
  const avgCompletion = Math.round(
    BOOK_TALKS_BY_SCHOOL.reduce((s, x) => s + x.completionRate, 0) / BOOK_TALKS_BY_SCHOOL.length,
  )
  const avgFlagRate = +(
    BOOK_TALKS_BY_SCHOOL.reduce((s, x) => s + x.flagRate, 0) / BOOK_TALKS_BY_SCHOOL.length
  ).toFixed(1)
  const highFlagSchools = BOOK_TALKS_BY_SCHOOL.filter((s) => s.flagRate >= 15)

  const completionRanked = [...BOOK_TALKS_BY_SCHOOL].sort(
    (a, b) => b.completionRate - a.completionRate,
  )
  const sortedByFlag = [...BOOK_TALKS_BY_SCHOOL].sort((a, b) => b.flagRate - a.flagRate)

  return (
    <div className="rc-page" style={{ '--rc-accent': ACCENT }}>
      <Hero bucket="integrity" />

      <div className="rc-stats-row">
        <StatCard
          value={`${avgCompletion}%`}
          label="Avg Book Talk completion"
          footer="Students who finish the AI chat"
        />
        <StatCard
          value={`${avgFlagRate}%`}
          label="Avg conversation flag rate"
          footer="↓2pp improvement YTD"
          color={avgFlagRate > 15 ? '#DC2626' : '#D97706'}
        />
        <StatCard
          value={highFlagSchools.length}
          unit="of 6"
          label="Schools flagged >15%"
          footer={
            highFlagSchools.length > 0
              ? highFlagSchools.map((s) => s.name.split(' ')[0]).join(', ')
              : 'All within range'
          }
          color={highFlagSchools.length > 0 ? FLAG_COLOR : '#16A97A'}
        />
        <StatCard
          value={`${FLAGGED_LOGS.pct}%`}
          label="Flagged sessions (all logs)"
          footer={`↓${Math.abs(FLAGGED_LOGS.delta)}pp vs last week`}
          footerColor="#16A34A"
        />
      </div>

      <div className="sv-grid">
        {/* Book Talks trend — full width */}
        <ChartCard
          title="Book Talks — Completion & Flag Rate"
          subtitle="District-wide · Sep 2024 – May 2025 · Completion rising, flag rate declining"
          icon={INT_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
          footer={
            <ChartLegend
              items={[
                { color: ACCENT, label: 'Completion rate' },
                { color: FLAG_COLOR, label: 'Flag rate', dashed: true },
              ]}
            />
          }
        >
          <TrendChart
            type="area"
            data={BOOK_TALKS_TRENDS}
            yDomain={[0, 100]}
            yUnit="%"
            height="md"
            tooltipFormatter={(v) => `${v}%`}
            series={[
              { key: 'completionRate', name: 'Completion Rate', color: ACCENT, fillOpacity: 0.12 },
              {
                key: 'flagRate',
                name: 'Flag Rate',
                color: FLAG_COLOR,
                fillOpacity: 0.12,
                dashed: true,
              },
            ]}
          />
          <CardNote tone="neutral">
            Book Talks with Benny engages students in a brief AI conversation when they log above
            their school's warning threshold. A flagged conversation indicates unintelligible
            responses, copy-pasted text, or other defined patterns — not an automatic penalty.
            Educators review flagged conversations to determine follow-up.
          </CardNote>
        </ChartCard>

        {/* Per-school Book Talk completion */}
        <ChartCard
          title="Book Talk Completion by School"
          subtitle="% of triggered talks completed · May 2025"
          icon={INT_ICON}
          accent={ACCENT}
          bodyPad="padded"
          bodyMaxHeight={360}
          span={2}
        >
          <BarList
            labelWidth={110}
            header={{ label: 'School', valueLabel: 'Completion' }}
            items={completionRanked.map((s) => ({
              label: s.name,
              value: s.completionRate,
              max: 100,
              color: schoolColor(s.id),
              valueLabel: `${s.completionRate}%`,
            }))}
          />
        </ChartCard>

        {/* Schools needing review */}
        <ChartCard
          title="Schools Needing Review"
          subtitle="Ranked by flag rate · high flag rates or declining completion"
          icon={INT_ICON}
          accent={ACCENT}
          bodyPad="flush"
          bodyMaxHeight={360}
          span={2}
        >
          <Table
            flush
            stickyHeader
            columns={REVIEW_COLUMNS}
            rows={sortedByFlag}
            getRowKey={(r) => r.id}
          />
        </ChartCard>
      </div>
    </div>
  )
}
