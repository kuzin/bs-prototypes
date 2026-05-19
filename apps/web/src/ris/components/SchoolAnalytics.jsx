import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell, ReferenceLine,
} from 'recharts'
import {
  SCHOOLS, SCHOOL_STATS, SCHOOL_DETAILS, SCHOOL_HEALTH,
  RMI_TRENDS, SESSION_TRENDS, ROI_TRENDS,
  GRADE_PERFORMANCE, SCHOOL_GRADE_LEVELS, LEXILE_BY_GRADE,
} from '../data'
import { PageHero } from './PageHero'
import './Analytics.css'

const AnalyticsIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="3" height="6" rx="1"/>
    <rect x="8.5" y="7" width="3" height="10" rx="1"/>
    <rect x="14" y="3" width="3" height="14" rx="1"/>
  </svg>
)

// Per-school student engagement funnel — scales district shape to the school's roster
// and skews depth by the school's overall engagement rate (so weak schools have steeper drop-off).
function buildSchoolFunnel(school, stats) {
  const enrolled = school.students
  const engagement = stats.engagement / 100
  // depth multiplier: schools with low engagement have proportionally fewer deep-habit kids
  const depth = 0.6 + engagement * 0.5
  const pcts = [100, Math.round(engagement * 100), Math.round(engagement * 70 * depth), Math.round(engagement * 32 * depth), Math.round(engagement * 18 * depth)]
  const stages = [
    { stage: 'Enrolled Students', note: 'Active roster in Beanstack' },
    { stage: 'Logged This Month', note: 'At least 1 log in May 2025' },
    { stage: 'Weekly Habit',      note: '1+ log every week for 4+ weeks' },
    { stage: 'Daily Habit',       note: '5+ days logged per week' },
    { stage: '30-Day Streak',     note: 'Unbroken streak ≥ 30 days' },
  ]
  const deltas = [null, +4, +6, +3, +2]
  return stages.map((s, i) => ({
    ...s,
    pct: pcts[i],
    count: Math.round(enrolled * pcts[i] / 100),
    delta: deltas[i],
  }))
}

// Student-level engagement distribution within this school
function buildEngagementDistribution(school, stats) {
  const total = school.students
  const engagedPct = stats.engagement
  const weeklyPct  = Math.round(engagedPct * 0.7)
  const dailyPct   = Math.round(engagedPct * 0.32)
  const inactive   = 100 - engagedPct
  return [
    { tier: 'Inactive',      pct: inactive,            count: Math.round(total * inactive / 100),            color: '#E2E8F0', desc: 'No log in 14+ days' },
    { tier: 'Light reader',  pct: engagedPct - weeklyPct, count: Math.round(total * (engagedPct - weeklyPct) / 100), color: '#FDE68A', desc: '1–2 logs/week' },
    { tier: 'Weekly habit',  pct: weeklyPct - dailyPct, count: Math.round(total * (weeklyPct - dailyPct) / 100),   color: '#7CB5F5', desc: '3–4 logs/week' },
    { tier: 'Daily habit',   pct: dailyPct,             count: Math.round(total * dailyPct / 100),             color: '#0DA7BC', desc: '5+ logs/week' },
  ]
}

