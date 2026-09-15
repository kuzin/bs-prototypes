import { BeanstackLogo } from '@components/BeanstackLogo/BeanstackLogo'
import { ReaderTopBar as SharedTopBar } from '@components/ReaderApp/ReaderApp'
import { READER } from '../data'

const noop = () => {}

/**
 * The reader's avatar + first name, as the *log flow* shows it — the app's
 * `.logged-books--logging-for-reader`, not the top bar's reader dropdown. The
 * bar's own pill is `ReaderPill` in `@components/ReaderApp`.
 */
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

/**
 * Beanstack's reader app bar — the shared one. This prototype carried its own
 * copy (a shorter bar, a smaller pill, its own near-miss of the accent), which
 * is the drift the shared chrome exists to stop. Only "Log Reading" does
 * anything here; everything else is chrome, so the board stays the subject of
 * the mock, which is what `accountMenu={false}` and the empty `otherReaders`
 * are for.
 */
export function ReaderTopBar({ onLogReading }) {
  return (
    <SharedTopBar
      reader={READER}
      active="challenges"
      onTabChange={noop}
      onLog={onLogReading}
      onReview={noop}
      onActivity={noop}
      onAccount={noop}
      accountMenu={false}
    />
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
