import { Img } from '../Img/Img'
import './MonthHeader.css'

/**
 * The month row with an arrow either side — Reading Log's and the Streaks calendar's, which the
 * app builds separately and sizes differently.
 *
 *   ReadingLogHeaderStyles    paddingVertical 32, paddingHorizontal 20; month 22/bold/lh 22
 *   StreaksCalendarsStyles    marginTop 15, marginBottom 10, inset 10; month 16/bold/-0.32
 *
 * DIVERGENCE — one size, the Streaks one. The two sit a tab apart doing exactly the same job, and
 * 22pt over 32pt of padding spends 88pt of a 852pt screen on the word "September" — above a list
 * that is the reason you are on the tab. Nothing about the Reading Log earns the larger of the
 * two, so it takes the smaller.
 *
 * Both arrows come from `shared/ArrowButton`: a 24pt `swipe_{direction}_arrow`, greyDark2, and
 * greyLight1 when disabled — a TINT swap, never an opacity change. Pressed drops to 0.5.
 *
 * `disableNext` is the shared rule: you cannot page into the future. `disablePrev` is the
 * calendar's own, bounded by the earliest month with data.
 */
export function MonthHeader({
  month,
  onPrev,
  onNext,
  disablePrev = false,
  disableNext = false,
  label,
  className = '',
}) {
  return (
    <div className={`m-monthhead ${className}`}>
      <button
        type="button"
        className="m-monthhead-arrow"
        onClick={onPrev}
        disabled={disablePrev}
        aria-label="Previous month"
      >
        <Img
          name="swipe_left_arrow"
          size={24}
          tint={disablePrev ? 'var(--m-grey-light-1)' : 'var(--m-grey-dark-2)'}
        />
      </button>

      <h2 className="m-section-head m-monthhead-title" aria-label={label}>
        {month}
      </h2>

      <button
        type="button"
        className="m-monthhead-arrow"
        onClick={onNext}
        disabled={disableNext}
        aria-label="Next month"
      >
        <Img
          name="swipe_right_arrow"
          size={24}
          tint={disableNext ? 'var(--m-grey-light-1)' : 'var(--m-grey-dark-2)'}
        />
      </button>
    </div>
  )
}
