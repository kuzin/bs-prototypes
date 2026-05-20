import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import {
  SCHOOLS, RMI_TRENDS, SCHOOL_HEALTH,
  RMI_FACTORS, INTRINSIC_EXTRINSIC_TRENDS, MOTIVATION_BY_GRADE,
} from '../data'
import { Hero } from './Hero'
import { SECTIONS } from './ReadingHealth'
import {
  NIVO_THEME, LINE_MARGIN, AXIS_BOTTOM, AXIS_LEFT,
  SliceTooltip, ChartLegend, BarTooltip,
} from './charts'
import { StatCard, ChartCard, CardNote } from './Cards'
import { ProgressBar } from './ProgressBar'
import { RMI_ICONS } from './RmiIcons'
import './RisLayout.css'
import './Motivation.css'

const INTRINSIC_COLOR = '#E8866A'
const EXTRINSIC_COLOR = '#7CB5F5'
const MOT_ICON = SECTIONS.find(s => s.key === 'motivation')?.icon
const FACTOR_BY_NAME = Object.fromEntries(RMI_FACTORS.map(f => [f.name, f]))

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
      <ProgressBar value={f.score} max={f.max} color={f.color} size="md" />
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

  const rmiNivo = [
    { id: shortName,      color: school.color, data: trend.map(d => ({ x: d.month, y: d.school   })) },
    { id: 'District avg', color: '#CBD5E1',    data: trend.map(d => ({ x: d.month, y: d.district })) },
  ]

  return (
    <div className="mot-root">
      <Hero bucket="motivation" />

      <div className="rc-stats-row" style={{ '--rc-stats-cols': 3 }}>
        <StatCard
          value={(latestTrend.intrinsic + latestTrend.extrinsic).toFixed(1)}
          unit="/40"
          label="School RMI score"
          footer={`↑${health.dM} pts since Sep 2024`}
        />
        <StatCard
          value={latestTrend.intrinsic}
          unit="/20"
          label="Intrinsic subscore"
          footer="↑1.9 pts over school year"
          color={INTRINSIC_COLOR}
        />
        <StatCard
          value={latestTrend.extrinsic}
          unit="/20"
          label="Extrinsic subscore"
          footer="↑0.4 pts over school year"
          color={EXTRINSIC_COLOR}
        />
      </div>

      <div className="sv-grid">

        <ChartCard
          span={2}
          title={`RMI Trend — ${school.name} vs. District`}
          subtitle="Sep 2024 – May 2025"
          icon={MOT_ICON}
          accent={INTRINSIC_COLOR}
          footer={<ChartLegend items={[
            { color: school.color, label: shortName },
            { color: '#CBD5E1',    label: `District avg (${districtNow})`, dashed: true },
          ]} />}
        >
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
                    const dist = s.points.find(p => p.serieId === 'District avg')?.data.y
                    if (my == null || dist == null) return null
                    const gap = my - dist
                    return gap === 0
                      ? <>On pace with district</>
                      : <><strong>{shortName}</strong> {gap > 0 ? '+' : ''}{gap} pts {gap > 0 ? 'above' : 'below'} district</>
                  }}
                />
              )}
            />
          </div>
        </ChartCard>

        <ChartCard
          span={2}
          title="Intrinsic vs. Extrinsic Motivation Trend"
          subtitle="RMI subscores out of 20 · Sep 2024 – May 2025"
          icon={MOT_ICON}
          accent={INTRINSIC_COLOR}
          footer={<ChartLegend items={[
            { color: INTRINSIC_COLOR, label: 'Intrinsic' },
            { color: '#CBD5E1',       label: 'Extrinsic' },
          ]} />}
        >
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
                  formatDelta={d => `${d > 0 ? '+' : ''}${d.toFixed(1)} pts`}
                  keys={['intrinsic', 'extrinsic']}
                  labels={{
                    intrinsic: { label: 'Intrinsic', color: INTRINSIC_COLOR },
                    extrinsic: { label: 'Extrinsic', color: '#CBD5E1' },
                  }}
                  allData={INTRINSIC_EXTRINSIC_TRENDS}
                  indexBy="month"
                  context={d => {
                    const gap = d.intrinsic - d.extrinsic
                    if (gap === 0) return <>On par with extrinsic</>
                    return <><strong>Intrinsic</strong> {gap > 0 ? '+' : ''}{gap.toFixed(1)} pts {gap > 0 ? 'above' : 'below'} extrinsic</>
                  }}
                />
              )}
            />
          </div>
          <CardNote tone="accent">
            Students' intrinsic reading subscore rose from <strong>12.1</strong> to <strong>14.2 /20</strong> over the school year — reflecting sustained growth in self-motivated, independent reading. The extrinsic score remains stable at <strong>11.8 /20</strong>, meaning intrinsic motivation is outpacing external drivers.
          </CardNote>
        </ChartCard>

        <ChartCard
          span={2}
          title="RMI Factor Breakdown"
          subtitle="All 10 RMI factors · scored 1–4"
          icon={MOT_ICON}
          accent={INTRINSIC_COLOR}
          bodyPad="padded"
        >
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
        </ChartCard>

        <ChartCard
          title="Intrinsic vs. Extrinsic by Grade Band"
          subtitle="RMI subscores out of 20"
          icon={MOT_ICON}
          accent={INTRINSIC_COLOR}
          bodyPad="padded"
          footer={<ChartLegend items={[
            { color: INTRINSIC_COLOR, label: 'Intrinsic' },
            { color: '#CBD5E1',       label: 'Extrinsic' },
          ]} />}
        >
          <div className="mot-grade-list">
            {MOTIVATION_BY_GRADE.map(g => (
              <div key={g.band} className="mot-grade-row mot-grade-row--simple">
                <div className="mot-grade-band">{g.band}</div>
                <div className="mot-grade-tracks">
                  <div className="mot-grade-track-row">
                    <span className="mot-grade-track-label" style={{ color: INTRINSIC_COLOR }}>Intrinsic</span>
                    <ProgressBar value={g.intrinsic} max={20} color={INTRINSIC_COLOR} size="sm" />
                    <span className="mot-grade-val" style={{ color: INTRINSIC_COLOR }}>{g.intrinsic}</span>
                  </div>
                  <div className="mot-grade-track-row">
                    <span className="mot-grade-track-label" style={{ color: '#94A3B8' }}>Extrinsic</span>
                    <ProgressBar value={g.extrinsic} max={20} color="#CBD5E1" size="sm" />
                    <span className="mot-grade-val" style={{ color: '#94A3B8' }}>{g.extrinsic}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Top Motivation Factor by Grade Band"
          subtitle="What drives readers most at each level"
          icon={MOT_ICON}
          accent={INTRINSIC_COLOR}
          bodyPad="padded"
        >
          <div className="mot-top-factor-list">
            {MOTIVATION_BY_GRADE.map(g => {
              const factor = FACTOR_BY_NAME[g.topFactor]
              if (!factor) return null
              return (
                <div key={g.band} className="mot-top-factor-row">
                  <div className="mot-top-factor-band">{g.band}</div>
                  <div
                    className="mot-top-factor-icon"
                    style={{ '--tf-color': factor.color, '--tf-bg': `color-mix(in srgb, ${factor.color} 12%, white)` }}
                  >
                    {RMI_ICONS[factor.iconKey]}
                  </div>
                  <div className="mot-top-factor-body">
                    <div className="mot-top-factor-name" style={{ color: factor.color }}>{factor.name}</div>
                    <div className="mot-top-factor-desc">{factor.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>

      </div>
    </div>
  )
}
