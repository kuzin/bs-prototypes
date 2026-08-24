import { useEffect, useRef, useState } from 'react'
import { Button } from '@components/Button/Button'
import { Toggle } from '@components/Toggle/Toggle'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { Icon } from '@components/Icon/Icon'
import { ReaderPill } from './ReaderChrome'
import { Sheet } from './Sheet'
import { BOOKS, coverUrl } from '../data'

// Parse "1h", "33m", "1h33m", "90", "1:30" → whole minutes. Same grammar the
// logging-flow prototype accepts, since it mocks the same input.
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

const fmtClock = (total) => {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

// A cover tile — the real Open Library jacket, falling back to the book's own
// two-color gradient when there's no cover for that ISBN.
function Cover({ book, size = 'md' }) {
  const [failed, setFailed] = useState(false)
  const src = coverUrl(book.isbn)
  const gradient = `linear-gradient(150deg, ${book.cover[0]}, ${book.cover[1]})`

  return (
    <span className={`gr-cover gr-cover--${size}`} style={{ background: gradient }}>
      {src && !failed ? (
        <img src={src} alt="" onError={() => setFailed(true)} />
      ) : (
        <span className="gr-cover-fallback">{book.title}</span>
      )}
    </span>
  )
}

/**
 * The reader's log-reading flow, as three full-screen steps:
 *   search  → pick a title (or scan / enter manually / import)
 *   details → date, minutes, finished?, review?
 * The celebration that follows lives in App, because what it says depends on
 * whether the log unlocked a badge.
 */
export function LogReadingFlow({ open, onClose, onLogged }) {
  const [step, setStep] = useState('search')
  const [query, setQuery] = useState('')
  const [book, setBook] = useState(null)
  const [minutes, setMinutes] = useState('')
  // Figma's static frame shows "Not Finished", but the board counts books
  // finished — so the default here is Finished, and the loop actually unlocks
  // the next space on the way through.
  const [finished, setFinished] = useState(true)
  const [review, setReview] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const timer = useRef(null)

  // Reset every time the flow opens.
  useEffect(() => {
    if (!open) return
    setStep('search')
    setQuery('')
    setBook(null)
    setMinutes('')
    setFinished(true)
    setReview(false)
    setSeconds(0)
    setRunning(false)
  }, [open])

  // Count-up timer; stopping it drops the elapsed time into the minutes field.
  useEffect(() => {
    if (!running) return
    timer.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(timer.current)
  }, [running])

  const stopTimer = () => {
    setRunning(false)
    setMinutes(`${Math.max(1, Math.round(seconds / 60))}m`)
  }

  const pick = (b) => {
    setBook(b)
    setStep('details')
  }

  const results = query.trim()
    ? BOOKS.filter((b) =>
        `${b.title} ${b.author}`.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : BOOKS

  const mins = parseMinutes(minutes)
  const canLog = mins > 0

  const submit = () => {
    if (!canLog) return
    onLogged({ book, minutes: mins, finished, review })
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      onBack={step === 'details' ? () => setStep('search') : null}
      ariaLabel="Log reading"
    >
      {step === 'search' && (
        <div className="gr-sheet-inner gr-log-search">
          <p className="gr-logging-for">
            Logging for <ReaderPill size="sm" />
            <span className="gr-logging-sep" />
            <button type="button" className="gr-link">
              Select a different reader
            </button>
          </p>
          <h1 className="gr-sheet-title">Select a Title</h1>

          <div className="gr-panel">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search for title or author"
              ariaLabel="Search for title or author"
            />
            <div className="gr-log-methods">
              <button type="button" className="gr-method">
                <BarcodeGlyph />
                Scan ISBN
              </button>
              <button type="button" className="gr-method">
                <span className="gr-method-emoji" aria-hidden="true">
                  ✏️
                </span>
                Manually Enter Title
              </button>
              <button type="button" className="gr-method">
                <span className="gr-method-epic" aria-hidden="true">
                  e!
                </span>
                Import From Epic
              </button>
            </div>
          </div>

          <div className="gr-panel gr-log-results">
            {results.length ? (
              results.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className="gr-result"
                  onClick={() => pick(b)}
                  title={b.title}
                >
                  <Cover book={b} />
                </button>
              ))
            ) : (
              <p className="gr-log-none">No titles match “{query}”.</p>
            )}
          </div>

          <button
            type="button"
            className="gr-link gr-log-untitled"
            onClick={() =>
              pick({
                id: 'untitled',
                title: 'Untitled',
                author: 'No title logged',
                pages: null,
                cover: ['#CBD5E1', '#94A3B8'],
              })
            }
          >
            Log without a title
          </button>
        </div>
      )}

      {step === 'details' && book && (
        <div className="gr-sheet-inner gr-log-details">
          <p className="gr-logging-for">
            Logging for <ReaderPill size="sm" />
          </p>
          <h1 className="gr-sheet-title">Now, log your reading!</h1>

          <div className="gr-log-grid">
            <div className="gr-panel gr-log-book">
              <Cover book={book} size="lg" />
              <div className="gr-log-book-meta">
                <strong>{book.title}</strong>
                <span>{book.author}</span>
                {book.pages && <span>{book.pages} Pages</span>}
              </div>
            </div>

            <div className="gr-panel gr-log-form">
              <div className="gr-log-row gr-log-row--date">
                <div>
                  <span className="gr-log-label">Logging Reading for</span>
                  <span className="gr-log-value">Today</span>
                </div>
                <Button variant="secondary" size="sm">
                  Select Date
                </Button>
              </div>

              <div className="gr-log-field">
                <label className="gr-log-label" htmlFor="gr-minutes">
                  Time Spent Reading
                </label>
                <div className="gr-log-time">
                  <input
                    id="gr-minutes"
                    className="gr-input"
                    value={running ? fmtClock(seconds) : minutes}
                    readOnly={running}
                    onChange={(e) => setMinutes(e.target.value)}
                    placeholder='Type "1h", "33m", or "1h33m"'
                  />
                  <Button
                    variant={running ? 'primary' : 'secondary'}
                    size="sm"
                    accent="#1A6DD5"
                    icon={<Icon name={running ? 'player-stop-filled' : 'clock'} size={14} />}
                    onClick={() => (running ? stopTimer() : setRunning(true))}
                  >
                    {running ? 'Stop Timer' : 'Start Timer'}
                  </Button>
                </div>
              </div>

              <div className="gr-log-toggles">
                <div className="gr-log-field">
                  <span className="gr-log-label">Did you finish the book?</span>
                  <Toggle checked={finished} onChange={setFinished}>
                    {finished ? 'Finished' : 'Not Finished'}
                  </Toggle>
                </div>
                <div className="gr-log-field">
                  <span className="gr-log-label">Include a review?</span>
                  <Toggle checked={review} onChange={setReview}>
                    {review ? 'Yes' : 'No'}
                  </Toggle>
                </div>
              </div>

              <div className="gr-log-actions">
                <Button variant="primary" accent="#1A6DD5" disabled={!canLog} onClick={submit}>
                  Log Reading
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  )
}

// The striped ISBN mark on the "Scan ISBN" tile — barcode art, not a UI glyph.
function BarcodeGlyph() {
  const bars = [
    ['#E8456B', 2],
    ['#1A6DD5', 3],
    ['#16A97A', 2],
    ['#F0A024', 4],
    ['#7C5CFA', 2],
    ['#E8453A', 3],
  ]
  let x = 0
  return (
    <svg viewBox="0 0 22 20" width="26" height="24" aria-hidden="true">
      {bars.map(([fill, w], i) => {
        const el = <rect key={i} x={x} y="1" width={w} height="18" rx="0.6" fill={fill} />
        x += w + 1.4
        return el
      })}
    </svg>
  )
}
