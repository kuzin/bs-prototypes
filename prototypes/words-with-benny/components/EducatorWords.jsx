import { useMemo, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { Table } from '@components/Table/Table'
import { Avatar } from '@components/Avatar/Avatar'
import { BarList } from '@components/BarList/BarList'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { WordCloud } from '@components/WordCloud/WordCloud'
import { StatCard, ChartCard } from '@components/Cards/Cards'
import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'
import '@components/Avatar/Avatar.css'
import '@components/BarList/BarList.css'
import '@components/Cards/Cards.css'

import {
  ACTIVITY_ACCURACY,
  ALL_WORDS,
  BOOKS,
  CLASS_TOP_WORDS,
  CLASS_TREND,
  ROSTER,
  WRITING_QUEUE,
  activityType,
} from '../data'
import './EducatorWords.css'

// The Vocabulary tab of a classroom page: "at-a-glance reporting showing
// progress in word collection at the student and classroom level".
//
// The framing matters as much as the numbers. The brief's problem is that
// educators need a reason to keep pushing logging *without* taking on
// instructional work — so this page leads with the outcome (words their class
// picked up by reading) and says out loud that nothing here was assigned.

const ACCENT = '#B43DD0'

/** Words collected per student, bucketed — the shape of the class, not a mean. */
function distribution(roster) {
  const buckets = [
    { label: '25+ words', min: 25, color: '#6D28D9' },
    { label: '15–24', min: 15, color: '#8B5CF6' },
    { label: '5–14', min: 5, color: '#C4B5FD' },
    { label: 'Under 5', min: 0, color: '#EAEAEA' },
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

/**
 * First-try accuracy by activity type. This is the one number the class summary
 * gained by asking about a word five different ways rather than once: a class
 * can be near-perfect at picking a definition out of a list and still unable to
 * put the word in a sentence of its own, and only the second of those is worth
 * a teacher's minute.
 */
function byActivity() {
  return ACTIVITY_ACCURACY.map((a) => {
    const type = activityType(a.id)
    return {
      label: type.label,
      value: a.firstTry,
      valueLabel: `${a.firstTry}%`,
      color: a.firstTry >= 85 ? '#16A34A' : a.firstTry >= 70 ? '#8B5CF6' : '#AB720A',
      max: 100,
    }
  })
}

function AccuracyPill({ value }) {
  const color = value >= 85 ? '#16A34A' : value >= 70 ? '#AB720A' : '#E85648'
  return (
    <Pill color={color} size="sm">
      {value}%
    </Pill>
  )
}

export function EducatorWords({ onOpenStudent, written = [] }) {
  const [tab, setTab] = useState('class')

  // Sentences students wrote in the "write your own" activity. Anything the
  // automatic check couldn't confidently take is a `flagged` row, and those
  // come first — the queue is the only part of this feature that asks a
  // teacher for time, so it has to be short and sorted by who needs a look.
  const queue = useMemo(() => {
    const all = [...written, ...WRITING_QUEUE]
    return [...all].sort((a, b) => (a.status === b.status ? 0 : a.status === 'flagged' ? -1 : 1))
  }, [written])

  const totals = useMemo(() => {
    const words = ROSTER.reduce((n, s) => n + s.words, 0)
    const week = ROSTER.reduce((n, s) => n + s.week, 0)
    const collecting = ROSTER.filter((s) => s.week > 0).length
    const sorted = [...ROSTER].map((s) => s.words).sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    const firstTry = Math.round(ROSTER.reduce((n, s) => n + s.firstTry, 0) / ROSTER.length)
    return { words, week, collecting, median, firstTry }
  }, [])

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
      {/* The classroom page above already names the class and the tab, so the
          header carries only what belongs to Vocabulary itself: which level
          you're reading it at, and the actions. */}
      <header className="ew-head">
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
        <div className="ew-head-actions">
          <Button variant="ghost" size="sm">
            Export
          </Button>
          <Button variant="ghost" size="sm">
            Print word wall
          </Button>
        </div>
      </header>

      {tab === 'class' ? (
        <>
          {/* The shared stat tile — these sit inside a page
              that already has a heading and five cards under them, and a row
              of big centred numerals shouted over all of it. */}
          <div className="ew-stats">
            <StatCard
              value={totals.words.toLocaleString()}
              label="Words collected this year"
              trend={{ delta: totals.week, format: (n) => `${n} in the last 7 days` }}
              color={ACCENT}
            />
            <StatCard
              value={totals.collecting}
              unit={`/${ROSTER.length}`}
              label="Students collecting this week"
              color="#0CA7BC"
            />
            <StatCard value={totals.median} label="Median words per student" color="#0BA85F" />
            <StatCard
              value={totals.firstTry}
              unit="%"
              label="Used correctly first try"
              color="#AB720A"
            />
          </div>

          <div className="ew-grid">
            <ChartCard
              title="The class word wall"
              accent={ACCENT}
              span={2}
              bodyPad="padded"
              className="ew-cloudcard"
            >
              <WordCloud
                words={CLASS_TOP_WORDS.map((w) => ({ text: w.word, value: w.students }))}
                accent={ACCENT}
                height="lg"
                minSize={13}
                maxSize={48}
                valueLabel={(w) => `${w.value} of ${ROSTER.length} students`}
              />
            </ChartCard>

            <ChartCard title="Where the words stop sticking" accent={ACCENT} bodyPad="padded">
              <BarList labelWidth={132} items={byActivity()} />
            </ChartCard>

            <ChartCard title="How the class is spread" accent={ACCENT} bodyPad="padded">
              <BarList labelWidth={92} items={distribution(ROSTER)} />
            </ChartCard>

            <ChartCard
              title="Words collected, against reading logs"
              accent={ACCENT}
              span={2}
              footer={
                <div className="ew-legend">
                  {[
                    { label: 'Words collected', color: ACCENT },
                    { label: 'Reading logs', color: '#ACACAC', dashed: true },
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
                    color: '#ACACAC',
                    dashed: true,
                    fillOpacity: 0,
                  },
                ]}
              />
            </ChartCard>

            <ChartCard title="Sentences students wrote" accent={ACCENT} span={2} bodyPad="flush">
              <ul className="ew-queue">
                {queue.slice(0, 6).map((row, i) => {
                  const person = ROSTER.find((s) => s.id === row.student)
                  return (
                    <li key={`${row.student}-${row.word}-${i}`} className="ew-queue-row">
                      <button
                        className="ew-queue-who"
                        onClick={() => onOpenStudent(row.student)}
                        aria-label={`Open ${person?.name ?? row.student}`}
                      >
                        <Avatar
                          initials={person?.initials ?? '??'}
                          color={person?.color}
                          size="sm"
                        />
                        <span className="ew-queue-name">{person?.name ?? row.student}</span>
                      </button>
                      <p className="ew-queue-text">
                        {row.text
                          .split(new RegExp(`(${row.word})`, 'i'))
                          .map((bit, j) =>
                            bit.toLowerCase() === row.word.toLowerCase() ? (
                              <strong key={j}>{bit}</strong>
                            ) : (
                              <span key={j}>{bit}</span>
                            ),
                          )}
                      </p>
                      <div className="ew-queue-meta">
                        <Pill color={row.status === 'flagged' ? '#AB720A' : '#16A34A'} size="sm">
                          {row.status === 'flagged' ? 'Needs a look' : 'Accepted'}
                        </Pill>
                      </div>
                    </li>
                  )
                })}
              </ul>
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
        </div>
      )}
    </div>
  )
}
