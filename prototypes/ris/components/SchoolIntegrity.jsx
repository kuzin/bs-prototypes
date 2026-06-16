import { SCHOOLS, SCHOOL_HEALTH, SCHOOL_INTEGRITY_TRENDS, BOOK_TALKS_BY_SCHOOL } from '../data'
import { Hero } from '@components/Hero/Hero'
import { SECTIONS } from '@components/ReadingHealth/ReadingHealth'
import { SliceTooltip, ChartLegend } from '@components/charts/charts'
import { StatCard, ChartCard } from '@components/Cards/Cards'
import { TrendChart } from '@components/TrendChart/TrendChart'

const INTEGRITY = SECTIONS.find((s) => s.key === 'integrity')
const COMPLETION_COLOR = INTEGRITY.color
const FLAG_COLOR = '#E8866A'
const INT_ICON = INTEGRITY.icon

export function SchoolIntegrity({ schoolId }) {
  const school = SCHOOLS.find((s) => s.id === schoolId)
  const trend = SCHOOL_INTEGRITY_TRENDS[schoolId]
  const stats = BOOK_TALKS_BY_SCHOOL.find((b) => b.id === schoolId)
  const latest = trend[trend.length - 1]

  const ranked = [...BOOK_TALKS_BY_SCHOOL]
    .map((b) => ({ ...b, name: b.name.split(' ')[0], isThis: b.id === schoolId }))
    .sort((a, b) => b.completionRate - a.completionRate)

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
          <TrendChart
            type="line"
            data={trend}
            xKey="month"
            yDomain={[0, 100]}
            yUnit="%"
            yTicks={[0, 25, 50, 75, 100]}
            height="md"
            series={[
              { key: 'completionRate', name: 'Book Talk completion', color: COMPLETION_COLOR },
              { key: 'flagRate', name: 'Flag rate', color: FLAG_COLOR, dashed: true },
            ]}
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
