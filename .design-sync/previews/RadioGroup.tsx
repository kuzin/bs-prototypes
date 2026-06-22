import React from 'react'
import { RadioGroup, Radio } from 'bs-prototypes'

export const GradeBand = () => {
  const [value, setValue] = React.useState('3-5')
  return (
    <RadioGroup name="grade-band" layout="column" value={value} onChange={setValue}>
      <Radio value="k-2">Grades K–2</Radio>
      <Radio value="3-5">Grades 3–5</Radio>
      <Radio value="6-8">Grades 6–8</Radio>
      <Radio value="9-12">Grades 9–12</Radio>
    </RadioGroup>
  )
}

export const GoalType = () => {
  const [value, setValue] = React.useState('minutes')
  return (
    <RadioGroup name="goal-type" layout="row" value={value} onChange={setValue}>
      <Radio value="minutes">Minutes read</Radio>
      <Radio value="books">Books finished</Radio>
      <Radio value="days">Days active</Radio>
    </RadioGroup>
  )
}

export const WithDisabled = () => {
  const [value, setValue] = React.useState('weekly')
  return (
    <RadioGroup name="cadence" layout="column" value={value} onChange={setValue}>
      <Radio value="daily">Daily reminders</Radio>
      <Radio value="weekly">Weekly summary</Radio>
      <Radio value="never" disabled>Off (locked by district)</Radio>
    </RadioGroup>
  )
}
