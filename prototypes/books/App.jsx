import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { PreviewBar } from '@components/PreviewBar/PreviewBar'
import { useStickyState } from '@components/useStickyState/useStickyState'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { useToasts, ToastStack } from '@components/Toast/Toast'

import { Dashboard } from '../logging-flow/components/Dashboard'
import { LogFlow } from '@components/LogFlow/LogFlow'
import { useCoverColor } from '@components/BookCover/coverColor'
import { ReadNow } from '@components/ReadNow/ReadNow'
import { LOG_FIXTURES } from '../logging-flow/data'
import { STREAK, DAILY_GOAL, READING_LOG } from '../logging-flow/data'

// The reader pages this prototype doesn't own are web-app's — it is the
// kitchen sink the reader prototypes build off, so Collections, Friends and the
// challenge page come from there rather than being drawn again.
import { AllBadges } from '../web-app/components/AllBadges'
import { Friends } from '../web-app/components/Friends'
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
import {
  BENNY_PICKS,
  bookByTitle,
  getBook,
  getBooks,
  getSessions,
  readNowPartner,
  READER,
  SHELF_SEED,
} from './data'
import './index.css'

let _uid = 0

export function App() {
  // `tab` is the nav tab; `sub` is a page layered over it (a book, the browse
  // page, a list) that replaces the main column without leaving the tab.
  const [tab, setTab] = useStickyState('books:tab', 'log')
  // Which pane of My Reading. Discover and the Wish List are panes of it rather than
  // tabs of their own: everything the reader keeps — what they logged, what
  // they saved, what they're looking for next — is one place in the nav.
  const [logTab, setLogTab] = useStickyState('books:log-tab', 'discover')
  const [sub, setSub] = useState(null)
  const [challenge, setChallenge] = useState(null)
  const [browseInit, setBrowseInit] = useState(null) // { query?, filter? } seeded into Browse
  const [list, setList] = useState(null) // a Discover list shown in full on its own page
  const [shelf, setShelf] = useState(() => ({ ...SHELF_SEED }))
  const { toasts, push, dismiss } = useToasts()
  const [reviewsByBook, setReviewsByBook] = useState({})
  /* The reader's own sessions, per book — seeded from the fixture the first
     time one is corrected or taken back, so an untouched title still reads
     straight off the data. */
  const [sessionsByBook, setSessionsByBook] = useState({})
  const [badge, setBadge] = useState(null) // { id } of the just-finished book | null
  const [nowPlaying, setNowPlaying] = useState(null) // bookId being listened to | null
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [flowOpen, setFlowOpen] = useState(false)
  /* The title the log flow opens on, if it was opened from a book rather than
     from the Log Reading button. Held as the flow's own book shape. */
  const [logBook, setLogBook] = useState(null)
  const [profileId, setProfileId] = useState(null) // friend whose profile is open
  /* The site's integrations, as a school would actually find them: the two it
     is subscribed to are on, and the two it isn't are off until someone turns
     them on in Settings. Audiobooks is off by default — a school that hasn't
     bought audio shouldn't be offering a "Great on audio" shelf full of books
     its readers can't listen to. */
  const [settings, setSettings] = useState({
    /* The engine's four sources plus this app's two, as a school would actually
       find them: what it has is on, what it hasn't bought is off until someone
       turns it on. Audiobooks is off for the same reason — a school without
       audio shouldn't be offering a "Great on audio" shelf its readers can't
       listen to. */
    comicsplus: true,
    scholastic: false,
    sora: true,
    libby: false,
    library: true,
    classroom: true,
    audiobooks: false,
  })
  const toggleSetting = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }))

  const top = () => window.scrollTo({ top: 0 })

  /* Discover's catalog and the log flow's are two different fixtures with two
     different shapes, so a book crossing over is translated rather than passed.
     A title the log's own catalog already carries wins: it knows what that book
     measures and how long it is, which this one doesn't say. */
  const toLogBook = (b) => {
    /* The log's own record where it has one — it knows what the title measures
       and how long it is, which this catalog doesn't say. */
    const base = LOG_FIXTURES.books[b.id] ?? {
      id: b.id,
      title: b.title,
      author: b.author,
      cover: [b.color || '#ACACAC'],
      coverId: b.coverId,
      isbn: b.isbn,
      kind: b.kind,
      masthead: b.masthead,
      issue: b.issue,
      measure: 'minutes',
      pages: b.pageCount,
    }
    /* Which app can open it, so a tile in the log offers the same "Read in …"
       and wears the same dot as the same jacket on the shelves outside it. */
    const via = readNowPartner(b, settings)
    return via ? { ...base, partner: via } : base
  }

  /* One set of recommendations. The log flow ships its own `bennyPicks` for the
     prototypes that have no catalog of their own; this one does, and two
     Bennys with two opinions in one app is one too many. The log's catalog is
     widened with whatever those picks are, since it doesn't carry them all. */
  const bennyBooks = getBooks(BENNY_PICKS)
  const logCatalog = {
    ...LOG_FIXTURES.books,
    ...Object.fromEntries(bennyBooks.map((b) => [b.id, toLogBook(b)])),
  }

  /* `finished` comes from the partner reader's last page: the form opens with
     the answer already given, and the reader confirms it. */
  const [logFinished, setLogFinished] = useState(false)
  const openLog = (b, { finished = false } = {}) => {
    setLogBook(b ? toLogBook(b) : null)
    setLogFinished(finished)
    setFlowOpen(true)
  }

  /* The Reading Log pane draws the log itself rather than going through
     `renderLogTab`, so a sub-page opened from it has nowhere to render. It
     belongs to Discover anyway — which is what its Back link has always
     said. */
  const intoDiscover = () => logTab === 'log' && setLogTab('discover')

  const open = (id) => {
    /* Where the back link goes. Discover and the Wish List are panes of My Reading
       rather than nav tabs, so what a book was opened from is the pane, not
       `tab` — which now says `log` whichever of them you were on. */
    setSub((v) => ({ name: 'book', id, from: v?.name === 'book' ? v.from : (v?.name ?? logTab) }))
    intoDiscover()
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
    intoDiscover()
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
    intoDiscover()
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
  /* Saving a book is the one action on this app with no visible result: the
     bookmark fills in and the book goes somewhere the reader isn't looking. The
     toast is what closes that loop — it names the book, says where it went, and
     offers the way there. Taking one back says so too, or "undo" is the only
     way to tell the tap registered. */
  const toggleWant = (id) => {
    /* The status it had, not just whether it had one: a book taken off the
       shelf could have been on it as want, reading or finished, and an undo
       that put everything back as `want` would quietly lose the difference. */
    const was = shelf[id] ?? null
    setStatus(id, was ? null : 'want')
    const book = getBook(id)
    if (!book) return
    push(
      was
        ? {
            title: 'Taken off your Wish List',
            body: book.title,
            tone: 'info',
            action: { label: 'Undo', onClick: () => setStatus(id, was) },
          }
        : {
            title: 'Added to your Wish List',
            body: book.title,
            action: {
              label: 'View',
              onClick: () => {
                setSub(null)
                setTab('log')
                setLogTab('shelf')
              },
            },
          },
    )
  }
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

  const addReview = (bookId, { stars, body, image }) =>
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
          image,
          date: 'Just now',
          helpful: 0,
          verified: true,
          /* `Review::INITIAL_STATE`. A review is pending until staff approve
             it, unless the site has `auto_approve_review?` on — so the one you
             just wrote is on your page and nobody else's, and says so. */
          state: 'pending',
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

  /* The panes of My Reading, beside the reading log itself. No Reviews pane:
     a review belongs to a book, and this prototype gives every book a page with
     a Reviews tab on it — a second, bookless list of the same writing was two
     places to look for one thing. */
  const LOG_TABS = [
    { id: 'discover', label: 'Discover' },
    { id: 'shelf', label: 'Wish List', count: shelfIds.size || undefined },
  ]

  /* The log flow asks `connections` which partners this reader can open a title
     in. This app has no linked accounts — it has the site's title sources — so
     the two are the same question asked twice. */
  const openableHere = Object.fromEntries(
    ['comicsplus', 'scholastic', 'sora', 'libby']
      .filter((id) => settings[id])
      .map((id) => [id, true]),
  )
  // The title being read in a partner's app, and which app that is.
  const [reading, setReading] = useState(null)

  /* The book page wears the book, and the ground it wears it on is the whole
     page area — so the value lives on `.bk-root`, above `.wa-main`, rather than
     on the book page itself where it could only tint as far as the card. The
     colour is read off the jacket, not off the catalog's placeholder `color`. */
  const openedBook = sub?.name === 'book' ? getBook(sub.id) : null
  const pageTheme = useCoverColor(openedBook)

  /* A book, a search and a list are pages *of* Discover, not replacements for
     it: opening one used to take the My Reading sub-tabs off the screen with
     it, so the reader lost the bar that said where they were. They render as
     the active pane's content instead, under the bar, and `sub.from` still
     decides where Back goes. */
  const subPage =
    sub?.name === 'browse' ? (
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
        onLog={openLog}
        onPlay={setNowPlaying}
        onOpen={open}
        onOpenProfile={setProfileId}
        onBack={back}
        backLabel={
          sub.from === 'shelf'
            ? 'Back to your Wish List'
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

  const renderLogTab = (id) => {
    // A pane with a book, a search or a list open shows that instead — the
    // sub-tabs above it stay, and stay on the pane you opened it from.
    if (subPage) return subPage
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
          settings={settings}
          shelf={shelf}
          onOpen={open}
          onWish={toggleWant}
          onDiscover={() => setLogTab('discover')}
        />
      )
    return null
  }

  /* The challenge page is the one thing that really does replace the column —
     it belongs to the Challenges tab, not to a pane of My Reading. */
  const page = challenge ? <ChallengePage challenge={challenge} entries={READING_LOG} /> : null

  return (
    <div className="bk-root" style={pageTheme ? { '--bk-theme': pageTheme } : undefined}>
      {/* Which title sources this site has turned on is a reviewer's switch, not
          a reader's — the real app has no such control. It sat as a cog beside
          Discover's search, where it read as product; it belongs on the preview
          bar with the rest of the demo chrome. */}
      <PreviewBar
        title="Book Discovery"
        actions={
          <button type="button" onClick={() => setSettingsOpen(true)}>
            <Icon name="settings" size={15} /> Title sources
          </button>
        }
      />

      <Dashboard
        streak={STREAK}
        dailyGoal={DAILY_GOAL}
        onLog={() => openLog(null)}
        connections={{}}
        /* No partner-linking surface here — this prototype is about the catalog,
           and the connect banner belongs to the ones that are about linking. */
        partners={[]}
        view={tab}
        onView={goTab}
        ownTabs={['badges', 'friends']}
        /* Leaderboards lives under Friends. Reviews has no tab at all here —
           this prototype puts them on the book they're about. */
        hideTabs={['leaderboards', 'reviews']}
        /* A logged title goes to that book's own page — the log names a title
           and this prototype is the one that has a page for it. */
        onOpenBook={(b) => open(b.id)}
        bookFor={bookByTitle}
        logTabs={LOG_TABS}
        logTab={logTab}
        /* Moving between the panes leaves whatever was layered over this one:
           a book opened from Discover is still on screen when you press Wish
           List, so the press looked like it did nothing. */
        onLogTab={(id) => {
          setSub(null)
          setLogTab(id)
        }}
        renderLogTab={renderLogTab}
        renderExtra={renderTab}
        onOpenChallenge={setChallenge}
        page={page}
      />

      <LogFlow
        open={flowOpen}
        onClose={() => {
          setFlowOpen(false)
          setLogBook(null)
          setLogFinished(false)
        }}
        /* Which apps can open a title, which here is just the site's own
           switches — so a jacket carries the same dot in the log flow as it
           does on the Discover shelves. It was `{}`, and Dog Man came up marked
           on one screen and unmarked on the next. */
        connections={openableHere}
        onReadInPartner={(b) => setReading({ book: b, partner: b.partner })}
        partners={[]}
        {...LOG_FIXTURES}
        /* After the spread on purpose: these two replace what `LOG_FIXTURES`
           brings, and above it they were silently overwritten by it. */
        books={logCatalog}
        bennyPicks={BENNY_PICKS}
        book={logBook}
        startFinished={logFinished}
        /* Confirming a finished log is what actually moves the book on the
           shelf — the reader reaching the last page no longer does it alone. */
        onLogged={(entry) => {
          if (entry.finished && entry.book?.id && getBook(entry.book.id)) finishBook(entry.book.id)
        }}
        /* Benny's recommendation on the finished screen goes on the same Wish
           List as every other save. A title this catalog has no page for still
           gets its confirmation — it just can't offer a way there. */
        onAddToWishlist={(b) =>
          getBook(b.id)
            ? toggleWant(b.id)
            : push({ title: 'Added to your Wish List', body: b.title })
        }
      />

      {reading && (
        <ReadNow
          book={reading.book}
          partner={reading.partner}
          onClose={() => setReading(null)}
          /* The last page hands off to the log form, the same as the book
             page's own reader does. */
          onFinish={() => {
            setReading(null)
            openLog(getBook(reading.book.id) ?? reading.book, { finished: true })
          }}
        />
      )}

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
      {/* Mounted once for the app — the stack is `position: fixed`, so one per
          page rather than one per thing that can raise a toast. */}
      <ToastStack toasts={toasts} onDismiss={dismiss} />

      <PrototypeNav currentHref="/bs-prototypes/books/" />
    </div>
  )
}
