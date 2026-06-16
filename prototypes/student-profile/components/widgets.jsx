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

export function DonutChart({ value, max, label, color, size = 84 }) {
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
    </div>
  )
}

export function ReadingHeatmap({ goalMinutes, color, data }) {
  const [monthOffset, setMonthOffset] = useState(0) // 0 = most recent 3-month window
  const MAX_OFFSET = 19 // go back to Sep 2023

  const today = new Date('2025-05-15')

  // End of window: last day of (today's month − monthOffset)
  const windowEndMonth = new Date(today.getFullYear(), today.getMonth() - monthOffset + 1, 0)
  const windowEnd = monthOffset === 0 ? today : windowEndMonth

  // Start of window: first day of the month 3 months before windowEnd's month
  const windowStart = new Date(windowEndMonth.getFullYear(), windowEndMonth.getMonth() - 3, 1)

  // Grid starts on the Sunday on or before windowStart
  const gridStart = new Date(windowStart)
  gridStart.setDate(gridStart.getDate() - gridStart.getDay())

  const FIXED_WEEKS = 18 // always render exactly 18 columns so grid height never jumps
  const weeks = []
  const cur = new Date(gridStart)
  while (weeks.length < FIXED_WEEKS) {
    const week = []
    for (let i = 0; i < 7; i++) {
      const key = cur.toISOString().slice(0, 10)
      const inRange = cur >= windowStart && cur <= windowEnd
      week.push({
        key,
        mins: inRange ? (data[key] ?? 0) : 0,
        inRange,
        month: cur.getMonth(),
        dateObj: new Date(cur),
      })
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }

  const allDays = weeks
    .flat()
    .filter((d) => d.inRange)
    .sort((a, b) => (a.key < b.key ? -1 : 1))
  const streakMap = {}
  let run = 0
  allDays.forEach((d) => {
    run = d.mins > 0 ? run + 1 : 0
    streakMap[d.key] = run
  })

  const monthLabels = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const first = week.find((d) => d.inRange)
    if (first && first.month !== lastMonth) {
      monthLabels.push({ wi, label: first.dateObj.toLocaleString('en-US', { month: 'short' }) })
      lastMonth = first.month
    }
  })

  // Nav label: "Mar – May 2025" or "Dec 2024 – Feb 2025"
  const fmtMonth = (d) => d.toLocaleString('en-US', { month: 'short' })
  const navLabel =
    windowStart.getFullYear() === windowEnd.getFullYear()
      ? `${fmtMonth(windowStart)} – ${fmtMonth(windowEnd)} ${windowEnd.getFullYear()}`
      : `${fmtMonth(windowStart)} ${windowStart.getFullYear()} – ${fmtMonth(windowEnd)} ${windowEnd.getFullYear()}`

  const getBg = ({ mins, inRange }) => {
    if (!inRange || mins === undefined) return 'transparent'
    if (mins === 0) return '#EAECF0'
    return color
  }

  const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  return (
    <div className="bp-heatmap">
      <div className="bp-heatmap-nav">
        <button
          className="bp-heatmap-nav-btn"
          onClick={() => setMonthOffset((o) => Math.min(o + 1, MAX_OFFSET))}
          disabled={monthOffset >= MAX_OFFSET}
          aria-label="Previous 4 months"
        >
          <Icon name="chevron-left" size={11} />
        </button>
        <span className="bp-heatmap-nav-label">{navLabel}</span>
        <button
          className="bp-heatmap-nav-btn"
          onClick={() => setMonthOffset((o) => Math.max(o - 1, 0))}
          disabled={monthOffset === 0}
          aria-label="Next 4 months"
        >
          <Icon name="chevron-right" size={11} />
        </button>
      </div>
      <div className="bp-heatmap-body">
        <div className="bp-heatmap-day-labels">
          {DAY_LABELS.map((d, i) => (
            <span key={i} className="bp-heatmap-day-label">
              {d}
            </span>
          ))}
        </div>
        <div className="bp-heatmap-grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="bp-heatmap-col">
              {week.map((day, di) => {
                const goalMet = day.inRange && day.mins >= goalMinutes
                const inStreak = day.inRange && streakMap[day.key] >= 2
                let cls = 'bp-heatmap-cell'
                if (goalMet) cls += ' bp-heatmap-cell--goal'
                if (inStreak) cls += ' bp-heatmap-cell--streak'
                let tip = null
                if (day.inRange) {
                  const label = day.dateObj.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                  const minsTxt = day.mins > 0 ? `${day.mins} min` : 'No reading'
                  const badges = [
                    goalMet && 'Goal met',
                    inStreak && `🔥 ${streakMap[day.key]}-day streak`,
                  ]
                    .filter(Boolean)
                    .join(' · ')
                  tip = badges ? `${label} · ${minsTxt} · ${badges}` : `${label} · ${minsTxt}`
                }
                return (
                  <div
                    key={di}
                    className={cls}
                    style={{ '--cell-bg': getBg(day) }}
                    data-tooltip={tip ?? undefined}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="bp-heatmap-months">
        <div className="bp-heatmap-month-spacer" />
        {monthLabels.map((m, i) => {
          const span = (monthLabels[i + 1]?.wi ?? weeks.length) - m.wi
          return (
            <div key={i} className="bp-heatmap-month-label" style={{ flex: span }}>
              {m.label}
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
        const met = d.minutes !== null && d.minutes >= goalMinutes
        const pending = d.minutes === null
        const isToday =
          pending && week.current && i === week.days.findIndex((x) => x.minutes === null)
        const prevMet =
          i > 0 && week.days[i - 1].minutes !== null && week.days[i - 1].minutes >= goalMinutes

        const circleCls = met
          ? 'bp-goal-circle--met'
          : isToday
            ? 'bp-goal-circle--today'
            : pending
              ? 'bp-goal-circle--future'
              : 'bp-goal-circle--missed'

        return (
          <div key={i} className="bp-goal-day">
            <div className="bp-goal-mins-area">
              {met && <span className="bp-goal-mins">{d.minutes}m</span>}
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
