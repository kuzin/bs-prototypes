import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'

// Read-only rating: 5 stars with fractional fill on the last partial star.
export function Stars({ value = 0, size = 15, className = '' }) {
  return (
    <span className={`bk-stars ${className}`.trim()} aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i))
        return (
          <span key={i} className="bk-star" style={{ width: size, height: size }}>
            <Icon name="star-filled" size={size} className="bk-star-bg" />
            <span className="bk-star-fill" style={{ width: `${fill * 100}%` }}>
              <Icon name="star-filled" size={size} className="bk-star-fg" />
            </span>
          </span>
        )
      })}
    </span>
  )
}

// Compact "4.8 ★★★★★ (1,247)" inline summary.
export function RatingInline({ value, count, size = 14, className = '' }) {
  return (
    <span className={`bk-rating-inline ${className}`.trim()}>
      <strong>{value.toFixed(1)}</strong>
      <Stars value={value} size={size} />
      {count != null && <span className="bk-rating-count">({count.toLocaleString()})</span>}
    </span>
  )
}

// Interactive star picker for the review composer.
export function StarInput({ value = 0, onChange, size = 30 }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <span className="bk-star-input" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`bk-star-btn ${n <= shown ? 'is-on' : ''}`}
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
