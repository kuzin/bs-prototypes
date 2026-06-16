import { useState } from 'react'
import { AppShell } from '@components/AppShell/AppShell'
import { Tabs } from '@components/Tabs/Tabs'
import { Icon } from '@components/Icon/Icon'
import { Overview } from '../../sfr/components/Overview'
import { SafetyView } from './SafetyView'
import { SafetySettings } from './SafetySettings'
import { FlaggedView } from '../../sfr/components/FlaggedView'
import { EngagementView } from '../../sfr/components/EngagementView'
import { AllBTWBView } from '../../sfr/components/AllBTWBView'
import { SessionModal, ApproveConfirmModal } from '../../sfr/components/SessionModal'
import { SITE, isSafetyOpen } from '../data'
import '@components/Tabs/Tabs.css'
import '../../sfr/components/SfrPage.css'

const NAV = [
  { id: 'classes', label: 'Classes', icon: 'demographics' },
  { id: 'students', label: 'Students', icon: 'person' },
  { id: 'book-talks', label: 'Book Talks', icon: 'book' },
  { id: 'overview', label: 'Overview', icon: 'overview', subgroup: true },
  { id: 'safety', label: 'Safety Signals', icon: 'shield', subgroup: true },
  { id: 'flagged', label: 'Flagged Sessions', icon: 'flag', subgroup: true },
  { id: 'engagement', label: 'Engagement Sessions', icon: 'flame', subgroup: true },
  { id: 'all', label: 'All Book Talks', icon: 'book', subgroup: true },
  { id: 'staff', label: 'Staff', icon: 'person' },
]

const TAB_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'safety', label: 'Safety Signals' },
  { id: 'flagged', label: 'Flagged Sessions' },
  { id: 'engagement', label: 'Engagement Sessions' },
  { id: 'all', label: 'All Book Talks' },
]

export function ReviewPage({
  sessions,
  activeTab,
  onActiveTab,
  selectedSession,
  onSelectSession,
  onUpdateSession,
  onBack,
}) {
  const [groupBy, setGroupBy] = useState('session')
  const [tabFilters, setTabFilters] = useState({})
  const [sessionList, setSessionList] = useState([])
  const [approveTarget, setApproveTarget] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const counts = {
    safety: sessions.filter(isSafetyOpen).length,
    flagged: sessions.filter((s) => (s.type === 'flagged' || s.type === 'both') && s.flags?.length)
      .length,
    engagement: sessions.filter((s) => s.type === 'engagement' || s.type === 'both').length,
    all: sessions.length,
  }

  function goToTab(tabId, filters = {}) {
    onActiveTab(tabId)
    setTabFilters(filters)
  }

  function handleSelect(session, list) {
    onSelectSession(session)
    if (list) setSessionList(list)
  }

  function confirmApprove() {
    if (!approveTarget) return
    const clearedFlags = [...(approveTarget.flags || [])]
    const previousType = approveTarget.type
    const nextType = previousType === 'both' ? 'engagement' : null
    onUpdateSession({
      ...approveTarget,
      flags: [],
      type: nextType,
      changeLog: [
        ...(approveTarget.changeLog || []),
        {
          id: `log-${Date.now()}`,
          by: SITE.admin,
          at: new Date().toISOString(),
          kind: 'approved',
          removedCount: clearedFlags.length,
          clearedFlags,
          previousType,
        },
      ],
    })
    setApproveTarget(null)
    onSelectSession(null)
  }

  const idx = selectedSession ? sessionList.findIndex((s) => s.id === selectedSession.id) : -1
  const hasPrev = idx > 0
  const hasNext = idx >= 0 && idx < sessionList.length - 1

  return (
    <>
      <AppShell
        sidebar={{
          title: 'Classes and Readers',
          subtitle: 'Review Book Talks for integrity & safety.',
          nav: NAV,
          active: activeTab,
          badges: counts,
          onNavigate: (id) => {
            if (id === 'classes' || id === 'students' || id === 'staff') return
            if (id === 'book-talks') {
              goToTab('overview')
              return
            }
            goToTab(id)
          },
          mainRailIndex: 3,
        }}
        backBar={{ label: 'Dashboard', onClick: onBack }}
      >
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
            {/* By Session / By Reader toggle */}
            <Tabs
              variant="pill"
              active={groupBy}
              onChange={setGroupBy}
              items={[
                { id: 'session', label: 'By Session' },
                { id: 'reader', label: 'By Reader' },
              ]}
            />
            <button
              className="sfr-settings-btn"
              title="Trigger words & notification settings"
              onClick={() => setSettingsOpen(true)}
            >
              <Icon name="settings" size={16} />
              Settings
            </button>
          </div>
        </div>

        <div className="sfr-tabs-bar">
          <Tabs
            items={TAB_ITEMS.map((t) => ({ ...t, count: counts[t.id] }))}
            active={activeTab}
            onChange={(id) => goToTab(id)}
            accent="#16A97A"
          />
        </div>

        <div className="app-shell-page">
          {activeTab === 'overview' && (
            <Overview sessions={sessions} onGoToTab={goToTab} onSelectSession={handleSelect} />
          )}
          {activeTab === 'safety' && (
            <SafetyView
              sessions={sessions}
              onSelectSession={handleSelect}
              defaultFilters={tabFilters}
            />
          )}
          {activeTab === 'flagged' && (
            <FlaggedView
              sessions={sessions}
              onSelectSession={handleSelect}
              onApproveRequest={setApproveTarget}
              groupBy={groupBy}
              defaultFilters={tabFilters}
            />
          )}
          {activeTab === 'engagement' && (
            <EngagementView
              sessions={sessions}
              onSelectSession={handleSelect}
              onApproveRequest={setApproveTarget}
              groupBy={groupBy}
              defaultFilters={tabFilters}
            />
          )}
          {activeTab === 'all' && (
            <AllBTWBView
              sessions={sessions}
              onSelectSession={handleSelect}
              onApproveRequest={setApproveTarget}
              groupBy={groupBy}
              defaultFilters={tabFilters}
            />
          )}
        </div>
      </AppShell>

      <SessionModal
        session={selectedSession}
        allSessions={sessions}
        reviewer={SITE.admin}
        onClose={() => onSelectSession(null)}
        onUpdateSession={onUpdateSession}
        onSelectSession={onSelectSession}
        onApproveRequest={setApproveTarget}
        onPrev={hasPrev ? () => onSelectSession(sessionList[idx - 1]) : null}
        onNext={hasNext ? () => onSelectSession(sessionList[idx + 1]) : null}
        sessionIdx={idx}
        sessionCount={sessionList.length}
      />

      <ApproveConfirmModal
        open={!!approveTarget}
        flagCount={(approveTarget?.flags || []).length}
        studentName={approveTarget?.student.name ?? ''}
        onCancel={() => setApproveTarget(null)}
        onConfirm={confirmApprove}
      />

      <SafetySettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
