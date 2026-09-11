import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { Icon } from '@components/Icon/Icon'
import './MainRail.css'

/**
 * Beanstack admin main rail — the narrow icon strip on the far left.
 *
 * Built to the Figma spec ("Comprehension Book Talks" file → Admin — Flagged
 * Sessions and Book Talks → `Sidebar`, node 34:2147), which is the current
 * design source; where the shipped Sass differs it's noted in MainRail.css.
 *
 *   Sidebar   80 x 800, white
 *   logo box  80 x 80, then a 16px gap
 *   nav       flex column, gap 6px, items 80 x 56
 *   active    full-bleed #E6F1FF + a 5px x 32px #1A6DD5 bar at the left edge
 *   icons     24 x 24, Icons8 Plumpy duotone (see PlumpyIcon)
 *   bottom    announcement / help at a 44px pitch, then a 40px avatar
 *
 * @param {string} active       id of the active section (preferred)
 * @param {number} activeIndex  legacy positional fallback (index into RAIL_ITEMS)
 */

// The rail order exactly as the Figma frame lists it.
export const RAIL_ITEMS = [
  { id: 'people', icon: 'people', label: 'People', children: true },
  { id: 'challenges', icon: 'challenges', label: 'Challenges', children: true },
  { id: 'content', icon: 'content', label: 'Content', children: true },
  { id: 'setup', icon: 'setup', label: 'Setup', children: true },
  { id: 'insights', icon: 'insights', label: 'Insights' },
  { id: 'reports', icon: 'reports', label: 'Reports' },
  { id: 'client-success', icon: 'client-success', label: 'Client Success Simulator' },
  { id: 'basics', icon: 'basics', label: 'Beanstack Basics' },
]

/**
 * The pages behind each section that owns a menu, as the product lists them
 * (bs-product `new_admin/shared/menu/_people_menu.html.erb`,
 * `_challenges_menu.html.haml`, `_content_menu.html.haml` and
 * `setup_menu/_school_setup_menu.html.erb`). The phone drawer opens these under
 * their row; the section a prototype is actually in overrides its entry with
 * that prototype's own wired nav, so those rows navigate for real.
 */
export const RAIL_SECTIONS = {
  people: [
    { id: 'find-a-person', label: 'Find a Person' },
    { id: 'classes', label: 'Classes' },
    { id: 'students', label: 'Students' },
    { id: 'staff', label: 'Staff' },
    { id: 'groups', label: 'Groups' },
    { id: 'manage-roster', label: 'Manage Roster' },
  ],
  challenges: [
    { id: 'challenges', label: 'Challenges' },
    { id: 'fundraisers', label: 'Fundraisers' },
    { id: 'challenge-templates', label: 'Challenge Templates' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'points-system', label: 'Points System' },
    { id: 'badge-groups', label: 'Your Badge Groups' },
    { id: 'certificates', label: 'Certificates' },
  ],
  content: [
    { id: 'reviews', label: 'Reviews' },
    { id: 'book-lists', label: 'Book Lists' },
    { id: 'recommend-events', label: 'Recommend Events' },
    { id: 'announcements', label: 'Manage Announcements' },
    { id: 'learning-moments', label: 'Learning Moments' },
    { id: 'school-libraries', label: 'School Libraries' },
  ],
  setup: [
    { id: 'daily-reading-goals', label: 'Daily Reading Goals' },
    { id: 'school-contact', label: 'School Contact Details' },
    { id: 'roster-sync', label: 'Roster Sync Settings' },
    { id: 'community-goal', label: 'Community Goal' },
    { id: 'achievement-settings', label: 'Achievement Settings' },
    { id: 'other-settings', label: 'Other Settings' },
  ],
}

// Height one rail item occupies: 52px target + 7px margin top and bottom.
const ITEM_PITCH = 66

