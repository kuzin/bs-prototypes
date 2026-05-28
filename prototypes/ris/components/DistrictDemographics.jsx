import { SCHOOL_STATS, GRADE_PERFORMANCE } from '../data'
import { Hero } from '@components/Hero/Hero'
import { StatCard, ChartCard, CardNote } from '@components/Cards/Cards'
import { Table } from '@components/Table/Table'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { BarList } from '@components/BarList/BarList'
import { SchoolCell } from './SchoolCell'
import { ChartLegend } from '@components/charts/charts'
import { TrendChart } from '@components/TrendChart/TrendChart'

const ACCENT = '#7C3AED'
const T1_COLOR = '#E8866A'
const N1_COLOR = '#0DA7BC'

const DEMOGRAPHICS_ICON = (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="10" cy="6" r="2.5" />
    <circle cx="4" cy="9" r="2" />
    <circle cx="16" cy="9" r="2" />
    <path d="M6 17c0-2.2 1.8-4 4-4s4 1.8 4 4" />
    <path d="M1 17c0-1.7 1.3-3 3-3" />
    <path d="M19 17c0-1.7-1.3-3-3-3" />
  </svg>
)

const TITLE_I_IDS = ['lincoln', 'roosevelt', 'washington']

function buildTitleIData() {
  const avgField = (arr, field) => Math.round(arr.reduce((s, x) => s + x[field], 0) / arr.length)
  const t1 = SCHOOL_STATS.filter((s) => TITLE_I_IDS.includes(s.id))
  const n1 = SCHOOL_STATS.filter((s) => !TITLE_I_IDS.includes(s.id))
  return [
    { metric: 'RMI Score', max: 100, titleI: avgField(t1, 'rmi'), nonTitleI: avgField(n1, 'rmi') },
    {
      metric: 'Engagement %',
      max: 100,
      titleI: avgField(t1, 'engagement'),
      nonTitleI: avgField(n1, 'engagement'),
    },
    {
      metric: 'Session (min)',
      max: 30,
      titleI: avgField(t1, 'avgSession'),
      nonTitleI: avgField(n1, 'avgSession'),
    },
    {
      metric: 'Streak Rate %',
      max: 100,
      titleI: avgField(t1, 'streakPct'),
      nonTitleI: avgField(n1, 'streakPct'),
    },
    {
      metric: 'Lexile Growth (L)',
      max: 120,
      titleI: avgField(t1, 'lexileGrowth'),
      nonTitleI: avgField(n1, 'lexileGrowth'),
    },
  ]
}

const EQUITY_ROWS = [
  {
    id: 'adams',
    name: 'Adams High',
    rmi: 83,
    frl: 18,
    titleI: false,
    engagement: 84,
    lexileGrowth: 112,
  },
  {
    id: 'jefferson',
    name: 'Jefferson El.',
    rmi: 80,
    frl: 18,
    titleI: false,
    engagement: 81,
    lexileGrowth: 62,
  },
  {
    id: 'kennedy',
    name: 'Kennedy K-8',
    rmi: 77,
    frl: 31,
    titleI: false,
    engagement: 72,
    lexileGrowth: 74,
  },
  {
    id: 'roosevelt',
    name: 'Roosevelt Mid.',
    rmi: 74,
    frl: 52,
    titleI: true,
    engagement: 74,
    lexileGrowth: 88,
  },
  {
    id: 'lincoln',
    name: 'Lincoln El.',
    rmi: 71,
    frl: 61,
    titleI: true,
    engagement: 63,
    lexileGrowth: 8,
  },
  {
    id: 'washington',
    name: 'Washington Mid.',
    rmi: 62,
    frl: 68,
    titleI: true,
    engagement: 51,
    lexileGrowth: 22,
  },
]

function rmiColor(rmi) {
  if (rmi >= 78) return '#0DA7BC'
  if (rmi >= 70) return '#D97706'
  return '#E8866A'
}

const ACTIONS = [
  {
    school: 'Washington Middle',
    frl: 68,
    priority: 'critical',
    action:
      'Engagement recovery plan — 39% decline in grades 7–8. Consider a targeted re-engagement challenge or a coach-led check-in with the site reading coordinator.',
  },
  {
    school: 'Lincoln Elementary',
    frl: 61,
    priority: 'critical',
    action:
      'Curriculum review for 3rd–5th grade text complexity. Students show high engagement (94%) but zero Lexile growth — likely a material complexity mismatch, not a motivation issue.',
  },
  {
    school: 'Roosevelt Middle',
    frl: 52,
    priority: 'warning',
    action:
      'Monitor Book Talks flag rate, which has risen 4pp this month. Educator review of flagged conversations recommended to determine if intervention is needed.',
  },
]

const EQUITY_COLUMNS = [
  { key: 'name', label: 'School', render: (_, r) => <SchoolCell id={r.id} name={r.name} /> },
  {
    key: 'rmi',
    label: 'RMI',
    align: 'right',
    render: (v) => <span style={{ color: rmiColor(v), fontWeight: 800 }}>{v}</span>,
  },
  {
    key: 'rmiBar',
    label: 'Reading Health Index',
    render: (_, r) => <ProgressBar value={r.rmi} max={100} color={rmiColor(r.rmi)} size="sm" />,
  },
  { key: 'engagement', label: 'Engagement', align: 'right', render: (v) => `${v}%` },
  {
    key: 'lexileGrowth',
    label: 'Lexile Δ',
    align: 'right',
    render: (v) => (v > 0 ? `+${v}L` : `${v}L`),
  },
  {
    key: 'frl',
    label: 'FRL %',
    align: 'center',
    render: (v) => (
      <Pill color={v >= 50 ? '#DC2626' : v >= 30 ? '#D97706' : '#475569'} variant="soft" size="sm">
        {v}%
      </Pill>
    ),
  },
  {
    key: 'titleI',
    label: 'Title I',
    align: 'center',
    render: (v) =>
      v ? (
        <Pill color="#1D4ED8" variant="soft" size="sm">
          Title I
        </Pill>
      ) : (
        <span style={{ color: '#CBD5E1' }}>—</span>
      ),
  },
]

