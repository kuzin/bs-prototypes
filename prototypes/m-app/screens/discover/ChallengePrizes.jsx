import { Fragment } from 'react'
import { Img } from '@mobile/components'
import './ChallengePrizes.css'

/**
 * The three tabs that answer "what do I get" — `Rewards`, `Certificates` and
 * `Ticket ${wordForDrawings}`. Three separate screens in the app, kept together here because
 * they are one idea rendered three ways and the differences between them are the interesting
 * part.
 *
 * A REWARD is a thing the site hands you, unlocked by a specific badge. A CERTIFICATE is a
 * document you earn. A DRAWING is a lottery you spend tickets on. So:
 *
 *   • a reward is locked or unlocked, and says which badge is the key
 *   • a certificate is earned or not, and says nothing else at all
 *   • a drawing is open or ended, and is the only one of the three you can act on
 */

/* ── Rewards ────────────────────────────────────────────────────────────── */

/**
 * `Reward.tsx`. The lock is the whole state: a green lock on a greenLight disc when earned, a
 * grey one on greyLight3 when not. The DISC is 40pt with a 10pt border of its own colour, which
 * is what makes a 20pt glyph sit in a 40pt circle without a separate padding rule.
 *
 * The instructions box only exists once the reward is earned — before that there is nothing to
 * instruct, because you cannot collect it yet. That is also why an unearned row is shorter
 * rather than showing a disabled box.
 */
export function ChallengeRewards({ items = [], onOpenBadge }) {
  return (
    <div className="m-chp">
      {items.map((r, i) => (
        <Fragment key={r.id}>
          <button type="button" className="m-chp-reward" onClick={() => onOpenBadge?.(r)}>
            <span className={`m-chp-lock${r.isEarned ? ' is-earned' : ''}`}>
              <Img
                name={r.isEarned ? 'earnedRewardLock' : 'unearnedRewardLock'}
                className="m-chp-lock-img"
                tint={r.isEarned ? 'var(--m-green)' : 'var(--m-warm-grey)'}
              />
            </span>
            <span className="m-chp-reward-text">
              <span className="m-t-title-regular">{r.title}</span>
              {/* The explanation names the badge either way — as the thing that unlocked it, or
                  as the thing that would. */}
              <span className={`m-chp-explain${r.isEarned ? ' is-earned' : ''}`}>
                {r.isEarned
                  ? `Unlocked with the ${r.badgeTitle} badge on ${r.dateEarned}.`
                  : `Complete the ${r.badgeTitle} badge to Unlock This Reward.`}
              </span>
              {r.isEarned && (
                <span className="m-chp-instructions">
                  <span className="m-t-title-small m-chp-instructions-title">Instructions</span>
                  <span className="m-chp-instructions-body">
                    {r.redeemed ? 'Reward has been redeemed.' : r.description}
                  </span>
                </span>
              )}
            </span>
          </button>
          {i < items.length - 1 && <span className="m-chp-rule" />}
        </Fragment>
      ))}
    </div>
  )
}

/* ── Certificates ───────────────────────────────────────────────────────── */

/**
 * `Certificate.jsx` — the plainest screen in the challenge, and deliberately so. Two lines: the
 * certificate's `title: name`, and whether you have it.
 *
 * The earned line is bold AND green; the unearned one is normal weight and greyDark2. Not a
 * colour swap on one style — the app changes the weight too, so an earned certificate reads as
 * an achievement rather than a status.
 */
export function ChallengeCertificates({ items = [] }) {
  return (
    <div className="m-chp m-chp-certs">
      {items.map((c, i) => (
        <Fragment key={c.id}>
          <div className="m-chp-cert">
            <span className="m-t-title-regular">
              {c.title}: {c.name}
            </span>
            <span className={`m-chp-cert-date${c.isEarned ? ' is-earned' : ''}`}>
              {c.isEarned ? `Earned ${c.dateEarned}` : 'Not yet earned.'}
            </span>
          </div>
          {i < items.length - 1 && <span className="m-chp-rule" />}
        </Fragment>
      ))}
    </div>
  )
}

/* ── Ticket drawings ────────────────────────────────────────────────────── */

/** `M/DD` — the app's format for a drawing date, and shorter than anywhere else in the app. */
function drawingDay(iso = '') {
  const [, m, d] = iso.split('-')
  return m && d ? `${Number(m)}/${d}` : iso
}

/**
 * `TicketDrawings` + `TicketDrawingSection` — a two-column grid of prizes you can enter.
 *
 * The heading counts what you have left to spend, not what you have earned: tickets are a
 * currency here, and the number above the grid is your balance.
 *
 * An ENDED drawing is drawn twice — the image in full colour under a 20%-opacity copy tinted
 * grey — so it reads as faded rather than greyed out, and it stops being tappable. `wordForDrawing`
 * (singular, and a different redux key from the plural one naming the tab) appears in its notice.
 */
export function ChallengeTicketDrawings({ items = [], wordForDrawing = 'drawing' }) {
  const available = items[0]?.availableTickets ?? 0

  return (
    <div className="m-chp-drawings">
      <h2 className="m-chp-balance">
        {available} Ticket{available === 1 ? '' : 's'} to Spend
      </h2>

      <div className="m-chp-grid">
        {items.map((d) => {
          const ended = d.ended
          return (
            <button
              key={d.id}
              type="button"
              className="m-chp-drawing"
              disabled={ended}
              onClick={() => {}}
            >
              <span className={`m-chp-prize${ended ? ' is-ended' : ''}`}>
                <span className="m-chp-prize-img" style={{ background: d.art }} />
                {ended && (
                  <span className="m-chp-prize-img is-overlay" style={{ background: d.art }} />
                )}
              </span>
              <span className="m-t-title-small m-chp-drawing-title">{d.title}</span>
              <span className="m-chp-drawing-date">
                {ended ? 'Ended' : 'Ends'} on {drawingDay(d.drawingDate)}
              </span>

              {/* `>= 0`, so a drawing you have entered nothing into still says so. */}
              {d.ticketsEntered >= 0 && (
                <span className="m-chp-status">
                  <Img name="challengeTicketsSmall" className="m-chp-status-icon" />
                  <span className="m-chp-status-text">
                    {d.ticketsEntered} Ticket{d.ticketsEntered === 1 ? '' : 's'} Entered
                  </span>
                </span>
              )}

              {ended && (
                <span className="m-chp-status is-ended">
                  <Img name="iconsTime" className="m-chp-status-icon" />
                  <span className="m-chp-status-text">
                    This {wordForDrawing.toLowerCase()} has ended. Winners will be notified.
                  </span>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
