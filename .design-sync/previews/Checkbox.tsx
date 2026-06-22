import React from 'react'
import { Checkbox } from 'bs-prototypes'

export const Checked = () => {
  const [on, setOn] = React.useState(true)
  return <Checkbox checked={on} onChange={setOn}>Count weekend reading toward streaks</Checkbox>
}

export const Unchecked = () => {
  const [on, setOn] = React.useState(false)
  return <Checkbox checked={on} onChange={setOn}>Require a parent signature on each log</Checkbox>
}

export const Group = () => {
  const [opts, setOpts] = React.useState({ streak: true, badges: true, leaderboard: false })
  const toggle = (k: keyof typeof opts) => setOpts((o) => ({ ...o, [k]: !o[k] }))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Checkbox checked={opts.streak} onChange={() => toggle('streak')}>Reading streaks</Checkbox>
      <Checkbox checked={opts.badges} onChange={() => toggle('badges')}>Earnable badges</Checkbox>
      <Checkbox checked={opts.leaderboard} onChange={() => toggle('leaderboard')}>Class leaderboard</Checkbox>
    </div>
  )
}

export const Disabled = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <Checkbox checked disabled>RMI tracking (always on)</Checkbox>
    <Checkbox checked={false} disabled>Public sharing (district disabled)</Checkbox>
  </div>
)
