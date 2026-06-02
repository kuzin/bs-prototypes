import * as RadixSelect from '@radix-ui/react-select'
import { useId } from 'react'
import { useFieldProps } from '@components/FormContext/FormContext'
import { Icon } from '@components/Icon/Icon'
import '@components/CustomSelect/CustomSelect.css'

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
      <RadixSelect.Icon className="csel-icon">
        <Icon name="chevron-down" size={15} stroke={2} />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  )

  const content = (
    <RadixSelect.Portal>
      <RadixSelect.Content className="csel-content" position="popper" sideOffset={4}>
        <RadixSelect.ScrollUpButton className="csel-scroll-btn">
          <Icon name="chevron-up" size={12} stroke={2} />
        </RadixSelect.ScrollUpButton>

        <RadixSelect.Viewport className="csel-viewport">
          {options.map((item, i) =>
            'group' in item ? (
              <RadixSelect.Group key={item.group + i}>
                <RadixSelect.Label className="csel-group-label">{item.group}</RadixSelect.Label>
                {item.options.map((opt) => (
                  <SelectOption key={opt.value} {...opt} />
                ))}
              </RadixSelect.Group>
            ) : (
              <SelectOption key={item.value} {...item} />
            ),
          )}
        </RadixSelect.Viewport>

        <RadixSelect.ScrollDownButton className="csel-scroll-btn">
          <Icon name="chevron-down" size={12} stroke={2} />
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
      <label className="frm-self-label" htmlFor={triggerId}>
        {label}
      </label>
      {selectEl}
    </div>
  )
}

function SelectOption({ value, label, disabled }) {
  return (
    <RadixSelect.Item value={value} disabled={disabled} className="csel-item">
      <RadixSelect.ItemText>{label}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="csel-item-indicator">
        <Icon name="check" size={12} stroke={2.5} />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  )
}
