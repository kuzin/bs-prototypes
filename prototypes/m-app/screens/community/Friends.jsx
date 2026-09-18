import { Img, FriendAvatar, EmptyStateView, StreakFire, PressableButton } from '@mobile/components'
import './community.css'
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
  displayLeaderboards = true,
  showNewNotice = true,
  onDismissNotice,
  onOpenFriend,
  onOptions,
  onAddFriend,
  onReviewRequests,
}) {
  const addOrInvite = serviceType === 'Library' ? 'Add Friend' : 'Invite Friend'
  const confirmed = friends.filter((f) => f.confirmed).length

  /* `EmptyFriendList` — its copy is built from the same add/invite fork, and it carries the
     button rather than leaving you to find the header that is not there.

     `AddFriendsNotification` sits ABOVE it and is dismissible: a one-time "NEW!" announcing the
     feature, not a description of the empty state. Its copy changes with `displayLeaderboards`,
     because on a site without them the only reason to add a friend is to see what they read. */
  if (friends.length === 0) {
    return (
      <div className="m-fr-empty">
        {showNewNotice && (
          <div className="m-fr-notice">
            <p className="m-fr-notice-text">
              {displayLeaderboards
                ? 'NEW! Add your friends and compete in leaderboards.'
                : 'NEW! Add your friends.'}
            </p>
            <button
              type="button"
              className="m-fr-notice-close"
              aria-label="Dismiss"
              onClick={onDismissNotice}
            >
              <Img name="close" className="m-fr-notice-icon" />
            </button>
          </div>
        )}
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

      {/* The same label every section on this tab uses: title left, action right. */}
      <header className="m-comm-label m-fr-head">
        <h2 className="m-comm-label-text">
          {confirmed} {confirmed === 1 ? 'Friend' : 'Friends'}
        </h2>
        <button type="button" className="m-fr-add" onClick={onAddFriend}>
          {addOrInvite}
        </button>
      </header>

      {friends.map((f) => (
        <Friend key={f.id} friend={f} onOpen={onOpenFriend} onOptions={onOptions} />
      ))}
    </div>
  )
}
