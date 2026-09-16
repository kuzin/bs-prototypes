import { useEffect, useRef, useState } from 'react'
import { Tabs } from '@components/Tabs/Tabs'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { useStickyState } from '@components/useStickyState/useStickyState'

import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { ProgramHeader } from '@components/ProgramHeader/ProgramHeader'
import { Pill } from '@components/Pill/Pill'
import { LogFlow } from '@components/LogFlow/LogFlow'
import '@components/Pill/Pill.css'

import { LOG_FIXTURES } from '../logging-flow/data'
import { ReaderTopBar, ReaderFooter } from './components/ReaderChrome'
import { BadgeDisc } from './components/BadgeDisc'
import { ReaderBoard } from './components/ReaderBoard'
import { YouDidItSheet, BadgeUnlockedModal } from './components/Celebrations'
import { BadgesTab } from './components/BadgesTab'
import { OverviewTab, RewardsTab, LogTab } from './components/ChallengeTabs'
import {
  CHALLENGE,
  SPACES,
  LOG_ITEMS,
  banner,
  isEarned,
  nextSpace,
  activityBadgeEarned,
} from './data'
import './index.css'

// Gameboard: Reader View — the other half of the `gameboard` creator prototype.
//
// `gameboard` is an admin building a board. This is Olivia travelling it: she
// opens the challenge, logs a finished book, and watches the next space light
// up. The whole point is the loop, so everything that isn't on it (the other
// site tabs, Complete Activity, Write Review) is inert chrome.
//
// Built from the Figma "Reader Experience" page — file cvp7KATrNgec74yZ7BB3Wi.

const CHALLENGE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'gameboard', label: 'Gameboard' },
  { id: 'badges', label: 'Badges' },
  { id: 'rewards', label: 'Rewards' },
  { id: 'log', label: 'Challenge Log' },
]

