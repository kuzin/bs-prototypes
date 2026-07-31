import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { ReaderTopBar } from './ReaderChrome'
import { CHALLENGES, DAILY_GOAL, TOP_READERS, TOP_CLASSES, SITE, PATHS } from '../data'

// The student's Challenges page — the surface a Destination lives on. Same
// anatomy as the reader prototype's dashboard (streak banner → challenge grid +
// goal/leaderboard rail), built with this prototype's own `.pyp-*` chrome rather
// than importing web-app's stylesheet.

function StreakBanner({ streak, onDismiss }) {
  const has = streak > 0
  return (
    <div className="pyp-streak">
      <span className="pyp-streak-flame">
        <Icon name="flame-filled" size={17} />
        {streak}
      </span>
      <p className="pyp-streak-msg">
        {has ? (
          <>
            <strong>{streak}-day streak!</strong> Keep it going — log again today.
          </>
        ) : (
          <>
            <strong>No current streak.</strong> Log reading every day to start one!
          </>
        )}
      </p>
      <Button variant="secondary" size="sm">
        {has ? 'Log Today' : 'View Streaks'}
      </Button>
      <button className="pyp-streak-x" onClick={onDismiss} aria-label="Dismiss">
        <Icon name="x" size={14} />
      </button>
    </div>
  )
}

// The live challenge's art is a montage of the paths on offer, so the card shows
// at a glance that the challenge is a choice — clicking it opens the picker.
function PathMontage({ paths, onPick }) {
  return (
    <button className="pyp-chcard-montage" type="button" onClick={onPick}>
      {paths.map((p) => (
        <span
          key={p.id}
          className="pyp-chcard-slice"
          style={{
            backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${p.color} 80%, #04211e) 0%, color-mix(in srgb, ${p.color} 26%, transparent) 62%, transparent 100%), url(${p.banner})`,
          }}
        >
          <span className="pyp-chcard-slice-icon">
            <Icon name={p.icon} size={15} stroke={2} />
          </span>
        </span>
      ))}
      <span className="pyp-chcard-choose">
        <Icon name="route" size={15} stroke={2} />
        {paths.length} paths — pick yours
      </span>
    </button>
  )
}

function ChallengeCard({ challenge, paths, onPick, onOpen }) {
  const { art } = challenge
  return (
    <article className={`pyp-chcard${challenge.live ? ' is-live' : ''}`}>
      {challenge.live ? (
        <PathMontage paths={paths} onPick={onPick} />
      ) : (
        <span className="pyp-chcard-hero" style={{ background: art.bg }}>
          <span className="pyp-chcard-arttitle" style={{ color: art.ink }}>
            {challenge.title}
          </span>
          <span className="pyp-chcard-pill">
            <Pill color="#1A6DD5" variant="filled" size="sm">
              {challenge.badge}
            </Pill>
          </span>
        </span>
      )}
      <div className="pyp-chcard-body">
        <span className="pyp-chcard-title">{challenge.title}</span>
        <span className="pyp-chcard-dates">{challenge.dates}</span>
        <span className="pyp-chcard-kicker">{challenge.kicker}</span>
        {challenge.live && (
          <button className="pyp-chcard-open" type="button" onClick={onOpen}>
            Continue <Icon name="arrow-right" size={14} />
          </button>
        )}
      </div>
    </article>
  )
}

function GoalCard() {
  const { minutes, goal } = DAILY_GOAL
  const met = minutes >= goal
  return (
    <aside className="pyp-railcard">
      <h3 className="pyp-railcard-title">
        {met ? 'Well done!' : minutes > 0 ? 'Almost there!' : "Today's Goal"}
      </h3>
      <p className="pyp-railcard-sub">
        {met
          ? "You've hit your reading goal for the day."
          : `Read ${goal - minutes} more minutes to hit your daily goal.`}
      </p>
      <div className="pyp-goal-amount">
        <strong style={{ color: met ? '#16A97A' : '#0F766E' }}>{minutes}</strong>
        <span> / {goal} minutes</span>
      </div>
      <ProgressBar value={minutes} max={goal} color={met ? '#16A97A' : '#0F766E'} size="lg" />
    </aside>
  )
}

function LeaderboardCard() {
  const [scope, setScope] = useState('readers')
  const rows = scope === 'readers' ? TOP_READERS : TOP_CLASSES
  return (
    <aside className="pyp-railcard">
      <div className="pyp-railcard-tabs">
        <Tabs
          variant="underline"
          size="sm"
          active={scope}
          accent="#0F766E"
          onChange={setScope}
          items={[
            { id: 'readers', label: 'Top Readers' },
            { id: 'classes', label: 'Top Classes' },
          ]}
        />
      </div>
      <ul className="pyp-lead">
        {rows.map((row) => (
          <li key={row.rank} className={`pyp-lead-row${row.isMe ? ' is-me' : ''}`}>
            <span className="pyp-lead-rank" style={{ background: row.color }}>
              {row.rank}
            </span>
            <span className="pyp-lead-name">
              {row.name}
              {row.isMe && <em> (you)</em>}
            </span>
            <span className="pyp-lead-val">{row.value.toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <button className="pyp-lead-more" type="button">
        View all
      </button>
    </aside>
  )
}

/**
 * @param streak   the student's current day streak
 * @param offered  path ids the teacher put on offer — drives the montage
 * @param onPick   clicking the challenge art → open the path picker
 * @param onOpen   "Continue" → straight to the path view
 * @param onNav    reader-chrome nav clicks
 */
export function ChallengeDashboard({ streak, offered, onPick, onOpen, onNav }) {
  const paths = PATHS.filter((p) => offered.includes(p.id))
  const [scope, setScope] = useState('current')
  const [streakOpen, setStreakOpen] = useState(true)

  return (
    <div className="pyp-reader">
      <ReaderTopBar active="challenges" onNav={onNav} />

      <main className="pyp-reader-body">
        <div className="pyp-reader-inner">
          {streakOpen && <StreakBanner streak={streak} onDismiss={() => setStreakOpen(false)} />}

          <div className="pyp-chlayout">
            <section>
              <div className="pyp-section-head pyp-ch-head">
                <h2 className="pyp-h2">Challenges</h2>
                <Tabs
                  variant="pill"
                  size="sm"
                  active={scope}
                  accent="#0F766E"
                  onChange={setScope}
                  items={[
                    { id: 'current', label: 'Current' },
                    { id: 'past', label: 'Past' },
                  ]}
                />
              </div>

              {scope === 'current' ? (
                <>
                  <p className="pyp-section-sub">
                    Challenges {SITE.student.firstName} is taking part in.
                  </p>
                  <div className="pyp-chgrid">
                    {CHALLENGES.map((c) => (
                      <ChallengeCard
                        key={c.id}
                        challenge={c}
                        paths={paths}
                        onPick={onPick}
                        onOpen={onOpen}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <p className="pyp-log-empty">
                  No past challenges yet — finished challenges will show up here.
                </p>
              )}
            </section>

            <div className="pyp-chrail">
              <GoalCard />
              <LeaderboardCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
