import React from 'react'
import { ChartLegend } from 'bs-prototypes'

export const Solid = () => (
  <ChartLegend
    items={[
      { color: '#0DA7BC', label: 'Lincoln Elementary' },
      { color: '#16A97A', label: 'Whitman Middle' },
      { color: '#3B82F6', label: 'Roosevelt High' },
    ]}
  />
)

export const WithDashed = () => (
  <ChartLegend
    items={[
      { color: '#0DA7BC', label: 'This school' },
      { color: '#94A3B8', label: 'District avg', dashed: true },
    ]}
  />
)
