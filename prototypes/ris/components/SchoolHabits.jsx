import {
  SCHOOLS,
  SCHOOL_STATS,
  SCHOOL_HEALTH,
  SESSION_TRENDS,
  STREAK_DATA,
  VELOCITY_TRENDS,
  READING_DIET,
} from '../data'
import { Hero } from '@components/Hero/Hero'
import { SECTIONS } from '@components/ReadingHealth/ReadingHealth'
import { SliceTooltip, ChartLegend } from '@components/charts/charts'
import { StatCard, ChartCard } from '@components/Cards/Cards'
import { BarList } from '@components/BarList/BarList'
import { TrendChart } from '@components/TrendChart/TrendChart'
import './SchoolHabits.css'

const HABITS = SECTIONS.find((s) => s.key === 'habits')
const HABITS_COLOR = HABITS.color
const HABITS_ICON = HABITS.icon

export function SchoolHabits({ schoolId }) {
  const school = SCHOOLS.find((s) => s.id === schoolId)
  const stats = SCHOOL_STATS.find((s) => s.id === schoolId)
  const shortName = school.name.split(' ')[0]

  const sessionData = SESSION_TRENDS.map((d) => ({
    month: d.month,
    school: d[schoolId],
    district: d.district,
  }))

  const streakData = STREAK_DATA.map((d) => ({
    milestone: d.milestone,
    school: d[schoolId],
    district: Math.round(
      Object.entries(d)
        .filter(([k]) => k !== 'milestone')
        .reduce((a, [, v]) => a + v, 0) / 6,
    ),
  }))

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
        <StatCard value={stats.streakPct} label="Active streaks" footer="of enrolled students" />
        <StatCard value="3.1" label="Avg reading days / week" footer="School average" />
        <StatCard value="2.6" label="Avg Sessions" footer="All grade levels" />
      </div>

      <div className="sv-grid">
        <ChartCard
          span={2}
          title={`Session Length Trend — ${school.name} vs. District`}
          subtitle="Sep 2024 – May 2025"
          icon={HABITS_ICON}
          accent={HABITS_COLOR}
          footer={
            <ChartLegend
              items={[
                { color: school.color, label: shortName },
                { color: '#CBD5E1', label: 'District avg', dashed: true },
              ]}
            />
          }
        >
          <TrendChart
            type="area"
            data={sessionData}
            xKey="month"
            yDomain={[6, 32]}
            yUnit="m"
            yTicks={[10, 20, 30]}
            height="md"
            series={[
              { key: 'school', name: shortName, color: school.color, fillOpacity: 0.22 },
              {
                key: 'district',
                name: 'District avg',
                color: '#CBD5E1',
                dashed: true,
                fillOpacity: 0,
              },
            ]}
            sliceTooltip={({ slice }) => (
              <SliceTooltip
                slice={slice}
                accent={HABITS_COLOR}
                allData={sessionData}
                seriesMap={{ [shortName]: 'school', 'District avg': 'district' }}
                formatY={(v) => `${v} min`}
                formatDelta={(d) => `${d > 0 ? '+' : ''}${d} min`}
                context={(s) => {
                  const my = s.points.find((p) => p.serieId === shortName)?.data.y
                  const dist = s.points.find((p) => p.serieId === 'District avg')?.data.y
                  if (my == null || dist == null) return null
                  const gap = my - dist
                  return gap === 0 ? (
                    <>On pace with district</>
                  ) : (
                    <>
                      <strong>{shortName}</strong> {gap > 0 ? '+' : ''}
                      {gap} min {gap > 0 ? 'above' : 'below'} district
                    </>
                  )
                }}
              />
            )}
          />
        </ChartCard>

        <ChartCard
          title="Streak Milestones"
          subtitle="% of students reaching each streak length"
          icon={HABITS_ICON}
          accent={HABITS_COLOR}
          footer={
            <ChartLegend
              items={[
                { color: school.color, label: shortName },
                { color: '#CBD5E1', label: 'District avg' },
              ]}
            />
          }
        >
          <TrendChart
            type="bar"
            data={streakData}
            xKey="milestone"
            yDomain={[0, 100]}
            yUnit="%"
            yTicks={[0, 25, 50, 75, 100]}
            height="md"
            tooltipFormatter={(v) => `${v}%`}
            xPadding={{ left: 12, right: 12 }}
            series={[
              { key: 'school', name: shortName, color: school.color },
              { key: 'district', name: 'District avg', color: '#CBD5E1' },
            ]}
          />
        </ChartCard>

        <ChartCard
          title="Reading Velocity by Level"
          subtitle="Books/month per grade band"
          icon={HABITS_ICON}
          accent={HABITS_COLOR}
          footer={
            <ChartLegend
              items={[
                { color: '#0DA7BC', label: 'Elementary' },
                { color: '#16A97A', label: 'Middle' },
                { color: '#C084FC', label: 'High' },
              ]}
            />
          }
        >
          <TrendChart
            type="area"
            data={VELOCITY_TRENDS}
            xKey="month"
            yDomain={[1, 5]}
            yUnit=" bks"
            yTicks={[1, 2, 3, 4, 5]}
            height="md"
            series={[
              { key: 'elementary', name: 'Elementary', color: '#0DA7BC', fillOpacity: 0.12 },
              { key: 'middle', name: 'Middle', color: '#16A97A', fillOpacity: 0.12 },
              { key: 'high', name: 'High', color: '#C084FC', fillOpacity: 0.12 },
            ]}
            sliceTooltip={({ slice }) => (
              <SliceTooltip
                slice={slice}
                accent={HABITS_COLOR}
                allData={VELOCITY_TRENDS}
                seriesMap={{ Elementary: 'elementary', Middle: 'middle', High: 'high' }}
                formatY={(v) => `${v.toFixed(1)} bks/mo`}
                formatDelta={(d) => `${d > 0 ? '+' : ''}${d.toFixed(1)}`}
              />
            )}
          />
        </ChartCard>

        <ChartCard
          title="Reading Diet Breakdown"
          subtitle="AI genre analysis · district-wide 2024–25"
          icon={HABITS_ICON}
          accent={HABITS_COLOR}
          bodyPad="padded"
          span={2}
          action={<span className="sh-gemini-badge">✦ Gemini</span>}
        >
          <BarList
            header={{ label: 'Genre', valueLabel: '% of logs' }}
            items={READING_DIET.map((d) => ({
              label: d.genre,
              value: d.pct,
              max: Math.max(...READING_DIET.map((x) => x.pct)),
              color: d.color,
              valueLabel: `${d.pct}%`,
            }))}
          />
        </ChartCard>
      </div>
    </div>
  )
}
