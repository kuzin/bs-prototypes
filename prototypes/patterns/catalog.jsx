// Pattern-library catalog: GROUPS metadata + the assembled SECTIONS list.
//
// The showcase functions, fixtures, and per-group SECTION entries now live in
// ./sections/<group>.jsx. This file stays slim: it keeps the four public
// exports (GROUPS, SECTIONS, GroupHeader, BreakpointIndicator), wires together
// the per-group section arrays, and owns the CSS imports so every component
// renders correctly regardless of which section file pulls it in.

import { useSyncExternalStore } from 'react'

import { atomsSections } from './sections/atoms'
import { moleculesSections } from './sections/molecules'
import { formFieldsSections } from './sections/form-fields'
import { formPatternsSections } from './sections/form-patterns'
import { chartsSections } from './sections/charts'
import { domainSections } from './sections/domain'
import { layoutSections } from './sections/layout'
import { sfrSections } from './sections/sfr'
import { insightsSections } from './sections/insights'

// Global resets + Nunito font on body (needed for Radix portals outside .pt-shell)
import '../ris/index.css'

// Bring in CSS for the components so they render properly here
import '@components/Cards/Cards.css'
import '../ris/components/SchoolDashboard.css'
import '@components/ReadingHealth/ReadingHealth.css'
import '@components/AlertsBanner/AlertsBanner.css'
import '@components/Hero/Hero.css'
import '@components/BackBar/BackBar.css'
import '@components/Toggle/Toggle.css'
import '@components/Form/Form.css'
import '@components/FilterBar/FilterBar.css'
import '@components/Primitives/Primitives.css'
import '@components/BarList/BarList.css'
import '@components/Funnel/Funnel.css'
import '@components/BennyBubble/BennyBubble.css'
import '../sfr/components/Overview.css'
import '../sfr/components/SessionsTable.css'
import '../sfr/components/SessionModal.css'
import '../sfr/components/SfrPage.css'
import '@components/ActiveFilters/ActiveFilters.css'
import '../insights/index.css'

import './App.css'

export function GroupHeader({ title, desc }) {
  return (
    <div className="pt-group-header">
      <div className="pt-group-header-title">{title}</div>
      <div className="pt-group-header-desc">{desc}</div>
    </div>
  )
}

// ── Breakpoint indicator (fixed corner pill) ─────────────────────────────
function subscribeViewport(cb) {
  window.addEventListener('resize', cb)
  return () => window.removeEventListener('resize', cb)
}
export function BreakpointIndicator() {
  const width = useSyncExternalStore(
    subscribeViewport,
    () => window.innerWidth,
    () => 1280,
  )
  const tier =
    width <= 699
      ? { label: 'mobile', color: '#DC2626' }
      : width <= 1099
        ? { label: 'tablet', color: '#D97706' }
        : { label: 'desktop', color: '#16A34A' }
  return (
    <div className="pt-breakpoint" style={{ '--bp-color': tier.color }}>
      <span className="pt-breakpoint-dot" />
      <span className="pt-breakpoint-tier">{tier.label}</span>
      <span className="pt-breakpoint-px">{width}px</span>
    </div>
  )
}

