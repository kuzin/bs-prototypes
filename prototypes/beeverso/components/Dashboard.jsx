import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import {
  ConnectBanner,
  PartnerSwitcher,
  AutoLoggedCard,
} from '@components/PartnerConnect/PartnerConnect'
import { PersonalizeReader } from '@components/PartnerConnect/PersonalizeReader'

import { PARTNERS, PARTNER_BY_ID } from '../connections'
import { READER, CHALLENGES, TITLE_BY_ID, importedSessions } from '../data'
import { ReadingLog } from './ReadingLog'
import './Dashboard.css'

// The reader-facing Beanstack the integration lands in. Borrows the consumer
// web-app dashboard styling so the Beeverso pieces read in their real context.
import '../../web-app/index.css'
import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/ProgressBar/ProgressBar.css'

function BeanstackLogo() {
  return (
    <div className="wa-logo">
      <img src="/bs-prototypes/bs.svg" alt="" className="wa-logo-mark" />
      <span className="wa-logo-word">beanstack</span>
    </div>
  )
}

function TopBar({ connections, onManageConnections, onHome, onVisitPartner, view, onView }) {
  return (
    <header className="wa-topbar">
      <div className="wa-topbar-inner">
        <button className="wa-logo-btn" onClick={onHome} aria-label="Beanstack home">
          <BeanstackLogo />
        </button>
        <div className="wa-topbar-actions">
          <Button variant="primary" size="sm" icon={<Icon name="book" size={16} />}>
            Log Reading
          </Button>
        </div>
        <div className="wa-topbar-user">
          {/* "Swap between the two at any time using the logo in the top right." */}
          <PartnerSwitcher
            partners={PARTNERS}
            connections={connections}
            onManage={onManageConnections}
            onVisit={onVisitPartner}
          />
          <div className="wa-user-pill">
            <span className="wa-user-avatar">{READER.initials}</span>
            <span className="wa-user-name">{READER.name.split(' ')[0]}</span>
          </div>
          <button className="wa-icon-btn" aria-label="Settings" onClick={onManageConnections}>
            <Icon name="settings" size={20} />
          </button>
        </div>
      </div>

      <div className="wa-tabsbar">
        <Tabs
          variant="underline"
          size="md"
          active={view === 'log' ? 'log' : 'challenges'}
          accent="#1A6DD5"
          onChange={onView}
          items={[
            { id: 'challenges', label: 'Challenges' },
            { id: 'friends', label: 'Friends' },
            { id: 'leaderboards', label: 'Leaderboards' },
            { id: 'badges', label: 'All Badges' },
            { id: 'log', label: 'Reading Log' },
          ]}
        />
      </div>
    </header>
  )
}

function StreakBanner({ streak, linkedCount }) {
  const has = streak.current > 0
  return (
    <div className="wa-streak">
      <div className="wa-streak-flame">
        <Icon name="flame-filled" size={18} />
        <span className="wa-streak-num">{streak.current}</span>
      </div>
      <div className="wa-streak-msg">
        {has ? (
          <>
            <strong>{streak.current}-day streak!</strong> Reading in{' '}
            {linkedCount > 1 ? 'your linked apps counts' : 'your linked app counts'} toward it too.
          </>
        ) : (
          <>
            <strong>No current streak.</strong> Log reading every day to get your streak going!
          </>
        )}
      </div>
      <Button variant="secondary" size="sm">
        {has ? 'View Streaks' : 'Log Today'}
      </Button>
    </div>
  )
}

function ChallengeCard({ challenge }) {
  const pct = Math.round((challenge.progress / challenge.total) * 100)
  return (
    <button className="bvch" type="button" style={{ '--bvch-color': challenge.color }}>
      <span className="bvch-hero">
        <span className="bvch-hero-title">{challenge.name}</span>
      </span>
      <span className="bvch-body">
        <span className="bvch-sub">{challenge.sub}</span>
        <ProgressBar value={challenge.progress} max={challenge.total} color={challenge.color} />
        <span className="bvch-meter">
          {challenge.progress} of {challenge.total} {challenge.unit} · {pct}%
        </span>
      </span>
    </button>
  )
}

