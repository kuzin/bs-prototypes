import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { BOOK_TALKS_TRENDS, BOOK_TALKS_BY_SCHOOL, SCHOOLS, DISTRICT_HEALTH, SCHOOL_HEALTH } from '../data'
import { BucketHero } from './BucketHero'
import './RisLayout.css'

export function Integrity({ onBack }) {
  const avgCompletion = Math.round(
    BOOK_TALKS_BY_SCHOOL.reduce((s, x) => s + x.completionRate, 0) / BOOK_TALKS_BY_SCHOOL.length
  )
  const avgFlagRate = +(
    BOOK_TALKS_BY_SCHOOL.reduce((s, x) => s + x.flagRate, 0) / BOOK_TALKS_BY_SCHOOL.length
  ).toFixed(1)
  const highFlagSchools  = BOOK_TALKS_BY_SCHOOL.filter(s => s.flagRate >= 15)
  const decliningSchools = BOOK_TALKS_BY_SCHOOL.filter(s => s.trend < 0)

  const rankedByIntegrity = BOOK_TALKS_BY_SCHOOL
    .map(s => ({ ...s, integrityScore: SCHOOL_HEALTH[s.id].integrity }))
    .sort((a, b) => b.integrityScore - a.integrityScore)

  const sortedByFlag = [...BOOK_TALKS_BY_SCHOOL].sort((a, b) => b.flagRate - a.flagRate)

  return (
    <div>
      <BucketHero bucket="integrity" score={DISTRICT_HEALTH.integrity} delta={DISTRICT_HEALTH.dI} onBack={onBack} />

      <div className="sv-stats-row" style={{ marginBottom: 16 }}>
        <div className="sv-stat">
          <div className="sv-stat-val">{avgCompletion}%</div>
          <div className="sv-stat-lbl">Avg Book Talk completion</div>
          <div className="sv-stat-sub">Students who finish the AI chat</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val" style={{ color: avgFlagRate > 15 ? '#DC2626' : '#D97706' }}>
            {avgFlagRate}%
          </div>
          <div className="sv-stat-lbl">Avg conversation flag rate</div>
          <div className="sv-stat-sub">↓2pp improvement YTD</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val" style={{ color: highFlagSchools.length > 0 ? '#E8866A' : '#16A97A' }}>
            {highFlagSchools.length}{' '}
            <span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8' }}>of 6</span>
          </div>
          <div className="sv-stat-lbl">Schools flagged &gt;15%</div>
          <div className="sv-stat-sub">
            {highFlagSchools.length > 0
              ? highFlagSchools.map(s => s.name.split(' ')[0]).join(', ')
              : 'All within range'}
          </div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val" style={{ color: decliningSchools.length > 1 ? '#E8866A' : '#D97706' }}>
            {decliningSchools.length}{' '}
            <span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8' }}>of 6</span>
          </div>
          <div className="sv-stat-lbl">Schools declining this month</div>
          <div className="sv-stat-sub">
            {decliningSchools.length > 0
              ? decliningSchools.map(s => s.name.split(' ')[0]).join(', ')
              : 'None this month'}
          </div>
        </div>
      </div>

      <div className="sv-grid">

        {/* Book Talks trend — full width */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Book Talks — Completion &amp; Flag Rate</h3>
              <div className="sv-note">
                District-wide · Sep 2024 – May 2025 · Completion rising, flag rate declining
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#64748B', alignItems: 'center' }}>
              <span><span style={{ color: '#1D4ED8', fontWeight: 700 }}>—</span> Completion rate</span>
              <span><span style={{ color: '#E8866A', fontWeight: 700 }}>- -</span> Flag rate</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={BOOK_TALKS_TRENDS} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1D4ED8" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="flagGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#E8866A" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#E8866A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
              <Tooltip
                formatter={v => `${v}%`}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
              />
              <Area
                type="monotone" dataKey="completionRate" name="Completion Rate"
                stroke="#1D4ED8" fill="url(#compGrad)" strokeWidth={2.5} dot={false}
              />
              <Area
                type="monotone" dataKey="flagRate" name="Flag Rate"
                stroke="#E8866A" fill="url(#flagGrad)" strokeWidth={2} dot={false} strokeDasharray="4 3"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="sv-card-note">
            Book Talks with Benny engages students in a brief AI conversation when they log above their
            school's warning threshold. A flagged conversation indicates unintelligible responses,
            copy-pasted text, or other defined patterns — not an automatic penalty. Educators review
            flagged conversations to determine follow-up.
          </div>
        </div>

        {/* Per-school Book Talk completion */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div>
              <h3>Book Talk Completion by School</h3>
              <div className="sv-note">% of triggered talks completed · May 2025</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[...BOOK_TALKS_BY_SCHOOL].sort((a, b) => b.completionRate - a.completionRate)}
              layout="vertical"
              margin={{ top: 4, right: 20, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} width={90} />
              <Tooltip formatter={v => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="completionRate" name="Completion Rate" radius={[0, 4, 4, 0]}>
                {[...BOOK_TALKS_BY_SCHOOL]
                  .sort((a, b) => b.completionRate - a.completionRate)
                  .map((s, i) => (
                    <Cell key={i} fill={SCHOOLS.find(sc => sc.id === s.id)?.color ?? '#94A3B8'} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Schools needing review */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div>
              <h3>Schools Needing Review</h3>
              <div className="sv-note">Ranked by flag rate · high flag rates or declining completion</div>
            </div>
          </div>
          <div className="int-review-list">
            {sortedByFlag.map(s => {
              const school = SCHOOLS.find(sc => sc.id === s.id)
              const isHighFlag   = s.flagRate >= 15
              const isDeclining  = s.trend < 0
              return (
                <div key={s.id} className="int-review-row">
                  <span className="int-review-dot" style={{ background: school?.color }} />
                  <div className="int-review-body">
                    <div className="int-review-name">{s.name}</div>
                    <div className="int-review-meta">
                      <span className={`int-flag-chip${isHighFlag ? ' int-flag-chip--high' : ''}`}>
                        {s.flagRate}% flagged
                      </span>
                      <span className={`int-trend-chip${isDeclining ? ' int-trend-chip--down' : ' int-trend-chip--up'}`}>
                        {isDeclining ? `↓${Math.abs(s.trend)}pp` : `↑${s.trend}pp`}
                      </span>
                      <span className="int-talks-chip">{s.totalTalks} talks</span>
                    </div>
                  </div>
                  <button className="int-review-btn">Review →</button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Integrity score by school — full width */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Reading Integrity Score by School</h3>
              <div className="sv-note">
                Composite: verified-student ratio, flag frequency, Book Talk outcomes · higher is better
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={rankedByIntegrity}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" horizontal={false} />
              <XAxis type="number" domain={[60, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} width={90} />
              <Tooltip
                formatter={v => `${v}/100`}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="integrityScore" name="Integrity Score" radius={[0, 4, 4, 0]}>
                {rankedByIntegrity.map((d, i) => (
                  <Cell key={i} fill={SCHOOLS.find(s => s.id === d.id)?.color ?? '#94A3B8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}