export function SchoolAnalytics({ schoolId }) {
  const school   = SCHOOLS.find(s => s.id === schoolId)
  const stats    = SCHOOL_STATS.find(s => s.id === schoolId)
  const details  = SCHOOL_DETAILS[schoolId]
  const health   = SCHOOL_HEALTH[schoolId]

  const funnel       = buildSchoolFunnel(school, stats)
  const distribution = buildEngagementDistribution(school, stats)

  const rmiData = RMI_TRENDS.map(d => ({ month: d.month, school: d[schoolId], district: d.district }))
  const sessionData = SESSION_TRENDS.map(d => ({ month: d.month, school: d[schoolId], district: d.district }))

  // Grade-level engagement within this school (filter district grade performance to this school's grades)
  const gradeIdxs = SCHOOL_GRADE_LEVELS[schoolId]
  const gradeNames = gradeIdxs.map(i => LEXILE_BY_GRADE[i].grade.replace(/(st|nd|rd|th)/, ''))
  const schoolGrades = GRADE_PERFORMANCE.filter(g => gradeNames.includes(g.grade))

  return (
    <div className="an-root">

      <PageHero
        icon={<AnalyticsIcon />}
        title="Analytics"
        subtitle={`Student engagement, reading behavior, and outcome correlations · ${school.name}`}
        accent={school.color}
        accentBg="#ECFEFF"
      />

      <div className="sv-stats-row">
        <div className="sv-stat">
          <div className="sv-stat-val">{stats.engagement}%</div>
          <div className="sv-stat-lbl">Active Students</div>
          <div className="sv-stat-sub">{Math.round(school.students * stats.engagement / 100).toLocaleString()} of {school.students.toLocaleString()}</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val">{stats.avgSession} min</div>
          <div className="sv-stat-lbl">Avg Session Length</div>
          <div className="sv-stat-sub">Per active student</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val">{stats.streakPct}%</div>
          <div className="sv-stat-lbl">Weekly Habit Rate</div>
          <div className="sv-stat-sub">Logged 4+ weeks running</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val" style={{ color: '#16A97A' }}>{health.motivation}</div>
          <div className="sv-stat-lbl">RMI Score</div>
          <div className="sv-stat-sub">+{health.dM} pts vs. Sep</div>
        </div>
      </div>

      <div className="sv-grid">

        {/* Engagement funnel — school-scoped */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Student Engagement Funnel</h3>
              <div className="sv-note">Habit depth across all {school.students.toLocaleString()} students · {school.name} · May 2025</div>
            </div>
          </div>
          <div className="an-funnel">
            {funnel.map((step, i) => {
              const next = funnel[i + 1]
              const dropOff = next ? step.count - next.count : null
              return (
                <div key={step.stage} className="an-funnel-block">
                  <div className="an-funnel-row">
                    <div className="an-funnel-label-group">
                      <span className="an-funnel-stage">{step.stage}</span>
                      <span className="an-funnel-note">{step.note}</span>
                    </div>
                    <div className="an-funnel-track">
                      <div
                        className="an-funnel-bar"
                        style={{ width: `${step.pct}%`, opacity: 1 - i * 0.12, background: school.color }}
                      />
                    </div>
                    <div className="an-funnel-right">
                      <span className="an-funnel-count">{step.count.toLocaleString()}</span>
                      <div className="an-funnel-meta">
                        <span className="an-funnel-pct">{step.pct}%</span>
                        {step.delta != null && (
                          <span className="an-funnel-delta">↑{step.delta}pp</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {dropOff > 0 && (
                    <div className="an-funnel-dropoff">
                      <span className="an-funnel-dropoff-line" />
                      <span className="an-funnel-dropoff-text">
                        {dropOff.toLocaleString()} students not yet forming next habit
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Student engagement distribution */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div>
              <h3>Student Engagement Tiers</h3>
              <div className="sv-note">Where {school.students.toLocaleString()} students fall on the activity spectrum</div>
            </div>
          </div>
          <div className="an-tiers">
            {distribution.map(t => (
              <div key={t.tier} className="an-tier-row">
                <div className="an-tier-info">
                  <div className="an-tier-name">{t.tier}</div>
                  <div className="an-tier-desc">{t.desc}</div>
                </div>
                <div className="an-tier-track">
                  <div className="an-tier-bar" style={{ width: `${t.pct}%`, background: t.color }} />
                </div>
                <div className="an-tier-vals">
                  <span className="an-tier-pct">{t.pct}%</span>
                  <span className="an-tier-count">{t.count.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RMI vs. district */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div>
              <h3>RMI Trend vs. District</h3>
              <div className="sv-note">Reading Motivation Index, Sep – May</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={rmiData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[55, 90]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="school" name={school.name.split(' ')[0]} stroke={school.color} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="district" name="District avg" stroke="#94A3B8" strokeWidth={1.5} dot={false} strokeDasharray="5 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement by grade */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Engagement by Grade Level</h3>
              <div className="sv-note">Active student % &amp; RMI score across grades served by {school.name}</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={schoolGrades} margin={{ top: 4, right: 16, left: -20, bottom: 0 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="grade" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[40, 90]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="engagement" name="Active %" fill={school.color} radius={[3, 3, 0, 0]} />
              <Bar dataKey="rmi"        name="RMI" fill="#94A3B8" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Outcome correlations */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Engagement → Outcome Correlations</h3>
              <div className="sv-note">Reading engagement vs. attendance &amp; behavioral incidents · Sep 2024 – May 2025</div>
            </div>
            <span className="an-sis-badge">Requires SIS data</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={ROI_TRENDS} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis yAxisId="left" domain={[60, 95]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
              <YAxis yAxisId="right" orientation="right" domain={[20, 45]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left"  type="monotone" dataKey="engagement" name="Reading Engagement %" stroke={school.color} strokeWidth={2.5} dot={false} />
              <Line yAxisId="left"  type="monotone" dataKey="attendance" name="Attendance Rate %"    stroke="#16A97A" strokeWidth={2}   dot={false} strokeDasharray="5 4" />
              <Line yAxisId="right" type="monotone" dataKey="incidents"  name="Behavioral Incidents" stroke="#E8866A" strokeWidth={2}   dot={false} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
          <div className="an-roi-callouts">
            <div className="an-callout an-callout--pos">
              <span className="an-callout-val">r = 0.82</span>
              <span className="an-callout-lbl">Engagement ↔ Attendance</span>
            </div>
            <div className="an-callout an-callout--neg">
              <span className="an-callout-val">r = −0.76</span>
              <span className="an-callout-lbl">Engagement ↔ Incidents</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
