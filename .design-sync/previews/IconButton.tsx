import React from 'react'
import { IconButton, Icon } from 'bs-prototypes'

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>{children}</div>
)

export const Variants = () => (
  <Row>
    <IconButton variant="secondary" aria-label="Search students">
      <Icon name="search" size={18} />
    </IconButton>
    <IconButton variant="primary" aria-label="Add reader">
      <Icon name="plus" size={18} />
    </IconButton>
    <IconButton variant="ghost" aria-label="More options">
      <Icon name="dots-vertical" size={18} />
    </IconButton>
    <IconButton variant="danger" aria-label="Remove log">
      <Icon name="trash" size={18} />
    </IconButton>
  </Row>
)

export const Sizes = () => (
  <Row>
    <IconButton size="sm" variant="secondary" aria-label="Edit goal">
      <Icon name="pencil" size={14} />
    </IconButton>
    <IconButton size="md" variant="secondary" aria-label="Edit goal">
      <Icon name="pencil" size={18} />
    </IconButton>
    <IconButton size="lg" variant="secondary" aria-label="Edit goal">
      <Icon name="pencil" size={22} />
    </IconButton>
  </Row>
)

export const States = () => (
  <Row>
    <IconButton variant="primary" aria-label="Notifications">
      <Icon name="bell" size={18} />
    </IconButton>
    <IconButton variant="secondary" disabled aria-label="Export disabled">
      <Icon name="download" size={18} />
    </IconButton>
  </Row>
)
