import { useState } from 'react'
import { Img, ProfileRow, PressableButton, SelectSheet } from '@mobile/components'
import './Leaderboard.css'

/**
 * `friendsAndLeaderboards/components/leaderboard/leaderboards/Leaderboards.tsx`.
 *
 * Four axes, three of them on screen. `useLeaderboard(profileId, logType, dateRange,
 * leaderboardType)` — and the two tab rows are NOT the same question:
 *
 *   • `leaderboard_types` is the SCOPE you are ranked within — your friends, your grade, your
 *     school. Rows in the last two are not people; they carry a `name` instead of a first/last
 *     pair, and no avatar.
 *   • `leaderboard_tabs` is WHAT is counted — minutes, books. It lives inside the header, under
 *     the date range it qualifies.
 *
 * Both rows render through the same `LeaderboardTypeTabs`, which is what makes them easy to read
 * as one control in the source. Either row hides itself when it has fewer than two options.
 *
 * `ranking` comes from the server rather than from the row's index, and that matters: it is what
 * decides a medal, and ties mean it does not always march 1, 2, 3.
 *
 * A row is tappable only on the FRIENDS scope and only if it is not you — there is no page behind
 * a grade.
 *
 * `leaderboardDataWithReader` is the detail that makes this screen kind: if you are not in the
 * list, you are APPENDED to it at `length + 1` with a log value of 0, rather than left off. You
 * always see yourself, even when you have logged nothing. It only happens when the list has
 * someone in it — a leaderboard of just you is an empty state, not a ranking.
 */
const LABEL = (t) =>
  t
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')

const MEDALS = { 1: 'award_first_place', 2: 'award_second_place', 3: 'award_third_place' }

function Rank({ ranking }) {
  const medal = MEDALS[ranking]
  return medal ? (
    <Img name={medal} className="m-lb-medal" />
  ) : (
    <span className="m-lb-rank">{ranking}</span>
  )
}

/** Reused for both tab rows, as in the source. Hidden when there is nothing to choose between. */
function TypeTabs({ types, active, onChange, testLabel }) {
  if (!types || types.length < 2) return null
  return (
    <div className="m-lb-tabs" role="tablist" aria-label={testLabel}>
      {types.map((type) => (
        <PressableButton
          key={type}
          size="small"
          className="m-lb-tab"
          type={active === type ? 'activeTab' : 'inactiveTab'}
          buttonText={LABEL(type)}
          onButtonPress={() => onChange(type)}
        />
      ))}
    </div>
  )
}

export function Leaderboard({
  scopes = [],
  logTypes = [],
  data = {},
  youId,
  youName,
  allowAvatars = true,
}) {
  const [scope, setScope] = useState(scopes[0] ?? 'friends')
  const [logType, setLogType] = useState(logTypes[0] ?? 'minutes')
  const [dateRange, setDateRange] = useState('week')
  const [pickingRange, setPickingRange] = useState(false)

  const ranked = data[scope]?.[logType] ?? []
  // The avatar is a person's, so it is off for grade and school even when the site allows them.
  const showAvatar = allowAvatars && scope === 'friends'

  // Only the friends board can be missing you — a grade board ranks grades, and you are in one.
  const inList = ranked.some((r) => r.id === youId)
  const rows =
    scope === 'friends' && !inList && ranked.length > 0 && youName
      ? [...ranked, { id: youId, name: youName, ranking: ranked.length + 1, logValue: 0 }]
      : ranked

  return (
    <div className="m-lb">
      <TypeTabs types={scopes} active={scope} onChange={setScope} testLabel="Leaderboard type" />

      <div className="m-lb-header">
        <div className="m-lb-header-row">
          <div>
            {/* "Logged" on its own, or "<the only tab> logged" when there is nothing to switch
                between — the header absorbs the label the tabs would have carried. */}
            <p className="m-lb-logged">
              {logTypes.length === 1 ? `${LABEL(logTypes[0])} logged` : 'Logged'}
            </p>
            <p className="m-lb-range">{dateRange === 'week' ? 'This Week' : 'This Month'}</p>
            <p className="m-lb-since">
              <Img name="clock" className="m-lb-clock" />
              <span>{dateRange === 'week' ? 'Since Monday' : 'Since the 1st'}</span>
            </p>
          </div>
          <button type="button" className="m-lb-change" onClick={() => setPickingRange(true)}>
            Change
          </button>
        </div>

        <TypeTabs
          types={logTypes}
          active={logType}
          onChange={setLogType}
          testLabel="What is counted"
        />
      </div>

      <div className="m-lb-list">
        {rows.map((row) => {
          const isYou = row.id === youId
          const name = row.name ?? `${row.firstName} ${row.lastName}`
          const tappable = scope === 'friends' && !isYou
          const Row = tappable ? 'button' : 'div'
          return (
            <Row key={row.id} {...(tappable ? { type: 'button' } : null)} className="m-lb-item">
              <span className="m-lb-left">
                <Rank ranking={row.ranking} />
                {showAvatar && <ProfileRow name={name} size="medium" />}
                <span className={`m-lb-name${isYou ? ' is-you' : ''}`}>
                  {name}
                  {isYou && ' (You)'}
                </span>
              </span>
              <span className="m-lb-value">{row.logValue}</span>
            </Row>
          )
        })}
      </div>

      <div className="m-lb-foot" />

      {/* `DateRangeModal` — two options, and each states its own boundary rather than leaving you
          to work out when "this week" started. */}
      <SelectSheet
        open={pickingRange}
        selectedId={dateRange}
        items={[
          { id: 'week', label: 'This Week (Since Monday)' },
          { id: 'month', label: 'This Month (Since the 1st)' },
        ]}
        onSelect={(id) => {
          setDateRange(id)
          setPickingRange(false)
        }}
        onClose={() => setPickingRange(false)}
      />
    </div>
  )
}
