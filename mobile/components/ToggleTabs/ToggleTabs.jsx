import './ToggleTabs.css'

/**
 * `src/components/shared/toggleTabs/ToggleTabs.tsx` — the pill segmented control.
 *
 * Distinct from `TopTabs`: that one is the underlined navigation row for a tab's screens, this is
 * a two-or-three-way switch inside a screen (All Titles ⇄ Completed).
 */
export function ToggleTabs({ tabs, currentTab, setCurrentTab, className = '' }) {
  return (
    <div className={`m-toggle ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`m-toggle-item${currentTab === tab ? ' is-active' : ''}`}
          onClick={() => setCurrentTab(tab)}
          aria-label={`Click to view ${tab} tab`}
          aria-pressed={currentTab === tab}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
