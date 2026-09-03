import { Tabs } from '@components/Tabs/Tabs'
import '@components/Tabs/Tabs.css'

import { EducatorWords } from './EducatorWords'
import { CLASS, ROSTER, TEACHER } from '../data'
import './ClassroomPage.css'

// One classroom, opened from Classes and Readers. Vocabulary is a tab on it —
// not a destination of its own — because that's where a teacher already goes to
// look at this class. Same page shape as the SfR prototype's admin pages: an
// `app-shell-header` identity block over an underline tab bar.
//
// Every tab but Vocabulary is scaffolding: this prototype is only proposing the
// one, and the rest are here to place it.

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'readers', label: 'Readers', count: ROSTER.length },
  { id: 'log', label: 'Reading Log' },
  { id: 'vocabulary', label: 'Vocabulary' },
  { id: 'badges', label: 'Badges' },
]

export function ClassroomPage({ onOpenStudent }) {
  return (
    <>
      <div className="app-shell-header">
        <div className="app-shell-header-identity">
          <div className="cp-avatar" aria-hidden="true">
            {CLASS.name.match(/\d+/)?.[0] ?? '14'}
          </div>
          <div className="app-shell-header-text">
            <div className="app-shell-header-name-row">
              <span className="app-shell-header-name">{CLASS.name}</span>
            </div>
            <div className="app-shell-header-meta">
              {TEACHER.name} · {TEACHER.school} · {ROSTER.length} readers
            </div>
          </div>
        </div>
      </div>

      <div className="cp-tabsbar">
        <Tabs
          variant="underline"
          size="md"
          active="vocabulary"
          accent="#7C3AED"
          ariaLabel="Classroom"
          onChange={() => {}}
          items={TABS}
        />
      </div>

      <EducatorWords onOpenStudent={onOpenStudent} />
    </>
  )
}
