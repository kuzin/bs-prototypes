import { Icon } from '@components/Icon/Icon'
import { Avatar } from '@components/Avatar/Avatar'
import { BookCard } from './BookCard'

// A full-page view of one Discover list — its header + every title in a grid.
export function ListPage({ list, onOpen, onWish, wishlist, onBack }) {
  return (
    <div className="bk-browse-page">
      <div className="bk-backbar">
        <button className="bk-back" onClick={onBack}>
          <Icon name="arrow-left" size={16} /> Discover
        </button>
      </div>

      <div className="bk-listpage-head">
        {list.curator && (
          <Avatar initials={list.curator.initials} color={list.curator.color} size="lg" />
        )}
        <div className="bk-shelfpage-title">
          <h1>{list.title}</h1>
          {list.curator ? (
            <p>
              <Icon name="apple" size={14} /> Curated by {list.curator.name} · {list.curator.role}
            </p>
          ) : (
            list.subtitle && <p>{list.subtitle}</p>
          )}
          <span className="bk-listpage-count">{list.books.length} books</span>
        </div>
      </div>

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
