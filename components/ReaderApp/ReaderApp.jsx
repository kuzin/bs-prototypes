import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { Flyout } from '@components/Flyout/Flyout'
import { BeanstackLogo } from '@components/BeanstackLogo/BeanstackLogo'

import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'
import '@components/ProgressBar/ProgressBar.css'
import '@components/Flyout/Flyout.css'
// Last, so the bar's adjustments to the primitives above land after them.
import './ReaderApp.css'

/**
 * The reader-facing Beanstack — the page a student or library patron lands on.
 *
 * Four prototypes render this chrome (web-app, logging-flow and Words with
 * Benny through it, beeverso, book-talks) and each used to hand-roll its own
 * copy of the markup against one shared stylesheet. The copies drifted: the
 * stylesheet moved to the production blue and the shipped leaderboard anatomy
 * while web-app's markup stayed on teal with the old card, which left its
 * leaderboard rendering with no panel at all. Everything below is the current
 * version, in one place, so that can't happen again.
 */

// The reader app's accent. The dashboard is blue, not the teal the admin
// surfaces use — see bs-product's microsite theme. A token rather than the
// #1A6DD5 the four copies each carried, which was a near-miss of --c-blue.
export const READER_ACCENT = 'var(--c-blue)'

// ─── Top bar ────────────────────────────────────────────────────────────────

// The site nav, in the order the app spells it.
export const READER_TABS = [
  { id: 'challenges', label: 'Challenges' },
  { id: 'friends', label: 'Friends' },
  { id: 'leaderboards', label: 'Leaderboards' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'badges', label: 'All Badges' },
  { id: 'log', label: 'Reading Log' },
]

/**
 * Beanstack's reader app bar: logo, the three logging actions, the reader pill
 * and account gear, with the site tabs underneath.
 *
 * Everything optional defaults to the full-strength version. A prototype that
 * wants less opts down rather than rebuilding the bar:
 *
 *   `onHome`       omitted → the logo is static rather than a home button
 *   `otherReaders` empty   → the reader pill is a label, not a switcher
 *   `accountMenu={false}`  → the gear runs `onAccount` instead of opening a menu
 *   `secondaryActions={false}` → only "Log Reading"
 *   `actions`      replaces the action row outright, for a page whose buttons
 *                  are its own (book-talks logs reading *and* activities)
 *   `beforeUser`   a slot ahead of the pill (the partner app switcher goes here)
 *   `tabs`         replaces the default site nav outright
 *   `extraTabs` / `hideTabs` → add to or subtract from it instead
 */
