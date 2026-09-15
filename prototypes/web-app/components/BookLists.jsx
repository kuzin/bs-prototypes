import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { EmptyState } from '@components/Primitives/Primitives'

import { BOOK_LISTS, BOOK_LIST_GENRES, BOOK_LIST_GRADES } from '../data'
import './BookLists.css'

import '@components/Button/Button.css'
import '@components/Pill/Pill.css'
import '@components/SearchInput/SearchInput.css'
import '@components/Primitives/Primitives.css'

/**
 * Book Lists — `reading_lists#index`, the curated shelves a site publishes and
 * where "Find Books" sends you from the Wish List.
 *
 * A row is the list's cover, its name and **how many books are on it**, what
 * it's for, who made it, and the genres it covers. The page filters two ways —
 * grade level and genre — which in the app is an off-canvas sidebar with
 * "Clear Filters" and "Hide Filters" over it; here the filters are chips on
 * the page, since there is no room to hide a drawer in a prototype and the
 * choice is small enough to show.
 */
export function BookLists() {
  const [q, setQ] = useState('')
  const [grade, setGrade] = useState(null)
  const [genre, setGenre] = useState(null)

  const term = q.trim().toLowerCase()
  const shown = BOOK_LISTS.filter(
    (l) =>
      (!term ||
        l.name.toLowerCase().includes(term) ||
        l.description.toLowerCase().includes(term)) &&
      (!grade || l.grades.includes(grade)) &&
      (!genre || l.genres.includes(genre)),
  )
  const filtered = Boolean(term || grade || genre)

  return (
    <div className="bl">
      <ReaderPageHead
        as="h2"
        title="Book Lists"
        count={`${BOOK_LISTS.length} lists`}
        actions={
          filtered ? (
            <Button
              variant="secondary"
              onClick={() => {
                setQ('')
                setGrade(null)
                setGenre(null)
              }}
            >
              Clear Filters
            </Button>
          ) : null
        }
      />

      <div className="bl-search">
        <SearchInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search book lists"
          ariaLabel="Search book lists"
        />
      </div>

      {/* `grade_levels/filters` and `genres/filters` — the app's own two. */}
      <div className="bl-filters">
        <Filter label="Grade" value={grade} options={BOOK_LIST_GRADES} onChange={setGrade} />
        <Filter label="Genre" value={genre} options={BOOK_LIST_GENRES} onChange={setGenre} />
      </div>

      {shown.length === 0 ? (
        <EmptyState
          variant="dashed"
          title="No lists match that"
          description="Try a different genre or grade, or clear the filters."
        />
      ) : (
        <ul className="bl-list">
          {shown.map((list) => (
            <li className="bl-row" key={list.id}>
              <span className="bl-cover" style={{ background: list.tint }} aria-hidden="true">
                <Icon name="book-2" size={28} />
              </span>
              <div className="bl-body">
                <div className="bl-head">
                  <h3 className="bl-name">
                    <a href="#list">{list.name}</a>
                  </h3>
                  <span className="bl-count">{list.count} Books</span>
                </div>
                <p className="bl-desc">{list.description}</p>
                <div className="bl-meta">
                  <span className="bl-by">
                    <strong>Created by</strong> {list.by}
                  </span>
                  <span className="bl-genres">
                    {list.genres.map((g) => (
                      <Pill key={g} color="#087542" size="sm">
                        {g}
                      </Pill>
                    ))}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** One of the page's two filters — a row of chips, any one of which is off. */
function Filter({ label, value, options, onChange }) {
  return (
    <div className="bl-filter">
      <span className="bl-filter-label">{label}</span>
      <div className="bl-filter-opts">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`bl-chip${value === o ? ' is-on' : ''}`}
            aria-pressed={value === o}
            onClick={() => onChange(value === o ? null : o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
