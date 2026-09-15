import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Modal, ModalFullBack, ModalFullClose } from '@components/Modal/Modal'
import { ActivityList } from '@components/ActivityList/ActivityList'
import { BadgeModal } from '@components/BadgeModal/BadgeModal'
import { EmptyState } from '@components/Primitives/Primitives'

import './CompleteActivity.css'
import '@components/Button/Button.css'
import '@components/Modal/Modal.css'
import '@components/ActivityList/ActivityList.css'
import '@components/Primitives/Primitives.css'

/**
 * **Complete Activity** — `logged_books#activities`, the second thing the
 * reader's top bar offers after Log Reading.
 *
 * An activity badge is a `LearningTrack`, and you earn it by doing the
 * activities under it. This is where you say you have: the app opens it on the
 * same full-screen logger surface Log Reading uses, and it is two steps.
 *
 *   1. **Choose an activity badge** — `logged_books/_learning_track`: the
 *      badge's art ringed with how far along it is, its name, what it takes,
 *      the dates it runs between, and how many of its activities are done.
 *   2. **Its activities** — the same list the badge's own modal shows.
 *
 * The app skips the first step where the reader has only one
 * (`@learning_tracks.size == 1`), because a list of one is a question with one
 * answer. Back at each step, and the surface closes when you're done.
 *
 *   <CompleteActivity
 *     open={open}
 *     badges={activityBadges}
 *     src={(b) => badgeSrc(b.set, b.art)}
 *     completed={done}
 *     onToggle={(badge, activity) => tick(badge, activity)}
 *     onClose={close}
 *   />
 *
 * `label` is `display_singular_learning_track_label` — a site can call these
 * something other than an activity badge, and every heading follows.
 */
export function CompleteActivity({
  open,
  badges = [],
  src,
  completed,
  onToggle,
  onClose,
  label = 'Activity Badge',
}) {
  // Which badge is open. A reader with one goes straight to it, and there is no
  // list to go back to.
  const only = badges.length === 1 ? badges[0] : null
  const [picked, setPicked] = useState(null)
  // The badge the last tick earned, if it earned one.
  const [earned, setEarned] = useState(null)
  const badge = picked ?? only

  function close() {
    setPicked(null)
    onClose?.()
  }

  /* A learning track *is* its activities, so the tick that finishes the last of
     them is the moment the badge is earned. The app marks that with the badge's
     own modal rather than by quietly moving a counter. */
  function toggle(b, activity) {
    const before = progress(b, completed)
    const wasDone = (completed ?? new Set()).has(activity.id)
    onToggle?.(b, activity)
    if (!wasDone && before.total > 0 && before.done + 1 >= before.total) {
      setEarned({ ...b, locked: false, have: b.need ?? before.total })
    }
  }

  return (
    <>
      <Modal open={open} onClose={close} variant="full" ariaLabel="Complete an activity">
        {/* The surface's own back arrow, beside its close — the same pair the
            logging flow uses, rather than a link inside the page. */}
        {badge && !only && (
          <ModalFullBack onClick={() => setPicked(null)} label="All activity badges" />
        )}
        <ModalFullClose onClick={close} />
        <div className="modal-full-panel">
          <div className="ca">
            {badge ? (
              <BadgeStep
                badge={badge}
                completed={completed}
                onToggle={toggle}
                onClose={close}
                onAnother={only ? null : () => setPicked(null)}
              />
            ) : (
              <ChooseStep
                badges={badges}
                src={src}
                completed={completed}
                onPick={setPicked}
                label={label}
              />
            )}
          </div>
        </div>
      </Modal>

      {/* Over the flow, so closing it puts you back on the badge you finished. */}
      <BadgeModal
        badge={earned}
        src={src}
        confetti
        /* The live set, not the fixture's — every activity under a badge you
           have just earned is done by definition. */
        completed={completed}
        open={Boolean(earned)}
        onClose={() => setEarned(null)}
      />
    </>
  )
}

/** How many of a badge's activities are done, and how many there are. */
function progress(badge, completed) {
  // A repeatable track keeps a count rather than a tick, so the badge's own
  // figure is the number — one activity done twice is not "0 of 1".
  if (badge.repeatable) return { done: badge.have ?? 0, total: badge.need ?? 0 }
  const total = badge.activities?.length ?? 0
  if (total === 0) return { done: badge.have ?? 0, total: badge.need ?? 0 }
  const set = completed ?? new Set((badge.activities ?? []).filter((a) => a.done).map((a) => a.id))
  return { done: badge.activities.filter((a) => set.has(a.id)).length, total }
}

