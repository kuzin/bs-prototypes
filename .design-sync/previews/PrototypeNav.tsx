import React from 'react'
import { PrototypeNav } from 'bs-prototypes'

// PrototypeNav = the prototype switcher bar (logo + pattern-library + usage
// buttons + the current-prototype selector). Its `.proto-nav` is `position:fixed`
// (a viewport-pinned bar), which leaves document flow and collapses the card to
// ~0px. Neutralize it to `static` (preview-only) so the bar renders inline at its
// natural height. `currentHref` picks which prototype shows selected (accent-tinted).
const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: 'relative', background: '#fff' }}>
    <style>{`.proto-nav{position:static !important;width:100% !important}`}</style>
    {children}
  </div>
)

export const SelectedRIS = () => (
  <Frame>
    <PrototypeNav currentHref="/bs-prototypes/ris/" />
  </Frame>
)

export const SelectedChallenge = () => (
  <Frame>
    <PrototypeNav currentHref="/bs-prototypes/challenge-creator/" />
  </Frame>
)

export const NoSelection = () => (
  <Frame>
    <PrototypeNav currentHref="" />
  </Frame>
)
