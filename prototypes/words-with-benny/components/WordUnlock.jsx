import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import '@components/Button/Button.css'

import { BOOKS, activityType, roundFor } from '../data'
import { Activity } from './Activities'
import './WordUnlock.css'

// The unlock moment: a post-log overlay where Benny hands over one word from
// the book that was just logged, and the reader banks it by working through a
// short round of activities.
//
// Four beats:
//   knock   Benny turns up with a sealed word card. One tap to open it.
//   card    The word, how to say it, what it means, and why it came from
//           this book.
//   round   Three activities on that one word — recognise it, use it, produce
//           something with it. The word stays pinned above them: this is a
//           collection, not a test, so nothing here is hidden from the reader.
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
  const [stage, setStage] = useState('knock')
  const [step, setStep] = useState(0)
  const [results, setResults] = useState([])

  const round = useMemo(() => {
    if (!word) return []
    return roundOverride?.length ? roundOverride : roundFor(word)
  }, [word, roundOverride])

  useEffect(() => {
    if (!open) return
    setStage('knock')
    setStep(0)
    setResults([])
  }, [open, word])

  if (!open || !word) return null

  const book = bookId ? BOOKS[bookId] : null
  const source = book ? book.title : 'what you just read'
  const firstTryAll = results.every((r) => r.firstTry)

  function passed(result) {
    const all = [...results, result]
    setResults(all)
    const last = step + 1 >= round.length
    setTimeout(
      () => {
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
      },
      result.written ? 1100 : 650,
    )
  }

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
              {round.length === 1
                ? 'Open it up, work it out, and it’s yours to keep.'
                : `Open it up, work it out ${round.length} ways, and it’s yours to keep.`}
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

            {/* What's coming, before it arrives. A reader who can see the three
                rungs knows the round ends — an open-ended quiz doesn't. */}
            <div className="wb-plan">
              <p className="wb-plan-lead">
                {round.length === 1
                  ? 'One thing to do, then it’s yours:'
                  : `${round.length} quick goes and ${word.word} is yours:`}
              </p>
              <ol className="wb-plan-list">
                {round.map((id, i) => {
                  const type = activityType(id)
                  return (
                    <li key={id} className="wb-plan-item">
                      <span className="wb-plan-num">{i + 1}</span>
                      <span className="wb-plan-copy">
                        <span className="wb-plan-label">{type.label}</span>
                        <span className="wb-plan-blurb">{type.blurb}</span>
                      </span>
                    </li>
                  )
                })}
              </ol>
            </div>

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
                it, so hiding it would only make this an exam. The meaning rides
                along too — except on the one activity that asks for it, where
                leaving it up there would answer the question. */}
            <header className="wb-pin">
              <div className="wb-pin-word">
                <h2 className="wb-pin-term">{word.word}</h2>
                <span className="wb-pin-part">{word.part}</span>
              </div>
              {round[step] !== 'definition' && <p className="wb-pin-meaning">{word.meaning}</p>}
            </header>

            <div className="wb-rail" aria-label={`Step ${step + 1} of ${round.length}`}>
              {round.map((id, i) => {
                const state = i < step ? ' is-done' : i === step ? ' is-now' : ''
                const missed = results[i] && !results[i].firstTry
                return (
                  <span key={id} className={`wb-rail-step${state}`}>
                    <span className="wb-rail-dot">
                      {i < step && (
                        <Icon name={missed ? 'refresh' : 'check'} size={11} stroke={3} />
                      )}
                    </span>
                    <span className="wb-rail-label">{activityType(id).short}</span>
                  </span>
                )
              })}
            </div>

            <div className="wb-check">
              <Activity type={round[step]} word={word} bookId={bookId} onPass={passed} />
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

            <div className="wb-done-card">
              <span className="wb-done-word">{word.word}</span>
              <span className="wb-done-meaning">{word.meaning}</span>
              {book && <span className="wb-done-from">from {book.title}</span>}
            </div>

            {/* The word doesn't stop here — saying when it comes back is what
                makes the deck in My Collections feel like it's for something. */}
            <p className="wb-done-next">
              <Icon name="layers" size={14} />
              I’ll bring this one back to your flashcards tomorrow.
            </p>

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
