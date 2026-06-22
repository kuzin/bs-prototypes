import React from 'react'
import { NumberInput, Field } from 'bs-prototypes'

export const DailyGoal = () => {
  const [value, setValue] = React.useState(20)
  return <NumberInput value={value} onChange={setValue} min={5} max={120} step={5} />
}

export const Sizes = () => {
  const [a, setA] = React.useState(3)
  const [b, setB] = React.useState(150)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <NumberInput size="sm" value={a} onChange={setA} min={0} max={50} />
      <NumberInput size="lg" value={b} onChange={setB} min={0} max={500} step={10} />
    </div>
  )
}

export const WithField = () => {
  const [value, setValue] = React.useState(8)
  return (
    <Field label="Books to read" help="Target for the Summer Reading 2026 challenge.">
      <NumberInput value={value} onChange={setValue} min={1} max={50} />
    </Field>
  )
}

export const Disabled = () => (
  <NumberInput value={40} onChange={() => {}} disabled />
)
