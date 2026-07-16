import { useState } from 'react'
import { coverUrl } from '../data'
import './BookCover.css'

/**
 * Book cover: real Open Library image when available, gradient placeholder
 * otherwise. Sizes: sm | md | lg.
 */
export function BookCover({ book, size = 'md', className = '' }) {
  const [err, setErr] = useState(false)
  const [from, to] = book.cover || ['#94A3B8', '#475569']
  const src = coverUrl(book.isbn)
  const showImg = src && !err

  return (
    <span
      className={`bkcov bkcov--${size} ${showImg ? 'bkcov--img' : ''} ${className}`.trim()}
      style={
        showImg ? undefined : { background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)` }
      }
      aria-hidden="true"
    >
      {showImg ? (
        <img src={src} alt={book.title} loading="lazy" onError={() => setErr(true)} />
      ) : (
        <>
          <span className="bkcov-title">{book.title}</span>
          <span className="bkcov-author">{book.author}</span>
        </>
      )}
    </span>
  )
}
