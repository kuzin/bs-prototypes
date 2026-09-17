import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { PreviewBar } from '@components/PreviewBar/PreviewBar'
import { useStickyState } from '@components/useStickyState/useStickyState'
import { RmiShell } from './components/RmiShell'
import { IndexesView } from './views/IndexesView'
import { IndexView } from './views/IndexView'
import { StudentReportView } from './views/StudentReportView'
import { ReadersView } from './views/ReadersView'
import { SurveyFlow } from './views/SurveyFlow'
import { EDUCATOR, INDEX_BY_ID, INDEXES } from './data'
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

  const index = indexId ? INDEX_BY_ID[indexId] : null

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
  }

  let body
  if (section === 'readers') {
    body = <ReadersView />
  } else if (studentId && index) {
    body = (
      <StudentReportView
        indexId={index.id}
        studentId={studentId}
        comparisonId={comparisonId}
        onComparison={setComparisonId}
        onBack={() => setStudentId(null)}
      />
    )
  } else if (index) {
    body = <IndexView index={index} tab={tab} onTab={setTab} onOpenStudent={openStudent} />
  } else {
    body = <IndexesView onOpenIndex={openIndex} onNewIndex={() => openIndex(INDEXES[0].id)} />
  }

  return (
    <div className="rmi-root">
      <PreviewBar
        title="Reading Motivation Index"
        views={VIEWS}
        active={view}
        onChange={setView}
        sticky={false}
      />

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
