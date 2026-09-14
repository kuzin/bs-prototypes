import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { BadgeDisc, CollectionCard, ShelfGrid } from '@components/CollectionShelf/CollectionShelf'
import { CHALLENGE_ART } from '@components/ReaderApp/ReaderApp'

import { ReadingLog } from '../../logging-flow/components/ReadingLog'
import { BADGES, getChallengeDetail } from '../data'
import './ChallengePage.css'

import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'

/**
 * One challenge, from the reader's side — `programs/_show.html.haml` and
 * `_program_header.html.haml`.
 *
 * The header is the challenge's banner (a Program's `header_image`, which the
 * real ones ship at 2.62:1), the name, and the date span — or the literal
 * "Ongoing Challenge" where there isn't one. Under it the app's own tab strip;
 * the four built out here are the four a reader actually uses.
 *
 * The banner is the card's own art at the banner's ratio, not one of the real
 * uploaded banners in `public/challenge-banners/`: those are branded for the
 * specific Beanstack challenges they were drawn for, and "Guilford County
 * Schools" over "Spring Into Reading" reads as a mistake. This way the hero is
 * the same artwork as the card the reader just clicked.
 *
 * The real nav is longer — Reading List, Bingo Card, Ticket Drawings and
 * Certificates each appear when the challenge has them. They stay as furniture.
 */

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'badges', label: 'Badges' },
  { id: 'rewards', label: 'Rewards' },
  { id: 'log', label: 'Challenge Log' },
  { id: 'reading-list', label: 'Reading List', disabled: true },
  { id: 'drawings', label: 'Ticket Drawings', disabled: true },
  { id: 'certificates', label: 'Certificates', disabled: true },
]

/**
 * One of the Overview's "Overall Progress" tiles: a ring around the share
 * completed, the count under it. `_overview_list_goals.html.haml`.
 */
function GoalRing({ goal }) {
  const pct = Math.min(100, Math.round((goal.have / goal.need) * 100))
  const done = goal.have >= goal.need
  return (
    <li className={`cp-goal${done ? ' is-done' : ''}`}>
      <div className="cp-goal-ring">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle className="cp-goal-track" cx="50" cy="50" r="44" />
          <circle
            className="cp-goal-fill"
            cx="50"
            cy="50"
            r="44"
            pathLength="100"
            strokeDasharray={`${pct} 100`}
          />
        </svg>
        <span className="cp-goal-pct">{pct}%</span>
      </div>
      <div className="cp-goal-copy">
        <span className="cp-goal-label">{goal.label}</span>
        <span className="cp-goal-num">
          {goal.have.toLocaleString()}
          <em>/{goal.need.toLocaleString()}</em>
        </span>
      </div>
    </li>
  )
}

function Overview({ detail, challenge }) {
  // "Recently Earned Badges" is the first six, which is what the app shows.
  const recent = BADGES.filter((b) => !b.locked).slice(0, 6)

  return (
    <>
      <section className="cp-section">
        <div className="cp-types">
          {detail.types.map((t) => (
            <Pill key={t} color="#1A6DD5" variant="soft" size="sm">
              {t}
            </Pill>
          ))}
        </div>
        <p className="cp-description">{detail.description}</p>
        <p className="cp-started">
          <Icon name="calendar" size={15} />
          {challenge.title} started on {detail.startedOn}
        </p>
      </section>

      <section className="cp-section">
        <h2 className="cp-h2">Overall Progress</h2>
        <ul className="cp-goals">
          {detail.goals.map((g) => (
            <GoalRing key={g.label} goal={g} />
          ))}
        </ul>
      </section>

      <section className="cp-section">
        <h2 className="cp-h2">Recently Earned Badges</h2>
        {recent.length === 0 ? (
          <p className="cp-empty">
            Olivia hasn&apos;t earned any badges yet. Participate in the challenge to earn badges.
          </p>
        ) : (
          <ShelfGrid>
            {recent.map((b) => (
              <CollectionCard
                key={b.name}
                art={
                  <BadgeDisc color={b.color}>
                    <Icon name={b.icon} size={38} stroke={1.7} />
                  </BadgeDisc>
                }
                name={b.name}
                blurb={b.blurb}
                date={`Completed on ${b.date}`}
              />
            ))}
          </ShelfGrid>
        )}
      </section>
    </>
  )
}

