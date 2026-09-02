import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { PreviewBar } from '@components/PreviewBar/PreviewBar'
import { SettingsView } from './views/SettingsView'
import { ChallengeView } from './views/ChallengeView'
import { TalkView } from './views/TalkView'
import { SessionsView } from './views/SessionsView'
import { DEFAULT_SETTINGS } from './data'
import './index.css'

// Book Talks with Benny — the BTWB site-wide completion setting
// (Asana 1214449706072940), plus the comprehension talks it can now start.
//
// The site settings live here so the challenge step and the talk demo can both
// read them: the challenge step explains how it interacts with the site-wide
// default, and the talk demo opens on whichever talk type the site is set to.
//
// Each view carries a short label too — the toolbar swaps to it before the tab
// strip would start overflowing on narrow screens.
const VIEWS = [
  { id: 'settings', label: 'Admin · Site Settings', short: 'Site', icon: 'settings' },
  { id: 'challenge', label: 'Admin · In a Challenge', short: 'Challenge', icon: 'trophy' },
  { id: 'talk', label: 'Reader · Book talks', short: 'Talks', icon: 'message-chatbot' },
  { id: 'sessions', label: 'Teacher · Sessions', short: 'Sessions', icon: 'clipboard-check' },
]

export function App() {
  const [view, setView] = useState('settings')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  // The ticket's default: completion talks are on whenever BTWB is on. Switching
  // Benny back on re-enables them rather than leaving the site in a state no
  // admin asked for.
  function updateSettings(next) {
    const turnedOn = next.btwbOn && !settings.btwbOn
    setSettings(turnedOn ? { ...next, onCompletion: true } : next)
  }

  return (
    <div className="bw-root">
      {/* Dev/preview bar — the two places a book talk is configured, and the
          conversation that results. Not sticky: the root is a flex column whose
          view below owns its own scrolling. */}
      <PreviewBar
        title="Book Talks with Benny"
        subtitle="Site-wide completion setting"
        views={VIEWS}
        active={view}
        onChange={setView}
        sticky={false}
      />

      {view === 'settings' && <SettingsView settings={settings} onChange={updateSettings} />}
      {view === 'challenge' && <ChallengeView siteSettings={settings} />}
      {view === 'talk' && <TalkView settings={settings} />}
      {view === 'sessions' && <SessionsView />}

      <PrototypeNav currentHref="/bs-prototypes/btwb/" />
    </div>
  )
}
