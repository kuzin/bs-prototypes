import { useState } from 'react'
import { Tabs } from '@components/Tabs/Tabs'
import { Button } from '@components/Button/Button'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import { AllBTWBView } from '../../sfr/components/AllBTWBView'
import { SessionsSearch } from '../../sfr/components/SessionsFilters'
import { SessionModal } from '../../sfr/components/SessionModal'
import { HighlightCard } from '../../sfr/components/Overview'
import { buildReviewSessions, SITE } from '../data'

import '@components/Tabs/Tabs.css'
import '@components/Button/Button.css'
import '@components/AppShell/AppShell.css'
import '@components/BennyBubble/BennyBubble.css'
import '../../sfr/components/SfrPage.css'
import '../../sfr/components/Overview.css'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'flagged', label: 'Flagged Sessions' },
  { id: 'engagement', label: 'Engagement Sessions' },
  { id: 'self', label: 'Self-Started Sessions' },
  { id: 'all', label: 'All Book Talks' },
]

// Teacher review — the Sessions for Review surface, mirrored (full-bleed header
// bar, By Session/Reader toggle, tabbed views). Talks a reader started for
// themselves are a new Benny-conversation type, tagged "Self-Started" in the
// reused SFR table + detail modal.
export function ReviewView({ badge }) {
  const [active, setActive] = useState(null)
  // Land on Self-Started Sessions — the focus of this prototype. The other
  // Sessions-for-Review tabs are shown for context but left non-interactive.
  const [tab, setTab] = useState('self')
  const [groupBy, setGroupBy] = useState('session')
  // Search is the page's, not a tab's — the same shape SfrPage uses, so the two
  // surfaces stay one page.
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [sessions, setSessions] = useState(() => buildReviewSessions(badge))

  const flagged = sessions.filter(
    (s) => (s.type === 'flagged' || s.type === 'both') && (s.flags?.length ?? 0) > 0,
  )
  const engagement = sessions.filter((s) => s.type === 'engagement' || s.type === 'both')
  const green = sessions.filter((s) => s.engagementRating === 'green')
  const yellow = sessions.filter((s) => s.engagementRating === 'yellow')
  const red = sessions.filter((s) => s.engagementRating === 'red')
  const unfinished = sessions.filter((s) => s.status === 'unfinished')
  const completed = sessions.filter((s) => s.status === 'completed').length
  // The Self-Started tab is locked to reader-initiated Book Talks (no source
  // switching). All Book Talks holds the full set, where source IS switchable.
  const selfSessions = sessions.filter((s) => s.source === 'self')
  const selfCount = selfSessions.length

  const tabItems = TABS.map((t) => ({
    ...t,
    // Self-Started + All Book Talks are interactive; the rest are context.
    disabled: t.id !== 'self' && t.id !== 'all',
    count:
      t.id === 'flagged'
        ? flagged.length
        : t.id === 'engagement'
          ? engagement.length
          : t.id === 'self'
            ? selfCount
            : t.id === 'all'
              ? sessions.length
              : undefined,
  }))

  // Reuse SFR's filtered list view, pre-filtered by tab via its Type filter.
  const tabDefaultFilters =
    tab === 'flagged' ? { type: 'flagged' } : tab === 'engagement' ? { type: 'engagement' } : {}

  const updateSession = (updated) => {
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setActive(updated)
  }

  return (
    <div className="bt-reviewx">
      <div className="app-shell-page bt-reviewx-body">
        <PageHeader
          className="sfr-header"
          title="Sessions for Review"
          subtitle={`${SITE.school} · June 2026`}
          actions={
            <>
              <Tabs
                variant="pill"
                active={groupBy}
                onChange={setGroupBy}
                items={[
                  { id: 'session', label: 'By Session' },
                  { id: 'reader', label: 'By Reader' },
                ]}
              />
              <Button variant="secondary" size="md" onClick={() => setShowSearch((v) => !v)}>
                {showSearch ? 'Hide Search' : 'Show Search'}
              </Button>
            </>
          }
        >
          <div className="sfr-tabs-bar">
            <Tabs items={tabItems} active={tab} onChange={setTab} accent="#0BA85F" />
          </div>
        </PageHeader>

        {showSearch && tab !== 'overview' && <SessionsSearch value={search} onSearch={setSearch} />}

        {tab === 'overview' ? (
          <div className="ov-shell">
            <div className="ov-summary">
              <BennyBubble>
                Students had <strong>{sessions.length}</strong> Book Talks with me —{' '}
                <strong>{selfCount}</strong> that readers started themselves and the rest after
                finishing a title — and completed <strong>{completed}</strong> so far. Most were
                positively engaged in their reading; I flagged <strong>{flagged.length}</strong>{' '}
                conversation{flagged.length === 1 ? '' : 's'} for you to take a closer look at.
              </BennyBubble>
            </div>
            <div className="ov-grid">
              <HighlightCard
                variant="danger"
                title="Validate / Intercede"
                description="Book Talks with integrity flags"
                sessions={flagged}
                viewAllLabel="View all flagged"
                onViewAll={() => setTab('flagged')}
                onSelectSession={setActive}
              />
              <HighlightCard
                variant="success"
                title="Celebrate"
                description="Students positively engaged in their Book Talk"
                sessions={green}
                viewAllLabel="View all engaged"
                onViewAll={() => setTab('engagement')}
                onSelectSession={setActive}
              />
              <HighlightCard
                variant="warning"
                title="Review / Assess"
                description="Students with a mixed Book Talk"
                sessions={yellow}
                viewAllLabel="View all mixed"
                onViewAll={() => setTab('engagement')}
                onSelectSession={setActive}
              />
              <HighlightCard
                variant="intercede"
                title="Intercede"
                description="Students who seemed disengaged"
                sessions={red}
                viewAllLabel="View all disengaged"
                onViewAll={() => setTab('engagement')}
                onSelectSession={setActive}
              />
              <HighlightCard
                variant="neutral"
                title="Give Students Time"
                description="Unfinished Book Talk conversations"
                sessions={unfinished}
                viewAllLabel="View all unfinished"
                onViewAll={() => setTab('all')}
                onSelectSession={setActive}
              />
            </div>
          </div>
        ) : (
          <AllBTWBView
            key={tab}
            sessions={tab === 'self' ? selfSessions : sessions}
            search={search}
            groupBy={groupBy}
            defaultFilters={tabDefaultFilters}
            allowSourceFilter={tab === 'all'}
            onSelectSession={(s) => setActive(s)}
          />
        )}
      </div>

      <SessionModal
        session={active}
        allSessions={sessions}
        onClose={() => setActive(null)}
        onUpdateSession={updateSession}
        onSelectSession={setActive}
      />
    </div>
  )
}
