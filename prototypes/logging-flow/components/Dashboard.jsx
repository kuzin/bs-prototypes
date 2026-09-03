import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { Flyout } from '@components/Flyout/Flyout'

import {
  ConnectBanner,
  PartnerSwitcher,
  AutoLoggedCard,
} from '@components/PartnerConnect/PartnerConnect'
import { PersonalizeReader } from '@components/PartnerConnect/PersonalizeReader'

import { READER, OTHER_READERS, CHALLENGES, TOP_SCHOOLS, TOP_GRADES, BOOKS } from '../data'
import { CONNECTION_LIST, autoLoggedRows } from '../connections'
import { ReadingLog } from './ReadingLog'
import { JoyfulFooter, APPS } from '../../footers/JoyfulFooter'

import './Dashboard.css'

// Reuse the consumer web-app dashboard styling (the logging flow opens on top
// of this "Challenges" page — see Figma Option 1, Challenges Page frames).
import '../../web-app/index.css'
import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'
import '@components/ProgressBar/ProgressBar.css'
import '@components/Flyout/Flyout.css'

function BeanstackLogo() {
  return (
    <div className="wa-logo">
      <img src="/bs-prototypes/bs.svg" alt="" className="wa-logo-mark" />
      <span className="wa-logo-word">beanstack</span>
    </div>
  )
}

function TopBar({
  onLog,
  connections,
  onManageConnections,
  onHome,
  onVisitPartner,
  view,
  onView,
  extraTabs = [],
  hideTabs = [],
  partners = [],
}) {
  return (
    <header className="wa-topbar">
      <div className="wa-topbar-inner">
        <button className="wa-logo-btn" onClick={onHome} aria-label="Beanstack home">
          <BeanstackLogo />
        </button>
        {/* Log Reading always stays put; the secondary actions fold into a
            flyout once the bar runs out of room. */}
        <div className="wa-topbar-actions">
          <Button variant="primary" size="md" icon={<Icon name="book" size={16} />} onClick={onLog}>
            Log Reading
          </Button>
          <div className="wa-actions-wide">
            <Button variant="ghost" size="md" icon={<Icon name="check" size={16} />}>
              Complete Activity
            </Button>
            <Button variant="ghost" size="md" icon={<Icon name="writing" size={16} />}>
              Write a Review
            </Button>
          </div>
          <div className="wa-actions-narrow">
            <Flyout
              placement="bottom-start"
              trigger={({ toggle }) => (
                <button className="wa-more-btn" onClick={toggle} aria-label="More actions">
                  <Icon name="dots" size={18} />
                </button>
              )}
            >
              {({ close }) => (
                <div className="wa-more-menu">
                  <button className="wa-more-item" onClick={close}>
                    <Icon name="check" size={16} /> Complete Activity
                  </button>
                  <button className="wa-more-item" onClick={close}>
                    <Icon name="writing" size={16} /> Write Review
                  </button>
                </div>
              )}
            </Flyout>
          </div>
        </div>
        <div className="wa-topbar-user">
          {/* "Swap between the two at any time using the logo in the top right." */}
          <PartnerSwitcher
            partners={partners}
            connections={connections}
            onManage={onManageConnections}
            onVisit={onVisitPartner}
          />
          {/* The reader pill switches reader; the gear is the account menu.
              Both were inert before. */}
          <Flyout
            placement="bottom-end"
            trigger={({ toggle }) => (
              <button className="wa-user-pill" onClick={toggle} aria-label="Switch reader">
                <span className="wa-user-avatar">{READER.initials}</span>
                <span className="wa-user-name">{READER.name}</span>
              </button>
            )}
          >
            {({ close }) => (
              <div className="wa-readers">
                <div className="wa-readers-me">
                  <span className="wa-user-avatar wa-user-avatar--lg">{READER.initials}</span>
                  <span className="wa-readers-name">{READER.name}</span>
                  <button className="wa-readers-edit" onClick={close}>
                    Edit
                  </button>
                </div>
                <div className="wa-readers-others">
                  {OTHER_READERS.filter((r) => r.id !== READER.id).map((r) => (
                    <button key={r.id} className="wa-readers-row" onClick={close}>
                      <span className="wa-user-avatar" style={{ background: r.color }}>
                        {r.initials}
                      </span>
                      {r.name}
                    </button>
                  ))}
                </div>
                <button className="wa-readers-add" onClick={close}>
                  Add a Reader
                </button>
              </div>
            )}
          </Flyout>
          <Flyout
            placement="bottom-end"
            trigger={({ toggle }) => (
              <button className="wa-icon-btn" onClick={toggle} aria-label="Account settings">
                <Icon name="settings" size={20} />
              </button>
            )}
          >
            {({ close }) => (
              <div className="wa-acct">
                <button
                  className="wa-acct-item"
                  onClick={() => {
                    close()
                    onManageConnections()
                  }}
                >
                  Edit Account
                </button>
                <button className="wa-acct-item" onClick={close}>
                  Sign Out
                </button>
              </div>
            )}
          </Flyout>
        </div>
      </div>

      <div className="wa-tabsbar">
        <Tabs
          variant="underline"
          size="md"
          active={view === 'challenges' || view === 'settings' ? 'challenges' : view}
          accent="#1A6DD5"
          onChange={onView}
          items={[
            { id: 'challenges', label: 'Challenges' },
            { id: 'friends', label: 'Friends' },
            { id: 'leaderboards', label: 'Leaderboards' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'badges', label: 'All Badges' },
            { id: 'log', label: 'Reading Log' },
            ...extraTabs,
          ].filter((t) => !hideTabs.includes(t.id))}
        />
      </div>
    </header>
  )
}

