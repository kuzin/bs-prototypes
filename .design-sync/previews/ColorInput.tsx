import React from 'react'
import { ColorInput } from 'bs-prototypes'

export const Default = () => {
  const [color, setColor] = React.useState('#0DA7BC')
  return <ColorInput value={color} onChange={setColor} />
}

export const WithLabel = () => {
  const [color, setColor] = React.useState('#1D4ED8')
  return <ColorInput label="Challenge accent color" value={color} onChange={setColor} />
}

export const Sizes = () => {
  const [a, setA] = React.useState('#16A34A')
  const [b, setB] = React.useState('#F59E0B')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <ColorInput size="sm" value={a} onChange={setA} />
      <ColorInput size="md" value={b} onChange={setB} />
    </div>
  )
}
