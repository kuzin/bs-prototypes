import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts'
import {
  SCHOOLS, SCHOOL_DETAILS, SCHOOL_STATS,
  GRADE_PERFORMANCE, SCHOOL_GRADE_LEVELS, LEXILE_BY_GRADE,
} from '../data'
import { PageHero } from './PageHero'
import './Demographics.css'

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

// Per-school synthetic student cohort breakdowns (FRL, ELL, IEP, etc.)
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

  // Grade-level performance for grades this school serves
  const gradeIdxs  = SCHOOL_GRADE_LEVELS[schoolId]
  const gradeNames = gradeIdxs.map(i => LEXILE_BY_GRADE[i].grade.replace(/(st|nd|rd|th)/, ''))
  const schoolGrades = GRADE_PERFORMANCE.filter(g => gradeNames.includes(g.grade))

  // Synthesize an FRL gap across grade bands — higher grades typically dip a bit
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

      <PageHero
        icon={<DemographicsIcon />}
        title="Demographics"
        subtitle={`Student cohorts, equity indicators, and grade-level performance · ${school.name}`}
        accent={school.color}
        accentBg="#F5F3FF"
      />

      <div className="sv-stats-row">
        <div className="sv-stat">
          <div className="sv-stat-val">{school.students.toLocaleString()}</div>
          <div className="sv-stat-lbl">Total Students</div>
          <div className="sv-stat-sub">Grades {school.grades}</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val">{details.frl}%</div>
          <div className="sv-stat-lbl">FRL Rate</div>
          <div className="sv-stat-sub">{details.frl >= 50 ? 'High-need school' : details.frl >= 30 ? 'Mixed-income' : 'Low FRL'}</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val" style={{ color: details.titleI ? '#1D4ED8' : '#94A3B8' }}>
            {details.titleI ? 'Yes' : 'No'}
          </div>
          <div className="sv-stat-lbl">Title I Eligible</div>
          <div className="sv-stat-sub">{details.titleI ? 'Federal funding active' : 'Not Title I'}</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val">{stats.rmi}</div>
          <div className="sv-stat-lbl">RMI Score</div>
          <div className="sv-stat-sub">{stats.rmi >= 78 ? 'Above district avg' : stats.rmi >= 70 ? 'Near district avg' : 'Below district avg'}</div>
        </div>
      </div>

      <div className="sv-grid">

        {/* Student cohort breakdown — full width */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Student Cohorts</h3>
              <div className="sv-note">Demographic indicators for {school.students.toLocaleString()} enrolled students</div>
            </div>
          </div>
          <div className="dm-cohort-list">
            {cohorts.map(c => (
              <div key={c.label} className="dm-cohort-row">
                <div className="dm-cohort-info">
                  <div className="dm-cohort-name">{c.label}</div>
                  <div className="dm-cohort-desc">{c.desc}</div>
                </div>
                <div className="dm-cohort-track">
                  <div className="dm-cohort-bar" style={{ width: `${c.pct}%`, background: c.color }} />
                </div>
                <div className="dm-cohort-vals">
                  <span className="dm-cohort-pct">{c.pct}%</span>
                  <span className="dm-cohort-count">{Math.round(school.students * c.pct / 100).toLocaleString()} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade-level equity table — full width */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Grade-Level Performance</h3>
              <div className="sv-note">RMI, engagement, and FRL distribution across grades served</div>
            </div>
          </div>
          <div className="dm-equity-table dm-equity-table--school">
            <div className="dm-equity-head">
              <div className="dm-ec dm-ec--name">Grade</div>
              <div className="dm-ec dm-ec--rmi">RMI</div>
              <div className="dm-ec dm-ec--bar">Reading Motivation Index</div>
              <div className="dm-ec dm-ec--engage">Engagement</div>
              <div className="dm-ec dm-ec--lexile">Students</div>
              <div className="dm-ec dm-ec--frl">FRL %</div>
            </div>
            {gradeRows.map(g => (
              <div key={g.grade} className="dm-equity-row">
                <div className="dm-ec dm-ec--name dm-school-name">Grade {g.grade}</div>
                <div className="dm-ec dm-ec--rmi">
                  <span className="dm-rmi-val" style={{ color: rmiColor(g.rmi) }}>{g.rmi}</span>
                </div>
                <div className="dm-ec dm-ec--bar">
                  <div className="dm-rmi-bar-wrap">
                    <div className="dm-rmi-bar" style={{ width: `${g.rmi}%`, background: rmiColor(g.rmi) }} />
                  </div>
                </div>
                <div className="dm-ec dm-ec--engage">{g.engagement}%</div>
                <div className="dm-ec dm-ec--lexile">{g.count.toLocaleString()}</div>
                <div className="dm-ec dm-ec--frl">
                  <span className={`dm-frl-pill${g.frl >= 50 ? ' dm-frl-pill--high' : g.frl >= 30 ? ' dm-frl-pill--med' : ''}`}>
                    {g.frl}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RMI vs Engagement bar (per grade in this school) */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>RMI &amp; Engagement by Grade</h3>
              <div className="sv-note">Side-by-side comparison across grades at {school.name}</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={gradeRows} margin={{ top: 4, right: 16, left: -20, bottom: 0 }} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="grade" tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <YAxis domain={[40, 90]} tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Bar dataKey="rmi" name="RMI Score" radius={[3, 3, 0, 0]}>
                {gradeRows.map((g, i) => <Cell key={i} fill={rmiColor(g.rmi)} />)}
              </Bar>
              <Bar dataKey="engagement" name="Engagement %" fill="#7CB5F5" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendations — school-specific */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Recommended Actions for {school.name}</h3>
              <div className="sv-note">Equity-driven priorities for school leadership</div>
            </div>
          </div>
          <div className="dm-actions">
            {details.frl >= 50 && (
              <div className="dm-action-row dm-action-row--critical">
                <span className="dm-action-priority dm-action-priority--critical">High Priority</span>
                <div className="dm-action-body">
                  <div className="dm-action-school">
                    High-FRL cohort support
                    <span className="dm-action-frl"> · {details.frl}% FRL</span>
                  </div>
                  <div className="dm-action-text">
                    With {Math.round(school.students * details.frl / 100).toLocaleString()} students on free/reduced lunch, monitor engagement gaps in lower-grade cohorts and consider expanded book access programs.
                  </div>
                </div>
              </div>
            )}
            {stats.rmi < 75 && (
              <div className="dm-action-row dm-action-row--warning">
                <span className="dm-action-priority dm-action-priority--warning">Monitor</span>
                <div className="dm-action-body">
                  <div className="dm-action-school">RMI below district average</div>
                  <div className="dm-action-text">
                    School-level RMI sits at {stats.rmi}. Look at the lowest-performing grade in the chart above and target a re-engagement challenge or teacher-led check-in.
                  </div>
                </div>
              </div>
            )}
            <div className="dm-action-row">
              <span className="dm-action-priority dm-action-priority--warning">Monitor</span>
              <div className="dm-action-body">
                <div className="dm-action-school">Cross-cohort equity review</div>
                <div className="dm-action-text">
                  Compare engagement rates between FRL-eligible students and the overall student body. If the gap exceeds 10pp, consider a targeted reading challenge or book-access intervention.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
