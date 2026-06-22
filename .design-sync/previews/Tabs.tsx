import React from 'react'
import { Tabs } from 'bs-prototypes'

export const Underline = () => {
  const [active, setActive] = React.useState('daily')
  return (
    <Tabs
      active={active}
      onChange={setActive}
      items={[
        { id: 'daily', label: 'Daily Reading' },
        { id: 'roster', label: 'Students', count: 24 },
        { id: 'rewards', label: 'Earned Rewards' },
      ]}
    />
  )
}

export const Pill = () => {
  const [active, setActive] = React.useState('week')
  return (
    <Tabs
      variant="pill"
      active={active}
      onChange={setActive}
      items={[
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
        { id: 'year', label: 'This Year' },
      ]}
    />
  )
}

export const FullWidth = () => {
  const [active, setActive] = React.useState('overview')
  return (
    <Tabs
      variant="pill"
      block
      active={active}
      onChange={setActive}
      items={[
        { id: 'overview', label: 'Overview' },
        { id: 'sessions', label: 'Sessions', count: 8 },
        { id: 'flags', label: 'Flags', count: 2 },
      ]}
    />
  )
}
