import { Header, FriendAvatar, PressableButton, EmptyStateView } from '@mobile/components'
import './FriendRequests.css'

/**
 * `FriendRequestList` + `FriendRequest` — behind the notification card on the Friends tab.
 *
 * Each row is a name and two answers. Accept is the filled button in the tenant colour, which is
 * the app's.
 *
 * DIVERGENCE — the app declines with a bare × glyph beside that button (`images.clear_icon`).
 * Here it is the word. An unlabelled × next to a labelled Accept does not read as the other half
 * of a pair; it reads as "dismiss this row", which is a different and much less consequential
 * promise than refusing somebody. Keeping it as text also lets the two answers sit at obviously
 * different weights — filled against plain — so declining is still not as easy to hit as
 * accepting.
 *
 * The rows use the same per-friend colour as everywhere else, which is the point of deriving it
 * from a name: you recognise the person before you read the row.
 */
export function FriendRequests({ requests = [], onAccept, onDecline, onBack }) {
  return (
    <div className="m-frq">
      <Header variant="stack" title="Friend Requests" onBack={onBack} />

      <div className="m-frq-scroll">
        {/* `EmptyFriendRequestList` — the sad cat, not the two-friends artwork. Its copy is the
            app's, verbatim: an empty request list is a normal resting state, so it states the
            fact twice rather than suggesting anything. */}
        {requests.length === 0 ? (
          <EmptyStateView
            source="recent_titles_empty_state"
            boldText="No New Requests"
            middleText="You don't have any new friend requests."
          />
        ) : (
          requests.map((r) => (
            <div key={r.id} className="m-frq-row">
              <FriendAvatar id={r.id} firstName={r.firstName} lastName={r.lastName} />
              <span className="m-frq-name">
                {r.firstName} {r.lastName}
              </span>
              <span className="m-frq-actions">
                <PressableButton
                  size="small"
                  buttonText="Accept"
                  onButtonPress={() => onAccept?.(r)}
                />
                <button type="button" className="m-frq-decline" onClick={() => onDecline?.(r)}>
                  Decline
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
