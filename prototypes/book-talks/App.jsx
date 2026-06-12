import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { Icon } from '@components/Icon/Icon'
import { CreateView } from './views/CreateView'
import { StudentView } from './views/StudentView'
import { ReviewView } from './views/ReviewView'
import { DEFAULT_BADGE } from './data'
import './index.css'

const VIEWS = [
  { id: 'create', label: 'Teacher · Create', icon: 'sparkles' },
  { id: 'student', label: 'Student · Earn', icon: 'message-chatbot' },
  { id: 'review', label: 'Teacher · Review', icon: 'clipboard-check' },
]

export function App() {
  const [view, setView] = useState('create')
  // The teacher builds a list of Book Talk badges in the Create view (starts
  // empty, like the Challenge Creator's Badges step). Student/Review work off
  // the first one — or the demo badge — so they always have something to show.
  const [badges, setBadges] = useState([])
  const liveBadge = badges[0] ?? DEFAULT_BADGE

  return (
    <div className="bt-root">
      {/* Dev/preview toolbar — walk the full loop: create → earn → review */}
      <div className="bt-toolbar">
        <div className="bt-toolbar-brand">
          <img src="/bs-prototypes/benny.png" alt="" className="bt-toolbar-benny" />
          <div className="bt-toolbar-titles">
            <span className="bt-toolbar-title">Book Talk Badges</span>
          </div>
        </div>
        <div className="bt-toolbar-views" role="tablist" aria-label="Demo view">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={view === v.id}
              className={`bt-toolbar-view${view === v.id ? ' is-active' : ''}`}
              onClick={() => setView(v.id)}
            >
              <Icon name={v.icon} size={15} />
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Every view is full-bleed with its own chrome (a top bar + body). */}
      {view === 'create' && <CreateView badges={badges} onChange={setBadges} />}
      {view === 'student' && <StudentView badge={liveBadge} />}
      {view === 'review' && <ReviewView badge={liveBadge} />}

      <PrototypeNav currentHref="/bs-prototypes/book-talks/" />
    </div>
  )
}
