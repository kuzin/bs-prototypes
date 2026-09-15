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
import { StatCard } from '@components/Cards/Cards'
import { Button } from '@components/Button/Button'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { NumberInput } from '@components/Form/Form'
import { EmptyState } from '@components/Primitives/Primitives'
import { InfoBox } from '@components/InfoBox/InfoBox'
import { BookCover } from '../../logging-flow/components/BookCover'
import { PartnerMark } from '@components/PartnerBrand/PartnerBrand'
import { CONNECTIONS } from '../../logging-flow/connections'
import { badgeSrc, bannerSrc, prizeSrc, ReaderBack } from '@components/ReaderApp/ReaderApp'
import { ProgramHeader } from '@components/ProgramHeader/ProgramHeader'
import { FilterMenuBar } from '@components/FilterMenu/FilterMenu'
import { EarnedFilter } from '@components/EarnedFilter/EarnedFilter'
import { byEarnedState } from '@components/EarnedFilter/earned'
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
  const earned = BADGES.filter((b) => !b.locked)
  // A row of four, with the rest one click away on the Badges tab — the strip
  // is a taste of the set, not the set.
  const recent = earned.slice(0, 4)

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
        <h2 className="cp-h2">Challenge Description</h2>
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
        <div className="cp-sectionhead">
          <h2 className="cp-h2">Recently Earned Badges</h2>
          {earned.length > recent.length && (
            <Button variant="secondary" size="sm" onClick={() => onTab?.('badges')}>
              View All Badges
            </Button>
          )}
        </div>
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

/**
 * How a reward was unlocked, or what it takes — `programs/_reward` writes a
 * sentence for each case and this is the same set of them. A reward hangs off
 * a badge (a logging one, or a named one), or off the challenge itself:
 * registering for it, finishing it, or filling its bingo card.
 */
function unlockLine(r) {
  const { log, badge, program } = r.unlock ?? {}
  if (r.earned) {
    if (program === 'registration') return `Unlocked by registering for this challenge on ${r.on}.`
    if (program === 'completion') return `Unlocked by completing this challenge on ${r.on}.`
    if (program === 'full_card_bingo')
      return `Unlocked by completing the full card bingo for this challenge on ${r.on}.`
    if (log) return `Unlocked on ${r.on} for logging ${log}.`
    return `Unlocked with the ${badge} badge on ${r.on}.`
  }
  if (program === 'registration') return 'Register for this challenge to unlock this reward.'
  if (program === 'completion') return 'Complete this challenge to unlock this reward.'
  if (program === 'full_card_bingo') return 'Complete the full bingo card to unlock this reward.'
  if (log) return `Log ${log} to unlock this reward.`
  return `Complete the ${badge} badge to unlock this reward.`
}

/**
 * One reward — `programs/_reward`, `_classic_unearned_reward` and the two
 * limited-reward partials.
 *
 * A reward is a title, **how it was unlocked** and **what to do about it**: the
 * app puts its `description` behind an "Instructions" heading, because the
 * description is not what the reward is, it is how you claim it. Redeemed, the
 * instructions are replaced by the app's own line — there is nothing left to do.
 *
 * `limited_reward` is the Book Machine, and it is a different thing: earned, it
 * hands you a link to go and pick a book. Whether the site has one at all is
 * `has_limited_rewards?(@current_microsite)` — a setting, so `bookMachine` is
 * the switch; off, the reward reads "No Books Remain" whether you earned it or
 * not, because nobody is redeeming one.
 */
