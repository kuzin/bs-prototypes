import React from 'react'
import { Textarea } from 'bs-prototypes'

export const WithText = () => {
  const [value, setValue] = React.useState(
    'Ivan is a gorilla who has lived at the mall for 27 years. I loved how he learns to hope again after meeting Ruby. This book made me think about how animals deserve a real home.',
  )
  return (
    <Textarea
      rows={4}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
    />
  )
}

export const Placeholder = () => {
  const [value, setValue] = React.useState('')
  return (
    <Textarea
      rows={4}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
      placeholder="Write a quick review of what you read today…"
    />
  )
}

export const WithLabel = () => {
  const [value, setValue] = React.useState(
    'Earn the Streak Master badge for reading 20 minutes every day this week.',
  )
  return (
    <Textarea
      label="Challenge description"
      rows={3}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
    />
  )
}

export const Disabled = () => (
  <Textarea rows={3} value="Reading log entries are locked once the challenge ends." disabled />
)
