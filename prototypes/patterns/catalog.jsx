// Pattern-library catalog: GROUPS metadata + the assembled SECTIONS list.
//
// A group may declare `subs` — an ordered list of sub-groups — and an entry
// names one with `sub:`. It is the same idea as `group:` one level down, and
// for the same reason: a group of thirty is a wall you scroll rather than a
// list you read. Only a group that has outgrown one list needs them; most
// don't, and a group without `subs` renders exactly as it did.
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
import { collectionEngineSections } from './sections/collection-engine'
import { collectionEngineTeacherSections } from './sections/collection-engine-teacher'
import { rmiSections } from './sections/rmi'
import { mobileSections } from './sections/mobile'
import { mobileIconSections } from './sections/mobile-icons'

// Global resets + body font (needed for Radix portals outside .pt-shell)
import '../ris/index.css'
import '../collection-engine/index.css'
import '../collection-engine-teacher/index.css'

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

// The group page's own header: the name, and nothing under it. The blurb was
// the same sentence as the group's tile on the home index, read a second time
// by somebody who has already chosen the group.
export function GroupHeader({ title }) {
  return (
    <div className="pt-group-header">
      <div className="pt-group-header-title">{title}</div>
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

/**
 * Which design system a group belongs to. The library hosts two: the web system in `components/`
 * and the mobile one in `mobile/`, mirrored from the React Native app. They share this shell but
 * never share a page — the toggle in the sidebar swaps the whole catalog, because a component from
 * the wrong system is never the answer to "what should I use here?".
 *
 * A group with no `platform` is desktop, so the existing 24 needed no edit.
 */
export const PLATFORMS = [
  { id: 'desktop', title: 'Desktop' },
  { id: 'mobile', title: 'Mobile' },
]

export const platformOf = (group) => group?.platform ?? 'desktop'

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
    desc: 'The reader-facing app — the chrome every page sits in, the rail beside it, and a section per thing a reader actually does: challenges, reading, people, reviews, and the account behind the gear.',
    color: 'var(--c-orange)',
    // Named for the reader's own nav wherever there is a tab to name them
    // after, and for what the thing *is* where there isn't.
    subs: [
      { id: 'chrome', title: 'Chrome' },
      { id: 'rail', title: 'The rail' },
      { id: 'challenges', title: 'Challenges' },
      { id: 'reading', title: 'Reading' },
      { id: 'people', title: 'People' },
      { id: 'reviews', title: 'Reviews' },
      { id: 'account', title: 'Account & reading apps' },
    ],
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
    desc: 'Components for the Challenge Creator — the type picker that decides what every later step asks, the badge ladder and the pickers that fill it, the disclosure that keeps one decision per screen, the reader-facing preview, and the gameboard type: the drag-and-drop board readers travel and its illustrated theme picker.',
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
    desc: 'Components for the Admin Dashboard prototype — the draggable grid an admin rearranges, every widget that sits in it, the fixed rail of things to do next, and the chrome around them: the settings popover, the announcement bar, and the layout templates.',
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
    id: 'rmi',
    kind: 'prototype',
    title: 'Reading Motivation Index',
    desc: 'The report body of the standalone RMI product — the three score gauges, Benny\u2019s generated summary, the reading goal and recommended actions, and the ten-factor table. The same five blocks build a class report and one reader\u2019s.',
    color: 'var(--c-teal)',
  },
  {
    id: 'collection-engine',
    kind: 'prototype',
    title: 'Collection Engine',
    desc: 'Components for the Collection Engine \u2014 the parts that keep a recommendation honest about where a reader can actually get a book: the three-certainty holdings row, the call number that walks them to a shelf, the catalog\u2019s "as of" stamp, and the feed cards behind it.',
    color: 'var(--c-teal-ink)',
  },
  {
    id: 'collection-engine-teacher',
    kind: 'prototype',
    title: 'Collection Engine: Teacher',
    desc: 'The classroom and profile surfaces of the Collection Engine \u2014 the tab a teacher scans to see who the engine is reaching, and the profile section that shows one reader what they were handed and what came of it.',
    color: 'var(--c-purple)',
  },
  {
    id: 'engagement-signals',
    kind: 'prototype',
    title: 'Engagement Signals',
    desc: 'Components for Reading Engagement Signals — the Increasing / Consistent / Declining pill, the month-by-month trajectory, the six drivers behind a reading, and the two surfaces they appear on: the classroom Engagement tab and the profile\u2019s Engagement section.',
    color: 'var(--c-red)',
  },

  // ── Mobile ──────────────────────────────────────────────────────────────
  {
    id: 'm-foundations',
    title: 'Foundations',
    platform: 'mobile',
    desc: 'The generated layer — the palette and type ladder ported straight from the app’s own theme, plus the per-tenant accent.',
    color: 'var(--c-teal)',
  },
  {
    id: 'm-iconography',
    title: 'Iconography',
    platform: 'mobile',
    desc: 'The app’s whole icon system — 314 raster assets addressed by key, mirrored from its own registry. Check here before drawing anything new.',
    color: 'var(--c-purple)',
  },
  {
    id: 'm-controls',
    title: 'Buttons & Labels',
    platform: 'mobile',
    desc: 'The things you tap, and the chips that annotate them.',
    color: 'var(--c-blue)',
  },
  {
    id: 'm-content',
    title: 'Content',
    platform: 'mobile',
    desc: 'Cards, avatars and empty states — what a screen is actually made of.',
    color: 'var(--c-green)',
  },
  {
    id: 'm-feedback',
    title: 'Feedback & States',
    platform: 'mobile',
    desc: 'What a list shows when it has nothing, is still fetching, or is being pulled on — the three states a populated screenshot never covers.',
    color: 'var(--c-blue)',
  },
  {
    id: 'm-overlays',
    title: 'Overlays',
    platform: 'mobile',
    desc: 'What comes up over a screen — the “…” action sheet every options menu uses, and the system alert that confirms anything destructive.',
    color: 'var(--c-orange)',
  },
  {
    id: 'm-chrome',
    title: 'App Chrome',
    platform: 'mobile',
    desc: 'The device shell and the navigation furniture — the frame, the header, and the tab bar with its FAB.',
    color: 'var(--c-purple)',
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
  ...collectionEngineSections,
  ...collectionEngineTeacherSections,
  ...rmiSections,
  ...mobileSections,
  ...mobileIconSections,
]
