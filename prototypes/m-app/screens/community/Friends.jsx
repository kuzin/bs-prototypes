import { Img, FriendAvatar, EmptyStateView, StreakFire, PressableButton } from '@mobile/components'
import './Friends.css'

/**
 * `friendsAndLeaderboards/components/friends/friendsList/FriendsList.tsx`.
 *
 * A friend row carries a name, a streak and an options control — and NOT a minutes figure. That
 * is worth stating because a reading total is the obvious thing to put there and the app
 * deliberately does not: an unconfirmed friend has no readable activity at all, and the list has
 * to hold both kinds of row.
 *
 * The three states of a row follow from `confirmed`. A confirmed friend is tappable and opens
 * their page; an unconfirmed one is not, and says "Pending Invite" under the name instead. The
 * options dots are on both, because withdrawing an invite is the same action as removing a
 * friend.
 *
 * `addOrInviteText` forks on the site: a LIBRARY says "Add Friend" and opens a search modal,
 * anything else says "Invite Friend" and pushes a search screen. A library reader adds someone
 * who is already there; a school reader invites someone who may not be.
 *
 * The header only appears when there ARE friends — the empty state carries its own copy and its
 * own button, so a list of nobody does not also show a count of nobody.
 */
function Friend({ friend, onOpen, onOptions }) {
  const { firstName, lastName, streak, confirmed } = friend
  const Row = confirmed ? 'button' : 'div'

  return (
    <div className="m-fr-row">
      <Row
        {...(confirmed ? { type: 'button', onClick: () => onOpen?.(friend) } : null)}
        className="m-fr-press"
      >
        <span className="m-fr-name-area">
          <FriendAvatar id={friend.id} firstName={firstName} lastName={lastName} />
          <span className="m-fr-text">
            <span className="m-fr-name">{firstName}</span>
            {!confirmed && <span className="m-fr-pending">Pending Invite</span>}
          </span>
        </span>

        {/* `Streak` renders NOTHING when the streak is null — not a zero, not a dash. */}
        {streak != null && (
          <span className="m-fr-flame">
            <StreakFire width={12} height={18} />
            <span className="m-fr-streak">{streak}</span>
          </span>
        )}
      </Row>

      <button
        type="button"
        className="m-fr-dots"
        aria-label={`Options for ${firstName}`}
        onClick={() => onOptions?.(friend)}
      >
        <Img name="option_dots" className="m-fr-dots-img" />
      </button>
    </div>
  )
}

export function Friends({
  friends = [],
  requests = 0,
  serviceType = 'School',
  onOpenFriend,
  onOptions,
  onAddFriend,
  onReviewRequests,
}) {
  const addOrInvite = serviceType === 'Library' ? 'Add Friend' : 'Invite Friend'
  const confirmed = friends.filter((f) => f.confirmed).length

  /* `EmptyFriendList` — its copy is built from the same add/invite fork, and it carries the
     button rather than leaving you to find the header that is not there. */
  if (friends.length === 0) {
    return (
      <div className="m-fr-empty">
        <EmptyStateView
          source="no_friends"
          boldText={`${addOrInvite.split(' ')[0]} some friends to join you!`}
        />
        <PressableButton
          buttonText={`${addOrInvite.split(' ')[0]} Friends`}
          onButtonPress={onAddFriend}
        />
      </div>
    )
  }

  return (
    <div className="m-fr">
      {/* `FriendRequestNotificationCard` — plural-aware, and only when there are any. */}
      {requests > 0 && (
        <button type="button" className="m-fr-requests" onClick={onReviewRequests}>
          <span className="m-fr-requests-count">{requests}</span>
          <span className="m-fr-requests-text">
            {requests > 1 ? 'Friend Requests' : 'Friend Request'}
          </span>
          <Img name="disclosure_indicator" className="m-fr-requests-chevron" />
        </button>
      )}

      <div className="m-fr-head">
        <span className="m-fr-count">
          {confirmed} {confirmed === 1 ? 'Friend' : 'Friends'}
        </span>
        <button type="button" className="m-fr-add" onClick={onAddFriend}>
          {addOrInvite}
        </button>
      </div>

      {friends.map((f) => (
        <Friend key={f.id} friend={f} onOpen={onOpenFriend} onOptions={onOptions} />
      ))}
    </div>
  )
}
