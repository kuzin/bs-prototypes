import { useState } from 'react'
import { Sidebar } from '../../ris/components/Sidebar'
import { Tabs } from '../../ris/components/Tabs'
import { BackBar } from '../../BackBar'
import { Overview } from './Overview'
import { FlaggedView } from './FlaggedView'
import { EngagementView } from './EngagementView'
import { AllBTWBView } from './AllBTWBView'
import { SessionModal, ApproveConfirmModal } from './SessionModal'
import '../../ris/components/RisLayout.css'
import '../../ris/components/Sidebar.css'
import '../../ris/components/Tabs.css'
import '../../BackBar.css'
import '../../MainRail.css'
import './SfrPage.css'

function buildNav(sessions) {
  return [
    { id: 'classes',         label: 'Classes',    icon: 'demographics' },
    { id: 'students',        label: 'Students',        icon: 'person' },
    { id: 'view-students',   label: 'View Students',   icon: 'person',   subgroup: true },
    { id: 'earned-rewards',  label: 'Earned Rewards',  icon: 'habits',   subgroup: true },
    { id: 'book-talks',      label: 'Book Talks', icon: 'book' },
    { id: 'overview',        label: 'Overview',            icon: 'overview', subgroup: true },
    { id: 'flagged',         label: 'Flagged Sessions',    icon: 'flag',     subgroup: true },
    { id: 'engagement',      label: 'Engagement Sessions', icon: 'flame',    subgroup: true },
    { id: 'all',             label: 'All Book Talks',      icon: 'book',     subgroup: true },
    { id: 'staff',           label: 'Staff',    icon: 'person' },
    { id: 'groups',          label: 'Groups',   icon: 'overview' },
  ]
}

function buildBadges(sessions) {
  return {
    flagged:    sessions.filter(s => (s.type === 'flagged' || s.type === 'both') && (s.flags?.length ?? 0) > 0).length,
    engagement: sessions.filter(s => s.type === 'engagement' || s.type === 'both').length,
    all:        sessions.length,
  }
}

const TAB_ITEMS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'flagged',    label: 'Flagged Sessions' },
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
  const [tabFilters, setTabFilters] = useState({})
  const [sessionList, setSessionList] = useState([])
  const [approveTarget, setApproveTarget] = useState(null)

  function confirmApprove() {
    if (!approveTarget) return
    const clearedFlags = [...(approveTarget.flags || [])]
    const previousType = approveTarget.type
    // If the session also had an engagement aspect, demote 'both' to 'engagement';
    // otherwise drop the type entirely so it only appears in All Book Talks.
    const nextType = previousType === 'both' ? 'engagement' : null
    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      by: 'Mr. Garcia',
      at: new Date().toISOString(),
      kind: 'approved',
      removedCount: clearedFlags.length,
      clearedFlags,
      previousType,
    }
    onUpdateSession({
      ...approveTarget,
      flags: [],
      type: nextType,
      changeLog: [...(approveTarget.changeLog || []), entry],
    })
    setApproveTarget(null)
    onSelectSession(null)
  }

  function goToTabWithFilters(tabId, filters = {}) {
    onActiveTab(tabId)
    setTabFilters(filters)
  }

  function handleSelectSession(session, list) {
    onSelectSession(session)
    if (list) setSessionList(list)
  }

  const sessionIdx = selectedSession ? sessionList.findIndex(s => s.id === selectedSession.id) : -1
  const hasPrev = sessionIdx > 0
  const hasNext = sessionIdx >= 0 && sessionIdx < sessionList.length - 1

  function handlePrev() { if (hasPrev) onSelectSession(sessionList[sessionIdx - 1]) }
  function handleNext() { if (hasNext) onSelectSession(sessionList[sessionIdx + 1]) }

  return (
    <div className="ris-layout">
      <Sidebar
        title="Classes and Readers"
        subtitle="Find and log for students and classes."
        nav={buildNav(sessions)}
        active={activeTab}
        badges={buildBadges(sessions)}
        onNavigate={id => {
          if (id === 'classes') return
          if (id === 'book-talks') { onActiveTab('overview'); setTabFilters({}); return }
          if (id !== 'logs') { onActiveTab(id); setTabFilters({}) }
        }}
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
              count: t.id === 'flagged'    ? sessions.filter(s => (s.type === 'flagged' || s.type === 'both') && (s.flags?.length ?? 0) > 0).length
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
          {activeTab === 'overview'   && <Overview   sessions={sessions} onGoToTab={goToTabWithFilters} onSelectSession={handleSelectSession} />}
          {activeTab === 'flagged'    && <FlaggedView    sessions={sessions} onSelectSession={handleSelectSession} onApproveRequest={setApproveTarget} groupBy={groupBy} defaultFilters={tabFilters} />}
          {activeTab === 'engagement' && <EngagementView sessions={sessions} onSelectSession={handleSelectSession} onApproveRequest={setApproveTarget} groupBy={groupBy} defaultFilters={tabFilters} />}
          {activeTab === 'all'        && <AllBTWBView    sessions={sessions} onSelectSession={handleSelectSession} onApproveRequest={setApproveTarget} groupBy={groupBy} defaultFilters={tabFilters} />}
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
        allSessions={sessions}
        onClose={() => onSelectSession(null)}
        onUpdateSession={onUpdateSession}
        onSelectSession={onSelectSession}
        onApproveRequest={setApproveTarget}
        onPrev={hasPrev ? handlePrev : null}
        onNext={hasNext ? handleNext : null}
        sessionIdx={sessionIdx}
        sessionCount={sessionList.length}
      />

      <ApproveConfirmModal
        open={!!approveTarget}
        flagCount={(approveTarget?.flags || []).length}
        studentName={approveTarget?.student.name ?? ''}
        onCancel={() => setApproveTarget(null)}
        onConfirm={confirmApprove}
      />
    </div>
  )
}
