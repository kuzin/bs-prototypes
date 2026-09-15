import { Icon } from '@components/Icon/Icon'
import { BookCover } from '@components/BookCover/BookCover'
import { FORMATS } from '../data'

// Cover-forward card, everywhere this prototype shelves a book.
//   'reason' → adds Benny's "why" line  |  'rank' → trending: readers count
//   'audio'  → square (Audible-style) cover + play affordance + listening time
//
// No caption. A shelf is a wall of jackets you scan, and the jacket carries the
// name already — setting it again under every cover turned each row into a
// block of text and left the ratings on a ragged line, because a one-line title
// and a three-line one end at different heights.
export function BookCard({ book, onOpen, onWish, wished, variant = 'default', reason, onPlay }) {
  const isAudio = variant === 'audio'

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
            {isAudio ? (
              <span className="bk-card-audiolen">
                <Icon name="headphones" size={15} />
                {book.audioLength}
              </span>
            ) : (
              <span className="bk-card-formats">
                {book.formats.slice(0, 3).map((f) => (
                  <Icon key={f} name={FORMATS[f].icon} size={15} title={FORMATS[f].label} />
                ))}
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
