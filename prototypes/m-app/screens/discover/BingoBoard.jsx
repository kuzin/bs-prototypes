import { Img, EmptyStateView } from '@mobile/components'
import './BingoBoard.css'

/**
 * `challenges/bingo/BingoBoard.tsx` + `BingoBadge.jsx` — the only challenge type whose progress
 * is a SHAPE rather than a count.
 *
 * The grid size is inferred from the number of badges, not configured: 9 → 3 columns, 16 → 4,
 * 25 → 5, anything else → 3. And the badge size follows from the same number — 100pt on a 3×3,
 * 75 on a 4×4, 60 on a 5×5 below a 600pt screen. So a board is described entirely by how many
 * squares it has, which is why a challenge only needs `is_bingo_challenge` plus its badges.
 *
 * FOUR badge states, and they are not a progress ladder:
 *
 *   bingo        earned AND part of a completed line — a GREEN ring. The only thing on the
 *                board that says you have actually won something
 *   earned       earned, ring in greyLight1. Done, but not yet part of a line
 *   unavailable  locked behind something else, at 65% with a padlock
 *   active       available to work on: the requirement's NUMBER over its LOG TYPE, at 50%
 *
 * An `active` square shows `appropriate_text` split in two — "5" over "BOOKS" — except for an
 * ACTIVITY, which has no number and shows only the word. That split is why the text is an array
 * from the server rather than a sentence.
 *
 * The message above the board is `meta.card_message` and its colour is `checkColor`: green with
 * a smiley for `earned`/`full`, yellow with an info balloon for everything else. The yellow one
 * also carries a shadow the green one does not — the app treats "you have something to do" as
 * the more prominent of the two.
 */
const COLUMNS = { 9: 3, 16: 4, 25: 5 }
const BADGE_SIZE = { 9: 100, 16: 75, 25: 60 }

export function BingoBoard({ badges = [], meta, onOpenBadge }) {
  if (badges.length === 0) {
    return (
      <div className="m-bng-empty">
        <EmptyStateView
          source="my_badges_empty_state"
          boldText="No Badges To Show"
          middleText="This challenge doesn't have any badges yet."
        />
      </div>
    )
  }

  const columns = COLUMNS[badges.length] ?? 3
  const size = BADGE_SIZE[badges.length] ?? 70
  const won = meta?.cardState === 'earned' || meta?.cardState === 'full'

  return (
    <div className="m-bng">
      <h2 className="m-bng-title">Bingo Card</h2>

      {meta?.cardMessage && (
        <div className={`m-bng-message${won ? ' is-won' : ''}`}>
          <Img name={won ? 'smiley' : 'infoBalloon'} className="m-bng-message-icon" />
          <span className="m-bng-message-text">{meta.cardMessage}</span>
        </div>
      )}

      {/* `numColumns` on a FlatList — a fixed column count, so the squares do not reflow. */}
      <div
        className="m-bng-grid"
        style={{ gridTemplateColumns: `repeat(${columns}, ${size + 10}px)` }}
      >
        {badges.map((b) => {
          const [number, logType] = b.appropriateText ?? []
          const style = { width: size, height: size }
          return (
            <button
              key={b.id}
              type="button"
              className="m-bng-cell"
              style={{ width: size + 10, height: size + 10 }}
              onClick={() => onOpenBadge?.(b)}
              aria-label={
                b.state === 'unavailable'
                  ? `${(b.appropriateText ?? []).join(' ')}. This badge is currently unavailable.`
                  : (b.appropriateText ?? []).join(' ')
              }
            >
              {b.state === 'bingo' || b.state === 'earned' ? (
                <span
                  className={`m-bng-badge is-art${b.state === 'bingo' ? ' is-bingo' : ''}`}
                  style={{ ...style, background: b.art }}
                />
              ) : b.state === 'unavailable' ? (
                <span className="m-bng-badge is-locked" style={style}>
                  {/* Sized off the RADIUS — `borderRadius + 10`, so the padlock grows with the
                      square rather than being a fixed glyph in a shrinking circle. */}
                  <Img
                    name="bingoUnavailable"
                    className="m-bng-lock"
                    style={{ width: size / 2 + 10, height: size / 2 + 10 }}
                  />
                </span>
              ) : (
                <span className="m-bng-badge is-active" style={style}>
                  {logType !== 'ACTIVITY' && <span className="m-bng-number">{number}</span>}
                  <span className="m-bng-logtype">{logType ?? number}</span>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
