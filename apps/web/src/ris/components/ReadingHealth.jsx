import './ReadingHealth.css'

export const SECTIONS = [
  {
    key: 'motivation',
    label: 'Motivation',
    description: 'Reading Motivation Index',
    color: '#E8866A',
    bg: '#FDEEE6',
    deltaKey: 'dM',
    icon: (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
        <path d="M10 1.5c.2 2.4-1.2 3.4-2.5 4.7-1.3 1.3-2.7 2.9-2.7 5.5 0 2.9 2.3 5.3 5.2 5.3s5.2-2.4 5.2-5.3c0-1.8-.7-2.9-1.5-3.7-.4.7-1.2 1-1.9 0-.6-.9 0-2 0-3.5 0-1.4-.9-2.5-1.8-3z"/>
      </svg>
    ),
  },
  {
    key: 'integrity',
    label: 'Integrity',
    description: 'Reading verification',
    color: '#1D4ED8',
    bg: '#E8EFFE',
    deltaKey: 'dI',
    icon: (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 1.8 16.5 4v6.2c0 4-3 7.2-6.5 8.2-3.5-1-6.5-4.2-6.5-8.2V4z" fill="currentColor" fillOpacity="0.15"/>
        <polyline points="6.8,10.2 9,12.4 13.4,7.8"/>
      </svg>
    ),
  },
  {
    key: 'habits',
    label: 'Habits',
    description: 'Session length & streaks',
    color: '#16A97A',
    bg: '#E6F8EF',
    deltaKey: 'dH',
    icon: (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4.5" width="14" height="13" rx="1.6" fill="currentColor" fillOpacity="0.12"/>
        <line x1="3" y1="8.5" x2="17" y2="8.5"/>
        <line x1="7" y1="2.5" x2="7" y2="5.5"/>
        <line x1="13" y1="2.5" x2="13" y2="5.5"/>
        <circle cx="7" cy="12" r="0.9" fill="currentColor"/>
        <circle cx="10" cy="12" r="0.9" fill="currentColor"/>
        <circle cx="13" cy="12" r="0.9" fill="currentColor"/>
        <circle cx="7" cy="15" r="0.9" fill="currentColor"/>
      </svg>
    ),
  },
  {
    key: 'skills',
    label: 'Skills',
    description: 'Lexile growth',
    color: '#7C3AED',
    bg: '#F1EBFF',
    deltaKey: 'dS',
    icon: (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4c0-.6.4-1 1-1h5.5v14H4c-.6 0-1-.4-1-1V4z" fill="currentColor" fillOpacity="0.12"/>
        <path d="M17 4c0-.6-.4-1-1-1h-5.5v14H16c.6 0 1-.4 1-1V4z" fill="currentColor" fillOpacity="0.12"/>
        <line x1="9.5" y1="3" x2="9.5" y2="17"/>
      </svg>
    ),
  },
]

function Delta({ value }) {
  if (value === 0) return <span className="rh-delta rh-delta--flat">±0</span>
  const positive = value > 0
  return (
    <span className={`rh-delta rh-delta--${positive ? 'up' : 'down'}`}>
      {positive ? '↑' : '↓'} {Math.abs(value)} pts
    </span>
  )
}

/**
 * Single health-area tile (Motivation / Integrity / Habits / Skills).
 * <HealthStat section={SECTIONS[0]} score={71} delta={7} onClick={fn} />
 */
export function HealthStat({ section, score, delta, onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`rh-stat${onClick ? ' rh-stat--clickable' : ''}`}
      style={{ '--sec-color': section.color, '--sec-bg': section.bg }}
    >
      <div className="rh-stat-icon" aria-hidden="true">{section.icon}</div>
      <div className="rh-stat-score">{score}</div>
      <div className="rh-stat-label">{section.label}</div>
      <div className="rh-stat-meta">
        <span className="rh-stat-desc">{section.description}</span>
        {delta != null && <Delta value={delta} />}
      </div>
      {onClick && (
        <div className="rh-stat-more">
          View more
          <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5,3 8,6 5,9" />
          </svg>
        </div>
      )}
    </Tag>
  )
}

export function ReadingHealth({ title = 'Reading Health', data, onNavigate }) {
  return (
    <div className="rh-wrap">
      {title && <h3 className="rh-title">{title}</h3>}
      <div className="rh-grid">
        {SECTIONS.map(sec => (
          <HealthStat
            key={sec.key}
            section={sec}
            score={data[sec.key]}
            delta={data[sec.deltaKey]}
            onClick={onNavigate ? () => onNavigate(sec.key) : undefined}
          />
        ))}
      </div>
    </div>
  )
}
