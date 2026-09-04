import { useState } from 'react'
import { AppShell } from '@components/AppShell/AppShell'
import { Tabs } from '@components/Tabs/Tabs'
import { Overview } from './Overview'
import { SafetyView } from './SafetyView'
import { FlaggedView } from './FlaggedView'
import { EngagementView } from './EngagementView'
import { AllBTWBView } from './AllBTWBView'
import { SessionModal, ApproveConfirmModal } from './SessionModal'
import { StudentPanel } from '../../ris/components/StudentPanel'
import { SITE, isSafetyOpen } from '../data'
import '../../ris/components/StudentPanel.css'
import '@components/Tabs/Tabs.css'
import './SfrPage.css'

// Every row carries a `desc`. Where the shipped People menu has copy for the
// row (bs-product `new_admin/shared/menu/_people_menu.html.erb` and
// `_students.html.erb`) it's used verbatim.
function buildNav() {
  return [
    {
      id: 'classes',
      label: 'Classes',
      icon: 'demographics',
      desc: 'View and log for classes.',
    },
    { id: 'students', label: 'Students', icon: 'person', desc: 'View and log for students.' },
    {
      id: 'view-students',
      label: 'View Students',
      icon: 'person',
      subgroup: true,
      desc: 'View and log for students.',
    },
    {
      id: 'earned-rewards',
      label: 'Earned Rewards',
      icon: 'habits',
      subgroup: true,
      desc: 'View and redeem rewards by class and challenge.',
    },
    {
      id: 'book-talks',
      label: 'Book Talks',
      icon: 'book',
      desc: 'Review book talks and sessions for review.',
    },
    {
      id: 'overview',
      label: 'Overview',
      icon: 'overview',
      subgroup: true,
      desc: 'Book talk activity at a glance.',
    },
    {
      id: 'all',
      label: 'All Book Talks',
      icon: 'book',
      subgroup: true,
      desc: 'Browse every completed book talk.',
    },
    {
      id: 'safety',
      label: 'Safety Signals',
      icon: 'shield',
      subgroup: true,
      desc: 'Review sessions flagged for a safety risk.',
    },
    {
      id: 'flagged',
      label: 'Flagged Sessions',
      icon: 'flag',
      subgroup: true,
      desc: 'View and delete all sessions for review, including Flagged Entries.',
    },
    {
      id: 'engagement',
      label: 'Engagement Sessions',
      icon: 'flame',
      subgroup: true,
      desc: 'Review sessions flagged for low engagement.',
    },
    { id: 'staff', label: 'Staff', icon: 'person', desc: 'View staff.' },
    {
      id: 'groups',
      label: 'Groups',
      icon: 'overview',
      desc: 'Create, edit, delete, and log for groups.',
    },
  ]
}

function buildBadges(sessions) {
  return {
    safety: sessions.filter(isSafetyOpen).length,
    flagged: sessions.filter(
      (s) => (s.type === 'flagged' || s.type === 'both') && (s.flags?.length ?? 0) > 0,
    ).length,
    engagement: sessions.filter((s) => s.type === 'engagement' || s.type === 'both').length,
    all: sessions.length,
  }
}

const TAB_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'all', label: 'All Book Talks' },
  { id: 'safety', label: 'Safety Signals', danger: true },
  { id: 'flagged', label: 'Flagged Sessions' },
  { id: 'engagement', label: 'Engagement Sessions' },
]

