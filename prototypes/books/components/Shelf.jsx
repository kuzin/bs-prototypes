import { Icon } from '@components/Icon/Icon'
import { BookCard } from './BookCard'
import { PARTNERS } from '../data'

/* Five titles and the way into the rest, which is the sixth card on the shelf
   rather than a control in the header — the same shelf the log flow builds for
   a reading list. A shelf that ends in a card reads as continuing, where a
   button up in the corner read as a separate thing to go and press. */
const SHOWN = 5

/**
 * A titled shelf of books. Every shelf shares one header anatomy — title +
 * subtitle on the left — so the page reads consistently top to bottom. A
 * curated shelf keeps its curator's line, because that is who is speaking; the
 * rest carry none.
 *
 * The row is a grid, not a scrolling track. Six equal cells across, so every
 * jacket on the page is the same size and a shelf is a shelf whether it holds
 * five books or twenty — the track it replaced left the last book half cut off
 * as a hint that there was more, and needed a pair of arrows to say so.
 */
export function Shelf({ shelf, books, onOpen, onWish, wishlist, onPlay, onViewAll, settings }) {
  const partner = shelf.partner ? PARTNERS[shelf.partner] : null
  const accent = partner ? partner.accent : shelf.accent || '#0D9488'
  const more = onViewAll && books.length > SHOWN
  const shown = more ? books.slice(0, SHOWN) : books
  // Audiobook art is square, so the card that ends that shelf is too — at 2:3
  // it stood a third taller than everything beside it.
  const audio = shelf.kind === 'audio'

  return (
    <section className="bk-shelf" style={{ '--accent': accent }}>
      <div className="bk-shelf-head">
        <h2 className="bk-shelf-title">{shelf.title}</h2>
        {shelf.curator ? (
          <p className="bk-shelf-sub bk-shelf-sub--curator">
            <Icon name="apple" size={13} /> Curated by {shelf.curator.name} · {shelf.curator.role}
          </p>
        ) : (
          shelf.subtitle && <p className="bk-shelf-sub">{shelf.subtitle}</p>
        )}
      </div>

      <div className="bk-shelf-row">
        {shown.map((book) => (
          <BookCard
            settings={settings}
            key={book.id}
            book={book}
            onOpen={onOpen}
            onWish={onWish}
            wished={wishlist.has(book.id)}
            onPlay={onPlay}
            variant={shelf.kind === 'rank' ? 'rank' : audio ? 'audio' : 'default'}
          />
        ))}

        {more && (
          <button
            type="button"
            className={`bk-morecard${audio ? ' bk-morecard--square' : ''}`}
            onClick={() => onViewAll(shelf, books)}
          >
            <span className="bk-morecard-label">
              <span>View</span>
              <span>More</span>
            </span>
          </button>
        )}
      </div>
    </section>
  )
}
