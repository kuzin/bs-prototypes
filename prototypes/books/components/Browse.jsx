import { useState, useMemo } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import { BookCard } from './BookCard'
import {
  BOOKS,
  GENRES,
  FORMATS,
  LEVEL_BANDS,
  AGE_BANDS,
  AVAIL_FACETS,
  lexileValue,
  ageBounds,
  isReadNow,
} from '../data'

// All genres that actually appear in the catalog (keeps chips meaningful).
const GENRE_OPTIONS = Object.keys(GENRES).filter((g) => BOOKS.some((b) => b.genres.includes(g)))
const FORMAT_OPTIONS = Object.keys(FORMATS)

const emptyFilters = () => ({
  genres: new Set(),
  formats: new Set(),
  levels: new Set(),
  ages: new Set(),
  avail: new Set(),
  minRating: 0,
})

function bandHit(book, levels) {
  if (!levels.size) return true
  const v = lexileValue(book.lexile)
  if (v == null) return false
  return LEVEL_BANDS.some((b) => levels.has(b.id) && v >= b.min && v <= b.max)
}
function ageHit(book, ages) {
  if (!ages.size) return true
  const bounds = ageBounds(book.ageRange)
  if (!bounds) return false
  const [lo, hi] = bounds
  return AGE_BANDS.some((b) => ages.has(b.id) && lo <= b.max && hi >= b.min) // ranges overlap
}
function availHit(book, avail) {
  if (!avail.size) return true
  return [...avail].some((id) =>
    id === 'readnow' ? isReadNow(book) : book.availability?.some((a) => a.partner === id),
  )
}

