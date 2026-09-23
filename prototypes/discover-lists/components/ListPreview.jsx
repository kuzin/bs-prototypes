import { Modal } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { EmptyState } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import '@components/Modal/Modal.css'
import '@components/Button/Button.css'
import '@components/Pill/Pill.css'
import '@components/Primitives/Primitives.css'

// The reader's own shelf, not a staff-side drawing of one. A preview that
// isn't the real component is a preview of nothing — this is the same `Shelf`
// the Book Discovery prototype puts on Discover, with its stylesheet.
import { Shelf } from '../../books/components/Shelf'
import '../../books/index.css'

import { resolveBooks } from '../data'
import './ListPreview.css'

/* `wishlist` is a Set on the reader side, and a staff preview has nobody's
   shelf behind it. Module-level, so the shelf isn't handed a new one each
   render. */
const EMPTY_WISHLIST = new Set()

/**
 * "Preview" — what this list looks like on Discover, before readers see it.
 *
 * The real index links out to `new_admin_reading_list_preview_path` in a new
 * tab. Here it's a panel, because the point is to look and come back.
 */
export function ListPreview({ list, onClose }) {
  if (!list) return null
  const shelf = {
    id: list.id,
    title: list.name || 'Untitled list',
    accent: list.accent,
    // A curated list keeps its curator's line on Discover — that is who is
    // speaking. `Shelf` reads it off the same shape the reader fixture uses.
    ...(list.scope === 'class'
      ? { curator: { name: list.ownerName, role: list.ownerWho } }
      : { subtitle: list.description }),
  }
  const books = resolveBooks(list.books)

  return (
    <Modal
      open
      onClose={onClose}
      variant="center"
      ariaLabel="Preview on Discover"
      className="dlv-modal"
      closeBadge
    >
      {({ close }) => (
        <div className="dlv">
          <header className="dlv-head">
            <div className="dlv-headtext">
              <h2 className="dlv-title">On Discover</h2>
            </div>
            {!list.active && (
              <Pill color="#767676" size="sm">
                Hidden — nobody sees it yet
              </Pill>
            )}
          </header>

          <div className="dlv-stage bk-app">
            {books.length ? (
              <Shelf
                shelf={shelf}
                books={books}
                onOpen={() => {}}
                onWish={() => {}}
                wishlist={EMPTY_WISHLIST}
              />
            ) : (
              <EmptyState
                icon={<Icon name="book-2" size={26} />}
                title="Nothing on the shelf yet"
                description="Add a book or two and the shelf appears here."
              />
            )}
          </div>

          <footer className="dlv-foot">
            <Button onClick={close}>Close preview</Button>
          </footer>
        </div>
      )}
    </Modal>
  )
}
