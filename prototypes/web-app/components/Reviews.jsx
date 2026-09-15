import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { Pill } from '@components/Pill/Pill'
import { EmptyState } from '@components/Primitives/Primitives'

import { ReviewComposer } from './ReviewComposer'
import { PictureReviewViewer } from './PictureReviewViewer'
import { ReviewArt } from './ReviewArt'
import { REVIEWS } from '../data'
import './Reviews.css'

import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'
import '@components/Primitives/Primitives.css'

/**
 * The reader's own reviews — `profiles/reviews.html.haml`, which titles itself
 * "{First}'s Reviews" and tabs by the review types the site permits.
 *
 * Beanstack reviews carry **no star rating**: the app asks for words, and a
 * long one is cut at 200 characters behind a "Read more...". Picture reviews
 * are a second type entirely — an image of the book rather than a paragraph
 * about it — and they wait on staff approval before anyone else sees them.
 */

const TYPES = [
  { id: 'written', label: 'Written Reviews' },
  { id: 'picture', label: 'Picture Reviews' },
]

const CUTOFF = 200

function WrittenReview({ review, onEdit }) {
  const [full, setFull] = useState(false)
  const long = review.body.length > CUTOFF
  const body = full || !long ? review.body : `${review.body.slice(0, CUTOFF).trimEnd()}…`

  return (
    <li className="rv-item">
      <div className="rv-meta">
        <h2 className="rv-booktitle">
          <a href="#review">{review.title}</a>
        </h2>
        <span className="rv-author">by {review.author}</span>
        <span className="rv-byline">Written by Olivia M. on {review.date}</span>
      </div>

      <p className="rv-body">{body}</p>
      {/* Its own line under the review rather than trailing the last sentence:
          it is a control, and inline it read as part of what was written. */}
      {long && (
        <button type="button" className="rv-more" onClick={() => setFull((f) => !f)}>
          {full ? 'Show less' : 'Read more...'}
        </button>
      )}

      {/* What you can do to it, on the card's own footer strip — the same
          place the picture cards put theirs. */}
      <div className="rv-foot">
        <RowActions className="rv-actions">
          <RowAction icon="pencil" label="Edit review" onClick={() => onEdit?.(review)} />
        </RowActions>
      </div>
    </li>
  )
}

function PictureReview({ review, onEdit, onOpen }) {
  return (
    <li className="rv-pic">
      {/* A reader's own drawing — there is no artwork to ship for a mock, so
          the slot is a coloured field with the crayon mark on it. */}
      {/* The art is the way in — the app opens the lightbox from it. */}
      <button
        type="button"
        className="rv-pic-art"
        onClick={onOpen}
        aria-label={`Open ${review.title}`}
      >
        <ReviewArt review={review} />
      </button>
      <div className="rv-pic-body">
        <h3 className="rv-pic-title">{review.title}</h3>
        <p className="rv-pic-for">
          <span>Picture Review for:</span>
          <strong>{review.book}</strong>
          <em>{review.author}</em>
        </p>
        <p className="rv-pic-by">Created by: Olivia M. · {review.date}</p>
      </div>

      {/* A footer strip across the card, the way `CollectionCard` carries its
          earned date — what the review has on one side, what you can do to it
          on the other. */}
      <div className="rv-pic-foot">
        {review.status === 'pending' ? (
          <Pill color="#B45309" variant="soft" size="sm">
            Waiting for approval
          </Pill>
        ) : (
          <span className="rv-hearts">
            <Icon name="heart-filled" size={15} />
            {review.hearts}
          </span>
        )}
        <RowActions className="rv-pic-actions">
          <RowAction icon="pencil" label="Edit review" onClick={() => onEdit?.(review)} />
        </RowActions>
      </div>
    </li>
  )
}

export function Reviews({ composing, onCompose }) {
  const [type, setType] = useState('written')
  // The reader's own reviews are this page's to change, so they're state.
  const [reviews, setReviews] = useState(REVIEWS)
  // `{ kind }` to write a new one, `{ review }` to edit an existing one.
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const open = editing ?? composing

  const counts = {
    written: reviews.filter((r) => r.kind === 'written').length,
    picture: reviews.filter((r) => r.kind === 'picture').length,
  }
  const shown = reviews.filter((r) => r.kind === type)

  function close() {
    setEditing(null)
    onCompose?.(null)
  }

  function save(next) {
    setReviews((rs) =>
      next.id
        ? rs.map((r) => (r.id === next.id ? { ...r, ...next } : r))
        : [{ ...next, id: `rv-${Date.now()}`, date: 'Today', hearts: 0 }, ...rs],
    )
    setType(next.kind)
    close()
  }

  return (
    <div className="rv-page">
      {/* Just "Reviews": the tab above already says whose page this is, and
          the counts are on the type pills right below. */}
      <ReaderPageHead
        title="Reviews"
        actions={
          <>
            {/* No glyphs: the header already says what the page is, and two
                icons in front of two verbs read as a toolbar. */}
            <Button variant="secondary" size="md" onClick={() => setEditing({ kind: 'picture' })}>
              Post a Picture Review
            </Button>
            <Button variant="primary" size="md" onClick={() => setEditing({ kind: 'written' })}>
              Write a Review
            </Button>
          </>
        }
      />

      <div className="rv-types">
        <Tabs
          variant="pill"
          size="md"
          active={type}
          accent="#1A6DD5"
          onChange={setType}
          ariaLabel="Which kind of review"
          items={TYPES.map((t) => ({ ...t, count: counts[t.id] }))}
        />
      </div>

      {shown.length === 0 ? (
        <EmptyState
          variant="dashed"
          icon={<Icon name="writing" size={26} />}
          title="Olivia hasn't created any reviews yet."
        />
      ) : type === 'written' ? (
        <ul className="rv-list">
          {shown.map((r) => (
            <WrittenReview key={r.id} review={r} onEdit={(rv) => setEditing({ review: rv })} />
          ))}
        </ul>
      ) : (
        <ul className="rv-picgrid">
          {shown.map((r) => (
            <PictureReview
              key={r.id}
              review={r}
              onEdit={(rv) => setEditing({ review: rv })}
              onOpen={() => setViewing(r)}
            />
          ))}
        </ul>
      )}

      <PictureReviewViewer
        review={viewing}
        reviews={reviews.filter((r) => r.kind === 'picture')}
        onOpen={setViewing}
        onClose={() => setViewing(null)}
      />

      <ReviewComposer
        open={Boolean(open)}
        kind={open?.kind}
        review={open?.review}
        onClose={close}
        onSave={save}
      />
    </div>
  )
}
