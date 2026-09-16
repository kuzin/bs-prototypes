import './ChallengeCarouselCard.css'

/**
 * `src/components/home/ChallengeCarouselCard.tsx`.
 *
 * A 278×106 banner image with the challenge name and dates BELOW it — not a coloured tile with
 * text inside. The banner comes from `header_image_url`, falling back to `emptyChallengeImage`.
 */
export function ChallengeCarouselCard({ name, dates, banner, isFirst, onPress }) {
  return (
    <button
      type="button"
      className={`m-cc${isFirst ? ' is-first' : ''}`}
      onClick={onPress}
      aria-label={`${name} Challenge`}
    >
      <span className="m-cc-banner" style={{ background: banner }} />
      <span className="m-t-item-title m-cc-title">{name}</span>
      <span className="m-t-sub-heading m-cc-dates">{dates}</span>
    </button>
  )
}
