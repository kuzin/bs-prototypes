import { createContext, useContext, useId, useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FieldContext, useFieldProps } from '@components/FormContext/FormContext'
import { Icon } from '@components/Icon/Icon'
import '@components/Form/Form.css'

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
export function Field({
  label,
  help,
  error,
  hint,
  htmlFor,
  children,
  layout = 'column',
  className = '',
  required = false,
}) {
  const id = useId()
  const controlId = htmlFor || id
  return (
    <FieldContext.Provider value={{ id: controlId, hasError: !!error, required }}>
      <div className={`fld fld--${layout} ${error ? 'fld--has-error' : ''} ${className}`.trim()}>
        {label && (
          <label className="fld-label" htmlFor={controlId}>
            {label}
            {required && (
              <span className="fld-req" title="Required">
                {' '}
                *
              </span>
            )}
            {hint && <span className="fld-hint"> · {hint}</span>}
          </label>
        )}
        <div className="fld-control">{children}</div>
        {error ? (
          <div className="fld-error">{error}</div>
        ) : (
          help && <div className="fld-help">{help}</div>
        )}
      </div>
    </FieldContext.Provider>
  )
}

// ── Input ────────────────────────────────────────────────────────────────
export function Input({ size = 'md', icon, iconRight, label, className = '', ...rest }) {
  const { id: fieldId, hasError, required } = useFieldProps()
  const selfId = useId()
  const inputId = rest.id || fieldId || selfId
  const ariaRequired = required || undefined

  const inputEl =
    !icon && !iconRight ? (
      <input
        id={inputId}
        aria-required={ariaRequired}
        className={`inp inp--${size}${hasError ? ' inp--error' : ''}${!label && className ? ` ${className}` : ''}`}
        {...rest}
      />
    ) : (
      <div
        className={`inp-wrap inp-wrap--${size}${hasError ? ' inp-wrap--error' : ''}${!label && className ? ` ${className}` : ''}`}
      >
        {icon && <span className="inp-icon inp-icon--left">{icon}</span>}
        <input id={inputId} aria-required={ariaRequired} className="inp inp--bare" {...rest} />
        {iconRight && <span className="inp-icon inp-icon--right">{iconRight}</span>}
      </div>
    )

  if (!label) return inputEl
  return (
    <div className={`frm-labeled${className ? ` ${className}` : ''}`}>
      <label className="frm-self-label" htmlFor={inputId}>
        {label}
      </label>
      {inputEl}
    </div>
  )
}

// ── Select ───────────────────────────────────────────────────────────────
export function Select({ size = 'md', label, children, className = '', ...rest }) {
  const { id: fieldId, hasError, required } = useFieldProps()
  const selfId = useId()
  const selectId = rest.id || fieldId || selfId

  const selectEl = (
    <div
      className={`sel-wrap sel-wrap--${size}${hasError ? ' sel-wrap--error' : ''}${!label && className ? ` ${className}` : ''}`}
    >
      <select id={selectId} aria-required={required || undefined} className="sel" {...rest}>
        {children}
      </select>
      <Icon name="chevron-down" size={15} stroke={2} className="sel-caret" />
    </div>
  )

  if (!label) return selectEl
  return (
    <div className={`frm-labeled${className ? ` ${className}` : ''}`}>
      <label className="frm-self-label" htmlFor={selectId}>
        {label}
      </label>
      {selectEl}
    </div>
  )
}

