import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { Modal, ModalClose } from '@components/Modal/Modal'

import './BadgeModal.css'
import '@components/Button/Button.css'
import '@components/Pill/Pill.css'
import '@components/Modal/Modal.css'

/**
 * One badge, opened — `earnables/_earnable_modal` and
 * `_earnable_single_column`, the modal behind every badge the app draws.
 *
 * The app's own order, top to bottom: the badge inside a **progress ring**,
 * with a check over it once it's earned; the badge's name; **what it takes**
 * (`appropriate_text`) or what it was; when it was completed; a progress pill
 * reading "620 / 1,000 Minutes Read"; a **Required** pill where the challenge
 * insists on it; then what else comes with it — a reward, tickets, a
 * certificate — and the way to go and do the thing (`Log Next Minute`).
 *
 * One modal for every badge surface: a challenge's Badges tab, a fundraiser's,
 * the reader's Collections shelf, and each square of a bingo card.
 *
 *   <BadgeModal badge={badge} src={badgeSrc} onClose={close} onLog={log} />
 *
 * `badge` is the log's own shape — `{ name, blurb, date, have, need, unit,
 * locked }` — plus the optional `required` / `reward` / `tickets` /
 * `certificate` a requirement can carry, and `state: 'bingo' | 'unavailable'`
 * for the two a bingo square adds.
 *
 * An **activity badge** is a `LearningTrack`, and a learning track *is* its
 * activities — so `activities` gets listed with a tick each, the way the app's
 * own two-column modal lists them.
 */
/**
 * One activity, in the four kinds an `Activity` comes in: tick it off, follow a
 * **link** (`link_title` / `link_url`), write an answer
 * (`is_text_box_challenge?`), or enter a **code** the library handed out
 * (`is_an_activity_code?`). A **repeatable** track counts rather than ticks —
 * you can do it again, and the app keeps the total.
 *
 * The tick is its own button, because the last two complete by answering
 * rather than by ticking.
 */
function Activity({ activity: a, done, onToggle }) {
  const [codeOpen, setCodeOpen] = useState(false)
  const [value, setValue] = useState('')
  const answered = a.kind === 'text' || a.kind === 'code'

  return (
    <li className={done && !a.repeatable ? 'is-done' : undefined}>
      <div className="bdg-act">
        <button
          type="button"
          className="bdg-act-check"
          onClick={onToggle}
          aria-pressed={done}
          aria-label={done ? 'Completed' : 'Mark complete'}
          disabled={answered}
        >
          <Icon name={done ? 'circle-check-filled' : 'circle'} size={22} />
        </button>
        <div className="bdg-act-body">
          <span className="bdg-act-name">{a.name}</span>

          {a.kind === 'link' && (
            <a className="bdg-act-link" href={a.linkUrl} target="_blank" rel="noreferrer">
              {a.linkText}
            </a>
          )}

          {a.kind === 'text' && !done && (
            <div className="bdg-act-field">
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
                  onToggle()
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
              <div className="bdg-act-field">
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
            <span className="bdg-act-times">
              {a.times ?? 0} {a.times === 1 ? 'time' : 'times'} so far
            </span>
          )}
          {a.points && <span className="bdg-act-points">Worth {a.points} Points</span>}
        </div>
      </div>
    </li>
  )
}

