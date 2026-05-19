import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import {
  SCHOOLS, SCHOOL_HEALTH, RMI_TRENDS, SCHOOL_INTEGRITY_TRENDS,
  SCHOOL_LEXILE_BY_GRADE, GOALS_MET_TRENDS,
} from '../data'
import { StudentsToWatch } from './StudentsToWatch'
import { Hero } from './Hero'
import { AlertsBanner } from './AlertsBanner'
import { ReadingHealth, SECTIONS } from './ReadingHealth'
import {
  NIVO_THEME, LINE_MARGIN, AXIS_BOTTOM, AXIS_LEFT,
  SliceTooltip, GradeTooltip, ChartLegend,
} from './charts'
import { ChartCard } from './Cards'
import './SchoolDashboard.css'

function schoolInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2)
}

const AREA_CONFIG = {
  motivation: { color: '#E8866A', title: 'Reading Motivation Index',          nav: 'motivation', navLabel: 'motivation' },
  integrity:  { color: '#1D4ED8', title: 'Book Talk completion & flag rate',   nav: 'integrity',  navLabel: 'integrity'  },
  habits:     { color: '#16A97A', title: 'Goal completion rate',               nav: 'habits',     navLabel: 'habits'     },
  skills:     { color: '#7C3AED', title: 'Lexile growth by grade',             nav: 'skills',     navLabel: 'skills'     },
}

function DashCard({ area, onNavigate, footer, height = 180, children }) {
  const cfg = AREA_CONFIG[area]
  const sec = SECTIONS.find(s => s.key === area)
  return (
    <ChartCard
      title={cfg.title}
      icon={sec?.icon}
      accent={cfg.color}
      action={
        <button className="rc-card-drill" onClick={() => onNavigate(cfg.nav)}>
          View {cfg.navLabel} →
        </button>
      }
      footer={footer}
    >
      <div style={{ height }}>{children}</div>
    </ChartCard>
  )
}

