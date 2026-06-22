import React from 'react'
import { Toggle } from 'bs-prototypes'

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 220 }}>{children}</div>
)

export const WithLabels = () => {
  const [streak, setStreak] = React.useState(true)
  const [digest, setDigest] = React.useState(false)
  return (
    <Stack>
      <Toggle checked={streak} onChange={setStreak}>
        Streak reminders
      </Toggle>
      <Toggle checked={digest} onChange={setDigest}>
        Weekly reading digest
      </Toggle>
    </Stack>
  )
}

export const States = () => {
  const [on, setOn] = React.useState(true)
  const [off, setOff] = React.useState(false)
  return (
    <Stack>
      <Toggle checked={on} onChange={setOn}>
        On
      </Toggle>
      <Toggle checked={off} onChange={setOff}>
        Off
      </Toggle>
      <Toggle checked disabled>
        Disabled (on)
      </Toggle>
      <Toggle checked={false} disabled>
        Disabled (off)
      </Toggle>
    </Stack>
  )
}

export const Sizes = () => {
  const [sm, setSm] = React.useState(true)
  const [md, setMd] = React.useState(true)
  const [lg, setLg] = React.useState(true)
  return (
    <Stack>
      <Toggle size="sm" checked={sm} onChange={setSm}>
        Small
      </Toggle>
      <Toggle size="md" checked={md} onChange={setMd}>
        Medium
      </Toggle>
      <Toggle size="lg" checked={lg} onChange={setLg}>
        Large
      </Toggle>
    </Stack>
  )
}
