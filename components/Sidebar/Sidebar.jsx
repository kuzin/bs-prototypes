import { useState, useEffect } from 'react'
import { MainRail } from '@components/MainRail/MainRail'
import { Icon } from '@components/Icon/Icon'
import '@components/MainRail/MainRail.css'
import './Sidebar.css'

/**
 * Shared sidebar used by every admin prototype (RIS district + school views,
 * pattern library showcase, etc.) — the accent-colored section menu that lives
 * to the right of MainRail. Ported 1:1 from `#admin-section-menu` in the
 * shipped app; see Sidebar.css for the per-rule provenance.
 *
 * Every nav row is a title + a one-line `desc`, the way the real section menu
 * always renders them — `desc` is expected on every item, not optional polish.
 *
 * <Sidebar
 *   product="Reading Information System"
 *   view="School View"
 *   nav={[
 *     { id: 'dashboard', label: 'Overview', icon: 'overview', desc: 'Reading health at a glance.' },
 *     { id: 'motivation', label: 'Motivation', icon: 'flame', subgroup: true, desc: '…' },
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

/**
 * A single nav row: a bold title plus a muted description line (`strong` + `p`
 * inside `.section-item`), and no icon — the icon lives on the rail. Every real
 * section-menu row has both lines, so `desc` should always be supplied; a row
 * without one renders as a lone title and looks broken next to its siblings.
 * The icon here is kept for the collapsed icon-rail mode, which the real app
 * doesn't have.
 */
function NavItem({ item, isActive, badge, expanded, onClick }) {
  return (
    <button
      type="button"
      className={`sb-nav-item${isActive ? ' sb-nav-item--active' : ''}`}
      onClick={onClick}
      title={item.label}
      aria-expanded={expanded === undefined ? undefined : expanded}
    >
      <span className="sb-nav-icon">
        <NavIcon name={item.icon} />
      </span>
      <span className="sb-nav-item-text">
        <span className="sb-nav-label">{item.label}</span>
        {item.desc && <span className="sb-nav-desc">{item.desc}</span>}
      </span>
      {badge > 0 && <span className="sb-nav-badge">{badge}</span>}
      {/* `.expand-section` — a 32px translucent disc holding a 16px arrow, on
          rows that own a nested group. The app swaps `subnav-expand-icon` for
          `subnav-collapse-icon` when the group opens; children are always
          rendered here, so it shows the collapse (up) arrow. */}
      {expanded !== undefined && (
        <span className="sb-nav-expand" aria-hidden="true">
          <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={16} stroke={2.4} />
        </span>
      )}
    </button>
  )
}

/**
 * The real app's `sidebar-contract-icon` — a 40x76 shape whose two tails bleed
 * into the panel edge so the chevron reads as a notch cut out of the sidebar.
 * Copied from bs-product `new_admin/shared/menu/_contract_icon.html.haml`.
 */
