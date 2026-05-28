import '@components/Button/Button.css'

/**
 * <Button variant="primary" size="md" onClick={fn}>Log for Class</Button>
 * <Button variant="secondary" icon={<svg .../>}>Set Classroom Goal</Button>
 * <Button as="a" href="/path" variant="ghost">Open</Button>
 *
 * variants: primary | secondary | ghost | danger | accent
 * sizes:    sm | md | lg
 *
 * When variant="accent", pass `accent` (CSS color) to tint it.
 */
export function Button({
  as = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled,
  loading,
  accent,
  className = '',
  children,
  ...rest
}) {
  const Tag = as
  const cls = ['btn', `btn--${variant}`, `btn--${size}`, loading && 'btn--loading', className]
    .filter(Boolean)
    .join(' ')

  const style = accent ? { '--btn-accent': accent } : undefined

  return (
    <Tag
      className={cls}
      style={style}
      disabled={Tag === 'button' ? disabled || loading : undefined}
      aria-disabled={disabled || loading}
      {...rest}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-label">{children}</span>
      {iconRight && <span className="btn-icon btn-icon--right">{iconRight}</span>}
    </Tag>
  )
}
