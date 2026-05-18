import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts'
import { SCHOOLS, SCHOOL_STATS, SCHOOL_HEALTH, SESSION_TRENDS, STREAK_DATA, VELOCITY_TRENDS, READING_DIET } from '../data'
import { BucketHero } from './BucketHero'
import './RisLayout.css'
import './SchoolHabits.css'

export function SchoolHabits({ schoolId, onBack }) {
  const school  = SCHOOLS.find(s => s.id === schoolId)
  const stats   = SCHOOL_STATS.find(s => s.id === schoolId)
  const health  = SCHOOL_HEALTH[schoolId]

  const sessionData = SESSION_TRENDS.map(d => ({ month: d.month, school: d[schoolId], district: d.district }))

  const streakData = STREAK_DATA.map(d => ({
    milestone: d.milestone,
    value:     d[schoolId],
    district:  Math.round(Object.entries(d).filter(([k]) => k !== 'milestone').reduce((a, [,v]) => a + v, 0) / 6),
  }))

  return (
    <div>
      <BucketHero bucket="habits" score={health.habits} delta={health.dH} onBack={onBack} />

      <div className="sv-stats-row">
        {[
          { label: 'Avg Session Length',   value: `${stats.avgSession} min`, sub: stats.avgSession >= 20 ? '↑ Above district avg' : '↓ Below district avg (20 min)' },
          { label: 'Active Streaks',        value: `${stats.streakPct}%`,    sub: 'of enrolled students' },
          { label: 'Avg Reading Days/Week', value: '3.1 days',               sub: 'school average' },
          { label: 'Avg Books/Month',       value: '2.6 books',              sub: 'all grade levels' },
        ].map(s => (
          <div key={s.label} className="sv-stat">
            <div className="sv-stat-val" style={{ color: '#0DA7BC' }}>{s.value}</div>
            <div className="sv-stat-lbl">{s.label}</div>
            <div className="sv-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="sv-grid">
        {/* Session trend — wide */}
        <div className="sv-card sv-card--wide">
          <h3>Session Length Trend — {school.name} vs. District</h3>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={sessionData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[6, 32]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit=" min" />
              <Tooltip formatter={v => `${v} min`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={20} stroke="#D97706" strokeDasharray="4 3" label={{ value: 'District avg (20 min)', position: 'right', fontSize: 10, fill: '#D97706' }} />
              <Line type="monotone" dataKey="school" name={school.name.split(' ')[0]} stroke={school.color} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="district" name="District avg" stroke="#94A3B8" strokeWidth={1.5} dot={false} strokeDasharray="5 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Streak milestones */}
        <div className="sv-card">
          <h3>Streak Milestones</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={streakData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
              <XAxis dataKey="milestone" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
              <Tooltip formatter={v => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="value" name={school.name.split(' ')[0]} fill={school.color} radius={[3, 3, 0, 0]} />
              <Bar dataKey="district" name="District avg" fill="#CBD5E1" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reading velocity */}
        <div className="sv-card">
          <h3>Reading Velocity by Level</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={VELOCITY_TRENDS} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                {[['vElGrad','#0DA7BC'],['vMidGrad','#16A97A'],['vHiGrad','#C084FC']].map(([id, c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[1, 5]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit=" bks" />
              <Tooltip formatter={v => `${v} bks/mo`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="elementary" name="Elementary" stroke="#0DA7BC" fill="url(#vElGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="middle" name="Middle" stroke="#16A97A" fill="url(#vMidGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="high" name="High" stroke="#C084FC" fill="url(#vHiGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Reading Diet */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div>
              <h3>"Reading Diet" Breakdown</h3>
              <div className="sv-note">AI genre analysis · district-wide 2024–25</div>
            </div>
            <span className="sh-gemini-badge">✦ Gemini</span>
          </div>
          <div className="sh-diet-list">
            {READING_DIET.map(d => (
              <div key={d.genre} className="sh-diet-row">
                <div className="sh-diet-label">
                  <span className="sh-diet-dot" style={{ background: d.color }} />
                  <span className="sh-diet-genre">{d.genre}</span>
                </div>
                <div className="sh-diet-bar-wrap">
                  <div className="sh-diet-bar" style={{
                    width: `${(d.pct / Math.max(...READING_DIET.map(x => x.pct))) * 100}%`,
                    background: d.color,
                  }} />
                </div>
                <span className="sh-diet-pct">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
