import { EmptyStateView } from '@mobile/components'
import { BookListRow } from '../../components/BookListRow'
import './BookLists.css'

/**
 * `src/bookLists/components/BookLists.tsx` with `origin="bookLists"` — the Book Lists tab.
 *
 * Only the list container is here; the row is `components/BookListRow`, because Classroom
 * Libraries renders exactly the same one off the same `BookListItemStyles`.
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
        <BookListRow
          key={l.id}
          name={l.name}
          count={l.bookCount}
          cover={l.cover}
          tint={l.tint}
          onPress={() => onOpenList?.(l)}
        />
      ))}
    </div>
  )
}
