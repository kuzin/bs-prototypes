import './AlertsBanner.css'

export function AlertsBanner({ alerts, onNavigate }) {
  if (!alerts?.length) return null
  return (
    <div className="ab-list">
      {alerts.map(a => (
        <div key={a.id} className={`ab-row ab-row--${a.level}`}>
          <span className="ab-icon" aria-hidden="true">
            {a.level === 'critical' ? '⚠' : a.level === 'warning' ? '!' : a.level === 'positive' ? '↑' : 'ⓘ'}
          </span>
          <span className="ab-school">{a.school}</span>
          <span className="ab-title">{a.title}</span>
          {onNavigate && a.tab && (
            <button className="ab-action" onClick={() => onNavigate(a.tab)}>
              {a.action} →
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