function Reward({ reward: r, bookMachine }) {
  const limited = r.kind === 'limited'
  // `has_limited_rewards?(@current_microsite)` — a site setting, not a property
  // of the reward: when the machine is empty nobody redeems one, earned or not.
  const gone = limited && !bookMachine
  const state = gone ? 'unavailable' : r.earned ? 'earned' : 'unearned'

  return (
    <li className={`cp-reward is-${state}`}>
      <span className="cp-reward-mark">
        <Icon name={gone ? 'circle-x' : r.earned ? 'circle-check-filled' : 'gift'} size={26} />
      </span>
      <div className="cp-reward-copy">
        <h3 className="cp-reward-name">{r.name}</h3>
        {gone ? (
          <span className="cp-reward-detail">
            <Pill color="#DC2626" variant="soft" size="sm">
              No Books Remain
            </Pill>
          </span>
        ) : (
          <span className="cp-reward-detail">{unlockLine(r)}</span>
        )}

        {/* `.reward-instructions` — only ever on an earned reward, because an
            unearned one has nothing to claim yet. */}
        {gone ? (
          <div className="cp-reward-inst">
            <h4>Instructions</h4>
            <p>This reward is not redeemable anymore.</p>
          </div>
        ) : r.earned && limited ? (
          <div className="cp-reward-inst cp-reward-machine">
            <span className="cp-reward-machine-art" aria-hidden="true">
              <Icon name="gift" size={28} />
            </span>
            <div className="cp-reward-machine-copy">
              <strong>You earned a book from the book machine!</strong>
              <span>Pick your free book today before it&apos;s gone!</span>
            </div>
            <Button as="a" href={r.pickUrl} target="_blank" size="sm">
              Pick a Book
            </Button>
          </div>
        ) : r.earned ? (
          <div className="cp-reward-inst">
            <h4>Instructions</h4>
            <p>{r.redeemed ? 'Reward has been redeemed.' : r.instructions}</p>
          </div>
        ) : null}
      </div>
      <span className="cp-reward-at">
        {gone ? 'Unavailable' : r.earned ? (r.redeemed ? 'Redeemed' : 'Earned') : 'Locked'}
      </span>
    </li>
  )
}

function Rewards({ detail, bookMachine = true }) {
  const [state, setState] = useState('all')
  const isEarned = (r) => Boolean(r.earned)

  return (
    <section className="cp-section">
      <ReaderPageHead as="h2" title="Rewards" />
      <FilterMenuBar className="cp-listfilters">
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
          <Reward key={r.name} reward={r} bookMachine={bookMachine} />
        ))}
      </ul>
    </section>
  )
}

/**
 * `.section-header--reading-list` — a heading inside a tab that already has a
 * page head, so it takes the page's own section size rather than a second
 * 26px title, with `p.challenge-subhead` under it.
 */
function ListHead({ title, sub }) {
  return (
    <header className="cp-listhead">
      <h3 className="cp-h2">{title}</h3>
      {sub && <p className="cp-subhead">{sub}</p>}
    </header>
  )
}

/**
 * One title on the list — `logged_books/_book_list_grid__list_item`.
 *
 * The app draws a cover grid and hides the title, author and actions in a
 * dropdown behind each cover; this is the same content as a row, which is the
 * shape the site's own Book Lists page uses for the identical job. What the
 * cover carries either way is **state**: a book you have finished wears the
 * app's completed checkmark, which is the one thing you could not tell about
 * this list before.
 *
 * Up to three actions, in the app's own order: **Read Now** where the book has
 * external content behind it (`content_url` — a Comics Plus title opens in
 * Comics Plus), **Go Now** where the site has pointed the book somewhere
 * (`site_link`), and **Log Reading**.
 */
