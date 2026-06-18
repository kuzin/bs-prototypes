import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { Tabs } from '@components/Tabs/Tabs'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'

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

function TopBar({ active, onNav, shelfCount, onSettings }) {
  const items = [
    { id: 'challenges', label: 'Challenges' },
    { id: 'log', label: 'Reading Log' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'badges', label: 'Badges' },
    { id: 'discover', label: 'Discover' },
    { id: 'shelf', label: 'My Shelf', count: shelfCount || undefined },
  ]
  return (
    <header className="bk-topbar">
      <div className="bk-topbar-inner">
        <div className="bk-logo">
          <img src="/bs-prototypes/bs.svg" alt="" className="bk-logo-mark" />
          <span className="bk-logo-word">beanstack</span>
        </div>
        <div className="bk-topbar-actions">
          <Button variant="primary" size="sm" icon={<Icon name="reading-log" size={15} />}>
            Log Reading
          </Button>
          <Button variant="ghost" size="sm" icon={<Icon name="writing" size={15} />}>
            Write a Review
          </Button>
        </div>
        <div className="bk-topbar-user">
          <span className="bk-user-pill">
            <span className="bk-user-avatar" style={{ background: READER.color }}>
              {READER.initials}
            </span>
            <span className="bk-user-name">{READER.first}</span>
          </span>
          <button className="bk-icon-btn" aria-label="Settings" onClick={onSettings}>
            <Icon name="settings" size={19} />
          </button>
        </div>
      </div>
      <div className="bk-tabsbar">
        <Tabs
          variant="underline"
          size="md"
          active={active}
          accent="#0D9488"
          onChange={onNav}
          items={items}
        />
      </div>
    </header>
  )
}

function Footer() {
  return (
    <>
      <div className="bk-footer-thin">
        <div className="bk-footer-thin-inner">
          <div className="bk-footer-links">
            <a href="#">FAQ</a>
            <a href="#">Contact Us</a>
            <a href="#">Share Code</a>
          </div>
          <button className="bk-footer-lang" type="button">
            <span className="bk-footer-lang-g">G</span>
            Select Language
          </button>
        </div>
      </div>
      <footer className="bk-footer">
        <div className="bk-footer-inner">
          <div className="bk-logo">
            <img src="/bs-prototypes/bs.svg" alt="" className="bk-logo-mark" />
            <span className="bk-logo-word">beanstack</span>
          </div>
          <div className="bk-footer-copy">
            © 2026 Zoobean, Inc. <span>•</span> <a href="#">Terms</a> <span>•</span>{' '}
            <a href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export function App() {
  const [view, setView] = useState({ name: 'discover' })
  const [browseInit, setBrowseInit] = useState(null) // { query?, filter? } seeded into Browse
  const [list, setList] = useState(null) // a Discover list shown in full on its own page
  const [shelf, setShelf] = useState(() => ({ ...SHELF_SEED }))
  const [reviewsByBook, setReviewsByBook] = useState({})
  const [badge, setBadge] = useState(null) // { id } of the just-finished book | null
  const [nowPlaying, setNowPlaying] = useState(null) // bookId being listened to | null
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState({
    sora: true,
    scholastic: true,
    audiobooks: true,
    libby: false,
  })
  const toggleSetting = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }))

  const open = (id) => {
    setView((v) => ({
      name: 'book',
      id,
      from: v.name === 'book' ? v.from : v.name,
    }))
    window.scrollTo({ top: 0 })
  }
  const back = () => setView((v) => ({ name: v.from || 'discover' }))
  const goShelf = () => {
    setView({ name: 'shelf' })
    window.scrollTo({ top: 0 })
  }
  const openBrowse = (init) => {
    setBrowseInit(init || null)
    setView({ name: 'browse' })
    window.scrollTo({ top: 0 })
  }
  const openList = (shelf, books) => {
    setList({ title: shelf.title, subtitle: shelf.subtitle, curator: shelf.curator, books })
    setView({ name: 'list' })
    window.scrollTo({ top: 0 })
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

  const onNav = (id) => {
    if (id === 'shelf') goShelf()
    else if (id === 'discover') setView({ name: 'discover' })
  }

  const active = view.name === 'shelf' ? 'shelf' : 'discover'

  return (
    <div className="bk-app">
      <TopBar
        active={active}
        onNav={onNav}
        shelfCount={shelfIds.size}
        onSettings={() => setSettingsOpen(true)}
      />
      <main className="bk-main">
        {view.name === 'discover' && (
          <Discover
            onOpen={open}
            onWish={toggleWant}
            wishlist={shelfIds}
            settings={settings}
            onBrowse={openBrowse}
            onPlay={setNowPlaying}
            onViewAll={openList}
          />
        )}
        {view.name === 'list' && (
          <ListPage
            list={list}
            onOpen={open}
            onWish={toggleWant}
            wishlist={shelfIds}
            onBack={() => setView({ name: 'discover' })}
          />
        )}
        {view.name === 'browse' && (
          <Browse
            initialQuery={browseInit?.query || ''}
            initialFilter={browseInit?.filter}
            settings={settings}
            onOpen={open}
            onWish={toggleWant}
            wishlist={shelfIds}
            onBack={() => setView({ name: 'discover' })}
          />
        )}
        {view.name === 'shelf' && (
          <MyShelf
            shelf={shelf}
            onOpen={open}
            onWish={toggleWant}
            onDiscover={() => setView({ name: 'discover' })}
          />
        )}
        {view.name === 'book' && (
          <BookDetail
            book={getBook(view.id)}
            sessions={getSessions(view.id)}
            shelf={shelf}
            onWish={toggleWant}
            onFinish={finishBook}
            onPlay={setNowPlaying}
            onOpen={open}
            onBack={back}
            backLabel={
              view.from === 'shelf'
                ? 'My Shelf'
                : view.from === 'browse'
                  ? 'Search'
                  : view.from === 'list'
                    ? list?.title || 'List'
                    : 'Discover'
            }
            userReviews={reviewsByBook[view.id]}
            onAddReview={addReview}
            settings={settings}
          />
        )}
      </main>
      <Footer />
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
