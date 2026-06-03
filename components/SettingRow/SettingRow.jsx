import './SettingRow.css'
import { Toggle } from '@components/Toggle/Toggle'

/**
 * A labeled settings row: text (label + optional sub-description) on the left,
 * a control on the right. The right side defaults to a <Toggle> (the common
 * case) but you can pass any `control` (a select, button, badge…). An optional
 * `state` string renders before the default toggle (e.g. "Disabled").
 *
 *   <SettingList>
 *     <SettingRow label="On Title Completions" state="Disabled" checked={on} onChange={setOn} />
 *     <SettingRow label="Featured" sub="Pin to the top of the list" checked={f} onChange={setF} />
 *     <SettingRow label="Audience" control={<CustomSelect …/>} />
 *   </SettingList>
 *
 * Wrap rows in <SettingList> to get the hairline dividers between them.
 */
export function SettingRow({
  label,
  sub,
  control,
  state,
  checked,
  onChange,
  disabled = false,
  size = 'md',
}) {
  const right = control ?? (
    <>
      {state != null && <span className="setting-row-state">{state}</span>}
      <Toggle checked={checked} onChange={onChange} size={size} disabled={disabled} />
    </>
  )
  return (
    <div className={`setting-row${disabled ? ' is-disabled' : ''}`}>
      <div className="setting-row-text">
        <span className="setting-row-label">{label}</span>
        {sub && <span className="setting-row-sub">{sub}</span>}
      </div>
      <div className="setting-row-control">{right}</div>
    </div>
  )
}

/** Container that draws hairline dividers between the SettingRows inside it. */
export function SettingList({ children, className = '' }) {
  return <div className={`setting-list ${className}`.trim()}>{children}</div>
}