// ── Textarea ─────────────────────────────────────────────────────────────
export function Textarea({ size = 'md', label, className = '', ...rest }) {
  const { id: fieldId, hasError, required } = useFieldProps()
  const selfId = useId()
  const textareaId = rest.id || fieldId || selfId

  const textareaEl = (
    <textarea
      id={textareaId}
      aria-required={required || undefined}
      className={`txt txt--${size}${hasError ? ' txt--error' : ''}${!label && className ? ` ${className}` : ''}`}
      {...rest}
    />
  )

  if (!label) return textareaEl
  return (
    <div className={`frm-labeled${className ? ` ${className}` : ''}`}>
      <label className="frm-self-label" htmlFor={textareaId}>
        {label}
      </label>
      {textareaEl}
    </div>
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
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="chk-box" aria-hidden="true">
        <Icon name="check" size={12} stroke={2} />
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

// ── DateInput ────────────────────────────────────────────────────────────
export function DateInput({ size = 'md', type = 'date', label, className = '', ...rest }) {
  const { id: fieldId, hasError } = useFieldProps()
  const selfId = useId()
  const inputId = rest.id || fieldId || selfId

  // The native calendar indicator is hidden for a clean look, so open the
  // native picker on click anywhere in the field.
  const openPicker = (e) => {
    const input = e.currentTarget.querySelector('input')
    try {
      input?.showPicker?.()
    } catch {
      /* showPicker unavailable here — normal focus still works */
    }
  }
  const el = (
    <div
      className={`inp-wrap inp-wrap--${size} inp-wrap--clickable${hasError ? ' inp-wrap--error' : ''}${!label && className ? ` ${className}` : ''}`}
      onClick={openPicker}
    >
      <span className="inp-icon inp-icon--left">
        <Icon name="calendar" size={14} />
      </span>
      <input id={inputId} type={type} className="inp inp--bare inp--date" {...rest} />
    </div>
  )

  if (!label) return el
  return (
    <div className={`frm-labeled${className ? ` ${className}` : ''}`}>
      <label className="frm-self-label" htmlFor={inputId}>
        {label}
      </label>
      {el}
    </div>
  )
}

// ── TimeInput ────────────────────────────────────────────────────────────
export function TimeInput({ size = 'md', label, className = '', ...rest }) {
  const { id: fieldId, hasError } = useFieldProps()
  const selfId = useId()
  const inputId = rest.id || fieldId || selfId

  const el = (
    <div
      className={`inp-wrap inp-wrap--${size}${hasError ? ' inp-wrap--error' : ''}${!label && className ? ` ${className}` : ''}`}
    >
      <span className="inp-icon inp-icon--left">
        <Icon name="clock" size={14} />
      </span>
      <input id={inputId} type="time" className="inp inp--bare inp--time" {...rest} />
    </div>
  )

  if (!label) return el
  return (
    <div className={`frm-labeled${className ? ` ${className}` : ''}`}>
      <label className="frm-self-label" htmlFor={inputId}>
        {label}
      </label>
      {el}
    </div>
  )
}

// ── ColorInput ───────────────────────────────────────────────────────────
export function ColorInput({
  size = 'md',
  value = '#1D4ED8',
  onChange,
  label,
  className = '',
  ...rest
}) {
  const { id: fieldId } = useFieldProps()
  const selfId = useId()
  const inputId = rest.id || fieldId || selfId

  const el = (
    <div className={`cinp cinp--${size}${!label && className ? ` ${className}` : ''}`}>
      <input
        id={inputId}
        type="color"
        className="cinp-swatch"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        {...rest}
      />
      <span className="cinp-hex">{value}</span>
    </div>
  )

  if (!label) return el
  return (
    <div className={`frm-labeled${className ? ` ${className}` : ''}`}>
      <label className="frm-self-label" htmlFor={inputId}>
        {label}
      </label>
      {el}
    </div>
  )
}

// ── FileInput ────────────────────────────────────────────────────────────
export function FileInput({
  size = 'md',
  label,
  accept,
  multiple,
  placeholder = 'No file chosen',
  onChange,
  className = '',
  disabled = false,
}) {
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const { id: fieldId } = useFieldProps()
  const selfId = useId()
  const inputId = fieldId || selfId

  function handleChange(e) {
    const files = e.target.files
    if (files?.length) {
      setFileName(files.length === 1 ? files[0].name : `${files.length} files selected`)
    } else {
      setFileName('')
    }
    onChange?.(e)
  }

  const el = (
    <div
      className={`finp finp--${size}${disabled ? ' finp--disabled' : ''}${!label && className ? ` ${className}` : ''}`}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="finp-native"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
      />
      <button
        type="button"
        className="finp-btn"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        <Icon name="upload" size={12} />
        Choose file
      </button>
      <span className={`finp-name${!fileName ? ' finp-name--placeholder' : ''}`}>
        {fileName || placeholder}
      </span>
    </div>
  )

  if (!label) return el
  return (
    <div className={`frm-labeled${className ? ` ${className}` : ''}`}>
      <label className="frm-self-label" htmlFor={inputId}>
        {label}
      </label>
      {el}
    </div>
  )
}

// ── CheckboxGroup ────────────────────────────────────────────────────────
const CheckboxGroupContext = createContext({ value: [], onChange: () => {} })

export function CheckboxGroup({
  value = [],
  onChange,
  layout = 'column',
  children,
  className = '',
}) {
  return (
    <CheckboxGroupContext.Provider value={{ value, onChange }}>
      <div className={`chkg chkg--${layout} ${className}`.trim()}>{children}</div>
    </CheckboxGroupContext.Provider>
  )
}

export function CheckboxGroupItem({ value, disabled, children, className = '' }) {
  const ctx = useContext(CheckboxGroupContext)
  const checked = Array.isArray(ctx.value) && ctx.value.includes(value)
  function handleChange(on) {
    if (on) ctx.onChange?.([...ctx.value, value])
    else ctx.onChange?.(ctx.value.filter((v) => v !== value))
  }
  return (
    <Checkbox checked={checked} onChange={handleChange} disabled={disabled} className={className}>
      {children}
    </Checkbox>
  )
}

// ── MultiSelect ──────────────────────────────────────────────────────────
export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select…',
  size = 'md',
  label,
  className = '',
  disabled = false,
  emptyText = 'Nothing to choose yet',
  emptyHint,
}) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState(null)
  const wrapRef = useRef(null)
  const popRef = useRef(null)
  const { id: fieldId, hasError } = useFieldProps()
  const selfId = useId()
  const triggerId = fieldId || selfId

  // Measure the trigger so the portaled popup can be positioned under it.
  // The popup is portaled to <body>, so it also has to (a) inherit the trigger's
  // font (it leaves any scoped font context) and (b) flip up / clamp height so it
  // never falls off-screen.
  function place() {
    const node = wrapRef.current
    if (!node) return
    const r = node.getBoundingClientRect()
    const cs = getComputedStyle(node)
    const gap = 4
    const spaceBelow = window.innerHeight - r.bottom - gap
    const spaceAbove = r.top - gap
    const flipUp = spaceBelow < 200 && spaceAbove > spaceBelow
    const maxHeight = Math.max(120, Math.min(280, flipUp ? spaceAbove : spaceBelow))
    setCoords({
      left: r.left,
      width: r.width,
      fontFamily: cs.fontFamily,
      maxHeight,
      ...(flipUp ? { bottom: window.innerHeight - r.top + gap } : { top: r.bottom + gap }),
    })
  }

  useEffect(() => {
    if (!open) return
    function onDown(e) {
      if (wrapRef.current?.contains(e.target) || popRef.current?.contains(e.target)) return
      // A <label> bound to the trigger forwards its click to it — closing here
      // would let that forwarded click re-toggle the menu open. Let the trigger
      // handle it (it just closes) instead of double-firing.
      const lbl = e.target?.closest?.('label')
      if (lbl && lbl.getAttribute('for') === triggerId) return
      setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    // Reposition while open (popup is portaled to <body>, so it must track the trigger).
    place()
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  const displayText =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? (options.find((o) => o.value === value[0])?.label ?? value[0])
        : `${value.length} selected`
  // Selected options that carry an image — shown as avatars in the closed trigger.
  const selectedAvatars = value
    .map((v) => options.find((o) => o.value === v))
    .filter((o) => o && o.image)

  function toggle(v) {
    if (value.includes(v)) onChange?.(value.filter((x) => x !== v))
    else onChange?.([...value, v])
  }

  const el = (
    <div
      ref={wrapRef}
      className={`msel msel--${size}${hasError ? ' msel--error' : ''}${!label && className ? ` ${className}` : ''}`}
    >
      <button
        id={triggerId}
        type="button"
        className={`msel-trigger${open ? ' msel-trigger--open' : ''}`}
        onClick={() => {
          if (disabled) return
          if (!open) place()
          setOpen((v) => !v)
        }}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`msel-display${value.length === 0 ? ' msel-display--placeholder' : ''}`}>
          {selectedAvatars.length > 0 && (
            <span className="msel-display-avatars">
              {selectedAvatars.slice(0, 4).map((o) => (
                <span key={o.value} className="msel-display-av">
                  <img src={o.image} alt="" />
                </span>
              ))}
            </span>
          )}
          <span className="msel-display-text">{displayText}</span>
        </span>
        <Icon name="chevron-down" size={15} stroke={2} className="msel-caret" />
      </button>
      {open &&
        coords &&
        createPortal(
          <div
            ref={popRef}
            className="msel-pop msel-pop--portal"
            role="listbox"
            aria-multiselectable="true"
            style={{
              position: 'fixed',
              left: coords.left,
              width: coords.width,
              fontFamily: coords.fontFamily,
              maxHeight: coords.maxHeight,
              ...(coords.bottom != null ? { bottom: coords.bottom } : { top: coords.top }),
            }}
          >
            <div className="msel-pop-list">
              {options.length === 0 ? (
                <div className="msel-empty">
                  <Icon name="inbox" size={22} className="msel-empty-ic" />
                  <span className="msel-empty-text">{emptyText}</span>
                  {emptyHint && <span className="msel-empty-hint">{emptyHint}</span>}
                </div>
              ) : (
                options.map((opt) => (
                  <label
                    key={opt.value}
                    className={`msel-opt${opt.disabled ? ' msel-opt--disabled' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="chk-input"
                      checked={value.includes(opt.value)}
                      disabled={opt.disabled}
                      onChange={() => toggle(opt.value)}
                    />
                    <span className="chk-box" aria-hidden="true">
                      <Icon name="check" size={12} stroke={2} />
                    </span>
                    {opt.image !== undefined && (
                      <span className="msel-opt-art">
                        {opt.image ? <img src={opt.image} alt="" /> : null}
                      </span>
                    )}
                    <span className="msel-opt-label">{opt.label}</span>
                  </label>
                ))
              )}
            </div>
            <div className="msel-pop-foot">
              <button type="button" className="msel-done" onClick={() => setOpen(false)}>
                Done
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )

  if (!label) return el
  return (
    <div className={`frm-labeled${className ? ` ${className}` : ''}`}>
      <label className="frm-self-label" htmlFor={triggerId}>
        {label}
      </label>
      {el}
    </div>
  )
}

// ── NumberInput ──────────────────────────────────────────────────────────
export function NumberInput({
  size = 'md',
  min,
  max,
  step = 1,
  value = 0,
  onChange,
  label,
  className = '',
  ...rest
}) {
  const { id: fieldId, hasError } = useFieldProps()
  const selfId = useId()
  const inputId = rest.id || fieldId || selfId

  function adjust(delta) {
    const next = Number(value) + delta
    if (min !== undefined && next < min) return
    if (max !== undefined && next > max) return
    onChange?.(next)
  }

  const el = (
    <div
      className={`ninp ninp--${size}${hasError ? ' ninp--error' : ''}${!label && className ? ` ${className}` : ''}`}
    >
      <button
        type="button"
        className="ninp-btn"
        onClick={() => adjust(-step)}
        disabled={rest.disabled || (min !== undefined && Number(value) <= min)}
        aria-label="Decrease"
        tabIndex={-1}
      >
        <Icon name="minus" size={10} stroke={2.5} />
      </button>
      <input
        id={inputId}
        type="number"
        className="ninp-inp"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange?.(Number(e.target.value))}
        {...rest}
      />
      <button
        type="button"
        className="ninp-btn"
        onClick={() => adjust(step)}
        disabled={rest.disabled || (max !== undefined && Number(value) >= max)}
        aria-label="Increase"
        tabIndex={-1}
      >
        <Icon name="plus" size={10} stroke={2.5} />
      </button>
    </div>
  )

  if (!label) return el
  return (
    <div className={`frm-labeled${className ? ` ${className}` : ''}`}>
      <label className="frm-self-label" htmlFor={inputId}>
        {label}
      </label>
      {el}
    </div>
  )
}

// ── RangeSlider ──────────────────────────────────────────────────────────
export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value = 50,
  onChange,
  showValue = true,
  label,
  className = '',
}) {
  const pct = max > min ? ((Number(value) - min) / (max - min)) * 100 : 0

  const rangeEl = (
    <input
      type="range"
      className="rng-input"
      min={min}
      max={max}
      step={step}
      value={value}
      style={{ '--rng-pct': `${pct}%` }}
      onChange={(e) => onChange?.(Number(e.target.value))}
    />
  )

  if (!label) {
    return (
      <div className={`rng${className ? ` ${className}` : ''}`}>
        {rangeEl}
        {showValue && <span className="rng-value">{value}</span>}
      </div>
    )
  }
  return (
    <div className={`frm-labeled${className ? ` ${className}` : ''}`}>
      <div className="rng-header">
        <label className="frm-self-label">{label}</label>
        {showValue && <span className="rng-value">{value}</span>}
      </div>
      {rangeEl}
    </div>
  )
}
