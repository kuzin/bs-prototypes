import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'

import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'
import '@components/ProgressBar/ProgressBar.css'
import '@components/Modal/Modal.css'
import '@components/Hero/Hero.css'
import '@components/PrototypeNav/PrototypeNav.css'

import { TeacherSetup } from './components/TeacherSetup'
import { Destination } from './components/Destination'
import { ChallengeDashboard } from './components/ChallengeDashboard'
import { PathPickerModal } from './components/PathPickerModal'
import { TitleReader } from './components/TitleReader'
import { ActivityModal } from './components/ActivityModal'
import { BadgeCelebration } from './components/BadgeCelebration'
import { PATHS, PATH_BY_ID, SEED, badgesForPath } from './data'
import './index.css'

const VIEWS = [
  { id: 'teacher', label: 'Teacher · Set Destination', icon: 'flag' },
  { id: 'challenges', label: 'Student · Challenges', icon: 'trophy' },
  { id: 'student', label: 'Student · My Path', icon: 'route' },
]

const RANK = { destination: 3, reading: 2, activity: 1 }

export function App() {
  const [view, setView] = useState('teacher')
  const [pickerOpen, setPickerOpen] = useState(false) // path picker over the dashboard
  const [readingTitle, setReadingTitle] = useState(null) // title open in the in-app reader
  const [offered, setOffered] = useState(PATHS.map((p) => p.id))
  const [chosenPathId, setChosenPathId] = useState(SEED.chosenPathId)
  const [readIds, setReadIds] = useState(SEED.readTitleIds)
  const [doneIds, setDoneIds] = useState(SEED.doneActivityIds)
  const [responses, setResponses] = useState({})
  const [streak] = useState(SEED.streak)
  const [openAct, setOpenAct] = useState(null) // activity object shown in the modal
  const [celebration, setCelebration] = useState(null) // newly-earned badge

  const path = PATH_BY_ID[chosenPathId]

  // Celebrate the highest-priority badge that flips to earned by a progress change.
  function maybeCelebrate(prevRead, prevDone, nextRead, nextDone) {
    const before = badgesForPath(path, prevRead, prevDone)
    const after = badgesForPath(path, nextRead, nextDone)
    const newly = after.filter((a) => a.earned && !before.find((b) => b.id === a.id)?.earned)
    if (newly.length) {
      newly.sort((x, y) => RANK[y.kind] - RANK[x.kind])
      setCelebration(newly[0])
    }
  }

  function togglePath(id) {
    setOffered((cur) =>
      cur.includes(id) ? (cur.length > 1 ? cur.filter((p) => p !== id) : cur) : [...cur, id],
    )
  }

  function choosePath(id) {
    const p = PATH_BY_ID[id]
    setChosenPathId(id)
    setReadIds(p.titles.slice(0, 2).map((t) => t.id)) // land on the proposal's "2 of 3 read"
    setDoneIds([])
    setResponses({})
    setPickerOpen(false)
    setView('student')
  }

  // Finishing in the in-app reader logs the title, same as "Log it".
  function logFromReader(titleId) {
    setReadingTitle(null)
    if (readIds.includes(titleId)) return
    const next = [...readIds, titleId]
    setReadIds(next)
    maybeCelebrate(readIds, doneIds, next, doneIds)
  }

  function toggleRead(titleId) {
    const has = readIds.includes(titleId)
    const next = has ? readIds.filter((id) => id !== titleId) : [...readIds, titleId]
    setReadIds(next)
    if (!has) maybeCelebrate(readIds, doneIds, next, doneIds)
  }

  function completeActivity(text) {
    if (!openAct) return
    const actId = openAct.id
    const nextDone = doneIds.includes(actId) ? doneIds : [...doneIds, actId]
    setDoneIds(nextDone)
    setResponses((r) => ({ ...r, [actId]: text }))
    setOpenAct(null)
    maybeCelebrate(readIds, doneIds, readIds, nextDone)
  }

  function reset() {
    setOffered(PATHS.map((p) => p.id))
    setChosenPathId(SEED.chosenPathId)
    setReadIds(SEED.readTitleIds)
    setDoneIds(SEED.doneActivityIds)
    setResponses({})
    setOpenAct(null)
    setCelebration(null)
    setPickerOpen(false)
    setReadingTitle(null)
    setView('teacher')
  }

  return (
    <div className="pyp-app">
      {/* Dev / preview toolbar — switch between the three screens */}
      <div className="pyp-devbar">
        <span className="pyp-devbar-label">
          <Icon name="eye" size={14} /> Preview
        </span>
        <div className="pyp-devbar-views">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`pyp-devbar-btn${view === v.id ? ' is-active' : ''}`}
              onClick={() => setView(v.id)}
            >
              <Icon name={v.icon} size={14} />
              {v.label}
            </button>
          ))}
        </div>
        <button className="pyp-devbar-reset" type="button" onClick={reset}>
          <Icon name="refresh" size={13} /> Reset
        </button>
      </div>

      {view === 'teacher' && <TeacherSetup offered={offered} onTogglePath={togglePath} />}

      {view === 'challenges' && (
        <ChallengeDashboard
          streak={streak}
          offered={offered}
          onPick={() => setPickerOpen(true)}
          onOpen={() => setView('student')}
          onNav={() => setView('challenges')}
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
          onToggleRead={toggleRead}
          onReadTitle={setReadingTitle}
          onOpenActivity={setOpenAct}
          onChangePath={() => setPickerOpen(true)}
          onNav={() => setView('challenges')}
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

      <ActivityModal
        activity={openAct}
        path={path}
        open={!!openAct}
        done={openAct ? doneIds.includes(openAct.id) : false}
        response={openAct ? responses[openAct.id] : ''}
        onClose={() => setOpenAct(null)}
        onComplete={completeActivity}
      />

      <BadgeCelebration
        badge={celebration}
        open={!!celebration}
        onClose={() => setCelebration(null)}
      />

      <PrototypeNav currentHref="/bs-prototypes/pick-your-path/" />
    </div>
  )
}
