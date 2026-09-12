import { useState } from 'react'
import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import { Select } from '@components/Form/Form'
import { Button } from '@components/Button/Button'
import { ActiveFilters } from '@components/ActiveFilters/ActiveFilters'
import { Icon } from '@components/Icon/Icon'
import '@components/FilterBar/FilterBar.css'
import '@components/Form/Form.css'
import './SessionsFilters.css'

// The page's search + filter chrome, in the shape the shipped Sessions for
// Review uses (bs-product `NewAdmin/SessionsForReview` +
// `SessionsForReview/components/FlaggedEntriesFilters`).
//
// Two things moved up here from the individual views:
//
//  * **Search** is one form for the whole page, toggled from the header, not an
//    input per tab. It's a card holding the field plus Search / Clear, Enter
//    submits, and Clear empties the field as well as the term — that's
//    `SearchForm` verbatim.
//  * **List by** is a filter in a second row, not a header toggle. The app
//    offers By Date / By Reader on the two tabs that have a reader roll-up
//    behind them, and the roll-up is a different table, not a grouping of this
//    one.
//
// The controls themselves carry no drawn label: each one already says what it
// filters ("All Classes"), which is the app's own filter *bar* — `FilterBar
// compact`.

export const LIST_BY = { date: 'By Date', reader: 'By Reader' }

/** The search card. Rendered by the page, above whichever tab is open. */
export function SessionsSearch({ value, onSearch }) {
  return (
    <form
      className="sfr-search"
      onSubmit={(e) => {
        e.preventDefault()
        onSearch(new FormData(e.currentTarget).get('term') ?? '')
      }}
    >
      <input
        className="sfr-search-input"
        name="term"
        type="text"
        defaultValue={value}
        placeholder="Search by student first or last name"
        aria-label="Search by student first or last name"
      />
      <div className="sfr-search-buttons">
        <Button type="submit" variant="primary" size="md">
          Search
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={(e) => {
            e.currentTarget.form.reset()
            onSearch('')
          }}
        >
          Clear
        </Button>
      </div>
    </form>
  )
}

/**
 * A filter bar. `filters` is an array of `{ key, value, onChange, options }`,
 * where each option is `[value, label]` and the first is the "all" option that
 * names the control.
 *
 * `listBy` + `onListBy` add the second row; omit them on a tab that has no
 * reader roll-up (Safety Risk, All Book Talks).
 *
 * `activeFilters` + `onClearAll` render the "Filtered by" row attached to the
 * bottom of the same card, under a rule — it reports on the controls above it,
 * so it belongs to them rather than floating as a third block on the page.
 *
 * A filter marked `secondary` hides behind **More filters**. Six controls
 * wrapped to three rows and put the ones you reach for first — who, and which
 * class — at the end of the queue; the shipped tabs lead with those, so those
 * stay out and the rest fold away. A secondary filter that's set keeps the
 * group open, so nothing you've narrowed to can be hidden from you.
 */
export function SessionsFilters({ filters, listBy, onListBy, activeFilters = [], onClearAll }) {
  const primary = filters.filter((f) => !f.secondary)
  const secondary = filters.filter((f) => f.secondary)
  const setCount = secondary.filter((f) => f.value !== f.options[0][0]).length
  const [open, setOpen] = useState(false)
  const showSecondary = open || setCount > 0

  const control = ({ key, label, value, onChange, options }) => (
    <FilterItem key={key} label={label}>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </Select>
    </FilterItem>
  )

  return (
    <div className="sfr-filters">
      <FilterBar
        compact
        action={
          onListBy && (
            <div className="sfr-listby">
              <span className="sfr-listby-label">List by:</span>
              <Select
                value={listBy}
                onChange={(e) => onListBy(e.target.value)}
                aria-label="List by"
              >
                {Object.entries(LIST_BY).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>
          )
        }
      >
        {primary.map(control)}
        {showSecondary && secondary.map(control)}
        {secondary.length > 0 && setCount === 0 && (
          <button type="button" className="sfr-more" onClick={() => setOpen((v) => !v)}>
            {open ? 'Fewer filters' : 'More filters'}
            <Icon name={open ? 'chevron-up' : 'chevron-down'} size={13} stroke={2.4} />
          </button>
        )}
      </FilterBar>

      {activeFilters.length > 0 && (
        <div className="sfr-active">
          <ActiveFilters filters={activeFilters} onClearAll={onClearAll} />
        </div>
      )}
    </div>
  )
}
