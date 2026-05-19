import './AlertsBanner.css'

const LEVEL_ICONS = { critical: '⚠', warning: '!', positive: '↑', info: 'ⓘ' }

/**
 * Single alert row.
 * <AlertRow level="critical" school="Lincoln" title="Stuck Lexile plateau" action="Review" onAction={fn} />
 */
export function AlertRow({ level = 'info', school, title, action, onAction }) {
  return (
    <div className={`ab-row ab-row--${level}`}>
      <span className="ab-icon" aria-hidden="true">{LEVEL_ICONS[level] || 'ⓘ'}</span>
      {school && <span className="ab-school">{school}</span>}
      <span className="ab-title">{title}</span>
      {action && onAction && (
        <button className="ab-action" onClick={onAction}>
          {action} →
        </button>
      )}
    </div>
  )
}

export function AlertsBanner({ alerts, onNavigate }) {
  if (!alerts?.length) return null
  return (
    <div className="ab-list">
      {alerts.map(a => (
        <AlertRow
          key={a.id}
          level={a.level}
          school={a.school}
          title={a.title}
          action={a.action}
          onAction={onNavigate && a.tab ? () => onNavigate(a.tab) : undefined}
        />
      ))}
    </div>
  )
}
