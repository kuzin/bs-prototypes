import { ResponsiveLine } from '@nivo/line'
import {
  SCHOOLS,
  SCHOOL_STATS,
  SCHOOL_DETAILS,
  SCHOOL_HEALTH,
  RMI_TRENDS,
  ROI_TRENDS,
  GRADE_PERFORMANCE,
  SCHOOL_GRADE_LEVELS,
  LEXILE_BY_GRADE,
} from '../data'
import { Hero } from '@components/Hero/Hero'
import {
  NIVO_THEME,
  LINE_MARGIN,
  AXIS_BOTTOM,
  AXIS_LEFT,
  SliceTooltip,
  ChartLegend,
} from '@components/charts/charts'
import { StatCard, ChartCard } from '@components/Cards/Cards'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { BarList } from '@components/BarList/BarList'
import { Funnel } from '@components/Funnel/Funnel'
import { TrendChart } from '@components/TrendChart/TrendChart'
import './SchoolAnalytics.css'

const ANALYTICS_COLOR = '#0DA7BC'

const AnalyticsIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="3" height="6" rx="1" />
    <rect x="8.5" y="7" width="3" height="10" rx="1" />
    <rect x="14" y="3" width="3" height="14" rx="1" />
  </svg>
)

// Per-school student engagement funnel — scales district shape to the school's roster
// and skews depth by the school's overall engagement rate (so weak schools have steeper drop-off).
function buildSchoolFunnel(school, stats) {
  const enrolled = school.students
  const engagement = stats.engagement / 100
  const depth = 0.6 + engagement * 0.5
  const pcts = [
    100,
    Math.round(engagement * 100),
    Math.round(engagement * 70 * depth),
    Math.round(engagement * 32 * depth),
    Math.round(engagement * 18 * depth),
  ]
  const stages = [
    { stage: 'Enrolled Students', note: 'Active roster in Beanstack' },
    { stage: 'Logged This Month', note: 'At least 1 log in May 2025' },
    { stage: 'Logged This Week', note: '1+ log every week for 4+ weeks' },
    { stage: 'Logged Yesterday', note: '5+ days logged per week' },
    { stage: 'Has A Current Streak', note: 'Unbroken streak ≥ 30 days' },
  ]
  const deltas = [null, +4, +6, +3, +2]
  return stages.map((s, i) => ({
    ...s,
    pct: pcts[i],
    count: Math.round((enrolled * pcts[i]) / 100),
    delta: deltas[i],
  }))
}

function buildEngagementDistribution(school, stats) {
  const total = school.students
  const engagedPct = stats.engagement
  const weeklyPct = Math.round(engagedPct * 0.7)
  const dailyPct = Math.round(engagedPct * 0.32)
  const inactive = 100 - engagedPct
  return [
    {
      tier: 'Inactive',
      pct: inactive,
      count: Math.round((total * inactive) / 100),
      color: '#E2E8F0',
      desc: 'No log in 14+ days',
    },
    {
      tier: 'Light reader',
      pct: engagedPct - weeklyPct,
      count: Math.round((total * (engagedPct - weeklyPct)) / 100),
      color: '#FDE68A',
      desc: '1–2 logs/week',
    },
    {
      tier: 'Weekly habit',
      pct: weeklyPct - dailyPct,
      count: Math.round((total * (weeklyPct - dailyPct)) / 100),
      color: '#7CB5F5',
      desc: '3–4 logs/week',
    },
    {
      tier: 'Daily habit',
      pct: dailyPct,
      count: Math.round((total * dailyPct) / 100),
      color: '#0DA7BC',
      desc: '5+ logs/week',
    },
  ]
}

