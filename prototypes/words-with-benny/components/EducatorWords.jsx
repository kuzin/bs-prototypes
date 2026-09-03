import { useMemo, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { Table } from '@components/Table/Table'
import { Avatar } from '@components/Avatar/Avatar'
import { BarList } from '@components/BarList/BarList'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { StatCard, ChartCard } from '@components/Cards/Cards'
import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'
import '@components/Avatar/Avatar.css'
import '@components/BarList/BarList.css'
import '@components/Cards/Cards.css'

import { ALL_WORDS, CLASS, CLASS_TOP_WORDS, CLASS_TREND, ROSTER } from '../data'
import './EducatorWords.css'

// The Vocabulary tab of a classroom page: "at-a-glance reporting showing
// progress in word collection at the student and classroom level".
//
// The framing matters as much as the numbers. The brief's problem is that
// educators need a reason to keep pushing logging *without* taking on
// instructional work — so this page leads with the outcome (words their class
// picked up by reading) and says out loud that nothing here was assigned.

const ACCENT = '#7C3AED'

/** Words collected per student, bucketed — the shape of the class, not a mean. */
function distribution(roster) {
  const buckets = [
    { label: '25+ words', min: 25, color: '#6D28D9' },
    { label: '15–24', min: 15, color: '#8B5CF6' },
    { label: '5–14', min: 5, color: '#C4B5FD' },
    { label: 'Under 5', min: 0, color: '#E2E8F0' },
  ]
  return buckets.map((b, i) => {
    const max = i === 0 ? Infinity : buckets[i - 1].min
    const students = roster.filter((s) => s.words >= b.min && s.words < max)
    return {
      label: b.label,
      value: students.length,
      valueLabel: `${students.length}`,
      color: b.color,
      max: roster.length,
    }
  })
}

function AccuracyPill({ value }) {
  const color = value >= 85 ? '#16A34A' : value >= 70 ? '#D97706' : '#DC2626'
  return (
    <Pill color={color} size="sm">
      {value}%
    </Pill>
  )
}

export function EducatorWords({ onOpenStudent }) {
  const [tab, setTab] = useState('class')

  const totals = useMemo(() => {
    const words = ROSTER.reduce((n, s) => n + s.words, 0)
    const week = ROSTER.reduce((n, s) => n + s.week, 0)
    const collecting = ROSTER.filter((s) => s.week > 0).length
    const sorted = [...ROSTER].map((s) => s.words).sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    const firstTry = Math.round(ROSTER.reduce((n, s) => n + s.firstTry, 0) / ROSTER.length)
    return { words, week, collecting, median, firstTry }
  }, [])

  // Words at least one student in the class has collected.
  const distinct = ALL_WORDS.length

  const columns = [
    {
      key: 'name',
      label: 'Student',
      sortable: true,
      render: (v, row) => (
        <span className="ew-student">
          <Avatar initials={row.initials} color={row.color} size="sm" />
          <span className="ew-student-name">{v}</span>
        </span>
      ),
    },
    { key: 'words', label: 'Words collected', align: 'right', sortable: true },
    {
      key: 'week',
      label: 'This week',
      align: 'right',
      sortable: true,
      render: (v) => (v > 0 ? `+${v}` : <span className="ew-zero">0</span>),
    },
    {
      key: 'firstTry',
      label: 'First-try accuracy',
      align: 'right',
      sortable: true,
      render: (v) => <AccuracyPill value={v} />,
    },
    {
      key: 'logs',
      label: 'Reading logs',
      align: 'right',
      sortable: true,
      render: (v) => <span className="ew-logs">{v}</span>,
    },
    {
      key: 'last',
      label: 'Latest word',
      render: (v) => <span className="ew-lastword">{v}</span>,
    },
  ]

  return (
    <div className="ew">
      {/* The classroom page above already names the class and the tab, so this
          keeps only the actions that belong to Vocabulary itself. */}
      <header className="ew-head">
        <p className="ew-term">{CLASS.term}</p>
        <div className="ew-head-actions">
          <Button variant="ghost" size="sm" icon={<Icon name="download" size={15} />}>
            Export
          </Button>
          <Button variant="ghost" size="sm" icon={<Icon name="printer" size={15} />}>
            Print word wall
          </Button>
        </div>
      </header>

      {/* The reason this page exists, said plainly. */}
      <div className="ew-note">
        <img src="/bs-prototypes/benny-happy.svg" alt="" className="ew-note-benny" />
        <p className="ew-note-text">
          <strong>Nothing here was assigned.</strong> Every word below came out of a book a student
          chose and logged — Benny surfaces one every couple of logs, and the student earns it by
          using it correctly. No lists to build, no lessons to plan.
        </p>
      </div>

      <Tabs
        variant="pill"
        size="md"
        active={tab}
        onChange={setTab}
        accent={ACCENT}
        ariaLabel="Vocabulary reporting level"
        items={[
          { id: 'class', label: 'Class summary' },
          { id: 'students', label: 'By student', count: ROSTER.length },
        ]}
        className="ew-tabs"
      />

      {tab === 'class' ? (
        <>
          <div className="ew-stats">
            <StatCard
              value={totals.words.toLocaleString()}
              label="Words collected this year"
              footer={`+${totals.week} in the last 7 days`}
              footerColor="#16A34A"
              color={ACCENT}
            />
            <StatCard
              value={totals.collecting}
              unit={`/${ROSTER.length}`}
              label="Students collecting this week"
              footer={`${Math.round((totals.collecting / ROSTER.length) * 100)}% of the class`}
              color="#0DA7BC"
            />
            <StatCard
              value={totals.median}
              label="Median words per student"
              footer={`${distinct} distinct words in play`}
              color="#16A97A"
            />
            <StatCard
              value={totals.firstTry}
              unit="%"
              label="Used correctly first try"
              footer="Class average across all words"
              color="#D97706"
            />
          </div>

          <div className="ew-grid">
            <ChartCard
              title="Words collected, against reading logs"
              subtitle="Weekly, since Words with Benny turned on"
              icon={<Icon name="chart-bar" size={17} />}
              accent={ACCENT}
              span={2}
              footer={
                <div className="ew-legend">
                  {[
                    { label: 'Words collected', color: ACCENT },
                    { label: 'Reading logs', color: '#94A3B8', dashed: true },
                  ].map((l) => (
                    <span key={l.label} className="ew-legend-item">
                      <span
                        className="ew-legend-dot"
                        style={
                          l.dashed
                            ? {
                                backgroundImage: `repeating-linear-gradient(to right, ${l.color} 0 3px, transparent 3px 6px)`,
                              }
                            : { background: l.color }
                        }
                      />
                      {l.label}
                    </span>
                  ))}
                </div>
              }
            >
              <TrendChart
                type="area"
                data={CLASS_TREND}
                xKey="week"
                yDomain={[0, 120]}
                height="md"
                series={[
                  { key: 'words', name: 'Words collected', color: ACCENT, fillOpacity: 0.24 },
                  {
                    key: 'logs',
                    name: 'Reading logs',
                    color: '#94A3B8',
                    dashed: true,
                    fillOpacity: 0,
                  },
                ]}
              />
            </ChartCard>

            <ChartCard
              title="The class word wall"
              subtitle="Words the most students have collected"
              icon={<Icon name="vocabulary" size={17} />}
              accent={ACCENT}
              bodyPad="padded"
            >
              <BarList
                header={{ label: 'Word', valueLabel: 'Students' }}
                labelWidth={116}
                items={CLASS_TOP_WORDS.map((w) => ({
                  label: w.word,
                  value: w.students,
                  valueLabel: `${w.students}`,
                  max: ROSTER.length,
                  color: ACCENT,
                }))}
              />
            </ChartCard>

            <ChartCard
              title="How the class is spread"
              subtitle="Students by words collected"
              icon={<Icon name="users" size={17} />}
              accent={ACCENT}
              bodyPad="padded"
            >
              <BarList labelWidth={92} items={distribution(ROSTER)} />
            </ChartCard>
          </div>
        </>
      ) : (
        <div className="ew-tablewrap">
          <Table
            columns={columns}
            rows={ROSTER}
            getRowKey={(r) => r.id}
            onRowClick={(r) => onOpenStudent(r.id)}
            defaultSortKey="words"
            defaultSortDir="desc"
            zebra
            scrollX
            stickyHeader
          />
          <p className="ew-tablenote">
            <Icon name="info" size={14} /> Pick a student to see the words they’ve collected.
          </p>
        </div>
      )}
    </div>
  )
}
