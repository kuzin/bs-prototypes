import { Icon } from '@components/Icon/Icon'
import { IconButton } from '@components/Primitives/Primitives'
import '@components/Table/Table.css'
import '@components/Primitives/Primitives.css'
import './DailyReadingTracker.css'

/**
 * Daily Reading tracker — the class-page grid of who hit their daily reading
 * goal, ported from the app's `.daily-reading` table
 * (bs-product admin/_admin_daily_readings.scss + `NewAdmin/DailyReading`).
 *
 * Ten columns (Student · Goal · Average · Mon–Sun) is a desktop grid, and the
 * app only wraps it in an `overflow: auto` box — so on a phone you swipe a
 * ten-column table sideways and lose the names. This component keeps that table
 * on wide screens and, at ≤ 699px, renders the same rows as a card list: one
 * card per reader with the week as a seven-dot strip, which fits a 375px screen
 * without scrolling. Both trees are always in the DOM and swapped in CSS, so
 * there is no resize flash and `@media print` still gets the table.
 *
 *   <DailyReadingTracker
 *     weekLabel="5/11 – 5/17 (This Week)"
 *     onPrevWeek={…}
 *     rows={[{ key: 'marcus', rank: 1, name: 'Marcus Chen', goal: 30,
 *              average: 98, tone: 'blue',
 *              days: [true, true, true, true, null, null, true],
 *              onOpen: () => … }]}
 *     average={{ average: '67%', days: ['58%', '50%', …] }}
 *   />
 *
 * A day is `true` (goal met — a check disc), `null` (nothing logged — a dash)
 * or a percentage string / number (a tone lozenge). `tone` is the row's colour
 * band: `green` | `blue` | `orange` | `red`.
 *
 * @param {object[]} rows      one per reader (see above)
 * @param {object}   average   the class-average footer row, or omit to hide it
 * @param {string[]} days      column labels, Monday first
 * @param {boolean}  showGoal  keep the Goal column (default true)
 */

export const DR_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const DR_LEGEND = [
  { color: '#EF4444', label: '● 0–33%' },
  { color: '#F59E0B', label: '● 34–66%' },
  { color: '#3B82F6', label: '● 66–99%' },
  { color: '#10B981', label: '✓ 100%' },
]

// The top three carry a medal in the live table; everyone below is a plain
// number on the same 24px so the names stay aligned.
function rankClass(rank) {
  return rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'plain'
}

function pct(value) {
  return typeof value === 'number' ? `${value}%` : value
}

/** One day's result, in either presentation. */
function DayValue({ value, tone }) {
  if (value === null || value === undefined) return <span className="drt-dash">–</span>
  if (value === true)
    return (
      <span className="drt-check">
        <Icon name="check" size={10} />
      </span>
    )
  return <span className={`drt-pct drt-pct--${tone === 'red' ? 'red' : 'orange'}`}>{value}</span>
}

function ReaderName({ row }) {
  if (!row.onOpen) return <span className="drt-name drt-name--static">{row.name}</span>
  return (
    <button
      type="button"
      className="drt-name"
      title={`Open ${row.name}'s profile`}
      onClick={(e) => {
        e.stopPropagation()
        row.onOpen()
      }}
    >
      {row.name}
    </button>
  )
}

function GoalCell({ row, onEditGoal }) {
  return (
    <div className="drt-goal-cell">
      <span className="drt-goal-val">{row.goal}m</span>
      {onEditGoal !== false && (
        <IconButton
          variant="ghost"
          size="sm"
          title="Edit goal"
          onClick={(e) => {
            e.stopPropagation()
            onEditGoal?.(row)
          }}
        >
          <Icon name="pencil" size={11} />
        </IconButton>
      )}
    </div>
  )
}

