import { useCallback, useMemo, useState } from 'react'
import { PrototypeNav } from '../PrototypeNav'
import { Sidebar } from '../ris/components/Sidebar'
import { Today } from './concepts/Today'
import { CachedRefresh } from './concepts/CachedRefresh'
import { SnapshotDrilldown } from './concepts/SnapshotDrilldown'
import { Progressive } from './concepts/Progressive'
import { Pinned } from './concepts/Pinned'
import { TopicTabs } from './concepts/TopicTabs'
import { FilterFirst } from './concepts/FilterFirst'
import { SearchPalette } from './concepts/SearchPalette'
import { AISnapshot } from './concepts/AISnapshot'
import { MetricModal } from './MetricModal'
import { CustomizeModal } from './CustomizeModal'
import { METRICS, QUERY_TILES, TOTAL_QUERIES } from './data'
import '../ris/index.css'
import '../ris/components/Button.css'
import '../ris/components/Primitives.css'
import '../ris/components/Sidebar.css'
import '../ris/components/RisLayout.css'
import '../MainRail.css'
import './index.css'

const CONCEPTS = [
  {
    id: 'today',
    name: 'Today (baseline)',
    headline: 'Every tile fires its own query, in parallel.',
    cost: 'High — 12 concurrent queries per page load',
    component: Today,
  },
  {
    id: 'cached',
    name: 'Cached + Refresh',
    headline: 'Render instantly from a nightly snapshot. One batched refresh on demand.',
    cost: 'Lowest — 0 queries on load, 1 on Refresh',
    component: CachedRefresh,
  },
  {
    id: 'snapshot',
    name: 'Snapshot + Drill-down',
    headline: 'One query for headline numbers. Heavy panels open on demand.',
    cost: 'Low — 1 query on load, up to 3 more on click',
    component: SnapshotDrilldown,
  },
  {
    id: 'progressive',
    name: 'Progressive',
    headline: 'Above-the-fold tiles load first, staggered. Below-the-fold waits for scroll.',
    cost: 'Medium — 8 staggered queries, rest deferred',
    component: Progressive,
  },
  {
    id: 'pinned',
    name: 'Pinned widgets',
    headline: 'Only pinned tiles auto-load. Others wait for the user to tap.',
    cost: 'User-controlled — defaults to 4 queries on load',
    component: Pinned,
  },
  {
    id: 'topic-tabs',
    name: 'Topic Tabs',
    headline: 'Three topic tabs replace the grid — each tab is one batched query.',
    cost: 'Lowest — 1 query on load, 1 per topic switch',
    component: TopicTabs,
  },
  {
    id: 'filter-first',
    name: 'Filter-first',
    headline: 'Nothing fires until you click Update Insights — every filter change bundles in.',
    cost: 'Lowest — 0 on load, 1 batched per Update',
    component: FilterFirst,
  },
  {
    id: 'search',
    name: 'Search Palette',
    headline: 'Ask for what you want to see. Each pick = one query.',
    cost: 'Lowest — 0 on load, 1 per pick',
    component: SearchPalette,
  },
  {
    id: 'ai-snapshot',
    name: 'AI Snapshot',
    headline: 'A paragraph replaces the grid. Click any number to drill in.',
    cost: 'Lowest — 1 query for the summary, panels on demand',
    component: AISnapshot,
  },
]

const NAV = [
  { id: 'dashboard',       label: 'Dashboard',        icon: 'overview' },
  { id: 'number-cruncher', label: 'Number Cruncher',  icon: 'analytics' },
  { id: 'leaderboards',    label: 'Leaderboards',     icon: 'lexile' },
]

const ALL_TILE_IDS = QUERY_TILES.map(t => t.id)

