import { useState, useEffect, useMemo } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Cover } from './Cover'
import { PARTNERS } from '../data'

// A simulated in-app reader for the "Read now on Comics Plus" experience.
// No real page art — graphic novels render stylized comic panels, everything
// else renders a clean text page; flip with arrows/keys, and finishing ties
// back into your shelf.

const SFX = ['POW!', 'WHOOSH!', 'ZAP!', 'KA-BOOM!', 'ZOOM', 'TA-DA!']
const LAYOUTS = ['l-a', 'l-b', 'l-c', 'l-b', 'l-a', 'l-c']
const PANEL_COUNT = { 'l-a': 3, 'l-b': 4, 'l-c': 2 }

function buildPages(book) {
  const comic = book.genres.includes('Graphic Novel')
  const pages = [{ type: 'cover' }]
  for (let i = 0; i < 6; i++)
    pages.push(comic ? { type: 'comic', layout: LAYOUTS[i], seed: i } : { type: 'text', seed: i })
  pages.push({ type: 'end' })
  return pages
}

function ComicPage({ layout, seed, color }) {
  const count = PANEL_COUNT[layout]
  return (
    <div className={`bk-reader-comic ${layout}`}>
      {Array.from({ length: count }).map((_, i) => {
        const tone = (seed + i) % 4
        const bubble = (seed + i) % 2 === 0
        const caption = i === 0 && seed % 3 === 1
        const sfx = i === count - 1 && seed % 2 === 1
        return (
          <div key={i} className={`bk-panel bk-panel--t${tone}`} style={{ '--pc': color }}>
            {caption && (
              <span className="bk-panel-caption">
                <i /> <i />
              </span>
            )}
            {bubble && (
              <span className={`bk-panel-bubble ${i % 2 ? 'is-right' : ''}`}>
                <i /> <i /> <i />
              </span>
            )}
            {sfx && <span className="bk-panel-sfx">{SFX[(seed + i) % SFX.length]}</span>}
          </div>
        )
      })}
    </div>
  )
}

function TextPage({ seed }) {
  const paras = [5, 4, 6, 4]
  return (
    <div className="bk-reader-text">
      {seed === 0 && <span className="bk-reader-dropcap">A</span>}
      {paras.map((lines, p) => (
        <div key={p} className="bk-text-para">
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

function EndPage({ book, onFinish, onClose }) {
  return (
    <div className="bk-reader-end">
      <img src="/bs-prototypes/benny-laughing.svg" alt="" className="bk-reader-end-benny" />
      <h2>You finished {book.title}!</h2>
      <p>Nice reading 🎉 Mark it finished to log it and see your challenge progress.</p>
      <button
        className="bk-reader-finish"
        onClick={() => {
          onFinish?.()
          onClose?.()
        }}
      >
        <Icon name="check" size={17} /> Mark as finished
      </button>
      <button className="bk-reader-backbtn" onClick={onClose}>
        Back to book
      </button>
    </div>
  )
}

export function ReadNow({ book, onClose, onFinish }) {
  const pages = useMemo(() => buildPages(book), [book])
  const [page, setPage] = useState(0)
  const last = pages.length - 1
  const contentCount = pages.length - 2
  const go = (d) => setPage((p) => Math.max(0, Math.min(last, p + d)))

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
  const cp = PARTNERS.comicsplus

  return (
    <div className="bk-reader" role="dialog" aria-label={`Reading ${book.title}`}>
      <div className="bk-reader-top">
        <button className="bk-reader-close" onClick={onClose}>
          <Icon name="x" size={16} /> Close
        </button>
        <div className="bk-reader-title">
          <strong>{book.title}</strong>
          <span>{book.author}</span>
        </div>
        <div className="bk-reader-brand">
          <span>Reading on</span>
          <img src={cp.mark} alt="" />
          <strong>Comics Plus</strong>
        </div>
      </div>

      <div className="bk-reader-stage">
        <button
          className="bk-reader-nav bk-reader-nav--prev"
          onClick={() => go(-1)}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <Icon name="chevron-left" size={26} />
        </button>

        <div className={`bk-reader-sheet bk-reader-sheet--${cur.type}`}>
          {cur.type === 'cover' && (
            <div className="bk-reader-coverwrap">
              <Cover book={book} size="lg" />
            </div>
          )}
          {cur.type === 'comic' && (
            <ComicPage layout={cur.layout} seed={cur.seed} color={book.color} />
          )}
          {cur.type === 'text' && <TextPage seed={cur.seed} />}
          {cur.type === 'end' && <EndPage book={book} onFinish={onFinish} onClose={onClose} />}
        </div>

        <button
          className="bk-reader-nav bk-reader-nav--next"
          onClick={() => go(1)}
          disabled={page === last}
          aria-label="Next page"
        >
          <Icon name="chevron-right" size={26} />
        </button>
      </div>

      <div className="bk-reader-bottom">
        <span className="bk-reader-count">
          {page === 0 ? 'Cover' : page === last ? 'The End' : `Page ${page} of ${contentCount}`}
        </span>
        <div className="bk-reader-progress">
          <span style={{ width: `${(page / last) * 100}%` }} />
        </div>
        <span className="bk-reader-hint">
          <Icon name="arrow-left" size={13} /> <Icon name="arrow-right" size={13} /> to turn pages
        </span>
      </div>
    </div>
  )
}
