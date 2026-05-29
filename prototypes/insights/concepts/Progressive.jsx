import { useEffect, useRef, useState } from 'react'
import {
  MetricCard,
  PanelCard,
  TopBooksGrid,
  TopBadgesRow,
  AgesChart,
  InsightsFilterBar,
} from '../components'
import { METRICS, TOP_BOOKS, TOP_BADGES, AGES, TOTAL_QUERIES } from '../data'

// Concept C: Progressive / on-scroll
const ABOVE_FOLD_IDS = [
  'active-readers',
  'new-registrations',
  'challenge-completions',
  'completed-activities',
  'rewards-redeemed',
  'badges-earned',
  'reviews-submitted',
  'books-read',
  'minutes-read',
]
const BELOW_FOLD_PANELS = ['top-books', 'top-badges', 'ages']

export function Progressive({ onMeterChange, onOpenDetail, onCustomize, visibleTiles }) {
  const [loaded, setLoaded] = useState({})
  const [fired, setFired] = useState(0)
  const [inView, setInView] = useState({})

  const visibleAbove = ABOVE_FOLD_IDS.filter((id) => visibleTiles.has(id))
  const visibleBelow = BELOW_FOLD_PANELS.filter((id) => visibleTiles.has(id))

  // Stagger the above-the-fold queries so they don't all hit at once.
  useEffect(() => {
    const timers = []
    visibleAbove.forEach((id, i) => {
      const fireT = setTimeout(() => {
        setFired((f) => f + 1)
        const respond = setTimeout(
          () => {
            setLoaded((l) => ({ ...l, [id]: true }))
          },
          500 + Math.random() * 600,
        )
        timers.push(respond)
      }, i * 90)
      timers.push(fireT)
    })
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // IntersectionObserver: when a below-fold tile enters viewport, fire it.
  const tileRefs = useRef({})
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.dataset.tileId
            if (id && !inView[id]) {
              setInView((v) => ({ ...v, [id]: true }))
              setFired((f) => f + 1)
              setTimeout(
                () => {
                  setLoaded((l) => ({ ...l, [id]: true }))
                },
                600 + Math.random() * 600,
              )
              obs.unobserve(e.target)
            }
          }
        })
      },
      { rootMargin: '120px' },
    )
    visibleBelow.forEach((id) => {
      const el = tileRefs.current[id]
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allVisible = [...visibleAbove, ...visibleBelow]
  const fullyLoaded = allVisible.length > 0 && allVisible.every((id) => loaded[id])
  const total = allVisible.length

  useEffect(() => {
    onMeterChange?.({
      onLoad: visibleAbove.length,
      fired,
      total,
      fullyLoaded,
      mode: 'progressive',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fired, fullyLoaded, total])

  return (
    <div className="ins-page">
      <InsightsFilterBar
        onCustomize={onCustomize}
        visibleCount={visibleTiles.size}
        totalCount={TOTAL_QUERIES}
      />
      <div className="ins-cache-banner ins-cache-banner--progressive">
        <strong>Above-the-fold tiles load first, staggered.</strong>
        <span>
          Below-the-fold panels wait until you scroll near them — fewer concurrent queries.
        </span>
      </div>

      {visibleAbove.length > 0 && (
        <div className="ins-metric-grid">
          {visibleAbove.map((id) => {
            const m = METRICS.find((mm) => mm.id === id)
            return (
              <MetricCard
                key={m.id}
                label={m.label}
                value={m.value}
                state={loaded[m.id] ? 'value' : 'loading'}
                onClick={() => onOpenDetail?.(m.id)}
              />
            )
          })}
        </div>
      )}

      {visibleTiles.has('top-books') && (
        <div
          ref={(el) => {
            tileRefs.current['top-books'] = el
          }}
          data-tile-id="top-books"
        >
          <PanelCard
            title="Top 12 Books Read"
            kind="books"
            state={loaded['top-books'] ? 'value' : 'loading'}
          >
            <TopBooksGrid books={TOP_BOOKS} />
          </PanelCard>
        </div>
      )}

      {visibleTiles.has('top-badges') && (
        <div
          ref={(el) => {
            tileRefs.current['top-badges'] = el
          }}
          data-tile-id="top-badges"
        >
          <PanelCard
            title="Top 2 Earned Badges"
            kind="badges"
            state={loaded['top-badges'] ? 'value' : 'loading'}
          >
            <TopBadgesRow badges={TOP_BADGES} />
          </PanelCard>
        </div>
      )}

      {visibleTiles.has('ages') && (
        <div
          ref={(el) => {
            tileRefs.current['ages'] = el
          }}
          data-tile-id="ages"
        >
          <PanelCard
            title="Ages (New Registrations)"
            kind="ages"
            state={loaded['ages'] ? 'value' : 'loading'}
          >
            <AgesChart ages={AGES} />
          </PanelCard>
        </div>
      )}
    </div>
  )
}
