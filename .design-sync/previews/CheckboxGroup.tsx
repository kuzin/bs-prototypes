import React from 'react'
import { CheckboxGroup, CheckboxGroupItem } from 'bs-prototypes'

export const Genres = () => {
  const [value, setValue] = React.useState<string[]>(['adventure', 'mystery'])
  return (
    <CheckboxGroup value={value} onChange={setValue}>
      <CheckboxGroupItem value="adventure">Adventure</CheckboxGroupItem>
      <CheckboxGroupItem value="mystery">Mystery</CheckboxGroupItem>
      <CheckboxGroupItem value="fantasy">Fantasy</CheckboxGroupItem>
      <CheckboxGroupItem value="biography">Biography</CheckboxGroupItem>
      <CheckboxGroupItem value="poetry">Poetry</CheckboxGroupItem>
    </CheckboxGroup>
  )
}

export const Notifications = () => {
  const [value, setValue] = React.useState<string[]>(['streak', 'badge'])
  return (
    <CheckboxGroup value={value} onChange={setValue}>
      <CheckboxGroupItem value="streak">Streak reminders</CheckboxGroupItem>
      <CheckboxGroupItem value="badge">New badge earned</CheckboxGroupItem>
      <CheckboxGroupItem value="goal">Class goal reached</CheckboxGroupItem>
      <CheckboxGroupItem value="weekly" disabled>Weekly digest (coming soon)</CheckboxGroupItem>
    </CheckboxGroup>
  )
}

export const Inline = () => {
  const [value, setValue] = React.useState<string[]>(['mon', 'wed', 'fri'])
  return (
    <CheckboxGroup layout="row" value={value} onChange={setValue}>
      <CheckboxGroupItem value="mon">Mon</CheckboxGroupItem>
      <CheckboxGroupItem value="tue">Tue</CheckboxGroupItem>
      <CheckboxGroupItem value="wed">Wed</CheckboxGroupItem>
      <CheckboxGroupItem value="thu">Thu</CheckboxGroupItem>
      <CheckboxGroupItem value="fri">Fri</CheckboxGroupItem>
    </CheckboxGroup>
  )
}
