import { useState } from 'react'
import { PROTOTYPES } from '@components/prototypes'

const PATTERNS = PROTOTYPES.find((p) => p.id === 'patterns')
const CARDS = PROTOTYPES.filter((p) => p.id !== 'patterns')

// Group cards by their `section` (default "Prototypes"). Preserve first-seen order.
const SECTION_ORDER = ['Prototypes', 'Experiments']
const SECTIONS = (() => {
  const groups = new Map()
  for (const p of CARDS) {
    const key = p.section || 'Prototypes'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(p)
  }
  const sorted = [...groups.entries()].sort(([a], [b]) => {
    const ai = SECTION_ORDER.indexOf(a)
    const bi = SECTION_ORDER.indexOf(b)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })
  return sorted.map(([title, items]) => ({ title, items }))
})()

const ICONS = {
  // Challenge Creator — a trophy
  'challenge-creator': (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 4h10v3.5a5 5 0 0 1-10 0z" />
      <path d="M7 5H4.5v1A3.5 3.5 0 0 0 8 9.5" />
      <path d="M17 5h2.5v1A3.5 3.5 0 0 1 16 9.5" />
      <path d="M12 12.5V16" />
      <path d="M9 20h6l-.6-4H9.6z" />
    </svg>
  ),
  // Student Profile — a person bust
  'student-profile': (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  // RIS School — a single schoolhouse
  'ris-school': (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10l9-6 9 6v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M9 21v-6h6v6" />
      <line x1="12" y1="3" x2="12" y2="6" />
    </svg>
  ),
  // RIS District — clustered buildings (skyline)
  'ris-district': (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="10" width="5" height="11" rx="0.5" />
      <rect x="10" y="5" width="5" height="16" rx="0.5" />
      <rect x="17" y="13" width="4" height="8" rx="0.5" />
      <line x1="12" y1="9" x2="13" y2="9" />
      <line x1="12" y1="13" x2="13" y2="13" />
      <line x1="12" y1="17" x2="13" y2="17" />
    </svg>
  ),
  // Sessions for Review — chat bubble with a small check (review)
  sfr: (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z" />
      <polyline points="8,11 11,14 16,9" />
    </svg>
  ),
  // Pattern Library — four little squares
  patterns: (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  ),
  // Admin Dashboard — a 2x2 layout grid with a wide top-left tile
  'admin-dashboard': (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="12" height="8" rx="1.5" />
      <rect x="17" y="3" width="4" height="8" rx="1.5" />
      <rect x="3" y="13" width="6" height="8" rx="1.5" />
      <rect x="11" y="13" width="10" height="8" rx="1.5" />
    </svg>
  ),
  // Web App — a browser window with a content line
  'web-app': (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <circle cx="6" cy="6.5" r="0.6" fill="currentColor" />
      <circle cx="8.4" cy="6.5" r="0.6" fill="currentColor" />
      <line x1="7" y1="13" x2="14" y2="13" />
      <line x1="7" y1="16" x2="11" y2="16" />
    </svg>
  ),
  // Footers — content block with a darker footer strip below
  footers: (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="11" rx="1.5" opacity="0.4" />
      <rect x="3" y="16" width="18" height="5" rx="1.5" />
      <line x1="6" y1="18.5" x2="11" y2="18.5" />
      <line x1="14" y1="18.5" x2="18" y2="18.5" />
    </svg>
  ),
  // Rostering — two arrows curving between people (sync between systems)
  rostering: (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="18" cy="17" r="2.5" />
      <path d="M8.5 8.5 a6 6 0 0 1 7 7" />
      <polyline points="13.5,15 15.5,15.5 15,13.5" />
      <path d="M15.5 15.5 a6 6 0 0 1 -7 -7" />
      <polyline points="10.5,9 8.5,8.5 9,10.5" />
    </svg>
  ),
  // Rostering: District — sync arrows curving between two buildings (schools)
  'rostering-district': (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="5" height="5" rx="0.6" />
      <rect x="16" y="15" width="5" height="5" rx="0.6" />
      <path d="M8.5 8.5 a6 6 0 0 1 7 7" />
      <polyline points="13.5,15 15.5,15.5 15,13.5" />
      <path d="M15.5 15.5 a6 6 0 0 1 -7 -7" />
      <polyline points="10.5,9 8.5,8.5 9,10.5" />
    </svg>
  ),
  // Insights — bar chart columns with a trend line above
  insights: (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="20" x2="21" y2="20" />
      <rect x="5" y="12" width="3" height="8" rx="0.5" />
      <rect x="10" y="8" width="3" height="12" rx="0.5" />
      <rect x="15" y="14" width="3" height="6" rx="0.5" />
      <polyline points="5,6 10,4 15,7 20,3" opacity="0.5" />
    </svg>
  ),
}

function ProtoCard({ id, name, description, href, accent }) {
  return (
    <a href={href} className="card" style={{ '--accent': accent }}>
      {ICONS[id] && (
        <span className="card-icon" style={{ color: accent }}>
          {ICONS[id]}
        </span>
      )}
      <div className="card-body">
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
      <span className="card-arrow">→</span>
    </a>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState(SECTIONS[0]?.title || 'Prototypes')
  const active = SECTIONS.find((s) => s.title === activeTab) || SECTIONS[0]
  return (
    <div className="page">
      <header>
        <h1>
          <img src="bs.svg" alt="Beanstack" className="logo-mark" />
          Prototypes
        </h1>
        {PATTERNS && (
          <a href={PATTERNS.href} className="patterns-btn">
            Pattern Library →
          </a>
        )}
      </header>

      <nav className="tabs" role="tablist" aria-label="Prototype sections">
        {SECTIONS.map((s) => (
          <button
            key={s.title}
            type="button"
            role="tab"
            aria-selected={s.title === active.title}
            className={`tab ${s.title === active.title ? 'is-active' : ''}`}
            onClick={() => setActiveTab(s.title)}
          >
            {s.title}
            <span className="tab-count">{s.items.length}</span>
          </button>
        ))}
      </nav>

      <main>
        <div className="list">
          {active.items.map((p) => (
            <ProtoCard key={p.href} {...p} />
          ))}
        </div>
      </main>
    </div>
  )
}
