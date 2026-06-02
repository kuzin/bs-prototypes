import * as Popover from '@radix-ui/react-popover'
import { useState, useId, useRef, useEffect } from 'react'
import { useFieldProps } from '@components/FormContext/FormContext'
import { Icon } from '@components/Icon/Icon'
import '@components/DatePicker/Picker.css'

/**
 * TimePicker — scrollable list of time slots.
 *
 * <TimePicker
 *   value="14:30"         // 24-hour "HH:MM" string or null
 *   onChange={setTime}    // called with "HH:MM"
 *   label="Start time"
 *   step={30}             // minutes between slots: 15 | 30 | 60
 *   size="md"             // sm | md | lg
 *   disabled={false}
 * />
 */

function buildSlots(step) {
  const slots = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += step) {
      const hh = h % 12 || 12
      const mm = String(m).padStart(2, '0')
      const ampm = h < 12 ? 'AM' : 'PM'
      const value = `${String(h).padStart(2, '0')}:${mm}`
      slots.push({ value, label: `${hh}:${mm} ${ampm}` })
    }
  }
  return slots
}

function formatDisplay(v) {
  if (!v) return ''
  const [h, m] = v.split(':').map(Number)
  const hh = h % 12 || 12
  const mm = String(m).padStart(2, '0')
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${hh}:${mm} ${ampm}`
}

export function TimePicker({
  value,
  onChange,
  placeholder = 'Pick a time',
  size = 'md',
  label,
  disabled = false,
  step = 30,
  clearable = true,
  className = '',
}) {
  const { id: fieldId, hasError } = useFieldProps()
  const selfId = useId()
  const triggerId = fieldId || selfId

  const [open, setOpen] = useState(false)
  const selectedRef = useRef(null)
  const slots = buildSlots(step)

  // Scroll selected slot into view when the list opens
  useEffect(() => {
    if (open && selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: 'nearest' })
    }
  }, [open])

  const trigger = (
    <Popover.Trigger asChild>
      <button
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-label={label || placeholder}
        className={`pck-trigger pck-trigger--${size}${hasError ? ' pck-trigger--error' : ''}`}
      >
        <span className={value ? '' : 'pck-placeholder'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        {/* Clock icon */}
        <Icon name="clock" size={14} className="pck-icon" />
      </button>
    </Popover.Trigger>
  )

  const dropdown = (
    <Popover.Portal>
      <Popover.Content
        className="tpk-content"
        sideOffset={4}
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="tpk-list">
          {slots.map((slot) => {
            const isSel = slot.value === value
            return (
              <button
                key={slot.value}
                ref={isSel ? selectedRef : undefined}
                type="button"
                className={`tpk-item${isSel ? ' tpk-item--sel' : ''}`}
                onClick={() => {
                  onChange?.(slot.value)
                  setOpen(false)
                }}
              >
                {slot.label}
              </button>
            )
          })}
        </div>
        {clearable && value && (
          <div className="dpk-footer" style={{ margin: '0 4px 4px' }}>
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
    <Popover.Root open={open} onOpenChange={setOpen}>
      {trigger}
      {dropdown}
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