// One toggleable group of chips in the filter rail.
function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div className="bk-filtergroup">
      <h3 className="bk-filtergroup-title">{title}</h3>
      <div className="bk-filterchips">
        {options.map((o) => (
          <button
            key={o.id}
            className={`bk-filterchip ${selected.has(o.id) ? 'is-on' : ''}`}
            onClick={() => onToggle(o.id)}
          >
            {o.icon && <Icon name={o.icon} size={13} />}
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// Library facets are gated by the matching settings toggle (Libby defaults off).
const GATED_FACETS = ['sora', 'libby', 'scholastic']

export function Browse({
  initialQuery = '',
  initialFilter,
  settings = {},
  onOpen,
  onWish,
  wishlist,
  onBack,
}) {
  const [query, setQuery] = useState(initialQuery)
  const [sort, setSort] = useState('popular')
  const [filters, setFilters] = useState(() => {
    const f = emptyFilters()
    if (initialFilter?.genre) f.genres.add(initialFilter.genre)
    if (initialFilter?.format) f.formats.add(initialFilter.format)
    return f
  })

  const toggle = (key, id) =>
    setFilters((prev) => {
      const next = { ...prev, [key]: new Set(prev[key]) }
      next[key].has(id) ? next[key].delete(id) : next[key].add(id)
      return next
    })
  const setMinRating = (v) => setFilters((prev) => ({ ...prev, minRating: v }))
  const clearAll = () => {
    setFilters(emptyFilters())
    setQuery('')
  }

  const activeCount =
    filters.genres.size +
    filters.formats.size +
    filters.levels.size +
    filters.ages.size +
    filters.avail.size +
    (filters.minRating ? 1 : 0)

  // A library facet only counts when its feature toggle is on (ignores stale picks).
  const facetOptions = AVAIL_FACETS.filter((f) => !GATED_FACETS.includes(f.id) || settings[f.id])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const enabledAvail = new Set(
      [...filters.avail].filter((id) => !GATED_FACETS.includes(id) || settings[id]),
    )
    const list = BOOKS.filter((b) => {
      if (q && !`${b.title} ${b.author} ${b.genres.join(' ')}`.toLowerCase().includes(q))
        return false
      if (filters.genres.size && !b.genres.some((g) => filters.genres.has(g))) return false
      if (filters.formats.size && !b.formats.some((f) => filters.formats.has(f))) return false
      if (!bandHit(b, filters.levels)) return false
      if (!ageHit(b, filters.ages)) return false
      if (!availHit(b, enabledAvail)) return false
      if (filters.minRating && b.rating < filters.minRating) return false
      return true
    })
    const sorters = {
      popular: (a, b) => b.readersAtSchool - a.readersAtSchool,
      rating: (a, b) => b.rating - a.rating,
      title: (a, b) => a.title.localeCompare(b.title),
    }
    return [...list].sort(sorters[sort])
  }, [query, filters, sort, settings])

  return (
    <div className="bk-browse-page">
      <div className="bk-backbar">
        <button className="bk-back" onClick={onBack}>
          <Icon name="arrow-left" size={16} /> Discover
        </button>
      </div>

      <div className="bk-shelfpage-title bk-discover-head">
        <h1>
          <Icon name="search" size={23} /> Find a book
        </h1>
        <p>Search the catalog and filter by genre, format, level, and where you can read it.</p>
      </div>

      <div className="bk-searchbar">
        <Icon name="search" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or genre…"
          aria-label="Search books, authors, and genres"
          autoFocus
        />
        {query && (
          <button
            className="bk-searchbar-clear"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <Icon name="x" size={16} />
          </button>
        )}
      </div>

      <div className="bk-browse-layout">
        <aside className="bk-filters">
          <div className="bk-filters-head">
            <h2>
              <Icon name="filter" size={16} /> Filters
            </h2>
            {activeCount > 0 && (
              <button className="bk-filters-clear" onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>

          <FilterGroup
            title="Genre"
            options={GENRE_OPTIONS.map((g) => ({ id: g, label: g }))}
            selected={filters.genres}
            onToggle={(id) => toggle('genres', id)}
          />
          <FilterGroup
            title="Format"
            options={FORMAT_OPTIONS.map((f) => ({
              id: f,
              label: FORMATS[f].label,
              icon: FORMATS[f].icon,
            }))}
            selected={filters.formats}
            onToggle={(id) => toggle('formats', id)}
          />
          <FilterGroup
            title="Reading level"
            options={LEVEL_BANDS}
            selected={filters.levels}
            onToggle={(id) => toggle('levels', id)}
          />
          <FilterGroup
            title="Best for ages"
            options={AGE_BANDS}
            selected={filters.ages}
            onToggle={(id) => toggle('ages', id)}
          />
          <FilterGroup
            title="Available on"
            options={facetOptions}
            selected={filters.avail}
            onToggle={(id) => toggle('avail', id)}
          />

          <div className="bk-filtergroup">
            <h3 className="bk-filtergroup-title">Rating</h3>
            <div className="bk-filterchips">
              {[
                { id: 0, label: 'Any' },
                { id: 4, label: '4.0+' },
                { id: 4.5, label: '4.5+' },
              ].map((o) => (
                <button
                  key={o.id}
                  className={`bk-filterchip ${filters.minRating === o.id ? 'is-on' : ''}`}
                  onClick={() => setMinRating(o.id)}
                >
                  {o.id > 0 && <Icon name="star-filled" size={12} />}
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="bk-browse-results">
          <div className="bk-results-head">
            <span className="bk-results-count">
              <strong>{results.length}</strong> {results.length === 1 ? 'book' : 'books'}
            </span>
            <Tabs
              variant="pill"
              size="sm"
              active={sort}
              accent="#0D9488"
              onChange={setSort}
              items={[
                { id: 'popular', label: 'Popular' },
                { id: 'rating', label: 'Top Rated' },
                { id: 'title', label: 'A–Z' },
              ]}
            />
          </div>

          {results.length > 0 ? (
            <div className="bk-results-grid">
              {results.map((b) => (
                <BookCard
                  key={b.id}
                  book={b}
                  onOpen={onOpen}
                  onWish={onWish}
                  wished={wishlist.has(b.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bk-results-empty">
              <span className="bk-results-empty-icon">
                <Icon name="search" size={28} />
              </span>
              <h3>No books match those filters</h3>
              <p>Try removing a filter or searching for something else.</p>
              {(activeCount > 0 || query.trim()) && (
                <button className="bk-filters-clear" onClick={clearAll}>
                  Clear search &amp; filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
