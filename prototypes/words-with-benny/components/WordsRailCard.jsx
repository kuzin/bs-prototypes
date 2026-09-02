import { Icon } from '@components/Icon/Icon'

import { UNLOCK_EVERY } from '../data'
import './WordsRailCard.css'

/**
 * The collection's front door on the challenges page — recent words, how far
 * off the next one is, and a way in. Injected into logging-flow's dashboard
 * rail via its `railTop` slot, so it borrows that page's `.wa-card` shell and
 * only styles its own internals.
 */
export function WordsRailCard({ collection, logsSinceWord, onOpen }) {
  const recent = [...collection].slice(-3).reverse()
  const toGo = Math.max(0, UNLOCK_EVERY - logsSinceWord)
  return (
    <aside className="wa-card wb-rail">
      <div className="wb-rail-head">
        <span className="wb-rail-ic">
          <Icon name="vocabulary" size={17} />
        </span>
        <div className="wb-rail-titles">
          <span className="wb-rail-title">My Words</span>
          <span className="wb-rail-count">{collection.length} collected</span>
        </div>
      </div>
      <ul className="wb-rail-list">
        {recent.map((e) => (
          <li key={e.word} className="wb-rail-word">
            {e.word}
          </li>
        ))}
      </ul>
      <p className="wb-rail-next">
        <img src="/bs-prototypes/benny-happy.svg" alt="" className="wb-rail-benny" />
        {toGo <= 1
          ? 'A new word is waiting on your next log.'
          : `${toGo} more logs and I’ll have another word.`}
      </p>
      <button className="wb-rail-more" onClick={onOpen}>
        See all my words
      </button>
    </aside>
  )
}
