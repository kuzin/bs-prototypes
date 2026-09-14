import { Icon } from '@components/Icon/Icon'
import { BackBar } from '@components/BackBar/BackBar'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { BookCard } from './BookCard'

// A full-page view of one Discover list — its header + every title in a grid.
export function ListPage({ list, onOpen, onWish, wishlist, onBack }) {
  return (
    <div className="bk-browse-page">
      <BackBar label="Discover" onClick={onBack} />

      {/* The curator is the one thing this page's header carries that the
          others don't — who picked the list is the point of it. */}
      <ReaderPageHead
        title={list.title}
        count={
          list.curator ? (
            <span className="bk-listpage-curator">
              <Icon name="apple" size={14} /> Curated by {list.curator.name} · {list.curator.role}
            </span>
          ) : (
            list.subtitle
          )
        }
      />

      <div className="bk-results-grid">
        {list.books.map((b) => (
          <BookCard
            key={b.id}
            book={b}
            onOpen={onOpen}
            onWish={onWish}
            wished={wishlist.has(b.id)}
          />
        ))}
      </div>
    </div>
  )
}
