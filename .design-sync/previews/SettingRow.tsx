import React from 'react'
import { SettingRow, SettingList, Pill } from 'bs-prototypes'

export const Default = () => {
  const [completions, setCompletions] = React.useState(true)
  const [featured, setFeatured] = React.useState(false)
  const [leaderboard, setLeaderboard] = React.useState(true)
  return (
    <SettingList>
      <SettingRow
        label="Notify on title completions"
        checked={completions}
        onChange={setCompletions}
      />
      <SettingRow
        label="Feature this challenge"
        sub="Pin it to the top of the student dashboard"
        checked={featured}
        onChange={setFeatured}
      />
      <SettingRow
        label="Show class leaderboard"
        sub="Students see ranked reading minutes"
        checked={leaderboard}
        onChange={setLeaderboard}
      />
    </SettingList>
  )
}

export const WithStateAndControl = () => {
  const [verify, setVerify] = React.useState(false)
  return (
    <SettingList>
      <SettingRow label="On title completions" state="Disabled" checked={verify} onChange={setVerify} />
      <SettingRow label="Visibility" control={<Pill color="#0DA7BC" variant="outline">Public</Pill>} />
      <SettingRow
        label="Reading integrity checks"
        sub="Flag suspicious reading logs for review"
        control={<Pill color="#16A34A">On</Pill>}
      />
    </SettingList>
  )
}