export function DailyReadingTracker({
  weekLabel,
  onPrevWeek,
  onNextWeek,
  prevDisabled = false,
  nextDisabled = true,
  rows = [],
  average,
  days = DR_DAYS,
  legend = DR_LEGEND,
  showGoal = true,
  onEditGoal,
  className = '',
}) {
  return (
    <div className={`drt ${className}`.trim()}>
      {/* `.daily-reading__week-selector`: 10px 20px, split ends, $gray250 rule */}
      <div className="drt-week-nav">
        <IconButton aria-label="Previous week" disabled={prevDisabled} onClick={onPrevWeek}>
          <Icon name="chevron-left" size={16} />
        </IconButton>
        <span className="drt-week-label">{weekLabel}</span>
        {/* Disabled on the current week, like the live page. */}
        <IconButton aria-label="Next week" disabled={nextDisabled} onClick={onNextWeek}>
          <Icon name="chevron-right" size={16} />
        </IconButton>
      </div>

      {/* ── Wide: the app's table, in the app's own scroll box ──────────── */}
      <div className="drt-table-wrap">
        <table className="tbl tbl--compact tbl--flush drt-table">
          <thead>
            <tr>
              {/* Student, Goal and Average all carry a fixed width (in CSS, via
                `--drt-*-w`) rather than a percentage: the first two are the
                sticky columns, so their widths have to be a number the sticky
                offset can be written against. Average needs one of its own
                because under `table-layout: fixed` it would otherwise share the
                day columns' slot, and its label is wider than a day's — which
                is what had it spilling over "Mon" at every width. */}
              <th className="tbl-th drt-th--name">Student</th>
              {showGoal && <th className="tbl-th drt-th--goal">Goal</th>}
              <th className="tbl-th tbl-cell--center drt-th--avg">Average</th>
              {days.map((d) => (
                <th key={d} className="tbl-th tbl-cell--center">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.key}
                className={`tbl-row${row.onOpen ? ' tbl-row--clickable' : ''}`}
                onClick={row.onOpen}
                onKeyDown={row.onOpen ? (e) => e.key === 'Enter' && row.onOpen() : undefined}
                role={row.onOpen ? 'button' : undefined}
                tabIndex={row.onOpen ? 0 : undefined}
              >
                <td className="tbl-td drt-name-cell">
                  <div className="drt-student-cell">
                    <span className={`drt-rank drt-rank--${rankClass(row.rank)}`}>{row.rank}</span>
                    <ReaderName row={row} />
                  </div>
                </td>
                {showGoal && (
                  <td className="tbl-td drt-td--goal">
                    <GoalCell row={row} onEditGoal={onEditGoal} />
                  </td>
                )}
                <td className="tbl-td tbl-cell--center">
                  <span className={`drt-pct drt-pct--${row.tone}`}>{pct(row.average)}</span>
                </td>
                {row.days.map((d, i) => (
                  <td key={i} className="tbl-td tbl-cell--center">
                    <DayValue value={d} tone={row.tone} />
                  </td>
                ))}
              </tr>
            ))}
            {average && (
              <tr className="drt-avg-row">
                <td className="tbl-td drt-name-cell">{average.label ?? 'Class Average'}</td>
                {showGoal && <td className="tbl-td drt-td--goal" />}
                <td className="tbl-td tbl-cell--center">{pct(average.average)}</td>
                {average.days.map((v, i) => (
                  <td key={i} className="tbl-td tbl-cell--center">
                    {v ?? '–'}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Narrow: the same week, one card per reader ───────────────────── */}
      <ul className="drt-cards">
        {rows.map((row) => (
          <li key={row.key} className="drt-card">
            <div className="drt-card-head">
              <span className={`drt-rank drt-rank--${rankClass(row.rank)}`}>{row.rank}</span>
              <ReaderName row={row} />
              {showGoal && (
                <span className="drt-card-goal">
                  <GoalCell row={row} onEditGoal={onEditGoal} />
                </span>
              )}
              <span className={`drt-pct drt-pct--${row.tone} drt-card-avg`}>
                {pct(row.average)}
              </span>
            </div>
            <div className="drt-card-week">
              {row.days.map((d, i) => (
                <div key={i} className="drt-card-day">
                  <span className="drt-card-day-label">{days[i]}</span>
                  <DayValue value={d} tone={row.tone} />
                </div>
              ))}
            </div>
          </li>
        ))}
        {average && (
          <li className="drt-card drt-card--avg">
            <div className="drt-card-head">
              <span className="drt-card-avg-name">{average.label ?? 'Class Average'}</span>
              <span className="drt-card-avg">{pct(average.average)}</span>
            </div>
            <div className="drt-card-week">
              {average.days.map((v, i) => (
                <div key={i} className="drt-card-day">
                  <span className="drt-card-day-label">{days[i]}</span>
                  <span className="drt-card-day-avg">{v ?? '–'}</span>
                </div>
              ))}
            </div>
          </li>
        )}
      </ul>

      {legend?.length > 0 && (
        <div className="drt-legend">
          {legend.map((l) => (
            <span key={l.label} style={{ color: l.color }}>
              {l.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
