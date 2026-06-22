import React from 'react'
import { SectionCard, Button, Icon } from 'bs-prototypes'

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: 24, fontWeight: 800, color: '#0F2A43' }}>{value}</div>
    <div style={{ fontSize: 12, color: '#5B7186', marginTop: 2 }}>{label}</div>
  </div>
)

export const Plain = () => (
  <SectionCard title="This Week's Reading">
    <div style={{ display: 'flex', gap: 16 }}>
      <Stat label="Minutes read" value="3,420" />
      <Stat label="Active readers" value="24" />
      <Stat label="Books finished" value="11" />
    </div>
  </SectionCard>
)

export const BarHeader = () => (
  <SectionCard header="bar" title="When should Benny engage students in a Book Talk?">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: '#33475B', fontSize: 14 }}>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="radio" name="bt" defaultChecked /> After finishing a book
      </label>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="radio" name="bt" /> After logging 100 minutes
      </label>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="radio" name="bt" /> When a reading streak hits 7 days
      </label>
    </div>
  </SectionCard>
)

export const WithActions = () => (
  <SectionCard
    title="Earnable Badges"
    actions={
      <Button size="sm" variant="secondary" icon={<Icon name="plus" size={14} />}>
        Add badge
      </Button>
    }
  >
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#33475B', fontSize: 14 }}>
      <Icon name="trophy" size={18} color="#E8866A" /> Bookworm
      <Icon name="flame" size={18} color="#E8866A" /> 7-Day Streak
      <Icon name="star-filled" size={18} color="#F0A52E" /> Top Reader
    </div>
  </SectionCard>
)
