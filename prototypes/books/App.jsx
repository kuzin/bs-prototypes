import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'

import { Dashboard } from '../logging-flow/components/Dashboard'
import { LogFlow } from '../logging-flow/components/LogFlow'
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
import { getBook, getSessions, READER, SHELF_SEED } from './data'
import './index.css'

let _uid = 0

export function App() {
  // `tab` is the nav tab; `sub` is a page layered over it (a book, the browse
  // page, a list) that replaces the main column without leaving the tab.
  const [tab, setTab] = useState('discover')
  const [sub, setSub] = useState(null)
  const [challenge, setChallenge] = useState(null)
  const [browseInit, setBrowseInit] = useState(null) // { query?, filter? } seeded into Browse
  const [list, setList] = useState(null) // a Discover list shown in full on its own page
  const [shelf, setShelf] = useState(() => ({ ...SHELF_SEED }))
  const [reviewsByBook, setReviewsByBook] = useState({})
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
    setSub((v) => ({ name: 'book', id, from: v?.name === 'book' ? v.from : (v?.name ?? tab) }))
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
  // The two tabs this prototype owns; everything else on the nav is web-app's.
  const EXTRA_TABS = [
    { id: 'discover', label: 'Discover' },
    { id: 'shelf', label: 'My Shelf', count: shelfIds.size || undefined },
  ]

  const renderTab = (id) => {
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
          onSettings={() => setSettingsOpen(true)}
        />
      )
    if (id === 'shelf')
      return (
        <MyShelf
          shelf={shelf}
          onOpen={open}
          onWish={toggleWant}
          onDiscover={() => goTab('discover')}
        />
      )
    if (id === 'badges') return <AllBadges />
    if (id === 'friends') return <Friends />
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
      sessions={getSessions(sub.id)}
      shelf={shelf}
      onWish={toggleWant}
      onFinish={finishBook}
      onPlay={setNowPlaying}
      onOpen={open}
      onOpenProfile={setProfileId}
      onBack={back}
      backLabel={
        sub.from === 'shelf'
          ? 'My Shelf'
          : sub.from === 'browse'
            ? 'Search'
            : sub.from === 'list'
              ? list?.title || 'List'
              : 'Discover'
      }
      userReviews={reviewsByBook[sub.id]}
      onAddReview={addReview}
      settings={settings}
    />
  ) : null

  return (
    <>
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
        extraTabs={EXTRA_TABS}
        ownTabs={['badges', 'friends']}
        /* Leaderboards lives under Friends and Reviews under Reading, exactly
           as web-app arranges them. */
        hideTabs={['leaderboards', 'reviews']}
        logTabs={[{ id: 'reviews', label: 'Reviews' }]}
        renderLogTab={() => <Reviews />}
        renderExtra={renderTab}
        onOpenChallenge={setChallenge}
        page={page}
      />

      <LogFlow open={flowOpen} onClose={() => setFlowOpen(false)} connections={{}} partners={[]} />

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
    </>
  )
}
