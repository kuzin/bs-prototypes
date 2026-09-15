import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import {
  BadgeArt,
  BadgeShelf,
  CollectionCard,
  ShelfGrid,
} from '@components/CollectionShelf/CollectionShelf'
import { GoalStat, GoalStats } from '@components/GoalStat/GoalStat'
import { Button } from '@components/Button/Button'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { NumberInput } from '@components/Form/Form'
import { EmptyState } from '@components/Primitives/Primitives'
import { InfoBox } from '@components/InfoBox/InfoBox'
import { BookCover } from '../../logging-flow/components/BookCover'
import { badgeSrc, bannerSrc } from '@components/ReaderApp/ReaderApp'
import { ProgramHeader } from '@components/ProgramHeader/ProgramHeader'
import { FilterMenuBar } from '@components/FilterMenu/FilterMenu'
import { byEarnedState, EarnedFilter } from '@components/EarnedFilter/EarnedFilter'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'

import { ReadingLog } from '../../logging-flow/components/ReadingLog'
import { BADGES, CATALOG_BY_ID, getChallengeDetail, getChallengeExtras } from '../data'
import './ChallengePage.css'

import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'
import '@components/Button/Button.css'
import '@components/Modal/Modal.css'
import '@components/Form/Form.css'
import '@components/Primitives/Primitives.css'

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
 * The nav is built from what the challenge *has*
 * (`navigation/sidebar/_single_program_nav`): a Reading List only on a
 * `book_list` challenge, Ticket Drawings only where `@ticket_rewards_exist`,
 * Certificates only where `@certificates_exist`. Nothing is greyed out — a
 * challenge without them hasn't got those tabs, which is a truer thing to show
 * than a row of controls that don't work.
 *
 * Bingo Card is the exception still standing: a bingo board is the Gameboard
 * Reader prototype's whole subject, and a second one here would be a copy that
 * drifts.
 */

function tabsFor(extras) {
  return [
    { id: 'overview', label: 'Overview' },
    ...(extras.readingList ? [{ id: 'reading-list', label: 'Reading List' }] : []),
    { id: 'bingo', label: 'Bingo Card', disabled: true },
    { id: 'badges', label: 'Badges' },
    { id: 'rewards', label: 'Rewards' },
    ...(extras.drawings?.length ? [{ id: 'drawings', label: 'Ticket Drawings' }] : []),
    ...(extras.certificates?.length ? [{ id: 'certificates', label: 'Certificates' }] : []),
    { id: 'log', label: 'Challenge Log' },
  ]
}

/**
 * The Overview — `programs/_show.html.haml`, which is three blocks and nothing
 * else: the description, "Overall Progress", and "Recently Earned Badges".
 *
 * There is no date line in the body. The app puts the span in the header and
 * says nothing further; "started on April 3" was ours, and it sat between the
 * description and the progress strip saying less than either.
 */
