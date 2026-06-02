import { useEffect, useState } from 'react'
import './PrototypeNav.css'
import { PROTOTYPES } from '@components/prototypes'
import { ComponentUsage } from '@components/ComponentUsage/ComponentUsage'

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

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
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
          <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2 14 5.2 8 8.4 2 5.2z" />
            <polyline points="2,9 8,12.2 14,9" />
            <polyline points="2,12.4 8,15.6 14,12.4" />
          </svg>
        </a>
        <button
          type="button"
          className="proto-nav-iconbtn"
          onClick={() => setUsageOpen(true)}
          title="Component usage — what each prototype uses"
          aria-label="Component usage"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="5" height="5" rx="1" />
            <rect x="9" y="2" width="5" height="5" rx="1" />
            <rect x="2" y="9" width="5" height="5" rx="1" />
            <rect x="9" y="9" width="5" height="5" rx="1" />
          </svg>
        </button>
      </div>

      {usageOpen && <ComponentUsage onClose={() => setUsageOpen(false)} />}

      <div className="proto-nav-switcher">
        <div className="proto-nav-select-wrap">
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
            <svg
              className="proto-nav-select-caret"
              viewBox="0 0 16 16"
              width="11"
              height="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4,6 8,10 12,6" />
            </svg>
          </button>

          {open && (
            <>
              <div className="proto-nav-backdrop" onClick={() => setOpen(false)} />
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
                          {isCurrent && (
                            <svg
                              viewBox="0 0 16 16"
                              width="12"
                              height="12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3,8 7,12 13,4" />
                            </svg>
                          )}
                        </a>
                      )
                    })}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
