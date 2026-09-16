import './ProfileRow.css'

/**
 * `src/components/ProfileRow.tsx` — the avatar, and the workhorse of every reader-facing list.
 *
 * The initials fallback is not a generic grey circle: the app paints it `brandColors.redLight`
 * with `orangeDark` text, which is distinctive enough that getting it wrong reads as a different
 * product.
 *
 * `showOnlyInitials` is the app's own prop, not a size of ours: it swaps to `initialsContainer`
 * (40pt, against the 32 of the default `emptyBarContent`) and recolours the text to
 * `colors.secondary` rather than orangeDark. The review row is the caller that uses it.
 */
const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

export function ProfileRow({
  name,
  imgURL,
  size = 'medium',
  showName = false,
  showOnlyInitials = false,
  linked = false,
  onPress,
  className = '',
}) {
  const As = onPress ? 'button' : 'div'
  return (
    <As
      className={`m-profile m-profile-${size}${showOnlyInitials ? ' m-profile-initials-only' : ''} ${className}`}
      onClick={onPress}
      {...(onPress ? { type: 'button' } : null)}
    >
      <span className="m-profile-avatar">
        {imgURL ? <img src={imgURL} alt="" /> : <span>{initialsOf(name)}</span>}
        {linked && (
          <span className="m-profile-link" aria-label="Linked reader">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6.5 9.5a3 3 0 0 0 4.2 0l2-2a3 3 0 0 0-4.2-4.2l-.6.6M9.5 6.5a3 3 0 0 0-4.2 0l-2 2a3 3 0 0 0 4.2 4.2l.6-.6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </span>
      {showName && <span className="m-t-body-smaller m-profile-name">{name}</span>}
    </As>
  )
}
