import { useState, useEffect } from 'react'
import { SCHOOLS } from '../data'
import { MainRail } from '../../MainRail'
import '../../MainRail.css'
import './Sidebar.css'

/**
 * Shared sidebar used by every admin prototype (RIS district + school views,
 * pattern library showcase, etc.). The blue-gradient chrome that lives to the
 * right of MainRail.
 *
 * <Sidebar
 *   product="Reading Information System"
 *   view="School View"
 *   nav={[
 *     { id: 'dashboard', label: 'Overview', icon: 'overview' },
 *     { id: 'motivation', label: 'Motivation', icon: 'flame', subgroup: true },
 *     ...
 *   ]}
 *   active={page}
 *   onNavigate={setPage}
 *   badges={{ dashboard: 3 }}
 *   picker={<SchoolPicker schoolId={schoolId} onSchoolId={setSchoolId} />}
 * />
 */

// ── Icon set ─────────────────────────────────────────────────────────────
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
    case 'future': return (
      <svg {...props}>
        <circle cx="10" cy="10" r="3"/>
        <path d="M2 10C4 6 7 4 10 4s6 2 8 6c-2 4-5 6-8 6s-6-2-8-6z"/>
      </svg>
    )
    default: return null
  }
}

// Render a single nav button.
function NavItem({ item, isActive, badge, onClick }) {
  return (
    <button
      type="button"
      className={`sb-nav-item${isActive ? ' sb-nav-item--active' : ''}`}
      onClick={onClick}
      title={item.label}
    >
      <span className="sb-nav-icon"><NavIcon name={item.icon} /></span>
      <span className="sb-nav-label">{item.label}</span>
      {badge > 0 && <span className="sb-nav-badge">{badge}</span>}
    </button>
  )
}

// ── Sidebar ──────────────────────────────────────────────────────────────
export function Sidebar({
  nav = [],
  active,
  onNavigate,
  title,
  subtitle,
  badges = {},
  picker,
  mainRailIndex = 4,
  className = '',
}) {
  // ── Tier detection via viewport width ─────────────────────────────────
  // mobile  (<700)  → topbar only by default; drawer reveals full chrome
  // tablet  (700–1099) → MainRail + icon sidebar; expand overlays
  // desktop (≥1100) → MainRail + full sidebar in-flow; collapse → icon
  const tier = useTier()

  // ── Mode state ────────────────────────────────────────────────────────
  // 'closed' (no sidebar visible), 'icon' (64px rail), 'full' (240px panel).
  const defaultMode = tier === 'mobile' ? 'closed' : tier === 'tablet' ? 'icon' : 'full'
  const [mode, setMode] = useState(defaultMode)

  // When the viewport tier changes, snap back to its default.
  useEffect(() => { setMode(defaultMode) }, [defaultMode])

  function expand()   { setMode('full') }
  function collapse() { setMode(tier === 'mobile' ? 'closed' : 'icon') }

  // Group consecutive `subgroup: true` items so we can draw the left connector.
  const groups = []
  for (const item of nav) {
    const last = groups[groups.length - 1]
    if (item.subgroup) {
      if (last?.kind === 'subgroup') last.items.push(item)
      else groups.push({ kind: 'subgroup', items: [item] })
    } else {
      groups.push({ kind: 'item', item })
    }
  }

  // Overlay = full mode on tablet (sidebar floats; rail stays) or mobile (full
  // drawer with rail). On desktop, full mode is just in-flow — no overlay.
  const isOverlay = mode === 'full' && tier !== 'desktop'
  // The in-flow sidebar shows icon styling at tablet+icon or desktop+icon.
  // At tablet+full it stays icon (placeholder rail); the overlay shows full.
  const showInflowIcon = mode === 'icon' || (tier === 'tablet' && mode === 'full')

  function renderInner() {
    return (
      <>
        {/* Hamburger — only shown in icon mode */}
        <button
          type="button"
          className="sb-sidebar-expand"
          onClick={expand}
          aria-label="Expand navigation"
        >
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="16" y2="6" />
            <line x1="4" y1="10" x2="16" y2="10" />
            <line x1="4" y1="14" x2="16" y2="14" />
          </svg>
        </button>

        <div className="sb-sidebar-top">
          <div className="sb-sidebar-title">
            {title && <div className="sb-sidebar-product">{title}</div>}
            {subtitle && <div className="sb-sidebar-sub">{subtitle}</div>}
          </div>
          <button
            type="button"
            className="sb-sidebar-collapse"
            onClick={collapse}
            aria-label="Collapse navigation"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="12,5 6,10 12,15" />
              <line x1="3" y1="5" x2="3" y2="15" />
            </svg>
          </button>
        </div>

        <nav className="sb-nav">
          {groups.map((g, idx) => {
            if (g.kind === 'item') {
              return (
                <NavItem
                  key={g.item.id}
                  item={g.item}
                  isActive={active === g.item.id}
                  badge={badges[g.item.id]}
                  onClick={() => onNavigate?.(g.item.id)}
                />
              )
            }
            return (
              <div key={`sg-${idx}`} className="sb-nav-subgroup">
                {g.items.map(item => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={active === item.id}
                    badge={badges[item.id]}
                    onClick={() => onNavigate?.(item.id)}
                  />
                ))}
              </div>
            )
          })}
        </nav>

        {picker}
      </>
    )
  }

  const shellClass = [
    'sb-shell',
    `sb-shell--${tier}`,
    `sb-shell--${mode}`,
    isOverlay && 'sb-shell--overlay',
    className,
  ].filter(Boolean).join(' ')

  // Resolve active page label + section for the mobile topbar
  const activeItem = nav.find(item => item.id === active)
  const pageLabel   = activeItem?.label ?? title
  const pageSection = activeItem?.section

  return (
    <div className={shellClass}>
      {/* Mobile-only topbar — hamburger opens the drawer */}
      <div className="sb-topbar">
        <button
          type="button"
          className="sb-topbar-toggle"
          onClick={expand}
          aria-label="Open navigation"
        >
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="16" y2="6" /><line x1="4" y1="10" x2="16" y2="10" /><line x1="4" y1="14" x2="16" y2="14" />
          </svg>
        </button>
        <img src="/bs-prototypes/bs.svg" className="sb-topbar-logo" alt="" aria-hidden="true" />
        <div className="sb-topbar-page">
          <span className="sb-topbar-page-label">{pageLabel}</span>
          {pageSection && <span className="sb-topbar-page-sub">{pageSection}</span>}
        </div>
      </div>

      {/* In-flow rail + sidebar (desktop full / tablet icon / desktop icon) */}
      <div className="sb-chrome">
        <MainRail activeIndex={mainRailIndex} />
        <aside className={`sb-sidebar${showInflowIcon ? ' sb-sidebar--icon' : ''}`}>
          {renderInner()}
        </aside>
      </div>

      {/* Overlay variants */}
      {/* Backdrop only on mobile — tablet overlay keeps MainRail interactive */}
      {isOverlay && tier === 'mobile' && <div className="sb-backdrop" onClick={collapse} />}
      {isOverlay && tier === 'mobile' && <MainRail activeIndex={mainRailIndex} className="sb-overlay-rail" />}
      {isOverlay && (
        <aside className="sb-sidebar sb-sidebar--overlay">
          {renderInner()}
        </aside>
      )}
    </div>
  )
}

