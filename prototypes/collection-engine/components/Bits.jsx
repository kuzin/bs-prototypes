import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { Button } from '@components/Button/Button'
import { Toggle } from '@components/Toggle/Toggle'
import { PartnerMark } from '@components/PartnerBrand/PartnerBrand'
import { BeanstackLogo } from '@components/BeanstackLogo/BeanstackLogo'
import '@components/PartnerBrand/PartnerBrand.css'
import '@components/BeanstackLogo/BeanstackLogo.css'
import '@components/Toggle/Toggle.css'
import { Pill } from '@components/Pill/Pill'
import { Tooltip } from '@components/Primitives/Primitives'
import { InfoBox } from '@components/InfoBox/InfoBox'
import { BookCover } from '@components/BookCover/BookCover'
import '@components/Pill/Pill.css'
import '@components/InfoBox/InfoBox.css'
import '@components/BookCover/BookCover.css'
import { SOURCES, CERTAINTY } from '../data'
import './Bits.css'
import { FEED_STATE } from '../derive'

/**
 * The one line that has to stay honest everywhere: what a holding lets us claim.
 * A licence we own, a queue we can't see, or a copy the school owns and may or
 * may not have on the shelf right now — three different promises, never one
 * badge.
 */
export function HoldingPills({ holdings, size = 'sm' }) {
  const order = ['own', 'hold', 'shelf']
  const seen = new Set()
  const rows = []
  for (const kind of order) {
    for (const h of holdings) {
      const src = SOURCES[h.source]
      if (src.kind !== kind || seen.has(h.source)) continue
      seen.add(h.source)
      rows.push({ h, src })
    }
  }
  return (
    <span className="ce-holdings">
      {/* No copy counts, and no "unmatched" outline. A MARC record says how
          many copies a school owns, but nothing tells us how many are on the
          shelf right now — printing "×4" beside a source reads as availability,
          which is the one claim this whole model refuses to make. */}
      {rows.map(({ src }) => (
        <Pill key={src.id} color={src.color} size={size}>
          {src.short}
        </Pill>
      ))}
    </span>
  )
}

/**
 * The RMI toolkit names its shelves the way a librarian talks — "Hi-Lo Books
 * (High Interest, Low Readability)" — and three of those in a row overflow any
 * one-line label. Drop the parentheticals, show two, count the rest; the full
 * list goes in the row's tooltip.
 */
export function genreSummary(genres) {
  const clean = genres.map((g) => g.replace(/\s*\([^)]*\)/g, '').trim())
  if (clean.length <= 2) return clean.join(' · ')
  return `${clean.slice(0, 2).join(' · ')} +${clean.length - 2}`
}

/** Where a reader is actually sent, phrased as the strongest true claim. */
export function bestClaim(holdings) {
  for (const kind of ['own', 'hold', 'shelf']) {
    const hit = holdings.find((h) => SOURCES[h.source].kind === kind)
    if (hit) return { ...CERTAINTY[kind], kind, holding: hit, source: SOURCES[hit.source] }
  }
  return null
}

/**
 * The call number is the payoff of taking MARC rather than a screen scrape:
 * "your library owns it" is a database claim, "FIC BRO" walks a nine-year-old
 * to a shelf.
 */
export function ShelfLine({ holdings }) {
  const print = holdings.find((h) => h.source === 'destiny')
  const room = holdings.find((h) => h.source === 'clc')
  if (!print && !room) return null
  return (
    <span className="ce-shelf">
      {print && (
        <>
          <Icon name="bookmark" size={13} /> {print.callNumber}
        </>
      )}
      {room && (
        <>
          {print && <span className="ce-shelf-sep">·</span>}
          <Icon name="building" size={13} /> {room.room}
        </>
      )}
    </span>
  )
}

export function TitleCell({ title, sub }) {
  return (
    <div className="ce-title-cell">
      <BookCover book={{ coverId: title.coverId, title: title.title }} size="sm" />
      <div className="ce-title-text">
        <span className="ce-title-name">{title.title}</span>
        <span className="ce-title-sub">{sub ?? title.author}</span>
      </div>
    </div>
  )
}

export function FeedState({ state }) {
  const s = FEED_STATE[state]
  return (
    <Pill color={s.color} size="sm">
      {s.label}
    </Pill>
  )
}

/** The "as of" stamp every recommendation in a school implicitly carries. */
export function AsOf({ fresh, prefix = 'Catalog as of' }) {
  if (!fresh.asOf) return <span className="ce-asof ce-asof--bad">Catalog has never synced</span>
  const bad = fresh.staleDays > 30
  return (
    <span className={`ce-asof${bad ? ' ce-asof--bad' : ''}`}>
      <Icon name={bad ? 'alert-triangle' : 'circle-check'} size={14} />
      {prefix} {fresh.asOf}
      {bad ? ` — ${fresh.staleDays} days ago` : ''}
    </span>
  )
}

/**
 * One catalog source, as an operations card: whether it is switched on, how
 * the records arrive, how often, and how stale they are. The left border
 * carries the source's colour so four of them read as four things rather than
 * one grid.
 *
 * The switch lives here rather than in a list of its own further down the
 * page. Switching a catalog on is what puts its titles in front of readers —
 * that is the same fact as "this catalog is connected", and stating it twice
 * on one screen made two lists of the same four things.
 */
