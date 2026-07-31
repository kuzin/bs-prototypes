import { useState, useEffect, useMemo } from 'react'
import { Icon } from '@components/Icon/Icon'
import { CoverTile } from './common'

// A simulated in-app reader for a path's nonfiction titles — the "Read in app"
// half of the read-or-log choice. No real page art: pages render as clean
// typeset "text", and finishing logs the title (which earns its reading badge).

function buildPages() {
  return [{ type: 'cover' }, ...Array.from({ length: 5 }, (_, i) => ({ type: 'text', seed: i })), { type: 'end' }] // prettier-ignore
}

// The drop cap can't be floated — the "text" is block bars with fixed widths, so
// a float would sit on top of them instead of pushing them. It's positioned
// absolutely and the lines it covers are inset by hand.
const DROPCAP_INSET = 66 // px — keep in step with .pyp-tr-dropcap's width
const DROPCAP_LINES = 3

function TextPage({ seed }) {
  const paras = [4, 5, 3]
  const hasDropcap = seed === 0
  return (
    <div className="pyp-tr-text">
      {hasDropcap && <span className="pyp-tr-dropcap">A</span>}
      {paras.map((lines, p) => (
        <div key={p} className="pyp-tr-para">
          {Array.from({ length: lines }).map((_, l) => {
            const pct = l === lines - 1 ? 44 + ((seed + p + l) % 5) * 8 : 92 + ((p + l) % 3) * 2
            const inset = hasDropcap && p === 0 && l < DROPCAP_LINES
            return (
              <i
                key={l}
                style={{
                  width: inset ? `calc(${pct}% - ${DROPCAP_INSET}px)` : `${pct}%`,
                  marginLeft: inset ? DROPCAP_INSET : undefined,
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

/**
 * @param title   the title being read
 * @param path    its path (drives the cover fallback + accent)
 * @param onLog   called when the student finishes — logs the title as read
 * @param onClose dismiss without logging
 */
export function TitleReader({ title, path, onLog, onClose }) {
  const pages = useMemo(() => buildPages(), [])
  const [page, setPage] = useState(0)
  const last = pages.length - 1
  const contentCount = pages.length - 2
  const go = (d) => setPage((p) => Math.max(0, Math.min(last, p + d)))

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        setPage((p) => Math.min(last, p + 1))
      } else if (e.key === 'ArrowLeft') setPage((p) => Math.max(0, p - 1))
      else if (e.key === 'Escape') onClose()
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
    <div
      className="pyp-tr"
      role="dialog"
      aria-modal="true"
      aria-label={`Reading ${title.title}`}
      style={{ '--path-color': path.color }}
    >
      <div className="pyp-tr-top">
        <button className="pyp-tr-close" onClick={onClose} type="button">
          <Icon name="x" size={16} stroke={2.2} /> Close
        </button>
        <div className="pyp-tr-title">
          <strong>{title.title}</strong>
          <span>{title.author}</span>
        </div>
        <span className="pyp-tr-brand">
          <Icon name={path.icon} size={15} stroke={1.9} />
          {path.name.replace(/^The /, '')}
        </span>
      </div>

      <div className="pyp-tr-stage">
        <button
          className="pyp-tr-nav"
          onClick={() => go(-1)}
          disabled={page === 0}
          aria-label="Previous page"
          type="button"
        >
          <Icon name="chevron-left" size={24} />
        </button>

        <div className={`pyp-tr-sheet pyp-tr-sheet--${cur.type}`}>
          {cur.type === 'cover' && (
            <div className="pyp-tr-coverwrap">
              <CoverTile cover={title.cover} label={title.title} path={path} showTitle />
            </div>
          )}
          {cur.type === 'text' && <TextPage seed={cur.seed} />}
          {cur.type === 'end' && (
            <div className="pyp-tr-end">
              <span className="pyp-tr-end-mark">
                <Icon name="book" size={30} stroke={1.7} />
              </span>
              <h3>You finished {title.title}!</h3>
              <p>Log it to earn this title&apos;s reading badge and move along your path.</p>
              <button className="pyp-tr-logbtn" onClick={onLog} type="button">
                <Icon name="check" size={17} stroke={2.4} /> Log this reading
              </button>
              <button className="pyp-tr-backbtn" onClick={onClose} type="button">
                Close without logging
              </button>
            </div>
          )}
        </div>

        <button
          className="pyp-tr-nav"
          onClick={() => go(1)}
          disabled={page === last}
          aria-label="Next page"
          type="button"
        >
          <Icon name="chevron-right" size={24} />
        </button>
      </div>

      <div className="pyp-tr-bottom">
        <span className="pyp-tr-count">
          {page === 0 ? 'Cover' : page === last ? 'The End' : `Page ${page} of ${contentCount}`}
        </span>
        <div className="pyp-tr-progress">
          <span style={{ width: `${(page / last) * 100}%` }} />
        </div>
        <button className="pyp-tr-donebtn" onClick={onLog} type="button">
          <Icon name="check" size={15} stroke={2.4} /> Done — log it
        </button>
      </div>
    </div>
  )
}
