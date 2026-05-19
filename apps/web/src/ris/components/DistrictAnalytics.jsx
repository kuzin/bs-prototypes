import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  ROI_TRENDS, SCHOOL_HEALTH, SCHOOLS, DISTRICT_FUNNEL, BOOK_TALKS_BY_SCHOOL, SCHOOL_STATS,
} from '../data'
import { PageHero } from './PageHero'
import './Analytics.css'
import './DistrictAnalytics.css'

const AnalyticsIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="3" height="6" rx="1"/>
    <rect x="8.5" y="7" width="3" height="10" rx="1"/>
    <rect x="14" y="3" width="3" height="14" rx="1"/>
  </svg>
)

const scoreColor = v => v >= 80 ? '#16A97A' : v >= 65 ? '#D97706' : '#E8866A'
const scoreBg    = v => v >= 80 ? '#F0FDF4' : v >= 65 ? '#FFFBEB' : '#FEF2F2'

export function DistrictAnalytics() {
  const scorecardData = SCHOOLS.map(s => {
    const h = SCHOOL_HEALTH[s.id]
    const overall = Math.round((h.motivation + h.integrity + h.habits + h.skills) / 4)
    return { ...s, ...h, overall }
  }).sort((a, b) => b.overall - a.overall)

  const districtAvgEng  = Math.round(SCHOOL_STATS.reduce((s, x) => s + x.engagement, 0) / SCHOOL_STATS.length)
  const schoolsAboveAvg = SCHOOL_STATS.filter(s => s.engagement >= districtAvgEng).length
  const btAvgCompletion = Math.round(BOOK_TALKS_BY_SCHOOL.reduce((s, x) => s + x.completionRate, 0) / BOOK_TALKS_BY_SCHOOL.length)

  return (
    <div className="da-root">
      <PageHero
        icon={<AnalyticsIcon />}
        title="Analytics"
        subtitle="School performance scorecard, engagement trends, and outcome data across the district"
        accent="#0DA7BC"
        accentBg="#ECFEFF"
      />

      <div className="sv-stats-row">
        <div className="sv-stat">
          <div className="sv-stat-val">{districtAvgEng}%</div>
          <div className="sv-stat-lbl">District Engagement Rate</div>
          <div className="sv-stat-sub">+6pp vs Sep 2024</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val" style={{ color: '#16A97A' }}>
            {schoolsAboveAvg}{' '}
            <span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8' }}>of 6</span>
          </div>
          <div className="sv-stat-lbl">Schools above avg</div>
          <div className="sv-stat-sub">{districtAvgEng}% district benchmark</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val">{btAvgCompletion}%</div>
          <div className="sv-stat-lbl">Book Talks completion</div>
          <div className="sv-stat-sub">↑5pp vs Sep 2024</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val" style={{ color: '#16A97A' }}>r = 0.82</div>
          <div className="sv-stat-lbl">Engagement ↔ Attendance</div>
          <div className="sv-stat-sub">Positive outcome correlation</div>
        </div>
      </div>

      <div className="sv-grid">

        {/* School performance scorecard — full width */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>School Performance Scorecard</h3>
              <div className="sv-note">
                All 4 reading health buckets across 6 schools · May 2025 · Sorted by overall score
              </div>
            </div>
            <div className="da-legend">
              <span className="da-legend-dot da-legend-dot--green" /> ≥80
              <span className="da-legend-dot da-legend-dot--amber" style={{ marginLeft: 8 }} /> 65–79
              <span className="da-legend-dot da-legend-dot--red"   style={{ marginLeft: 8 }} /> &lt;65
            </div>
          </div>

          <div className="da-scorecard">
            <div className="da-sc-head">
              <div className="da-sc-cell da-sc-cell--name">School</div>
              <div className="da-sc-cell da-sc-cell--bucket" style={{ color: '#E8866A' }}>Motivation</div>
              <div className="da-sc-cell da-sc-cell--bucket" style={{ color: '#1D4ED8' }}>Integrity</div>
              <div className="da-sc-cell da-sc-cell--bucket" style={{ color: '#16A97A' }}>Habits</div>
              <div className="da-sc-cell da-sc-cell--bucket" style={{ color: '#7C3AED' }}>Skills</div>
              <div className="da-sc-cell da-sc-cell--overall">Overall</div>
              <div className="da-sc-cell da-sc-cell--action" />
            </div>
            {scorecardData.map(s => (
              <div key={s.id} className="da-sc-row">
                <div className="da-sc-cell da-sc-cell--name">
                  <span className="da-sc-dot" style={{ background: s.color }} />
                  <div>
                    <div className="da-sc-school-name">{s.name}</div>
                    <div className="da-sc-grades">{s.grades} · {s.students.toLocaleString()} students</div>
                  </div>
                </div>
                <div className="da-sc-cell da-sc-cell--bucket">
                  <span className="da-score-chip" style={{ color: scoreColor(s.motivation), background: scoreBg(s.motivation) }}>
                    {s.motivation}
                  </span>
                </div>
                <div className="da-sc-cell da-sc-cell--bucket">
                  <span className="da-score-chip" style={{ color: scoreColor(s.integrity), background: scoreBg(s.integrity) }}>
                    {s.integrity}
                  </span>
                </div>
                <div className="da-sc-cell da-sc-cell--bucket">
                  <span className="da-score-chip" style={{ color: scoreColor(s.habits), background: scoreBg(s.habits) }}>
                    {s.habits}
                  </span>
                </div>
                <div className="da-sc-cell da-sc-cell--bucket">
                  <span className="da-score-chip" style={{ color: scoreColor(s.skills), background: scoreBg(s.skills) }}>
                    {s.skills}
                  </span>
                </div>
                <div className="da-sc-cell da-sc-cell--overall">
                  <span className="da-overall-chip" style={{ background: s.color }}>{s.overall}</span>
                </div>
                <div className="da-sc-cell da-sc-cell--action">
                  <button
                    className="da-school-link"
                    title={`Would open ${s.name}'s dashboard in Beanstack`}
                    disabled
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* District engagement funnel — full width */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>District Engagement Funnel</h3>
              <div className="sv-note">
                Habit depth across all {DISTRICT_FUNNEL[0].count.toLocaleString()} enrolled students · Riverside USD · May 2025
              </div>
            </div>
          </div>
          <div className="an-funnel">
            {DISTRICT_FUNNEL.map((step, i) => {
              const next    = DISTRICT_FUNNEL[i + 1]
              const dropOff = next ? step.count - next.count : null
              return (
                <div key={step.stage} className="an-funnel-block">
                  <div className="an-funnel-row">
                    <div className="an-funnel-label-group">
                      <span className="an-funnel-stage">{step.stage}</span>
                      <span className="an-funnel-note">{step.note}</span>
                    </div>
                    <div className="an-funnel-track">
                      <div className="an-funnel-bar" style={{ width: `${step.pct}%`, opacity: 1 - i * 0.12 }} />
                    </div>
                    <div className="an-funnel-right">
                      <span className="an-funnel-count">{step.count.toLocaleString()}</span>
                      <div className="an-funnel-meta">
                        <span className="an-funnel-pct">{step.pct}%</span>
                        {step.delta != null && <span className="an-funnel-delta">↑{step.delta}pp</span>}
                      </div>
                    </div>
                  </div>
                  {dropOff && (
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

        {/* Outcome correlations */}
        <div className="sv-card">
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
              <YAxis yAxisId="left"  domain={[60, 85]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
              <YAxis yAxisId="right" orientation="right" domain={[20, 45]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left"  type="monotone" dataKey="engagement" name="Reading Engagement %" stroke="#0DA7BC" strokeWidth={2.5} dot={false} />
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

        {/* Book Talks adoption */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div>
              <h3>Book Talks Adoption by School</h3>
              <div className="sv-note">Completion rate vs. flag rate — May 2025</div>
            </div>
          </div>
          <div className="da-bt-list">
            {[...BOOK_TALKS_BY_SCHOOL]
              .sort((a, b) => b.completionRate - a.completionRate)
              .map(s => {
                const school = SCHOOLS.find(sc => sc.id === s.id)
                return (
                  <div key={s.id} className="da-bt-row">
                    <span className="da-bt-dot" style={{ background: school?.color }} />
                    <div className="da-bt-info">
                      <span className="da-bt-name">{s.name}</span>
                      <div className="da-bt-bars">
                        <div className="da-bt-bar-group">
                          <span className="da-bt-bar-lbl">Completion</span>
                          <div className="da-bt-track">
                            <div
                              className="da-bt-fill"
                              style={{ width: `${s.completionRate}%`, background: school?.color }}
                            />
                          </div>
                          <span className="da-bt-val">{s.completionRate}%</span>
                        </div>
                        <div className="da-bt-bar-group">
                          <span className="da-bt-bar-lbl" style={{ color: s.flagRate >= 15 ? '#DC2626' : '#94A3B8' }}>
                            Flag rate
                          </span>
                          <div className="da-bt-track">
                            <div
                              className="da-bt-fill"
                              style={{
                                width: `${s.flagRate * 2.5}%`,
                                background: s.flagRate >= 15 ? '#E8866A' : '#CBD5E1',
                              }}
                            />
                          </div>
                          <span className="da-bt-val" style={{ color: s.flagRate >= 15 ? '#DC2626' : '#64748B' }}>
                            {s.flagRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

      </div>
    </div>
  )
}
