import React from 'react'
import { Banner, Button } from 'bs-prototypes'

export const Info = () => (
  <div style={{ width: 360 }}>
    <Banner level="info" title="New dashboard rolling out">
      The redesigned Insights dashboard goes live for your district next week.
    </Banner>
  </div>
)

export const Success = () => (
  <div style={{ width: 360 }}>
    <Banner level="success" title="Reading logs synced">
      All 24 students&apos; reading minutes are up to date as of this morning.
    </Banner>
  </div>
)

export const Warning = () => (
  <div style={{ width: 360 }}>
    <Banner
      level="warning"
      title="Challenge ends soon"
      action={<Button variant="secondary">Extend</Button>}
    >
      The Spring Reading Challenge closes in 3 days. 6 readers haven&apos;t logged yet.
    </Banner>
  </div>
)

export const Error = () => (
  <div style={{ width: 360 }}>
    <Banner level="error" title="Roster sync failed" onDismiss={() => {}}>
      Clever couldn&apos;t reach Lincoln Elementary. Check the integration settings and retry.
    </Banner>
  </div>
)
