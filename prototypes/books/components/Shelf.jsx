import { useRef, useState, useEffect } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Avatar } from '@components/Avatar/Avatar'
import { Button } from '@components/Button/Button'
import { BookCard } from './BookCard'
import { PARTNERS } from '../data'

// Representative glyph per shelf so every badge uses the same line-icon style.
const SHELF_GLYPH = {
  comicsplus: 'book',
  scholastic: 'news',
  sora: 'device-tablet',
  library: 'building-community',
}

// A titled horizontal row of books. Every shelf shares one header anatomy — a
// 44px accent-tinted icon badge + title + subtitle + arrow controls — so the
// page reads consistently top to bottom.
export function Shelf({ shelf, books, onOpen, onWish, wishlist, onPlay, onViewAll }) {
  const trackRef = useRef(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const partner = shelf.partner ? PARTNERS[shelf.partner] : null
  const accent = partner ? partner.accent : shelf.accent || '#0D9488'

  const updateEdges = () => {
    const el = trackRef.current
    if (!el) return
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })
  }
  useEffect(() => {
    updateEdges()
  }, [books])

  const scroll = (dir) => {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <section className="bk-shelf" style={{ '--accent': accent }}>
      <div className="bk-shelf-head">
        <div className="bk-shelf-headmain">
          {shelf.curator ? (
            <Avatar
              initials={shelf.curator.initials}
              color={shelf.curator.color}
              size="md"
              aria-hidden="true"
            />
          ) : (
            <span className="bk-shelf-badge">
              <Icon
                name={partner ? SHELF_GLYPH[partner.id] || 'book' : shelf.icon || 'book-2'}
                size={21}
              />
            </span>
          )}
          <div className="bk-shelf-titles">
            <h2 className="bk-shelf-title">{shelf.title}</h2>
            {shelf.curator ? (
              <p className="bk-shelf-sub bk-shelf-sub--curator">
                <Icon name="apple" size={13} /> Curated by {shelf.curator.name} ·{' '}
                {shelf.curator.role}
              </p>
            ) : (
              shelf.subtitle && <p className="bk-shelf-sub">{shelf.subtitle}</p>
            )}
          </div>
        </div>
        <div className="bk-shelf-controls">
          {onViewAll && (
            <Button
              variant="secondary"
              size="sm"
              className="bk-shelf-viewall"
              iconRight={<Icon name="chevron-right" size={14} />}
              onClick={() => onViewAll(shelf, books)}
            >
              {partner ? `View More on ${partner.name}` : 'View all'}
            </Button>
          )}
          <button
            className="bk-arrow"
            onClick={() => scroll(-1)}
            disabled={edge.start}
            aria-label="Scroll left"
          >
            <Icon name="chevron-left" size={18} />
          </button>
          <button
            className="bk-arrow"
            onClick={() => scroll(1)}
            disabled={edge.end}
            aria-label="Scroll right"
          >
            <Icon name="chevron-right" size={18} />
          </button>
        </div>
      </div>

      <div
        className={`bk-shelf-trackwrap ${edge.start ? '' : 'can-left'} ${edge.end ? '' : 'can-right'}`.trim()}
      >
        <div className="bk-shelf-track" ref={trackRef} onScroll={updateEdges}>
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onOpen={onOpen}
              onWish={onWish}
              wished={wishlist.has(book.id)}
              onPlay={onPlay}
              variant={
                shelf.kind === 'rank' ? 'rank' : shelf.kind === 'audio' ? 'audio' : 'default'
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}