// ── Tier hook ────────────────────────────────────────────────────────────
function useTier() {
  const [tier, setTier] = useState(() => computeTier(typeof window === 'undefined' ? 1280 : window.innerWidth))
  useEffect(() => {
    const onResize = () => setTier(computeTier(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return tier
}
function computeTier(w) {
  return w < 700 ? 'mobile' : w < 1100 ? 'tablet' : 'desktop'
}

// ── School picker ────────────────────────────────────────────────────────
/**
 * The school avatar + dropdown that lives in the sidebar footer.
 *
 * <SchoolPicker
 *   schoolId={schoolId}
 *   onSchoolId={setSchoolId}
 *   onAfterChange={() => setPage('dashboard')}
 * />
 */
export function SchoolPicker({ schoolId, onSchoolId, onAfterChange }) {
  const [open, setOpen] = useState(false)
  const fallback = SCHOOLS[0]
  const school = SCHOOLS.find(s => s.id === schoolId) || fallback

  return (
    <div className="sb-picker">
      <button type="button" className="sb-picker-btn" onClick={() => setOpen(o => !o)}>
        <span className="sb-picker-avatar" style={{ background: school.color }}>
          {school.name[0]}
        </span>
        <div className="sb-picker-info">
          <span className="sb-picker-name">{school.name}</span>
          <span className="sb-picker-grades">{school.grades}</span>
        </div>
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="4,6 8,10 12,6"/>
        </svg>
      </button>

      {open && (
        <>
          <div className="sb-picker-backdrop" onClick={() => setOpen(false)} />
          <div className="sb-picker-dropdown">
            <div className="sb-picker-dropdown-label">Switch school</div>
            {SCHOOLS.map(s => (
              <button
                key={s.id}
                type="button"
                className={`sb-picker-option${s.id === school.id ? ' sb-picker-option--active' : ''}`}
                onClick={() => { onSchoolId?.(s.id); onAfterChange?.(s.id); setOpen(false) }}
              >
                <span className="sb-picker-opt-dot" style={{ background: s.color }} />
                <span className="sb-picker-opt-name">{s.name}</span>
                <span className="sb-picker-opt-grades">{s.grades}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
