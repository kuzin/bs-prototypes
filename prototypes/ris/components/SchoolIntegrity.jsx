import { ResponsiveLine } from '@nivo/line'
import { SCHOOLS, SCHOOL_HEALTH, SCHOOL_INTEGRITY_TRENDS, BOOK_TALKS_BY_SCHOOL } from '../data'
import { Hero } from '@components/Hero/Hero'
import { SECTIONS } from '@components/ReadingHealth/ReadingHealth'
import {
  NIVO_THEME,
  LINE_MARGIN,
  AXIS_BOTTOM,
  AXIS_LEFT,
  SliceTooltip,
  ChartLegend,
} from '@components/charts/charts'
import { StatCard, ChartCard } from '@components/Cards/Cards'
import { TrendChart } from '@components/TrendChart/TrendChart'

const COMPLETION_COLOR = '#1D4ED8'
const FLAG_COLOR = '#E8866A'
const INT_ICON = SECTIONS.find((s) => s.key === 'integrity')?.icon

export function SchoolIntegrity({ schoolId, onBack }) {
  const school = SCHOOLS.find((s) => s.id === schoolId)
  const health = SCHOOL_HEALTH[schoolId]
  const trend = SCHOOL_INTEGRITY_TRENDS[schoolId]
  const stats = BOOK_TALKS_BY_SCHOOL.find((b) => b.id === schoolId)
  const latest = trend[trend.length - 1]
  const shortName = school.name.split(' ')[0]

  const ranked = [...BOOK_TALKS_BY_SCHOOL]
    .map((b) => ({ ...b, name: b.name.split(' ')[0], isThis: b.id === schoolId }))
    .sort((a, b) => b.completionRate - a.completionRate)

  const trendNivo = [
    {
      id: 'Book Talk completion',
      color: COMPLETION_COLOR,
      data: trend.map((d) => ({ x: d.month, y: d.completionRate })),
    },
    { id: 'Flag rate', color: FLAG_COLOR, data: trend.map((d) => ({ x: d.month, y: d.flagRate })) },
  ]

  return (
    <div className="mot-root">
      <Hero bucket="integrity" />

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
          footer={
            <ChartLegend
              items={[
                { color: COMPLETION_COLOR, label: 'Completion rate' },
                { color: FLAG_COLOR, label: 'Flag rate', dashed: true },
              ]}
            />
          }
        >
          <div style={{ flex: 1, minHeight: 240 }}>
            <ResponsiveLine
              data={trendNivo}
              theme={NIVO_THEME}
              margin={LINE_MARGIN}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 0, max: 100 }}
              curve="monotoneX"
              colors={(d) => d.color}
              lineWidth={2.5}
              enablePoints={false}
              enableGridX={false}
              axisBottom={AXIS_BOTTOM}
              axisLeft={{ ...AXIS_LEFT, format: (v) => `${v}%`, tickValues: [0, 25, 50, 75, 100] }}
              enableSlices="x"
              sliceTooltip={({ slice }) => (
                <SliceTooltip
                  slice={slice}
                  accent={COMPLETION_COLOR}
                  allData={trend}
                  seriesMap={{ 'Book Talk completion': 'completionRate', 'Flag rate': 'flagRate' }}
                  inverseSeries={['Flag rate']}
                  formatY={(v) => `${v}%`}
                  formatDelta={(d) => `${d > 0 ? '+' : ''}${d}pp`}
                  context={(s) => {
                    const comp = s.points.find((p) => p.serieId === 'Book Talk completion')?.data.y
                    const flag = s.points.find((p) => p.serieId === 'Flag rate')?.data.y
                    if (comp == null || flag == null) return null
                    const ratio = ((comp / (comp + flag)) * 100).toFixed(0)
                    return (
                      <>
                        <strong>{ratio}%</strong> of activity is clean completion
                      </>
                    )
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
          <TrendChart
            type="bar"
            layout="horizontal"
            data={ranked}
            xKey="name"
            yDomain={[0, 100]}
            yUnit="%"
            yTicks={[0, 25, 50, 75, 100]}
            height="md"
            leftMargin={84}
            tooltipFormatter={(v) => `${v}%`}
            series={[
              {
                key: 'completionRate',
                name: 'Completion rate',
                color: '#CBD5E1',
                colorFn: (d) => (d.isThis ? school.color : '#CBD5E1'),
              },
            ]}
          />
        </ChartCard>
      </div>
    </div>
  )
}
