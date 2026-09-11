import './PageHeader.css'

/**
 * PageHeader — the title / subtitle / actions block at the top of an admin page.
 *
 * A port of the shipped app's `.page-header` (bs-product
 * `app/assets/stylesheets/microsite/_page_header.scss`), whose markup is:
 *
 *   .page-header
 *     header.page-header__heading
 *       h1.page-title           28px / 800 / $textColorDark
 *       span.page-title-search  22px / 500 / $gray750   (the subtitle slot)
 *     .page-header__actions     right-aligned button row
 *
 * Every admin page should use this rather than rolling its own heading, so
 * titles land on the same baseline and the same left edge as the content
 * column below them.
 *
 * <PageHeader
 *   title="Find a Person"
 *   subtitle="Search fields must contain at least two characters."
 *   actions={<Button>Log for Class</Button>}
 * />
 *
 * @param {ReactNode} title      the page title (renders as h1)
 * @param {ReactNode} subtitle   optional one-line description under the title
 * @param {ReactNode} before     optional slot left of the heading (e.g. an avatar)
 * @param {ReactNode} actions    optional right-aligned actions
 * @param {boolean}   border     draw the app's `--with-border` bottom rule
 * @param {ReactNode} children   optional extra row below (e.g. a tab strip)
 */
export function PageHeader({
  title,
  subtitle,
  before,
  actions,
  border = false,
  className = '',
  children,
}) {
  const cls = ['page-header', border && 'page-header--with-border', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls}>
      {before && <div className="page-header__before">{before}</div>}
      <header className="page-header__heading">
        {title && <h1 className="page-title">{title}</h1>}
        {subtitle && <span className="page-title-search">{subtitle}</span>}
      </header>
      {actions && <div className="page-header__actions">{actions}</div>}
      {children}
    </div>
  )
}
