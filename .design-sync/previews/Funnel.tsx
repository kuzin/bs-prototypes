import React from 'react'
import { Funnel } from 'bs-prototypes'

// Funnel renders an in-flow stack; give it room to breathe.
const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: '100%', minWidth: 280 }}>{children}</div>
)

export const ChallengeFunnel = () => (
  <Frame>
    <Funnel
      items={[
        { stage: 'Enrolled', count: 1240, pct: 100 },
        { stage: 'Logged a session', count: 988, pct: 80 },
        { stage: 'Hit a streak', count: 642, pct: 52 },
        { stage: 'Earned a badge', count: 410, pct: 33 },
        { stage: 'Completed challenge', count: 213, pct: 17 },
      ]}
    />
  </Frame>
)

export const WithDeltas = () => (
  <Frame>
    <Funnel
      items={[
        { stage: 'Roster synced', count: 820, pct: 100 },
        { stage: 'Account activated', count: 705, pct: 86, delta: 12 },
        { stage: 'First book logged', count: 511, pct: 62, delta: 9 },
        { stage: 'Reading 4+ days/wk', count: 287, pct: 35, delta: 6 },
      ]}
    />
  </Frame>
)
