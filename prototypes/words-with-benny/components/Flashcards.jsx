import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import '@components/Button/Button.css'

import { BOOKS, boxInfo, dueCards, wordByName } from '../data'
import './Flashcards.css'

// The collection, turned round. Everything else in this prototype pushes words
// *into* the collection; this is the one surface that hands them back — a deck
// built from the words the reader already owns, led by the ones going stale.
//
// The scheduling is Leitner: a word the reader knows moves up a box and isn't
// asked again for twice as long; a word they miss goes back to box one and
// comes round tomorrow. That's why the collection can keep growing without the
// early words quietly falling out of it.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const prettyDate = (iso) => {
  const [, m, d] = iso.split('-')
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`
}

const nextUpIn = (box) => {
  const days = boxInfo(box).days
  return days === 1 ? 'tomorrow' : `in ${days} days`
}

/** The strip that sits above the collection and says the deck is waiting. */
export function ReviewStrip({ cards, onStart }) {
  const due = dueCards(cards).length
  const total = Object.keys(cards).length
  const known = Object.values(cards).filter((c) => c.box >= 4).length

  return (
    <div className={`fc-strip${due ? '' : ' is-clear'}`}>
      <span className="fc-strip-art" aria-hidden="true">
        <Icon name="layers" size={22} stroke={1.9} />
      </span>
      <div className="fc-strip-copy">
        <p className="fc-strip-lead">
          {due
            ? `${due} ${due === 1 ? 'word is' : 'words are'} ready for another look`
            : 'Deck’s all caught up'}
        </p>
        <p className="fc-strip-sub">
          {due
            ? 'Flip through them and I’ll space the ones you know further apart.'
            : `${known} of your ${total} words are sticking. I’ll bring the rest back as they come due.`}
        </p>
      </div>
      <Button variant={due ? 'primary' : 'secondary'} size="md" onClick={onStart}>
        {due ? `Review ${due}` : 'Study anyway'}
      </Button>
    </div>
  )
}

/** One card. Front is the word alone; the back is everything the reader banked. */
function Card({ word, entry, flipped, onFlip }) {
  const book = entry?.bookId ? BOOKS[entry.bookId] : null
  return (
    <button
      className={`fc-card${flipped ? ' is-flipped' : ''}`}
      onClick={onFlip}
      aria-label={
        flipped ? `${word.word}: ${word.meaning}` : `${word.word}. Tap to see the meaning`
      }
    >
      <span className="fc-card-inner">
        <span className="fc-face fc-face--front">
          <span className="fc-front-word">{word.word}</span>
          <span className="fc-front-hint">
            <Icon name="refresh" size={13} /> Tap to flip
          </span>
        </span>

        <span className="fc-face fc-face--back">
          <span className="fc-back-say">
            {word.say} <em>· {word.part}</em>
          </span>
          <span className="fc-back-meaning">{word.meaning}</span>
          <span className="fc-back-example">“{word.check.correct}”</span>
          {book && (
            <span className="fc-back-from">
              <Icon name="book" size={13} /> {book.title}
              {entry?.date ? ` · collected ${prettyDate(entry.date)}` : ''}
            </span>
          )}
        </span>
      </span>
    </button>
  )
}

export function Flashcards({ open, cards, collection, onGrade, onClose }) {
  // The deck is fixed at the moment it's opened — grading a card must not
  // reshuffle the pile under the reader mid-session.
  const deck = useMemo(() => {
    if (!open) return []
    const due = dueCards(cards)
    return (due.length ? due : Object.values(cards)).map((c) => c.word)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [tally, setTally] = useState({ knew: [], missed: [] })

  useEffect(() => {
    if (!open) return
    setI(0)
    setFlipped(false)
    setTally({ knew: [], missed: [] })
  }, [open])

  // Space flips, ← / → grade. A deck you have to reach for the mouse on is a
  // deck nobody gets through twenty cards of.
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') return onClose()
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setFlipped((f) => !f)
      }
      if (!flipped) return
      if (e.key === 'ArrowRight') grade(true)
      if (e.key === 'ArrowLeft') grade(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!open) return null

  const name = deck[i]
  const word = name ? wordByName(name) : null
  const card = name ? cards[name] : null
  const entry = name ? collection.find((e) => e.word === name) : null
  const finished = i >= deck.length

  function grade(knewIt) {
    onGrade?.(name, knewIt)
    setTally((t) => ({
      knew: knewIt ? [...t.knew, name] : t.knew,
      missed: knewIt ? t.missed : [...t.missed, name],
    }))
    setFlipped(false)
    setI((n) => n + 1)
  }

  return (
    <div className="fc" role="dialog" aria-modal="true" aria-label="Flashcards">
      <button className="fc-close" onClick={onClose} aria-label="Close flashcards">
        <Icon name="x" size={16} stroke={2.2} />
      </button>

      {!finished && word && (
        <div className="fc-stage">
          <Card
            key={name}
            word={word}
            entry={entry}
            flipped={flipped}
            onFlip={() => setFlipped((f) => !f)}
          />

          {flipped ? (
            <div className="fc-grade">
              <button className="fc-grade-btn fc-grade-btn--miss" onClick={() => grade(false)}>
                <Icon name="refresh" size={17} stroke={2.1} />
                Still learning
                <em>back tomorrow</em>
              </button>
              <button className="fc-grade-btn fc-grade-btn--knew" onClick={() => grade(true)}>
                <Icon name="check" size={17} stroke={2.6} />
                Got it
                <em>back {nextUpIn(Math.min((card?.box ?? 1) + 1, 5))}</em>
              </button>
            </div>
          ) : (
            <p className="fc-prod">
              Say what it means out loud, then flip it over.
              <span className="fc-keys">
                <kbd>space</kbd> flip · <kbd>←</kbd> still learning · <kbd>→</kbd> got it
              </span>
            </p>
          )}
        </div>
      )}

      {finished && (
        <div className="fc-summary">
          <img src="/bs-prototypes/benny-laughing.svg" alt="" className="fc-summary-benny" />
          <h1 className="fc-summary-h1">
            {tally.knew.length} of {deck.length} still with you
          </h1>
          <p className="fc-summary-sub">
            {tally.missed.length === 0
              ? 'Every single one. Those all move further out before I ask again.'
              : `I’ll bring ${tally.missed.length === 1 ? 'the other one' : `the other ${tally.missed.length}`} back tomorrow while ${tally.missed.length === 1 ? 'it’s' : 'they’re'} still fresh.`}
          </p>

          {tally.missed.length > 0 && (
            <div className="fc-summary-list">
              <p className="fc-summary-lbl">Coming back tomorrow</p>
              <div className="fc-summary-words">
                {tally.missed.map((m) => (
                  <span key={m} className="fc-summary-word">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button variant="primary" size="lg" onClick={onClose}>
            Back to my words
          </Button>
        </div>
      )}

      {/* How far through the deck, at the foot of the screen: the card is what
          the reader is looking at, and a counter over the top of it competes
          for the same attention. The summary replaces it rather than sitting
          under it — by then there's no progress left to report. */}
      {!finished && (
        <footer className="fc-foot">
          <div className="fc-bar" aria-hidden="true">
            <span style={{ width: `${(Math.min(i, deck.length) / deck.length) * 100}%` }} />
          </div>
          <div className="fc-count">
            {i + 1} of {deck.length}
          </div>
        </footer>
      )}
    </div>
  )
}
