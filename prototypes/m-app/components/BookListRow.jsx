import { Img } from '@mobile/components'
import './BookListRow.css'

/**
 * `BookListItem` at `origin="bookLists"` — and it is the row for TWO different things.
 *
 * `BookLists` renders it for a book list, and `ClassroomLibrary` renders it for a teacher's
 * shelf, both off the same `BookListItemStyles`: an 80×120 cover, `marginRight: 36`, and a
 * count on the second line. That is why this is one component rather than two nearly-identical
 * ones — the row is the same row, and only what fills it differs.
 *
 * (`BookListItem`'s other two origins — the dashboard and the logging display — are a 56×84
 * cover at 10/20 padding with the AUTHOR on the second line. Those are genuinely a different
 * row and are not this component.)
 *
 * The stacked look is TWO offset blocks rather than a drop shadow: 80×110 at `left: 8` and 7%
 * black, then 80×100 at `left: 16` and 5%, so the row reads as books seen side-on. It is also
 * why the gap to the text is 36 and not the usual 20 — the blocks occupy the first 16 of it.
 *
 * With no cover the tile falls back to `chooseRandomBeanstackColor(title)`, a colour derived
 * from the NAME so it is stable per row rather than random per render, with `beanstack_heart_white`
 * at 24pt over it.
 */
export function BookListRow({ name, count, countNoun = 'Book', cover, tint, onPress }) {
  return (
    <button type="button" className="m-blist-row" onClick={onPress}>
      <span className="m-blist-item">
        <span className="m-blist-cover-wrap">
          {/* Drawn back-to-front: the further, fainter block first. */}
          <span className="m-blist-shadow-2" aria-hidden="true" />
          <span className="m-blist-shadow-1" aria-hidden="true" />
          <span className="m-blist-cover">
            {cover ? (
              <span className="m-blist-cover-img" style={{ background: cover }} />
            ) : (
              <span className="m-blist-nocover" style={{ background: tint }}>
                <Img name="beanstack_heart_white" width={24} />
              </span>
            )}
          </span>
        </span>

        <span className="m-blist-info">
          <span className="m-t-title-regular m-blist-name">{name}</span>
          <span className="m-blist-count">
            {count} {count === 1 ? countNoun : `${countNoun}s`}
          </span>
        </span>
      </span>
    </button>
  )
}
