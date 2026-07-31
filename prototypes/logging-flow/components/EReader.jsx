import { useState, useEffect, useMemo, useRef } from 'react'
import { Icon } from '@components/Icon/Icon'
import { BookCover } from './BookCover'
import './EReader.css'

// A simulated in-app e-reader that opens over the logging flow. There's no real
// page art — pages render as clean typeset "text" — but a live timer counts the
// minutes you spend reading, and finishing carries those minutes straight into
// the log-details step so reading and logging are one motion.

function buildPages() {
  const pages = [{ type: 'cover' }]
  for (let i = 0; i < 6; i++) pages.push({ type: 'text', seed: i })
  pages.push({ type: 'end' })
  return pages
}

function TextPage({ seed }) {
  const paras = [5, 4, 6, 4]
  return (
    <div className="lfr-text">
      {seed === 0 && <span className="lfr-dropcap">A</span>}
      {paras.map((lines, p) => (
        <div key={p} className="lfr-para">
          {Array.from({ length: lines }).map((_, l) => (
            <i
              key={l}
              style={{
                width: `${l === lines - 1 ? 40 + ((seed + p + l) % 5) * 8 : 92 + ((p + l) % 3) * 2}%`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function fmtClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function EndPage({ book, minutes, onLog, onClose }) {
  return (
    <div className="lfr-end">
      <span className="lfr-end-burst">
        <Icon name="book-2" size={34} />
      </span>
      <h2>You finished {book.untitled ? 'reading' : book.title}!</h2>
      <p>
        You read for <strong>{minutes}</strong> {minutes === 1 ? 'minute' : 'minutes'}. Log it to
        keep your streak going and see your challenge progress.
      </p>
      <button className="lfr-finish" onClick={onLog}>
        <Icon name="check" size={17} stroke={2.4} /> Log this reading
      </button>
      <button className="lfr-backbtn" onClick={onClose}>
        Close without logging
      </button>
    </div>
  )
}

/**
 * @param book     the book being read (a BOOKS entry)
 * @param onLog    called with elapsed whole minutes (min 1) → prefill the log
 * @param onClose  dismiss the reader without logging
 */
export function EReader({ book, onLog, onClose }) {
  const pages = useMemo(() => buildPages(), [])
  const [page, setPage] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const tick = useRef(null)

  const last = pages.length - 1
  const contentCount = pages.length - 2
  const minutes = Math.max(1, Math.round(seconds / 60))
  const go = (d) => setPage((p) => Math.max(0, Math.min(last, p + d)))

  // Live reading timer runs the whole time the reader is open.
  useEffect(() => {
    tick.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(tick.current)
  }, [])

  // Keyboard: arrows/space to turn pages, Escape to close.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        setPage((p) => Math.min(last, p + 1))
      } else if (e.key === 'ArrowLeft') {
        setPage((p) => Math.max(0, p - 1))
      } else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [last, onClose])

  const cur = pages[page]

  return (
    <div className="lfr" role="dialog" aria-modal="true" aria-label={`Reading ${book.title}`}>
      <div className="lfr-top">
        <button className="lfr-close" onClick={onClose}>
          <Icon name="x" size={16} stroke={2.2} /> Close
        </button>
        <div className="lfr-title">
          <strong>{book.untitled ? 'Reading' : book.title}</strong>
          {book.author && <span>{book.author}</span>}
        </div>
        <div className="lfr-timerchip" aria-label={`Reading time ${fmtClock(seconds)}`}>
          <span className="lfr-dot" aria-hidden />
          {fmtClock(seconds)}
        </div>
      </div>

      <div className="lfr-stage">
        <button
          className="lfr-nav lfr-nav--prev"
          onClick={() => go(-1)}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <Icon name="chevron-left" size={26} />
        </button>

        <div className={`lfr-sheet lfr-sheet--${cur.type}`}>
          {cur.type === 'cover' && (
            <div className="lfr-coverwrap">
              <BookCover book={book} size="lg" />
            </div>
          )}
          {cur.type === 'text' && <TextPage seed={cur.seed} />}
          {cur.type === 'end' && (
            <EndPage book={book} minutes={minutes} onLog={() => onLog(minutes)} onClose={onClose} />
          )}
        </div>

        <button
          className="lfr-nav lfr-nav--next"
          onClick={() => go(1)}
          disabled={page === last}
          aria-label="Next page"
        >
          <Icon name="chevron-right" size={26} />
        </button>
      </div>

      <div className="lfr-bottom">
        <span className="lfr-count">
          {page === 0 ? 'Cover' : page === last ? 'The End' : `Page ${page} of ${contentCount}`}
        </span>
        <div className="lfr-progress">
          <span style={{ width: `${(page / last) * 100}%` }} />
        </div>
        <button className="lfr-donebtn" onClick={() => onLog(minutes)}>
          <Icon name="check" size={15} stroke={2.4} /> Done — log {minutes}m
        </button>
      </div>
    </div>
  )
}
