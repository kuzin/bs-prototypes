import { useEffect } from 'react'
import {
  MetricCard,
  PanelCard,
  TopBooksGrid,
  TopBadgesRow,
  AgesChart,
  FilterBar,
} from '../components'
import { METRICS, TOP_BOOKS, TOP_BADGES, AGES, QUERY_TILES, TOTAL_QUERIES } from '../data'
import { useFakeBatch } from '../useFakeQuery'

// Today: every visible tile fires its own query in parallel on page load.
export function Today({ onMeterChange, onOpenDetail, onCustomize, visibleTiles }) {
  const tiles = QUERY_TILES.filter((t) => visibleTiles.has(t.id)).map((t) => {
    if (t.kind === 'metric') return { id: t.id, value: METRICS.find((m) => m.id === t.id).value }
    if (t.id === 'top-books') return { id: t.id, value: TOP_BOOKS }
    if (t.id === 'top-badges') return { id: t.id, value: TOP_BADGES }
    if (t.id === 'ages') return { id: t.id, value: AGES }
    return { id: t.id, value: null }
  })

  const { results, loading, fired, fullyLoaded } = useFakeBatch(tiles, {
    delayMin: 600,
    delayMax: 1800,
    stagger: 0,
  })

  useEffect(() => {
    onMeterChange?.({
      onLoad: tiles.length,
      fired,
      total: tiles.length,
      fullyLoaded,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fired, fullyLoaded, tiles.length])

  function stateFor(id) {
    if (!visibleTiles.has(id)) return 'hidden'
    if (loading[id]) return 'loading'
    if (results[id] !== undefined) return 'value'
    return 'loading'
  }

  const visibleMetrics = METRICS.filter((m) => visibleTiles.has(m.id))

  return (
    <div className="ins-page">
      <FilterBar
        onCustomize={onCustomize}
        visibleCount={visibleTiles.size}
        totalCount={TOTAL_QUERIES}
      />
      <div className="ins-cache-banner ins-cache-banner--baseline">
        <strong>
          {tiles.length} {tiles.length === 1 ? 'query fires' : 'queries fire'} on every page load.
        </strong>
        <span>Multiple users loading at once = back-pressure on the database.</span>
      </div>

      {visibleMetrics.length > 0 && (
        <div className="ins-metric-grid">
          {visibleMetrics.map((m) => (
            <MetricCard
              key={m.id}
              label={m.label}
              value={results[m.id]}
              state={stateFor(m.id)}
              onClick={() => onOpenDetail?.(m.id)}
            />
          ))}
        </div>
      )}

      {visibleTiles.has('top-books') && (
        <PanelCard title="Top 12 Books Read" kind="books" state={stateFor('top-books')}>
          <TopBooksGrid books={results['top-books'] || []} />
        </PanelCard>
      )}
      {visibleTiles.has('top-badges') && (
        <PanelCard title="Top 2 Earned Badges" kind="badges" state={stateFor('top-badges')}>
          <TopBadgesRow badges={results['top-badges'] || []} />
        </PanelCard>
      )}
      {visibleTiles.has('ages') && (
        <PanelCard title="Ages (New Registrations)" kind="ages" state={stateFor('ages')}>
          <AgesChart ages={results['ages'] || []} />
        </PanelCard>
      )}
    </div>
  )
}
