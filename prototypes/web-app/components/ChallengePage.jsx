import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { BadgeArt, CollectionCard, ShelfGrid } from '@components/CollectionShelf/CollectionShelf'
import { badgeSrc, bannerSrc } from '@components/ReaderApp/ReaderApp'

import { ReadingLog } from '../../logging-flow/components/ReadingLog'
import { BADGES, getChallengeDetail } from '../data'
import './ChallengePage.css'

import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'

/**
 * One challenge, from the reader's side — `programs/_show.html.haml` and
 * `_program_header.html.haml`.
 *
 * The header is `_program_header.html.haml` in full, because its shape is the
 * page's whole character: two tinted bands with a curved lip, the banner
 * floating over them on a rounded card, and the name and date span centred
 * underneath — or the literal "Ongoing Challenge" where there is no date span.
 * The page ground curves back up behind the title.
 *
 * The bands are tinted from the banner's own dominant colour, blended with
 * white at 20% and 40%. The app samples that colour at runtime with ColorThief;
 * it is measured at build time here and carried on the challenge as `tint`.
 *
 * Under the header, the app's own tab strip — the four built out here are the
 * four a reader actually uses.
 *
 * No back link and no Print button up here: the app has neither. The nav's
 * Challenges tab is the way out, and printing belongs to the log, which has its
 * own Print button on the Challenge Log tab.
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
                art={<BadgeArt src={badgeSrc(b.set, b.art)} />}
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
            art={<BadgeArt src={badgeSrc(b.set, b.art)} />}
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

/** The dominant colour blended with white, the way the app's ColorThief does. */
function wash(hex, alpha) {
  const h = hex.replace('#', '')
  const mix = (i) => Math.round(parseInt(h.slice(i, i + 2), 16) * alpha + 255 * (1 - alpha))
  return `rgb(${mix(0)}, ${mix(2)}, ${mix(4)})`
}

export function ChallengePage({ challenge, entries }) {
  const [tab, setTab] = useState('overview')
  const detail = getChallengeDetail(challenge.id)
  const banner = bannerSrc(challenge.banner)
  const tint = challenge.tint ?? '#ACACAC'

  return (
    <div className="cp">
      {/* The app names these the other way round — `-bar-light` takes the 40%
          blend and `-bar-dark` the 20% — so the stronger band is the tall one
          at the top and the paler one sits behind its curve. */}
      <div className="cp-header">
        <div className="cp-bar-strong" style={{ background: wash(tint, 0.4) }} />
        <div className="cp-bar-pale" style={{ background: wash(tint, 0.2) }} />
        <div className="cp-header-info">
          <img src={banner} alt={challenge.title} />
          <h1 className="cp-title">{challenge.title}</h1>
          {/* `program.date_span`, or the literal the app writes when there
              isn't one. */}
          <span className="cp-dates">
            {challenge.dates === 'Ongoing' ? 'Ongoing Challenge' : challenge.dates}
          </span>
        </div>
      </div>

      <div className="cp-head">
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
        {/* The challenge's own log is the reader's log scoped to it. Its
            sub-tabs go (this page has a strip already), it opens on the titles
            shelf — what belongs here is what was read toward this challenge,
            not a month calendar of everything logged anywhere — and the summary
            row goes with them, since Overview already carries the totals. */}
        {tab === 'log' && (
          <ReadingLog
            entries={entries}
            heading="Challenge Log"
            subtabs={false}
            defaultTab="titles"
            stats={false}
          />
        )}
      </div>
    </div>
  )
}
