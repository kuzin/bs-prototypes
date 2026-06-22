import React from 'react'
import { Skeleton } from 'bs-prototypes'

export const Shapes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <Skeleton width={180} height={16} />
    <Skeleton width={240} height={48} />
    <Skeleton shape="circle" width={40} height={40} />
  </div>
)

export const TextLines = () => (
  <div style={{ width: 260 }}>
    <Skeleton lines={3} />
  </div>
)

export const StudentRow = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 280 }}>
    <Skeleton shape="circle" width={44} height={44} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Skeleton width="60%" height={14} />
      <Skeleton width="40%" height={12} />
    </div>
  </div>
)
