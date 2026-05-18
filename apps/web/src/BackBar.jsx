import './BackBar.css'

/**
 * Full-width back-navigation bar.
 * Renders a red "‹ {label}" link styled like the BeanstackProfile breadcrumb,
 * shared across prototypes.
 */
export function BackBar({ label, onClick, href, className = '' }) {
  const Tag = href ? 'a' : 'button'
  return (
    <div className={`back-bar ${className}`.trim()}>
      <Tag
        type={href ? undefined : 'button'}
        href={href}
        onClick={onClick}
        className="back-bar-link"
      >
        <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="10,3 5,8 10,13" />
        </svg>
        {label}
      </Tag>
    </div>
  )
}
