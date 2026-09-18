import { useState } from 'react'
import { TopTabs, ActionsModal, SelectSheet, Alert, RefreshControl } from '@mobile/components'
import { Microsite } from './community/Microsite'
import { Friends } from './community/Friends'
import { Leaderboard } from './community/Leaderboard'
import {
  LEADERBOARDS,
  LEADERBOARD_SCOPES,
  LEADERBOARD_LOG_TYPES,
  COMMUNITY_GOAL,
  SPONSORS,
  EVENTS,
} from '../data'
import './Screens.css'

/**
 * The Community tab — `navigation/communityTab/CommunityTabNavigator.tsx`.
 *
 * The first tab's label is generated: `My ${Capitalize(clientServiceType)}` — so it reads "My
 * School" or "My Library" depending on the site, and the tab is hidden entirely for CORPORATE.
 * Leaderboard shows when `displayLeaderboards` is on OR the site is a SCHOOL.
 */
export const communityTabs = (serviceType = 'School') => [
  { id: 'microsite', label: `My ${serviceType}` },
  { id: 'friends', label: 'Friends' },
  { id: 'leaderboards', label: 'Leaderboard' },
]

export function CommunityScreen({
  tab,
  onTab,
  serviceType = 'School',
  flags = {},
  profileId,
  profileName,
  friends = [],
  requests = [],
  onRemoveFriend,
  onOpenEvent,
  onOpenFriend,
  onReviewRequests,
  onShareCode,
  onEnterCode,
  onFriendSearch,
}) {
  /* Every Community tab is conditional, and the three conditions are not the same shape:
     `microsite` is hidden only for CORPORATE, `friends` is a plain flag, and `leaderboards` is a
     flag OR a school — a school gets them whether or not the site turned them on. The navigator
     renders null when none qualify. */
  const tabs = communityTabs(serviceType).filter((t) =>
    t.id === 'leaderboards' ? flags.leaderboards || serviceType === 'School' : flags[t.id],
  )

  // The two screens BEHIND this tab — a friend's page and the request list — are not rendered
  // here. `friendDetail` is `presentation: 'modal'` and `friendRequestList` is a push on the
  // community stack, so both cover the tab bar and the root header; they are the frame's overlay,
  // and App owns them the way it owns every other pushed screen.
  const [optionsFor, setOptionsFor] = useState(null)
  const [confirmRemove, setConfirmRemove] = useState(null)
  const [addingFriend, setAddingFriend] = useState(false)
  const [noticeDismissed, setNoticeDismissed] = useState(false)
  // All three tabs pull to refresh in the app, each refetching its own query.
  const [refreshing, setRefreshing] = useState(false)
  const refresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  const confirmed = friends.filter((f) => f.confirmed)

  /* `showFriendSearchScreen` — a LIBRARY opens the code sheet, because it has no roster to look
     anyone up in. Everyone else pushes the search screen. Same button, two different problems. */
  const addFriend = () => (serviceType === 'Library' ? setAddingFriend(true) : onFriendSearch?.())

  return (
    <>
      <TopTabs tabs={tabs} active={tab} onChange={onTab} />
      {/* Keyed by tab so each one gets its OWN scroll container. A material top-tab navigator
          gives every tab a separate scene, so scrolling to the bottom of My School and switching
          to Leaderboard lands you at the top of a fresh list — sharing one scroller instead
          dropped you into the middle of the next tab. */}
      <RefreshControl className="m-scroll" key={tab} refreshing={refreshing} onRefresh={refresh}>
        {tab === 'microsite' && (
          <Microsite
            name="Lakeside Elementary Library"
            goal={COMMUNITY_GOAL}
            events={EVENTS}
            sponsors={SPONSORS}
            onOpenEvent={onOpenEvent}
          />
        )}
        {tab === 'friends' && (
          <Friends
            friends={friends}
            requests={requests.length}
            serviceType={serviceType}
            onOpenFriend={onOpenFriend}
            onOptions={setOptionsFor}
            onAddFriend={addFriend}
            onReviewRequests={onReviewRequests}
            displayLeaderboards={flags.leaderboards || serviceType === 'School'}
            showNewNotice={!noticeDismissed}
            onDismissNotice={() => setNoticeDismissed(true)}
          />
        )}
        {tab === 'leaderboards' && (
          <Leaderboard
            scopes={LEADERBOARD_SCOPES}
            logTypes={LEADERBOARD_LOG_TYPES}
            data={LEADERBOARDS}
            youId={profileId}
            youName={profileName}
            serviceType={serviceType}
            hasFriends={confirmed.length > 0}
            onlyUnconfirmed={friends.length > 0 && confirmed.length === 0}
            onAddFriend={addFriend}
          />
        )}
      </RefreshControl>

      {/* `RemoveFriendModal` is two steps on purpose: an options sheet, then a confirmation. The
          same pair withdraws an invite that has not been accepted.

          `ActionsModal` calls `onClose()` BEFORE the row's `onPress`, so reading `optionsFor`
          inside the handler gets null — the friend has already been cleared by the time the row
          fires. The target is captured into the closure instead. */}
      <ActionsModal
        open={Boolean(optionsFor)}
        title={optionsFor ? `${optionsFor.firstName} ${optionsFor.lastName}` : ''}
        onClose={() => setOptionsFor(null)}
        options={
          optionsFor
            ? [
                {
                  title: optionsFor.confirmed ? 'Remove Friend' : 'Withdraw Invite',
                  destructive: true,
                  onPress: () => setConfirmRemove(optionsFor),
                },
              ]
            : []
        }
      />

      <Alert
        open={Boolean(confirmRemove)}
        title={confirmRemove?.confirmed ? 'Remove Friend' : 'Withdraw Invite'}
        message={`Are you sure you would like to remove ${confirmRemove?.firstName ?? ''}?`}
        buttons={[
          { text: 'Cancel', style: 'cancel', onPress: () => setConfirmRemove(null) },
          {
            text: 'Remove',
            onPress: () => {
              onRemoveFriend?.(confirmRemove)
              setConfirmRemove(null)
            },
          },
        ]}
      />

      {/* `AddFriendsModal` — a LIBRARY reader gets this sheet, because adding someone at a public
          library means exchanging a code rather than searching a roster you are both on. A school
          reader gets a search screen instead. */}
      <SelectSheet
        open={addingFriend}
        items={[
          { id: 'share', label: 'Share Your Friend Code' },
          { id: 'enter', label: 'Enter a Friend Code' },
        ]}
        onSelect={(id) => {
          setAddingFriend(false)
          if (id === 'share') onShareCode?.()
          else onEnterCode?.()
        }}
        onClose={() => setAddingFriend(false)}
      />
    </>
  )
}
