// Pattern-library catalog: GROUPS metadata + the assembled SECTIONS list.
//
// The showcase functions, fixtures, and SECTION entries live in ./sections/*.jsx.
// A file is just *where the showcase code lives* — the `group:` field on each
// entry is what decides which group it shows up under, so one file can feed
// several groups (the shared primitives were re-sorted into purpose-named
// groups without moving their demos around). This file stays slim: it keeps the
// four public exports (GROUPS, SECTIONS, GroupHeader, BreakpointIndicator),
// wires together the section arrays, and owns the CSS imports so every
// component renders correctly regardless of which section file pulls it in.

import { useSyncExternalStore } from 'react'

import { foundationsSections } from './sections/foundations'
import { atomsSections } from './sections/atoms'
import { moleculesSections } from './sections/molecules'
import { formFieldsSections } from './sections/form-fields'
import { formPatternsSections } from './sections/form-patterns'
import { chartsSections } from './sections/charts'
import { domainSections } from './sections/domain'
import { layoutSections } from './sections/layout'
import { readerAppSections } from './sections/reader-app'
import { sfrSections } from './sections/sfr'
import { insightsSections } from './sections/insights'
import { challengeCreatorSections } from './sections/challenge-creator'
import { bookTalksSections } from './sections/book-talks'
import { studentProfileSections } from './sections/student-profile'
import { booksSections } from './sections/books'
import { adminDashboardSections } from './sections/admin-dashboard'
import { gameboardSections } from './sections/gameboard'
import { gameboardReaderSections } from './sections/gameboard-reader'
import { wordsWithBennySections } from './sections/words-with-benny'
import { engagementSignalsSections } from './sections/engagement-signals'

// Global resets + body font (needed for Radix portals outside .pt-shell)
import '../ris/index.css'

