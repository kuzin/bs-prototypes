import { useEffect, useState } from 'react'
import {
  MetricCard,
  PanelCard,
  TopBooksGrid,
  TopBadgesRow,
  AgesChart,
  InsightsFilterBar,
} from '../components'
import { METRICS, TOP_BOOKS, TOP_BADGES, AGES, TOTAL_QUERIES } from '../data'

// Concept B: Snapshot + drill-down
export function SnapshotDrilldown({ onMeterChange, onOpenDetail, onCustomize, visibleTiles }) {
  const [headlineLoading, setHeadlineLoading] = useState(true)
  const [panelState, setPanelState] = useState({
    'top-books': { loaded: false, loading: false },
    'top-badges': { loaded: false, loading: false },
    ages: { loaded: false, loading: false },
  })
  const [queriesFired, setQueriesFired] = useState(0)

  const visibleMetrics = METRICS.filter((m) => visibleTiles.has(m.id))
  const visiblePanels = ['top-books', 'top-badges', 'ages'].filter((id) => visibleTiles.has(id))
  const headlineQueryCount = visibleMetrics.length > 0 ? 1 : 0

  useEffect(() => {
    if (headlineQueryCount === 0) {
      setHeadlineLoading(false)
      return
    }
    setQueriesFired(1)
    const t = setTimeout(() => setHeadlineLoading(false), 900)
    return () => clearTimeout(t)
  }, [headlineQueryCount])

  const loadedCount = visiblePanels.filter((id) => panelState[id].loaded).length
  const total = headlineQueryCount + visiblePanels.length

  useEffect(() => {
    onMeterChange?.({
      onLoad: headlineQueryCount,
      fired: queriesFired,
      total,
      fullyLoaded: !headlineLoading && loadedCount === visiblePanels.length,
      mode: 'opt-in',
    })
  }, [
    queriesFired,
    headlineLoading,
    loadedCount,
    total,
    headlineQueryCount,
    visiblePanels.length,
    onMeterChange,
  ])

  function load(id) {
    setPanelState((p) => ({ ...p, [id]: { loaded: false, loading: true } }))
    setQueriesFired((q) => q + 1)
    setTimeout(() => {
      setPanelState((p) => ({ ...p, [id]: { loaded: true, loading: false } }))
    }, 900)
  }

  function panelStateFor(id) {
    const s = panelState[id]
    if (s.loading) return 'loading'
    if (s.loaded) return 'value'
    return 'empty'
  }

  return (
    <div className="ins-page">
      <InsightsFilterBar
        onCustomize={onCustomize}
        visibleCount={visibleTiles.size}
        totalCount={TOTAL_QUERIES}
      />
      <div className="ins-cache-banner ins-cache-banner--smart">
        <strong>Headline numbers load in one query.</strong>
        <span>Detail cards open on demand — most users never need them.</span>
      </div>

      {visibleMetrics.length > 0 && (
        <div className="ins-snapshot">
          <div className="ins-snapshot-tag">
            <span>
              Snapshot · {visibleMetrics.length} metric{visibleMetrics.length === 1 ? '' : 's'} in a
              single call
            </span>
          </div>
          <div className="ins-snapshot-row">
            {visibleMetrics.map((m) => (
              <MetricCard
                key={m.id}
                label={m.label}
                value={m.value}
                state={headlineLoading ? 'loading' : 'value'}
                onClick={() => onOpenDetail?.(m.id)}
              />
            ))}
          </div>
        </div>
      )}

      {visibleTiles.has('top-books') && (
        <PanelCard
          title="Top 12 Books Read"
          state={panelStateFor('top-books')}
          onLoad={() => load('top-books')}
          queries={1}
        >
          <TopBooksGrid books={TOP_BOOKS} />
        </PanelCard>
      )}
      {visibleTiles.has('top-badges') && (
        <PanelCard
          title="Top 2 Earned Badges"
          state={panelStateFor('top-badges')}
          onLoad={() => load('top-badges')}
          queries={1}
        >
          <TopBadgesRow badges={TOP_BADGES} />
        </PanelCard>
      )}
      {visibleTiles.has('ages') && (
        <PanelCard
          title="Ages (New Registrations)"
          state={panelStateFor('ages')}
          onLoad={() => load('ages')}
          queries={1}
        >
          <AgesChart ages={AGES} />
        </PanelCard>
      )}
    </div>
  )
}
