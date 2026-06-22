import React from 'react'
import { MultiSelect } from 'bs-prototypes'

const GRADES = [
  { value: 'k', label: 'Kindergarten' },
  { value: '1', label: '1st Grade' },
  { value: '2', label: '2nd Grade' },
  { value: '3', label: '3rd Grade' },
  { value: '4', label: '4th Grade' },
  { value: '5', label: '5th Grade' },
]

export const Empty = () => {
  const [value, setValue] = React.useState<string[]>([])
  return (
    <MultiSelect
      label="Eligible grades"
      options={GRADES}
      value={value}
      onChange={setValue}
      placeholder="Select grades…"
    />
  )
}

export const Selected = () => {
  const [value, setValue] = React.useState<string[]>(['3', '4', '5'])
  return (
    <MultiSelect
      label="Eligible grades"
      options={GRADES}
      value={value}
      onChange={setValue}
      placeholder="Select grades…"
    />
  )
}

export const SingleSelection = () => {
  const [value, setValue] = React.useState<string[]>(['k'])
  return (
    <MultiSelect
      label="Eligible grades"
      options={GRADES}
      value={value}
      onChange={setValue}
      placeholder="Select grades…"
    />
  )
}
