import { Icon } from '@components/Icon/Icon'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { Button } from '@components/Button/Button'
import { StatCard } from '@components/Cards/Cards'
import '@components/Cards/Cards.css'
import { BookCard } from './BookCard'
import { getBook, getSessions, SHELF_STATUS, SHELF_ORDER } from '../data'

function readingPct(book) {
  const s = getSessions(book.id).find((x) => x.toPage)
  if (!s || !book.pageCount) return null
  return Math.min(100, Math.round((s.toPage / book.pageCount) * 100))
}

export function MyShelf({ shelf, onOpen, onWish, onDiscover }) {
  const ids = Object.keys(shelf)
  const finished = ids.filter((id) => shelf[id] === 'finished').length
  const reading = ids.filter((id) => shelf[id] === 'reading').length

  if (ids.length === 0) {
    return (
      <div className="bk-shelfpage">
        <div className="bk-shelf-empty">
          <span className="bk-shelf-empty-icon">
            <Icon name="bookmark" size={30} />
          </span>
          <h2>Your shelf is empty</h2>
          <p>Tap the bookmark on any book to save it here — to read now or later.</p>
          <Button variant="primary" onClick={onDiscover}>
            Browse Discover
          </Button>
        </div>
      </div>
    )
  }

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

      {SHELF_ORDER.map((statusId) => {
        const books = ids
          .filter((id) => shelf[id] === statusId)
          .map(getBook)
          .filter(Boolean)
        if (books.length === 0) return null
        const meta = SHELF_STATUS[statusId]
        return (
          <section key={statusId} className="bk-shelfgroup">
            <h2 className="bk-shelfgroup-head" style={{ '--c': meta.color }}>
              <span className="bk-shelfgroup-icon">
                <Icon name={meta.icon} size={17} />
              </span>
              {meta.label}
              <span className="bk-shelfgroup-count">{books.length}</span>
            </h2>
            <div className="bk-shelfgrid">
              {books.map((b) => {
                const pct = statusId === 'reading' ? readingPct(b) : null
                return (
                  <div key={b.id} className="bk-shelfitem">
                    <BookCard book={b} onOpen={onOpen} onWish={onWish} wished />
                    {pct != null && (
                      <div className="bk-shelfprog" title={`${pct}% read`}>
                        <div className="bk-readlog-pbar">
                          <span style={{ width: `${pct}%` }} />
                        </div>
                        <span className="bk-shelfprog-text">{pct}%</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
