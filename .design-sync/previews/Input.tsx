import React from 'react'
import { Input, Icon } from 'bs-prototypes'

export const Sizes = () => {
  const [a, setA] = React.useState('Lincoln Elementary')
  const [b, setB] = React.useState('Mrs. Alvarez — Grade 4')
  const [c, setC] = React.useState('Summer Reading 2026')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Input size="sm" value={a} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setA(e.target.value)} />
      <Input size="md" value={b} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setB(e.target.value)} />
      <Input size="lg" value={c} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setC(e.target.value)} />
    </div>
  )
}

export const WithIcon = () => {
  const [query, setQuery] = React.useState('The One and Only Ivan')
  return (
    <Input
      icon={<Icon name="search" size={15} />}
      value={query}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
      placeholder="Search the reading log…"
    />
  )
}

export const WithLabel = () => {
  const [value, setValue] = React.useState('benny@joyfulreading.com')
  return (
    <Input
      label="Teacher email"
      icon={<Icon name="mail" size={15} />}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
    />
  )
}

export const Placeholder = () => {
  const [value, setValue] = React.useState('')
  return (
    <Input
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      placeholder="Title of the book you read…"
    />
  )
}

export const Disabled = () => (
  <Input value="Auto-synced from Clever" disabled />
)
