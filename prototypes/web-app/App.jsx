import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { IconButton } from '@components/Primitives/Primitives'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'

import '../ris/index.css'
import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'
import '@components/ProgressBar/ProgressBar.css'
import '@components/Primitives/Primitives.css'
import '@components/PrototypeNav/PrototypeNav.css'

import { USER, STREAK, DAILY_GOAL, CHALLENGES, TOP_SCHOOLS, TOP_GRADES } from './data'
import './index.css'

// ─── Iconography ────────────────────────────────────────────────────────────

const IconBook = () => <Icon name="book" size={16} aria-hidden />
const IconCheck = () => <Icon name="check" size={15} aria-hidden />
const IconPencil = () => <Icon name="writing" size={15} aria-hidden />
const IconGear = () => <Icon name="settings" size={20} aria-hidden />
const IconFlame = () => <Icon name="flame-filled" size={18} aria-hidden />
const IconClose = () => <Icon name="x" size={14} aria-hidden />
const IconCaret = () => <Icon name="chevron-down" size={11} aria-hidden />

function BeanstackLogo() {
  return (
    <div className="wa-logo">
      <img src="/bs-prototypes/bs.svg" alt="" className="wa-logo-mark" />
      <span className="wa-logo-word">beanstack</span>
    </div>
  )
}

// ─── Top app bar ────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <header className="wa-topbar">
      <div className="wa-topbar-inner">
        <BeanstackLogo />
        <div className="wa-topbar-actions">
          <Button variant="primary" size="sm" icon={<IconBook />}>
            Log Reading
          </Button>
          <Button variant="ghost" size="sm" icon={<IconCheck />}>
            Complete Activity
          </Button>
          <Button variant="ghost" size="sm" icon={<IconPencil />}>
            Write Review
          </Button>
        </div>
        <div className="wa-topbar-user">
          <div className="wa-user-pill">
            <span className="wa-user-avatar">{USER.initials}</span>
            <span className="wa-user-name">{USER.firstName}</span>
          </div>
          <button className="wa-icon-btn" aria-label="Settings">
            <IconGear />
          </button>
        </div>
      </div>

      <div className="wa-tabsbar">
        <Tabs
          variant="underline"
          size="md"
          active="challenges"
          accent="#0DA7BC"
          onChange={() => {
            /* prototype */
          }}
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

// ─── Streak banner ──────────────────────────────────────────────────────────

function StreakBanner({ onDismiss }) {
  return (
    <div className="wa-streak">
      <div className="wa-streak-flame">
        <IconFlame />
        <span className="wa-streak-num">{STREAK.current}</span>
      </div>
      <div className="wa-streak-msg">
        <strong>No current streak.</strong> Log reading every day to get your streak going!
      </div>
      <Button variant="secondary" size="sm">
        View Streaks
      </Button>
      <IconButton variant="ghost" size="sm" onClick={onDismiss} aria-label="Dismiss">
        <IconClose />
      </IconButton>
    </div>
  )
}

// ─── Challenge card ─────────────────────────────────────────────────────────

const ILLUSTRATIONS = {
  spring: {
    bg: 'linear-gradient(180deg, #BFE3FA 0%, #B6F0C9 100%)',
    emoji: '🚲',
    title: 'SPRING\nINTO\nREADING',
    titleColor: '#23806C',
  },
  'love-hurts': {
    bg: 'linear-gradient(180deg, #8B4424 0%, #5D2A14 100%)',
    emoji: '💔',
    title: 'LOVE\nHURTS',
    titleColor: '#FAD5BC',
  },
  arresting: {
    bg: 'linear-gradient(180deg, #FFE8A8 0%, #C8E6B8 100%)',
    emoji: '🔍',
    title: 'ARRESTING\nSTRANGENESS',
    titleColor: '#3D2A18',
  },
}

function ChallengeCard({ challenge }) {
  const art = ILLUSTRATIONS[challenge.illustration] ?? ILLUSTRATIONS.spring
  return (
    <button className="wa-chcard" type="button">
      <div className="wa-chcard-hero" style={{ background: art.bg }}>
        <span className="wa-chcard-emoji" aria-hidden>
          {art.emoji}
        </span>
        <span className="wa-chcard-arttitle" style={{ color: art.titleColor }}>
          {art.title}
        </span>
        <span className="wa-chcard-pill">
          <Pill color="#0DA7BC" variant="filled" size="sm">
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

function AddChallengeCard() {
  return (
    <button className="wa-chcard wa-chcard--add" type="button">
      <div className="wa-chcard-add-inner">
        <span className="wa-chcard-add-plus" aria-hidden>
          +
        </span>
        <span className="wa-chcard-add-label">Find a Challenge</span>
      </div>
    </button>
  )
}

// ─── Sidebar widgets ────────────────────────────────────────────────────────

function GoalCard() {
  const { minutes, goal } = DAILY_GOAL
  const met = minutes >= goal
  return (
    <aside className="wa-card wa-goalcard">
      <div className="wa-goalcard-head">
        <div className="wa-goalcard-title">Well done!</div>
        <div className="wa-goalcard-sub">You've reached your reading goal for the day.</div>
      </div>
      <div className="wa-goalcard-meter">
        <div className="wa-goalcard-amount">
          <span className="wa-goalcard-num">{minutes}</span>
          <span className="wa-goalcard-denom"> / {goal} minutes</span>
        </div>
        <ProgressBar value={minutes} max={goal} color={met ? '#10B981' : '#0DA7BC'} size="lg" />
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
          accent="#0DA7BC"
          items={[
            { id: 'schools', label: 'Top Schools' },
            { id: 'grades', label: 'Top Grades' },
          ]}
        />
      </div>

      <div className="wa-leadcard-meta">
        <button className="wa-leadcard-meta-btn" type="button">
          This Week <IconCaret />
        </button>
        <button className="wa-leadcard-meta-btn" type="button">
          By Minutes <IconCaret />
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

// ─── Footer ─────────────────────────────────────────────────────────────────

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
            <span className="wa-footer-lang-g">G</span>
            Select Language
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

// ─── Page ───────────────────────────────────────────────────────────────────

export function App() {
  const [scope, setScope] = useState('current')
  const [streakOpen, setStreakOpen] = useState(true)

  return (
    <div className="wa-shell">
      <TopBar />

      <main className="wa-main">
        <div className="wa-main-inner">
          {streakOpen && <StreakBanner onDismiss={() => setStreakOpen(false)} />}

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
                <div className="wa-group-title">{USER.firstName}'s Challenges</div>
                <div className="wa-group-sub">
                  Challenges that {USER.firstName} is participating in.
                </div>

                <div className="wa-chgrid">
                  {CHALLENGES.map((c) => (
                    <ChallengeCard key={c.id} challenge={c} />
                  ))}
                  <AddChallengeCard />
                </div>
              </div>
            </section>

            <div className="wa-rail">
              <GoalCard />
              <LeaderboardCard />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <PrototypeNav currentHref="/bs-prototypes/web-app/" />
    </div>
  )
}
