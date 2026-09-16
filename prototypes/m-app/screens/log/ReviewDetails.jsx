import { SheetHeader, ProfileRow } from '@mobile/components'
import './ReviewDetails.css'

/**
 * `screens/ReviewDetails.jsx` — where tapping a review ROW goes. (The “…” beside it opens
 * `ReviewOptionsModal` instead; two targets on one row, two destinations.)
 *
 * DIVERGENCE — presented as a SHEET, not the pushed stack route the app uses.
 *
 * `reviewDetails` is a stack screen with a back button, so in the app it slides in from the right
 * while every other detail in the Log — badge, achievement, book, book list — drops down as a
 * modal. One of the five behaving differently is not a distinction a reader can use; it just
 * means the back gesture changes depending on which row you tapped. On the shared `SheetHeader`
 * with the rest of them.
 *
 * The header keeps what the route defined: the title CENTRED, and on the Log tab an “Edit” text
 * button on the right in the tenant's primaryColor. Discover has no Edit — you cannot edit
 * someone else's review.
 *
 * Three blocks down the page:
 *   1. the reviewer — a 40pt avatar beside the name and a 12pt doveGray date
 *   2. the review itself, 16/500 at `lineHeight: 22` and `letterSpacing: -0.29`
 *   3. “Reviewing”, then a lightestGray panel naming the book — with the cover pulled OUT of it,
 *      `position: absolute; right: 16; top: -10`, so it overhangs the panel's top edge
 *
 * That overhang is the detail worth not flattening: the panel is 16pt-padded and the cover breaks
 * its top by 10, which is what stops the block reading as a plain row.
 */
export function ReviewDetails({ review, profile, type = 'log', onClose, onEdit }) {
  return (
    <div className="m-rd">
      <SheetHeader
        onClose={onClose}
        center="Review"
        right={
          type === 'log' ? (
            <button type="button" className="m-rd-edit" onClick={() => onEdit?.(review)}>
              Edit
            </button>
          ) : null
        }
      />

      <div className="m-rd-scroll">
        <div className="m-rd-who">
          {/* `showProfileName={false}` — the name is rendered beside it, not inside it. */}
          <ProfileRow
            showOnlyInitials
            name={type === 'log' ? profile : (review.author ?? profile)}
          />
          <div>
            <p className="m-rd-author">{review.author ?? profile}</p>
            {review.date && <p className="m-rd-date">{review.date}</p>}
          </div>
        </div>

        <p className="m-rd-text">{review.text}</p>

        <p className="m-section-head m-rd-reviewing">Reviewing</p>
        <div className="m-rd-book">
          <div className="m-rd-book-info">
            <p className="m-rd-book-title">{review.bookTitle}</p>
            {review.bookAuthor && <p className="m-rd-book-author">{review.bookAuthor}</p>}
          </div>
          {/* reviewBookContainer — absolute, right 16, top -10, so it breaks the panel's edge. */}
          <span className="m-rd-cover" style={{ background: review.cover ?? 'var(--m-denim)' }} />
        </div>
      </div>
    </div>
  )
}
