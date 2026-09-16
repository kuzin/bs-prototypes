import './ReviewsList.css'

/**
 * `components/home/ReviewsList.tsx`.
 *
 * A 295×187 grey card per review — the dimensions are inline in the source rather than in a
 * stylesheet, which is why they are oddly specific.
 *
 * Three divergences:
 *   - WHITE, like every other card on Home. The source's lightestGray was a card on a white page;
 *     on the home grey it is the ground with a slightly different grey on it.
 *   - The body clamps to 4 lines and actually ELLIPSES. The source says 8, but the card is a fixed
 *     187pt with `overflow: hidden`, so it clips at about 5 and the clamp never fires — the text
 *     just stops mid-sentence with no sign there is more.
 *   - A "View More" affordance, so the card says it opens. It is a SPAN, not a nested button: the
 *     whole card is already the tap target, and a button inside a button is neither valid nor
 *     something a thumb can distinguish at this size.
 */
export function ReviewsList({ reviews, onPress }) {
  return (
    <div className="m-revs">
      {reviews.map((r, i) => (
        <button
          key={r.id}
          type="button"
          className={`m-rev${i === 0 ? ' is-first' : ''}`}
          onClick={() => onPress?.(r)}
        >
          <span className="m-rev-title">{r.bookTitle}</span>
          <span className="m-rev-body m-clamp-4">{r.review}</span>
          <span className="m-rev-more">View More</span>
        </button>
      ))}
    </div>
  )
}
