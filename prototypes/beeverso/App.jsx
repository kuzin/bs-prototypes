import { useState } from 'react'
import { useToasts, ToastStack } from '@components/Toast/Toast'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { ConnectFlow, PartnerCatalog } from '@components/PartnerConnect/PartnerConnect'
import { ReadNow } from '@components/ReadNow/ReadNow'
import { LogFlow } from '@components/LogFlow/LogFlow'

import { Dashboard } from './components/Dashboard'
import { TitleCover } from './components/TitleCover'
import { PARTNERS, PARTNER_BY_ID, TAKEN_USERNAMES } from './connections'
import {
  READER,
  STREAK,
  DAILY_GOAL,
  LOG_BOOKS,
  RECENTLY_LOGGED,
  EARNED_CARDS,
  daysAgo,
  titlesFor,
  todayMinutes,
} from './data'
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
  // The title being read in a partner's app, and which app that is.
  const [reading, setReading] = useState(null)
  /* A title handed over by the reader's last page — the flow opens on its
     form with Finished already answered. */
  const [finishing, setFinishing] = useState(null)

  /* Every way into the flow goes through these two, so a title handed over
     by the reader can't outlive the trip it was handed over for. */
  const [finishedMinutes, setFinishedMinutes] = useState(null)
  const openFlow = (book = null, minutes = null) => {
    setFinishing(book)
    setFinishedMinutes(minutes)
    setFlowOpen(true)
  }
  const closeFlow = () => {
    setFlowOpen(false)
    setFinishing(null)
    setFinishedMinutes(null)
  }
  const { toasts, push, dismiss } = useToasts()
  const [flowOpen, setFlowOpen] = useState(false)
  // What she logs herself while the prototype is open, so a hand-typed session
  // lands in the same month as the imported ones and the contrast is visible.
  const [logged, setLogged] = useState([])

  /* A log she typed herself, as a calendar entry. Blue, and with no `source`:
     the imported rows carry their app's mark and its colour, so the plain blue
     row *is* the difference between the two halves of this prototype. */
  function handleLogged(entry) {
    const dates = entry.dates?.length ? entry.dates : [daysAgo(0)]
    setLogged((ls) => [
      ...ls,
      ...dates.map((date, i) => ({
        id: `own-${Date.now()}-${i}`,
        date,
        kind: 'log',
        title: entry.book?.untitled ? 'Untitled' : (entry.book?.title ?? 'Reading'),
        author: entry.book?.author,
        minutes: entry.minutes,
        completed: entry.finished,
        tone: 'blue',
      })),
    ])
    setStreak((s) => ({ ...s, current: Math.max(s.current, 1) }))
    if (entry.minutes) setDailyGoal((g) => ({ ...g, minutes: g.minutes + entry.minutes }))
  }

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
        logged={logged}
        onLog={() => openFlow()}
        onLinkPartner={setLinking}
        onDisconnectPartner={handleDisconnect}
        onVisitPartner={setVisiting}
      />

      {/* The other half of the story: what a linked app logs for her, and what
          she still logs herself. It's the shared flow, with this prototype's own
          catalog in it and the parts of the logger this site doesn't run —
          scanning, Epic, book reviews — left off. */}
      <LogFlow
        /* A tile's "Read in …" leaves the flow for the partner's own app, which
           is this page's to open. */
        book={finishing}
        startFinished={Boolean(finishing)}
        startMinutes={finishedMinutes}
        onReadInPartner={(b) => setReading({ book: b, partner: b.partner })}
        /* This page keeps no shelf of its own, so saving Benny's pick is a
           confirmation rather than a place to go. */
        onAddToWishlist={(b, on) =>
          push({
            title: on ? 'Added to your Wish List' : 'Removed from your Wish List',
            body: b.title,
          })
        }
        open={flowOpen}
        onClose={() => closeFlow()}
        onLogged={handleLogged}
        connections={connections}
        partners={PARTNERS}
        books={LOG_BOOKS}
        recentlyLogged={RECENTLY_LOGGED}
        reader={READER}
        dailyGoal={dailyGoal}
        /* Her own challenge, not the shared fixture's: a success screen that
           credits a challenge this site has never run is the kind of seam a
           prototype gets judged on. */
        earnedCards={EARNED_CARDS}
        site={{ epic: false, bookReviews: false }}
      />
      {reading && (
        <ReadNow
          book={reading.book}
          partner={reading.partner}
          onClose={() => setReading(null)}
          onFinish={(minutes) => {
            setReading(null)
            openFlow(reading.book, minutes)
          }}
        />
      )}

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
      {/* One stack for the page, not one per thing that can raise a
          toast. */}
      <ToastStack toasts={toasts} onDismiss={dismiss} />

      <PrototypeNav currentHref="/bs-prototypes/beeverso/" />
    </>
  )
}
