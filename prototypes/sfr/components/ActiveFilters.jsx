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
          <svg
            viewBox="0 0 12 12"
            width="11"
            height="11"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="3" x2="9" y2="9" />
            <line x1="9" y1="3" x2="3" y2="9" />
          </svg>
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
