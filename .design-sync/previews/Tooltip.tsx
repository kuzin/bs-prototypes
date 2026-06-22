import React from 'react'
import { Tooltip, IconButton, Icon } from 'bs-prototypes'

// Tooltip renders its bubble only on hover/focus (no open/defaultOpen prop),
// so the static card shows the trigger element it wraps. The `content` is the
// label that appears on hover. See learnings for the hover-only caveat.
export const OnIconButton = () => (
  <Tooltip content="Mark reading log as verified" placement="top">
    <IconButton variant="secondary" aria-label="Verify log">
      <Icon name="shield-check" size={18} />
    </IconButton>
  </Tooltip>
)

export const Placements = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Tooltip content="Reading streak: 14 days" placement="top">
      <IconButton variant="ghost" aria-label="Streak">
        <Icon name="flame" size={18} />
      </IconButton>
    </Tooltip>
    <Tooltip content="RMI score this quarter" placement="bottom">
      <IconButton variant="ghost" aria-label="RMI">
        <Icon name="trending-up" size={18} />
      </IconButton>
    </Tooltip>
    <Tooltip content="Badges earned" placement="right">
      <IconButton variant="ghost" aria-label="Badges">
        <Icon name="award" size={18} />
      </IconButton>
    </Tooltip>
  </div>
)

export const OnText = () => (
  <Tooltip content="Reading Motivation Index (0–40)" placement="top">
    <span
      style={{
        fontFamily: 'var(--font-body, Nunito)',
        fontWeight: 700,
        color: '#1D4ED8',
        borderBottom: '2px dotted #1D4ED8',
        cursor: 'help',
      }}
    >
      RMI 32
    </span>
  </Tooltip>
)
