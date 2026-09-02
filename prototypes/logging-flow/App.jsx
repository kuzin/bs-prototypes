import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'

import { Dashboard } from './components/Dashboard'
import { LogFlow } from './components/LogFlow'
import { ConnectFlow, PartnerCatalog } from '@components/PartnerConnect/PartnerConnect'
import { BookCover } from './components/BookCover'
import { STREAK, DAILY_GOAL, READER, BOOKS } from './data'
import { CONNECTIONS, TAKEN_USERNAMES, partnerMinutes } from './connections'
import './index.css'

export function App() {
  const [flowOpen, setFlowOpen] = useState(false)
  const [streak, setStreak] = useState(STREAK)
  const [dailyGoal, setDailyGoal] = useState(DAILY_GOAL)

  // Linked reading apps, keyed by partner id. Each is linked and unlinked on its
  // own — Comics Plus and Scholastic never travel together.
  const [connections, setConnections] = useState({})
  const [linking, setLinking] = useState(null) // partner id mid-handoff
  const [visiting, setVisiting] = useState(null) // partner id whose catalog is open

  function handleLogged(entry) {
    // Reflect the new log on the dashboard backdrop the flow closes onto.
    setStreak((s) => ({ ...s, current: Math.max(s.current, 1) }))
    if (entry.measure === 'minutes' && entry.minutes) {
      setDailyGoal((g) => ({ ...g, minutes: g.minutes + entry.minutes }))
    }
  }

  // A linked partner starts logging on the reader's behalf, so its minutes land
  // on the daily goal (and start the streak) the moment the accounts connect.
  function handleLinked({ partnerId, account, org }) {
    setConnections((c) => ({ ...c, [partnerId]: { account, org } }))
    setLinking(null)
    const mins = partnerMinutes(partnerId)
    if (mins > 0) {
      setDailyGoal((g) => ({ ...g, minutes: g.minutes + mins }))
      setStreak((s) => ({ ...s, current: Math.max(s.current, 1) }))
    }
  }

  function handleDisconnect(partnerId) {
    setConnections((c) => {
      const next = { ...c }
      delete next[partnerId]
      return next
    })
    const mins = partnerMinutes(partnerId)
    setDailyGoal((g) => ({ ...g, minutes: Math.max(0, g.minutes - mins) }))
  }

  return (
    <>
      <Dashboard
        streak={streak}
        dailyGoal={dailyGoal}
        onLog={() => setFlowOpen(true)}
        connections={connections}
        onLinkPartner={setLinking}
        onDisconnectPartner={handleDisconnect}
        onVisitPartner={setVisiting}
      />
      <LogFlow
        open={flowOpen}
        onClose={() => setFlowOpen(false)}
        onLogged={handleLogged}
        connections={connections}
      />
      {visiting && connections[visiting] && (
        <PartnerCatalog
          partner={CONNECTIONS[visiting]}
          account={connections[visiting].account}
          titles={Object.values(BOOKS).filter((b) => b.partner === visiting)}
          renderCover={(b) => <BookCover book={b} size="lg" />}
          onBack={() => setVisiting(null)}
        />
      )}
      {linking && (
        <ConnectFlow
          partner={CONNECTIONS[linking]}
          reader={READER}
          takenUsernames={TAKEN_USERNAMES}
          onCancel={() => setLinking(null)}
          onLinked={handleLinked}
        />
      )}
      <PrototypeNav currentHref="/bs-prototypes/logging-flow/" />
    </>
  )
}
