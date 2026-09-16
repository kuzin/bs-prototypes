import { useEffect, useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { PreviewBar } from '@components/PreviewBar/PreviewBar'
import { badgeSrc } from '@components/ReaderApp/ReaderApp'
import { BadgeModal } from '@components/BadgeModal/BadgeModal'
import { ConnectFlow, PartnerCatalog } from '@components/PartnerConnect/PartnerConnect'

import { Dashboard } from '../logging-flow/components/Dashboard'
import { LogFlow } from '@components/LogFlow/LogFlow'
import { BookCover } from '@components/BookCover/BookCover'
import { AllBadges } from './components/AllBadges'
import { Friends } from './components/Friends'
import { Reviews } from './components/Reviews'
import { PeerReviews } from './components/PeerReviews'
import { WishList } from './components/WishList'
import { BookLists, BookListPage } from './components/BookLists'
import { FindBooks } from './components/FindBooks'
import { BookPage } from './components/BookPage'
import { ChallengePage } from './components/ChallengePage'
import { FundraiserPage, FundraiserWelcome } from './components/FundraiserPage'
import {
  FRIEND_REQUESTS,
  WISH_LIST,
  BOOK_LISTS,
  catalogBook,
  ACCOUNT,
  ACTIVITY_BADGES,
  LIBRARY_BRANCHES,
  STUDENT,
  INTERESTS,
  PREFERENCE_GENRES,
  BACKGROUND_GROUPS,
  READING_LEVELS,
  PREFERENCE_LANGUAGES,
  BOOK_LIST_GRADES,
  DOORWAYS,
  PREFERENCE_LIMITS,
  READER_PREFERENCES,
  SHARED_ACCESS,
  SHARED_INVITES,
  FUNDRAISER,
} from './data'
import {
  STREAK,
  DAILY_GOAL,
  READER,
  BOOKS,
  LOG_FIXTURES,
  RECENTLY_LOGGED,
  READING_LOG,
  REGISTRATION_QUESTIONS,
  CHALLENGE_BY_ID,
} from '../logging-flow/data'
import { CONNECTIONS, TAKEN_USERNAMES, partnerMinutes } from '../logging-flow/connections'

import '../logging-flow/index.css'
import '@components/PrototypeNav/PrototypeNav.css'
import '@components/PreviewBar/PreviewBar.css'

// The reader app as it stands today — the page a reader actually sees, so the
// other prototypes have something current to be measured against.
//
// It is the real `Dashboard`, not a copy: Challenges, the Reading Log and
// Personalize Reader (where App Integrations live) all come from logging-flow's
// own component, and reading apps link through the same ConnectFlow. Logging is
// the real `LogFlow`.
//
// What is deliberately *not* here is anything still in design. Each of these is
// a prototype of its own, and putting it on this page would blur what has
// shipped with what has been proposed:
//
//  * **The vocabulary round.** `LogFlow` offers it when handed `onOpenWord`,
//    which is Words with Benny's hook; without that prop the success step is a
//    plain "Done" — the logging flow on its own.
//  * **Discover / My Shelf** (Book Discovery) and **the Gameboard** (Gameboard
//    Reader) stay in their own prototypes.
//  * **Scholastic.** The partner list and its titles are filtered out.

/* The reading apps this page offers, and the titles that go with them: Comics
   Plus and Beeverso. Scholastic is the one that stays out — it's the logging
   flow's own story, and `logging-flow` is where it's told. */
const ALL_PARTNERS = [CONNECTIONS.comicsplus, CONNECTIONS.beeverso]
const PARTNER_BOOKS = Object.fromEntries(
  Object.entries(BOOKS)
    .filter(([, b]) => b.partner !== 'scholastic')
    .map(([id, b]) => [id, b]),
)
const RECENT = RECENTLY_LOGGED.filter((id) => BOOKS[id]?.partner !== 'scholastic')
// …and the log with it. Filtering the catalog but not the log left Scholastic
// magazines sitting in the Reading Log of a page that says it has no Scholastic.
const LOG = READING_LOG.filter((e) => e.source !== 'scholastic')

/* The same rule for the sources a site setting can switch off: turn one off and
   the sessions it logged go with it. Leaving them behind said the reader has
   rows from a service this site doesn't have. */
const SOURCE_SETTING = { epic: 'epic', comicsplus: 'comicsPlus', beeverso: 'beeverso' }

// Today, in the fixtures' own June.
const TODAY = 'Jun 16, 2026'

// The tabs in the real nav that the dashboard has never had a page for. This
// prototype builds them, so it claims them by id rather than letting the
// dashboard bounce them back to Challenges.
const OWN_TABS = ['badges', 'friends']

// Neither Leaderboards nor Reviews is a top-level destination here.
// Leaderboards is a sub-tab of Friends, since the profile pairs the two on one
// page and they're two views of the same people. Reviews sits under My Reading
// with the log, the Wish List and the Book Lists: a review is a thing you write
// about what you read, and the nav had it standing apart from everything you
// read.
const HIDE_TABS = ['leaderboards', 'reviews']

// Under Reading, after the log itself: what the reader has read is the log's
// own three views, and these are what they mean to read next and where to find
// more of it. The counts are live — a book page can add to the wish list.
// Half of what a reader sees is decided by settings an admin holds, so this
// page is really several pages. The preview bar switches between them rather
// than freezing one configuration into the fixtures. Each id is the app's own
// setting; `rmi` is the one that isn't a boolean — it has three states.
/* The site settings behind the cog. `section:` heads a run — the logging ones
   are their own because there are now enough of them that finding one in a flat
   list of twenty meant reading all twenty. */
const FEATURE_SWITCHES = [
  { id: 'rmi', label: 'Motivation (RMI)', hint: 'rmi_enabled' },
  { id: 'communityGoal', label: 'Community goal', hint: 'microsite.community_goal' },
  { id: 'friendRequests', label: 'Friend requests', hint: '2 waiting' },
  { id: 'readingGoals', label: 'Reading goals', hint: 'reading_goals_enabled' },
  { id: 'leaderboards', label: 'Leaderboards', hint: 'show_school_leaderboards' },
  { id: 'challengeCode', label: 'Challenge codes', hint: 'show_challenge_code' },
  { id: 'connectedSite', label: 'Connected site', hint: 'is_connected_school?' },
  { id: 'registrationQuestions', label: 'Registration questions', hint: '3 active, 2 required' },
  { id: 'fundraiser', label: 'Fundraiser', hint: 'a read-a-thon is running' },
  { id: 'bookMachine', label: 'Book machine', hint: 'has_limited_rewards?' },
  { id: 'comicsPlus', label: 'Comics Plus', hint: 'comics_plus_enabled' },
  { id: 'beeverso', label: 'Beeverso', hint: 'beeverso_enabled' },

  // ── Logging ──────────────────────────────────────────────────────────────
  { id: 'scanIsbn', section: 'Logging', label: 'Scan ISBN', hint: 'display_scan_by_isbn?' },
  { id: 'timer', section: 'Logging', label: 'Reading timer', hint: 'display_timer?' },
  { id: 'epic', section: 'Logging', label: 'Import from Epic', hint: 'epic_integration?' },
  {
    id: 'requireTitle',
    section: 'Logging',
    label: 'Require a title',
    hint: 'require_title_for_logs',
  },
  { id: 'bookReviews', section: 'Logging', label: 'Reviews on a log', hint: 'book_reviews?' },
  {
    id: 'multiDate',
    section: 'Logging',
    label: 'Log several days at once',
    hint: '@multiclick_enabled',
  },
  {
    id: 'backlogging',
    section: 'Logging',
    label: 'Backlogging',
    hint: 'back_logging_days — 14',
  },
  {
    id: 'logLimits',
    section: 'Logging',
    label: 'Police log values',
    hint: 'LogTypeMicrosite warning/limit',
  },
]

// The site's own goal, and what it has read toward it so far.
const COMMUNITY_GOAL = { total: 128_400, goal: 250_000, unit: 'minutes' }

// Everything Personalize Reader's Preferences list needs: the vocabularies
// behind each filter, and what the site lets this reader set. Olivia is a
// child profile on a school site that asks for grade levels, so she gets the
// six recommendation filters rather than the adult's Reading Doorways.
// The biggest structural difference in Beanstack, and not something a reader
// can see — so it belongs on the preview bar rather than in the page.
//
//  * A **library** has an account creator, an adult who signs up, and that
//    account holds one or many profiles: one for themselves, one per child.
//    The reader pill switches between them; the gear is the *account's*
//    settings and a profile's own are behind its Edit. Friends are made by
//    swapping a friend code, because there is no email to ask a child for.
//  * A **school** has no account layer. One student, one profile, nothing above
//    it and nobody to switch to. Friends are invited by email, and the gear is
//    that one reader's own settings.
const SITE_TYPES = [
  { id: 'library', label: 'Library site', short: 'Library', icon: 'building-store' },
  { id: 'school', label: 'School site', short: 'School', icon: 'school' },
]

const PREFERENCE_VOCAB = {
  interests: INTERESTS,
  genres: PREFERENCE_GENRES,
  backgroundGroups: BACKGROUND_GROUPS,
  readingLevels: READING_LEVELS,
  languages: PREFERENCE_LANGUAGES,
  gradeLevels: BOOK_LIST_GRADES,
  doorways: DOORWAYS,
  limits: PREFERENCE_LIMITS,
}

/**
 * The preview bar's switches, kept across reloads.
 *
 * They are what a site's admin has turned on, and reading the page in one
 * configuration usually means reloading it a few times — a switch that resets
 * every time is one you have to set again on every reload, which is exactly
 * when you least want to.
 *
 * Unknown keys are dropped and missing ones fall back, so adding a switch later
 * doesn't break a stored set.
 */
const SETTINGS_KEY = 'bs-web-app-settings'

function loadSettings(defaults) {
  try {
    const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY))
    if (!raw || typeof raw !== 'object') return defaults
    return Object.fromEntries(
      Object.keys(defaults).map((k) => [k, typeof raw[k] === 'boolean' ? raw[k] : defaults[k]]),
    )
  } catch {
    return defaults
  }
}

