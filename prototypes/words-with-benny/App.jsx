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
import { MyWords } from './components/MyWords'
import { EducatorWords } from './components/EducatorWords'
import { StudentWords } from './components/StudentWords'
import { WordsRailCard } from './components/WordsRailCard'
import { READER, SEED_COLLECTION, STREAK, DAILY_GOAL, UNLOCK_EVERY, pickWord } from './data'

import './index.css'

// `short` is what the preview bar's strip swaps to before it would overflow.
const VIEWS = [
  { id: 'log', label: 'Reader · Log Reading', short: 'Log', icon: 'book' },
  { id: 'words', label: 'Reader · My Words', short: 'My Words', icon: 'vocabulary' },
  { id: 'educator', label: 'Educator · Vocabulary', short: 'Educator', icon: 'chart-bar' },
]

const EDU_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'overview' },
  { id: 'vocabulary', label: 'Vocabulary', icon: 'book' },
  { id: 'habits', label: 'Reading Habits', icon: 'habits' },
  { id: 'students', label: 'Students', icon: 'person' },
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
  // deep-link to My Words, and so the unlock can hand off to it.
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
    setReaderTab('words')
    setView('words')
  }

  // The two reader views are the same page — just a different tab on it.
  const readerView = view === 'words' ? 'words' : readerTab

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
          if (id === 'words') setReaderTab('words')
        }}
      />

      <div className="wb-stage">
        {view === 'educator' ? (
          <div className="wb-edu-shell">
            <AppShell
              sidebar={{
                title: 'Insights',
                subtitle: 'Lincoln Middle School',
                nav: EDU_NAV,
                active: 'vocabulary',
                onNavigate: () => {},
                mainRailIndex: 1,
              }}
              contentClassName="ew-content"
            >
              <EducatorWords onOpenStudent={setOpenStudent} />
            </AppShell>
          </div>
        ) : (
          <Dashboard
            streak={streak}
            dailyGoal={dailyGoal}
            onLog={() => setFlowOpen(true)}
            connections={{}}
            onLinkPartner={() => {}}
            onDisconnectPartner={() => {}}
            onVisitPartner={() => {}}
            view={readerView}
            onView={(id) => {
              setReaderTab(id)
              setView(id === 'words' ? 'words' : 'log')
            }}
            extraTabs={[{ id: 'words', label: 'My Words', count: collection.length }]}
            renderExtra={() => (
              <MyWords collection={collection} reader={READER} newestWord={newestWord} />
            )}
            railTop={
              <WordsRailCard
                collection={collection}
                logsSinceWord={logsSinceWord}
                onOpen={() => {
                  setReaderTab('words')
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
        connections={{}}
        onOpenWord={pending ? openWord : undefined}
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
