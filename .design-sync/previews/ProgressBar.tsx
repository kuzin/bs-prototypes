import React from 'react'
import { ProgressBar } from 'bs-prototypes'

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 240 }}>{children}</div>
)

export const Labeled = () => (
  <Stack>
    <ProgressBar value={62} color="#0DA7BC" label="Engagement" valueLabel="62%" />
    <ProgressBar
      value={3.1}
      max={4}
      color="#E8866A"
      label="Enjoyment"
      valueLabel="3.1"
      subLabel="Reading for fun"
    />
    <ProgressBar value={88} color="#16A97A" label="Goal progress" valueLabel="440 / 500 min" />
  </Stack>
)

export const Values = () => (
  <Stack>
    <ProgressBar value={20} color="#DC2626" label="Behind pace" valueLabel="20%" />
    <ProgressBar value={55} color="#D97706" label="Catching up" valueLabel="55%" />
    <ProgressBar value={100} color="#16A34A" label="Challenge complete" valueLabel="100%" />
  </Stack>
)

export const Sizes = () => (
  <Stack>
    <ProgressBar value={70} color="#0DA7BC" size="sm" label="Small" valueLabel="70%" />
    <ProgressBar value={70} color="#0DA7BC" size="md" label="Medium" valueLabel="70%" />
    <ProgressBar value={70} color="#0DA7BC" size="lg" label="Large" valueLabel="70%" />
  </Stack>
)

export const Inline = () => (
  <Stack>
    <ProgressBar inline value={62} color="#0DA7BC" valueLabel="62%" />
    <ProgressBar inline value={91} color="#16A97A" valueLabel="91%" />
  </Stack>
)
