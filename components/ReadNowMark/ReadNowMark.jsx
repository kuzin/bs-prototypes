import { Icon } from '@components/Icon/Icon'
import '@components/ReadNowMark/ReadNowMark.css'

/**
 * The mark on a jacket that opens right now — a play button in the colour of
 * the app that opens it. It was a plain coloured dot, which said "something
 * about this one" without saying what; a play glyph is the thing a reader
 * already knows means "tap and it starts".
 *
 * <ReadNowMark color="#0CA7BC" title="Read it now on Comics Plus" />
 *
 * Sits in the cover's top-left corner (the bookmark owns the top-right, the
 * rating the bottom-left). The host places the cover `position: relative`.
 */
export function ReadNowMark({ color, title, className = '' }) {
  return (
    <span
      className={`rnm ${className}`.trim()}
      title={title}
      role="img"
      aria-label={title}
      style={color ? { '--now': color } : undefined}
    >
      <Icon name="play-filled" size={11} />
    </span>
  )
}
