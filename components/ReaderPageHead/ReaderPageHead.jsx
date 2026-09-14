import './ReaderPageHead.css'

/**
 * The row every page under the reader nav opens with: a title, an optional
 * count or one-line description under it, and optional actions opposite.
 *
 * It exists because five pages had five copies of the same block and they had
 * drifted — different type sizes, different margins, and a couple of them
 * bottom-aligned, which left a heading with no sub-line hugging the floor of an
 * otherwise empty box. One height and one set of margins means the body doesn't
 * jump as you move between tabs.
 *
 * Not `@components/PageHeader` — that is the *admin* page header (28px over a
 * 22px subtitle, ported from `_page_header.scss`), and every one of its
 * consumers is an admin surface.
 *
 * `as` picks the heading level: a page owns the `h1`, but a pane under a
 * sub-tab strip is an `h2`.
 */
export function ReaderPageHead({ title, count, actions, as: Heading = 'h1' }) {
  return (
    <header className="wa-pagehead">
      <div className="wa-pagehead-copy">
        <Heading className="wa-pagehead-title">{title}</Heading>
        {count != null && <p className="wa-pagehead-count">{count}</p>}
      </div>
      {actions && <div className="wa-pagehead-actions">{actions}</div>}
    </header>
  )
}
