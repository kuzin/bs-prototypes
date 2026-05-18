import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Cell,
} from 'recharts'
import { SCHOOLS, SCHOOL_STATS, RMI_TRENDS, SESSION_TRENDS, LEXILE_DATA, SCHOOL_HEALTH } from '../data'
import { ReadingHealth } from './ReadingHealth'
import { StudentsToWatch } from './StudentsToWatch'
import { OverviewHero } from './OverviewHero'
import { AlertsBanner } from './AlertsBanner'
import './RisLayout.css'

function schoolInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2)
}

export function SchoolDashboard({ schoolId, onNavigate, onOpenStudent, alerts = [] }) {
  const school = SCHOOLS.find(s => s.id === schoolId)
  const health = SCHOOL_HEALTH[schoolId]

  const rmiData     = RMI_TRENDS.map(d => ({ month: d.month, school: d[schoolId], district: d.district }))
  const sessionData = SESSION_TRENDS.map(d => ({ month: d.month, school: d[schoolId], district: d.district }))

  const lexileCtx = LEXILE_DATA.map(d => ({
    name:    d.school,
    growth:  d.lexileGrowth,
    isThis:  d.id === schoolId,
  })).sort((a, b) => b.growth - a.growth)

  return (
    <div>
      <OverviewHero
        title={school.name}
        subtitle={`${school.grades} · ${school.students.toLocaleString()} students`}
        accent={school.color}
        initials={schoolInitials(school.name)}
      />

      <AlertsBanner alerts={alerts} />

      <ReadingHealth
        title="Student Reading Health"
        data={health}
        onNavigate={onNavigate}
      />

      <StudentsToWatch schoolId={schoolId} onOpenStudent={onOpenStudent} />

      <div className="sv-grid">
        {/* RMI trend — wide */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <h3>Reading Motivation Index — {school.name} vs. District</h3>
            <button className="sv-drill" onClick={() => onNavigate('motivation')}>View motivation →</button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={rmiData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="schoolGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={school.color} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={school.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[55, 90]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="school" name={school.name.split(' ')[0]} stroke={school.color} fill="url(#schoolGrad)" strokeWidth={2.5} dot={false} />
              <Area type="monotone" dataKey="district" name="District avg" stroke="#94A3B8" fill="none" strokeWidth={1.5} dot={false} strokeDasharray="5 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Session length */}
        <div className="sv-card">
          <div className="sv-card-header">
            <h3>Avg Session Length</h3>
            <button className="sv-drill" onClick={() => onNavigate('habits')}>View habits →</button>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={sessionData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[6, 32]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit=" min" />
              <Tooltip formatter={v => `${v} min`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="school" name={school.name.split(' ')[0]} stroke={school.color} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="district" name="District avg" stroke="#94A3B8" strokeWidth={1.5} dot={false} strokeDasharray="5 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lexile district context */}
        <div className="sv-card">
          <div className="sv-card-header">
            <h3>Lexile Growth — District Ranking</h3>
            <button className="sv-drill" onClick={() => onNavigate('skills')}>View skills →</button>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={lexileCtx} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" horizontal={false} />
              <XAxis type="number" domain={[0, 130]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="L" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} width={70} />
              <ReferenceLine x={65} stroke="#D97706" strokeDasharray="4 3" label={{ value: '+65L', position: 'top', fontSize: 10, fill: '#D97706' }} />
              <Tooltip formatter={v => `+${v}L`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="growth" name="Lexile growth" radius={[0, 4, 4, 0]}>
                {lexileCtx.map((d, i) => (
                  <Cell key={i} fill={d.isThis ? school.color : '#CBD5E1'} opacity={d.isThis ? 1 : 0.55} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="sv-legend">
            <span style={{ color: school.color }}>■ {school.name.split(' ')[0]}</span>
            <span style={{ color: '#CBD5E1' }}>■ Other schools</span>
          </div>
        </div>
      </div>
    </div>
  )
}
