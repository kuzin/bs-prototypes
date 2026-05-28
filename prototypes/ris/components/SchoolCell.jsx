import './SchoolCell.css'

/**
 * Small school-identity cell — school name + optional meta line.
 * Used inside Tables and lists across the district view.
 *
 *   <SchoolCell name="Lincoln Elementary" meta="K-5 · 850 students" />
 *
 * Legacy `id` / `color` props are accepted for backwards compatibility
 * with existing call sites but are no longer rendered.
 */
export function SchoolCell({ name, meta }) {
  return (
    <div className="rc-school-cell">
      <div className="rc-school-name">{name}</div>
      {meta && <div className="rc-school-meta">{meta}</div>}
    </div>
  )
}
