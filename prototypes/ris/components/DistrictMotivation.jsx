import {
  RMI_TOTAL_TRENDS,
  RMI_TOTAL_BY_SCHOOL,
  SCHOOLS,
  DISTRICT_RMI,
  RMI_FACTORS,
  INTRINSIC_EXTRINSIC_TRENDS,
  MOTIVATION_BY_GRADE,
  MOTIVATION_BY_GENDER,
  MOTIVATION_SIGNALS,
} from '../data'
import { Hero } from '@components/Hero/Hero'
import { StatCard, ChartCard, CardNote } from '@components/Cards/Cards'
import { BarList } from '@components/BarList/BarList'
import { ChartLegend } from '@components/charts/charts'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { SECTIONS } from '@components/ReadingHealth/ReadingHealth'
import { RMI_ICONS } from '@components/RmiIcons/RmiIcons'

const ACCENT = '#E8866A'
const EXTRINSIC_COLOR = '#7CB5F5'
const MOT_ICON = SECTIONS.find((s) => s.key === 'motivation')?.icon

// RMI bars are shown against a 0–30 reference even though the index tops out at
// 40 — district scores live in the high teens to mid-20s, so this keeps the
// bars readable without exaggerating.
const RMI_BAR_MAX = 30

const factorToItem = (f) => ({
  icon: RMI_ICONS[f.iconKey],
  iconColor: f.color,
  label: f.name,
  tooltip: f.desc,
  value: f.score,
  max: f.max,
  color: f.color,
  valueLabel: String(f.score),
})

