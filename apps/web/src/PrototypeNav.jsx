import './PrototypeNav.css'
import { PROTOTYPES } from './prototypes'

export function PrototypeNav({ currentHref }) {
  const others = PROTOTYPES.filter(p => p.href !== currentHref)

  return (
    <nav className="proto-nav">
      <a href="/bs-prototypes/" className="proto-nav-back">
        <img src="/bs-prototypes/bs.svg" className="proto-nav-logo" alt="" />
        <span>Prototypes</span>
      </a>
      {others.length > 0 && (
        <div className="proto-nav-switcher">
          {others.map(p => (
            <a
              key={p.href}
              href={p.href}
              className="proto-nav-pill"
              style={{ '--accent': p.accent }}
            >
              {p.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
