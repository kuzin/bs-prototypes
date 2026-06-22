import React from 'react'
import { Divider } from 'bs-prototypes'

export const Plain = () => (
  <div style={{ width: 280 }}>
    <div style={{ fontFamily: 'var(--font-body, Nunito)', fontWeight: 700, marginBottom: 8 }}>
      Reading Streak
    </div>
    <Divider />
    <div style={{ fontFamily: 'var(--font-body, Nunito)', color: '#64748b', marginTop: 8 }}>
      14 days and counting
    </div>
  </div>
)

export const Labeled = () => (
  <div style={{ width: 280 }}>
    <Divider label="OR" />
  </div>
)

export const Vertical = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      height: 36,
      fontFamily: 'var(--font-body, Nunito)',
    }}
  >
    <span>240 min read</span>
    <Divider orientation="vertical" />
    <span>8 badges</span>
    <Divider orientation="vertical" />
    <span>RMI 32</span>
  </div>
)
