import React from 'react'
import { Button, Icon } from 'bs-prototypes'

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>{children}</div>
)

export const Variants = () => (
  <Row>
    <Button variant="primary">Log Reading</Button>
    <Button variant="secondary">Set Class Goal</Button>
    <Button variant="ghost">Cancel</Button>
    <Button variant="danger">End Challenge</Button>
    <Button variant="accent" accent="#0DA7BC">View Insights</Button>
  </Row>
)

export const Sizes = () => (
  <Row>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </Row>
)

export const WithIcons = () => (
  <Row>
    <Button variant="primary" icon={<Icon name="flame" />}>Start a Streak</Button>
    <Button variant="secondary" iconRight={<Icon name="chevron-right" />}>Next Step</Button>
  </Row>
)

export const States = () => (
  <Row>
    <Button variant="primary" loading>Saving…</Button>
    <Button variant="primary" disabled>Locked</Button>
  </Row>
)
