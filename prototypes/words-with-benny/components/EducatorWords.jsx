import { useMemo, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { Table } from '@components/Table/Table'
import { Select } from '@components/Form/Form'
import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import '@components/Form/Form.css'
import '@components/FilterBar/FilterBar.css'
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
  CLASS_CHALLENGES,
  CLASS_TOP_WORDS,
  CLASS_TREND,
  ROSTER,
  TODAY,
  WORD_RANGES,
  WRITING_QUEUE,
  activityType,
  challengeForWord,
  classCollection,
  inRange,
  rangeIsCurrent,
  wordByName,
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

// Every trend on this page is the same comparison, so it reads the same way.
const WEEK_OVER = 'vs the week before'

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
  /* Which challenge's words the wall is showing. A word is collected by logging
     a book, and a book is read for something — so "the words this challenge
     turned up" is a real cut of the same wall, and the one a teacher running
     three challenges at once actually asks for. */
  const [challenge, setChallenge] = useState('all')
  /* And over what stretch of time. The app's reading log offers a school year
     or all of it; a teacher reading a word report wants the shorter end too. */
  const [range, setRange] = useState('year')

  // The year *is* the authored figures — ROSTER's totals and the word wall are
  // what the class has collected since August. A shorter window gets counted
  // off the dated collections instead, which is the same set of words with a
  // day attached to each.
  const wholeYear = range === 'year' || range === 'all'
  // Whether the window runs up to today — the only kind that can carry a trend.
  const live = rangeIsCurrent(range)
  const rangePhrase = WORD_RANGES.find((r) => r.id === range)?.phrase ?? ''
  const since = useMemo(
    () => (wholeYear ? [] : classCollection().filter((w) => inRange(w.date, range))),
    [wholeYear, range],
  )

  const wallWords = useMemo(() => {
    // Inside a shorter window a word is as big as the number of students who
    // picked it up *in that window*, which is a different ranking from the
    // year's and the only one the window can honestly draw.
    const base = wholeYear
      ? CLASS_TOP_WORDS
      : Object.entries(
          since.reduce((by, w) => {
            ;(by[w.word] ??= new Set()).add(w.studentId)
            return by
          }, {}),
        )
          .map(([word, students]) => ({ word, students: students.size }))
          .sort((a, b) => b.students - a.students)
    return challenge === 'all' ? base : base.filter((w) => challengeForWord(w.word) === challenge)
  }, [challenge, wholeYear, since])
  const challengeName = CLASS_CHALLENGES.find((c) => c.id === challenge)?.name
  /* The wall answers to both controls, so it says which cuts are on it. */
  const wallSub =
    challengeName || !wholeYear
      ? `Words collected ${[challengeName && `reading for ${challengeName}`, !wholeYear && rangePhrase].filter(Boolean).join(', ')}`
      : undefined
  /* Every card on this row moved by something, and the dated collections are
     the only figures on the page that carry a day — so all four trends are the
     last seven days against the seven before, counted off the same list. They
     only appear on a window that runs up to today; against last month's report
     they'd be this week's movement under last month's heading. */
  const deltas = useMemo(() => {
    const all = classCollection()
    const day = (n) =>
      new Date(Date.parse(`${TODAY}T00:00:00Z`) - n * 86400000).toISOString().slice(0, 10)
    const between = (from, to) => all.filter((x) => x.date >= from && (!to || x.date < to))
    const students = (rows) => new Set(rows.map((r) => r.studentId)).size
    const rate = (rows) =>
      rows.length ? Math.round((rows.filter((r) => r.firstTry).length / rows.length) * 100) : 0
    // The median is cumulative, so its movement is where it stood a week ago.
    const medianBefore = (cut) => {
      const counts = ROSTER.map(
        (s) => all.filter((x) => x.studentId === s.id && x.date < cut).length,
      ).sort((a, b) => a - b)
      return counts[Math.floor(counts.length / 2)]
    }
    const now = between(day(7))
    const prev = between(day(14), day(7))
    return {
      words: now.length,
      collecting: students(now) - students(prev),
      median: medianBefore(day(0)) - medianBefore(day(7)),
      firstTry: rate(now) - rate(prev),
    }
  }, [])

  /* What a word says when you point at it. The wall's whole argument is that
     these came out of books rather than a list, so the card leads with the
     meaning the class was shown and names the title underneath. */
  const wordTip = (w) => {
    const entry = wordByName(w.text)
    const from = ALL_WORDS.find((x) => x.word === w.text)?.bookId
    const book = from ? BOOKS[from] : null
    return (
      <>
        <div className="ew-tip-head">
          <span className="ew-tip-word">{w.text}</span>
          {entry?.part && <span className="ew-tip-part">{entry.part}</span>}
        </div>
        {entry?.meaning && <p className="ew-tip-meaning">{entry.meaning}</p>}
        <p className="ew-tip-foot">
          <strong>
            {w.value} of {ROSTER.length}
          </strong>{' '}
          students{book ? ` · ${book.title}` : ''}
        </p>
      </>
    )
  }

  // A week belongs to the window if the Monday it starts on does.
  const trend = useMemo(() => CLASS_TREND.filter((w) => inRange(w.date, range)), [range])

  // Sentences students wrote in the "write your own" activity. Anything the
  // automatic check couldn't confidently take is a `flagged` row, and those
  // come first — the queue is the only part of this feature that asks a
  // teacher for time, so it has to be short and sorted by who needs a look.
  const queue = useMemo(() => {
    const all = [...written, ...WRITING_QUEUE]
    return [...all].sort((a, b) => (a.status === b.status ? 0 : a.status === 'flagged' ? -1 : 1))
  }, [written])

  /* Words collected per student inside the window — the roster's own totals
     when the window is the year, counted off the dated collections when it
     isn't. Everything below reads the class off this one list. */
  const roster = useMemo(() => {
    if (wholeYear) return ROSTER
    return ROSTER.map((s) => {
      const mine = since.filter((w) => w.studentId === s.id)
      const right = mine.filter((w) => w.firstTry).length
      return {
        ...s,
        words: mine.length,
        firstTry: mine.length ? Math.round((right / mine.length) * 100) : 0,
        last: mine.at(-1)?.word ?? '—',
      }
    })
  }, [wholeYear, since])

  const totals = useMemo(() => {
    const words = roster.reduce((n, s) => n + s.words, 0)
    const week = roster.reduce((n, s) => n + s.week, 0)
    const collecting = roster.filter((s) => (wholeYear ? s.week > 0 : s.words > 0)).length
    const sorted = roster.map((s) => s.words).sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    const withWords = roster.filter((s) => s.words > 0)
    const firstTry = withWords.length
      ? Math.round(withWords.reduce((n, s) => n + s.firstTry, 0) / withWords.length)
      : 0
    return { words, week, collecting, median, firstTry }
  }, [roster, wholeYear])

  // "This week" only means something in a window that runs up to today; in
  // last month's report the column would be this week's number under last
  // month's heading.
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
    rangeIsCurrent(range) && {
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
  ].filter(Boolean)

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
          onTint
          ariaLabel="Vocabulary reporting level"
          items={[
            { id: 'class', label: 'Class summary' },
            { id: 'students', label: 'By student', count: ROSTER.length },
          ]}
          className="ew-tabs"
        />
        <div className="ew-head-actions">
          <Button variant="secondary" size="sm" icon={<Icon name="download" size={16} />}>
            Export
          </Button>
          <Button variant="secondary" size="sm" icon={<Icon name="printer" size={16} />}>
            Print word wall
          </Button>
        </div>
      </header>

      {/* The page's own filter bar — a word is collected by logging a book, and
          a book is read *for* something, so "which challenge's words" is a cut
          of everything below rather than of one card. */}
      <FilterBar compact className="ew-filters">
        <FilterItem label="Challenge">
          <Select
            size="sm"
            aria-label="Which challenge's words"
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
          >
            <option value="all">All challenges</option>
            {CLASS_CHALLENGES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FilterItem>
        <FilterItem label="Dates">
          <Select
            size="sm"
            aria-label="Over what stretch of time"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            {WORD_RANGES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </Select>
        </FilterItem>
      </FilterBar>

      {tab === 'class' ? (
        <>
          {/* The shared stat tile — these sit inside a page
              that already has a heading and five cards under them, and a row
              of big centred numerals shouted over all of it. */}
          <div className="ew-stats">
            <StatCard
              value={totals.words.toLocaleString()}
              label={`Words collected ${rangePhrase}`}
              /* Only a window that runs up to today can say anything about the
                 last seven days. */
              trend={
                /* `suffix` rather than `format`, so the chip can print the
                   figure itself and still hover the whole sentence. */
                live
                  ? { delta: deltas.words, suffix: 'in the last 7 days', showValue: true }
                  : undefined
              }
              color={ACCENT}
            />
            <StatCard
              value={totals.collecting}
              unit={`/${ROSTER.length}`}
              label={wholeYear ? 'Students collecting this week' : 'Students who collected a word'}
              trend={
                live ? { delta: deltas.collecting, suffix: WEEK_OVER, showValue: true } : undefined
              }
              color="#0CA7BC"
            />
            <StatCard
              value={totals.median}
              label="Median words per student"
              trend={
                live ? { delta: deltas.median, suffix: WEEK_OVER, showValue: true } : undefined
              }
              color="#0BA85F"
            />
            <StatCard
              value={totals.firstTry}
              unit="%"
              label="Used correctly first try"
              trend={
                live
                  ? {
                      delta: deltas.firstTry,
                      format: (n) => `${n}%`,
                      suffix: WEEK_OVER,
                      showValue: true,
                    }
                  : undefined
              }
              color="#AB720A"
            />
          </div>

          <div className="ew-grid">
            <ChartCard
              title="The class word wall"
              subtitle={wallSub}
              accent={ACCENT}
              span={2}
              bodyPad="padded"
              className="ew-cloudcard"
            >
              {wallWords.length === 0 ? (
                <p className="ew-wall-empty">
                  No words {challengeName ? `from ${challengeName} ` : ''}
                  {wholeYear ? 'yet' : rangePhrase} — they turn up as the class logs the books.
                </p>
              ) : (
                <WordCloud
                  words={wallWords.map((w) => ({ text: w.word, value: w.students }))}
                  accent={ACCENT}
                  height="lg"
                  minSize={13}
                  maxSize={48}
                  animate
                  drift
                  tooltip={wordTip}
                  valueLabel={(w) => `${w.value} of ${ROSTER.length} students`}
                />
              )}
            </ChartCard>

            <ChartCard title="Where the words stop sticking" accent={ACCENT} bodyPad="padded">
              <BarList labelWidth={136} items={byActivity()} />
            </ChartCard>

            <ChartCard title="How the class is spread" accent={ACCENT} bodyPad="padded">
              <BarList labelWidth={92} items={distribution(roster)} />
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
                data={trend}
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
            rows={roster}
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
