import { useEffect, useRef, useState } from 'react'
import { Button } from '@components/Button/Button'
import { Toggle } from '@components/Toggle/Toggle'
import { CustomSelect } from '@components/CustomSelect/CustomSelect'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { Avatar } from '@components/Avatar/Avatar'
import { Icon } from '@components/Icon/Icon'

import { BookCover } from './BookCover'
import { BOOKS, RECENTLY_LOGGED, READING_LIST, OTHER_READERS, READER } from '../data'
import './LogFlow.css'

import '@components/Button/Button.css'
import '@components/Toggle/Toggle.css'
import '@components/CustomSelect/CustomSelect.css'
import '@components/SearchInput/SearchInput.css'
import '@components/Avatar/Avatar.css'

const LOTS_OF_MINUTES = 90 // integrity threshold → attestation required

// Parse "1h", "33m", "1h33m", "90", "1:30" → whole minutes.
function parseMinutes(raw) {
  if (!raw) return 0
  const s = String(raw).trim().toLowerCase()
  const hm = s.match(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/)
  if (hm && (hm[1] || hm[2])) return parseInt(hm[1] || 0, 10) * 60 + parseInt(hm[2] || 0, 10)
  const colon = s.match(/^(\d+):(\d{1,2})$/)
  if (colon) return parseInt(colon[1], 10) * 60 + parseInt(colon[2], 10)
  const n = parseInt(s, 10)
  return Number.isFinite(n) ? n : 0
}

