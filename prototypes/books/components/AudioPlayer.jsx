import { useState, useEffect, useRef } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Cover } from './Cover'

const parseLen = (s) => {
  const h = /(\d+)\s*h/.exec(s || '')
  const m = /(\d+)\s*m/.exec(s || '')
  return (h ? +h[1] * 3600 : 0) + (m ? +m[1] * 60 : 0) || 3600
}
const clock = (sec) => {
  sec = Math.max(0, Math.round(sec))
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const mm = String(m).padStart(2, '0')
  return h ? `${h}:${mm}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}
const SPEEDS = [1, 1.25, 1.5, 2]
// Deterministic waveform bar heights (no Math.random — stable across renders).
const BARS = Array.from({ length: 60 }, (_, i) => 26 + Math.round(Math.abs(Math.sin(i * 1.7)) * 72))

// A mock "now playing" audiobook screen — the audio counterpart to ReadNow.
export function AudioPlayer({ book, onClose, onFinish }) {
  const total = parseLen(book.audioLength)
  const [elapsed, setElapsed] = useState(Math.round(total * 0.14))
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const timer = useRef(null)
  const closeRef = useRef(null)

  // Tick the playhead while playing — faster at higher speeds.
  useEffect(() => {
    if (!playing) return undefined
    timer.current = setInterval(() => setElapsed((e) => Math.min(total, e + speed)), 1000)
    return () => clearInterval(timer.current)
  }, [playing, speed, total])

  // Close on Escape + move focus into the player (matches the ReadNow reader).
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const pct = Math.min(100, (elapsed / total) * 100)
  const chapters = Math.max(6, Math.round(book.pageCount / 24))
  const chapter = Math.min(chapters, Math.floor((elapsed / total) * chapters) + 1)
  const skip = (d) => setElapsed((e) => Math.max(0, Math.min(total, e + d)))
  const cycleSpeed = () => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])

  return (
    <div
      className="bk-audio"
      style={{ '--accent': book.color }}
      role="dialog"
      aria-modal="true"
      aria-label={`Listening to ${book.title}`}
    >
      <div className="bk-audio-glow" aria-hidden="true" />
      <div className="bk-audio-top">
        <button
          ref={closeRef}
          className="bk-audio-close"
          onClick={onClose}
          aria-label="Close player"
        >
          <Icon name="chevron-down" size={22} />
        </button>
        <span className="bk-audio-kicker">
          <Icon name="headphones" size={14} /> Now playing
        </span>
        <span className="bk-audio-spacer" />
      </div>

      <div className="bk-audio-art">
        <Cover book={book} size="lg" />
      </div>

      <div className="bk-audio-meta">
        <h2 className="bk-audio-title">{book.title}</h2>
        <p className="bk-audio-author">by {book.author}</p>
        <span className="bk-audio-chapter">
          Chapter {chapter} of {chapters} · Unabridged
        </span>
      </div>

      <div className="bk-audio-wave" aria-hidden="true">
        {BARS.map((h, i) => (
          <span
            key={i}
            className={`bk-audio-bar ${(i / BARS.length) * 100 <= pct ? 'is-played' : ''}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="bk-audio-times">
        <span>{clock(elapsed)}</span>
        <span>-{clock(total - elapsed)}</span>
      </div>

      <div className="bk-audio-controls">
        <button className="bk-audio-speed" onClick={cycleSpeed} aria-label="Playback speed">
          {speed}×
        </button>
        <button className="bk-audio-skip" onClick={() => skip(-15)} aria-label="Back 15 seconds">
          <Icon name="rewind-backward-15" size={28} />
        </button>
        <button
          className="bk-audio-play"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          <Icon name={playing ? 'pause-filled' : 'play-filled'} size={30} />
        </button>
        <button className="bk-audio-skip" onClick={() => skip(15)} aria-label="Forward 15 seconds">
          <Icon name="rewind-forward-15" size={28} />
        </button>
        <button
          className="bk-audio-finish"
          onClick={() => {
            onFinish?.()
            onClose?.()
          }}
          aria-label="Mark as finished"
        >
          <Icon name="check" size={20} />
        </button>
      </div>
    </div>
  )
}
