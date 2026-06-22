import React from 'react'
import { ChartCard, CardNote, Icon } from 'bs-prototypes'

// CardNote is an inline callout that lives inside a ChartCard body.
// Valid tones: 'neutral' (slate) and 'accent' (tinted by the card's accent).
export const Tones = () => (
  <ChartCard
    title="Class insights"
    subtitle="Mrs. Alvarez — Grade 4"
    icon={<Icon name="sparkles" size={18} />}
    accent="#0DA7BC"
    bodyPad="padded"
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CardNote tone="neutral">
        Class averaged 168 minutes read this week — 12% above the district pace.
      </CardNote>
      <CardNote tone="accent">
        <strong>7 students</strong> hit a new reading streak. Benny says: keep it up!
      </CardNote>
    </div>
  </ChartCard>
)

export const Standalone = () => (
  <ChartCard title="Reading challenge reminder" accent="#F59E0B" bodyPad="padded">
    <CardNote tone="accent">
      The winter reading challenge ends Friday — <strong>41 students</strong> still need 1 more book
      to complete it.
    </CardNote>
  </ChartCard>
)
