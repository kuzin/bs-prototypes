import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { EmptyState } from '@components/Primitives/Primitives'
import {
  BannerStack,
  ChallengeCard,
  ChallengeScope,
  GoalCard,
  LeaderboardCard,
  StreakBanner,
} from '@components/ReaderApp/ReaderApp'

import { ReaderShell } from './ReaderChrome'
import { CHALLENGES, DAILY_GOAL, TOP_READERS, TOP_CLASSES, SITE, PATHS } from '../data'

/* The student's Challenges page — the surface a Destination lives on, and the
   reader dashboard every other prototype renders: streak banner over a
   challenge grid, with the goal and the leaderboard in the rail. It used to
   hand-roll all of that against its own `.pyp-*` chrome. */

// This site has no Ignored list, so the scope control is the two the app shows
// a reader with nothing dismissed.
const SCOPES = [
  { id: 'current', label: 'Current' },
  { id: 'past', label: 'Past' },
]

/**
 * The cover of a challenge you pick your way through — one slice per path on
 * offer, so the card says at a glance that this one is a choice. It is the
 * card's `hero` slot rather than a card of its own: what goes in the art is the
 * challenge's business, and everything around it is the shared card.
 */
function PathMontage({ paths }) {
  return (
    <span className="pyp-montage">
      {paths.map((p) => (
        <span
          key={p.id}
          className="pyp-montage-slice"
          style={{
            backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${p.color} 78%, #04211e) 0%, color-mix(in srgb, ${p.color} 22%, transparent) 60%, transparent 100%), url(${p.banner})`,
          }}
        />
      ))}
      <span className="pyp-montage-cta">
        <Icon name="route" size={15} stroke={2} />
        {paths.length} paths — pick yours
      </span>
    </span>
  )
}

/**
 * @param streak   the student's current day streak
 * @param offered  path ids the teacher put on offer — how many there are to pick
 * @param chosen   the path the student is on, if they have picked one
 * @param onPick   open the path picker
 * @param onOpen   open the challenge itself
 * @param onNav    site-nav clicks
 */
export function ChallengeDashboard({ streak, chosen, offered = [], onOpen, onNav, onLog }) {
  const [scope, setScope] = useState('current')
  const paths = PATHS.filter((p) => offered.includes(p.id))

  /* The live one's cover depends on whether the reader has chosen yet: the
     three paths on offer until they do, and the one they picked after. A
     challenge card is the challenge you are in, and on this one that includes
     the path — the way in is the card, and changing it happens inside. */
  const challenges = CHALLENGES.map((c) =>
    !c.live
      ? c
      : chosen
        ? { ...c, bannerImg: chosen.banner, connectedSite: `Your path · ${chosen.name}` }
        : { ...c, hero: <PathMontage paths={paths} />, connectedSite: 'Pick your path to start' },
  )

  return (
    <ReaderShell active="challenges" onNav={onNav} onLog={onLog}>
      <BannerStack className="wa-main-banners">
        <StreakBanner streak={{ current: streak }} onLog={onLog} />
      </BannerStack>

      <div className="wa-layout">
        <section className="wa-content">
          <div className="wa-section-head">
            <h2 className="wa-h2">Challenges</h2>
            <div className="wa-section-actions">
              <ChallengeScope value={scope} onChange={setScope} scopes={SCOPES} />
            </div>
          </div>

          {scope === 'current' ? (
            <>
              <p className="wa-group-sub">Challenges {SITE.student.firstName} is taking part in.</p>
              <div className="wa-chgrid">
                {challenges.map((c) => (
                  <ChallengeCard
                    key={c.id}
                    challenge={c}
                    /* Only the destination has a page behind it; the other two
                       are the scaffolding every prototype carries. */
                    onOpen={c.live ? onOpen : undefined}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              variant="dashed"
              title="Nothing finished yet"
              description={`Challenges ${SITE.student.firstName} has finished will show up here.`}
            />
          )}
        </section>

        <div className="wa-rail">
          <GoalCard dailyGoal={DAILY_GOAL} />
          <LeaderboardCard
            schools={TOP_READERS}
            grades={TOP_CLASSES}
            labels={{ schools: 'Readers', grades: 'Classes' }}
          />
        </div>
      </div>
    </ReaderShell>
  )
}
