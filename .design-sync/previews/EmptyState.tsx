import React from 'react'
import { EmptyState, Button, Icon } from 'bs-prototypes'

export const Plain = () => (
  <EmptyState
    icon={<Icon name="users" size={32} />}
    title="No students to watch"
    description="Students appear here when they trip a reading-integrity alert. You're all caught up!"
    action={<Button variant="primary">Set thresholds</Button>}
  />
)

export const Dashed = () => (
  <EmptyState
    variant="dashed"
    icon={<Icon name="trophy" size={32} />}
    title="No challenges yet"
    description="Create a reading challenge to motivate your class with badges, streaks, and rewards."
    action={<Button variant="secondary">Create a challenge</Button>}
  />
)
