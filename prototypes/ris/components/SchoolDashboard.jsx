import {
  SCHOOLS,
  SCHOOL_HEALTH,
  RMI_TRENDS,
  SCHOOL_INTEGRITY_TRENDS,
  SCHOOL_LEXILE_BY_GRADE,
  GOALS_MET_TRENDS,
} from '../data'
import { StudentsToWatch } from './StudentsToWatch'
import { Hero } from '@components/Hero/Hero'
import { AlertsBanner } from '@components/AlertsBanner/AlertsBanner'
import { ReadingHealth, SECTIONS } from '@components/ReadingHealth/ReadingHealth'
import { SliceTooltip, ChartLegend } from '@components/charts/charts'
import { ChartCard } from '@components/Cards/Cards'
import { TrendChart } from '@components/TrendChart/TrendChart'
import './SchoolDashboard.css'

function schoolInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
}

const AREA_CONFIG = {
  motivation: {
    color: '#E8866A',
    title: 'Reading Motivation Index',
    nav: 'motivation',
    navLabel: 'motivation',
  },
  integrity: {
    color: '#1D4ED8',
    title: 'Book Talk completion & flag rate',
    nav: 'integrity',
    navLabel: 'integrity',
  },
  habits: { color: '#16A97A', title: 'Goal completion rate', nav: 'habits', navLabel: 'habits' },
  skills: { color: '#7C3AED', title: 'Lexile growth by grade', nav: 'skills', navLabel: 'skills' },
}

function DashCard({ area, onNavigate, footer, height = 180, children }) {
  const cfg = AREA_CONFIG[area]
  const sec = SECTIONS.find((s) => s.key === area)
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
      <div style={{ flex: 1, minHeight: height, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </ChartCard>
  )
}

export function SchoolDashboard({ schoolId, onNavigate, onOpenStudent, alerts = [] }) {
  const school = SCHOOLS.find((s) => s.id === schoolId)
  const health = SCHOOL_HEALTH[schoolId]
  const shortName = school.name.split(' ')[0]

  const rmiData = RMI_TRENDS.map((d) => ({
    month: d.month,
    school: d[schoolId],
    district: d.district,
  }))
  const goalsData = GOALS_MET_TRENDS.map((d) => ({
    month: d.month,
    school: d[schoolId],
    district: d.district,
  }))
  const integrityData = SCHOOL_INTEGRITY_TRENDS[schoolId]
  const lexileByGrade = SCHOOL_LEXILE_BY_GRADE[schoolId]
  const avgExpected = Math.round(
    lexileByGrade.reduce((s, d) => s + d.expected, 0) / lexileByGrade.length,
  )

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
            data={rmiData}
            xKey="month"
            yDomain={[55, 90]}
            yTicks={[60, 70, 80, 90]}
            height="sm"
            series={[
              { key: 'school', name: shortName, color: school.color, fillOpacity: 0.25 },
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
                accent={school.color}
                allData={rmiData}
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
        </DashCard>

        {/* Integrity */}
        <DashCard
          area="integrity"
          onNavigate={onNavigate}
          footer={
            <ChartLegend
              items={[
                { color: '#1D4ED8', label: 'Book Talk completion' },
                { color: '#E8866A', label: 'Flag rate', dashed: true },
              ]}
            />
          }
        >
          <TrendChart
            type="line"
            data={integrityData}
            xKey="month"
            yDomain={[0, 100]}
            yUnit="%"
            yTicks={[0, 25, 50, 75, 100]}
            height="sm"
            series={[
              { key: 'completionRate', name: 'Book Talk completion', color: '#1D4ED8' },
              { key: 'flagRate', name: 'Flag rate', color: '#E8866A', dashed: true },
            ]}
            sliceTooltip={({ slice }) => (
              <SliceTooltip
                slice={slice}
                accent="#1D4ED8"
                allData={integrityData}
                seriesMap={{ 'Book Talk completion': 'completionRate', 'Flag rate': 'flagRate' }}
                inverseSeries={['Flag rate']}
                formatY={(v) => `${v}%`}
                formatDelta={(d) => `${d > 0 ? '+' : ''}${d}pp`}
              />
            )}
          />
        </DashCard>

        {/* Habits — goal completion rate */}
        <DashCard
          area="habits"
          onNavigate={onNavigate}
          footer={
            <ChartLegend
              items={[
                { color: '#16A97A', label: shortName },
                { color: '#CBD5E1', label: 'District avg', dashed: true },
              ]}
            />
          }
        >
          <TrendChart
            type="area"
            data={goalsData}
            xKey="month"
            yDomain={[30, 100]}
            yUnit="%"
            yTicks={[40, 60, 80, 100]}
            height="sm"
            series={[
              { key: 'school', name: shortName, color: '#16A97A', fillOpacity: 0.25 },
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
                accent="#16A97A"
                allData={goalsData}
                seriesMap={{ [shortName]: 'school', 'District avg': 'district' }}
                formatY={(v) => `${v}%`}
                formatDelta={(d) => `${d > 0 ? '+' : ''}${d}pp`}
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
                      {gap}pp {gap > 0 ? 'above' : 'below'} district
                    </>
                  )
                }}
              />
            )}
          />
        </DashCard>

        {/* Skills — Lexile growth by grade */}
        <DashCard
          area="skills"
          onNavigate={onNavigate}
          footer={
            <ChartLegend
              items={[
                { color: school.color, label: 'Actual growth' },
                { color: '#E2E8F0', label: `Expected (~${avgExpected}L)` },
              ]}
            />
          }
        >
          <TrendChart
            type="bar"
            layout="horizontal"
            data={lexileByGrade}
            xKey="grade"
            yUnit="L"
            height="sm"
            leftMargin={36}
            tooltipFormatter={(v) => `+${v}L`}
            series={[
              { key: 'expected', name: 'Expected', color: '#E2E8F0' },
              { key: 'growth', name: 'Actual', color: school.color },
            ]}
          />
        </DashCard>
      </div>
    </div>
  )
}