function StreakBanner({ streak, onLog }) {
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
            <strong>{streak.current}-day streak!</strong> Keep it going — log again tomorrow.
          </>
        ) : (
          <>
            <strong>No current streak.</strong> Log reading every day to get your streak going!
          </>
        )}
      </div>
      <Button variant="secondary" size="sm" onClick={onLog}>
        {has ? 'Log Today' : 'View Streaks'}
      </Button>
    </div>
  )
}

const ILLUSTRATIONS = {
  spring: {
    bg: 'linear-gradient(180deg, #BFE3FA 0%, #B6F0C9 100%)',
    title: 'SPRING\nINTO\nREADING',
    titleColor: '#23806C',
  },
  'love-hurts': {
    bg: 'linear-gradient(180deg, #8B4424 0%, #5D2A14 100%)',
    title: 'LOVE\nHURTS',
    titleColor: '#FAD5BC',
  },
  arresting: {
    bg: 'linear-gradient(180deg, #FFE8A8 0%, #C8E6B8 100%)',
    title: 'ARRESTING\nSTRANGENESS',
    titleColor: '#3D2A18',
  },
}

function ChallengeCard({ challenge }) {
  const art = ILLUSTRATIONS[challenge.art] ?? ILLUSTRATIONS.spring
  return (
    <button className="wa-chcard" type="button">
      <div className="wa-chcard-hero" style={{ background: art.bg }}>
        <span className="wa-chcard-arttitle" style={{ color: art.titleColor }}>
          {art.title}
        </span>
        <span className="wa-chcard-pill">
          <Pill color="#1A6DD5" variant="filled" size="sm">
            {challenge.badge}
          </Pill>
        </span>
      </div>
      <div className="wa-chcard-body">
        <div className="wa-chcard-title">{challenge.title}</div>
        <div className="wa-chcard-dates">{challenge.dates}</div>
      </div>
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

function LeaderboardCard() {
  const [tab, setTab] = useState('schools')
  const rows = tab === 'schools' ? TOP_SCHOOLS : TOP_GRADES
  return (
    <aside className="wa-card wa-leadcard">
      <div className="wa-leadcard-tabs">
        <Tabs
          variant="underline"
          size="sm"
          active={tab}
          onChange={setTab}
          accent="#1A6DD5"
          items={[
            { id: 'schools', label: 'Top Schools' },
            { id: 'grades', label: 'Top Grades' },
          ]}
        />
      </div>
      <div className="wa-leadcard-meta">
        <button className="wa-leadcard-meta-btn" type="button">
          This Week <Icon name="chevron-down" size={11} />
        </button>
        <button className="wa-leadcard-meta-btn" type="button">
          By Minutes <Icon name="chevron-down" size={11} />
        </button>
      </div>
      <ul className="wa-leadcard-list">
        {rows.map((row) => (
          <li key={row.rank} className="wa-leadcard-row">
            <span className="wa-leadcard-rank" style={{ background: row.color }}>
              {row.rank}
            </span>
            <span className="wa-leadcard-name">{row.name}</span>
            <span className="wa-leadcard-val">{row.value}</span>
          </li>
        ))}
      </ul>
      <a href="#" className="wa-leadcard-more">
        View All Schools
      </a>
    </aside>
  )
}

// The current Beanstack footer lives in the `footers` prototype — logo + app
// stores over a Joyful Reading Co. attribution row, language picker and legal
// links. Rendered from there rather than kept as a second, stale copy here.
function Footer() {
  return <JoyfulFooter app={APPS.find((a) => a.id === 'beanstack')} />
}

/**
 * `extraTabs`, `renderExtra`, `railTop` and `view`/`onView` are optional and
 * additive — they let another prototype hang its own tab (and rail card) off
 * this real dashboard instead of cloning it. Words with Benny uses them to put
 * "My Words" next to the Reading Log. Left off, the page is exactly as it was.
 *
 * `hideTabs` drops built-in tabs by id, for when an extra tab supersedes one
 * (Words with Benny folds "All Badges" into its own Collections tab).
 *
 * `partners` is the list of reading apps this prototype offers to link. It
 * defaults to logging-flow's own CONNECTION_LIST; pass `[]` and the entire
 * integration surface drops out — the connect banner, the topbar switcher, the
 * "logged for you" rail card, and the App Integrations settings section.
 */
export function Dashboard({
  streak,
  dailyGoal,
  onLog,
  connections,
  onLinkPartner,
  onDisconnectPartner,
  onVisitPartner,
  extraTabs = [],
  renderExtra,
  railTop,
  view: viewProp,
  onView: onViewProp,
  hideTabs = [],
  partners = CONNECTION_LIST,
}) {
  const [scope, setScope] = useState('current')
  // 'challenges' | 'settings' | 'log' | any `extraTabs` id — the gear (and
  // "Manage connections") opens the reader's Personalize Reader page, where App
  // Integrations live; the Reading Log tab opens the log itself. A parent can
  // drive the view instead, to deep-link straight to one of its extra tabs.
  const [viewState, setViewState] = useState('challenges')
  const view = viewProp ?? viewState
  const setView = onViewProp ?? setViewState
  const extraIds = extraTabs.map((t) => t.id)
  // One banner covers every partner still to link, so waving it off is one
  // decision rather than one per app.
  const [dismissed, setDismissed] = useState(false)

  const toLink = dismissed ? [] : partners.filter((p) => !connections[p.id])

  return (
    <div className="wa-shell">
      <TopBar
        onLog={onLog}
        connections={connections}
        onManageConnections={() => setView('settings')}
        onHome={() => setView('challenges')}
        onVisitPartner={onVisitPartner}
        partners={partners}
        view={view}
        onView={(id) => setView(id === 'log' || extraIds.includes(id) ? id : 'challenges')}
        extraTabs={extraTabs}
        hideTabs={hideTabs}
      />
      <main className="wa-main">
        <div className="wa-main-inner">
          {extraIds.includes(view) ? (
            renderExtra?.(view)
          ) : view === 'log' ? (
            <ReadingLog />
          ) : view === 'settings' ? (
            <PersonalizeReader
              reader={READER}
              partners={partners}
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
              <StreakBanner streak={streak} onLog={onLog} />
              <div className="wa-layout">
                <section className="wa-content">
                  <div className="wa-section-head">
                    <h2 className="wa-h2">Challenges</h2>
                    <div className="wa-scope">
                      {[
                        { id: 'current', label: 'Current' },
                        { id: 'past', label: 'Past' },
                        { id: 'ignored', label: 'Ignored' },
                      ].map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          className={`wa-scope-btn${scope === o.id ? ' wa-scope-btn--active' : ''}`}
                          onClick={() => setScope(o.id)}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="wa-group">
                    <div className="wa-group-title">{READER.name}&apos;s Challenges</div>
                    <div className="wa-group-sub">
                      Challenges that {READER.name} is participating in.
                    </div>
                    <div className="wa-chgrid">
                      {CHALLENGES.map((c) => (
                        <ChallengeCard key={c.id} challenge={c} />
                      ))}
                    </div>
                  </div>
                </section>
                <div className="wa-rail">
                  {railTop}
                  <GoalCard dailyGoal={dailyGoal} />
                  <AutoLoggedCard
                    className="wa-card"
                    rows={partners.length ? autoLoggedRows(connections, BOOKS) : []}
                  />
                  <LeaderboardCard />
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
