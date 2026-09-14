import { useState } from 'react'

import {
  ChallengeCard,
  ChallengeScope,
  GoalCard,
  LeaderboardCard,
  ReaderTopBar,
  StreakBanner,
} from '@components/ReaderApp/ReaderApp'
import {
  ConnectBanner,
  PartnerSwitcher,
  AutoLoggedCard,
} from '@components/PartnerConnect/PartnerConnect'
import { PersonalizeReader } from '@components/PartnerConnect/PersonalizeReader'

import { READER, OTHER_READERS, CHALLENGES, TOP_SCHOOLS, TOP_GRADES, BOOKS } from '../data'
import { CONNECTION_LIST, autoLoggedRows } from '../connections'
import { ReadingLog } from './ReadingLog'
import { JoyfulFooter, APPS } from '../../footers/JoyfulFooter'

// The current Beanstack footer lives in the `footers` prototype — logo + app
// stores over a Joyful Reading Co. attribution row, language picker and legal
// links. Rendered from there rather than kept as a second, stale copy here.
function Footer() {
  return <JoyfulFooter app={APPS.find((a) => a.id === 'beanstack')} />
}

/**
 * `extraTabs`, `renderExtra`, `railTop` and `view`/`onView` are optional and
 * additive — they let another prototype hang its own tab (and rail card) off
 * this real dashboard instead of cloning it. Words with Benny uses them to put
 * "My Words" next to the Reading Log. Left off, the page is exactly as it was.
 *
 * `hideTabs` drops built-in tabs by id, for when an extra tab supersedes one
 * (Words with Benny folds "All Badges" into its own Collections tab).
 *
 * `ownTabs` is the other half of that: built-in tab ids the parent renders
 * itself, through the same `renderExtra`. Four of the six tabs in the real nav
 * (Friends, Leaderboards, Reviews, All Badges) have never had a page here, and
 * `extraTabs` could only ever *add* a seventh — so web-app claims them by id
 * rather than hiding them and appending look-alikes in the wrong order.
 *
 * `partners` is the list of reading apps this prototype offers to link. It
 * defaults to logging-flow's own CONNECTION_LIST; pass `[]` and the entire
 * integration surface drops out — the connect banner, the topbar switcher, the
 * "logged for you" rail card, and the App Integrations settings section.
 *
 * `titlesView={false}` is passed straight through to the Reading Log: its
 * "All Titles" tab stays on the page but stops being reachable. `logEntries`
 * is too, for a prototype whose log isn't logging-flow's own — web-app has no
 * Scholastic, so its log must not carry Scholastic sessions either.
 */
export function Dashboard({
  streak,
  dailyGoal,
  onLog,
  connections,
  onLinkPartner,
  onDisconnectPartner,
  onVisitPartner,
  extraTabs = [],
  renderExtra,
  railTop,
  view: viewProp,
  onView: onViewProp,
  hideTabs = [],
  ownTabs = [],
  partners = CONNECTION_LIST,
  titlesView = true,
  logEntries,
}) {
  const [scope, setScope] = useState('current')
  // 'challenges' | 'settings' | 'log' | any `extraTabs` id — the gear (and
  // "Manage connections") opens the reader's Personalize Reader page, where App
  // Integrations live; the Reading Log tab opens the log itself. A parent can
  // drive the view instead, to deep-link straight to one of its extra tabs.
  const [viewState, setViewState] = useState('challenges')
  const view = viewProp ?? viewState
  const setView = onViewProp ?? setViewState
  const extraIds = extraTabs.map((t) => t.id)
  // A view the parent renders rather than this component: its own extra tabs,
  // plus any built-in tab it has claimed.
  const owned = (id) => extraIds.includes(id) || ownTabs.includes(id)
  // One banner covers every partner still to link, so waving it off is one
  // decision rather than one per app.
  const [dismissed, setDismissed] = useState(false)

  const toLink = dismissed ? [] : partners.filter((p) => !connections[p.id])

  return (
    <div className="wa-shell">
      {/* The partner app switcher sits ahead of the reader pill — "swap between
          the two at any time using the logo in the top right." */}
      <ReaderTopBar
        reader={READER}
        otherReaders={OTHER_READERS.filter((r) => r.id !== READER.id)}
        onLog={onLog}
        onHome={() => setView('challenges')}
        onAccount={() => setView('settings')}
        beforeUser={
          <PartnerSwitcher
            partners={partners}
            connections={connections}
            onManage={() => setView('settings')}
            onVisit={onVisitPartner}
          />
        }
        active={view === 'challenges' || view === 'settings' ? 'challenges' : view}
        onTabChange={(id) => setView(id === 'log' || owned(id) ? id : 'challenges')}
        extraTabs={extraTabs}
        hideTabs={hideTabs}
      />
      <main className="wa-main">
        <div className="wa-main-inner">
          {owned(view) ? (
            renderExtra?.(view)
          ) : view === 'log' ? (
            <ReadingLog entries={logEntries} partners={partners} titlesView={titlesView} />
          ) : view === 'settings' ? (
            <PersonalizeReader
              reader={READER}
              partners={partners}
              connections={connections}
              onLink={onLinkPartner}
              onDisconnect={onDisconnectPartner}
            />
          ) : (
            <>
              <ConnectBanner
                partners={toLink}
                onLink={onLinkPartner}
                onDismiss={() => setDismissed(true)}
              />
              <StreakBanner streak={streak} onLog={onLog} />
              <div className="wa-layout">
                <section className="wa-content">
                  <div className="wa-section-head">
                    <h2 className="wa-h2">Challenges</h2>
                    <ChallengeScope value={scope} onChange={setScope} />
                  </div>
                  <div className="wa-group">
                    <div className="wa-group-title">{READER.name}&apos;s Challenges</div>
                    <div className="wa-group-sub">
                      Challenges that {READER.name} is participating in.
                    </div>
                    <div className="wa-chgrid">
                      {CHALLENGES.map((c) => (
                        <ChallengeCard key={c.id} challenge={c} />
                      ))}
                    </div>
                  </div>
                </section>
                <div className="wa-rail">
                  {railTop}
                  <GoalCard dailyGoal={dailyGoal} />
                  <AutoLoggedCard
                    className="wa-card"
                    rows={partners.length ? autoLoggedRows(connections, BOOKS) : []}
                  />
                  <LeaderboardCard schools={TOP_SCHOOLS} grades={TOP_GRADES} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
