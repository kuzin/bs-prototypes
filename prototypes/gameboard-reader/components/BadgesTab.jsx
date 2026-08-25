import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { BadgeDisc } from './BadgeDisc'
import { SPACES, ACTIVITY_BADGES, activityType, activityBadgeEarned, isEarned } from '../data'

/**
 * The Badges tab, split by a segmented control.
 *
 * **Badges** is everything there is to earn, in one grid — the board's spaces
 * plus the activity badges, which never sit on the board (the creator's tray
 * says as much), so this is the only place the two are seen together.
 *
 * **Activities** is the to-do side of the same set: each activity badge with
 * the activities that earn it listed underneath.
 */
export function BadgesTab({ booksFinished, doneActivities, onActivity, onBadge }) {
  const [view, setView] = useState('badges')

  const readingEarned = SPACES.filter((s) => isEarned(s, booksFinished)).length
  const activityEarned = ACTIVITY_BADGES.filter((b) =>
    activityBadgeEarned(b, doneActivities),
  ).length
  const totalBadges = SPACES.length + ACTIVITY_BADGES.length
  const totalEarned = readingEarned + activityEarned

  const activityCount = ACTIVITY_BADGES.reduce((n, b) => n + b.activities.length, 0)

  return (
    <div className="gr-badges">
      <div className="gr-badges-switch">
        <Tabs
          variant="pill"
          size="md"
          active={view}
          accent="#1A6DD5"
          onChange={setView}
          ariaLabel="Badges or activities"
          items={[
            { id: 'badges', label: 'Badges', count: totalBadges },
            { id: 'activities', label: 'Activities', count: activityCount },
          ]}
        />
        <span className="gr-badges-count">
          {view === 'badges'
            ? `${totalEarned} of ${totalBadges} earned`
            : `${doneActivities.length} of ${activityCount} complete`}
        </span>
      </div>

      {view === 'badges' ? (
        <>
          <section>
            <h2 className="gr-badges-h">Reading Badges</h2>
            <p className="gr-badges-note">
              Earned by logging books — these are the spaces on your board.
            </p>
            <ul className="gr-badge-grid">
              {SPACES.map((s) => {
                const earned = isEarned(s, booksFinished)
                return (
                  <BadgeCell
                    key={s.id}
                    badge={s}
                    earned={earned}
                    state={earned ? 'Earned' : s.requirement}
                    onBadge={onBadge}
                  />
                )
              })}
            </ul>
          </section>

          <section>
            <h2 className="gr-badges-h">Activity Badges</h2>
            <p className="gr-badges-note">
              Earned by doing things rather than reading, so they live off the board.
            </p>
            <ul className="gr-badge-grid">
              {ACTIVITY_BADGES.map((b) => {
                const done = b.activities.filter((a) => doneActivities.includes(a.id)).length
                const earned = done === b.activities.length
                return (
                  <BadgeCell
                    key={b.id}
                    badge={b}
                    earned={earned}
                    state={earned ? 'Earned' : `${done} of ${b.activities.length} activities`}
                    onBadge={onBadge}
                  />
                )
              })}
            </ul>
          </section>
        </>
      ) : (
        <div className="gr-act-list">
          {ACTIVITY_BADGES.map((badge) => (
            <ActivityBadgeCard
              key={badge.id}
              badge={badge}
              doneActivities={doneActivities}
              onActivity={onActivity}
              onBadge={onBadge}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BadgeCell({ badge, earned, state, onBadge }) {
  return (
    <li>
      <button
        type="button"
        className={`gr-badge-cell${earned ? ' is-earned' : ''}`}
        onClick={() => earned && onBadge(badge)}
        // A locked badge has nothing to open — the line under it is already the
        // whole story.
        disabled={!earned}
      >
        <BadgeDisc space={badge} earned={earned} bare size="grid" />
        <span className="gr-badge-cell-name">{badge.name}</span>
        <span className="gr-badge-cell-req">{state}</span>
      </button>
    </li>
  )
}

function ActivityBadgeCard({ badge, doneActivities, onActivity, onBadge }) {
  const done = badge.activities.filter((a) => doneActivities.includes(a.id)).length
  const total = badge.activities.length
  const earned = done === total

  return (
    <article className={`gr-act-card${earned ? ' is-earned' : ''}`}>
      <header className="gr-act-head">
        <button
          type="button"
          className="gr-act-art"
          onClick={() => earned && onBadge(badge)}
          disabled={!earned}
          aria-label={earned ? `${badge.name} — earned` : `${badge.name} — locked`}
        >
          <BadgeDisc space={badge} earned={earned} bare size="act" />
        </button>

        <div className="gr-act-headtext">
          <h3>{badge.name}</h3>
          <p className="gr-act-progress">
            {earned ? (
              <span className="gr-act-done-tag">
                <Icon name="circle-check-filled" size={14} /> Earned
              </span>
            ) : (
              `${done} of ${total} activities complete`
            )}
          </p>
          <ProgressBar value={done} max={total} color="#1A6DD5" size="sm" />
        </div>
      </header>

      <ul className="gr-act-items">
        {badge.activities.map((a) => {
          const isDone = doneActivities.includes(a.id)
          const type = activityType(a.type)
          return (
            <li key={a.id} className={`gr-act-item${isDone ? ' is-done' : ''}`}>
              <span className="gr-act-icon" aria-hidden="true">
                <Icon name={isDone ? 'check' : type.icon} size={16} stroke={2.2} />
              </span>
              <span className="gr-act-text">
                <span className="gr-act-title">{a.title}</span>
                <span className="gr-act-desc">{a.description}</span>
                <span className="gr-act-type">{type.label}</span>
              </span>
              <button
                type="button"
                className="gr-act-btn"
                onClick={() => onActivity(a.id, badge)}
                aria-pressed={isDone}
              >
                {isDone ? 'Undo' : 'Mark done'}
              </button>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
