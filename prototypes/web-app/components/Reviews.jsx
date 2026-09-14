import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { EmptyState } from '@components/Primitives/Primitives'

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

function WrittenReview({ review }) {
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

      <p className="rv-body">
        {body}{' '}
        {long && (
          <button type="button" className="rv-more" onClick={() => setFull((f) => !f)}>
            {full ? 'Show less' : 'Read more...'}
          </button>
        )}
      </p>

      <Button variant="secondary" size="sm" className="rv-edit">
        Edit Review
      </Button>
    </li>
  )
}

function PictureReview({ review }) {
  const [from, to] = review.art
  return (
    <li className="rv-pic">
      {/* A reader's own drawing — there is no artwork to ship for a mock, so
          the slot is a coloured field with the crayon mark on it. */}
      <div
        className="rv-pic-art"
        style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
        aria-hidden="true"
      >
        <Icon name="photo" size={34} />
      </div>
      <div className="rv-pic-body">
        <h3 className="rv-pic-title">{review.title}</h3>
        <p className="rv-pic-for">
          <span>Picture Review for:</span>
          <strong>{review.book}</strong>
          <em>{review.author}</em>
        </p>
        <p className="rv-pic-by">Created by: Olivia M. · {review.date}</p>
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
        </div>
      </div>
    </li>
  )
}

export function Reviews() {
  const [type, setType] = useState('written')

  const counts = {
    written: REVIEWS.filter((r) => r.kind === 'written').length,
    picture: REVIEWS.filter((r) => r.kind === 'picture').length,
  }
  const shown = REVIEWS.filter((r) => r.kind === type)

  return (
    <div className="rv-page">
      <header className="rv-head">
        {/* Just "Reviews": the tab above already says whose page this is, and
            the counts are on the type pills right below. */}
        <h1 className="rv-title">Reviews</h1>
        <div className="rv-actions">
          <Button variant="secondary" size="md" icon={<Icon name="photo" size={15} />}>
            Post a Picture Review
          </Button>
          <Button variant="primary" size="md" icon={<Icon name="writing" size={15} />}>
            Write a Review
          </Button>
        </div>
      </header>

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
            <WrittenReview key={r.id} review={r} />
          ))}
        </ul>
      ) : (
        <ul className="rv-picgrid">
          {shown.map((r) => (
            <PictureReview key={r.id} review={r} />
          ))}
        </ul>
      )}
    </div>
  )
}
