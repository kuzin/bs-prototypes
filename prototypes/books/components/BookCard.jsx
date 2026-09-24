import { Icon } from '@components/Icon/Icon'
import { BookCover } from '@components/BookCover/BookCover'
import { WhereTags } from '@components/WhereTags/WhereTags'
import { ReadNowMark } from '@components/ReadNowMark/ReadNowMark'
import { PARTNERS, readNowPartner, whereTagsFor } from '../data'

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
  // Every place this reader can get it, strongest claim first.
  const places = whereTagsFor(book, settings)
  // Which app can open it this minute, if any — a play button on the jacket.
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
        {now && (
          <ReadNowMark
            color={PARTNERS[now]?.accent}
            title={`Read it now on ${PARTNERS[now]?.name ?? 'a linked app'}`}
          />
        )}
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
        {/* The one figure the card is about rides the jacket's bottom-left
            corner, the way the bookmark rides its top-right: the rating, or
            on the trending shelf how many readers here have it. */}
        {variant === 'rank' ? (
          <span className="bk-card-rate bk-card-rate--over">
            <Icon name="users" size={14} />
            {book.readersAtSchool} readers
          </span>
        ) : (
          <span className="bk-card-rate bk-card-rate--over">
            <Icon name="star-filled" size={14} className="bk-card-star" />
            {book.rating.toFixed(1)}
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
        {/* Where it is, under the jacket rather than on it: a tag on the art
            covered the cover it was describing, and two of them covered most
            of it. */}
        <WhereTags tags={places} className="bk-card-where" />
        {/* The audio shelf keeps its running time under the jacket — the one
            format fact that helps you choose which to press play on. */}
        {isAudio && (
          <span className="bk-card-meta">
            <span className="bk-card-audiolen">
              <Icon name="headphones" size={15} />
              {book.audioLength}
            </span>
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
