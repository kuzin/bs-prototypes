import React from 'react'
import { RangeSlider } from 'bs-prototypes'

export const Default = () => {
  const [value, setValue] = React.useState(50)
  return <RangeSlider value={value} onChange={setValue} />
}

export const WithLabel = () => {
  const [value, setValue] = React.useState(20)
  return (
    <RangeSlider
      label="Daily reading goal (minutes)"
      min={0}
      max={60}
      step={5}
      value={value}
      onChange={setValue}
    />
  )
}

export const NoValue = () => {
  const [value, setValue] = React.useState(800)
  return (
    <RangeSlider min={200} max={1200} step={50} value={value} onChange={setValue} showValue={false} />
  )
}
