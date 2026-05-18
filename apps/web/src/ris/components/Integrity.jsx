import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts'
import { BTWB_TRENDS, SCHOOLS, DISTRICT_HEALTH, SCHOOL_HEALTH } from '../data'
import { BucketHero } from './BucketHero'
import './RisLayout.css'

export function Integrity({ onBack }) {
  const ranked = [...SCHOOLS]
    .map(s => ({ id: s.id, name: s.name.split(' ')[0], integrity: SCHOOL_HEALTH[s.id].integrity, color: s.color }))
    .sort((a, b) => b.integrity - a.integrity)

  return (
    <div>
      <BucketHero bucket="integrity" score={DISTRICT_HEALTH.integrity} delta={DISTRICT_HEALTH.dI} onBack={onBack} />

      <div className="sv-grid">
        <div className="sv-card sv-card--wide">
          <h3>BTWB Engagement & Integrity — District</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={BTWB_TRENDS} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
              <Tooltip formatter={v => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="engagement" name="Engagement Rate" stroke="#E8866A" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="integrity" name="Integrity Score" stroke="#1D4ED8" strokeWidth={2.5} dot={false} strokeDasharray="5 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="sv-card sv-card--wide">
          <h3>Schools ranked by integrity score</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ranked} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" horizontal={false} />
              <XAxis type="number" domain={[60, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} width={90} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="integrity" name="Integrity" radius={[0, 4, 4, 0]}>
                {ranked.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
