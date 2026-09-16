import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { PreviewBar } from '@components/PreviewBar/PreviewBar'
import { useStickyState } from '@components/useStickyState/useStickyState'

import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'
import '@components/ProgressBar/ProgressBar.css'
import '@components/Modal/Modal.css'
import '@components/Hero/Hero.css'
import '@components/PrototypeNav/PrototypeNav.css'

import { LogFlow } from '@components/LogFlow/LogFlow'

/* The review deck's own scheduling — Leitner boxes, shared with the prototype
   the deck comes from. Nothing in it knows whose words it is holding. */
import { seedReviews, newCard, gradeCard } from '../words-with-benny/data'

import { TeacherSetup } from './components/TeacherSetup'
import { Destination } from './components/Destination'
import { ChallengeDashboard } from './components/ChallengeDashboard'
import { Collections } from './components/Collections'
import { PathPickerModal } from './components/PathPickerModal'
import { TitleReader } from './components/TitleReader'
import { ActivityModal } from './components/ActivityModal'
import { BadgeCelebration } from './components/BadgeCelebration'
/* The word-unlock round, from the vocabulary mocks — Benny hands the word over
   and the reader banks it by working through three short activities on it.
   Same component, same round; the words are this challenge's. */
import { WordUnlock } from '../words-with-benny/components/WordUnlock'
import '../words-with-benny/components/WordUnlock.css'
import '../words-with-benny/components/Activities.css'
import {
  PATHS,
  PATH_BY_ID,
  SEED,
  SITE,
  DESTINATION,
  BADGE_ART,
  wordWaitingFor,
  wordCollection,
  logBooksForPath,
  logListForPath,
} from './data'
import './index.css'

// `short` is what the preview bar's strip swaps to before it would overflow.
const VIEWS = [
  { id: 'teacher', label: 'Teacher · Set Destination', short: 'Teacher', icon: 'flag' },
  { id: 'challenges', label: 'Student · Challenges', short: 'Challenges', icon: 'trophy' },
  { id: 'student', label: 'Student · My Path', short: 'My Path', icon: 'route' },
  { id: 'collections', label: 'Student · Collections', short: 'Collections', icon: 'star' },
]

/* What finishing a title on a path earns: its own reading badge. One card
   rather than one per title — the flow asks for this before it knows which
   title is being logged. */
const EARNED_CARDS = [
  {
    id: 'pyp-reading',
    label: 'Badge Earned',
    eyebrow: 'Reading Badge',
    title: 'Finish a title on your path',
    description: DESTINATION.title,
    art: BADGE_ART.reading,
  },
]

// Who the flow logs for.
const READER = {
  id: 'maya',
  name: SITE.student.firstName,
  initials: SITE.student.initials,
  color: '#F09A77',
}