/**
 * Step one — `logged_books/_learning_track`. One row per badge: its art ringed
 * with how far along it is, what it is, and the count.
 */
function ChooseStep({ badges, src, completed, onPick, label }) {
  // Grouped by challenge, in the order the badges arrive — a reader's own
  // challenge order, not alphabetical.
  const groups = []
  for (const b of badges) {
    const key = b.challenge ?? null
    const group = groups.find(([k]) => k === key)
    if (group) group[1].push(b)
    else groups.push([key, [b]])
  }

  return (
    <>
      <header className="ca-head">
        <h1 className="ca-title">Choose {aOrAn(label)}</h1>
        <p className="ca-sub">Every one of these is earned by doing the activities under it.</p>
      </header>

      {badges.length === 0 ? (
        <EmptyState
          variant="dashed"
          icon={<Icon name="checklist" size={26} />}
          title="Nothing to complete"
          description="No challenge you're in has activities to do right now."
        />
      ) : (
        groups.map(([challenge, inChallenge]) => (
          <section className="ca-group" key={challenge ?? 'all'}>
            {/* The challenge each badge belongs to. A reader in three challenges
                has tracks from all three in one list, and which one a badge is
                for is the first thing you need to know about one you didn't go
                looking for. Only where there is more than one to tell apart. */}
            {challenge && groups.length > 1 && <h2 className="ca-group-head">{challenge}</h2>}
            <ul className="ca-tracks">
              {inChallenge.map((b) => {
                const { done, total } = progress(b, completed)
                const complete = total > 0 && done >= total
                return (
                  <li key={b.name}>
                    <button type="button" className="ca-track" onClick={() => onPick(b)}>
                      <span className="ca-track-art">
                        {/* The app rings the badge with how far along it is, and
                        shows the earned art once it is done. */}
                        <svg className="ca-ring" viewBox="0 0 100 100" aria-hidden="true">
                          <circle className="ca-ring-track" cx="50" cy="50" r="46" />
                          <circle
                            className="ca-ring-fill"
                            cx="50"
                            cy="50"
                            r="46"
                            pathLength="100"
                            strokeDasharray={`${total ? Math.round((done / total) * 100) : 0} 100`}
                          />
                        </svg>
                        <img src={src(b)} alt="" className={complete ? undefined : 'is-todo'} />
                      </span>
                      <span className="ca-track-text">
                        <span className="ca-track-name">{b.name}</span>
                        <span className="ca-track-blurb">{b.blurb}</span>
                        {b.dates && <span className="ca-track-dates">{b.dates}</span>}
                      </span>
                      <span className="ca-track-count">
                        <strong>
                          {done} of {total}
                        </strong>
                        {total === 1 ? ' Activity' : ' Activities'}
                      </span>
                      <Icon name="chevron-right" size={20} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))
      )}
    </>
  )
}

/** Step two — the badge, and the activities under it. */
function BadgeStep({ badge, completed, onToggle, onClose, onAnother }) {
  const { done, total } = progress(badge, completed)

  return (
    <>
      {/* No art here: the list you just came from showed it, and at 72px in
          grey it was the biggest thing on a screen that is about the activities
          under it. */}
      <header className="ca-badgehead">
        <h1 className="ca-title">{badge.name}</h1>
        <p className="ca-sub">{badge.blurb}</p>
        <p className="ca-count">
          <strong>
            {done} of {total}
          </strong>
          {total === 1 ? ' Activity' : ' Activities'} done
        </p>
      </header>

      {badge.about && <p className="ca-about">{badge.about}</p>}

      {badge.activities?.length > 0 ? (
        <ActivityList
          activities={badge.activities}
          done={completed}
          onToggle={(a) => onToggle?.(badge, a)}
          heading={null}
        />
      ) : (
        <EmptyState
          variant="dashed"
          icon={<Icon name="checklist" size={26} />}
          title="Nothing to tick off here"
          description="This one is earned by reading rather than by completing activities."
        />
      )}

      {/* Closing the surface is the common end of this, so it leads; going back
          for another badge is the other thing you might do, and the top-left
          arrow is the same trip for anyone who reaches for that first. */}
      <div className="ca-foot">
        {onAnother && (
          <Button variant="secondary" onClick={onAnother}>
            Complete Another
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </div>
    </>
  )
}

/** "an Activity Badge", "a Quest" — whichever word the site uses. */
function aOrAn(word) {
  return `${/^[aeiou]/i.test(word) ? 'an' : 'a'} ${word}`
}
