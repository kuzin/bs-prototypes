import { useEffect, useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { PreviewBar } from '@components/PreviewBar/PreviewBar'
import { ConnectFlow, PartnerCatalog } from '@components/PartnerConnect/PartnerConnect'

import { Dashboard } from '../logging-flow/components/Dashboard'
import { LogFlow } from '../logging-flow/components/LogFlow'
import { BookCover } from '../logging-flow/components/BookCover'
import { AllBadges } from './components/AllBadges'
import { Friends } from './components/Friends'
import { ReviewsPage } from './components/ReviewsPage'
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
  STUDENT,
  INTERESTS,
  GENRES,
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
  RECENTLY_LOGGED,
  READING_LOG,
  REGISTRATION_QUESTIONS,
  CHALLENGE_BY_ID,
} from '../logging-flow/data'
import {
  CONNECTIONS,
  CONNECTION_LIST,
  TAKEN_USERNAMES,
  partnerMinutes,
} from '../logging-flow/connections'

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
//  * **Reading in the app.** No title here is marked `readable`, so the flow
//    never offers the read-or-log choice and the e-reader never opens.
//  * **Scholastic.** The partner list and its titles are filtered out.

// The reading apps this page offers, and the titles that go with them.
const PARTNERS = CONNECTION_LIST.filter((p) => p.id !== 'scholastic')
const PARTNER_BOOKS = Object.fromEntries(
  Object.entries(BOOKS)
    .filter(([, b]) => b.partner !== 'scholastic')
    .map(([id, b]) => [id, { ...b, readable: false }]),
)
const RECENT = RECENTLY_LOGGED.filter((id) => BOOKS[id]?.partner !== 'scholastic')
// …and the log with it. Filtering the catalog but not the log left Scholastic
// magazines sitting in the Reading Log of a page that says it has no Scholastic.
const LOG = READING_LOG.filter((e) => e.source !== 'scholastic')

// Today, in the fixtures' own June.
const TODAY = 'Jun 16, 2026'

// The tabs in the real nav that the dashboard has never had a page for. This
// prototype builds them, so it claims them by id rather than letting the
// dashboard bounce them back to Challenges.
const OWN_TABS = ['badges', 'friends', 'reviews']

// Leaderboards isn't a top-level destination here — it's a sub-tab of Friends,
// since the profile pairs the two on one page and they're two views of the same
// people.
const HIDE_TABS = ['leaderboards']

// Under Reading, after the log itself: what the reader has read is the log's
// own three views, and these are what they mean to read next and where to find
// more of it. The counts are live — a book page can add to the wish list.
// Half of what a reader sees is decided by settings an admin holds, so this
// page is really several pages. The preview bar switches between them rather
// than freezing one configuration into the fixtures. Each id is the app's own
// setting; `rmi` is the one that isn't a boolean — it has three states.
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
  genres: GENRES,
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
      sessionStorage.setItem(NAV_KEY, JSON.stringify({ view, challenge: challenge?.id ?? null }))
    } catch {
      /* as above */
    }
  }, [view, challenge])

  // Which of the account's profiles is being read as. A school has exactly one.
  //
  // Switching changes who the app says you are and whose settings the gear and
  // the pill's Edit lead to. The reading itself — challenges, log, badges —
  // stays Olivia's: a second reader's whole fixture set is a different
  // prototype, and what this switch is here to show is the *shape* of a library
  // account, not two readers' data.
  const [profileId, setProfileId] = useState('olivia')
  const library = site === 'library'
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
    if (id === 'fundraisers') return <FundraiserPage fundraiser={FUNDRAISER} entries={log} />
    if (id === 'badges') return <AllBadges />
    if (id === 'friends') return <Friends library={library} />
    if (id === 'reviews') return <ReviewsPage composing={composing} onCompose={setComposing} />
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
          setView('reviews')
          setChallenge(null)
          setComposing({ kind: 'written' })
        }}
        connections={connections}
        onLinkPartner={setLinking}
        onDisconnectPartner={handleDisconnect}
        onVisitPartner={setVisiting}
        partners={PARTNERS}
        logEntries={log}
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
        ]}
        logTab={logTab}
        onLogTab={setLogTab}
        renderLogTab={(id) =>
          id === 'lists' ? (
            <BookLists
              onOpenList={(list) => push({ kind: 'list', list, back: 'Back to Book Lists' })}
              onFindBooks={() => push({ kind: 'browse', back: 'Back to Book Lists' })}
            />
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
           site there is no account above the reader, so it is theirs. */
        accountLabel={library ? 'Account Settings' : 'Personalize Reader'}
        personalize={{
          kind: current.kind,
          preferences: prefs,
          vocab: PREFERENCE_VOCAB,
          sharedAccess: SHARED_ACCESS,
          sharedInvites: SHARED_INVITES,
          onSavePreferences: (id, value) =>
            setPrefs((p) => (id === 'basic' ? p : { ...p, [id]: value })),
          features: { avatars: true, gradeLevels: true, recommendations: true },
        }}
        fundraiser={features.fundraiser ? FUNDRAISER : null}
        registrationQuestions={features.registrationQuestions ? REGISTRATION_QUESTIONS : []}
        registrationAnswers={regAnswers}
        onRegistrationAnswers={setRegAnswers}
        onOpenChallenge={setChallenge}
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
              entries={log}
              onLog={() => setFlowOpen(true)}
              onOpenBook={(b) => openBook(b, challenge.title)}
              onBack={() => setChallenge(null)}
            />
          ) : null
        }
      />

      <LogFlow
        open={flowOpen}
        onClose={() => setFlowOpen(false)}
        onLogged={handleLogged}
        connections={connections}
        partners={PARTNERS}
        books={PARTNER_BOOKS}
        recentlyLogged={RECENT}
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
