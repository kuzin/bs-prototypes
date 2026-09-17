import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { PreviewBar } from '@components/PreviewBar/PreviewBar'
import { useStickyState } from '@components/useStickyState/useStickyState'
import { RmiShell } from './components/RmiShell'
import { IndexesView } from './views/IndexesView'
import { IndexFormView } from './views/IndexFormView'
import { IndexView } from './views/IndexView'
import { StudentReportView } from './views/StudentReportView'
import { ReadersView } from './views/ReadersView'
import { SurveyFlow } from './views/SurveyFlow'
import { EDUCATOR, INDEXES, makeIndex } from './data'
import './index.css'

/**
 * The **standalone** Reading Motivation Index — the self-serve product a
 * teacher or school librarian buys on its own, modelled on `zoobean/rmi-app`.
 * (The other RMI, the one built into Beanstack, is a separate surface.)
 *
 * It has two halves that never see each other:
 *
 *   Educator — behind a login, an icon rail with exactly two destinations.
 *     They create an index period, print access codes, and read the reports.
 *   Reader   — no login at all. A student opens `/s/:account_slug`, types the
 *     code from their handout, and answers 20 questions.
 *
 * The preview bar is the prototype's own; the product has no such switch.
 *
 * Everything numeric is derived — see `scoring.js`, a port of the rmi-engine
 * gem, and `domain.js`, its question / factor / recommendation YAML.
 */

const VIEWS = [
  { id: 'educator', label: 'Educator · Classroom', short: 'Educator', icon: 'layout-grid' },
  { id: 'reader', label: 'Reader · Survey', short: 'Reader', icon: 'clipboard-check' },
]

export function App() {
  const [view, setView] = useStickyState('rmi:view', 'educator')

  // Where the educator is. `page` is the rail section; `indexId` / `studentId`
  // drill into it, the way the app's nested routes do.
  const [section, setSection] = useStickyState('rmi:section', 'indexes')
  const [indexId, setIndexId] = useStickyState('rmi:index', null)
  const [tab, setTab] = useStickyState('rmi:tab', 'summary')
  const [studentId, setStudentId] = useStickyState('rmi:student', null)
  const [comparisonId, setComparisonId] = useStickyState('rmi:comparison', null)

  // The index periods are editable, so they're state rather than the module's
  // list. `editing` is the form's subject: an index to change, or `'new'`.
  const [indexes, setIndexes] = useState(INDEXES)
  const [editing, setEditing] = useState(null)

  const index = indexId ? (indexes.find((i) => i.id === indexId) ?? null) : null

  function openIndex(id) {
    setIndexId(id)
    setTab('summary')
    setStudentId(null)
  }

  function openStudent(id) {
    setStudentId(id)
    setComparisonId(null)
  }

  function navigate(next) {
    setSection(next)
    setIndexId(null)
    setStudentId(null)
    setEditing(null)
  }

  function saveIndex({ id, name, startDate, endDate }) {
    if (id) {
      setIndexes((list) => list.map((i) => (i.id === id ? { ...i, name, startDate, endDate } : i)))
    } else {
      const created = makeIndex({ name, startDate, endDate })
      setIndexes((list) => [...list, created])
    }
    setEditing(null)
  }

  function deleteIndex(id) {
    setIndexes((list) => list.filter((i) => i.id !== id))
    if (indexId === id) setIndexId(null)
  }

  let body
  if (section === 'readers') {
    body = <ReadersView />
  } else if (editing) {
    body = (
      <IndexFormView
        index={editing === 'new' ? null : editing}
        indexes={indexes}
        limit={EDUCATOR.indexesLimit}
        onSave={saveIndex}
        onCancel={() => setEditing(null)}
      />
    )
  } else if (studentId && index) {
    body = (
      <StudentReportView
        index={index}
        indexes={indexes}
        studentId={studentId}
        comparisonId={comparisonId}
        onComparison={setComparisonId}
        onBack={() => setStudentId(null)}
      />
    )
  } else if (index) {
    body = <IndexView index={index} tab={tab} onTab={setTab} onOpenStudent={openStudent} />
  } else {
    body = (
      <IndexesView
        indexes={indexes}
        limit={EDUCATOR.indexesLimit}
        onOpenIndex={openIndex}
        onNewIndex={() => setEditing('new')}
        onEditIndex={setEditing}
        onDeleteIndex={deleteIndex}
      />
    )
  }

  return (
    <div className="rmi-root">
      <PreviewBar title="Reading Motivation Index" views={VIEWS} active={view} onChange={setView} />

      {view === 'educator' ? (
        <RmiShell section={section} onNavigate={navigate} educator={EDUCATOR}>
          {body}
        </RmiShell>
      ) : (
        <SurveyFlow />
      )}

      <PrototypeNav currentHref="/bs-prototypes/rmi/" />
    </div>
  )
}
