import { useEffect, useRef, useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import {
  PhoneFrame,
  DEVICES,
  Header,
  TabBar,
  TabBarV2,
  PlusMenu,
  ProfileBar,
} from '@mobile/components'
import { ACCENT_PRESETS, DEFAULT_ACCENT } from '@mobile/accent'
import { HomeScreen } from './HomeScreen'
import { BennyChat } from './screens/log/BennyChat'
import { BadgeDetail } from './screens/log/BadgeDetail'
import { AchievementDetail } from './screens/log/AchievementDetail'
import { BookDetail } from './screens/log/BookDetail'
import { BookListDashboard } from './screens/discover/BookListDashboard'
import { Settings } from './screens/Settings'
import { LogSearch } from './screens/LogSearch'
import { EventModal } from './screens/community/EventModal'
import { FriendDetail } from './screens/community/FriendDetail'
import { FriendRequests } from './screens/community/FriendRequests'
import { ShareCode, EnterFriendCode } from './screens/community/FriendCode'
import { FriendSearch } from './screens/community/FriendSearch'
import { FriendFullLog } from './screens/community/FriendFullLog'
import { ReadingSession } from './screens/log/ReadingSession'
import { EditReadingSession } from './screens/log/EditReadingSession'
import { EditTitle } from './screens/log/EditTitle'
import { SwitchReadersSheet } from './modals/SwitchReadersSheet'
import { TitleOptionsModal } from './modals/TitleOptionsModal'
import { ReviewOptionsModal } from './modals/ReviewOptionsModal'
import { ReviewDetails } from './screens/log/ReviewDetails'
import { LogScreen, LOG_TABS } from './screens/LogScreen'
import { DiscoverScreen, DISCOVER_TABS } from './screens/DiscoverScreen'
import { CommunityScreen } from './screens/CommunityScreen'
import { TABS, PLUS_ACTIONS } from './tabs'
import {
  BENNY_CHAT,
  BADGE_DETAIL,
  BOOK_DETAIL,
  BOOK_LIST_DETAIL,
  PROFILES,
  ACCOUNTS,
  FRIENDS,
  FRIEND_REQUEST_LIST,
  FRIEND_DETAILS,
  SITE_ROSTER,
  ACCOUNT_FIELD_SECTIONS,
  READER_FIELD_SECTIONS,
  ALL_TITLES_SECTIONS,
} from './data'

/**
 * Sticky view state, so a hot reload does not throw away which tab you were on.
 * `useStickyState` lives in the web system, so the mobile tree keeps its own small copy rather
 * than importing across the boundary.
 */
function useSticky(key, initial) {
  const k = `bsp:m-app:${key}`
  const [v, setV] = useState(() => {
    try {
      const raw = sessionStorage.getItem(k)
      return raw == null ? initial : JSON.parse(raw)
    } catch {
      return initial
    }
  })
  return [
    v,
    (next) => {
      setV(next)
      try {
        sessionStorage.setItem(k, JSON.stringify(next))
      } catch {
        /* private mode */
      }
    },
  ]
}

const TITLES = { home: 'Home', log: 'Log', discover: 'Discover', community: 'Community' }

/**
 * Home's conditional sections, with the real gate behind each. On device a reader sees whichever
 * subset their microsite and profile allow; here they are switchable so every combination — and
 * the all-on kitchen sink — is reachable.
 */
const HOME_FLAGS = [
  { id: 'bookTalks', label: 'Book Talks', gate: 'bookTalksEnabled && grade_level_id >= 6' },
  { id: 'rmi', label: 'RMI survey', gate: 'microsite.rmi_enabled' },
  { id: 'dailyGoal', label: 'Daily goal', gate: 'reading_goals_enabled && reading_goal' },
  { id: 'streaks', label: 'Streaks', gate: 'not dismissed for this profile' },
  { id: 'fundraiser', label: 'Fundraiser', gate: 'useFundraiser(profileId) returns data' },
  { id: 'activities', label: 'Activities', gate: 'profile.has_activities' },
  { id: 'reviews', label: 'Reviews', gate: 'microsite.reviewsEnabled' },
]

/**
 * The Log tab's gates decide which TOP TABS exist, not which sections render — four of its nine
 * are conditional, so most readers see five or six.
 */
const LOG_FLAGS = [
  { id: 'bookTalks', label: 'Book Talks', gate: 'bookTalksEnabled && grade_level_id >= 6' },
  { id: 'achievements', label: 'Achievements', gate: 'profiles.displayAchievements' },
  { id: 'readingMotivation', label: 'Reading Motivation', gate: 'rmi_enabled && surveys exist' },
  { id: 'reviews_profiles', label: 'Reviews', gate: 'microsite.reviewsEnabled' },
]

const DISCOVER_FLAGS = [
  { id: 'reviews_discover', label: 'Reviews', gate: 'microsite.reviewsEnabled' },
  { id: 'libraries_discover', label: 'Libraries', gate: 'microsite.classrooomLibraryEnabled' },
  { id: 'book_lists', label: 'Book Lists', gate: 'profile.display_reading_lists' },
]

const COMMUNITY_FLAGS = [
  { id: 'microsite', label: 'My School', gate: 'clientServiceType !== CORPORATE' },
  { id: 'friends', label: 'Friends', gate: 'profiles.displayFriends' },
  { id: 'leaderboards', label: 'Leaderboard', gate: 'displayLeaderboards || type === SCHOOL' },
]

/** Every tab with something gated gets its own cog. */
const TAB_FLAGS = {
  home: { title: 'Home sections', flags: HOME_FLAGS },
  log: { title: 'Log tabs', flags: LOG_FLAGS },
  discover: { title: 'Discover tabs', flags: DISCOVER_FLAGS },
  community: { title: 'Community tabs', flags: COMMUNITY_FLAGS },
}

const DEFAULT_FLAGS = {
  dailyGoal: true,
  streaks: true,
  // Every gated top tab starts on, so the full set is visible until you switch one off.
  bookTalks: true,
  achievements: true,
  readingMotivation: true,
  reviews_profiles: true,
  reviews_discover: true,
  libraries_discover: true,
  book_lists: true,
  microsite: true,
  friends: true,
  leaderboards: true,
}

export function App() {
  const [device, setDevice] = useSticky('device', 'iphone-16-pro')
  // A design PROPOSAL sitting beside the shipped bar, so the two can be compared in place. The
  // storage key carries a version because the default moved to `floating` — a sticky value under
  // the old key would have pinned everyone to the old default and hidden the change.
  const [barStyle, setBarStyle] = useSticky('barStyle2', 'floating')
  /**
   * `microsite.clientServiceType` — and it forks more of the app than its name suggests.
   *
   * Community reads it three times: the first tab is labelled `My ${Capitalize(type)}`, the
   * Leaderboard tab appears for a SCHOOL whether or not `displayLeaderboards` is on, and adding a
   * friend takes an entirely different route. A school roster is a closed list both readers are
   * already on, so you search it and send an invite; a library has no such list and no way to
   * know two patrons know each other, so they exchange a code out of band. Settings forks on it
   * too — a school account is one login to one reader, so it has no Add A Reader.
   */
  const [serviceType, setServiceType] = useSticky('serviceType', 'School')
  const [accent, setAccent] = useSticky('accent', DEFAULT_ACCENT)
  const [tab, setTab] = useSticky('tab', 'home')
  const [plusOpen, setPlusOpen] = useState(false)
  // A `presentation: 'modal'` screen lives above the whole navigator, so it is held here rather
  // than inside the tab that opened it.
  const [openChat, setOpenChat] = useState(null)
  const [openBadge, setOpenBadge] = useState(null)
  const [openAchievement, setOpenAchievement] = useState(null)
  const [openBook, setOpenBook] = useState(null)
  // The app PUSHES this one; presented here as a sheet by design call (see BookListDashboard).
  const [openList, setOpenList] = useState(null)
  // Options sheets are mounted at the root, above whatever presented them — `src/modals/index.jsx`
  // does the same, which is how a book sheet's “…” can open a menu over itself.
  // Presented as a SHEET like the other four details, rather than the pushed stack route the app
  // uses for it — see ReviewDetails for why.
  const [openReview, setOpenReview] = useState(null)
  const [titleOptions, setTitleOptions] = useState(null)
  const [reviewOptions, setReviewOptions] = useState(null)
  // Lists have three states and a prototype that only ever shows the third is a prototype you
  // cannot design the other two in. Populated is the default; the toggle is how you reach the rest.
  const [listState, setListState] = useSticky('listState', 'populated')
  // The goal banner is an open design question rather than a port — three shapes, switchable on
  // the real screen, because they only compare properly against the calendar underneath them.
  const [goalVariant, setGoalVariant] = useSticky('goalVariant', 'compact')
  const [flags, setFlags] = useSticky('flags', DEFAULT_FLAGS)
  const [flagsOpen, setFlagsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useSticky('settingsOpen', false)
  const toolsRef = useRef(null)

  // A flyout closes on an outside click and on Escape, the way a menu does. `pointerdown` rather
  // than `click`, so it closes on the press that started outside rather than waiting for a release
  // that a drag might never deliver.
  useEffect(() => {
    if (!settingsOpen) return
    const onDown = (e) => {
      if (!toolsRef.current?.contains(e.target)) setSettingsOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setSettingsOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [settingsOpen, setSettingsOpen])

  /* Which reader the app is being used as. The header's avatar switches between them, so it is
     app-wide state rather than the header's own. */
  const [profileId, setProfileId] = useSticky('profile', PROFILES[0].id)
  const [switchReadersOpen, setSwitchReadersOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  /* The streak card's dismissal, which the app keeps per profile in `streakComponentClosed`. */
  const [openEvent, setOpenEvent] = useState(null)
  // The community stack. `friendDetail` is a presented modal and `friendRequestList` is a push,
  // so both live up here with the other pushed screens rather than inside the tab.
  const [friends, setFriends] = useState(FRIENDS)
  const [friendRequests, setFriendRequests] = useState(FRIEND_REQUEST_LIST)
  const [openFriend, setOpenFriend] = useState(null)
  const [fullLogFriend, setFullLogFriend] = useState(null)
  const [showFriendRequests, setShowFriendRequests] = useState(false)
  const [codeScreen, setCodeScreen] = useState(null)
  /* The code belongs to the READER, not the device — switching readers has to change it, or the
     screen is telling you to share somebody else's. Seeded from the name so it is stable. */
  const [codeSuffix, setCodeSuffix] = useState('7F3K')
  const [streakClosed, setStreakClosed] = useSticky('streakClosed', false)
  const [showLogSearch, setShowLogSearch] = useState(false)
  /* A session opened from the book panel. The panel stays mounted underneath — in the app this is
     a push onto the same stack, so closing the session returns to the book rather than the tab. */
  const [openSession, setOpenSession] = useState(null)
  const [editSession, setEditSession] = useState(null)
  const [editTitle, setEditTitle] = useState(null)

  /* The book panel's edits land on `openBook`, which the panel merges over the fixture — so a
     saved title or a changed session shows immediately and survives closing the panel. */
  function patchBook(patch) {
    setOpenBook((b) => ({ ...BOOK_DETAIL, ...b, ...patch }))
  }

  function replaceSession(next) {
    setOpenBook((b) => {
      const merged = { ...BOOK_DETAIL, ...b }
      return {
        ...merged,
        sessions: merged.sessions.map((s) => (s.id === next.id ? next : s)),
      }
    })
  }

  /* What the Log tab's search searches: every title the reader has logged, flattened out of the
     month sections All Titles reads them in. */
  const loggedTitles = ALL_TITLES_SECTIONS.flatMap((section) => section.books)
  const profile = PROFILES.find((p) => p.id === profileId) ?? PROFILES[0]

  // Each tab keeps its own top-tab position, the way a stack navigator would.
  const [logTab, setLogTab] = useSticky('logTab', LOG_TABS[0].id)
  const [discoverTab, setDiscoverTab] = useSticky('discoverTab', DISCOVER_TABS[0].id)
  const [communityTab, setCommunityTab] = useSticky('communityTab', 'microsite')

  /**
   * Home is a set of doors and everything behind them is on another tab, so a jump has to set the
   * bottom tab AND the top tab under it — which is exactly the shape of the app's own
   * `navigate('logTab', { screen: 'logTabs', params: { screen: 'theLog', params: { screen: … } } })`.
   */
  function goTo(nextTab, subTab) {
    setTab(nextTab)
    if (!subTab) return
    if (nextTab === 'log') setLogTab(subTab)
    if (nextTab === 'discover') setDiscoverTab(subTab)
  }

  const d = DEVICES[device] ?? DEVICES['iphone-16-pro']

  // Home is the only tab whose content scrolls inside the frame's own body; the other three own
  // their scroll region because a top-tab row sits above it and must not scroll away.
  const isHome = tab === 'home'

  return (
    <>
      <PrototypeNav currentHref="/bs-prototypes/m-app/" />

      <div className="m-stage">
        {/* The dev controls are scaffolding, not part of the design, so they stay folded away
            until asked for — an unfolded control bar competes with the thing being reviewed. */}
        <div className="m-stage-tools" ref={toolsRef}>
          <button
            type="button"
            className={`m-stage-toggle${settingsOpen ? ' is-open' : ''}`}
            onClick={() => setSettingsOpen(!settingsOpen)}
            aria-expanded={settingsOpen}
          >
            {settingsOpen ? 'Hide settings' : 'View settings'}
          </button>

          {settingsOpen && (
            <div className="m-stage-bar">
              <select
                aria-label="Device"
                value={device}
                onChange={(e) => setDevice(e.target.value)}
              >
                {Object.entries(DEVICES).map(([id, dev]) => (
                  <option key={id} value={id}>
                    {dev.name} · {dev.width}×{dev.height}
                  </option>
                ))}
              </select>

              <select
                aria-label="List state"
                value={listState}
                onChange={(e) => setListState(e.target.value)}
              >
                <option value="populated">Lists · populated</option>
                <option value="loading">Lists · loading</option>
                <option value="loadingMore">Lists · loading more</option>
                <option value="refreshing">Lists · refreshing</option>
                <option value="empty">Lists · empty</option>
              </select>

              <select
                aria-label="Goal banner"
                value={goalVariant}
                onChange={(e) => setGoalVariant(e.target.value)}
              >
                <option value="compact">Goal · compact</option>
                <option value="flush">Goal · flush</option>
                <option value="card">Goal · card</option>
              </select>

              <select
                aria-label="Site type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="School">Site · school</option>
                <option value="Library">Site · library</option>
              </select>

              <select
                aria-label="Tab bar"
                value={barStyle}
                onChange={(e) => setBarStyle(e.target.value)}
              >
                <option value="shipped">Tab bar · shipped</option>
                <option value="proposed">Tab bar · proposed</option>
                <option value="floating">Tab bar · floating</option>
              </select>

              <div className="m-swatches" role="group" aria-label="Site color">
                {ACCENT_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="m-swatch"
                    style={{ background: p.value }}
                    aria-label={p.name}
                    aria-pressed={accent === p.value}
                    onClick={() => setAccent(p.value)}
                  />
                ))}
              </div>

              {TAB_FLAGS[tab] && (
                <div className="m-cog-wrap">
                  <button
                    type="button"
                    className={`m-cog${flagsOpen ? ' is-open' : ''}`}
                    onClick={() => setFlagsOpen(!flagsOpen)}
                    aria-expanded={flagsOpen}
                    aria-label={TAB_FLAGS[tab].title}
                    title={TAB_FLAGS[tab].title}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                      <path
                        d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1h.2a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </button>

                  {flagsOpen && (
                    <div className="m-cog-menu">
                      <div className="m-cog-head">
                        <span>{TAB_FLAGS[tab].title}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFlags(
                              Object.fromEntries(
                                HOME_FLAGS.map((f) => [
                                  f.id,
                                  !HOME_FLAGS.every((x) => flags[x.id]),
                                ]),
                              ),
                            )
                          }
                        >
                          {TAB_FLAGS[tab].flags.every((f) => flags[f.id]) ? 'None' : 'All'}
                        </button>
                      </div>
                      {TAB_FLAGS[tab].flags.map((f) => (
                        <label key={f.id} className="m-flag" title={f.gate}>
                          <input
                            type="checkbox"
                            checked={flags[f.id] ?? false}
                            onChange={(e) => setFlags({ ...flags, [f.id]: e.target.checked })}
                          />
                          <span className="m-flag-label">{f.label}</span>
                          <code className="m-flag-gate">{f.gate}</code>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <PhoneFrame
          device={device}
          accent={accent}
          scroll={isHome}
          floatingBar={barStyle === 'floating'}
          header={
            <Header
              variant="root"
              title={TITLES[tab]}
              right={
                <ProfileBar
                  name={profile.name}
                  /* `logSearch` is passed by the Log navigator alone — the other three roots
                     have no log to search. */
                  onSearch={tab === 'log' ? () => setShowLogSearch(true) : undefined}
                  onSettings={() => setShowSettings(true)}
                  onProfile={() => setSwitchReadersOpen(true)}
                />
              }
            />
          }
          /* Settings is a PUSHED stack route — `navigation.navigate('settings')` — so it covers
             the whole navigator with no scale-back and no peeking edge: somewhere the app went,
             rather than something laid over it. Search keeps the presented card, which is what a
             screen you open, use once and dismiss should feel like. */
          /* `codeScreen` is NOT in this list: the two friend-code screens present as modals.
             They are a detour rather than a destination — you open one, read or type a code, and
             leave — and the sheet's peeking edge is what says the thing behind is still there. A
             push implies you have gone somewhere and have to come back. */
          overlayVariant={showSettings || showFriendRequests || fullLogFriend ? 'card' : 'sheet'}
          overlay={
            fullLogFriend ? (
              <FriendFullLog
                friend={fullLogFriend}
                titles={fullLogFriend.titles ?? []}
                onBack={() => setFullLogFriend(null)}
              />
            ) : codeScreen === 'share' ? (
              <ShareCode
                profile={profile}
                code={`${(profile.name.split(' ')[0] ?? 'CODE').toUpperCase()}-${codeSuffix}`}
                onRefresh={() =>
                  setCodeSuffix(Math.random().toString(36).slice(2, 6).toUpperCase())
                }
                onBack={() => setCodeScreen(null)}
              />
            ) : codeScreen === 'search' ? (
              <FriendSearch
                roster={SITE_ROSTER}
                /* Gates the one-time privacy notice — `useFriendsList`'s
                   `totalConfirmedFriends`, which counts the confirmed ones only. */
                confirmedFriends={friends.filter((f) => f.confirmed).length}
                onInvite={(r) =>
                  setFriends((l) => [...l, { ...r, streak: null, confirmed: false }])
                }
                onBack={() => setCodeScreen(null)}
              />
            ) : codeScreen === 'enter' ? (
              <EnterFriendCode onAdd={() => false} onBack={() => setCodeScreen(null)} />
            ) : openFriend ? (
              <FriendDetail
                friend={openFriend}
                onFullLog={setFullLogFriend}
                onClose={() => setOpenFriend(null)}
              />
            ) : showFriendRequests ? (
              <FriendRequests
                requests={friendRequests}
                onBack={() => setShowFriendRequests(false)}
                onAccept={(r) => {
                  setFriendRequests((l) => l.filter((x) => x.id !== r.id))
                  setFriends((l) => [...l, { ...r, streak: null, confirmed: true }])
                }}
                onDecline={(r) => setFriendRequests((l) => l.filter((x) => x.id !== r.id))}
              />
            ) : openEvent ? (
              <EventModal event={openEvent} onClose={() => setOpenEvent(null)} />
            ) : showSettings ? (
              <Settings
                accounts={ACCOUNTS}
                profiles={PROFILES}
                serviceType={serviceType}
                accountFields={ACCOUNT_FIELD_SECTIONS}
                readerFields={READER_FIELD_SECTIONS}
                onBack={() => setShowSettings(false)}
              />
            ) : showLogSearch ? (
              <LogSearch
                titles={loggedTitles}
                onOpenBook={setOpenBook}
                onClose={() => setShowLogSearch(false)}
              />
            ) : openReview ? (
              <ReviewDetails
                review={openReview}
                profile="Maya Chen"
                onClose={() => setOpenReview(null)}
              />
            ) : openChat ? (
              <BennyChat
                chat={BENNY_CHAT}
                onClose={() => setOpenChat(null)}
                onFinishLater={() => setOpenChat(null)}
              />
            ) : openBadge ? (
              <BadgeDetail
                badge={{ ...BADGE_DETAIL, ...openBadge, completedOn: BADGE_DETAIL.completedOn }}
                onClose={() => setOpenBadge(null)}
              />
            ) : openAchievement ? (
              <AchievementDetail
                achievement={openAchievement}
                onClose={() => setOpenAchievement(null)}
              />
            ) : editTitle ? (
              <EditTitle
                book={editTitle}
                onBack={() => setEditTitle(null)}
                onSave={(next) => {
                  patchBook(next)
                  setEditTitle(null)
                }}
              />
            ) : editSession ? (
              <EditReadingSession
                session={editSession}
                onBack={() => setEditSession(null)}
                onSave={(next) => {
                  replaceSession(next)
                  setEditSession(null)
                  setOpenSession(next)
                }}
                /* `pop(SCREENS_TO_POP_ON_DELETE)` — deleting from the edit screen goes back TWO,
                   past the session it just removed, to the book. */
                onDelete={(session) => {
                  setOpenBook((b) => {
                    const merged = { ...BOOK_DETAIL, ...b }
                    return {
                      ...merged,
                      sessions: merged.sessions.filter((x) => x.id !== session.id),
                    }
                  })
                  setEditSession(null)
                  setOpenSession(null)
                }}
              />
            ) : openSession ? (
              <ReadingSession
                session={openSession}
                onBack={() => setOpenSession(null)}
                onEdit={setEditSession}
                onDelete={(session) => {
                  /* Merge BEFORE filtering: `openBook` is whatever was tapped — a Home title
                     carries no sessions of its own, they arrive from BOOK_DETAIL at render.
                     Filtering the unmerged object wrote `sessions: []` and deleted all seven. */
                  setOpenBook((b) => {
                    const merged = { ...BOOK_DETAIL, ...b }
                    return {
                      ...merged,
                      sessions: merged.sessions.filter((x) => x.id !== session.id),
                    }
                  })
                  setOpenSession(null)
                }}
              />
            ) : openBook ? (
              <BookDetail
                book={{ ...BOOK_DETAIL, ...openBook }}
                readerName={profile.name.split(' ')[0]}
                onClose={() => setOpenBook(null)}
                onOptions={() => setTitleOptions({ ...BOOK_DETAIL, ...openBook })}
                onOpenSession={setOpenSession}
              />
            ) : openList ? (
              <BookListDashboard
                list={{ ...BOOK_LIST_DETAIL, ...openList }}
                onClose={() => setOpenList(null)}
                onOpenBook={setOpenBook}
              />
            ) : null
          }
          actionSheet={
            <>
              <TitleOptionsModal
                open={Boolean(titleOptions)}
                book={titleOptions}
                onClose={() => setTitleOptions(null)}
                /* `deleteBook` — the request goes out and then `navigation.goBack()`, so the
                   panel you deleted the title from closes with it. */
                onDelete={() => {
                  setTitleOptions(null)
                  setOpenSession(null)
                  setOpenBook(null)
                }}
                /* `handleNavigation` — the options close and `editBook` is pushed. */
                onEdit={(b) => {
                  setTitleOptions(null)
                  setEditTitle({ ...BOOK_DETAIL, ...openBook, ...b })
                }}
              />
              <ReviewOptionsModal
                open={Boolean(reviewOptions)}
                review={reviewOptions}
                onClose={() => setReviewOptions(null)}
              />
              <SwitchReadersSheet
                open={switchReadersOpen}
                profiles={PROFILES}
                currentId={profileId}
                onSelect={setProfileId}
                onClose={() => setSwitchReadersOpen(false)}
              />
            </>
          }
          tabBar={
            barStyle === 'proposed' || barStyle === 'floating' ? (
              <>
                <TabBarV2
                  /* The proposal shows a DOT for every notification rather than a count — the
                     number never told you much, and a dot leaves the pill uncluttered. */
                  tabs={TABS.map((t) => ({
                    ...t,
                    badge: t.badge != null || t.dot ? true : undefined,
                  }))}
                  active={tab}
                  onChange={setTab}
                  plusOpen={plusOpen}
                  onPlus={setPlusOpen}
                  variant={barStyle === 'floating' ? 'floating' : 'attached'}
                />
                <PlusMenu
                  open={plusOpen}
                  onToggle={setPlusOpen}
                  onSelect={() => {}}
                  actions={PLUS_ACTIONS}
                  screenHeight={d.height}
                  hideTrigger
                />
              </>
            ) : (
              <>
                <TabBar tabs={TABS} active={tab} onChange={setTab} />
                <PlusMenu
                  open={plusOpen}
                  onToggle={setPlusOpen}
                  onSelect={() => {}}
                  actions={PLUS_ACTIONS}
                  screenHeight={d.height}
                />
              </>
            )
          }
        >
          {tab === 'home' && (
            <HomeScreen
              flags={flags}
              onGoTo={goTo}
              onOpenBook={setOpenBook}
              onOpenBadge={setOpenBadge}
              onOpenReview={setOpenReview}
              streakClosed={streakClosed}
              onCloseStreak={() => setStreakClosed(true)}
            />
          )}
          {tab === 'log' && (
            <LogScreen
              tab={logTab}
              onTab={setLogTab}
              flags={flags}
              onOpenChat={setOpenChat}
              onOpenBadge={setOpenBadge}
              onOpenAchievement={setOpenAchievement}
              onOpenBook={setOpenBook}
              onReviewOptions={setReviewOptions}
              onOpenReview={setOpenReview}
              listState={listState}
              goalVariant={goalVariant}
            />
          )}
          {tab === 'discover' && (
            <DiscoverScreen
              onOpenEvent={setOpenEvent}
              tab={discoverTab}
              onTab={setDiscoverTab}
              flags={flags}
              onOpenList={setOpenList}
            />
          )}
          {tab === 'community' && (
            <CommunityScreen
              tab={communityTab}
              onTab={setCommunityTab}
              serviceType={serviceType}
              flags={flags}
              profileId={profileId}
              profileName={profile.name}
              friends={friends}
              requests={friendRequests}
              onRemoveFriend={(f) => setFriends((l) => l.filter((x) => x.id !== f.id))}
              onOpenEvent={setOpenEvent}
              onOpenFriend={(f) => setOpenFriend(FRIEND_DETAILS[f.id] ?? f)}
              onReviewRequests={() => setShowFriendRequests(true)}
              onShareCode={() => setCodeScreen('share')}
              onEnterCode={() => setCodeScreen('enter')}
              onFriendSearch={() => setCodeScreen('search')}
            />
          )}
        </PhoneFrame>
      </div>
    </>
  )
}
