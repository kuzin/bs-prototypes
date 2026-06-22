import React from 'react'
import { Select } from 'bs-prototypes'

export const Sizes = () => {
  const [a, setA] = React.useState('grade-4')
  const [b, setB] = React.useState('fiction')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Select size="sm" value={a} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setA(e.target.value)}>
        <option value="grade-3">Grade 3</option>
        <option value="grade-4">Grade 4</option>
        <option value="grade-5">Grade 5</option>
      </Select>
      <Select size="lg" value={b} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setB(e.target.value)}>
        <option value="fiction">Fiction</option>
        <option value="nonfiction">Nonfiction</option>
        <option value="graphic">Graphic Novel</option>
        <option value="poetry">Poetry</option>
      </Select>
    </div>
  )
}

export const WithLabel = () => {
  const [value, setValue] = React.useState('alvarez')
  return (
    <Select
      label="Class"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setValue(e.target.value)}
    >
      <option value="alvarez">Mrs. Alvarez — Grade 4</option>
      <option value="chen">Mr. Chen — Grade 4</option>
      <option value="okoye">Ms. Okoye — Grade 5</option>
    </Select>
  )
}

export const Disabled = () => (
  <Select value="district" disabled>
    <option value="district">All schools (district)</option>
  </Select>
)
