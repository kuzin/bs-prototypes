import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'

import { Dashboard } from './components/Dashboard'
import { LogFlow } from './components/LogFlow'
import { STREAK, DAILY_GOAL } from './data'
import './index.css'

export function App() {
  const [flowOpen, setFlowOpen] = useState(false)
  const [streak, setStreak] = useState(STREAK)
  const [dailyGoal, setDailyGoal] = useState(DAILY_GOAL)

  function handleLogged(entry) {
    // Reflect the new log on the dashboard backdrop the flow closes onto.
    setStreak((s) => ({ ...s, current: Math.max(s.current, 1) }))
    if (entry.measure === 'minutes' && entry.minutes) {
      setDailyGoal((g) => ({ ...g, minutes: g.minutes + entry.minutes }))
    }
  }

  return (
    <>
      <Dashboard streak={streak} dailyGoal={dailyGoal} onLog={() => setFlowOpen(true)} />
      <LogFlow open={flowOpen} onClose={() => setFlowOpen(false)} onLogged={handleLogged} />
      <PrototypeNav currentHref="/bs-prototypes/logging-flow/" />
    </>
  )
}
