import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { Input } from '@components/Form/Form'
import '@components/Form/Form.css'
import { QUESTIONS_IN_ORDER, FACTORS } from '../domain'
import { scoreAnswers, topThreeFactors, readingGoalFor, recommendationsFor } from '../scoring'
import { STUDENTS } from '../data'
import { GENRES_BY_FACTOR } from '../genres'
import { asset } from '../assets'
import './SurveyFlow.css'

/**
 * The reader's half of the standalone product — `students/*`, the only part of
 * the app that isn't behind a login. A student opens `/s/:account_slug`, types
 * the access code from their handout, answers 20 questions and is shown who
 * they are.
 *
 * Flow, exactly as the controllers sequence it:
 *   intro → question ×20, with a checkpoint after the 2nd, 10th and 17th
 *         → completed → motivation type
 *
 * `RESPONSE_OPTIONS` is a 4-point Likert scale, not 5 — which is what makes a
 * factor score 1.0–4.0 everywhere else in the app.
 */

const RESPONSE_OPTIONS = [
  [1, 'Very different from me', 'very-different'],
  [2, 'A little different from me', 'somewhat-different'],
  [3, 'A little like me', 'a-little'],
  [4, 'A lot like me', 'a-lot'],
]

// `Students::QuestionResponsesController::CHECKPOINTS` — keyed by how many
// questions have been answered.
const CHECKPOINTS = {
  2: {
    title: "You're making progress!",
    subtitle: 'Keep going to learn your motivation personas!',
    image: 'progress-bar-short',
  },
  10: { title: '', subtitle: '', image: 'halfway-there' },
  17: {
    title: 'Keep going!',
    subtitle: 'Answer a few more questions to learn your motivation personas!',
    image: 'progress-bar-long',
  },
}

const DEMO_STUDENT = STUDENTS[0]

