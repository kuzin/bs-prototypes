import React from 'react'
import { ActiveFilters } from 'bs-prototypes'

export const Multiple = () => {
  const [filters, setFilters] = React.useState([
    { key: 'grade', label: 'Grades 3–5' },
    { key: 'status', label: 'Behind goal' },
    { key: 'school', label: 'Lincoln Elementary' },
  ])
  const clear = (key: string) => setFilters((fs) => fs.filter((f) => f.key !== key))
  return (
    <ActiveFilters
      filters={filters.map((f) => ({ ...f, onClear: () => clear(f.key) }))}
      onClearAll={() => setFilters([])}
    />
  )
}

export const Single = () => {
  const [filters, setFilters] = React.useState([{ key: 'range', label: 'This school year' }])
  return (
    <ActiveFilters
      filters={filters.map((f) => ({ ...f, onClear: () => setFilters([]) }))}
      onClearAll={() => setFilters([])}
    />
  )
}
