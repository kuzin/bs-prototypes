import { Icon } from '@components/Icon/Icon'
import { Ic } from '@components/ui'
import { Hero } from '@components/Hero/Hero'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import '@components/Hero/Hero.css'
import '@components/Pill/Pill.css'
import '@components/ProgressBar/ProgressBar.css'

// Built out of the Student Profile's own page furniture — `.bp-content` for the
// page padding, `Hero` for the section header, `Card` + `SectionHeading` for the
// blocks — so this section is laid out like every other section of the profile
// rather than like the panel it replaced.
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

export function StudentVocabulary({ studentId }) {
  const person = ROSTER.find((s) => s.id === studentId)
  if (!person) return null

  const collection = [...collectionFor(person.id)].reverse()
  const first = person.name.split(' ')[0]
  const ahead = person.words >= CLASS_MEDIAN

  const stats = [
    { value: person.words, label: 'Words collected' },
    { value: `+${person.week}`, label: 'This week' },
    { value: `${person.firstTry}%`, label: 'Right on the first try' },
    { value: person.logs, label: 'Reading logs' },
  ]

  return (
    <div className="bp-content">
      <Hero
        icon={<Ic name="ti-vocabulary" />}
        title="Vocabulary"
        accent={ACCENT}
        accentBg={ACCENT_BG}
      />

      <p className="svo-intro">
        Words {first} collected by reading. Benny surfaces one every couple of logs; {first} earns
        it by using it correctly — nothing here was assigned.
      </p>

      <div className="svo-stats">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="svo-stat">
              <span className="svo-stat-val">{s.value}</span>
              <span className="svo-stat-lbl">{s.label}</span>
            </div>
          </Card>
        ))}
      </div>

      <SectionHeading>Against the class median</SectionHeading>
      <Card>
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

      <SectionHeading>Words collected</SectionHeading>
      <div className="svo-list">
        {collection.map((e) => {
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
