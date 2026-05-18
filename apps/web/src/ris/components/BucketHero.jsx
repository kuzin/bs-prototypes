import { SECTIONS } from './ReadingHealth'
import './BucketHero.css'

function Delta({ value }) {
  if (value === 0) return <span className="bh-delta bh-delta--flat">±0 pts</span>
  const positive = value > 0
  return (
    <span className={`bh-delta bh-delta--${positive ? 'up' : 'down'}`}>
      {positive ? '↑' : '↓'} {Math.abs(value)} pts
    </span>
  )
}

export function BucketHero({ bucket, score, delta }) {
  const section = SECTIONS.find(s => s.key === bucket)
  if (!section) return null

  return (
    <div className="bh-row" style={{ '--sec-color': section.color, '--sec-bg': section.bg }}>
      <div className="bh-icon" aria-hidden="true">{section.icon}</div>
      <h2 className="bh-title">{section.label}</h2>
      <div className="bh-score-row">
        <span className="bh-score">{score}</span>
        <Delta value={delta} />
      </div>
    </div>
  )
}
