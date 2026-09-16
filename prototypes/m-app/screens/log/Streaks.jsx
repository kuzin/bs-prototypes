import { useState } from 'react'
import { Img, StarGoalIcon, Carousel, MonthHeader } from '@mobile/components'
import './Streaks.css'

/**
 * `src/streaks/components/Streaks.tsx` — a snap CAROUSEL of achievement cards over a month
 * calendar. Not a stack: one card at a time at `windowWidth - 64` (329 at 393), with pagination
 * dots below at 10pt greyDark3 and inactive dots at 0.2 opacity.
 *
 * `SetCarouselData` builds FIVE cards, each with its own artwork and its own three-colour set —
 * and the three are NOT the same value: `achievementColor` is the saturated one on the big number,
 * `textColor` is greyDark2 on the label, and `backgroundColor` is the pale ground. Every card also
 * has an EMPTY variant: at zero the artwork swaps to its grey twin, the number goes greyDark4, the
 * label greyDark3 and the ground greyLight3.
 *
 *   Current Streak            streaks / streaksGrey              red on redLight
 *   Longest Streak            longestStreak / longestStreakGrey  red on redLight
 *   Longest Title Completed   title / titleGrey                  denimDark on denimLight
 *   Most Pages in a Session   pages / pagesGrey                  greenDark on greenLight
 *   Longest Session           session / sessionGrey              purpleDark on purpleLight
 *
 * A sixth card, `TimesGoalMetCard`, is spliced in at INDEX 2 — after the two streak cards — but
 * only when the reader has a reading goal. It is a different shape: a 56pt yellow disc holding a
 * star, not a 90pt illustration.
 */
const CARD_DEFS = {
  currentStreak: {
    text: 'Current Streak',
    image: 'streaks',
    imageEmpty: 'streaksGrey',
    color: 'var(--m-red)',
    background: 'var(--m-red-light)',
  },
  longestStreak: {
    text: 'Longest Streak',
    image: 'longestStreak',
    imageEmpty: 'longestStreakGrey',
    color: 'var(--m-red)',
    background: 'var(--m-red-light)',
  },
  longestTitle: {
    text: 'Longest Title Completed',
    image: 'title',
    imageEmpty: 'titleGrey',
    color: 'var(--m-denim-dark)',
    background: 'var(--m-denim-light)',
  },
  mostPages: {
    text: 'Most Pages in a Session',
    image: 'pages',
    imageEmpty: 'pagesGrey',
    color: 'var(--m-green-dark)',
    background: 'var(--m-green-light)',
  },
  longestSession: {
    text: 'Longest Session',
    image: 'session',
    imageEmpty: 'sessionGrey',
    color: 'var(--m-purple-dark)',
    background: 'var(--m-purple-light)',
  },
}

function StreakCard({ def, value, filled }) {
  return (
    <article
      className="m-st-card"
      style={{ background: filled ? def.background : 'var(--m-grey-light-3)' }}
    >
      <Img name={filled ? def.image : def.imageEmpty} size={90} />
      <p
        className="m-st-achievement"
        style={{ color: filled ? def.color : 'var(--m-grey-dark-4)' }}
      >
        {value}
      </p>
      <p
        className="m-st-text"
        style={{ color: filled ? 'var(--m-grey-dark-2)' : 'var(--m-grey-dark-3)' }}
      >
        {def.text}
      </p>
    </article>
  )
}

/** TimesGoalMetCard — yellowExtraLight ground, a 56pt yellow disc, and a 115pt text column. */
function TimesGoalMetCard({ count }) {
  return (
    <article className="m-st-card m-st-goalcard">
      <span className="m-st-goal-col">
        <span className="m-st-goal-icon">
          <span className="m-st-goal-badge">
            <StarGoalIcon width={28} height={28} color="var(--m-yellow-extra-light)" />
          </span>
        </span>
        <span className="m-st-goal-text">
          <span className="m-st-goal-count">{count}</span>
          <span className="m-st-goal-label">Times Goal Met</span>
        </span>
      </span>
    </article>
  )
}

/* `react-native-calendars` writes three-letter day names, not initials. */
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/**
 * The calendar — `StreaksCalendars` over `react-native-calendars`, with `CalendarDay` drawing
 * every cell. Six things the simplified version was missing, all of them load-bearing:
 *
 *   1. MONTH ARROWS. 24pt `swipe_{dir}_arrow`, greyDark2, and greyLight1 when disabled — left on
 *      the first month with data, right on the current month. You cannot page into the future.
 *   2. A day outside the month is a DOT, not a greyed-out number. `calendarDot` at 10pt, and it
 *      takes the accent wash when that day is part of a streak running across the boundary.
 *   3. A streak is ONE BAR, not a row of discs. `startingDay` rounds the left, `endingDay` the
 *      right, and `selectedFiller` bridges the gap between cells so the run reads continuous —
 *      which is also why Sunday and Saturday round: a week edge ends the bar visually.
 *   4. TODAY has two states: logged is a filled accent disc with white text; not-yet-logged is a
 *      white disc with a 2pt accent ring and accent text.
 *   5. A future date is greyLight1 — dimmer than a past day with no log, because one is "you did
 *      not" and the other is "not yet".
 *   6. The star only appears from `goalStartDate` onward. Before the reader had a goal there was
 *      nothing to meet, so a grey star there would be reporting a failure that never happened.
 */