export function SurveyFlow({ onRestart }) {
  const [step, setStep] = useState('intro')
  const [code, setCode] = useState('')
  const [index, setIndex] = useState(0) // position in QUESTIONS_IN_ORDER
  const [answers, setAnswers] = useState({})
  const [choice, setChoice] = useState(null)
  const [readAloud, setReadAloud] = useState(false)

  const question = QUESTIONS_IN_ORDER[index]
  const answered = Object.keys(answers).length
  // The access code is the reader's identity in this product — the intro
  // greets them by it, and so does the reveal.
  const student = STUDENTS.find((s) => s.accessCode === code.trim().toUpperCase()) ?? null

  function restart() {
    setStep('intro')
    setCode('')
    setIndex(0)
    setAnswers({})
    setChoice(null)
    onRestart?.()
  }

  function submitAnswer() {
    if (choice == null) return
    const next = { ...answers, [question.id]: choice }
    setAnswers(next)
    setChoice(null)
    setReadAloud(false)

    const count = Object.keys(next).length
    if (count >= QUESTIONS_IN_ORDER.length) {
      setStep('completed')
    } else if (CHECKPOINTS[count]) {
      setStep('checkpoint')
    } else {
      setIndex((i) => i + 1)
    }
  }

  function leaveCheckpoint() {
    setIndex((i) => i + 1)
    setStep('question')
  }

  return (
    <div className="rmi-survey-layout">
      {step === 'question' && (
        <div
          className="rmi-survey-progress"
          style={{ '--question-number': question.order }}
          role="progressbar"
          aria-valuenow={question.order}
          aria-valuemin={1}
          aria-valuemax={20}
          aria-label="Survey progress"
        />
      )}

      {step === 'intro' && (
        <section className="rmi-survey-intro">
          <div className="rmi-survey-intro-header">
            <img
              src={asset('benny-intro-image.svg')}
              alt="Benny"
              className="rmi-survey-intro-image"
            />
            <div>
              <h1 className="rmi-survey-heading">
                {student
                  ? `What motivates you, ${student.name.split(' ')[0]}?`
                  : 'What motivates you?'}
              </h1>
              <p className="rmi-survey-lede">Take the survey to earn your reading motivators!</p>
              <p className="rmi-survey-lede">Enter your access code to get started</p>
            </div>
          </div>

          <form
            className="rmi-survey-intro-form"
            onSubmit={(e) => {
              e.preventDefault()
              setStep('question')
            }}
          >
            <Input
              size="lg"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Access Code"
              aria-label="Access code"
              required
            />
            <Button type="submit" variant="primary" size="lg" disabled={!code.trim()}>
              Let&rsquo;s Go
            </Button>
            <button
              type="button"
              className="rmi-survey-hint"
              onClick={() => setCode(DEMO_STUDENT.accessCode)}
            >
              Use {DEMO_STUDENT.name}&rsquo;s code ({DEMO_STUDENT.accessCode})
            </button>
          </form>
        </section>
      )}

      {step === 'question' && (
        <section className="rmi-survey-question">
          <header className="rmi-survey-question-header">
            <h1 className="rmi-survey-question-title">{question.question}</h1>
            {/* The real survey plays a recording of the question; there's no
                audio in the prototype, so the control toggles and says so. */}
            <button
              type="button"
              className="rmi-survey-read-aloud"
              aria-pressed={readAloud}
              onClick={() => setReadAloud((r) => !r)}
            >
              <Icon name="volume" size={22} />
              {readAloud ? 'Playing…' : 'Read Aloud'}
            </button>
          </header>

          <div className="rmi-survey-answers">
            {RESPONSE_OPTIONS.map(([value, label, image]) => (
              <label
                key={value}
                className={`rmi-survey-answer${choice === value ? ' is-checked' : ''}`}
              >
                <span className="rmi-survey-answer-check">
                  <Icon name="check" size={14} stroke={3} />
                </span>
                <input
                  type="radio"
                  name="answer"
                  value={value}
                  checked={choice === value}
                  onChange={() => setChoice(value)}
                />
                <img
                  src={asset(`responses/${image}.svg`)}
                  alt=""
                  className="rmi-survey-answer-image"
                />
                <span className="rmi-survey-answer-label">{label}</span>
              </label>
            ))}
          </div>

          <Button variant="primary" size="lg" disabled={choice == null} onClick={submitAnswer}>
            Continue
          </Button>
        </section>
      )}

      {step === 'checkpoint' && (
        <Checkpoint checkpoint={CHECKPOINTS[answered]} onContinue={leaveCheckpoint} />
      )}

      {step === 'completed' && (
        <section className="rmi-survey-checkpoint">
          <img
            src={asset('checkpoints/you-did-it.svg')}
            alt="You did it!"
            className="rmi-survey-checkpoint-image"
          />
          <Button variant="primary" size="lg" onClick={() => setStep('reveal')}>
            View My Motivation Type
          </Button>
        </section>
      )}

      {step === 'reveal' && (
        <MotivationType answers={answers} student={student} onRestart={restart} />
      )}
    </div>
  )
}

function Checkpoint({ checkpoint, onContinue }) {
  return (
    <section className="rmi-survey-checkpoint">
      {checkpoint.title && (
        <header className="rmi-survey-checkpoint-header">
          <h2 className="rmi-survey-heading">{checkpoint.title}</h2>
          <p className="rmi-survey-lede">{checkpoint.subtitle}</p>
        </header>
      )}
      <img
        src={asset(`checkpoints/${checkpoint.image}.svg`)}
        alt=""
        className="rmi-survey-checkpoint-image"
      />
      <Button variant="primary" size="lg" onClick={onContinue}>
        Continue
      </Button>
    </section>
  )
}

/**
 * The genres that suit each type the reader just came out as.
 *
 * Names only. The toolkit pairs every genre with a reason, but those are
 * written *about* the reader for a teacher — "appeals to their love of grand
 * leadership" — so they belong on the report, not here. What a reader wants is
 * the shelf to go to.
 */
