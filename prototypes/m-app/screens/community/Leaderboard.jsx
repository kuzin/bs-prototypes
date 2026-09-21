import { useState } from 'react'
import {
  Img,
  FriendAvatar,
  FilterBar,
  ToggleTabs,
  PressableButton,
  SelectSheet,
  ActionsModal,
  EmptyStateView,
} from '@mobile/components'
import './community.css'
import './Leaderboard.css'

/**
 * `friendsAndLeaderboards/components/leaderboard/leaderboards/Leaderboards.tsx`.
 *
 * Four axes, three of them on screen, and they are NOT the same question — which is the thing
 * the source obscures by rendering both tab rows through one `LeaderboardTypeTabs`:
 *
 *   • SCOPE (`leaderboard_types`) is who you are ranked against — your friends, your grade, your
 *     school. It changes what a row IS: grade and school rows are not people, carry a `name`
 *     rather than a first/last pair, and get no avatar.
 *   • WHAT IS COUNTED (`leaderboard_tabs`) is minutes, books or — on the school board only —
 *     participation rate (labelled just "Participation"). It changes one column, and the third
 *     option changes its units: it is
 *     the one value the app renders as a percentage rather than a total, because ranking schools
 *     by a total just ranks them by enrolment.
 *
 * The second list depends on the first, which is why `logTypes` is keyed by scope rather than
 * flat: `leaderboard_tabs` arrives in each request's meta, so leaving the School board takes
 * Participation Rate with it.
 *
 * DIVERGENCE — so they stop looking alike. Scope becomes a [[FilterBar]], the control this app
 * already uses for "one value from a short list" and the one that can grow past three options
 * without abbreviating them; what is counted becomes [[ToggleTabs]], the pill switch built for
 * exactly two or three. Two rows of identical pills asked the reader to work out which row did
 * what, and the answer was not in either of them.
 *
 * `ranking` is the server's, not the row's index: it is what decides a medal, and ties mean it
 * does not always march 1, 2, 3.
 *
 * A row opens that friend's page, the same one the Friends tab opens — `navigation.navigate
 * ('friendDetail', { friendId: item.id })`, which works because a leaderboard row's id IS the
 * profile id. Only on the FRIENDS scope and only if it is not you: there is no page behind a
 * grade, and your own is the Log tab.
 *
 * `leaderboardDataWithReader` is the detail that makes this screen kind: if you are not in the
 * list, you are APPENDED at `length + 1` with a log value of 0 rather than left off. It only
 * happens when the list has someone in it — a leaderboard of just you is an empty state.
 */
const LABEL = (t) =>
  t
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')

/**
 * Log-type labels, and `participation_rate` is why this is a map rather than `LABEL`.
 *
 * "Participation Rate" is the API's name for it and it does not fit a third of a 393pt row —
 * it wrapped to two lines inside a 32pt pill. "Participation" is unambiguous next to Minutes
 * and Books, since neither of those is a rate either.
 *
 * Keyed BOTH ways on purpose. `ToggleTabs` takes and returns the label, so with a label that is
 * no longer `LABEL(id)` the way back cannot be string munging any more:
 * `'Participation'.toLowerCase()` is not `participation_rate`, and deriving it would have
 * silently selected nothing.
 */
const TYPE_LABEL = { participation_rate: 'Participation' }
const typeLabel = (t) => TYPE_LABEL[t] ?? LABEL(t)
const typeFromLabel = (label, types) => types.find((t) => typeLabel(t) === label) ?? types[0]

const MEDALS = { 1: 'award_first_place', 2: 'award_second_place', 3: 'award_third_place' }

function Rank({ ranking }) {
  const medal = MEDALS[ranking]
  return medal ? (
    <Img name={medal} className="m-lb-medal" />
  ) : (
    <span className="m-lb-rank">{ranking}</span>
  )
}

/** `LeaderboardsEmpty` — two different empties. The friends board gets a prompt and a button
 *  because the reason it is empty is fixable by you; grade and school get a statement. */
function Empty({ scope, addOrInvite, onlyUnconfirmed, onAdd }) {
  if (scope !== 'friends') {
    return (
      <EmptyStateView
        source="leaderboards_empty"
        boldText={
          scope === 'grade' ? 'There are no grades to show.' : 'There are no schools to show.'
        }
      />
    )
  }
  return (
    <div className="m-lb-empty">
      <EmptyStateView
        source="leaderboards_empty"
        boldText={
          onlyUnconfirmed
            ? 'Waiting for invitations to be accepted.'
            : `${addOrInvite} friends to see their rankings!`
        }
      />
      <PressableButton buttonText={`${addOrInvite} Friends`} onButtonPress={onAdd} />
    </div>
  )
}

