import '@components/FilterBar/FilterBar.css'

/**
 * FilterBar — a row of controls with an optional action button on the right.
 *
 * Two shapes, because the app has two:
 *
 * **Default** is the app's filter *form* (`.daily-reading__filters` holding a
 * `.filter-row`): labelled controls on a white card, the kind you fill in and
 * then submit. Use it when the controls need naming — a date range, a goal, a
 * log type.
 *
 * **`compact`** is the app's filter *bar* (`.filter-bar` / `.filters` plus the
 * `.ms-parent.filter` control override): a white strip of grey pill controls
 * with no labels above them, because each control already says what it filters
 * ("All Challenges", "All years"). Use it above a list — it reads as a filter
 * rather than a form, and it costs one row instead of two.
 *
 *   <FilterBar compact action={<Button>Update</Button>}>
 *     <FilterItem label="Challenge">
 *       <Select value={v} onChange={…}> … </Select>
 *     </FilterItem>
 *   </FilterBar>
 *
 * In compact mode the `label` stays in the DOM as the control's accessible
 * name but isn't drawn.
 *
 * There is deliberately no result count and no Clear: the controls already say
 * what they're set to, and a bar that reports on itself as well is one more
 * thing to read on the way to the list.
 *
 * @param {boolean}  compact  the bar shape rather than the form shape
 * @param {node}     action   the trailing button
 */

export function FilterBar({ children, action, compact = false, className = '' }) {
  return (
    <div className={`fltr ${compact ? 'fltr--compact ' : ''}${className}`.trim()}>
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
