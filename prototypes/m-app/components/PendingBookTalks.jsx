import { Img } from '@mobile/components'
import './PendingBookTalks.css'

/**
 * `components/bookTalks/components/pendingBookTalksConversation`.
 *
 * A 52pt pale-yellow strip at the very top of Home. It renders only when there is at least one
 * in-progress Benny chat, and it is double-gated behind `bookTalksEnabled` and
 * `grade_level_id >= 6` — so most readers never see it at all.
 */
export function PendingBookTalks({ count, onPress }) {
  return (
    <button type="button" className="m-pbt" onClick={onPress}>
      <span className="m-pbt-left">
        <Img name="bennySunglasses" size={28} />
        <span className="m-pbt-text">{count} Book Talks Waiting</span>
      </span>
      {/* Tinted. `swipe_right_arrow` ships WHITE, which on colonialWhite is a chevron you can
          only find by knowing it is there. greyDark2 is what the label beside it uses. */}
      <Img name="swipe_right_arrow" size={16} tint="var(--m-grey-dark-2)" />
    </button>
  )
}
