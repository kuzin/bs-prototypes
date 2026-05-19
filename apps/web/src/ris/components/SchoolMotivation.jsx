import {
  AreaChart, Area, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  SCHOOLS, RMI_TRENDS, SCHOOL_HEALTH,
  RMI_FACTORS, INTRINSIC_EXTRINSIC_TRENDS, MOTIVATION_BY_GRADE, MOTIVATION_SIGNALS,
} from '../data'
import { BucketHero } from './BucketHero'
import './RisLayout.css'
import './Motivation.css'

export function SchoolMotivation({ schoolId, onBack }) {
  const school      = SCHOOLS.find(s => s.id === schoolId)
  const health      = SCHOOL_HEALTH[schoolId]
  const trend       = RMI_TRENDS.map(d => ({ month: d.month, school: d[schoolId], district: d.district }))
  const districtNow = RMI_TRENDS[RMI_TRENDS.length - 1].district

  const intrinsicFactors = RMI_FACTORS.filter(f => f.kind === 'intrinsic')
  const extrinsicFactors = RMI_FACTORS.filter(f => f.kind === 'extrinsic')
  const latestTrend      = INTRINSIC_EXTRINSIC_TRENDS[INTRINSIC_EXTRINSIC_TRENDS.length - 1]

  return (
    <div className="mot-root">
      <BucketHero bucket="motivation" score={health.motivation} delta={health.dM} onBack={onBack} />

      <div className="sv-stats-row" style={{ marginBottom: 16, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="sv-stat">
          <div className="sv-stat-val">
            {(latestTrend.intrinsic + latestTrend.extrinsic).toFixed(1)}<span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8' }}> /40</span>
          </div>
          <div className="sv-stat-lbl">School RMI score</div>
          <div className="sv-stat-sub">↑{health.dM} pts since Sep 2024</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val" style={{ color: '#E8866A' }}>
            {latestTrend.intrinsic}<span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8' }}> /20</span>
          </div>
          <div className="sv-stat-lbl">Intrinsic subscore</div>
          <div className="sv-stat-sub">↑1.9 pts over school year</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val" style={{ color: '#7CB5F5' }}>
            {latestTrend.extrinsic}<span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8' }}> /20</span>
          </div>
          <div className="sv-stat-lbl">Extrinsic subscore</div>
          <div className="sv-stat-sub">↑0.4 pts over school year</div>
        </div>
      </div>

      <div className="sv-grid">

        {/* RMI Trend vs District */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>RMI Trend — {school.name} vs. District</h3>
              <div className="sv-note">Sep 2024 – May 2025</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trend} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="schoolMotGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={school.color} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={school.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
              <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <YAxis domain={[55, 90]} tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Area type="monotone" dataKey="school" name={school.name.split(' ')[0]} stroke={school.color} fill="url(#schoolMotGrad)" strokeWidth={2.5} dot={false} />
              <Area type="monotone" dataKey="district" name={`District avg (${districtNow})`} stroke="#94A3B8" fill="none" strokeWidth={1.5} dot={false} strokeDasharray="5 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Intrinsic vs Extrinsic trend */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Intrinsic vs. Extrinsic Motivation Trend</h3>
              <div className="sv-note">RMI subscores out of 20 · Sep 2024 – May 2025</div>
            </div>
            <div className="mot-trend-legend">
              <span className="mot-legend-dot" style={{ background: '#E8866A' }} /> Intrinsic
              <span className="mot-legend-dot" style={{ background: '#CBD5E1', marginLeft: 10 }} /> Extrinsic
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <ComposedChart data={INTRINSIC_EXTRINSIC_TRENDS} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[9, 16]} tickCount={5} tick={{ fontSize: 13, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0' }} formatter={(v, n) => [`${v.toFixed(1)} /20`, n]} />
              <Bar dataKey="extrinsic" name="Extrinsic" fill="#E2E8F0" radius={[3, 3, 0, 0]} barSize={18} />
              <Bar dataKey="intrinsic" name="Intrinsic" fill="#E8866A" radius={[3, 3, 0, 0]} barSize={18} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mot-shift-note">
            Students' intrinsic reading subscore rose from <strong>12.1</strong> to <strong>14.2 /20</strong> over the school year — reflecting sustained growth in self-motivated, independent reading. The extrinsic score remains stable at <strong>11.8 /20</strong>, meaning intrinsic motivation is outpacing external drivers.
          </div>
        </div>

        {/* RMI Factor Breakdown */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>RMI Factor Breakdown</h3>
              <div className="sv-note">All 10 RMI factors · scored 1–4</div>
            </div>
          </div>
          <div className="mot-factor-groups mot-factor-groups--wide">
            <div className="mot-factor-group">
              <div className="mot-factor-group-label mot-factor-group-label--int">Intrinsic</div>
              {intrinsicFactors.map(f => (
                <div key={f.name} className="mot-factor-row">
                  <div className="mot-factor-name-wrap">
                    <span className="mot-factor-name">{f.name}</span>
                    <span className="mot-factor-desc">{f.desc}</span>
                  </div>
                  <div className="mot-factor-bar-wrap">
                    <div className="mot-factor-bar" style={{ width: `${(f.score / f.max) * 100}%`, background: f.color }} />
                  </div>
                  <div className="mot-factor-right">
                    <span className="mot-factor-score">{f.score}</span>
                    {f.delta !== 0 && (
                      <span className={`mot-factor-delta${f.delta > 0 ? ' mot-factor-delta--pos' : ' mot-factor-delta--neg'}`}>
                        {f.delta > 0 ? '↑' : '↓'}{Math.abs(f.delta)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mot-factor-divider" />
            <div className="mot-factor-group">
              <div className="mot-factor-group-label mot-factor-group-label--ext">Extrinsic</div>
              {extrinsicFactors.map(f => (
                <div key={f.name} className="mot-factor-row">
                  <div className="mot-factor-name-wrap">
                    <span className="mot-factor-name">{f.name}</span>
                    <span className="mot-factor-desc">{f.desc}</span>
                  </div>
                  <div className="mot-factor-bar-wrap">
                    <div className="mot-factor-bar" style={{ width: `${(f.score / f.max) * 100}%`, background: f.color }} />
                  </div>
                  <div className="mot-factor-right">
                    <span className="mot-factor-score">{f.score}</span>
                    {f.delta !== 0 && (
                      <span className={`mot-factor-delta${f.delta > 0 ? ' mot-factor-delta--pos' : ' mot-factor-delta--neg'}`}>
                        {f.delta > 0 ? '↑' : '↓'}{Math.abs(f.delta)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grade band breakdown */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Intrinsic vs. Extrinsic by Grade Band</h3>
              <div className="sv-note">RMI subscores out of 20 · older students show stronger intrinsic reading identity</div>
            </div>
          </div>
          <div className="mot-grade-list">
            {MOTIVATION_BY_GRADE.map(g => (
              <div key={g.band} className="mot-grade-row">
                <div className="mot-grade-band">{g.band}</div>
                <div className="mot-grade-tracks">
                  <div className="mot-grade-track-row">
                    <span className="mot-grade-track-label" style={{ color: '#E8866A' }}>Intrinsic</span>
                    <div className="mot-grade-track">
                      <div className="mot-grade-bar mot-grade-bar--int" style={{ width: `${(g.intrinsic / 20) * 100}%` }} />
                    </div>
                    <span className="mot-grade-val" style={{ color: '#E8866A' }}>{g.intrinsic}</span>
                  </div>
                  <div className="mot-grade-track-row">
                    <span className="mot-grade-track-label" style={{ color: '#94A3B8' }}>Extrinsic</span>
                    <div className="mot-grade-track">
                      <div className="mot-grade-bar mot-grade-bar--ext" style={{ width: `${(g.extrinsic / 20) * 100}%` }} />
                    </div>
                    <span className="mot-grade-val" style={{ color: '#94A3B8' }}>{g.extrinsic}</span>
                  </div>
                </div>
                <span className="mot-grade-top-factor">{g.topFactor}</span>
              </div>
            ))}
          </div>
          <div className="mot-grade-legend">
            <span className="mot-legend-dot" style={{ background: '#E8866A' }} /> Intrinsic
            <span className="mot-legend-dot" style={{ background: '#CBD5E1', marginLeft: 12 }} /> Extrinsic
            <span style={{ marginLeft: 8, color: '#94A3B8', fontSize: 13 }}>scores out of 20 · badge = top factor</span>
          </div>
        </div>

      </div>
    </div>
  )
}
