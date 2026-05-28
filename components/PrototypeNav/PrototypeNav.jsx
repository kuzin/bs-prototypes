import { useEffect, useState } from 'react'
import './PrototypeNav.css'
import { PROTOTYPES } from '@components/prototypes'

const NAV_PROTOTYPES = PROTOTYPES.filter((p) => p.id !== 'patterns')

export function PrototypeNav({ currentHref }) {
  const [open, setOpen] = useState(false)
  const currentIdx = NAV_PROTOTYPES.findIndex((p) => p.href === currentHref)
  const current = currentIdx >= 0 ? NAV_PROTOTYPES[currentIdx] : null
  const prev = currentIdx > 0 ? NAV_PROTOTYPES[currentIdx - 1] : null
  const next =
    currentIdx >= 0 && currentIdx < NAV_PROTOTYPES.length - 1
      ? NAV_PROTOTYPES[currentIdx + 1]
      : null

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
      <a href="/bs-prototypes/" className="proto-nav-back">
        <img src="/bs-prototypes/bs.svg" className="proto-nav-logo" alt="" />
        <span>Prototypes</span>
      </a>

      <div className="proto-nav-switcher">
        {prev ? (
          <a
            href={prev.href}
            className="proto-nav-arrow"
            title={`Previous: ${prev.name}`}
            aria-label={`Previous: ${prev.name}`}
          >
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="10,3 5,8 10,13" />
            </svg>
          </a>
        ) : (
          <span className="proto-nav-arrow proto-nav-arrow--disabled" aria-hidden="true">
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="10,3 5,8 10,13" />
            </svg>
          </span>
        )}

        <div className="proto-nav-select-wrap">
          <button
            type="button"
            className={`proto-nav-select${!current ? ' proto-nav-select--empty' : ''}`}
            style={current ? { '--accent': current.accent } : undefined}
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            {current && <span className="proto-nav-select-dot" />}
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
                {NAV_PROTOTYPES.map((p) => {
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
                      <span className="proto-nav-option-dot" />
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
            </>
          )}
        </div>

        {next ? (
          <a
            href={next.href}
            className="proto-nav-arrow"
            title={`Next: ${next.name}`}
            aria-label={`Next: ${next.name}`}
          >
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6,3 11,8 6,13" />
            </svg>
          </a>
        ) : (
          <span className="proto-nav-arrow proto-nav-arrow--disabled" aria-hidden="true">
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6,3 11,8 6,13" />
            </svg>
          </span>
        )}
      </div>
    </nav>
  )
}
