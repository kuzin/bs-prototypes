import React from 'react'
import { HealthStat, SECTIONS } from 'bs-prototypes'

// SECTIONS = [Motivation, Integrity, Habits, Skills] — each a {label,color,bg,icon} tile.
const [motivation, integrity, habits, skills] = SECTIONS

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 320 }}>{children}</div>
)

export const Motivation = () => (
  <Row>
    <HealthStat section={motivation} score={71} delta={7} />
  </Row>
)

export const Integrity = () => (
  <Row>
    <HealthStat section={integrity} score={94} delta={-3} />
  </Row>
)

export const Flat = () => (
  <Row>
    <HealthStat section={habits} score={68} delta={0} />
  </Row>
)

export const Clickable = () => (
  <Row>
    <HealthStat section={skills} score={82} delta={5} onClick={() => {}} />
  </Row>
)
