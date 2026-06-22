import React from 'react'
import { TimePicker } from 'bs-prototypes'

// Authored in the CLOSED / selected-value state — the slot list portals out of
// the capture cell, so the in-flow field grades cleanly.
export const WithLabel = () => {
  const [time, setTime] = React.useState<string | null>('08:30')
  return <TimePicker label="Reading block start" value={time} onChange={setTime} />
}

export const Placeholder = () => {
  const [time, setTime] = React.useState<string | null>(null)
  return <TimePicker label="Reminder time" placeholder="Pick a time" value={time} onChange={setTime} />
}

export const Sizes = () => {
  const [a, setA] = React.useState<string | null>('09:00')
  const [b, setB] = React.useState<string | null>('15:15')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <TimePicker size="sm" value={a} onChange={setA} />
      <TimePicker size="lg" value={b} onChange={setB} />
    </div>
  )
}

export const Disabled = () => (
  <TimePicker label="Locked time" value="14:00" onChange={() => {}} disabled />
)
