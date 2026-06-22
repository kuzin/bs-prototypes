import React from 'react'
import { SectionHeading, Button, Icon } from 'bs-prototypes'

export const WithAction = () => (
  <div style={{ width: 320 }}>
    <SectionHeading
      title="Students to Watch"
      subtitle="Last 30 days"
      action={<Button variant="ghost">View all</Button>}
    />
  </div>
)

export const TitleOnly = () => (
  <div style={{ width: 320 }}>
    <SectionHeading title="Earned Rewards" />
  </div>
)

export const AsH2 = () => (
  <div style={{ width: 320 }}>
    <SectionHeading
      level="h2"
      title="Class Reading Challenge"
      subtitle="Spring 2026 · 24 readers"
      action={
        <Button variant="primary" icon={<Icon name="plus" size={16} />}>
          New goal
        </Button>
      }
    />
  </div>
)
