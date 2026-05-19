import { useState } from 'react'
import {
  SCHOOLS, SCHOOL_DETAILS, DISTRICT, ALERTS,
} from '../data'
import { Dashboard } from './Dashboard'
import { HabitsDetail } from './HabitsDetail'
import { LexileDetail } from './LexileDetail'
import { Demographics } from './Demographics'
import { Motivation } from './Motivation'
import { Integrity } from './Integrity'
import { DistrictAnalytics } from './DistrictAnalytics'
import { SchoolDashboard } from './SchoolDashboard'
import { SchoolHabits } from './SchoolHabits'
import { SchoolLexile } from './SchoolLexile'
import { SchoolMotivation } from './SchoolMotivation'
import { SchoolIntegrity } from './SchoolIntegrity'
import { SchoolAnalytics } from './SchoolAnalytics'
import { SchoolDemographics } from './SchoolDemographics'
import { StudentPanel } from './StudentPanel'
import { MainRail } from '../../MainRail'
import { BackBar } from '../../BackBar'
import './RisLayout.css'

const NAV = [
  { id: 'dashboard',  label: 'Overview',     icon: 'overview',   color: null      },
  { id: 'motivation', label: 'Motivation',   icon: 'flame',      color: '#E8866A' },
  { id: 'integrity',  label: 'Integrity',    icon: 'shield',     color: '#1D4ED8' },
  { id: 'habits',     label: 'Habits',       icon: 'habits',     color: '#16A97A' },
  { id: 'skills',     label: 'Skills',       icon: 'book',       color: '#7C3AED' },
  { id: 'analytics',    label: 'Analytics',    icon: 'analytics',    color: null },
  { id: 'demographics', label: 'Demographics', icon: 'demographics', color: null },
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
    case 'flame': return (
      <svg {...props}>
        <path d="M10 2c.2 2.2-1.1 3.2-2.3 4.4C6.5 7.6 5 9.1 5 11.5 5 14.5 7.2 17 10 17s5-2.5 5-5.5c0-1.7-.6-2.7-1.4-3.4-.4.6-1.1.9-1.7 0-.6-.8 0-1.9 0-3.3 0-1.3-.8-2.3-1.7-2.8z" fill="currentColor" fillOpacity="0.15"/>
        <path d="M10 2c.2 2.2-1.1 3.2-2.3 4.4C6.5 7.6 5 9.1 5 11.5 5 14.5 7.2 17 10 17s5-2.5 5-5.5c0-1.7-.6-2.7-1.4-3.4"/>
      </svg>
    )
    case 'shield': return (
      <svg {...props}>
        <path d="M10 2.5 16 4.5v5.7c0 3.7-2.7 6.7-6 7.6-3.3-.9-6-3.9-6-7.6V4.5z" fill="currentColor" fillOpacity="0.12"/>
        <polyline points="7,10 9.2,12.2 13.2,8"/>
      </svg>
    )
    case 'book': return (
      <svg {...props}>
        <path d="M3 4c0-.6.4-1 1-1h5.5v14H4c-.6 0-1-.4-1-1V4z" fill="currentColor" fillOpacity="0.12"/>
        <path d="M17 4c0-.6-.4-1-1-1h-5.5v14H16c.6 0 1-.4 1-1V4z" fill="currentColor" fillOpacity="0.12"/>
        <line x1="9.5" y1="3" x2="9.5" y2="17"/>
      </svg>
    )
    case 'analytics': return (
      <svg {...props}>
        <rect x="3" y="11" width="3" height="6" rx="1"/>
        <rect x="8.5" y="7" width="3" height="10" rx="1"/>
        <rect x="14" y="3" width="3" height="14" rx="1"/>
      </svg>
    )
    case 'demographics': return (
      <svg {...props}>
        <circle cx="10" cy="6" r="2.5"/>
        <circle cx="4" cy="9" r="2"/>
        <circle cx="16" cy="9" r="2"/>
        <path d="M6 17c0-2.2 1.8-4 4-4s4 1.8 4 4"/>
        <path d="M1 17c0-1.7 1.3-3 3-3"/>
        <path d="M19 17c0-1.7-1.3-3-3-3"/>
      </svg>
    )
    default: return null
  }
}

