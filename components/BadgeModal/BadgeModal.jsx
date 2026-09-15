import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { ActivityList } from '@components/ActivityList/ActivityList'
import { Confetti } from '@components/Confetti/Confetti'

import './BadgeModal.css'
import '@components/Button/Button.css'
import '@components/Pill/Pill.css'
import '@components/Modal/Modal.css'
import '@components/ActivityList/ActivityList.css'
import '@components/Confetti/Confetti.css'

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
 * An **achievement** is the same modal with a drawn medallion instead of a
 * badge file and a burst of confetti — `art` takes the node, `confetti` fires
 * it. One modal behind both, because to a reader they are the same object:
 * a round thing you earned, with a date and a line about why.
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
export function BadgeModal({
  badge,
  src,
  art,
  confetti = false,
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
      {/* Something you have already earned is worth a moment — the burst is
          one-shot and stops on its own. */}
      {confetti && earned && <Confetti count={18} distance={360} />}
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
          {/* `art` is a drawn medallion rather than a file — what an
              achievement has instead of a badge image. */}
          {art ?? <img src={src(badge)} alt="" />}
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

        {badge.name && <p className="bdg-name">{badge.name}</p>}
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
            <ActivityList
              activities={badge.activities}
              done={done}
              onToggle={(a) => onToggleActivity?.(badge, a)}
            />
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
