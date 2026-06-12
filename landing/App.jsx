import { useState } from 'react'
import { PROTOTYPES } from '@components/prototypes'
import { Icon } from '@components/Icon/Icon'

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

// Per-prototype card glyphs, rendered via the shared <Icon> (Tabler). Color is
// applied by the wrapping .card-icon span (accent). Keyed by prototype id.
const ICON_NAMES = {
  'challenge-creator': 'trophy', // a trophy
  'student-profile': 'user', // a person
  'ris-school': 'school', // schoolhouse
  'ris-district': 'building-community', // clustered buildings
  sfr: 'message-check', // chat bubble + check (review)
  patterns: 'layout-grid', // four little tiles
  'admin-dashboard': 'layout-dashboard', // dashboard layout
  'web-app': 'browser', // browser window
  footers: 'layout-bottombar', // page with footer strip
  rostering: 'arrows-exchange', // sync between systems
  'rostering-district': 'refresh', // district-wide sync
  insights: 'chart-bar', // analytics
  'book-talks': 'message-circle',
}

const ICONS = Object.fromEntries(
  Object.entries(ICON_NAMES).map(([id, name]) => [id, <Icon key={id} name={name} size={22} />]),
)

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
