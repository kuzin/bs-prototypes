import { Img } from '@mobile/components'
import './ActivityDetail.css'

/**
 * `learningTracks/components/LearningTrackDetail.tsx` — where an activity actually gets done.
 *
 * The Activities tab lists TRACKS, not activities: tapping one runs `goToSelectedActivity`, which
 * fetches the learning track and pushes `activityDetails`. So the thing you tap is a heading and
 * the thing you complete is inside it — which is why the list's third line counts completions
 * rather than describing a task.
 *
 * The header is `BadgeDetail` with `isLearningTrack`, i.e. the badge screen rendering a track:
 * the medallion, the track's TITLE where a badge's description goes, and the track's own
 * description under it. Two things change in that mode — no log-type line and no earned date,
 * because a track is not earned, its activities are completed — and `imageBackground` is the
 * tenant colour only when the track is repeatable, otherwise greyLight1.
 *
 * Then "Activities", and a WARNING BANNER above it when the track cannot be worked on:
 * a prerequisite names the track you have to finish first, and an inactive track carries the
 * site's own message. Both are the same banner; only one shows, prerequisite first.
 */

/**
 * `learningTracks/components/Checkbox.tsx` — 26pt, and the SHAPE carries the meaning.
 *
 * A repeatable activity is a SQUARE at radius 8, always green, with a plus: it is a button you
 * press again, so it never looks satisfied. A one-off is a CIRCLE — green with an 11×8 tick when
 * done, a 2pt grey ring when not, and filled greyLight3 when it cannot be pressed at all.
 *
 * A checked one-off is `disabled`: completing is not reversible from here.
 */
function ActivityCheckbox({ completed, repeatable, enabled = true, onPress }) {
  if (repeatable) {
    return (
      <button
        type="button"
        className="m-ad-check is-repeatable"
        disabled={!enabled}
        aria-label="Click to complete repeatable activity."
        onClick={onPress}
      >
        <Img name="repeatablePlus" className="m-ad-check-plus" />
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`m-ad-check${completed ? ' is-checked' : enabled ? '' : ' is-disabled'}`}
      disabled={completed || !enabled}
      aria-checked={completed}
      role="checkbox"
      aria-label={completed ? 'Activity Completed.' : 'Click to complete activity.'}
      onClick={onPress}
    >
      {completed && <Img name="check_mark_switch_reader" className="m-ad-check-tick" />}
    </button>
  )
}

/** `ActivityCounter` — the `repeatableCounter` glyph and a tally, on repeatables only. */
function ActivityCounter({ count = 0 }) {
  return (
    <span className="m-ad-counter">
      <Img name="repeatableCounter" className="m-ad-counter-icon" />
      <span className="m-ad-counter-text">{count}</span>
    </span>
  )
}

/** `WarningBanner` — one banner, two reasons, and only ever one of them on screen. */
function WarningBanner({ message }) {
  return (
    <div className="m-ad-warning">
      <Img name="warning" className="m-ad-warning-icon" />
      <span className="m-ad-warning-text">{message}</span>
    </div>
  )
}

/**
 * `StandardActivity` — a checkbox, the activity's own HTML, an optional link, and a counter.
 *
 * `getOpacity` drops the whole row to 0.3 when the track is inactive or blocked, rather than
 * hiding it: you can still read what you would be doing, you just cannot tick it.
 */
function StandardActivity({ activity, repeatable, dimmed, enabled, onToggle }) {
  return (
    <div className={`m-ad-activity${dimmed ? ' is-dimmed' : ''}`}>
      <ActivityCheckbox
        completed={activity.completed}
        repeatable={repeatable}
        enabled={enabled}
        onPress={() => onToggle?.(activity)}
      />
      <div className="m-ad-activity-body">
        <p className="m-ad-activity-text">{activity.description}</p>
        {activity.linkUrl && <span className="m-ad-link">{activity.linkTitle ?? 'Open Link'}</span>}
        {repeatable && <ActivityCounter count={activity.tally} />}
      </div>
    </div>
  )
}

export function ActivityDetail({ track, onToggleActivity, onBack }) {
  if (!track) return null

  const blocked = track.hasPrerequisite || !track.isActive
  const warning = track.hasPrerequisite
    ? `You must complete the ${track.prerequisite} Activity before you can access this one`
    : (track.inactiveMessage ?? null)

  return (
    <div className="m-ad">
      {/* `getHeaderBackButton(goBack, 'dropdown_arrow')` — a chevron DOWN, because this is
          presented rather than pushed. The bar carries the track's colour so it reads as the top
          of the medallion's field. */}
      <div className="m-ad-backbar" style={{ background: track.headerColor }}>
        <button type="button" className="m-ad-back" aria-label="Close" onClick={onBack}>
          <Img name="dropdown_arrow" className="m-ad-back-img" />
        </button>
      </div>

      <div className="m-ad-scroll">
        <div className="m-ad-head" style={{ background: track.headerColor }}>
          {/* `imageBackground` — the tenant colour on a repeatable track, greyLight1 otherwise. */}
          <span
            className="m-ad-medallion"
            style={{ background: track.repeatable ? 'var(--m-accent)' : 'var(--m-grey-light-1)' }}
          >
            <span className="m-ad-medallion-art" style={{ background: track.art }} />
          </span>
        </div>

        <div className="m-ad-meta">
          {/* In `isLearningTrack` mode the track's TITLE occupies the badge-description slot. */}
          <h1 className="m-ad-title">{track.title}</h1>
          {track.description && <p className="m-ad-description">{track.description}</p>}
        </div>

        <div className="m-ad-activities-head">
          {warning && <WarningBanner message={warning} />}
          <h2 className="m-ad-section">Activities</h2>
        </div>

        <div className="m-ad-activities">
          {(track.activities ?? []).map((a, i) => (
            <div key={a.id}>
              {i > 0 && <span className="m-ad-separator" aria-hidden="true" />}
              <StandardActivity
                activity={a}
                repeatable={track.repeatable}
                dimmed={blocked}
                enabled={!blocked}
                onToggle={onToggleActivity}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
