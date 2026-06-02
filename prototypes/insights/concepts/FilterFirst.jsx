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
import { Icon } from '@components/Icon/Icon'

// Concept F: Filter-first
// The filter form is editable, but nothing fires until the user clicks
// "Update Insights" — collapses N filter changes into a single batched query.
export function FilterFirst({ onMeterChange, onOpenDetail, onCustomize, visibleTiles }) {
  const [dirty, setDirty] = useState(true) // true = filters changed, needs refresh
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [queriesFired, setQueriesFired] = useState(0)

  useEffect(() => {
    onMeterChange?.({
      onLoad: 0,
      fired: queriesFired,
      total: 1,
      fullyLoaded: loaded && !loading,
      mode: 'filter-first',
    })
  }, [queriesFired, loaded, loading, onMeterChange])

  function update() {
    setLoading(true)
    setDirty(false)
    setQueriesFired((q) => q + 1)
    setTimeout(() => {
      setLoaded(true)
      setLoading(false)
    }, 1200)
  }

  const visibleMetrics = METRICS.filter((m) => visibleTiles.has(m.id))

  return (
    <div className="ins-page">
      <InsightsFilterBar
        onCustomize={onCustomize}
        visibleCount={visibleTiles.size}
        totalCount={TOTAL_QUERIES}
      />
      <div className="ins-update-bar">
        <div className="ins-update-text">
          {!loaded && !loading && (
            <>
              <strong>No data loaded yet.</strong>
              <span>Pick filters above, then hit Update Insights.</span>
            </>
          )}
          {loading && (
            <>
              <strong>Loading…</strong>
              <span>One batched query is fetching every visible tile.</span>
            </>
          )}
          {loaded && !dirty && !loading && (
            <>
              <strong>Up to date.</strong>
              <span>Change a filter to re-enable Update Insights.</span>
            </>
          )}
          {loaded && dirty && !loading && (
            <>
              <strong>Filters changed.</strong>
              <span>Click Update Insights to refresh.</span>
            </>
          )}
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={update}
          loading={loading}
          disabled={!dirty && loaded}
        >
          {loading ? 'Loading…' : 'Update Insights'}
        </Button>
      </div>

      {!loaded && !loading ? (
        <div className="ins-empty-state">
          <Icon name="chart-bar" size={48} color="#94A3B8" />
          <h3>Pick your filters, then load</h3>
          <p>
            Nothing fires until you click <strong>Update Insights</strong>. Adjust the period,
            segment, and age range up top — they all bundle into a single query.
          </p>
        </div>
      ) : (
        <>
          {visibleMetrics.length > 0 && (
            <div className="ins-metric-grid">
              {visibleMetrics.map((m) => (
                <MetricCard
                  key={m.id}
                  label={m.label}
                  value={m.value}
                  state={loading ? 'loading' : 'value'}
                  onClick={() => onOpenDetail?.(m.id)}
                />
              ))}
            </div>
          )}
          {visibleTiles.has('top-books') && (
            <PanelCard title="Top 12 Books Read" kind="books" state={loading ? 'loading' : 'value'}>
              <TopBooksGrid books={TOP_BOOKS} />
            </PanelCard>
          )}
          {visibleTiles.has('top-badges') && (
            <PanelCard
              title="Top 2 Earned Badges"
              kind="badges"
              state={loading ? 'loading' : 'value'}
            >
              <TopBadgesRow badges={TOP_BADGES} />
            </PanelCard>
          )}
          {visibleTiles.has('ages') && (
            <PanelCard
              title="Ages (New Registrations)"
              kind="ages"
              state={loading ? 'loading' : 'value'}
            >
              <AgesChart ages={AGES} />
            </PanelCard>
          )}
        </>
      )}
    </div>
  )
}
