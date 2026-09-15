import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'

import './ActivityList.css'
import '@components/Button/Button.css'

/**
 * The activities under an activity badge — `activities/_activity.html.haml`.
 *
 * An activity badge is a `LearningTrack`, and a learning track *is* its
 * activities: you earn the badge by doing them. This is that list, wherever it
 * is being shown — inside the badge's own modal, or on the Complete Activity
 * screen, which is the same list with nothing else around it.
 *
 *   <ActivityList
 *     activities={badge.activities}
 *     done={doneIds}
 *     onToggle={(activity) => complete(activity)}
 *   />
 *
 * An activity comes in four kinds and the list draws each one:
 *
 *   plain  tick it off
 *   link   `link_title` / `link_url` — go and do the thing, then tick it
 *   text   `is_text_box_challenge?` — it completes by being answered
 *   code   `is_an_activity_code?` — a code the library handed out
 *
 * A **repeatable** track (`learning_track.repeatable`) counts rather than
 * ticks: you can do it again, and the app keeps the total.
 */
export function ActivityList({ activities = [], done, onToggle, heading = 'Activities' }) {
  if (activities.length === 0) return null
  const doneSet = done ?? new Set(activities.filter((a) => a.done).map((a) => a.id))

  return (
    <div className="act-list">
      {heading && <h3 className="act-list-head">{heading}</h3>}
      <ul>
        {activities.map((a) => (
          <Activity
            key={a.id}
            activity={a}
            done={doneSet.has(a.id)}
            onToggle={() => onToggle?.(a)}
          />
        ))}
      </ul>
    </div>
  )
}

/**
 * One activity. The tick is its own button, because the last two kinds complete
 * by answering rather than by ticking.
 */
export function Activity({ activity: a, done, onToggle }) {
  const [codeOpen, setCodeOpen] = useState(false)
  const [value, setValue] = useState('')
  const answered = a.kind === 'text' || a.kind === 'code'

  return (
    <li className={done && !a.repeatable ? 'is-done' : undefined}>
      <div className="act">
        <button
          type="button"
          className="act-check"
          onClick={onToggle}
          aria-pressed={done}
          aria-label={done ? 'Completed' : 'Mark complete'}
          disabled={answered}
        >
          <Icon name={done ? 'circle-check-filled' : 'circle'} size={22} />
        </button>
        <div className="act-body">
          <span className="act-name">{a.name}</span>

          {a.kind === 'link' && (
            <a className="act-link" href={a.linkUrl} target="_blank" rel="noreferrer">
              {a.linkText}
            </a>
          )}

          {a.kind === 'text' && !done && (
            <div className="act-field">
              <label htmlFor={`act-${a.id}`}>
                {a.repeatable ? 'Enter your activity' : 'Add a response'}
              </label>
              <textarea
                id={`act-${a.id}`}
                rows={2}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <Button
                size="sm"
                disabled={!value.trim()}
                onClick={() => {
                  onToggle?.()
                  setValue('')
                }}
              >
                Save
              </Button>
            </div>
          )}

          {/* The code field sits behind the button: most readers haven't got a
              code to type, and the app hides it the same way. */}
          {a.kind === 'code' &&
            !done &&
            (codeOpen ? (
              <div className="act-field">
                <label htmlFor={`code-${a.id}`}>Secret code</label>
                <input
                  id={`code-${a.id}`}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <Button size="sm" disabled={!value.trim()} onClick={onToggle}>
                  Save
                </Button>
              </div>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => setCodeOpen(true)}>
                Enter Secret Code
              </Button>
            ))}

          {a.repeatable && (
            <span className="act-times">
              {a.times ?? 0} {a.times === 1 ? 'time' : 'times'} so far
            </span>
          )}
          {a.points && <span className="act-points">Worth {a.points} Points</span>}
        </div>
      </div>
    </li>
  )
}
