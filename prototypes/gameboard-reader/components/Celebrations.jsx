import { Modal } from '@components/Modal/Modal'
import { Icon } from '@components/Icon/Icon'
import { Sheet } from './Sheet'
import { BennyCheer } from './Benny'
import { BadgeDisc } from './BadgeDisc'
import { SPACES, CHALLENGE, isEarned } from '../data'

import celebrateLeft from '../assets/celebrate-left.svg'
import celebrateRight from '../assets/celebrate-right.svg'
import confettiLeft from '../assets/confetti-left.svg'
import confettiRight from '../assets/confetti-right.svg'

/**
 * "You did it!" — the celebration every logged session lands on, whether or not
 * it unlocked a badge. Benny cheers; the reader either logs another title or
 * finishes and returns to the board.
 */
export function YouDidItSheet({ open, onClose, onLogAnother, minutes, book }) {
  return (
    <Sheet open={open} onClose={onClose} ariaLabel="Reading logged">
      <div className="gr-celebrate">
        <img className="gr-burst gr-burst--l" src={celebrateLeft} alt="" aria-hidden="true" />
        <img className="gr-burst gr-burst--r" src={celebrateRight} alt="" aria-hidden="true" />

        <div className="gr-celebrate-inner">
          <span className="gr-benny">
            <BennyCheer />
          </span>
          <h1 className="gr-celebrate-title">You did it!</h1>
          <p className="gr-celebrate-sub">
            {minutes} minutes of {book?.title || 'reading'} are on your log. Keep going — every
            session moves you along the board.
          </p>
          <div className="gr-celebrate-actions">
            <button type="button" className="gr-btn" onClick={onLogAnother}>
              Log Another Title
            </button>
            <button type="button" className="gr-btn gr-btn--primary" onClick={onClose}>
              Finish
            </button>
          </div>
        </div>
      </div>
    </Sheet>
  )
}

/**
 * "Badge Unlocked" — fires on top of the board when a log clears the next
 * space. The strip underneath puts the new badge between the space before it
 * and the one still to come, so progress has a direction.
 */
export function BadgeUnlockedModal({ open, onClose, space, booksFinished }) {
  if (!space) return null

  const i = SPACES.findIndex((s) => s.id === space.id)
  const before = SPACES[i - 1]
  const after = SPACES[i + 1]

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Badge unlocked">
      {({ close }) => (
        <div className="gr-unlock">
          <button type="button" className="gr-unlock-close" onClick={close} aria-label="Close">
            <Icon name="x" size={17} stroke={2.4} />
          </button>

          <div className="gr-unlock-top">
            <img className="gr-burst gr-burst--l" src={confettiLeft} alt="" aria-hidden="true" />
            <img className="gr-burst gr-burst--r" src={confettiRight} alt="" aria-hidden="true" />

            <BadgeDisc space={space} earned bare size="lg" />
            <h2 className="gr-unlock-title">Badge Unlocked</h2>
            <p className="gr-unlock-name">{space.name}</p>
            <span className="gr-unlock-tag">{space.requirement}</span>
          </div>

          <div className="gr-unlock-bottom">
            <p className="gr-unlock-progress">
              Wow! You’ve made progress in <span>{CHALLENGE.name}</span>!
            </p>

            <div className="gr-strip">
              <span className="gr-strip-line" aria-hidden="true" />
              <StripDot space={before} booksFinished={booksFinished} />
              <span className="gr-strip-current">
                <BadgeDisc space={space} earned bare size="sm" />
              </span>
              <StripDot space={after} booksFinished={booksFinished} />
            </div>

            <button type="button" className="gr-btn gr-btn--primary gr-btn--sm" onClick={close}>
              Check it out!
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

// A neighbouring space on the strip — a plain marker, since only the badge just
// unlocked gets its art shown.
function StripDot({ space, booksFinished }) {
  if (!space) return <span className="gr-strip-dot is-empty" />
  return (
    <span
      className={`gr-strip-dot${isEarned(space, booksFinished) ? ' is-earned' : ''}`}
      title={space.name}
    />
  )
}
