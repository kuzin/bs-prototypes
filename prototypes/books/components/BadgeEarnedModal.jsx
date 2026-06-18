import { Modal } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { getSessions } from '../data'

// How many minutes a book's badge is worth: the reader's logged minutes for it,
// falling back to a reading-time estimate from the page count.
const badgeMinutes = (book) => {
  const logged = getSessions(book.id).reduce((a, s) => a + s.minutes, 0)
  return logged || Math.max(10, Math.round(book.pageCount / 5) * 5)
}

// Celebration shown the moment a book becomes "finished" — earns its badge.
export function BadgeEarnedModal({ open, onClose, book }) {
  if (!book) return null
  const minutes = badgeMinutes(book)

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Badge earned">
      <div className="bk-badge-modal" style={{ '--c': '#F59E0B' }}>
        <button className="bk-settings-close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={18} />
        </button>

        <div className="bk-badge-burst" aria-hidden="true">
          <Icon name="confetti" size={26} className="bk-badge-confetti bk-badge-confetti--l" />
          <Icon name="confetti" size={20} className="bk-badge-confetti bk-badge-confetti--r" />
          <span className="bk-badge-medal">
            <Icon name="trophy" size={42} color="#fff" />
          </span>
        </div>

        <span className="bk-badge-kicker">Badge earned!</span>
        <h2 className="bk-badge-title">{book.title}</h2>
        <p className="bk-badge-sub">
          Worth <strong>{minutes} minutes</strong> of reading
        </p>

        <Button variant="primary" onClick={onClose} className="bk-badge-cta">
          Keep reading
        </Button>
      </div>
    </Modal>
  )
}
