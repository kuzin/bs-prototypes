import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'

import { EducatorWords } from './EducatorWords'
import { CLASS, ROSTER } from '../data'
import './ClassroomPage.css'

// One classroom, opened from Classes and Readers. Vocabulary is a tab on it —
// not a destination of its own — because that's where a teacher already goes to
// look at this class.
//
// The page is Beanstack's real classroom page: the class avatar, "N students ·
// YYYY–YY School Year", Set Classroom Goal / Log for Class, and the three tabs
// it actually has. The design system already encodes it — those two button
// labels are the examples in Button's own docblock, and this tab set is the one
// in Tabs'. Vocabulary is appended as a FOURTH tab rather than replacing
// anything: it's the only thing this prototype is proposing, and the three real
// tabs are here to place it.

const TABS = [
  { id: 'daily', label: 'Daily Reading' },
  { id: 'students', label: 'Students', count: ROSTER.length },
  { id: 'rewards', label: 'Earned Rewards' },
  { id: 'vocabulary', label: 'Vocabulary' },
]

export function ClassroomPage({ onOpenStudent }) {
  return (
    <>
      <div className="app-shell-header">
        <div className="app-shell-header-identity">
          <div className="cp-avatar" aria-hidden="true">
            {CLASS.initials}
          </div>
          <div className="app-shell-header-text">
            <div className="app-shell-header-name-row">
              <span className="app-shell-header-name">{CLASS.name}</span>
            </div>
            <div className="app-shell-header-meta">
              {ROSTER.length} students · {CLASS.year}
            </div>
          </div>
        </div>
        <div className="cp-actions">
          <Button variant="ghost" size="md">
            Set Classroom Goal
          </Button>
          <Button variant="primary" size="md">
            Log for Class
          </Button>
        </div>
      </div>

      <div className="cp-tabsbar">
        {/* No accent — the real page's tabs are the default Beanstack blue. */}
        <Tabs
          variant="underline"
          size="md"
          active="vocabulary"
          ariaLabel="Classroom"
          onChange={() => {}}
          items={TABS}
        />
      </div>

      <EducatorWords onOpenStudent={onOpenStudent} />
    </>
  )
}
