import React from 'react'
import { Hero, Button, Icon } from 'bs-prototypes'

// Inline Benny-ish mascot avatar (external images are blocked in the bundle).
const benny =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#0DA7BC"/><circle cx="17" cy="21" r="4" fill="#fff"/><circle cx="31" cy="21" r="4" fill="#fff"/><path d="M16 30c4 5 12 5 16 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  )

export const SchoolHero = () => (
  <Hero initials="LE" title="Lincoln Elementary" subtitle="K–5 · 1,650 students" accent="#E8866A" />
)

export const PageHero = () => (
  <Hero
    icon={<Icon name="chart-bar" size={20} />}
    title="Reading Insights"
    subtitle="District-wide engagement, October 2026"
    accent="#0DA7BC"
    accentBg="#ECFEFF"
  />
)

export const ScoreHero = () => <Hero bucket="motivation" subtitle="Reading Motivation Index" score={71} delta={7} />

export const WithAction = () => (
  <Hero
    icon={<img src={benny} alt="Benny" width={40} height={40} style={{ borderRadius: 10 }} />}
    title="Summer Reading Challenge"
    subtitle="Benny is cheering on 482 readers"
    accent="#0DA7BC"
    accentBg="#ECFEFF"
    action={
      <Button variant="primary" icon={<Icon name="flame" size={16} />}>
        Log Reading
      </Button>
    }
  />
)
