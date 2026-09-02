import { useMemo, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { EmptyState } from '@components/Primitives/Primitives'
import '@components/Tabs/Tabs.css'
import '@components/SearchInput/SearchInput.css'
import '@components/Primitives/Primitives.css'

import { BOOKS, wordByName } from '../data'
import './MyWords.css'

// The personal vocabulary collection — the brief's "growing personal record of
// unlocked words, analogous to a reading log". It's the Words pane of the
// Collections tab, so it owns no page header: <Collections> supplies the title
// and the sub-tab strip.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function prettyDate(iso) {
  const [, m, d] = iso.split('-')
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`
}

/** One collected word. `isNew` gives the word just banked a moment of its own. */
export function WordTile({ entry, isNew }) {
  const word = wordByName(entry.word)
  const book = entry.bookId ? BOOKS[entry.bookId] : null
  if (!word) return null
  return (
    <article className={`mw-tile${isNew ? ' is-new' : ''}`}>
      <header className="mw-tile-head">
        <h3 className="mw-tile-word">{word.word}</h3>
        {isNew && <span className="mw-tile-new">New</span>}
      </header>
      <p className="mw-tile-say">
        {word.say} <span className="mw-tile-part">· {word.part}</span>
      </p>
      <p className="mw-tile-meaning">{word.meaning}</p>
      <footer className="mw-tile-foot">
        <span className="mw-tile-from">
          <Icon name="book" size={13} />
          <span className="mw-tile-from-name">{book ? book.title : 'A book you logged'}</span>
        </span>
        <span className="mw-tile-date">{prettyDate(entry.date)}</span>
      </footer>
    </article>
  )
}

/** Collected words grouped under the book they came from. */
function ByBook({ entries, newestWord }) {
  const groups = useMemo(() => {
    const map = new Map()
    entries.forEach((e) => {
      const key = e.bookId ?? '_other'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(e)
    })
    return [...map.entries()]
  }, [entries])

  return (
    <div className="mw-groups">
      {groups.map(([bookId, rows]) => {
        const book = bookId === '_other' ? null : BOOKS[bookId]
        const cover = book?.cover ?? ['#a78bfa', '#7c3aed']
        return (
          <section key={bookId} className="mw-group">
            <header className="mw-group-head">
              <span
                className="mw-group-cover"
                style={{ background: `linear-gradient(150deg, ${cover[0]}, ${cover[1]})` }}
                aria-hidden="true"
              />
              <div className="mw-group-titles">
                <h3 className="mw-group-title">{book ? book.title : 'Other books you logged'}</h3>
                {book && <p className="mw-group-author">{book.author}</p>}
              </div>
              <span className="mw-group-count">
                {rows.length} {rows.length === 1 ? 'word' : 'words'}
              </span>
            </header>
            <div className="mw-grid">
              {rows.map((e) => (
                <WordTile key={e.word} entry={e} isNew={e.word === newestWord} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export function MyWords({ collection, newestWord }) {
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')

  // Newest first — a collection reads like a log, most recent at the top.
  const ordered = useMemo(() => [...collection].reverse(), [collection])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ordered
    return ordered.filter((e) => {
      const word = wordByName(e.word)
      const book = e.bookId ? BOOKS[e.bookId] : null
      return (
        e.word.toLowerCase().includes(q) ||
        (word?.meaning ?? '').toLowerCase().includes(q) ||
        (book?.title ?? '').toLowerCase().includes(q)
      )
    })
  }, [ordered, query])

  const thisWeek = collection.filter((e) => e.date >= '2026-06-20').length
  const firstTry = collection.length
    ? Math.round((collection.filter((e) => e.firstTry).length / collection.length) * 100)
    : 0
  const books = new Set(collection.filter((e) => e.bookId).map((e) => e.bookId)).size

  return (
    <div className="mw">
      <div className="mw-stats">
        {[
          { label: 'Words collected', value: collection.length, icon: 'vocabulary' },
          { label: 'This week', value: thisWeek, icon: 'calendar-event' },
          { label: 'Books they came from', value: books, icon: 'book' },
          { label: 'Right on the first try', value: `${firstTry}%`, icon: 'check' },
        ].map((s) => (
          <div key={s.label} className="mw-stat">
            <span className="mw-stat-ic">
              <Icon name={s.icon} size={16} />
            </span>
            <span className="mw-stat-val">{s.value}</span>
            <span className="mw-stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mw-toolbar">
        <Tabs
          variant="pill"
          size="sm"
          active={tab}
          onChange={setTab}
          ariaLabel="How to group your words"
          items={[
            { id: 'all', label: 'All words', count: collection.length },
            { id: 'book', label: 'By book' },
          ]}
        />
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search your words…"
          ariaLabel="Search your collected words"
          className="mw-search"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          variant="dashed"
          icon={<Icon name="search" size={26} />}
          title="No words match that"
          description={`Nothing in your collection matches “${query}”.`}
        />
      ) : tab === 'book' && !query ? (
        <ByBook entries={ordered} newestWord={newestWord} />
      ) : (
        <div className="mw-grid">
          {filtered.map((e) => (
            <WordTile key={e.word} entry={e} isNew={e.word === newestWord} />
          ))}
        </div>
      )}
    </div>
  )
}
