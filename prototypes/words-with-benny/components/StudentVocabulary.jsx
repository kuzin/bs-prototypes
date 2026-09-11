import { useMemo, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Ic } from '@components/ui'
import { Hero } from '@components/Hero/Hero'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { Tabs } from '@components/Tabs/Tabs'
import '@components/Hero/Hero.css'
import '@components/Pill/Pill.css'
import '@components/ProgressBar/ProgressBar.css'
import '@components/Tabs/Tabs.css'

// Built out of the Student Profile's own page furniture — `.bp-content` for the
// page padding, `Hero` for the section header, `Card` / `SectionHeading` for the
// blocks, and its `StatRow` inside a `bp-statlist` card for the figures — so
// this section is laid out like every other section of the profile rather than
// like the panel it replaced.
import { StatRow } from '../../student-profile/BeanstackProfile'
import { Card, SectionHeading } from '../../student-profile/components/kit'

import { BOOKS, ROSTER, collectionFor, wordByName } from '../data'
import './StudentVocabulary.css'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const prettyDate = (iso) => {
  const [, m, d] = iso.split('-')
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`
}

const CLASS_MEDIAN = 22
const ACCENT = '#7C3AED'
const ACCENT_BG = '#F3E8FF'
// StatRow's icon chip takes the same {bg, text} shape the profile's own
// SECTION_ACCENT entries use.
const CHIP = { bg: ACCENT_BG, text: ACCENT }

// The heading over the word list is a segmented control instead, filtering on
// the one thing about a collected word a teacher can act on: did it stick the
// first time, or did it take another go. It's the same split the "Right on the
// first try" figure above reports, so the list can now answer the question that
// figure raises — which words were they?
const CUTS = [
  { id: 'all', label: 'All words' },
  { id: 'first', label: 'First try', keep: (e) => e.firstTry },
  { id: 'retried', label: 'Took another go', keep: (e) => !e.firstTry },
]

export function StudentVocabulary({ studentId }) {
  const [cut, setCut] = useState('all')
  const person = ROSTER.find((s) => s.id === studentId)
  const collection = useMemo(
    () => (person ? [...collectionFor(person.id)].reverse() : []),
    [person],
  )
  const tabs = useMemo(
    () =>
      CUTS.map((c) => ({
        id: c.id,
        label: c.label,
        count: c.keep ? collection.filter(c.keep).length : collection.length,
      })),
    [collection],
  )
  const shown = useMemo(() => {
    const keep = CUTS.find((c) => c.id === cut)?.keep
    return keep ? collection.filter(keep) : collection
  }, [collection, cut])

  if (!person) return null
  const first = person.name.split(' ')[0]
  const ahead = person.words >= CLASS_MEDIAN

  const stats = [
    { key: 'words', icon: 'vocabulary', label: 'Words collected', value: person.words },
    { key: 'week', icon: 'calendar-event', label: 'Collected this week', value: `+${person.week}` },
    { key: 'first', icon: 'check', label: 'Right on the first try', value: `${person.firstTry}%` },
    { key: 'logs', icon: 'notebook', label: 'Reading logs', value: person.logs },
  ]

  return (
    <div className="bp-content">
      <Hero
        icon={<Ic name="ti-vocabulary" />}
        title="Vocabulary"
        accent={ACCENT}
        accentBg={ACCENT_BG}
      />

      {/* `pcard bp-card bp-statlist` is the profile's own literal for this block
          (see OverviewStats) — `pcard` is the class carrying the white ground,
          the hairline and the radius, so without it the card had no chrome at
          all and the rows sat loose on the page. */}
      <div className="pcard bp-card bp-statlist">
        <div className="bp-statlist-head">
          <SectionHeading>At a glance</SectionHeading>
          <span className="bp-statlist-note">This school year</span>
        </div>
        {stats.map((s) => (
          <StatRow key={s.key} icon={s.icon} accent={CHIP} label={s.label}>
            <span className="bp-statrow-value">{s.value}</span>
          </StatRow>
        ))}
      </div>

      {/* The profile's own convention: a section heading lives inside the card
          it titles, where it picks up the card's header rule. A heading loose
          between two cards sits in `.bp-content`'s flex gap and reads as
          belonging to the card above it. */}
      <Card>
        <SectionHeading>Against the class median</SectionHeading>
        <div className="svo-compare">
          <div className="svo-compare-head">
            <span className="svo-compare-lbl">{person.words} words collected</span>
            <Pill color={ahead ? '#16A34A' : '#D97706'} size="sm" variant="soft">
              {ahead ? '+' : ''}
              {person.words - CLASS_MEDIAN} vs. median
            </Pill>
          </div>
          <ProgressBar
            value={person.words}
            max={Math.max(person.words, CLASS_MEDIAN) + 6}
            color={ACCENT}
          />
          <p className="svo-compare-note">
            Class median is {CLASS_MEDIAN} words. {first} has logged {person.logs} times this year.
          </p>
        </div>
      </Card>

      <Tabs
        variant="pill"
        size="md"
        block
        active={cut}
        onChange={setCut}
        accent={ACCENT}
        ariaLabel="Which words to show"
        className="svo-cuts"
        items={tabs}
      />
      <div className="svo-list">
        {shown.map((e) => {
          const word = wordByName(e.word)
          const book = e.bookId ? BOOKS[e.bookId] : null
          return (
            <Card key={`${e.word}-${e.date}`}>
              <div className="svo-row">
                <div className="svo-row-main">
                  <span className="svo-row-word">{e.word}</span>
                  {!e.firstTry && (
                    <span className="svo-row-retry" title="Took more than one try">
                      <Icon name="refresh" size={12} /> retried
                    </span>
                  )}
                  <span className="svo-row-date">{prettyDate(e.date)}</span>
                </div>
                <p className="svo-row-meaning">{word?.meaning}</p>
                <span className="svo-row-from">
                  <Icon name="book" size={12} />
                  {book ? book.title : 'A book they logged'}
                </span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
