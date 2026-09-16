import { Img, EmptyStateView } from '@mobile/components'
import './BookLists.css'

/**
 * `src/bookLists/components/BookLists.tsx` with `origin="bookLists"` — the Book Lists tab.
 *
 * `BookListItem` serves four origins and they are NOT the same row: `bookLists` gets a 80×120
 * cover, `paddingVertical: 16`, `marginRight: 36` and the book COUNT as its second line, while the
 * dashboard and classroom-library origins get a 56×84 cover at 10/20 and the AUTHOR instead. Only
 * the first is used here.
 *
 * The cover carries TWO offset shadow blocks rather than a drop shadow — 80×110 at `left: 8` and
 * 7% black, then 80×100 at `left: 16` and 5% — so the row reads as a stack of books seen
 * side-on. That is also why the gap to the text is 36 rather than the usual 20: the shadows are
 * occupying the first 16 of it.
 *
 * A list with no cover falls back to `chooseRandomBeanstackColor(title)` — a colour derived from
 * the NAME, so it is stable per list — with the `beanstack_heart_white` mark at 24pt on top.
 */
export function BookLists({ lists, onOpenList }) {
  if (lists.length === 0) {
    return (
      /* The badges artwork again. */
      <EmptyStateView
        source="my_badges_empty_state"
        boldText="No Book Lists to Show"
        middleText="There are no book lists at this time."
      />
    )
  }

  return (
    <div className="m-blist">
      {lists.map((l) => (
        <button key={l.id} type="button" className="m-blist-row" onClick={() => onOpenList?.(l)}>
          <span className="m-blist-item">
            <span className="m-blist-cover-wrap">
              {/* Drawn back-to-front: the further, fainter block first. */}
              <span className="m-blist-shadow-2" aria-hidden="true" />
              <span className="m-blist-shadow-1" aria-hidden="true" />
              <span className="m-blist-cover">
                {l.cover ? (
                  <span className="m-blist-cover-img" style={{ background: l.cover }} />
                ) : (
                  <span className="m-blist-nocover" style={{ background: l.tint }}>
                    <Img name="beanstack_heart_white" width={24} />
                  </span>
                )}
              </span>
            </span>

            <span className="m-blist-info">
              <span className="m-t-title-regular m-blist-name">{l.name}</span>
              <span className="m-blist-count">{l.bookCount} Books</span>
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}
