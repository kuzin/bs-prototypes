import React from 'react'
import { AppShell, Hero, SectionCard, Icon } from 'bs-prototypes'

const NAV = [
  { id: 'dashboard', label: 'Overview', icon: 'overview' },
  { type: 'section', label: 'Reading Health' },
  { id: 'motivation', label: 'Motivation', icon: 'flame', subgroup: true },
  { id: 'integrity', label: 'Integrity', icon: 'shield', subgroup: true },
  { id: 'lexile', label: 'Lexile Growth', icon: 'lexile', subgroup: true },
  { type: 'section', label: 'Manage' },
  { id: 'reports', label: 'Reports', icon: 'analytics' },
  { id: 'flags', label: 'Reading Logs', icon: 'flag' },
]

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: 22, fontWeight: 800, color: '#0F2A43' }}>{value}</div>
    <div style={{ fontSize: 12, color: '#5B7186', marginTop: 2 }}>{label}</div>
  </div>
)

const Page = () => (
  <div className="app-shell-page" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Hero
      icon={<Icon name="chart-bar" size={20} />}
      title="Reading Insights"
      subtitle="Lincoln Elementary · K–5"
      accent="#0DA7BC"
      accentBg="#ECFEFF"
    />
    <SectionCard title="This Week">
      <div style={{ display: 'flex', gap: 16 }}>
        <Stat label="Minutes read" value="3,420" />
        <Stat label="Active readers" value="24" />
        <Stat label="Books finished" value="11" />
      </div>
    </SectionCard>
  </div>
)

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ height: 600, display: 'flex', background: '#F4F7FA' }}>{children}</div>
)

export const WithSidebar = () => {
  const [active, setActive] = React.useState('motivation')
  return (
    <Frame>
      <AppShell
        sidebar={{
          title: 'Reading Information System',
          subtitle: 'School View',
          nav: NAV,
          active,
          onNavigate: setActive,
          badges: { flags: 3 },
        }}
      >
        <Page />
      </AppShell>
    </Frame>
  )
}

export const WithBackBar = () => {
  const [active, setActive] = React.useState('dashboard')
  return (
    <Frame>
      <AppShell
        sidebar={{
          title: 'Reading Information System',
          subtitle: 'School View',
          nav: NAV,
          active,
          onNavigate: setActive,
        }}
        backBar={{ label: 'Back to Insights', onClick: () => {} }}
      >
        <Page />
      </AppShell>
    </Frame>
  )
}
