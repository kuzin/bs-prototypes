import { useState } from 'react'
import { SettingsPopover } from '../../admin-dashboard/components/SettingsPopover'
import { Variant } from './_shared'

function SettingsPopoverDemo({ fields, defaults }) {
  const [value, setValue] = useState({ ...defaults })
  const [open, setOpen] = useState(false)
  const [anchorRect, setAnchorRect] = useState(null)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 6,
          border: '1px solid #e2e8f0',
          background: '#fff',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          color: '#334155',
        }}
        onClick={(e) => {
          setAnchorRect(e.currentTarget.getBoundingClientRect())
          setOpen((v) => !v)
        }}
      >
        ⚙ Widget settings
      </button>
      {open && (
        <SettingsPopover
          anchorRect={anchorRect}
          fields={fields}
          value={value}
          defaults={defaults}
          onChange={(patch) => setValue((v) => ({ ...v, ...patch }))}
          onReset={() => setValue({ ...defaults })}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

const SELECT_FIELDS = [
  {
    key: 'scope',
    label: 'Show',
    type: 'select',
    options: [
      { value: 'community', label: 'Community Goal' },
      { value: 'district', label: 'District Goal' },
    ],
  },
]

const MULTI_FIELDS = [
  {
    key: 'selected',
    label: 'Show metrics',
    type: 'multi',
    max: 4,
    options: [
      { value: 'readers', label: 'Active Readers' },
      { value: 'minutes', label: 'Minutes Logged' },
      { value: 'books', label: 'Books Finished' },
      { value: 'sessions', label: 'Sessions' },
      { value: 'badges', label: 'Badges Earned' },
      { value: 'streak', label: 'Streak Days' },
    ],
  },
]

const RANGE_FIELDS = [
  {
    key: 'limit',
    label: 'Show top',
    type: 'range',
    min: 5,
    max: 15,
    step: 1,
  },
]

export const adminDashboardSections = [
  {
    group: 'admin-dashboard',
    id: 'admin-dashboard-settings-popover',
    name: 'SettingsPopover',
    desc: (
      <>
        An anchored popover for per-widget settings. Renders via React portal so it isn't clipped by{' '}
        <code>overflow: hidden</code> widget cells. Positions itself below + right-aligned to its
        anchor button, flipping above when viewport space is tight. Supports four field types:{' '}
        <code>select</code>, <code>multi</code> (checkboxes with optional <code>max</code> cap),{' '}
        <code>range</code> (slider), and <code>toggle</code>. Admin Dashboard–specific — lives in{' '}
        <code>prototypes/admin-dashboard/components/</code>.
      </>
    ),
    render: () => (
      <div className="pt-variants pt-variants--3">
        <Variant label="select">
          <SettingsPopoverDemo fields={SELECT_FIELDS} defaults={{ scope: 'community' }} />
        </Variant>
        <Variant label="multi (max 4)">
          <SettingsPopoverDemo
            fields={MULTI_FIELDS}
            defaults={{ selected: ['readers', 'minutes', 'books', 'sessions'] }}
          />
        </Variant>
        <Variant label="range">
          <SettingsPopoverDemo fields={RANGE_FIELDS} defaults={{ limit: 5 }} />
        </Variant>
      </div>
    ),
  },
]
