import { useState } from 'react'
import { SESSIONS } from './data'
import { DashboardView } from './components/DashboardView'
import { ReviewPage } from './components/ReviewPage'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import './index.css'

export function App() {
  const [page, setPage] = useState('dashboard')
  const [sessions, setSessions] = useState(SESSIONS)
  const [activeTab, setActiveTab] = useState('safety')
  const [selectedSession, setSelectedSession] = useState(null)

  function handleUpdateSession(updated) {
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setSelectedSession((cur) => (cur && cur.id === updated.id ? updated : cur))
  }

  return (
    <>
      <div className="sg-shell">
        {page === 'dashboard' ? (
          <DashboardView
            sessions={sessions}
            onGoToReview={(tab) => {
              setActiveTab(tab)
              setPage('review')
            }}
          />
        ) : (
          <ReviewPage
            sessions={sessions}
            activeTab={activeTab}
            onActiveTab={setActiveTab}
            selectedSession={selectedSession}
            onSelectSession={setSelectedSession}
            onUpdateSession={handleUpdateSession}
            onBack={() => setPage('dashboard')}
          />
        )}
      </div>
      <PrototypeNav currentHref="/bs-prototypes/safety-signals/" />
    </>
  )
}