export function BadgeModal({
  badge,
  src,
  open = true,
  onClose,
  onLog,
  logLabel,
  completed,
  onToggleActivity,
}) {
  if (!badge) return null

  // Which activities are done — the caller's, where it keeps that; the
  // fixture's own otherwise.
  const done = new Set(completed ?? (badge.activities ?? []).filter((a) => a.done).map((a) => a.id))

  const earned = !badge.locked
  const pct =
    badge.need != null ? Math.min(100, Math.round(((badge.have ?? 0) / badge.need) * 100)) : 0
  const ring = earned ? 100 : pct
  const gets = [
    badge.reward && {
      kind: 'reward',
      icon: 'gift',
      label: 'Reward',
      detail: typeof badge.reward === 'string' ? badge.reward : 'There is a reward with this badge',
    },
    badge.tickets && {
      kind: 'tickets',
      icon: 'ticket',
      label: 'Tickets',
      detail:
        typeof badge.tickets === 'number'
          ? `${badge.tickets} ${badge.tickets === 1 ? 'Ticket' : 'Tickets'}`
          : 'This badge earns tickets',
    },
    badge.certificate && {
      kind: 'certificate',
      icon: 'award',
      label: 'Certificate',
      detail:
        typeof badge.certificate === 'string'
          ? badge.certificate
          : 'There is a certificate with this badge',
    },
  ].filter(Boolean)

  return (
    <Modal open={open} onClose={onClose} variant="center" closeBadge ariaLabel="Badge">
      <ModalClose onClick={onClose} />
      <div className="modal-body bdg">
        {/* `.badge-image.logging-badge` — the ring is the share done, and it
            goes jade and takes a check the moment the badge is earned. */}
        <div className={`bdg-art${earned ? ' is-earned' : ''}`}>
          <svg className="bdg-ring" viewBox="0 0 140 140" aria-hidden="true">
            <circle className="bdg-ring-track" cx="70" cy="70" r="64" />
            <circle
              className="bdg-ring-fill"
              cx="70"
              cy="70"
              r="64"
              pathLength="100"
              strokeDasharray={`${ring} 100`}
            />
          </svg>
          <img src={src(badge)} alt="" />
          {earned && (
            <span className="bdg-check" aria-hidden="true">
              <Icon name="check" size={18} stroke={3} />
            </span>
          )}
          {badge.state === 'unavailable' && (
            <span className="bdg-lock" aria-hidden="true">
              <Icon name="lock" size={26} />
            </span>
          )}
        </div>

        <p className="bdg-name">{badge.name}</p>
        <h2 className="bdg-goal">{badge.blurb}</h2>

        {earned && badge.date && <p className="bdg-on">Completed on {badge.date}</p>}

        {/* `.overlay-goal-progress-data-number` — the pill goes green once the
            figure has reached the requirement. */}
        {badge.need != null && (
          <span className="bdg-progress">
            <Pill color={earned ? '#087542' : '#656565'} variant="soft" size="md">
              <strong>{(earned ? badge.need : (badge.have ?? 0)).toLocaleString()}</strong>
              {` / ${badge.need.toLocaleString()} ${badge.unit}`}
            </Pill>
          </span>
        )}

        {badge.state === 'bingo' && (
          <span className="bdg-progress">
            <Pill color="#087542" variant="soft" size="md">
              In a bingo
            </Pill>
          </span>
        )}
        {badge.state === 'unavailable' && (
          <span className="bdg-progress">
            <Pill color="#656565" variant="soft" size="md">
              Not open yet
            </Pill>
          </span>
        )}
        {badge.required && (
          <span className="bdg-progress">
            <Pill color="#1A6DD5" variant="soft" size="md">
              Required
            </Pill>
          </span>
        )}

        {/* `earnables/_earnable_learning_track_more_activities` — an activity
            badge *is* its activities, so the modal lists them and lets you
            tick them off. The app's own heading and order. */}
        {badge.about && <p className="bdg-about">{badge.about}</p>}
        {badge.activities?.length > 0 && (
          <div className="bdg-acts">
            <h3>Activities</h3>
            <ul>
              {badge.activities.map((a) => (
                <Activity
                  key={a.id}
                  activity={a}
                  done={done.has(a.id)}
                  onToggle={() => onToggleActivity?.(badge, a)}
                />
              ))}
            </ul>
          </div>
        )}

        {/* `.badge-attributes` — what else this badge pays out, between rules. */}
        {gets.length > 0 && (
          <ul className="bdg-gets">
            {gets.map((g) => (
              <li key={g.label}>
                <span className={`bdg-gets-icon bdg-gets-icon--${g.kind}`}>
                  <Icon name={g.icon} size={24} />
                </span>
                <span className="bdg-gets-text">
                  <strong>{g.label}</strong>
                  <span>{g.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* `.log-footer-button` — the app only offers it where there is still
          something to do and the challenge is running. */}
      <div className="modal-footer">
        {/* Close is the primary either way: the modal is somewhere you came to
            look, and logging is a detour from it rather than the point. */}
        {!earned && onLog && (
          <Button variant="secondary" onClick={() => onLog(badge)}>
            {logLabel ?? 'Log Reading'}
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  )
}
