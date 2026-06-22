import React from 'react'
import { SettingList, SettingRow, Pill } from 'bs-prototypes'

export const NotificationSettings = () => {
  const [streak, setStreak] = React.useState(true)
  const [goal, setGoal] = React.useState(true)
  const [digest, setDigest] = React.useState(false)
  return (
    <SettingList>
      <SettingRow label="Streak reminders" sub="Nudge students before a streak breaks" checked={streak} onChange={setStreak} />
      <SettingRow label="Goal milestones" sub="Celebrate when a class hits its goal" checked={goal} onChange={setGoal} />
      <SettingRow label="Weekly digest email" checked={digest} onChange={setDigest} />
    </SettingList>
  )
}

export const ChallengeSettings = () => {
  const [auto, setAuto] = React.useState(false)
  return (
    <SettingList>
      <SettingRow label="Auto-enroll new students" checked={auto} onChange={setAuto} />
      <SettingRow label="Status" control={<Pill color="#16A34A" variant="filled">Live</Pill>} />
      <SettingRow label="Audience" sub="Who can join this challenge" control={<Pill color="#0DA7BC" variant="outline">Grades 3–5</Pill>} />
    </SettingList>
  )
}
