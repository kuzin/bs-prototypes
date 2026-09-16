import { Img, PressableButton, StreakFire } from '@mobile/components'
import './StreaksMessage.css'

/**
 * `src/components/home/StreaksMessage.tsx`.
 *
 * The copy arrives from the API as one `streak_message` string that the app splits on sentence
 * boundaries — first sentence becomes the title, the rest the message. A title of exactly
 * "Oh no!" means the streak was lost, which swaps the whole card to its yellow/frowny treatment.
 *
 * `showStreakGraphics` gates both the decorative corner art and the flame pill: it is true only
 * when the streak is above 1, or the streak was just lost. Without it the card instead takes a
 * dashed border and drops its shadow.
 *
 * In the app this sits over a 285pt white block and is pulled up with `marginTop: -275`, netting
 * ~10pt of spacing. That is RN layout scaffolding with no meaning on the web, so it is expressed
 * as ordinary margins here.
 */
export function StreaksMessage({
  title,
  message,
  streak,
  lostStreak = false,
  onViewStreaks,
  // Accepted and unused — the dismiss control is gone (see below), but the prop stays so a caller
  // does not have to change when something replaces it.
  onClose: _onClose,
}) {
  const showStreakGraphics = (streak != null && streak > 1) || lostStreak

  return (
    <section className={`m-streak${showStreakGraphics ? '' : ' is-plain'}`}>
      {/* DIVERGENCE — no `backgroundBottomRight`.
          `showStreakGraphics` paints a red curve across the card's bottom-right corner
          (`streaksMessageBottomRight`, or `streakLostBottomRight` on a broken streak). On the
          white cards this screen used to have it read as a flourish; on the home grey, with every
          other card plain, it is the only one with art behind its text — and the flame pill in the
          same corner is already saying the thing the curve was decorating. `showStreakGraphics`
          stays in the API: it is a real prop, and a lost streak still needs its own treatment. */}
      <div className="m-streak-info">
        {/* DIVERGENCE — the count leads the card instead of sitting beside the button.
            It is what the title and the message are both about, and in the footer it read as a
            second control next to a real one. */}
        <div className="m-streak-head">
          <div className="m-streak-text">
            <p className="m-card-title m-streak-title">{title}</p>
            <p className="m-card-sub m-streak-message">{message}</p>
          </div>

          {showStreakGraphics &&
            (lostStreak ? (
              <Img name="streakLostFrownyFace" size={35} className="m-streak-frowny" />
            ) : (
              <span className="m-streak-flame">
                <StreakFire width={10} height={16} color="var(--m-white)" />
                <span className="m-t-top-level-title m-streak-count">{streak}</span>
              </span>
            ))}
        </div>

        {/* DIVERGENCE — a real button, not a coloured text link with an arrow.
            The source styles this as 14pt red type with a `redArrowRight` beside it, which is the
            only action on Home that is not a button. `type="grey"` rather than the primary fill
            the motivator and fundraiser cards use: this card is telling you how you are doing and
            offering a look at more, where those two are asking you to start something. Same
            object, quieter register — and full width, like every other card's action. */}
        <PressableButton
          size="medium"
          type="grey"
          buttonText="View Streaks"
          onButtonPress={onViewStreaks}
          fullWidth
        />

        {/* DIVERGENCE — no dismiss.
            `StreaksMessage` carries a close button that hides the card for the session. It is the
            only card on Home you can dismiss, and it dismisses the one that is congratulating you
            — so the control a reader is most likely to hit by accident is on the card they would
            least want gone. `onClose` stays in the API for whatever replaces it. */}
      </div>
    </section>
  )
}
