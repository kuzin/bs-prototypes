import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import {
  SCHOOLS, SCHOOL_HEALTH, RMI_TRENDS, SCHOOL_INTEGRITY_TRENDS,
  SCHOOL_LEXILE_BY_GRADE, GOALS_MET_TRENDS,
} from '../data'
import { StudentsToWatch } from './StudentsToWatch'
import { OverviewHero } from './OverviewHero'
import { AlertsBanner } from './AlertsBanner'
import { ReadingHealth, SECTIONS } from './ReadingHealth'
import './SchoolDashboard.css'

function schoolInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2)
}

const AREA_CONFIG = {
  motivation: { color: '#E8866A', bg: '#FFF8F5', title: 'Reading Motivation Index',          nav: 'motivation', navLabel: 'motivation' },
  integrity:  { color: '#1D4ED8', bg: '#EFF6FF', title: 'Book Talk completion & flag rate',   nav: 'integrity',  navLabel: 'integrity'  },
  habits:     { color: '#16A97A', bg: '#F0FDF6', title: 'Goal completion rate',               nav: 'habits',     navLabel: 'habits'     },
  skills:     { color: '#7C3AED', bg: '#F5F3FF', title: 'Lexile growth by grade',             nav: 'skills',     navLabel: 'skills'     },
}

const NIVO_THEME = {
  axis: {
    ticks: {
      line: { stroke: 'transparent' },
      text: { fontSize: 13, fill: '#94A3B8' },
    },
    domain: { line: { stroke: '#EDE8E3' } },
  },
  grid: {
    line: { stroke: '#EDE8E3', strokeDasharray: '3 3' },
  },
}

const LINE_MARGIN = { top: 16, right: 28, bottom: 36, left: 52 }
const AXIS_BOTTOM = { tickSize: 0, tickPadding: 10 }
const AXIS_LEFT   = { tickSize: 0, tickPadding: 8 }

function SliceTooltip({ slice, formatY }) {
  return (
    <div className="sdb-tooltip">
      <div className="sdb-tooltip-month">{slice.points[0]?.data.x}</div>
      {slice.points.map(pt => (
        <div key={pt.id} className="sdb-tooltip-row">
          <span className="sdb-tooltip-dot" style={{ background: pt.serieColor }} />
          <span className="sdb-tooltip-label">{pt.serieId}</span>
          <span className="sdb-tooltip-val">{formatY ? formatY(pt.data.y) : pt.data.y}</span>
        </div>
      ))}
    </div>
  )
}

function Legend({ items }) {
  return (
    <div className="sdb-legend">
      {items.map(({ color, label, dashed }) => (
        <span key={label} className="sdb-legend-item">
          <span
            className="sdb-legend-swatch"
            style={dashed
              ? { backgroundImage: `repeating-linear-gradient(to right, ${color} 0, ${color} 4px, transparent 4px, transparent 8px)` }
              : { background: color }
            }
          />
          {label}
        </span>
      ))}
    </div>
  )
}

function AreaCard({ area, onNavigate, legend, children }) {
  const cfg = AREA_CONFIG[area]
  const sec = SECTIONS.find(s => s.key === area)
  return (
    <div className="sdb-card" style={{ '--ac': cfg.color, '--ac-bg': cfg.bg }}>
      <div className="sdb-card-head">
        <div className="sdb-card-icon">{sec?.icon}</div>
        <span className="sdb-card-title">{cfg.title}</span>
        <button className="sdb-card-drill" onClick={() => onNavigate(cfg.nav)}>
          View {cfg.navLabel} →
        </button>
      </div>
      <div className="sdb-card-chart">{children}</div>
      {legend && <div className="sdb-card-legend">{legend}</div>}
    </div>
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
      <OverviewHero
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
        <AreaCard
          area="motivation"
          onNavigate={onNavigate}
          legend={<Legend items={[
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
            sliceTooltip={({ slice }) => <SliceTooltip slice={slice} />}
          />
        </AreaCard>

        {/* Integrity */}
        <AreaCard
          area="integrity"
          onNavigate={onNavigate}
          legend={<Legend items={[
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
            sliceTooltip={({ slice }) => <SliceTooltip slice={slice} formatY={v => `${v}%`} />}
          />
        </AreaCard>

        {/* Habits — goal completion rate */}
        <AreaCard
          area="habits"
          onNavigate={onNavigate}
          legend={<Legend items={[
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
            sliceTooltip={({ slice }) => <SliceTooltip slice={slice} formatY={v => `${v}%`} />}
          />
        </AreaCard>

        {/* Skills — Lexile growth by grade */}
        <AreaCard
          area="skills"
          onNavigate={onNavigate}
          legend={<Legend items={[
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
            tooltip={({ id, indexValue, value }) => (
              <div className="sdb-tooltip">
                <div className="sdb-tooltip-row">
                  <span className="sdb-tooltip-label">{indexValue} — {id === 'growth' ? 'actual' : 'expected'}</span>
                  <span className="sdb-tooltip-val">+{value}L</span>
                </div>
              </div>
            )}
          />
        </AreaCard>
      </div>
    </div>
  )
}
