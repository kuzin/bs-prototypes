import {
  ROI_TRENDS, SCHOOL_HEALTH, SCHOOLS, DISTRICT_FUNNEL, BOOK_TALKS_BY_SCHOOL, SCHOOL_STATS,
} from '../data'
import { Hero } from './Hero'
import { Funnel } from './Funnel'
import { StatCard, ChartCard } from './Cards'
import { Table } from './Table'
import { Pill } from './Pill'
import { ProgressBar } from './ProgressBar'
import { SchoolCell } from './SchoolCell'
import { ChartLegend } from './charts'
import { TrendChart } from './TrendChart'
import './DistrictAnalytics.css'

const ACCENT = '#0DA7BC'

const ANALYTICS_ICON = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="3" height="6" rx="1"/>
    <rect x="8.5" y="7" width="3" height="10" rx="1"/>
    <rect x="14" y="3" width="3" height="14" rx="1"/>
  </svg>
)

const scoreColor = v => v >= 80 ? '#16A97A' : v >= 65 ? '#D97706' : '#E8866A'

function ScoreChip({ value }) {
  return <Pill color={scoreColor(value)} variant="soft" size="sm">{value}</Pill>
}

const SCORECARD_COLUMNS = [
  {
    key: 'school',
    label: 'School',
    width: 200,
    render: (_, r) => (
      <SchoolCell color={r.color} name={r.name} meta={`${r.grades} · ${r.students.toLocaleString()} students`} />
    ),
  },
  { key: 'motivation', label: 'Motivation', align: 'center', render: v => <ScoreChip value={v} /> },
  { key: 'integrity',  label: 'Integrity',  align: 'center', render: v => <ScoreChip value={v} /> },
  { key: 'habits',     label: 'Habits',     align: 'center', render: v => <ScoreChip value={v} /> },
  { key: 'skills',     label: 'Skills',     align: 'center', render: v => <ScoreChip value={v} /> },
  {
    key: 'overall',
    label: 'Overall',
    align: 'center',
    render: (v, r) => <Pill color={r.color} variant="filled" size="sm">{v}</Pill>,
  },
  {
    key: 'action',
    label: '',
    align: 'right',
    render: (_, r) => (
      <button className="rc-card-drill" title={`Would open ${r.name}'s dashboard in Beanstack`} disabled>
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
      const school = SCHOOLS.find(sc => sc.id === r.id)
      return <ProgressBar inline value={v} max={100} color={school?.color} size="sm" valueLabel={`${v}%`} />
    },
  },
  {
    key: 'flagRate',
    label: 'Flag rate',
    render: (v) => {
      const high = v >= 15
      return <ProgressBar inline value={v} max={40} color={high ? '#E8866A' : '#CBD5E1'} size="sm" valueLabel={`${v}%`} />
    },
  },
]

export function DistrictAnalytics() {
  const scorecardData = SCHOOLS.map(s => {
    const h = SCHOOL_HEALTH[s.id]
    const overall = Math.round((h.motivation + h.integrity + h.habits + h.skills) / 4)
    return { ...s, ...h, overall }
  }).sort((a, b) => b.overall - a.overall)

  const districtAvgEng  = Math.round(SCHOOL_STATS.reduce((s, x) => s + x.engagement, 0) / SCHOOL_STATS.length)
  const schoolsAboveAvg = SCHOOL_STATS.filter(s => s.engagement >= districtAvgEng).length
  const btAvgCompletion = Math.round(BOOK_TALKS_BY_SCHOOL.reduce((s, x) => s + x.completionRate, 0) / BOOK_TALKS_BY_SCHOOL.length)

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
          subtitle="All 4 reading health buckets across 6 schools · May 2025 · Sorted by overall score"
          icon={ANALYTICS_ICON}
          accent={ACCENT}
          bodyPad="flush"
          span={2}
          footer={
            <ChartLegend items={[
              { color: '#16A97A', label: '≥80' },
              { color: '#D97706', label: '65–79' },
              { color: '#E8866A', label: '<65' },
            ]} />
          }
        >
          <Table
            flush
            columns={SCORECARD_COLUMNS}
            rows={scorecardData}
            getRowKey={r => r.id}
          />
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
            <ChartLegend items={[
              { color: '#0DA7BC', label: 'Reading Engagement %' },
              { color: '#16A97A', label: 'Attendance Rate %',    dashed: true },
              { color: '#E8866A', label: 'Behavioral Incidents', dashed: true },
            ]} />
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
              { key: 'engagement', name: 'Reading Engagement %', color: '#0DA7BC', yAxisId: 'left'  },
              { key: 'attendance', name: 'Attendance Rate %',    color: '#16A97A', yAxisId: 'left',  dashed: true, strokeWidth: 2 },
              { key: 'incidents',  name: 'Behavioral Incidents', color: '#E8866A', yAxisId: 'right', dashed: true, strokeWidth: 2 },
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
          <Table
            flush
            columns={ADOPTION_COLUMNS}
            rows={adoptionRows}
            getRowKey={r => r.id}
          />
        </ChartCard>

      </div>
    </div>
  )
}
