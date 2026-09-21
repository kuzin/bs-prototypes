import { friendColor, friendColorKey } from '../../friendColor'
import './FriendAvatar.css'

/**
 * `friendsAndLeaderboards/components/FriendAvatar.jsx` — and NOT [[ProfileRow]]'s avatar.
 *
 * The difference is the point of it. ProfileRow paints every reader the same `redLight` disc with
 * `orangeDark` initials, because it is showing YOUR readers and they are distinguished by name.
 * A friends list and a leaderboard are full of strangers, so each one gets a colour derived from
 * their name — see `friendColor` — and it is the same colour wherever they appear.
 *
 * The two states are also different sizes, which is easy to miss: the initials disc is 46 and a
 * photo is 40. A row of friends where some have pictures is deliberately not a straight line of
 * equal circles.
 */
export function FriendAvatar({ id, firstName = '', lastName = '', imgURL, initials, size }) {
  const color = friendColor(friendColorKey({ id, firstName, lastName }))
  const letters = initials ?? `${firstName.charAt(0)}${lastName.charAt(0)}`

  if (imgURL) {
    return (
      <img
        className="m-fav-photo"
        src={imgURL}
        alt=""
        style={size ? { width: size, height: size } : undefined}
      />
    )
  }

  return (
    <span
      className="m-fav"
      style={{
        background: color.background,
        color: color.text,
        ...(size ? { width: size, height: size } : null),
      }}
    >
      {letters.toUpperCase()}
    </span>
  )
}
