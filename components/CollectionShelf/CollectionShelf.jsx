import { ReaderPageHead } from '@components/ReaderApp/ReaderApp'

import './CollectionShelf.css'

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
 */
export function CollectionCard({ art, name, blurb, date, locked = false, progress }) {
  return (
    <article className={`co-card${locked ? ' co-card--locked' : ''}`}>
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
export function ShelfHead({ title, count, noun, children }) {
  return (
    <ReaderPageHead
      as="h2"
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
