import { BadgeModal } from '@components/BadgeModal/BadgeModal'
import { AchievementArt } from './AchievementArt'
import { getSessions } from '../data'

// How many minutes a book's badge is worth: the reader's logged minutes for it,
// falling back to a reading-time estimate from the page count.
const badgeMinutes = (book) => {
  const logged = getSessions(book.id).reduce((a, s) => a + s.minutes, 0)
  return logged || Math.max(10, Math.round(book.pageCount / 5) * 5)
}

// A magazine's badge gets the magazine medallion; everything else gets books.
const artFor = (book) => (book.kind === 'magazine' ? 'magazine' : 'books')

/**
 * The badge a finished book earns, the moment it is finished.
 *
 * It is `earnables/_earnable_modal` — the shared `BadgeModal`, the one behind
 * every badge the app draws — rather than a celebration of its own: a reader
 * meets this badge again on their Collections shelf, and the two should be the
 * same object. The medallion, the closed ring with its check and the burst are
 * all the modal's own; what this supplies is the book.
 */
export function BadgeEarnedModal({ open, onClose, book }) {
  if (!book) return null
  const minutes = badgeMinutes(book)

  return (
    <BadgeModal
      /* An achievement leads with what you did and puts the reason under it,
         which is what finishing a book is. */
      badge={{
        name: 'Badge earned!',
        blurb: book.title,
        about: `Worth ${minutes} minutes of reading.`,
      }}
      art={<AchievementArt art={artFor(book)} />}
      confetti
      open={open}
      onClose={onClose}
    />
  )
}
