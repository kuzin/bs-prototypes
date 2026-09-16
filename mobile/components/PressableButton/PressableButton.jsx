import './PressableButton.css'

/**
 * `src/components/shared/PressableButton.tsx` — the modern button, and the one to design against.
 *
 * The app has three parallel button components (GeneralButton is legacy with 52 importers,
 * SmallButton is a third shape). Mirroring all three would carry that debt into the design system,
 * so this is PressableButton only; if a screen needs one of the others, that is worth a
 * conversation with engineering rather than a silent third variant here.
 *
 * `primary` fills with the tenant accent, which is why the colour is never hardcoded.
 */
export function PressableButton({
  buttonText,
  onButtonPress,
  size = 'large',
  type = 'primary',
  fullWidth = false,
  disabled = false,
  icon,
  iconLocation = 'left',
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type="button"
      className={`m-btn m-btn-${size} m-btn-${type}${fullWidth ? ' is-full' : ''} ${className}`}
      onClick={onButtonPress}
      disabled={disabled}
      {...rest}
    >
      {icon && iconLocation === 'left' && <span className="m-btn-icon">{icon}</span>}
      <span className="m-btn-label">{buttonText ?? children}</span>
      {icon && iconLocation === 'right' && <span className="m-btn-icon">{icon}</span>}
    </button>
  )
}
