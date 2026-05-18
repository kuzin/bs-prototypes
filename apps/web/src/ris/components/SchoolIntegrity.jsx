import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, ReferenceLine,
} from 'recharts'
import { SCHOOLS, BTWB_TRENDS, SCHOOL_HEALTH } from '../data'
import { BucketHero } from './BucketHero'
import './RisLayout.css'

export function SchoolIntegrity({ schoolId, onBack }) {
  const school = SCHOOLS.find(s => s.id === schoolId)
  const health = SCHOOL_HEALTH[schoolId]

  const ranked = [...SCHOOLS]
    .map(s => ({ id: s.id, name: s.name.split(' ')[0], integrity: SCHOOL_HEALTH[s.id].integrity, isThis: s.id === schoolId }))
    .sort((a, b) => b.integrity - a.integrity)

  return (
    <div>
      <BucketHero bucket="integrity" score={health.integrity} delta={health.dI} onBack={onBack} />

      <div className="sv-grid">
        <div className="sv-card sv-card--wide">
          <h3>BTWB Integrity Trend — District average</h3>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={BTWB_TRENDS} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
              <ReferenceLine y={health.integrity} stroke={school.color} strokeDasharray="5 4" label={{ value: `${school.name.split(' ')[0]} (${health.integrity})`, position: 'right', fontSize: 11, fill: school.color }} />
              <Tooltip formatter={v => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="engagement" name="District Engagement" stroke="#E8866A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="integrity" name="District Integrity" stroke="#1D4ED8" strokeWidth={2.5} dot={false} strokeDasharray="5 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="sv-card sv-card--wide">
          <h3>District integrity ranking</h3>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={ranked} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" horizontal={false} />
              <XAxis type="number" domain={[60, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} width={90} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="integrity" name="Integrity" radius={[0, 4, 4, 0]}>
                {ranked.map((d, i) => <Cell key={i} fill={d.isThis ? school.color : '#CBD5E1'} opacity={d.isThis ? 1 : 0.6} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
