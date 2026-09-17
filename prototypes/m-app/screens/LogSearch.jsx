import { useMemo, useRef, useState, useEffect } from 'react'
import { BookListItem, EmptyStateView, Img, Keyboard } from '@mobile/components'
import './LogSearch.css'

/**
 * `search` with `searchType: 'myLog'` — where the Log tab's magnifier goes, and the reason
 * `LogStackTabNavigator` is the only navigator that passes `logSearch` to ProfileBar.
 *
 * It searches what the reader has already logged, not the catalogue: `SearchLayout` over a
 * results list, with the field focused on mount (`requestAnimationFrame(() => focus())`) so the
 * keyboard is up before the screen settles.
 *
 * The bar is the app's: a 48pt field at radius 16 on `lightestGray`, a 16pt magnifier and a 16pt
 * gap ahead of the input, a clear affordance that appears only once there is something to clear,
 * and Cancel beside it at 14/bold in the tenant's colour — the field takes 80% of the row and
 * Cancel takes what is left.
 *
 * DIVERGENCE — results update as you type rather than on submit. The app debounces at 500ms and
 * has a `returnKeyType="search"`; a prototype where nothing happens until you find the return key
 * reads as broken. The submit path still works.
 */
export function LogSearch({ titles = [], onOpenBook, onClose }) {
  const [query, setQuery] = useState('')
  const input = useRef(null)

  useEffect(() => {
    input.current?.focus()
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return titles.filter(
      (b) => b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q),
    )
  }, [query, titles])

  return (
    <div className="m-lsr">
      <div className="m-lsr-bar">
        <form
          className="m-lsr-field"
          onSubmit={(e) => {
            e.preventDefault()
            input.current?.blur()
          }}
        >
          <Img name="loggingSearchIcon" className="m-lsr-glyph" />
          <input
            ref={input}
            type="text"
            className="m-lsr-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search your log"
            autoCapitalize="none"
          />
          {/* `closeIconContainer` holds the slot whether or not the icon is in it, so the input
              does not grow by 16 the moment you start typing. */}
          <span className="m-lsr-clear-slot">
            {query !== '' && (
              <button
                type="button"
                className="m-lsr-clear"
                aria-label="Clear search text"
                onClick={() => {
                  setQuery('')
                  input.current?.focus()
                }}
              >
                <Img name="close" className="m-lsr-clear-icon" />
              </button>
            )}
          </span>
        </form>

        <button type="button" className="m-lsr-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>

      <div className="m-lsr-results">
        {query.trim() === '' ? null : results.length === 0 ? (
          <EmptyStateView
            source="my_activities_empty_state"
            boldText="No Titles Found"
            middleText={`Nothing in your log matches “${query.trim()}”.`}
          />
        ) : (
          results.map((b) => (
            <BookListItem key={b.id} {...b} isSearch onPress={() => onOpenBook?.(b)} />
          ))
        )}
      </div>

      <Keyboard />
    </div>
  )
}