export function ReaderTopBar({
  reader,
  otherReaders = [],
  onLog,
  onHome,
  onAccount,
  onSignOut,
  accountMenu = true,
  secondaryActions = true,
  actions,
  beforeUser = null,
  tabs = READER_TABS,
  extraTabs = [],
  hideTabs = [],
  active,
  onTabChange,
  accent = READER_ACCENT,
}) {
  const items = [...tabs, ...extraTabs].filter((t) => !hideTabs.includes(t.id))

  return (
    <header className="wa-topbar">
      <div className="wa-topbar-inner">
        {onHome ? (
          <button className="wa-logo-btn" onClick={onHome} aria-label="Beanstack home">
            <BeanstackLogo />
          </button>
        ) : (
          <BeanstackLogo />
        )}

        <div className="wa-topbar-actions">
          {actions ?? (
            <Button
              variant="primary"
              size="md"
              icon={<Icon name="book" size={16} />}
              onClick={onLog}
            >
              Log Reading
            </Button>
          )}
          {!actions && secondaryActions && (
            <>
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
            </>
          )}
        </div>

        <div className="wa-topbar-user">
          {beforeUser}
          <ReaderPill reader={reader} otherReaders={otherReaders} />
          {accountMenu ? (
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
                      onAccount?.()
                    }}
                  >
                    Edit Account
                  </button>
                  <button
                    className="wa-acct-item"
                    onClick={() => {
                      close()
                      onSignOut?.()
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </Flyout>
          ) : (
            <button className="wa-icon-btn" aria-label="Account settings" onClick={onAccount}>
              <Icon name="settings" size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="wa-tabsbar">
        <Tabs
          variant="underline"
          size="md"
          active={active}
          accent={accent}
          onChange={onTabChange}
          items={items}
        />
      </div>
    </header>
  )
}

/**
 * The reader's avatar + name in the top bar. With `otherReaders` it opens the
 * switcher every household account has; without, it is just a label — a
 * one-reader prototype shouldn't offer a menu that can't go anywhere.
 */
export function ReaderPill({ reader, otherReaders = [] }) {
  if (!otherReaders.length) {
    return (
      <span className="wa-user-pill">
        <span className="wa-user-avatar">{reader.initials}</span>
        <span className="wa-user-name">{reader.name}</span>
      </span>
    )
  }
  return (
    <Flyout
      placement="bottom-end"
      trigger={({ toggle }) => (
        <button className="wa-user-pill" onClick={toggle} aria-label="Switch reader">
          <span className="wa-user-avatar">{reader.initials}</span>
          <span className="wa-user-name">{reader.name}</span>
        </button>
      )}
    >
      {({ close }) => (
        <div className="wa-readers">
          <div className="wa-readers-me">
            <span className="wa-user-avatar wa-user-avatar--lg">{reader.initials}</span>
            <span className="wa-readers-name">{reader.name}</span>
            <button className="wa-readers-edit" onClick={close}>
              Edit
            </button>
          </div>
          <div className="wa-readers-others">
            {otherReaders.map((r) => (
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
  )
}

// ─── Streak banner ──────────────────────────────────────────────────────────

/**
 * The reading-streak banner across the top of the dashboard. Pass `message` to
 * replace the copy when a prototype has something more specific to say about
 * where the streak is coming from.
 *
 * `accent`, not `danger`: the banner wants its own red, but nothing here is
 * destructive and a red button that means "delete" everywhere else shouldn't
 * also mean "view my streaks". The accent variant takes the colour and leaves
 * the semantics alone.
 */
export function StreakBanner({ streak, onLog, message }) {
  const has = streak.current > 0
  return (
    <div className="wa-streak">
      <div className="wa-streak-flame">
        <Icon name="flame-filled" size={18} />
        <span className="wa-streak-num">{streak.current}</span>
      </div>
      <div className="wa-streak-msg">
        {message ??
          (has ? (
            <>
              <strong>{streak.current}-day streak!</strong> Keep it going — log again tomorrow.
            </>
          ) : (
            <>
              <strong>No current streak.</strong> Log reading every day to get your streak going!
            </>
          ))}
      </div>
      <Button variant="accent" accent="var(--c-red)" size="sm" onClick={onLog}>
        {has ? 'Log Today' : 'View Streaks'}
      </Button>
    </div>
  )
}

// ─── Challenges ─────────────────────────────────────────────────────────────

/** The illustrated challenge covers, keyed by a challenge's `art`. */
export const CHALLENGE_ART = {
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
  lectores: {
    bg: 'linear-gradient(180deg, #7B3FA8 0%, #4A1D6B 100%)',
    title: 'LECTORES\nDEL\nMUNDO',
    titleColor: '#F6D9A8',
  },
  'minutes-march': {
    bg: 'linear-gradient(180deg, #6FE0D6 0%, #0C7E8E 100%)',
    title: 'MARCH\nMINUTE\nMADNESS',
    titleColor: '#052F38',
  },
}

/**
 * One challenge in the reader's challenge grid — cover art over the name, the
 * dates, and what the challenge measures.
 *
 * What it measures sits beside the name rather than floated over the artwork:
 * the art is the challenge's identity, and the pill was covering whatever part
 * of it landed in that corner.
 */
export function ChallengeCard({ challenge, accent = READER_ACCENT }) {
  const art = CHALLENGE_ART[challenge.art] ?? CHALLENGE_ART.spring
  return (
    <button className="wa-chcard" type="button">
      <div className="wa-chcard-hero" style={{ background: art.bg }}>
        <span className="wa-chcard-arttitle" style={{ color: art.titleColor }}>
          {art.title}
        </span>
      </div>
      <div className="wa-chcard-body">
        <div className="wa-chcard-titlerow">
          <div className="wa-chcard-title">{challenge.title}</div>
          {challenge.badge && (
            <Pill color={accent} variant="filled" size="sm">
              {challenge.badge}
            </Pill>
          )}
        </div>
        <div className="wa-chcard-dates">{challenge.dates}</div>
      </div>
    </button>
  )
}

const SCOPES = [
  { id: 'current', label: 'Current' },
  { id: 'past', label: 'Past' },
  { id: 'ignored', label: 'Ignored' },
]

/**
 * Current / Past / Ignored, beside the "Challenges" heading.
 *
 * A segmented control is `Tabs variant="pill"` in this system — this was a
 * hand-rolled one, on its own pink active state that matched nothing else on
 * the page.
 */
export function ChallengeScope({ value, onChange, scopes = SCOPES }) {
  return (
    <Tabs
      variant="pill"
      size="sm"
      active={value}
      onChange={onChange}
      accent={READER_ACCENT}
      ariaLabel="Which challenges"
      items={scopes}
    />
  )
}

// ─── Rail cards ─────────────────────────────────────────────────────────────

/** Today's reading against the reader's daily goal. */
export function GoalCard({ dailyGoal }) {
  const { minutes, goal } = dailyGoal
  const met = minutes >= goal
  const left = goal - minutes
  return (
    <aside className="wa-card wa-goalcard">
      <div className="wa-goalcard-head">
        <div className="wa-goalcard-title">
          {met ? 'Well done!' : minutes > 0 ? 'Almost there!' : "Today's Goal"}
        </div>
        <div className="wa-goalcard-sub">
          {met
            ? "You've reached your reading goal for the day."
            : `Read ${left} more minute${left === 1 ? '' : 's'} to hit your daily goal.`}
        </div>
      </div>
      <div className="wa-goalcard-meter">
        <div className="wa-goalcard-amount">
          <span className="wa-goalcard-num" style={{ color: met ? '#10B981' : READER_ACCENT }}>
            {minutes}
          </span>
          <span className="wa-goalcard-denom"> / {goal} minutes</span>
        </div>
        <ProgressBar value={minutes} max={goal} color={met ? '#10B981' : READER_ACCENT} size="lg" />
      </div>
    </aside>
  )
}

/**
 * The reader dashboard's leaderboard, shaped like the shipped widget
 * (bs-product app/views/programs/_leaderboard_widget.html.haml): folder tabs on
 * top of a bordered panel, the two range pickers on a grey band across the
 * panel's head, then the rows, then "View all" behind a rule of its own. It
 * used to be a plain white card with an underlined tab bar inside it — the same
 * parts, but none of the app's anatomy.
 */
export function LeaderboardCard({ schools = [], grades = [] }) {
  const [tab, setTab] = useState('schools')
  const rows = tab === 'schools' ? schools : grades
  return (
    <aside className="wa-leadcard">
      <Tabs
        variant="folder"
        size="sm"
        block
        active={tab}
        onChange={setTab}
        ariaLabel="Which leaderboard"
        className="wa-leadcard-tabs"
        items={[
          { id: 'schools', label: 'Top Schools' },
          { id: 'grades', label: 'Top Grades' },
        ]}
      />
      <div className="wa-leadcard-body">
        <div className="wa-leadcard-meta">
          <button className="wa-leadcard-meta-btn" type="button">
            This Week <Icon name="chevron-down" size={16} />
          </button>
          <button className="wa-leadcard-meta-btn" type="button">
            By Minutes <Icon name="chevron-down" size={16} />
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
        <div className="wa-leadcard-foot">
          <a href="#" className="wa-leadcard-more">
            View All {tab === 'schools' ? 'Schools' : 'Grades'}
          </a>
        </div>
      </div>
    </aside>
  )
}