export function DistrictMotivation() {
  const ranked = RMI_TOTAL_BY_SCHOOL
  const topSchool = ranked[0]
  const bottomSchool = ranked[ranked.length - 1]

  const first = RMI_TOTAL_TRENDS[0]
  const last = RMI_TOTAL_TRENDS[RMI_TOTAL_TRENDS.length - 1]
  const improvingCount = SCHOOLS.filter((s) => last[s.id] > first[s.id]).length

  const intrinsicFactors = RMI_FACTORS.filter((f) => f.kind === 'intrinsic')
  const extrinsicFactors = RMI_FACTORS.filter((f) => f.kind === 'extrinsic')
  const FACTOR_BY_NAME = Object.fromEntries(RMI_FACTORS.map((f) => [f.name, f]))

  return (
    <div className="rc-page" style={{ '--rc-accent': ACCENT }}>
      <Hero bucket="motivation" />

      <div className="rc-stats-row">
        <StatCard
          value={DISTRICT_RMI.value.toFixed(1)}
          unit="/40"
          label="District avg RMI total"
          footer={`↑${DISTRICT_RMI.delta} vs last month`}
        />
        <StatCard value={improvingCount} unit="of 6" label="Schools improving" color="#16A97A" />
        <StatCard
          value={topSchool.rmi.toFixed(1)}
          label="Highest RMI total"
          color={topSchool.color}
        />
        <StatCard value={bottomSchool.rmi.toFixed(1)} label="Lowest RMI total" color={ACCENT} />
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
            <ChartLegend
              items={[
                { color: ACCENT, label: 'Intrinsic' },
                { color: EXTRINSIC_COLOR, label: 'Extrinsic', dashed: true },
              ]}
            />
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
              { key: 'intrinsic', name: 'Intrinsic', color: ACCENT, fillOpacity: 0.25 },
              {
                key: 'extrinsic',
                name: 'Extrinsic',
                color: EXTRINSIC_COLOR,
                fillOpacity: 0.15,
                dashed: true,
              },
            ]}
          />
          <CardNote tone="accent">
            Students' intrinsic reading subscore rose from <strong>12.1</strong> to{' '}
            <strong>14.2 /20</strong> over the school year — reflecting sustained growth in
            self-motivated, independent reading. The extrinsic score remains stable at{' '}
            <strong>11.8 /20</strong>, meaning intrinsic motivation is outpacing external drivers.
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
              { label: 'Intrinsic', labelColor: ACCENT, items: intrinsicFactors.map(factorToItem) },
              {
                label: 'Extrinsic',
                labelColor: EXTRINSIC_COLOR,
                items: extrinsicFactors.map(factorToItem),
              },
            ]}
          />
        </ChartCard>

        {/* Grade band breakdown */}
        <ChartCard
          title="Intrinsic vs. Extrinsic by Grade Band"
          subtitle="Older students show a stronger intrinsic reading identity"
          icon={MOT_ICON}
          accent={ACCENT}
          bodyPad="padded"
        >
          <BarList
            showBar={false}
            divided
            header={{ label: 'Top factor by grade', valueLabel: 'Score' }}
            items={MOTIVATION_BY_GRADE.map((g) => {
              const factor = FACTOR_BY_NAME[g.topFactor]
              if (!factor) return null
              const score = factor.kind === 'intrinsic' ? g.intrinsic : g.extrinsic
              return {
                prefix: g.band,
                icon: RMI_ICONS[factor.iconKey],
                iconColor: factor.color,
                label: factor.name,
                labelColor: factor.color,
                valueLabel: score.toFixed(1),
              }
            }).filter(Boolean)}
          />
        </ChartCard>

        {/* Motivation signals — full width so the long behavior labels breathe */}
        <ChartCard
          title="Additional Motivation Signals"
          subtitle="% of students exhibiting each self-directed reading behavior · current year"
          icon={MOT_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
        >
          <BarList
            divided
            items={MOTIVATION_SIGNALS.map((s) => ({
              label: s.signal,
              tooltip: `${s.factor} factor`,
              value: s.pct,
              max: 100,
              color: ACCENT,
              valueLabel: `${s.pct}% of students`,
            }))}
          />
          <CardNote tone="neutral">
            These signals are derived from reading log timestamps, challenge calendars, and book
            selection metadata. No survey data required.
          </CardNote>
        </ChartCard>

        {/* Example: RMI broken down by gender — full width */}
        <ChartCard
          title="RMI by Gender — Example Demographic Cut"
          subtitle="Avg RMI total (0–40) · one illustrative way to slice motivation data"
          icon={MOT_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
        >
          <BarList
            labelWidth={160}
            header={{ label: 'Gender', valueLabel: 'RMI total' }}
            items={MOTIVATION_BY_GENDER.map((g) => ({
              label: g.gender,
              tooltip: `Top factor: ${g.topFactor}`,
              value: g.rmi,
              max: RMI_BAR_MAX,
              color: ACCENT,
              valueLabel: g.rmi.toFixed(1),
            }))}
          />
          <CardNote tone="neutral">
            Breaking RMI down by gender (or grade, school, or program) can surface motivation gaps
            to target. Here, boys' intrinsic motivation trails girls' by ~1.8 points — worth pairing
            with reading-diet and choice data before acting.
          </CardNote>
        </ChartCard>

        {/* RMI trend — full width */}
        <ChartCard
          title="Reading Motivation Index — district trend"
          subtitle="RMI total (0–40) · district average vs. individual schools · Sep 2024 – May 2025"
          icon={MOT_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
          footer={
            <ChartLegend
              items={[
                { color: ACCENT, label: 'District avg' },
                ...SCHOOLS.map((s) => ({
                  color: s.color,
                  label: s.name.split(' ')[0],
                  dashed: true,
                })),
              ]}
            />
          }
        >
          <TrendChart
            type="area"
            data={RMI_TOTAL_TRENDS}
            yDomain={[14, 28]}
            height="lg"
            tooltipFormatter={(v) => v.toFixed(1)}
            series={[
              { key: 'district', name: 'District avg', color: ACCENT, fillOpacity: 0.2 },
              ...SCHOOLS.map((s) => ({
                key: s.id,
                name: s.name.split(' ')[0],
                color: s.color,
                dashed: true,
                fillOpacity: 0,
                strokeWidth: 1.2,
              })),
            ]}
          />
        </ChartCard>

        {/* Schools ranked by RMI */}
        <ChartCard
          title="Schools ranked by Motivation score"
          subtitle="RMI total (0–40) · current year average"
          icon={MOT_ICON}
          accent={ACCENT}
          bodyPad="padded"
          span={2}
        >
          <BarList
            labelWidth={120}
            header={{ label: 'School', valueLabel: 'RMI total' }}
            items={ranked.map((s) => ({
              label: s.shortName,
              value: s.rmi,
              max: RMI_BAR_MAX,
              color: s.color,
              valueLabel: s.rmi.toFixed(1),
            }))}
          />
        </ChartCard>
      </div>
    </div>
  )
}
