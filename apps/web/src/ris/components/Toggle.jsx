import './Toggle.css'

/**
 * iOS-style switch with optional label.
 *
 * <Toggle checked={value} onChange={setValue}>Show icon</Toggle>
 * <Toggle checked={value} onChange={setValue} size="sm" />
 *
 * sizes: sm | md
 */
export function Toggle({ checked, onChange, disabled, size = 'md', children, name, className = '' }) {
  return (
    <label className={`tgl tgl--${size}${disabled ? ' tgl--disabled' : ''} ${className}`.trim()}>
      <input
        type="checkbox"
        className="tgl-input"
        name={name}
        checked={!!checked}
        disabled={disabled}
        onChange={e => onChange?.(e.target.checked)}
      />
      <span className="tgl-track" aria-hidden="true">
        <span className="tgl-thumb" />
      </span>
      {children && <span className="tgl-label">{children}</span>}
    </label>
  )
}
