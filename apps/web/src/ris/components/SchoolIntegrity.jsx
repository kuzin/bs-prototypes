import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import {
  SCHOOLS, SCHOOL_HEALTH, SCHOOL_INTEGRITY_TRENDS, BOOK_TALKS_BY_SCHOOL,
} from '../data'
import { Hero } from './Hero'
import { SECTIONS } from './ReadingHealth'
import {
  NIVO_THEME, LINE_MARGIN, AXIS_BOTTOM, AXIS_LEFT,
  SliceTooltip, ChartLegend,
} from './charts'
import { StatCard, ChartCard } from './Cards'
import './RisLayout.css'

const COMPLETION_COLOR = '#1D4ED8'
const FLAG_COLOR       = '#E8866A'
const INT_ICON         = SECTIONS.find(s => s.key === 'integrity')?.icon

export function SchoolIntegrity({ schoolId, onBack }) {
  const school   = SCHOOLS.find(s => s.id === schoolId)
  const health   = SCHOOL_HEALTH[schoolId]
  const trend    = SCHOOL_INTEGRITY_TRENDS[schoolId]
  const stats    = BOOK_TALKS_BY_SCHOOL.find(b => b.id === schoolId)
  const latest   = trend[trend.length - 1]
  const shortName = school.name.split(' ')[0]

  const ranked = [...BOOK_TALKS_BY_SCHOOL]
    .map(b => ({ ...b, isThis: b.id === schoolId }))
    .sort((a, b) => b.completionRate - a.completionRate)

  const trendNivo = [
    { id: 'Book Talk completion', color: COMPLETION_COLOR, data: trend.map(d => ({ x: d.month, y: d.completionRate })) },
    { id: 'Flag rate',            color: FLAG_COLOR,       data: trend.map(d => ({ x: d.month, y: d.flagRate       })) },
  ]

  return (
    <div className="mot-root">
      <Hero bucket="integrity" score={health.integrity} delta={health.dI} />

      <div className="rc-stats-row" style={{ '--rc-stats-cols': 3 }}>
        <StatCard
          value={stats.completionRate}
          unit="%"
          label="Book Talk completion"
          footer={`${stats.trend > 0 ? '↑' : '↓'}${Math.abs(stats.trend)}pp vs last month`}
          color={COMPLETION_COLOR}
          footerColor={stats.trend > 0 ? '#16A34A' : '#DC2626'}
        />
        <StatCard
          value={stats.flagRate}
          unit="%"
          label="Flag rate"
          footer={`${latest.flagRate - trend[0].flagRate > 0 ? '↑' : '↓'}${Math.abs(latest.flagRate - trend[0].flagRate)}pp since Sep`}
          color={FLAG_COLOR}
          footerColor={latest.flagRate - trend[0].flagRate <= 0 ? '#16A34A' : '#DC2626'}
        />
        <StatCard
          value={stats.totalTalks}
          label="Book Talks this year"
          footer="Triggered by 5+ logs or staff request"
        />
      </div>

      <div className="sv-grid">

        <ChartCard
          span={2}
          title="Book Talk completion & flag rate"
          subtitle={`${school.name} · Sep 2024 – May 2025`}
          icon={INT_ICON}
          accent={COMPLETION_COLOR}
          footer={<ChartLegend items={[
            { color: COMPLETION_COLOR, label: 'Completion rate' },
            { color: FLAG_COLOR,       label: 'Flag rate', dashed: true },
          ]} />}
        >
          <div style={{ height: 220 }}>
            <ResponsiveLine
              data={trendNivo}
              theme={NIVO_THEME}
              margin={LINE_MARGIN}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 0, max: 100 }}
              curve="monotoneX"
              colors={d => d.color}
              lineWidth={2.5}
              enablePoints={false}
              enableGridX={false}
              axisBottom={AXIS_BOTTOM}
              axisLeft={{ ...AXIS_LEFT, format: v => `${v}%`, tickValues: [0, 25, 50, 75, 100] }}
              enableSlices="x"
              sliceTooltip={({ slice }) => (
                <SliceTooltip
                  slice={slice}
                  accent={COMPLETION_COLOR}
                  allData={trend}
                  seriesMap={{ 'Book Talk completion': 'completionRate', 'Flag rate': 'flagRate' }}
                  inverseSeries={['Flag rate']}
                  formatY={v => `${v}%`}
                  formatDelta={d => `${d > 0 ? '+' : ''}${d}pp`}
                  context={s => {
                    const comp = s.points.find(p => p.serieId === 'Book Talk completion')?.data.y
                    const flag = s.points.find(p => p.serieId === 'Flag rate')?.data.y
                    if (comp == null || flag == null) return null
                    const ratio = (comp / (comp + flag) * 100).toFixed(0)
                    return <><strong>{ratio}%</strong> of activity is clean completion</>
                  }}
                />
              )}
            />
          </div>
        </ChartCard>

        <ChartCard
          span={2}
          title="District integrity ranking"
          subtitle="Book Talk completion rate · May 2025"
          icon={INT_ICON}
          accent={COMPLETION_COLOR}
        >
          <div style={{ height: 220 }}>
            <ResponsiveBar
              data={ranked}
              keys={['completionRate']}
              indexBy="name"
              layout="horizontal"
              theme={NIVO_THEME}
              margin={{ top: 8, right: 32, bottom: 36, left: 96 }}
              colors={({ data }) => data.isThis ? school.color : '#CBD5E1'}
              borderRadius={4}
              axisBottom={{ ...AXIS_BOTTOM, format: v => `${v}%`, tickValues: [0, 25, 50, 75, 100] }}
              axisLeft={{ tickSize: 0, tickPadding: 10 }}
              enableGridY={false}
              enableLabel={false}
              maxValue={100}
              tooltip={({ data }) => (
                <div className="sdb-tooltip" style={{ '--tip-accent': data.isThis ? school.color : COMPLETION_COLOR }}>
                  <div className="sdb-tooltip-header">{data.name}</div>
                  <div className="sdb-tooltip-series" style={{ '--series-color': data.isThis ? school.color : '#94A3B8' }}>
                    <div className="sdb-tooltip-row">
                      <span className="sdb-tooltip-dot" />
                      <span className="sdb-tooltip-label">Completion rate</span>
                      <span className="sdb-tooltip-val">{data.completionRate}%</span>
                    </div>
                  </div>
                  <div className="sdb-tooltip-series" style={{ '--series-color': FLAG_COLOR }}>
                    <div className="sdb-tooltip-row">
                      <span className="sdb-tooltip-dot" />
                      <span className="sdb-tooltip-label">Flag rate</span>
                      <span className="sdb-tooltip-val">{data.flagRate}%</span>
                    </div>
                  </div>
                  <div className="sdb-tooltip-context">{data.totalTalks} Book Talks this year</div>
                </div>
              )}
            />
          </div>
        </ChartCard>

      </div>
    </div>
  )
}
