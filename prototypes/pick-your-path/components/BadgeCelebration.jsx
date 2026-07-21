import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Modal } from '@components/Modal/Modal'

const KIND_LABEL = {
  reading: 'Reading Badge',
  activity: 'Activity Badge',
  destination: 'Destination Badge',
}

// Fixed confetti pieces (no RNG) — brand colors, staggered fall.
const CONFETTI = [
  { l: 6, d: 0, c: '#0F766E', r: 12 },
  { l: 16, d: 0.25, c: '#F0A024', r: -20 },
  { l: 27, d: 0.5, c: '#14B8A6', r: 40 },
  { l: 38, d: 0.1, c: '#EA580C', r: -10 },
  { l: 47, d: 0.4, c: '#2563EB', r: 25 },
  { l: 56, d: 0.15, c: '#16A34A', r: -35 },
  { l: 66, d: 0.55, c: '#F0A024', r: 15 },
  { l: 76, d: 0.3, c: '#0F766E', r: -22 },
  { l: 86, d: 0.05, c: '#14B8A6', r: 30 },
  { l: 93, d: 0.45, c: '#EA580C', r: -15 },
  { l: 33, d: 0.65, c: '#16A34A', r: 18 },
  { l: 62, d: 0.7, c: '#2563EB', r: -28 },
]

// Celebratory pop shown when a badge is newly earned.
export function BadgeCelebration({ badge, open, onClose }) {
  if (!badge) return null
  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Badge earned">
      <div className="pyp-celebrate" style={{ '--badge-color': badge.color }}>
        <div className="pyp-confetti" aria-hidden>
          {CONFETTI.map((p, i) => (
            <span
              key={i}
              className="pyp-confetti-bit"
              style={{
                left: `${p.l}%`,
                background: p.c,
                animationDelay: `${p.d}s`,
                transform: `rotate(${p.r}deg)`,
              }}
            />
          ))}
        </div>

        <div className="pyp-celebrate-medal">
          {badge.art ? (
            <img className="pyp-celebrate-img" src={badge.art} alt="" />
          ) : (
            <span className="pyp-celebrate-face">
              <Icon name={badge.icon} size={44} stroke={1.7} />
            </span>
          )}
        </div>

        <div className="pyp-celebrate-kicker">
          <Icon name="sparkles" size={14} /> Badge earned!
        </div>
        <h3 className="pyp-celebrate-name">{badge.name}</h3>
        <div className="pyp-celebrate-type">{KIND_LABEL[badge.kind]}</div>

        <Button variant="primary" size="md" onClick={onClose}>
          Awesome!
        </Button>
      </div>
    </Modal>
  )
}
