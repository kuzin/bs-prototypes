import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import '@components/Button/Button.css'

import { BOOKS } from '../data'
import './WordUnlock.css'

// The unlock moment: a post-log overlay where Benny hands over one word from
// the book that was just logged, and the reader banks it by picking the sentence
// that uses it correctly.
//
// Three beats, deliberately short — the brief asks for "a brief, delightful
// interaction", not an assignment:
//   knock   Benny turns up with a sealed word card. One tap to open it.
//   card    The word, how to say it, what it means, and why it came from
//           this book — then the one check that banks it.
//   done    Collected. Count goes up, and the reader can keep going.

/** Deterministic shuffle so the right answer isn't always in the same slot. */
function shuffled(word) {
  const options = [
    { text: word.check.correct, correct: true },
    ...word.check.wrong.map((text) => ({ text, correct: false })),
  ]
  // Rotate by the word's length — stable across re-renders, varied across words.
  const by = word.word.length % options.length
  return [...options.slice(by), ...options.slice(0, by)]
}

export function WordUnlock({ open, word, bookId, collectedCount, onCollect, onClose, onSeeAll }) {
  const [stage, setStage] = useState('knock')
  const [picked, setPicked] = useState(null) // index of the option chosen
  const [misses, setMisses] = useState(0)

  useEffect(() => {
    if (!open) return
    setStage('knock')
    setPicked(null)
    setMisses(0)
  }, [open, word])

  const options = useMemo(() => (word ? shuffled(word) : []), [word])

  if (!open || !word) return null

  const book = bookId ? BOOKS[bookId] : null
  const source = book ? book.title : 'what you just read'

  function pick(i) {
    setPicked(i)
    if (options[i].correct) {
      // First-try accuracy is the signal the educator roll-up reports on.
      onCollect?.({ word: word.word, bookId, firstTry: misses === 0 })
      setTimeout(() => setStage('done'), 700)
    } else {
      setMisses((m) => m + 1)
    }
  }

  const wrongPick = picked !== null && !options[picked].correct

  return (
    <div className="wb-unlock" role="dialog" aria-modal="true" aria-label="A new word from Benny">
      <button className="wb-unlock-close" onClick={onClose} aria-label="Close">
        <Icon name="x" size={16} stroke={2.2} />
      </button>

      <div className="wb-unlock-inner">
        {stage === 'knock' && (
          <div className="wb-knock">
            <img src="/bs-prototypes/benny-excited.svg" alt="" className="wb-knock-benny" />
            <p className="wb-knock-kicker">Benny found something</p>
            <h1 className="wb-knock-h1">
              There’s a word hiding in <em>{source}</em>
            </h1>
            <p className="wb-knock-sub">
              Open it up and it’s yours to keep. Takes about ten seconds.
            </p>

            <button className="wb-envelope" onClick={() => setStage('card')}>
              <span className="wb-envelope-glow" aria-hidden="true" />
              <span className="wb-envelope-face">
                <Icon name="vocabulary" size={40} stroke={1.6} />
                <span className="wb-envelope-hint">Tap to open</span>
              </span>
            </button>
          </div>
        )}

        {stage === 'card' && (
          <div className="wb-card">
            <div className="wb-card-head">
              <span className="wb-card-kicker">
                <Icon name="sparkles" size={13} /> A new word from {source}
              </span>
              <h1 className="wb-word">{word.word}</h1>
              <p className="wb-word-say">
                {word.say} <span className="wb-word-part">· {word.part}</span>
              </p>
              <p className="wb-word-meaning">{word.meaning}</p>
            </div>

            <div className="wb-why">
              <img src="/bs-prototypes/benny-happy.svg" alt="" className="wb-why-benny" />
              <p className="wb-why-text">{word.why}</p>
            </div>

            <div className="wb-check">
              <p className="wb-check-prompt">
                Which sentence uses <strong>{word.word}</strong> the right way?
              </p>
              <div className="wb-check-options" role="radiogroup" aria-label="Pick a sentence">
                {options.map((o, i) => {
                  const isPicked = picked === i
                  const state = !isPicked ? '' : o.correct ? ' is-right' : ' is-wrong'
                  // A wrong pick is out of play; the right one is still choosable.
                  const spent = picked !== null && options[picked].correct
                  return (
                    <button
                      key={i}
                      role="radio"
                      aria-checked={isPicked}
                      className={`wb-option${state}`}
                      disabled={spent}
                      onClick={() => pick(i)}
                    >
                      <span className="wb-option-mark" aria-hidden="true">
                        {isPicked && (
                          <Icon name={o.correct ? 'check' : 'x'} size={14} stroke={2.6} />
                        )}
                      </span>
                      <span className="wb-option-text">{o.text}</span>
                    </button>
                  )
                })}
              </div>

              {wrongPick && (
                <p className="wb-nudge">
                  <img src="/bs-prototypes/benny-thinking.svg" alt="" className="wb-nudge-benny" />
                  Not that one — that sentence doesn’t match the meaning. Try another.
                </p>
              )}
            </div>
          </div>
        )}

        {stage === 'done' && (
          <div className="wb-done">
            <div className="wb-done-burst" aria-hidden="true">
              <img src="/bs-prototypes/benny-laughing.svg" alt="" className="wb-done-benny" />
            </div>
            <h1 className="wb-done-h1">
              <em>{word.word}</em> is yours
            </h1>
            <p className="wb-done-sub">
              That’s <strong>{collectedCount}</strong> words collected
              {misses === 0 ? ' — and you nailed that one first try.' : '. Nice recovery.'}
            </p>

            <div className="wb-done-card">
              <span className="wb-done-word">{word.word}</span>
              <span className="wb-done-meaning">{word.meaning}</span>
              {book && <span className="wb-done-from">from {book.title}</span>}
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={<Icon name="vocabulary" size={18} />}
              onClick={onSeeAll}
            >
              See My Words
            </Button>
            <button className="wb-done-skip" onClick={onClose}>
              Keep reading
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