export function SchoolDashboard({ schoolId, onNavigate, onOpenStudent, alerts = [] }) {
  const school = SCHOOLS.find(s => s.id === schoolId)
  const health = SCHOOL_HEALTH[schoolId]
  const shortName = school.name.split(' ')[0]

  const rmiData       = RMI_TRENDS.map(d => ({ month: d.month, school: d[schoolId], district: d.district }))
  const goalsData     = GOALS_MET_TRENDS.map(d => ({ month: d.month, school: d[schoolId], district: d.district }))
  const integrityData = SCHOOL_INTEGRITY_TRENDS[schoolId]
  const lexileByGrade = SCHOOL_LEXILE_BY_GRADE[schoolId]
  const avgExpected   = Math.round(lexileByGrade.reduce((s, d) => s + d.expected, 0) / lexileByGrade.length)

  // ── Nivo data shapes ────────────────────────────────────────────────────────
  const rmiNivo = [
    { id: shortName,      color: school.color, data: rmiData.map(d => ({ x: d.month, y: d.school   })) },
    { id: 'District avg', color: '#CBD5E1',    data: rmiData.map(d => ({ x: d.month, y: d.district })) },
  ]

  const integrityNivo = [
    { id: 'Book Talk completion', color: '#1D4ED8', data: integrityData.map(d => ({ x: d.month, y: d.completionRate })) },
    { id: 'Flag rate',            color: '#E8866A', data: integrityData.map(d => ({ x: d.month, y: d.flagRate       })) },
  ]

  const goalsNivo = [
    { id: shortName,      color: '#16A97A', data: goalsData.map(d => ({ x: d.month, y: d.school   })) },
    { id: 'District avg', color: '#CBD5E1', data: goalsData.map(d => ({ x: d.month, y: d.district })) },
  ]

  return (
    <div className="sdb">
      <Hero
        title={school.name}
        subtitle={`${school.grades} · ${school.students.toLocaleString()} students`}
        accent={school.color}
        initials={schoolInitials(school.name)}
      />

      <AlertsBanner alerts={alerts} />

      <ReadingHealth title={null} data={health} onNavigate={onNavigate} />

      <StudentsToWatch schoolId={schoolId} onOpenStudent={onOpenStudent} />

      <div className="sdb-areas">
        {/* Motivation */}
        <DashCard
          area="motivation"
          onNavigate={onNavigate}
          footer={<ChartLegend items={[
            { color: school.color, label: shortName },
            { color: '#CBD5E1',    label: 'District avg', dashed: true },
          ]} />}
        >
          <ResponsiveLine
            data={rmiNivo}
            theme={NIVO_THEME}
            margin={LINE_MARGIN}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 55, max: 90 }}
            curve="monotoneX"
            colors={d => d.color}
            lineWidth={2.5}
            enablePoints={false}
            enableArea
            areaOpacity={0.08}
            enableGridX={false}
            axisBottom={AXIS_BOTTOM}
            axisLeft={{ ...AXIS_LEFT, tickValues: [60, 70, 80, 90] }}
            defs={[{
              id: 'motGrad', type: 'linearGradient',
              colors: [{ offset: 0, color: school.color, opacity: 0.25 }, { offset: 100, color: school.color, opacity: 0 }],
            }]}
            fill={[{ match: { id: shortName }, id: 'motGrad' }]}
            enableSlices="x"
            sliceTooltip={({ slice }) => (
              <SliceTooltip
                slice={slice}
                accent={school.color}
                allData={rmiData}
                seriesMap={{ [shortName]: 'school', 'District avg': 'district' }}
                formatDelta={d => `${d > 0 ? '+' : ''}${d} pts`}
                context={s => {
                  const my = s.points.find(p => p.serieId === shortName)?.data.y
                  const dist = s.points.find(p => p.serieId === 'District avg')?.data.y
                  if (my == null || dist == null) return null
                  const gap = my - dist
                  return gap === 0
                    ? <>On pace with district</>
                    : <><strong>{shortName}</strong> {gap > 0 ? '+' : ''}{gap} pts {gap > 0 ? 'above' : 'below'} district</>
                }}
              />
            )}
          />
        </DashCard>

        {/* Integrity */}
        <DashCard
          area="integrity"
          onNavigate={onNavigate}
          footer={<ChartLegend items={[
            { color: '#1D4ED8', label: 'Book Talk completion' },
            { color: '#E8866A', label: 'Flag rate', dashed: true },
          ]} />}
        >
          <ResponsiveLine
            data={integrityNivo}
            theme={NIVO_THEME}
            margin={LINE_MARGIN}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, max: 100 }}
            curve="monotoneX"
            colors={d => d.color}
            lineWidth={2.5}
            enablePoints={false}
            enableGridX={false}
            axisBottom={AXIS_BOTTOM}
            axisLeft={{ ...AXIS_LEFT, format: v => `${v}%`, tickValues: [0, 25, 50, 75, 100] }}
            enableSlices="x"
            sliceTooltip={({ slice }) => (
              <SliceTooltip
                slice={slice}
                accent="#1D4ED8"
                allData={integrityData}
                seriesMap={{ 'Book Talk completion': 'completionRate', 'Flag rate': 'flagRate' }}
                inverseSeries={['Flag rate']}
                formatY={v => `${v}%`}
                formatDelta={d => `${d > 0 ? '+' : ''}${d}pp`}
              />
            )}
          />
        </DashCard>

        {/* Habits — goal completion rate */}
        <DashCard
          area="habits"
          onNavigate={onNavigate}
          footer={<ChartLegend items={[
            { color: '#16A97A', label: shortName },
            { color: '#CBD5E1', label: 'District avg', dashed: true },
          ]} />}
        >
          <ResponsiveLine
            data={goalsNivo}
            theme={NIVO_THEME}
            margin={LINE_MARGIN}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 30, max: 100 }}
            curve="monotoneX"
            colors={d => d.color}
            lineWidth={2.5}
            enablePoints={false}
            enableArea
            areaOpacity={0.08}
            enableGridX={false}
            axisBottom={AXIS_BOTTOM}
            axisLeft={{ ...AXIS_LEFT, format: v => `${v}%`, tickValues: [40, 60, 80, 100] }}
            defs={[{
              id: 'habGrad', type: 'linearGradient',
              colors: [{ offset: 0, color: '#16A97A', opacity: 0.25 }, { offset: 100, color: '#16A97A', opacity: 0 }],
            }]}
            fill={[{ match: { id: shortName }, id: 'habGrad' }]}
            enableSlices="x"
            sliceTooltip={({ slice }) => (
              <SliceTooltip
                slice={slice}
                accent="#16A97A"
                allData={goalsData}
                seriesMap={{ [shortName]: 'school', 'District avg': 'district' }}
                formatY={v => `${v}%`}
                formatDelta={d => `${d > 0 ? '+' : ''}${d}pp`}
                context={s => {
                  const my = s.points.find(p => p.serieId === shortName)?.data.y
                  const dist = s.points.find(p => p.serieId === 'District avg')?.data.y
                  if (my == null || dist == null) return null
                  const gap = my - dist
                  return gap === 0
                    ? <>On pace with district</>
                    : <><strong>{shortName}</strong> {gap > 0 ? '+' : ''}{gap}pp {gap > 0 ? 'above' : 'below'} district</>
                }}
              />
            )}
          />
        </DashCard>

        {/* Skills — Lexile growth by grade */}
        <DashCard
          area="skills"
          onNavigate={onNavigate}
          footer={<ChartLegend items={[
            { color: school.color, label: 'Actual growth' },
            { color: '#E2E8F0',    label: `Expected (~${avgExpected}L)` },
          ]} />}
        >
          <ResponsiveBar
            data={lexileByGrade}
            keys={['expected', 'growth']}
            indexBy="grade"
            layout="horizontal"
            groupMode="grouped"
            theme={NIVO_THEME}
            margin={{ top: 8, right: 32, bottom: 36, left: 44 }}
            colors={({ id }) => id === 'growth' ? school.color : '#E2E8F0'}
            borderRadius={3}
            axisBottom={{ tickSize: 0, tickPadding: 8, format: v => `${v}L` }}
            axisLeft={{ tickSize: 0, tickPadding: 8 }}
            enableGridY={false}
            enableLabel={false}
            tooltip={({ data }) => <GradeTooltip data={data} accent={school.color} />}
          />
        </DashCard>
      </div>
    </div>
  )
}
