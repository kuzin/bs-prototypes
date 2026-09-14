import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { Shelf } from './Shelf'
import { AskBenny } from './AskBenny'
import { READER, BENNY_PICKS, SHELVES, BROWSE, getBooks } from '../data'

// The Benny recommendation row is a normal shelf with a sparkles icon badge.
const BENNY_SHELF = {
  id: 'benny',
  icon: 'sparkles',
  accent: '#0D9488',
  title: 'Benny’s Picks',
  subtitle: (
    <>
      Because you loved <strong>{READER.justFinished}</strong>
    </>
  ),
}

// Each toggleable feature gates one Discover shelf.
const SHELF_SETTING = { sora: 'sora', scholastic: 'scholastic', audio: 'audiobooks' }

export function Discover({
  onOpen,
  onWish,
  wishlist,
  settings,
  onBrowse,
  onPlay,
  onViewAll,
  onSettings,
}) {
  const [q, setQ] = useState('')
  return (
    <div className="bk-discover">
      {/* The one page header every view in the web app uses. */}
      <ReaderPageHead
        title="Discover"
        actions={
          <>
            {/* Catalog search — opens the filterable Browse page */}
            <form
              className="bk-search-entry"
              onSubmit={(e) => {
                e.preventDefault()
                onBrowse({ query: q })
              }}
            >
              <Icon name="search" size={18} />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search books, authors…"
                aria-label="Search books and authors"
              />
              <button type="submit" className="bk-search-go">
                Search
              </button>
            </form>
            <button
              type="button"
              className="bk-sources-btn"
              onClick={onSettings}
              aria-label="Which reading apps to show"
            >
              <Icon name="settings" size={18} />
            </button>
          </>
        }
      />

      <AskBenny onOpen={onOpen} onWish={onWish} wishlist={wishlist} />

      {/* Benny recommendation row — same shelf anatomy as every other row */}
      <Shelf
        shelf={BENNY_SHELF}
        books={getBooks(BENNY_PICKS)}
        onOpen={onOpen}
        onWish={onWish}
        wishlist={wishlist}
        onPlay={onPlay}
        onViewAll={onViewAll}
      />

      {SHELVES.filter((shelf) => {
        const key = SHELF_SETTING[shelf.id]
        return !key || settings[key]
      }).map((shelf) => (
        <Shelf
          key={shelf.id}
          shelf={shelf}
          books={getBooks(shelf.books)}
          onOpen={onOpen}
          onWish={onWish}
          wishlist={wishlist}
          onPlay={onPlay}
          onViewAll={onViewAll}
        />
      ))}

      {/* Browse by category — each tile opens Browse with that filter applied */}
      <section className="bk-browse">
        <h2 className="bk-browse-title">Browse by category</h2>
        <div className="bk-browse-grid">
          {BROWSE.map((b) => (
            <button
              key={b.label}
              className="bk-browse-tile"
              style={{ '--c': b.color }}
              onClick={() => onBrowse({ filter: b.filter })}
            >
              <Icon name={b.icon} size={22} />
              <span>{b.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
