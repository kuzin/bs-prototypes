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
 *
 * `children` puts something OTHER than a text input in the box — a select, a date button. What is
 * shared is the box and the notched label, not the input, and a picker that has to redraw both to
 * sit beside a text field is how a form starts drifting. Focus is tracked on the wrapper, so a
 * child participates without knowing about any of this.
 *
 * `alwaysRaised` is for those children: a select showing "Select One" and a date showing
 * `YYYY-MM-DD` are already occupying the box, so the label has to be out of the way before it is
 * focused or filled.
 */
export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  inputMode,
  placeholder,
  small = false,
  alwaysRaised = false,
  accent,
  className = '',
  children,
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const id = useId()

  // Raised when there is something to get out of the way of — focus, or a value.
  const raised = alwaysRaised || focused || (value != null && value !== '')

  return (
    <div
      className={`m-tf${small ? ' m-tf--small' : ''}${focused ? ' is-focused' : ''}${raised ? ' is-raised' : ''} ${className}`.trim()}
      style={accent && focused ? { borderColor: accent } : undefined}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <label className="m-tf-label" htmlFor={id}>
        {label}
      </label>
      {children ?? (
        <input
          id={id}
          className="m-tf-input"
          type={type}
          inputMode={inputMode}
          value={value ?? ''}
          placeholder={raised ? placeholder : ''}
          onChange={(e) => onChange?.(e.target.value)}
          {...rest}
        />
      )}
    </div>
  )
}
