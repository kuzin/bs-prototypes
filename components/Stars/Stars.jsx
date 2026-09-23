import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import './Stars.css'

/**
 * The system's one star rating.
 *
 * Read-only, with **fractional fill on the last partial star** — a 4.3 draws
 * four full stars and a third of a fifth, not a rounded-up four. Rounding to
 * whole stars makes a 4.5 and a 4.9 look identical, which is the one thing a
 * rating is for.
 *
 *   <Stars value={4.3} />
 *   <Stars value={4.3} size={18} />
 */
export function Stars({ value = 0, size = 15, className = '' }) {
  return (
    <span className={`stars ${className}`.trim()} aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i))
        return (
          <span key={i} className="star" style={{ width: size, height: size }}>
            <Icon name="star-filled" size={size} className="star-bg" />
            <span className="star-fill" style={{ width: `${fill * 100}%` }}>
              <Icon name="star-filled" size={size} className="star-fg" />
            </span>
          </span>
        )
      })}
    </span>
  )
}

/**
 * The compact inline summary — `4.8 ★★★★★ (1,247)`. For a card, a table cell,
 * a row: anywhere the rating is one fact among several on a line.
 */
export function RatingInline({ value, count, size = 14, className = '' }) {
  return (
    <span className={`rating-inline ${className}`.trim()}>
      <strong>{value.toFixed(1)}</strong>
      <Stars value={value} size={size} />
      {count != null && <span className="rating-count">({count.toLocaleString()})</span>}
    </span>
  )
}

/**
 * The rating as a block, for a panel that is *about* the thing being rated —
 * a book's detail rail, a reader's review. The figure leads at display size
 * because it is the reading; the stars are the scale it is on, and the count
 * is how much to trust it.
 *
 *   <RatingBlock value={4.3} count={12} />
 *   <RatingBlock value={null} count={0} empty="Nobody here has rated it yet" />
 */
export function RatingBlock({ value, count, size = 15, empty = 'No ratings yet', className = '' }) {
  if (value == null) return <p className={`rating-empty ${className}`.trim()}>{empty}</p>
  return (
    <div className={`rating-block ${className}`.trim()}>
      <span className="rating-score">{value.toFixed(1)}</span>
      <span className="rating-meta">
        <Stars value={value} size={size} />
        {count != null && (
          <span className="rating-count">
            {count} {count === 1 ? 'rating' : 'ratings'}
          </span>
        )}
      </span>
    </div>
  )
}

/** The picker in a review composer. */
export function StarInput({ value = 0, onChange, size = 30 }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <span className="star-input" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-btn ${n <= shown ? 'is-on' : ''}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange?.(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <Icon name="star-filled" size={size} />
        </button>
      ))}
    </span>
  )
}
