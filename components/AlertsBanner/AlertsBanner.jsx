import '@components/AlertsBanner/AlertsBanner.css'

const LEVEL_ICONS = { critical: '⚠', warning: '!', positive: '↑', info: 'ⓘ' }

/**
 * Single alert row.
 *
 * <AlertRow
 *   level="critical"
 *   title="Lincoln Elementary"
 *   description="Stuck Lexile plateau — 6 weeks, no growth"
 *   action="Review"
 *   onAction={fn}
 * />
 *
 * `title` is the bold leading label, `description` is the longer message.
 * Both are optional — pass either or both.
 */
export function AlertRow({ level = 'info', title, description, action, onAction }) {
  return (
    <div className={`ab-row ab-row--${level}`}>
      <span className="ab-icon" aria-hidden="true">
        {LEVEL_ICONS[level] || 'ⓘ'}
      </span>
      <div className="ab-body">
        {title && <span className="ab-title">{title}</span>}
        {description && <span className="ab-desc">{description}</span>}
      </div>
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
      {alerts.map((a) => (
        <AlertRow
          key={a.id}
          level={a.level}
          title={a.title}
          description={a.description}
          action={a.action}
          onAction={onNavigate && a.tab ? () => onNavigate(a.tab) : undefined}
        />
      ))}
    </div>
  )
}
