import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { BadgeArt, CollectionCard, ShelfGrid } from '@components/CollectionShelf/CollectionShelf'
import { GoalTile, GoalTiles } from '@components/GoalTile/GoalTile'
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
        <GoalTiles>
          {detail.goals.map((g) => (
            <GoalTile key={g.label} label={g.label} have={g.have} need={g.need} />
          ))}
        </GoalTiles>
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
            defaultView="titles"
            stats={false}
          />
        )}
      </div>
    </div>
  )
}
