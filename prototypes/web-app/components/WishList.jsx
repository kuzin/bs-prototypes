import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { EmptyState } from '@components/Primitives/Primitives'

import { BookCover } from '../../logging-flow/components/BookCover'
import { BOOKS } from '../../logging-flow/data'
import { WISH_LIST, CATALOG_BY_ID } from '../data'
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
 */

const READER = 'Olivia'

export function WishList({ onFindBooks, onLog, onOpenBook }) {
  const [items, setItems] = useState(WISH_LIST)
  const [q, setQ] = useState('')
  const [searching, setSearching] = useState(false)

  const term = q.trim().toLowerCase()
  const shown = term
    ? items.filter((i) => {
        const b = BOOKS[i.book]
        return b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)
      })
    : items

  const remove = (book) => setItems((is) => is.filter((i) => i.book !== book))

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
        count={`${items.length} ${items.length === 1 ? 'book' : 'books'}`}
        actions={
          <>
            <Button variant="secondary" onClick={onFindBooks}>
              Find Books
            </Button>
            <Button variant="secondary" onClick={() => setSearching((s) => !s)}>
              Search Wish List
            </Button>
          </>
        }
      />

      {searching && (
        <div className="wl-search">
          <SearchInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search this list"
            aria-label="Search wish list"
          />
        </div>
      )}

      {shown.length === 0 ? (
        <EmptyState
          variant="dashed"
          title="Nothing matches that"
          description={`No book on ${READER}'s wish list matches “${q.trim()}”.`}
        />
      ) : (
        <ul className="wl-list">
          {shown.map((item) => {
            const book = BOOKS[item.book]
            // The row's title is that book's record — the catalog is wider than
            // the log, so this is where a wished-for title goes.
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
                  <Button variant="secondary" size="sm" onClick={() => remove(item.book)}>
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
