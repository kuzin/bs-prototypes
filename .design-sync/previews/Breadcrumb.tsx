import React from 'react'
import { Breadcrumb } from 'bs-prototypes'

export const SchoolPath = () => (
  <Breadcrumb
    items={[
      { label: 'District', href: '/district' },
      { label: 'Lincoln Elementary', href: '/schools/lincoln' },
      { label: 'Ms. Rivera · Grade 4', href: '/classes/rivera-4' },
      { label: 'Maya Chen' },
    ]}
  />
)

export const TwoLevel = () => (
  <Breadcrumb
    items={[
      { label: 'Challenges', href: '/challenges' },
      { label: 'Spring Reading Challenge' },
    ]}
  />
)
