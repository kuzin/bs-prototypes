import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { coverUrl } from '../data'
import './BookCover.css'

/**
 * Book cover: real Open Library image when available, gradient placeholder
 * otherwise. Sizes: sm | md | lg. Magazines (`kind: 'magazine'`) get a
 * masthead-style placeholder — name + issue — so they read like a magazine
 * rack rather than a book with a missing cover.
 *
 * Titles with a digital edition (`readable`) get a corner chip. The sm size is
 * only used in search rows, which already spell out "Readable" beside the row.
 */
export function BookCover({ book, size = 'md', className = '' }) {
  const [err, setErr] = useState(false)
  const [from, to] = book.cover || ['#94A3B8', '#475569']
  const src = coverUrl(book.isbn)
  const showImg = src && !err
  const isMag = !showImg && book.kind === 'magazine'
  const showReadable = book.readable && size !== 'sm'

  return (
    <span
      className={`bkcov bkcov--${size} ${showImg ? 'bkcov--img' : ''} ${isMag ? 'bkcov--mag' : ''} ${showReadable ? 'bkcov--readable' : ''} ${className}`.trim()}
      style={
        showImg ? undefined : { background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)` }
      }
      aria-hidden="true"
    >
      {showImg ? (
        <img src={src} alt={book.title} loading="lazy" onError={() => setErr(true)} />
      ) : isMag ? (
        <>
          <span className="bkcov-magname">{book.masthead || book.title}</span>
          {book.issue && <span className="bkcov-issue">{book.issue}</span>}
        </>
      ) : (
        <>
          <span className="bkcov-title">{book.title}</span>
          <span className="bkcov-author">{book.author}</span>
        </>
      )}

      {showReadable && (
        <span className="bkcov-readable">
          <Icon name="book-2" size={size === 'lg' ? 16 : 11} stroke={2.4} />
        </span>
      )}
    </span>
  )
}
