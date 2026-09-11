import '@components/BennyBubble/BennyBubble.css'

/**
 * Benny saying something.
 *
 * <BennyBubble>He's read on 21 of the last 30 days.</BennyBubble>
 * <BennyBubble variant="centered">One word from this book is yours to keep.</BennyBubble>
 *
 * variants:
 *   side      (default) avatar left, bubble beside it, copy ranged left — the
 *             shape for a bubble inside a left-aligned page or card.
 *   centered  avatar above, bubble under it with the tail pointing up, copy
 *             centred — for a centred column, where a left-hand avatar sits off
 *             the axis everything else is composed on.
 *
 * `timestamp` adds an "Analysis last run on …" line below the bubble.
 *
 * `avatar` swaps the face. Benny has a set of them — excited, thinking,
 * laughing — and which one he's wearing is part of what he's saying, so a
 * bubble that corrects you shouldn't use the same portrait as one that praises
 * you. Defaults to the neutral round avatar.
 */
export function BennyBubble({
  children,
  timestamp,
  variant = 'side',
  avatar = '/bs-prototypes/benny.png',
  className = '',
}) {
  return (
    <div className={`benny-bubble-wrap benny-bubble-wrap--${variant} ${className}`.trim()}>
      <img className="benny-bubble-avatar" src={avatar} alt="Benny" />
      <div className="benny-bubble-body">
        <div className="benny-bubble">{children}</div>
        {timestamp && (
          <div className="benny-bubble-timestamp">Analysis last run on {timestamp}</div>
        )}
      </div>
    </div>
  )
}
