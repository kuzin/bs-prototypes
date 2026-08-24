import { useEffect, useRef, useState } from 'react'
import { Tabs } from '@components/Tabs/Tabs'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'

import { ReaderTopBar, ReaderFooter } from './components/ReaderChrome'
import { ReaderBoard } from './components/ReaderBoard'
import { LogReadingFlow } from './components/LogReadingFlow'
import { YouDidItSheet, BadgeUnlockedModal } from './components/Celebrations'
import { CHALLENGE, SPACES, banner, isEarned, nextSpace } from './data'
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
  const [tab, setTab] = useState('gameboard')

  const [logOpen, setLogOpen] = useState(false)
  const [result, setResult] = useState(null) // the session just logged
  const [unlocked, setUnlocked] = useState(null) // the space it cleared, if any
  const [unlockOpen, setUnlockOpen] = useState(false) // is the badge modal showing?
  const [popped, setPopped] = useState(null) // space mid-pop on the board
  const popTimer = useRef(null)

  useEffect(() => () => clearTimeout(popTimer.current), [])

  const target = nextSpace(booksFinished)

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
  }

  // Dismissing the celebration hands off to the badge modal, if one is pending.
  const finishCelebration = () => {
    setResult(null)
    if (unlocked) setUnlockOpen(true)
  }

  // Closing the badge modal drops the reader back on the board — which is the
  // moment the new badge should pop, so `popped` outlives the modal just long
  // enough for the animation to play. (`unlocked` stays put so the modal keeps
  // its content while it animates out.)
  const closeUnlock = () => {
    setUnlockOpen(false)
    if (!unlocked) return
    setPopped(unlocked.id)
    clearTimeout(popTimer.current)
    popTimer.current = setTimeout(() => setPopped(null), 900)
  }

  const logAnother = () => {
    setResult(null)
    setUnlocked(null)
    setUnlockOpen(false)
    setLogOpen(true)
  }

  const resetDemo = () => {
    clearTimeout(popTimer.current)
    setBooksFinished(CHALLENGE.booksFinished)
    setResult(null)
    setUnlocked(null)
    setUnlockOpen(false)
    setPopped(null)
  }

  return (
    <div className="gr-root">
      <ReaderTopBar onLogReading={() => setLogOpen(true)} />

      <div className="gr-hero">
        <img className="gr-hero-banner" src={banner} alt="" />
        <h1 className="gr-hero-title">{CHALLENGE.name}</h1>
        <p className="gr-hero-dates">{CHALLENGE.dates}</p>
        <div className="gr-hero-tabs">
          <Tabs
            variant="underline"
            size="md"
            active={tab}
            accent="#1A6DD5"
            onChange={setTab}
            items={CHALLENGE_TABS}
            ariaLabel="Challenge sections"
          />
        </div>
      </div>

      <main className="gr-main">
        {tab === 'gameboard' ? (
          <>
            <div className="gr-board-head">
              <span className="gr-progress">
                <strong>{booksFinished}</strong> of {SPACES.length - 1} spaces cleared
              </span>
              {target && (
                <span className="gr-next">
                  Next up: <strong>{target.requirement}</strong>
                </span>
              )}
            </div>

            <ReaderBoard
              booksFinished={booksFinished}
              justUnlocked={popped}
              onSpace={(space, earned) => !earned && setLogOpen(true)}
            />

            <div className="gr-board-foot">
              <Button
                variant="primary"
                accent="#1A6DD5"
                icon={<Icon name="book" size={16} />}
                onClick={() => setLogOpen(true)}
              >
                Log Reading
              </Button>
              <button type="button" className="gr-link" onClick={resetDemo}>
                Reset the demo
              </button>
            </div>
          </>
        ) : (
          <div className="gr-placeholder">
            <Icon name="route" size={26} />
            <p>
              This mock covers the <strong>Gameboard</strong> tab — the reader’s trip around the
              board.
            </p>
            <Button variant="secondary" size="sm" onClick={() => setTab('gameboard')}>
              Back to the Gameboard
            </Button>
          </div>
        )}
      </main>

      <ReaderFooter />

      <LogReadingFlow open={logOpen} onClose={() => setLogOpen(false)} onLogged={handleLogged} />

      <YouDidItSheet
        open={!!result}
        onClose={finishCelebration}
        onLogAnother={logAnother}
        minutes={result?.minutes}
        book={result?.book}
      />

      <BadgeUnlockedModal
        open={unlockOpen}
        onClose={closeUnlock}
        space={unlocked}
        booksFinished={booksFinished}
      />

      <PrototypeNav currentHref="/bs-prototypes/gameboard-reader/" />
    </div>
  )
}
