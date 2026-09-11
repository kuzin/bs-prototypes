import { useMemo } from 'react'
import { Icon } from '@components/Icon/Icon'
import { EmptyState } from '@components/Primitives/Primitives'
import '@components/Primitives/Primitives.css'

import { BOOKS, boxInfo, wordByName } from '../data'
import { ReviewStrip } from './Flashcards'
import './MyWords.css'

// The personal vocabulary collection — the brief's "growing personal record of
// unlocked words, analogous to a reading log". It's the Words pane of the
// Collections tab, so it owns no page header: <Collections> supplies the title
// and the sub-tab strip.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function prettyDate(iso) {
  const [, m, d] = iso.split('-')
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`
}

/**
 * One collected word. `isNew` gives the word just banked a moment of its own;
 * `card` is where the review deck currently has it, which is the difference
 * between a collection and a list — a word here is either sticking or slipping.
 */
export function WordTile({ entry, isNew, card }) {
  const word = wordByName(entry.word)
  const book = entry.bookId ? BOOKS[entry.bookId] : null
  if (!word) return null
  return (
    <article className={`mw-tile${isNew ? ' is-new' : ''}`}>
      <header className="mw-tile-head">
        <h3 className="mw-tile-word">{word.word}</h3>
        {isNew ? (
          <span className="mw-tile-new">New</span>
        ) : (
          card && (
            <span
              className={`mw-tile-box mw-tile-box--${card.box}`}
              title={`Review box ${card.box} of 5`}
            >
              {boxInfo(card.box).label}
            </span>
          )
        )}
      </header>
      <p className="mw-tile-say">
        {word.say} <span className="mw-tile-part">· {word.part}</span>
      </p>
      <p className="mw-tile-meaning">{word.meaning}</p>
      <footer className="mw-tile-foot">
        <span className="mw-tile-from">
          <Icon name="book" size={13} />
          <span className="mw-tile-from-name">{book ? book.title : 'A book you logged'}</span>
        </span>
        <span className="mw-tile-date">{prettyDate(entry.date)}</span>
      </footer>
    </article>
  )
}

export function MyWords({ collection, newestWord, cards = {}, onReview }) {
  // Newest first — a collection reads like a log, most recent at the top.
  const ordered = useMemo(() => [...collection].reverse(), [collection])

  const thisWeek = collection.filter((e) => e.date >= '2026-06-20').length
  const firstTry = collection.length
    ? Math.round((collection.filter((e) => e.firstTry).length / collection.length) * 100)
    : 0
  const books = new Set(collection.filter((e) => e.bookId).map((e) => e.bookId)).size

  return (
    <div className="mw">
      {/* The collection is also the deck. It leads, because a word revisited is
          worth more than the next word collected — the whole reason the deck
          exists is that reviewers pointed out one interaction doesn't stick. */}
      {onReview && <ReviewStrip cards={cards} onStart={onReview} />}

      {/* Same shape as the Reading Log's streak blocks next door — a flat
          tinted panel with the icon beside the figure, not a bordered card. */}
      <div className="mw-stats">
        {[
          { tone: 'words', label: 'Words collected', value: collection.length, icon: 'vocabulary' },
          { tone: 'week', label: 'Collected this week', value: thisWeek, icon: 'calendar-event' },
          { tone: 'books', label: 'Books they came from', value: books, icon: 'book' },
          { tone: 'first', label: 'Aced with no misses', value: `${firstTry}%`, icon: 'check' },
        ].map((s) => (
          <div key={s.label} className={`mw-stat mw-stat--${s.tone}`}>
            <Icon name={s.icon} size={20} />
            <div>
              <div className="mw-stat-num">{s.value}</div>
              <div className="mw-stat-lbl">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {ordered.length === 0 ? (
        <EmptyState
          variant="dashed"
          icon={<Icon name="vocabulary" size={26} />}
          title="No words yet"
          description="Log some reading and Benny will hand you a word from what you read."
        />
      ) : (
        <div className="mw-grid">
          {ordered.map((e) => (
            <WordTile key={e.word} entry={e} isNew={e.word === newestWord} card={cards[e.word]} />
          ))}
        </div>
      )}
    </div>
  )
}
