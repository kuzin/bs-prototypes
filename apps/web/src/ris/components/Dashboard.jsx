import {
  AreaChart, Area, LineChart, Line,
  ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis,
} from 'recharts'
import './Dashboard.css'
import { RMI_TRENDS, SESSION_TRENDS, BTWB_TRENDS, LEXILE_DATA, SCHOOLS, DISTRICT, DISTRICT_HEALTH } from '../data'
import { ReadingHealth } from './ReadingHealth'
import { OverviewHero } from './OverviewHero'
import { AlertsBanner } from './AlertsBanner'

function SectionCard({ title, children, onDrill }) {
  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <h3>{title}</h3>
        {onDrill && <button className="dash-drill" onClick={onDrill}>View details →</button>}
      </div>
      {children}
    </div>
  )
}

export function Dashboard({ onNavigate, onOpenStudent, alerts = [] }) {
  return (
    <div className="dashboard">
      <OverviewHero
        title={DISTRICT.name}
        subtitle={`${DISTRICT.schools} schools · ${DISTRICT.students.toLocaleString()} students`}
        initials="RUSD"
      />

      <AlertsBanner alerts={alerts} onNavigate={onNavigate} />

      <ReadingHealth
        title="Student Reading Health"
        data={DISTRICT_HEALTH}
        onNavigate={onNavigate}
      />

      {/* 2×2 chart grid */}
      <div className="dash-grid">
        {/* RMI Trends */}
        <SectionCard title="Reading Motivation Index (RMI)" onDrill={() => onNavigate('motivation')}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={RMI_TRENDS} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rmiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0DA7BC" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0DA7BC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[55, 90]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Area type="monotone" dataKey="district" name="District avg" stroke="#0DA7BC" strokeWidth={2.5} fill="url(#rmiGrad)" dot={false} />
              {SCHOOLS.map(s => (
                <Line key={s.id} type="monotone" dataKey={s.id} name={s.name} stroke={s.color} strokeWidth={1} dot={false} strokeDasharray="4 3" opacity={0.6} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
          <div className="dash-legend">
            <span style={{ color: '#0DA7BC', fontWeight: 700 }}>— District avg</span>
            {SCHOOLS.map(s => <span key={s.id} style={{ color: s.color }}>– {s.name.split(' ')[0]}</span>)}
          </div>
        </SectionCard>

        {/* Reading Habits */}
        <SectionCard title="Reading Habits" onDrill={() => onNavigate('habits')}>
          <div className="dash-habits-stats">
            <div className="dash-mini-stat">
              <span className="dash-mini-val">20 min</span>
              <span className="dash-mini-lbl">avg session</span>
            </div>
            <div className="dash-mini-stat">
              <span className="dash-mini-val">41%</span>
              <span className="dash-mini-lbl">active streaks</span>
            </div>
            <div className="dash-mini-stat">
              <span className="dash-mini-val">3.2</span>
              <span className="dash-mini-lbl">days/week avg</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={SESSION_TRENDS} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A97A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16A97A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[8, 30]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip formatter={v => `${v} min`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Area type="monotone" dataKey="district" name="District avg" stroke="#16A97A" strokeWidth={2} fill="url(#sessGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* BTWB Engagement */}
        <SectionCard title="BTWB Engagement &amp; Integrity" onDrill={() => onNavigate('integrity')}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={BTWB_TRENDS} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip formatter={v => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="engagement" name="Engagement Rate" stroke="#E8866A" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="integrity" name="Integrity Score" stroke="#7CB5F5" strokeWidth={2.5} dot={false} strokeDasharray="5 4" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Lexile scatter */}
        <SectionCard title="Lexile Growth vs. Reading Volume" onDrill={() => onNavigate('skills')}>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="volume" name="Books read/mo" type="number" domain={[15, 50]} tick={{ fontSize: 11, fill: '#94A3B8' }} label={{ value: 'Books/mo', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#94A3B8' }} />
              <YAxis dataKey="lexileGrowth" name="Lexile growth" type="number" domain={[0, 130]} tick={{ fontSize: 11, fill: '#94A3B8' }} label={{ value: 'Lexile +L', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94A3B8' }} />
              <ZAxis dataKey="students" range={[60, 300]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                formatter={(v, name) => [name === 'Books read/mo' ? `${v} bks/mo` : `+${v}L`, name]}
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                      <div style={{ fontWeight: 700, marginBottom: 2 }}>{d.school}</div>
                      <div>Lexile growth: <b>+{d.lexileGrowth}L</b></div>
                      <div>Avg books/mo: <b>{d.volume}</b></div>
                    </div>
                  )
                }}
              />
              <Scatter
                data={LEXILE_DATA}
                fill="#0DA7BC"
                shape={({ cx, cy, payload }) => (
                  <circle cx={cx} cy={cy} r={Math.sqrt(payload.students / 80)} fill={payload.aboveExpected ? '#0DA7BC' : '#E8866A'} opacity={0.8} stroke="#fff" strokeWidth={1.5} />
                )}
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="dash-legend">
            <span style={{ color: '#0DA7BC' }}>● Above expected growth</span>
            <span style={{ color: '#E8866A' }}>● Below expected growth</span>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
