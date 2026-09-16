import { Img, StarGoalIcon, DailyGoalBanner, MonthHeader } from '@mobile/components'
import './ReadingLog.css'

/**
 * `screens/logScreens/readingLog/` — a month of reading, a week per section.
 *
 * The shape is a SectionList: a month header with arrows, then one section per week whose header
 * is the date range, and inside it one row per day. Each day shows its number, an optional goal
 * star, an optional streak pill, and its sessions.
 *
 * Two details worth keeping: the weekly list is `inverted`, so days run most-recent first inside
 * a week; and a session is coloured by whether it completed a book — coral if it did, blue if not
 * — using three tones each for the ground, the text and the left rule.
 */
function Session({ title, author, minutes, pages, completed, onPress }) {
  return (
    /* WeekListItem's Pressable — a session row opens the SAME `bookDetail` modal that a book on
       All Titles does. */
    <button
      type="button"
      className={`m-rl-session${completed ? ' is-completed' : ''}`}
      onClick={onPress}
    >
      <span className="m-rl-session-line" />
      <span className="m-rl-session-body">
        <span className="m-rl-session-title">{title}</span>
        <span className="m-rl-session-author">{author}</span>
        {(minutes > 0 || pages > 0) && (
          <span className="m-rl-session-stats">
            {minutes > 0 && <span className="m-rl-session-stat">{minutes} minutes</span>}
            {pages > 0 && <span className="m-rl-session-stat">{pages} pages</span>}
          </span>
        )}
        {completed && (
          <span className="m-rl-session-completed">
            <span className="m-rl-session-stat">Completed</span>
          </span>
        )}
      </span>
    </button>
  )
}

function Day({ day, weekday, hasGoal = true, goalMet, streak, sessions, onOpenBook }) {
  return (
    <div className="m-rl-day">
      <div className="m-rl-daycol">
        <div className="m-rl-daynum-row">
          <span className="m-rl-daynum">{day}</span>
          {/* showStarBadge is about HAVING a goal, not meeting it: the star is always drawn once
              a goal exists, and only its colour reports the outcome. */}
          {hasGoal && (
            <StarGoalIcon
              width={16}
              height={16}
              color={goalMet ? 'var(--m-yellow)' : 'var(--m-grey-light-1)'}
            />
          )}
        </div>
        <span className="m-rl-dayname">{weekday}</span>
        {streak > 0 && (
          <span className="m-rl-streak">
            <Img name="flame" size={16} />
            <span className="m-rl-streak-num">{streak}</span>
          </span>
        )}
      </div>
      <div className="m-rl-sessions">
        {sessions.map((s) => (
          <Session key={s.id} {...s} onPress={() => onOpenBook?.(s)} />
        ))}
      </div>
    </div>
  )
}

export function ReadingLog({
  month,
  weeks,
  onPrevMonth,
  onNextMonth,
  isCurrentMonth,
  goal,
  // `reading_goals_enabled` on the microsite plus the reader actually having a goal. It decides
  // the banner AND the per-day star — without a goal there is nothing for the star to report,
  // so the day row is the number and the weekday alone.
  hasGoal = true,
  goalVariant = 'compact',
  onOpenBook,
}) {
  return (
    <div className="m-rl">
      {/* The list header carries the goal banner above the month row — and it is the only place
          the banner's `staticTitle` variant is used, replacing its headline/subheader pair with a
          single quiet label. `flush` drops the card chrome so it reads as the page's own header
          band rather than something resting on it. */}
      {goal && (
        <DailyGoalBanner
          variant={goalVariant}
          goalMinutes={goal.goalMinutes}
          totalMinutes={goal.totalMinutes}
          staticTitle="Your Daily Reading Goal"
        />
      )}

      {/* On the shared MonthHeader, which is the Streaks calendar's size — see its own file for
          why the Reading Log's larger one was the one that gave way. */}
      <MonthHeader
        month={month}
        onPrev={onPrevMonth}
        onNext={onNextMonth}
        disableNext={isCurrentMonth}
        label={`Reading logs for ${month}`}
      />

      {weeks.map((week) => (
        <section key={week.range}>
          {/* WeeklyLogHeader renders the range and nothing else — there is no total here. */}
          <div className="m-rl-week-header" aria-label={week.range.replace(' - ', ' to ')}>
            <span className="m-rl-week-text">{week.range}</span>
          </div>
          {/* The source list is `inverted`, so a week reads most-recent day first. */}
          <div className="m-rl-week">
            {[...week.days].reverse().map((d) => (
              <Day key={d.day} {...d} hasGoal={hasGoal} onOpenBook={onOpenBook} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
