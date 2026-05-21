import {
  SCHOOLS, SCHOOL_DETAILS, SCHOOL_STATS,
  GRADE_PERFORMANCE, SCHOOL_GRADE_LEVELS, LEXILE_BY_GRADE,
} from '../data'
import { Hero } from './Hero'
import { ChartLegend } from './charts'
import { StatCard, ChartCard } from './Cards'
import { ProgressBar } from './ProgressBar'
import { BarList } from './BarList'
import { Table } from './Table'
import { Pill } from './Pill'
import { TrendChart } from './TrendChart'
import './SchoolDemographics.css'

const DEMO_COLOR = '#7C3AED'

const DemographicsIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="6" r="2.5"/>
    <circle cx="4"  cy="9" r="2"/>
    <circle cx="16" cy="9" r="2"/>
    <path d="M6 17c0-2.2 1.8-4 4-4s4 1.8 4 4"/>
    <path d="M1 17c0-1.7 1.3-3 3-3"/>
    <path d="M19 17c0-1.7-1.3-3-3-3"/>
  </svg>
)

function buildCohorts(details) {
  const frl = details.frl
  return [
    { label: 'Free/Reduced Lunch', pct: frl,                   color: '#7C3AED', desc: 'Federal lunch program eligibility' },
    { label: 'English Learner',    pct: Math.round(frl * 0.45), color: '#0DA7BC', desc: 'EL services / multilingual learners' },
    { label: 'IEP / 504 Plan',     pct: Math.round(frl * 0.28 + 8), color: '#E8866A', desc: 'Active learning support plan' },
    { label: 'Gifted / Advanced',  pct: Math.round(28 - frl * 0.25), color: '#16A97A', desc: 'In gifted or honors track' },
  ].map(c => ({ ...c, pct: Math.max(2, c.pct) }))
}

function rmiColor(rmi) {
  if (rmi >= 78) return '#0DA7BC'
  if (rmi >= 70) return '#D97706'
  return '#E8866A'
}

