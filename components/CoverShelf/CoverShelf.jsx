import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import './CoverShelf.css'

/**
 * A scrolling rail of covers, paged by two arrows that sit *over* the artwork.
 *
 * The Student Profile's "Latest titles" is the shape this comes from — covers
 * share the row's width rather than sitting at a fixed size, the arrows fade in
 * on hover the way a streaming rail's do, and a disabled one hides rather than
 * sitting dead over a cover you came to look at.
 *
 *   <CoverShelf>
 *     {books.map((b) => (
 *       <CoverShelfItem key={b.id} title={`${b.title} — ${b.author}`} badge="68 shown">
 *         <BookCover book={b} size="fill" />
 *       </CoverShelfItem>
 *     ))}
 *   </CoverShelf>
 *
 * The shelf owns the rail and the paging; the tile owns what a cover is, so a
 * consumer can hand it `BookCover`, its own art, or anything cover-shaped.
 *
 * (The profile still draws its own `.bp-latest-*` copy of this. Folding that
 * one in is a follow-up — its CSS is threaded through the profile's card
 * layout in a way this component can't take on blind.)
 */
export function CoverShelf({ children, className = '' }) {
  const ref = useRef(null)
  const [ends, setEnds] = useState({ left: false, right: false })

  const sync = useCallback(() => {
    const el = ref.current
    if (!el) return
    // 1px of slack: fractional scroll widths never land exactly on the end.
    setEnds({
      left: el.scrollLeft > 1,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    })
    // Publish the rendered cover height so the arrows can centre on the
    // artwork rather than on the whole tile — the covers are fluid, so CSS has
    // no fixed number to work from.
    const cover = el.querySelector('.cshelf-cover')
    if (cover) {
      el.parentElement?.style.setProperty(
        '--shelf-cover-h',
        `${Math.round(cover.getBoundingClientRect().height)}px`,
      )
    }
  }, [])

  useEffect(() => {
    sync()
    const el = ref.current
    if (!el) return undefined
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => ro.disconnect()
  }, [sync, children])

  const page = (dir) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(el.clientWidth - 40, 120), behavior: 'smooth' })
  }

  return (
    <div className={`cshelf ${className}`.trim()}>
      {(ends.left || ends.right) && (
        <>
          <button
            type="button"
            className="cshelf-arrow cshelf-arrow--prev"
            onClick={() => page(-1)}
            disabled={!ends.left}
            aria-label="Previous titles"
          >
            <Icon name="chevron-left" size={13} stroke={2.2} />
          </button>
          <button
            type="button"
            className="cshelf-arrow cshelf-arrow--next"
            onClick={() => page(1)}
            disabled={!ends.right}
            aria-label="More titles"
          >
            <Icon name="chevron-right" size={13} stroke={2.2} />
          </button>
        </>
      )}
      <div className="cshelf-rail" ref={ref} onScroll={sync}>
        {children}
      </div>
    </div>
  )
}

/**
 * One cover on the shelf. `badge` is the one fact the shelf carries, worn along
 * the cover's bottom edge — the Lexile on the profile's shelf, the suggestion
 * count here. `title` is the hover/assistive label, because the tile is art
 * alone: captions under six covers turn a scannable shelf into six stacked
 * lines, and the artwork already says which book it is.
 */
export function CoverShelfItem({ title, badge, onClick, children }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      className={`cshelf-item${onClick ? ' cshelf-item--link' : ''}`}
      type={onClick ? 'button' : undefined}
      title={title}
      aria-label={onClick ? title : undefined}
      onClick={onClick}
    >
      <span className="cshelf-cover">
        {children}
        {badge && <span className="cshelf-badge">{badge}</span>}
      </span>
    </Tag>
  )
}
