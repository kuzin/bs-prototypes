import './OverviewHero.css'

export function OverviewHero({ title, subtitle, accent, initials, year = '2024–25 School Year' }) {
  return (
    <header className="oh-hero">
      <div className="oh-avatar" style={accent ? { background: accent } : undefined}>
        {initials}
      </div>
      <div className="oh-text">
        <h1 className="oh-title">{title}</h1>
        <div className="oh-meta">
          <span>{subtitle}</span>
          <span className="oh-dot" aria-hidden="true">·</span>
          <span>{year}</span>
        </div>
      </div>
    </header>
  )
}
