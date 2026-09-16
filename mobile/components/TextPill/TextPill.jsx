import './TextPill.css'

/**
 * `src/components/shared/TextPill.tsx` — the status chip.
 *
 * The tones are fixed pairs in the app (TextPillStyles.js), each a `{X}Dark` foreground on an
 * `{X}Light` ground. They are not free-form colours, so they are enumerated rather than accepting
 * an arbitrary value.
 *
 * The default is GREEN: `getColors` tests red / grey / orange and falls through to green, so a
 * `<TextPill text=… />` with no colour is a green pill. AchievementDetailFullHeight relies on
 * that.
 */
export function TextPill({ text, tone = 'green', size = 'small', className = '', children }) {
  return (
    <span className={`m-pill m-pill-${size} m-pill-${tone} ${className}`}>{text ?? children}</span>
  )
}
