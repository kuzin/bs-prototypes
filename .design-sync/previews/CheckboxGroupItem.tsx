import React from 'react'
import { CheckboxGroup, CheckboxGroupItem } from 'bs-prototypes'

export const InGroup = () => {
  const [value, setValue] = React.useState<string[]>(['adventure', 'fantasy'])
  return (
    <CheckboxGroup value={value} onChange={setValue}>
      <CheckboxGroupItem value="adventure">Adventure</CheckboxGroupItem>
      <CheckboxGroupItem value="mystery">Mystery</CheckboxGroupItem>
      <CheckboxGroupItem value="fantasy">Fantasy</CheckboxGroupItem>
      <CheckboxGroupItem value="biography">Biography</CheckboxGroupItem>
    </CheckboxGroup>
  )
}

export const Disabled = () => {
  const [value, setValue] = React.useState<string[]>(['streak'])
  return (
    <CheckboxGroup value={value} onChange={setValue}>
      <CheckboxGroupItem value="streak">Streak reminders</CheckboxGroupItem>
      <CheckboxGroupItem value="digest" disabled>Weekly digest (coming soon)</CheckboxGroupItem>
    </CheckboxGroup>
  )
}
