import React from 'react'
import { Icon } from 'bs-prototypes'

const GALLERY = [
  'flame',
  'star-filled',
  'trophy',
  'award',
  'medal',
  'book',
  'users',
  'target',
  'sparkles',
  'trending-up',
  'shield-check',
  'gift',
]

const Cell = ({ name, size = 24 }: { name: string; size?: number }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      width: 76,
      color: '#334155',
    }}
  >
    <Icon name={name} size={size} />
    <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>{name}</span>
  </div>
)

export const Gallery = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
    {GALLERY.map((n) => (
      <Cell key={n} name={n} />
    ))}
  </div>
)

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end', color: '#0DA7BC' }}>
    <Icon name="flame" size={14} />
    <Icon name="flame" size={18} />
    <Icon name="flame" size={24} />
    <Icon name="flame" size={32} />
    <Icon name="flame" size={44} />
  </div>
)

export const Colors = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Icon name="circle-check" size={28} color="#16A34A" />
    <Icon name="flame" size={28} color="#E8866A" />
    <Icon name="trophy" size={28} color="#D97706" />
    <Icon name="shield-check" size={28} color="#1D4ED8" />
    <Icon name="flag" size={28} color="#DC2626" />
  </div>
)
