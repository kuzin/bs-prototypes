import { useState } from 'react'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { StatCard, ChartCard } from '@components/Cards/Cards'
import { Tabs } from '@components/Tabs/Tabs'
import { useStickyState } from '@components/useStickyState/useStickyState'
import { useTitleRequests } from '@components/useTitleRequests/useTitleRequests'
import { InfoBox } from '@components/InfoBox/InfoBox'
import { BennySummary } from './BennySummary'
import '@components/Tabs/Tabs.css'
import '@components/InfoBox/InfoBox.css'

import { TODAY } from '../data'
import {
  funnel,
  freshness,
  mostSuggested,
  bennySchool,
  collectionHealth,
  bySourceHealth,
  byFormatHealth,
  classroomBoard,
  titleActions,
  genreHealth,
} from '../derive'
import { HealthCard, GenreHealthCard, CompareTable, ClassroomBoard, TopTitlesTable } from './Health'
import { SchoolBookPanels } from './SchoolBookPanels'

const TAB_IDS = ['health', 'collections', 'classrooms', 'titles']

/**
 * The school Overview leads with the collection, not the engine. The question
 * a librarian brings to it is "is what we have enough for the readers we
 * have" — so the health read and its gaps come first, the comparison of
 * collections, formats and classroom shelves under it.
 */
export function SchoolOverview({ school, onNavigate }) {
  const f = funnel(school.events)
  const fresh = freshness(school)
  // Readers' own title requests count as unanswered requests too.
  const { requests: readerRequests } = useTitleRequests(school.id)
  const health = collectionHealth(school, readerRequests)
  const actions = titleActions(school)
  const rooms = classroomBoard(school)
  const [openTitle, setOpenTitle] = useState(null)
  const [stickyTab, setTab] = useStickyState('ce:overview-tab', 'health')
  // A value left from before these tabs existed would otherwise open on nothing.
  const tab = TAB_IDS.includes(stickyTab) ? stickyTab : 'health'

  // A signal opens the Collection page on the tab — or the filter — it is
  // about. The two pages are siblings under one layout, so the hand-off rides
  // in sessionStorage, the way the district's drill-down into a school does.
  const openFrom = (target) => {
    try {
      const tabFor = { gaps: 'gaps', requests: 'requests', never: 'all' }
      sessionStorage.setItem('bsp:ce:collection-tab', JSON.stringify(tabFor[target]))
      if (target === 'never') sessionStorage.setItem('bsp:ce:collection-status', 'never')
    } catch {
      /* no storage — the page opens on its default tab */
    }
    onNavigate('collection')
  }

  // The Gaps tile goes the same way.
  const seeGaps = () => openFrom('gaps')

  return (
    <>
      <PageHeader title="Collection Engine" />

      {fresh.problems > 0 && (
        <InfoBox
          level={fresh.staleDays > 30 || !fresh.asOf ? 'warning' : 'info'}
          title={
            fresh.asOf
              ? `The library catalog is ${fresh.staleDays} days old`
              : 'The library catalog has never synced'
          }
          action={{ label: 'Go to Setup', onClick: () => onNavigate('setup') }}
        >
          Anything weeded, lost or added since then is still being recommended — or still invisible.
        </InfoBox>
      )}

      <div className="ce-stats">
        <StatCard
          icon="alert"
          value={health.gapCount}
          label="Collection gaps"
          color={health.color}
          onClick={seeGaps}
        />
        <StatCard
          icon="books"
          value={health.reach.recommended}
          unit={`/${health.reach.total}`}
          label="Titles recommended"
          color="#196DD5"
          onClick={() => onNavigate('collection')}
        />
        <StatCard
          icon="circle-check"
          value={health.reach.read}
          label="Recommended, then read"
          color="#0BA85F"
        />
        <StatCard
          icon="trending-up"
          value={f.loggedPct}
          unit="%"
          label="Suggestions ending in a read"
          color="#0F766E"
        />
      </div>

      {/* Five readings of the collection, one at a time. The tiles stay above
          them: they are the summary, not a reading. */}
      <div className="ce-panel">
        <Tabs
          active={tab}
          onChange={setTab}
          variant="pill"
          ariaLabel="Overview views"
          items={[
            { id: 'health', label: 'Collection Health' },
            { id: 'collections', label: 'Collections & Formats' },
            { id: 'classrooms', label: 'Classroom Libraries', count: rooms.length },
            { id: 'titles', label: 'Top Titles' },
          ]}
        />

        {/* Benny's read and the health card are one reading: the summary is
            the health card said as sentences, so they sit together. */}
        {tab === 'health' && (
          <div className="ce-stack">
            <BennySummary summary={bennySchool(school, readerRequests)} asOf={TODAY} />
            <HealthCard health={health} onOpen={openFrom} />
            <GenreHealthCard genres={genreHealth(school)} onSeeAll={() => openFrom('gaps')} />
          </div>
        )}

        {tab === 'collections' && (
          <div className="ce-stack">
            <ChartCard
              title="By collection"
              accent="#196DD5"
              bodyPad="flush"
              info="Titles in two collections count in both."
            >
              <CompareTable rows={bySourceHealth(school)} kind="source" />
            </ChartCard>
            <ChartCard title="By format" accent="#B43DD0" bodyPad="flush">
              <CompareTable rows={byFormatHealth(school)} kind="format" />
            </ChartCard>
          </div>
        )}

        {tab === 'classrooms' && (
          <ChartCard
            title="Classroom library leaderboard"
            accent="#0BA85F"
            bodyPad="flush"
            info="Ranked by share of the shelf read off a recommendation."
          >
            <ClassroomBoard rows={rooms} />
          </ChartCard>
        )}

        {tab === 'titles' && (
          <ChartCard title="Top 10 titles suggested" accent="#196DD5" bodyPad="flush">
            <TopTitlesTable rows={mostSuggested(school)} onOpen={setOpenTitle} />
          </ChartCard>
        )}
      </div>

      <SchoolBookPanels
        school={school}
        openTitle={openTitle}
        onOpenTitle={setOpenTitle}
        actions={actions}
      />
    </>
  )
}
