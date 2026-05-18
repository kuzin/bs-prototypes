import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { SCHOOL_STATS, SCHOOL_DETAILS, GRADE_PERFORMANCE } from '../data'
import { PageHero } from './PageHero'
import './Demographics.css'

const DemographicsIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="6" r="2.5"/>
    <circle cx="4"  cy="9" r="2"/>
    <circle cx="16" cy="9" r="2"/>
    <path d="M6 17c0-2.2 1.8-4 4-4s4 1.8 4 4"/>
    <path d="M1 17c0-1.7 1.3-3 3-3"/>
    <path d="M19 17c0-1.7-1.3-3-3-3"/>
  </svg>
)

const TITLE_I_IDS = ['lincoln', 'roosevelt', 'washington']

function buildTitleIData() {
  const avgField = (arr, field) => Math.round(arr.reduce((s, x) => s + x[field], 0) / arr.length)
  const t1 = SCHOOL_STATS.filter(s => TITLE_I_IDS.includes(s.id))
  const n1 = SCHOOL_STATS.filter(s => !TITLE_I_IDS.includes(s.id))
  return [
    { metric: 'RMI Score',          titleI: avgField(t1, 'rmi'),          nonTitleI: avgField(n1, 'rmi') },
    { metric: 'Engagement %',       titleI: avgField(t1, 'engagement'),   nonTitleI: avgField(n1, 'engagement') },
    { metric: 'Session (min)',       titleI: avgField(t1, 'avgSession'),   nonTitleI: avgField(n1, 'avgSession') },
    { metric: 'Streak Rate %',      titleI: avgField(t1, 'streakPct'),    nonTitleI: avgField(n1, 'streakPct') },
    { metric: 'Lexile Growth (L)',   titleI: avgField(t1, 'lexileGrowth'), nonTitleI: avgField(n1, 'lexileGrowth') },
  ]
}

const EQUITY_ROWS = [
  { id: 'adams',      name: 'Adams High',       rmi: 83, frl: 18,  titleI: false, engagement: 84, lexileGrowth: 112 },
  { id: 'jefferson',  name: 'Jefferson El.',     rmi: 80, frl: 18,  titleI: false, engagement: 81, lexileGrowth: 62  },
  { id: 'kennedy',    name: 'Kennedy K-8',       rmi: 77, frl: 31,  titleI: false, engagement: 72, lexileGrowth: 74  },
  { id: 'roosevelt',  name: 'Roosevelt Mid.',    rmi: 74, frl: 52,  titleI: true,  engagement: 74, lexileGrowth: 88  },
  { id: 'lincoln',    name: 'Lincoln El.',       rmi: 71, frl: 61,  titleI: true,  engagement: 63, lexileGrowth: 8   },
  { id: 'washington', name: 'Washington Mid.',   rmi: 62, frl: 68,  titleI: true,  engagement: 51, lexileGrowth: 22  },
]

function rmiColor(rmi) {
  if (rmi >= 78) return '#0DA7BC'
  if (rmi >= 70) return '#D97706'
  return '#E8866A'
}

