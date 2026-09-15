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
 *
 * `square` is audiobook art, which is square the way a record sleeve is — every
 * store that sells one shows it that way, and a 2:3 crop of it cuts the title
 * off. It is the shape of the tile, not a different component.
 */
export function BookCover({ book, size = 'md', square = false, className = '' }) {
  const [err, setErr] = useState(false)
  /* A placeholder cover is one flat pastel. `cover` is a pair because it used
     to be painted as a gradient, and a shelf of gradients read as decoration
     rather than as a row of books — the second stop is kept in the fixtures so
     a cover can go back to a ramp without re-authoring them all.
     The hue is let down into white for the ground and taken into the app's ink
     for the type, so every cover keeps its own colour and stays readable. */
  const [hue] = book.cover || ['#ACACAC']
  const ground = `color-mix(in srgb, ${hue} 30%, #fff)`
  const ink = `color-mix(in srgb, ${hue} 62%, #1f2933)`
  const src = coverIdUrl(book.coverId) ?? coverUrl(book.isbn)
  const showImg = src && !err
  const isMag = !showImg && book.kind === 'magazine'

  return (
    <span
      className={`bkcov bkcov--${size} ${showImg ? 'bkcov--img' : 'bkcov--flat'} ${isMag ? 'bkcov--mag' : ''} ${square ? 'bkcov--square' : ''} ${className}`.trim()}
      /* The colour is always the ground, even when an image is coming: an Open
         Library cover is a network round-trip away and `loading="lazy"` only
         starts it near the viewport, so a shelf of them flashed a row of white
         boxes — and a 404'd one sat white until `onError` ran. The image paints
         over this the moment it lands. */
      style={{ background: ground, color: ink }}
      aria-hidden="true"
    >
      {showImg ? (
        <img src={src} alt={book.title} loading="lazy" onError={() => setErr(true)} />
      ) : (
        <>
          {/* At thumbnail sizes a title and an author — or a masthead and an
              issue — are two clipped words, so the mark stands in for them in
              the cover's own ink. Which of the two shows is the cover's width,
              not the `size` it was asked for: `fill` takes whatever its cell
              gives it. It sits outside the two kinds of placeholder because
              both get small. */}
          <span className="bkcov-mark">
            <svg viewBox="0 0 24 32" focusable="false">
              <path d="M8.626 6.934c0 0-2.765-3.301-6.174-0.407-4.015 3.409-3.504 10.254 8.248 25.171 0.291 0.369 0.852 0.442 0.7-0.313-0.431-2.133-0.614-6.205 3.594-10.001 5.274-4.759 11.544-12.716 7.525-18.394-4.052-5.724-11.834-2.273-13.892 3.944z" />
            </svg>
          </span>
          {isMag ? (
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
        </>
      )}
    </span>
  )
}
