import { useState } from 'react'
import { Sidebar } from '../../ris/components/Sidebar'
import { Tabs } from '../../ris/components/Tabs'
import { BackBar } from '../../BackBar'
import { Overview } from './Overview'
import { FlaggedView } from './FlaggedView'
import { EngagementView } from './EngagementView'
import { AllBTWBView } from './AllBTWBView'
import { SessionModal } from './SessionModal'
import '../../ris/components/RisLayout.css'
import '../../ris/components/Sidebar.css'
import '../../ris/components/Tabs.css'
import '../../BackBar.css'
import '../../MainRail.css'
import './SfrPage.css'

function buildNav(sessions) {
  const flaggedCount    = sessions.filter(s => s.type === 'flagged' || s.type === 'both').length
  const engageCount     = sessions.filter(s => s.type === 'engagement' || s.type === 'both').length
  return [
    { id: 'overview',    label: 'Overview',            icon: 'overview' },
    { id: 'flagged',     label: 'Flagged Entries',     icon: 'flag',      section: 'Book Talks', subgroup: true },
    { id: 'engagement',  label: 'Engagement Sessions', icon: 'flame',     subgroup: true },
    { id: 'all',         label: 'All Book Talks',      icon: 'book',      subgroup: true },
    { id: 'logs',        label: 'Reading Logs',        icon: 'habits' },
  ]
}

function buildBadges(sessions) {
  return {
    flagged:    sessions.filter(s => s.type === 'flagged' || s.type === 'both').length,
    engagement: sessions.filter(s => s.type === 'engagement' || s.type === 'both').length,
    all:        sessions.length,
  }
}

const TAB_ITEMS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'flagged',    label: 'Flagged Entries' },
  { id: 'engagement', label: 'Engagement Sessions' },
  { id: 'all',        label: 'All Book Talks' },
]

export function SfrPage({
  sessions,
  activeTab,
  onActiveTab,
  selectedSession,
  onSelectSession,
  onUpdateSession,
  onDeleteSession,
  onBack,
}) {
  const [groupBy, setGroupBy] = useState('session') // 'session' | 'reader'

  return (
    <div className="ris-layout">
      <Sidebar
        title="Sessions for Review"
        subtitle="Classic and Readers"
        nav={buildNav(sessions)}
        active={activeTab}
        badges={buildBadges(sessions)}
        onNavigate={id => id !== 'logs' && onActiveTab(id)}
        mainRailIndex={3}
      />

      <div className="rl-content">
        <BackBar label="Dashboard" onClick={onBack} />
        {/* Page header */}
        <div className="rl-header">
          <div className="rl-header-identity">
            <div className="rl-header-text">
              <div className="rl-header-name-row">
                <span className="rl-header-name">Sessions for Review</span>
              </div>
              <div className="rl-header-meta">Classic and Readers · May 2026</div>
            </div>
          </div>
          <div className="sfr-header-actions">
            {/* By Session / By Reader toggle */}
            <div className="sfr-view-toggle">
              <button
                className={`sfr-view-btn${groupBy === 'session' ? ' sfr-view-btn--active' : ''}`}
                onClick={() => setGroupBy('session')}
              >By Session</button>
              <button
                className={`sfr-view-btn${groupBy === 'reader' ? ' sfr-view-btn--active' : ''}`}
                onClick={() => setGroupBy('reader')}
              >By Reader</button>
            </div>
            {/* Reading Integrity Settings */}
            <button className="sfr-settings-btn" title="Reading Integrity Settings">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10" cy="10" r="3"/>
                <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"/>
              </svg>
              Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="sfr-tabs-bar">
          <Tabs
            items={TAB_ITEMS.map(t => ({
              ...t,
              count: t.id === 'flagged'    ? sessions.filter(s => s.type === 'flagged' || s.type === 'both').length
                   : t.id === 'engagement' ? sessions.filter(s => s.type === 'engagement' || s.type === 'both').length
                   : t.id === 'all'        ? sessions.length
                   : undefined,
            }))}
            active={activeTab}
            onChange={onActiveTab}
            accent="#16A97A"
          />
        </div>

        <div className="rl-page">
          {activeTab === 'overview'   && <Overview   sessions={sessions} onGoToTab={onActiveTab} />}
          {activeTab === 'flagged'    && <FlaggedView    sessions={sessions} onSelectSession={onSelectSession} groupBy={groupBy} />}
          {activeTab === 'engagement' && <EngagementView sessions={sessions} onSelectSession={onSelectSession} groupBy={groupBy} />}
          {activeTab === 'all'        && <AllBTWBView    sessions={sessions} onSelectSession={onSelectSession} groupBy={groupBy} />}
          {activeTab === 'logs'       && (
            <div className="sfr-stub">
              <div className="sfr-stub-icon">📖</div>
              <div>Reading Logs for Review</div>
              <div className="sfr-stub-sub">Coming soon — this view will list individual reading log entries flagged for review.</div>
            </div>
          )}
        </div>
      </div>

      {/* Session detail modal */}
      <SessionModal
        session={selectedSession}
        onClose={() => onSelectSession(null)}
      />
    </div>
  )
}
