import { Icon } from '@components/Icon/Icon'
import { Modal } from '@components/Modal/Modal'
import { Avatar } from '@components/Avatar/Avatar'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import '@components/Avatar/Avatar.css'
import '@components/Pill/Pill.css'
import '@components/ProgressBar/ProgressBar.css'

import { BOOKS, ROSTER, collectionFor, wordByName } from '../data'
import './StudentWords.css'

// The per-student half of the educator view — the same collection the student
// sees, plus the two numbers a teacher would actually ask about. Opens over the
// roster rather than navigating away, so comparing students stays cheap.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const prettyDate = (iso) => {
  const [, m, d] = iso.split('-')
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`
}

export function StudentWords({ studentId, onClose }) {
  const student = studentId ? ROSTER.find((s) => s.id === studentId) : null
  const collection = student ? [...collectionFor(student.id)].reverse() : []
  const classMedian = 22

  return (
    <Modal
      open={Boolean(student)}
      onClose={onClose}
      variant="side"
      ariaLabel={student ? `${student.name}'s words` : 'Student words'}
    >
      {student && (
        <div className="sw">
          <header className="sw-head">
            <Avatar initials={student.initials} color={student.color} size="lg" />
            <div className="sw-head-titles">
              <h2 className="sw-name">{student.name}</h2>
              <p className="sw-meta">
                {student.words} words · {student.logs} reading logs this year
              </p>
            </div>
            <button className="sw-close" onClick={onClose} aria-label="Close">
              <Icon name="x" size={16} stroke={2.2} />
            </button>
          </header>

          <div className="sw-stats">
            <div className="sw-stat">
              <span className="sw-stat-val">{student.words}</span>
              <span className="sw-stat-lbl">Words collected</span>
            </div>
            <div className="sw-stat">
              <span className="sw-stat-val">+{student.week}</span>
              <span className="sw-stat-lbl">This week</span>
            </div>
            <div className="sw-stat">
              <span className="sw-stat-val">{student.firstTry}%</span>
              <span className="sw-stat-lbl">First try</span>
            </div>
          </div>

          <div className="sw-compare">
            <div className="sw-compare-head">
              <span className="sw-compare-lbl">Against the class median</span>
              <Pill
                color={student.words >= classMedian ? '#16A34A' : '#D97706'}
                size="sm"
                variant="soft"
              >
                {student.words >= classMedian
                  ? `+${student.words - classMedian}`
                  : `${student.words - classMedian}`}{' '}
                words
              </Pill>
            </div>
            <ProgressBar
              value={student.words}
              max={Math.max(student.words, classMedian) + 6}
              color={student.color}
            />
            <p className="sw-compare-note">
              Class median is {classMedian} words. {student.name.split(' ')[0]} has logged{' '}
              {student.logs} times.
            </p>
          </div>

          <section className="sw-list-sec">
            <h3 className="sw-list-title">Words collected</h3>
            <ul className="sw-list">
              {collection.map((e) => {
                const word = wordByName(e.word)
                const book = e.bookId ? BOOKS[e.bookId] : null
                return (
                  <li key={`${e.word}-${e.date}`} className="sw-row">
                    <div className="sw-row-main">
                      <span className="sw-row-word">{e.word}</span>
                      {!e.firstTry && (
                        <span className="sw-row-retry" title="Took more than one try">
                          <Icon name="refresh" size={12} /> retried
                        </span>
                      )}
                    </div>
                    <p className="sw-row-meaning">{word?.meaning}</p>
                    <div className="sw-row-foot">
                      <span className="sw-row-from">
                        <Icon name="book" size={12} />
                        {book ? book.title : 'A book they logged'}
                      </span>
                      <span className="sw-row-date">{prettyDate(e.date)}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
      )}
    </Modal>
  )
}
