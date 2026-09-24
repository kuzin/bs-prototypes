import { useEffect } from 'react'
import { AppShell } from '@components/AppShell/AppShell'
import { useStickyState } from '@components/useStickyState/useStickyState'
import { useTooltipFlip } from '@components/useTooltipFlip/useTooltipFlip'

import { SCHOOLS, LIBRARIAN } from '../data'
import { SchoolOverview } from './SchoolOverview'
import { SchoolCollection } from './SchoolCollection'
import { Setup } from './Setup'
import { DistrictOverview } from './DistrictOverview'
import { DistrictCollection } from './DistrictCollection'

// Three screens per scope, and every row carries a description — the real
// section menu always pairs a title with a line, and a bare label reads as a
// broken row.
const NAV = (isSchool) => [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'overview',
    desc: isSchool
      ? 'What the engine suggested, and what came of it.'
      : 'Every school, compared on what their collection is doing.',
  },
  {
    id: 'collection',
    label: isSchool ? 'Collection' : 'Collection intelligence',
    icon: 'book',
    desc: isSchool
      ? 'What readers found in your catalogs, and what they asked for.'
      : 'What readers across the district are asking your catalogs for.',
  },
  {
    id: 'setup',
    label: 'Setup',
    icon: 'setup',
    desc: isSchool
      ? 'Which catalogs the engine recommends from, and how fresh they are.'
      : 'Rollout across schools, and the district-wide defaults.',
  },
]

export function CeLayout({ scope }) {
  const isSchool = scope === 'school'
  const [page, setPage] = useStickyState(`ce:${scope}:page`, 'overview')
  // No picker in the sidebar: a librarian has one school. The value is still
  // sticky because the District view drills into a school by writing it before
  // it navigates — that path sets which school this is, not a control here.
  const [schoolId] = useStickyState('ce:school', LIBRARIAN.schoolId)
  useTooltipFlip()
  // A new page opens at its top, not at wherever the last one was scrolled to —
  // the content column is one scroller shared by all three.
  useEffect(() => {
    document.querySelector('.ce-shell .app-shell-content')?.scrollTo(0, 0)
  }, [page])

  const school = SCHOOLS.find((s) => s.id === schoolId) ?? SCHOOLS[0]

  function renderPage() {
    if (isSchool) {
      if (page === 'collection') return <SchoolCollection school={school} />
      if (page === 'setup') return <Setup scope="school" school={school} />
      return <SchoolOverview school={school} onNavigate={setPage} />
    }
    if (page === 'collection') return <DistrictCollection />
    if (page === 'setup') return <Setup scope="district" />
    return <DistrictOverview onNavigate={setPage} />
  }

  return (
    <AppShell
      className="ce-shell"
      sidebar={{
        nav: NAV(isSchool),
        active: page,
        onNavigate: setPage,
        title: 'Collection Engine',
        subtitle: isSchool ? 'School View' : 'District View',
      }}
      backBar={
        page !== 'overview'
          ? { label: 'Back to Overview', onClick: () => setPage('overview') }
          : undefined
      }
    >
      <div className="app-shell-page" tabIndex={0} role="region" aria-label="Page content">
        {renderPage()}
      </div>
    </AppShell>
  )
}
