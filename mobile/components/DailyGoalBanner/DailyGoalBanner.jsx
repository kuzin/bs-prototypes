import { GoalConnectorIcon, StarGoalIcon } from '../../svg.generated'
import './DailyGoalBanner.css'

/**
 * `src/components/shared/DailyGoalBanner.tsx`.
 *
 * The copy switches at two thresholds, and the headline/subheader pairs are fixed strings — worth
 * reproducing exactly, because they are what a reader actually reads.
 *
 * The bar is a 32pt yellow track with a notched connector and a star bubble at its end, not a thin
 * progress line. The fill has a 32pt MINIMUM so the rounded cap is always a full circle even at
 * zero progress.
 */
const MIN_FILL = 32
const HALFWAY = 0.5

function bannerContent(totalMinutes, goalMinutes) {
  if (totalMinutes >= goalMinutes) {
    return {
      headline: 'Well done!',
      subheader: 'You’ve reached your reading goal for the day.',
      isCompleted: true,
    }
  }
  if (goalMinutes > 0 && totalMinutes / goalMinutes >= HALFWAY) {
    return {
      headline: 'Keep going!',
      subheader: 'Your daily reading goal is in reach!',
      isCompleted: false,
    }
  }
  return {
    headline: 'Log Some Reading!',
    subheader: 'Get logging to complete your daily goal.',
    isCompleted: false,
  }
}

/**
 * `variant` is a design axis, not a port — the app ships only the card.
 *
 *   card     Home. One card among several on a grey ground, where the white/radius/shadow is what
 *            separates it from its neighbours.
 *   flush    Reading Log. The card chrome removed: on a white page under the tabs it was drawing
 *            a box around nothing.
 *   compact  flush on ONE row — 109pt down to about 62, which matters because the band sits above
 *            the calendar that is the reason you opened the tab.
 *
 * THE STAR STAYS ON THE BAR. It was tried in front as a leading icon and the position is worse:
 * as the bar's end cap it is the thing the fill is travelling TOWARD, which is most of what makes
 * the bar read as a goal rather than a gauge. Leading with it, the bar just ends.
 *
 * That decides the bar's height too — the cap is a 32pt disc, so the track stays 32pt and a
 * one-row variant is about 62pt rather than the 40 a 10pt bar would allow. Worth it.
 *
 * NO LABEL on the one-row variant, after trying three. A stacked "Daily Goal" caption with a
 * "7 min to go" counter cost 28pt of height; brought inline at the head of the row it cost width
 * instead, squeezing the track to 113pt of a 353pt row — about a third, where the bar is the only
 * part that has to be read at a glance. The tab says Reading Log, "/ 20 Min" says it is a target,
 * and the star says what happens when you get there. Adding the words back said none of it again.
 *
 * The star and its connector stay GREY until the goal is met. A yellowLight ground was tried and
 * reverted: it stops the disc reading as disabled, but it reads as already-earned instead, which
 * spends the moment the star exists for. Turning yellow IS the reward.
 */
export function DailyGoalBanner({ goalMinutes, totalMinutes, staticTitle, variant = 'card' }) {
  const { headline, subheader, isCompleted } = bannerContent(totalMinutes, goalMinutes)
  const ratio = goalMinutes > 0 ? Math.min(1, totalMinutes / goalMinutes) : 0
  const flush = variant !== 'card'
  const oneRow = variant === 'compact'

  const track = (
    <div className="m-dgb-row">
      <div
        className="m-dgb-track"
        role="progressbar"
        aria-label="Daily reading goal"
        aria-valuemin={0}
        aria-valuemax={goalMinutes}
        aria-valuenow={Math.min(totalMinutes, goalMinutes)}
      >
        {/* The RN version measures the track and sets a pixel width; `max()` expresses the same
            floor declaratively, so it stays correct at any frame width. */}
        <div className="m-dgb-fill" style={{ width: `max(${MIN_FILL}px, ${ratio * 100}%)` }} />
      </div>

      {/* The notched connector, on EVERY variant. It was dropped from the flush ones as
          decoration, which was wrong: the notch is what makes the star read as ATTACHED to the
          bar rather than a disc that happens to sit after it. Take it away and the two are
          separate objects — which is exactly what the star being the bar's destination depends
          on not being true. */}
      <span className="m-dgb-connector">
        <GoalConnectorIcon
          width={12}
          height={12}
          color={isCompleted ? 'var(--m-yellow)' : 'var(--m-grey-light-1)'}
        />
      </span>

      {/* Grey until it is EARNED. A yellowLight ground was tried, to stop the disc reading as a
          disabled button — but it reads as a goal already met, which is worse: the star is the
          reward at the end of the bar, and colouring it early spends the moment it exists for.
          The source had this right. */}
      <span className={`m-dgb-star${isCompleted ? ' is-met' : ''}`}>
        <StarGoalIcon
          width={16}
          height={16}
          color={isCompleted ? 'var(--m-yellow-extra-light)' : 'var(--m-grey-dark-4)'}
        />
      </span>
    </div>
  )

  const minutes = (
    <p className="m-t-section-title m-dgb-minutes">
      <span className="m-dgb-total">{totalMinutes}</span>
      {' / '}
      {goalMinutes}
      {/* Abbreviated on one row — the unit still has to be there (the number is meaningless
          without it) but the full word was taking the width the bar needs. */}
      {oneRow ? ' Min' : ' Minutes'}
    </p>
  )

  if (oneRow) {
    return (
      <section className={`m-dgb m-dgb--${variant} is-flush`}>
        <div className="m-dgb-line">
          {minutes}
          {track}
        </div>
      </section>
    )
  }

  return (
    <section className={`m-dgb m-dgb--${variant}${flush ? ' is-flush' : ''}`}>
      {/* `flush` drops the label as well as the card. On Home the banner needs to say what it is,
          because it sits among other cards; as the Reading Log's own header band it does not —
          “/ 20 Minutes” already states the goal, and the tab above it already says Reading Log. */}
      {flush ? null : staticTitle != null ? (
        <p className="m-t-small-title m-dgb-static">{staticTitle}</p>
      ) : (
        <>
          <p className="m-card-title m-dgb-headline">{headline}</p>
          <p className="m-card-sub m-dgb-sub">{subheader}</p>
        </>
      )}
      {minutes}
      {track}
    </section>
  )
}
