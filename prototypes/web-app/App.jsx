import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { ConnectFlow, PartnerCatalog } from '@components/PartnerConnect/PartnerConnect'

import { Dashboard } from '../logging-flow/components/Dashboard'
import { LogFlow } from '../logging-flow/components/LogFlow'
import { BookCover } from '../logging-flow/components/BookCover'
import { AllBadges } from './components/AllBadges'
import { Friends } from './components/Friends'
import { Reviews } from './components/Reviews'
import { ChallengePage } from './components/ChallengePage'
import {
  STREAK,
  DAILY_GOAL,
  READER,
  BOOKS,
  RECENTLY_LOGGED,
  READING_LOG,
} from '../logging-flow/data'
import {
  CONNECTIONS,
  CONNECTION_LIST,
  TAKEN_USERNAMES,
  partnerMinutes,
} from '../logging-flow/connections'

import '../logging-flow/index.css'
import '@components/PrototypeNav/PrototypeNav.css'

// The reader app as it stands today — the page a reader actually sees, so the
// other prototypes have something current to be measured against.
//
// It is the real `Dashboard`, not a copy: Challenges, the Reading Log and
// Personalize Reader (where App Integrations live) all come from logging-flow's
// own component, and reading apps link through the same ConnectFlow. Logging is
// the real `LogFlow`.
//
// What is deliberately *not* here is anything still in design. Each of these is
// a prototype of its own, and putting it on this page would blur what has
// shipped with what has been proposed:
//
//  * **The vocabulary round.** `LogFlow` offers it when handed `onOpenWord`,
//    which is Words with Benny's hook; without that prop the success step is a
//    plain "Done" — the logging flow on its own.
//  * **Discover / My Shelf** (Book Discovery) and **the Gameboard** (Gameboard
//    Reader) stay in their own prototypes.
//  * **Reading in the app.** No title here is marked `readable`, so the flow
//    never offers the read-or-log choice and the e-reader never opens.
//  * **Scholastic.** The partner list and its titles are filtered out.

// The reading apps this page offers, and the titles that go with them.
const PARTNERS = CONNECTION_LIST.filter((p) => p.id !== 'scholastic')
const PARTNER_BOOKS = Object.fromEntries(
  Object.entries(BOOKS)
    .filter(([, b]) => b.partner !== 'scholastic')
    .map(([id, b]) => [id, { ...b, readable: false }]),
)
const RECENT = RECENTLY_LOGGED.filter((id) => BOOKS[id]?.partner !== 'scholastic')
// …and the log with it. Filtering the catalog but not the log left Scholastic
// magazines sitting in the Reading Log of a page that says it has no Scholastic.
const LOG = READING_LOG.filter((e) => e.source !== 'scholastic')

// The tabs in the real nav that the dashboard has never had a page for. This
// prototype builds them, so it claims them by id rather than letting the
// dashboard bounce them back to Challenges.
const OWN_TABS = ['badges', 'friends']

// Two of the six aren't top-level destinations here. Leaderboards is a sub-tab
// of Friends — the profile pairs the two on one page, and they're two views of
// the same people. Reviews sits under My Reading, beside the log and All
// Titles, since it's another record of what this reader has read.
const HIDE_TABS = ['leaderboards', 'reviews']
const LOG_TABS = [{ id: 'reviews', label: 'Reviews' }]

export function App() {
  const [flowOpen, setFlowOpen] = useState(false)
  const [streak, setStreak] = useState(STREAK)
  const [dailyGoal, setDailyGoal] = useState(DAILY_GOAL)

  // Linked reading apps, keyed by partner id — each is linked and unlinked on
  // its own.
  const [connections, setConnections] = useState({})
  const [linking, setLinking] = useState(null) // partner id mid-handoff
  const [visiting, setVisiting] = useState(null) // partner id whose catalog is open
  const [challenge, setChallenge] = useState(null) // the challenge whose page is open

  // The pages this prototype owns, by tab id.
  function renderTab(id) {
    if (id === 'badges') return <AllBadges />
    if (id === 'friends') return <Friends />
    return null
  }

  function handleLogged(entry) {
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
        partners={PARTNERS}
        logEntries={LOG}
        ownTabs={OWN_TABS}
        hideTabs={HIDE_TABS}
        renderExtra={renderTab}
        logTabs={LOG_TABS}
        renderLogTab={() => <Reviews />}
        onOpenChallenge={setChallenge}
        page={
          challenge ? (
            <ChallengePage challenge={challenge} entries={LOG} onBack={() => setChallenge(null)} />
          ) : null
        }
      />

      <LogFlow
        open={flowOpen}
        onClose={() => setFlowOpen(false)}
        onLogged={handleLogged}
        connections={connections}
        partners={PARTNERS}
        books={PARTNER_BOOKS}
        recentlyLogged={RECENT}
      />

      {visiting && connections[visiting] && (
        <PartnerCatalog
          partner={CONNECTIONS[visiting]}
          account={connections[visiting].account}
          titles={Object.values(PARTNER_BOOKS).filter((b) => b.partner === visiting)}
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

      <PrototypeNav currentHref="/bs-prototypes/web-app/" />
    </>
  )
}
