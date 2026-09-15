import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { StatCard } from '@components/Cards/Cards'
import { BookCover } from '@components/BookCover/BookCover'
import { EmptyState } from '@components/Primitives/Primitives'
import '@components/Primitives/Primitives.css'
import '@components/Cards/Cards.css'
import '@components/Tabs/Tabs.css'
import { getBook, getSessions, SHELF_STATUS, SHELF_ORDER } from '../data'

function readingPct(book) {
  const s = getSessions(book.id).find((x) => x.toPage)
  if (!s || !book.pageCount) return null
  return Math.min(100, Math.round((s.toPage / book.pageCount) * 100))
}

/**
 * My Shelf — everything the reader has saved, on the shelf the Reading Log's
 * "All Titles" is: the numbers across the top, one control that says what you
 * are looking at, and then jackets grouped under a ruled label.
 *
 * It used to be a grid of catalog cards — each with its own rating, its format
 * glyphs and a caption — which is the right card for a search result and the
 * wrong one for a shelf you already own. On a shelf the cover is the thing, the
 * group heading says the status, and the only per-book control is the one that
 * takes it off again.
 *
 * One filter, because there is one question a reader arrives with — what am I
 * reading, what's next, what have I finished — and it is a segmented control
 * with the counts on it, so half the answer is readable without pressing
 * anything.
 */
export function MyShelf({ shelf, onOpen, onWish, onDiscover }) {
  const [status, setStatus] = useState('all')

  const ids = Object.keys(shelf)
  const books = ids.map(getBook).filter(Boolean)
  const finished = ids.filter((id) => shelf[id] === 'finished').length
  const reading = ids.filter((id) => shelf[id] === 'reading').length

  if (ids.length === 0) {
    return (
      <div className="bk-shelfpage">
        <ReaderPageHead title="My Shelf" />
        <EmptyState
          variant="dashed"
          icon={<Icon name="bookmark" size={26} />}
          title="Your shelf is empty"
          description="Tap the bookmark on any book to save it here — to read now or later."
          action={<Button onClick={onDiscover}>Browse Discover</Button>}
        />
      </div>
    )
  }

  const groups = SHELF_ORDER.filter((id) => status === 'all' || status === id)
    .map((id) => ({ id, meta: SHELF_STATUS[id], books: books.filter((b) => shelf[b.id] === id) }))
    .filter((g) => g.books.length)

  return (
    <div className="bk-shelfpage">
      <ReaderPageHead title="My Shelf" />

      {/* The design system's stat tile, in the row every other reader page puts
          its numbers in — these were three chips of their own shape, wedged
          into the header's actions slot. */}
      <div className="bk-shelfpage-stats">
        <StatCard
          value={ids.length}
          label="On your shelf"
          color="#0D9488"
          icon={<Icon name="bookmark-filled" size={20} />}
        />
        <StatCard
          value={reading}
          label="Reading now"
          color="#1A6DD5"
          icon={<Icon name="book-2" size={20} />}
        />
        <StatCard
          value={finished}
          label="Finished"
          color="#0F7A55"
          icon={<Icon name="circle-check" size={20} />}
        />
      </div>

      {/* Which shelf, as a segmented control rather than a menu: there are
          three of them and the counts are the answer to half the question. */}
      <div className="bk-shelffilters">
        <Tabs
          variant="pill"
          size="md"
          active={status}
          onChange={setStatus}
          ariaLabel="Which books"
          items={[
            { id: 'all', label: 'All', count: ids.length },
            ...SHELF_ORDER.map((id) => ({
              id,
              label: SHELF_STATUS[id].label,
              count: ids.filter((x) => shelf[x] === id).length,
            })),
          ]}
        />
      </div>

      {groups.map((g) => (
        <section key={g.id} className="bk-shelfgroup">
          <h2 className="bk-shelfgroup-head" style={{ '--c': g.meta.color }}>
            <span className="bk-shelfgroup-icon">
              <Icon name={g.meta.icon} size={17} />
            </span>
            {g.meta.label}
            <span className="bk-shelfgroup-count">{g.books.length}</span>
          </h2>
          <ul className="bk-shelfgrid">
            {g.books.map((b) => {
              const pct = g.id === 'reading' ? readingPct(b) : null
              return (
                <li key={b.id} className="bk-shelftile">
                  <button
                    type="button"
                    className="bk-shelftile-hit"
                    onClick={() => onOpen(b.id)}
                    aria-label={`${b.title} by ${b.author}`}
                  >
                    <BookCover book={b} size="fill" />
                  </button>
                  {/* The only control a shelf tile needs: the way back off
                        the shelf. Everything else about the book is one click
                        in, on its own page. */}
                  <button
                    type="button"
                    className="bk-shelftile-off"
                    onClick={() => onWish?.(b.id)}
                    aria-label={`Remove ${b.title} from your shelf`}
                  >
                    <Icon name="bookmark-filled" size={15} />
                  </button>
                  {pct != null && (
                    <div className="bk-shelfprog" title={`${pct}% read`}>
                      <div className="bk-readlog-pbar">
                        <span style={{ width: `${pct}%` }} />
                      </div>
                      <span className="bk-shelfprog-text">{pct}%</span>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
