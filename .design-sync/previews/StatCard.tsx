import React from 'react'
import { StatCard } from 'bs-prototypes'

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>{children}</div>
)

export const Metrics = () => (
  <Row>
    <StatCard
      value={26.0}
      unit="/40"
      label="School RMI score"
      footer="↑ 7 pts since Sep"
      footerColor="#16A97A"
      color="#0DA7BC"
    />
    <StatCard
      value="1,284"
      label="Minutes read this week"
      footer="↑ 12% vs. last week"
      footerColor="#16A97A"
      color="#16A97A"
    />
  </Row>
)

export const SingleAccent = () => (
  <StatCard
    value={142}
    label="Badges earned"
    footer="across 3 classes"
    color="#F59E0B"
  />
)

export const NoFooter = () => (
  <StatCard value="88%" label="Goal completion" color="#3B82F6" />
)
