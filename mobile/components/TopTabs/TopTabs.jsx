import { useEffect, useRef } from 'react'
import './TopTabs.css'

/**
 * The scrollable top-tab row that Log, Discover and Community all sit under.
 *
 * Geometry from `navigation/styles/TabStyles.ts` + `navigation/sharedComponents/Tab.tsx`: a 56pt
 * bar, each item 12pt of horizontal padding with 8pt extra on the first and last, a 16/bold label
 * that is greyDark1 when focused and warmGrey when not, and a 3pt underline drawn only under the
 * focused item.
 *
 * The underline uses `ctaColor`, NOT `primaryColor` — Tab.tsx reads that field specifically, and a
 * microsite can set the two differently.
 */
export function TopTabs({ tabs, active, onChange }) {
  const ref = useRef(null)

  // The real bar scrolls the active tab toward the start; without this a tab six along is simply
  // off-screen with nothing to say so.
  useEffect(() => {
    const el = ref.current?.querySelector('.m-toptab.is-active')
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [active])

  return (
    <div className="m-toptabs" ref={ref} role="tablist">
      {tabs.map((tab) => {
        const id = typeof tab === 'string' ? tab : tab.id
        const label = typeof tab === 'string' ? tab : tab.label
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active === id}
            className={`m-toptab${active === id ? ' is-active' : ''}`}
            onClick={() => onChange?.(id)}
          >
            <span className="m-toptab-label">{label}</span>
            <span className="m-toptab-indicator" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
