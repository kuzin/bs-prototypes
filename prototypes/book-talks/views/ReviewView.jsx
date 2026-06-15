import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import { BackBar } from '@components/BackBar/BackBar'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import { AllBTWBView } from '../../sfr/components/AllBTWBView'
import { SessionModal } from '../../sfr/components/SessionModal'
import { HighlightCard } from '../../sfr/components/Overview'
import { buildReviewSessions, SITE } from '../data'

import '@components/Tabs/Tabs.css'
import '@components/BackBar/BackBar.css'
import '@components/AppShell/AppShell.css'
import '@components/BennyBubble/BennyBubble.css'
import '../../sfr/components/SfrPage.css'
import '../../sfr/components/Overview.css'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'flagged', label: 'Flagged Sessions' },
  { id: 'engagement', label: 'Engagement Sessions' },
  { id: 'activity', label: 'Activity Badges' },
  { id: 'all', label: 'All Book Talks' },
]

// Teacher review — the Sessions for Review surface, mirrored (full-bleed header
// bar, By Session/Reader toggle, tabbed views). Book Talk activity conversations
// are a new Benny-conversation type, tagged "Activity Badge" in the reused SFR
// table + detail modal.
export function ReviewView({ badge }) {
  const [active, setActive] = useState(null)
  // Land on Activity Badges — the focus of this prototype. The other Sessions-
  // for-Review tabs are shown for context but left non-interactive.
  const [tab, setTab] = useState('activity')
  const [groupBy, setGroupBy] = useState('session')
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
  // The Activity Badges tab is locked to activity-badge Book Talks (no source
  // switching). All Book Talks holds the full set, where source IS switchable.
  const activitySessions = sessions.filter((s) => s.source === 'activity')
  const activityCount = activitySessions.length

  const tabItems = TABS.map((t) => ({
    ...t,
    // Activity Badges + All Book Talks are interactive; the rest are context.
    disabled: t.id !== 'activity' && t.id !== 'all',
    count:
      t.id === 'flagged'
        ? flagged.length
        : t.id === 'engagement'
          ? engagement.length
          : t.id === 'activity'
            ? activityCount
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
      <BackBar label="Dashboard" href="#dashboard" />

      {/* Page header — mirrors Sessions for Review */}
      <div className="app-shell-header">
        <div className="app-shell-header-identity">
          <div className="app-shell-header-text">
            <div className="app-shell-header-name-row">
              <span className="app-shell-header-name">Sessions for Review</span>
            </div>
            <div className="app-shell-header-meta">{SITE.school} · June 2026</div>
          </div>
        </div>
        <div className="sfr-header-actions">
          <Tabs
            variant="pill"
            active={groupBy}
            onChange={setGroupBy}
            items={[
              { id: 'session', label: 'By Session' },
              { id: 'reader', label: 'By Reader' },
            ]}
          />
          <button className="sfr-settings-btn" title="Reading Integrity Settings">
            <Icon name="settings" size={16} />
            Settings
          </button>
        </div>
      </div>

      <div className="sfr-tabs-bar">
        <Tabs
          variant="underline"
          size="md"
          items={tabItems}
          active={tab}
          onChange={setTab}
          accent="#16A97A"
        />
      </div>

      <div className="bt-reviewx-body">
        {tab === 'overview' ? (
          <div className="ov-shell">
            <div className="ov-summary">
              <BennyBubble>
                Students had <strong>{sessions.length}</strong> Book Talks with me —{' '}
                <strong>{activityCount}</strong> from the new Book Talk activity badge and the rest
                after finishing a title — and completed <strong>{completed}</strong> so far. Most
                were positively engaged in their reading; I flagged{' '}
                <strong>{flagged.length}</strong> conversation{flagged.length === 1 ? '' : 's'} for
                you to take a closer look at.
              </BennyBubble>
            </div>
            <div className="ov-grid">
              <HighlightCard
                variant="danger"
                icon={<Icon name="flag" size={18} />}
                title="Validate / Intercede"
                description="Book Talks with integrity flags"
                sessions={flagged}
                viewAllLabel="View all flagged"
                onViewAll={() => setTab('flagged')}
                onSelectSession={setActive}
              />
              <HighlightCard
                variant="success"
                icon={<Icon name="flame" size={18} />}
                title="Celebrate"
                description="Students positively engaged in their Book Talk"
                sessions={green}
                viewAllLabel="View all engaged"
                onViewAll={() => setTab('engagement')}
                onSelectSession={setActive}
              />
              <HighlightCard
                variant="warning"
                icon={<Icon name="star" size={18} />}
                title="Review / Assess"
                description="Students with a mixed Book Talk"
                sessions={yellow}
                viewAllLabel="View all mixed"
                onViewAll={() => setTab('engagement')}
                onSelectSession={setActive}
              />
              <HighlightCard
                variant="intercede"
                icon={<Icon name="flame" size={18} />}
                title="Intercede"
                description="Students who seemed disengaged"
                sessions={red}
                viewAllLabel="View all disengaged"
                onViewAll={() => setTab('engagement')}
                onSelectSession={setActive}
              />
              <HighlightCard
                variant="neutral"
                icon={<Icon name="clock" size={18} />}
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
            sessions={tab === 'activity' ? activitySessions : sessions}
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
