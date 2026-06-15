import { useEffect, useMemo, useRef, useState } from 'react'
import {
  MetricCard,
  PanelCard,
  TopBooksGrid,
  TopBadgesRow,
  AgesChart,
  InsightsFilterBar,
} from '../components'
import { METRICS, TOP_BOOKS, TOP_BADGES, AGES, TOTAL_QUERIES } from '../data'
import { Icon } from '@components/Icon/Icon'
import { EmptyState } from '@components/Primitives/Primitives'

// Concept G: Search palette
// The dashboard opens with a search input. The user picks (or types) a metric;
// only that one fires a query and renders below. Zero queries on first paint.
const ALL_ITEMS = [
  ...METRICS.map((m) => ({ id: m.id, label: m.label, kind: 'metric' })),
  { id: 'top-books', label: 'Top 12 Books Read', kind: 'panel' },
  { id: 'top-badges', label: 'Top 2 Earned Badges', kind: 'panel' },
  { id: 'ages', label: 'Ages (New Registrations)', kind: 'panel' },
]

const SUGGESTED_IDS = ['active-readers', 'books-read', 'minutes-read', 'top-books']

export function SearchPalette({ onMeterChange, onOpenDetail, onCustomize, visibleTiles }) {
  const [query, setQuery] = useState('')
  const [opened, setOpened] = useState({}) // id -> 'loading' | 'value'
  const [queriesFired, setQueriesFired] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const openedIds = Object.keys(opened)
  const fullyLoaded = openedIds.length > 0 && openedIds.every((id) => opened[id] === 'value')

  useEffect(() => {
    onMeterChange?.({
      onLoad: 0,
      fired: queriesFired,
      total: ALL_ITEMS.filter((i) => visibleTiles.has(i.id)).length || 1,
      fullyLoaded,
      mode: 'search',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queriesFired, fullyLoaded])

  function open(id) {
    if (opened[id]) return
    setOpened((s) => ({ ...s, [id]: 'loading' }))
    setQueriesFired((q) => q + 1)
    setTimeout(() => {
      setOpened((s) => ({ ...s, [id]: 'value' }))
    }, 700)
    setQuery('')
  }

  const matches = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()
    return ALL_ITEMS.filter((i) => visibleTiles.has(i.id))
      .filter((i) => i.label.toLowerCase().includes(q))
      .slice(0, 5)
  }, [query, visibleTiles])

  const suggestions = SUGGESTED_IDS.filter((id) => visibleTiles.has(id))
    .filter((id) => !opened[id])
    .map((id) => ALL_ITEMS.find((i) => i.id === id))

  return (
    <div className="ins-page">
      <InsightsFilterBar
        onCustomize={onCustomize}
        visibleCount={visibleTiles.size}
        totalCount={TOTAL_QUERIES}
      />
      <div className="ins-cache-banner ins-cache-banner--search">
        <strong>Ask for what you want to see.</strong>
        <span>Nothing loads until you pick a tile. Each pick = one query.</span>
      </div>

      <div className="ins-palette">
        <div className="ins-palette-input">
          <Icon name="search" size={20} color="#94A3B8" />
          <input
            ref={inputRef}
            type="text"
            placeholder="What do you want to know? Try “books” or “registrations”…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && matches[0]) open(matches[0].id)
              if (e.key === 'Escape') setQuery('')
            }}
          />
        </div>

        {matches.length > 0 ? (
          <div className="ins-palette-matches">
            {matches.map((m) => (
              <button
                key={m.id}
                type="button"
                className="ins-palette-match"
                onClick={() => open(m.id)}
              >
                <span>{m.label}</span>
                <span className="ins-palette-match-kind">
                  {m.kind === 'panel' ? 'Panel' : 'Metric'}
                </span>
              </button>
            ))}
          </div>
        ) : (
          suggestions.length > 0 && (
            <div className="ins-palette-suggest">
              <span className="ins-palette-suggest-label">Suggested</span>
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="ins-palette-chip"
                  onClick={() => open(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )
        )}
      </div>

      {openedIds.length === 0 ? (
        <EmptyState
          variant="dashed"
          icon={<Icon name="search" size={48} color="#94A3B8" />}
          title="Nothing loaded yet"
          description="Pick a metric or panel to load just that one — perfect for ad-hoc lookups."
        />
      ) : (
        <>
          {/* Render metrics that have been opened */}
          {openedIds.filter((id) => ALL_ITEMS.find((i) => i.id === id)?.kind === 'metric').length >
            0 && (
            <div className="ins-metric-grid">
              {openedIds
                .filter((id) => ALL_ITEMS.find((i) => i.id === id)?.kind === 'metric')
                .map((id) => {
                  const m = METRICS.find((mm) => mm.id === id)
                  return (
                    <MetricCard
                      key={id}
                      label={m.label}
                      value={m.value}
                      state={opened[id]}
                      onClick={() => onOpenDetail?.(id)}
                    />
                  )
                })}
            </div>
          )}

          {opened['top-books'] && (
            <PanelCard title="Top 12 Books Read" kind="books" state={opened['top-books']}>
              <TopBooksGrid books={TOP_BOOKS} />
            </PanelCard>
          )}
          {opened['top-badges'] && (
            <PanelCard title="Top 2 Earned Badges" kind="badges" state={opened['top-badges']}>
              <TopBadgesRow badges={TOP_BADGES} />
            </PanelCard>
          )}
          {opened['ages'] && (
            <PanelCard title="Ages (New Registrations)" kind="ages" state={opened['ages']}>
              <AgesChart ages={AGES} />
            </PanelCard>
          )}
        </>
      )}
    </div>
  )
}