function StreakCalendar({ today, goalStartDate, firstMonth, logs, hasGoal = true }) {
  const todayDate = new Date(`${today}T00:00:00`)
  const [view, setView] = useState({ y: todayDate.getFullYear(), m: todayDate.getMonth() })

  const byDate = new Map(logs.map((l) => [l.date, l]))
  const key = `${view.y}-${String(view.m + 1).padStart(2, '0')}`
  const isFirstMonth = key <= firstMonth
  const onCurrentMonth = view.y === todayDate.getFullYear() && view.m === todayDate.getMonth()

  const step = (delta) =>
    setView(({ y, m }) => {
      const d = new Date(y, m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })

  // Six rows from the Sunday on or before the 1st — the shape react-native-calendars renders, and
  // the reason the trailing days of the previous month are in the grid at all.
  const gridStart = new Date(view.y, view.m, 1)
  gridStart.setDate(1 - gridStart.getDay())
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    const date = iso(d)
    const log = byDate.get(date)
    return {
      date,
      day: d.getDate(),
      dow: d.getDay(),
      outside: d.getMonth() !== view.m,
      marked: Boolean(log),
      goalMet: log?.goalMet === true,
      isToday: date === today,
      future: date > today,
    }
  })
  const weeks = Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7))

  return (
    <div className="m-st-calendar">
      <MonthHeader
        month={`${MONTHS[view.m]} ${view.y}`}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        disablePrev={isFirstMonth}
        disableNext={onCurrentMonth}
        label={`Reading streaks for ${MONTHS[view.m]} ${view.y}`}
      />

      <div className="m-st-weekdays">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="m-st-weekday">
            {d}
          </span>
        ))}
      </div>

      {weeks.map((week, wi) => (
        <div key={wi} className="m-st-week">
          {week.map((c) => {
            const prev = byDate.has(
              iso(new Date(new Date(`${c.date}T00:00:00`).getTime() - 86400000)),
            )
            const next = byDate.has(
              iso(new Date(new Date(`${c.date}T00:00:00`).getTime() + 86400000)),
            )
            const opensRun = c.marked && (!prev || c.dow === 0)
            const closesRun = c.marked && (!next || c.dow === 6)
            const showStar =
              hasGoal && !c.outside && !c.future && goalStartDate != null && c.date >= goalStartDate

            return (
              /* The WASH lives on the grid cell, not on the 36pt disc — consecutive cells then
                 butt together with no gap, so the run is one continuous pill and there is nothing
                 to bridge. The disc inside stays 36pt and carries today's circle. */
              <span
                key={c.date}
                className={[
                  'm-st-cell',
                  c.marked && !c.outside && 'is-marked',
                  opensRun && !c.outside && 'opens-run',
                  closesRun && !c.outside && 'closes-run',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span
                  className={[
                    'm-st-day',
                    c.isToday && 'is-today',
                    c.isToday && c.marked && 'is-today-logged',
                    c.marked && !c.outside && 'is-marked',
                    c.outside && 'is-outside',
                    c.future && 'is-future',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {c.outside ? (
                    <Img
                      name="calendarDot"
                      size={10}
                      className="m-st-outside-dot"
                      tint={c.marked ? 'var(--m-accent-tab-bg)' : 'var(--m-grey-light-4)'}
                    />
                  ) : (
                    <span className="m-st-daynum">{c.day}</span>
                  )}
                </span>
                {showStar && (
                  <span className="m-st-star">
                    {/* `stroke={white} strokeWidth={2}` is in the source — the halo is what keeps
                        the star legible where it overlaps the streak bar. `paint-order` lives in
                        the stylesheet rather than here: StarGoalIcon spreads `...rest` AFTER its
                        own `style={{ color }}`, so passing a `style` prop silently replaces the
                        colour and the star renders in whatever it inherits. */}
                    <StarGoalIcon
                      width={14}
                      height={14}
                      color={c.goalMet ? 'var(--m-yellow)' : 'var(--m-grey-light-1)'}
                      stroke="var(--m-white)"
                      strokeWidth={2}
                    />
                  </span>
                )}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function Streaks({ streaks, timesGoalMet, calendar, hasGoal = true }) {
  const cards = [
    {
      key: 'currentStreak',
      value: `${streaks.currentStreak} Days`,
      filled: streaks.currentStreak > 1,
    },
    {
      key: 'longestStreak',
      value: `${streaks.longestStreak} Days`,
      filled: streaks.longestStreak > 1,
    },
    ...(timesGoalMet != null ? [{ key: 'goal', goal: true }] : []),
    {
      key: 'longestTitle',
      value: `${streaks.longestTitle} Pages`,
      filled: streaks.longestTitle > 0,
    },
    { key: 'mostPages', value: `${streaks.mostPages} Pages`, filled: streaks.mostPages > 0 },
    {
      key: 'longestSession',
      value: streaks.longestSession,
      filled: streaks.longestSession !== '0:00',
    },
  ]

  return (
    <div className="m-st">
      {/* On the shared Carousel — this screen's own snap-carousel treatment is where that
          component's defaults came from, so nothing changes here but the swipe. */}
      <Carousel
        items={cards}
        keyFor={(c) => c.key}
        label="Your streaks"
        renderItem={(c) =>
          c.goal ? (
            <TimesGoalMetCard count={timesGoalMet} />
          ) : (
            <StreakCard def={CARD_DEFS[c.key]} value={c.value} filled={c.filled} />
          )
        }
      />

      <StreakCalendar {...calendar} hasGoal={hasGoal} />
    </div>
  )
}
