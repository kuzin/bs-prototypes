import { Icon } from '@components/Icon/Icon'
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
        <Icon name="chevron-left" size={11} stroke={2.5} />
        {label}
      </Tag>
    </div>
  )
}