function Badges() {
  const earned = BADGES.filter((b) => !b.locked)
  const ordered = [...earned, ...BADGES.filter((b) => b.locked)]

  return (
    <section className="cp-section">
      <h2 className="cp-h2">Badges</h2>
      <p className="cp-subhead">
        {earned.length}/{BADGES.length} Badges Earned
      </p>
      <ShelfGrid>
        {ordered.map((b) => (
          <CollectionCard
            key={b.name}
            art={
              <BadgeDisc color={b.color}>
                <Icon name={b.icon} size={38} stroke={1.7} />
              </BadgeDisc>
            }
            name={b.name}
            blurb={b.blurb}
            locked={b.locked}
            progress={b.locked ? Math.round((b.have / b.need) * 100) : undefined}
            date={
              b.locked
                ? `${b.have.toLocaleString()}/${b.need.toLocaleString()} ${b.unit} Completed`
                : `Completed on ${b.date}`
            }
          />
        ))}
      </ShelfGrid>
    </section>
  )
}

function Rewards({ detail }) {
  const earned = detail.rewards.filter((r) => r.earned)
  return (
    <section className="cp-section">
      <h2 className="cp-h2">Rewards</h2>
      <p className="cp-subhead">
        {earned.length}/{detail.rewards.length} Earned Rewards
      </p>
      <ul className="cp-rewards">
        {detail.rewards.map((r) => (
          <li key={r.name} className={`cp-reward${r.earned ? ' is-earned' : ''}`}>
            <span className="cp-reward-mark">
              <Icon name={r.earned ? 'circle-check-filled' : 'gift'} size={26} />
            </span>
            <div className="cp-reward-copy">
              <span className="cp-reward-name">{r.name}</span>
              <span className="cp-reward-detail">{r.detail}</span>
            </div>
            <span className="cp-reward-at">
              {r.earned ? `Earned On ${r.on}` : `At ${r.at.toLocaleString()} minutes`}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ChallengePage({ challenge, entries, onBack }) {
  const [tab, setTab] = useState('overview')
  const detail = getChallengeDetail(challenge.id)
  const art = CHALLENGE_ART[challenge.art] ?? CHALLENGE_ART.spring

  return (
    <div className="cp">
      <div className="cp-banner" style={{ background: art.bg }}>
        <span className="cp-banner-title" style={{ color: art.titleColor }}>
          {art.title}
        </span>
      </div>

      <div className="cp-head">
        <button type="button" className="cp-back" onClick={onBack}>
          <Icon name="chevron-left" size={15} stroke={2.4} />
          All challenges
        </button>
        <div className="cp-headrow">
          <div>
            <h1 className="cp-title">{challenge.title}</h1>
            {/* `program.date_span`, or the literal the app writes when there
                isn't one. */}
            <p className="cp-dates">
              {challenge.dates === 'Ongoing' ? 'Ongoing Challenge' : challenge.dates}
            </p>
          </div>
          {/* The log tab brings its own Print button, so this one steps aside
              rather than putting two on the same screen. */}
          {tab !== 'log' && (
            <Button variant="secondary" size="md" icon={<Icon name="printer" size={15} />}>
              Print log
            </Button>
          )}
        </div>
        <div className="cp-tabs">
          <Tabs
            variant="underline"
            size="md"
            active={tab}
            accent="#1A6DD5"
            onChange={setTab}
            ariaLabel="Challenge sections"
            items={TABS}
          />
        </div>
      </div>

      <div className="cp-body">
        {tab === 'overview' && <Overview detail={detail} challenge={challenge} />}
        {tab === 'badges' && <Badges />}
        {tab === 'rewards' && <Rewards detail={detail} />}
        {/* The challenge's own log is the reader's log scoped to it — the same
            page, which is why the app titles it "{first_name}'s Log". Its own
            sub-tabs go (this page has a strip already) and it opens on the
            titles shelf: what belongs here is what was read toward this
            challenge, not a month calendar of everything logged anywhere. */}
        {tab === 'log' && (
          <ReadingLog
            entries={entries}
            heading="Olivia's Log"
            subtabs={false}
            defaultTab="titles"
          />
        )}
      </div>
    </div>
  )
}
