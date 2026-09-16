import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { PreviewBar } from '@components/PreviewBar/PreviewBar'
import { useStickyState } from '@components/useStickyState/useStickyState'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'

import { Dashboard } from '../logging-flow/components/Dashboard'
import { LogFlow } from '@components/LogFlow/LogFlow'
import { LOG_FIXTURES } from '../logging-flow/data'
import { STREAK, DAILY_GOAL, READING_LOG } from '../logging-flow/data'

// The reader pages this prototype doesn't own are web-app's — it is the
// kitchen sink the reader prototypes build off, so Collections, Friends,
// Reviews and the challenge page come from there rather than being drawn again.
import { AllBadges } from '../web-app/components/AllBadges'
import { Friends } from '../web-app/components/Friends'
import { Reviews } from '../web-app/components/Reviews'
import { ChallengePage } from '../web-app/components/ChallengePage'
import { FriendProfile } from '../web-app/components/FriendProfile'

import { Discover } from './components/Discover'
import { Browse } from './components/Browse'
import { ListPage } from './components/ListPage'
import { BookDetail } from './components/BookDetail'
import { MyShelf } from './components/MyShelf'
import { SettingsModal } from './components/SettingsModal'
import { BadgeEarnedModal } from './components/BadgeEarnedModal'
import { AudioPlayer } from './components/AudioPlayer'
import { bookByTitle, getBook, getSessions, READER, SHELF_SEED } from './data'
import './index.css'

let _uid = 0

