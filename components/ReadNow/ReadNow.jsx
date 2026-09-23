import { useState, useEffect, useMemo } from 'react'
import { Icon } from '@components/Icon/Icon'
import { BookCover } from '@components/BookCover/BookCover'
import { PartnerMark, PARTNER_BRANDS } from '@components/PartnerBrand/PartnerBrand'
import '@components/ReadNow/ReadNow.css'

// A simulated in-app reader for the "Read now" experience, branded for whichever
// partner the title is being read on (Comics Plus, Scholastic, …).
//
// Shared: every surface that offers to read a title in a linked app lands here
// — the Book Discovery page's "Read now" and the log flow's "Read in …" tile
// menu. `partner` is an id from `PARTNER_BRANDS`.
// No real page art — graphic novels render stylized comic panels, everything
// else renders a clean text page; flip with arrows/keys, and finishing ties
// back into your Wish List.

const SFX = ['POW!', 'WHOOSH!', 'ZAP!', 'KA-BOOM!', 'ZOOM', 'TA-DA!']
const LAYOUTS = ['l-a', 'l-b', 'l-c', 'l-b', 'l-a', 'l-c']
const PANEL_COUNT = { 'l-a': 3, 'l-b': 4, 'l-c': 2 }

function buildPages(book) {
  /* Comic pages for a graphic novel, text pages for everything else. A
     catalog without genres — the log flow's — reads as text. */
  const comic = (book.genres || []).includes('Graphic Novel')
  const pages = [{ type: 'cover' }]
  for (let i = 0; i < 6; i++)
    pages.push(comic ? { type: 'comic', layout: LAYOUTS[i], seed: i } : { type: 'text', seed: i })
  pages.push({ type: 'end' })
  return pages
}

function ComicPage({ layout, seed, color }) {
  const count = PANEL_COUNT[layout]
  return (
    <div className={`rdn-reader-comic ${layout}`}>
      {Array.from({ length: count }).map((_, i) => {
        const tone = (seed + i) % 4
        const bubble = (seed + i) % 2 === 0
        const caption = i === 0 && seed % 3 === 1
        const sfx = i === count - 1 && seed % 2 === 1
        return (
          <div key={i} className={`rdn-panel rdn-panel--t${tone}`} style={{ '--pc': color }}>
            {caption && (
              <span className="rdn-panel-caption">
                <i /> <i />
              </span>
            )}
            {bubble && (
              <span className={`rdn-panel-bubble ${i % 2 ? 'is-right' : ''}`}>
                <i /> <i /> <i />
              </span>
            )}
            {sfx && <span className="rdn-panel-sfx">{SFX[(seed + i) % SFX.length]}</span>}
          </div>
        )
      })}
    </div>
  )
}

function TextPage({ seed }) {
  const paras = [5, 4, 6, 4]
  return (
    <div className="rdn-reader-text">
      {seed === 0 && <span className="rdn-reader-dropcap">A</span>}
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

/* The last page hands the reader on rather than finishing anything itself:
   reaching the end of the pages is not the same as saying you read it, and the
   log is where that is said. `onFinish` opens the log form on this title with
   **Finished** already ticked, so all that's left is the amount and Log. */
function EndPage({ book, onFinish, onClose }) {
  return (
    <div className="rdn-reader-end">
      <img src="/bs-prototypes/benny-laughing.svg" alt="" className="rdn-reader-end-benny" />
      <h2>You finished {book.title}!</h2>
      <p>Nice reading 🎉 Log it to finish the book and see your challenge progress.</p>
      <button
        className="rdn-reader-finish"
        onClick={() => {
          onFinish?.()
          onClose?.()
        }}
      >
        <Icon name="check" size={17} /> Log this reading
      </button>
      <button className="rdn-reader-backbtn" onClick={onClose}>
        Back to book
      </button>
    </div>
  )
}

export function ReadNow({ book, partner = 'comicsplus', onClose, onFinish }) {
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
  const p = PARTNER_BRANDS[partner] || PARTNER_BRANDS.comicsplus

  return (
    <div
      className="rdn-reader"
      role="dialog"
      aria-label={`Reading ${book.title} on ${p.name}`}
      style={{ '--p': p.accent }}
    >
      <div className="rdn-reader-top">
        <button className="rdn-reader-close" onClick={onClose}>
          <Icon name="x" size={16} /> Close
        </button>
        <div className="rdn-reader-title">
          <strong>{book.title}</strong>
          <span>{book.author}</span>
        </div>
        <div className="rdn-reader-brand">
          <span>Reading on</span>
          <PartnerMark id={p.id} size={22} />
          <strong>{p.name}</strong>
        </div>
      </div>

      <div className="rdn-reader-stage">
        <button
          className="rdn-reader-nav rdn-reader-nav--prev"
          onClick={() => go(-1)}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <Icon name="chevron-left" size={26} />
        </button>

        <div className={`rdn-reader-sheet rdn-reader-sheet--${cur.type}`}>
          {cur.type === 'cover' && (
            <div className="rdn-reader-coverwrap">
              <BookCover book={book} size="fill" />
            </div>
          )}
          {cur.type === 'comic' && (
            <ComicPage
              layout={cur.layout}
              seed={cur.seed}
              color={book.color || book.cover?.[0] || p.accent}
            />
          )}
          {cur.type === 'text' && <TextPage seed={cur.seed} />}
          {cur.type === 'end' && <EndPage book={book} onFinish={onFinish} onClose={onClose} />}
        </div>

        <button
          className="rdn-reader-nav rdn-reader-nav--next"
          onClick={() => go(1)}
          disabled={page === last}
          aria-label="Next page"
        >
          <Icon name="chevron-right" size={26} />
        </button>
      </div>

      <div className="rdn-reader-bottom">
        <span className="rdn-reader-count">
          {page === 0 ? 'Cover' : page === last ? 'The End' : `Page ${page} of ${contentCount}`}
        </span>
        <div className="rdn-reader-progress">
          <span style={{ width: `${(page / last) * 100}%` }} />
        </div>
        <span className="rdn-reader-hint">
          <Icon name="arrow-left" size={13} /> <Icon name="arrow-right" size={13} /> to turn pages
        </span>
      </div>
    </div>
  )
}
