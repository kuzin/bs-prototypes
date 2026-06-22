import React from 'react'
import { DatePicker } from 'bs-prototypes'

// Authored in the CLOSED / selected-value state — the calendar popup portals
// out of the capture cell, so the in-flow field grades cleanly.
export const WithLabel = () => {
  const [date, setDate] = React.useState<Date | null>(new Date('2026-09-08'))
  return <DatePicker label="Challenge start date" value={date} onChange={setDate} />
}

export const Placeholder = () => {
  const [date, setDate] = React.useState<Date | null>(null)
  return <DatePicker label="Challenge end date" placeholder="Pick a date" value={date} onChange={setDate} />
}

export const Sizes = () => {
  const [a, setA] = React.useState<Date | null>(new Date('2026-06-01'))
  const [b, setB] = React.useState<Date | null>(new Date('2026-06-30'))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <DatePicker size="sm" value={a} onChange={setA} />
      <DatePicker size="lg" value={b} onChange={setB} />
    </div>
  )
}

export const Disabled = () => (
  <DatePicker label="Locked date" value={new Date('2026-05-15')} onChange={() => {}} disabled />
)
