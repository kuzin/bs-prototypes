import React from 'react'
import { ChartCard, BarList, CardNote, TrendChart, Button, Icon } from 'bs-prototypes'

// Inline-styled legend — the shared <ChartLegend> relies on .sdb-legend styles
// that live in a prototype CSS file not shipped in the design-sync bundle, so
// we render an equivalent here to keep this card fully styled.
const Legend = ({ items }: { items: Array<{ color: string; label: string; dashed?: boolean }> }) => (
  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#475569', fontWeight: 600 }}>
    {items.map((it) => (
      <span key={it.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            width: 14,
            height: it.dashed ? 0 : 8,
            borderRadius: 3,
            background: it.dashed ? 'transparent' : it.color,
            borderTop: it.dashed ? `2px dashed ${it.color}` : undefined,
          }}
        />
        {it.label}
      </span>
    ))}
  </div>
)

const MINUTES = [
  { month: 'Sep', school: 142, district: 120 },
  { month: 'Oct', school: 168, district: 131 },
  { month: 'Nov', school: 154, district: 128 },
  { month: 'Dec', school: 121, district: 110 },
  { month: 'Jan', school: 189, district: 140 },
  { month: 'Feb', school: 205, district: 152 },
]

export const WithChart = () => (
  <ChartCard
    title="Minutes read — Lincoln vs. District"
    subtitle="Sep 2025 – Feb 2026"
    icon={<Icon name="trending-up" size={18} />}
    accent="#0DA7BC"
    action={<Button variant="ghost" size="sm">View →</Button>}
    footer={
      <Legend
        items={[
          { color: '#0DA7BC', label: 'Lincoln Elementary' },
          { color: '#94A3B8', label: 'District avg', dashed: true },
        ]}
      />
    }
  >
    <div style={{ height: 220, width: '100%' }}>
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
    </div>
  </ChartCard>
)

export const WithBreakdown = () => (
  <ChartCard
    title="Top-logged books"
    subtitle="This week"
    icon={<Icon name="book" size={18} />}
    accent="#16A97A"
    bodyPad="padded"
  >
    <BarList
      items={[
        { label: 'Dog Man: Mothering Heights', value: 312, max: 312, color: '#0DA7BC', valueLabel: '312' },
        { label: 'The Bad Guys #1', value: 268, max: 312, color: '#16A97A', valueLabel: '268' },
        { label: 'Wings of Fire', value: 201, max: 312, color: '#3B82F6', valueLabel: '201' },
      ]}
    />
  </ChartCard>
)

export const WithNote = () => (
  <ChartCard
    title="Reading-integrity check"
    subtitle="Mrs. Alvarez — Grade 4"
    icon={<Icon name="shield-check" size={18} />}
    accent="#F59E0B"
    bodyPad="padded"
  >
    <CardNote tone="accent">
      <strong>3 sessions</strong> flagged for unusually fast reading. Review before approving badge
      awards.
    </CardNote>
  </ChartCard>
)
