import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { PreviewBar } from '@components/PreviewBar/PreviewBar'
// The self-started trigger is a site setting, so it lives on the real Book
// Talks site-settings page — reused wholesale from the BTWB prototype.
import { SettingsView } from '../btwb/views/SettingsView'
import { DEFAULT_SETTINGS } from '../btwb/data'
import { CreateView } from './views/CreateView'
import { StudentView } from './views/StudentView'
import { ReviewView } from './views/ReviewView'
import { DEFAULT_BADGE } from './data'
// The reused BTWB settings page brings its own page chrome (.bw-page/.bw-panel).
// Safe to pull in: btwb's reset/body block is byte-identical to ours.
import '../btwb/index.css'
import './index.css'

// `short` is what the preview bar's strip swaps to before it would overflow.
const VIEWS = [
  { id: 'settings', label: 'Admin · Site Settings', short: 'Site', icon: 'settings' },
  { id: 'create', label: 'Teacher · Create', short: 'Create', icon: 'sparkles' },
  { id: 'student', label: 'Student · Earn', short: 'Earn', icon: 'message-chatbot' },
  { id: 'review', label: 'Teacher · Review', short: 'Review', icon: 'clipboard-check' },
]

export function App() {
  const [view, setView] = useState('settings')
  // The teacher builds a list of Book Talk badges in the Create view (starts
  // empty, like the Challenge Creator's Badges step). Student/Review work off
  // the first one — or the demo badge — so they always have something to show.
  const [badges, setBadges] = useState([])
  const liveBadge = badges[0] ?? DEFAULT_BADGE
  // Whether this challenge offers Book Talk badges — a badge type on the
  // creator's Badges step now that when Benny talks is a site-wide setting.
  const [bookTalkOn, setBookTalkOn] = useState(false)
  // Site-wide Book Talk settings — the same shape (and the same page) as the
  // BTWB prototype. `selfStart` is the new reader-initiated trigger and it
  // drives the reader's entry points.
  const [site, setSite] = useState(DEFAULT_SETTINGS)

  return (
    <div className="bt-root">
      {/* Dev/preview bar — walk the full loop: create → earn → review */}
      <PreviewBar title="Book Talk Badges" views={VIEWS} active={view} onChange={setView} />

      {/* Every view is full-bleed with its own chrome (a top bar + body). */}
      {view === 'settings' && (
        // The reused BTWB page expects its own root for the page width + the
        // full-height flex chain the AppShell sidebar hangs off.
        <div className="bt-settings">
          <SettingsView
            settings={site}
            onChange={setSite}
            newTags={['selfStart']}
            planPreview={false}
          />
        </div>
      )}
      {view === 'create' && (
        <CreateView
          badges={badges}
          onChange={setBadges}
          bookTalkOn={bookTalkOn}
          onBookTalkOn={setBookTalkOn}
          siteSelfStart={site.btwbOn && site.selfStart}
        />
      )}
      {view === 'student' && (
        <StudentView badge={liveBadge} selfStart={site.btwbOn && site.selfStart} />
      )}
      {view === 'review' && <ReviewView badge={liveBadge} />}

      <PrototypeNav currentHref="/bs-prototypes/book-talks/" />
    </div>
  )
}
