import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts'
import {
  RMI_TRENDS, SCHOOLS, DISTRICT_HEALTH, SCHOOL_HEALTH,
  RMI_FACTORS, INTRINSIC_EXTRINSIC_TRENDS, MOTIVATION_BY_GRADE, MOTIVATION_SIGNALS,
} from '../data'
import { Hero } from './Hero'
import { StatCard } from './Cards'
import './RisLayout.css'
import './Motivation.css'

export function Motivation({ onBack }) {
  const ranked = [...SCHOOLS]
    .map(s => ({ id: s.id, name: s.name.split(' ')[0], rmi: SCHOOL_HEALTH[s.id].motivation, color: s.color }))
    .sort((a, b) => b.rmi - a.rmi)

  const intrinsicFactors = RMI_FACTORS.filter(f => f.kind === 'intrinsic')
  const extrinsicFactors = RMI_FACTORS.filter(f => f.kind === 'extrinsic')
  const latestTrend      = INTRINSIC_EXTRINSIC_TRENDS[INTRINSIC_EXTRINSIC_TRENDS.length - 1]
  const improvingCount   = SCHOOLS.filter(s => SCHOOL_HEALTH[s.id].dM > 0).length
  const topSchool        = ranked[0]
  const bottomSchool     = ranked[ranked.length - 1]

  return (
    <div className="mot-root">
      <Hero bucket="motivation" />

      {/* Stats row */}
      <div className="sv-stats-row" style={{ marginBottom: 16 }}>
        <StatCard
          value={DISTRICT_HEALTH.motivation}
          label="District avg RMI"
          footer={`↑${DISTRICT_HEALTH.dM} pts since Sep 2024`}
        />
        <StatCard
          value={<>{improvingCount} <span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8' }}>of 6</span></>}
          label="Schools improving RMI"
          footer="vs. Sep 2024 baseline"
          color="#16A97A"
        />
        <StatCard
          value={topSchool.rmi}
          label={`Highest school — ${topSchool.name}`}
          footer="Top-performing site"
          color={topSchool.color}
        />
        <StatCard
          value={bottomSchool.rmi}
          label={`Lowest school — ${bottomSchool.name}`}
          footer="↑ priority for intervention"
          color="#E8866A"
        />
      </div>

      <div className="sv-grid">

        {/* Intrinsic vs Extrinsic shift — full width */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Intrinsic vs. Extrinsic Motivation — District Trend</h3>
              <div className="sv-note">District-wide RMI subscores out of 20 · Sep 2024 – May 2025</div>
            </div>
            <div className="mot-trend-legend">
              <span className="mot-legend-dot" style={{ background: '#E8866A' }} /> Intrinsic
              <span className="mot-legend-dot" style={{ background: '#94A3B8', marginLeft: 10 }} /> Extrinsic
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={INTRINSIC_EXTRINSIC_TRENDS} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="intrinsicGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#E8866A" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#E8866A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="extrinsicGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#94A3B8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <YAxis domain={[9, 16]} tickCount={5} tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <Tooltip
                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0' }}
                formatter={(v, name) => [`${v.toFixed(1)} /20`, name]}
              />
              <Area type="monotone" dataKey="intrinsic" name="Intrinsic" stroke="#E8866A" fill="url(#intrinsicGrad)" strokeWidth={2.5} dot={false} />
              <Area type="monotone" dataKey="extrinsic" name="Extrinsic" stroke="#94A3B8" fill="url(#extrinsicGrad)" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mot-shift-note">
            Students' intrinsic reading subscore rose from <strong>12.1</strong> to <strong>14.2 /20</strong> over the school year — reflecting sustained growth in self-motivated, independent reading. The extrinsic score remains stable at <strong>11.8 /20</strong>, meaning intrinsic motivation is outpacing external drivers.
          </div>
        </div>

        {/* RMI Factor Breakdown */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div>
              <h3>RMI Factor Breakdown</h3>
              <div className="sv-note">All 10 RMI factors · scored 1–4</div>
            </div>
          </div>
          <div className="mot-factor-groups">
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

        {/* Intrinsic signals */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div>
              <h3>Intrinsic Motivation Signals</h3>
              <div className="sv-note">Behavioral indicators of self-directed reading · current year</div>
            </div>
          </div>
          <div className="mot-signals">
            {MOTIVATION_SIGNALS.map(s => (
              <div key={s.signal} className="mot-signal-row">
                <div className="mot-signal-pct" style={{ color: '#E8866A' }}>{s.pct}%</div>
                <div className="mot-signal-body">
                  <div className="mot-signal-label">{s.signal}</div>
                  <div className="mot-signal-meta">
                    <span className="mot-signal-delta">↑{s.delta}pp vs Sep 2024</span>
                    <span className="mot-signal-factor">{s.factor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mot-signal-note">
            These signals are derived from reading log timestamps, challenge calendars, and book selection metadata. No survey data required.
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

        {/* RMI trend — full width */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Reading Motivation Index — district trend</h3>
              <div className="sv-note">District average vs. individual schools · Sep 2024 – May 2025</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={RMI_TRENDS} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="motDistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8866A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#E8866A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
              <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <YAxis domain={[55, 90]} tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Area type="monotone" dataKey="district" name="District avg" stroke="#E8866A" fill="url(#motDistGrad)" strokeWidth={2.5} dot={false} />
              {SCHOOLS.map(s => (
                <Area key={s.id} type="monotone" dataKey={s.id} name={s.name.split(' ')[0]} stroke={s.color} fill="none" strokeWidth={1.2} strokeDasharray="4 3" dot={false} opacity={0.7} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Schools ranked by RMI */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Schools ranked by Motivation score</h3>
              <div className="sv-note">RMI score (0–100) · current year average</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ranked} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 13, fill: '#94A3B8' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fill: '#475569' }} width={90} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8 }} />
              <Bar dataKey="rmi" name="RMI" radius={[0, 4, 4, 0]}>
                {ranked.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}
