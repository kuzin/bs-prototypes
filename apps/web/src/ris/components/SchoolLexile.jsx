import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import {
  SCHOOLS, SCHOOL_HEALTH, LEXILE_DATA, SCHOOL_LEXILE_BY_GRADE,
} from '../data'
import { Hero } from './Hero'
import { SECTIONS } from './ReadingHealth'
import {
  NIVO_THEME, AXIS_BOTTOM, AXIS_LEFT,
  ChartLegend, GradeTooltip,
} from './charts'
import { StatCard, ChartCard } from './Cards'
import './RisLayout.css'

const SKILLS_COLOR = '#7C3AED'
const EXPECTED_GROWTH = 65
const SKILLS_ICON = SECTIONS.find(s => s.key === 'skills')?.icon

export function SchoolLexile({ schoolId, onBack }) {
  const school     = SCHOOLS.find(s => s.id === schoolId)
  const health     = SCHOOL_HEALTH[schoolId]
  const lexile     = LEXILE_DATA.find(d => d.id === schoolId)
  const grades     = SCHOOL_LEXILE_BY_GRADE[schoolId]
  const shortName  = school.name.split(' ')[0]

  // Scatter data: this-school highlighted, others gray
  const scatterNivo = [
    {
      id: 'This school',
      data: LEXILE_DATA.filter(d => d.id === schoolId).map(d => ({
        x: d.volume, y: d.lexileGrowth, school: d.school, students: d.students, id: d.id,
      })),
    },
    {
      id: 'Other schools',
      data: LEXILE_DATA.filter(d => d.id !== schoolId).map(d => ({
        x: d.volume, y: d.lexileGrowth, school: d.school, students: d.students, id: d.id,
      })),
    },
  ]

  return (
    <div className="mot-root">
      <Hero bucket="skills" />

      <div className="rc-stats-row">
        <StatCard
          value={lexile.avgLexile}
          unit="L"
          label="Avg Lexile score"
          footer="Current school avg"
          color={SKILLS_COLOR}
        />
        <StatCard
          value={`+${lexile.lexileGrowth}`}
          unit="L"
          label="YTD Lexile growth"
          footer={lexile.aboveExpected ? 'Above expected +65L' : 'Below expected +65L'}
          color={lexile.aboveExpected ? '#16A97A' : '#DC2626'}
          footerColor={lexile.aboveExpected ? '#16A34A' : '#DC2626'}
        />
        <StatCard
          value={lexile.volume}
          label="Avg books / month"
          footer="School reading volume"
        />
        <StatCard
          value={lexile.students.toLocaleString()}
          label="Enrolled students"
          footer="Contributing to avg"
        />
      </div>

      <div className="sv-grid">

        <ChartCard
          span={2}
          title="Lexile Growth vs. Reading Volume"
          subtitle={`${school.name} highlighted against district peers`}
          icon={SKILLS_ICON}
          accent={SKILLS_COLOR}
          footer={<ChartLegend items={[
            { color: school.color, label: shortName },
            { color: '#CBD5E1',    label: 'Other schools' },
            { color: '#D97706',    label: 'Expected (+65L)', dashed: true },
          ]} />}
        >
          <div style={{ height: 260 }}>
            <ResponsiveScatterPlot
              data={scatterNivo}
              theme={NIVO_THEME}
              margin={{ top: 16, right: 28, bottom: 50, left: 56 }}
              xScale={{ type: 'linear', min: 15, max: 50 }}
              yScale={{ type: 'linear', min: 0, max: 130 }}
              colors={({ serieId }) => serieId === 'This school' ? school.color : '#CBD5E1'}
              nodeSize={d => Math.sqrt(d.data.students / 5)}
              axisBottom={{ ...AXIS_BOTTOM, legend: 'Avg books/month', legendOffset: 38, legendPosition: 'middle' }}
              axisLeft={{ ...AXIS_LEFT, format: v => `${v}L`, legend: 'Lexile growth', legendOffset: -44, legendPosition: 'middle' }}
              enableGridX={false}
              markers={[{
                axis: 'y', value: EXPECTED_GROWTH,
                lineStyle: { stroke: '#D97706', strokeDasharray: '4 3', strokeWidth: 1.5 },
                legend: 'Expected (+65L)', legendOrientation: 'horizontal',
                legendPosition: 'top-right',
                textStyle: { fontSize: 13, fill: '#D97706', fontWeight: 600 },
              }]}
              tooltip={({ node }) => {
                const isThis = node.data.id === schoolId
                const accent = isThis ? school.color : '#475569'
                return (
                  <div className="sdb-tooltip" style={{ '--tip-accent': accent }}>
                    <div className="sdb-tooltip-header">{node.data.school}</div>
                    <div className="sdb-tooltip-series" style={{ '--series-color': accent }}>
                      <div className="sdb-tooltip-row">
                        <span className="sdb-tooltip-dot" />
                        <span className="sdb-tooltip-label">Lexile growth</span>
                        <span className="sdb-tooltip-val">+{node.data.y}L</span>
                      </div>
                    </div>
                    <div className="sdb-tooltip-series" style={{ '--series-color': '#94A3B8' }}>
                      <div className="sdb-tooltip-row">
                        <span className="sdb-tooltip-dot" />
                        <span className="sdb-tooltip-label">Books / mo</span>
                        <span className="sdb-tooltip-val">{node.data.x}</span>
                      </div>
                    </div>
                    <div className="sdb-tooltip-context">{node.data.students.toLocaleString()} students</div>
                  </div>
                )
              }}
            />
          </div>
        </ChartCard>

        <ChartCard
          span={2}
          title={`Lexile Growth by Grade — ${school.name}`}
          subtitle="Actual vs. expected growth per grade"
          icon={SKILLS_ICON}
          accent={SKILLS_COLOR}
          footer={<ChartLegend items={[
            { color: school.color, label: 'Actual growth' },
            { color: '#E2E8F0',    label: 'Expected growth' },
          ]} />}
        >
          <div style={{ height: 220 }}>
            <ResponsiveBar
              data={grades}
              keys={['expected', 'growth']}
              indexBy="grade"
              groupMode="grouped"
              theme={NIVO_THEME}
              margin={{ top: 8, right: 16, bottom: 36, left: 40 }}
              padding={0.3}
              innerPadding={2}
              colors={({ id }) => id === 'growth' ? school.color : '#E2E8F0'}
              borderRadius={3}
              axisBottom={AXIS_BOTTOM}
              axisLeft={{ ...AXIS_LEFT, format: v => `${v}L` }}
              enableGridY
              enableLabel={false}
              tooltip={({ data }) => <GradeTooltip data={data} accent={school.color} />}
            />
          </div>
        </ChartCard>

      </div>
    </div>
  )
}
