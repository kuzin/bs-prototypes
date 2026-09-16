import { useEffect, useRef, useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import {
  PhoneFrame,
  DEVICES,
  Header,
  TabBar,
  TabBarV2,
  PlusMenu,
  ProfileRow,
} from '@mobile/components'
import { ACCENT_PRESETS, DEFAULT_ACCENT } from '@mobile/accent'
import { HomeScreen } from './HomeScreen'
import { BennyChat } from './screens/log/BennyChat'
import { BadgeDetail } from './screens/log/BadgeDetail'
import { AchievementDetail } from './screens/log/AchievementDetail'
import { BookDetail } from './screens/log/BookDetail'
import { BookListDashboard } from './screens/discover/BookListDashboard'
import { TitleOptionsModal } from './modals/TitleOptionsModal'
import { ReviewOptionsModal } from './modals/ReviewOptionsModal'
import { ReviewDetails } from './screens/log/ReviewDetails'
import { LogScreen, LOG_TABS } from './screens/LogScreen'
import { DiscoverScreen, DISCOVER_TABS } from './screens/DiscoverScreen'
import { CommunityScreen } from './screens/CommunityScreen'
import { TABS, PLUS_ACTIONS } from './tabs'
import { BENNY_CHAT, BADGE_DETAIL, BOOK_DETAIL, BOOK_LIST_DETAIL } from './data'

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

  // Each tab keeps its own top-tab position, the way a stack navigator would.
  const [logTab, setLogTab] = useSticky('logTab', LOG_TABS[0].id)
  const [discoverTab, setDiscoverTab] = useSticky('discoverTab', DISCOVER_TABS[0].id)
  const [communityTab, setCommunityTab] = useSticky('communityTab', 'microsite')

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
              right={<ProfileRow name="Maya Chen" size="small" onPress={() => {}} />}
            />
          }
          overlay={
            openReview ? (
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
            ) : openBook ? (
              <BookDetail
                book={{ ...BOOK_DETAIL, ...openBook }}
                onClose={() => setOpenBook(null)}
                onOptions={() => setTitleOptions({ ...BOOK_DETAIL, ...openBook })}
              />
            ) : openList ? (
              <BookListDashboard
                list={{ ...BOOK_LIST_DETAIL, ...openList }}
                onClose={() => setOpenList(null)}
                onOpenBook={() => {}}
              />
            ) : null
          }
          actionSheet={
            <>
              <TitleOptionsModal
                open={Boolean(titleOptions)}
                book={titleOptions}
                onClose={() => setTitleOptions(null)}
              />
              <ReviewOptionsModal
                open={Boolean(reviewOptions)}
                review={reviewOptions}
                onClose={() => setReviewOptions(null)}
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
          {tab === 'home' && <HomeScreen flags={flags} />}
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
              serviceType="School"
              flags={flags}
            />
          )}
        </PhoneFrame>
      </div>
    </>
  )
}
