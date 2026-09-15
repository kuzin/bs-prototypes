import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { EmptyState } from '@components/Primitives/Primitives'

import { PictureReviewViewer } from './PictureReviewViewer'
import { ReviewArt } from './ReviewArt'
import { PEER_REVIEWS } from '../data'
import './PeerReviews.css'

import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Primitives/Primitives.css'

/**
 * Other readers' reviews — `microsite#peer_reviews`, rendered through
 * `profiles/reviews.html.haml`. Not the reader's own: everything here is
 * somebody else's, and everything here is approved, because the page filters
 * to `with_approved_review` before it shows a single one.
 *
 * Two levels of choice, and the second only exists for picture reviews. The
 * type comes first — Written or Picture, whichever the site permits. Then a
 * picture review can be scoped: **My Library** is this site's,
 * **All Libraries** is every Beanstack site (a setting,
 * `include_picture_review_from_other_microsites`), and **Community Favorites**
 * is the most hearted across all of them. A written review is only ever your
 * own library's, so the scope strip isn't there for it.
 *
 * Hearting is the one thing a reader can do to someone else's review, and it's
 * picture-only in the app too.
 */

const TYPES = [
  { id: 'written', label: 'Written Reviews' },
  { id: 'picture', label: 'Picture Reviews' },
]

// `review_helper#display_review_option_tabs`, and its own names for them.
const SCOPES = [
  { id: 'mine', label: 'My Library' },
  { id: 'all', label: 'All Libraries' },
  { id: 'favorites', label: 'Community Favorites' },
]

const HOME_LIBRARY = 'Magnolia Middle'
const CUTOFF = 200
const PER_PAGE = 6

/** One written review by somebody else. Same card the reader's own page uses,
    plus whose it is and where they read. */
function PeerWritten({ review, hearted, onHeart }) {
  const [full, setFull] = useState(false)
  const long = review.body.length > CUTOFF
  const body = full || !long ? review.body : `${review.body.slice(0, CUTOFF).trimEnd()}…`

  return (
    <li className="pr-item">
      <div className="pr-head">
        <div className="pr-meta">
          <h2 className="pr-booktitle">
            <a href="#review">{review.title}</a>
          </h2>
          <span className="pr-author">by {review.author}</span>
          <span className="pr-byline">
            Written by {review.by}, {review.library} on {review.date}
          </span>
        </div>
        <Heart count={review.hearts} on={hearted} onToggle={onHeart} />
      </div>

      <p className="pr-body">
        {body}{' '}
        {long && (
          <button type="button" className="pr-more" onClick={() => setFull((f) => !f)}>
            {full ? 'Show less' : 'Read more...'}
          </button>
        )}
      </p>
    </li>
  )
}

/** One picture review. The app's card: the art, its title, the book it is for,
    who made it and at which library, then the heart. */
function PeerPicture({ review, hearted, onHeart, onOpen }) {
  return (
    <li className="pr-pic">
      {/* A reader's own drawing — there is no artwork to ship for a mock, so
          the slot is a coloured field with the crayon mark on it. */}
      {/* The art is the way in — the app opens the lightbox from it. */}
      <button
        type="button"
        className="pr-pic-art"
        onClick={onOpen}
        aria-label={`Open ${review.title}`}
      >
        <ReviewArt review={review} />
      </button>
      <div className="pr-pic-body">
        <h3 className="pr-pic-title">{review.title}</h3>
        <p className="pr-pic-for">
          <span>Picture Review for:</span>
          <strong>{review.book}</strong>
          <em>by {review.author}</em>
        </p>
        <p className="pr-pic-by">
          Created by: {review.by}, {review.library}
        </p>
      </div>

      {/* The same footer strip the reader's own picture reviews carry. */}
      <div className="pr-pic-foot">
        <span className="pr-pic-date">{review.date}</span>
        <Heart count={review.hearts} on={hearted} onToggle={onHeart} />
      </div>
    </li>
  )
}

