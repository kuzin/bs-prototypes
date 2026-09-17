import { useCallback, useEffect, useRef, useState } from 'react'
import { BookCover } from '@components/BookCover/BookCover'
import { Icon } from '@components/Icon/Icon'
import '@components/BookCover/BookCover.css'
import './BookRail.css'

/**
 * A rail of jackets — one motivation type's list, scrolled sideways.
 *
 * Book Discovery deliberately shelves its books in a six-cell grid rather than
 * a track, and says why: a grid keeps every jacket on the page the same size,
 * and a shelf of five reads like a shelf of twenty. That reasoning holds for a
 * page of curated shelves. It doesn't hold here. A report carries nine of these
 * lists at twelve books each, and nine grids of twelve is a page you scroll
 * past rather than shop from — the rail gives each list one line, so the list
 * you want is a glance away and the books inside it are a flick away.
 *
 * The arrows only appear when there is somewhere to go, and only on the side
 * that has it: a rail showing everything it has shouldn't offer to move.
 */
export function BookRail({ books }) {
  const track = useRef(null)
  const [at, setAt] = useState({ start: true, end: true })

  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    // A fractional scrollWidth (zoom, sub-pixel gaps) never quite reaches the
    // end, so the right arrow would sit enabled over a rail that can't move.
    setAt({
      start: el.scrollLeft <= 1,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
    })
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', measure)
      ro.disconnect()
    }
  }, [measure, books])

  /* A page is nearly the whole rail, not all of it: the jacket that was at the
     edge stays on screen, so you keep your place instead of jumping. */
  function page(direction) {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <div className={`rmi-bookrail${at.start ? ' is-start' : ''}${at.end ? ' is-end' : ''}`}>
      <button
        type="button"
        className="rmi-bookrail-arrow rmi-bookrail-arrow--prev"
        onClick={() => page(-1)}
        aria-label="Scroll left"
      >
        <Icon name="chevron-left" size={22} stroke={2.4} />
      </button>

      <ul className="rmi-bookrail-track" ref={track}>
        {books.map((book) => (
          <li key={book.id} className="rmi-bookrail-cell">
            <BookCover book={book} size="fill" />
            <span className="rmi-bookrail-title">{book.title}</span>
            <span className="rmi-bookrail-author">{book.author}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="rmi-bookrail-arrow rmi-bookrail-arrow--next"
        onClick={() => page(1)}
        aria-label="Scroll right"
      >
        <Icon name="chevron-right" size={22} stroke={2.4} />
      </button>
    </div>
  )
}
