import {
  ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, Legend,
} from 'recharts'
import './LexileDetail.css'
import { LEXILE_DATA, LEXILE_BY_GRADE, SCHOOLS, DISTRICT_HEALTH } from '../data'
import { BucketHero } from './BucketHero'

const EXPECTED_GROWTH = 65

function StatCard({ label, value, sub, accent = '#0DA7BC' }) {
  return (
    <div className="ld-stat">
      <div className="ld-stat-value" style={{ color: accent }}>{value}</div>
      <div className="ld-stat-label">{label}</div>
      {sub && <div className="ld-stat-sub">{sub}</div>}
    </div>
  )
}

const SCHOOL_COLORS = Object.fromEntries(SCHOOLS.map(s => [s.id, s.color]))

export function LexileDetail({ onBack }) {
  const stuckSchools = LEXILE_DATA.filter(s => !s.aboveExpected)

  return (
    <div className="lexile-detail">
      <BucketHero bucket="skills" score={DISTRICT_HEALTH.skills} delta={DISTRICT_HEALTH.dS} onBack={onBack} />

      <div className="ld-stats-row">
        <StatCard label="District avg Lexile growth" value="+82L" sub="YTD vs. expected +65L" />
        <StatCard label="Schools below expected" value={`${stuckSchools.length} of 6`} sub="stuck or declining" accent="#DC2626" />
        <StatCard label="Top-growth school" value="Adams High" sub="+112L YTD" accent="#16A97A" />
        <StatCard label="Students flagged (stuck)" value="~1,490" sub="12% of total enrollment" accent="#D97706" />
      </div>

      <div className="ld-grid">
        {/* Scatter plot */}
        <div className="ld-card ld-card--wide">
          <h3>Lexile Growth vs. Reading Volume — by School</h3>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 16, right: 32, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="volume" name="Books/mo" type="number" domain={[15, 50]} tick={{ fontSize: 11, fill: '#94A3B8' }} label={{ value: 'Avg books/month', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#94A3B8' }} />
              <YAxis dataKey="lexileGrowth" name="Lexile growth" type="number" domain={[0, 130]} tick={{ fontSize: 11, fill: '#94A3B8' }} label={{ value: 'Lexile growth (L)', angle: -90, position: 'insideLeft', offset: 12, fontSize: 11, fill: '#94A3B8' }} />
              <ReferenceLine y={EXPECTED_GROWTH} stroke="#D97706" strokeDasharray="5 4" label={{ value: 'Expected (+65L)', position: 'right', fontSize: 11, fill: '#D97706' }} />
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.school}</div>
                      <div>Lexile growth: <b style={{ color: d.aboveExpected ? '#16A97A' : '#DC2626' }}>+{d.lexileGrowth}L</b></div>
                      <div>Avg books/mo: <b>{d.volume}</b></div>
                      <div>Students: <b>{d.students.toLocaleString()}</b></div>
                      <div style={{ marginTop: 4, fontSize: 11, color: d.aboveExpected ? '#16A97A' : '#DC2626', fontWeight: 600 }}>
                        {d.aboveExpected ? '✓ Above expected' : '⚠ Below expected'}
                      </div>
                    </div>
                  )
                }}
              />
              <Scatter
                data={LEXILE_DATA}
                shape={({ cx, cy, payload }) => {
                  const r = Math.sqrt(payload.students / 65)
                  const fill = payload.aboveExpected ? '#0DA7BC' : '#E8866A'
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={r} fill={fill} opacity={0.85} stroke="#fff" strokeWidth={2} />
                      <text x={cx} y={cy - r - 4} textAnchor="middle" fontSize={10} fill="#475569" fontWeight={600}>
                        {payload.school.split(' ')[0]}
                      </text>
                    </g>
                  )
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="ld-legend">
            <span style={{ color: '#0DA7BC' }}>● Above expected growth</span>
            <span style={{ color: '#E8866A' }}>● Below expected growth</span>
            <span style={{ color: '#D97706' }}>— Expected threshold (+65L)</span>
          </div>
        </div>

        {/* Stuck lexile table */}
        <div className="ld-card">
          <h3>⚠ Stuck Lexile Alerts</h3>
          <table className="ld-table">
            <thead>
              <tr>
                <th>School</th>
                <th>Avg Lexile</th>
                <th>YTD Growth</th>
                <th>Engagement</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stuckSchools.map(s => (
                <tr key={s.id}>
                  <td><b>{s.school}</b></td>
                  <td>{s.avgLexile}L</td>
                  <td><span className="ld-badge ld-badge--warn">+{s.lexileGrowth}L</span></td>
                  <td>{SCHOOLS.find(sc => sc.id === s.id) ? `${Math.round(s.lexileGrowth * 2.8 + 55)}%` : '—'}</td>
                  <td><button className="ld-action">Review →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ld-alert-note">
            Lincoln Elementary has shown 6 consecutive weeks with &lt;10L growth despite high engagement. Curriculum review recommended.
          </div>
        </div>

        {/* Grade breakdown */}
        <div className="ld-card">
          <h3>Lexile Growth by Grade — District-Wide</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={LEXILE_BY_GRADE} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="grade" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[0, 140]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="L" />
              <Tooltip formatter={v => `+${v}L`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="growth" name="Actual growth" radius={[3, 3, 0, 0]}>
                {LEXILE_BY_GRADE.map((d, i) => (
                  <Cell key={i} fill={d.growth >= d.expected ? '#0DA7BC' : '#E8866A'} />
                ))}
              </Bar>
              <Bar dataKey="expected" name="Expected growth" fill="#E2E8F0" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="ld-legend">
            <span style={{ color: '#0DA7BC' }}>■ Met/exceeded expected</span>
            <span style={{ color: '#E8866A' }}>■ Below expected</span>
            <span style={{ color: '#94A3B8' }}>■ Expected baseline</span>
          </div>
        </div>
      </div>
    </div>
  )
}
