import React from 'react'
import { Pill, Icon } from 'bs-prototypes'

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>{children}</div>
)

export const Soft = () => (
  <Row>
    <Pill color="#16A34A">On track</Pill>
    <Pill color="#0DA7BC">Active</Pill>
    <Pill color="#7C3AED">Skills</Pill>
    <Pill color="#D97706">At risk</Pill>
    <Pill color="#DC2626">Needs review</Pill>
  </Row>
)

export const Filled = () => (
  <Row>
    <Pill color="#DC2626" variant="filled">Critical</Pill>
    <Pill color="#D97706" variant="filled">Warning</Pill>
    <Pill color="#16A34A" variant="filled">Verified</Pill>
  </Row>
)

export const Outline = () => (
  <Row>
    <Pill color="#0DA7BC" variant="outline">Reading</Pill>
    <Pill color="#1D4ED8" variant="outline">Finished</Pill>
    <Pill color="#64748B" variant="outline">Draft</Pill>
  </Row>
)

export const WithIcon = () => (
  <Row>
    <Pill color="#16A34A" icon={<Icon name="trending-up" size={13} />}>+7 pts</Pill>
    <Pill color="#E8866A" icon={<Icon name="flame" size={13} />}>12-day streak</Pill>
    <Pill color="#7C3AED" icon={<Icon name="trophy" size={13} />} variant="filled">Badge earned</Pill>
  </Row>
)

export const Sizes = () => (
  <Row>
    <Pill color="#0DA7BC" size="sm">Small</Pill>
    <Pill color="#0DA7BC" size="md">Medium</Pill>
  </Row>
)