export function Leaderboard({
  scopes = [],
  logTypes = {},
  data = {},
  youId,
  youName,
  serviceType = 'School',
  hasFriends = true,
  onlyUnconfirmed = false,
  onAddFriend,
  onOpenFriend,
  allowAvatars = true,
}) {
  const [scope, setScope] = useState(scopes[0] ?? 'friends')
  const [logType, setLogType] = useState('minutes')
  const [dateRange, setDateRange] = useState('week')
  const [pickingScope, setPickingScope] = useState(false)
  const [pickingRange, setPickingRange] = useState(false)

  /* `leaderboard_tabs` comes back in each request's meta, so what you can count depends on what
     you are ranking: only the school board offers participation rate. Switching scope therefore
     has to be able to invalidate the current selection — go to School, pick Participation Rate,
     go back to Friends, and there is no such tab to be on. Falling back to the first available
     type is what the app does by simply rendering the tabs it was given. */
  const scopeTypes = logTypes[scope] ?? []
  const activeType = scopeTypes.includes(logType) ? logType : (scopeTypes[0] ?? 'minutes')

  const ranked = data[scope]?.[activeType] ?? []
  // The avatar is a person's, so it is off for grade and school even when the site allows them.
  const showAvatar = allowAvatars && scope === 'friends'

  // Only the friends board can be missing you — a grade board ranks grades, and you are in one.
  const inList = ranked.some((r) => r.id === youId)
  const rows =
    scope === 'friends' && !inList && ranked.length > 0 && youName
      ? [...ranked, { id: youId, name: youName, ranking: ranked.length + 1, logValue: 0 }]
      : ranked

  const addOrInvite = serviceType === 'Library' ? 'Add' : 'Invite'
  const waitingForFriends = scope === 'friends' && (!hasFriends || onlyUnconfirmed)

  const SCOPE_LABEL = { friends: 'My Friends', grade: 'My Grade', school: 'My School' }
  const rangeLabel = dateRange === 'week' ? 'This Week' : 'This Month'
  const sinceLabel = dateRange === 'week' ? 'Since Monday' : 'Since the 1st'

  return (
    <div className="m-lb">
      {/* Scope: one value from a short list, so the control the app already uses for that. */}
      {scopes.length > 1 && (
        <FilterBar
          className="m-lb-scope"
          label={SCOPE_LABEL[scope] ?? LABEL(scope)}
          onPress={() => setPickingScope(true)}
        />
      )}

      {waitingForFriends ? (
        <Empty
          scope={scope}
          addOrInvite={addOrInvite}
          onlyUnconfirmed={onlyUnconfirmed}
          onAdd={onAddFriend}
        />
      ) : (
        <>
          <header className="m-comm-label m-lb-label">
            <div className="m-comm-label-stack">
              <h2 className="m-comm-label-text">{rangeLabel}</h2>
              {/* The source's "Logged" line. With one log type it names it — "Minutes logged" —
                  because the switch below is hidden and nothing else would.

                  No clock. The app hangs `images.clock` off this line, which earns its place
                  beside a standalone "24 days to go" — a countdown is a clock fact. Here the line
                  sits under "This Week" and says "Since Monday": the glyph repeats what two words
                  of the label already established, and one that adds nothing still adds weight. */}
              <p className="m-comm-sub">
                {scopeTypes.length === 1 ? `${typeLabel(scopeTypes[0])} logged · ` : ''}
                {sinceLabel}
              </p>
            </div>
            <PressableButton
              size="small"
              type="grey"
              buttonText="Change"
              onButtonPress={() => setPickingRange(true)}
            />
          </header>

          {/* What is counted: two or three options, which is what the pill is built for. */}
          {scopeTypes.length > 1 && (
            <ToggleTabs
              className="m-lb-types"
              tabs={scopeTypes.map(typeLabel)}
              currentTab={typeLabel(activeType)}
              setCurrentTab={(label) => setLogType(typeFromLabel(label, scopeTypes))}
            />
          )}

          <div className="m-lb-list">
            {/* `LeaderboardNoData` — the board exists, this window is just empty. */}
            {rows.length === 0 && (
              <EmptyStateView
                source="stats_empty_state"
                boldText="There's no data for this time period."
              />
            )}
            {rows.map((row) => {
              const isYou = row.id === youId
              const name = row.name ?? `${row.firstName} ${row.lastName}`
              const tappable = scope === 'friends' && !isYou
              const Row = tappable ? 'button' : 'div'
              return (
                <Row
                  key={row.id}
                  {...(tappable ? { type: 'button', onClick: () => onOpenFriend?.(row) } : null)}
                  className="m-lb-item"
                >
                  <span className="m-lb-left">
                    <Rank ranking={row.ranking} />
                    {showAvatar && (
                      <FriendAvatar
                        id={row.id}
                        firstName={row.firstName ?? name}
                        lastName={row.lastName ?? ''}
                      />
                    )}
                    <span className={`m-lb-name${isYou ? ' is-you' : ''}`}>
                      {name}
                      {isYou && ' (You)'}
                    </span>
                  </span>
                  {/* The only value the app ever suffixes, and only on this one pairing —
                      `displayLeaderboardValue` in `LeaderboardItem`. */}
                  <span className="m-lb-value">
                    {scope === 'school' && activeType === 'participation_rate'
                      ? `${row.logValue}%`
                      : row.logValue}
                  </span>
                </Row>
              )
            })}
          </div>

          <div className="m-lb-foot" />
        </>
      )}

      <SelectSheet
        open={pickingScope}
        selectedId={scope}
        items={scopes.map((id) => ({ id, label: SCOPE_LABEL[id] ?? LABEL(id) }))}
        onSelect={(id) => {
          setScope(id)
          setPickingScope(false)
        }}
        onClose={() => setPickingScope(false)}
      />

      {/* `DateRangeModal` — an `ActionsModal` with `isDateRangeItem`, titled "Date Range". Two
          options, and each states its own boundary rather than leaving you to work out when
          "this week" started. */}
      <ActionsModal
        open={pickingRange}
        selectable
        title="Date Range"
        options={[
          { id: 'week', title: 'This Week (Since Monday)' },
          { id: 'month', title: 'This Month (Since the 1st)' },
        ].map((o) => ({
          title: o.title,
          isActive: dateRange === o.id,
          onPress: () => setDateRange(o.id),
        }))}
        onClose={() => setPickingRange(false)}
      />
    </div>
  )
}
