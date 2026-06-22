import React from 'react'
import { Sidebar } from 'bs-prototypes'

// Sidebar = the MainRail + blue-gradient nav panel. It is a full-height shell,
// so give it a sized, tall context. Icons must be Sidebar nav-icon keys
// (overview/flame/shield/lexile/book/analytics/flag/person/habits/demographics).
const NAV = [
  { id: 'dashboard', label: 'Overview', icon: 'overview' },
  { type: 'section', label: 'Reading Health' },
  { id: 'motivation', label: 'Motivation', icon: 'flame', subgroup: true },
  { id: 'integrity', label: 'Integrity', icon: 'shield', subgroup: true },
  { id: 'lexile', label: 'Lexile Growth', icon: 'lexile', subgroup: true },
  { type: 'section', label: 'Manage' },
  { id: 'challenges', label: 'Challenges', icon: 'book' },
  { id: 'reports', label: 'Reports', icon: 'analytics' },
  { id: 'flags', label: 'Reading Logs', icon: 'flag' },
]

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ height: 560, display: 'flex', background: '#F4F7FA' }}>{children}</div>
)

export const SchoolNav = () => {
  const [active, setActive] = React.useState('motivation')
  return (
    <Frame>
      <Sidebar
        title="Reading Information System"
        subtitle="School View"
        nav={NAV}
        active={active}
        onNavigate={setActive}
        badges={{ flags: 3 }}
      />
    </Frame>
  )
}

export const OverviewActive = () => {
  const [active, setActive] = React.useState('dashboard')
  return (
    <Frame>
      <Sidebar
        title="Reading Information System"
        subtitle="District View"
        nav={NAV}
        active={active}
        onNavigate={setActive}
        badges={{ flags: 5 }}
      />
    </Frame>
  )
}
