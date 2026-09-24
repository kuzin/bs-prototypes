import { useEffect, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { BookCover } from '@components/BookCover/BookCover'
import { useLockScroll } from '@components/useLockScroll/useLockScroll'
import '@components/Button/Button.css'
import '@components/BookCover/BookCover.css'

/* The RMI survey's own screen — its progress bar, question header, answer
   cards and checkpoints — so the book quiz reads as the same kind of thing a
   reader has already sat, and only what's new is styled here. */
import '../../rmi/views/SurveyFlow.css'
import { asset } from '../../rmi/assets'
import { QuizStickers } from './QuizStickers'
import {
  KINDS,
  PAIRS,
  STORIES,
  READ_WAYS,
  LENGTHS,
  colorIcon,
  coverChoices,
  quizRecommendations,
  quizSummary,
} from '../quiz'
import './BookQuiz.css'

const STEPS = [
  'intro',
  'kinds',
  'feel',
  'world',
  'story',
  'picks',
  'ways',
  'length',
  'done',
  'results',
]
/* The steps that are a question, for the bar across the top. */
const QUESTIONS = ['kinds', 'feel', 'world', 'story', 'picks', 'ways', 'length']

const BLANK = { kinds: [], picks: [], ways: [] }

/** One answer card: a picture, a label, and the folded corner when chosen.
    `color` tints the whole card in that option's own colour, and the chosen
    ring and corner take it too. */
function Answer({ checked, onToggle, multi, name, color, children, className = '' }) {
  return (
    <label
      className={`rmi-survey-answer bkq-answer ${color ? 'bkq-answer--color ' : ''}${className}${checked ? ' is-checked' : ''}`}
      style={color ? { '--c': color } : undefined}
    >
      <span className="rmi-survey-answer-check">
        <Icon name="check" size={14} stroke={3} />
      </span>
      <input
        type={multi ? 'checkbox' : 'radio'}
        name={name}
        checked={checked}
        onChange={onToggle}
      />
      {children}
    </label>
  )
}

/**
 * Benny's Book Quiz — an RMI-shaped survey that ends in books.
 *
 * Eight kinds of step rather than twenty of one: picture cards, this-or-that,
 * story openings, covers to tap, how you like to read, how long. Every answer
 * is read against the catalog (`quiz.js`), and the results are real titles.
 * `onSave(answers)` hands the answers to the host on reaching the results,
 * which keeps them — they update Benny's Picks on Discover rather
 * than adding a row of their own.
 */
export function BookQuiz({ open, onClose, onSave, shelf, settings, onOpen, onWish, wishlist }) {
  const [step, setStep] = useState('intro')
  const [answers, setAnswers] = useState(BLANK)
  const [readAloud, setReadAloud] = useState(false)
  useLockScroll(open)

  // Every open starts at the beginning.
  useEffect(() => {
    if (open) {
      setStep('intro')
      setAnswers(BLANK)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const next = () => {
    setReadAloud(false)
    const to = STEPS[STEPS.indexOf(step) + 1]
    // Reaching the results is what saves them — Benny's Picks update then, so
    // the last screen's button only has to close.
    if (to === 'results') onSave(answers)
    setStep(to)
  }
  const set = (key, value) => setAnswers((a) => ({ ...a, [key]: value }))
  const toggle = (key, id) =>
    setAnswers((a) => ({
      ...a,
      [key]: a[key].includes(id) ? a[key].filter((x) => x !== id) : [...a[key], id],
    }))

  const qIndex = QUESTIONS.indexOf(step)
  const covers = coverChoices(shelf)
  // "Listening along" only where this site offers audio at all.
  const ways = READ_WAYS.filter((w) => w.id !== 'audiobook' || settings?.audiobooks)

  /* The header every question step shares: the question, its hint, and the
     Read Aloud control the RMI survey carries (inert here, as it is there) —
     a small text button that keeps its speaker, which is what tells a child
     who can't read the words yet that it plays sound. */
  const question = (title, hint) => (
    <header className="rmi-survey-question-header">
      <h1 className="rmi-survey-question-title">{title}</h1>
      {hint && <p className="bkq-hint">{hint}</p>}
      <Button
        variant="ghost"
        size="sm"
        icon={<Icon name="volume" size={18} />}
        className="bkq-read"
        aria-pressed={readAloud}
        onClick={() => setReadAloud((r) => !r)}
      >
        {readAloud ? 'Playing…' : 'Read Aloud'}
      </Button>
    </header>
  )

  const cta = (disabled, label = 'Continue') => (
    <Button variant="primary" size="lg" disabled={disabled} onClick={next}>
      {label}
    </Button>
  )

  const results =
    step === 'results' ? quizRecommendations(answers, { shelf, settings, limit: 6 }) : []

  return (
    <div className="bkq" role="dialog" aria-modal="true" aria-label="Benny’s Book Quiz">
      <button type="button" className="bkq-close" onClick={onClose} aria-label="Close the quiz">
        <Icon name="x" size={22} />
      </button>

      <div className="rmi-survey-layout bkq-layout">
        {qIndex >= 0 && (
          <div
            className="rmi-survey-progress"
            style={{ width: `${((qIndex + 1) / QUESTIONS.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={qIndex + 1}
            aria-valuemin={1}
            aria-valuemax={QUESTIONS.length}
            aria-label="Quiz progress"
          />
        )}

        {step === 'intro' && (
          <section className="rmi-survey-checkpoint">
            {/* The banner's stickers, full size: the quiz opens on the same
                pictures the reader just tapped, and they pop in to say hello. */}
            <QuizStickers size="lg" pop />
            <header className="rmi-survey-checkpoint-header">
              <h1 className="rmi-survey-heading">Let’s find your next favorite book!</h1>
              <p className="rmi-survey-lede">
                Pick pictures, stories and covers — Benny will pick books just for you.
              </p>
            </header>
            {cta(false, 'Let’s Go')}
            {/* Prototype only, the way the RMI survey has one: a sample set of
                answers, straight to the results. */}
            <button
              type="button"
              className="rmi-survey-skip"
              onClick={() => {
                const sample = {
                  kinds: ['funny', 'adventure', 'comics'],
                  feel: 'laugh',
                  world: 'madeup',
                  story: 'shadow',
                  picks: covers.slice(0, 2).map((b) => b.id),
                  ways: ['print', 'ebook'],
                  length: 'middle',
                }
                setAnswers(sample)
                onSave(sample)
                setStep('results')
              }}
            >
              Skip to the end — prototype only
            </button>
          </section>
        )}

        {step === 'kinds' && (
          <section className="rmi-survey-question">
            {question('What kinds of stories do you like?', 'Pick as many as you like')}
            <div className="rmi-survey-answers bkq-answers--kinds">
              {KINDS.map((k) => (
                <Answer
                  key={k.id}
                  multi
                  name="kinds"
                  color={k.color}
                  checked={answers.kinds.includes(k.id)}
                  onToggle={() => toggle('kinds', k.id)}
                >
                  <img src={colorIcon(k.art)} alt="" className="rmi-survey-answer-image bkq-art" />
                  <span className="rmi-survey-answer-label">{k.label}</span>
                </Answer>
              ))}
            </div>
            {cta(!answers.kinds.length)}
          </section>
        )}

        {PAIRS.map(
          (p) =>
            step === p.id && (
              <section key={p.id} className="rmi-survey-question">
                {question(p.question)}
                <div className="bkq-pair">
                  {p.options.map((o, i) => (
                    <div key={o.id} className="bkq-pair-side">
                      {i === 1 && <span className="bkq-or">or</span>}
                      <Answer
                        name={p.id}
                        color={o.color}
                        checked={answers[p.id] === o.id}
                        onToggle={() => set(p.id, o.id)}
                        className="bkq-answer--pair"
                      >
                        <img src={colorIcon(o.art)} alt="" className="bkq-pair-art" />
                        <span className="rmi-survey-answer-label bkq-pair-label">{o.label}</span>
                      </Answer>
                    </div>
                  ))}
                </div>
                {cta(!answers[p.id])}
              </section>
            ),
        )}

        {step === 'story' && (
          <section className="rmi-survey-question">
            {question('Which story would you keep reading?')}
            <div className="bkq-stories">
              {STORIES.map((s) => (
                <Answer
                  key={s.id}
                  name="story"
                  color={s.color}
                  checked={answers.story === s.id}
                  onToggle={() => set('story', s.id)}
                  className="bkq-answer--story"
                >
                  <img src={colorIcon(s.art)} alt="" className="bkq-story-art" />
                  <span className="bkq-story-text">{s.text}</span>
                </Answer>
              ))}
            </div>
            {cta(!answers.story)}
          </section>
        )}

        {step === 'picks' && (
          <section className="rmi-survey-question">
            {question('Tap the books you’d want to read', 'Pick as many as you like')}
            <div className="bkq-covers">
              {covers.map((b) => (
                <Answer
                  key={b.id}
                  multi
                  name="picks"
                  checked={answers.picks.includes(b.id)}
                  onToggle={() => toggle('picks', b.id)}
                  className="bkq-answer--cover"
                >
                  <span className="bkq-cover">
                    <BookCover book={b} size="fill" />
                  </span>
                  <span className="bkq-sr">{b.title}</span>
                </Answer>
              ))}
            </div>
            {cta(false, answers.picks.length ? 'Continue' : 'None of these')}
          </section>
        )}

        {step === 'ways' && (
          <section className="rmi-survey-question">
            {question('How do you like to read?', 'Pick as many as you like')}
            <div className="rmi-survey-answers">
              {ways.map((w) => (
                <Answer
                  key={w.id}
                  multi
                  name="ways"
                  color={w.color}
                  checked={answers.ways.includes(w.id)}
                  onToggle={() => toggle('ways', w.id)}
                >
                  <img src={colorIcon(w.art)} alt="" className="rmi-survey-answer-image bkq-art" />
                  <span className="rmi-survey-answer-label">{w.label}</span>
                </Answer>
              ))}
            </div>
            {cta(!answers.ways.length)}
          </section>
        )}

        {step === 'length' && (
          <section className="rmi-survey-question">
            {question('How long do you like your books?')}
            <div className="rmi-survey-answers">
              {LENGTHS.map((l) => (
                <Answer
                  key={l.id}
                  name="length"
                  color={l.color}
                  checked={answers.length === l.id}
                  onToggle={() => set('length', l.id)}
                >
                  <img src={colorIcon(l.art)} alt="" className="rmi-survey-answer-image bkq-art" />
                  <span className="rmi-survey-answer-label">{l.label}</span>
                  <span className="bkq-answer-sub">{l.sub}</span>
                </Answer>
              ))}
            </div>
            {cta(!answers.length, 'Finish')}
          </section>
        )}

        {step === 'done' && (
          <section className="rmi-survey-checkpoint">
            <img
              src={asset('checkpoints/you-did-it.svg')}
              alt="You did it!"
              className="rmi-survey-checkpoint-image"
            />
            {cta(false, 'See My Books')}
          </section>
        )}

        {step === 'results' && (
          <section className="bkq-results">
            <header className="bkq-results-head">
              <img src="/bs-prototypes/benny-happy.svg" alt="" className="bkq-results-benny" />
              <div>
                <h1 className="rmi-survey-heading">Here’s what I picked for you!</h1>
                <p className="bkq-results-sub">{quizSummary(answers)}</p>
              </div>
            </header>
            {/* Plain tiles, not shelf cards: no rating, no play mark and no
                where tags — the only thing to do with a pick here is keep it,
                so that is the button. */}
            <ul className="bkq-results-grid">
              {results.map(({ book }) => {
                const wished = wishlist?.has(book.id)
                return (
                  <li key={book.id} className="bkq-pick">
                    <button
                      type="button"
                      className="bkq-pick-cover"
                      aria-label={`${book.title} by ${book.author}`}
                      onClick={() => {
                        onClose()
                        onOpen(book.id)
                      }}
                    >
                      <BookCover book={book} size="fill" />
                    </button>
                    <Button
                      variant={wished ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => onWish(book.id)}
                    >
                      {wished ? 'On Your Wish List' : 'Add to Wish List'}
                    </Button>
                  </li>
                )
              })}
            </ul>
            <div className="bkq-results-actions">
              <Button variant="primary" size="lg" onClick={onClose}>
                Close
              </Button>
              {/* The lesser way out, so it's a link under the button rather than
                  a second button beside it. */}
              <button
                type="button"
                className="bkq-retake"
                onClick={() => {
                  setAnswers(BLANK)
                  setStep('kinds')
                }}
              >
                Retake the Quiz
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
