import { useEffect, useState } from 'react'
import { PanelCard, TopBooksGrid, TopBadgesRow, AgesChart, InsightsFilterBar } from '../components'
import { METRICS, TOP_BOOKS, TOP_BADGES, AGES, TOTAL_QUERIES, fmt } from '../data'

// Concept: AI snapshot
// One generated paragraph replaces the grid of tiles. Each highlighted number
// in the paragraph is click-to-drill-down. Visualizations sit below the
// summary as empty placeholders — the user loads each panel on demand.
export function AISnapshot({ onMeterChange, onOpenDetail, onCustomize, visibleTiles }) {
  const [loading, setLoading] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [fired, setFired] = useState(0)
  const [panelLoaded, setPanelLoaded] = useState({})
  const [panelLoading, setPanelLoading] = useState({})

  useEffect(() => {
    setFired(1)
    const t = setTimeout(() => {
      setLoading(false)
      setLoaded(true)
    }, 1100)
    return () => clearTimeout(t)
  }, [])

  const visiblePanels = ['top-books', 'top-badges', 'ages'].filter((id) => visibleTiles.has(id))
  const totalQueries = 1 + visiblePanels.length
  const fullyLoaded = loaded && visiblePanels.every((id) => panelLoaded[id])

  useEffect(() => {
    onMeterChange?.({
      onLoad: 1,
      fired,
      total: totalQueries,
      fullyLoaded,
      mode: 'ai',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fired, fullyLoaded, totalQueries])

  function loadPanel(id) {
    if (panelLoaded[id] || panelLoading[id]) return
    setPanelLoading((p) => ({ ...p, [id]: true }))
    setFired((f) => f + 1)
    setTimeout(() => {
      setPanelLoaded((p) => ({ ...p, [id]: true }))
      setPanelLoading((p) => ({ ...p, [id]: false }))
    }, 700)
  }

  function panelStateFor(id) {
    if (panelLoading[id]) return 'loading'
    if (panelLoaded[id]) return 'value'
    return 'empty'
  }

  const v = (id) => METRICS.find((m) => m.id === id)?.value ?? 0
  const has = (id) => visibleTiles.has(id)

  function Stat({ id, fmtFn = fmt }) {
    if (!has(id)) return null
    const m = METRICS.find((mm) => mm.id === id)
    return (
      <button
        type="button"
        className="ins-ai-stat"
        onClick={() => onOpenDetail?.(id)}
        title={`Open ${m.label}`}
      >
        {fmtFn(m.value)}
      </button>
    )
  }

  return (
    <div className="ins-page">
      <InsightsFilterBar
        onCustomize={onCustomize}
        visibleCount={visibleTiles.size}
        totalCount={TOTAL_QUERIES}
      />
      <div className="ins-cache-banner ins-cache-banner--ai">
        <strong>Your week, summarized.</strong>
        <span>
          A single query produces the paragraph — click any number to drill in. Panels load on
          demand.
        </span>
      </div>

      <div className={`ins-ai-card ins-ai-card--${loading ? 'loading' : 'loaded'}`}>
        <div className="ins-ai-head">
          <span className="ins-ai-badge">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
              <path d="M8 1l1.4 4.2L13.6 6.6 10 9l1 4-3-2.5L5 13l1-4-3.6-2.4 4.2-1.4z" />
            </svg>
            AI Snapshot
          </span>
          <span className="ins-ai-sub">Generated from this week's reading data</span>
        </div>

        {loading ? (
          <div className="ins-ai-typing">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <p className="ins-ai-text">
            This week, <Stat id="active-readers" /> readers were active in your library, with{' '}
            <Stat id="new-registrations" /> new readers joining a challenge. Together they logged{' '}
            <Stat id="books-read" /> books across <Stat id="minutes-read" /> minutes of reading time
            {has('badges-earned') && v('badges-earned') > 0 && (
              <>
                {' '}
                and earned <Stat id="badges-earned" /> badges
              </>
            )}
            .{' '}
            {v('challenge-completions') === 0 ? (
              'No challenge completions yet — the period is still young.'
            ) : (
              <>
                So far <Stat id="challenge-completions" /> challenges have been completed.
              </>
            )}{' '}
            {v('reviews-submitted') === 0 ? (
              'No reviews have been submitted in this window.'
            ) : (
              <>
                Readers submitted <Stat id="reviews-submitted" /> reviews.
              </>
            )}
          </p>
        )}
      </div>

      {has('top-books') && (
        <PanelCard
          title="Top 12 Books Read"
          kind="books"
          state={panelStateFor('top-books')}
          onLoad={() => loadPanel('top-books')}
        >
          <TopBooksGrid books={TOP_BOOKS} />
        </PanelCard>
      )}
      {has('top-badges') && (
        <PanelCard
          title="Top 2 Earned Badges"
          kind="badges"
          state={panelStateFor('top-badges')}
          onLoad={() => loadPanel('top-badges')}
        >
          <TopBadgesRow badges={TOP_BADGES} />
        </PanelCard>
      )}
      {has('ages') && (
        <PanelCard
          title="Ages (New Registrations)"
          kind="ages"
          state={panelStateFor('ages')}
          onLoad={() => loadPanel('ages')}
        >
          <AgesChart ages={AGES} />
        </PanelCard>
      )}
    </div>
  )
}
