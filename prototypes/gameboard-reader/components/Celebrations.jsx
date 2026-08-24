import { Modal } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { Sheet } from './Sheet'
import { BennyCheer } from './Benny'
import { BadgeDisc } from './BadgeDisc'
import { SPACES, CHALLENGE, isEarned } from '../data'

// Scattered confetti — drawn once and mirrored, so both sides of a celebration
// read as the same burst without hand-placing forty shapes.
const CONFETTI = [
  { x: 4, y: 22, r: 8, c: '#4BA3E3', s: 'dot' },
  { x: 11, y: 12, r: -20, c: '#16A97A', s: 'squiggle' },
  { x: 18, y: 30, r: 40, c: '#F4826A', s: 'blob' },
  { x: 8, y: 44, r: 12, c: '#F0A024', s: 'star' },
  { x: 20, y: 52, r: -15, c: '#16A97A', s: 'squiggle' },
  { x: 14, y: 62, r: 25, c: '#E8456B', s: 'dot' },
  { x: 26, y: 40, r: -35, c: '#F0A024', s: 'wedge' },
  { x: 6, y: 68, r: 10, c: '#E8456B', s: 'dot' },
  { x: 24, y: 18, r: 55, c: '#E8456B', s: 'squiggle' },
]

// `wide` spills the burst out past its container, for the full-page celebration
// where the confetti should reach the edges of the screen rather than the text.
function Confetti({ wide }) {
  return (
    <div className={`gr-confetti${wide ? ' gr-confetti--wide' : ''}`} aria-hidden="true">
      {CONFETTI.map((p, i) => (
        <span
          key={`l${i}`}
          className={`gr-cf gr-cf--${p.s}`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, rotate: `${p.r}deg`, '--cf': p.c }}
        />
      ))}
      {CONFETTI.map((p, i) => (
        <span
          key={`r${i}`}
          className={`gr-cf gr-cf--${p.s}`}
          style={{ right: `${p.x}%`, top: `${p.y}%`, rotate: `${-p.r}deg`, '--cf': p.c }}
        />
      ))}
    </div>
  )
}

/**
 * "You did it!" — the celebration every logged session lands on, whether or not
 * it unlocked a badge. Benny cheers; the reader either logs another title or
 * finishes and returns to the board.
 */
export function YouDidItSheet({ open, onClose, onLogAnother, minutes, book }) {
  return (
    <Sheet open={open} onClose={onClose} ariaLabel="Reading logged">
      <div className="gr-celebrate">
        <Confetti wide />
        <span className="gr-benny">
          <BennyCheer />
        </span>
        <h1 className="gr-sheet-title">You did it!</h1>
        <p className="gr-celebrate-sub">
          {minutes} minutes of {book?.title || 'reading'} are on your log. Keep going — every
          session moves you along the board.
        </p>
        <div className="gr-celebrate-actions">
          <Button variant="secondary" onClick={onLogAnother}>
            Log Another Title
          </Button>
          <Button variant="primary" accent="#1A6DD5" onClick={onClose}>
            Finish
          </Button>
        </div>
      </div>
    </Sheet>
  )
}

/**
 * "Badge Unlocked" — fires on top of the board when a log clears the next
 * space, with a three-space strip showing where the reader now stands.
 */
export function BadgeUnlockedModal({ open, onClose, space, booksFinished }) {
  if (!space) return null

  // The unlocked space flanked by its neighbours, so progress has a direction.
  const i = SPACES.findIndex((s) => s.id === space.id)
  const strip = [SPACES[i - 1], SPACES[i], SPACES[i + 1]].filter(Boolean)

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Badge unlocked">
      {({ close }) => (
        <div className="gr-unlock">
          <button type="button" className="gr-unlock-close" onClick={close} aria-label="Close">
            <Icon name="x" size={18} stroke={2.2} />
          </button>

          <div className="gr-unlock-top">
            <Confetti />
            <BadgeDisc space={space} earned size="lg" />
            <h2 className="gr-unlock-title">Badge Unlocked</h2>
            <p className="gr-unlock-name">{space.name}</p>
            <span className="gr-unlock-req">{space.requirement}</span>
          </div>

          <div className="gr-unlock-bottom">
            <p className="gr-unlock-progress">
              Wow! You’ve made progress in
              <br />
              {CHALLENGE.name}!
            </p>
            <div className="gr-unlock-strip">
              {strip.map((s) => {
                const current = s.id === space.id
                return (
                  <span key={s.id} className={`gr-strip-item${current ? ' is-current' : ''}`}>
                    {current ? (
                      <BadgeDisc space={s} earned size="sm" />
                    ) : (
                      <span
                        className={`gr-strip-dot${isEarned(s, booksFinished) ? ' is-earned' : ''}`}
                      />
                    )}
                  </span>
                )
              })}
            </div>
            <Button variant="primary" accent="#1A6DD5" onClick={close}>
              Check it out!
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
