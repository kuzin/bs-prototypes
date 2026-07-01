import { useState } from 'react'
import { SESSIONS } from './data'
import { DashboardView } from './components/DashboardView'
import { SfrPage } from './components/SfrPage'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import './index.css'

export function App() {
  const [page, setPage] = useState('dashboard')
  const [sessions, setSessions] = useState(SESSIONS)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedSession, setSelectedSession] = useState(null)

  function handleUpdateSession(updated) {
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setSelectedSession(updated)
  }

  function handleDeleteSession(id) {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    setSelectedSession(null)
  }

  return (
    <>
      {/* The dashboard renders the admin .adm-shell (its own position:fixed root
          that already reserves bottom:48px for PrototypeNav), so it must NOT be
          nested inside .sfr-shell — that would double-stack fixed shells. Only
          SfrPage keeps the .sfr-shell wrapper. */}
      {page === 'dashboard' ? (
        <DashboardView
          sessions={sessions}
          onGoToSfr={(tab = 'overview') => {
            setActiveTab(tab)
            setPage('sfr')
          }}
        />
      ) : (
        <div className="sfr-shell">
          <SfrPage
            sessions={sessions}
            activeTab={activeTab}
            onActiveTab={setActiveTab}
            selectedSession={selectedSession}
            onSelectSession={setSelectedSession}
            onUpdateSession={handleUpdateSession}
            onDeleteSession={handleDeleteSession}
            onBack={() => setPage('dashboard')}
          />
        </div>
      )}
      <PrototypeNav currentHref="/bs-prototypes/sfr/" />
    </>
  )
}