export function MainRail({
  active,
  activeIndex = 0,
  className = '',
  initials = 'EG',
  drawer = false,
  onClose,
  onSelect,
  sectionNav = [],
  activeSectionItem,
  onSelectSectionItem,
}) {
  const activeId = active ?? RAIL_ITEMS[activeIndex]?.id
  // Which drawer row is expanded. One at a time — the list is long enough that
  // two open groups push the rest off a phone screen.
  const [openId, setOpenId] = useState(null)

  // ── Overflow ──────────────────────────────────────────────────────────
  // The product collapses whatever doesn't fit into a "more" popout at the
  // bottom of the rail (`li.menu-overflow` + `#overflow-dropdown` in
  // bs-product `new_admin/shared/_menu.html.haml`). Same idea here: measure
  // the nav, keep what fits, and put the rest behind the trigger.
  const navRef = useRef(null)
  const overflowRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(RAIL_ITEMS.length)
  const [open, setOpen] = useState(false)

  const measure = useCallback(() => {
    const nav = navRef.current
    if (!nav) return
    const available = nav.clientHeight
    let fits = Math.max(0, Math.floor(available / ITEM_PITCH))
    // If anything is left over, one slot has to hold the trigger itself.
    if (fits < RAIL_ITEMS.length) fits = Math.max(0, fits - 1)
    setVisibleCount(Math.min(RAIL_ITEMS.length, fits))
  }, [])

  useLayoutEffect(() => {
    measure()
    const nav = navRef.current
    if (!nav || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(nav)
    return () => ro.disconnect()
  }, [measure])

  // Close the popout on an outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!overflowRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const shown = RAIL_ITEMS.slice(0, visibleCount)
  const overflow = RAIL_ITEMS.slice(visibleCount)
  // Keep the active section reachable: if it got pushed into the overflow, the
  // trigger carries the active styling.
  const activeInOverflow = overflow.some((i) => i.id === activeId)

  // ── Mobile drawer ─────────────────────────────────────────────────────
  // At `$small-only` the app doesn't shrink the rail — it turns it into the
  // whole menu: `.main-header` goes `position: fixed; height: 100vh`, the logo
  // box becomes `.mobile-nav-header` (close / heart / help, space-between), the
  // bottom strip is hidden, and every nav row goes full-width with its label
  // and its caret finally shown. Nothing collapses into the overflow popout
  // here — the list is complete, which is why What's New joins it as a row
  // instead of living in the strip. A section's pages open as a group under its
  // row rather than replacing the menu, so you keep your place in the list.
  // (The app is 85vw; ours takes the full width — one column, nothing behind
  // it to peek at.)
  if (drawer) {
    return (
      <div className={`main-rail main-rail--drawer ${className}`.trim()}>
        <div className="main-rail-drawer-head">
          <button
            type="button"
            className="main-rail-drawer-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <Icon name="x" size={22} stroke={2} />
          </button>
          {/* `.bs-heart { color: $primary-color }` */}
          <svg className="main-rail-logo" viewBox="0 0 24 32" aria-hidden="true">
            <path d="M8.626 6.934c0 0-2.765-3.301-6.174-0.407-4.015 3.409-3.504 10.254 8.248 25.171 0.291 0.369 0.852 0.442 0.7-0.313-0.431-2.133-0.614-6.205 3.594-10.001 5.274-4.759 11.544-12.716 7.525-18.394-4.052-5.724-11.834-2.273-13.892 3.944z" />
          </svg>
          <button
            type="button"
            className="main-rail-drawer-help"
            title="Support"
            aria-label="Support"
          >
            <PlumpyIcon name="help" size={24} />
          </button>
        </div>

        <nav className="main-rail-drawer-nav">
          {RAIL_ITEMS.map((item) => {
            // A row expands in place when there are pages to show under it.
            // The section this prototype is actually in shows its own wired
            // nav — those rows navigate. Every other section shows the
            // product's own menu (RAIL_SECTIONS): real page names, but with
            // nowhere to go here, so tapping one just closes the menu.
            const wired = item.id === activeId && sectionNav.length > 0
            const sub = wired ? sectionNav : item.children ? RAIL_SECTIONS[item.id] : null
            const expandable = sub?.length > 0
            const open = expandable && openId === item.id
            return (
              <div key={item.id} className="main-rail-drawer-group">
                <button
                  type="button"
                  className={`main-rail-drawer-row${
                    item.id === activeId ? ' main-rail-drawer-row--active' : ''
                  }`}
                  onClick={() => (expandable ? setOpenId(open ? null : item.id) : onSelect?.(item))}
                  aria-current={item.id === activeId ? 'page' : undefined}
                  aria-expanded={expandable ? open : undefined}
                >
                  <PlumpyIcon name={item.icon} size={24} />
                  <span className="main-rail-drawer-label">{item.label}</span>
                  {expandable && (
                    <span className="main-rail-drawer-fwd" aria-hidden="true">
                      <Icon name={open ? 'chevron-down' : 'chevron-right'} size={16} stroke={2.4} />
                    </span>
                  )}
                </button>

                {open && (
                  <div className="main-rail-drawer-sub">
                    {sub.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        className={`main-rail-drawer-subrow${
                          child.subgroup ? ' main-rail-drawer-subrow--nested' : ''
                        }${
                          wired && child.id === activeSectionItem
                            ? ' main-rail-drawer-subrow--active'
                            : ''
                        }`}
                        onClick={() => (wired ? onSelectSectionItem?.(child.id) : onClose?.())}
                        aria-current={wired && child.id === activeSectionItem ? 'page' : undefined}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* The bottom strip is hidden at this width, so its one destination
              that isn't a duplicate of the header's help link joins the list. */}
          <button type="button" className="main-rail-drawer-row">
            <PlumpyIcon name="announcement" size={24} />
            <span className="main-rail-drawer-label">What&apos;s New</span>
          </button>
        </nav>
      </div>
    )
  }

  return (
    <div className={`main-rail ${className}`.trim()}>
      <div className="main-rail-top">
        <a href="/bs-prototypes/" className="main-rail-logo-link" aria-label="Prototypes">
          {/* The app's `bs-heart` symbol, filled with the accent color. */}
          <svg className="main-rail-logo" viewBox="0 0 24 32" aria-hidden="true">
            <path d="M8.626 6.934c0 0-2.765-3.301-6.174-0.407-4.015 3.409-3.504 10.254 8.248 25.171 0.291 0.369 0.852 0.442 0.7-0.313-0.431-2.133-0.614-6.205 3.594-10.001 5.274-4.759 11.544-12.716 7.525-18.394-4.052-5.724-11.834-2.273-13.892 3.944z" />
          </svg>
        </a>
      </div>

      <nav className="main-rail-nav" ref={navRef}>
        {shown.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`main-rail-btn${item.id === activeId ? ' main-rail-btn--active' : ''}`}
            title={item.label}
            aria-label={item.label}
            aria-current={item.id === activeId ? 'page' : undefined}
          >
            <PlumpyIcon name={item.icon} size={24} />
          </button>
        ))}

        {overflow.length > 0 && (
          <div className="main-rail-overflow" ref={overflowRef}>
            <button
              type="button"
              className={`main-rail-btn main-rail-overflow-trigger${
                activeInOverflow ? ' main-rail-btn--active' : ''
              }${open ? ' main-rail-btn--open' : ''}`}
              title="More"
              aria-label="Navigation overflow"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <Icon name="dots" size={24} stroke={2} />
            </button>

            {open && (
              <div className="main-rail-overflow-menu" role="menu">
                <ul>
                  {overflow.map((item) => (
                    <li key={item.id} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        className={`main-rail-overflow-item${
                          item.id === activeId ? ' main-rail-overflow-item--active' : ''
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        <PlumpyIcon name={item.icon} size={24} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="main-rail-bottom">
        <button
          type="button"
          className="main-rail-icon-btn"
          title="What's New"
          aria-label="What's New"
        >
          <PlumpyIcon name="announcement" size={24} />
        </button>
        <button type="button" className="main-rail-icon-btn" title="Support" aria-label="Support">
          <PlumpyIcon name="help" size={24} />
        </button>
        <div className="main-rail-avatar">{initials}</div>
      </div>
    </div>
  )
}
