import { useState } from 'react'
import {
  ChallengeCard,
  GoalCard,
  ReaderTopBar,
  StreakBanner,
} from '@components/ReaderApp/ReaderApp'
import {
  ConnectBanner,
  PartnerSwitcher,
  AutoLoggedCard,
} from '@components/PartnerConnect/PartnerConnect'
import { PersonalizeReader } from '@components/PersonalizeReader/PersonalizeReader'

import { PARTNERS, PARTNER_BY_ID } from '../connections'
import { READER, CHALLENGES, TITLE_BY_ID, importedSessions, readingLogEntries } from '../data'
import { ReadingLog } from '../../logging-flow/components/ReadingLog'
import { JoyfulFooter, APPS } from '../../footers/JoyfulFooter'
import './Dashboard.css'

// Today's reading from every linked app, in the shape the shared rail card
// wants. With two apps connected the card is the clearest picture of the
// integration: one list, one total, two sources.
const autoLoggedRows = (connections) =>
  importedSessions(connections)
    .filter((s) => s.when === 'Today')
    .map((s) => ({
      id: s.id,
      partnerId: s.partnerId,
      title: TITLE_BY_ID[s.title].title,
      meta: `${PARTNER_BY_ID[s.partnerId].name} · ${s.when}${s.finished ? ' · Finished' : ''}`,
      minutes: s.minutes,
    }))

export function Dashboard({
  streak,
  dailyGoal,
  connections,
  onLinkPartner,
  onDisconnectPartner,
  onVisitPartner,
}) {
  // 'challenges' | 'settings' | 'log' — the gear (and "Manage connections") opens
  // Personalize Reader, where App Integrations live.
  const [view, setView] = useState('challenges')
  // One banner covers every app still to link, so waving it off is one decision.
  const [dismissed, setDismissed] = useState(false)

  const linkedCount = PARTNERS.filter((p) => connections[p.id]).length
  const toLink = dismissed ? [] : PARTNERS.filter((p) => !connections[p.id])

  return (
    <div className="wa-shell">
      {/* One reader, one action, and no Reviews tab — this prototype is about
          what a linked app puts into Beanstack, not the whole site. */}
      <ReaderTopBar
        reader={{ ...READER, name: READER.name.split(' ')[0] }}
        secondaryActions={false}
        accountMenu={false}
        onAccount={() => setView('settings')}
        onHome={() => setView('challenges')}
        beforeUser={
          <PartnerSwitcher
            partners={PARTNERS}
            connections={connections}
            onManage={() => setView('settings')}
            onVisit={onVisitPartner}
          />
        }
        hideTabs={['reviews']}
        active={view === 'log' ? 'log' : 'challenges'}
        onTabChange={(id) => setView(id === 'log' ? 'log' : 'challenges')}
      />
      <main className="wa-main">
        <div className="wa-main-inner">
          {view === 'log' ? (
            <ReadingLog entries={readingLogEntries(connections)} partners={PARTNERS} />
          ) : view === 'settings' ? (
            <PersonalizeReader
              reader={READER}
              partners={PARTNERS}
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
              <StreakBanner
                streak={streak}
                message={
                  streak.current > 0 ? (
                    <>
                      <strong>{streak.current}-day streak!</strong> Reading in{' '}
                      {linkedCount > 1 ? 'your linked apps counts' : 'your linked app counts'}{' '}
                      toward it too.
                    </>
                  ) : undefined
                }
              />
              <div className="wa-layout">
                <section className="wa-content">
                  <div className="wa-section-head">
                    <h2 className="wa-h2">Challenges</h2>
                  </div>
                  <div className="wa-group">
                    <div className="wa-group-title">{READER.name}&apos;s Challenges</div>
                    <div className="wa-group-sub">
                      Reading in any linked app counts toward these.
                    </div>
                    <div className="wa-chgrid">
                      {CHALLENGES.map((c) => (
                        <ChallengeCard key={c.id} challenge={c} />
                      ))}
                    </div>
                  </div>
                </section>
                <div className="wa-rail">
                  <GoalCard dailyGoal={dailyGoal} />
                  <AutoLoggedCard className="wa-card" rows={autoLoggedRows(connections)} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <JoyfulFooter app={APPS.find((a) => a.id === 'beanstack')} />
    </div>
  )
}
