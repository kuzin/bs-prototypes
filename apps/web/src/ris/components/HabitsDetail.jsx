import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts'
import './HabitsDetail.css'
import { SESSION_TRENDS, STREAK_DATA, VELOCITY_TRENDS, SCHOOL_STATS, SCHOOLS, DISTRICT_HEALTH } from '../data'
import { BucketHero } from './BucketHero'

const DISTRICT_AVG_SESSION = 20

function StatCard({ label, value, sub }) {
  return (
    <div className="hd-stat">
      <div className="hd-stat-value">{value}</div>
      <div className="hd-stat-label">{label}</div>
      {sub && <div className="hd-stat-sub">{sub}</div>}
    </div>
  )
}

export function HabitsDetail({ onBack }) {
  return (
    <div className="habits-detail">
      <BucketHero bucket="habits" score={DISTRICT_HEALTH.habits} delta={DISTRICT_HEALTH.dH} onBack={onBack} />

      <div className="hd-stats-row">
        <StatCard label="District avg session" value="20 min" sub="↑6 min since Sep" />
        <StatCard label="Active reading streaks" value="41%" sub="of all students" />
        <StatCard label="Avg reading days/week" value="3.2 days" sub="district-wide" />
        <StatCard label="Avg books/month" value="2.8 books" sub="all grade levels" />
      </div>

      <div className="hd-grid">
        {/* Session length trends */}
        <div className="hd-card hd-card--wide">
          <h3>Session Length Trends by School</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={SESSION_TRENDS} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[8, 30]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit=" min" />
              <Tooltip formatter={v => `${v} min`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="district" name="District avg" stroke="#1E293B" strokeWidth={2.5} dot={false} strokeDasharray="6 3" />
              {SCHOOLS.map(s => (
                <Line key={s.id} type="monotone" dataKey={s.id} name={s.name.split(' ')[0]} stroke={s.color} strokeWidth={1.5} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* School comparison bar */}
        <div className="hd-card">
          <h3>School Comparison — Avg Session (May)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={SCHOOL_STATS.sort((a, b) => b.avgSession - a.avgSession)}
              layout="vertical"
              margin={{ top: 4, right: 20, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" domain={[0, 30]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit=" min" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} width={90} />
              <Tooltip formatter={v => `${v} min`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Bar dataKey="avgSession" radius={[0, 4, 4, 0]}>
                {SCHOOL_STATS.map(s => (
                  <Cell key={s.id} fill={s.avgSession >= DISTRICT_AVG_SESSION ? '#0DA7BC' : '#E8866A'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="hd-legend">
            <span style={{ color: '#0DA7BC' }}>■ At/above district avg (20 min)</span>
            <span style={{ color: '#E8866A' }}>■ Below district avg</span>
          </div>
        </div>

        {/* Streak milestones */}
        <div className="hd-card">
          <h3>Streak Milestones — % of Students</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={STREAK_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="milestone" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
              <Tooltip formatter={v => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {SCHOOLS.map(s => (
                <Bar key={s.id} dataKey={s.id} name={s.name.split(' ')[0]} fill={s.color} radius={[2, 2, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reading velocity */}
        <div className="hd-card">
          <h3>Reading Velocity — Books/Month by Level</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={VELOCITY_TRENDS} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                {[['elGrad','#0DA7BC'],['midGrad','#16A97A'],['hiGrad','#C084FC']].map(([id, c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[1, 5]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit=" bks" />
              <Tooltip formatter={v => `${v} bks/mo`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="elementary" name="Elementary" stroke="#0DA7BC" fill="url(#elGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="middle" name="Middle" stroke="#16A97A" fill="url(#midGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="high" name="High" stroke="#C084FC" fill="url(#hiGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