function ListBook({ book, list, done, onLog, onOpenBook }) {
  const readNow = list.readNow?.[book.id]
  const siteLink = list.siteLink?.[book.id]

  return (
    <li className={`cp-listbook${done ? ' is-done' : ''}`}>
      <button
        type="button"
        className="cp-listbook-cover"
        onClick={() => onOpenBook?.(book)}
        aria-label={book.title}
      >
        <BookCover book={book} size="fill" />
        {done && (
          <span className="cp-listbook-check" title="Completed">
            <Icon name="circle-check-filled" size={20} />
          </span>
        )}
      </button>
      <div className="cp-listbook-meta">
        <button type="button" className="cp-listbook-title" onClick={() => onOpenBook?.(book)}>
          {book.title}
        </button>
        <span className="cp-listbook-author">{book.author}</span>
        {/* Where the book lives, on its own line — not inside the button, where
            a partner logo crammed against a verb read as neither. */}
        {readNow && (
          <span className="cp-listbook-partner">
            <PartnerMark id={readNow} size={15} />
            {CONNECTIONS[readNow]?.name}
          </span>
        )}
      </div>
      <div className="cp-listbook-actions">
        {readNow && (
          <Button variant="secondary" size="sm" onClick={() => onLog?.(book)}>
            Read Now
          </Button>
        )}
        {siteLink && (
          <Button as="a" href={siteLink} target="_blank" variant="secondary" size="sm">
            Go Now
          </Button>
        )}
        <Button size="sm" onClick={() => onLog?.(book)}>
          Log
        </Button>
      </div>
    </li>
  )
}

/**
 * The Reading List tab — a `book_list` challenge's own shelf.
 *
 * The head is `reading_list_with_sidebar`: the list, and how many titles are on
 * it. What the challenge *asks* of you comes off `_book_list_grid`, which has
 * three cases and words each one itself — every title required, a number of
 * them required, or a number required **including** particular ones, which is
 * the case that splits the shelf into "Required Titles" and "More Titles".
 */
function ReadingList({ list, entries = [], onLog, onOpenBook }) {
  const [state, setState] = useState('all')
  if (!list) return null
  const books = list.books.map((id) => CATALOG_BY_ID[id]).filter(Boolean)
  // `cached_completed_book_ids` — what this reader has finished. The app reads
  // it off the log, and so does this; `list.completed` is the prototype's way
  // of saying a title was finished before this one-month log fixture starts.
  const done = new Set([
    ...entries.filter((e) => e.completed).map((e) => e.title),
    ...(list.completed ?? []).map((id) => CATALOG_BY_ID[id]?.title).filter(Boolean),
  ])

  const specific = list.required?.length > 0
  const required = specific ? books.filter((b) => list.required.includes(b.id)) : []
  const rest = specific ? books.filter((b) => !list.required.includes(b.id)) : books

  const read = (b) => done.has(b.title)
  const title = (n) => `${n} ${n === 1 ? 'title' : 'titles'}`
  // A section the filter has emptied goes with its heading — a "More Titles"
  // head over nothing is worse than no head.
  const shelf = (items) => {
    const shown = byEarnedState(items, state, read)
    if (shown.length === 0) return null
    return (
      <ul className="cp-list">
        {shown.map((b) => (
          <ListBook
            key={b.id}
            book={b}
            list={list}
            done={read(b)}
            onLog={onLog}
            onOpenBook={onOpenBook}
          />
        ))}
      </ul>
    )
  }
  const section = (head, items) =>
    shelf(items) && (
      <>
        {head}
        {shelf(items)}
      </>
    )

  return (
    <section className="cp-section">
      <ReaderPageHead as="h2" title={list.name} count={`${books.length} total titles`} />
      {/* The list's line is the rule of the thing — "read any four of these and
          it counts" — not a caption under the title, so it takes the app's own
          `.infobox` rather than sitting in the prose. */}
      <InfoBox icon={<Icon name="bulb" size={26} />} className="cp-listnote">
        {list.description}
      </InfoBox>

      <FilterMenuBar className="cp-listfilters">
        <EarnedFilter
          items={books}
          isEarned={read}
          value={state}
          onChange={setState}
          ariaLabel="Which titles"
          labels={{ earned: 'Completed', unearned: 'To Read' }}
        />
      </FilterMenuBar>

      {specific ? (
        <>
          {section(
            <ListHead
              title="Required Titles"
              sub={`${title(list.minimum)} required, including these specific titles`}
            />,
            required,
          )}
          {section(<ListHead title="More Titles" />, rest)}
        </>
      ) : (
        <>
          {section(
            list.minimum != null ? (
              <ListHead
                title={
                  list.minimum >= books.length
                    ? 'Required Titles'
                    : `${title(list.minimum)} required`
                }
                sub={list.minimum >= books.length ? 'All Titles Required' : undefined}
              />
            ) : null,
            rest,
          )}
        </>
      )}
    </section>
  )
}