function Overview({ detail, onTab }) {
  // "Recently Earned Badges" is the first six, which is what the app shows.
  const recent = BADGES.filter((b) => !b.locked).slice(0, 6)

  return (
    <>
      <section className="cp-section">
        <ReaderPageHead as="h2" title="Overview" />
        {/* A challenge you find under Past is finished, and everything on this
            page is a record rather than something to act on: the rings won't
            move, the badges are the badges. Saying so at the top is the one
            thing this page owes a reader who arrived from the Past list. */}
        {detail.endedOn && (
          <InfoBox icon={<Icon name="calendar" size={26} />} className="cp-endednote">
            This challenge ended on {detail.endedOn}. Everything here is final — logging now counts
            toward your current challenges instead.
          </InfoBox>
        )}
        <h2 className="cp-h2">Description</h2>
        <p className="cp-description">{detail.description}</p>
      </section>

      {/* `.challenge-content-goals`. Every tile is a link to the tab that
          explains its number, which is what `_overview_list_goals`'s own hrefs
          do — Titles to the reading list, Rewards to Rewards, the rest to the
          badges that measure them. */}
      {detail.goals.length > 0 && (
        <section className="cp-section">
          <h2 className="cp-h2">Overall Progress</h2>
          <GoalStats>
            {detail.goals.map((g) => (
              <GoalStat key={g.label} goal={g} onClick={() => onTab?.(g.tab)} />
            ))}
          </GoalStats>
        </section>
      )}

      <section className="cp-section">
        <h2 className="cp-h2">Recently Earned Badges</h2>
        {recent.length === 0 ? (
          // `.no-results` — the app's own two lines, a heading over a sentence.
          <EmptyState
            icon={<Icon name="award" size={26} />}
            title="Olivia hasn't earned any badges yet."
            description="Participate in the challenge to earn badges."
          />
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
  return (
    <section className="cp-section">
      <ReaderPageHead as="h2" title="Badges" />
      <BadgeShelf
        badges={BADGES}
        src={(b) => badgeSrc(b.set, b.art)}
        emptyIcon={<Icon name="award" size={26} />}
      />
    </section>
  )
}

function Rewards({ detail }) {
  const [state, setState] = useState('all')
  const isEarned = (r) => Boolean(r.earned)

  return (
    <section className="cp-section">
      <ReaderPageHead as="h2" title="Rewards" />
      <FilterMenuBar className="cp-rewardfilters">
        <EarnedFilter
          items={detail.rewards}
          isEarned={isEarned}
          value={state}
          onChange={setState}
          ariaLabel="Which rewards"
        />
      </FilterMenuBar>
      <ul className="cp-rewards">
        {byEarnedState(detail.rewards, state, isEarned).map((r) => (
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
/**
 * The Reading List tab — a `book_list` challenge's own shelf. The titles the
 * challenge asks you to read, each one a book you can open or log.
 */
function ReadingList({ list, onLog }) {
  if (!list) return null
  const books = list.books.map((id) => CATALOG_BY_ID[id]).filter(Boolean)
  return (
    <section className="cp-section">
      <ReaderPageHead as="h2" title={list.name} />
      {/* The list's line is the rule of the thing — "read any four of these and
          it counts" — not a caption under the title, so it takes the app's own
          `.infobox` rather than sitting in the prose. */}
      <InfoBox icon={<Icon name="bulb" size={26} />} className="cp-listnote">
        {list.description}
      </InfoBox>
      <ul className="cp-list">
        {books.map((b) => (
          <li className="cp-listbook" key={b.id}>
            <span className="cp-listbook-cover">
              <BookCover book={b} size="fill" />
            </span>
            <div className="cp-listbook-meta">
              <span className="cp-listbook-title">{b.title}</span>
              <span className="cp-listbook-author">{b.author}</span>
            </div>
            <Button size="sm" onClick={() => onLog?.(b)}>
              Log
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Ticket Drawings — `programs/_ticket_reward.html.haml`. A prize drawn from the
 * tickets readers earn, and the reader decides which drawings to spend theirs
 * on: the same ticket can't go into two.
 *
 * A drawing that has closed says so and offers nothing — "Drawing has ended.
 * Winners will be notified." is the app's own line, and the site can rename
 * "drawing" (`word_for_drawing`) because a raffle is illegal in some states.
 */
function Drawings({ extras }) {
  const [entered, setEntered] = useState(() =>
    Object.fromEntries((extras.drawings ?? []).map((d) => [d.id, d.entered])),
  )
  const [adding, setAdding] = useState(null) // the drawing whose modal is open
  const [draft, setDraft] = useState(0)

  const earned = extras.tickets?.earned ?? 0
  const spent = Object.values(entered).reduce((n, v) => n + v, 0)
  const available = Math.max(0, earned - spent)

  return (
    <section className="cp-section">
      <ReaderPageHead
        as="h2"
        title="Ticket Drawings"
        actions={
          <p className="cp-tickets-count">
            <Icon name="ticket" size={16} /> {available} {available === 1 ? 'ticket' : 'tickets'}{' '}
            available
          </p>
        }
      />

      <ul className="cp-drawings">
        {(extras.drawings ?? []).map((d) => (
          <li className="cp-drawing" key={d.id}>
            <div className="cp-drawing-body">
              <span className="cp-drawing-when">
                {d.ended ? `Ended on ${d.endsOn}` : `Ends on ${d.endsOn}`}
              </span>
              <h3 className="cp-drawing-title">{d.title}</h3>
              <p className="cp-drawing-desc">{d.description}</p>
              <div className="cp-drawing-status">
                {d.ended ? (
                  <span className="cp-drawing-ended">
                    <Icon name="clock" size={16} /> Drawing has ended. Winners will be notified.
                  </span>
                ) : (
                  <>
                    <Button
                      size="sm"
                      disabled={available === 0}
                      onClick={() => {
                        setDraft(1)
                        setAdding(d)
                      }}
                    >
                      Add Tickets
                    </Button>
                    {entered[d.id] > 0 && (
                      <span className="cp-drawing-entered">
                        <Icon name="ticket" size={15} /> {entered[d.id]}{' '}
                        {entered[d.id] === 1 ? 'Ticket' : 'Tickets'} Entered
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* `ticket_rewards/_enter_drawing` — the title, what's left, and a
          stepper. The button counts what you're about to spend. */}
      <Modal
        open={Boolean(adding)}
        onClose={() => setAdding(null)}
        variant="center"
        closeBadge
        ariaLabel="Enter tickets"
      >
        <ModalClose onClick={() => setAdding(null)} />
        {adding && (
          <>
            <div className="modal-header modal-header--flush">
              <div className="modal-header-text">
                <h2 className="modal-title">{adding.title}</h2>
                <p className="modal-sub">
                  {available} {available === 1 ? 'Ticket' : 'Tickets'} Available
                </p>
              </div>
            </div>
            <div className="modal-body cp-ticketbody">
              <NumberInput
                size="lg"
                min={0}
                max={available}
                value={draft}
                onChange={setDraft}
                aria-label="Tickets to enter"
              />
            </div>
            <div className="modal-footer">
              <Button variant="ghost" onClick={() => setAdding(null)}>
                Cancel
              </Button>
              <Button
                disabled={draft < 1}
                onClick={() => {
                  setEntered((e) => ({ ...e, [adding.id]: (e[adding.id] ?? 0) + draft }))
                  setAdding(null)
                }}
              >
                Enter {draft} {draft === 1 ? 'Ticket' : 'Tickets'}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}

/**
 * Certificates — `programs/earned_certificate`. The app renders a printable
 * page per certificate; here each is a card with the Print the app's own page
 * exists for.
 */
function Certificates({ list }) {
  if (!list?.length) {
    return (
      <EmptyState
        variant="dashed"
        icon={<Icon name="award" size={26} />}
        title="No certificates yet"
        description="Finish the challenge and one turns up here to print."
      />
    )
  }
  return (
    <section className="cp-section">
      <ReaderPageHead as="h2" title="Certificates" />
      <ul className="cp-certs">
        {list.map((c) => (
          <li className="cp-cert" key={c.id}>
            <div className="cp-cert-sheet">
              <span className="cp-cert-seal" aria-hidden="true">
                <Icon name="award" size={30} />
              </span>
              <h3 className="cp-cert-name">{c.name}</h3>
              <p className="cp-cert-line">{c.line}</p>
              <p className="cp-cert-date">{c.earnedOn}</p>
            </div>
            <Button variant="secondary" size="sm">
              Print Certificate
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ChallengePage({ challenge, entries, onLog }) {
  const [tab, setTab] = useState('overview')
  const detail = getChallengeDetail(challenge.id)
  const extras = getChallengeExtras(challenge.id)
  const banner = bannerSrc(challenge.banner)
  const tint = challenge.tint ?? '#ACACAC'

  return (
    <div className="cp">
      <ProgramHeader
        banner={banner}
        title={challenge.title}
        tint={tint}
        /* `program.date_span`, or the literal the app writes when there
           isn't one. */
        dates={challenge.dates === 'Ongoing' ? 'Ongoing Challenge' : challenge.dates}
        tags={detail.types.map((t) => (
          <Pill key={t} color="#1A6DD5" variant="soft" size="sm">
            {t}
          </Pill>
        ))}
      />

      <div className="cp-head">
        <div className="cp-tabs">
          <Tabs
            variant="pill"
            plain
            size="md"
            active={tab}
            onChange={setTab}
            ariaLabel="Challenge sections"
            items={tabsFor(extras)}
          />
        </div>
      </div>

      <div className="cp-body">
        {tab === 'overview' && <Overview detail={detail} onTab={setTab} />}
        {tab === 'reading-list' && <ReadingList list={extras.readingList} onLog={onLog} />}
        {tab === 'badges' && <Badges />}
        {tab === 'rewards' && <Rewards detail={detail} />}
        {tab === 'drawings' && <Drawings extras={extras} />}
        {tab === 'certificates' && <Certificates list={extras.certificates} />}
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
            viewSwitch={false}
            stats={false}
          />
        )}
      </div>
    </div>
  )
}
