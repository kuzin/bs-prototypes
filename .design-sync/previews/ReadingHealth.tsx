import React from 'react'
import { ReadingHealth } from 'bs-prototypes'

// data is keyed by section (motivation/integrity/habits/skills) + deltas dM/dI/dH/dS.
export const ClassOverview = () => (
  <ReadingHealth
    title="Reading Health — Room 12"
    data={{ motivation: 71, dM: 7, integrity: 94, dI: -3, habits: 68, dH: 2, skills: 82, dS: 5 }}
  />
)

export const SchoolWide = () => (
  <ReadingHealth
    title="Reading Health — Lincoln Elementary"
    onNavigate={() => {}}
    data={{ motivation: 64, dM: 0, integrity: 88, dI: 4, habits: 73, dH: -2, skills: 79, dS: 9 }}
  />
)