export function Demographics() {
  const titleIData = buildTitleIData()

  return (
    <div className="dm-root">

      <PageHero
        icon={<DemographicsIcon />}
        title="Demographics"
        subtitle="Equity mapping, grade-level performance, and resource allocation indicators"
        accent="#7C3AED"
        accentBg="#F5F3FF"
      />

      <div className="sv-stats-row">
        <div className="sv-stat">
          <div className="sv-stat-val">3</div>
          <div className="sv-stat-lbl">Title I Schools</div>
          <div className="sv-stat-sub">Lincoln, Roosevelt, Washington</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val" style={{ color: '#E8866A' }}>−17 pts</div>
          <div className="sv-stat-lbl">Title I RMI Gap</div>
          <div className="sv-stat-sub">vs. non-Title I schools</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val">42%</div>
          <div className="sv-stat-lbl">Avg FRL Rate</div>
          <div className="sv-stat-sub">Free/reduced lunch, district</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val" style={{ color: '#E8866A' }}>−23 pts</div>
          <div className="sv-stat-lbl">FRL Engagement Gap</div>
          <div className="sv-stat-sub">High FRL vs. low FRL schools</div>
        </div>
      </div>

      <div className="sv-grid">

        {/* Equity table — full width */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Equity &amp; Resource Mapping</h3>
              <div className="sv-note">Reading performance overlaid with school-level demographic indicators</div>
            </div>
          </div>
          <div className="dm-equity-table">
            <div className="dm-equity-head">
              <div className="dm-ec dm-ec--name">School</div>
              <div className="dm-ec dm-ec--rmi">RMI</div>
              <div className="dm-ec dm-ec--bar">Reading Health Index</div>
              <div className="dm-ec dm-ec--engage">Engagement</div>
              <div className="dm-ec dm-ec--lexile">Lexile Δ</div>
              <div className="dm-ec dm-ec--frl">FRL %</div>
              <div className="dm-ec dm-ec--titlei">Title I</div>
            </div>
            {EQUITY_ROWS.map(s => (
              <div key={s.id} className="dm-equity-row">
                <div className="dm-ec dm-ec--name dm-school-name">{s.name}</div>
                <div className="dm-ec dm-ec--rmi">
                  <span className="dm-rmi-val" style={{ color: rmiColor(s.rmi) }}>{s.rmi}</span>
                </div>
                <div className="dm-ec dm-ec--bar">
                  <div className="dm-rmi-bar-wrap">
                    <div className="dm-rmi-bar" style={{ width: `${s.rmi}%`, background: rmiColor(s.rmi) }} />
                  </div>
                </div>
                <div className="dm-ec dm-ec--engage">{s.engagement}%</div>
                <div className="dm-ec dm-ec--lexile">{s.lexileGrowth > 0 ? `+${s.lexileGrowth}L` : `${s.lexileGrowth}L`}</div>
                <div className="dm-ec dm-ec--frl">
                  <span className={`dm-frl-pill${s.frl >= 50 ? ' dm-frl-pill--high' : s.frl >= 30 ? ' dm-frl-pill--med' : ''}`}>
                    {s.frl}%
                  </span>
                </div>
                <div className="dm-ec dm-ec--titlei">
                  {s.titleI
                    ? <span className="dm-titlei-badge dm-titlei-badge--yes">Title I</span>
                    : <span className="dm-titlei-badge dm-titlei-badge--no">—</span>
                  }
                </div>
              </div>
            ))}
          </div>
          <div className="dm-equity-note">
            ⚠ Negative correlation detected: the 3 highest FRL schools (Lincoln, Washington, Roosevelt) show the lowest RMI scores. Consider targeted resource allocation or additional engagement programs.
          </div>
        </div>

        {/* Grade-level performance */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div>
              <h3>Performance by Grade Level</h3>
              <div className="sv-note">RMI score distribution across K–12</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={GRADE_PERFORMANCE}
              margin={{ top: 4, right: 8, left: -28, bottom: 0 }}
              barSize={14}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="grade" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis domain={[60, 85]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                formatter={(v, name) => [v, name === 'rmi' ? 'RMI Score' : 'Engagement %']}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} formatter={k => k === 'rmi' ? 'RMI Score' : 'Engagement %'} />
              <Bar dataKey="rmi" fill="#0DA7BC" radius={[3, 3, 0, 0]} />
              <Bar dataKey="engagement" fill="#7CB5F5" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Title I vs non-Title I */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div>
              <h3>Title I vs. Non-Title I Schools</h3>
              <div className="sv-note">Average metrics across 3 Title I and 3 non-Title I schools</div>
            </div>
          </div>
          <div className="dm-compare-list">
            {titleIData.map(row => (
              <div key={row.metric} className="dm-compare-row">
                <div className="dm-compare-metric">{row.metric}</div>
                <div className="dm-compare-bars">
                  <div className="dm-compare-bar-wrap">
                    <div className="dm-compare-bar dm-compare-bar--t1" style={{ width: `${(row.titleI / 120) * 100}%` }} />
                    <span className="dm-compare-val">{row.titleI}</span>
                  </div>
                  <div className="dm-compare-bar-wrap">
                    <div className="dm-compare-bar dm-compare-bar--n1" style={{ width: `${(row.nonTitleI / 120) * 100}%` }} />
                    <span className="dm-compare-val">{row.nonTitleI}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="dm-compare-legend">
            <span className="dm-compare-dot dm-compare-dot--t1" /> Title I (3 schools)
            <span className="dm-compare-dot dm-compare-dot--n1" style={{ marginLeft: 12 }} /> Non-Title I (3 schools)
          </div>
        </div>

      </div>
    </div>
  )
}
