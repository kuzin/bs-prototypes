import React from 'react'
import { MainRail } from 'bs-prototypes'

// MainRail is a fixed-height (100vh) far-left icon strip. Give it a sized,
// tall context so it renders its full column rather than collapsing.
const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ height: 520, display: 'flex', background: '#F4F7FA' }}>{children}</div>
)

export const InsightsActive = () => (
  <Frame>
    <MainRail activeIndex={3} />
  </Frame>
)

export const ChallengesActive = () => (
  <Frame>
    <MainRail activeIndex={1} />
  </Frame>
)
