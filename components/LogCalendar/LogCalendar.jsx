import { useEffect, useState } from 'react'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { Modal, ModalClose } from '@components/Modal/Modal'

import './LogCalendar.css'
import '@components/Button/Button.css'
import '@components/Modal/Modal.css'

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

// The app's cap, in `book_logger.js`: 31 dates in one log, no more.
const MAX_DATES = 31

const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const pad = (n) => String(n).padStart(2, '0')
const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

/** The six-week grid a month is drawn on, starting on the Sunday before it. */
function monthGrid(year, month) {
  const first = new Date(year, month, 1)
  const start = addDays(first, -first.getDay())
  const weeks = []
  for (let w = 0; w < 6; w++) {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(start, w * 7 + i)))
  }
  return weeks
}

/**
 * How the app writes a set of dates back onto the form
 * (`generateReadableSelectedDates`): today is "Today", everything else is its
 * full date, and several of them are simply listed.
 */
export function readableDates(dates, today = new Date()) {
  if (dates.length === 0) return 'Today'
  const t = iso(midnight(today))
  return dates
    .slice()
    .sort()
    .map((d) => {
      if (d === t) return 'Today'
      const [y, m, day] = d.split('-').map(Number)
      return `${MONTHS[m - 1]} ${day}, ${y}`
    })
    .join(', ')
}

/**
 * **Change Date** — `logged_books/_logging_calendar`, the calendar behind the
 * logging form's "Select Date".
 *
 * It is a real calendar rather than a list of the last few days, because the
 * app lets you log backwards: a reader who forgot all week opens this and ticks
 * five days at once. What it has to say while you do that is most of the
 * component —
 *
 *   * days you have **already logged** carry a dot, so you can see the gap you
 *     are filling;
 *   * **future** days are not selectable at all;
 *   * days **older than the site's backlogging window** are refused with the
 *     app's own line about how far back you may go;
 *   * more than **31** dates is refused too;
 *   * and where a site has a Days log type, **Select Entire Month** ticks the
 *     whole page in one go (`multiclick`).
 *
 *   <LogCalendar
 *     open={open}
 *     value={['2026-09-15']}
 *     logged={loggedISODates}
 *     multi={site.multiDate}
 *     backlogDays={site.backlogDays}
 *     onSave={setDates}
 *     onClose={close}
 *   />
 */
