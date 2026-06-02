import {
  ROI_TRENDS,
  RMI_TOTAL_BY_SCHOOL,
  LEXILE_DATA,
  SCHOOLS,
  DISTRICT_FUNNEL,
  BOOK_TALKS_BY_SCHOOL,
  SCHOOL_STATS,
} from '../data'
import { Hero } from '@components/Hero/Hero'
import { Funnel } from '@components/Funnel/Funnel'
import { StatCard, ChartCard } from '@components/Cards/Cards'
import { Table } from '@components/Table/Table'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { SchoolCell } from './SchoolCell'
import { ChartLegend } from '@components/charts/charts'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { Icon } from '@components/Icon/Icon'
import './DistrictAnalytics.css'

const ACCENT = '#0DA7BC'

const ANALYTICS_ICON = <Icon name="chart-bar" />

const signedL = (v) => `${v >= 0 ? '+' : ''}${v}L`

const SCORECARD_COLUMNS = [
  {
    key: 'school',
    label: 'School',
    width: 200,
    render: (_, r) => (
      <SchoolCell
        color={r.color}
        name={r.name}
        meta={`${r.grades} · ${r.students.toLocaleString()} students`}
      />
    ),
  },
  {
    key: 'rmi',
    label: 'RMI total',
    align: 'center',
    render: (v) => <span style={{ fontWeight: 700 }}>{v.toFixed(1)}</span>,
  },
  {
    key: 'flagRate',
    label: 'Flag rate',
    align: 'center',
    render: (v) => (
      <Pill color={v >= 15 ? '#DC2626' : '#475569'} variant="soft" size="sm">
        {v}%
      </Pill>
    ),
  },
  {
    key: 'avgSession',
    label: 'Avg session',
    align: 'center',
    render: (v) => `${v} min`,
  },
  {
    key: 'lexileGrowth',
    label: 'Lexile Δ',
    align: 'center',
    render: (v) => (
      <span style={{ color: v >= 0 ? '#16A97A' : '#DC2626', fontWeight: 700 }}>{signedL(v)}</span>
    ),
  },
  {
    key: 'engagement',
    label: 'Engagement',
    align: 'center',
    render: (v, r) => <span style={{ color: r.color, fontWeight: 700 }}>{v}%</span>,
  },
  {
    key: 'action',
    label: '',
    align: 'right',
    render: (_, r) => (
      <button
        className="rc-card-drill"
        title={`Would open ${r.name}'s dashboard in Beanstack`}
        disabled
      >
        View →
      </button>
    ),
  },
]

const ADOPTION_COLUMNS = [
  {
    key: 'school',
    label: 'School',
    render: (_, r) => <SchoolCell id={r.id} name={r.name} />,
  },
  {
    key: 'completionRate',
    label: 'Completion',
    render: (v, r) => {
      const school = SCHOOLS.find((sc) => sc.id === r.id)
      return (
        <ProgressBar
          inline
          value={v}
          max={100}
          color={school?.color}
          size="sm"
          valueLabel={`${v}%`}
        />
      )
    },
  },
  {
    key: 'flagRate',
    label: 'Flag rate',
    render: (v) => {
      const high = v >= 15
      return (
        <ProgressBar
          inline
          value={v}
          max={40}
          color={high ? '#E8866A' : '#CBD5E1'}
          size="sm"
          valueLabel={`${v}%`}
        />
      )
    },
  },
]

