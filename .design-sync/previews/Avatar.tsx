import React from 'react'
import { Avatar } from 'bs-prototypes'

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>{children}</div>
)

export const Initials = () => (
  <Row>
    <Avatar initials="MC" color="#0DA7BC" />
    <Avatar initials="LE" color="#1D4ED8" />
    <Avatar initials="JR" color="#E8866A" />
    <Avatar initials="HK" color="#16A97A" />
    <Avatar initials="BN" color="#7C3AED" />
  </Row>
)

export const Sizes = () => (
  <Row>
    <Avatar initials="xs" color="#0DA7BC" size="xs" />
    <Avatar initials="sm" color="#0DA7BC" size="sm" />
    <Avatar initials="md" color="#0DA7BC" size="md" />
    <Avatar initials="lg" color="#0DA7BC" size="lg" />
    <Avatar initials="xl" color="#0DA7BC" size="xl" />
  </Row>
)

export const Shapes = () => (
  <Row>
    <Avatar initials="MC" color="#1D4ED8" size="lg" shape="circle" />
    <Avatar initials="LE" color="#E8866A" size="lg" shape="square" />
  </Row>
)
