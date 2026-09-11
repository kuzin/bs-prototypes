import { useMemo, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import '@components/Button/Button.css'

import {
  BOOKS,
  blankOptions,
  cardDeck,
  clozeFor,
  checkSentence,
  definitionOptions,
  arrange,
  oddOneOut,
  pairsFor,
  passageFor,
  synonymOptions,
  wordByName,
} from '../data'
import './WordUnlock.css'
import './Activities.css'

// The nine ways Benny asks about a word. Every one takes the same props and
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
 * A sentence with the vocab word picked out in bold. Every option in the
 * odd-one-out is now a sentence about the same word, so without this the reader
 * has to hunt for it four times over before they can start judging anything.
 * The pattern is stem-based on purpose: the misuse sentences lean on inflected
 * forms ("bargained", "tyranted") that a whole-word match would walk past — and
 * a trailing y goes too, since that's the letter the inflections eat
 * ("melancholy" turns up as "melancholied", "prodigy" as "prodigied").
 */
function Marked({ text, word }) {
  const stem = word.replace(/[sy]$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${stem}[a-z\u2019']*)`, 'gi'))
  return parts.map((part, i) =>
    i % 2 ? (
      <strong key={i} className="wb-marked">
        {part}
      </strong>
    ) : (
      part
    ),
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

/* Takes no `word`: the passage is about the book, and every gap in it matters
   equally — singling out today's word told the reader which one to place first. */
export function PassageDrag({ bookId, onPass }) {
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
          return (
            <button
              key={t}
              draggable={!used}
              className={`wb-chip wb-chip--drag${held === t ? ' is-held' : ''}${
                used ? ' is-used' : ''
              }`}
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
            </button>
          )
        })}
      </div>

      {!solved && misses > 0 && (
        <Nudge>That word doesn’t belong in that gap. Read the sentence around it again.</Nudge>
      )}
    </div>
  )
}

/* ── 5. Write your own ────────────────────────────────────────────────────── */
// The top rung. Everything above it is recognition; this is the first one that
// asks the reader to produce the word themselves. Benny reads it back and
// either takes it or asks for another go — and anything the check isn't sure
// about goes to the teacher's queue rather than being marked wrong at a child.

/* Takes no `bookId` — it's the one activity that never names the book. The
   dispatcher passes it regardless, which is the point of the uniform contract. */
export function SentenceWrite({ word, onPass }) {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [tries, setTries] = useState(0)

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

/* ── 6. Find the near-match ───────────────────────────────────────────────── */
// The recognition rung from a third angle: not what it means in a sentence, but
// which word you already own that sits closest to it.

export function SynonymCheck({ word, onPass }) {
  const options = useMemo(() => synonymOptions(word), [word])
  return (
    <div className="wb-act">
      <Prompt>
        Which word means almost the same as <strong>{word.word}</strong>?
      </Prompt>
      <div className="wb-chips wb-chips--wide" role="radiogroup" aria-label="Pick a word">
        <ChipChoices options={options} onPass={onPass} />
      </div>
    </div>
  )
}

/** The chip row three activities share — same contract as <Choices>. */
function ChipChoices({ options, onPass }) {
  const [picked, setPicked] = useState(null)
  const [misses, setMisses] = useState(0)
  const done = picked !== null && options[picked].correct

  return (
    <>
      {options.map((o, i) => (
        <button
          key={o.text}
          role="radio"
          aria-checked={picked === i}
          className={`wb-chip${picked === i ? (o.correct ? ' is-right' : ' is-wrong') : ''}`}
          disabled={done}
          onClick={() => {
            setPicked(i)
            if (o.correct) onPass({ firstTry: misses === 0 })
            else setMisses((m) => m + 1)
          }}
        >
          {o.text}
        </button>
      ))}
      {picked !== null && !done && <Nudge>Not that one — try another.</Nudge>}
    </>
  )
}

/* ── 7. Spot the odd one ──────────────────────────────────────────────────── */
// Elimination rather than selection. A reader can often pick the right answer
// out of three without being able to say why the other two are wrong; this asks
// for exactly that, over sentences that all look plausible at a glance.

export function OddOneOut({ word, onPass }) {
  const options = useMemo(() => oddOneOut(word), [word])
  const [picked, setPicked] = useState(null)
  const [misses, setMisses] = useState(0)
  const done = picked !== null && options[picked].odd

  return (
    <div className="wb-act">
      <Prompt>
        Three of these use <strong>{word.word}</strong> right. Which one doesn’t?
      </Prompt>
      <div className="wb-check-options" role="radiogroup" aria-label="Pick the wrong sentence">
        {options.map((o, i) => {
          const isPicked = picked === i
          const state = !isPicked ? '' : o.odd ? ' is-right' : ' is-wrong'
          return (
            <button
              key={o.text}
              role="radio"
              aria-checked={isPicked}
              className={`wb-option${state}`}
              disabled={done}
              onClick={() => {
                setPicked(i)
                if (o.odd) onPass({ firstTry: misses === 0 })
                else setMisses((m) => m + 1)
              }}
            >
              <span className="wb-option-mark" aria-hidden="true">
                {isPicked && <Icon name={o.odd ? 'check' : 'x'} size={14} stroke={2.6} />}
              </span>
              <span className="wb-option-text">
                <Marked text={o.text} word={word.word} />
              </span>
            </button>
          )
        })}
      </div>
      {picked !== null && !done && <Nudge>That one’s fine, actually. Keep looking.</Nudge>}
    </div>
  )
}

/* ── 8. Pick a card ───────────────────────────────────────────────────────── */
// Chance, then a judgement. Three face-down cards mean the reader can't scan
// the options and pick whichever looks most familiar — they get the sentence
// they get, and have to decide about that one on its own terms.

/**
 * The backs of the three cards. Each deck deals three different faces, picked
 * from the word so a given word always shows the same three — "random" here
 * only has to mean "not the same three every single round". Three identical
 * backs made the choice look decorative; three different ones make it a pick.
 */
const CARD_FACES = [
  { icon: 'star', color: '#7c3aed', wash: '#f5f3ff', line: '#ddd6fe' },
  { icon: 'flame', color: '#c2410c', wash: '#fff7ed', line: '#fed7aa' },
  { icon: 'leaf', color: '#0f766e', wash: '#f0fdfa', line: '#99f6e4' },
  { icon: 'moon', color: '#1d4ed8', wash: '#eff6ff', line: '#bfdbfe' },
  { icon: 'bolt', color: '#a16207', wash: '#fefce8', line: '#fde68a' },
  { icon: 'heart', color: '#be185d', wash: '#fdf2f8', line: '#fbcfe8' },
]

export function PickACard({ word, onPass }) {
  const deck = useMemo(() => cardDeck(word), [word])
  const faces = useMemo(
    () => deck.map((_, i) => CARD_FACES[(word.word.length + i * 2) % CARD_FACES.length]),
    [deck, word],
  )
  const [turned, setTurned] = useState(null)
  // The card the reader is turning, held for the half-turn before the sentence
  // takes over. The flip is two halves of one motion: the card rotates to
  // edge-on, and the sentence swings in from edge-on the other way. A single
  // double-sided card can't do it — the back has to be as wide as a sentence.
  const [flipping, setFlipping] = useState(null)
  const [verdict, setVerdict] = useState(null) // what the reader said
  const [misses, setMisses] = useState(0)

  const card = turned !== null ? deck[turned] : null
  const settled = verdict !== null && verdict === card?.correct

  function judge(saysCorrect) {
    setVerdict(saysCorrect)
    if (saysCorrect === card.correct) onPass({ firstTry: misses === 0 })
    else setMisses((m) => m + 1)
  }

  return (
    <div className="wb-act">
      <Prompt>
        {turned === null ? (
          <>Turn over a card.</>
        ) : (
          <>
            Does this use <strong>{word.word}</strong> the right way?
          </>
        )}
      </Prompt>

      {turned === null ? (
        <div
          className={`wb-deck${flipping !== null ? ' is-turning' : ''}`}
          role="group"
          aria-label="Three cards, face down"
        >
          {deck.map((c, i) => (
            <button
              key={c.text}
              className={`wb-deck-card${flipping === i ? ' is-flipping' : ''}`}
              style={{
                '--face': faces[i].color,
                '--face-wash': faces[i].wash,
                '--face-line': faces[i].line,
              }}
              aria-label={`Card ${i + 1}`}
              disabled={flipping !== null}
              onClick={() => {
                setFlipping(i)
                setTimeout(() => setTurned(i), 190)
              }}
            >
              <Icon name={faces[i].icon} size={32} stroke={1.5} />
            </button>
          ))}
        </div>
      ) : (
        <>
          <p className={`wb-drawn${settled ? (card.correct ? ' is-right' : ' is-wrong') : ''}`}>
            <Marked text={card.text} word={word.word} />
          </p>
          <div className="wb-verdicts">
            <button
              className={`wb-chip${verdict === true ? (card.correct ? ' is-right' : ' is-wrong') : ''}`}
              disabled={settled}
              onClick={() => judge(true)}
            >
              <Icon name="check" size={15} stroke={2.4} /> It does
            </button>
            <button
              className={`wb-chip${verdict === false ? (!card.correct ? ' is-right' : ' is-wrong') : ''}`}
              disabled={settled}
              onClick={() => judge(false)}
            >
              <Icon name="x" size={15} stroke={2.4} /> It doesn’t
            </button>
          </div>
          {verdict !== null && !settled && (
            <Nudge>
              {card.correct
                ? 'That one’s actually fine — read it once more.'
                : 'Look again: that sentence doesn’t match what the word means.'}
            </Nudge>
          )}
        </>
      )}
    </div>
  )
}

/* ── 9. Match the pairs ───────────────────────────────────────────────────── */
// Two columns, everything face up: tap a word on the left, tap its meaning on
// the right. Duolingo's shape, and the right one here — a face-down memory grid
// tested recall of *where a card was*, which is a different skill from the one
// this round is about. It's still the only rung that puts several words in play
// at once: the new word is shuffled in with two the reader collected earlier,
// so learning this one means handling those again.

export function PairMatch({ word, bookId, onPass }) {
  const pairs = useMemo(() => pairsFor(word, bookId), [word, bookId])

  // The two columns are shuffled independently, or the answer would be to read
  // straight across.
  const words = useMemo(() => arrange(pairs, word.word.length), [pairs, word])
  const meanings = useMemo(() => arrange(pairs, word.word.length + 2), [pairs, word])

  const [pickedWord, setPickedWord] = useState(null)
  const [matched, setMatched] = useState([])
  const [wrong, setWrong] = useState(null) // the pair of ids that just missed
  const [misses, setMisses] = useState(0)

  function tapWord(p) {
    if (matched.includes(p.word)) return
    setPickedWord(pickedWord === p.word ? null : p.word)
    setWrong(null)
  }

  function tapMeaning(p) {
    if (!pickedWord || matched.includes(p.word)) return
    if (p.word === pickedWord) {
      const done = [...matched, p.word]
      setMatched(done)
      setPickedWord(null)
      if (done.length === pairs.length) onPass({ firstTry: misses === 0 })
    } else {
      setMisses((m) => m + 1)
      setWrong({ word: pickedWord, meaning: p.word })
      setPickedWord(null)
      setTimeout(() => setWrong(null), 600)
    }
  }

  const state = (id, kind) => {
    if (matched.includes(id)) return ' is-matched'
    if (wrong && wrong[kind] === id) return ' is-wrong'
    if (kind === 'word' && pickedWord === id) return ' is-picked'
    return ''
  }

  // A solved pair rises to the same row in both columns, in the order it was
  // solved. The columns are shuffled independently, so without this the two
  // halves of a pair stay in whatever rows they started in — and a finished
  // grid reads as if each word means whatever ended up beside it.
  const order = (id) => {
    const at = matched.indexOf(id)
    return at === -1 ? matched.length + 1 : at
  }

  return (
    <div className="wb-act">
      <Prompt>Tap a word, then tap what it means.</Prompt>
      <div className="wb-pairs">
        <div className="wb-pairs-col" role="group" aria-label="Words">
          {words.map((p) => (
            <button
              key={p.word}
              className={`wb-pair wb-pair--word${state(p.word, 'word')}`}
              style={{ order: order(p.word) }}
              disabled={matched.includes(p.word)}
              aria-pressed={pickedWord === p.word}
              onClick={() => tapWord(p)}
            >
              {p.word}
            </button>
          ))}
        </div>
        <div className="wb-pairs-col" role="group" aria-label="Meanings">
          {meanings.map((p) => (
            <button
              key={p.word}
              className={`wb-pair${state(p.word, 'meaning')}`}
              style={{ order: order(p.word) }}
              disabled={matched.includes(p.word)}
              onClick={() => tapMeaning(p)}
            >
              {p.meaning}
            </button>
          ))}
        </div>
      </div>
      {misses > 0 && matched.length < pairs.length && (
        <Nudge>Not those two — the meaning belongs to one of the others.</Nudge>
      )}
    </div>
  )
}

/* ── The dispatcher ───────────────────────────────────────────────────────── */

const BY_TYPE = {
  definition: DefinitionCheck,
  blank: BlankFill,
  sentence: SentenceCheck,
  passage: PassageDrag,
  write: SentenceWrite,
  synonym: SynonymCheck,
  oddoneout: OddOneOut,
  card: PickACard,
  pairs: PairMatch,
}

export function Activity({ type, word, bookId, onPass }) {
  const Component = BY_TYPE[type] ?? DefinitionCheck
  const resolved = typeof word === 'string' ? wordByName(word) : word
  if (!resolved) return null
  // Keyed on the type so switching rungs remounts — each activity owns its own
  // picked/missed state and must not inherit the last one's.
  return <Component key={type} word={resolved} bookId={bookId} onPass={onPass} />
}
