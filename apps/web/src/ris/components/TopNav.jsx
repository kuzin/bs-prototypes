import './TopNav.css'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'habits',    label: 'Reading Habits' },
  { id: 'lexile',    label: 'Lexile Growth' },
]

export function TopNav({ page, onPage, scope, onScope }) {
  return (
    <header className="ris-nav">
      <div className="ris-nav-left">
        <img src="/bs-prototypes/bs.svg" className="ris-nav-logo" alt="" />
        <div className="ris-nav-title">
          <span className="ris-nav-district">Riverside USD</span>
          <span className="ris-nav-product">Reading Information System</span>
        </div>
      </div>

      <nav className="ris-nav-tabs">
        {scope === 'district' && TABS.map(t => (
          <button
            key={t.id}
            className={`ris-nav-tab${page === t.id ? ' ris-nav-tab--active' : ''}`}
            onClick={() => onPage(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="ris-nav-right">
        <div className="ris-scope-toggle">
          <button
            className={`ris-scope-btn${scope === 'district' ? ' ris-scope-btn--active' : ''}`}
            onClick={() => onScope('district')}
          >
            District
          </button>
          <button
            className={`ris-scope-btn${scope === 'school' ? ' ris-scope-btn--active' : ''}`}
            onClick={() => onScope('school')}
          >
            School
          </button>
        </div>
        {scope === 'district' && <span className="ris-nav-chip">2024–25 School Year</span>}
        <button className="ris-nav-export">Export ↗</button>
      </div>
    </header>
  )
}
