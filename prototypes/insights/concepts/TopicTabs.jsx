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
import { Tabs } from '@components/Tabs/Tabs'

// Concept E: Topic tabs
// The 12 tiles are split into 3 logical topics. Each tab fires a single batched
// query covering the tiles inside it. Switching tabs loads the new topic on
// demand — most users only care about one topic at a time.
const TOPICS = [
  {
    id: 'engagement',
    label: 'Engagement',
    metricIds: ['active-readers', 'new-registrations', 'reviews-submitted'],
    panelIds: ['ages'],
  },
  {
    id: 'activity',
    label: 'Activity',
    metricIds: ['books-read', 'minutes-read', 'challenge-completions', 'completed-activities'],
    panelIds: ['top-books'],
  },
  {
    id: 'rewards',
    label: 'Rewards',
    metricIds: ['badges-earned', 'rewards-redeemed'],
    panelIds: ['top-badges'],
  },
]

export function TopicTabs({ onMeterChange, onOpenDetail, onCustomize, visibleTiles }) {
  const [activeTopic, setActiveTopic] = useState('engagement')
  const [loadedTopics, setLoadedTopics] = useState({}) // topicId -> true
  const [loadingTopic, setLoadingTopic] = useState(null)
  const [queriesFired, setQueriesFired] = useState(0)

  const topic = TOPICS.find((t) => t.id === activeTopic)
  const visibleInTopic = (t) => [...t.metricIds, ...t.panelIds].filter((id) => visibleTiles.has(id))
  const initialTopicCount = visibleInTopic(TOPICS[0]).length > 0 ? 1 : 0

  // Fire the first topic's batched query on mount.
  useEffect(() => {
    const t = TOPICS[0]
    if (visibleInTopic(t).length === 0) return
    setLoadingTopic(t.id)
    setQueriesFired(1)
    const tm = setTimeout(() => {
      setLoadedTopics((s) => ({ ...s, [t.id]: true }))
      setLoadingTopic(null)
    }, 900)
    return () => clearTimeout(tm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadedCount = TOPICS.filter((t) => loadedTopics[t.id]).length

  useEffect(() => {
    onMeterChange?.({
      onLoad: initialTopicCount,
      fired: queriesFired,
      total: TOPICS.length,
      fullyLoaded: loadedCount === TOPICS.length || (loadedTopics[activeTopic] && !loadingTopic),
      mode: 'topics',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queriesFired, loadedCount, loadingTopic, activeTopic])

  function selectTopic(id) {
    setActiveTopic(id)
    if (loadedTopics[id] || visibleInTopic(TOPICS.find((t) => t.id === id)).length === 0) return
    setLoadingTopic(id)
    setQueriesFired((q) => q + 1)
    setTimeout(() => {
      setLoadedTopics((s) => ({ ...s, [id]: true }))
      setLoadingTopic(null)
    }, 700)
  }

  const visibleMetrics = topic.metricIds
    .filter((id) => visibleTiles.has(id))
    .map((id) => METRICS.find((m) => m.id === id))
  const showTopBooks = topic.panelIds.includes('top-books') && visibleTiles.has('top-books')
  const showTopBadges = topic.panelIds.includes('top-badges') && visibleTiles.has('top-badges')
  const showAges = topic.panelIds.includes('ages') && visibleTiles.has('ages')

  const topicIsLoaded = loadedTopics[activeTopic]
  const topicLoading = loadingTopic === activeTopic
  const cellState = topicIsLoaded ? 'value' : topicLoading ? 'loading' : 'loading'

  return (
    <div className="ins-page">
      <InsightsFilterBar
        onCustomize={onCustomize}
        visibleCount={visibleTiles.size}
        totalCount={TOTAL_QUERIES}
      />
      <div className="ins-cache-banner ins-cache-banner--tabs">
        <strong>Each topic loads in one query.</strong>
        <span>Switching tabs fires the next topic only when you open it.</span>
      </div>

      <Tabs
        active={activeTopic}
        onChange={selectTopic}
        items={TOPICS.map((t) => ({
          id: t.id,
          label: t.label,
          count: visibleInTopic(t).length,
        }))}
      />

      {visibleMetrics.length > 0 && (
        <div className="ins-metric-grid">
          {visibleMetrics.map((m) => (
            <MetricCard
              key={m.id}
              label={m.label}
              value={m.value}
              state={cellState}
              onClick={() => onOpenDetail?.(m.id)}
            />
          ))}
        </div>
      )}

      {showTopBooks && (
        <PanelCard title="Top 12 Books Read" kind="books" state={cellState}>
          <TopBooksGrid books={TOP_BOOKS} />
        </PanelCard>
      )}
      {showTopBadges && (
        <PanelCard title="Top 2 Earned Badges" kind="badges" state={cellState}>
          <TopBadgesRow badges={TOP_BADGES} />
        </PanelCard>
      )}
      {showAges && (
        <PanelCard title="Ages (New Registrations)" kind="ages" state={cellState}>
          <AgesChart ages={AGES} />
        </PanelCard>
      )}
    </div>
  )
}
