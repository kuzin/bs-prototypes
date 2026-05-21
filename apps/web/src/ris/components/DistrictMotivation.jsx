import {
  RMI_TRENDS, SCHOOLS, DISTRICT_HEALTH, SCHOOL_HEALTH,
  RMI_FACTORS, INTRINSIC_EXTRINSIC_TRENDS, MOTIVATION_BY_GRADE, MOTIVATION_SIGNALS,
} from '../data'
import { Hero } from './Hero'
import { StatCard, ChartCard, CardNote } from './Cards'
import { BarList } from './BarList'
import { ChartLegend } from './charts'
import { TrendChart } from './TrendChart'
import { SECTIONS } from './ReadingHealth'
import { RMI_ICONS } from './RmiIcons'

const ACCENT = '#E8866A'
const EXTRINSIC_COLOR = '#7CB5F5'
const MOT_ICON = SECTIONS.find(s => s.key === 'motivation')?.icon

const factorToItem = f => ({
  icon:       RMI_ICONS[f.iconKey],
  iconColor:  f.color,
  label:      f.name,
  tooltip:    f.desc,
  value:      f.score,
  max:        f.max,
  color:      f.color,
  valueLabel: String(f.score),
})

export function DistrictMotivation() {
  const ranked = [...SCHOOLS]
    .map(s => ({ id: s.id, name: s.name.split(' ')[0], rmi: SCHOOL_HEALTH[s.id].motivation, color: s.color }))
    .sort((a, b) => b.rmi - a.rmi)

  const intrinsicFactors = RMI_FACTORS.filter(f => f.kind === 'intrinsic')
  const extrinsicFactors = RMI_FACTORS.filter(f => f.kind === 'extrinsic')
  const FACTOR_BY_NAME   = Object.fromEntries(RMI_FACTORS.map(f => [f.name, f]))
  const improvingCount   = SCHOOLS.filter(s => SCHOOL_HEALTH[s.id].dM > 0).length
  const topSchool        = ranked[0]
  const bottomSchool     = ranked[ranked.length - 1]

  return (
    <div className="rc-page" style={{ '--rc-accent': ACCENT }}>
      <Hero bucket="motivation" />

      <div className="rc-stats-row">
        <StatCard
          value={DISTRICT_HEALTH.motivation}
          label="District avg RMI"
          footer={`↑${DISTRICT_HEALTH.dM} pts since Sep 2024`}
        />
        <StatCard
          value={improvingCount}
          unit="of 6"
          label="Participating Schools"
          color="#16A97A"
        />
        <StatCard
          value={topSchool.rmi}
          label="Highest RMI Score"
          color={topSchool.color}
        />
        <StatCard
          value={bottomSchool.rmi}
          label="Lowest RMI Score"
          color={ACCENT}
        />
      </div>

      <div className="sv-grid">

        {/* Intrinsic vs Extrinsic shift — full width */}
        <ChartCard
          title="Intrinsic vs. Extrinsic Motivation — District Trend"
          subtitle="District-wide RMI subscores out of 20 · Sep 2024 – May 2025"
          icon={MOT_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
          footer={
            <ChartLegend items={[
              { color: ACCENT,          label: 'Intrinsic' },
              { color: EXTRINSIC_COLOR, label: 'Extrinsic', dashed: true },
            ]} />
          }
        >
          <TrendChart
            type="area"
            data={INTRINSIC_EXTRINSIC_TRENDS}
            yDomain={[9, 16]}
            yTickCount={5}
            height="md"
            tooltipFormatter={(v, name) => [`${v.toFixed(1)} /20`, name]}
            series={[
              { key: 'intrinsic', name: 'Intrinsic', color: ACCENT,          fillOpacity: 0.25 },
              { key: 'extrinsic', name: 'Extrinsic', color: EXTRINSIC_COLOR, fillOpacity: 0.15, dashed: true },
            ]}
          />
          <CardNote tone="accent">
            Students' intrinsic reading subscore rose from <strong>12.1</strong> to <strong>14.2 /20</strong> over the school year — reflecting sustained growth in self-motivated, independent reading. The extrinsic score remains stable at <strong>11.8 /20</strong>, meaning intrinsic motivation is outpacing external drivers.
          </CardNote>
        </ChartCard>

        {/* RMI Factor Breakdown */}
        <ChartCard
          title="RMI Factor Breakdown"
          subtitle="All 10 RMI factors · scored 1–4"
          icon={MOT_ICON}
          accent={ACCENT}
          bodyPad="padded"
        >
          <BarList
            groups={[
              { label: 'Intrinsic', labelColor: ACCENT,          items: intrinsicFactors.map(factorToItem) },
              { label: 'Extrinsic', labelColor: EXTRINSIC_COLOR, items: extrinsicFactors.map(factorToItem) },
            ]}
          />
        </ChartCard>

        {/* Motivation signals */}
        <ChartCard
          title="Additional Motivation Signals"
          subtitle="% of students exhibiting each self-directed reading behavior · current year"
          icon={MOT_ICON}
          accent={ACCENT}
          bodyPad="padded"
        >
          <BarList
            divided
            items={MOTIVATION_SIGNALS.map(s => ({
              label:      s.signal,
              tooltip:    `${s.factor} factor`,
              value:      s.pct,
              max:        100,
              color:      ACCENT,
              valueLabel: `${s.pct}% of students`,
            }))}
          />
          <CardNote tone="neutral">
            These signals are derived from reading log timestamps, challenge calendars, and book selection metadata. No survey data required.
          </CardNote>
        </ChartCard>

        {/* Grade band breakdown */}
        <ChartCard
          title="Intrinsic vs. Extrinsic by Grade Band"
          subtitle="RMI subscores out of 20 · older students show stronger intrinsic reading identity"
          icon={MOT_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
        >
          <BarList
            showBar={false}
            divided
            header={{ label: 'Top factor by grade', valueLabel: 'Score' }}
            items={MOTIVATION_BY_GRADE.map(g => {
              const factor = FACTOR_BY_NAME[g.topFactor]
              if (!factor) return null
              const score = factor.kind === 'intrinsic' ? g.intrinsic : g.extrinsic
              return {
                prefix:     g.band,
                icon:       RMI_ICONS[factor.iconKey],
                iconColor:  factor.color,
                label:      factor.name,
                labelColor: factor.color,
                valueLabel: score.toFixed(1),
              }
            }).filter(Boolean)}
          />
        </ChartCard>

        {/* RMI trend — full width */}
        <ChartCard
          title="Reading Motivation Index — district trend"
          subtitle="District average vs. individual schools · Sep 2024 – May 2025"
          icon={MOT_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
          footer={
            <ChartLegend items={[
              { color: ACCENT, label: 'District avg' },
              ...SCHOOLS.map(s => ({ color: s.color, label: s.name.split(' ')[0], dashed: true })),
            ]} />
          }
        >
          <TrendChart
            type="area"
            data={RMI_TRENDS}
            yDomain={[55, 90]}
            height="lg"
            series={[
              { key: 'district', name: 'District avg', color: ACCENT, fillOpacity: 0.2 },
              ...SCHOOLS.map(s => ({ key: s.id, name: s.name.split(' ')[0], color: s.color, dashed: true, fillOpacity: 0, strokeWidth: 1.2 })),
            ]}
          />
        </ChartCard>

        {/* Schools ranked by RMI */}
        <ChartCard
          title="Schools ranked by Motivation score"
          subtitle="RMI score (0–100) · current year average"
          icon={MOT_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
        >
          <BarList
            labelWidth={120}
            header={{ label: 'School', valueLabel: 'RMI score' }}
            items={ranked.map(s => ({
              label:      s.name,
              value:      s.rmi,
              max:        100,
              color:      s.color,
              valueLabel: String(s.rmi),
            }))}
          />
        </ChartCard>

      </div>
    </div>
  )
}
