import { Header, FriendAvatar, PressableButton, EmptyStateView } from '@mobile/components'
import './FriendRequests.css'

/**
 * `FriendRequestList` + `FriendRequest` — behind the notification card on the Friends tab.
 *
 * Each row is a name and two answers. Accept is the filled button and Decline is plain text, so
 * the pair reads as a choice with a default rather than as two equal buttons — and declining
 * somebody should not be as easy to hit as accepting them.
 *
 * The rows use the same per-friend colour as everywhere else, which is the point of deriving it
 * from a name: you recognise the person before you read the row.
 */
export function FriendRequests({ requests = [], onAccept, onDecline, onBack }) {
  return (
    <div className="m-frq">
      <Header variant="stack" title="Friend Requests" onBack={onBack} />

      <div className="m-frq-scroll">
        {requests.length === 0 ? (
          <EmptyStateView source="no_friends" boldText="No friend requests right now." />
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
