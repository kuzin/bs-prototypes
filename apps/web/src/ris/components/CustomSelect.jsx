import * as RadixSelect from '@radix-ui/react-select'
import { useId } from 'react'
import { useFieldProps } from './FormContext'
import './CustomSelect.css'

/**
 * CustomSelect — a fully-styled Radix UI Select.
 *
 * Unlike the native <Select>, this renders a real custom dropdown with
 * smooth animations, keyboard navigation, and consistent cross-browser look.
 *
 * <CustomSelect
 *   options={[
 *     { value: 'sm', label: 'Small' },
 *     { value: 'md', label: 'Medium' },
 *     { group: 'Advanced', options: [{ value: 'xl', label: 'Extra large' }] },
 *   ]}
 *   value={size}
 *   onChange={setSize}
 *   placeholder="Pick a size"
 *   label="Size"
 * />
 */

export function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select…',
  size = 'md',
  label,
  disabled = false,
  className = '',
}) {
  const { id: fieldId, hasError } = useFieldProps()
  const selfId = useId()
  const triggerId = fieldId || selfId

  const trigger = (
    <RadixSelect.Trigger
      id={triggerId}
      className={`csel-trigger csel-trigger--${size}${hasError ? ' csel-trigger--error' : ''}${!label && className ? ` ${className}` : ''}`}
      disabled={disabled}
      aria-label={label}
    >
      <RadixSelect.Value placeholder={placeholder} />
      <RadixSelect.Icon className="csel-icon" asChild>
        <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="4,6 8,10 12,6" />
        </svg>
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  )

  const content = (
    <RadixSelect.Portal>
      <RadixSelect.Content className="csel-content" position="popper" sideOffset={4}>
        <RadixSelect.ScrollUpButton className="csel-scroll-btn">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4,10 8,6 12,10" />
          </svg>
        </RadixSelect.ScrollUpButton>

        <RadixSelect.Viewport className="csel-viewport">
          {options.map((item, i) =>
            'group' in item ? (
              <RadixSelect.Group key={item.group + i}>
                <RadixSelect.Label className="csel-group-label">{item.group}</RadixSelect.Label>
                {item.options.map(opt => (
                  <SelectOption key={opt.value} {...opt} />
                ))}
              </RadixSelect.Group>
            ) : (
              <SelectOption key={item.value} {...item} />
            )
          )}
        </RadixSelect.Viewport>

        <RadixSelect.ScrollDownButton className="csel-scroll-btn">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4,6 8,10 12,6" />
          </svg>
        </RadixSelect.ScrollDownButton>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  )

  const selectEl = (
    <RadixSelect.Root value={value} onValueChange={onChange} disabled={disabled}>
      {trigger}
      {content}
    </RadixSelect.Root>
  )

  if (!label) return selectEl
  return (
    <div className={`frm-labeled${className ? ` ${className}` : ''}`}>
      <label className="frm-self-label" htmlFor={triggerId}>{label}</label>
      {selectEl}
    </div>
  )
}

function SelectOption({ value, label, disabled }) {
  return (
    <RadixSelect.Item
      value={value}
      disabled={disabled}
      className="csel-item"
    >
      <RadixSelect.ItemText>{label}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="csel-item-indicator">
        <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="2,6 5,9 10,3" />
        </svg>
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  )
}
