import { Icon } from '@components/Icon/Icon'
import '@components/ReadingHealth/ReadingHealth.css'

export const SECTIONS = [
  {
    key: 'motivation',
    label: 'Motivation',
    description: 'Reading Motivation Index',
    color: '#E8866A',
    bg: '#FDEEE6',
    deltaKey: 'dM',
    icon: <Icon name="flame-filled" size={20} />,
  },
  {
    key: 'integrity',
    label: 'Integrity',
    description: 'Reading verification',
    color: '#1D4ED8',
    bg: '#E8EFFE',
    deltaKey: 'dI',
    icon: <Icon name="shield-check" size={20} />,
  },
  {
    key: 'habits',
    label: 'Habits',
    description: 'Session length & streaks',
    color: '#16A97A',
    bg: '#E6F8EF',
    deltaKey: 'dH',
    icon: <Icon name="calendar" size={20} />,
  },
  {
    key: 'skills',
    label: 'Skills',
    description: 'Lexile growth',
    color: '#7C3AED',
    bg: '#F1EBFF',
    deltaKey: 'dS',
    icon: <Icon name="book" size={20} />,
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
      <div className="rh-stat-icon" aria-hidden="true">
        {section.icon}
      </div>
      <div className="rh-stat-score">{score}</div>
      <div className="rh-stat-label">{section.label}</div>
      <div className="rh-stat-meta">{delta != null && <Delta value={delta} />}</div>
      {onClick && (
        <div className="rh-stat-more">
          View more
          <Icon name="chevron-right" size={10} stroke={2} />
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
        {SECTIONS.map((sec) => (
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
