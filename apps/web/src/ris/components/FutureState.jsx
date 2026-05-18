import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import './FutureState.css'
import { READING_DIET, ROI_TRENDS } from '../data'

function FutureCard({ title, tag, children, integration }) {
  return (
    <div className="fs-card">
      <div className="fs-card-header">
        <div>
          <span className="fs-tag">{tag}</span>
          <h3>{title}</h3>
        </div>
        {integration && <span className="fs-integration">{integration}</span>}
      </div>
      <div className="fs-card-body">{children}</div>
    </div>
  )
}

const RADIAN = Math.PI / 180
function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, pct, genre }) {
  if (pct < 12) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {pct}%
    </text>
  )
}

export function FutureState() {
  return (
    <div className="future-state">
      <div className="fs-banner">
        <span className="fs-banner-icon">🔭</span>
        <div>
          <div className="fs-banner-title">Future State — V2 &amp; Beyond</div>
          <div className="fs-banner-sub">V1 uses existing Beanstack data. The following features require additional integrations or AI processing.</div>
        </div>
      </div>

      <div className="fs-grid">
        {/* Reading Diet */}
        <FutureCard title="&ldquo;Reading Diet&rdquo; AI Breakdown" tag="AI / Gemini" integration="Requires: Gemini API">
          <p className="fs-desc">What are students actually reading across the district? AI-generated thematic tags reveal macro patterns invisible in raw volume data.</p>
          <div className="fs-diet-layout">
            <ResponsiveContainer width={200} height={180}>
              <PieChart>
                <Pie data={READING_DIET} dataKey="pct" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={CustomLabel}>
                  {READING_DIET.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="fs-diet-legend">
              {READING_DIET.map(d => (
                <div key={d.genre} className="fs-diet-row">
                  <span className="fs-diet-dot" style={{ background: d.color }} />
                  <span className="fs-diet-genre">{d.genre}</span>
                  <span className="fs-diet-pct">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="fs-gemini-badge">✦ Powered by Gemini</div>
        </FutureCard>

        {/* ROI Correlations */}
        <FutureCard title="Engagement → ROI Correlations" tag="Analytics" integration="Requires: SIS / HR data">
          <p className="fs-desc">Correlate reading platform engagement with district-wide outcomes — attendance rates and behavioral incident reductions.</p>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={ROI_TRENDS} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis yAxisId="left" domain={[60, 85]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
              <YAxis yAxisId="right" orientation="right" domain={[20, 45]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="engagement" name="Reading engagement %" stroke="#0DA7BC" strokeWidth={2.5} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="attendance" name="Attendance rate %" stroke="#16A97A" strokeWidth={2} dot={false} strokeDasharray="5 4" />
              <Line yAxisId="right" type="monotone" dataKey="incidents" name="Behavioral incidents" stroke="#E8866A" strokeWidth={2} dot={false} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
          <div className="fs-correlation-callouts">
            <div className="fs-callout fs-callout--pos">
              <span className="fs-callout-val">r = 0.82</span>
              <span className="fs-callout-lbl">Engagement ↔ Attendance</span>
            </div>
            <div className="fs-callout fs-callout--neg">
              <span className="fs-callout-val">r = −0.76</span>
              <span className="fs-callout-lbl">Engagement ↔ Incidents</span>
            </div>
          </div>
        </FutureCard>

        {/* Equity Mapping */}
        <FutureCard title="Equity &amp; Resource Mapping" tag="Demographics" integration="Requires: demographic data">
          <p className="fs-desc">Overlay district reading metrics with school-level demographic data — Title I status, free/reduced lunch percentages — to surface resource equity gaps.</p>
          <div className="fs-heatmap-mock">
            <div className="fs-heatmap-grid">
              {[
                { name: 'Adams High', rmi: 83, titleI: false, frl: '18%', indicator: 'high' },
                { name: 'Jefferson El.', rmi: 80, titleI: false, frl: '24%', indicator: 'high' },
                { name: 'Kennedy K-8', rmi: 77, titleI: false, frl: '31%', indicator: 'med' },
                { name: 'Roosevelt Mid.', rmi: 74, titleI: true, frl: '52%', indicator: 'med' },
                { name: 'Lincoln El.', rmi: 71, titleI: true, frl: '61%', indicator: 'low' },
                { name: 'Washington Mid.', rmi: 62, titleI: true, frl: '68%', indicator: 'low' },
              ].map(s => (
                <div key={s.name} className={`fs-hm-row fs-hm-row--${s.indicator}`}>
                  <div className="fs-hm-name">{s.name}</div>
                  <div className="fs-hm-bar-wrap">
                    <div className="fs-hm-bar" style={{ width: `${s.rmi}%` }} />
                  </div>
                  <div className="fs-hm-rmi">RMI {s.rmi}</div>
                  <div className="fs-hm-meta">FRL {s.frl}{s.titleI ? ' · Title I' : ''}</div>
                </div>
              ))}
            </div>
            <div className="fs-heatmap-note">⚠ Negative correlation detected: highest FRL schools show lowest RMI. Consider targeted resource allocation.</div>
          </div>
        </FutureCard>
      </div>
    </div>
  )
}
