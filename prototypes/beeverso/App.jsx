import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { ConnectFlow, PartnerCatalog } from '@components/PartnerConnect/PartnerConnect'

import { Dashboard } from './components/Dashboard'
import { TitleCover } from './components/TitleCover'
import { PARTNER_BY_ID, TAKEN_USERNAMES } from './connections'
import { READER, STREAK, DAILY_GOAL, titlesFor, todayMinutes } from './data'
import './index.css'

/**
 * Beanstack × Beeverso — the same account-linking shape as the Comics Plus
 * integration, for a Spanish reading-comprehension platform.
 *
 * The loop: a banner on the reader's Beanstack dashboard → the partner's own
 * school picker and sign-in → confirm the two accounts are the same person →
 * linked, with that app's reading logging itself from then on. After that its
 * mark joins the switcher in the top right, the reading log backfills with
 * imported sessions, and Personalize Reader → App Integrations is where the
 * connection can be dropped again.
 *
 * Comics Plus is here as a second partner so the multi-app case is visible:
 * Carla reads Spanish in Beeverso and comics in Comics Plus, each links
 * separately, and both land in one Beanstack log.
 */
export function App() {
  const [streak, setStreak] = useState(STREAK)
  const [dailyGoal, setDailyGoal] = useState(DAILY_GOAL)

  const [connections, setConnections] = useState({})
  const [linking, setLinking] = useState(null) // partner id mid-handoff
  const [visiting, setVisiting] = useState(null) // partner id whose catalog is open

  // Linking is the payoff: that app's minutes for today land on the daily goal
  // (and start the streak) the moment the accounts connect.
  function handleLinked({ partnerId, account, org }) {
    setConnections((c) => ({ ...c, [partnerId]: { account, org } }))
    setLinking(null)
    const mins = todayMinutes(partnerId)
    if (mins > 0) {
      setDailyGoal((g) => ({ ...g, minutes: g.minutes + mins }))
      setStreak((s) => ({ ...s, current: Math.max(s.current, 1) }))
    }
  }

  function handleDisconnect(partnerId) {
    const next = { ...connections }
    delete next[partnerId]
    setConnections(next)
    setDailyGoal((g) => ({ ...g, minutes: Math.max(0, g.minutes - todayMinutes(partnerId)) }))
    // The streak only survives while *something* is still logging for her.
    if (Object.keys(next).length === 0) setStreak((s) => ({ ...s, current: 0 }))
  }

  const visitingPartner = visiting && PARTNER_BY_ID[visiting]

  return (
    <>
      <Dashboard
        streak={streak}
        dailyGoal={dailyGoal}
        connections={connections}
        onLinkPartner={setLinking}
        onDisconnectPartner={handleDisconnect}
        onVisitPartner={setVisiting}
      />
      {visitingPartner && connections[visiting] && (
        <PartnerCatalog
          partner={visitingPartner}
          account={connections[visiting].account}
          titles={titlesFor(visiting)}
          renderCover={(t) => <TitleCover title={t} size="lg" />}
          note={
            visiting === 'beeverso'
              ? 'Conectado a Beanstack — tu lectura se registra sola'
              : undefined
          }
          onBack={() => setVisiting(null)}
        />
      )}
      {linking && (
        <ConnectFlow
          partner={PARTNER_BY_ID[linking]}
          reader={READER}
          takenUsernames={TAKEN_USERNAMES}
          onCancel={() => setLinking(null)}
          onLinked={handleLinked}
        />
      )}
      <PrototypeNav currentHref="/bs-prototypes/beeverso/" />
    </>
  )
}
