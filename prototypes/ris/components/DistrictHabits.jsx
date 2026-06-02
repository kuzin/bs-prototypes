import {
  SESSION_BAND_TRENDS,
  SESSION_BANDS,
  STREAK_DATA,
  STREAK_GREW_PCT,
  VELOCITY_TRENDS,
  SCHOOL_STATS,
  SCHOOLS,
} from '../data'
import { Hero } from '@components/Hero/Hero'
import { StatCard, ChartCard } from '@components/Cards/Cards'
import { BarList } from '@components/BarList/BarList'
import { ChartLegend } from '@components/charts/charts'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { SECTIONS } from '@components/ReadingHealth/ReadingHealth'

const ACCENT = '#16A97A'
const HAB_ICON = SECTIONS.find((s) => s.key === 'habits')?.icon

const DISTRICT_AVG_SESSION = 20

const VELOCITY_LEVELS = [
  { key: 'elementary', label: 'Elementary', color: '#0DA7BC', gradId: 'velElGrad' },
  { key: 'middle', label: 'Middle', color: '#16A97A', gradId: 'velMidGrad' },
  { key: 'high', label: 'High', color: '#C084FC', gradId: 'velHiGrad' },
]

export function DistrictHabits() {
  const sortedBySession = [...SCHOOL_STATS].sort((a, b) => b.avgSession - a.avgSession)

  return (
    <div className="rc-page" style={{ '--rc-accent': ACCENT }}>
      <Hero bucket="habits" />

      <div className="rc-stats-row">
        <StatCard label="District avg session" value="20 min" footer="↑6 min since Sep" />
        <StatCard
          label="Grew reading streak"
          value={`${STREAK_GREW_PCT}%`}
          footer="of students this week"
        />
        <StatCard label="Avg reading days/week" value="3.2 days" footer="district-wide" />
        <StatCard label="Avg books/month" value="2.8 books" footer="all grade levels" />
      </div>

      <div className="sv-grid">
        {/* Session Length Trends — by grade band (scales past 6 schools) */}
        <ChartCard
          title="Session Length Trends by Grade Band"
          subtitle="Avg session minutes · Sep 2024 – May 2025"
          icon={HAB_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
          footer={
            <ChartLegend items={SESSION_BANDS.map((b) => ({ color: b.color, label: b.label }))} />
          }
        >
          <TrendChart
            type="line"
            data={SESSION_BAND_TRENDS}
            yDomain={[8, 30]}
            yUnit=" min"
            height="lg"
            tooltipFormatter={(v) => `${v} min`}
            series={SESSION_BANDS.map((b) => ({
              key: b.key,
              name: b.label,
              color: b.color,
              strokeWidth: 2,
            }))}
          />
        </ChartCard>

        {/* School Comparison */}
        <ChartCard
          title="School Comparison — Avg Session"
          subtitle={`May 2025 · district avg ${DISTRICT_AVG_SESSION} min`}
          icon={HAB_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
          footer={
            <ChartLegend
              items={[
                { color: '#0DA7BC', label: `At/above ${DISTRICT_AVG_SESSION} min` },
                { color: '#E8866A', label: 'Below district avg' },
              ]}
            />
          }
        >
          <BarList
            labelWidth={110}
            header={{ label: 'School', valueLabel: 'Avg session' }}
            items={sortedBySession.map((s) => ({
              label: s.name,
              value: s.avgSession,
              max: 30,
              color: s.avgSession >= DISTRICT_AVG_SESSION ? '#0DA7BC' : '#E8866A',
              valueLabel: `${s.avgSession} min`,
            }))}
          />
        </ChartCard>

        {/* Streak Milestones — grouped bars per school per milestone */}
        <ChartCard
          title="Streak Milestones"
          subtitle="% of students reaching each streak length"
          icon={HAB_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
          footer={
            <ChartLegend
              items={SCHOOLS.map((s) => ({ color: s.color, label: s.name.split(' ')[0] }))}
            />
          }
        >
          <TrendChart
            type="bar"
            data={STREAK_DATA}
            xKey="milestone"
            yDomain={[0, 100]}
            yUnit="%"
            height="lg"
            tooltipFormatter={(v) => `${v}%`}
            xPadding={{ left: 12, right: 12 }}
            series={SCHOOLS.map((s) => ({ key: s.id, name: s.name.split(' ')[0], color: s.color }))}
          />
        </ChartCard>

        {/* Reading Velocity — full width */}
        <ChartCard
          title="Reading Velocity — Books/Month by Level"
          subtitle="District averages across grade bands · Sep 2024 – May 2025"
          icon={HAB_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
          footer={
            <ChartLegend items={VELOCITY_LEVELS.map((l) => ({ color: l.color, label: l.label }))} />
          }
        >
          <TrendChart
            type="area"
            data={VELOCITY_TRENDS}
            yDomain={[1, 5]}
            yUnit=" bks"
            height="lg"
            tooltipFormatter={(v) => `${v} bks/mo`}
            series={VELOCITY_LEVELS.map((l) => ({
              key: l.key,
              name: l.label,
              color: l.color,
              strokeWidth: 2,
            }))}
          />
        </ChartCard>
      </div>
    </div>
  )
}
