import './BookListItem.css'

/**
 * `src/components/listItems/BookListItem.tsx` — the book row used by All Titles, search and the
 * book lists.
 *
 * Two things it does that are easy to miss:
 *
 * 1. The cover's shadow is a SIBLING block at 7% black, offset down-5 and right-8 behind the
 *    image, not a box-shadow. The app draws book shadows this way everywhere.
 * 2. The progress bar and the "Completed N Times" tag are mutually exclusive — the bar shows only
 *    while `totalCompletions === 0`, so a book you have finished loses its bar and gains the tag.
 *
 * The bar is tinted with `ctaColor`, not `primaryColor`.
 */
export function BookListItem({
  title,
  author,
  cover,
  abbreviation,
  coverColor,
  percentageCompleted = 0,
  totalCompletions = 0,
  showProgressBar = false,
  isSearch = false,
  disabled = false,
  onPress,
}) {
  const showBar = showProgressBar && totalCompletions === 0 && percentageCompleted > 0

  return (
    <button
      type="button"
      className={`m-bli${isSearch ? ' is-search' : ''}`}
      /* `disabled` is the friend's-log case: the same row, inert. You can read what they logged
         and you cannot open it, because there is no session of theirs for you to see. */
      disabled={disabled}
      onClick={onPress}
      aria-label={`${title} Book${author ? ` by ${author}` : ''}. ${
        totalCompletions > 0 ? `Completed ${totalCompletions} times.` : ''
      } Click to open ${title} details modal`}
    >
      <span className="m-bli-item">
        <span className="m-bli-wrapper">
          <span className="m-bli-cover" style={{ background: cover ?? `#${coverColor}` }}>
            {!cover && <span className="m-bli-abbr">{abbreviation}</span>}
          </span>
          <span className="m-bli-shadow" aria-hidden="true" />
        </span>

        <span className="m-bli-info">
          <span>
            <span className={`m-bli-title ${isSearch ? 'm-t-title-small' : 'm-t-title-regular'}`}>
              {title}
            </span>
            {author && <span className="m-t-body-small m-bli-author">{author}</span>}
          </span>

          {!isSearch && (
            <span>
              {showBar && (
                <span className="m-bli-progress">
                  <span className="m-bli-track">
                    <span className="m-bli-fill" style={{ width: `${percentageCompleted}%` }} />
                  </span>
                  <span className="m-t-body-small m-bli-pct">{percentageCompleted}%</span>
                </span>
              )}
              {totalCompletions > 0 && (
                <span className="m-bli-tag">
                  Completed {totalCompletions} Time{totalCompletions > 1 ? 's' : ''}
                </span>
              )}
            </span>
          )}
        </span>
      </span>
    </button>
  )
}