export function App() {
  const [view, setView] = useStickyState('pick-your-path:view', 'teacher')
  const [pickerOpen, setPickerOpen] = useState(false) // path picker over the dashboard
  const [readingTitle, setReadingTitle] = useState(null) // title open in the in-app reader
  const [offered, setOffered] = useState(PATHS.map((p) => p.id))
  const [chosenPathId, setChosenPathId] = useState(SEED.chosenPathId)
  const [readIds, setReadIds] = useState(SEED.readTitleIds)
  // When each title went on the log — a challenge log has to say when.
  const [loggedOn, setLoggedOn] = useState(SEED.loggedOn)
  const [doneIds, setDoneIds] = useState(SEED.doneActivityIds)
  const [responses, setResponses] = useState({})
  const [streak] = useState(SEED.streak)
  const [openAct, setOpenAct] = useState(null) // activity object shown in the modal
  const [viewing, setViewing] = useState(null) // a badge the student tapped to look at
  const [logOpen, setLogOpen] = useState(false) // the reader's log-reading flow
  const [logBook, setLogBook] = useState(null) // the title it was opened on, if any
  const [wordWon, setWordWon] = useState(null) // { word, book } a log turned up
  // The words the reader has banked — turned up by a log, kept by the round.
  const [collected, setCollected] = useState(SEED.collectedWords)
  /* The review deck — Leitner boxes, one card per collected word. A word banked
     enters at box 1 and moves up each time the reader says they knew it. */
  const [cards, setCards] = useState(() =>
    seedReviews(
      wordCollection(PATH_BY_ID[SEED.fallbackPathId], SEED.collectedWords, SEED.loggedOn),
    ),
  )
  const [newestWord, setNewestWord] = useState(null)
  // Which tab the student's own page is on, so a word round can land on it.
  const [challengeTab, setChallengeTab] = useStickyState('pick-your-path:challenge-tab', 'overview')

  // The dev switcher can jump straight to the student's own page before a path
  // has been picked; it shows the first one on offer until they do.
  const path = PATH_BY_ID[chosenPathId ?? SEED.fallbackPathId]

  /* NOTE: there is no badge *celebration*. Every way of earning one now ends
     on a screen that already names it — the log flow's success card, the
     activity card's own "Badge earned" line — so the badge modal is reserved
     for the one thing it is actually for: opening a badge you tapped. */

  function togglePath(id) {
    setOffered((cur) =>
      cur.includes(id) ? (cur.length > 1 ? cur.filter((p) => p !== id) : cur) : [...cur, id],
    )
  }

  function choosePath(id) {
    const p = PATH_BY_ID[id]
    setChosenPathId(id)
    // The proposal's "2 of 3 read", and — on every path — one word still hiding.
    const seeded = [p.titles[0].id, p.titles[2].id]
    setReadIds(seeded)
    setLoggedOn({ [seeded[0]]: 'April 18, 2026', [seeded[1]]: 'April 27, 2026' })
    setCollected(p.titles[0].words.concat(p.titles[2].words).slice(0, 3))
    setDoneIds([])
    setResponses({})
    setPickerOpen(false)
    setView('student')
  }

  /* The site nav's two live tabs. `badges` is the app's id for Collections. */
  const goNav = (id) => setView(id === 'badges' ? 'collections' : 'challenges')

  // Today, the way the app writes a log date.
  const today = () =>
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  /* Marking a title read is the whole engine: it moves the reading badge, it
     may finish the path, and it unlocks whichever of the four words that title
     was hiding. One place does all three, whichever button got here. */
  function markRead(titleId, { at } = {}) {
    if (readIds.includes(titleId)) return null
    const title = path.titles.find((t) => t.id === titleId)
    setReadIds((ids) => [...ids, titleId])
    setLoggedOn((m) => ({ ...m, [titleId]: at ?? today() }))
    // What this title was hiding that the reader hasn't banked yet. Logging
    // turns it up; the round is what keeps it.
    return title ? wordWaitingFor(path, title, collected) : null
  }

  /* The reader's log-reading flow — the shared one, on this path's own shelf.
     `onOpenWord` is what turns a finished title into a word: the flow's success
     step offers it, and pressing it hands the word over. */
  function openLog(title) {
    setLogBook(title ? logBooksForPath(path)[title.id] : null)
    setLogOpen(true)
  }

  function handleLogged(session) {
    const title = path.titles.find((t) => t.title === session.book?.title)
    if (!title) return
    const won = markRead(title.id)
    // Held for the flow's own "Unlock My Word" button, which fires next.
    setWordWon(won ? { word: won, book: title, pending: true } : null)
  }

  // The round banks it. Everything that says "found" reads off this, and the
  // word enters the review deck at box 1 — it has never been looked at again.
  function collectWord({ word }) {
    setCollected((ws) => (ws.includes(word) ? ws : [...ws, word]))
    setCards((m) => (m[word] ? m : { ...m, [word]: newCard(word) }))
    setNewestWord(word)
  }

  // A card graded in the deck moves up a box, or back to the first.
  function gradeWord(word, knewIt) {
    setCards((m) => ({ ...m, [word]: gradeCard(m[word], knewIt) }))
  }

  // Finishing in the in-app reader logs the title, same as pressing Log.
  function logFromReader(titleId) {
    setReadingTitle(null)
    const won = markRead(titleId)
    if (won) setWordWon({ word: won, book: path.titles.find((t) => t.id === titleId) })
  }

  /* **Log** on a title opens the flow on that title; un-ticking one that's
     already read just takes it off the log. */
  function toggleRead(titleId) {
    if (!readIds.includes(titleId)) {
      openLog(path.titles.find((t) => t.id === titleId))
      return
    }
    setReadIds((ids) => ids.filter((id) => id !== titleId))
    setLoggedOn((m) => {
      const copy = { ...m }
      delete copy[titleId]
      return copy
    })
  }

  function completeActivity(text) {
    if (!openAct) return
    const actId = openAct.id
    setDoneIds((ids) => (ids.includes(actId) ? ids : [...ids, actId]))
    setResponses((r) => ({ ...r, [actId]: text }))
    setOpenAct(null)
  }

  function reset() {
    setOffered(PATHS.map((p) => p.id))
    setChosenPathId(SEED.chosenPathId)
    setReadIds(SEED.readTitleIds)
    setLoggedOn(SEED.loggedOn)
    setDoneIds(SEED.doneActivityIds)
    setResponses({})
    setOpenAct(null)
    setViewing(null)
    setLogOpen(false)
    setLogBook(null)
    setWordWon(null)
    setCollected(SEED.collectedWords)
    setCards(
      seedReviews(
        wordCollection(PATH_BY_ID[SEED.fallbackPathId], SEED.collectedWords, SEED.loggedOn),
      ),
    )
    setNewestWord(null)
    setChallengeTab('overview')
    setPickerOpen(false)
    setReadingTitle(null)
    setView('teacher')
  }

  return (
    <div className="pyp-app">
      {/* Dev / preview bar — switch between the three screens */}
      <PreviewBar
        title="Pick Your Path"
        views={VIEWS}
        active={view}
        onChange={setView}
        actions={
          <button type="button" onClick={reset}>
            <Icon name="refresh" size={13} /> Reset
          </button>
        }
      />

      {view === 'teacher' && <TeacherSetup offered={offered} onTogglePath={togglePath} />}

      {view === 'challenges' && (
        <ChallengeDashboard
          streak={streak}
          chosen={chosenPathId ? path : null}
          offered={offered}
          /* Pressing the challenge opens its preview — `_join_challenge`, which
             is where this challenge's paths are offered. Once one is chosen
             there is nothing left to preview, so the card goes straight in. */
          onOpen={() => (chosenPathId ? setView('student') : setPickerOpen(true))}
          onNav={goNav}
          onLog={() => openLog()}
        />
      )}

      {/* The reader's own shelf — badges, and every word they have banked. */}
      {view === 'collections' && (
        <Collections
          path={path}
          readIds={readIds}
          doneIds={doneIds}
          collected={collected}
          loggedOn={loggedOn}
          cards={cards}
          newestWord={newestWord}
          onGrade={gradeWord}
          onNav={goNav}
          onLog={() => openLog()}
        />
      )}

      {/* Picking a path is the modal now — there's no separate picker screen */}
      {view === 'student' && (
        <Destination
          path={path}
          readIds={readIds}
          doneIds={doneIds}
          responses={responses}
          streak={streak}
          loggedOn={loggedOn}
          onToggleRead={toggleRead}
          onReadTitle={setReadingTitle}
          onOpenActivity={setOpenAct}
          collected={collected}
          onOpenBadge={setViewing}
          tab={challengeTab}
          onTab={setChallengeTab}
          onChangePath={() => setPickerOpen(true)}
          onNav={goNav}
          onLog={() => openLog()}
        />
      )}

      {readingTitle && (
        <TitleReader
          title={readingTitle}
          path={path}
          onLog={() => logFromReader(readingTitle.id)}
          onClose={() => setReadingTitle(null)}
        />
      )}

      <PathPickerModal
        open={pickerOpen}
        offered={offered}
        chosenPathId={chosenPathId}
        onChoose={choosePath}
        onClose={() => setPickerOpen(false)}
      />

      {/* The reader's log-reading flow — the shared one, searching this path's
          own shelf. Pressing **Log** on a title opens it on that title's form;
          the bar's **Log Reading** opens it on the search. */}
      <LogFlow
        open={logOpen}
        book={logBook}
        onClose={() => setLogOpen(false)}
        onLogged={handleLogged}
        books={logBooksForPath(path)}
        recentlyLogged={path.titles.slice(0, 5).map((t) => t.id)}
        readingList={logListForPath(path, readIds)}
        logType="page"
        reader={READER}
        site={{ name: SITE.school }}
        /* `completed_summary_earnables` — what finishing a title wins *here*.
           The flow's own fixture credits a challenge this site has never run. */
        earnedCards={EARNED_CARDS}
        /* The end of the loop: a finished title was hiding one of the four
           words, and this is the button that hands it over. */
        onOpenWord={
          wordWon?.pending
            ? () => {
                setLogOpen(false)
                setWordWon((w) => ({ ...w, pending: false }))
              }
            : undefined
        }
      />

      {/* The unlock round from the vocabulary mocks: Benny hands the word over,
          then three short activities on it, and it's banked. */}
      <WordUnlock
        open={Boolean(wordWon) && !wordWon.pending}
        word={wordWon?.word}
        collectedCount={collected.length}
        onCollect={collectWord}
        onClose={() => setWordWon(null)}
        onSeeAll={() => {
          setWordWon(null)
          setView('student')
          setChallengeTab('word-list')
        }}
      />

      <ActivityModal
        activity={openAct}
        path={path}
        open={!!openAct}
        done={openAct ? doneIds.includes(openAct.id) : false}
        response={openAct ? responses[openAct.id] : ''}
        onClose={() => setOpenAct(null)}
        onComplete={completeActivity}
      />

      {/* `earnables/_earnable_modal` — a badge the student tapped, opened. It is
          the only thing this modal does: earning one is credited on the screen
          that earned it. */}
      <BadgeCelebration badge={viewing} open={!!viewing} onClose={() => setViewing(null)} />

      <PrototypeNav currentHref="/bs-prototypes/pick-your-path/" />
    </div>
  )
}
