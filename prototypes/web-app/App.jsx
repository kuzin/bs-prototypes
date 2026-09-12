import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import {
  ChallengeCard,
  ChallengeScope,
  GoalCard,
  LeaderboardCard,
  ReaderTopBar,
  StreakBanner,
} from '@components/ReaderApp/ReaderApp'
import { JoyfulFooter, APPS } from '../footers/JoyfulFooter'

import '../ris/index.css'
import '@components/PrototypeNav/PrototypeNav.css'

import {
  USER,
  OTHER_READERS,
  STREAK,
  DAILY_GOAL,
  CHALLENGES,
  TOP_SCHOOLS,
  TOP_GRADES,
} from './data'

// This is the plain reader dashboard — the same chrome and rail cards the
// integration prototypes build on, with none of their additions. Every piece
// comes from @components/ReaderApp, so the page can't fall behind the way it
// did while it kept its own copy of the markup.

export function App() {
  const [scope, setScope] = useState('current')

  return (
    <div className="wa-shell">
      {/* Challenges is the only view here — the rest of the site nav is chrome,
          so the strip shows where you are and stays put, the way it did before
          this page moved onto the shared bar. */}
      <ReaderTopBar reader={USER} otherReaders={OTHER_READERS} active="challenges" />

      <main className="wa-main">
        <div className="wa-main-inner">
          <StreakBanner streak={STREAK} />

          <div className="wa-layout">
            <section className="wa-content">
              <div className="wa-section-head">
                <h2 className="wa-h2">Challenges</h2>
                <ChallengeScope value={scope} onChange={setScope} />
              </div>

              <div className="wa-group">
                <div className="wa-group-title">{USER.name}&apos;s Challenges</div>
                <div className="wa-group-sub">Challenges that {USER.name} is participating in.</div>

                <div className="wa-chgrid">
                  {CHALLENGES.map((c) => (
                    <ChallengeCard key={c.id} challenge={c} />
                  ))}
                </div>
              </div>
            </section>

            <div className="wa-rail">
              <GoalCard dailyGoal={DAILY_GOAL} />
              <LeaderboardCard schools={TOP_SCHOOLS} grades={TOP_GRADES} />
            </div>
          </div>
        </div>
      </main>

      <JoyfulFooter app={APPS.find((a) => a.id === 'beanstack')} />

      <PrototypeNav currentHref="/bs-prototypes/web-app/" />
    </div>
  )
}