export function SchoolDemographics({ schoolId }) {
  const school  = SCHOOLS.find(s => s.id === schoolId)
  const details = SCHOOL_DETAILS[schoolId]
  const stats   = SCHOOL_STATS.find(s => s.id === schoolId)
  const cohorts = buildCohorts(details)

  const gradeIdxs    = SCHOOL_GRADE_LEVELS[schoolId]
  const gradeNames   = gradeIdxs.map(i => LEXILE_BY_GRADE[i].grade.replace(/(st|nd|rd|th)/, ''))
  const schoolGrades = GRADE_PERFORMANCE.filter(g => gradeNames.includes(g.grade))

  const gradeRows = schoolGrades.map((g, i) => {
    const frlShift = i - Math.floor(schoolGrades.length / 2)
    const groupFrl = Math.max(8, Math.min(85, details.frl + frlShift * 3))
    return {
      grade: g.grade,
      count: g.count,
      rmi: g.rmi,
      engagement: g.engagement,
      frl: groupFrl,
    }
  })

  return (
    <div className="dm-root">

      <Hero
        icon={<DemographicsIcon />}
        title="Demographics"
        subtitle={`Student cohorts, equity indicators, and grade-level performance · ${school.name}`}
        accent={school.color}
        accentBg="#F5F3FF"
      />

      <div className="rc-stats-row">
        <StatCard
          value={school.students.toLocaleString()}
          label="Total students"
          footer={`Grades ${school.grades}`}
        />
        <StatCard
          value={details.frl}
          unit="%"
          label="FRL rate"
          footer={details.frl >= 50 ? 'High-need school' : details.frl >= 30 ? 'Mixed-income' : 'Low FRL'}
          color={DEMO_COLOR}
        />
        <StatCard
          value={details.titleI ? 'Yes' : 'No'}
          label="Title I eligible"
          footer={details.titleI ? 'Federal funding active' : 'Not Title I'}
          color={details.titleI ? '#1D4ED8' : '#94A3B8'}
        />
        <StatCard
          value={stats.rmi}
          label="RMI score"
          footer={stats.rmi >= 78 ? 'Above district avg' : stats.rmi >= 70 ? 'Near district avg' : 'Below district avg'}
        />
      </div>

      <div className="sv-grid">

        <ChartCard
          span={2}
          title="Student Cohorts"
          subtitle={`Demographic indicators for ${school.students.toLocaleString()} enrolled students`}
          icon={<DemographicsIcon />}
          accent={DEMO_COLOR}
          bodyPad="padded"
        >
          <BarList
            labelWidth={140}
            items={cohorts.map(c => ({
              label:      c.label,
              sublabel:   c.desc,
              value:      c.pct,
              color:      c.color,
              valueLabel: `${c.pct}%`,
              subValue:   `${Math.round(school.students * c.pct / 100).toLocaleString()} students`,
            }))}
          />
        </ChartCard>

        <ChartCard
          span={2}
          title="Grade-Level Performance"
          subtitle="RMI, engagement, and FRL distribution across grades served"
          icon={<DemographicsIcon />}
          accent={DEMO_COLOR}
          bodyPad="flush"
        >
          <Table
            flush
            getRowKey={r => r.grade}
            columns={[
              { key: 'grade',      label: 'Grade', render: v => `Grade ${v}` },
              { key: 'rmi',        label: 'RMI', align: 'right',
                render: v => <span style={{ color: rmiColor(v), fontWeight: 700 }}>{v}</span> },
              { key: 'rmiBar',     label: 'Reading Motivation Index',
                render: (_, r) => <ProgressBar value={r.rmi} max={100} color={rmiColor(r.rmi)} size="sm" /> },
              { key: 'engagement', label: 'Engagement', align: 'right', render: v => `${v}%` },
              { key: 'count',      label: 'Students',   align: 'right', render: v => v.toLocaleString() },
              { key: 'frl',        label: 'FRL %',      align: 'center',
                render: v => (
                  <Pill
                    color={v >= 50 ? '#DC2626' : v >= 30 ? '#D97706' : '#16A97A'}
                    variant="soft"
                    size="sm"
                  >{v}%</Pill>
                ) },
            ]}
            rows={gradeRows}
          />
        </ChartCard>

        <ChartCard
          span={2}
          title="RMI & Engagement by Grade"
          subtitle={`Side-by-side comparison across grades at ${school.name}`}
          icon={<DemographicsIcon />}
          accent={DEMO_COLOR}
          footer={<ChartLegend items={[
            { color: DEMO_COLOR, label: 'RMI score' },
            { color: '#7CB5F5',  label: 'Engagement %' },
          ]} />}
        >
          <TrendChart
            type="bar"
            data={gradeRows}
            xKey="grade"
            yDomain={[40, 90]}
            yTicks={[40, 60, 80, 100]}
            height="md"
            xPadding={{ left: 12, right: 12 }}
            series={[
              { key: 'rmi',        name: 'RMI score',  color: DEMO_COLOR, colorFn: d => rmiColor(d.rmi) },
              { key: 'engagement', name: 'Engagement', color: '#7CB5F5' },
            ]}
          />
        </ChartCard>

        <ChartCard
          span={2}
          title={`Recommended Actions for ${school.name}`}
          subtitle="Equity-driven priorities for school leadership"
          icon={<DemographicsIcon />}
          accent={DEMO_COLOR}
          bodyPad="padded"
        >
          <div className="dm-actions">
            {details.frl >= 50 && (
              <div className="dm-action-row dm-action-row--critical">
                <div className="dm-action-head">
                  <div className="dm-action-school">
                    High-FRL cohort support
                    <span className="dm-action-frl"> · {details.frl}% FRL</span>
                  </div>
                  <Pill color="#DC2626" variant="soft" size="sm">High Priority</Pill>
                </div>
                <div className="dm-action-text">
                  With {Math.round(school.students * details.frl / 100).toLocaleString()} students on free/reduced lunch, monitor engagement gaps in lower-grade cohorts and consider expanded book access programs.
                </div>
              </div>
            )}
            {stats.rmi < 75 && (
              <div className="dm-action-row dm-action-row--warning">
                <div className="dm-action-head">
                  <div className="dm-action-school">RMI below district average</div>
                  <Pill color="#D97706" variant="soft" size="sm">Monitor</Pill>
                </div>
                <div className="dm-action-text">
                  School-level RMI sits at {stats.rmi}. Look at the lowest-performing grade in the chart above and target a re-engagement challenge or teacher-led check-in.
                </div>
              </div>
            )}
            <div className="dm-action-row">
              <div className="dm-action-head">
                <div className="dm-action-school">Cross-cohort equity review</div>
                <Pill color="#D97706" variant="soft" size="sm">Monitor</Pill>
              </div>
              <div className="dm-action-text">
                Compare engagement rates between FRL-eligible students and the overall student body. If the gap exceeds 10pp, consider a targeted reading challenge or book-access intervention.
              </div>
            </div>
          </div>
        </ChartCard>

      </div>
    </div>
  )
}
