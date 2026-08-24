import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Icon } from '@components/Icon/Icon'
import { READER } from '../data'

const noop = () => {}

function BeanstackLogo() {
  return (
    <span className="gr-logo">
      <img src="/bs-prototypes/bs.svg" alt="" className="gr-logo-mark" />
      <span className="gr-logo-word">beanstack</span>
    </span>
  )
}

// The reader's avatar + first name, as the app bar and the log flow both show it.
export function ReaderPill({ size = 'md' }) {
  return (
    <span className={`gr-reader-pill gr-reader-pill--${size}`}>
      <span className="gr-reader-avatar" style={{ background: READER.color }}>
        {READER.initials}
      </span>
      <span className="gr-reader-name">{READER.name}</span>
    </span>
  )
}

const TABS = [
  { id: 'challenges', label: 'Challenges' },
  { id: 'friends', label: 'Friends' },
  { id: 'leaderboards', label: 'Leaderboards' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'badges', label: 'All Badges' },
  { id: 'log', label: 'Reading Log' },
]

/**
 * Beanstack's reader app bar: the three logging actions on the left, the reader
 * on the right, site tabs underneath. Only "Log Reading" does anything here —
 * everything else is chrome, so the board stays the subject of the mock.
 */
export function ReaderTopBar({ onLogReading }) {
  return (
    <header className="gr-topbar">
      <div className="gr-topbar-inner">
        <BeanstackLogo />
        <div className="gr-topbar-actions">
          <Button
            variant="primary"
            size="sm"
            accent="#1A6DD5"
            icon={<Icon name="book" size={15} />}
            onClick={onLogReading}
          >
            Log Reading
          </Button>
          <Button variant="secondary" size="sm" icon={<Icon name="check" size={15} />}>
            Complete Activity
          </Button>
          <Button variant="secondary" size="sm" icon={<Icon name="writing" size={15} />}>
            Write Review
          </Button>
        </div>
        <div className="gr-topbar-user">
          <ReaderPill />
          <button className="gr-icon-btn" aria-label="Settings">
            <Icon name="settings" size={19} />
          </button>
        </div>
      </div>

      <div className="gr-tabsbar">
        <Tabs
          variant="underline"
          size="md"
          active="challenges"
          accent="#1A6DD5"
          onChange={noop}
          items={TABS}
          ariaLabel="Reader sections"
        />
      </div>
    </header>
  )
}

// Brand mark — stays inline SVG, like the other prototypes' partner logos.
function GoogleGIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function ReaderFooter() {
  return (
    <footer className="gr-footer">
      <div className="gr-footer-row">
        <nav className="gr-footer-links">
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact Us</a>
          <a href="#share">Share Code</a>
        </nav>
        <span className="gr-footer-lang">
          <GoogleGIcon />
          Select Language
        </span>
      </div>
      <div className="gr-footer-row gr-footer-row--legal">
        <BeanstackLogo />
        <span className="gr-footer-legal">
          © 2025 Zoobean, Inc. <a href="#terms">Terms</a> <a href="#privacy">Privacy</a>
        </span>
      </div>
    </footer>
  )
}
