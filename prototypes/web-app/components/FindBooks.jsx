import { useMemo, useState } from 'react'
import { Button } from '@components/Button/Button'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { ActiveFilters } from '@components/ActiveFilters/ActiveFilters'
import { FilterMenu, FilterMenuBar } from '@components/FilterMenu/FilterMenu'
import { EmptyState } from '@components/Primitives/Primitives'
import { ReaderBack } from '@components/ReaderApp/ReaderApp'

import { BookCover } from '../../logging-flow/components/BookCover'
import { CATALOG, AGES, GENRES, LANGUAGES, TOPIC_GROUPS, BACKGROUND_GROUPS, MOODS } from '../data'
import './FindBooks.css'

import '@components/Button/Button.css'
import '@components/SearchInput/SearchInput.css'
import '@components/ActiveFilters/ActiveFilters.css'
import '@components/Primitives/Primitives.css'

/**
 * Find Books — `books#index`, the site's catalog and the five facets it filters
 * on: Recommended Age, Favorite Genres, Languages, Main Characters and Topics.
 * (Interests and Reading Levels are admin-only in the app, so they aren't here.)
 *
 * The app's own h1 is "Children's Books"; the page is headed by the thing the
 * reader pressed to get here, and the button that takes them here is "Find
 * Books" in both the Wish List and the Book Lists.
 *
 * The app keeps the facets in an off-canvas drawer behind "Choose Filters",
 * with "Clear Filters" and "Hide Filters" floating over the page. A prototype
 * has nowhere to hide a drawer, so each facet is a button that opens its own
 * checkbox list — the accordion's one-section-at-a-time in one row instead of
 * a column down the side. What is set shows twice: a count on the facet's own
 * button, and a chip per value above the grid. The drawer's own problem is that
 * a filtered page doesn't look filtered.
 *
 * A tile is `books/_item.html.haml`: the cover, the title, and the moods
 * readers gave it.
 */

// A filter is stored as a flat set of tags and each book is matched against
// it: a reader who picks "Deaf & Hard of Hearing" doesn't care which group it
// came from, so the groups only exist to lay the checkboxes out.
const bookTags = (book, key) => Object.values(book[key] ?? {}).flat()

export function FindBooks({ onBack, backLabel, onOpenBook, initial }) {
  const [q, setQ] = useState('')
  const [ages, setAges] = useState(initial?.ages ?? [])
  const [genres, setGenres] = useState(initial?.genres ?? [])
  const [languages, setLanguages] = useState(initial?.languages ?? [])
  const [backgrounds, setBackgrounds] = useState(initial?.backgrounds ?? [])
  const [topics, setTopics] = useState(initial?.topics ?? [])

  const term = q.trim().toLowerCase()

  const shown = useMemo(
    () =>
      CATALOG.filter(
        (b) =>
          (!term ||
            b.title.toLowerCase().includes(term) ||
            b.author.toLowerCase().includes(term)) &&
          (!ages.length || b.ages?.some((a) => ages.includes(a))) &&
          (!genres.length || b.genres?.some((g) => genres.includes(g))) &&
          (!languages.length || languages.includes(b.language)) &&
          (!backgrounds.length ||
            bookTags(b, 'backgrounds').some((t) => backgrounds.includes(t))) &&
          (!topics.length || bookTags(b, 'topics').some((t) => topics.includes(t))),
      ),
    [term, ages, genres, languages, backgrounds, topics],
  )

  // One chip per set value, so clearing is per-tag rather than per-facet.
  const setters = { ages: setAges, genres: setGenres, languages: setLanguages, backgrounds: setBackgrounds, topics: setTopics } // prettier-ignore
  const applied = Object.entries({ ages, genres, languages, backgrounds, topics }).flatMap(
    ([key, values]) =>
      values.map((v) => ({
        key: `${key}:${v}`,
        label: v,
        onClear: () => setters[key]((set) => set.filter((x) => x !== v)),
      })),
  )

  const clearAll = () => {
    setAges([])
    setGenres([])
    setLanguages([])
    setBackgrounds([])
    setTopics([])
  }

  return (
    <div className="fb">
      {onBack && <ReaderBack onClick={onBack}>{backLabel}</ReaderBack>}

      <ReaderPageHead
        as="h2"
        title="Find Books"
        count={`${shown.length} of ${CATALOG.length} books`}
        actions={<Button variant="secondary">Print This List</Button>}
      />

      <div className="fb-search">
        <SearchInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search titles and authors"
          ariaLabel="Search the catalog"
        />
      </div>

      {/* The app's five facets, each behind its own button. */}
      <FilterMenuBar className="fb-filters">
        <FilterMenu label="Age" options={AGES} value={ages} onChange={setAges} multi />
        <FilterMenu label="Genres" options={GENRES} value={genres} onChange={setGenres} multi />
        <FilterMenu
          label="Language"
          options={LANGUAGES}
          value={languages}
          onChange={setLanguages}
          multi
        />
        <FilterMenu
          label="Main Characters"
          groups={BACKGROUND_GROUPS}
          value={backgrounds}
          onChange={setBackgrounds}
          multi
        />
        <FilterMenu
          label="Topics"
          groups={TOPIC_GROUPS}
          value={topics}
          onChange={setTopics}
          multi
        />
      </FilterMenuBar>

      {applied.length > 0 && <ActiveFilters filters={applied} onClearAll={clearAll} />}

      {shown.length === 0 ? (
        <EmptyState
          variant="dashed"
          title="Sorry, but there aren't any books that match your search."
          description="Try removing one of your filter selections."
          action={
            applied.length > 0 ? (
              <Button variant="secondary" onClick={clearAll}>
                Clear Filters
              </Button>
            ) : null
          }
        />
      ) : (
        <ul className="fb-grid">
          {shown.map((b) => (
            <li key={b.id} className="fb-item">
              <button type="button" onClick={() => onOpenBook?.(b)}>
                <span className="fb-item-cover">
                  <BookCover book={b} size="fill" />
                </span>
                <span className="fb-item-title">{b.title}</span>
                <span className="fb-item-author">{b.author}</span>
                {/* `.moods` under the title on the app's own grid item. */}
                {b.moods?.length > 0 && (
                  <span className="fb-item-moods">
                    {b.moods.map((m) => (
                      <span key={m} title={MOODS[m].title}>
                        {MOODS[m].emoji}
                      </span>
                    ))}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
