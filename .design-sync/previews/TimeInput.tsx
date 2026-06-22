import React from 'react'
import { TimeInput } from 'bs-prototypes'

export const Default = () => {
  const [time, setTime] = React.useState('15:30')
  return <TimeInput value={time} onChange={(e) => setTime(e.target.value)} />
}

export const WithLabel = () => {
  const [time, setTime] = React.useState('08:00')
  return (
    <TimeInput
      label="Daily reading reminder"
      value={time}
      onChange={(e) => setTime(e.target.value)}
    />
  )
}

export const Sizes = () => {
  const [a, setA] = React.useState('09:15')
  const [b, setB] = React.useState('16:45')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <TimeInput size="sm" value={a} onChange={(e) => setA(e.target.value)} />
      <TimeInput size="md" value={b} onChange={(e) => setB(e.target.value)} />
    </div>
  )
}