function GoalCard({ dailyGoal }) {
  const { minutes, goal } = dailyGoal
  const met = minutes >= goal
  return (
    <aside className="wa-card wa-goalcard">
      <div className="wa-goalcard-head">
        <div className="wa-goalcard-title">
          {met ? 'Well done!' : minutes > 0 ? 'Almost there!' : "Today's Goal"}
        </div>
        <div className="wa-goalcard-sub">
          {met
            ? "You've reached your reading goal for the day."
            : `Read ${goal - minutes} more minute${goal - minutes === 1 ? '' : 's'} to hit your daily goal.`}
        </div>
      </div>
      <div className="wa-goalcard-meter">
        <div className="wa-goalcard-amount">
          <span className="wa-goalcard-num" style={{ color: met ? '#10B981' : '#1A6DD5' }}>
            {minutes}
          </span>
          <span className="wa-goalcard-denom"> / {goal} minutes</span>
        </div>
        <ProgressBar value={minutes} max={goal} color={met ? '#10B981' : '#1A6DD5'} size="lg" />
      </div>
    </aside>
  )
}

function Footer() {
  return (
    <footer className="wa-footer">
      <div className="wa-footer-inner">
        <BeanstackLogo />
        <div className="wa-footer-copy">
          © 2026 Zoobean, Inc. <span>•</span> <a href="#">Terms</a> <span>•</span>{' '}
          <a href="#">Privacy</a>
        </div>
      </div>
    </footer>
  )
}

// Today's reading from every linked app, in the shape the shared rail card
// wants. With two apps connected the card is the clearest picture of the
// integration: one list, one total, two sources.
const autoLoggedRows = (connections) =>
  importedSessions(connections)
    .filter((s) => s.when === 'Today')
    .map((s) => ({
      id: s.id,
      partnerId: s.partnerId,
      title: TITLE_BY_ID[s.title].title,
      meta: `${PARTNER_BY_ID[s.partnerId].name} · ${s.when}${s.finished ? ' · Finished' : ''}`,
      minutes: s.minutes,
    }))

export function Dashboard({
  streak,
  dailyGoal,
  connections,
  onLinkPartner,
  onDisconnectPartner,
  onVisitPartner,
}) {
  // 'challenges' | 'settings' | 'log' — the gear (and "Manage connections") opens
  // Personalize Reader, where App Integrations live.
  const [view, setView] = useState('challenges')
  // One banner covers every app still to link, so waving it off is one decision.
  const [dismissed, setDismissed] = useState(false)

  const linkedCount = PARTNERS.filter((p) => connections[p.id]).length
  const toLink = dismissed ? [] : PARTNERS.filter((p) => !connections[p.id])

  return (
    <div className="wa-shell">
      <TopBar
        connections={connections}
        onManageConnections={() => setView('settings')}
        onHome={() => setView('challenges')}
        onVisitPartner={onVisitPartner}
        view={view}
        onView={(id) => setView(id === 'log' ? 'log' : 'challenges')}
      />
      <main className="wa-main">
        <div className="wa-main-inner">
          {view === 'log' ? (
            <ReadingLog connections={connections} />
          ) : view === 'settings' ? (
            <PersonalizeReader
              reader={READER}
              partners={PARTNERS}
              connections={connections}
              onLink={onLinkPartner}
              onDisconnect={onDisconnectPartner}
            />
          ) : (
            <>
              <ConnectBanner
                partners={toLink}
                onLink={onLinkPartner}
                onDismiss={() => setDismissed(true)}
              />
              <StreakBanner streak={streak} linkedCount={linkedCount} />
              <div className="wa-layout">
                <section className="wa-content">
                  <div className="wa-section-head">
                    <h2 className="wa-h2">Challenges</h2>
                  </div>
                  <div className="wa-group">
                    <div className="wa-group-title">{READER.name}&apos;s Challenges</div>
                    <div className="wa-group-sub">
                      Reading in any linked app counts toward these.
                    </div>
                    <div className="bvch-grid">
                      {CHALLENGES.map((c) => (
                        <ChallengeCard key={c.id} challenge={c} />
                      ))}
                    </div>
                  </div>
                </section>
                <div className="wa-rail">
                  <GoalCard dailyGoal={dailyGoal} />
                  <AutoLoggedCard className="wa-card" rows={autoLoggedRows(connections)} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
