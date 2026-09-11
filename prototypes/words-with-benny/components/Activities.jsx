import { useMemo, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import '@components/Button/Button.css'

import {
  BOOKS,
  blankOptions,
  clozeFor,
  checkSentence,
  definitionOptions,
  passageFor,
  wordByName,
} from '../data'
import './WordUnlock.css'
import './Activities.css'

// The five ways Benny asks about a word. Every one takes the same props and
// reports the same thing, so the round that strings three of them together
// doesn't need to know which is which:
//
//   word     the word being collected
//   bookId   the title it came from, or null for a manual log
//   onPass   called once the activity is satisfied, with { firstTry }
//
// They share the option/nudge styling in WordUnlock.css — these are beats of
// the same card, not five different screens.

/* ── Shared furniture ─────────────────────────────────────────────────────── */

function Prompt({ children }) {
  return <p className="wb-check-prompt">{children}</p>
}

/* Benny saying "not that one" — so it's the design system's bubble, wearing
   his thinking face rather than the neutral avatar. */
function Nudge({ children }) {
  return (
    <BennyBubble avatar="/bs-prototypes/benny-thinking.svg" className="wb-nudge">
      {children}
    </BennyBubble>
  )
}

/**
 * The stacked-radio body three of the five share: pick one of n, a wrong pick
 * is marked and stays on screen, the right one is always still choosable.
 */
function Choices({ options, ariaLabel, onPass, missNote }) {
  const [picked, setPicked] = useState(null)
  const [misses, setMisses] = useState(0)

  function pick(i) {
    setPicked(i)
    if (options[i].correct) onPass({ firstTry: misses === 0 })
    else setMisses((m) => m + 1)
  }

  const spent = picked !== null && options[picked].correct
  const wrong = picked !== null && !options[picked].correct

  return (
    <>
      <div className="wb-check-options" role="radiogroup" aria-label={ariaLabel}>
        {options.map((o, i) => {
          const isPicked = picked === i
          const state = !isPicked ? '' : o.correct ? ' is-right' : ' is-wrong'
          return (
            <button
              key={o.text}
              role="radio"
              aria-checked={isPicked}
              className={`wb-option${state}`}
              disabled={spent}
              onClick={() => pick(i)}
            >
              <span className="wb-option-mark" aria-hidden="true">
                {isPicked && <Icon name={o.correct ? 'check' : 'x'} size={14} stroke={2.6} />}
              </span>
              <span className="wb-option-text">{o.text}</span>
            </button>
          )
        })}
      </div>
      {wrong && <Nudge>{missNote}</Nudge>}
    </>
  )
}

/* ── 1. Match the meaning ─────────────────────────────────────────────────── */
// The cheapest touch, and the one that goes first: can you still pick this word
// out of a line-up a minute after reading it?

export function DefinitionCheck({ word, onPass }) {
  const options = useMemo(() => definitionOptions(word), [word])
  return (
    <div className="wb-act">
      <Prompt>
        What does <strong>{word.word}</strong> mean?
      </Prompt>
      <Choices
        options={options}
        ariaLabel="Pick a meaning"
        onPass={onPass}
        missNote="Close, but that’s a different word’s meaning. Have another look."
      />
    </div>
  )
}

/* ── 2. Fill in the blank ─────────────────────────────────────────────────── */
// The same recognition rung from the other side: here is a sentence with a
// word-shaped hole, and three words that could go in it.

export function BlankFill({ word, onPass }) {
  const options = useMemo(() => blankOptions(word), [word])
  const [filled, setFilled] = useState(null)
  const [misses, setMisses] = useState(0)
  const cloze = useMemo(() => clozeFor(word), [word])
  const [before, after] = cloze.split('____')

  const done = filled !== null && options[filled].correct

  function pick(i) {
    setFilled(i)
    if (options[i].correct) onPass({ firstTry: misses === 0 })
    else setMisses((m) => m + 1)
  }

  const slotState = filled === null ? '' : done ? ' is-right' : ' is-wrong'

  return (
    <div className="wb-act">
      <Prompt>Which word fills the gap?</Prompt>
      <p className="wb-cloze">
        {before}
        <span className={`wb-slot${slotState}`}>
          {filled === null ? <span className="wb-slot-rule" /> : options[filled].text}
        </span>
        {after}
      </p>
      <div className="wb-chips" role="radiogroup" aria-label="Pick a word">
        {options.map((o, i) => (
          <button
            key={o.text}
            role="radio"
            aria-checked={filled === i}
            className={`wb-chip${filled === i ? (o.correct ? ' is-right' : ' is-wrong') : ''}`}
            disabled={done}
            onClick={() => pick(i)}
          >
            {o.text}
          </button>
        ))}
      </div>
      {filled !== null && !done && (
        <Nudge>That one doesn’t quite fit the sentence. Try another.</Nudge>
      )}
    </div>
  )
}

/* ── 3. Pick the right sentence ───────────────────────────────────────────── */
// The original activity, now one rung of the ladder rather than the whole
// interaction: three sentences, one of which actually uses the word right.

export function SentenceCheck({ word, onPass }) {
  const options = useMemo(() => {
    const all = [
      { text: word.check.correct, correct: true },
      ...word.check.wrong.map((text) => ({ text, correct: false })),
    ]
    const by = word.word.length % all.length
    return [...all.slice(by), ...all.slice(0, by)]
  }, [word])

  return (
    <div className="wb-act">
      <Prompt>
        Which sentence uses <strong>{word.word}</strong> the right way?
      </Prompt>
      <Choices
        options={options}
        ariaLabel="Pick a sentence"
        onPass={onPass}
        missNote="Not that one — that sentence doesn’t match the meaning. Try another."
      />
    </div>
  )
}

/* ── 4. Finish the passage ────────────────────────────────────────────────── */
// The one activity that puts several words next to each other. The new word
// shares the paragraph with the ones already banked from the same book, so the
// reader is being asked to tell them apart in context — which is the thing a
// single question can't get at.
//
// Drag works, but tap-then-tap is the primary interaction: it's what a student
// on a Chromebook trackpad or a tablet will actually do, and it's the path a
// keyboard can follow.

export function PassageDrag({ word, bookId, onPass }) {
  const { text, answers, tray } = useMemo(() => passageFor(bookId), [bookId])
  const [slots, setSlots] = useState(() => answers.map(() => null))
  const [held, setHeld] = useState(null) // a word picked up, waiting for a slot
  const [misses, setMisses] = useState(0)
  const [shake, setShake] = useState(null)

  const placed = new Set(slots.filter(Boolean))
  const solved = slots.every((s, i) => s === answers[i])

  function drop(slotIndex, candidate) {
    if (!candidate || solved) return
    if (candidate === answers[slotIndex]) {
      const next = slots.map((s, i) => (i === slotIndex ? candidate : s))
      setSlots(next)
      setHeld(null)
      if (next.every((s, i) => s === answers[i])) onPass({ firstTry: misses === 0 })
    } else {
      setMisses((m) => m + 1)
      setShake(slotIndex)
      setHeld(null)
      setTimeout(() => setShake(null), 420)
    }
  }

  // The passage is authored as one string with {0}-style slots, so it splits
  // into alternating prose and gaps.
  const pieces = text.split(/(\{\d\})/)
  const title = bookId && BOOKS[bookId] ? BOOKS[bookId].title : null

  return (
    <div className="wb-act">
      <Prompt>
        Put the words back where they belong{title ? ' — ' : ''}
        {title && <strong>{title}</strong>}
      </Prompt>

      <p className="wb-passage">
        {pieces.map((piece, i) => {
          const m = piece.match(/^\{(\d)\}$/)
          if (!m) return <span key={i}>{piece}</span>
          const slot = Number(m[1])
          const value = slots[slot]
          return (
            <button
              key={i}
              className={`wb-gap${value ? ' is-filled' : ''}${shake === slot ? ' is-off' : ''}${
                held && !value ? ' is-open' : ''
              }`}
              disabled={Boolean(value)}
              aria-label={value ? `Gap ${slot + 1}, ${value}` : `Empty gap ${slot + 1}`}
              onClick={() => drop(slot, held)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                drop(slot, e.dataTransfer.getData('text/plain'))
              }}
            >
              {value || <span className="wb-gap-rule" />}
            </button>
          )
        })}
      </p>

      <div className="wb-tray" role="group" aria-label="Words to place">
        {tray.map((t) => {
          const used = placed.has(t)
          // The word being collected today is marked, so the activity reads as
          // "here's your new one among the ones you already have" rather than
          // as a pop quiz on five words at once.
          const isNew = t === word.word
          return (
            <button
              key={t}
              draggable={!used}
              className={`wb-chip wb-chip--drag${held === t ? ' is-held' : ''}${
                used ? ' is-used' : ''
              }${isNew ? ' is-new' : ''}`}
              disabled={used || solved}
              aria-pressed={held === t}
              onClick={() => setHeld(held === t ? null : t)}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', t)
                setHeld(t)
              }}
              onDragEnd={() => setHeld(null)}
            >
              <Icon name="grip" size={13} />
              {t}
              {isNew && <span className="wb-chip-new">new</span>}
            </button>
          )
        })}
      </div>

      {!solved &&
        (misses > 0 ? (
          <Nudge>That word doesn’t belong in that gap. Read the sentence around it again.</Nudge>
        ) : (
          <p className="wb-hint">
            {held ? `Now tap the gap where “${held}” goes.` : 'Tap a word, then tap its gap.'}
          </p>
        ))}
    </div>
  )
}

