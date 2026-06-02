import { Children } from 'react'
import { Toggle } from '@components/Toggle/Toggle'
import { Icon } from '@components/Icon/Icon'

// A knob is a boolean "flag" when its Field wraps a <Toggle>.
const isFlag = (field) => Children.toArray(field?.props?.children).some((c) => c?.type === Toggle)

// Knobs panel: dropdowns / inputs sit in a top "controls" zone; boolean
// toggles drop into a compact "flags" cluster below, so the two read as
// distinct zones instead of one big undifferentiated grid.
export function Knobs({ children }) {
  const kids = Children.toArray(children)
  const controls = kids.filter((k) => !isFlag(k))
  const flags = kids.filter(isFlag)
  return (
    <div className="pt-knobs">
      {controls.length > 0 && <div className="pt-knobs-controls">{controls}</div>}
      {flags.length > 0 && <div className="pt-knobs-flags">{flags}</div>}
    </div>
  )
}

export function Variant({ label, children, bare, full }) {
  const className = [
    'pt-variant-frame',
    bare && 'pt-variant-frame--bare',
    full && 'pt-variant-frame--full',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className="pt-variant">
      <div className="pt-variant-label">{label}</div>
      <div className={className}>{children}</div>
    </div>
  )
}

export const PlusIcon = () => <Icon name="plus" size={16} />

export const CaretIcon = () => <Icon name="chevron-down" size={16} />

export const EditIcon = () => <Icon name="pencil" size={16} />

export const DuplicateIcon = () => <Icon name="copy" size={16} />

export const ArchiveIcon = () => <Icon name="archive" size={16} />

export const TrashIcon = () => <Icon name="trash" size={16} />

export const MoreIcon = () => <Icon name="dots" size={16} />

export const CheckIcon = () => <Icon name="check" size={16} stroke={2.5} />

export const StarIcon = () => <Icon name="star-filled" size={16} />

export const TABLE_ROWS = [
  { id: 'jefferson', name: 'Jefferson', rmi: 80, delta: 8, students: 1820 },
  { id: 'lincoln', name: 'Lincoln', rmi: 71, delta: 7, students: 1650 },
  { id: 'kennedy', name: 'Kennedy', rmi: 77, delta: 7, students: 2340 },
  { id: 'washington', name: 'Washington', rmi: 62, delta: 1, students: 1980 },
  { id: 'adams', name: 'Adams', rmi: 83, delta: 9, students: 2510 },
]
