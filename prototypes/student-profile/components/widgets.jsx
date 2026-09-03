// Student-Profile chart widgets — bespoke visualizations used only by this
// prototype: the intrinsic/extrinsic donut rings, the reading-activity heatmap,
// and the weekly goal tracker. Styles live in ../BeanstackProfile.css (imported
// by the prototype root + the Pattern Library catalog). Catalogued in the
// Pattern Library under the "Student Profile" group.
import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'

// Extrinsic-motivation accent — shared by the split donut and the motivator
// rankings so intrinsic vs. extrinsic reads consistently.
export const EXTRINSIC_COLOR = '#94A3B8'

export function DonutChart({ value, max, label, color, size = 84, trend }) {
  const sw = 9
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * Math.max(0, Math.min(1, value / max))
  const mid = size / 2
  return (
    <div className="bp-donut-wrap">
      <div className="bp-donut-chart" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={mid} cy={mid} r={r} fill="none" stroke="#E5E7EB" strokeWidth={sw} />
          <circle
            cx={mid}
            cy={mid}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ - dash}`}
            transform={`rotate(-90 ${mid} ${mid})`}
          />
        </svg>
        <div className="bp-donut-center">
          <span className="bp-donut-val">{value}</span>
          <span className="bp-donut-max">/{max}</span>
        </div>
      </div>
      <div className="bp-donut-label">{label}</div>
      {trend}
    </div>
  )
}

export function SplitDonutChart({
  intrinsicVal,
  extrinsicVal,
  max,
  label,
  intrinsicColor,
  size = 84,
  trend,
}) {
  const sw = 9
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const mid = size / 2
  const dash1 = circ * Math.max(0, Math.min(1, intrinsicVal / max))
  const dash2 = circ * Math.max(0, Math.min(1, extrinsicVal / max))
  const angle1 = (intrinsicVal / max) * 360
  const total = Math.round((intrinsicVal + extrinsicVal) * 10) / 10
  return (
    <div className="bp-donut-wrap">
      <div className="bp-donut-chart" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={mid} cy={mid} r={r} fill="none" stroke="#E5E7EB" strokeWidth={sw} />
          <circle
            cx={mid}
            cy={mid}
            r={r}
            fill="none"
            stroke={intrinsicColor}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={`${dash1} ${circ - dash1}`}
            transform={`rotate(-90 ${mid} ${mid})`}
          />
          <circle
            cx={mid}
            cy={mid}
            r={r}
            fill="none"
            stroke={EXTRINSIC_COLOR}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={`${dash2} ${circ - dash2}`}
            transform={`rotate(${-90 + angle1} ${mid} ${mid})`}
          />
        </svg>
        <div className="bp-donut-center">
          <span className="bp-donut-val">{total}</span>
          <span className="bp-donut-max">/{max}</span>
        </div>
      </div>
      <div className="bp-donut-label">{label}</div>
      {trend}
    </div>
  )
}

// One month at a time, in the same shape as the shared <DatePicker>: weekdays
// across, weeks down. The grid spans the card — seven columns share whatever
// width there is — and cells stay square between these two heights, so the
// calendar can't grow the way an unbounded square grid did. The CSS reads all
// three back off `--hm-row-min` / `--hm-row-max` / `--hm-gap`.
const ROW_MIN = 28
const ROW_MAX = 36
// The gap is what a merged streak has to close, so it has to be wide enough to
// see: at 4px a 121px-wide cell in a full-screen card read as joined to its
// neighbour whether it was or not.
const GAP = 6
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const STREAK_LOOKBACK = 60 // days of run-up, so a streak crossing the 1st counts
const STREAK_LOOKAHEAD = 31 // and of run-out, so one crossing the last does too

// Dates are parsed from `YYYY-MM-DD` — UTC midnight — and keys go back out
// through `toISOString`, so every step here is a UTC step. Walking with the
// local setters drifts an hour across a DST boundary and lands a cell on the
// wrong day.
const dayKey = (d) => d.toISOString().slice(0, 10)
const addDays = (d, n) => {
  const out = new Date(d)
  out.setUTCDate(out.getUTCDate() + n)
  return out
}

export function ReadingHeatmap({ goalMinutes, color, data }) {
  const today = new Date('2025-05-15')
  const FIRST = { year: 2023, month: 8 } // Sep 2023, the first month on record
  const [view, setView] = useState({ year: today.getUTCFullYear(), month: today.getUTCMonth() })

  const first = new Date(Date.UTC(view.year, view.month, 1))
  const last = new Date(Date.UTC(view.year, view.month + 1, 0))
  const atStart = view.year === FIRST.year && view.month === FIRST.month
  const atEnd = view.year === today.getUTCFullYear() && view.month === today.getUTCMonth()

  const step = (n) => {
    const d = new Date(Date.UTC(view.year, view.month + n, 1))
    setView({ year: d.getUTCFullYear(), month: d.getUTCMonth() })
  }

  // Streaks are a property of the reading, not of the window: the walk starts
  // well before the 1st and runs past the last, so a streak that opened in
  // the previous month or carries into the next one arrives here at its real
  // length. `streakLen` holds that length for *every* day of the run — the
  // day-so-far count it used to hold left the opening day of a run reading as
  // a 1-day streak, which is to say not a streak at all.
  const streakLen = {}
  let group = []
  const flush = () => {
    group.forEach((k) => (streakLen[k] = group.length))
    group = []
  }
  const walkEnd = addDays(last, STREAK_LOOKAHEAD) < today ? addDays(last, STREAK_LOOKAHEAD) : today
  for (let d = addDays(first, -STREAK_LOOKBACK); d <= walkEnd; d = addDays(d, 1)) {
    const key = dayKey(d)
    if ((data[key] ?? 0) > 0) group.push(key)
    else flush()
  }
  flush()

  const isStreak = (d) => streakLen[dayKey(d)] >= 2

  // Leading blanks put the 1st under its weekday; trailing blanks keep the
  // last row a full seven wide.
  const cells = Array.from({ length: first.getUTCDay() }, () => null)
  for (let d = 1; d <= last.getUTCDate(); d++) {
    const date = new Date(Date.UTC(view.year, view.month, d))
    const key = dayKey(date)
    cells.push({
      key,
      date,
      day: d,
      mins: data[key] ?? 0,
      future: date > today,
      streak: streakLen[key] >= 2 ? streakLen[key] : 0,
      // Whether the rail carries on into the next cell — which needs a next
      // cell to carry on into. The grid wraps at the week, so a run spanning
      // Saturday→Sunday caps off at the row's edge, and one crossing the 1st
      // or the last caps off at the month's; in both cases there is nothing
      // on the other side to draw across.
      joinL: d > 1 && date.getUTCDay() !== 0 && isStreak(addDays(date, -1)),
      joinR: d < last.getUTCDate() && date.getUTCDay() !== 6 && isStreak(addDays(date, 1)),
    })
  }
  while (cells.length % 7) cells.push(null)

  return (
    <div
      className="bp-heatmap"
      style={{
        '--hm-row-min': `${ROW_MIN}px`,
        '--hm-row-max': `${ROW_MAX}px`,
        '--hm-gap': `${GAP}px`,
      }}
    >
      <div className="bp-heatmap-nav">
        <button
          className="bp-heatmap-nav-btn"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label="Previous month"
        >
          <Icon name="chevron-left" size={11} />
        </button>
        <span className="bp-heatmap-nav-label">
          {first.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
        </span>
        <button
          className="bp-heatmap-nav-btn"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label="Next month"
        >
          <Icon name="chevron-right" size={11} />
        </button>
      </div>
      <div className="bp-heatmap-grid">
        {WEEKDAYS.map((d) => (
          <span key={d} className="bp-heatmap-wd">
            {d}
          </span>
        ))}
        {cells.map((cell, i) => {
          if (!cell) return <span key={`blank-${i}`} className="bp-heatmap-blank" />
          const goalMet = !cell.future && cell.mins >= goalMinutes
          const inStreak = !cell.future && cell.streak > 0
          const label = cell.date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
          })
          const minsTxt = cell.mins > 0 ? `${cell.mins} min` : 'No reading'
          const badges = [goalMet && 'Goal met', inStreak && `🔥 ${cell.streak}-day streak`]
            .filter(Boolean)
            .join(' · ')
          return (
            <div
              key={cell.key}
              className={[
                'bp-heatmap-cell',
                cell.mins > 0 && !cell.future && 'bp-heatmap-cell--read',
                goalMet && 'bp-heatmap-cell--goal',
                inStreak && 'bp-heatmap-cell--streak',
                inStreak && cell.joinL && 'bp-heatmap-cell--streak-l',
                inStreak && cell.joinR && 'bp-heatmap-cell--streak-r',
                cell.future && 'bp-heatmap-cell--future',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                '--cell-bg': cell.future ? 'transparent' : cell.mins > 0 ? color : '#EAECF0',
              }}
              data-tooltip={
                cell.future
                  ? undefined
                  : badges
                    ? `${label} · ${minsTxt} · ${badges}`
                    : `${label} · ${minsTxt}`
              }
            >
              <span className="bp-heatmap-daynum">{cell.day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function GoalTracker({ week, goalMinutes }) {
  return (
    <div className="bp-goal-tracker">
      {week.days.map((d, i) => {
        const pending = d.minutes === null
        const logged = !pending && d.minutes > 0
        const met = !pending && d.minutes >= goalMinutes
        const isToday =
          pending && week.current && i === week.days.findIndex((x) => x.minutes === null)
        const prevMet =
          i > 0 && week.days[i - 1].minutes !== null && week.days[i - 1].minutes >= goalMinutes

        // A day with reading on it never looks like a day without: `--partial`
        // keeps short-of-goal sessions visible instead of collapsing them into
        // the same grey as a zero day.
        const circleCls = met
          ? 'bp-goal-circle--met'
          : isToday
            ? 'bp-goal-circle--today'
            : pending
              ? 'bp-goal-circle--future'
              : logged
                ? 'bp-goal-circle--partial'
                : 'bp-goal-circle--missed'

        return (
          <div key={i} className="bp-goal-day">
            <div className="bp-goal-mins-area">
              {logged && (
                <span className={`bp-goal-mins${met ? '' : ' bp-goal-mins--partial'}`}>
                  {d.minutes}m
                </span>
              )}
            </div>
            <div className="bp-goal-circle-row">
              {i > 0 && (
                <div className={`bp-goal-conn${met && prevMet ? ' bp-goal-conn--lit' : ''}`} />
              )}
              <div className={`bp-goal-circle ${circleCls}`}>★</div>
            </div>
            <span className={`bp-goal-day-label${isToday ? ' bp-goal-day-label--today' : ''}`}>
              {d.day}
            </span>
          </div>
        )
      })}
    </div>
  )
}
