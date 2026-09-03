import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { AppShell } from '@components/AppShell/AppShell'
import { PreviewBar } from '@components/PreviewBar/PreviewBar'

// The reader half runs on the real logging surfaces — logging-flow's dashboard
// and its combined-logging flow — rather than a lookalike, so the unlock lands
// exactly where a reader would actually be standing. Both take the vocabulary
// layer through optional props they already support for this kind of add-on.
import { Dashboard } from '../logging-flow/components/Dashboard'
import { LogFlow } from '../logging-flow/components/LogFlow'

import { WordUnlock } from './components/WordUnlock'
import { Collections } from './components/Collections'
import { ClassroomPage } from './components/ClassroomPage'
import { StudentWords } from './components/StudentWords'
import { WordsRailCard } from './components/WordsRailCard'
import {
  BOOKS,
  RECENTLY_LOGGED,
  SEED_COLLECTION,
  STREAK,
  DAILY_GOAL,
  UNLOCK_EVERY,
  pickWord,
} from './data'

import './index.css'

// This prototype is about words, not account linking, so it opts out of
// logging-flow's partner-integration surface entirely: no connect banner, no
// topbar app switcher, no "logged for you" card, no App Integrations settings,
// and no partner badge on a search result. The partner-catalog titles stay —
// they're just books you can log, and several of them carry words.
const NO_PARTNERS = {
  partners: [],
  connections: {},
  onLinkPartner: () => {},
  onDisconnectPartner: () => {},
  onVisitPartner: () => {},
}

// …and its own catalog, so the shelf is ordinary library books rather than
// logging-flow's Comics Plus titles and Scholastic magazine issues.
const OWN_BOOKS = { books: BOOKS, recentlyLogged: RECENTLY_LOGGED }

// `short` is what the preview bar's strip swaps to before it would overflow.
const VIEWS = [
  { id: 'log', label: 'Reader · Log Reading', short: 'Log', icon: 'book' },
  { id: 'words', label: 'Reader · My Collections', short: 'Collections', icon: 'vocabulary' },
  { id: 'educator', label: 'Educator · Classroom', short: 'Educator', icon: 'chart-bar' },
]

// The admin section a classroom actually lives in — same nav shape the SfR
// prototype uses for "Classes and Readers".
const EDU_NAV = [
  { id: 'classes', label: 'Classes', icon: 'demographics' },
  { id: 'students', label: 'Students', icon: 'person' },
  { id: 'staff', label: 'Staff', icon: 'person' },
  { id: 'groups', label: 'Groups', icon: 'overview' },
]

export function App() {
  const [view, setView] = useState('log')

  // ── Reader state ──────────────────────────────────────────────────────────
  const [flowOpen, setFlowOpen] = useState(false)
  const [streak, setStreak] = useState(STREAK)
  const [dailyGoal, setDailyGoal] = useState(DAILY_GOAL)
  const [collection, setCollection] = useState(SEED_COLLECTION)
  const [newestWord, setNewestWord] = useState(null)

  // A word surfaces every UNLOCK_EVERY logs — "periodically", not every time.
  // Seeded one short of the interval so the first log in a demo unlocks a word.
  const [logsSinceWord, setLogsSinceWord] = useState(UNLOCK_EVERY - 1)
  const [pending, setPending] = useState(null) // { word, bookId } waiting to be opened
  const [unlockOpen, setUnlockOpen] = useState(false)

  // Which dashboard tab the reader is on. Driven from here so the toolbar can
  // deep-link to Collections, and so the unlock can hand off to it.
  const [readerTab, setReaderTab] = useState('challenges')

  const [openStudent, setOpenStudent] = useState(null)

  function handleLogged(entry) {
    setStreak((s) => ({ ...s, current: Math.max(s.current, 1) }))
    if (entry.measure === 'minutes' && entry.minutes) {
      setDailyGoal((g) => ({ ...g, minutes: g.minutes + entry.minutes }))
    }

    const due = logsSinceWord + 1 >= UNLOCK_EVERY
    if (!due) {
      setLogsSinceWord((n) => n + 1)
      setPending(null)
      return
    }

    const bookId = entry.book?.id ?? null
    const word = pickWord(
      bookId,
      collection.map((e) => e.word),
    )
    if (!word) {
      // Every word in the prototype is already collected — no unlock to offer.
      setPending(null)
      return
    }
    setLogsSinceWord(0)
    setPending({ word, bookId: word.bookId ?? null })
  }

  function openWord() {
    setFlowOpen(false)
    setUnlockOpen(true)
  }

  function collectWord({ word, bookId, firstTry }) {
    setCollection((c) => [...c, { word, bookId, date: '2026-06-28', firstTry }])
    setNewestWord(word)
  }

  function closeUnlock() {
    setUnlockOpen(false)
    setPending(null)
  }

  function seeAllWords() {
    closeUnlock()
    setReaderTab('collections')
    setView('words')
  }

  // The two reader views are the same page — just a different tab on it.
  const readerView = view === 'words' ? 'collections' : readerTab

  return (
    <div className="wb-root">
      {/* Dev/preview bar — walk the loop: log → unlock → collect → report */}
      <PreviewBar
        title="Words with Benny"
        views={VIEWS}
        active={view}
        onChange={(id) => {
          setView(id)
          if (id === 'log') setReaderTab('challenges')
          if (id === 'words') setReaderTab('collections')
        }}
      />

      <div className="wb-stage">
        {view === 'educator' ? (
          <div className="wb-edu-shell">
            <AppShell
              sidebar={{
                title: 'Classes and Readers',
                subtitle: 'Find and log for students and classes.',
                nav: EDU_NAV,
                active: 'classes',
                onNavigate: () => {},
                mainRailIndex: 3,
              }}
              backBar={{ label: 'Back to Classes', onClick: () => {} }}
              contentClassName="ew-content"
            >
              <ClassroomPage onOpenStudent={setOpenStudent} />
            </AppShell>
          </div>
        ) : (
          <Dashboard
            streak={streak}
            dailyGoal={dailyGoal}
            onLog={() => setFlowOpen(true)}
            {...NO_PARTNERS}
            view={readerView}
            onView={(id) => {
              setReaderTab(id)
              setView(id === 'collections' ? 'words' : 'log')
            }}
            // Collections supersedes the built-in "All Badges" tab — words,
            // badges and achievements are one destination, not three.
            extraTabs={[{ id: 'collections', label: 'My Collections' }]}
            hideTabs={['badges']}
            renderExtra={() => <Collections collection={collection} newestWord={newestWord} />}
            railTop={
              <WordsRailCard
                collection={collection}
                logsSinceWord={logsSinceWord}
                onOpen={() => {
                  setReaderTab('collections')
                  setView('words')
                }}
              />
            }
          />
        )}
      </div>

      <LogFlow
        open={flowOpen}
        onClose={() => setFlowOpen(false)}
        onLogged={handleLogged}
        onOpenWord={pending ? openWord : undefined}
        {...NO_PARTNERS}
        {...OWN_BOOKS}
      />

      <WordUnlock
        open={unlockOpen}
        word={pending?.word}
        bookId={pending?.bookId}
        collectedCount={collection.length}
        onCollect={collectWord}
        onClose={closeUnlock}
        onSeeAll={seeAllWords}
      />

      <StudentWords studentId={openStudent} onClose={() => setOpenStudent(null)} />

      <PrototypeNav currentHref="/bs-prototypes/words-with-benny/" />
    </div>
  )
}
