import { useEffect, useRef, useState } from 'react'
import { MetricCard, PanelCard, TopBooksGrid, TopBadgesRow, AgesChart, FilterBar } from '../components'
import { METRICS, TOP_BOOKS, TOP_BADGES, AGES, TOTAL_QUERIES } from '../data'
import { Button } from '../../ris/components/Button'

const DEFAULT_PINNED = new Set([
  'active-readers', 'new-registrations', 'books-read', 'top-books',
])

function PinIcon({ filled }) {
  // Push-pin drawn upright, head at top, stem pointing down.
  // Outline + crossbar always render; fill toggles for pinned state.
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path
        d="M6 2 L10 2 L10 6 L12 9 L4 9 L6 6 Z"
        fill={filled ? 'currentColor' : 'none'}
      />
      <line x1="8" y1="9" x2="8" y2="14" />
    </svg>
  )
}

export function Pinned({ onMeterChange, onOpenDetail, onCustomize, visibleTiles }) {
  const [pinned, setPinned] = useState(DEFAULT_PINNED)
  const [loaded, setLoaded] = useState({})
  const [loading, setLoading] = useState({})
  const [editing, setEditing] = useState(false)
  const [fired, setFired] = useState(0)

  const firedOnce = useRef(false)
  useEffect(() => {
    if (firedOnce.current) return
    firedOnce.current = true
    pinned.forEach(id => {
      if (!visibleTiles.has(id)) return
      setFired(f => f + 1)
      setLoading(l => ({ ...l, [id]: true }))
      setTimeout(() => {
        setLoaded(l => ({ ...l, [id]: true }))
        setLoading(l => ({ ...l, [id]: false }))
      }, 600 + Math.random() * 600)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visiblePins = [...pinned].filter(id => visibleTiles.has(id))
  const fullyLoaded = visiblePins.every(id => loaded[id])

  useEffect(() => {
    onMeterChange?.({
      onLoad: visiblePins.length,
      fired,
      total: visibleTiles.size,
      fullyLoaded,
      mode: 'pinned',
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fired, pinned, fullyLoaded, visibleTiles.size])

  function load(id) {
    if (loading[id] || loaded[id]) return
    setLoading(l => ({ ...l, [id]: true }))
    setFired(f => f + 1)
    setTimeout(() => {
      setLoaded(l => ({ ...l, [id]: true }))
      setLoading(l => ({ ...l, [id]: false }))
    }, 700)
  }

  // Unload only non-pinned tiles. Pinned tiles keep their loaded state since
  // pinned tiles always load immediately and shouldn't be returned to empty.
  function unloadAll() {
    setLoaded(prev => {
      const next = {}
      for (const id of Object.keys(prev)) {
        if (pinned.has(id)) next[id] = prev[id]
      }
      return next
    })
    setLoading(prev => {
      const next = {}
      for (const id of Object.keys(prev)) {
        if (pinned.has(id)) next[id] = prev[id]
      }
      return next
    })
    // Reset fired count to the count of pinned tiles that already loaded.
    setFired(visiblePins.length)
  }

  function togglePin(id) {
    setPinned(p => {
      const next = new Set(p)
      if (next.has(id)) next.delete(id)
      else {
        next.add(id)
        if (!loaded[id] && !loading[id]) {
          setLoading(l => ({ ...l, [id]: true }))
          setFired(f => f + 1)
          setTimeout(() => {
            setLoaded(l => ({ ...l, [id]: true }))
            setLoading(l => ({ ...l, [id]: false }))
          }, 700)
        }
      }
      return next
    })
  }

  function metricState(id) {
    if (loading[id]) return 'loading'
    if (loaded[id])  return 'value'
    return 'empty'
  }

  // Wrapper that adds pin affordance when in edit mode.
  function PinWrap({ id, children }) {
    const isPinned = pinned.has(id)
    if (!editing) return children
    return (
      <div className={`ins-pin-wrap ins-pin-wrap--editing${isPinned ? ' ins-pin-wrap--pinned' : ''}`}>
        <button
          type="button"
          className={`ins-pin-btn${isPinned ? ' ins-pin-btn--on' : ''}`}
          onClick={() => togglePin(id)}
        >
          <PinIcon filled={isPinned} />
          {isPinned ? 'Pinned' : 'Pin'}
        </button>
        {children}
      </div>
    )
  }

  const metricCount = visiblePins.length

  return (
    <div className="ins-page">
      <FilterBar onCustomize={onCustomize} visibleCount={visibleTiles.size} totalCount={TOTAL_QUERIES} />

      {editing ? (
        <div className="ins-edit-bar">
          <div className="ins-edit-bar-l">
            <span className="ins-edit-bar-eyebrow">Edit pinned tiles</span>
            <span className="ins-edit-bar-hint">
              Click any tile to pin or unpin it. Only pinned tiles load on page open.
            </span>
          </div>
          <div className="ins-edit-bar-r">
            <span className="ins-edit-bar-count">{metricCount} pinned</span>
            <Button variant="primary" size="sm" onClick={() => setEditing(false)}>Done</Button>
          </div>
        </div>
      ) : (
        <div className="ins-cache-banner ins-cache-banner--pinned">
          <div className="ins-cache-banner-text">
            <strong>{metricCount} pinned tile{metricCount === 1 ? '' : 's'} load automatically.</strong>
            <span> The rest are placeholders — tap any tile to load it on demand.</span>
          </div>
          <div className="ins-cache-banner-actions">
            <Button variant="ghost" size="sm" onClick={unloadAll}>Unload all</Button>
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit pinned</Button>
          </div>
        </div>
      )}

      <div className="ins-metric-grid">
        {METRICS.filter(m => visibleTiles.has(m.id)).map(m => (
          <PinWrap key={m.id} id={m.id}>
            <MetricCard
              label={m.label}
              value={m.value}
              state={metricState(m.id)}
              onLoad={editing ? undefined : () => load(m.id)}
              onClick={editing ? undefined : () => onOpenDetail?.(m.id)}
            />
          </PinWrap>
        ))}
      </div>

      {[
        { id: 'top-books',  title: 'Top 12 Books Read',    render: <TopBooksGrid books={TOP_BOOKS} /> },
        { id: 'top-badges', title: 'Top 2 Earned Badges',  render: <TopBadgesRow badges={TOP_BADGES} /> },
        { id: 'ages',       title: 'Ages (New Registrations)', render: <AgesChart ages={AGES} /> },
      ].filter(p => visibleTiles.has(p.id)).map(p => {
        const state = loading[p.id] ? 'loading' : loaded[p.id] ? 'value' : 'empty'
        return (
          <PinWrap key={p.id} id={p.id}>
            <PanelCard
              title={p.title}
              state={state}
              onLoad={editing ? undefined : () => load(p.id)}
            >
              {p.render}
            </PanelCard>
          </PinWrap>
        )
      })}
    </div>
  )
}
