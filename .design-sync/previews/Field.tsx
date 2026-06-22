import React from 'react'
import { Field, Input, Select } from 'bs-prototypes'

export const WithHelp = () => {
  const [value, setValue] = React.useState('Lincoln Elementary')
  return (
    <Field label="School name" help="Shown on every dashboard and student report.">
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        placeholder="Lincoln Elementary"
      />
    </Field>
  )
}

export const Required = () => {
  const [value, setValue] = React.useState('summer-2026')
  return (
    <Field label="Challenge name" hint="visible to students" required>
      <Select value={value} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setValue(e.target.value)}>
        <option value="summer-2026">Summer Reading 2026</option>
        <option value="winter-streak">Winter Streak Sprint</option>
        <option value="book-bingo">Class Book Bingo</option>
      </Select>
    </Field>
  )
}

export const WithError = () => {
  const [value, setValue] = React.useState('')
  return (
    <Field label="Daily reading goal (minutes)" error="Enter a goal between 5 and 120 minutes." required>
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        placeholder="20"
      />
    </Field>
  )
}
