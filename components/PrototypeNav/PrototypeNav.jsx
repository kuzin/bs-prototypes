import { useEffect, useRef, useState } from 'react'
import './PrototypeNav.css'
import { PROTOTYPES } from '@components/prototypes'
import { ComponentUsage } from '@components/ComponentUsage/ComponentUsage'
import { Icon } from '@components/Icon/Icon'

const NAV_PROTOTYPES = PROTOTYPES.filter((p) => p.id !== 'patterns')

// Group the switcher options by section (Prototypes first, then Experiments).
const SECTION_ORDER = ['Prototypes', 'Experiments']
const NAV_SECTIONS = (() => {
  const groups = new Map()
  for (const p of NAV_PROTOTYPES) {
    const key = p.section || 'Prototypes'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(p)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => {
      const ai = SECTION_ORDER.indexOf(a)
      const bi = SECTION_ORDER.indexOf(b)
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })
    .map(([title, items]) => ({ title, items }))
})()

export function PrototypeNav({ currentHref }) {
  const [open, setOpen] = useState(false)
  const [usageOpen, setUsageOpen] = useState(false)
  const currentIdx = NAV_PROTOTYPES.findIndex((p) => p.href === currentHref)
  const current = currentIdx >= 0 ? NAV_PROTOTYPES[currentIdx] : null

  // Closing on an outside click is a document listener rather than a backdrop
  // element: `.proto-nav` sets `backdrop-filter`, which makes it the containing
  // block for `position: fixed`, so a "full-screen" backdrop was only ever as
  // tall as the 48px bar and never received the click.
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onPointerDown(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    // Capture phase, so it still fires if something inside the page stops
    // propagation on its own pointer handlers.
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [open])

  return (
    <nav className="proto-nav">
      <div className="proto-nav-left">
        <a
          href="/bs-prototypes/"
          className="proto-nav-iconbtn"
          title="All prototypes"
          aria-label="All prototypes"
        >
          <img src="/bs-prototypes/bs.svg" className="proto-nav-logo" alt="" />
        </a>
        <a
          href="/bs-prototypes/patterns/"
          className="proto-nav-iconbtn"
          title="Pattern Library"
          aria-label="Pattern Library"
        >
          <Icon name="layers" size={15} />
        </a>
        <button
          type="button"
          className="proto-nav-iconbtn"
          onClick={() => setUsageOpen(true)}
          title="Component usage — what each prototype uses"
          aria-label="Component usage"
        >
          <Icon name="layout-grid" size={14} />
        </button>
      </div>

      {usageOpen && <ComponentUsage onClose={() => setUsageOpen(false)} />}

      <div className="proto-nav-switcher">
        <div className="proto-nav-select-wrap" ref={wrapRef}>
          <button
            type="button"
            className={`proto-nav-select${!current ? ' proto-nav-select--empty' : ''}`}
            style={current ? { '--accent': current.accent } : undefined}
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className="proto-nav-select-name">
              {current ? current.name : 'Select prototype'}
            </span>
            <Icon name="chevron-down" size={11} stroke={2} className="proto-nav-select-caret" />
          </button>

          {open && (
            <div className="proto-nav-dropdown" role="listbox">
              {NAV_SECTIONS.map((section) => (
                <div
                  key={section.title}
                  className="proto-nav-group"
                  role="group"
                  aria-label={section.title}
                >
                  <div className="proto-nav-group-label">{section.title}</div>
                  {section.items.map((p) => {
                    const isCurrent = p.href === currentHref
                    return (
                      <a
                        key={p.href}
                        href={isCurrent ? undefined : p.href}
                        className={`proto-nav-option${isCurrent ? ' proto-nav-option--active' : ''}`}
                        style={{ '--accent': p.accent }}
                        role="option"
                        aria-current={isCurrent ? 'page' : undefined}
                        onClick={isCurrent ? (e) => e.preventDefault() : undefined}
                      >
                        <span className="proto-nav-option-name">{p.name}</span>
                        {isCurrent && <Icon name="check" size={12} stroke={2.5} />}
                      </a>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
