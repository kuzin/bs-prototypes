import './MainRail.css'

/**
 * Beanstack admin main rail — narrow icon strip on the far left.
 * Shared across prototypes to give the same surrounding chrome.
 *
 * @param {number} activeIndex  Index (0–7) of the active app button.
 */
export function MainRail({ activeIndex = 4, className = '' }) {
  return (
    <div className={`main-rail ${className}`.trim()}>
      <a href="/bs-prototypes/" className="main-rail-logo-link" aria-label="Prototypes">
        <img src="/bs-prototypes/bs.svg" className="main-rail-logo" alt="" />
      </a>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={`main-rail-btn${i === activeIndex ? ' main-rail-btn--active' : ''}`}>
          <div className="main-rail-icon" />
        </div>
      ))}
      <div className="main-rail-spacer" />
      <div className="main-rail-btn"><div className="main-rail-icon main-rail-icon--round" /></div>
      <div className="main-rail-btn"><div className="main-rail-icon main-rail-icon--round main-rail-icon--help">?</div></div>
      <div className="main-rail-avatar">EG</div>
    </div>
  )
}
