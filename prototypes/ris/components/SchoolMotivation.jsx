import { ResponsiveLine } from '@nivo/line'
import {
  SCHOOLS,
  RMI_TRENDS,
  SCHOOL_HEALTH,
  RMI_FACTORS,
  INTRINSIC_EXTRINSIC_TRENDS,
  MOTIVATION_BY_GRADE,
} from '../data'
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
import { StatCard, ChartCard, CardNote } from '@components/Cards/Cards'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { BarList } from '@components/BarList/BarList'
import { RMI_ICONS } from '@components/RmiIcons/RmiIcons'
import { TrendChart } from '@components/TrendChart/TrendChart'

const INTRINSIC_COLOR = '#E8866A'
const EXTRINSIC_COLOR = '#7CB5F5'
const MOT_ICON = SECTIONS.find((s) => s.key === 'motivation')?.icon
const FACTOR_BY_NAME = Object.fromEntries(RMI_FACTORS.map((f) => [f.name, f]))

export function SchoolMotivation({ schoolId, onBack }) {
  const school = SCHOOLS.find((s) => s.id === schoolId)
  const health = SCHOOL_HEALTH[schoolId]
  const shortName = school.name.split(' ')[0]
  const trend = RMI_TRENDS.map((d) => ({
    month: d.month,
    school: d[schoolId],
    district: d.district,
  }))
  const districtNow = RMI_TRENDS[RMI_TRENDS.length - 1].district

  const intrinsicFactors = RMI_FACTORS.filter((f) => f.kind === 'intrinsic')
  const extrinsicFactors = RMI_FACTORS.filter((f) => f.kind === 'extrinsic')
  const latestTrend = INTRINSIC_EXTRINSIC_TRENDS[INTRINSIC_EXTRINSIC_TRENDS.length - 1]

  const rmiNivo = [
    { id: shortName, color: school.color, data: trend.map((d) => ({ x: d.month, y: d.school })) },
    {
      id: 'District avg',
      color: '#CBD5E1',
      data: trend.map((d) => ({ x: d.month, y: d.district })),
    },
  ]

  return (
    <div className="mot-root">
      <Hero bucket="motivation" />

      <div className="rc-stats-row" style={{ '--rc-stats-cols': 3 }}>
        <StatCard
          value={(latestTrend.intrinsic + latestTrend.extrinsic).toFixed(1)}
          unit="/40"
          label="Combined RMI Score"
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
          footer={
            <ChartLegend
              items={[
                { color: school.color, label: shortName },
                { color: '#CBD5E1', label: `District avg (${districtNow})`, dashed: true },
              ]}
            />
          }
        >
          <div style={{ flex: 1, minHeight: 240 }}>
            <ResponsiveLine
              data={rmiNivo}
              theme={NIVO_THEME}
              margin={LINE_MARGIN}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 55, max: 90 }}
              curve="monotoneX"
              colors={(d) => d.color}
              lineWidth={2.5}
              enablePoints={false}
              enableArea
              areaOpacity={0.08}
              enableGridX={false}
              axisBottom={AXIS_BOTTOM}
              axisLeft={{ ...AXIS_LEFT, tickValues: [60, 70, 80, 90] }}
              defs={[
                {
                  id: 'smotGrad',
                  type: 'linearGradient',
                  colors: [
                    { offset: 0, color: school.color, opacity: 0.22 },
                    { offset: 100, color: school.color, opacity: 0 },
                  ],
                },
              ]}
              fill={[{ match: { id: shortName }, id: 'smotGrad' }]}
              enableSlices="x"
              sliceTooltip={({ slice }) => (
                <SliceTooltip
                  slice={slice}
                  accent={school.color}
                  allData={trend}
                  seriesMap={{ [shortName]: 'school', 'District avg': 'district' }}
                  formatDelta={(d) => `${d > 0 ? '+' : ''}${d} pts`}
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
                        {gap} pts {gap > 0 ? 'above' : 'below'} district
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
          title="Intrinsic vs. Extrinsic Motivation Trend"
          subtitle="RMI subscores out of 20 · Sep 2024 – May 2025"
          icon={MOT_ICON}
          accent={INTRINSIC_COLOR}
          footer={
            <ChartLegend
              items={[
                { color: INTRINSIC_COLOR, label: 'Intrinsic' },
                { color: '#CBD5E1', label: 'Extrinsic' },
              ]}
            />
          }
        >
          <TrendChart
            type="bar"
            data={INTRINSIC_EXTRINSIC_TRENDS}
            yDomain={[9, 16]}
            yTicks={[9, 11, 13, 15]}
            height="md"
            tooltipFormatter={(v, name) => [`${v.toFixed(1)} /20`, name]}
            xPadding={{ left: 12, right: 12 }}
            series={[
              { key: 'intrinsic', name: 'Intrinsic', color: INTRINSIC_COLOR },
              { key: 'extrinsic', name: 'Extrinsic', color: '#CBD5E1' },
            ]}
          />
          <CardNote tone="accent">
            Students' intrinsic reading subscore rose from <strong>12.1</strong> to{' '}
            <strong>14.2 /20</strong> over the school year — reflecting sustained growth in
            self-motivated, independent reading. The extrinsic score remains stable at{' '}
            <strong>11.8 /20</strong>, meaning intrinsic motivation is outpacing external drivers.
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
          <BarList
            layout="columns"
            groups={[
              {
                label: 'Intrinsic',
                labelColor: '#E8866A',
                items: intrinsicFactors.map((f) => ({
                  icon: RMI_ICONS[f.iconKey],
                  iconColor: f.color,
                  label: f.name,
                  sublabel: f.desc,
                  value: f.score,
                  max: f.max,
                  color: f.color,
                  valueLabel: String(f.score),
                  delta: f.delta,
                })),
              },
              {
                label: 'Extrinsic',
                labelColor: '#7CB5F5',
                items: extrinsicFactors.map((f) => ({
                  icon: RMI_ICONS[f.iconKey],
                  iconColor: f.color,
                  label: f.name,
                  sublabel: f.desc,
                  value: f.score,
                  max: f.max,
                  color: f.color,
                  valueLabel: String(f.score),
                  delta: f.delta,
                })),
              },
            ]}
          />
        </ChartCard>

        <ChartCard
          title="Intrinsic vs. Extrinsic by Grade Band"
          subtitle="RMI subscores out of 20"
          icon={MOT_ICON}
          accent={INTRINSIC_COLOR}
          bodyPad="padded"
          footer={
            <ChartLegend
              items={[
                { color: INTRINSIC_COLOR, label: 'Intrinsic' },
                { color: EXTRINSIC_COLOR, label: 'Extrinsic' },
              ]}
            />
          }
        >
          <BarList
            layout="columns"
            groups={MOTIVATION_BY_GRADE.map((g) => ({
              label: `Grade ${g.band}`,
              labelColor: '#475569',
              items: [
                {
                  label: 'Intrinsic',
                  labelColor: INTRINSIC_COLOR,
                  value: g.intrinsic,
                  max: 20,
                  color: INTRINSIC_COLOR,
                  valueLabel: g.intrinsic.toFixed(1),
                },
                {
                  label: 'Extrinsic',
                  labelColor: EXTRINSIC_COLOR,
                  value: g.extrinsic,
                  max: 20,
                  color: EXTRINSIC_COLOR,
                  valueLabel: g.extrinsic.toFixed(1),
                },
              ],
            }))}
          />
        </ChartCard>

        <ChartCard
          title="Top Motivation Factor by Grade Band"
          subtitle="What drives readers most at each level"
          icon={MOT_ICON}
          accent={INTRINSIC_COLOR}
          bodyPad="padded"
        >
          <BarList
            showBar={false}
            items={MOTIVATION_BY_GRADE.map((g) => {
              const factor = FACTOR_BY_NAME[g.topFactor]
              if (!factor) return null
              return {
                prefix: g.band,
                icon: RMI_ICONS[factor.iconKey],
                iconColor: factor.color,
                label: factor.name,
                labelColor: factor.color,
                sublabel: factor.desc,
              }
            }).filter(Boolean)}
          />
        </ChartCard>
      </div>
    </div>
  )
}
