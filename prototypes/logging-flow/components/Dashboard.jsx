import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { IconButton } from '@components/Primitives/Primitives'

import { READER, CHALLENGES, TOP_SCHOOLS, TOP_GRADES } from '../data'

// Reuse the consumer web-app dashboard styling (the logging flow opens on top
// of this "Challenges" page — see Figma Option 1, Challenges Page frames).
import '../../web-app/index.css'
import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'
import '@components/ProgressBar/ProgressBar.css'
import '@components/Primitives/Primitives.css'

function BeanstackLogo() {
  return (
    <div className="wa-logo">
      <img src="/bs-prototypes/bs.svg" alt="" className="wa-logo-mark" />
      <span className="wa-logo-word">beanstack</span>
    </div>
  )
}

function TopBar({ onLog }) {
  return (
    <header className="wa-topbar">
      <div className="wa-topbar-inner">
        <BeanstackLogo />
        <div className="wa-topbar-actions">
          <Button variant="primary" size="sm" icon={<Icon name="book" size={16} />} onClick={onLog}>
            Log Reading
          </Button>
          <Button variant="ghost" size="sm" icon={<Icon name="check" size={15} />}>
            Complete Activity
          </Button>
          <Button variant="ghost" size="sm" icon={<Icon name="writing" size={15} />}>
            Write Review
          </Button>
        </div>
        <div className="wa-topbar-user">
          <div className="wa-user-pill">
            <span className="wa-user-avatar">{READER.initials}</span>
            <span className="wa-user-name">{READER.name}</span>
          </div>
          <button className="wa-icon-btn" aria-label="Settings">
            <Icon name="settings" size={20} />
          </button>
        </div>
      </div>

      <div className="wa-tabsbar">
        <Tabs
          variant="underline"
          size="md"
          active="challenges"
          accent="#1A6DD5"
          onChange={() => {}}
          items={[
            { id: 'challenges', label: 'Challenges' },
            { id: 'friends', label: 'Friends' },
            { id: 'leaderboards', label: 'Leaderboards' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'badges', label: 'All Badges' },
            { id: 'log', label: 'Reading Log' },
          ]}
        />
      </div>
    </header>
  )
}

function StreakBanner({ streak, onDismiss, onLog }) {
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
      <IconButton variant="ghost" size="sm" onClick={onDismiss} aria-label="Dismiss">
        <Icon name="x" size={14} />
      </IconButton>
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

function Footer() {
  return (
    <>
      <div className="wa-footer-thin">
        <div className="wa-footer-thin-inner">
          <div className="wa-footer-links">
            <a href="#">FAQ</a>
            <a href="#">Contact Us</a>
            <a href="#">Share Code</a>
          </div>
          <button className="wa-footer-lang" type="button">
            <span className="wa-footer-lang-g">G</span>Select Language
          </button>
        </div>
      </div>
      <footer className="wa-footer">
        <div className="wa-footer-inner">
          <BeanstackLogo />
          <div className="wa-footer-copy">
            © 2024 Zoobean, Inc. <span>•</span> <a href="#">Terms</a> <span>•</span>{' '}
            <a href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export function Dashboard({ streak, dailyGoal, onLog }) {
  const [scope, setScope] = useState('current')
  const [streakOpen, setStreakOpen] = useState(true)

  return (
    <div className="wa-shell">
      <TopBar onLog={onLog} />
      <main className="wa-main">
        <div className="wa-main-inner">
          {streakOpen && (
            <StreakBanner streak={streak} onDismiss={() => setStreakOpen(false)} onLog={onLog} />
          )}
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
              <GoalCard dailyGoal={dailyGoal} />
              <LeaderboardCard />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
