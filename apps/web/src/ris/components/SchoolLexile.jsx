import {
  ScatterChart, Scatter, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, Legend,
} from 'recharts'
import { SCHOOLS, SCHOOL_STATS, SCHOOL_HEALTH, LEXILE_DATA, LEXILE_BY_GRADE, SCHOOL_GRADE_LEVELS } from '../data'
import { BucketHero } from './BucketHero'
import './RisLayout.css'

const EXPECTED_GROWTH = 65

export function SchoolLexile({ schoolId, onBack }) {
  const school    = SCHOOLS.find(s => s.id === schoolId)
  const stats     = SCHOOL_STATS.find(s => s.id === schoolId)
  const health    = SCHOOL_HEALTH[schoolId]
  const lexile    = LEXILE_DATA.find(d => d.id === schoolId)
  const gradeIdxs = SCHOOL_GRADE_LEVELS[schoolId]
  const grades    = gradeIdxs.map(i => LEXILE_BY_GRADE[i])

  return (
    <div>
      <BucketHero bucket="skills" score={health.skills} delta={health.dS} onBack={onBack} />

      <div className="sv-stats-row">
        {[
          { label: 'Avg Lexile Score',     value: `${lexile.avgLexile}L`,      sub: 'current school avg',              accent: '#0DA7BC' },
          { label: 'YTD Lexile Growth',    value: `+${lexile.lexileGrowth}L`,  sub: lexile.aboveExpected ? 'Above expected +65L' : 'Below expected +65L', accent: lexile.aboveExpected ? '#16A97A' : '#DC2626' },
          { label: 'Books/Month',          value: `${lexile.volume}`,          sub: 'avg reading volume',              accent: '#0DA7BC' },
          { label: 'Enrolled Students',    value: lexile.students.toLocaleString(), sub: 'contributing to avg',        accent: '#64748B' },
        ].map(s => (
          <div key={s.label} className="sv-stat">
            <div className="sv-stat-val" style={{ color: s.accent }}>{s.value}</div>
            <div className="sv-stat-lbl">{s.label}</div>
            <div className="sv-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="sv-grid">
        {/* Scatter — district context, this school highlighted */}
        <div className="sv-card sv-card--wide">
          <h3>Lexile Growth vs. Reading Volume — District Context</h3>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 16, right: 32, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
              <XAxis dataKey="volume" name="Books/mo" type="number" domain={[15, 50]} tick={{ fontSize: 13, fill: '#94A3B8' }} label={{ value: 'Avg books/month', position: 'insideBottom', offset: -12, fontSize: 13, fill: '#94A3B8' }} />
              <YAxis dataKey="lexileGrowth" name="Lexile growth" type="number" domain={[0, 130]} tick={{ fontSize: 13, fill: '#94A3B8' }} label={{ value: 'Lexile growth (L)', angle: -90, position: 'insideLeft', offset: 12, fontSize: 13, fill: '#94A3B8' }} />
              <ReferenceLine y={EXPECTED_GROWTH} stroke="#D97706" strokeDasharray="5 4" label={{ value: 'Expected (+65L)', position: 'right', fontSize: 13, fill: '#D97706' }} />
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4, color: d.id === schoolId ? school.color : '#1E293B' }}>{d.school}</div>
                      <div>Lexile growth: <b>+{d.lexileGrowth}L</b></div>
                      <div>Avg books/mo: <b>{d.volume}</b></div>
                    </div>
                  )
                }}
              />
              <Scatter
                data={LEXILE_DATA}
                shape={({ cx, cy, payload }) => {
                  const isThis = payload.id === schoolId
                  const r = Math.sqrt(payload.students / 65)
                  const fill = isThis ? school.color : '#CBD5E1'
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={r} fill={fill} opacity={isThis ? 1 : 0.6} stroke={isThis ? '#fff' : 'none'} strokeWidth={isThis ? 2.5 : 0} />
                      {isThis && (
                        <text x={cx} y={cy - r - 5} textAnchor="middle" fontSize={11} fill={school.color} fontWeight={700}>
                          {payload.school.split(' ')[0]}
                        </text>
                      )}
                    </g>
                  )
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="sv-legend">
            <span style={{ color: school.color }}>● {school.name}</span>
            <span style={{ color: '#CBD5E1' }}>● Other schools</span>
            <span style={{ color: '#D97706' }}>— Expected threshold (+65L)</span>
          </div>
        </div>

        {/* Grade-level breakdown */}
        <div className="sv-card sv-card--wide">
          <h3>Lexile Growth by Grade — {school.name}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={grades} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
              <XAxis dataKey="grade" tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <YAxis domain={[0, 140]} tick={{ fontSize: 13, fill: '#94A3B8' }} unit="L" />
              <Tooltip formatter={v => `+${v}L`} contentStyle={{ fontSize: 13, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Bar dataKey="growth" name="Actual growth" radius={[3, 3, 0, 0]}>
                {grades.map((d, i) => (
                  <Cell key={i} fill={d.growth >= d.expected ? school.color : '#E8866A'} />
                ))}
              </Bar>
              <Bar dataKey="expected" name="Expected growth" fill="#E2E8F0" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="sv-legend">
            <span style={{ color: school.color }}>■ Met/exceeded expected</span>
            <span style={{ color: '#E8866A' }}>■ Below expected</span>
            <span style={{ color: '#CBD5E1' }}>■ Expected baseline</span>
          </div>
        </div>
      </div>
    </div>
  )
}
