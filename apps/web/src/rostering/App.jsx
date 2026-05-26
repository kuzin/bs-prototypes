import { useState } from 'react'
import { Sidebar } from '../ris/components/Sidebar'
import { PrototypeNav } from '../PrototypeNav'
import { Modal } from '../ris/components/Modal'
import { Hero } from '../ris/components/Hero'
import '../ris/components/Hero.css'
import { SyncSettingsPage } from './components/SyncSettingsPage'
import { PreviewPanel } from './components/PreviewPanel'
import { DEFAULT_RULES } from './data'

import '../ris/index.css'
import '../ris/components/RisLayout.css'
import '../ris/components/Sidebar.css'
import '../ris/components/Tabs.css'
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

const sortedKey = (r) => JSON.stringify({ allowed: [...r.allowed].sort(), excluded: [...r.excluded].sort() })

export function App() {
  const [rules, setRules] = useState(DEFAULT_RULES)
  const [savedRules, setSavedRules] = useState(DEFAULT_RULES)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewTab, setPreviewTab] = useState('classes')

  const rulesDirty = sortedKey(rules) !== sortedKey(savedRules)

  // Binary toggle — move a subject between allowed and excluded.
  function setSubjectAllowed(subject, allowed) {
    setRules(prev => ({
      allowed:  allowed ? [...prev.allowed.filter(s => s !== subject), subject] : prev.allowed.filter(s => s !== subject),
      excluded: allowed ? prev.excluded.filter(s => s !== subject) : [...prev.excluded.filter(s => s !== subject), subject],
    }))
  }

  function saveRules()   { setSavedRules(rules) }
  function cancelRules() { setRules(savedRules) }

  function openPreview(tab = 'classes') {
    setPreviewTab(tab)
    setPreviewOpen(true)
  }

  return (
    <>
      <div className="ris-layout rostering">
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
              subtitle="Confirm what's coming through, and decide which subjects flow into your reports."
              accent="#7C5CFA"
            />
            <SyncSettingsPage
              rules={rules}
              rulesDirty={rulesDirty}
              onSetSubjectAllowed={setSubjectAllowed}
              onSaveRules={saveRules}
              onCancelRules={cancelRules}
              onOpenPreview={openPreview}
            />
          </div>
        </div>

        {/* Preview side-panel modal */}
        <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} variant="side" ariaLabel="Preview tonight's sync">
          {({ close }) => (
            <PreviewPanel
              rules={rules}
              activeTab={previewTab}
              onActiveTab={setPreviewTab}
              onClose={close}
              onExcludeSubject={s => setSubjectAllowed(s, false)}
            />
          )}
        </Modal>
      </div>

      <PrototypeNav currentHref="/bs-prototypes/rostering/" />
    </>
  )
}