export function FeedCard({ feed, on = true, onToggle, run, onSync, onUpload, onDismissRun }) {
  const [open, setOpen] = useState(false)
  const src = SOURCES[feed.source]
  const live = feed.state !== 'pending' && feed.state !== 'off'
  // A catalog that has just been synced states that instead of how many days
  // ago the last drop was — the number the whole page is about has changed.
  const syncing = run?.phase === 'running'
  const fresh = run?.phase === 'done'
  return (
    <div className={`ce-feed${on && live ? '' : ' ce-feed--off'}`}>
      <div className="ce-feed-head">
        <span className="ce-feed-mark">
          {src.brand ? (
            <PartnerMark id={src.brand} size={30} />
          ) : (
            /* The Classroom Library Connector is Beanstack's own, so it takes
               the Beanstack mark rather than a partner logo it doesn't have. */
            <BeanstackLogo variant="mark" size={30} />
          )}
        </span>
        <span className="ce-feed-name">{src.name}</span>
        {/* A healthy catalog says nothing here, and neither does one mid-sync:
            the progress in the actions slot already says it is running, and
            `Last updated` says when it last did. The pill is kept only for the
            three states that *are* news — out of date, never connected, never
            synced — because none of those is visible anywhere else on the
            row. */}
        {!syncing && !fresh && feed.state !== 'ok' && <FeedState state={feed.state} />}
        {/* The state pill already says whether this catalog is current; the
            dates and counts behind it are reference, not something you scan a
            list for. It sits with the catalog's identity rather than over with
            its controls. */}
        <button
          type="button"
          className="ce-feed-more"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Less' : 'Details'}
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={13} stroke={2.4} />
        </button>
        <div className="ce-feed-actions">
          {feed.state === 'pending' ? (
            <Button size="sm" variant="secondary">
              Finish connecting
            </Button>
          ) : syncing ? (
            /* The control becomes the progress while it runs: a button you
               can't press beside a bar says the same thing twice. */
            <span className="ce-feed-run">
              <span className="ce-feed-run-step">{run.step}</span>
              <span className="ce-feed-track">
                <span className="ce-feed-fill" style={{ width: `${run.pct}%` }} />
              </span>
            </span>
          ) : feed.source === 'destiny' ? (
            <Button size="sm" variant="secondary" onClick={onUpload}>
              Upload a MARC file
            </Button>
          ) : (
            feed.syncable !== false && (
              <Button size="sm" variant="secondary" onClick={onSync}>
                Sync now
              </Button>
            )
          )}
        </div>
        {onToggle && (
          <Toggle
            checked={on && live}
            disabled={!live}
            onChange={onToggle}
            name={`feed-${feed.source}`}
            className="ce-feed-switch"
          />
        )}
      </div>
      {/* What the run did, as the app's own notice rather than a line of green
          text — it is the same kind of statement the rest of the admin makes
          after an action, and it is dismissible because it stops being news. */}
      {fresh && (
        <InfoBox level="success" icon="check" className="ce-feed-result" onDismiss={onDismissRun}>
          {run.result.records.toLocaleString()} records read — {run.result.added} added,{' '}
          {run.result.updated} updated, {run.result.removed} no longer held.
        </InfoBox>
      )}
      {open && (
        <dl className="ce-feed-facts">
          <div>
            <dt>How it arrives</dt>
            <dd>{feed.method}</dd>
          </div>
          <div>
            <dt>Refreshes</dt>
            <dd>{feed.cadence}</dd>
          </div>
          <div>
            <dt>Last updated</dt>
            {fresh ? (
              <dd className="ce-good">Just now</dd>
            ) : (
              <dd className={feed.staleDays > 30 ? 'ce-bad' : undefined}>
                {feed.asOf ?? 'Never'}
                {feed.asOf && feed.staleDays > 0 ? ` \u00b7 ${feed.staleDays} days ago` : ''}
              </dd>
            )}
          </div>
          <div>
            <dt>Covers</dt>
            <dd>{feed.scope}</dd>
          </div>
          <div>
            <dt>Titles</dt>
            <dd>
              {(fresh
                ? feed.titles + run.result.added - run.result.removed
                : feed.titles
              ).toLocaleString()}
            </dd>
          </div>
        </dl>
      )}
    </div>
  )
}

/**
 * Open one school's own view from the district.
 *
 * The two scopes are separate prototypes, so this can't be a route change —
 * but `useStickyState` keeps the picker's value in `sessionStorage`, which
 * survives a navigation inside the same tab. Writing the key before leaving
 * means the school view opens already pointed at the school that was clicked,
 * the way a real drill-down would.
 */
/** The classroom side of the engine — the Connector's own shelf, as a teacher
    sees it. Same hop as `openSchool`: a sibling prototype, not a route. */
export function openClassroom() {
  window.location.href = '/bs-prototypes/collection-engine-teacher/'
}

export function openSchool(schoolId) {
  try {
    sessionStorage.setItem('bsp:ce:school', JSON.stringify(schoolId))
    sessionStorage.setItem('bsp:ce:school:page', JSON.stringify('overview'))
  } catch {
    /* no storage — the school view just opens on its default school */
  }
  window.location.href = '/bs-prototypes/collection-engine/'
}

// ─── AI mark ─────────────────────────────────────────────────────────────────
/**
 * `<AiMark>` — the sparkle beside a heading, saying a model does the work here.
 *
 * Setup is where an administrator decides what the engine is allowed to use, so
 * it is also where they should be able to see which parts of it are a model
 * rather than a rule they wrote. The mark is quiet — a fact about the card, not
 * a feature being sold — and carries one line on what the model does with their
 * data, which is the question behind "do you use AI". A line, because a tooltip
 * is read at a glance; anything longer belongs on the page.
 */
export function AiMark({ label }) {
  return (
    <Tooltip content={label}>
      <span className="ce-ai" aria-label={`AI: ${label}`}>
        <PlumpyIcon name="sparkle" size={16} />
        AI
      </span>
    </Tooltip>
  )
}
