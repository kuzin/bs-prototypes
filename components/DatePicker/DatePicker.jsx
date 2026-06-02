import * as Popover from '@radix-ui/react-popover'
import { useState, useId } from 'react'
import { useFieldProps } from '@components/FormContext/FormContext'
import { Icon } from '@components/Icon/Icon'
import '@components/DatePicker/Picker.css'

/**
 * DatePicker — calendar popup for date selection.
 *
 * <DatePicker
 *   value={date}          // Date object, ISO string, or null
 *   onChange={setDate}    // called with a Date object
 *   label="Due date"
 *   placeholder="Pick a date"
 *   size="md"             // sm | md | lg
 *   disabled={false}
 * />
 */

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
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

function parseDate(v) {
  if (!v) return null
  if (v instanceof Date) return isNaN(v) ? null : v
  const d = new Date(v)
  return isNaN(d) ? null : d
}

function isSameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatDisplay(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  size = 'md',
  label,
  disabled = false,
  clearable = true,
  className = '',
}) {
  const { id: fieldId, hasError } = useFieldProps()
  const selfId = useId()
  const triggerId = fieldId || selfId

  const selected = parseDate(value)
  const today = new Date()

  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => {
    const d = parseDate(value) || new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  const { year, month } = view

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = new Date(year, month, 1).getDay()
  // Pad of trailing days to complete last row
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7

  const prevMonth = () => {
    setView((v) => {
      const d = new Date(v.year, v.month - 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }
  const nextMonth = () => {
    setView((v) => {
      const d = new Date(v.year, v.month + 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  const selectDay = (day) => {
    const d = new Date(year, month, day)
    onChange?.(d)
    setOpen(false)
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    // Reset view to selected date (or today) when reopening
    if (isOpen) {
      const d = parseDate(value) || new Date()
      setView({ year: d.getFullYear(), month: d.getMonth() })
    }
  }

  // Build cell array: null = empty, number = day-of-month
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const day = i - firstWeekday + 1
    return day >= 1 && day <= daysInMonth ? day : null
  })

  const trigger = (
    <Popover.Trigger asChild>
      <button
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-label={label || placeholder}
        className={`pck-trigger pck-trigger--${size}${hasError ? ' pck-trigger--error' : ''}`}
      >
        <span className={selected ? '' : 'pck-placeholder'}>
          {selected ? formatDisplay(selected) : placeholder}
        </span>
        {/* Calendar icon */}
        <Icon name="calendar" size={14} className="pck-icon" />
      </button>
    </Popover.Trigger>
  )

  const calendar = (
    <Popover.Portal>
      <Popover.Content
        className="dpk-content"
        sideOffset={4}
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Month nav */}
        <div className="dpk-nav">
          <button
            type="button"
            className="dpk-nav-btn"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <Icon name="chevron-left" size={12} stroke={2.2} />
          </button>
          <span className="dpk-month-label">
            {MONTHS[month]} {year}
          </span>
          <button type="button" className="dpk-nav-btn" onClick={nextMonth} aria-label="Next month">
            <Icon name="chevron-right" size={12} stroke={2.2} />
          </button>
        </div>

        {/* Day grid */}
        <div className="dpk-grid">
          {WEEKDAYS.map((d) => (
            <span key={d} className="dpk-day-hdr">
              {d}
            </span>
          ))}
          {cells.map((day, i) => {
            if (!day) return <span key={`empty-${i}`} />
            const date = new Date(year, month, day)
            const isSel = isSameDay(date, selected)
            const isToday = isSameDay(date, today)
            return (
              <button
                key={day}
                type="button"
                onClick={() => selectDay(day)}
                className={[
                  'dpk-day',
                  isSel && 'dpk-day--sel',
                  isToday && !isSel && 'dpk-day--today',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {day}
              </button>
            )
          })}
        </div>

        {/* Footer: clear */}
        {clearable && selected && (
          <div className="dpk-footer">
            <button
              type="button"
              className="dpk-clear"
              onClick={() => {
                onChange?.(null)
                setOpen(false)
              }}
            >
              Clear
            </button>
          </div>
        )}
      </Popover.Content>
    </Popover.Portal>
  )

  const picker = (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      {trigger}
      {calendar}
    </Popover.Root>
  )

  if (!label) return picker
  return (
    <div className={`frm-labeled${className ? ` ${className}` : ''}`}>
      <label className="frm-self-label" htmlFor={triggerId}>
        {label}
      </label>
      {picker}
    </div>
  )
}
