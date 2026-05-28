import { useState } from 'react'
import { Sidebar } from '../ris/components/Sidebar'
import { PrototypeNav } from '../PrototypeNav'
import { Hero } from '../ris/components/Hero'
import '../ris/components/Hero.css'
import { SyncSettingsPage } from './components/SyncSettingsPage'
import { DEFAULT_FILTER, SCHOOLS } from './data'

import '../ris/index.css'
import '../ris/components/RisLayout.css'
import '../ris/components/Sidebar.css'
import '../ris/components/Button.css'
import '../ris/components/Cards.css'
import '../ris/components/Primitives.css'
import '../ris/components/Table.css'
import '../ris/components/Pill.css'
import '../ris/components/FilterBar.css'
import '../ris/components/Form.css'
import '../ris/components/Modal.css'
import '../MainRail.css'
import './index.css'

/**
 * Sidebar = the production "Setup" section. Roster Sync Settings is the only
 * active item; the others are shown for context. Single page (no tabs).
 */
const SETUP_NAV = [
  { id: 'reading-integrity',  label: 'Reading Integrity Settings',  icon: 'shield' },
  { id: 'school-contact',     label: 'School Contact Details',      icon: 'person' },
  { id: 'sync',               label: 'Roster Sync Settings',        icon: 'analytics' },
  { id: 'community-goal',     label: 'Community Goal',              icon: 'flag' },
  { id: 'achievements',       label: 'Achievement Settings',        icon: 'habits' },
  { id: 'classroom-naming',   label: 'Classroom Naming',            icon: 'book' },
  { id: 'other',              label: 'Other Settings',              icon: 'overview' },
]

const filterKey = (f) => JSON.stringify({ mode: f.mode, custom: [...f.customSubjects].map(w => w.toLowerCase()).sort() })

export function App({ scope = 'school' }) {
  const isDistrict = scope === 'district'
  const [filter, setFilter] = useState(DEFAULT_FILTER)
  const [savedFilter, setSavedFilter] = useState(DEFAULT_FILTER)
  // District version: which school's roster the filter preview is shown against.
  const [schoolId, setSchoolId] = useState(SCHOOLS[0].id)

  const filterDirty = filterKey(filter) !== filterKey(savedFilter)

  const setMode      = (mode) => setFilter(f => ({ ...f, mode }))
  const addCustom    = (word) => setFilter(f => ({ ...f, customSubjects: [...f.customSubjects, word] }))
  const removeCustom = (word) => setFilter(f => ({ ...f, customSubjects: f.customSubjects.filter(w => w !== word) }))
  const saveFilter   = () => setSavedFilter(filter)
  const cancelFilter = () => setFilter(savedFilter)

  return (
    <>
      <div className={`ris-layout rostering${isDistrict ? ' rostering-district' : ''}`}>
        <Sidebar
          title="Setup"
          subtitle="Configure and set up your Beanstack site."
          nav={SETUP_NAV}
          active="sync"
          onNavigate={() => { /* other Setup pages are inert in this prototype */ }}
          mainRailIndex={5}
        />

        <div className="rl-content">
          <div className="rost-page">
            <Hero
              title="Roster Sync Settings"
              subtitle={isDistrict
                ? "Decide which classes flow into your district's reports, and confirm what your last sync brought in."
                : 'Decide which classes flow into your reports, and confirm what your last sync brought in.'}
              accent="#7C5CFA"
            />
            <SyncSettingsPage
              filter={filter}
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
        </div>
      </div>

      <PrototypeNav currentHref={isDistrict ? '/bs-prototypes/rostering-district/' : '/bs-prototypes/rostering/'} />
    </>
  )
}