function ContractIcon() {
  return (
    <svg
      className="sb-contract-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="76"
      viewBox="0 0 40 76"
      aria-hidden="true"
    >
      <g fill="none">
        {/* The app marks the disc `.dark` too, and its CSS fill beats the
            `fill="#6271E4"` attribute in the markup — so the disc renders in
            the accent, matching the panel. That attribute is dead code there;
            omitted here. */}
        <circle className="sb-contract-tail" cx="20" cy="37.979" r="20" />
        <path
          fill="#FFFFFF"
          fillRule="nonzero"
          d="M5.071,6 L1.25,2.179 C0.836,1.765 0.836,1.093 1.25,0.679 L1.25,0.679 C1.664,0.265 2.336,0.265 2.75,0.679 L7.364,5.293 C7.755,5.684 7.755,6.317 7.364,6.707 L2.75,11.321 C2.336,11.735 1.664,11.735 1.25,11.321 L1.25,11.321 C0.836,10.907 0.836,10.235 1.25,9.821 L5.071,6 Z"
          transform="matrix(-1 0 0 1 24 31.979)"
        />
        <path
          className="sb-contract-tail"
          d="M37.6519356,28.4856169 C31.2173119,17.3509378 28,7.84870108 28,-0.0210931296 C28,-7.89088734 28,-0.16763091 28,23.1486762 L37.6519356,28.4856169 Z"
        />
        <path
          className="sb-contract-tail"
          d="M38.6849556,79.1486762 C31.5616519,66.4528743 28,56.1700762 28,48.300282 C28,40.4304878 28,48.1537442 28,71.4700513 L38.6849556,79.1486762 Z"
          transform="matrix(1 0 0 -1 0 124.47)"
        />
      </g>
    </svg>
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
  mainRailIndex = 0,
  mainRailActive,
  className = '',
}) {
  // ── Tier detection via viewport width ─────────────────────────────────
  // mobile  (<700)  → topbar only by default; drawer reveals full chrome
  // tablet  (700–1099) → MainRail + icon sidebar; expand overlays
  // desktop (≥1100) → MainRail + full sidebar in-flow; collapse → icon
  const tier = useTier()

  // ── Mode state ────────────────────────────────────────────────────────
  // 'closed' (no sidebar visible), 'drawer' (mobile only — the rail promoted to
  // a labelled full-height menu), 'icon' (64px rail), 'full' (240px panel).
  const defaultMode = tier === 'mobile' ? 'closed' : tier === 'tablet' ? 'icon' : 'full'
  const [mode, setMode] = useState(defaultMode)

  // When the viewport tier changes, snap back to its default.
  useEffect(() => {
    setMode(defaultMode)
  }, [defaultMode])

  // On a phone the hamburger opens the app menu — the rail's own destinations,
  // labelled — the way it does in the product. The section menu isn't a screen
  // you step into: a section's pages open as a group under its own row, so the
  // whole navigation is one list you keep your place in. Wider tiers have the
  // rail and the panel on screen at once, so `expand` goes straight to it.
  function expand() {
    setMode(tier === 'mobile' ? 'drawer' : 'full')
  }
  function collapse() {
    setMode(tier === 'mobile' ? 'closed' : 'icon')
  }
  function close() {
    setMode(tier === 'mobile' ? 'closed' : 'icon')
  }

  // Group consecutive `subgroup: true` items under the row that precedes them.
  // The app shows nesting two ways: `.sub-menu` indents the child rows' text by
  // 20px (handled in CSS) and the parent row carries an `.expand-section` caret.
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
  // A plain row immediately followed by a subgroup owns it, so it shows the
  // caret. Children are always rendered here, so the group is always expanded.
  const ownsSubgroup = new Set(
    groups
      .map((g, i) => (g.kind === 'item' && groups[i + 1]?.kind === 'subgroup' ? g.item.id : null))
      .filter(Boolean),
  )

  // Overlay = full mode on tablet (sidebar floats; rail stays) or mobile (the
  // section menu stepped into from the app menu). On desktop, full mode is just
  // in-flow — no overlay.
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
          title="Expand navigation"
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
            title="Collapse navigation"
            aria-label="Collapse navigation"
          >
            <ContractIcon />
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
                  expanded={ownsSubgroup.has(g.item.id) ? true : undefined}
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
          title="Open navigation"
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
        <MainRail active={mainRailActive} activeIndex={mainRailIndex} />
        <aside className={`sb-sidebar${showInflowIcon ? ' sb-sidebar--icon' : ''}`}>
          {renderInner()}
        </aside>
      </div>

      {/* Overlay variants */}
      {/* Backdrop only on mobile — tablet overlay keeps MainRail interactive */}
      {tier === 'mobile' && (mode === 'drawer' || mode === 'full') && (
        <div className="sb-backdrop" onClick={close} />
      )}
      {tier === 'mobile' && mode === 'drawer' && (
        <MainRail
          drawer
          active={mainRailActive}
          activeIndex={mainRailIndex}
          onClose={close}
          // The section we're actually in is the one whose pages we can list —
          // the others are elsewhere in the app, and tapping them is a
          // navigation, not an expansion.
          sections={mainRailActive ? { [mainRailActive]: nav } : {}}
          activeSectionItem={active}
          onSelectSectionItem={(id) => {
            onNavigate?.(id)
            close()
          }}
          onSelect={() => close()}
        />
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
