import { Icon } from '@components/Icon/Icon'

import './ReviewArt.css'

/** A picture review's artwork — the reader's own drawing. The colour field is
    the ground behind one that hasn't loaded (or a fixture without art yet). */
export function ReviewArt({ review, size = 34, className = '' }) {
  const [from, to] = review.art ?? ['#ACACAC', '#656565']
  return (
    <span
      className={`rvart ${className}`.trim()}
      style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      {review.image ? (
        <img
          className="rvart-img"
          src={`${import.meta.env.BASE_URL}picture-reviews/${review.image}.webp`}
          alt=""
          loading="lazy"
        />
      ) : (
        <Icon name="photo" size={size} />
      )}
    </span>
  )
}
