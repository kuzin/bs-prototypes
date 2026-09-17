import './ToggleSwitch.css'

/**
 * `readingLogging/components/CustomToggleSwitch.tsx` — the app's switch.
 *
 * Three sizes, and the medium one is the default everywhere it appears: a 60pt track at radius 16
 * carrying a 24pt white knob that travels 32. On is `jadeGreen`, off is `lightGray` — a green
 * that is the app's own rather than the tenant accent, so a switch reads the same on every
 * microsite.
 *
 * `announcementLabel` is the app's: the control announces itself with its state appended, because
 * a switch that only says its name tells a screen reader nothing about which way it is set.
 */
const SIZES = {
  small: { width: 50, knob: 15, travel: 22 },
  medium: { width: 60, knob: 24, travel: 32 },
  large: { width: 100, knob: 30, travel: 38 },
}

export function ToggleSwitch({ isOn = false, onToggle, announcementLabel, size = 'medium' }) {
  const d = SIZES[size] ?? SIZES.medium

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={announcementLabel && `${announcementLabel} ${isOn ? 'on.' : 'off.'}`}
      className={`m-tgl m-tgl--${size}${isOn ? ' is-on' : ''}`}
      style={{
        '--m-tgl-w': `${d.width}px`,
        '--m-tgl-knob': `${d.knob}px`,
        '--m-tgl-x': `${d.width - d.travel}px`,
      }}
      onClick={onToggle}
    >
      <span className="m-tgl-knob" />
    </button>
  )
}
