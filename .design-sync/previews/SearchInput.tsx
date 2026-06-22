import React from 'react'
import { SearchInput } from 'bs-prototypes'

export const Empty = () => {
  const [q, setQ] = React.useState('')
  return <SearchInput value={q} onChange={setQ} placeholder="Search all badges" />
}

export const WithValue = () => {
  const [q, setQ] = React.useState('reading streak')
  return <SearchInput value={q} onChange={setQ} placeholder="Search all badges" />
}

export const Students = () => {
  const [q, setQ] = React.useState('')
  return <SearchInput value={q} onChange={setQ} placeholder="Search students by name" />
}
