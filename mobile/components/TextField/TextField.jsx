import { useId, useState } from 'react'
import './TextField.css'

/**
 * `src/components/FloatingTextField.tsx` — the app's one text input, and the reason every form in
 * it looks the same.
 *
 * The label starts inside the box as placeholder-weight grey, and on focus (or as soon as there
 * is a value) it rises to sit ON the border: 16/500 grey at rest, 12/bold black once raised, with
 * a white ground and 4pt of side padding so it notches the stroke rather than crossing it. That
 * notch is the whole idiom — a label floating in clear air over a 2pt border reads as a mistake.
 *
 * The box is 56 tall (48 `small`) at radius 10, and its border is the tenant's colour while
 * focused and `gainsboroWhite` otherwise. `borderCheck` overrides the focused colour, which is
 * how a form in an error state keeps its own stroke.
 */
export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  inputMode,
  placeholder,
  small = false,
  accent,
  className = '',
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const id = useId()

  // Raised when there is something to get out of the way of — focus, or a value.
  const raised = focused || (value != null && value !== '')

  return (
    <div
      className={`m-tf${small ? ' m-tf--small' : ''}${focused ? ' is-focused' : ''}${raised ? ' is-raised' : ''} ${className}`.trim()}
      style={accent && focused ? { borderColor: accent } : undefined}
    >
      <label className="m-tf-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="m-tf-input"
        type={type}
        inputMode={inputMode}
        value={value ?? ''}
        placeholder={raised ? placeholder : ''}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
    </div>
  )
}