const SITE_KEY = 'bs-web-app-site'
/* Which tab, and which challenge if one is open. Session-scoped: it exists so
   an edit or a refresh puts you back where you were, not so the app remembers
   you between visits. */
const NAV_KEY = 'bs-web-app-nav'

function loadNav() {
  try {
    return JSON.parse(sessionStorage.getItem(NAV_KEY)) ?? {}
  } catch {
    return {}
  }
}
/* `fundraiser-notification/fundraiser-id-N/profile-id-N/user-id-N` in the app —
   one fundraiser and one reader here, so one key. */
const WELCOME_KEY = 'bs-web-app-fundraiser-welcomed'

const FEATURE_DEFAULTS = {
  rmi: true,
  communityGoal: true,
  friendRequests: true,
  readingGoals: true,
  leaderboards: true,
  challengeCode: true,
  connectedSite: true,
  registrationQuestions: true,
  fundraiser: true,
  bookMachine: true,
  comicsPlus: true,
  beeverso: true,
  scanIsbn: true,
  timer: true,
  epic: true,
  requireTitle: false,
  bookReviews: true,
  multiDate: false,
  backlogging: true,
  logLimits: true,
}

export function App() {
  const [flowOpen, setFlowOpen] = useState(false)
  const [streak, setStreak] = useState(STREAK)
  const [dailyGoal, setDailyGoal] = useState(DAILY_GOAL)

  // Linked reading apps, keyed by partner id — each is linked and unlinked on
  // its own.
  const [connections, setConnections] = useState({})
  const [linking, setLinking] = useState(null) // partner id mid-handoff
  const [visiting, setVisiting] = useState(null) // partner id whose catalog is open
  const [challenge, setChallenge] = useState(() => CHALLENGE_BY_ID[loadNav().challenge] ?? null)
  // The dashboard's view is driven from here so that leaving for another tab
  // also closes an open challenge — `page` replaces the main column, so
  // without this the challenge stayed up under a nav tab that had moved on.
  const [view, setView] = useState(() => loadNav().view ?? 'challenges')
  const [challengeTab, setChallengeTab] = useState(() => loadNav().challengeTab ?? 'overview')
  const [features, setFeatures] = useState(() => loadSettings(FEATURE_DEFAULTS))
  const [requests, setRequests] = useState(FRIEND_REQUESTS)
  // The top bar can start a review from any page, so what it opens lives here
  // and the Reviews page renders it.
  const [composing, setComposing] = useState(null)
  // Which sub-tab Reading is on, so a page can send the reader to another one
  // the way `reading_lists_path` does.
  const [logTab, setLogTab] = useState('log')

  // The catalog is a stack, not a tab: a book is reached from the log, a wish
  // list, a book list or the browse page, and "back" has to mean whichever of
  // those it was. Each entry carries the label for its own way out, so the same
  // BookPage says "Back to Find Books" or "Back to Book Lists" depending on how
  // the reader got to it.
  // The wish list and the log are the reader's, not a page's: a book page adds
  // to the first and corrects the second, and the Wish List and Reading Log
  // pages have to show it. Both were page-local state until those pages stopped
  // being the only way to change them.
  const [wish, setWish] = useState(WISH_LIST)
  const [log, setLog] = useState(LOG)
  /* What the log actually shows: its own rows, minus any whose source this site
     has turned off. Derived rather than filtered into state, so switching the
     setting back brings the rows back. */
  const shownLog = log.filter((e) => {
    const setting = SOURCE_SETTING[e.source]
    return !setting || features[setting]
  })
  const wished = (id) => wish.some((w) => w.book === id)
  const toggleWish = (book) =>
    setWish((ws) =>
      ws.some((w) => w.book === book.id)
        ? ws.filter((w) => w.book !== book.id)
        : [
            // The app's own line on a wish-list row is who put it there.
            {
              book: book.id,
              addedBy: `${READER.name} M.`,
              dateAdded: TODAY,
              library: Boolean(book.isbn),
            },
            ...ws,
          ],
    )

  // What this reader has told Beanstack about themselves. The forms behind
  // Personalize Reader write here, and the Preferences list reads back which
  // of them have been answered.
  const [prefs, setPrefs] = useState(READER_PREFERENCES)
  const [site, setSite] = useState(() => {
    try {
      const saved = localStorage.getItem(SITE_KEY)
      return saved === 'library' || saved === 'school' ? saved : 'school'
    } catch {
      return 'school'
    }
  })
  // Both halves of the preview bar survive a reload.
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(features))
    } catch {
      /* a private window, or storage turned off — the switches just don't stick */
    }
  }, [features])

  useEffect(() => {
    try {
      localStorage.setItem(SITE_KEY, site)
    } catch {
      /* as above */
    }
  }, [site])

  // Where you were, so a reload doesn't send you back to the first screen.
  // `sessionStorage`, not local: it is for the tab you have open — a new window
  // starts on the dashboard the way a reader would.
  useEffect(() => {
    try {
      sessionStorage.setItem(
        NAV_KEY,
        JSON.stringify({ view, challenge: challenge?.id ?? null, challengeTab }),
      )
    } catch {
      /* as above */
    }
  }, [view, challenge, challengeTab])

  // Which of the account's profiles is being read as. A school has exactly one.
  //
  // Switching changes who the app says you are and whose settings the gear and
  // the pill's Edit lead to. The reading itself — challenges, log, badges —
  // stays Olivia's: a second reader's whole fixture set is a different
  // prototype, and what this switch is here to show is the *shape* of a library
  // account, not two readers' data.
  const [profileId, setProfileId] = useState('olivia')
  const library = site === 'library'
  /* `comics_plus_enabled?` + the `comics_plus_integration` flipper, and the
     same for Beeverso. Each integration is its own site setting, so turning one
     off takes only that partner with it — the App Integrations row, the connect
     banner, the switcher in the top bar and the sessions it logs. */
  const partners = ALL_PARTNERS.filter((p) => features[SOURCE_SETTING[p.id]])
  /* Which activities the reader has ticked off. The fixtures carry a starting
     state; this is what changes as they work through them. */
  const [doneActivities, setDone] = useState(
    () =>
      new Set(
        ACTIVITY_BADGES().flatMap((b) => b.activities.filter((a) => a.done).map((a) => a.id)),
      ),
  )
  /* Ticking one off. It lives up here because two surfaces do it — the Complete
     Activity screen and a badge's own modal, which lists the same activities. */
  const toggleActivity = (_badge, activity) =>
    setDone((d) => {
      const next = new Set(d)
      if (next.has(activity.id)) next.delete(activity.id)
      else next.add(activity.id)
      return next
    })
  /* The badge an earned card is showing, when the reader asks to see it. */
  const [earnedBadge, setEarnedBadge] = useState(null)
  /* Where an earned card's reward and tickets both go: the Rewards tab of the
     challenge that paid them out. */
  const goToRewards = (card) => {
    const c = CHALLENGE_BY_ID[card.challenge]
    if (!c) return
    setFlowOpen(false)
    // The same three the nav itself does — a route left on the stack renders
    // over the challenge and you never see it.
    setStack([])
    setView('challenges')
    setChallenge(c)
    setChallengeTab('rewards')
  }
  const profiles = library ? ACCOUNT.profiles : [STUDENT]
  const current = profiles.find((p) => p.id === profileId) ?? profiles[0]
  // The site's registration questions are asked once, on the first challenge
  // this reader joins — the answers are the profile's, not the challenge's.
  const [regAnswers, setRegAnswers] = useState({})
  // The once-per-reader welcome the app pops the first time they land on a site
  // running a read-a-thon. The fundraiser itself is a nav tab, not a page state.
  //
  // Once means once: `_fundraiser_notification` writes a
  // `fundraiser-notification/fundraiser-id-N/profile-id-N/user-id-N` key to
  // localStorage and never shows the modal to that reader again. Held in
  // component state it came back on every reload, which is a different modal
  // from the one the app has.
  const [welcomed, setWelcomed] = useState(() => {
    try {
      return localStorage.getItem(WELCOME_KEY) === '1'
    } catch {
      return false
    }
  })
  const dismissWelcome = () => {
    setWelcomed(true)
    try {
      localStorage.setItem(WELCOME_KEY, '1')
    } catch {
      /* a browser with storage off still gets the modal once a session */
    }
  }

  const [stack, setStack] = useState([])
  const top = stack[stack.length - 1] ?? null
  const push = (route) => setStack((s) => [...s, route])
  const pop = () => setStack((s) => s.slice(0, -1))
  const openBook = (book, back) => push({ kind: 'book', book, back })
  const openChallenge = (c) => {
    setChallenge(c)
    setChallengeTab('overview')
  }

  // The catalog pages — whichever is on top of the stack.
  function renderRoute() {
    if (top.kind === 'browse') {
      return (
        <FindBooks
          initial={top.initial}
          backLabel={top.back}
          onBack={pop}
          onOpenBook={(book) => openBook(book, 'Back to Find Books')}
        />
      )
    }
    if (top.kind === 'list') {
      return (
        <BookListPage
          list={top.list}
          onBack={pop}
          onLog={() => setFlowOpen(true)}
          onWish={toggleWish}
          onOpenBook={(book) => openBook(book, `Back to ${top.list.name}`)}
        />
      )
    }
    return (
      <BookPage
        book={top.book}
        backLabel={top.back}
        sessions={log.filter((e) => e.kind === 'log' && e.title === top.book.title)}
        onBack={pop}
        onLog={() => setFlowOpen(true)}
        onFilter={(initial) => push({ kind: 'browse', initial, back: `Back to ${top.book.title}` })}
        onOpenBook={(book) => openBook(book, `Back to ${top.book.title}`)}
        wished={wished(top.book.id)}
        onWish={toggleWish}
        /* `logged_books#update` corrects the one number the reader typed; the
           other is whichever of minutes or pages that session was measured in. */
        onEditSession={(entry, value) =>
          setLog((es) =>
            es.map((e) =>
              e.id === entry.id ? { ...e, [entry.minutes ? 'minutes' : 'pages']: value } : e,
            ),
          )
        }
        onRemoveSession={(entry) => setLog((es) => es.filter((e) => e.id !== entry.id))}
      />
    )
  }

  // The pages this prototype owns, by tab id.
  function renderTab(id) {
    if (id === 'fundraisers') return <FundraiserPage fundraiser={FUNDRAISER} entries={shownLog} />
    if (id === 'badges') return <AllBadges />
    if (id === 'friends') return <Friends library={library} />
    return null
  }

  function handleLogged(entry) {
    setStreak((s) => ({ ...s, current: Math.max(s.current, 1) }))
    if (entry.measure === 'minutes' && entry.minutes) {
      setDailyGoal((g) => ({ ...g, minutes: g.minutes + entry.minutes }))
    }
  }

  // A linked partner starts logging on the reader's behalf, so its minutes land
  // on the daily goal (and start the streak) the moment the accounts connect.
  function handleLinked({ partnerId, account, org }) {
    setConnections((c) => ({ ...c, [partnerId]: { account, org } }))
    setLinking(null)
    const mins = partnerMinutes(partnerId)
    if (mins > 0) {
      setDailyGoal((g) => ({ ...g, minutes: g.minutes + mins }))
      setStreak((s) => ({ ...s, current: Math.max(s.current, 1) }))
    }
  }

  function handleDisconnect(partnerId) {
    setConnections((c) => {
      const next = { ...c }
      delete next[partnerId]
      return next
    })
    const mins = partnerMinutes(partnerId)
    setDailyGoal((g) => ({ ...g, minutes: Math.max(0, g.minutes - mins) }))
  }

  return (
    <>
      <PreviewBar
        title="Beanstack Web App"
        views={SITE_TYPES}
        active={site}
        onChange={(v) => {
          setSite(v)
          setProfileId('olivia')
        }}
        ariaLabel="Which kind of site"
        toggles={FEATURE_SWITCHES.map((f) => ({ ...f, on: features[f.id] }))}
        onToggle={(id, on) => setFeatures((f) => ({ ...f, [id]: on }))}
      />
      <Dashboard
        streak={streak}
        dailyGoal={dailyGoal}
        onLog={() => setFlowOpen(true)}
        onReview={() => {
          setView('log')
          setLogTab('reviews')
          setChallenge(null)
          setComposing({ kind: 'written' })
        }}
        connections={connections}
        onLinkPartner={setLinking}
        onDisconnectPartner={handleDisconnect}
        onVisitPartner={setVisiting}
        partners={partners}
        logEntries={shownLog}
        view={view}
        onView={(v) => {
          setView(v)
          setChallenge(null)
          setStack([])
        }}
        ownTabs={OWN_TABS}
        hideTabs={HIDE_TABS}
        renderExtra={renderTab}
        logTabs={[
          { id: 'wish', label: 'Wish List', count: wish.length },
          { id: 'lists', label: 'Book Lists', count: BOOK_LISTS.length },
          { id: 'reviews', label: 'Reviews' },
          { id: 'peer', label: 'Peer Reviews' },
        ]}
        logTab={logTab}
        onLogTab={setLogTab}
        renderLogTab={(id) =>
          id === 'lists' ? (
            <BookLists
              onOpenList={(list) => push({ kind: 'list', list, back: 'Back to Book Lists' })}
              onFindBooks={() => push({ kind: 'browse', back: 'Back to Book Lists' })}
            />
          ) : id === 'reviews' ? (
            <Reviews composing={composing} onCompose={setComposing} />
          ) : id === 'peer' ? (
            <PeerReviews />
          ) : (
            <WishList
              items={wish}
              onRemove={(id) => setWish((ws) => ws.filter((w) => w.book !== id))}
              onFindBooks={() => push({ kind: 'browse', back: 'Back to Wish List' })}
              onOpenBook={(book) => openBook(book, 'Back to Wish List')}
              onLog={() => setFlowOpen(true)}
            />
          )
        }
        onOpenBook={(book) => openBook(book, 'Back to Reading Log')}
        bookFor={catalogBook}
        reader={current}
        otherReaders={library ? profiles.filter((p) => p.id !== current.id) : []}
        onSwitchReader={(p) => setProfileId(p.id)}
        /* The gear is the account creator's on a library site; on a school
           site there is no account above the reader, so it is theirs. The
           library word is the app's own — the dropdown and the page it opens
           both say `edit_account_text_for_schools`. */
        accountLabel={library ? 'Edit Account' : 'Personalize Reader'}
        /* …and on a library site the gear opens that account's page: the email
           and the password, and the only place the whole account can be
           deleted. A school has no account above the reader, so there is none
           to pass and the gear stays on Personalize Reader. */
        account={
          library
            ? {
                account: ACCOUNT,
                branches: LIBRARY_BRANCHES,
                features: { zipcode: true, libraryCard: true },
              }
            : undefined
        }
        /* `profile_has_current_learning_tracks?` — the top bar only offers
           Complete Activity where there is something to complete. */
        activities={{
          badges: ACTIVITY_BADGES(),
          src: (b) => badgeSrc(b.set, b.art),
          completed: doneActivities,
          onToggle: toggleActivity,
        }}
        personalize={{
          kind: current.kind,
          preferences: prefs,
          vocab: PREFERENCE_VOCAB,
          sharedAccess: SHARED_ACCESS,
          sharedInvites: SHARED_INVITES,
          onSavePreferences: (id, value) =>
            setPrefs((p) => (id === 'basic' ? p : { ...p, [id]: value })),
          /* `@rostered_app_integrations_only` — a rostered site is a school
             site in practice, and there the roster owns the reader. The app
             leaves exactly one thing on Personalize Reader: App Integrations. */
          features: {
            avatars: true,
            gradeLevels: true,
            recommendations: true,
            rostered: !library,
          },
        }}
        fundraiser={features.fundraiser ? FUNDRAISER : null}
        registrationQuestions={features.registrationQuestions ? REGISTRATION_QUESTIONS : []}
        registrationAnswers={regAnswers}
        onRegistrationAnswers={setRegAnswers}
        onOpenChallenge={openChallenge}
        motivation={features.rmi ? 'available' : undefined}
        features={{
          ...features,
          communityGoal: features.communityGoal ? COMMUNITY_GOAL : null,
        }}
        friendRequests={features.friendRequests ? requests : []}
        onAcceptFriend={(r) => setRequests((rs) => rs.filter((x) => x.id !== r.id))}
        onDeclineFriend={(r) => setRequests((rs) => rs.filter((x) => x.id !== r.id))}
        page={
          top ? (
            renderRoute()
          ) : challenge ? (
            <ChallengePage
              challenge={challenge}
              tab={challengeTab}
              onTab={setChallengeTab}
              entries={shownLog}
              onLog={() => setFlowOpen(true)}
              /* A badge's own modal offers whatever that badge is earned by —
                 a review badge sends you to write one, an activity badge to
                 its activities. */
              onReview={() => {
                setView('log')
                setLogTab('reviews')
                setChallenge(null)
                setComposing({ kind: 'written' })
              }}
              completedActivities={doneActivities}
              onToggleActivity={toggleActivity}
              onOpenBook={(b) => openBook(b, challenge.title)}
              bookMachine={features.bookMachine}
              onBack={() => setChallenge(null)}
            />
          ) : null
        }
      />

      {/* Over the logging flow, so closing it puts the reader back on the
          screen that offered it. */}
      <BadgeModal
        badge={
          earnedBadge && {
            name: earnedBadge.eyebrow,
            blurb: earnedBadge.title,
            about: earnedBadge.description,
            date: 'Today',
            reward: earnedBadge.reward,
            tickets: earnedBadge.tickets,
            locked: false,
          }
        }
        src={() => earnedBadge?.art}
        confetti
        open={Boolean(earnedBadge)}
        onClose={() => setEarnedBadge(null)}
      />

      <LogFlow
        open={flowOpen}
        onClose={() => setFlowOpen(false)}
        onLogged={handleLogged}
        connections={connections}
        {...LOG_FIXTURES}
        /* Who the flow logs for, and who it could switch to. A library account
           holds several profiles; a school student is one profile with nothing
           above them, so there's nobody to switch to and the flow drops its
           "Select a different reader" link — the same rule the top bar's reader
           pill follows. The fixtures' own pair would have offered the switch on
           both kinds of site. */
        reader={current}
        readers={library ? profiles.filter((p) => p.id !== current.id) : []}
        partners={partners}
        /* This page's own catalog: the fixture shelf minus Scholastic. */
        books={PARTNER_BOOKS}
        recentlyLogged={RECENT}
        dailyGoal={dailyGoal}
        /* The two ways out of an earned card: the badge's own modal, and the
           Rewards tab of the challenge the tickets came from — tickets are only
           worth anything spent, and that's where you spend them. */
        onViewBadge={(card) => setEarnedBadge(card)}
        /* Both land on the challenge's Rewards tab — that's where a reward is
           claimed and where tickets are spent. */
        onReward={(card) => goToRewards(card)}
        onTickets={(card) => goToRewards(card)}
        /* The site settings the logging form reads. Only a school site polices
           a log value, and only then for a reader staff haven't verified —
           `LogLimitWarning`'s own three conditions. */
        site={{
          /* Only a school site polices a log value, and only then for a reader
             staff haven't verified — `LogLimitWarning`'s own three conditions,
             with the cog standing in for the first. */
          rostered: !library && features.logLimits,
          verified: false,
          backlogDays: features.backlogging ? 14 : 0,
          multiDate: features.multiDate,
          timer: features.timer,
          scanIsbn: features.scanIsbn,
          epic: features.epic,
          requireTitle: features.requireTitle,
          bookReviews: features.bookReviews,
        }}
      />

      {visiting && connections[visiting] && (
        <PartnerCatalog
          partner={CONNECTIONS[visiting]}
          account={connections[visiting].account}
          titles={Object.values(PARTNER_BOOKS).filter((b) => b.partner === visiting)}
          renderCover={(b) => <BookCover book={b} size="lg" />}
          onBack={() => setVisiting(null)}
        />
      )}

      {linking && (
        <ConnectFlow
          partner={CONNECTIONS[linking]}
          reader={READER}
          takenUsernames={TAKEN_USERNAMES}
          onCancel={() => setLinking(null)}
          onLinked={handleLinked}
        />
      )}

      {/* Once per reader, the first time they see a site running one. */}
      <FundraiserWelcome
        open={features.fundraiser && !welcomed}
        school={!library}
        onClose={dismissWelcome}
        onStart={() => {
          dismissWelcome()
          setView('fundraisers')
          setChallenge(null)
          setStack([])
        }}
      />

      <PrototypeNav currentHref="/bs-prototypes/web-app/" />
    </>
  )
}
