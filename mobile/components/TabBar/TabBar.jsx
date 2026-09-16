import './TabBar.css'

/**
 * The bottom tab bar — `src/navigation/BeanstackTabs.tsx`.
 *
 * A tab carries an `icon` / `activeIcon` PAIR rather than one tintable glyph, because that is what
 * the app does: `iconSelector` picks between `images.home_active` and `images.home_inactive`. It
 * never tints, which is why the active state here changes the asset and the label colour, not a
 * fill.
 *
 * Five slots: Home, Log, [+], Discover, Community. The middle one is not a screen; its
 * `tabPress` listener calls `preventDefault()` and toggles the PlusMenu context, so it is
 * rendered here as an empty spacer and the FAB itself is drawn by <PlusMenu>, which overlays the
 * whole tab bar. Modelling it as a selectable tab would be wrong.
 *
 * The notification badge is one component with two shapes: Discover shows a 4pt white dot inside
 * the red pill when there are new challenges; Community shows a friend-request count, or `NEW`.
 */
export function TabBar({ tabs, active, onChange }) {
  const half = Math.ceil(tabs.length / 2)

  const render = (tab) => (
    <button
      key={tab.id}
      type="button"
      className={`m-tab${active === tab.id ? ' is-active' : ''}`}
      onClick={() => onChange?.(tab.id)}
      aria-current={active === tab.id ? 'page' : undefined}
      aria-label={`${tab.label} tab`}
    >
      {tab.dot && <span className="m-tab-badge m-tab-badge--dot" aria-hidden="true" />}
      {tab.badge != null && <span className="m-tab-badge m-tab-badge--count">{tab.badge}</span>}
      <span className="m-tab-icon">
        {active === tab.id ? (tab.activeIcon ?? tab.icon) : tab.icon}
      </span>
      <span className="m-tab-label">{tab.label}</span>
    </button>
  )

  return (
    <nav className="m-tabbar" aria-label="Main">
      {tabs.slice(0, half).map(render)}
      <span className="m-tab-plus-slot" aria-hidden="true" />
      {tabs.slice(half).map(render)}
    </nav>
  )
}