// Bring in CSS for the components so they render properly here
import '@components/Cards/Cards.css'
import '../ris/components/SchoolDashboard.css'
import '@components/ReadingHealth/ReadingHealth.css'
import '@components/AlertsBanner/AlertsBanner.css'
import '@components/Hero/Hero.css'
import '@components/BeanstackLogo/BeanstackLogo.css'
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
import '../admin-dashboard/index.css'

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
      ? { label: 'mobile', color: '#E85648' }
      : width <= 1099
        ? { label: 'tablet', color: '#AB720A' }
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
    desc: 'Design tokens — the color, type, spacing, radius, and elevation scales everything else is built from.',
    color: 'var(--c-teal)',
  },
  {
    id: 'iconography',
    title: 'Iconography',
    desc: 'Every named art set in one place — the Tabler-backed Icon registry, the Plumpy duotone family, the app’s own drawn art, and the reading partners’ logos.',
    color: 'var(--c-purple)',
  },
  {
    id: 'actions',
    title: 'Buttons & Actions',
    desc: 'The controls you click to do something — page buttons and the two shapes a table-row action is allowed to take.',
    color: 'var(--c-blue)',
  },
  {
    id: 'badges',
    title: 'Badges & Labels',
    desc: 'Small read-only markers that annotate something else — status chips, avatars, and trend direction.',
    color: 'var(--c-orange)',
  },
  {
    id: 'cards',
    title: 'Cards & Sections',
    desc: 'Every container content sits inside — stat and chart cards, titled sections, profile cards, notes, headings, dividers, and disclosure.',
    color: 'var(--c-green)',
  },
  {
    id: 'tables',
    title: 'Tables & Lists',
    desc: 'The shared data table and the settings-row list, plus their pagination and scroll behavior.',
    color: 'var(--c-gray-750)',
  },
  {
    id: 'form-fields',
    title: 'Form Fields',
    desc: 'Single-purpose input controls — the atoms of data entry.',
    color: 'var(--c-yellow-ink)',
  },
  {
    id: 'form-patterns',
    title: 'Form Patterns',
    desc: 'Composed inputs and layout patterns for building complete forms and filter bars.',
    color: 'var(--c-teal)',
  },
  {
    id: 'overlays',
    title: 'Overlays',
    desc: 'Anything that floats above the page — modals, flyouts, and tooltips.',
    color: 'var(--c-purple)',
  },
  {
    id: 'feedback',
    title: 'Feedback & Status',
    desc: 'How the UI tells you what is happening — loading placeholders, banners, toasts, empty states, celebration, and Benny’s own voice.',
    color: 'var(--c-red)',
  },
  {
    id: 'navigation',
    title: 'Navigation & Chrome',
    desc: 'Page headers, rails, and everything that moves you between views — heroes, sidebars, tabs, and back bars.',
    color: 'var(--c-blue)',
  },
  {
    id: 'charts',
    title: 'Charts',
    desc: 'Data visualization — line, bar, scatter, funnels, word clouds, bar lists, and chart tooltips.',
    color: 'var(--c-green)',
  },
  {
    id: 'web-app',
    kind: 'prototype',
    title: 'Web App',
    desc: 'The reader-facing chrome — the app bar and reader switcher, the challenge grid, the rail’s goal and leaderboard cards, and the partner-connection kit every integration prototype mounts.',
    color: 'var(--c-orange)',
  },
  {
    id: 'ris',
    kind: 'prototype',
    title: 'Reading Information System',
    desc: 'Components for the RIS prototype — the four reading-health tiles and the integrity alert banner that opens the school view.',
    color: 'var(--c-blue)',
  },
  {
    id: 'sfr',
    kind: 'prototype',
    title: 'Sessions for Review',
    desc: 'Components for the SfR prototype — overview highlight cards, sessions table, the session detail modal, and the safety-signal review view + settings.',
    color: 'var(--c-green)',
  },
  {
    id: 'insights',
    kind: 'prototype',
    title: 'Insights',
    desc: 'Components specific to the Insights prototype — production-styled metric tiles and detail panels with load / empty states.',
    color: 'var(--c-purple)',
  },
  {
    id: 'challenge-creator',
    kind: 'prototype',
    title: 'Challenge Creator',
    desc: 'Components for the Challenge Creator — the badge pickers and editor, the color-chip picker, and the gameboard challenge type: the drag-and-drop board readers travel and its illustrated theme picker.',
    color: 'var(--c-teal)',
  },
  {
    id: 'book-talks',
    kind: 'prototype',
    title: 'Benny Book Talks',
    desc: 'Components for the Benny Book Talks prototype — chat bubbles, the live Benny chat modal, and the teacher conversation review.',
    color: 'var(--c-blue)',
  },
  {
    id: 'student-profile',
    kind: 'prototype',
    title: 'Student Profile',
    desc: 'Components for the Student Profile prototype — the side panel the other prototypes open a reader in, the daily-reading grid, status badges, the daily goal ring, RMI donuts, the weekly goal tracker, and the reading-activity heatmap.',
    color: 'var(--c-orange)',
  },
  {
    id: 'books',
    kind: 'prototype',
    title: 'Book Discovery',
    desc: 'Components for the Book Discovery prototype — book covers with gradient fallbacks, the star-rating family, shelf cards, the horizontal shelf, and partner branding.',
    color: 'var(--c-green)',
  },
  {
    id: 'admin-dashboard',
    kind: 'prototype',
    title: 'Admin Dashboard',
    desc: 'Components for the Admin Dashboard prototype — the anchored settings popover used by per-widget and rail-card settings.',
    color: 'var(--c-gray-750)',
  },
  {
    id: 'gameboard-reader',
    kind: 'prototype',
    title: 'Gameboard Reader',
    desc: 'Components for the Gameboard Reader View — the read-only board a reader travels, its earned/locked badge discs, and Benny mid-cheer.',
    color: 'var(--c-yellow-ink)',
  },
  {
    id: 'words-with-benny',
    kind: 'prototype',
    title: 'Words with Benny',
    desc: 'Components for the Words with Benny prototype — the post-log word unlock, the reader\u2019s Collections tab (words, badges, achievements) and its rail card, and the educator roll-up with its per-student drill-down.',
    color: 'var(--c-purple)',
  },
  {
    id: 'engagement-signals',
    kind: 'prototype',
    title: 'Engagement Signals',
    desc: 'Components for Reading Engagement Signals — the Increasing / Consistent / Declining pill, the month-by-month trajectory, the six drivers behind a reading, and the two surfaces they appear on: the classroom Engagement tab and the profile\u2019s Engagement section.',
    color: 'var(--c-red)',
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
  ...readerAppSections,
  ...sfrSections,
  ...insightsSections,
  ...challengeCreatorSections,
  ...bookTalksSections,
  ...studentProfileSections,
  ...booksSections,
  ...adminDashboardSections,
  ...gameboardSections,
  ...gameboardReaderSections,
  ...wordsWithBennySections,
  ...engagementSignalsSections,
]
