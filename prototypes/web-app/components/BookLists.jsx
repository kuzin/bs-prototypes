import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { FilterMenu, FilterMenuBar } from '@components/FilterMenu/FilterMenu'
import { ActiveFilters } from '@components/ActiveFilters/ActiveFilters'
import { EmptyState } from '@components/Primitives/Primitives'
import { ReaderBack } from '@components/ReaderApp/ReaderApp'

import { BookCover } from '@components/BookCover/BookCover'
import {
  BOOK_LISTS,
  BOOK_LIST_BOOKS,
  BOOK_LIST_GENRES,
  BOOK_LIST_GRADES,
  CATALOG_BY_ID,
} from '../data'
import './BookLists.css'

import '@components/Button/Button.css'
import '@components/Pill/Pill.css'
import '@components/SearchInput/SearchInput.css'
import '@components/Primitives/Primitives.css'
import '@components/ActiveFilters/ActiveFilters.css'

/**
 * Book Lists — `reading_lists#index`, the curated shelves a site publishes and
 * where "Find Books" sends you from the Wish List.
 *
 * A row is the list's cover, its name and **how many books are on it**, what
 * it's for, who made it, and the genres it covers. The page filters two ways —
 * grade level and genre, each taking several values (`with_grade_levels[]`,
 * `with_genres[]`) — which in the app is an off-canvas sidebar with "Clear
 * Filters" and "Hide Filters" over it; here each is a button that opens its own
 * list, the same way the catalog's five facets are.
 *
 * The cover is `image_for_list`: the list's own image where it has one, and
 * otherwise **the cover of its first book by title** — which is why a list of
 * graphic novels looks like one before you open it.
 *
 * A list can also live somewhere else (`external_list`): no books of its own,
 * so no count, and the name opens the other site rather than a page here.
 *
 * Search is `searchable_keywords ILIKE` — the name, the description, the genres
 * and a keyword line that isn't shown, so "manga" finds a list whose name never
 * says it.
 *
 * A row opens that list — `BookListPage` below.
 */

