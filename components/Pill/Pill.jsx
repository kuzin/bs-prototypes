import '@components/Pill/Pill.css'

/**
 * Colored badge / chip / pill.
 *
 * <Pill color="#7C3AED">Skills</Pill>                       // soft (default)
 * <Pill color="#DC2626" variant="filled">Critical</Pill>     // solid background
 * <Pill color="#0DA7BC" variant="outline">Active</Pill>      // bordered
 * <Pill color="#16A34A" icon={<svg/>}>+ 7 pts</Pill>
 *
 * variants: soft | filled | outline
 * sizes:    sm | md
 */
export function Pill({
  color = '#475569',
  variant = 'soft',
  size = 'md',
  icon,
  className = '',
  children,
}) {
  return (
    <span
      className={`pill pill--${variant} pill--${size} ${className}`.trim()}
      style={{ '--pill-color': color }}
    >
      {icon && <span className="pill-icon">{icon}</span>}
      <span className="pill-label">{children}</span>
    </span>
  )
}
