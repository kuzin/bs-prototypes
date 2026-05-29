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
import { Button } from '@components/Button/Button'

// Concept A: Cached snapshot + Refresh
export function CachedRefresh({ onMeterChange, onOpenDetail, onCustomize, visibleTiles }) {
  const [refreshing, setRefreshing] = useState(false)
  const [snapshotAt, setSnapshotAt] = useState('12:00 AM EDT')
  const [queriesFired, setQueriesFired] = useState(0)

  useEffect(() => {
    onMeterChange?.({
      onLoad: 0,
      fired: queriesFired,
      total: 1,
      fullyLoaded: !refreshing,
      mode: 'batched',
    })
  }, [queriesFired, refreshing, onMeterChange])

  function refresh() {
    setRefreshing(true)
    setQueriesFired((q) => q + 1)
    setTimeout(() => {
      const now = new Date()
      setSnapshotAt(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short',
        }),
      )
      setRefreshing(false)
    }, 1400)
  }

  const visibleMetrics = METRICS.filter((m) => visibleTiles.has(m.id))

  return (
    <div className="ins-page">
      <InsightsFilterBar
        onCustomize={onCustomize}
        visibleCount={visibleTiles.size}
        totalCount={TOTAL_QUERIES}
      />
      <div className="ins-cache-banner ins-cache-banner--cached">
        <div className="ins-cache-banner-text">
          <strong>Showing cached snapshot</strong> — last refreshed at {snapshotAt}. Numbers update
          nightly. Hit Refresh for live data ({visibleTiles.size} tiles → 1 batched query).
        </div>
        <Button variant="primary" size="sm" onClick={refresh} loading={refreshing}>
          {refreshing ? 'Refreshing…' : 'Refresh now'}
        </Button>
      </div>

      {visibleMetrics.length > 0 && (
        <div className="ins-metric-grid">
          {visibleMetrics.map((m) => (
            <MetricCard
              key={m.id}
              label={m.label}
              value={m.value}
              state={refreshing ? 'loading' : 'value'}
              onClick={() => onOpenDetail?.(m.id)}
            />
          ))}
        </div>
      )}

      {visibleTiles.has('top-books') && (
        <PanelCard title="Top 12 Books Read" kind="books" state={refreshing ? 'loading' : 'value'}>
          <TopBooksGrid books={TOP_BOOKS} />
        </PanelCard>
      )}
      {visibleTiles.has('top-badges') && (
        <PanelCard
          title="Top 2 Earned Badges"
          kind="badges"
          state={refreshing ? 'loading' : 'value'}
        >
          <TopBadgesRow badges={TOP_BADGES} />
        </PanelCard>
      )}
      {visibleTiles.has('ages') && (
        <PanelCard
          title="Ages (New Registrations)"
          kind="ages"
          state={refreshing ? 'loading' : 'value'}
        >
          <AgesChart ages={AGES} />
        </PanelCard>
      )}
    </div>
  )
}