export function SfrPage({
  sessions,
  activeTab,
  onActiveTab,
  selectedSession,
  onSelectSession,
  onUpdateSession,
  onBack,
}) {
  const [groupBy, setGroupBy] = useState('session') // 'session' | 'reader'
  const [tabFilters, setTabFilters] = useState({})
  const [sessionList, setSessionList] = useState([])
  const [approveTarget, setApproveTarget] = useState(null)
  const [profileStudent, setProfileStudent] = useState(null)

  const badges = buildBadges(sessions)

  function confirmApprove() {
    if (!approveTarget) return
    const clearedFlags = [...(approveTarget.flags || [])]
    const previousType = approveTarget.type
    // If the session also had an engagement aspect, demote 'both' to 'engagement';
    // otherwise drop the type entirely so it only appears in All Book Talks.
    const nextType = previousType === 'both' ? 'engagement' : null
    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      by: SITE.admin,
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

  const sessionIdx = selectedSession
    ? sessionList.findIndex((s) => s.id === selectedSession.id)
    : -1
  const hasPrev = sessionIdx > 0
  const hasNext = sessionIdx >= 0 && sessionIdx < sessionList.length - 1

  function handlePrev() {
    if (hasPrev) onSelectSession(sessionList[sessionIdx - 1])
  }
  function handleNext() {
    if (hasNext) onSelectSession(sessionList[sessionIdx + 1])
  }

  return (
    <>
      <AppShell
        sidebar={{
          title: 'Classes and Readers',
          subtitle: 'Find and log for students and classes.',
          nav: buildNav(sessions),
          active: activeTab,
          badges,
          onNavigate: (id) => {
            if (id === 'classes') return
            if (id === 'book-talks') {
              onActiveTab('overview')
              setTabFilters({})
              return
            }
            if (id !== 'logs') {
              onActiveTab(id)
              setTabFilters({})
            }
          },
          mainRailIndex: 3,
        }}
        backBar={{ label: 'Dashboard', onClick: onBack }}
      >
        {/* Page header */}
        <div className="app-shell-header">
          <div className="app-shell-header-identity">
            <div className="app-shell-header-text">
              <div className="app-shell-header-name-row">
                <span className="app-shell-header-name">Sessions for Review</span>
              </div>
              <div className="app-shell-header-meta">Classic and Readers · May 2026</div>
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
          </div>
        </div>

        {/* Tabs */}
        <div className="sfr-tabs-bar">
          <Tabs
            items={TAB_ITEMS.map((t) => ({ ...t, count: badges[t.id] }))}
            active={activeTab}
            onChange={onActiveTab}
            accent="#16A97A"
          />
        </div>

        <div className="app-shell-page">
          {activeTab === 'overview' && (
            <Overview
              sessions={sessions}
              onGoToTab={goToTabWithFilters}
              onSelectSession={handleSelectSession}
            />
          )}
          {activeTab === 'safety' && (
            <SafetyView
              sessions={sessions}
              onSelectSession={handleSelectSession}
              defaultFilters={tabFilters}
            />
          )}
          {activeTab === 'flagged' && (
            <FlaggedView
              sessions={sessions}
              onSelectSession={handleSelectSession}
              onApproveRequest={setApproveTarget}
              onViewProfile={setProfileStudent}
              groupBy={groupBy}
              defaultFilters={tabFilters}
            />
          )}
          {activeTab === 'engagement' && (
            <EngagementView
              sessions={sessions}
              onSelectSession={handleSelectSession}
              onApproveRequest={setApproveTarget}
              onViewProfile={setProfileStudent}
              groupBy={groupBy}
              defaultFilters={tabFilters}
            />
          )}
          {activeTab === 'all' && (
            <AllBTWBView
              sessions={sessions}
              onSelectSession={handleSelectSession}
              onApproveRequest={setApproveTarget}
              onViewProfile={setProfileStudent}
              groupBy={groupBy}
              defaultFilters={tabFilters}
            />
          )}
          {activeTab === 'logs' && (
            <div className="sfr-stub">
              <div className="sfr-stub-icon">📖</div>
              <div>Reading Logs for Review</div>
              <div className="sfr-stub-sub">
                Coming soon — this view will list individual reading log entries flagged for review.
              </div>
            </div>
          )}
        </div>
      </AppShell>

      {/* Session detail modal */}
      <SessionModal
        session={selectedSession}
        allSessions={sessions}
        reviewer={SITE.admin}
        onClose={() => onSelectSession(null)}
        onUpdateSession={onUpdateSession}
        onSelectSession={onSelectSession}
        onApproveRequest={setApproveTarget}
        onViewProfile={setProfileStudent}
        onPrev={hasPrev ? handlePrev : null}
        onNext={hasNext ? handleNext : null}
        sessionIdx={sessionIdx}
        sessionCount={sessionList.length}
      />

      <StudentPanel student={profileStudent} onClose={() => setProfileStudent(null)} />

      <ApproveConfirmModal
        open={!!approveTarget}
        flagCount={(approveTarget?.flags || []).length}
        studentName={approveTarget?.student.name ?? ''}
        onCancel={() => setApproveTarget(null)}
        onConfirm={confirmApprove}
      />
    </>
  )
}
