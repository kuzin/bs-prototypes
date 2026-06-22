import React from 'react'
import { AlertRow } from 'bs-prototypes'

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
)

export const Critical = () => (
  <Stack>
    <AlertRow
      level="critical"
      title="3 students flagged"
      description="Reading sessions tripped a safety threshold — review before end of day."
      action="Review"
      onAction={() => {}}
    />
  </Stack>
)

export const Warning = () => (
  <Stack>
    <AlertRow
      level="warning"
      title="Maya R."
      description="Logged 240 min in one session — pace exceeds the integrity threshold."
      action="View session"
      onAction={() => {}}
    />
  </Stack>
)

export const Positive = () => (
  <Stack>
    <AlertRow
      level="positive"
      title="Room 12"
      description="Class reading streak hit 14 days — highest this semester."
      action="Celebrate"
      onAction={() => {}}
    />
  </Stack>
)

export const Info = () => (
  <Stack>
    <AlertRow
      level="info"
      description="Lexile growth analysis re-runs tonight for all rostered students."
    />
  </Stack>
)
