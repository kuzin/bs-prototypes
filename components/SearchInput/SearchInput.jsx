import './SearchInput.css'
import { Icon } from '@components/Icon/Icon'

/**
 * A search field: leading magnifier, text input, and a clear button that
 * appears once there's a value. Controlled via `value` + `onChange(next)`
 * (receives the new string, and '' when cleared).
 *
 *   <SearchInput value={q} onChange={setQ} placeholder="Search all badges" />
 *
 * Defaults to flex:1 (grows to fill a toolbar row). Pass `className` for
 * layout overrides.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  ariaLabel,
  className = '',
}) {
  return (
    <div className={`search-input${value ? ' is-active' : ''} ${className}`.trim()}>
      <span className="search-input-ic">
        <Icon name="search" size={16} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
      />
      {value && (
        <button
          type="button"
          className="search-input-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <Icon name="x" size={14} stroke={2.2} />
        </button>
      )}
    </div>
  )
}
