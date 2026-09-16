import { BadgeModal } from '@components/BadgeModal/BadgeModal'

const KIND_LABEL = {
  reading: 'Reading Badge',
  activity: 'Activity Badge',
  destination: 'Destination Badge',
}

/**
 * A badge, opened — `earnables/_earnable_modal`, the modal behind every badge
 * the app draws. `fresh` is the one the reader has just earned, which is the
 * only difference between meeting a badge for the first time and looking one up
 * on the Badges tab: the confetti.
 *
 * It was a celebration of its own, on a hand-rolled twelve-piece confetti
 * array. A reader meets this badge again on the Badges tab and the two should
 * be the same object.
 */
export function BadgeCelebration({ badge, open, fresh = false, onClose }) {
  if (!badge) return null

  return (
    <BadgeModal
      /* The app's own order: what kind of badge this is above its name, and
         what it takes under both. */
      badge={{
        name: fresh ? 'Badge earned!' : KIND_LABEL[badge.kind],
        blurb: badge.name,
        about: badge.sub,
        locked: !badge.earned,
      }}
      /* A generated medallion rather than one of Beanstack's own badge
         files, so the modal takes the node instead of a key to look up. */
      art={<img src={badge.art} alt="" />}
      confetti={fresh}
      open={open}
      onClose={onClose}
    />
  )
}
