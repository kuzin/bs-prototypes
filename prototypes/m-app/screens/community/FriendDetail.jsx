import { useState } from 'react'
import {
  Img,
  FriendAvatar,
  TopTabs,
  EmptyStateView,
  friendColor,
  friendColorKey,
} from '@mobile/components'
import './FriendDetail.css'

/**
 * `friendsAndLeaderboards/components/friends/FriendDetail/FriendDetail.tsx` — a friend's page.
 *
 * The header is washed in THEIR colour: `friendColor(id-first-last ).header`, the same hue their
 * avatar uses, at 90% lightness. Nothing about it is chosen per-screen — hash a name and you get
 * the whole set — which is why a friend looks like themselves on every surface they appear on.
 * Two decorative marks sit in the corners of that wash, and the back control is a `dropdown_arrow`
 * rather than a chevron, because this is presented rather than pushed.
 *
 * Three tabs, and the third is a privacy setting rather than a feature: Reading Log appears only
 * when the friend has `displayLoggedBooksToFriends` on. A reader can be on your friends list and
 * still not show you what they read.
 *
 * Overview is badges, achievements and four statistics — and each statistic is present only if
 * the site counts it, which is why minutes and books are checked with `hasOwnProperty` rather
 * than for a value. A site that logs only books shows three blocks, not one with a zero in it.
 */
const STAT_IMAGE = {
  current: 'friendStreak',
  longest: 'friendLongestStreak',
  minutes: 'watch_emoji',
  books: 'book_stack_emoji',
}

/** `detailType` — the unit is singular at exactly one. */
const unit = (value, word) => `${word}${value === 1 ? '' : 's'}`

function Stat({ kind, value, label }) {
  return (
    <div className="m-fd-stat">
      <Img
        name={STAT_IMAGE[kind]}
        className={`m-fd-stat-img${kind === 'current' ? ' is-streak' : ''}`}
      />
      <span className="m-fd-stat-text">
        <span className="m-fd-stat-value">
          {value ?? 0} {label}
        </span>
        <span className="m-fd-stat-label">
          {kind === 'current'
            ? 'Current Streak'
            : kind === 'longest'
              ? 'Longest Streak'
              : kind === 'books'
                ? 'Total Books Read'
                : 'Total Minutes Read'}
        </span>
      </span>
    </div>
  )
}

function Overview({ friend, displayAchievements }) {
  const { badges = [], achievements = [], stats = {} } = friend
  return (
    <div className="m-fd-pane">
      <h2 className="m-fd-section">Latest Badges</h2>
      {badges.length > 0 ? (
        <div className="m-fd-badges">
          {badges.map((b) => (
            <span key={b.id} className="m-fd-badge" style={{ background: b.art }} />
          ))}
        </div>
      ) : (
        <EmptyStateView
          source="my_badges_empty_state"
          boldText="No Badges To Show"
          middleText="This reader hasn't earned any badges yet."
        />
      )}

      {displayAchievements && (
        <>
          <h2 className="m-fd-section">Latest Achievements</h2>
          {achievements.length > 0 ? (
            <div className="m-fd-badges">
              {achievements.map((a) => (
                <span key={a.id} className="m-fd-badge" style={{ background: a.art }} />
              ))}
            </div>
          ) : (
            /* `catStreak`, not the badges artwork — the two empties on this pane are drawn
               differently on purpose, which is easy to lose when the copy is nearly the same. */
            <EmptyStateView
              source="catStreak"
              boldText="No Achievements To Show"
              middleText="This reader hasn't earned any achievements yet."
            />
          )}
        </>
      )}

      <h2 className="m-fd-section">Statistics</h2>
      <Stat kind="current" value={stats.currentStreak} label={unit(stats.currentStreak, 'Day')} />
      <Stat kind="longest" value={stats.longestStreak} label={unit(stats.longestStreak, 'Day')} />
      {'minutes' in stats && (
        <Stat kind="minutes" value={stats.minutes} label={unit(stats.minutes, 'Minute')} />
      )}
      {'books' in stats && (
        <Stat kind="books" value={stats.books} label={unit(stats.books, 'Book')} />
      )}
    </div>
  )
}

function Challenges({ friend }) {
  const challenges = friend.challenges ?? []
  if (challenges.length === 0) {
    return (
      <div className="m-fd-pane">
        <EmptyStateView
          source="my_badges_empty_state"
          boldText="No Challenges Here"
          middleText="This reader hasn't joined any challenges yet."
        />
      </div>
    )
  }
  return (
    <div className="m-fd-pane">
      {challenges.map((c) => (
        <div key={c.id} className="m-fd-challenge">
          <span className="m-fd-challenge-title">{c.title}</span>
          <span className="m-fd-challenge-sub">{c.subtitle}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * `FriendDetailReadingLog` — RECENT titles, not the log. The full thing is its own screen behind
 * the text button, which is the only place a friend's log paginates and refreshes.
 *
 * `isSelf` hides that button: your own full log is the Log tab, and a second way in would be a
 * second answer to the same question.
 */
function ReadingLog({ friend, onFullLog }) {
  const titles = friend.titles ?? []

  if (titles.length === 0) {
    return (
      <div className="m-fd-pane">
        <EmptyStateView
          source="no_titles_empty_state"
          boldText="No Titles To Show"
          middleText="This reader hasn't logged any titles yet."
        />
      </div>
    )
  }

  return (
    <div className="m-fd-pane">
      {titles.map((t) => (
        <div key={t.id} className="m-fd-title">
          <span className="m-fd-cover" style={{ background: t.cover }}>
            <span className="m-fd-cover-text">{t.title}</span>
          </span>
          <span className="m-fd-title-text">
            <span className="m-fd-title-name">{t.title}</span>
            <span className="m-fd-title-author">{t.author}</span>
          </span>
        </div>
      ))}
      <button type="button" className="m-fd-fulllog" onClick={() => onFullLog?.(friend)}>
        View Full Reading Log
      </button>
    </div>
  )
}

export function FriendDetail({ friend, displayAchievements = true, onFullLog, onClose }) {
  const color = friendColor(
    friendColorKey({ id: friend.id, firstName: friend.firstName, lastName: friend.lastName }),
  )
  const showLog = friend.displayLoggedBooksToFriends !== false
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'challenges', label: 'Challenges' },
    ...(showLog ? [{ id: 'log', label: 'Reading Log' }] : []),
  ]
  const [tab, setTab] = useState('overview')

  return (
    <div className="m-fd">
      <header className="m-fd-header" style={{ background: color.header }}>
        <button type="button" className="m-fd-back" onClick={onClose} aria-label="Back">
          <Img name="dropdown_arrow" className="m-fd-back-img" />
        </button>
        <Img name="friendProfileTopLeftFull" className="m-fd-mark is-left" />
        <Img name="friend_profile_bottom_right" className="m-fd-mark is-right" />
        <span className="m-fd-avatar">
          <FriendAvatar
            id={friend.id}
            firstName={friend.firstName}
            lastName={friend.lastName}
            imgURL={friend.imgURL}
            size={96}
          />
        </span>
        <p className="m-fd-name">
          {friend.firstName} {friend.lastName}
        </p>
      </header>

      <TopTabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="m-fd-scroll">
        {tab === 'overview' && (
          <Overview friend={friend} displayAchievements={displayAchievements} />
        )}
        {tab === 'challenges' && <Challenges friend={friend} />}
        {tab === 'log' && <ReadingLog friend={friend} onFullLog={onFullLog} />}
        <div className="m-fd-foot" />
      </div>
    </div>
  )
}
