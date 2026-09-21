import { EmptyStateView } from '@mobile/components'
import { BookListRow } from '../../components/BookListRow'
import './ClassroomLibraries.css'

/**
 * `classroomLibraries/components/ClassroomLibraries.jsx` — the Libraries tab.
 *
 * A teacher's shelf, and the row is the SAME `BookListItemStyles` a book list uses, which is why
 * this renders `BookListRow` rather than drawing its own: 80×120 cover, `marginRight: 36`, a
 * count on the second line.
 *
 * TWO empty states, and they are not interchangeable — this is the fork worth having here:
 *
 *   • a NON-PATRON (a teacher or admin signed into the reader app) is told the feature is not
 *     for them: "Classroom libraries display only to students." Their own tools are in the
 *     admin dashboard, so the copy points them there rather than leaving them on an empty list
 *     wondering what they did wrong.
 *   • a PATRON with none is told nobody has added anything yet — "Your teachers haven't added
 *     any books to their libraries yet." Nothing is broken and there is nothing to do.
 *
 * `role !== 'patron'` is checked BEFORE the list is even considered, so a teacher sees their
 * message whether or not libraries exist.
 *
 * Spacing is Book Lists' 24/56 rather than the source's 40 plus 32pt separators — see the CSS.
 *
 * The teacher's name is built, not stored: `${first} ${last}'s Class`, with `checkLastLetter`'s
 * bare apostrophe on a name already ending in s. Mr. Rivers gets "Mr. Rivers' Class".
 */
const possessive = (name = '') => (name.slice(-1) === 's' ? `${name}'` : `${name}'s`)

export function ClassroomLibraries({ libraries = [], role = 'patron', onOpenLibrary }) {
  if (role !== 'patron') {
    return (
      <div className="m-cls-empty">
        <EmptyStateView
          source="recent_titles_empty_state"
          boldText="Classroom libraries display only to students."
          middleText="Visit the admin dashboard to use classroom library tools for teachers and administrators."
        />
      </div>
    )
  }

  if (libraries.length === 0) {
    return (
      <div className="m-cls-empty">
        <EmptyStateView
          source="recent_titles_empty_state"
          boldText="No classroom libraries to show"
          middleText="Your teachers haven’t added any books to their libraries yet."
        />
      </div>
    )
  }

  return (
    <div className="m-cls">
      {libraries.map((lib) => {
        const teacher = `${possessive(`${lib.firstName} ${lib.lastName}`)} Class`
        return (
          <BookListRow
            key={lib.id}
            name={teacher}
            count={lib.bookCount}
            cover={lib.cover}
            tint={lib.tint}
            onPress={() => onOpenLibrary?.({ ...lib, name: teacher })}
          />
        )
      })}
    </div>
  )
}
