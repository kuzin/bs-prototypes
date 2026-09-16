import { TopTabs, Text, TextPill, ProfileRow, PressableButton } from '@mobile/components'
import { FRIENDS, LEADERBOARD, SITE_FEED } from '../data'
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

function Microsite() {
  return (
    <div className="m-scr">
      <div className="m-scr-hero">
        <Text role="detailPageTitle" as="p">
          Lincoln Middle School
        </Text>
        <Text role="subHeading" as="p">
          428 readers · 1,204,551 minutes this year
        </Text>
      </div>
      {SITE_FEED.map((f) => (
        <div key={f.id} className="m-scr-row">
          <ProfileRow name={f.name} size="medium" />
          <div className="m-flex m-col m-scr-rowmeta">
            <Text role="bodySmall" as="p">
              <strong>{f.name}</strong> {f.action}
            </Text>
            <Text role="subHeading" as="p">
              {f.when}
            </Text>
          </div>
        </div>
      ))}
    </div>
  )
}

function Friends() {
  return (
    <div className="m-scr">
      <div className="m-scr-requests">
        <Text role="titleSmall" as="p">
          3 friend requests
        </Text>
        <PressableButton size="small" buttonText="Review" />
      </div>
      {FRIENDS.map((f) => (
        <div key={f.id} className="m-scr-row">
          <ProfileRow name={f.name} size="medium" />
          <div className="m-flex m-col m-scr-rowmeta">
            <Text role="itemTitle" as="p">
              {f.name}
            </Text>
            <Text role="bodySmaller" as="p">
              {f.minutes} minutes this month
            </Text>
          </div>
          {f.streak > 0 && <TextPill tone="orange" text={`${f.streak}d`} />}
        </div>
      ))}
    </div>
  )
}

function Leaderboard() {
  return (
    <div className="m-scr">
      {LEADERBOARD.map((r, i) => (
        <div key={r.id} className={`m-scr-row${r.isYou ? ' is-you' : ''}`}>
          <span className="m-scr-rank">{i + 1}</span>
          <ProfileRow name={r.name} size="medium" />
          <div className="m-flex m-col m-scr-rowmeta">
            <Text role="itemTitle" as="p">
              {r.name}
              {r.isYou && ' (you)'}
            </Text>
            <Text role="bodySmaller" as="p">
              {r.minutes} minutes
            </Text>
          </div>
        </div>
      ))}
    </div>
  )
}

export function CommunityScreen({ tab, onTab, serviceType = 'School', flags = {} }) {
  // Every Community tab is conditional — the navigator renders null when none qualify.
  const tabs = communityTabs(serviceType).filter((t) => flags[t.id])
  return (
    <>
      <TopTabs tabs={tabs} active={tab} onChange={onTab} />
      <div className="m-scroll">
        {tab === 'microsite' && <Microsite />}
        {tab === 'friends' && <Friends />}
        {tab === 'leaderboards' && <Leaderboard />}
      </div>
    </>
  )
}
