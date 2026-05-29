import { Children } from 'react'
import { Toggle } from '@components/Toggle/Toggle'

// A knob is a boolean "flag" when its Field wraps a <Toggle>.
const isFlag = (field) =>
  Children.toArray(field?.props?.children).some((c) => c?.type === Toggle)

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

export const PlusIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
)

export const CaretIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="4,6 8,10 12,6" />
  </svg>
)

export const EditIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11.5 2.5l2 2L6 12l-3 1 1-3 7.5-7.5z" />
  </svg>
)

export const DuplicateIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="9" height="9" rx="1.5" />
    <path d="M3 11V4a1 1 0 0 1 1-1h7" />
  </svg>
)

export const ArchiveIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="12" height="3" rx="0.5" />
    <path d="M3 6v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6" />
    <line x1="6.5" y1="9" x2="9.5" y2="9" />
  </svg>
)

export const TrashIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 4h10" />
    <path d="M5.5 4V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1" />
    <path d="M4.5 4l.6 9a1 1 0 0 0 1 1h3.8a1 1 0 0 0 1-1l.6-9" />
  </svg>
)

export const MoreIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <circle cx="3.5" cy="8" r="1.4" />
    <circle cx="8" cy="8" r="1.4" />
    <circle cx="12.5" cy="8" r="1.4" />
  </svg>
)

export const CheckIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3,8 7,12 13,4" />
  </svg>
)

export const StarIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1.5l1.9 4 4.4.6-3.2 3.1.8 4.3L8 11.4l-4 2.1.8-4.3L1.7 6.1 6.1 5.5z" />
  </svg>
)

export const TABLE_ROWS = [
  { id: 'jefferson', name: 'Jefferson', rmi: 80, delta: 8, students: 1820 },
  { id: 'lincoln', name: 'Lincoln', rmi: 71, delta: 7, students: 1650 },
  { id: 'kennedy', name: 'Kennedy', rmi: 77, delta: 7, students: 2340 },
  { id: 'washington', name: 'Washington', rmi: 62, delta: 1, students: 1980 },
  { id: 'adams', name: 'Adams', rmi: 83, delta: 9, students: 2510 },
]
