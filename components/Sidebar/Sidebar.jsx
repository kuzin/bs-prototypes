import { useState, useEffect } from 'react'
import { MainRail } from '@components/MainRail/MainRail'
import { Icon } from '@components/Icon/Icon'
import '@components/MainRail/MainRail.css'
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
const NAV_ICONS = {
  overview: 'layout-grid',
  habits: 'notebook',
  lexile: 'trending-up',
  flame: 'flame',
  shield: 'shield-check',
  book: 'book',
  analytics: 'chart-bar',
  demographics: 'users',
  person: 'user',
  flag: 'flag',
}

function NavIcon({ name }) {
  const icon = NAV_ICONS[name]
  return icon ? <Icon name={icon} size={20} /> : null
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
      <span className="sb-nav-icon">
        <NavIcon name={item.icon} />
      </span>
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
  useEffect(() => {
    setMode(defaultMode)
  }, [defaultMode])

  function expand() {
    setMode('full')
  }
  function collapse() {
    setMode(tier === 'mobile' ? 'closed' : 'icon')
  }

  // Group consecutive `subgroup: true` items so we can draw the left connector.
  const groups = []
  for (const item of nav) {
    const last = groups[groups.length - 1]
    if (item.type === 'section') {
      groups.push({ kind: 'section', label: item.label })
    } else if (item.subgroup) {
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
          <Icon name="menu" size={18} stroke={2} />
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
            <Icon name="chevron-left" size={16} stroke={2} />
          </button>
        </div>

        <nav className="sb-nav">
          {groups.map((g, idx) => {
            if (g.kind === 'section') {
              return (
                <div key={`sec-${idx}`} className="sb-nav-section">
                  {g.label}
                </div>
              )
            }
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
                {g.items.map((item) => (
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
  ]
    .filter(Boolean)
    .join(' ')

  // Resolve active page label + section for the mobile topbar
  const activeItem = nav.find((item) => item.id === active)
  const pageLabel = activeItem?.label ?? title
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
          <Icon name="menu" size={18} stroke={2} />
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
      {isOverlay && tier === 'mobile' && (
        <MainRail activeIndex={mainRailIndex} className="sb-overlay-rail" />
      )}
      {isOverlay && <aside className="sb-sidebar sb-sidebar--overlay">{renderInner()}</aside>}
    </div>
  )
}

// ── Tier hook ────────────────────────────────────────────────────────────
function useTier() {
  const [tier, setTier] = useState(() =>
    computeTier(typeof window === 'undefined' ? 1280 : window.innerWidth),
  )
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
 *   schools={SCHOOLS}
 *   schoolId={schoolId}
 *   onSchoolId={setSchoolId}
 *   onAfterChange={() => setPage('dashboard')}
 * />
 */
export function SchoolPicker({ schools = [], schoolId, onSchoolId, onAfterChange }) {
  const [open, setOpen] = useState(false)
  const fallback = schools[0]
  const school = schools.find((s) => s.id === schoolId) || fallback

  return (
    <div className="sb-picker">
      <button type="button" className="sb-picker-btn" onClick={() => setOpen((o) => !o)}>
        <span className="sb-picker-avatar" style={{ background: school.color }}>
          {school.name[0]}
        </span>
        <div className="sb-picker-info">
          <span className="sb-picker-name">{school.name}</span>
          <span className="sb-picker-grades">{school.grades}</span>
        </div>
        <Icon name="chevron-down" size={12} stroke={2} />
      </button>

      {open && (
        <>
          <div className="sb-picker-backdrop" onClick={() => setOpen(false)} />
          <div className="sb-picker-dropdown">
            <div className="sb-picker-dropdown-label">Switch school</div>
            {schools.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`sb-picker-option${s.id === school.id ? ' sb-picker-option--active' : ''}`}
                onClick={() => {
                  onSchoolId?.(s.id)
                  onAfterChange?.(s.id)
                  setOpen(false)
                }}
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
