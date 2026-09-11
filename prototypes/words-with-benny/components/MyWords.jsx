import { useMemo, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import { StatCard } from '@components/Cards/Cards'
import { EmptyState, Tooltip } from '@components/Primitives/Primitives'
import '@components/Tabs/Tabs.css'
import '@components/Cards/Cards.css'
import '@components/Primitives/Primitives.css'

import { BOOKS, KNOWN_BANDS, bandFor, boxInfo, wordByName } from '../data'
import { ReviewStrip } from './Flashcards'
import './MyWords.css'

// The filter is a pill Tabs strip rather than a dropdown: only four choices,
// the counts are worth seeing without opening anything, and a segmented control
// is what this repo uses for a view switcher. The bands themselves live in
// data.js, shared with the tile tags so both say the same words.
const FILTERS = [{ id: 'all', label: 'All words' }, ...KNOWN_BANDS]

/** When the deck will ask for this word again — the one fact the dot's colour
 *  doesn't already carry. (Naming the box as well just said the band twice.) */
const dueIn = (box) => {
  const days = boxInfo(box).days
  return days === 1 ? 'tomorrow' : `in ${days} days`
}

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
            /* A dot, not a pill. Where a word stands is the tile's least
               important fact — it's a glance across the whole grid, not a
               label to read one at a time — and a filled pill next to every
               word was competing with the word itself. */
            <Tooltip content={`${bandFor(card.box).label} — back in your deck ${dueIn(card.box)}`}>
              <span
                className={`mw-tile-dot mw-tile-dot--${bandFor(card.box).id}`}
                role="img"
                aria-label={bandFor(card.box).label}
              />
            </Tooltip>
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
  const [band, setBand] = useState('all')

  // Newest first — a collection reads like a log, most recent at the top.
  const ordered = useMemo(() => [...collection].reverse(), [collection])

  const inBand = (entry, id) => {
    const boxes = FILTERS.find((k) => k.id === id)?.boxes
    return !boxes || boxes.includes(cards[entry.word]?.box ?? 1)
  }

  const tabs = useMemo(
    () =>
      FILTERS.map((k) => ({
        id: k.id,
        label: k.label,
        count: ordered.filter((e) => inBand(e, k.id)).length,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ordered, cards],
  )

  const shown = useMemo(
    () => ordered.filter((e) => inBand(e, band)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ordered, band, cards],
  )

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

      {/* The design system's tinted stat, not a hand-rolled copy of it — this
          row was the same shape (wash, icon chip, figure over label) written
          out locally, at its own smaller type. */}
      <div className="mw-stats">
        {[
          { label: 'Words collected', value: collection.length, icon: 'vocabulary', c: '#5B21B6' },
          {
            label: 'Collected this week',
            value: thisWeek,
            icon: 'calendar-event',
            c: '#0B6B78',
          },
          { label: 'Books they came from', value: books, icon: 'book', c: '#075985' },
          { label: 'Aced with no misses', value: `${firstTry}%`, icon: 'check', c: '#166534' },
        ].map((s) => (
          <StatCard
            key={s.label}
            variant="tinted"
            icon={<Icon name={s.icon} size={19} />}
            value={s.value}
            label={s.label}
            color={s.c}
          />
        ))}
      </div>

      {ordered.length > 0 && (
        <Tabs
          variant="pill"
          size="md"
          block
          active={band}
          onChange={setBand}
          accent="#7C3AED"
          ariaLabel="Filter words by how well they're known"
          className="mw-filters"
          items={tabs}
        />
      )}

      {ordered.length === 0 ? (
        <EmptyState
          variant="dashed"
          icon={<Icon name="vocabulary" size={26} />}
          title="No words yet"
          description="Log some reading and Benny will hand you a word from what you read."
        />
      ) : shown.length === 0 ? (
        <EmptyState
          variant="dashed"
          icon={<Icon name="vocabulary" size={26} />}
          title="Nothing here yet"
          description="No words have reached this stage — keep going through the deck and they'll move up."
        />
      ) : (
        <div className="mw-grid">
          {shown.map((e) => (
            <WordTile key={e.word} entry={e} isNew={e.word === newestWord} card={cards[e.word]} />
          ))}
        </div>
      )}
    </div>
  )
}
