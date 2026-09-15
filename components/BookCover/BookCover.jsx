import { useState } from 'react'
import { coverIdUrl, coverUrl } from '@components/BookCover/covers'
import '@components/BookCover/BookCover.css'

/**
 * Book cover: real Open Library image when available, gradient placeholder
 * otherwise. Either `coverId` (Open Library's numeric cover id — exact) or
 * `isbn` supplies the image; `coverId` wins when both are set. Sizes: sm | md | lg | fill (fills its grid
 * cell rather than taking a fixed size — the All Titles shelf). Magazines (`kind: 'magazine'`) get a
 * masthead-style placeholder — name + issue — so they read like a magazine
 * rack rather than a book with a missing cover.
 */
export function BookCover({ book, size = 'md', className = '' }) {
  const [err, setErr] = useState(false)
  const [from, to] = book.cover || ['#ACACAC', '#656565']
  const src = coverIdUrl(book.coverId) ?? coverUrl(book.isbn)
  const showImg = src && !err
  const isMag = !showImg && book.kind === 'magazine'

  return (
    <span
      className={`bkcov bkcov--${size} ${showImg ? 'bkcov--img' : ''} ${isMag ? 'bkcov--mag' : ''} ${className}`.trim()}
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
    </span>
  )
}