/** `image_for_list` — the list's own cover, or its first book's. */
function listBooks(list) {
  return (BOOK_LIST_BOOKS[list.id] ?? [])
    .map((id) => CATALOG_BY_ID[id])
    .filter(Boolean)
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function BookLists({ onOpenList, onFindBooks }) {
  const [q, setQ] = useState('')
  const [grades, setGrades] = useState([])
  const [genres, setGenres] = useState([])

  const term = q.trim().toLowerCase()
  const shown = BOOK_LISTS.filter(
    (l) =>
      (!term ||
        [l.name, l.description, l.keywords ?? '', l.genres.join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(term)) &&
      (!grades.length || l.grades.some((g) => grades.includes(g))) &&
      (!genres.length || l.genres.some((g) => genres.includes(g))),
  ).sort((a, b) => a.name.localeCompare(b.name))

  // One chip per set value, so clearing is per-tag rather than per-facet — the
  // same row Find Books puts under its own facets.
  const setters = { grades: setGrades, genres: setGenres }
  const applied = Object.entries({ grades, genres }).flatMap(([key, values]) =>
    values.map((v) => ({
      key: `${key}:${v}`,
      label: v,
      onClear: () => setters[key]((set) => set.filter((x) => x !== v)),
    })),
  )
  const clearAll = () => {
    setGrades([])
    setGenres([])
  }

  return (
    <div className="bl">
      <ReaderPageHead
        as="h2"
        title="Book Lists"
        /* Search belongs with the page's other controls, not on a line of its
           own under the title taking the width of the page. */
        actions={
          <>
            <SearchInput
              className="bl-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search book lists"
              ariaLabel="Search book lists"
            />
            <Button variant="secondary" onClick={onFindBooks}>
              Find Books
            </Button>
          </>
        }
      />

      {/* `grade_levels/filters` and `genres/filters` — the app's own two. One
          value each: these narrow a shelf of shelves, where the catalog's own
          facets stack up. */}
      <FilterMenuBar className="bl-filters">
        <FilterMenu
          label="Grade Levels"
          value={grades}
          options={BOOK_LIST_GRADES}
          onChange={setGrades}
          multi
        />
        <FilterMenu
          label="Genres"
          value={genres}
          options={BOOK_LIST_GENRES}
          onChange={setGenres}
          multi
        />
      </FilterMenuBar>

      {applied.length > 0 && <ActiveFilters filters={applied} onClearAll={clearAll} />}

      {shown.length === 0 ? (
        <EmptyState
          variant="dashed"
          title="No lists match that"
          description="Try a different genre or grade, or clear the filters."
        />
      ) : (
        <ul className="bl-list">
          {shown.map((list) => {
            const first = listBooks(list)[0]
            return (
              <li className={`bl-row is-hit${list.external ? ' is-external' : ''}`} key={list.id}>
                {list.external ? (
                  <a
                    className="bl-row-hit"
                    href={list.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${list.name} (opens in a new tab)`}
                  />
                ) : (
                  <button
                    type="button"
                    className="bl-row-hit"
                    onClick={() => onOpenList?.(list)}
                    aria-label={list.name}
                  />
                )}

                {/* The list's own image, or its first book's — the app falls
                    back the same way, and a list with neither (an external one)
                    gets the tinted tile. */}
                {first ? (
                  <span className="bl-cover bl-cover--book">
                    <BookCover book={first} size="fill" />
                  </span>
                ) : (
                  <span className="bl-cover" style={{ background: list.tint }} aria-hidden="true">
                    <Icon name={list.external ? 'external-link' : 'book-2'} size={26} />
                  </span>
                )}

                <div className="bl-body">
                  <div className="bl-head">
                    <h3 className="bl-name">
                      {list.name}
                      {list.external && (
                        <Icon name="external-link" size={14} stroke={2.2} className="bl-out" />
                      )}
                    </h3>
                    {/* An external list has no books here to count. */}
                    {!list.external && <span className="bl-count">{list.count} Books</span>}
                  </div>
                  <p className="bl-desc">{list.description}</p>
                  <div className="bl-meta">
                    <span className="bl-by">
                      <strong>Created by</strong> {list.by}
                    </span>
                    <span className="bl-genres">
                      <strong>Genres</strong>
                      {list.genres.map((g) => (
                        <Pill key={g} color="#087542" size="sm">
                          {g}
                        </Pill>
                      ))}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

/**
 * One list — `reading_lists#show`. The way back, the list's name over a Print
 * button, what it's for, the grade bands and genres it covers, and then the
 * books on it.
 *
 * The tags are the app's own two colours (`tag--purple` for a grade band,
 * `tag--teal` for a genre, from `lib/_tag.scss`) on our Pill rather than a
 * local copy of that class.
 *
 * A row is `li.reading-list-book`: the cover and title, the authors, and the
 * two things you can do with it. "Wish List" turns into "Added!" in place —
 * the app's own `ajax:success` handler does exactly that rather than navigating
 * away from a list you are still reading.
 */
export function BookListPage({ list, onBack, onOpenBook, onLog, onWish, features = {} }) {
  const [added, setAdded] = useState([])
  const { bookLogging = true, wishList = true } = features
  // `show_reading_list_books` orders by `book_title`.
  const books = listBooks(list)

  return (
    <div className="blp">
      <ReaderBack onClick={onBack}>Back to Book Lists</ReaderBack>

      <ReaderPageHead
        as="h2"
        title={list.name}
        actions={<Button variant="secondary">Print This List</Button>}
      />

      {list.description && <p className="blp-desc">{list.description}</p>}

      <div className="blp-meta">
        {list.grades.map((g) => (
          <Pill key={g} color="#901eaa" size="md">
            {g}
          </Pill>
        ))}
        {list.genres.map((g) => (
          <Pill key={g} color="#047282" size="md">
            {g}
          </Pill>
        ))}
      </div>

      {books.length === 0 ? (
        <EmptyState
          variant="dashed"
          title="No books have been added to this list yet."
          description="Check back — whoever made this list is still filling it."
        />
      ) : (
        <ul className="blp-books">
          {books.map((b) => (
            <li className="blp-book" key={b.id}>
              <button
                type="button"
                className="blp-book-cover"
                onClick={() => onOpenBook?.(b)}
                aria-label={b.title}
              >
                <BookCover book={b} size="fill" />
              </button>
              <div className="blp-book-meta">
                <button type="button" className="blp-book-title" onClick={() => onOpenBook?.(b)}>
                  {b.title}
                </button>
                <span className="blp-book-author">{b.author}</span>
              </div>
              {/* Both are settings: `allow_book_logging?` and the site's log
                  types for the first, `hide_wish_list?` for the second. */}
              <div className="blp-book-actions">
                {bookLogging && (
                  <Button size="sm" onClick={() => onLog?.(b)}>
                    Log
                  </Button>
                )}
                {wishList && (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={added.includes(b.id)}
                    onClick={() => {
                      setAdded((a) => [...a, b.id])
                      onWish?.(b)
                    }}
                  >
                    {added.includes(b.id) ? 'Added!' : 'Wish List'}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
