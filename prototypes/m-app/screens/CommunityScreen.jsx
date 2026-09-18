import { TopTabs } from '@mobile/components'
import { Microsite } from './community/Microsite'
import { Friends } from './community/Friends'
import { Leaderboard } from './community/Leaderboard'
import {
  FRIENDS,
  FRIEND_REQUESTS,
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
  onOpenEvent,
  onOpenFriend,
  onFriendOptions,
}) {
  // Every Community tab is conditional — the navigator renders null when none qualify.
  const tabs = communityTabs(serviceType).filter((t) => flags[t.id])
  return (
    <>
      <TopTabs tabs={tabs} active={tab} onChange={onTab} />
      {/* Keyed by tab so each one gets its OWN scroll container. A material top-tab navigator
          gives every tab a separate scene, so scrolling to the bottom of My School and switching
          to Leaderboard lands you at the top of a fresh list — sharing one scroller instead
          dropped you into the middle of the next tab. */}
      <div className="m-scroll" key={tab}>
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
            friends={FRIENDS}
            requests={FRIEND_REQUESTS}
            serviceType={serviceType}
            onOpenFriend={onOpenFriend}
            onOptions={onFriendOptions}
          />
        )}
        {tab === 'leaderboards' && (
          <Leaderboard
            scopes={LEADERBOARD_SCOPES}
            logTypes={LEADERBOARD_LOG_TYPES}
            data={LEADERBOARDS}
            youId={profileId}
            youName={profileName}
          />
        )}
      </div>
    </>
  )
}