export function App() {
  const [booksFinished, setBooksFinished] = useState(CHALLENGE.booksFinished)
  const [tab, setTab] = useStickyState('gameboard-reader:tab', 'gameboard')
  // The challenge's own log — what the Challenge Log tab lists, and what every
  // session logged in the demo lands on top of.
  const [sessions, setSessions] = useState(LOG_ITEMS)

  const [logOpen, setLogOpen] = useState(false)
  const [result, setResult] = useState(null) // the session just logged
  const [unlocked, setUnlocked] = useState(null) // the space it cleared, if any
  const [unlockOpen, setUnlockOpen] = useState(false) // is the badge modal showing?
  const [viewing, setViewing] = useState(null) // a badge the reader tapped to look at
  const [doneActivities, setDoneActivities] = useState([]) // activity ids completed
  const [popped, setPopped] = useState(null) // space mid-pop on the board
  const popTimer = useRef(null)

  useEffect(() => () => clearTimeout(popTimer.current), [])

  const target = nextSpace(booksFinished)
  // Every space but START — what "cleared" is counted against, since a reader
  // has START before they have done anything.
  const boardSpaces = SPACES.length - 1
  const rewardsWon = SPACES.filter((s) => s.reward && isEarned(s, booksFinished)).length

  // The badge modal serves two arrivals: a space the reader just cleared, and
  // one they tapped to look at again. Same modal either way — only the close
  // differs, since only a fresh unlock pops the badge on the way out.
  const badgeSpace = viewing || unlocked
  const badgeOpen = !!viewing || unlockOpen

  // A logged session: finishing a book advances the board, which may clear the
  // next space. Either way the reader lands on "You did it!" first — the badge
  // modal waits until they're back looking at the board.
  const handleLogged = (session) => {
    const next = booksFinished + (session.finished ? 1 : 0)
    const cleared = SPACES.find((s) => !isEarned(s, booksFinished) && isEarned(s, next)) || null
    setBooksFinished(next)
    setResult(session)
    setUnlocked(cleared)
    setLogOpen(false)
    // One row per log, newest first — the shape `full_reading_log` prints.
    setSessions((rows) => [
      {
        id: `li-${rows.length + 1}-${Date.now()}`,
        title: session.book?.title || 'Untitled',
        author: session.book?.author || '',
        date: session.date,
        logType: session.unit === 'page' ? 'Pages' : 'Minutes',
        logValue: session.logValue,
        finished: session.finished,
      },
      ...rows,
    ])
  }

  // Dismissing the celebration hands off to the badge modal, if one is pending.
  const finishCelebration = () => {
    setResult(null)
    if (unlocked) setUnlockOpen(true)
  }

  // Closing after a fresh unlock drops the reader back on the board — which is
  // the moment the new badge should pop, so `popped` outlives the modal just
  // long enough for the animation to play. (`unlocked` stays put so the modal
  // keeps its content while it animates out.)
  const closeBadge = () => {
    // Just looking at a badge already earned — nothing to celebrate on the way
    // out, so no pop.
    if (viewing) {
      setViewing(null)
      return
    }
    setUnlockOpen(false)
    if (!unlocked) return
    setPopped(unlocked.id)
    clearTimeout(popTimer.current)
    popTimer.current = setTimeout(() => setPopped(null), 900)
  }

  // Ticking off an activity can complete its badge — which earns it there and
  // then, no reading involved, so the badge modal fires straight away.
  const toggleActivity = (activityId, badge) => {
    const wasDone = doneActivities.includes(activityId)
    const next = wasDone
      ? doneActivities.filter((id) => id !== activityId)
      : [...doneActivities, activityId]
    setDoneActivities(next)
    if (!wasDone && activityBadgeEarned(badge, next)) setViewing(badge)
  }

  // The earned card's own two ways on: the badge it names, and the reward that
  // came with it. Both close the celebration first — they are somewhere else.
  const viewEarnedBadge = (space) => {
    setResult(null)
    setUnlocked(null)
    setViewing(space)
  }

  const goToRewards = () => {
    setResult(null)
    setUnlocked(null)
    setTab('rewards')
  }

  const logAnother = () => {
    setResult(null)
    setUnlocked(null)
    setUnlockOpen(false)
    setViewing(null)
    setLogOpen(true)
  }

  const resetDemo = () => {
    clearTimeout(popTimer.current)
    setBooksFinished(CHALLENGE.booksFinished)
    setResult(null)
    setUnlocked(null)
    setUnlockOpen(false)
    setViewing(null)
    setPopped(null)
    setDoneActivities([])
    setSessions(LOG_ITEMS)
  }

  return (
    <div className="gr-root">
      <ReaderTopBar onLogReading={() => setLogOpen(true)} />

      {/* The challenge header every other reader surface uses — two tinted
          bands, the banner on a card pulled up into them, then the title and
          dates. This page had drawn its own version of the same thing. */}
      <ProgramHeader
        banner={banner}
        title={CHALLENGE.name}
        dates={CHALLENGE.dates}
        tint="#61B2F1"
        tags={
          <Pill color="#1A6DD5" variant="soft" size="sm">
            Gameboard
          </Pill>
        }
      />

      <div className="gr-tabs">
        <Tabs
          variant="pill"
          plain
          size="md"
          active={tab}
          onChange={setTab}
          items={CHALLENGE_TABS}
          ariaLabel="Challenge sections"
        />
      </div>

      <main className="gr-main">
        {tab === 'gameboard' ? (
          <>
            <div className="gr-board-head">
              <div className="gr-progress">
                <span className="gr-progress-label">Your progress</span>
                <span className="gr-progress-line">
                  <strong>{booksFinished}</strong>
                  <span>
                    of {boardSpaces} spaces cleared
                    {rewardsWon > 0 &&
                      ` · ${rewardsWon} ${rewardsWon === 1 ? 'reward' : 'rewards'} unlocked`}
                  </span>
                </span>
                <ProgressBar value={booksFinished} max={boardSpaces} color="#1a6dd5" size="md" />
                <span className="gr-progress-note">
                  {target
                    ? `${boardSpaces - booksFinished} more ${
                        boardSpaces - booksFinished === 1 ? 'book' : 'books'
                      } to reach FINISH.`
                    : 'The whole board is yours. Nicely done.'}
                </span>
              </div>

              {target && (
                <button
                  type="button"
                  className="gr-next"
                  onClick={() => setLogOpen(true)}
                  title="Log reading to get there"
                >
                  <BadgeDisc space={target} earned={false} bare size="next" />
                  <span className="gr-next-text">
                    <span className="gr-next-label">Next up</span>
                    <strong>{target.requirement}</strong>
                    <span className="gr-next-hint">Log a finished title to clear it</span>
                  </span>
                  <Icon name="chevron-right" size={18} className="gr-next-go" />
                </button>
              )}
            </div>

            <ReaderBoard
              booksFinished={booksFinished}
              justUnlocked={popped}
              onSpace={(space, earned) => (earned ? setViewing(space) : setLogOpen(true))}
            />

            <div className="gr-board-foot">
              <Button variant="primary" accent="#1A6DD5" onClick={() => setLogOpen(true)}>
                Log Reading
              </Button>
              <button type="button" className="gr-link" onClick={resetDemo}>
                Reset the demo
              </button>
            </div>
          </>
        ) : tab === 'badges' ? (
          <BadgesTab
            booksFinished={booksFinished}
            doneActivities={doneActivities}
            onActivity={toggleActivity}
            onBadge={setViewing}
          />
        ) : tab === 'rewards' ? (
          <RewardsTab booksFinished={booksFinished} />
        ) : tab === 'log' ? (
          <LogTab
            sessions={sessions}
            booksFinished={booksFinished}
            onLog={() => setLogOpen(true)}
          />
        ) : (
          <OverviewTab
            booksFinished={booksFinished}
            doneActivities={doneActivities}
            onTab={setTab}
            onBadge={setViewing}
          />
        )}
      </main>

      <ReaderFooter />

      {/* The reader's log-reading flow — the shared one. This prototype carried
          its own two-step copy of it, which is the drift the shared flow exists
          to stop; the board's own celebration still takes over the moment a
          session lands, which is what `onLogged` closing it is for. */}
      <LogFlow
        open={logOpen}
        onClose={() => setLogOpen(false)}
        onLogged={handleLogged}
        {...LOG_FIXTURES}
      />

      <YouDidItSheet
        open={!!result}
        onClose={finishCelebration}
        onLogAnother={logAnother}
        onViewBadge={viewEarnedBadge}
        onReward={goToRewards}
        amount={result?.logValue}
        unit={result?.unit}
        book={result?.book}
        earned={unlocked}
        booksFinished={booksFinished}
      />

      <BadgeUnlockedModal open={badgeOpen} onClose={closeBadge} space={badgeSpace} />

      <PrototypeNav currentHref="/bs-prototypes/gameboard-reader/" />
    </div>
  )
}
