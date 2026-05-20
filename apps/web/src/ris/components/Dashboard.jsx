import {
  AreaChart, Area, LineChart, Line,
  ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis,
} from 'recharts'
import './Dashboard.css'
import {
  RMI_TRENDS, SESSION_TRENDS, BOOK_TALKS_TRENDS, LEXILE_DATA,
  SCHOOLS, DISTRICT, DISTRICT_HEALTH, SCHOOLS_TO_WATCH,
} from '../data'
import { ReadingHealth } from './ReadingHealth'
import { Hero } from './Hero'
import { AlertsBanner } from './AlertsBanner'
import { Button } from './Button'
import { Pill } from './Pill'

function SectionCard({ title, children, onDrill }) {
  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <h3>{title}</h3>
        {onDrill && <Button variant="ghost" size="sm" onClick={onDrill}>View details →</Button>}
      </div>
      {children}
    </div>
  )
}

export function Dashboard({ onNavigate, alerts = [] }) {
  return (
    <div className="dashboard">
      <Hero
        initials="RUSD"
        title={DISTRICT.name}
        subtitle={`${DISTRICT.schools} schools · ${DISTRICT.students.toLocaleString()} students`}
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
              <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <YAxis domain={[55, 90]} tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0' }} />
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
              <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <YAxis domain={[8, 30]} tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <Tooltip formatter={v => `${v} min`} contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Area type="monotone" dataKey="district" name="District avg" stroke="#16A97A" strokeWidth={2} fill="url(#sessGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Book Talks */}
        <SectionCard title="Book Talks Engagement" onDrill={() => onNavigate('integrity')}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={BOOK_TALKS_TRENDS} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 13, fill: '#94A3B8' }} unit="%" />
              <Tooltip formatter={v => `${v}%`} contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Line type="monotone" dataKey="completionRate" name="Completion Rate" stroke="#1D4ED8" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="flagRate"       name="Flag Rate"       stroke="#E8866A" strokeWidth={2}   dot={false} strokeDasharray="5 4" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Lexile scatter */}
        <SectionCard title="Lexile Growth vs. Reading Volume" onDrill={() => onNavigate('skills')}>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="volume" name="Books read/mo" type="number" domain={[15, 50]} tick={{ fontSize: 13, fill: '#94A3B8' }} label={{ value: 'Books/mo', position: 'insideBottom', offset: -2, fontSize: 13, fill: '#94A3B8' }} />
              <YAxis dataKey="lexileGrowth" name="Lexile growth" type="number" domain={[0, 130]} tick={{ fontSize: 13, fill: '#94A3B8' }} label={{ value: 'Lexile +L', angle: -90, position: 'insideLeft', fontSize: 13, fill: '#94A3B8' }} />
              <ZAxis dataKey="students" range={[60, 300]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0' }}
                formatter={(v, name) => [name === 'Books read/mo' ? `${v} bks/mo` : `+${v}L`, name]}
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}>
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

      {/* Schools to Watch */}
      <div className="dash-stw">
        <div className="dash-stw-header">
          <h3 className="dash-stw-title">Schools to Watch</h3>
          <span className="dash-stw-note">Sites with signals requiring attention this month</span>
        </div>
        <div className="dash-stw-cards">
          {SCHOOLS_TO_WATCH.map(s => {
            const school = SCHOOLS.find(sc => sc.id === s.id)
            const bucketColors = { motivation: '#E8866A', integrity: '#1D4ED8', habits: '#16A97A', skills: '#7C3AED' }
            return (
              <div key={s.id} className={`dash-stw-card dash-stw-card--${s.concernType}`}>
                <div className="dash-stw-head">
                  <span className="dash-stw-dot" style={{ background: school?.color }} />
                  <div className="dash-stw-ident">
                    <span className="dash-stw-name">{s.name}</span>
                    <span className="dash-stw-grades">{s.grades}</span>
                  </div>
                  <Pill variant={s.concernType === 'critical' ? 'error' : 'warning'} size="sm">
                    {s.concernType === 'critical' ? 'Action needed' : 'Watch'}
                  </Pill>
                </div>
                <div className="dash-stw-concern">{s.concern}</div>
                <div className="dash-stw-metrics">
                  {Object.entries(s.health).map(([k, v]) => (
                    <div key={k} className="dash-stw-metric">
                      <span className="dash-stw-metric-lbl" style={{ color: bucketColors[k] }}>
                        {k[0].toUpperCase() + k.slice(1)}
                      </span>
                      <span
                        className="dash-stw-metric-val"
                        style={{ color: v < 65 ? '#E8866A' : v < 78 ? '#D97706' : '#16A97A' }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="dash-stw-footer">
                  <span className="dash-stw-link-hint">Opens in Beanstack school dashboard</span>
                  <Button variant="ghost" size="sm" disabled>View school →</Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
