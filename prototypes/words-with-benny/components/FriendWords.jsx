import { useMemo } from 'react'
import { Icon } from '@components/Icon/Icon'
import { StatCard } from '@components/Cards/Cards'
import { EmptyState } from '@components/Primitives/Primitives'
import { ShelfHead } from '@components/CollectionShelf/CollectionShelf'
import '@components/Cards/Cards.css'
import '@components/Primitives/Primitives.css'

import { WordTile } from './MyWords'
import { collectionForReader } from '../data'
import './FriendWords.css'

// How many of a friend's words the tab shows before the rest are folded away.
// A profile is a look at somebody, not their whole filing cabinet — the app's
// own Reading Log tab shows three titles and puts the rest behind a button.
const PREVIEW = 9

/**
 * **Words** — a friend's vocabulary, on their profile beside their badges.
 *
 * Words are a collectible in this prototype the way badges and achievements
 * are everywhere else, so the tab is built the way the modal's other tabs are:
 * the app's Statistics block first, then the things themselves. The things are
 * `WordTile`s — the same card the reader's own collection is made of, so a word
 * looks like a word wherever you meet one.
 *
 * What it deliberately doesn't carry is the review state. The coloured dot on a
 * tile says where a word sits in *your* deck, and how well somebody else
 * remembers their words is not something their profile should report — so
 * `card` is left off and the tiles come back plain.
 */
export function FriendWords({ friend }) {
  const collection = useMemo(() => collectionForReader(friend.id), [friend.id])

  if (collection.length === 0) {
    return (
      <EmptyState
        variant="dashed"
        icon={<Icon name="vocabulary" size={26} />}
        title="No words to show"
        description={`${friend.name} hasn't collected any words yet.`}
      />
    )
  }

  // Newest first, the way a collection reads everywhere else.
  const ordered = [...collection].reverse()
  const books = new Set(collection.filter((e) => e.bookId).map((e) => e.bookId)).size
  const week = collection.filter((e) => e.date >= '2026-06-20').length

  return (
    <>
      <ShelfHead as="h3" title="Words collected" />
      <div className="fw-stats">
        {/* No icons on these three. The modal is a 480px column, so a 40px
            glyph takes half the tile and leaves the label wrapping to three
            lines — the tiles on the Overview tab can afford one because they
            are full-width rows. */}
        <StatCard value={collection.length} label="Words collected" color="#5B21B6" />
        <StatCard value={week} label="Collected this week" color="#0B6B78" />
        <StatCard value={books} label="Books they came from" color="#1A6DD5" />
      </div>

      <div className="fw-grid">
        {ordered.slice(0, PREVIEW).map((entry) => (
          <WordTile key={entry.word} entry={entry} />
        ))}
      </div>

      {ordered.length > PREVIEW && (
        <p className="fw-more">
          …and {ordered.length - PREVIEW} more, collected since {friend.name.split(' ')[0]} started
          logging.
        </p>
      )}
    </>
  )
}