/**
 * Ticket Drawings — `ticket_rewards/_ticket_rewards` and the two modals behind
 * it. A prize drawn from the tickets readers earn, and the reader decides which
 * drawings to spend theirs on: the same ticket can't go into two.
 *
 * Rows, like every other tab on this page, with the prize's own photo on the
 * left — `reward_image`, desaturated on a drawing that has ended the way the
 * app's `#grayscale` filter greys it.
 *
 * The row opens `_ticket_rewards_modal_overview`: the prize at size, the date,
 * the description, an optional link the site added, and your entry count. The
 * button at the end of the row goes straight to the stepper, and its **label
 * is the state** — "Add/Remove Tickets", "Subtract Tickets" when you have none
 * spare but some in, "Max Entered" at the cap, "No Tickets", or "Ended".
 *
 * Behind that is `_enter_drawing`: a stepper that **starts at what you have
 * already entered**, which is how you take tickets back out — the button reads
 * "No Change" until you move it, and says the cap while you do. It ends on the
 * app's own confirmation ("N Tickets Entered · You have N tickets left.").
 */
function Drawings({ extras }) {
  const list = extras.drawings ?? []
  const [entered, setEntered] = useState(() =>
    Object.fromEntries(list.map((d) => [d.id, d.entered])),
  )
  const [open, setOpen] = useState(null) // the drawing whose overview is open
  const [editing, setEditing] = useState(null) // …whose stepper is open
  const [draft, setDraft] = useState(0)
  const [added, setAdded] = useState(null) // the confirmation, once entered
  const [state, setState] = useState('all')

  const earned = extras.tickets?.earned ?? 0
  const spent = Object.values(entered).reduce((n, v) => n + v, 0)
  const available = Math.max(0, earned - spent)

  // `calculateMaxEntries` — the cap is the reward's own where it has one, and
  // whatever you could still put in where it doesn't.
  const capFor = (d, mine) =>
    d.maxEntries > 0 ? Math.min(d.maxEntries, available + mine) : available + mine

  const openStepper = (d) => {
    setDraft(entered[d.id])
    setEditing(d)
    setAdded(null)
  }

  // The button's label *is* the state, which is how the app writes it.
  const actionLabel = (d) =>
    d.ended
      ? 'Ended'
      : d.maxEntries > 0 && entered[d.id] >= d.maxEntries
        ? 'Max Entered'
        : available <= 0 && entered[d.id] === 0
          ? 'No Tickets'
          : available <= 0
            ? 'Subtract Tickets'
            : 'Add/Remove Tickets'
  const actionDisabled = (d) => d.ended || (available <= 0 && entered[d.id] === 0)

  const isOpen = (d) => !d.ended

  return (
    <section className="cp-section">
      <ReaderPageHead as="h2" title="Ticket Drawings" />

      {/* What you have to spend is the number this whole page turns on — the
          app puts it in the subhead, which is where a page puts something it
          doesn't want read. It takes the page's own stat tile instead, beside
          what you have already committed; the two add up to what the challenge
          has earned you. */}
      <div className="cp-ticketnums">
        <StatCard
          value={available}
          label={available === 1 ? 'Ticket to spend' : 'Tickets to spend in this challenge'}
          color="#B45309"
          icon={<Icon name="ticket" size={22} />}
        />
        <StatCard
          value={spent}
          label={spent === 1 ? 'Ticket entered' : 'Tickets entered'}
          color="#1A6DD5"
          icon={<Icon name="circle-check-filled" size={22} />}
        />
      </div>

      <FilterMenuBar className="cp-listfilters">
        <EarnedFilter
          items={list}
          isEarned={isOpen}
          value={state}
          onChange={setState}
          ariaLabel="Which drawings"
          labels={{ earned: 'Open', unearned: 'Ended' }}
        />
      </FilterMenuBar>

      <ul className="cp-drawings">
        {byEarnedState(list, state, isOpen).map((d) => (
          <li className={`cp-drawing${d.ended ? ' is-ended' : ''}`} key={d.id}>
            {/* The row opens the drawing; the button goes straight to the
                stepper, the way every other tab on this page puts its one
                action at the end of the row. */}
            <button
              type="button"
              className="cp-drawing-open"
              onClick={() => setOpen(d)}
              aria-label={d.title}
            >
              <span className="cp-drawing-art">
                {d.art ? <img src={prizeSrc(d.art)} alt="" /> : <Icon name="gift" size={26} />}
              </span>
              <span className="cp-drawing-body">
                <span className="cp-drawing-when">
                  {d.ended ? `Ended on ${d.endsOn}` : `Ends on ${d.endsOn}`}
                </span>
                <span className="cp-drawing-title">{d.title}</span>
                <span className="cp-drawing-desc">{d.description}</span>
                {d.ended && (
                  <span className="cp-drawing-expired">
                    This drawing has ended. Winners will be notified.
                  </span>
                )}
              </span>
            </button>
            <div className="cp-drawing-side">
              <span className="cp-drawing-entered">
                <Icon name="ticket" size={15} /> {entered[d.id]}{' '}
                {entered[d.id] === 1 ? 'Ticket' : 'Tickets'} Entered
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={actionDisabled(d)}
                onClick={() => openStepper(d)}
              >
                {actionLabel(d)}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* `_ticket_rewards_modal_overview` — the prize at size, with everything
          the row hasn't room for. */}
      <Modal
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        variant="center"
        closeBadge
        ariaLabel="Drawing"
      >
        <ModalClose onClick={() => setOpen(null)} />
        {open && (
          <>
            {open.art && (
              <img
                className={`modal-image${open.ended ? ' is-ended' : ''}`}
                src={prizeSrc(open.art)}
                alt=""
              />
            )}
            <div className="modal-body cp-dw">
              <p className="cp-dw-when">
                {open.ended ? `Ended on ${open.endsOn}` : `Ends on ${open.endsOn}`}
              </p>
              <h2 className="cp-dw-title">{open.title}</h2>
              <p className="cp-dw-text">{open.description}</p>

              {open.linkUrl && open.linkText && (
                <p className="cp-dw-link">
                  <a href={open.linkUrl} target="_blank" rel="noreferrer">
                    {open.linkText}
                  </a>
                </p>
              )}

              <div className="cp-dw-tickets">
                <span className="cp-dw-count">{entered[open.id]}</span>
                <span className="cp-dw-countlbl">
                  {entered[open.id] === 1 ? 'Ticket' : 'Tickets'} Entered
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <Button
                disabled={actionDisabled(open)}
                onClick={() => {
                  openStepper(open)
                  setOpen(null)
                }}
              >
                {actionLabel(open)}
              </Button>
            </div>
          </>
        )}
      </Modal>

      {/* `_enter_drawing` — the stepper, then the app's own confirmation. */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        variant="center"
        closeBadge
        ariaLabel="Enter tickets"
      >
        <ModalClose onClick={() => setEditing(null)} />
        {editing && added == null && (
          <>
            <div className="modal-header modal-header--flush">
              <div className="modal-header-text">
                <h2 className="modal-title">{editing.title}</h2>
                <p className="modal-sub">
                  {/* Live, as the stepper moves: taking one back out puts it
                      straight back in the pool. */}
                  {available + entered[editing.id] - draft}{' '}
                  {available + entered[editing.id] - draft === 1 ? 'Ticket' : 'Tickets'} Available
                </p>
              </div>
            </div>
            <div className="modal-body cp-ticketbody">
              <NumberInput
                size="lg"
                min={0}
                max={capFor(editing, entered[editing.id])}
                value={draft}
                onChange={setDraft}
                aria-label="Tickets entered"
              />
            </div>
            <div className="modal-footer">
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button
                disabled={draft === entered[editing.id]}
                onClick={() => {
                  setEntered((e) => ({ ...e, [editing.id]: draft }))
                  setAdded(draft)
                }}
              >
                {draft === entered[editing.id]
                  ? 'No Change'
                  : `Enter ${draft} ${editing.maxEntries > 0 ? `(Max ${editing.maxEntries})` : '(No Max)'}`}
              </Button>
            </div>
          </>
        )}
        {editing && added != null && (
          <>
            <div className="modal-body cp-dwdone">
              <span className="cp-dwdone-mark">
                <Icon name="circle-check-filled" size={54} />
              </span>
              <h2 className="cp-dwdone-title">
                {added} {added === 1 ? 'Ticket' : 'Tickets'} Entered
              </h2>
              <p className="cp-dwdone-sub">
                You have {available} {available === 1 ? 'ticket' : 'tickets'} left.
              </p>
            </div>
            <div className="modal-footer">
              <Button onClick={() => setEditing(null)}>Close</Button>
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
/**
 * Certificates — `programs/earned_certificate`. The app renders a printable
 * page per certificate; here each is a row, like the rewards and the prizes it
 * sits beside. A big framed sheet per certificate was a picture of the printout
 * rather than a list of them, and it fell apart the moment there were two.
 *
 * An unearned one names what it takes where an earned one names its date, and
 * has nothing to print yet.
 */
function Certificates({ list }) {
  const [state, setState] = useState('all')

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

  const isEarned = (c) => Boolean(c.earnedOn)

  return (
    <section className="cp-section">
      <ReaderPageHead as="h2" title="Certificates" />
      <FilterMenuBar className="cp-listfilters">
        <EarnedFilter
          items={list}
          isEarned={isEarned}
          value={state}
          onChange={setState}
          ariaLabel="Which certificates"
        />
      </FilterMenuBar>
      <ul className="cp-rewards">
        {byEarnedState(list, state, isEarned).map((c) => (
          <li key={c.id} className={`cp-reward${isEarned(c) ? ' is-earned' : ''}`}>
            <span className="cp-reward-mark">
              <Icon name="award" size={26} />
            </span>
            <div className="cp-reward-copy">
              <span className="cp-reward-name">{c.name}</span>
              <span className="cp-reward-detail">{c.line}</span>
            </div>
            {isEarned(c) ? (
              <>
                <span className="cp-reward-at">Earned On {c.earnedOn}</span>
                <Button variant="secondary" size="sm">
                  Print
                </Button>
              </>
            ) : (
              <span className="cp-reward-at">{c.at}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ChallengePage({
  challenge,
  entries,
  onLog,
  onOpenBook,
  onBack,
  bookMachine = true,
  tab: tabProp,
  onTab,
}) {
  // The parent can drive which tab is open, the way Dashboard lets one drive
  // its view — web-app does, so a reload lands back where the reader was.
  const [ownTab, setOwnTab] = useState('overview')
  const tab = tabProp ?? ownTab
  const setTab = (id) => {
    setOwnTab(id)
    onTab?.(id)
  }
  const detail = getChallengeDetail(challenge.id)
  const extras = getChallengeExtras(challenge.id)
  const banner = bannerSrc(challenge.banner)
  const tint = challenge.tint ?? '#ACACAC'

  return (
    <div className="cp">
      <ProgramHeader
        back={onBack && <ReaderBack onClick={onBack}>Back to Challenges</ReaderBack>}
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
        {tab === 'reading-list' && (
          <ReadingList
            list={extras.readingList}
            entries={entries}
            onLog={onLog}
            onOpenBook={onOpenBook}
          />
        )}
        {tab === 'badges' && <Badges />}
        {tab === 'rewards' && <Rewards detail={detail} bookMachine={bookMachine} />}
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