/* ── 5. Write your own ────────────────────────────────────────────────────── */
// The top rung. Everything above it is recognition; this is the first one that
// asks the reader to produce the word themselves. Benny reads it back and
// either takes it or asks for another go — and anything the check isn't sure
// about goes to the teacher's queue rather than being marked wrong at a child.

export function SentenceWrite({ word, bookId, onPass }) {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [tries, setTries] = useState(0)
  const book = bookId ? BOOKS[bookId] : null

  function submit(e) {
    e.preventDefault()
    const verdict = checkSentence(text, word)
    setResult(verdict)
    if (verdict.verdict === 'retry') {
      setTries((t) => t + 1)
      return
    }
    onPass({ firstTry: tries === 0, written: text.trim(), flagged: verdict.verdict === 'flag' })
  }

  const settled = result && result.verdict !== 'retry'

  return (
    <form className="wb-act" onSubmit={submit}>
      <Prompt>
        Now write your own sentence using <strong>{word.word}</strong>.
      </Prompt>
      <p className="wb-write-hint">
        {book ? `It can be about ${book.title}, or about anything you like.` : 'Anything you like.'}
      </p>

      <textarea
        className={`wb-write${settled ? ' is-settled' : ''}`}
        value={text}
        rows={3}
        disabled={Boolean(settled)}
        placeholder={`Write a sentence with “${word.word}” in it…`}
        onChange={(e) => setText(e.target.value)}
        aria-label={`Your sentence using ${word.word}`}
      />

      {result && (
        <p className={`wb-verdict is-${result.verdict}`}>
          <img
            src={
              result.verdict === 'retry'
                ? '/bs-prototypes/benny-thinking.svg'
                : '/bs-prototypes/benny-happy.svg'
            }
            alt=""
            className="wb-verdict-benny"
          />
          <span>{result.note}</span>
        </p>
      )}

      {!settled && (
        <Button variant="primary" size="md" type="submit" disabled={!text.trim()}>
          Show Benny
        </Button>
      )}
    </form>
  )
}

/* ── The dispatcher ───────────────────────────────────────────────────────── */

const BY_TYPE = {
  definition: DefinitionCheck,
  blank: BlankFill,
  sentence: SentenceCheck,
  passage: PassageDrag,
  write: SentenceWrite,
}

export function Activity({ type, word, bookId, onPass }) {
  const Component = BY_TYPE[type] ?? DefinitionCheck
  const resolved = typeof word === 'string' ? wordByName(word) : word
  if (!resolved) return null
  // Keyed on the type so switching rungs remounts — each activity owns its own
  // picked/missed state and must not inherit the last one's.
  return <Component key={type} word={resolved} bookId={bookId} onPass={onPass} />
}
