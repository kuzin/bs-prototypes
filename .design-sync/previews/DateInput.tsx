import React from 'react'
import { DateInput } from 'bs-prototypes'

export const Default = () => {
  const [date, setDate] = React.useState('2026-09-01')
  return <DateInput value={date} onChange={(e) => setDate(e.target.value)} />
}

export const WithLabel = () => {
  const [date, setDate] = React.useState('2026-09-15')
  return (
    <DateInput
      label="Challenge start date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />
  )
}

export const Sizes = () => {
  const [a, setA] = React.useState('2026-06-01')
  const [b, setB] = React.useState('2026-06-30')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <DateInput size="sm" value={a} onChange={(e) => setA(e.target.value)} />
      <DateInput size="md" value={b} onChange={(e) => setB(e.target.value)} />
    </div>
  )
}