/** `hearts/_button` — the one thing you can do to someone else's review. */
function Heart({ count, on, onToggle }) {
  return (
    <button
      type="button"
      className={`pr-heart${on ? ' is-on' : ''}`}
      onClick={onToggle}
      aria-pressed={on}
      aria-label={on ? 'Remove heart' : 'Heart this review'}
    >
      <Icon name={on ? 'heart-filled' : 'heart'} size={16} />
      {count + (on ? 1 : 0)}
    </button>
  )
}

export function PeerReviews({ allLibraries = true }) {
  const [type, setType] = useState('written')
  const [scope, setScope] = useState('mine')
  const [page, setPage] = useState(0)
  const [hearted, setHearted] = useState([])
  const [viewing, setViewing] = useState(null)

  // The scope strip is picture-only, and "All Libraries" is a site setting —
  // without it a reader only ever sees their own library's.
  const scopes = allLibraries ? SCOPES : SCOPES.filter((s) => s.id === 'mine')
  const showScopes = type === 'picture' && scopes.length > 1
  const activeScope = showScopes ? scope : 'mine'

  const counts = {
    written: PEER_REVIEWS.filter((r) => r.kind === 'written').length,
    picture: PEER_REVIEWS.filter((r) => r.kind === 'picture').length,
  }

  let shown = PEER_REVIEWS.filter((r) => r.kind === type)
  if (activeScope === 'mine') shown = shown.filter((r) => r.library === HOME_LIBRARY)
  if (activeScope === 'favorites') shown = [...shown].sort((a, b) => b.hearts - a.hearts)

  const pages = Math.ceil(shown.length / PER_PAGE)
  const visible = shown.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  function pick(next) {
    setType(next)
    setPage(0)
  }

  const toggle = (id) =>
    setHearted((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id]))

  return (
    <div className="pr-page">
      <ReaderPageHead
        as="h2"
        title={type === 'picture' ? 'Peer Picture Reviews' : 'Peer Written Reviews'}
        actions={
          <Button variant="secondary">
            {type === 'picture' ? 'Post a Picture Review' : 'Write a Review'}
          </Button>
        }
      />

      {/* The same strip the reader's own reviews page carries next door, with
          the scope beside it — both are view switchers over the same list, so
          they read as one row of controls rather than two levels of nav. */}
      <div className="pr-types">
        <Tabs
          variant="pill"
          size="md"
          active={type}
          accent="#1A6DD5"
          onChange={pick}
          ariaLabel="Which kind of review"
          items={TYPES.map((t) => ({ ...t, count: counts[t.id] }))}
        />
        {showScopes && (
          <Tabs
            variant="pill"
            size="md"
            active={scope}
            accent="#1A6DD5"
            onChange={(sc) => {
              setScope(sc)
              setPage(0)
            }}
            ariaLabel="Whose reviews"
            items={scopes}
          />
        )}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          variant="dashed"
          title="No reviews to show"
          description={
            type === 'picture'
              ? 'Nobody has posted a picture review here yet. Yours could be the first.'
              : 'Nobody has written a review here yet. Yours could be the first.'
          }
          action={
            <Button variant="secondary">
              {type === 'picture' ? 'Post a Picture Review' : 'Write a Review'}
            </Button>
          }
        />
      ) : (
        <ul className={type === 'picture' ? 'pr-picgrid' : 'pr-list'}>
          {visible.map((r) =>
            r.kind === 'picture' ? (
              <PeerPicture
                key={r.id}
                review={r}
                hearted={hearted.includes(r.id)}
                onHeart={() => toggle(r.id)}
                onOpen={() => setViewing(r)}
              />
            ) : (
              <PeerWritten
                key={r.id}
                review={r}
                hearted={hearted.includes(r.id)}
                onHeart={() => toggle(r.id)}
              />
            ),
          )}
        </ul>
      )}

      <PictureReviewViewer
        review={viewing}
        reviews={visible.filter((r) => r.kind === 'picture')}
        onOpen={setViewing}
        onClose={() => setViewing(null)}
        hearted={viewing ? hearted.includes(viewing.id) : false}
        onHeart={() => viewing && toggle(viewing.id)}
      />

      {/* The app paginates ten at a time; a prototype's fixtures are smaller,
          so the control only appears when there is a second page. */}
      {pages > 1 && (
        <div className="pr-pages">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="pr-pages-count">
            Page {page + 1} of {pages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= pages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
