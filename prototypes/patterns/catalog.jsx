// Pattern-library catalog: GROUPS metadata + the assembled SECTIONS list.
//
// The showcase functions, fixtures, and per-group SECTION entries now live in
// ./sections/<group>.jsx. This file stays slim: it keeps the four public
// exports (GROUPS, SECTIONS, GroupHeader, BreakpointIndicator), wires together
// the per-group section arrays, and owns the CSS imports so every component
// renders correctly regardless of which section file pulls it in.

import { useSyncExternalStore } from 'react'

import { Icon } from '@components/Icon/Icon'

import { foundationsSections } from './sections/foundations'
import { atomsSections } from './sections/atoms'
import { moleculesSections } from './sections/molecules'
import { formFieldsSections } from './sections/form-fields'
import { formPatternsSections } from './sections/form-patterns'
import { chartsSections } from './sections/charts'
import { domainSections } from './sections/domain'
import { layoutSections } from './sections/layout'
import { sfrSections } from './sections/sfr'
import { insightsSections } from './sections/insights'
import { challengeCreatorSections } from './sections/challenge-creator'
import { bookTalksSections } from './sections/book-talks'
import { studentProfileSections } from './sections/student-profile'
import { booksSections } from './sections/books'

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
import '@components/RichText/RichText.css'
import '@components/ImageDropzone/ImageDropzone.css'
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
import '../challenge-creator/index.css'
import '../book-talks/index.css'
import '../student-profile/BeanstackProfile.css'
import '../books/index.css'

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
    id: 'foundations',
    title: 'Foundations',
    desc: 'Design tokens — the shared color palette every component and prototype draws from.',
    color: '#0DA7BC',
    icon: <Icon name="palette" size={22} />,
  },
  {
    id: 'atoms',
    title: 'Atoms',
    desc: 'The smallest, indivisible UI building blocks — single-purpose and stateless.',
    color: '#2563EB',
    icon: <Icon name="layout-grid" size={22} />,
  },
  {
    id: 'molecules',
    title: 'Molecules',
    desc: 'Atoms combined into simple, behavior-driven components.',
    color: '#7C3AED',
    icon: <Icon name="atom" size={22} />,
  },
  {
    id: 'form-fields',
    title: 'Form Fields',
    desc: 'Single-purpose input controls — the atoms of data entry.',
    color: '#0891B2',
    icon: <Icon name="forms" size={22} />,
  },
  {
    id: 'form-patterns',
    title: 'Form Patterns',
    desc: 'Composed inputs and layout patterns for building complete forms.',
    color: '#059669',
    icon: <Icon name="forms" size={22} />,
  },
  {
    id: 'charts',
    title: 'Charts',
    desc: 'Data visualization — stat cards, line, bar, scatter, funnels, and tooltips.',
    color: '#D97706',
    icon: <Icon name="chart-bar" size={22} />,
  },
  {
    id: 'domain',
    title: 'Domain',
    desc: 'Beanstack-specific components — reading health, alerts, and RMI.',
    color: '#E8866A',
    icon: <Icon name="shield-check" size={22} />,
  },
  {
    id: 'layout',
    title: 'Layout',
    desc: 'Page structure, navigation shells, sidebars, and chrome.',
    color: '#475569',
    icon: <Icon name="layout" size={22} />,
  },
  {
    id: 'sfr',
    kind: 'prototype',
    title: 'Sessions for Review',
    desc: 'Components for the SfR prototype — overview highlight cards, sessions table, the session detail modal, and the safety-signal review view + settings.',
    color: '#16A97A',
    icon: <Icon name="message-check" size={22} />,
  },
  {
    id: 'insights',
    kind: 'prototype',
    title: 'Insights',
    desc: 'Components specific to the Insights prototype — production-styled metric tiles and detail panels with load / empty states.',
    color: '#4F46E5',
    icon: <Icon name="layout-grid" size={22} />,
  },
  {
    id: 'challenge-creator',
    kind: 'prototype',
    title: 'Challenge Creator',
    desc: 'Components specific to the Challenge Creator V2 prototype — starting with the shared color-chip picker.',
    color: '#0DA7BC',
    icon: <Icon name="trophy" size={22} />,
  },
  {
    id: 'book-talks',
    kind: 'prototype',
    title: 'Benny Book Talks',
    desc: 'Components for the Benny Book Talks prototype — chat bubbles, the live Benny chat modal, and the teacher conversation review.',
    color: '#14B8A6',
    icon: <Icon name="message-chatbot" size={22} />,
  },
  {
    id: 'student-profile',
    kind: 'prototype',
    title: 'Student Profile',
    desc: 'Components for the Student Profile prototype — status badges, the daily goal ring, RMI donuts, the weekly goal tracker, and the reading-activity heatmap.',
    color: '#E8866A',
    icon: <Icon name="user" size={22} />,
  },
  {
    id: 'books',
    kind: 'prototype',
    title: 'Book Discovery',
    desc: 'Components for the Book Discovery prototype — book covers with gradient fallbacks, the star-rating family, shelf cards, the horizontal shelf, and partner branding.',
    color: '#0D9488',
    icon: <Icon name="compass" size={22} />,
  },
]

export const SECTIONS = [
  ...foundationsSections,
  ...atomsSections,
  ...moleculesSections,
  ...formFieldsSections,
  ...formPatternsSections,
  ...chartsSections,
  ...domainSections,
  ...layoutSections,
  ...sfrSections,
  ...insightsSections,
  ...challengeCreatorSections,
  ...bookTalksSections,
  ...studentProfileSections,
  ...booksSections,
]