export function DistrictAnalytics() {
  const rmiById = Object.fromEntries(RMI_TOTAL_BY_SCHOOL.map((s) => [s.id, s.rmi]))
  const flagById = Object.fromEntries(BOOK_TALKS_BY_SCHOOL.map((s) => [s.id, s.flagRate]))
  const lexById = Object.fromEntries(LEXILE_DATA.map((s) => [s.id, s.lexileGrowth]))
  const statsById = Object.fromEntries(SCHOOL_STATS.map((s) => [s.id, s]))
  const scorecardData = SCHOOLS.map((s) => ({
    ...s,
    rmi: rmiById[s.id],
    flagRate: flagById[s.id],
    avgSession: statsById[s.id].avgSession,
    lexileGrowth: lexById[s.id],
    engagement: statsById[s.id].engagement,
  })).sort((a, b) => b.engagement - a.engagement)

  const districtAvgEng = Math.round(
    SCHOOL_STATS.reduce((s, x) => s + x.engagement, 0) / SCHOOL_STATS.length,
  )
  const schoolsAboveAvg = SCHOOL_STATS.filter((s) => s.engagement >= districtAvgEng).length
  const btAvgCompletion = Math.round(
    BOOK_TALKS_BY_SCHOOL.reduce((s, x) => s + x.completionRate, 0) / BOOK_TALKS_BY_SCHOOL.length,
  )

  const adoptionRows = [...BOOK_TALKS_BY_SCHOOL].sort((a, b) => b.completionRate - a.completionRate)

  return (
    <div className="rc-page" style={{ '--rc-accent': ACCENT }}>
      <Hero
        icon={ANALYTICS_ICON}
        title="Analytics"
        subtitle="School performance scorecard, engagement trends, and outcome data across the district"
        accent={ACCENT}
        accentBg="#ECFEFF"
      />

      <div className="rc-stats-row">
        <StatCard
          value={`${districtAvgEng}%`}
          label="District Engagement Rate"
          footer="+6pp vs Sep 2024"
        />
        <StatCard
          value={schoolsAboveAvg}
          unit="of 6"
          label="Schools above avg"
          footer={`${districtAvgEng}% district benchmark`}
          color="#16A97A"
        />
        <StatCard
          value={`${btAvgCompletion}%`}
          label="Book Talks completion"
          footer="↑5pp vs Sep 2024"
        />
        <StatCard
          value="r = 0.82"
          label="Engagement ↔ Attendance"
          footer="Positive outcome correlation"
          color="#16A97A"
        />
      </div>

      <div className="sv-grid">
        {/* School performance scorecard — full width */}
        <ChartCard
          title="School Performance Scorecard"
          subtitle="One key metric per reading area — RMI total, flag rate, session, Lexile · May 2025 · sorted by engagement"
          icon={ANALYTICS_ICON}
          accent={ACCENT}
          bodyPad="flush"
          span={2}
        >
          <Table flush columns={SCORECARD_COLUMNS} rows={scorecardData} getRowKey={(r) => r.id} />
        </ChartCard>

        {/* District engagement funnel — full width */}
        <ChartCard
          title="District Engagement Funnel"
          subtitle={`Habit depth across all ${DISTRICT_FUNNEL[0].count.toLocaleString()} enrolled students · Riverside USD · May 2025`}
          icon={ANALYTICS_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
        >
          <Funnel
            accent={ACCENT}
            dropoffLabel="students not yet forming next habit"
            items={DISTRICT_FUNNEL}
          />
        </ChartCard>

        {/* Outcome correlations */}
        <ChartCard
          title="Engagement → Outcome Correlations"
          subtitle="Reading engagement vs. attendance & behavioral incidents · Sep 2024 – May 2025"
          icon={ANALYTICS_ICON}
          accent={ACCENT}
          bodyPad="padded"
          footer={
            <ChartLegend
              items={[
                { color: '#0DA7BC', label: 'Reading Engagement %' },
                { color: '#16A97A', label: 'Attendance Rate %', dashed: true },
                { color: '#E8866A', label: 'Behavioral Incidents', dashed: true },
              ]}
            />
          }
        >
          <TrendChart
            type="line"
            data={ROI_TRENDS}
            yDomain={[60, 85]}
            yUnit="%"
            yRight={{ domain: [20, 45] }}
            height="lg"
            series={[
              {
                key: 'engagement',
                name: 'Reading Engagement %',
                color: '#0DA7BC',
                yAxisId: 'left',
              },
              {
                key: 'attendance',
                name: 'Attendance Rate %',
                color: '#16A97A',
                yAxisId: 'left',
                dashed: true,
                strokeWidth: 2,
              },
              {
                key: 'incidents',
                name: 'Behavioral Incidents',
                color: '#E8866A',
                yAxisId: 'right',
                dashed: true,
                strokeWidth: 2,
              },
            ]}
          />
        </ChartCard>

        {/* Book Talks adoption */}
        <ChartCard
          title="Book Talks Adoption by School"
          subtitle="Completion rate vs. flag rate — May 2025"
          icon={ANALYTICS_ICON}
          accent={ACCENT}
          bodyPad="flush"
        >
          <Table flush columns={ADOPTION_COLUMNS} rows={adoptionRows} getRowKey={(r) => r.id} />
        </ChartCard>
      </div>
    </div>
  )
}
