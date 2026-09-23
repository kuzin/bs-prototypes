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
  /* The glyph in the well. A loupe means "find the thing you already have a
     word for", which is not what every field in this shape does — a field you
     describe a mood to is asking a different question, and says so with a
     different mark. */
  icon = 'search',
  className = '',
}) {
  return (
    <div className={`search-input${value ? ' is-active' : ''} ${className}`.trim()}>
      <span className="search-input-ic">
        <Icon name={icon} size={16} />
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
