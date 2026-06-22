import React from 'react'
import { TrendChart } from 'bs-prototypes'

const MINUTES = [
  { month: 'Sep', school: 142, district: 120 },
  { month: 'Oct', school: 168, district: 131 },
  { month: 'Nov', school: 154, district: 128 },
  { month: 'Dec', school: 121, district: 110 },
  { month: 'Jan', school: 189, district: 140 },
  { month: 'Feb', school: 205, district: 152 },
]

// nivo needs a sized parent or it renders blank.
const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ height: 240, width: '100%' }}>{children}</div>
)

export const Area = () => (
  <Frame>
    <TrendChart
      type="area"
      data={MINUTES}
      xKey="month"
      yDomain={[0, 240]}
      yUnit=" min"
      series={[{ key: 'school', name: 'Lincoln Elementary', color: '#0DA7BC' }]}
    />
  </Frame>
)

export const MultiLine = () => (
  <Frame>
    <TrendChart
      type="line"
      data={MINUTES}
      xKey="month"
      yDomain={[0, 240]}
      yUnit=" min"
      series={[
        { key: 'school', name: 'Lincoln Elementary', color: '#0DA7BC', fillOpacity: 0 },
        { key: 'district', name: 'District avg', color: '#94A3B8', dashed: true, fillOpacity: 0 },
      ]}
    />
  </Frame>
)

const RMI = [
  { band: 'K–2', avg: 28 },
  { band: '3–5', avg: 33 },
  { band: '6–8', avg: 26 },
  { band: '9–12', avg: 21 },
]

export const Bars = () => (
  <Frame>
    <TrendChart
      type="bar"
      data={RMI}
      xKey="band"
      yDomain={[0, 40]}
      series={[{ key: 'avg', name: 'Avg RMI score', color: '#16A97A' }]}
    />
  </Frame>
)
