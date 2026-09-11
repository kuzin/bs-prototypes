import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { PreviewBar } from '@components/PreviewBar/PreviewBar'

// The reader half runs on the real logging surfaces — logging-flow's dashboard
// and its combined-logging flow — rather than a lookalike, so the unlock lands
// exactly where a reader would actually be standing. Both take the vocabulary
// layer through optional props they already support for this kind of add-on.
import { Dashboard } from '../logging-flow/components/Dashboard'
import { LogFlow } from '../logging-flow/components/LogFlow'

import { WordUnlock } from './components/WordUnlock'
import { Flashcards } from './components/Flashcards'
import { Collections } from './components/Collections'
// The real classroom page, straight out of the Student Profile prototype.
import { ClassroomView } from '../student-profile/BeanstackProfile'
import '../student-profile/BeanstackProfile.css'
import { EducatorWords } from './components/EducatorWords'
import { StudentProfilePanel } from './components/StudentProfilePanel'
import {
  ACTIVITY_TYPES,
  BOOKS,
  RECENTLY_LOGGED,
  SEED_COLLECTION,
  STREAK,
  DAILY_GOAL,
  TODAY,
  UNLOCK_EVERY,
  gradeCard,
  newCard,
  pickWord,
  seedReviews,
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

export function App() {
  const [view, setView] = useState('log')

  // ── Reader state ──────────────────────────────────────────────────────────
  const [flowOpen, setFlowOpen] = useState(false)
  const [streak, setStreak] = useState(STREAK)
  const [dailyGoal, setDailyGoal] = useState(DAILY_GOAL)
  const [collection, setCollection] = useState(SEED_COLLECTION)
  const [newestWord, setNewestWord] = useState(null)

  // Where the review deck has every collected word. Collecting a word adds it
  // at box 1; flipping through the deck moves it up or back.
  const [cards, setCards] = useState(() => seedReviews(SEED_COLLECTION))
  const [deckOpen, setDeckOpen] = useState(false)

  // Anything the reader writes in the "write your own" activity, so the
  // educator's review queue shows their own sentence rather than only seeded
  // ones — the loop the writing activity is pointless without.
  const [written, setWritten] = useState([])

  // A demo control, not product: which activity the unlock runs. `auto` is the
  // real behaviour — the word's own three — and the rest force one type so a
  // single activity can be shown on its own.
  const [demoActivity, setDemoActivity] = useState('auto')

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

  function collectWord({ word, bookId, firstTry, written: sentence, flagged }) {
    setCollection((c) => [...c, { word, bookId, date: TODAY, firstTry }])
    setCards((m) => ({ ...m, [word]: newCard(word) }))
    setNewestWord(word)
    if (sentence) {
      setWritten((w) => [
        {
          student: 'olivia',
          word,
          bookId,
          text: sentence,
          status: flagged ? 'flagged' : 'accepted',
          date: TODAY,
        },
        ...w,
      ])
    }
  }

  function gradeWord(word, knewIt) {
    setCards((m) => ({ ...m, [word]: gradeCard(m[word], knewIt) }))
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
        actions={
          <select
            className="wb-actpick"
            value={demoActivity}
            onChange={(e) => setDemoActivity(e.target.value)}
            aria-label="Which activity the next unlock runs"
          >
            <option value="auto">Activities · full round</option>
            {ACTIVITY_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                Activities · {t.label}
              </option>
            ))}
          </select>
        }
      />

      <div className="wb-stage">
        {view === 'educator' ? (
          // Vocabulary is a tab on Beanstack's real classroom page, added
          // through the additive `extraTabs`/`renderExtra` slots rather than by
          // cloning the page.
          <div className="wb-edu-shell">
            <ClassroomView
              onStudentClick={setOpenStudent}
              extraTabs={[{ id: 'vocabulary', label: 'Vocabulary' }]}
              renderExtra={() => <EducatorWords onOpenStudent={setOpenStudent} written={written} />}
            />
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
            // The Reading Log's "All Titles" tab is part of the real page, so
            // it stays on screen — it just doesn't lead anywhere here.
            titlesView={false}
            renderExtra={() => (
              <Collections
                collection={collection}
                newestWord={newestWord}
                cards={cards}
                onReview={() => setDeckOpen(true)}
              />
            )}
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
        round={demoActivity === 'auto' ? undefined : [demoActivity]}
        onCollect={collectWord}
        onClose={closeUnlock}
        onSeeAll={seeAllWords}
      />

      <Flashcards
        open={deckOpen}
        cards={cards}
        collection={collection}
        onGrade={gradeWord}
        onClose={() => setDeckOpen(false)}
      />

      <StudentProfilePanel studentId={openStudent} onClose={() => setOpenStudent(null)} />

      <PrototypeNav currentHref="/bs-prototypes/words-with-benny/" />
    </div>
  )
}