const ACTION_COLUMNS = [
  {
    key: 'school',
    label: 'School',
    render: (_, r) => <SchoolCell name={r.school} meta={`${r.frl}% FRL`} />,
  },
  {
    key: 'priority',
    label: 'Priority',
    render: (v) => (
      <Pill color={v === 'critical' ? '#DC2626' : '#D97706'} variant="filled" size="sm">
        {v === 'critical' ? 'High Priority' : 'Monitor'}
      </Pill>
    ),
  },
  { key: 'action', label: 'Recommended action' },
]

export function DistrictDemographics() {
  const titleIData = buildTitleIData()

  return (
    <div className="rc-page" style={{ '--rc-accent': ACCENT }}>
      <Hero
        icon={DEMOGRAPHICS_ICON}
        title="Demographics"
        subtitle="Equity mapping, grade-level performance, and resource allocation indicators"
        accent={ACCENT}
        accentBg="#F5F3FF"
      />

      <div className="rc-stats-row">
        <StatCard value={3} label="Title I Schools" footer="Lincoln, Roosevelt, Washington" />
        <StatCard
          value="−17 pts"
          label="Title I RMI Gap"
          footer="vs. non-Title I schools"
          color={T1_COLOR}
        />
        <StatCard value="42%" label="Avg FRL Rate" footer="Free/reduced lunch, district" />
        <StatCard
          value="−23 pts"
          label="FRL Engagement Gap"
          footer="High FRL vs. low FRL schools"
          color={T1_COLOR}
        />
      </div>

      <div className="sv-grid">
        {/* Equity table — full width */}
        <ChartCard
          title="Equity & Resource Mapping"
          subtitle="Reading performance overlaid with school-level demographic indicators"
          icon={DEMOGRAPHICS_ICON}
          accent={ACCENT}
          bodyPad="flush"
          span={2}
          footer={
            <CardNote tone="accent">
              ⚠ Negative correlation detected: the 3 highest FRL schools (Lincoln, Washington,
              Roosevelt) show the lowest RMI scores. Consider targeted resource allocation or
              additional engagement programs.
            </CardNote>
          }
        >
          <Table flush columns={EQUITY_COLUMNS} rows={EQUITY_ROWS} getRowKey={(r) => r.id} />
        </ChartCard>

        {/* Grade-level performance */}
        <ChartCard
          title="Performance by Grade Level"
          subtitle="RMI score distribution across K–12"
          icon={DEMOGRAPHICS_ICON}
          accent={ACCENT}
          bodyPad="padded"
          footer={
            <ChartLegend
              items={[
                { color: '#0DA7BC', label: 'RMI Score' },
                { color: '#7CB5F5', label: 'Engagement %' },
              ]}
            />
          }
        >
          <TrendChart
            type="bar"
            data={GRADE_PERFORMANCE}
            xKey="grade"
            yDomain={[60, 85]}
            height="md"
            tooltipFormatter={(v, name) => [v, name === 'rmi' ? 'RMI Score' : 'Engagement %']}
            xPadding={{ left: 12, right: 12 }}
            series={[
              { key: 'rmi', name: 'RMI Score', color: '#0DA7BC' },
              { key: 'engagement', name: 'Engagement %', color: '#7CB5F5' },
            ]}
          />
        </ChartCard>

        {/* Title I vs non-Title I */}
        <ChartCard
          title="Title I vs. Non-Title I Schools"
          subtitle="Average metrics across 3 Title I and 3 non-Title I schools"
          icon={DEMOGRAPHICS_ICON}
          accent={ACCENT}
          bodyPad="padded"
          footer={
            <ChartLegend
              items={[
                { color: T1_COLOR, label: 'Title I (3 schools)' },
                { color: N1_COLOR, label: 'Non-Title I (3 schools)' },
              ]}
            />
          }
        >
          <BarList
            groups={titleIData.map((row) => ({
              label: row.metric,
              labelColor: '#475569',
              items: [
                {
                  label: 'Title I',
                  labelColor: T1_COLOR,
                  value: row.titleI,
                  max: row.max,
                  color: T1_COLOR,
                  valueLabel: String(row.titleI),
                },
                {
                  label: 'Non-Title I',
                  labelColor: N1_COLOR,
                  value: row.nonTitleI,
                  max: row.max,
                  color: N1_COLOR,
                  valueLabel: String(row.nonTitleI),
                },
              ],
            }))}
          />
        </ChartCard>

        {/* Recommended district actions — full width */}
        <ChartCard
          title="Recommended District Actions"
          subtitle="Data-driven priorities based on equity gaps and engagement signals"
          icon={DEMOGRAPHICS_ICON}
          accent={ACCENT}
          bodyPad="flush"
          span={2}
        >
          <Table
            flush
            collapse
            columns={ACTION_COLUMNS}
            rows={ACTIONS}
            getRowKey={(r) => r.school}
          />
        </ChartCard>
      </div>
    </div>
  )
}
