import { createContext, useContext } from 'react'
import '@components/Toggle/Toggle.css'

// A ToggleGroup hands its size down so a set of switches can't drift apart one
// call site at a time. `undefined` means "no group" and Toggle keeps its own
// default.
const ToggleGroupContext = createContext({})

/**
 * iOS-style switch with optional label.
 *
 * <Toggle checked={value} onChange={setValue}>Show icon</Toggle>
 * <Toggle checked={value} onChange={setValue} size="sm" />
 *
 * sizes: sm | md | lg
 */
export function Toggle({ checked, onChange, disabled, size, children, name, className = '' }) {
  const ctx = useContext(ToggleGroupContext)
  const resolved = size ?? ctx.size ?? 'md'
  return (
    <label
      className={`tgl tgl--${resolved}${disabled ? ' tgl--disabled' : ''} ${className}`.trim()}
    >
      <input
        type="checkbox"
        className="tgl-input"
        name={name}
        checked={!!checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="tgl-track" aria-hidden="true">
        <span className="tgl-thumb" />
      </span>
      {children && <span className="tgl-label">{children}</span>}
    </label>
  )
}

/**
 * A set of related switches — the Toggle sibling of RadioGroup / CheckboxGroup.
 * It owns the layout and the shared size; the switches stay plain `<Toggle>`s.
 *
 * Three prototypes had each hand-rolled this (`cc-method-toggles`,
 * `gb-inline-toggles`, `gr-log-toggles`…) and had drifted to different gaps.
 *
 *   <ToggleGroup layout="row">
 *     <Toggle checked={a} onChange={setA}>Logging badges</Toggle>
 *     <Toggle checked={b} onChange={setB}>Review badges</Toggle>
 *   </ToggleGroup>
 *
 * Pass `value` + `onChange` to let the group own the set instead, in which case
 * the children are `<ToggleGroupItem value="…">` and `value` is the array of
 * keys that are on — the same shape CheckboxGroup uses.
 *
 * layout: column | row | grid    ·    `inset` frames the group as a nested card
 */
export function ToggleGroup({
  value,
  onChange,
  size = 'md',
  layout = 'column',
  inset = false,
  children,
  className = '',
}) {
  const cls = ['tglg', `tglg--${layout}`, inset && 'tglg--inset', className]
    .filter(Boolean)
    .join(' ')
  return (
    <ToggleGroupContext.Provider value={{ value, onChange, size }}>
      <div className={cls}>{children}</div>
    </ToggleGroupContext.Provider>
  )
}

export function ToggleGroupItem({ value, disabled, children, className = '' }) {
  const ctx = useContext(ToggleGroupContext)
  const list = Array.isArray(ctx.value) ? ctx.value : []
  const checked = list.includes(value)
  return (
    <Toggle
      checked={checked}
      disabled={disabled}
      className={className}
      onChange={(on) => ctx.onChange?.(on ? [...list, value] : list.filter((v) => v !== value))}
    >
      {children}
    </Toggle>
  )
}
