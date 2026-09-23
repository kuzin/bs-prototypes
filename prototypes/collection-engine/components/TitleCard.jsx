// A title as a cover rather than a row.
//
// The table is the working view — sort it, filter it, export it. This is the
// browsing one: a teacher deciding what to pull for Monday is choosing between
// books, and a book you choose between has a cover.
//
// So it is the app's own shelf grid, not a card of its own design:
// `books#index`'s `ul.block-grid.large-block-grid-5` — covers five across, each
// one a link, title and author centred under it, the cover lifting on hover.
// The two staff facts this screen adds (who it serves, where it is now) sit
// under the author in the same centred column.
import { BookCover } from '@components/BookCover/BookCover'
import { Tooltip } from '@components/Primitives/Primitives'
import '@components/BookCover/BookCover.css'
import '@components/Primitives/Primitives.css'

import './TitleCard.css'

/**
 * <TitleCard
 *   title={title}                    // a catalog title: title, author, coverId
 *   meta="5 readers"                 // the hover label's second line
 *   onOpen={() => setOpenTitle(id)}
 * />
 *
 * Cover art alone. Title, author and count under each one turned a shelf you
 * could scan into a grid of stacked captions, and the artwork already says
 * which book it is — the words are in the tooltip for anyone who needs them,
 * and the book panel behind the tile has the rest.
 *
 * `meta` is a string rather than a count so each host says what its own number
 * means — the classroom counts readers it serves, the school counts readers it
 * was suggested to, and neither should have to read as the other.
 *
 * `badge` is an optional control over the jacket's corner, for a host that can
 * *do* something to a title as well as open it. Without one the tile is exactly
 * what it was.
 */
export function TitleCard({ title, meta, onOpen, badge }) {
  return (
    <li className="tcard">
      {/* Three facts, not one run-on line: the title leads, the author sits
          under it, and the count the view is ranked by is quieter still. A
          tooltip is the tile's caption here, so it is set like one. */}
      <Tooltip
        content={
          <span className="tcard-tip">
            <strong className="tcard-tip-name">{title.title}</strong>
            <span className="tcard-tip-author">{title.author}</span>
            {meta && <span className="tcard-tip-meta">{meta}</span>}
          </span>
        }
      >
        <button type="button" onClick={onOpen} aria-label={`${title.title} — ${title.author}`}>
          <span className="tcard-cover">
            <BookCover book={{ coverId: title.coverId, title: title.title }} size="fill" />
          </span>
        </button>
      </Tooltip>
      {/* A control over the jacket's corner — the same place the reader's own
          card puts its bookmark. Outside the Tooltip's button, so pressing it
          isn't also opening the panel behind it. */}
      {badge && <span className="tcard-badge">{badge}</span>}
    </li>
  )
}

/** The shelf they sit on — as many across as fit, the way the catalog pages do. */
export function TitleGrid({ children, className = '' }) {
  return <ul className={`tcard-grid ${className}`.trim()}>{children}</ul>
}