export function App() {
  const [conceptId, setConceptId] = useState('today')
  const [meter, setMeter] = useState({ onLoad: 0, fired: 0, total: 12, fullyLoaded: false })
  const [conceptKey, setConceptKey] = useState(0) // forces remount when switching
  const [detailMetricId, setDetailMetricId] = useState(null)
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const [visibleTiles, setVisibleTiles] = useState(() => new Set(ALL_TILE_IDS))

  const concept = useMemo(() => CONCEPTS.find(c => c.id === conceptId), [conceptId])
  const Concept = concept.component

  function switchTo(id) {
    setConceptId(id)
    setConceptKey(k => k + 1)
    setMeter({ onLoad: 0, fired: 0, total: visibleTiles.size, fullyLoaded: false })
  }

  function applyVisibleTiles(updater) {
    // Accept a Set or an updater function so consecutive toggles within one
    // tick see the latest state instead of the same stale closure value.
    setVisibleTiles(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      setConceptKey(k => k + 1)
      setMeter({ onLoad: 0, fired: 0, total: next.size, fullyLoaded: false })
      return next
    })
  }

  const onMeterChange = useCallback((m) => {
    setMeter(prev => {
      const next = { ...prev, ...m }
      const same = ['onLoad', 'fired', 'total', 'fullyLoaded', 'mode']
        .every(k => prev[k] === next[k])
      return same ? prev : next
    })
  }, [])

  const openMetricDetail = useCallback((metricId) => {
    setDetailMetricId(metricId)
  }, [])

  const detailValue = detailMetricId
    ? METRICS.find(m => m.id === detailMetricId)?.value
    : undefined

  return (
    <div className="ins-shell">
      <div className="ris-layout">
        <Sidebar
          title="Insights"
          subtitle="View data insights for your library"
          nav={NAV}
          active="dashboard"
          mainRailIndex={1}
        />

        <div className="rl-content ins-content">
          <header className="ins-header">
            <div className="ins-header-inner">
              <div className="ins-h1-row">
                <h1 className="ins-h1">Insights Dashboard</h1>
              </div>
              <p className="ins-context">
                Today every tile is a separate query, so concurrent users back up the database and the page fails for everyone.
                Switch between concepts to compare the trade-offs.
              </p>
            </div>
          </header>

          <div className="ins-switcher">
            <div className="ins-switcher-inner">
              <div className="ins-switcher-tabs" role="tablist">
                {CONCEPTS.map(c => (
                  <button
                    key={c.id}
                    role="tab"
                    aria-selected={c.id === conceptId}
                    className={`ins-tab${c.id === conceptId ? ' ins-tab--active' : ''}`}
                    onClick={() => switchTo(c.id)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="ins-meter">
            <div className="ins-meter-inner">
              <div className="ins-meter-l">
                <span className="ins-meter-eyebrow">Current concept</span>
                <strong className="ins-meter-headline">{concept.headline}</strong>
                <span className="ins-meter-cost">{concept.cost}</span>
              </div>
              <div className="ins-meter-r">
                <QueryMeter meter={meter} />
              </div>
            </div>
          </div>

          <main className="ins-main">
            <div className="ins-main-inner">
              <Concept
                key={conceptKey}
                onMeterChange={onMeterChange}
                onOpenDetail={openMetricDetail}
                onCustomize={() => setCustomizeOpen(true)}
                visibleTiles={visibleTiles}
              />
            </div>
          </main>
        </div>
      </div>

      <MetricModal
        metricId={detailMetricId}
        value={detailValue}
        open={!!detailMetricId}
        onClose={() => setDetailMetricId(null)}
      />

      <CustomizeModal
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        visibleTiles={visibleTiles}
        onChange={applyVisibleTiles}
      />

      <PrototypeNav currentHref="/bs-prototypes/insights/" />
    </div>
  )
}

function QueryMeter({ meter }) {
  const { onLoad, fired, total, fullyLoaded } = meter
  const pct = total ? Math.min(100, Math.round((fired / total) * 100)) : 0
  return (
    <div className={`ins-qmeter${fullyLoaded ? ' ins-qmeter--done' : ' ins-qmeter--loading'}`}>
      <div className="ins-qmeter-head">
        <span className="ins-qmeter-eyebrow">Queries on load</span>
        <span className={`ins-qmeter-status${fullyLoaded ? ' ins-qmeter-status--done' : ''}`}>
          <span className="ins-qmeter-status-dot" />
          {fullyLoaded ? 'Done' : 'In flight'}
        </span>
      </div>
      <div className="ins-qmeter-num">{onLoad}</div>
      <div className="ins-qmeter-bar">
        <div className="ins-qmeter-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="ins-qmeter-foot">{fired} of {total} fired</div>
    </div>
  )
}
