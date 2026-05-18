import './PageHero.css'

export function PageHero({ icon, title, subtitle, accent = '#0DA7BC', accentBg = '#ECFEFF' }) {
  return (
    <div className="ph-row" style={{ '--ph-color': accent, '--ph-bg': accentBg }}>
      <div className="ph-icon">{icon}</div>
      <div className="ph-text">
        <h2 className="ph-title">{title}</h2>
        {subtitle && <div className="ph-sub">{subtitle}</div>}
      </div>
    </div>
  )
}
