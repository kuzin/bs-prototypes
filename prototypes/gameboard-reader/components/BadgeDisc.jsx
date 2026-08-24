import { Icon } from '@components/Icon/Icon'

/**
 * One badge on the reader's board.
 *
 * Earned badges wear their color with the soft horizontal banding the Figma
 * badge art uses; locked ones drop to the board's tan so the path still reads
 * as a route but the reward stays hidden. The number is the space, not the
 * badge name — the name lives in the tooltip and the unlock modal.
 */
export function BadgeDisc({ space, earned, size = 'md' }) {
  const { num, kind, name } = space
  const label = earned ? name : `${name} — locked`

  return (
    <span
      className={`gr-disc gr-disc--${size}${earned ? ' is-earned' : ''}`}
      style={earned ? { '--badge': space.color } : undefined}
      role="img"
      aria-label={label}
    >
      <span className="gr-disc-stripes" aria-hidden="true" />
      {kind === 'start' && <span className="gr-disc-word">REGISTERED</span>}
      {kind === 'finish' && <span className="gr-disc-word">COMPLETED</span>}
      {num != null && <span className="gr-disc-num">{num}</span>}
      <span className="gr-disc-glyph" aria-hidden="true">
        {kind === 'finish' ? (
          <Icon name="trophy" size={16} stroke={2} />
        ) : (
          <BookGlyph muted={!earned} />
        )}
      </span>
    </span>
  )
}

// The little stack-of-books mark the Figma badges carry. Drawn rather than
// pulled from the icon set because it's badge art, not a UI glyph — two colored
// spines on a shelf, greyed down to the board tan when the badge is locked.
function BookGlyph({ muted }) {
  const a = muted ? '#B79A76' : '#7C5CFA'
  const b = muted ? '#C9AE8C' : '#E8456B'
  const shelf = muted ? '#EADFCB' : '#FFFFFF'
  return (
    <svg viewBox="0 0 24 16" width="100%" height="100%" aria-hidden="true">
      <rect x="4" y="2" width="4" height="9" rx="1" fill={a} />
      <rect x="9" y="4" width="4" height="7" rx="1" fill={b} />
      <rect x="1" y="10" width="22" height="3" rx="1.5" fill={shelf} />
      <rect x="16" y="5" width="3" height="6" rx="1" fill={shelf} />
    </svg>
  )
}