export function App() {
  // `tab` is the nav tab; `sub` is a page layered over it (a book, the browse
  // page, a list) that replaces the main column without leaving the tab.
  const [tab, setTab] = useStickyState('books:tab', 'log')
  // Which pane of My Reading. Discover and My Shelf are panes of it rather than
  // tabs of their own: everything the reader keeps — what they logged, what
  // they saved, what they're looking for next — is one place in the nav.
  const [logTab, setLogTab] = useStickyState('books:log-tab', 'discover')
  const [sub, setSub] = useState(null)
  const [challenge, setChallenge] = useState(null)
  const [browseInit, setBrowseInit] = useState(null) // { query?, filter? } seeded into Browse
  const [list, setList] = useState(null) // a Discover list shown in full on its own page
  const [shelf, setShelf] = useState(() => ({ ...SHELF_SEED }))
  const [reviewsByBook, setReviewsByBook] = useState({})
  /* The reader's own sessions, per book — seeded from the fixture the first
     time one is corrected or taken back, so an untouched title still reads
     straight off the data. */
  const [sessionsByBook, setSessionsByBook] = useState({})
  const [badge, setBadge] = useState(null) // { id } of the just-finished book | null
  const [nowPlaying, setNowPlaying] = useState(null) // bookId being listened to | null
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [flowOpen, setFlowOpen] = useState(false)
  const [profileId, setProfileId] = useState(null) // friend whose profile is open
  const [settings, setSettings] = useState({
    sora: true,
    scholastic: true,
    audiobooks: true,
    libby: false,
  })
  const toggleSetting = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }))

  const top = () => window.scrollTo({ top: 0 })

  const open = (id) => {
    /* Where the back link goes. Discover and My Shelf are panes of My Reading
       rather than nav tabs, so what a book was opened from is the pane, not
       `tab` — which now says `log` whichever of them you were on. */
    setSub((v) => ({ name: 'book', id, from: v?.name === 'book' ? v.from : (v?.name ?? logTab) }))
    top()
  }
  // Back out of a book to whatever opened it — another sub-view, or the tab.
  const back = () =>
    setSub((v) => {
      if (v?.from === 'browse') return { name: 'browse' }
      if (v?.from === 'list') return { name: 'list' }
      return null
    })
  const openBrowse = (init) => {
    setBrowseInit(init || null)
    setSub({ name: 'browse' })
    top()
  }
  const openList = (shelfDef, books) => {
    setList({
      title: shelfDef.title,
      subtitle: shelfDef.subtitle,
      curator: shelfDef.curator,
      books,
    })
    setSub({ name: 'list' })
    top()
  }

  // Leaving for another tab drops whatever was layered over this one.
  const goTab = (t) => {
    setTab(t)
    setSub(null)
    setChallenge(null)
    top()
  }

  // shelf: { [bookId]: 'want' | 'reading' | 'finished' }
  const setStatus = (id, status) =>
    setShelf((prev) => {
      const next = { ...prev }
      if (!status) delete next[id]
      else next[id] = status
      return next
    })
  const toggleWant = (id) => setStatus(id, shelf[id] ? null : 'want')
  const shelfIds = new Set(Object.keys(shelf))

  // Finishing a book (from the in-app reader) earns its badge — celebrated once,
  // only on the transition to finished.
  const finishBook = (id) => {
    const already = shelf[id] === 'finished'
    setStatus(id, 'finished')
    if (!already) setBadge({ id })
  }

  const sessionsFor = (id) => sessionsByBook[id] ?? getSessions(id)
  const editSession = (bookId, index, minutes) =>
    setSessionsByBook((prev) => ({
      ...prev,
      [bookId]: (prev[bookId] ?? getSessions(bookId)).map((s, i) =>
        i === index ? { ...s, minutes } : s,
      ),
    }))
  const removeSession = (bookId, index) =>
    setSessionsByBook((prev) => ({
      ...prev,
      [bookId]: (prev[bookId] ?? getSessions(bookId)).filter((_s, i) => i !== index),
    }))

  const addReview = (bookId, { stars, body }) =>
    setReviewsByBook((prev) => ({
      ...prev,
      [bookId]: [
        {
          id: `me-${_uid++}`,
          name: 'Maya C.',
          initials: READER.initials,
          grade: READER.grade,
          color: READER.color,
          stars,
          body,
          date: 'Just now',
          helpful: 0,
          verified: true,
          replies: [],
        },
        ...(prev[bookId] || []),
      ],
    }))

  // ── What the shell renders ───────────────────────────────────────────────
  // The nav tabs this prototype claims; everything else on it is web-app's.
  const renderTab = (id) => {
    if (id === 'badges') return <AllBadges />
    if (id === 'friends') return <Friends />
    return null
  }

  // The panes of My Reading, beside the reading log itself.
  const LOG_TABS = [
    { id: 'discover', label: 'Discover' },
    { id: 'shelf', label: 'My Shelf', count: shelfIds.size || undefined },
    { id: 'reviews', label: 'Reviews' },
  ]

  const renderLogTab = (id) => {
    if (id === 'discover')
      return (
        <Discover
          onOpen={open}
          onWish={toggleWant}
          wishlist={shelfIds}
          settings={settings}
          onBrowse={openBrowse}
          onPlay={setNowPlaying}
          onViewAll={openList}
        />
      )
    if (id === 'shelf')
      return (
        <MyShelf
          shelf={shelf}
          onOpen={open}
          onWish={toggleWant}
          onDiscover={() => setLogTab('discover')}
        />
      )
    if (id === 'reviews') return <Reviews />
    return null
  }

  // A page layered over the current tab — it replaces the main column and the
  // nav stays put, which is what the dashboard's `page` slot is for.
  const page = challenge ? (
    <ChallengePage challenge={challenge} entries={READING_LOG} />
  ) : sub?.name === 'browse' ? (
    <Browse
      initialQuery={browseInit?.query || ''}
      initialFilter={browseInit?.filter}
      settings={settings}
      onOpen={open}
      onWish={toggleWant}
      wishlist={shelfIds}
      onBack={() => setSub(null)}
    />
  ) : sub?.name === 'list' ? (
    <ListPage
      list={list}
      onOpen={open}
      onWish={toggleWant}
      wishlist={shelfIds}
      onBack={() => setSub(null)}
    />
  ) : sub?.name === 'book' ? (
    <BookDetail
      book={getBook(sub.id)}
      sessions={sessionsFor(sub.id)}
      onEditSession={(index, minutes) => editSession(sub.id, index, minutes)}
      onRemoveSession={(index) => removeSession(sub.id, index)}
      shelf={shelf}
      onWish={toggleWant}
      onFinish={finishBook}
      onPlay={setNowPlaying}
      onOpen={open}
      onOpenProfile={setProfileId}
      onBack={back}
      backLabel={
        sub.from === 'shelf'
          ? 'Back to My Shelf'
          : sub.from === 'browse'
            ? 'Back to Search'
            : sub.from === 'list'
              ? `Back to ${list?.title || 'the list'}`
              : 'Back to Discover'
      }
      userReviews={reviewsByBook[sub.id]}
      onAddReview={addReview}
      settings={settings}
    />
  ) : null

  return (
    <div className="bk-root">
      {/* Which reading apps this site has turned on is a reviewer's switch, not
          a reader's — the real app has no such control. It sat as a cog beside
          Discover's search, where it read as product; it belongs on the preview
          bar with the rest of the demo chrome. */}
      <PreviewBar
        title="Book Discovery"
        actions={
          <button type="button" onClick={() => setSettingsOpen(true)}>
            <Icon name="settings" size={15} /> Reading apps
          </button>
        }
      />

      <Dashboard
        streak={STREAK}
        dailyGoal={DAILY_GOAL}
        onLog={() => setFlowOpen(true)}
        connections={{}}
        /* No partner-linking surface here — this prototype is about the catalog,
           and the connect banner belongs to the ones that are about linking. */
        partners={[]}
        view={tab}
        onView={goTab}
        ownTabs={['badges', 'friends']}
        /* Leaderboards lives under Friends and Reviews under Reading, exactly
           as web-app arranges them. */
        hideTabs={['leaderboards', 'reviews']}
        /* A logged title goes to that book's own page — the log names a title
           and this prototype is the one that has a page for it. */
        onOpenBook={(b) => open(b.id)}
        bookFor={bookByTitle}
        logTabs={LOG_TABS}
        logTab={logTab}
        onLogTab={setLogTab}
        renderLogTab={renderLogTab}
        renderExtra={renderTab}
        onOpenChallenge={setChallenge}
        page={page}
      />

      <LogFlow
        open={flowOpen}
        onClose={() => setFlowOpen(false)}
        connections={{}}
        partners={[]}
        {...LOG_FIXTURES}
      />

      <FriendProfile friendId={profileId} onClose={() => setProfileId(null)} />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onToggle={toggleSetting}
      />
      <BadgeEarnedModal
        open={!!badge}
        onClose={() => setBadge(null)}
        book={badge ? getBook(badge.id) : null}
      />
      {nowPlaying && (
        <AudioPlayer
          book={getBook(nowPlaying)}
          onClose={() => setNowPlaying(null)}
          onFinish={finishBook}
        />
      )}
      <PrototypeNav currentHref="/bs-prototypes/books/" />
    </div>
  )
}
