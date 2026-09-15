import { Children, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { Flyout, FlyoutMenu, FlyoutMenuItem, FlyoutSelect } from '@components/Flyout/Flyout'
import { Tooltip } from '@components/Primitives/Primitives'
import { BeanstackLogo } from '@components/BeanstackLogo/BeanstackLogo'
import { BsIcon } from '@components/BsIcons/BsIcons'
// Re-exported so the pages that already reach for it here keep working.
export { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'

import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'
import '@components/ProgressBar/ProgressBar.css'
import '@components/Primitives/Primitives.css'
import '@components/Flyout/Flyout.css'
import '@components/BsIcons/BsIcons.css'
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
  // The app calls this "All Badges"; it holds achievements too, so the tab says
  // what it is. Every tab in this nav is the reader's own, so none of them says
  // "My" — it would be on all four or none.
  { id: 'badges', label: 'Collections' },
  // "Reading Log" in the app; it holds All Titles and (in web-app) Reviews
  // alongside the log itself, so the tab is named for the whole of it.
  { id: 'log', label: 'Reading' },
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
  onReview,
  onActivity,
  onHome,
  onAccount,
  onSignOut,
  onSwitchReader,
  onEditReader,
  /* What the gear opens. A library's gear is the *account creator's* settings —
     the sign-in that holds the profiles — where a school's is the one reader's
     own, because there is nothing above them. */
  accountLabel = 'Edit Account',
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
            <Button variant="primary" size="md" onClick={onLog}>
              Log Reading
            </Button>
          )}
          {!actions && secondaryActions && (
            <>
              <div className="wa-actions-wide">
                <Button variant="ghost" size="md" onClick={onActivity}>
                  Complete Activity
                </Button>
                <Button variant="ghost" size="md" onClick={onReview}>
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
                    <FlyoutMenu>
                      <FlyoutMenuItem
                        icon={<Icon name="check" size={16} />}
                        onClick={() => {
                          onActivity?.()
                          close()
                        }}
                      >
                        Complete Activity
                      </FlyoutMenuItem>
                      <FlyoutMenuItem
                        icon={<Icon name="writing" size={16} />}
                        onClick={() => {
                          onReview?.()
                          close()
                        }}
                      >
                        Write Review
                      </FlyoutMenuItem>
                    </FlyoutMenu>
                  )}
                </Flyout>
              </div>
            </>
          )}
        </div>

        <div className="wa-topbar-user">
          {beforeUser}
          <ReaderPill
            reader={reader}
            otherReaders={otherReaders}
            onSwitch={onSwitchReader}
            onEdit={onEditReader}
          />
          {accountMenu ? (
            <Flyout
              placement="bottom-end"
              trigger={({ toggle }) => (
                <button className="wa-icon-btn" onClick={toggle} aria-label="Account settings">
                  <BsIcon set="actions" name="settings" size={20} />
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
                    {accountLabel}
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
/**
 * The way back off a page the nav can't reach — a book, or one book list.
 *
 * `.back-button` in the app (`reading_lists/show.html.haml`, `books/show`): a
 * chevron and where it goes, sitting above the page's own header rather than
 * inside it. It says its destination rather than just "Back", because these
 * pages are reached from more than one place.
 *
 *   <ReaderBack onClick={close}>Back to Book Lists</ReaderBack>
 */
export function ReaderBack({ onClick, children = 'Back' }) {
  return (
    <button type="button" className="wa-back" onClick={onClick}>
      <Icon name="chevron-left" size={16} stroke={2.4} />
      {children}
    </button>
  )
}

/**
 * Who is reading, and — on a library site — which of the account's profiles.
 *
 * A library account is an adult who signed up, holding one or many profiles:
 * one for themselves, one for each child. The pill switches between them, and
 * **Edit** opens that profile's own settings, which are not the account's. A
 * school site has no account layer — a student is a profile and there is
 * nobody to switch to — so an empty `otherReaders` makes this a label.
 */
export function ReaderPill({ reader, otherReaders = [], onSwitch, onEdit }) {
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
            <button
              className="wa-readers-edit"
              onClick={() => {
                close()
                onEdit?.(reader)
              }}
            >
              Edit
            </button>
          </div>
          <div className="wa-readers-others">
            {otherReaders.map((r) => (
              <button
                key={r.id}
                className="wa-readers-row"
                onClick={() => {
                  close()
                  onSwitch?.(r)
                }}
              >
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
  const n = streak?.current ?? 0
  return (
    <ReaderBanner
      tone="red"
      mark={
        <span className="wa-streak-flame">
          <Icon name="flame-filled" size={22} />
          <span className="wa-streak-num">{n}</span>
        </span>
      }
      title={
        message ?? (
          <>
            {n > 0 ? (
              <>
                <strong>{n}-day streak!</strong> Keep it going — log again tomorrow.
              </>
            ) : (
              <>
                <strong>No current streak.</strong> Log reading every day to get your streak going!
              </>
            )}
          </>
        )
      }
      action={
        <ReaderBannerAction onClick={onLog}>
          {n > 0 ? 'Log Today' : 'View Streaks'}
        </ReaderBannerAction>
      }
    />
  )
}

// ─── Challenges ─────────────────────────────────────────────────────────────

/**
 * Where a challenge's banner lives. A Program's `header_image` is the art staff
 * upload when they build the challenge; these are Beanstack's own, out of
 * `Design/Projects/Challenges/<name>/Banner` at 920×351 (or 1840×702 at 2×) and
 * converted to 1200px webp.
 */
export const bannerSrc = (key) => (key ? `/bs-prototypes/challenge-banners/${key}.webp` : null)

/** One of that challenge's badges, from `Design/.../<name>/Badges`. */
export const badgeSrc = (set, name) =>
  set && name ? `/bs-prototypes/challenge-badges/${set}/${name}.webp` : null

/**
 * The drawn covers, keyed by a challenge's `art`. The fallback for a challenge
 * with no banner of its own — the app's is `no-challenge-image.png`, but a
 * designed gradient beats a grey placeholder in a prototype.
 */
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
 *
 * `onOpen` is optional — the card has always been a `<button>`, it just never
 * had anywhere to go. A prototype that has built the challenge page passes it;
 * without it the card stays inert, as before.
 */
/* ─── The reader app's notification bars ──────────────────────────────────
   The Challenges page opens with a stack of these — link an app, friend
   requests waiting, the community goal, your streak — and they had drifted
   into four different bars: three disc sizes, three radii, three hand-rolled
   action chips and three margins. One anatomy now: a mark on a white disc,
   what it says, what you can do about it, and a way to make it go away. */

const BANNER_TONES = {
  blue: { bg: '#e2f4fa', ink: '#0b6b78' },
  amber: { bg: '#ffedc8', ink: '#8a5a00' },
  green: { bg: '#e7f7ef', ink: '#087542' },
  red: { bg: '#ffe8de', ink: '#b3401a' },
}

/**
 * One bar in that stack.
 *
 * `mark` is whatever goes on the disc — a partner's logo, an emoji, a glyph, a
 * dial. `tint` overrides the tone's ground for the case where the colour isn't
 * ours to choose (a partner banner takes the partner's).
 *
 * <ReaderBanner tone="red" mark={<Icon name="flame-filled" />} title={…}
 *   action={<ReaderBannerAction>View Streaks</ReaderBannerAction>}
 *   onDismiss={fn} />
 */
export function ReaderBanner({
  tone = 'blue',
  tint,
  ink,
  mark,
  decoration,
  title,
  sub,
  action,
  onDismiss,
  children,
  className = '',
}) {
  const t = BANNER_TONES[tone] ?? BANNER_TONES.blue
  return (
    <div
      className={`wa-banner wa-banner--${tone} ${className}`.trim()}
      style={{ '--wab-bg': tint ?? t.bg, '--wab-ink': ink ?? t.ink }}
    >
      {decoration}
      {mark && <span className="wa-banner-mark">{mark}</span>}
      <div className="wa-banner-body">
        <span className="wa-banner-title">{title}</span>
        {sub && <span className="wa-banner-sub">{sub}</span>}
        {children}
      </div>
      {action && <span className="wa-banner-actions">{action}</span>}
      {onDismiss && (
        <button type="button" className="wa-banner-close" onClick={onDismiss} aria-label="Dismiss">
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  )
}

/**
 * The action every one of these bars carries. A real `Button` — it was a
 * hand-rolled chip, which meant its own hover, its own focus ring and its own
 * press state, none of which matched the buttons everywhere else. The banner
 * only supplies the ground it sits on and the ink it takes.
 */
export function ReaderBannerAction({ size = 'sm', className = '', children, ...rest }) {
  return (
    <Button
      variant="secondary"
      size={size}
      className={`wa-banner-chip ${className}`.trim()}
      {...rest}
    >
      {children}
    </Button>
  )
}

/**
 * The stack itself. A reader with a lot going on could land on five or six of
 * these before reaching the page, so it shows a couple and folds the rest away
 * — the count is the point, not the sixth bar.
 */
export function BannerStack({ children, max = 2, className = '' }) {
  const [open, setOpen] = useState(false)
  const items = Children.toArray(children).filter(Boolean)
  if (items.length === 0) return null

  const hidden = Math.max(0, items.length - max)
  const shown = open || hidden === 0 ? items : items.slice(0, max)

  return (
    <div className={`wa-bannerstack ${className}`.trim()}>
      {shown}
      {hidden > 0 && (
        <button type="button" className="wa-bannerstack-more" onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={15} stroke={2.2} />
          {open ? 'View less' : `View ${hidden} more`}
        </button>
      )}
    </div>
  )
}

/**
 * The community goal banner — `srp/_srp_statistics_header.html.haml`. The
 * whole site reading toward one number, with this reader's share of it: a
 * percentage dial, a line of encouragement, and the running total.
 *
 * The encouragement is the app's own, and it's the only part that changes:
 * nothing logged yet, on the way, or met.
 */
export function CommunityGoalBanner({ total, goal, unit = 'minutes', onDismiss }) {
  const pct = Math.min(Math.floor((total / goal) * 100), 100)
  const met = total >= goal
  const message = met
    ? 'Way to go - you helped us reach our community goal!'
    : pct === 0
      ? 'Every log counts! Log your reading to help us reach our community goal.'
      : "You're on your way to meeting your community goal!"

  return (
    <ReaderBanner
      tone="green"
      onDismiss={onDismiss}
      /* The app's own `.stats-goal-img` — Icons8 `goal--v1` in the Color set,
         the target with the dart in it. */
      mark={
        <img
          className="wa-cgoal-img"
          src={`${import.meta.env.BASE_URL}bs-icons/goal/goal.svg`}
          alt=""
        />
      }
      title={<strong>{message}</strong>}
      /* The meter sits where every other bar puts its action — the far right,
         so the stack keeps one shape whatever each bar is carrying. */
      /* The meter sits where every other bar puts its action — the far right,
         so the stack keeps one shape whatever each bar is carrying. The figures
         are on the bar's tooltip: the distance left is the thing you read at a
         glance, and the exact count is what you go looking for. */
      action={
        <Tooltip
          content={`${total.toLocaleString()} of ${goal.toLocaleString()} ${unit} — ${pct}%`}
        >
          <span className="wa-cgoal-meter">
            <ProgressBar value={total} max={goal} color="#087542" className="wa-cgoal-bar" />
          </span>
        </Tooltip>
      }
    />
  )
}

/**
 * The RMI nudge in the dashboard rail — `programs/_motivation_widget.html.erb`.
 * Three states off where the reader is with the survey: they haven't started
 * ("Let's Go"), they're part-way ("Continue"), or it's scored and waiting
 * ("View My Results"). Only the last one changes the copy — before there is a
 * result, the widget is selling the idea rather than reporting one.
 *
 * Rendered by the page only when RMI is on for the site; it has no empty state
 * of its own.
 */
export function MotivationCard({ state = 'available', onOpen }) {
  const done = state === 'scored'
  const label = done ? 'View My Results' : state === 'in_progress' ? 'Continue' : "Let's Go"
  return (
    <aside className="wa-card wa-motivation">
      <img
        className="wa-motivation-art"
        src={`${import.meta.env.BASE_URL}motivation-type.png`}
        alt=""
      />
      <div className="wa-motivation-body">
        <h4 className="wa-motivation-title">
          {done ? 'Your motivation profile is ready!' : "What's your motivation type?"}
        </h4>
        <p className="wa-motivation-sub">
          {done ? 'See what drives your reading.' : 'Find out what keeps you reading.'}
        </p>
      </div>
      <Button onClick={onOpen} className="wa-motivation-btn">
        {label}
      </Button>
    </aside>
  )
}

/**
 * The chips the card wears, in the app's own order
 * (`programs/_programs_list_item.html.haml`): Upcoming first, then the format,
 * then what you log, then the extras. How many log types are listed depends on
 * what else is on the card — the row has to fit.
 */
export function challengeTypes(challenge) {
  const has = (t) => (challenge.types ?? []).includes(t)
  const activities = has('activities')
  const reviews = has('reviews')
  const logTake = reviews && activities ? 2 : reviews || activities ? 3 : 4

  return [
    challenge.upcoming && 'Upcoming',
    has('book_list') && 'Reading List',
    has('bingo') && 'Bingo',
    challenge.bookTalks && 'Book Talks',
    ...(challenge.logTypes ?? []).slice(0, logTake).map((t) => LOG_TYPE_LABELS[t] ?? t),
    activities && 'Activities',
    reviews && 'Reviews',
  ].filter(Boolean)
}

const LOG_TYPE_LABELS = { minutes: 'Minutes', books: 'Books', pages: 'Pages' }

// `$pastelGreen` / `$darkGreen` — the app's authored pair for these chips.
const CHALLENGE_TYPE_COLOR = '#087542'

/**
 * A challenge in the reader's list — `programs/_programs_list_item.html.haml`.
 *
 * The card's artwork, its name and its dates, with the type chips straddling
 * the seam between the two: what format the challenge is (Reading List, Bingo,
 * Book Talks) and what you log for it (Minutes, Books, Pages), plus Activities
 * and Reviews where it takes them, and Upcoming before it opens. The app shows
 * only the first two and cuts the rest — the row can't wrap without covering
 * the art — so the order above is doing real work.
 *
 * A challenge you joined from a connected site names that site under the dates,
 * and one you're allowed to leave carries a kebab with "Un-enroll" — given both
 * `canSelfUnenroll` and an `onUnenroll` to call.
 *
 * `onOpen` is optional — the card has always been clickable, it just never had
 * anywhere to go. A prototype that has built the challenge page passes it.
 */
export function ChallengeCard({ challenge, accent = READER_ACCENT, onOpen, onUnenroll }) {
  const banner = bannerSrc(challenge.banner)
  const art = CHALLENGE_ART[challenge.art] ?? CHALLENGE_ART.spring
  // `badge` was the single measure pill this card used to carry; a challenge
  // that still only has one keeps showing it.
  const types = challengeTypes(challenge)
  const chips = types.length > 0 ? types : challenge.badge ? [challenge.badge] : []

  return (
    <div className={`wa-chcard${onOpen ? ' wa-chcard--open' : ''}`}>
      {/* The whole card is the link; the kebab has to sit outside it rather
          than inside, so the hit target is its own element — the same shape
          the friend card uses. */}
      {onOpen && (
        <button
          type="button"
          className="wa-chcard-hit"
          onClick={() => onOpen(challenge)}
          aria-label={`View this challenge: ${challenge.title}`}
        />
      )}

      {/* The real banner where the challenge has one — `img.challenge-image` in
          the app's own card — and the drawn cover where it doesn't. */}
      {banner ? (
        <div className="wa-chcard-hero">
          <img src={banner} alt="" className="wa-chcard-img" />
        </div>
      ) : (
        <div className="wa-chcard-hero" style={{ background: art.bg }}>
          <span className="wa-chcard-arttitle" style={{ color: art.titleColor }}>
            {art.title}
          </span>
        </div>
      )}

      <div className="wa-chcard-body">
        {chips.length > 0 && (
          <div className="wa-chcard-types">
            {chips.map((label) => (
              <Pill
                key={label}
                color={types.length > 0 ? CHALLENGE_TYPE_COLOR : accent}
                variant={types.length > 0 ? 'soft' : 'filled'}
                size="sm"
                className="wa-chcard-type"
              >
                {label}
              </Pill>
            ))}
          </div>
        )}

        <div className="wa-chcard-info">
          <div className="wa-chcard-title">{challenge.title}</div>
          <div className="wa-chcard-dates">{challenge.dates}</div>
          {challenge.connectedSite && (
            <div className="wa-chcard-site">{challenge.connectedSite}</div>
          )}
        </div>

        {/* The data says the reader MAY leave; the handler says this surface can
            act on it. A friend's profile shows their challenges read-only, so
            it passes neither and gets no kebab. */}
        {challenge.canSelfUnenroll && onUnenroll && (
          <span className="wa-chcard-menuslot">
            <Flyout
              placement="bottom-end"
              trigger={({ toggle, open }) => (
                <button
                  type="button"
                  className="wa-chcard-kebab"
                  onClick={toggle}
                  aria-haspopup="menu"
                  aria-expanded={open}
                  aria-label={`View challenge options for ${challenge.title}`}
                >
                  <Icon name="dots-vertical" size={18} />
                </button>
              )}
            >
              {({ close }) => (
                <FlyoutMenu>
                  <FlyoutMenuItem
                    onClick={() => {
                      onUnenroll?.(challenge)
                      close()
                    }}
                  >
                    Un-enroll
                  </FlyoutMenuItem>
                </FlyoutMenu>
              )}
            </Flyout>
          </span>
        )}
      </div>
    </div>
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
// `READING_GOAL_BANNER_COPY` in the app's own `reading_goal_helper.rb`, with the
// state rule beside it: completed once you're at the goal, "keep going" from
// halfway, "reach your goal" below that.
const GOAL_COPY = {
  reach_goal: {
    header: 'Reach Your Goal!',
    subheader: 'Log your reading to meet your daily goal.',
  },
  keep_going: {
    header: 'Keep going!',
    subheader: 'Your daily reading goal is within reach!',
  },
  completed: {
    header: 'Well done!',
    subheader: 'You reached your reading goal today.',
  },
}

/**
 * The curve that joins the track to the star — `.reading-goal-banner__curve`,
 * a 12px waist between the two. It takes the track's colour, or the fill's once
 * the goal is met, so the bar and the star read as one piece. Drawn artwork,
 * so it stays inline SVG.
 */
function GoalCurve() {
  return (
    <span className="wa-goalcard-curve" aria-hidden="true">
      <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12V0C12 0 8.5 3 6 3C3.5 3 0 0 0 0V12C0 12 3.5 9 6 9C8.5 9 12 12 12 12Z" />
      </svg>
    </span>
  )
}

/** The app's `icons/24/rounded-star.svg`, at the end of the bar. */
function GoalStar() {
  return (
    <span className="wa-goalcard-marker" aria-hidden="true">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.35646 1.71898C10.4277 -0.572995 13.5723 -0.572995 14.6435 1.71898L16.044 4.71538C16.4722 5.63172 17.3126 6.26573 18.2843 6.4055L21.4615 6.86253C23.8918 7.21213 24.8636 10.3176 23.0953 12.0837L20.7836 14.3926C20.0766 15.0987 19.7556 16.1246 19.9279 17.1273L20.4911 20.4061C20.9219 22.9142 18.3778 24.8335 16.2137 23.633L13.3846 22.0636C12.5194 21.5837 11.4806 21.5837 10.6154 22.0636L7.78626 23.633C5.6222 24.8335 3.07811 22.9142 3.50892 20.4061L4.07212 17.1273C4.24436 16.1246 3.92336 15.0987 3.2164 14.3926L0.904679 12.0837C-0.863584 10.3176 0.108172 7.21213 2.53848 6.86253L5.71571 6.4055C6.68736 6.26573 7.52776 5.63172 7.95603 4.71538L9.35646 1.71898Z" />
      </svg>
    </span>
  )
}

/**
 * The reader's daily reading goal — the app's `reading_goal_banner`, which is a
 * headline and a line of encouragement over the count and a chunky amber bar
 * that ends in a star. The star is the goal: grey while you're short of it,
 * amber with a white star once you're there, and the curve between bar and star
 * takes whichever colour, so the whole thing fills in as one piece.
 *
 * `ProgressBar` draws the track and the fill; the curve and the star are this
 * card's own, because no other bar in the system ends in anything.
 */
export function GoalCard({ dailyGoal }) {
  const { minutes, goal } = dailyGoal
  const done = minutes >= goal
  // The app floors the percentage and caps it at 100 — a goal you have overshot
  // shows a full bar, not an overrun one.
  const pct = Math.min(Math.floor((minutes / goal) * 100), 100)
  const copy = GOAL_COPY[done ? 'completed' : pct >= 50 ? 'keep_going' : 'reach_goal']
  const unit = goal === 1 ? 'minute' : 'minutes'

  return (
    <aside
      className={`wa-card wa-goalcard${done ? ' wa-goalcard--done' : ''}`}
      aria-label="Daily reading goal progress"
    >
      <div className="wa-goalcard-head">
        <h4 className="wa-goalcard-title">{copy.header}</h4>
        <p className="wa-goalcard-sub">{copy.subheader}</p>
      </div>

      <div className="wa-goalcard-meter" aria-label={`${minutes} of ${goal} ${unit}`}>
        <span className="wa-goalcard-count">
          <span className="wa-goalcard-num">{minutes}</span> / {goal} {unit}
        </span>
        <div className="wa-goalcard-bar">
          <ProgressBar value={minutes} max={goal} color="#FFBC42" className="wa-goalcard-pgb" />
          <GoalCurve />
          <GoalStar />
        </div>
      </div>
    </aside>
  )
}

// `LeaderboardPresenter#short_date_ranges` and `determine_leaderboard_units` —
// the app's own two lists. Which units a microsite offers is a setting, so a
// caller can pass fewer.
export const LEADERBOARD_RANGES = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
]
export const LEADERBOARD_UNITS = [
  { id: 'minutes', label: 'By Minutes' },
  { id: 'books', label: 'By Books' },
]

/**
 * One of the widget's two pickers. The app's menu lists only the options you
 * are NOT on — the trigger already says which one that is — so a two-option
 * picker reads as a toggle wearing a dropdown.
 */
function LeadPicker({ options, value, onChange, placement }) {
  const current = options.find((o) => o.id === value) ?? options[0]
  // A microsite with one unit shows it as a label, not a control.
  if (options.length < 2) {
    return <span className="wa-leadcard-meta-label">{current.label}</span>
  }
  return (
    <Flyout
      placement={placement}
      trigger={({ toggle, open }) => (
        <button
          className="wa-leadcard-meta-btn"
          type="button"
          onClick={toggle}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {current.label} <Icon name="chevron-down" size={16} />
        </button>
      )}
    >
      {({ close }) => (
        <FlyoutSelect options={options} value={current.id} onChange={onChange} close={close} />
      )}
    </Flyout>
  )
}

/**
 * The reader dashboard's leaderboard, shaped like the shipped widget
 * (bs-product app/views/programs/_leaderboard_widget.html.haml): folder tabs on
 * top of a bordered panel, the two range pickers on a grey band across the
 * panel's head, then the rows, then "View all" behind a rule of its own.
 *
 * Both pickers are live. A row can carry a figure per range and unit
 * (`stats: { week: { minutes, books } }`); one that only has a single `value`
 * keeps showing it, so the older fixtures still render.
 */
export function LeaderboardCard({
  schools = [],
  grades = [],
  ranges = LEADERBOARD_RANGES,
  units = LEADERBOARD_UNITS,
}) {
  const [tab, setTab] = useState('schools')
  const [range, setRange] = useState(ranges[0].id)
  const [unit, setUnit] = useState(units[0].id)
  const rows = tab === 'schools' ? schools : grades
  const figure = (row) => row.stats?.[range]?.[unit] ?? row.value

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
          <LeadPicker options={ranges} value={range} onChange={setRange} placement="bottom-start" />
          <LeadPicker options={units} value={unit} onChange={setUnit} placement="bottom-end" />
        </div>
        <ul className="wa-leadcard-list">
          {rows.map((row) => (
            <li key={row.rank} className="wa-leadcard-row">
              <span className="wa-leadcard-rank" style={{ background: row.color }}>
                {row.rank}
              </span>
              <span className="wa-leadcard-name">{row.name}</span>
              <span className="wa-leadcard-val">{figure(row)}</span>
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

/**
 * The fundraiser bar — `fundraisers/_fundraiser_main_banner.html.haml`. A site
 * running a read-a-thon says so on every page, and says how it's going: the
 * pitch and a Learn More on the left, the money on the right.
 *
 * The app's own two shapes: with a goal it reads "$3,180 of $5,000 Raised" over
 * a bar, and without one just "$3,180 total raised" — a bar with nothing to
 * fill to is a bar that can only ever look wrong.
 */
export function FundraiserBanner({ raised, goal, onLearnMore, onDismiss }) {
  const money = (n) => `$${n.toLocaleString()}`
  return (
    <ReaderBanner
      tone="green"
      onDismiss={onDismiss}
      mark={<Icon name="coin" size={20} />}
      title={
        <>
          <strong>We&apos;re running a reading fundraiser!</strong> Support us by donating.
        </>
      }
      action={
        <span className="wa-fund">
          <span className="wa-fund-nums">
            {goal ? (
              <>
                <strong>{money(raised)}</strong> of {money(goal)} Raised
              </>
            ) : (
              <>
                <strong>{money(raised)}</strong> total raised
              </>
            )}
          </span>
          {goal ? <ProgressBar value={raised} max={goal} color="#087542" /> : null}
          <ReaderBannerAction onClick={onLearnMore}>Learn More</ReaderBannerAction>
        </span>
      }
    />
  )
}
