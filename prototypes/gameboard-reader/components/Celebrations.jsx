import { Modal } from '@components/Modal/Modal'
import { Icon } from '@components/Icon/Icon'
import { Confetti } from '@components/Confetti/Confetti'
import { EarnedCard } from '@components/EarnedCard/EarnedCard'
import '@components/Confetti/Confetti.css'
import { Sheet } from './Sheet'
import { BennyCheer } from './Benny'
import { BadgeDisc } from './BadgeDisc'
import { SPACES, CHALLENGE, isEarned, rewardFor } from '../data'

/**
 * "You did it!" — the celebration every logged session lands on, whether or not
 * it unlocked a badge. Benny cheers; the reader either logs another title or
 * finishes and returns to the board.
 */
export function YouDidItSheet({
  open,
  onClose,
  onLogAnother,
  onViewBadge,
  onReward,
  amount,
  unit,
  book,
  earned,
  booksFinished,
}) {
  const reward = earned ? rewardFor(earned.id) : null

  return (
    <Sheet open={open} onClose={onClose} ariaLabel="Reading logged">
      <div className="gr-celebrate">
        {/* The system's own burst — it falls and then stops, where the two
            painted SVGs sat pinned to the edges however long you looked. */}
        {open && <Confetti count={26} distance={620} />}

        <div className="gr-celebrate-inner">
          <span className="gr-benny">
            <BennyCheer />
          </span>
          <h1 className="gr-celebrate-title">You did it!</h1>
          {/* Whatever the title was counted in — a magazine logs in pages even
              on a site that logs minutes, so the sentence takes the unit the
              flow actually used rather than assuming one. */}
          <p className="gr-celebrate-sub">
            {amount} {unit}
            {amount === 1 ? '' : 's'} of {book?.title || 'reading'} are on your log. Keep going —
            every session moves you along the board.
          </p>

          {/* `completed_earned_cards` — what this log actually won, on the card
              every other log-success screen in the system uses. Where the badge
              sits on the board is this challenge's own postscript, so it goes
              inside the card rather than beside it. */}
          {earned && (
            <div className="gr-celebrate-earned">
              <EarnedCard
                card={{
                  label: 'Badge Earned',
                  art: earned.art,
                  eyebrow: earned.name,
                  title: earned.requirement,
                  description: CHALLENGE.name,
                  reward: reward?.title,
                }}
                onViewBadge={onViewBadge && (() => onViewBadge(earned))}
                onReward={onReward}
              >
                <BoardProgress booksFinished={booksFinished} />
              </EarnedCard>
            </div>
          )}

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
 * Where the reader has got to — the badge they last cleared between the one
 * before it and the one still to come, so progress has a direction. It is the
 * last row of the badge's earned card: a board is the one kind of challenge
 * where *where* a badge sits is part of the news.
 */
function BoardProgress({ booksFinished }) {
  // The furthest space cleared is what the strip centres on. START counts as
  // cleared from the off, so there is always one.
  const earned = SPACES.filter((s) => isEarned(s, booksFinished))
  const current = earned[earned.length - 1]
  if (!current) return null
  const i = SPACES.findIndex((s) => s.id === current.id)

  return (
    <div className="gr-boardrow">
      {/* The card above already names the badge and the challenge, so the row
          only has to say the one thing neither of them does: where it puts
          you. */}
      <span className="gr-boardrow-label">Your place on the board</span>
      <div className="gr-strip">
        <span className="gr-strip-line" aria-hidden="true" />
        <StripDot space={i > 0 ? SPACES[i - 1] : null} booksFinished={booksFinished} />
        <span className="gr-strip-current">
          <BadgeDisc space={current} earned bare size="sm" />
        </span>
        <StripDot space={SPACES[i + 1] ?? null} booksFinished={booksFinished} />
      </div>
    </div>
  )
}

/**
 * "Badge Unlocked" — fires on top of the board when a log clears the next
 * space. The strip underneath puts the new badge between the space before it
 * and the one still to come, so progress has a direction.
 */
export function BadgeUnlockedModal({ open, onClose, space }) {
  if (!space) return null

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Badge unlocked">
      {({ close }) => (
        <div className="gr-unlock">
          <button type="button" className="gr-unlock-close" onClick={close} aria-label="Close">
            <Icon name="x" size={17} stroke={2.4} />
          </button>

          <div className="gr-unlock-top">
            <Confetti count={18} distance={360} />

            <BadgeDisc space={space} earned bare size="lg" />
            <h2 className="gr-unlock-title">Badge Unlocked</h2>
            <p className="gr-unlock-name">{space.name}</p>
            <span className="gr-unlock-tag">{space.requirement}</span>
          </div>

          {/* Where this badge sits on the board is the success screen's news —
              the reader reads it there, on the screen that told them the log
              landed. This modal is the badge itself and nothing else. */}
          <div className="gr-unlock-bottom">
            <button type="button" className="gr-btn gr-btn--primary gr-btn--sm" onClick={close}>
              Check it out!
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

// A neighbouring space on the strip — a plain marker, since only the badge in
// focus gets its art shown. START and FINISH have a neighbour on one side only,
// so the strip simply comes up a dot short rather than holding an empty slot.
function StripDot({ space, booksFinished }) {
  if (!space) return null
  return (
    <span
      className={`gr-strip-dot${isEarned(space, booksFinished) ? ' is-earned' : ''}`}
      title={space.name}
    />
  )
}
