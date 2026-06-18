import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Avatar } from '@components/Avatar/Avatar'
import { Button } from '@components/Button/Button'
import { Stars, StarInput } from './Stars'

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

function ReviewComposer({ onAdd }) {
  const [stars, setStars] = useState(0)
  const [body, setBody] = useState('')
  const submit = () => {
    if (!stars || !body.trim()) return
    onAdd({ stars, body: body.trim() })
    setStars(0)
    setBody('')
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
        <div className="bk-composer-foot">
          <span className="bk-composer-hint">
            <Icon name="shield-check" size={14} /> Reviews are visible to readers at your school
          </span>
          <Button variant="primary" size="sm" disabled={!stars || !body.trim()} onClick={submit}>
            Post review
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
  return (
    <div className="bk-review">
      <Avatar initials={review.initials} color={review.color} size="md" />
      <div className="bk-review-main">
        <div className="bk-review-head">
          <span className="bk-review-name">{review.name}</span>
          {review.educator ? (
            <span className="bk-tag bk-tag--educator">
              <Icon name="school" size={12} /> {review.grade}
            </span>
          ) : (
            <span className="bk-review-grade">{review.grade}</span>
          )}
          {review.verified && (
            <span
              className="bk-tag bk-tag--verified"
              title="Logged this book and completed a Book Talk with Benny"
            >
              <Icon name="checks" size={12} /> Verified read
            </span>
          )}
          <span className="bk-review-dot">·</span>
          <span className="bk-review-date">{review.date}</span>
        </div>
        <Stars value={review.stars} size={14} className="bk-review-stars" />
        <p className="bk-review-body">{review.body}</p>
        <div className="bk-review-actions">
          <HelpfulButton count={review.helpful} />
          <button className="bk-review-reply">
            <Icon name="message" size={14} /> Reply
          </button>
        </div>

        {review.replies?.length > 0 && (
          <div className="bk-replies">
            {review.replies.map((r, i) => (
              <div key={i} className="bk-reply">
                <Avatar initials={r.initials} color={r.color} size="sm" />
                <div>
                  <span className="bk-reply-head">
                    <span className="bk-review-name">{r.name}</span>
                    <span className="bk-review-dot">·</span>
                    <span className="bk-review-date">{r.date}</span>
                  </span>
                  <p className="bk-review-body">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function Reviews({ book, userReviews, onAdd }) {
  const all = [...userReviews, ...book.reviews]
  return (
    <div className="bk-reviews">
      <RatingBreakdown book={book} />
      <ReviewComposer onAdd={onAdd} />
      <div className="bk-review-list">
        <div className="bk-review-listhead">
          <h3>{all.length} reviews from readers</h3>
          <span className="bk-review-sort">
            Most helpful <Icon name="chevron-down" size={14} />
          </span>
        </div>
        {all.map((r) => (
          <ReviewItem key={r.id} review={r} />
        ))}
      </div>
    </div>
  )
}
