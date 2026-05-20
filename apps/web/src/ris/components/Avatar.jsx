import './Avatar.css'

/**
 * <Avatar initials="MC" color="#E8866A" size="md" />
 * <Avatar initials="LE" color="#1D4ED8" size="lg" shape="square" />
 *
 * sizes: xs | sm | md | lg | xl
 * shape: circle (default) | square
 */
export function Avatar({ initials, color = '#94A3B8', size = 'md', shape = 'circle', className = '' }) {
  return (
    <span
      className={`avatar avatar--${size} avatar--${shape} ${className}`.trim()}
      style={{ background: color }}
      aria-hidden="true"
    >
      <span className="avatar-text">{initials}</span>
    </span>
  )
}
