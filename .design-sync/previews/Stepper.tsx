import React from 'react'
import { Stepper } from 'bs-prototypes'

const CHALLENGE_STEPS = [
  { id: 'type', name: 'Type' },
  { id: 'setup', name: 'Setup' },
  { id: 'badges', name: 'Badges' },
  { id: 'prizes', name: 'Prizes' },
  { id: 'review', name: 'Review' },
]

export const InProgress = () => {
  const [current, setCurrent] = React.useState('badges')
  return <Stepper steps={CHALLENGE_STEPS} current={current} onStep={setCurrent} />
}

export const FirstStep = () => {
  const [current, setCurrent] = React.useState('type')
  return <Stepper steps={CHALLENGE_STEPS} current={current} onStep={setCurrent} />
}

export const Accent = () => {
  const [current, setCurrent] = React.useState('prizes')
  return (
    <Stepper steps={CHALLENGE_STEPS} current={current} onStep={setCurrent} accent="#E8866A" />
  )
}
