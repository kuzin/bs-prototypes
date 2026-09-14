import { useState, useMemo } from 'react'
import { Icon } from '@components/Icon/Icon'
import { BackBar } from '@components/BackBar/BackBar'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { ActiveFilters } from '@components/ActiveFilters/ActiveFilters'
import { Button } from '@components/Button/Button'
import { EmptyState } from '@components/Primitives/Primitives'
import '@components/SearchInput/SearchInput.css'
import '@components/SectionCard/SectionCard.css'
import '@components/ActiveFilters/ActiveFilters.css'
import '@components/Primitives/Primitives.css'
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

  // Everything that is on, as `ActiveFilters` wants it: one chip each, and
  // clicking a chip drops just that one.
  const activeFilters = [
    ...[...filters.genres].map((id) => ({
      key: `g-${id}`,
      label: id,
      onClear: () => toggle('genres', id),
    })),
    ...[...filters.formats].map((id) => ({
      key: `f-${id}`,
      label: FORMATS[id].label,
      onClear: () => toggle('formats', id),
    })),
    ...[...filters.levels].map((id) => ({
      key: `l-${id}`,
      label: LEVEL_BANDS.find((b) => b.id === id)?.label ?? id,
      onClear: () => toggle('levels', id),
    })),
    ...[...filters.ages].map((id) => ({
      key: `a-${id}`,
      label: AGE_BANDS.find((b) => b.id === id)?.label ?? id,
      onClear: () => toggle('ages', id),
    })),
    ...[...filters.avail].map((id) => ({
      key: `v-${id}`,
      label: AVAIL_FACETS.find((f) => f.id === id)?.label ?? id,
      onClear: () => toggle('avail', id),
    })),
    ...(filters.minRating
      ? [
          {
            key: 'rating',
            label: `${filters.minRating}+ stars`,
            onClear: () => setMinRating(0),
          },
        ]
      : []),
  ]

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
    // Most-read at this school first — the order the catalog is browsed in.
    return [...list].sort((a, b) => b.readersAtSchool - a.readersAtSchool)
  }, [query, filters, settings])

  return (
    <div className="bk-browse-page">
      <BackBar label="Discover" onClick={onBack} />

      <ReaderPageHead title="Find a book" />

      <div className="bk-searchbar">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by title, author, or genre…"
          ariaLabel="Search books, authors, and genres"
        />
      </div>

      <div className="bk-browse-layout">
        {/* No "Clear all" here: the ActiveFilters bar beside the results
            carries it, and two of them on one screen is one too many. */}
        <SectionCard className="bk-filters" header="divider" title="Filters">
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
        </SectionCard>

        <div className="bk-browse-results">
          {/* What's applied, and a way to drop any one of them — the shared bar
              the admin lists use, so a filtered result set says so. */}
          <ActiveFilters filters={activeFilters} onClearAll={clearAll} />

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
            <EmptyState
              variant="dashed"
              icon={<Icon name="search" size={26} />}
              title="No books match those filters"
              description="Try removing a filter or searching for something else."
              action={
                (activeCount > 0 || query.trim()) && (
                  <Button variant="secondary" size="sm" onClick={clearAll}>
                    Clear search &amp; filters
                  </Button>
                )
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
