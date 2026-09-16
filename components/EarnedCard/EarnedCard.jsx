import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'

import '@components/EarnedCard/EarnedCard.css'
import '@components/Button/Button.css'

/**
 * `logged_books/_completed_earned_card` — one thing a log won. The badge's art
 * beside its name, what it took, and the challenge it belongs to; then whatever
 * came with it, one row each, under a rule.
 *
 * Exported because an Epic import can earn badges too, and the screen at the
 * end of one should say so the same way the screen at the end of a log does.
 *
 *   <EarnedCard
 *     card={{ label, eyebrow, title, description, art, reward, tickets }}
 *
 * `art` is a badge's image src, or a node for an achievement's drawn medallion,
 * and `viewLabel` renames the button for whatever the card is holding — an
 * achievement is not a badge, and the button shouldn't say it is.
 *     onViewBadge={open}
 *     onReward={goToRewards}
 *     onTickets={goToTickets}
 *   />
 *
 * `children` is a last ruled-off row for whatever else the surface has to say
 * about this badge — the gameboard puts the reader's place on the board there,
 * because where a badge sits is the news on a board and nowhere else.
 */
export function EarnedCard({ card, onViewBadge, onReward, onTickets, children }) {
  return (
    <article className="ec">
      <h3 className="ec-label">{card.label}</h3>

      <div className="ec-body">
        {/* A badge ships a file; an achievement is a drawn medallion
            (`AchievementArt`). Same 72px slot either way. */}
        {card.art &&
          (typeof card.art === 'string' ? (
            <img className="ec-art" src={card.art} alt="" />
          ) : (
            <span className="ec-art ec-art--drawn">{card.art}</span>
          ))}
        <div className="ec-text">
          {card.eyebrow && <span className="ec-eyebrow">{card.eyebrow}</span>}
          <span className="ec-title">{card.title}</span>
          {card.description && <span className="ec-desc">{card.description}</span>}
        </div>
        {/* The badge is the thing you just won and the modal is where it
            actually lives — its ring, what it pays out, when you got it. */}
        {onViewBadge && (
          <Button variant="secondary" size="md" onClick={() => onViewBadge(card)}>
            {card.viewLabel ?? 'View Badge'}
          </Button>
        )}
      </div>

      {(card.reward || card.tickets) && (
        <div className="ec-extras">
          {card.reward && (
            <div className="ec-extra">
              <span className="ec-extra-art ec-extra-art--reward">
                <Icon name="gift" size={22} />
              </span>
              <span className="ec-extra-text">
                <span className="ec-extra-label">Reward</span>
                <span className="ec-extra-title">{card.reward}</span>
              </span>
              {/* A reward is claimed on the challenge's Rewards tab, the same
                  as tickets — knowing you won one and having no way to it is
                  the half of the news that doesn't help. */}
              {onReward && (
                <Button variant="secondary" size="md" onClick={() => onReward(card)}>
                  Go to Rewards
                </Button>
              )}
            </div>
          )}
          {card.tickets && (
            <div className="ec-extra">
              <span className="ec-extra-art ec-extra-art--ticket">
                <Icon name="ticket" size={22} />
              </span>
              <span className="ec-extra-text">
                <span className="ec-extra-label">Tickets</span>
                <span className="ec-extra-title">
                  {card.tickets} {card.tickets === 1 ? 'Ticket' : 'Tickets'}
                </span>
              </span>
              {/* Tickets are only worth anything spent, and they're spent on
                  the challenge's own Rewards tab — which is where this goes. */}
              {onTickets && (
                <Button variant="secondary" size="md" onClick={() => onTickets(card)}>
                  Go to Tickets
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {children && <div className="ec-foot">{children}</div>}
    </article>
  )
}
