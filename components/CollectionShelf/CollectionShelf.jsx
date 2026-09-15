import { useState } from 'react'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { FilterMenu, FilterMenuBar } from '@components/FilterMenu/FilterMenu'
import { EarnedFilter } from '@components/EarnedFilter/EarnedFilter'
import { byEarnedState, hasBothStates } from '@components/EarnedFilter/earned'
import { EmptyState } from '@components/Primitives/Primitives'

import './CollectionShelf.css'
import '@components/Primitives/Primitives.css'

/* `appropriate_badges_title` — the app's own badge taxonomy, and the order it
   names them in. A badge's `type` is the key; this is what a reader sees. */
const TYPE_LABELS = {
  logging: 'Reading',
  activity: 'Activity',
  review: 'Review',
  point: 'Point',
  challenge: 'Challenge',
  donation: 'Donation',
}
const TYPE_ORDER = ['Reading', 'Activity', 'Review', 'Point', 'Challenge', 'Donation']

/**
 * The reader's shelf of earned things — badges and achievements.
 *
 * Both are the same card in the product: circular art over a bold name and a
 * line of copy, with the state on its own footer strip. Words with Benny drew
 * it first, for the Badges and Achievements panes of My Collections; web-app's
 * All Badges page is the same two shelves, so the card lives here rather than
 * being copied across.
 *
 * A badge can also be **locked**. The profile's "Earned Badges" page only ever
 * lists what a reader has, but a challenge's Badges tab shows the whole set —
 * `earnables/grid/_earnable.html.haml` grays the art, empties the progress
 * ring, and puts the requirement in the footer ("12/30 Minutes Completed")
 * where an earned badge says when it was completed. `locked` is that state.
 */

/**
 * One card. `art` is whatever goes in the circular slot — an illustrated
 * medallion, or a glyph on a colored disc (see `BadgeDisc` below).
 *
 * `size="sm"` is the same card at two-thirds: for a strip of them beside
 * something else rather than a shelf of their own — the friend profile's
 * "Latest badges" row, in a modal that has four other sections to get through.
 */
export function CollectionCard({ art, name, blurb, date, locked = false, progress, size = 'md' }) {
  return (
    <article className={`co-card co-card--${size}${locked ? ' co-card--locked' : ''}`}>
      <div className="co-card-art" aria-hidden="true">
        {art}
        {/* The app rings a locked badge with its progress toward earning it. */}
        {locked && progress != null && (
          <svg className="co-card-ring" viewBox="0 0 100 100">
            <circle className="co-card-ring-track" cx="50" cy="50" r="47" />
            <circle
              className="co-card-ring-fill"
              cx="50"
              cy="50"
              r="47"
              pathLength="100"
              strokeDasharray={`${progress} 100`}
            />
          </svg>
        )}
      </div>
      <h3 className="co-card-name">{name}</h3>
      <p className="co-card-blurb">{blurb}</p>
      <div className="co-card-foot">{date}</div>
    </article>
  )
}

/**
 * A badge's illustration — the art Beanstack's design team draws per challenge
 * (`Design/Projects/Challenges/<name>/Badges`, 500×500, here at 240 in webp).
 * This is what a real badge looks like; `BadgeDisc` is the fallback.
 */
export function BadgeArt({ src, alt = '' }) {
  return <img className="co-card-img" src={src} alt={alt} loading="lazy" />
}

/**
 * A badge's art when there is no illustration for it: its glyph on a disc in
 * the badge's own color. Pass the `<Icon>` — this only owns the disc, so the
 * caller keeps control of which glyph and how big.
 */
export function BadgeDisc({ color, children }) {
  return (
    <span className="co-card-disc" style={{ '--badge-color': color }}>
      {children}
    </span>
  )
}

/**
 * Every shelf gets the same head: what it holds and how much of it, over a
 * hairline. There is no page title above it — the tab strip already says which
 * collection you are in.
 */
export function ShelfHead({ title, count, noun, children, as = 'h2' }) {
  return (
    <ReaderPageHead
      as={as}
      title={title}
      count={count == null ? undefined : `${count} ${noun}`}
      actions={children}
    />
  )
}

/** The grid the cards sit in. */
export function ShelfGrid({ children }) {
  return <div className="co-grid">{children}</div>
}

/**
 * A shelf of badges, with the two filters a badge set needs once it is more
 * than a screenful.
 *
 * **All / Earned / Unearned** is the question a reader actually arrives with —
 * "what have I got" or "what is left" — and it is a segmented control, which in
 * this system is a pill `Tabs`. It appears only where the set has both halves:
 * **unearned badges exist inside a challenge and nowhere else**, so the
 * reader's Collections shelf — which is everything they have earned, across
 * every challenge — gets no state filter, because every answer would be the
 * same shelf.
 *
 * **Type** is the app's own badge taxonomy (`appropriate_badges_title`:
 * Reading/Logging, Activity, Review, Point, Challenge, Donation), derived from
 * what this particular set contains rather than listed in full, so a challenge
 * with no review badges doesn't offer a filter that can only ever empty the
 * shelf.
 *
 * Earned first inside each result, the way the app lists them — what you have,
 * then what's left.
 */
export function BadgeShelf({ badges, src, emptyIcon }) {
  const [state, setState] = useState('all')
  const [types, setTypes] = useState([])

  const byState = byEarnedState(badges, state)
  const shown = types.length ? byState.filter((b) => types.includes(TYPE_LABELS[b.type])) : byState
  const ordered = [...shown.filter((b) => !b.locked), ...shown.filter((b) => b.locked)]

  // Only the types this set actually has, in the app's own order.
  const present = TYPE_ORDER.filter((t) => badges.some((b) => TYPE_LABELS[b.type] === t))

  const hasFilters = hasBothStates(badges) || present.length > 1

  return (
    <>
      {hasFilters && (
        <FilterMenuBar className="co-filters">
          <EarnedFilter items={badges} value={state} onChange={setState} ariaLabel="Which badges" />
          {present.length > 1 && (
            <FilterMenu label="Type" options={present} value={types} onChange={setTypes} multi />
          )}
        </FilterMenuBar>
      )}

      {ordered.length === 0 ? (
        <EmptyState
          variant="dashed"
          icon={emptyIcon}
          title="No badges here"
          description="Nothing in this set matches those filters."
        />
      ) : (
        <ShelfGrid>
          {ordered.map((b) => (
            <CollectionCard
              key={b.name}
              art={<BadgeArt src={src(b)} />}
              name={b.name}
              blurb={b.blurb}
              locked={b.locked}
              progress={b.locked ? Math.round((b.have / b.need) * 100) : undefined}
              // The app states a locked badge's requirement where an earned one
              // states its date: "12/30 Minutes Completed".
              date={
                b.locked
                  ? `${b.have.toLocaleString()}/${b.need.toLocaleString()} ${b.unit} Completed`
                  : `Completed on ${b.date}`
              }
            />
          ))}
        </ShelfGrid>
      )}
    </>
  )
}
