import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import {
  SCHOOLS, SCHOOL_STATS, SCHOOL_HEALTH, SESSION_TRENDS,
  STREAK_DATA, VELOCITY_TRENDS, READING_DIET,
} from '../data'
import { Hero } from './Hero'
import { SECTIONS } from './ReadingHealth'
import {
  NIVO_THEME, LINE_MARGIN, AXIS_BOTTOM, AXIS_LEFT,
  SliceTooltip, ChartLegend, BarTooltip,
} from './charts'
import { StatCard, ChartCard } from './Cards'
import './RisLayout.css'
import './SchoolHabits.css'

const HABITS_COLOR = '#16A97A'
const HABITS_ICON  = SECTIONS.find(s => s.key === 'habits')?.icon

export function SchoolHabits({ schoolId, onBack }) {
  const school   = SCHOOLS.find(s => s.id === schoolId)
  const stats    = SCHOOL_STATS.find(s => s.id === schoolId)
  const health   = SCHOOL_HEALTH[schoolId]
  const shortName = school.name.split(' ')[0]

  const sessionData = SESSION_TRENDS.map(d => ({ month: d.month, school: d[schoolId], district: d.district }))

  const streakData = STREAK_DATA.map(d => ({
    milestone: d.milestone,
    school:    d[schoolId],
    district:  Math.round(Object.entries(d).filter(([k]) => k !== 'milestone').reduce((a, [,v]) => a + v, 0) / 6),
  }))

  const sessionNivo = [
    { id: shortName,      color: school.color, data: sessionData.map(d => ({ x: d.month, y: d.school   })) },
    { id: 'District avg', color: '#CBD5E1',    data: sessionData.map(d => ({ x: d.month, y: d.district })) },
  ]

  const velocityNivo = [
    { id: 'Elementary', color: '#0DA7BC', data: VELOCITY_TRENDS.map(d => ({ x: d.month, y: d.elementary })) },
    { id: 'Middle',     color: '#16A97A', data: VELOCITY_TRENDS.map(d => ({ x: d.month, y: d.middle     })) },
    { id: 'High',       color: '#C084FC', data: VELOCITY_TRENDS.map(d => ({ x: d.month, y: d.high       })) },
  ]

  return (
    <div className="mot-root">
      <Hero bucket="habits" />

      <div className="rc-stats-row">
        <StatCard
          value={stats.avgSession}
          unit="min"
          label="Avg session length"
          footer={stats.avgSession >= 20 ? '↑ Above district avg' : '↓ Below district avg (20 min)'}
          color={HABITS_COLOR}
          footerColor={stats.avgSession >= 20 ? '#16A34A' : '#DC2626'}
        />
        <StatCard
          value={stats.streakPct}
          unit="%"
          label="Active streaks"
          footer="of enrolled students"
        />
        <StatCard
          value="3.1"
          unit="days"
          label="Avg reading days / week"
          footer="School average"
        />
        <StatCard
          value="2.6"
          unit="books"
          label="Avg books / month"
          footer="All grade levels"
        />
      </div>

      <div className="sv-grid">

        <ChartCard
          span={2}
          title={`Session Length Trend — ${school.name} vs. District`}
          subtitle="Sep 2024 – May 2025"
          icon={HABITS_ICON}
          accent={HABITS_COLOR}
          footer={<ChartLegend items={[
            { color: school.color, label: shortName },
            { color: '#CBD5E1',    label: 'District avg', dashed: true },
          ]} />}
        >
          <div style={{ height: 210 }}>
            <ResponsiveLine
              data={sessionNivo}
              theme={NIVO_THEME}
              margin={LINE_MARGIN}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 6, max: 32 }}
              curve="monotoneX"
              colors={d => d.color}
              lineWidth={2.5}
              enablePoints={false}
              enableArea
              areaOpacity={0.08}
              enableGridX={false}
              axisBottom={AXIS_BOTTOM}
              axisLeft={{ ...AXIS_LEFT, format: v => `${v}m`, tickValues: [10, 20, 30] }}
              defs={[{
                id: 'sessGrad', type: 'linearGradient',
                colors: [{ offset: 0, color: school.color, opacity: 0.22 }, { offset: 100, color: school.color, opacity: 0 }],
              }]}
              fill={[{ match: { id: shortName }, id: 'sessGrad' }]}
              enableSlices="x"
              sliceTooltip={({ slice }) => (
                <SliceTooltip
                  slice={slice}
                  accent={HABITS_COLOR}
                  allData={sessionData}
                  seriesMap={{ [shortName]: 'school', 'District avg': 'district' }}
                  formatY={v => `${v} min`}
                  formatDelta={d => `${d > 0 ? '+' : ''}${d} min`}
                  context={s => {
                    const my = s.points.find(p => p.serieId === shortName)?.data.y
                    const dist = s.points.find(p => p.serieId === 'District avg')?.data.y
                    if (my == null || dist == null) return null
                    const gap = my - dist
                    return gap === 0
                      ? <>On pace with district</>
                      : <><strong>{shortName}</strong> {gap > 0 ? '+' : ''}{gap} min {gap > 0 ? 'above' : 'below'} district</>
                  }}
                />
              )}
            />
          </div>
        </ChartCard>

        <ChartCard
          title="Streak Milestones"
          subtitle="% of students reaching each streak length"
          icon={HABITS_ICON}
          accent={HABITS_COLOR}
          footer={<ChartLegend items={[
            { color: school.color, label: shortName },
            { color: '#CBD5E1',    label: 'District avg' },
          ]} />}
        >
          <div style={{ height: 200 }}>
            <ResponsiveBar
              data={streakData}
              keys={['school', 'district']}
              indexBy="milestone"
              groupMode="grouped"
              theme={NIVO_THEME}
              margin={{ top: 8, right: 16, bottom: 36, left: 38 }}
              padding={0.3}
              innerPadding={2}
              colors={({ id }) => id === 'school' ? school.color : '#CBD5E1'}
              borderRadius={3}
              axisBottom={AXIS_BOTTOM}
              axisLeft={{ ...AXIS_LEFT, format: v => `${v}%`, tickValues: [0, 25, 50, 75, 100] }}
              enableGridY
              enableLabel={false}
              maxValue={100}
              tooltip={({ indexValue, data }) => (
                <BarTooltip
                  data={data}
                  indexValue={indexValue}
                  accent={HABITS_COLOR}
                  format={v => `${v}%`}
                  keys={['school', 'district']}
                  labels={{
                    school:   { label: shortName,      color: school.color },
                    district: { label: 'District avg', color: '#CBD5E1' },
                  }}
                />
              )}
            />
          </div>
        </ChartCard>

        <ChartCard
          title="Reading Velocity by Level"
          subtitle="Books/month per grade band"
          icon={HABITS_ICON}
          accent={HABITS_COLOR}
          footer={<ChartLegend items={[
            { color: '#0DA7BC', label: 'Elementary' },
            { color: '#16A97A', label: 'Middle' },
            { color: '#C084FC', label: 'High' },
          ]} />}
        >
          <div style={{ height: 200 }}>
            <ResponsiveLine
              data={velocityNivo}
              theme={NIVO_THEME}
              margin={LINE_MARGIN}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 1, max: 5 }}
              curve="monotoneX"
              colors={d => d.color}
              lineWidth={2}
              enablePoints={false}
              enableArea
              areaOpacity={0.12}
              enableGridX={false}
              axisBottom={AXIS_BOTTOM}
              axisLeft={{ ...AXIS_LEFT, format: v => `${v} bks`, tickValues: [1, 2, 3, 4, 5] }}
              enableSlices="x"
              sliceTooltip={({ slice }) => (
                <SliceTooltip
                  slice={slice}
                  accent={HABITS_COLOR}
                  allData={VELOCITY_TRENDS}
                  seriesMap={{ Elementary: 'elementary', Middle: 'middle', High: 'high' }}
                  formatY={v => `${v.toFixed(1)} bks/mo`}
                  formatDelta={d => `${d > 0 ? '+' : ''}${d.toFixed(1)}`}
                />
              )}
            />
          </div>
        </ChartCard>

        <ChartCard
          title="Reading Diet Breakdown"
          subtitle="AI genre analysis · district-wide 2024–25"
          icon={HABITS_ICON}
          accent={HABITS_COLOR}
          bodyPad="padded"
          action={<span className="sh-gemini-badge">✦ Gemini</span>}
        >
          <div className="sh-diet-list">
            {READING_DIET.map(d => (
              <div key={d.genre} className="sh-diet-row">
                <div className="sh-diet-label">
                  <span className="sh-diet-dot" style={{ background: d.color }} />
                  <span className="sh-diet-genre">{d.genre}</span>
                </div>
                <div className="sh-diet-bar-wrap">
                  <div className="sh-diet-bar" style={{
                    width: `${(d.pct / Math.max(...READING_DIET.map(x => x.pct))) * 100}%`,
                    background: d.color,
                  }} />
                </div>
                <span className="sh-diet-pct">{d.pct}%</span>
              </div>
            ))}
          </div>
        </ChartCard>

      </div>
    </div>
  )
}