function DistrictSiteLinks() {
  return (
    <div className="rl-sites">
      <div className="rl-sites-label">Schools in district</div>
      {SCHOOLS.map(s => (
        <div key={s.id} className="rl-site-item" title={`Would open ${s.name}'s dashboard in Beanstack`}>
          <span className="rl-site-dot" style={{ background: s.color }} />
          <div className="rl-site-info">
            <span className="rl-site-name">{s.name}</span>
            <span className="rl-site-grades">{s.grades}</span>
          </div>
          <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="rl-site-arrow">
            <path d="M3 8h10M9 4l4 4-4 4"/>
          </svg>
        </div>
      ))}
      <div className="rl-sites-hint">Opens each school's Beanstack dashboard</div>
    </div>
  )
}

function SchoolPicker({ schoolId, onSchoolId, onPage }) {
  const [open, setOpen] = useState(false)
  const school = SCHOOLS.find(s => s.id === schoolId)

  return (
    <div className="rl-picker">
      <button className="rl-picker-btn" onClick={() => setOpen(o => !o)}>
        <span className="rl-picker-avatar" style={{ background: school.color }}>
          {school.name[0]}
        </span>
        <div className="rl-picker-info">
          <span className="rl-picker-name">{school.name}</span>
          <span className="rl-picker-grades">{school.grades}</span>
        </div>
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="4,6 8,10 12,6"/>
        </svg>
      </button>

      {open && (
        <>
          <div className="rl-picker-backdrop" onClick={() => setOpen(false)} />
          <div className="rl-picker-dropdown">
            <div className="rl-picker-dropdown-label">Switch school</div>
            {SCHOOLS.map(s => (
              <button
                key={s.id}
                className={`rl-picker-option${s.id === schoolId ? ' rl-picker-option--active' : ''}`}
                onClick={() => { onSchoolId(s.id); onPage('dashboard'); setOpen(false) }}
              >
                <span className="rl-picker-opt-dot" style={{ background: s.color }} />
                <span className="rl-picker-opt-name">{s.name}</span>
                <span className="rl-picker-opt-grades">{s.grades}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function DistrictHeader() {
  return (
    <div className="rl-header">
      <div className="rl-header-identity">
        <div className="rl-header-avatar rl-header-avatar--district">RUSD</div>
        <div className="rl-header-text">
          <div className="rl-header-name-row">
            <h1 className="rl-header-name">{DISTRICT.name}</h1>
          </div>
          <div className="rl-header-meta">
            {DISTRICT.schools} schools · {DISTRICT.students.toLocaleString()} students · {DISTRICT.year}
          </div>
        </div>
      </div>
    </div>
  )
}

function SchoolHeader({ schoolId }) {
  const school = SCHOOLS.find(s => s.id === schoolId)

  return (
    <div className="rl-header">
      <div className="rl-header-identity">
        <div className="rl-header-avatar" style={{ background: school.color }}>
          {school.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <div className="rl-header-text">
          <div className="rl-header-name-row">
            <h1 className="rl-header-name">{school.name}</h1>
          </div>
          <div className="rl-header-meta">
            {school.grades} · {school.students.toLocaleString()} students
          </div>
        </div>
      </div>
    </div>
  )
}

export function RisLayout({ scope, schoolId, onSchoolId, page, onPage }) {
  const isSchool = scope === 'school'
  const [openStudent, setOpenStudent] = useState(null)
  const [navOpen, setNavOpen] = useState(false)

  const districtAlerts = ALERTS
  const schoolDetails  = isSchool ? SCHOOL_DETAILS[schoolId] : null
  const schoolAlerts   = isSchool ? ALERTS.filter(a => schoolDetails.alertIds.includes(a.id)) : []

  function renderPage() {
    if (isSchool) {
      switch (page) {
        case 'motivation': return <SchoolMotivation schoolId={schoolId} />
        case 'integrity':  return <SchoolIntegrity  schoolId={schoolId} />
        case 'habits':     return <SchoolHabits     schoolId={schoolId} />
        case 'skills':     return <SchoolLexile    schoolId={schoolId} />
        case 'analytics':    return <SchoolAnalytics schoolId={schoolId} />
        case 'demographics': return <SchoolDemographics schoolId={schoolId} />
        default:           return <SchoolDashboard schoolId={schoolId} onNavigate={onPage} onOpenStudent={setOpenStudent} alerts={schoolAlerts} />
      }
    } else {
      switch (page) {
        case 'motivation': return <Motivation />
        case 'integrity':  return <Integrity />
        case 'habits':     return <HabitsDetail />
        case 'skills':     return <LexileDetail />
        case 'analytics':    return <DistrictAnalytics />
        case 'demographics': return <Demographics />
        default:           return <Dashboard onNavigate={onPage} alerts={districtAlerts} />
      }
    }
  }

  return (
    <div className={`ris-layout${navOpen ? ' ris-layout--nav-open' : ''}`}>
      <MainRail />

      {navOpen && <div className="rl-sidebar-backdrop" onClick={() => setNavOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`rl-sidebar${navOpen ? ' rl-sidebar--open' : ''}`}>
        <div className="rl-sidebar-top">
          <div className="rl-sidebar-title">
            <div className="rl-sidebar-product">Reading Information System</div>
            <div className="rl-sidebar-district">{isSchool ? 'School View' : 'District View'}</div>
          </div>
          <button
            type="button"
            className="rl-sidebar-close"
            onClick={() => setNavOpen(false)}
            aria-label="Close navigation"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15"/>
            </svg>
          </button>
        </div>

        <nav className="rl-nav">
          {NAV.map((item, i) => {
            const alertCount = item.id === 'dashboard'
              ? (isSchool ? schoolAlerts : districtAlerts).filter(a => a.level === 'critical' || a.level === 'warning').length
              : 0
            const btn = (
              <button
                key={item.id}
                className={`rl-nav-item${page === item.id ? ' rl-nav-item--active' : ''}`}
                onClick={() => onPage(item.id)}
                title={item.label}
              >
                <span className="rl-nav-icon"><NavIcon name={item.icon} /></span>
                <span className="rl-nav-label">{item.label}</span>
                {alertCount > 0 && <span className="rl-nav-badge">{alertCount}</span>}
              </button>
            )
            // Wrap the 4 bucket items in a subgroup with a visual connector
            if (i === 1) return <div key="subgroup" className="rl-nav-subgroup">{NAV.slice(1, 5).map(sub => (
              <button
                key={sub.id}
                className={`rl-nav-item${page === sub.id ? ' rl-nav-item--active' : ''}`}
                onClick={() => onPage(sub.id)}
                title={sub.label}
              >
                <span className="rl-nav-icon"><NavIcon name={sub.icon} /></span>
                <span className="rl-nav-label">{sub.label}</span>
              </button>
            ))}</div>
            if (i > 1 && i < 5) return null
            return btn
          })}
        </nav>

        {isSchool && (
          <SchoolPicker schoolId={schoolId} onSchoolId={onSchoolId} onPage={onPage} />
        )}
      </aside>

      {/* ── Content ── */}
      <div className="rl-content">
        {/* Mobile top bar — visible only at small screen widths */}
        <div className="rl-topbar">
          <button
            type="button"
            className="rl-topbar-toggle"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h14M3 10h14M3 14h14"/>
            </svg>
          </button>
          <div className="rl-topbar-title">
            <span className="rl-topbar-product">Reading Information System</span>
            <span className="rl-topbar-sub">{isSchool ? 'School View' : 'District View'}</span>
          </div>
        </div>

        {page !== 'dashboard' && page !== 'analytics' && page !== 'demographics' && (
          <BackBar label="Back to Overview" onClick={() => onPage('dashboard')} />
        )}
        <div className="rl-page">
          {renderPage()}
        </div>
      </div>

      {isSchool && <StudentPanel studentId={openStudent} onClose={() => setOpenStudent(null)} />}
    </div>
  )
}
