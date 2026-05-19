import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import {
  SCHOOLS, RMI_TRENDS, SCHOOL_HEALTH,
  RMI_FACTORS, INTRINSIC_EXTRINSIC_TRENDS, MOTIVATION_BY_GRADE,
} from '../data'
import { BucketHero } from './BucketHero'
import {
  NIVO_THEME, LINE_MARGIN, AXIS_BOTTOM, AXIS_LEFT,
  SliceTooltip, ChartLegend, BarTooltip,
} from './charts'
import { RMI_ICONS } from './RmiIcons'
import './RisLayout.css'
import './Motivation.css'

const INTRINSIC_COLOR = '#E8866A'
const EXTRINSIC_COLOR = '#7CB5F5'

function FactorRow({ f }) {
  return (
    <div className="mot-factor-row mot-factor-row--iconed">
      <div className="mot-factor-icon" style={{ '--ic-color': f.color, '--ic-bg': `color-mix(in srgb, ${f.color} 10%, white)` }}>
        {RMI_ICONS[f.iconKey]}
      </div>
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
  )
}

export function SchoolMotivation({ schoolId, onBack }) {
  const school      = SCHOOLS.find(s => s.id === schoolId)
  const health      = SCHOOL_HEALTH[schoolId]
  const shortName   = school.name.split(' ')[0]
  const trend       = RMI_TRENDS.map(d => ({ month: d.month, school: d[schoolId], district: d.district }))
  const districtNow = RMI_TRENDS[RMI_TRENDS.length - 1].district

  const intrinsicFactors = RMI_FACTORS.filter(f => f.kind === 'intrinsic')
  const extrinsicFactors = RMI_FACTORS.filter(f => f.kind === 'extrinsic')
  const latestTrend      = INTRINSIC_EXTRINSIC_TRENDS[INTRINSIC_EXTRINSIC_TRENDS.length - 1]

  // ── Nivo data shapes ────────────────────────────────────────────────────
  const rmiNivo = [
    { id: shortName,      color: school.color, data: trend.map(d => ({ x: d.month, y: d.school   })) },
    { id: 'District avg', color: '#CBD5E1',    data: trend.map(d => ({ x: d.month, y: d.district })) },
  ]

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
          <div className="sv-stat-val" style={{ color: INTRINSIC_COLOR }}>
            {latestTrend.intrinsic}<span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8' }}> /20</span>
          </div>
          <div className="sv-stat-lbl">Intrinsic subscore</div>
          <div className="sv-stat-sub">↑1.9 pts over school year</div>
        </div>
        <div className="sv-stat">
          <div className="sv-stat-val" style={{ color: EXTRINSIC_COLOR }}>
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
          <div style={{ height: 220 }}>
            <ResponsiveLine
              data={rmiNivo}
              theme={NIVO_THEME}
              margin={LINE_MARGIN}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 55, max: 90 }}
              curve="monotoneX"
              colors={d => d.color}
              lineWidth={2.5}
              enablePoints={false}
              enableArea
              areaOpacity={0.08}
              enableGridX={false}
              axisBottom={AXIS_BOTTOM}
              axisLeft={{ ...AXIS_LEFT, tickValues: [60, 70, 80, 90] }}
              defs={[{
                id: 'smotGrad', type: 'linearGradient',
                colors: [{ offset: 0, color: school.color, opacity: 0.22 }, { offset: 100, color: school.color, opacity: 0 }],
              }]}
              fill={[{ match: { id: shortName }, id: 'smotGrad' }]}
              enableSlices="x"
              sliceTooltip={({ slice }) => (
                <SliceTooltip
                  slice={slice}
                  accent={school.color}
                  allData={trend}
                  seriesMap={{ [shortName]: 'school', 'District avg': 'district' }}
                  formatDelta={d => `${d > 0 ? '+' : ''}${d} pts`}
                  context={s => {
                    const my = s.points.find(p => p.serieId === shortName)?.data.y
                    if (my == null) return null
                    const gap = my - districtNow
                    return gap === 0
                      ? <>On pace with district</>
                      : <><strong>{shortName}</strong> {gap > 0 ? '+' : ''}{gap} pts {gap > 0 ? 'above' : 'below'} district</>
                  }}
                />
              )}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <ChartLegend items={[
              { color: school.color, label: shortName },
              { color: '#CBD5E1',    label: `District avg (${districtNow})`, dashed: true },
            ]} />
          </div>
        </div>

        {/* Intrinsic vs Extrinsic trend */}
        <div className="sv-card sv-card--wide">
          <div className="sv-card-header">
            <div>
              <h3>Intrinsic vs. Extrinsic Motivation Trend</h3>
              <div className="sv-note">RMI subscores out of 20 · Sep 2024 – May 2025</div>
            </div>
          </div>
          <div style={{ height: 190 }}>
            <ResponsiveBar
              data={INTRINSIC_EXTRINSIC_TRENDS}
              keys={['intrinsic', 'extrinsic']}
              indexBy="month"
              groupMode="grouped"
              theme={NIVO_THEME}
              margin={{ top: 8, right: 16, bottom: 36, left: 36 }}
              padding={0.3}
              innerPadding={2}
              colors={({ id }) => id === 'intrinsic' ? INTRINSIC_COLOR : '#CBD5E1'}
              borderRadius={3}
              axisBottom={AXIS_BOTTOM}
              axisLeft={{ ...AXIS_LEFT, tickValues: [9, 11, 13, 15] }}
              enableGridY
              enableLabel={false}
              minValue={9}
              maxValue={16}
              tooltip={({ indexValue, data }) => (
                <BarTooltip
                  data={data}
                  indexValue={indexValue}
                  accent={INTRINSIC_COLOR}
                  format={v => `${v.toFixed(1)} /20`}
                  keys={['intrinsic', 'extrinsic']}
                  labels={{
                    intrinsic: { label: 'Intrinsic', color: INTRINSIC_COLOR },
                    extrinsic: { label: 'Extrinsic', color: '#CBD5E1' },
                  }}
                />
              )}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <ChartLegend items={[
              { color: INTRINSIC_COLOR, label: 'Intrinsic' },
              { color: '#CBD5E1',       label: 'Extrinsic' },
            ]} />
          </div>
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
              {intrinsicFactors.map(f => <FactorRow key={f.name} f={f} />)}
            </div>
            <div className="mot-factor-divider" />
            <div className="mot-factor-group">
              <div className="mot-factor-group-label mot-factor-group-label--ext">Extrinsic</div>
              {extrinsicFactors.map(f => <FactorRow key={f.name} f={f} />)}
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
                    <span className="mot-grade-track-label" style={{ color: INTRINSIC_COLOR }}>Intrinsic</span>
                    <div className="mot-grade-track">
                      <div className="mot-grade-bar mot-grade-bar--int" style={{ width: `${(g.intrinsic / 20) * 100}%` }} />
                    </div>
                    <span className="mot-grade-val" style={{ color: INTRINSIC_COLOR }}>{g.intrinsic}</span>
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
            <span className="mot-legend-dot" style={{ background: INTRINSIC_COLOR }} /> Intrinsic
            <span className="mot-legend-dot" style={{ background: '#CBD5E1', marginLeft: 12 }} /> Extrinsic
            <span style={{ marginLeft: 8, color: '#94A3B8', fontSize: 13 }}>scores out of 20 · badge = top factor</span>
          </div>
        </div>

      </div>
    </div>
  )
}
