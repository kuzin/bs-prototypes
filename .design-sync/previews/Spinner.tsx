import React from 'react'
import { Spinner } from 'bs-prototypes'

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>{children}</div>
)

export const Sizes = () => (
  <Row>
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
  </Row>
)

export const Colored = () => (
  <Row>
    <Spinner size="md" color="#1D4ED8" />
    <Spinner size="md" color="#0DA7BC" />
    <Spinner size="md" color="#16A34A" />
  </Row>
)

export const Inline = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-body, Nunito)',
      color: '#64748b',
    }}
  >
    <Spinner size="sm" color="#1D4ED8" />
    <span>Syncing reading logs…</span>
  </div>
)
