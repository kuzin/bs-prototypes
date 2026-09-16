import { Icon } from '@components/Icon/Icon'
import './ActiveFilters.css'

// filters: [{ key, label, onClear }]
// onClearAll: clears all filters at once
export function ActiveFilters({ filters, onClearAll }) {
  if (filters.length === 0) return null
  return (
    <div className="af-bar">
      {/* The label and the chips are one wrapping group, so "Clear all" is
          beside the group rather than the last thing in it — a wrapping row
          would carry it down to the final line with the chips. */}
      <div className="af-set">
        <span className="af-label">Filtered by:</span>
        {filters.map((f) => (
          <button key={f.key} className="af-chip" onClick={f.onClear}>
            {f.label}
            <Icon name="x" size={11} stroke={2} />
          </button>
        ))}
      </div>
      {filters.length > 1 && (
        <button className="af-clear-all" onClick={onClearAll}>
          Clear all
        </button>
      )}
    </div>
  )
}
