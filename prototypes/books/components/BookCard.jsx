import { Icon } from '@components/Icon/Icon'
import { BookCover } from '@components/BookCover/BookCover'
import { PARTNERS, readNowPartner } from '../data'

// Cover-forward card, everywhere this prototype shelves a book.
//   'reason' → adds Benny's "why" line  |  'rank' → trending: readers count
//   'audio'  → square (Audible-style) cover + play affordance + listening time
//
// No caption. A shelf is a wall of jackets you scan, and the jacket carries the
// name already — setting it again under every cover turned each row into a
// block of text and left the ratings on a ragged line, because a one-line title
// and a three-line one end at different heights.
export function BookCard({
  book,
  onOpen,
  onWish,
  wished,
  variant = 'default',
  reason,
  onPlay,
  /* Which title sources this site has on — the mark can only promise what the
     site actually offers. Left off, every app is assumed on. */
  settings,
}) {
  const isAudio = variant === 'audio'
  // Which app can open this right now — the dot wears that app's colour.
  const now = readNowPartner(book, settings)

  return (
    <button
      type="button"
      className={`bk-card bk-card--${variant}`}
      onClick={() => onOpen(book.id)}
      aria-label={`${book.title} by ${book.author}`}
    >
      <div className="bk-card-coverwrap">
        <BookCover book={book} size="fill" square={isAudio} />
        {isAudio && (
          <span
            className="bk-card-play"
            role="button"
            tabIndex={-1}
            aria-label={`Play ${book.title}`}
            onClick={(e) => {
              e.stopPropagation()
              onPlay?.(book.id)
            }}
          >
            <Icon name="play-filled" size={16} />
          </span>
        )}
        {/* No label and no brand: a shelf is scanned, not read, and the reader
            is being told one thing — this one opens. *Which* app opens it is a
            question the book's own page answers, and putting five different
            logos down a shelf made the marks look like five different
            statuses. */}
        {now && (
          <span
            className="bk-card-now"
            title={`Read it now on ${PARTNERS[now]?.name ?? 'a linked app'}`}
            style={{ '--now': PARTNERS[now]?.accent }}
          />
        )}
        <span
          className={`bk-card-wish ${wished ? 'is-on' : ''}`}
          role="button"
          tabIndex={-1}
          aria-label={wished ? 'On your list' : 'Add to your list'}
          onClick={(e) => {
            e.stopPropagation()
            onWish?.(book.id)
          }}
        >
          <Icon name={wished ? 'bookmark-filled' : 'bookmark'} size={15} />
        </span>
      </div>

      <div className="bk-card-body">
        {variant === 'rank' ? (
          <span className="bk-card-readers">
            <Icon name="users" size={15} />
            {book.readersAtSchool} readers
          </span>
        ) : (
          <span className="bk-card-meta">
            <span className="bk-card-rate">
              <Icon name="star-filled" size={15} className="bk-card-star" />
              {book.rating.toFixed(1)}
            </span>
            {/* No format row: three grey glyphs under every jacket said what
                the book comes in, which is a question you ask after you have
                chosen it — the book page answers it, beside the place each
                format comes from. The audio shelf keeps its running time,
                which is the one format fact that helps you choose. */}
            {isAudio && (
              <span className="bk-card-audiolen">
                <Icon name="headphones" size={15} />
                {book.audioLength}
              </span>
            )}
          </span>
        )}

        {variant === 'reason' && reason && (
          <span className="bk-card-reason">
            <Icon name="sparkles" size={12} />
            {reason}
          </span>
        )}
      </div>
    </button>
  )
}
