import { useState } from 'react'
import { SCHOOLS, SCHOOL_STATS, SCHOOL_DETAILS, ALERTS } from '../data'
import { SchoolDashboard } from './SchoolDashboard'
import { SchoolHabits } from './SchoolHabits'
import { SchoolLexile } from './SchoolLexile'
import { FutureState } from './FutureState'
import './SchoolLayout.css'

const NAV = [
  { id: 'dashboard', label: 'Overview',       icon: 'overview' },
  { id: 'habits',    label: 'Reading Habits', icon: 'habits'   },
  { id: 'lexile',    label: 'Lexile Growth',  icon: 'lexile'   },
  { id: 'future',    label: 'Future State',   icon: 'future'   },
]

function NavIcon({ name }) {
  const props = { viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round', width: 20, height: 20 }
  switch (name) {
    case 'overview': return (
      <svg {...props}>
        <rect x="3" y="3" width="6" height="6" rx="1.5"/>
        <rect x="11" y="3" width="6" height="6" rx="1.5"/>
        <rect x="3" y="11" width="6" height="6" rx="1.5"/>
        <rect x="11" y="11" width="6" height="6" rx="1.5"/>
      </svg>
    )
    case 'habits': return (
      <svg {...props}>
        <path d="M5 3h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
        <path d="M7 7h6M7 10h6M7 13h4"/>
      </svg>
    )
    case 'lexile': return (
      <svg {...props}>
        <polyline points="3,16 8,10 12,13 17,5"/>
        <polyline points="14,5 17,5 17,8"/>
      </svg>
    )
    case 'future': return (
      <svg {...props}>
        <circle cx="10" cy="10" r="3"/>
        <path d="M2 10C4 6 7 4 10 4s6 2 8 6c-2 4-5 6-8 6s-6-2-8-6z"/>
      </svg>
    )
    default: return null
  }
}

function SchoolPicker({ schoolId, onSchoolId, onPage }) {
  const [open, setOpen] = useState(false)
  const school = SCHOOLS.find(s => s.id === schoolId)

  return (
    <div className="sl-picker">
      <button className="sl-picker-btn" onClick={() => setOpen(o => !o)}>
        <span className="sl-picker-avatar" style={{ background: school.color }}>
          {school.name[0]}
        </span>
        <div className="sl-picker-info">
          <span className="sl-picker-name">{school.name}</span>
          <span className="sl-picker-grades">{school.grades}</span>
        </div>
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="4,6 8,10 12,6"/>
        </svg>
      </button>

      {open && (
        <>
          <div className="sl-picker-backdrop" onClick={() => setOpen(false)} />
          <div className="sl-picker-dropdown">
            <div className="sl-picker-dropdown-label">Switch school</div>
            {SCHOOLS.map(s => (
              <button
                key={s.id}
                className={`sl-picker-option${s.id === schoolId ? ' sl-picker-option--active' : ''}`}
                onClick={() => { onSchoolId(s.id); onPage('dashboard'); setOpen(false) }}
              >
                <span className="sl-picker-opt-dot" style={{ background: s.color }} />
                <span className="sl-picker-opt-name">{s.name}</span>
                <span className="sl-picker-opt-grades">{s.grades}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function SchoolLayout({ schoolId, onSchoolId, page, onPage }) {
  const school  = SCHOOLS.find(s => s.id === schoolId)
  const stats   = SCHOOL_STATS.find(s => s.id === schoolId)
  const details = SCHOOL_DETAILS[schoolId]
  const alerts  = ALERTS.filter(a => details.alertIds.includes(a.id))

  function renderPage() {
    switch (page) {
      case 'habits': return <SchoolHabits schoolId={schoolId} />
      case 'lexile': return <SchoolLexile schoolId={schoolId} />
      case 'future': return <FutureState />
      default:       return <SchoolDashboard schoolId={schoolId} onNavigate={onPage} />
    }
  }

  return (
    <div className="school-layout">
      {/* ── Sidebar ── */}
      <aside className="sl-sidebar">
        <nav className="sl-nav">
          {NAV.map(item => {
            const active = page === item.id || (item.id === 'dashboard' && page === 'dashboard')
            return (
              <button
                key={item.id}
                className={`sl-nav-item${active ? ' sl-nav-item--active' : ''}`}
                onClick={() => onPage(item.id)}
                title={item.label}
              >
                <span className="sl-nav-icon"><NavIcon name={item.icon} /></span>
                <span className="sl-nav-label">{item.label}</span>
              </button>
            )
          })}
        </nav>
        <SchoolPicker schoolId={schoolId} onSchoolId={onSchoolId} onPage={onPage} />
      </aside>

      {/* ── Content panel ── */}
      <div className="sl-content">
        {/* School header */}
        <div className="sl-header">
          <div className="sl-header-identity">
            <div className="sl-header-avatar" style={{ background: school.color }}>
              {school.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div className="sl-header-text">
              <div className="sl-header-name-row">
                <h1 className="sl-header-name">{school.name}</h1>
                {details.titleI && <span className="sl-badge sl-badge--titleI">Title I</span>}
                {alerts.some(a => a.level === 'critical') && (
                  <span className="sl-badge sl-badge--alert">⚠ Alert</span>
                )}
              </div>
              <div className="sl-header-meta">
                {school.grades} · {school.students.toLocaleString()} students · {details.principal}
              </div>
            </div>
          </div>
          <div className="sl-header-stats">
            {[
              { label: 'RMI Score',      value: stats.rmi,             good: stats.rmi >= 73          },
              { label: 'Engagement',     value: `${stats.engagement}%`, good: stats.engagement >= 70  },
              { label: 'Avg Session',    value: `${stats.avgSession} min`, good: stats.avgSession >= 20 },
              { label: 'Lexile Growth',  value: `+${stats.lexileGrowth}L`, good: stats.lexileGrowth >= 65 },
            ].map(s => (
              <div key={s.label} className="sl-hstat">
                <span className={`sl-hstat-val${s.good ? '' : ' sl-hstat-val--warn'}`}>{s.value}</span>
                <span className="sl-hstat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert strip */}
        {alerts.length > 0 && (
          <div className="sl-alerts">
            {alerts.map(a => (
              <div key={a.id} className={`sl-alert sl-alert--${a.level}`}>
                <span className="sl-alert-title">{a.title}</span>
                <span className="sl-alert-detail">{a.detail}</span>
              </div>
            ))}
          </div>
        )}

        {/* Page content */}
        <div className="sl-page">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}
