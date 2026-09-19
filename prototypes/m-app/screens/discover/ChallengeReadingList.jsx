import { useState, Fragment } from 'react'
import { Img } from '@mobile/components'
import './ChallengeReadingList.css'

/**
 * `challenges/components/BookList.tsx` → `BookListChallengesComponent` — the Reading List tab.
 *
 * The screen's whole job is to answer "which of these do I actually have to read", and the
 * answer comes from `program_books_requirement_type`, which has four values and each one
 * changes both the heading and the grouping:
 *
 *   none      no requirement header at all — the list is a suggestion
 *   all       "Required Reading" / "All Titles Required"
 *   some      "N Titles Required" and no subtitle — any N of them will do
 *   specific  "Required Reading", and the list SPLITS: the required titles first, then a
 *             "More Titles" section. This is the only value that produces a second heading
 *
 * `specific` has a fifth phrasing hiding inside it. When there are fewer required titles than
 * the minimum, you must read those AND make the number up from the rest, so the subtitle
 * becomes "N titles required, including these specific titles". That is the only case where the
 * two numbers disagree, and the sentence exists to explain the gap.
 *
 * Grid or list is the reader's choice and the glyph shows the mode you would SWITCH TO, not the
 * one you are in — the app passes `images.list` while in grid.
 */

/** `getRequiredBookListTitle`. */
function requiredTitle(type, min) {
  if (type === 'all' || type === 'specific') return 'Required Reading'
  return `${min} Title${min > 1 ? 's' : ''} Required`
}

/** `getRequiredSubTitle` — and `someSpecific` is the interesting branch. */
function requiredSubtitle(type, min, sections) {
  if (type === 'all') return 'All Titles Required'

  const requiredCount = sections[0]?.data?.length ?? 0
  const someSpecific = min !== undefined && sections.length > 1 && requiredCount < min
  if (someSpecific) {
    const which = requiredCount > 1 ? 'these specific titles' : 'this specific title'
    return `${min} title${min > 1 ? 's' : ''} required, including ${which}`
  }
  return `${min} Title${min > 1 ? 's' : ''} Required`
}

function BookCover({ book, mode }) {
  return (
    <div className={`m-crl-book is-${mode}`}>
      <div className="m-crl-cover" style={{ background: book.art }}>
        {!book.art && <span className="m-crl-cover-text">{book.title}</span>}
      </div>
      {/* The same shadow box as the Challenge Log's rows — a real shadow would make the cover
          float; this one only shows under the bottom edge. */}
      <span className="m-crl-shadow" aria-hidden="true" />
    </div>
  )
}

export function ChallengeReadingList({
  books = [],
  numberOfBooks,
  requirementType = 'none',
  minimumRequired,
  onOpenBook,
}) {
  const [mode, setMode] = useState('grid')

  /* `groupBy(required)` then `orderBy(title, 'asc')`. The required group's title is the EMPTY
     string, so sorting alphabetically is what puts it first — "" sorts before "More Titles".
     And the second group is titled at all only when the type is `specific`: under any other
     type the split exists in the data but has nothing to say, so it renders as one run. */
  const grouped = [
    { title: '', data: books.filter((b) => b.required) },
    {
      title: requirementType === 'specific' ? 'More Titles' : '',
      data: books.filter((b) => !b.required),
    },
  ].filter((s) => s.data.length > 0)

  const sections = [...grouped].sort((a, b) => a.title.localeCompare(b.title))

  return (
    <div className="m-crl">
      <div className="m-crl-head">
        <h2 className="m-crl-count">{numberOfBooks ?? books.length} Books</h2>
        {/* The glyph is the mode you would SWITCH TO. */}
        <button
          type="button"
          className="m-crl-toggle"
          aria-label={`Switch to ${mode === 'grid' ? 'list' : 'grid'} view`}
          onClick={() => setMode(mode === 'grid' ? 'list' : 'grid')}
        >
          <Img name={mode === 'grid' ? 'list' : 'grid'} className="m-crl-toggle-icon" />
        </button>
      </div>

      {requirementType !== 'none' && (
        <div className="m-crl-required">
          <h3 className="m-crl-required-title">
            {requiredTitle(requirementType, minimumRequired)}
          </h3>
          {requirementType !== 'some' && (
            <p className="m-crl-required-sub">
              {requiredSubtitle(requirementType, minimumRequired, sections)}
            </p>
          )}
        </div>
      )}

      {sections.map((section) => (
        <Fragment key={section.title || 'required'}>
          {section.title && <h3 className="m-crl-section">{section.title}</h3>}
          <div className={`m-crl-books is-${mode}`}>
            {section.data.map((b) =>
              mode === 'grid' ? (
                <button
                  key={b.id}
                  type="button"
                  className="m-crl-grid-item"
                  onClick={() => onOpenBook?.(b)}
                  aria-label={b.author ? `${b.title} by ${b.author}` : b.title}
                >
                  <BookCover book={b} mode="grid" />
                </button>
              ) : (
                <button
                  key={b.id}
                  type="button"
                  className="m-crl-row"
                  onClick={() => onOpenBook?.(b)}
                  aria-label={b.author ? `${b.title} by ${b.author}` : b.title}
                >
                  <BookCover book={b} mode="list" />
                  <span className="m-crl-row-text">
                    <span className="m-t-title-regular m-crl-row-title">{b.title}</span>
                    <span className="m-crl-row-author">{b.author}</span>
                  </span>
                </button>
              ),
            )}
          </div>
        </Fragment>
      ))}
    </div>
  )
}
