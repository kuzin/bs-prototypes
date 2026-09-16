import { Img } from '@mobile/components'
import './ActivitiesList.css'

/**
 * `components/activities/activityList/ActivitiesList.tsx` — ONE list, two completely different
 * rows, chosen by `horizontal`:
 *
 *   horizontal={true}   Home        → `ActivityItemBadge`: an 87pt circular image and NOTHING else
 *   horizontal={false}  Discover    → `ActivityItem`: a 76pt ringed medallion, a 27pt check, and
 *                                     three lines of text
 *
 * They share no styling at all, so treating the Home rail as a scrolling version of the Discover
 * row is wrong in every dimension — it was built that way here first. `ActivityItemBadge` is the
 * same anatomy as the Home badge strip: art, no caption.
 *
 * The horizontal list adds `paddingHorizontal: 24` and `gap: 16`, and each badge carries its own
 * `marginTop: 24`.
 */

/** `useActivityDisplayData` — the completion line, which only the vertical row shows. */
function completedText({ isActive, hasPrerequisite, isRepeatable, completed, total }) {
  if (!isActive) return 'Not Active'
  if (hasPrerequisite) return 'Prerequisite Not Met'
  if (isRepeatable) {
    return `${completed} Activity ${completed === 1 ? 'Completion' : 'Completions'}`
  }
  return `${completed}/${total} Activities Completed`
}

export function ActivitiesList({ activities, onPress, horizontal = false }) {
  if (horizontal) {
    return (
      <div className="m-acts-h">
        {activities.map((a) => (
          <button
            key={a.id}
            type="button"
            className="m-actb"
            onClick={() => onPress?.(a)}
            aria-label={`${a.title} Activity`}
          >
            <span className="m-actb-art" style={{ background: a.art ?? 'var(--m-grey-light-2)' }} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="m-acts">
      {activities.map((a) => {
        const done = a.completed >= a.total && a.total > 0
        return (
          <button key={a.id} type="button" className="m-act" onClick={() => onPress?.(a)}>
            <span className="m-act-inner">
              <span className={`m-act-ring${done ? ' is-done' : ''}`}>
                <span
                  className="m-act-disc"
                  style={{ background: done ? 'var(--m-accent)' : 'var(--m-grey-light-2)' }}
                />
                {done && (
                  <span className="m-act-check">
                    <Img name="badgeCheckmark" size={16} />
                  </span>
                )}
              </span>
              <span className="m-act-text">
                <span className="m-t-body-smaller m-act-name">{a.track}</span>
                <span className="m-t-title-regular m-act-desc">{a.title}</span>
                <span className="m-t-sub-heading">{completedText(a)}</span>
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
