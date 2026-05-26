import { useEffect, useState } from 'react'
import { MetricCard, PanelCard, TopBooksGrid, TopBadgesRow, AgesChart, FilterBar } from '../components'
import { METRICS, TOP_BOOKS, TOP_BADGES, AGES, TOTAL_QUERIES } from '../data'
import { Button } from '../../ris/components/Button'

// Concept F: Filter-first
// The filter form is editable, but nothing fires until the user clicks
// "Update Insights" — collapses N filter changes into a single batched query.
export function FilterFirst({ onMeterChange, onOpenDetail, onCustomize, visibleTiles }) {
  const [dirty, setDirty] = useState(true)      // true = filters changed, needs refresh
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
    setQueriesFired(q => q + 1)
    setTimeout(() => {
      setLoaded(true)
      setLoading(false)
    }, 1200)
  }

  const visibleMetrics = METRICS.filter(m => visibleTiles.has(m.id))

  return (
    <div className="ins-page">
      <FilterBar onCustomize={onCustomize} visibleCount={visibleTiles.size} totalCount={TOTAL_QUERIES} />
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
        <Button variant="primary" size="md" onClick={update} loading={loading} disabled={!dirty && loaded}>
          {loading ? 'Loading…' : 'Update Insights'}
        </Button>
      </div>

      {!loaded && !loading ? (
        <div className="ins-empty-state">
          <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="56" x2="56" y2="56" />
            <rect x="14" y="38" width="8" height="18" rx="1.5" />
            <rect x="28" y="26" width="8" height="30" rx="1.5" />
            <rect x="42" y="44" width="8" height="12" rx="1.5" />
          </svg>
          <h3>Pick your filters, then load</h3>
          <p>Nothing fires until you click <strong>Update Insights</strong>. Adjust the period, segment, and age range up top — they all bundle into a single query.</p>
        </div>
      ) : (
        <>
          {visibleMetrics.length > 0 && (
            <div className="ins-metric-grid">
              {visibleMetrics.map(m => (
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
            <PanelCard title="Top 2 Earned Badges" kind="badges" state={loading ? 'loading' : 'value'}>
              <TopBadgesRow badges={TOP_BADGES} />
            </PanelCard>
          )}
          {visibleTiles.has('ages') && (
            <PanelCard title="Ages (New Registrations)" kind="ages" state={loading ? 'loading' : 'value'}>
              <AgesChart ages={AGES} />
            </PanelCard>
          )}
        </>
      )}
    </div>
  )
}
