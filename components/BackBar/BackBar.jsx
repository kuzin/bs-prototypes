import { Icon } from '@components/Icon/Icon'
import './BackBar.css'

/**
 * Full-width back-navigation bar.
 * Renders a red "‹ {label}" link styled like the BeanstackProfile breadcrumb,
 * shared across prototypes.
 *
 * By default the bar is transparent and carries no padding: it goes inside the
 * page container and picks up that container's padding and left edge, so it
 * lines up with the page header beneath it.
 *
 * `fixed` makes it a bar in its own right — stuck to the top of its scrolling
 * region, on white, with its own padding and a hairline under it. Use it where
 * there is no page container to sit inside and the content scrolls past the
 * link rather than starting below it (the Pattern Library's component pages).
 *
 * @param {boolean} fixed  sticky white bar with its own padding
 */
export function BackBar({ label, onClick, href, fixed = false, className = '' }) {
  const Tag = href ? 'a' : 'button'
  return (
    <div className={`back-bar${fixed ? ' back-bar--fixed' : ''} ${className}`.trim()}>
      <Tag
        type={href ? undefined : 'button'}
        href={href}
        onClick={onClick}
        className="back-bar-link"
      >
        <Icon name="chevron-left" size={14} stroke={2.5} />
        {label}
      </Tag>
    </div>
  )
}
