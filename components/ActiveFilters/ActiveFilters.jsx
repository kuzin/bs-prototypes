import { Icon } from '@components/Icon/Icon'
import './ActiveFilters.css'

// filters: [{ key, label, onClear }]
// onClearAll: clears all filters at once
export function ActiveFilters({ filters, onClearAll }) {
  if (filters.length === 0) return null
  return (
    <div className="af-bar">
      <span className="af-label">Filtered by:</span>
      {filters.map((f) => (
        <button key={f.key} className="af-chip" onClick={f.onClear}>
          {f.label}
          <Icon name="x" size={11} stroke={2} />
        </button>
      ))}
      {filters.length > 1 && (
        <button className="af-clear-all" onClick={onClearAll}>
          Clear all
        </button>
      )}
    </div>
  )
}
