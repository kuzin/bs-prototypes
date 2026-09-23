import { useState } from 'react'
import { useToasts, ToastStack } from '@components/Toast/Toast'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'

import { Dashboard } from './components/Dashboard'
import { LogFlow } from '@components/LogFlow/LogFlow'
import { ConnectFlow, PartnerCatalog } from '@components/PartnerConnect/PartnerConnect'
import { ReadNow } from '@components/ReadNow/ReadNow'
import { BookCover } from '@components/BookCover/BookCover'
import { STREAK, DAILY_GOAL, READER, BOOKS, LOG_FIXTURES } from './data'
import { CONNECTIONS, CONNECTION_LIST, TAKEN_USERNAMES, partnerMinutes } from './connections'
import './index.css'

export function App() {
  const [flowOpen, setFlowOpen] = useState(false)
  const [streak, setStreak] = useState(STREAK)
  const [dailyGoal, setDailyGoal] = useState(DAILY_GOAL)

  /* Linked reading apps, keyed by partner id. Each is linked and unlinked on
     its own — Comics Plus and Scholastic never travel together, which is the
     point this prototype makes: it opens with Scholastic already linked (the
     school subscribes, so the magazines and their shelf are simply there) and
     Comics Plus not, so the connect flow still has something to demonstrate. */
  const [connections, setConnections] = useState({
    /* The same two fields `handleLinked` stores, so a seeded link and a link
       made in the flow are the same thing: `account` is the *name* on the
       partner's side, which is what the switcher and the catalog header put on
       screen — not the profile object it's taken from. */
    scholastic: {
      account: CONNECTIONS.scholastic.account.name,
      org: CONNECTIONS.scholastic.defaultOrg,
    },
  })
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
        onLog={() => openFlow()}
        connections={connections}
        onLinkPartner={setLinking}
        onDisconnectPartner={handleDisconnect}
        onVisitPartner={setVisiting}
      />
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
        {...LOG_FIXTURES}
        partners={CONNECTION_LIST}
        /* `multiDate` is `@multiclick_enabled` — this site has a Days log type,
           so the calendar takes several dates at once. */
        site={{ multiDate: true, backlogDays: 14 }}
        dailyGoal={dailyGoal}
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
      {/* One stack for the page, not one per thing that can raise a
          toast. */}
      <ToastStack toasts={toasts} onDismiss={dismiss} />

      <PrototypeNav currentHref="/bs-prototypes/logging-flow/" />
    </>
  )
}