export const GROUPS = [
  {
    id: 'atoms',
    title: "Atoms",
    desc: "The smallest, indivisible UI building blocks — single-purpose and stateless.",
    color: '#2563EB',
    icon: (
      <svg
                  viewBox="0 0 20 20"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="6" height="6" rx="1.5" />
                  <rect x="11" y="3" width="6" height="6" rx="1.5" />
                  <rect x="3" y="11" width="6" height="6" rx="1.5" />
                  <rect x="11" y="11" width="6" height="6" rx="1.5" />
                </svg>
    ),
  },
  {
    id: 'molecules',
    title: "Molecules",
    desc: "Atoms combined into simple, behavior-driven components.",
    color: '#7C3AED',
    icon: (
      <svg
                  viewBox="0 0 20 20"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="10" cy="10" r="3" />
                  <circle cx="3.5" cy="5" r="2" />
                  <circle cx="16.5" cy="5" r="2" />
                  <circle cx="3.5" cy="15" r="2" />
                  <circle cx="16.5" cy="15" r="2" />
                  <line x1="5.5" y1="6" x2="8" y2="8.5" />
                  <line x1="14.5" y1="6" x2="12" y2="8.5" />
                  <line x1="5.5" y1="14" x2="8" y2="11.5" />
                  <line x1="14.5" y1="14" x2="12" y2="11.5" />
                </svg>
    ),
  },
  {
    id: 'form-fields',
    title: "Form Fields",
    desc: "Single-purpose input controls — the atoms of data entry.",
    color: '#0891B2',
    icon: (
      <svg
                  viewBox="0 0 20 20"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="14" height="3" rx="1" />
                  <rect x="3" y="8.5" width="14" height="3" rx="1" />
                  <rect x="3" y="14" width="8" height="3" rx="1" />
                </svg>
    ),
  },
  {
    id: 'form-patterns',
    title: "Form Patterns",
    desc: "Composed inputs and layout patterns for building complete forms.",
    color: '#059669',
    icon: (
      <svg
                  viewBox="0 0 20 20"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="14" height="3.5" rx="1" />
                  <rect x="3" y="8.5" width="9" height="3.5" rx="1" />
                  <rect x="3" y="14" width="11" height="3.5" rx="1" />
                  <circle cx="15.5" cy="15.75" r="2.5" />
                  <line x1="14.5" y1="15.75" x2="16.5" y2="15.75" />
                  <line x1="15.5" y1="14.75" x2="15.5" y2="16.75" />
                </svg>
    ),
  },
  {
    id: 'charts',
    title: "Charts",
    desc: "Data visualization — stat cards, line, bar, scatter, funnels, and tooltips.",
    color: '#D97706',
    icon: (
      <svg
                  viewBox="0 0 20 20"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="10" width="3" height="7" rx="1" />
                  <rect x="8.5" y="6" width="3" height="11" rx="1" />
                  <rect x="14" y="2" width="3" height="15" rx="1" />
                </svg>
    ),
  },
  {
    id: 'domain',
    title: "Domain",
    desc: "Beanstack-specific components — reading health, alerts, and RMI.",
    color: '#E8866A',
    icon: (
      <svg
                  viewBox="0 0 20 20"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 2.5 16 4.5v5.7c0 3.7-2.7 6.7-6 7.6-3.3-.9-6-3.9-6-7.6V4.5z" />
                  <polyline points="7,10 9,12 13,8" />
                </svg>
    ),
  },
  {
    id: 'layout',
    title: "Layout",
    desc: "Page structure, navigation shells, sidebars, and chrome.",
    color: '#475569',
    icon: (
      <svg
                  viewBox="0 0 20 20"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="16" height="16" rx="2" />
                  <line x1="2" y1="7" x2="18" y2="7" />
                  <line x1="7" y1="7" x2="7" y2="18" />
                </svg>
    ),
  },
  {
    id: 'sfr',
    kind: 'prototype',
    title: "Sessions for Review",
    desc: "Components for the SfR prototype — overview highlight cards, sessions table, and the session detail modal.",
    color: '#16A97A',
    icon: (
      <svg
                  viewBox="0 0 20 20"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 2v12" />
                  <path d="M3 2h10l-2.5 5 2.5 5H3" />
                  <circle cx="15" cy="10" r="3" />
                  <line x1="18" y1="13" x2="20" y2="15" />
                </svg>
    ),
  },
  {
    id: 'insights',
    kind: 'prototype',
    title: 'Insights',
    desc: 'Components specific to the Insights prototype — production-styled metric tiles and detail panels with load / empty states.',
    color: '#4F46E5',
    icon: (
      <svg
        viewBox="0 0 20 20"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2.5" y="3" width="6.5" height="6.5" rx="1.5" />
        <rect x="11" y="3" width="6.5" height="6.5" rx="1.5" />
        <rect x="2.5" y="11.5" width="6.5" height="5.5" rx="1.5" />
        <rect x="11" y="11.5" width="6.5" height="5.5" rx="1.5" />
      </svg>
    ),
  },
]

export const SECTIONS = [
  ...atomsSections,
  ...moleculesSections,
  ...formFieldsSections,
  ...formPatternsSections,
  ...chartsSections,
  ...domainSections,
  ...layoutSections,
  ...sfrSections,
  ...insightsSections,
]