export function SchoolAnalytics({ schoolId }) {
  const school = SCHOOLS.find((s) => s.id === schoolId)
  const stats = SCHOOL_STATS.find((s) => s.id === schoolId)
  const health = SCHOOL_HEALTH[schoolId]
  const shortName = school.name.split(' ')[0]

  const funnel = buildSchoolFunnel(school, stats)
  const distribution = buildEngagementDistribution(school, stats)

  const rmiData = RMI_TRENDS.map((d) => ({
    month: d.month,
    school: d[schoolId],
    district: d.district,
  }))

  const gradeIdxs = SCHOOL_GRADE_LEVELS[schoolId]
  const gradeNames = gradeIdxs.map((i) => LEXILE_BY_GRADE[i].grade.replace(/(st|nd|rd|th)/, ''))
  const schoolGrades = GRADE_PERFORMANCE.filter((g) => gradeNames.includes(g.grade))

  const rmiNivo = [
    { id: shortName, color: school.color, data: rmiData.map((d) => ({ x: d.month, y: d.school })) },
    {
      id: 'District avg',
      color: '#CBD5E1',
      data: rmiData.map((d) => ({ x: d.month, y: d.district })),
    },
  ]

  const roiNivo = [
    {
      id: 'Engagement %',
      color: school.color,
      data: ROI_TRENDS.map((d) => ({ x: d.month, y: d.engagement })),
    },
    {
      id: 'Attendance %',
      color: '#16A97A',
      data: ROI_TRENDS.map((d) => ({ x: d.month, y: d.attendance })),
    },
    {
      id: 'Incidents',
      color: '#E8866A',
      data: ROI_TRENDS.map((d) => ({ x: d.month, y: d.incidents })),
    },
  ]

  return (
    <div className="an-root">
      <Hero
        icon={<AnalyticsIcon />}
        title="Analytics"
        subtitle={`Student engagement, reading behavior, and outcome correlations · ${school.name}`}
        accent={school.color}
        accentBg="#ECFEFF"
      />

      <div className="rc-stats-row">
        <StatCard
          value={stats.engagement}
          unit="%"
          label="Active students"
          footer={`${Math.round((school.students * stats.engagement) / 100).toLocaleString()} of ${school.students.toLocaleString()}`}
        />
        <StatCard
          value={stats.avgSession}
          unit="min"
          label="Avg session length"
          footer="Per active student"
        />
        <StatCard
          value={stats.streakPct}
          unit="%"
          label="Weekly habit rate"
          footer="Logged 4+ weeks running"
        />
        <StatCard
          value={health.motivation}
          label="RMI score"
          footer={`+${health.dM} pts vs. Sep`}
          color="#16A97A"
          footerColor="#16A34A"
        />
      </div>

      <div className="sv-grid">
        <ChartCard
          span={2}
          title="Student Engagement Funnel"
          subtitle={`Habit depth across all ${school.students.toLocaleString()} students · May 2025`}
          icon={<AnalyticsIcon />}
          accent={ANALYTICS_COLOR}
          bodyPad="padded"
        >
          <Funnel
            accent={school.color}
            dropoffLabel="students not yet forming next habit"
            items={funnel}
          />
        </ChartCard>

        <ChartCard
          title="Student Engagement Tiers"
          subtitle={`Where ${school.students.toLocaleString()} students fall on the activity spectrum`}
          icon={<AnalyticsIcon />}
          accent={ANALYTICS_COLOR}
          bodyPad="padded"
        >
          <BarList
            items={distribution.map((t) => ({
              label: t.tier,
              sublabel: t.desc,
              value: t.pct,
              color: t.color,
              valueLabel: `${t.pct}%`,
              subValue: t.count.toLocaleString(),
            }))}
            labelWidth={130}
          />
        </ChartCard>

        <ChartCard
          title="RMI Trend vs. District"
          subtitle="Reading Motivation Index, Sep – May"
          icon={<AnalyticsIcon />}
          accent={ANALYTICS_COLOR}
          footer={
            <ChartLegend
              items={[
                { color: school.color, label: shortName },
                { color: '#CBD5E1', label: 'District avg', dashed: true },
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
              enableGridX={false}
              axisBottom={AXIS_BOTTOM}
              axisLeft={{ ...AXIS_LEFT, tickValues: [60, 70, 80, 90] }}
              enableSlices="x"
              sliceTooltip={({ slice }) => (
                <SliceTooltip
                  slice={slice}
                  accent={ANALYTICS_COLOR}
                  allData={rmiData}
                  seriesMap={{ [shortName]: 'school', 'District avg': 'district' }}
                  formatDelta={(d) => `${d > 0 ? '+' : ''}${d} pts`}
                />
              )}
            />
          </div>
        </ChartCard>

        <ChartCard
          span={2}
          title="Engagement by Grade Level"
          subtitle={`Active student % & RMI score across grades served by ${school.name}`}
          icon={<AnalyticsIcon />}
          accent={ANALYTICS_COLOR}
          footer={
            <ChartLegend
              items={[
                { color: school.color, label: 'Active %' },
                { color: '#94A3B8', label: 'RMI' },
              ]}
            />
          }
        >
          <TrendChart
            type="bar"
            data={schoolGrades}
            xKey="grade"
            yDomain={[40, 90]}
            yTicks={[40, 60, 80, 100]}
            height="md"
            xPadding={{ left: 12, right: 12 }}
            series={[
              { key: 'engagement', name: 'Active %', color: school.color },
              { key: 'rmi', name: 'RMI score', color: '#94A3B8' },
            ]}
          />
        </ChartCard>

        <ChartCard
          span={2}
          title="Engagement → Outcome Correlations"
          subtitle="Reading engagement vs. attendance & behavioral incidents · Sep 2024 – May 2025"
          icon={<AnalyticsIcon />}
          accent={ANALYTICS_COLOR}
          action={<span className="an-sis-badge">Requires SIS data</span>}
          footer={
            <ChartLegend
              items={[
                { color: school.color, label: 'Engagement %' },
                { color: '#16A97A', label: 'Attendance %', dashed: true },
                { color: '#E8866A', label: 'Incidents', dashed: true },
              ]}
            />
          }
        >
          <div style={{ flex: 1, minHeight: 240 }}>
            <ResponsiveLine
              data={roiNivo}
              theme={NIVO_THEME}
              margin={LINE_MARGIN}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 20, max: 100 }}
              curve="monotoneX"
              colors={(d) => d.color}
              lineWidth={2.2}
              enablePoints={false}
              enableGridX={false}
              axisBottom={AXIS_BOTTOM}
              axisLeft={AXIS_LEFT}
              enableSlices="x"
              sliceTooltip={({ slice }) => (
                <SliceTooltip
                  slice={slice}
                  accent={ANALYTICS_COLOR}
                  allData={ROI_TRENDS}
                  seriesMap={{
                    'Engagement %': 'engagement',
                    'Attendance %': 'attendance',
                    Incidents: 'incidents',
                  }}
                  inverseSeries={['Incidents']}
                />
              )}
            />
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
