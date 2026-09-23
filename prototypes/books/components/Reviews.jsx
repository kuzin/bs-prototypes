import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Avatar } from '@components/Avatar/Avatar'
import { Button } from '@components/Button/Button'
import { Stars, StarInput } from '@components/Stars/Stars'
import { Flyout, FlyoutMenu, FlyoutMenuItem } from '@components/Flyout/Flyout'
import '@components/Flyout/Flyout.css'
import { REVIEW_STATES } from '../data'

const STAR_ROWS = [5, 4, 3, 2, 1]

function RatingBreakdown({ book }) {
  const total = book.ratingDist.reduce((a, b) => a + b, 0) || 1
  return (
    <div className="bk-breakdown">
      <div className="bk-breakdown-score">
        <span className="bk-breakdown-num">{book.rating.toFixed(1)}</span>
        <Stars value={book.rating} size={18} />
        <span className="bk-breakdown-count">{book.ratingCount.toLocaleString()} ratings</span>
      </div>
      <div className="bk-breakdown-bars">
        {STAR_ROWS.map((s, i) => {
          const pct = Math.round((book.ratingDist[i] / total) * 100)
          return (
            <div key={s} className="bk-bd-row">
              <span className="bk-bd-label">
                {s} <Icon name="star-filled" size={11} />
              </span>
              <span className="bk-bd-track">
                <span className="bk-bd-fill" style={{ width: `${pct}%` }} />
              </span>
              <span className="bk-bd-pct">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* The app lets a reader answer a book with a picture — `PictureReview` is a
   subclass of `Review` alongside `WrittenReview`. There is no file picker in a
   prototype, so "Add a photo" attaches one of the drawings the fixtures already
   carry, in turn. */
const PICTURES = ['snapdragon', 'harvest', 'wild', 'lake', 'web', 'gorilla', 'house']

export const pictureSrc = (name) => `${import.meta.env.BASE_URL}picture-reviews/${name}.webp`

function ReviewComposer({ onAdd }) {
  const [stars, setStars] = useState(0)
  const [body, setBody] = useState('')
  const [image, setImage] = useState(null)
  const submit = () => {
    if (!stars || !body.trim()) return
    onAdd({ stars, body: body.trim(), image })
    setStars(0)
    setBody('')
    setImage(null)
  }
  return (
    <div className="bk-composer">
      <div className="bk-composer-main">
        <div className="bk-composer-top">
          <span className="bk-composer-prompt">What did you think?</span>
          <StarInput value={stars} onChange={setStars} size={22} />
        </div>
        <textarea
          className="bk-composer-text"
          rows={3}
          value={body}
          placeholder="Share your review — no spoilers! What would you tell a friend?"
          onChange={(e) => setBody(e.target.value)}
        />
        {image && (
          <span className="bk-composer-pic">
            <img src={pictureSrc(image)} alt="" />
            <button
              type="button"
              className="bk-composer-pic-off"
              onClick={() => setImage(null)}
              aria-label="Remove photo"
            >
              <Icon name="x" size={13} />
            </button>
          </span>
        )}

        <div className="bk-composer-actions">
          <Button variant="primary" size="sm" disabled={!stars || !body.trim()} onClick={submit}>
            Post review
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setImage(PICTURES[Math.floor(Math.random() * PICTURES.length)])}
          >
            {image ? 'Change photo' : 'Add a photo'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function HelpfulButton({ count }) {
  const [on, setOn] = useState(false)
  return (
    <button className={`bk-helpful ${on ? 'is-on' : ''}`} onClick={() => setOn((v) => !v)}>
      <Icon name={on ? 'thumb-up-filled' : 'thumb-up'} size={14} />
      Helpful · {count + (on ? 1 : 0)}
    </button>
  )
}

function ReviewItem({ review }) {
  /* An approved review says nothing about itself — it is simply on the page.
     The other two states are what a reader needs told. */
  const state = review.mine ? REVIEW_STATES[review.state] : null
  return (
    <div className="bk-review">
      <Avatar initials={review.initials} color={review.color} size="md" />
      <div className="bk-review-main">
        {/* Who and how many stars, on one line: the name reads left, the
            rating sits at the far right where a column of them lines up down
            the list. No grade and no "Teacher" mark — a review is a reader's
            opinion of a book, and labelling whose opinion it is by year group
            or job turned a shelf of readers into a directory. */}
        <div className="bk-review-head">
          <span className="bk-review-who">
            <span className="bk-review-name">{review.name}</span>
            {review.verified && (
              <span
                className="bk-tag bk-tag--verified"
                title="Logged this book and completed a Book Talk with Benny"
              >
                <Icon name="checks" size={12} /> Verified read
              </span>
            )}
            {/* Only on your own. Everyone else's are here *because* they were
                approved — a pending or rejected review is never served to
                another reader, so a chip on one would be a state nobody can
                see. */}
            {state && (
              <span className={`bk-tag bk-review-state bk-review-state--${review.state}`}>
                <Icon name={state.icon} size={12} /> {state.label}
              </span>
            )}
          </span>
          <Stars value={review.stars} size={15} className="bk-review-stars" />
        </div>

        <p className="bk-review-body">{review.body}</p>
        {review.image && (
          <span className="bk-review-pic">
            <img src={pictureSrc(review.image)} alt={`${review.name}'s picture review`} />
          </span>
        )}

        <div className="bk-review-actions">
          <HelpfulButton count={review.helpful} />
          {/* The date belongs at the foot with the other metadata — up beside
              the name it was competing with whose review it is. */}
          <span className="bk-review-date">{review.date}</span>
        </div>
      </div>
    </div>
  )
}

/* The orders a reader actually wants a review list in. `Most helpful` is the
   default because it is the one that answers "is this book for me" fastest. */
const SORTS = {
  helpful: { label: 'Most helpful', by: (a, b) => b.helpful - a.helpful },
  newest: { label: 'Newest', by: (a, b) => when(b.date) - when(a.date) },
  highest: { label: 'Highest rated', by: (a, b) => b.stars - a.stars },
  lowest: { label: 'Lowest rated', by: (a, b) => a.stars - b.stars },
}

/* A review just posted says "Just now" rather than a date, which parses to
   nothing — it is the newest thing on the page, so it sorts as now. */
const when = (date) => (date === 'Just now' ? Date.now() : Date.parse(date) || 0)

export function Reviews({ book, userReviews, onAdd }) {
  const [sort, setSort] = useState('helpful')

  /* Your own stay on top whatever the order: one of them may be waiting on a
     moderator, and a reader who can't see that has no idea why their review
     isn't on the book. */
  const mine = userReviews.map((r) => ({ ...r, mine: true }))
  const rest = [...book.reviews].sort(SORTS[sort].by)
  const all = [...mine, ...rest]

  return (
    <div className="bk-reviews">
      <h3 className="bk-section-h">Ratings and reviews</h3>
      <RatingBreakdown book={book} />
      <ReviewComposer onAdd={onAdd} />
      <div className="bk-review-list">
        <div className="bk-review-listhead">
          <h3>{all.length} reviews from readers</h3>
          {/* A real control, not a label shaped like one: it said "Most
              helpful" beside a chevron and the list was in fixture order
              whatever you pressed. */}
          <Flyout
            placement="bottom-end"
            trigger={({ toggle }) => (
              <button type="button" className="bk-review-sort" onClick={toggle}>
                {SORTS[sort].label} <Icon name="chevron-down" size={14} />
              </button>
            )}
          >
            {({ close }) => (
              <FlyoutMenu>
                {Object.entries(SORTS).map(([id, s]) => (
                  <FlyoutMenuItem
                    key={id}
                    active={id === sort}
                    onClick={() => {
                      close()
                      setSort(id)
                    }}
                  >
                    {s.label}
                  </FlyoutMenuItem>
                ))}
              </FlyoutMenu>
            )}
          </Flyout>
        </div>
        {all.map((r) => (
          <ReviewItem key={r.id} review={r} />
        ))}
      </div>
    </div>
  )
}