export function LogCalendar({
  open,
  value = [],
  logged = [],
  multi = false,
  backlogDays = 14,
  today = new Date(),
  onSave,
  onClose,
}) {
  const now = midnight(today)
  const [picked, setPicked] = useState(value)
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() })
  // The two refusals, shown under the grid where the app shows them.
  const [error, setError] = useState(null)

  // Each opening starts from what the form currently holds, on that month.
  useEffect(() => {
    if (!open) return
    setPicked(value)
    setError(null)
    const first = value.slice().sort()[0]
    setView(
      first
        ? { year: Number(first.slice(0, 4)), month: Number(first.slice(5, 7)) - 1 }
        : { year: now.getFullYear(), month: now.getMonth() },
    )
    // Only when the modal opens — re-syncing on every parent render would fight
    // the reader mid-selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const loggedSet = new Set(logged)
  const earliest = iso(addDays(now, -backlogDays))
  const todayIso = iso(now)
  // A year back is as far as the app's own calendar will go.
  const floor = new Date(now.getFullYear(), now.getMonth() - 12, 1)
  const viewStart = new Date(view.year, view.month, 1)
  const canGoBack = viewStart > floor
  const canGoForward = viewStart < new Date(now.getFullYear(), now.getMonth(), 1)

  function step(by) {
    setError(null)
    setView((v) => {
      const d = new Date(v.year, v.month + by, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  function toggle(key, selectable, tooOld) {
    if (!selectable) return
    if (tooOld) {
      setError('backlog')
      return
    }
    setError(null)
    setPicked((cur) => {
      if (cur.includes(key)) return cur.filter((d) => d !== key)
      if (!multi) return [key]
      if (cur.length >= MAX_DATES) {
        setError('limit')
        return cur
      }
      return [...cur, key]
    })
  }

  const weeks = monthGrid(view.year, view.month)
  // Every day of this month you are allowed to pick — what Select Entire Month
  // takes, and what tells it whether the month is already all ticked.
  const monthKeys = weeks
    .flat()
    .filter((d) => d.getMonth() === view.month && iso(d) <= todayIso && iso(d) >= earliest)
    .map(iso)
  const wholeMonth = monthKeys.length > 0 && monthKeys.every((k) => picked.includes(k))

  function toggleMonth() {
    setError(null)
    if (wholeMonth) {
      setPicked((cur) => cur.filter((d) => !monthKeys.includes(d)))
      return
    }
    setPicked((cur) => {
      const next = [...new Set([...cur, ...monthKeys])]
      if (next.length > MAX_DATES) {
        setError('limit')
        return next.slice(0, MAX_DATES)
      }
      return next
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="center"
      closeBadge
      className="lcal-modal"
      ariaLabel="Change date"
    >
      <ModalClose onClick={onClose} />
      <div className="modal-header">
        <h2 className="modal-title">Change Date</h2>
      </div>

      <div className="modal-body">
        <div className="lcal">
          <div className="lcal-head">
            <span className="lcal-month">
              {MONTHS[view.month]} {view.year}
            </span>
            <span className="lcal-nav">
              <button
                type="button"
                className="lcal-navbtn"
                onClick={() => step(-1)}
                disabled={!canGoBack}
                aria-label="Previous month"
              >
                <Icon name="chevron-left" size={16} stroke={2.2} />
              </button>
              <button
                type="button"
                className="lcal-navbtn"
                onClick={() => step(1)}
                disabled={!canGoForward}
                aria-label="Next month"
              >
                <Icon name="chevron-right" size={16} stroke={2.2} />
              </button>
            </span>
          </div>

          <div className="lcal-dow">
            {WEEKDAYS.map((d) => (
              <span key={d}>{d.slice(0, 1)}</span>
            ))}
          </div>

          <div className="lcal-grid">
            {weeks.flat().map((d) => {
              const key = iso(d)
              const outside = d.getMonth() !== view.month
              const future = key > todayIso
              const tooOld = key < earliest
              const selectable = !outside && !future
              const on = picked.includes(key)
              return (
                <button
                  key={key}
                  type="button"
                  className={[
                    'lcal-day',
                    outside && 'is-outside',
                    future && 'is-future',
                    tooOld && !outside && 'is-locked',
                    on && 'is-on',
                    key === todayIso && 'is-today',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  disabled={!selectable}
                  onClick={() => toggle(key, selectable, tooOld)}
                  aria-pressed={on}
                  aria-label={`${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}${
                    loggedSet.has(key)
                      ? ' — you have a logged entry on this date'
                      : ' — you do not have a logged entry on this date'
                  }`}
                >
                  <span className="lcal-num">{d.getDate()}</span>
                  {/* The app's own marker: a dot under a day you've logged. */}
                  {loggedSet.has(key) && !outside && <span className="lcal-dot" />}
                </button>
              )
            })}
          </div>

          {error === 'backlog' && (
            <p className="lcal-error">
              <Icon name="alert-circle" size={15} />
              You can log reading for up to {backlogDays} {backlogDays === 1 ? 'day' : 'days'} in
              the past. Select a new date or use today’s date by default.
            </p>
          )}
          {error === 'limit' && (
            <p className="lcal-error">
              <Icon name="alert-circle" size={15} />
              You can only log up to {MAX_DATES} days.
            </p>
          )}

          {multi && (
            <button type="button" className="lcal-selectall" onClick={toggleMonth}>
              {wholeMonth ? 'Deselect Entire Month' : 'Select Entire Month'}
            </button>
          )}
        </div>
      </div>

      <div className="modal-footer">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onSave?.(picked)}>Save Date</Button>
      </div>
    </Modal>
  )
}