function fmtClock(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const sec = totalSeconds % 60
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(sec)}`
}

function fmtMinutes(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h && m) return `${h} hr ${m} min`
  if (h) return `${h} hr`
  return `${m} min`
}

const EMOTICONS = ['😍', '😂', '🤩', '😢', '🤔', '👏', '🔥', '💜']
const REVIEW_OPTIONS = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
]

export function LogFlow({ open, onClose, onLogged }) {
  const [step, setStep] = useState('search') // search | details | timer | review | success | reader
  const [returnStep, setReturnStep] = useState('search')
  const [reader, setReader] = useState(READER)
  const [query, setQuery] = useState('')
  const [scanOpen, setScanOpen] = useState(false)

  const [book, setBook] = useState(null) // a BOOKS entry, or a synthetic manual/untitled book
  const [measure, setMeasure] = useState('minutes')
  const [minutesInput, setMinutesInput] = useState('')
  const [pagesInput, setPagesInput] = useState('')
  const [dateLabel, setDateLabel] = useState('Today')
  const [dateOpen, setDateOpen] = useState(false)
  const [finished, setFinished] = useState(false)
  const [reviewChoice, setReviewChoice] = useState('no')
  const [attested, setAttested] = useState(false)

  const [review, setReview] = useState({ title: '', author: '', text: '' })

  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerRef = useRef(null)

  const [result, setResult] = useState(null)

  // Reset everything each time the flow is opened.
  useEffect(() => {
    if (!open) return
    setStep('search')
    setReader(READER)
    setQuery('')
    setScanOpen(false)
    setBook(null)
    setMeasure('minutes')
    setMinutesInput('')
    setPagesInput('')
    setDateLabel('Today')
    setDateOpen(false)
    setFinished(false)
    setReviewChoice('no')
    setAttested(false)
    setReview({ title: '', author: '', text: '' })
    setTimerSeconds(0)
    setTimerRunning(false)
    setResult(null)
  }, [open])

  // Count-up timer.
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimerSeconds((s) => s + 1), 1000)
      return () => clearInterval(timerRef.current)
    }
  }, [timerRunning])

  // Escape closes the flow.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const parsedMinutes = parseMinutes(minutesInput)
  const lotsOfMinutes = measure === 'minutes' && parsedMinutes > LOTS_OF_MINUTES
  const hasAmount = measure === 'minutes' ? parsedMinutes > 0 : parseInt(pagesInput || 0, 10) > 0
  const canLog = hasAmount && (!lotsOfMinutes || attested)

  function pickBook(b) {
    setBook(b)
    setMeasure(b.measure || 'minutes')
    setReview((r) => ({
      ...r,
      title: b.manual || b.untitled ? r.title : b.title,
      author: b.manual || b.untitled ? r.author : b.author,
    }))
    setScanOpen(false)
    setStep('details')
  }

  function startManual() {
    pickBook({
      id: 'manual',
      title: '',
      author: '',
      cover: ['#64748B', '#334155'],
      measure: 'minutes',
      manual: true,
    })
  }
  function startWithoutTitle() {
    pickBook({
      id: 'untitled',
      title: 'Reading (no title)',
      author: '',
      cover: ['#94A3B8', '#64748B'],
      measure: 'minutes',
      untitled: true,
    })
  }

  function openReaderPicker() {
    setReturnStep(step)
    setStep('reader')
  }

  function finishTimer() {
    const mins = Math.max(1, Math.round(timerSeconds / 60))
    setMinutesInput(String(mins))
    setMeasure('minutes')
    setTimerRunning(false)
    setStep('details')
  }

  function submitLog() {
    if (!canLog) return
    if (reviewChoice === 'yes') {
      setStep('review')
      return
    }
    completeLog(null)
  }

  function completeLog(reviewPayload) {
    const minutes = measure === 'minutes' ? parsedMinutes : 0
    const pages = measure === 'pages' ? parseInt(pagesInput || 0, 10) : 0
    const payload = {
      reader,
      book,
      measure,
      minutes,
      pages,
      finished,
      date: dateLabel,
      review: reviewPayload,
      earnedBadge: finished,
    }
    setResult(payload)
    onLogged?.(payload)
    setStep('success')
  }

  const bookTitle = book?.untitled ? 'an untitled book' : book?.title || 'this book'

  return (
    <div className="lf-overlay" role="dialog" aria-modal="true" aria-label="Log reading">
      {/* top-right close (hidden on success — uses its own Done button) */}
      {step !== 'success' && (
        <button className="lf-iconbtn lf-close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={16} stroke={2.2} />
        </button>
      )}
      {/* back button on the secondary steps */}
      {(step === 'details' || step === 'timer' || step === 'reader') && (
        <button
          className="lf-iconbtn lf-back"
          onClick={() =>
            setStep(step === 'reader' ? returnStep : step === 'timer' ? 'details' : 'search')
          }
          aria-label="Back"
        >
          <Icon name="chevron-left" size={18} stroke={2.2} />
        </button>
      )}

      <div className="lf-scroll">
        {step === 'search' && (
          <SearchStep
            reader={reader}
            query={query}
            setQuery={setQuery}
            scanOpen={scanOpen}
            setScanOpen={setScanOpen}
            onPick={pickBook}
            onManual={startManual}
            onWithoutTitle={startWithoutTitle}
            onChangeReader={openReaderPicker}
          />
        )}

        {step === 'details' && book && (
          <DetailsStep
            reader={reader}
            book={book}
            measure={measure}
            minutesInput={minutesInput}
            setMinutesInput={setMinutesInput}
            pagesInput={pagesInput}
            setPagesInput={setPagesInput}
            dateLabel={dateLabel}
            setDateLabel={setDateLabel}
            dateOpen={dateOpen}
            setDateOpen={setDateOpen}
            finished={finished}
            setFinished={setFinished}
            reviewChoice={reviewChoice}
            setReviewChoice={setReviewChoice}
            attested={attested}
            setAttested={setAttested}
            lotsOfMinutes={lotsOfMinutes}
            canLog={canLog}
            onChangeReader={openReaderPicker}
            onStartTimer={() => {
              setTimerSeconds(0)
              setTimerRunning(true)
              setStep('timer')
            }}
            onUpdateBook={(patch) => {
              setBook((b) => ({ ...b, ...patch }))
              setReview((r) => ({ ...r, ...patch }))
            }}
            onSubmit={submitLog}
          />
        )}

        {step === 'timer' && (
          <TimerStep
            seconds={timerSeconds}
            running={timerRunning}
            onToggle={() => setTimerRunning((r) => !r)}
            onReset={() => {
              setTimerSeconds(0)
              setTimerRunning(true)
            }}
            onDone={finishTimer}
          />
        )}

        {step === 'review' && (
          <ReviewStep review={review} setReview={setReview} onSave={() => completeLog(review)} />
        )}

        {step === 'reader' && (
          <ReaderStep
            current={reader}
            onSelect={(r) => {
              setReader(r)
              setStep(returnStep)
            }}
          />
        )}

        {step === 'success' && (
          <SuccessStep result={result} bookTitle={bookTitle} onDone={onClose} />
        )}
      </div>
    </div>
  )
}

// ─── Reader header ("Logging for … · Select a different reader") ──────────────

function ReaderLine({ reader, onChange }) {
  return (
    <div className="lf-readerline">
      <span className="lf-readerlabel">Logging for</span>
      <span className="lf-readerpill">
        <Avatar initials={reader.initials} color={reader.color} size="sm" />
        <span>{reader.name.split(' ')[0]}</span>
      </span>
      <button className="lf-link" onClick={onChange}>
        Select a different reader
      </button>
    </div>
  )
}

// ─── Step 1: search ──────────────────────────────────────────────────────────

function SearchStep({
  reader,
  query,
  setQuery,
  scanOpen,
  setScanOpen,
  onPick,
  onManual,
  onWithoutTitle,
  onChangeReader,
}) {
  const q = query.trim().toLowerCase()
  const results = q
    ? Object.values(BOOKS).filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q),
      )
    : []

  return (
    <div className="lf-search">
      <ReaderLine reader={reader} onChange={onChangeReader} />
      <h1 className="lf-h1">What did you read today?</h1>

      <div className="lf-searchrow">
        <SearchInput value={query} onChange={setQuery} placeholder="Search for title or author" />
        <span className="lf-searchdiv" />
        <Button
          variant="secondary"
          size="md"
          icon={<Icon name="barcode" size={18} />}
          onClick={() => setScanOpen(true)}
        >
          Scan ISBN
        </Button>
      </div>

      {scanOpen && (
        <div className="lf-scanner">
          <div className="lf-scanner-frame">
            <Icon name="barcode" size={48} stroke={1.4} />
            <span className="lf-scanner-line" />
          </div>
          <p className="lf-scanner-hint">Point your camera at the book's barcode.</p>
          <div className="lf-scanner-actions">
            <Button variant="primary" size="sm" onClick={() => onPick(BOOKS['lucky-cap'])}>
              Simulate scan
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setScanOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {q && (
        <div className="lf-results">
          {results.length === 0 ? (
            <p className="lf-noresults">
              No matches for “{query}”.{' '}
              <button className="lf-link" onClick={onManual}>
                Log manually
              </button>
            </p>
          ) : (
            results.map((b) => (
              <button key={b.id} className="lf-resultrow" onClick={() => onPick(b)}>
                <BookCover book={b} size="sm" />
                <span className="lf-resultmeta">
                  <span className="lf-resulttitle">{b.title}</span>
                  <span className="lf-resultauthor">{b.author}</span>
                </span>
                <Icon name="chevron-right" size={18} className="lf-resultchev" />
              </button>
            ))
          )}
        </div>
      )}

      {!q && !scanOpen && (
        <>
          {/* Active reading list band */}
          <section className="lf-panel lf-rlband">
            <div className="lf-rlbanner">
              <h2 className="lf-rl-name">{READING_LIST.challenge}</h2>
              <p className="lf-rlbyline">{READING_LIST.byline}</p>
            </div>

            <div className="lf-coverrow lf-coverrow--rl">
              {READING_LIST.titles.map((id) => {
                const logged = READING_LIST.completed.includes(id)
                return (
                  <button
                    key={id}
                    className={`lf-coverbtn lf-rltitle${logged ? ' is-logged' : ''}`}
                    onClick={() => onPick(BOOKS[id])}
                    title={BOOKS[id].title}
                  >
                    <BookCover book={BOOKS[id]} size="md" />
                    {logged && (
                      <span className="lf-rlcheck" aria-label="Logged">
                        <Icon name="check" size={12} stroke={3} />
                      </span>
                    )}
                    <span className="lf-rladd">
                      <Icon name="plus" size={12} stroke={2.6} />
                      Log
                    </span>
                  </button>
                )
              })}
            </div>
            <button className="lf-link lf-viewall">View all {READING_LIST.total} titles ›</button>
          </section>

          {/* Recently logged */}
          <section className="lf-panel">
            <h2 className="lf-panel-title">Recently Logged Titles</h2>
            <div className="lf-coverrow lf-coverrow--center">
              {RECENTLY_LOGGED.map((id) => (
                <button
                  key={id}
                  className="lf-coverbtn"
                  onClick={() => onPick(BOOKS[id])}
                  title={BOOKS[id].title}
                >
                  <BookCover book={BOOKS[id]} size="md" />
                </button>
              ))}
            </div>
          </section>

          <p className="lf-escape">
            Can&apos;t find a title?{' '}
            <button className="lf-link" onClick={onManual}>
              Log manually
            </button>{' '}
            or{' '}
            <button className="lf-link" onClick={onWithoutTitle}>
              Without a Title
            </button>
          </p>
        </>
      )}
    </div>
  )
}

// ─── Step 2: details ───────────────────────────────────────────────────────

function DetailsStep({
  reader,
  book,
  measure,
  minutesInput,
  setMinutesInput,
  pagesInput,
  setPagesInput,
  dateLabel,
  setDateLabel,
  dateOpen,
  setDateOpen,
  finished,
  setFinished,
  reviewChoice,
  setReviewChoice,
  attested,
  setAttested,
  lotsOfMinutes,
  canLog,
  onChangeReader,
  onStartTimer,
  onUpdateBook,
  onSubmit,
}) {
  const dateOptions = ['Today', 'Yesterday', '2 days ago', '3 days ago']
  return (
    <div className="lf-details">
      <div className="lf-details-cover">
        <BookCover book={book} size="lg" />
        {!book.manual && (
          <>
            <div className="lf-coverttl">{book.untitled ? 'No title' : book.title}</div>
            {book.author && <div className="lf-coverauth">{book.author}</div>}
          </>
        )}
      </div>

      <div className="lf-details-form">
        <ReaderLine reader={reader} onChange={onChangeReader} />
        <hr className="lf-rule" />

        {book.manual && (
          <div className="lf-manualfields">
            <div className="lf-field">
              <div className="lf-label">Book Title</div>
              <input
                className="lf-input"
                placeholder="Book title"
                value={book.title}
                onChange={(e) => onUpdateBook({ title: e.target.value })}
              />
            </div>
            <div className="lf-field">
              <div className="lf-label">Author</div>
              <input
                className="lf-input"
                placeholder="Author"
                value={book.author}
                onChange={(e) => onUpdateBook({ author: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="lf-daterow">
          <div>
            <div className="lf-label">Logging Reading for</div>
            <div className="lf-datevalue">{dateLabel}</div>
          </div>
          <div className="lf-datechange">
            <Button variant="secondary" size="sm" onClick={() => setDateOpen((o) => !o)}>
              Change
            </Button>
            {dateOpen && (
              <div className="lf-datemenu">
                {dateOptions.map((d) => (
                  <button
                    key={d}
                    className={`lf-datemenu-item${d === dateLabel ? ' is-active' : ''}`}
                    onClick={() => {
                      setDateLabel(d)
                      setDateOpen(false)
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {measure === 'minutes' ? (
          <div className="lf-field">
            <div className="lf-label">Time Spent Reading</div>
            <div className="lf-inputrow">
              <input
                className={`lf-input${lotsOfMinutes ? ' lf-input--warn' : ''}`}
                placeholder={'Type "1h", "33m", or "1h33m"'}
                value={minutesInput}
                onChange={(e) => setMinutesInput(e.target.value)}
              />
              <Button
                variant="secondary"
                size="md"
                icon={<Icon name="timer" size={18} />}
                onClick={onStartTimer}
              >
                Start Timer
              </Button>
            </div>
            {lotsOfMinutes && (
              <p className="lf-warn">
                <Icon name="bell-ringing" size={15} /> This seems like a lot of minutes. Are you
                sure?
              </p>
            )}
          </div>
        ) : (
          <div className="lf-field">
            <div className="lf-label">How many pages were read?</div>
            <input
              className="lf-input"
              type="number"
              min="1"
              value={pagesInput}
              onChange={(e) => setPagesInput(e.target.value)}
              placeholder="1"
            />
          </div>
        )}

        <div className="lf-field">
          <div className="lf-label">Did you finish the book?</div>
          <Toggle checked={finished} onChange={setFinished}>
            Finished
          </Toggle>
        </div>

        <div className="lf-field">
          <div className="lf-label">Would you like to include a review?</div>
          <CustomSelect options={REVIEW_OPTIONS} value={reviewChoice} onChange={setReviewChoice} />
        </div>

        {lotsOfMinutes && (
          <label className="lf-attest">
            <input
              type="checkbox"
              checked={attested}
              onChange={(e) => setAttested(e.target.checked)}
            />
            <span>
              I promise that the amount of minutes that I am logging is true and accurate.
            </span>
            <span className="lf-attest-emoji" aria-hidden>
              🤞
            </span>
          </label>
        )}

        <Button
          variant="primary"
          size="lg"
          disabled={!canLog}
          onClick={onSubmit}
          className="lf-logbtn"
        >
          Log Reading
        </Button>
      </div>
    </div>
  )
}

// ─── Step 3: timer ───────────────────────────────────────────────────────────

function TimerStep({ seconds, running, onToggle, onReset, onDone }) {
  const R = 130
  const C = 2 * Math.PI * R
  // ring fills once per minute (purely decorative cadence)
  const frac = (seconds % 60) / 60
  const dash = C * frac
  const clock = fmtClock(seconds)
  const [hh, mm, ss] = clock.split(':')

  return (
    <div className="lf-timer">
      <div className="lf-ring-wrap">
        <svg viewBox="0 0 300 300" className="lf-ring">
          <circle cx="150" cy="150" r={R} className="lf-ring-track" />
          <circle
            cx="150"
            cy="150"
            r={R}
            className="lf-ring-fill"
            strokeDasharray={`${dash} ${C}`}
            transform="rotate(-90 150 150)"
          />
        </svg>
        <div className="lf-ring-time">
          <span className="lf-ring-hh">{hh}:</span>
          <span className="lf-ring-mm">{mm}:</span>
          <span className="lf-ring-mm">{ss}</span>
        </div>
      </div>

      <div className="lf-timer-controls">
        <button
          className="lf-circlebtn"
          onClick={onToggle}
          aria-label={running ? 'Pause' : 'Resume'}
        >
          <Icon name={running ? 'pause-filled' : 'play-filled'} size={22} />
        </button>
        <button className="lf-circlebtn" onClick={onReset} aria-label="Reset">
          <Icon name="refresh" size={20} stroke={2} />
        </button>
      </div>

      <Button variant="primary" size="lg" onClick={onDone}>
        I&apos;m Done Reading
      </Button>
    </div>
  )
}

// ─── Step 4: write a review ──────────────────────────────────────────────────

function ReviewStep({ review, setReview, onSave }) {
  return (
    <div className="lf-review">
      <h1 className="lf-h1 lf-h1--left">Write a Review</h1>

      <div className="lf-field">
        <div className="lf-label">Book Title</div>
        <input
          className="lf-input"
          value={review.title}
          onChange={(e) => setReview({ ...review, title: e.target.value })}
        />
      </div>
      <div className="lf-field">
        <div className="lf-label">Author</div>
        <input
          className="lf-input"
          value={review.author}
          onChange={(e) => setReview({ ...review, author: e.target.value })}
        />
      </div>
      <div className="lf-field">
        <div className="lf-label">Review</div>
        <textarea
          className="lf-input lf-textarea"
          rows={5}
          value={review.text}
          onChange={(e) => setReview({ ...review, text: e.target.value })}
        />
        <div className="lf-emojis">
          {EMOTICONS.map((e) => (
            <button
              key={e}
              className="lf-emoji"
              onClick={() => setReview((r) => ({ ...r, text: r.text + e }))}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="lf-review-actions">
        <Button variant="primary" size="md" onClick={onSave}>
          Save
        </Button>
        <Button variant="secondary" size="md" icon={<Icon name="smile" size={16} />}>
          Add Emoticon
        </Button>
      </div>
    </div>
  )
}

// ─── Reader picker ────────────────────────────────────────────────────────────

function ReaderStep({ current, onSelect }) {
  return (
    <div className="lf-readerpicker">
      <h1 className="lf-h1">Who are you logging for?</h1>
      <div className="lf-readerlist">
        {OTHER_READERS.map((r) => (
          <button
            key={r.id}
            className={`lf-readercard${r.id === current.id ? ' is-active' : ''}`}
            onClick={() => onSelect(r)}
          >
            <Avatar initials={r.initials} color={r.color} size="lg" />
            <span className="lf-readercard-name">{r.name}</span>
            <span className="lf-readercard-grade">{r.grade}</span>
            {r.id === current.id && (
              <Icon name="circle-check-filled" size={18} className="lf-readercard-check" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Success / badge earned ───────────────────────────────────────────────────

function SuccessStep({ result, bookTitle, onDone }) {
  const amount = result.measure === 'minutes' ? fmtMinutes(result.minutes) : `${result.pages} pages`
  return (
    <div className="lf-success">
      <div className="lf-success-burst">
        <Icon name={result.earnedBadge ? 'award' : 'flame-filled'} size={56} />
      </div>
      <h1 className="lf-h1">
        {result.earnedBadge
          ? 'You earned a badge!'
          : `Way to go, ${result.reader.name.split(' ')[0]}!`}
      </h1>
      <p className="lf-success-sub">
        You logged <strong>{amount}</strong> for <strong>{bookTitle}</strong>
        {result.finished ? ' and finished it. ' : '. '}
        Your streak is now <strong>1 day</strong> 🔥
      </p>

      <div className="lf-success-card">
        <div className="lf-success-stat">
          <span className="lf-success-statnum">
            {result.measure === 'minutes' ? result.minutes : result.pages}
          </span>
          <span className="lf-success-statlbl">
            {result.measure === 'minutes' ? 'minutes' : 'pages'}
          </span>
        </div>
        {result.review?.text && (
          <div className="lf-success-review">
            <Icon name="writing" size={15} /> Review saved
          </div>
        )}
      </div>

      <Button variant="primary" size="lg" onClick={onDone}>
        Done
      </Button>
    </div>
  )
}