function GenresToTry({ top }) {
  const types = top.filter((f) => GENRES_BY_FACTOR[f.name])
  if (types.length === 0) return null

  return (
    <>
      <h3 className="rmi-motivation-subhead">Genres to Try:</h3>
      <div className="rmi-genres-reader">
        {types.map((factor) => (
          <div key={factor.name} className="rmi-genres-reader-type">
            <span className="rmi-genres-reader-name">{FACTORS[factor.name].student_name}</span>
            <ul className="rmi-genres-reader-list">
              {GENRES_BY_FACTOR[factor.name].map((genre) => (
                <li key={genre.name}>{genre.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}

/**
 * `students/survey_responses/motivation_type` — the payoff. The reader's top
 * factor is shown large with stars either side, the next two beside it, then
 * the reading goal and the reader-facing recommendations.
 */
function MotivationType({ answers, student, onRestart }) {
  const scores = scoreAnswers(answers)
  const top = topThreeFactors(scores)
  const recommendations = recommendationsFor(scores, {
    kind: 'reader_external',
    seed: student?.name ?? 'reader',
  })

  const slug = (factor) => FACTORS[factor].student_name.toLowerCase().replace(/\s+/g, '-')

  return (
    <section className="rmi-motivation-summary">
      <h1 className="rmi-survey-heading rmi-center">
        {student ? `${student.name.split(' ')[0]}'s` : 'Your'} Motivation Types
      </h1>

      <div className="rmi-motivation-types">
        {top.map((factor, i) =>
          i === 0 ? (
            <div key={factor.name} className="rmi-motivation-type-wrap">
              <div
                className={`rmi-motivation-type rmi-motivation-type--large rmi-motivation-type--${slug(factor.name)}`}
              >
                <img
                  src={asset(`factors/${slug(factor.name)}.png`)}
                  alt=""
                  className="rmi-motivation-type-image"
                />
                <h3 className="rmi-motivation-type-title">{FACTORS[factor.name].student_name}</h3>
                <p className="rmi-motivation-type-text">
                  {FACTORS[factor.name].student_definition}
                </p>
              </div>
              <img
                src={asset('stars-left.svg')}
                alt=""
                className="rmi-motivation-stars rmi-motivation-stars--left"
              />
              <img
                src={asset('stars-right.svg')}
                alt=""
                className="rmi-motivation-stars rmi-motivation-stars--right"
              />
            </div>
          ) : (
            <div
              key={factor.name}
              className={`rmi-motivation-type rmi-motivation-type--${slug(factor.name)}`}
            >
              <img
                src={asset(`factors/${slug(factor.name)}.png`)}
                alt=""
                className="rmi-motivation-type-image"
              />
              <h3 className="rmi-motivation-type-title">{FACTORS[factor.name].student_name}</h3>
              <p className="rmi-motivation-type-text">{FACTORS[factor.name].student_definition}</p>
            </div>
          ),
        )}
      </div>

      <GenresToTry top={top} />

      <h3 className="rmi-motivation-subhead">Set a Reading Goal</h3>
      <div className="rmi-motivation-goal">
        <img src={asset('benny-reading.svg')} alt="" className="rmi-motivation-goal-image" />
        <span className="rmi-motivation-goal-minutes">{readingGoalFor(scores)}</span>
        <span className="rmi-motivation-goal-label">Minutes Daily</span>
      </div>

      <h3 className="rmi-motivation-subhead">Ways to Keep Reading:</h3>
      <ul className="rmi-motivation-recs">
        {recommendations.map((rec) => (
          <li key={rec.id}>
            <span className="rmi-motivation-recs-icon">
              <Icon name="star" size={16} />
            </span>
            {rec.text}
          </li>
        ))}
      </ul>

      <Button variant="secondary" size="md" onClick={onRestart}>
        Take it again
      </Button>
    </section>
  )
}
