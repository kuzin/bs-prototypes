import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import '@components/Button/Button.css'

import { roundFor } from '../data'
import { Activity } from './Activities'
import './WordUnlock.css'

// The unlock moment: a post-log overlay where Benny hands over one word from
// the book that was just logged, and the reader banks it by working through a
// short round of activities.
//
// Three beats:
//   card    Benny hands the word over: what it is, how to say it, what it
//           means, and why it came from this book — on the dark ground, in the
//           big type, as a moment rather than a form. It used to be two
//           screens with a sealed card between them; the seal was a tap that
//           bought nothing, since the reader had just pressed a button saying a
//           word was coming. What the round will ask isn't announced here — the
//           rail above the activities already says where you are, and a list of
//           three instructions turned the moment into a briefing.
//   round   Three activities on that one word — recognise it, use it, produce
//           something with it. The word stays pinned above them: this is a
//           collection, not a test, so nothing here is hidden from the reader.
//           No step counter: three short goes don't need a progress bar, and
//           one made a game look like a form to be completed.
//   done    Collected.
//
// The round replaced a single multiple-choice question after reviewers watched
// a student use a vocabulary program that hit each word three to five times:
// one question banks a word the reader has already forgotten by the next log.

export function WordUnlock({
  open,
  word,
  bookId,
  collectedCount,
  // Which activities this round runs. Defaults to the word's own three; the
  // preview bar overrides it with a single type to demo one in isolation.
  round: roundOverride,
  onCollect,
  onClose,
  onSeeAll,
}) {
  const [stage, setStage] = useState('card')
  const [step, setStep] = useState(0)
  const [results, setResults] = useState([])
  // The rung the reader has just got right, held until they press Next. The
  // round used to advance on a timer, which took the screen away mid-read —
  // the answer they picked is worth a beat to look at, and on the writing rung
  // it took Benny's reply with it.
  const [cleared, setCleared] = useState(null)

  const round = useMemo(() => {
    if (!word) return []
    return roundOverride?.length ? roundOverride : roundFor(word)
  }, [word, roundOverride])

  useEffect(() => {
    if (!open) return
    setStage('card')
    setStep(0)
    setResults([])
    setCleared(null)
  }, [open, word])

  if (!open || !word) return null

  const firstTryAll = results.every((r) => r.firstTry)

  const last = step + 1 >= round.length

  function passed(result) {
    setCleared(result)
  }

  function next() {
    const all = [...results, cleared]
    setResults(all)
    setCleared(null)
    if (!last) {
      setStep((s) => s + 1)
      return
    }
    onCollect?.({
      word: word.word,
      bookId,
      firstTry: all.every((r) => r.firstTry),
      written: all.find((r) => r.written)?.written ?? null,
      flagged: all.some((r) => r.flagged),
    })
    setStage('done')
  }

  return (
    <div className="wb-unlock" role="dialog" aria-modal="true" aria-label="A new word from Benny">
      <button className="wb-unlock-close" onClick={onClose} aria-label="Close">
        <Icon name="x" size={16} stroke={2.2} />
      </button>

      <div className="wb-unlock-inner">
        {stage === 'card' && (
          <div className="wb-reveal">
            <img src="/bs-prototypes/benny-excited.svg" alt="" className="wb-reveal-benny" />
            <h1 className="wb-reveal-word">{word.word}</h1>
            <p className="wb-reveal-say">
              {word.say} <span className="wb-reveal-part">· {word.part}</span>
            </p>
            <p className="wb-reveal-meaning">{word.meaning}</p>
            <p className="wb-reveal-why">{word.why}</p>

            <Button
              variant="primary"
              size="lg"
              iconRight={<Icon name="arrow-right" size={18} />}
              onClick={() => setStage('round')}
            >
              Let’s go
            </Button>
          </div>
        )}

        {stage === 'round' && (
          <div className="wb-card">
            {/* The word stays put for the whole round: the point is to learn
                it, so hiding it would only make this an exam. Just the word,
                though — the meaning was either the answer to the rung on
                screen or a line the reader had already read on the way in. */}
            <header className="wb-pin">
              <div className="wb-pin-word">
                <h2 className="wb-pin-term">{word.word}</h2>
                <span className="wb-pin-part">{word.part}</span>
              </div>
            </header>

            <div className="wb-check">
              <Activity type={round[step]} word={word} bookId={bookId} onPass={passed} />

              {cleared && (
                <Button
                  variant="primary"
                  size="md"
                  className="wb-next"
                  iconRight={<Icon name="arrow-right" size={17} />}
                  onClick={next}
                >
                  {last ? 'Collect it' : 'Next'}
                </Button>
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
              {firstTryAll
                ? ` — and you got ${round.length === 1 ? 'that' : 'all ' + round.length} first try.`
                : '. Nice recovery.'}
            </p>

            <Button variant="primary" size="lg" onClick={onSeeAll}>
              See My Words
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
