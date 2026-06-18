import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
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

export function Discover({ onOpen, onWish, wishlist, settings, onBrowse, onPlay, onViewAll }) {
  const [q, setQ] = useState('')
  return (
    <div className="bk-discover">
      <div className="bk-discover-head">
        <div className="bk-shelfpage-title">
          <h1>
            <Icon name="compass" size={24} /> Discover
          </h1>
          <p>
            Find your next favorite book — Benny’s picks, partners, and what your school is reading.
          </p>
        </div>

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
      </div>

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
