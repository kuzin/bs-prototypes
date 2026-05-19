import { createContext, useContext, useId } from 'react'
import './Form.css'

/**
 * Form primitives. Designed to compose with Field for labels + help text.
 *
 * <Field label="School name" help="Shown on every dashboard.">
 *   <Input value={x} onChange={e => setX(e.target.value)} placeholder="Lincoln Elementary" />
 * </Field>
 *
 * <Field label="Variant" error="Required field">
 *   <Select value={x} onChange={e => setX(e.target.value)}>
 *     <option value="primary">Primary</option>
 *     <option value="secondary">Secondary</option>
 *   </Select>
 * </Field>
 *
 * <Checkbox checked={x} onChange={setX}>I agree</Checkbox>
 *
 * <RadioGroup name="size" value={x} onChange={setX}>
 *   <Radio value="sm">Small</Radio>
 *   <Radio value="md">Medium</Radio>
 * </RadioGroup>
 */

// ── Field wrapper ────────────────────────────────────────────────────────
const FieldContext = createContext(null)

export function Field({ label, help, error, hint, htmlFor, children, layout = 'column', className = '' }) {
  const id = useId()
  const controlId = htmlFor || id
  return (
    <FieldContext.Provider value={{ id: controlId, hasError: !!error }}>
      <div className={`fld fld--${layout} ${error ? 'fld--has-error' : ''} ${className}`.trim()}>
        {label && (
          <label className="fld-label" htmlFor={controlId}>
            {label}
            {hint && <span className="fld-hint"> · {hint}</span>}
          </label>
        )}
        <div className="fld-control">{children}</div>
        {error
          ? <div className="fld-error">{error}</div>
          : help && <div className="fld-help">{help}</div>
        }
      </div>
    </FieldContext.Provider>
  )
}

function useFieldProps() {
  return useContext(FieldContext) || { id: undefined, hasError: false }
}

// ── Input ────────────────────────────────────────────────────────────────
export function Input({ size = 'md', icon, iconRight, className = '', ...rest }) {
  const { id, hasError } = useFieldProps()
  if (!icon && !iconRight) {
    return (
      <input
        id={rest.id || id}
        className={`inp inp--${size}${hasError ? ' inp--error' : ''} ${className}`.trim()}
        {...rest}
      />
    )
  }
  return (
    <div className={`inp-wrap inp-wrap--${size}${hasError ? ' inp-wrap--error' : ''} ${className}`.trim()}>
      {icon && <span className="inp-icon inp-icon--left">{icon}</span>}
      <input
        id={rest.id || id}
        className="inp inp--bare"
        {...rest}
      />
      {iconRight && <span className="inp-icon inp-icon--right">{iconRight}</span>}
    </div>
  )
}

// ── Select ───────────────────────────────────────────────────────────────
export function Select({ size = 'md', children, className = '', ...rest }) {
  const { id, hasError } = useFieldProps()
  return (
    <div className={`sel-wrap sel-wrap--${size}${hasError ? ' sel-wrap--error' : ''} ${className}`.trim()}>
      <select
        id={rest.id || id}
        className="sel"
        {...rest}
      >
        {children}
      </select>
      <svg className="sel-caret" viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="4,6 8,10 12,6" />
      </svg>
    </div>
  )
}

// ── Textarea ─────────────────────────────────────────────────────────────
export function Textarea({ size = 'md', className = '', ...rest }) {
  const { id, hasError } = useFieldProps()
  return (
    <textarea
      id={rest.id || id}
      className={`txt txt--${size}${hasError ? ' txt--error' : ''} ${className}`.trim()}
      {...rest}
    />
  )
}

// ── Checkbox ─────────────────────────────────────────────────────────────
export function Checkbox({ checked, onChange, disabled, children, className = '' }) {
  return (
    <label className={`chk${disabled ? ' chk--disabled' : ''} ${className}`.trim()}>
      <input
        type="checkbox"
        className="chk-input"
        checked={!!checked}
        disabled={disabled}
        onChange={e => onChange?.(e.target.checked)}
      />
      <span className="chk-box" aria-hidden="true">
        <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2,6 5,9 10,3" />
        </svg>
      </span>
      {children && <span className="chk-label">{children}</span>}
    </label>
  )
}

// ── Radio group ──────────────────────────────────────────────────────────
const RadioContext = createContext({ name: '', value: undefined, onChange: () => {} })

export function RadioGroup({ name, value, onChange, layout = 'row', children, className = '' }) {
  return (
    <RadioContext.Provider value={{ name, value, onChange }}>
      <div className={`rdg rdg--${layout} ${className}`.trim()} role="radiogroup">
        {children}
      </div>
    </RadioContext.Provider>
  )
}

export function Radio({ value, disabled, children, className = '' }) {
  const ctx = useContext(RadioContext)
  return (
    <label className={`rdo${disabled ? ' rdo--disabled' : ''} ${className}`.trim()}>
      <input
        type="radio"
        className="rdo-input"
        name={ctx.name}
        checked={ctx.value === value}
        disabled={disabled}
        onChange={() => ctx.onChange?.(value)}
      />
      <span className="rdo-box" aria-hidden="true" />
      {children && <span className="rdo-label">{children}</span>}
    </label>
  )
}
