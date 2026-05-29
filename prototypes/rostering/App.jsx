import { useState } from 'react'
import { AppShell } from '@components/AppShell/AppShell'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { Hero } from '@components/Hero/Hero'
import '@components/Hero/Hero.css'
import { SyncSettingsPage } from './components/SyncSettingsPage'
import { DEFAULT_FILTER, SCHOOLS } from './data'

import '../ris/index.css'
import '@components/Button/Button.css'
import '@components/Cards/Cards.css'
import '@components/Primitives/Primitives.css'
import '@components/Table/Table.css'
import '@components/Pill/Pill.css'
import '@components/FilterBar/FilterBar.css'
import '@components/Form/Form.css'
import '@components/Modal/Modal.css'
import '@components/MainRail/MainRail.css'
import './index.css'

/**
 * Sidebar = the production "Setup" section. Roster Sync Settings is the only
 * active item; the others are shown for context. Single page (no tabs).
 */
const SETUP_NAV = [
  { id: 'reading-integrity', label: 'Reading Integrity Settings', icon: 'shield' },
  { id: 'school-contact', label: 'School Contact Details', icon: 'person' },
  { id: 'sync', label: 'Roster Sync Settings', icon: 'analytics' },
  { id: 'community-goal', label: 'Community Goal', icon: 'flag' },
  { id: 'achievements', label: 'Achievement Settings', icon: 'habits' },
  { id: 'classroom-naming', label: 'Classroom Naming', icon: 'book' },
  { id: 'other', label: 'Other Settings', icon: 'overview' },
]

const filterKey = (f) =>
  JSON.stringify({ mode: f.mode, custom: [...f.customSubjects].map((w) => w.toLowerCase()).sort() })

export function App({ scope = 'school' }) {
  const isDistrict = scope === 'district'
  const [filter, setFilter] = useState(DEFAULT_FILTER)
  const [savedFilter, setSavedFilter] = useState(DEFAULT_FILTER)
  // District version: which school's roster the filter preview is shown against.
  const [schoolId, setSchoolId] = useState(SCHOOLS[0].id)

  const filterDirty = filterKey(filter) !== filterKey(savedFilter)

  const setMode = (mode) => setFilter((f) => ({ ...f, mode }))
  const addCustom = (word) =>
    setFilter((f) => ({ ...f, customSubjects: [...f.customSubjects, word] }))
  const removeCustom = (word) =>
    setFilter((f) => ({ ...f, customSubjects: f.customSubjects.filter((w) => w !== word) }))
  const saveFilter = () => setSavedFilter(filter)
  const cancelFilter = () => setFilter(savedFilter)

  return (
    <>
      <AppShell
        sidebar={{
          title: 'Setup',
          subtitle: 'Configure and set up your Beanstack site.',
          nav: SETUP_NAV,
          active: 'sync',
          onNavigate: () => {
            /* other Setup pages are inert in this prototype */
          },
          mainRailIndex: 5,
        }}
        className={`rostering${isDistrict ? ' rostering-district' : ''}`}
      >
        <div className="rost-page">
          <Hero
            title="Roster Sync Settings"
            subtitle={
              isDistrict
                ? "Decide which classes flow into your district's reports, and confirm what your last sync brought in."
                : 'Decide which classes flow into your reports, and confirm what your last sync brought in.'
            }
            accent="#7C5CFA"
          />
          <SyncSettingsPage
            filter={filter}
            savedFilter={savedFilter}
            filterDirty={filterDirty}
            onSetMode={setMode}
            onAddCustom={addCustom}
            onRemoveCustom={removeCustom}
            onSaveFilter={saveFilter}
            onCancelFilter={cancelFilter}
            scope={scope}
            schools={SCHOOLS}
            schoolId={schoolId}
            onSchoolId={setSchoolId}
          />
        </div>
      </AppShell>

      <PrototypeNav
        currentHref={
          isDistrict ? '/bs-prototypes/rostering-district/' : '/bs-prototypes/rostering/'
        }
      />
    </>
  )
}
