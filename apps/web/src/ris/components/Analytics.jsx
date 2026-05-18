import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { ROI_TRENDS, SCHOOL_STATS, ENGAGEMENT_FUNNEL } from '../data'
import { PageHero } from './PageHero'
import './Analytics.css'

const AnalyticsIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="3" height="6" rx="1"/>
    <rect x="8.5" y="7" width="3" height="10" rx="1"/>
    <rect x="14" y="3" width="3" height="14" rx="1"/>
  </svg>
)

export function Analytics() {
  const sortedSchools = [...SCHOOL_STATS].sort((a, b) => b.engagement - a.engagement)
  const districtAvg   = Math.round(SCHOOL_STATS.reduce((s, x) => s + x.engagement, 0) / SCHOOL_STATS.length)

  return (
    <div className="an-root">

      <PageHero
        icon={<AnalyticsIcon />}
        title="Analytics"
        subtitle="Engagement trends, reading behavior, and outcome correlations"
        accent="#0DA7BC"
        accentBg="#ECFEFF"
      />

      <div className="sv-stats-row">
        <div className="sv-stat">
          <div className="sv-stat-val">78%</div>
          <div className="sv-stat-lbl">School Engagement Rate</div>
          <div className="sv-stat-sub">+6pp vs Sep 2024</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val">26 min</div>
          <div className="sv-stat-lbl">Avg Session Length</div>
          <div className="sv-stat-sub">+9 min vs Sep 2024</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val">55%</div>
          <div className="sv-stat-lbl">Weekly Reading Habit</div>
          <div className="sv-stat-sub">+6pp vs last month</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val" style={{ color: '#16A97A' }}>15%</div>
          <div className="sv-stat-lbl">30-Day Streak Rate</div>
          <div className="sv-stat-sub">+2pp vs last month</div>
        </div>
      </div>

      <div className="sv-grid">

        {/* Engagement Funnel — full width, enriched */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>District Engagement Funnel</h3>
              <div className="sv-note">Habit depth across all 12,400 enrolled students · Riverside USD · May 2025</div>
            </div>
          </div>
          <div className="an-funnel">
            {ENGAGEMENT_FUNNEL.map((step, i) => {
              const next = ENGAGEMENT_FUNNEL[i + 1]
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
                        style={{ width: `${step.pct}%`, opacity: 1 - i * 0.12 }}
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

        {/* ROI Correlations — full width */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Engagement → Outcome Correlations</h3>
              <div className="sv-note">Reading engagement vs. attendance rate &amp; behavioral incidents · Sep 2024 – May 2025</div>
            </div>
            <span className="an-sis-badge">Requires SIS data</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={ROI_TRENDS} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis yAxisId="left" domain={[60, 85]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
              <YAxis yAxisId="right" orientation="right" domain={[20, 45]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="engagement" name="Reading Engagement %" stroke="#0DA7BC" strokeWidth={2.5} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="attendance" name="Attendance Rate %" stroke="#16A97A" strokeWidth={2} dot={false} strokeDasharray="5 4" />
              <Line yAxisId="right" type="monotone" dataKey="incidents" name="Behavioral Incidents" stroke="#E8866A" strokeWidth={2} dot={false} strokeDasharray="3 3" />
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

        {/* School Engagement Comparison — full width */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>School Engagement Comparison</h3>
              <div className="sv-note">% active students by school · district avg {districtAvg}%</div>
            </div>
          </div>
          <div className="an-engage-list">
            {sortedSchools.map(s => (
              <div key={s.id} className="an-engage-row">
                <div className="an-engage-name">{s.name}</div>
                <div className="an-engage-track">
                  <div
                    className={`an-engage-bar${s.engagement >= districtAvg ? ' an-engage-bar--above' : ' an-engage-bar--below'}`}
                    style={{ width: `${s.engagement}%` }}
                  />
                  <div className="an-engage-avg-line" style={{ left: `${districtAvg}%` }} />
                </div>
                <span className="an-engage-val">{s.engagement}%</span>
              </div>
            ))}
          </div>
          <div className="an-engage-legend">
            <span className="an-engage-dot an-engage-dot--above" /> Above avg
            <span className="an-engage-dot an-engage-dot--below" style={{ marginLeft: 12 }} /> Below avg
            <span className="an-engage-avg-marker">— district avg ({districtAvg}%)</span>
          </div>
        </div>

      </div>
    </div>
  )
}
