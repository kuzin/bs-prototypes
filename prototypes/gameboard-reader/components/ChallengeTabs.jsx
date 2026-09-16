import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Table } from '@components/Table/Table'
import { StatCard } from '@components/Cards/Cards'
import { GoalStat, GoalStats } from '@components/GoalStat/GoalStat'
import { EmptyState } from '@components/Primitives/Primitives'
import { SectionCard } from '@components/SectionCard/SectionCard'

import { BadgeDisc } from './BadgeDisc'
import { CHALLENGE, SPACES, ACTIVITY_BADGES, REWARDS, isEarned, activityBadgeEarned } from '../data'

/* The board without its START space — what "cleared" is counted against
   everywhere, since a reader has START before they have done anything. */
const BOARD_SPACES = SPACES.filter((s) => s.kind !== 'start')

/**
 * **Overview** — `programs/_show.html.haml`, in its own order: what the
 * challenge is, how far along the reader is, and the badges they have so far.
 *
 * The middle block is `_overview_list_goals`, which is the design system's
 * `GoalStat` strip: a progress tile has a denominator and wears a ring, a total
 * tile has only a count. The board's numbers fit that without stretching —
 * spaces cleared is the progress, books and badges are totals.
 */
export function OverviewTab({ booksFinished, doneActivities, onTab, onBadge }) {
  const cleared = BOARD_SPACES.filter((s) => isEarned(s, booksFinished))
  const activityBadges = ACTIVITY_BADGES.filter((b) => activityBadgeEarned(b, doneActivities))
  // `_show` shows the last few, newest first, and links out to the rest.
  const recent = [...cleared, ...activityBadges].slice(-5).reverse()

  const goals = [
    { label: 'Spaces Cleared', have: cleared.length, need: BOARD_SPACES.length, tab: 'gameboard' },
    { label: 'Books Finished', value: booksFinished, icon: 'book-2', accent: '#0B6B78' },
    {
      label: 'Badges Earned',
      value: cleared.length + activityBadges.length,
      icon: 'award',
      accent: '#B45309',
      tab: 'badges',
    },
  ]

  return (
    <div className="gr-panel">
      {/* `.program-description` — the challenge in the site's own words. */}
      <section className="gr-section">
        <h2 className="gr-section-h">Challenge Description</h2>
        <p className="gr-prose">
          Bundle up and travel the board one book at a time. Every title you finish clears the next
          space and unlocks the badge sitting on it — three of them come with a reward, and reaching
          FINISH means the whole board is yours.
        </p>
      </section>

      {/* `_overview_list_goals` — every requirement as a tile, each one a link
          to the tab that explains its number. */}
      <section className="gr-section">
        <h2 className="gr-section-h">Overall Progress</h2>
        <GoalStats>
          {goals.map((g) => (
            <GoalStat key={g.label} goal={g} onClick={g.tab ? () => onTab(g.tab) : undefined} />
          ))}
        </GoalStats>
      </section>

      {/* `.recently-earned-badges` — the app's own heading, its own grid, and
          its own empty state, which names the reader rather than the feature. */}
      <section className="gr-section">
        <div className="gr-section-head">
          <h2 className="gr-section-h">Recently Earned Badges</h2>
          <Button variant="secondary" size="sm" onClick={() => onTab('badges')}>
            All Badges
          </Button>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            variant="dashed"
            icon={<Icon name="award" size={26} />}
            title="Olivia hasn’t earned any badges yet."
            description="Participate in the challenge to earn badges."
          />
        ) : (
          <ul className="gr-recent">
            {recent.map((b) => (
              <li key={b.id}>
                <button type="button" className="gr-recent-badge" onClick={() => onBadge(b)}>
                  <BadgeDisc space={b} earned bare size="grid" />
                  <span className="gr-recent-name">{b.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

/**
 * **Rewards** — `programs/_reward.html.haml`. One card a reward: a status
 * marker, the title, the line that says how it was unlocked (or what will
 * unlock it), and — only once it's earned — the instructions for claiming it.
 *
 * An unearned reward deliberately keeps its title. The app shows readers what
 * is waiting for them; hiding it would make the tab pointless before you've
 * won anything.
 */
export function RewardsTab({ booksFinished }) {
  const rewards = REWARDS.map((r) => {
    const space = SPACES.find((s) => s.id === r.spaceId)
    return { ...r, space, earned: isEarned(space, booksFinished) }
  })
  const earnedCount = rewards.filter((r) => r.earned).length

  return (
    <div className="gr-panel">
      <section className="gr-section">
        <div className="gr-section-head">
          <h2 className="gr-section-h">Rewards</h2>
          <span className="gr-section-count">
            {earnedCount} of {rewards.length} unlocked
          </span>
        </div>

        <ul className="gr-rewards">
          {rewards.map((r) => (
            <li key={r.id} className={`gr-reward${r.earned ? ' is-earned' : ''}`}>
              <span className="gr-reward-status" aria-hidden="true">
                <Icon name={r.earned ? 'gift' : 'lock'} size={20} />
              </span>

              <div className="gr-reward-body">
                <h3 className="gr-reward-title">{r.title}</h3>
                <p className="gr-reward-desc">
                  {r.earned
                    ? `Unlocked with the ${r.space.name} badge.`
                    : `${r.space.requirement} to unlock this reward.`}
                </p>

                {r.earned && (
                  <div className="gr-reward-instructions">
                    <strong>Instructions</strong>
                    <p>{r.instructions}</p>
                  </div>
                )}
              </div>

              <span className={`gr-reward-tag${r.earned ? ' is-earned' : ''}`}>
                {r.earned ? 'Earned' : 'Locked'}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/**
 * **Challenge Log** — `programs#full_reading_log`: a Summary of what has been
 * logged against this challenge, then the Log Items themselves, four columns
 * wide (Title & Author, Added On, Log Type, Log Value).
 *
 * It reads the same sessions the board does, so a title logged in the flow
 * shows up here the moment the celebration closes.
 */
export function LogTab({ sessions, booksFinished, onLog }) {
  const minutes = sessions
    .filter((s) => s.logType === 'Minutes')
    .reduce((a, s) => a + s.logValue, 0)
  const pages = sessions.filter((s) => s.logType === 'Pages').reduce((a, s) => a + s.logValue, 0)

  const columns = [
    {
      key: 'title',
      label: 'Title & Author',
      render: (_v, row) => (
        <span className="gr-logtitle">
          <strong>{row.title}</strong>
          <span>{row.author}</span>
        </span>
      ),
    },
    { key: 'date', label: 'Added On' },
    { key: 'logType', label: 'Log Type' },
    {
      key: 'logValue',
      label: 'Log Value',
      align: 'right',
      render: (v, row) => `${v.toLocaleString()} ${row.logType.toLowerCase()}`,
    },
  ]

  return (
    <div className="gr-panel">
      <section className="gr-section">
        <div className="gr-section-head">
          <h2 className="gr-section-h">Summary</h2>
          <Button variant="secondary" size="sm" onClick={onLog}>
            Log Reading
          </Button>
        </div>
        <div className="gr-logsummary">
          <StatCard
            label="Minutes"
            value={minutes.toLocaleString()}
            color="#1A6DD5"
            icon={<Icon name="clock" size={22} />}
          />
          {pages > 0 && (
            <StatCard
              label="Pages"
              value={pages.toLocaleString()}
              color="#6C4BB6"
              icon={<Icon name="file-text" size={22} />}
            />
          )}
          <StatCard
            label="Books Finished"
            value={booksFinished}
            color="#0B6B78"
            icon={<Icon name="book-2" size={22} />}
          />
          <StatCard
            label="Sessions"
            value={sessions.length}
            color="#B45309"
            icon={<Icon name="reading-log" size={22} />}
          />
        </div>
      </section>

      <SectionCard header="bar" title="Log Items" flush className="gr-logcard">
        <Table
          columns={columns}
          rows={sessions}
          getRowKey={(r) => r.id}
          flush
          scrollX
          empty={`Nothing logged against ${CHALLENGE.name} yet.`}
        />
      </SectionCard>
    </div>
  )
}
