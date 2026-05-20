import './FilterBar.css'

/**
 * FilterBar — a row of labeled controls (typically selects) with an optional
 * action button aligned to the right.
 *
 * <FilterBar action={<Button variant="secondary">Save</Button>}>
 *   <FilterItem label="View as …">
 *     <Select value={v} onChange={…}> … </Select>
 *   </FilterItem>
 *   <FilterItem label="Log Type">
 *     <Select value={v} onChange={…}> … </Select>
 *   </FilterItem>
 * </FilterBar>
 */

export function FilterBar({ children, action, className = '' }) {
  return (
    <div className={`fltr ${className}`.trim()}>
      <div className="fltr-items">{children}</div>
      {action && <div className="fltr-action">{action}</div>}
    </div>
  )
}

export function FilterItem({ label, children, className = '' }) {
  return (
    <div className={`fltr-item ${className}`.trim()}>
      {label && <div className="fltr-lbl">{label}</div>}
      <div className="fltr-ctl">{children}</div>
    </div>
  )
}
