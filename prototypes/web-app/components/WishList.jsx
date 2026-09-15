import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { EmptyState } from '@components/Primitives/Primitives'

import { BookCover } from '@components/BookCover/BookCover'
import { BOOKS } from '../../logging-flow/data'
import { CATALOG_BY_ID } from '../data'
import './WishList.css'

import '@components/Button/Button.css'
import '@components/SearchInput/SearchInput.css'
import '@components/Primitives/Primitives.css'

/**
 * Books the reader means to get to — `profiles/wish_list.html.haml`.
 *
 * A row is the cover, the title, and **who put it there**: a parent or a
 * teacher can add to a reader's list, so the app says whose idea it was rather
 * than assuming the reader's own. Three things you can do with a row — log it,
 * get it from the library, take it off — and the middle one only appears where
 * the title actually has a library URL.
 *
 * "Search Wish List" and "Find Books" only show once there is a list; empty,
 * the page is the blank slate and its one way out.
 *
 * The list itself is the app's, not this page's: a book page can put a title on
 * it and take it off again, so `items` and `onRemove` come from whoever owns
 * the reader.
 */

const READER = 'Olivia'

/**
 * The record behind a wish-list row. The catalog is the wider of the two — it
 * has everything the log has and everything the reader hasn't read yet — but
 * the log carries the partner magazines the catalog doesn't, so a row resolves
 * against both. A row whose book is in neither is dropped rather than crashing
 * the page.
 */
const recordFor = (id) => CATALOG_BY_ID[id] ?? BOOKS[id]

export function WishList({ items = [], onRemove, onFindBooks, onLog, onOpenBook }) {
  const [q, setQ] = useState('')

  const term = q.trim().toLowerCase()
  const known = items.filter((i) => recordFor(i.book))
  const shown = term
    ? known.filter((i) => {
        const b = recordFor(i.book)
        return b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)
      })
    : known

  if (items.length === 0) {
    return (
      <div className="wl">
        <ReaderPageHead as="h2" title="Wish List" />
        <EmptyState
          variant="dashed"
          icon={<Icon name="heart" size={26} />}
          title={`There hasn't been anything added to ${READER}'s Wish List yet.`}
          description="Browse our collection of recommended books to find things to add."
          action={<Button onClick={onFindBooks}>Find Books</Button>}
        />
      </div>
    )
  }

  return (
    <div className="wl">
      <ReaderPageHead
        as="h2"
        title="Wish List"
        /* Search belongs with the page's other controls. It used to be a button
           that revealed a full-width field underneath — two steps and a line of
           the page to do what a field in the header does. */
        actions={
          <>
            <SearchInput
              className="wl-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search this list"
              ariaLabel="Search wish list"
            />
            <Button variant="secondary" onClick={onFindBooks}>
              Find Books
            </Button>
          </>
        }
      />

      {shown.length === 0 ? (
        <EmptyState
          variant="dashed"
          title="Nothing matches that"
          description={`No book on ${READER}'s wish list matches “${q.trim()}”.`}
        />
      ) : (
        <ul className="wl-list">
          {shown.map((item) => {
            const book = recordFor(item.book)
            // The row's title goes to that book's page — but only a catalog
            // title has one; a partner magazine the log knows does not.
            const record = CATALOG_BY_ID[item.book]
            return (
              <li className="wl-row" key={item.book}>
                {record ? (
                  <button
                    type="button"
                    className="wl-cover wl-hit"
                    onClick={() => onOpenBook?.(record)}
                    aria-label={book.title}
                  >
                    <BookCover book={book} size="fill" />
                  </button>
                ) : (
                  <span className="wl-cover">
                    <BookCover book={book} size="fill" />
                  </span>
                )}
                <div className="wl-meta">
                  {record ? (
                    <button
                      type="button"
                      className="wl-title wl-hit"
                      onClick={() => onOpenBook?.(record)}
                    >
                      {book.title}
                    </button>
                  ) : (
                    <span className="wl-title">{book.title}</span>
                  )}
                  <span className="wl-author">{book.author}</span>
                  {/* The app's own line — a wish list is not always your own. */}
                  <span className="wl-added">
                    Book added by {item.addedBy} on {item.dateAdded}
                  </span>
                </div>
                <div className="wl-actions">
                  <Button size="sm" onClick={() => onLog?.(book)}>
                    Log Reading
                  </Button>
                  {/* Only where the title actually has a library URL. */}
                  {item.library && (
                    <Button variant="secondary" size="sm">
                      Get This Book
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => onRemove?.(item.book)}>
                    Remove
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
