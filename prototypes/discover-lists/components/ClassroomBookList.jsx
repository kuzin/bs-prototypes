import { useState } from 'react'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { Button } from '@components/Button/Button'
import { EmptyState } from '@components/Primitives/Primitives'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { BookCover } from '@components/BookCover/BookCover'
import { Icon } from '@components/Icon/Icon'
import '@components/SectionCard/SectionCard.css'
import '@components/Button/Button.css'
import '@components/RowAction/RowAction.css'
import '@components/BookCover/BookCover.css'
import '@components/Primitives/Primitives.css'

import { MAX_BOOKS, isFull, resolveBooks } from '../data'
import { BookPicker } from './BookPicker'

/**
 * A classroom's Book List, on the classroom's own page.
 *
 * A teacher keeps one list per class — which class a reader is in decides which
 * list they see on Discover — so it belongs beside that class's roster, not in
 * the site-wide Book Lists screen a media specialist works in.
 *
 * And curating is all a teacher does to it. There is no form here: the list's
 * name, its grade and where it falls on Discover come from the class and from
 * the media specialist's order. A teacher puts books on it and takes books off,
 * from here or from the Recommendations tab beside it — which is the shelf they
 * are already reading when they decide a book belongs to the class.
 */
export function ClassroomBookList({ classroom, list, onChange, onCreate, onPreview }) {
  const [picking, setPicking] = useState(false)
  const books = list ? resolveBooks(list.books) : []

  function add(id) {
    if (list) onChange({ ...list, books: [...list.books, id] })
    else onCreate(classroom, [id])
  }

  const set = (patch) => onChange({ ...list, ...patch })

  return (
    <div className="dl-classtab">
      <SectionCard
        header="divider"
        className="dl-card dl-card--books"
        title={
          <>
            Books on this list{' '}
            <span className="dl-count">
              {books.length} / {MAX_BOOKS}
            </span>
          </>
        }
        actions={
          <>
            {list && (
              <Button variant="secondary" size="sm" onClick={() => onPreview(list.id)}>
                Preview
              </Button>
            )}
            <Button size="sm" disabled={isFull(list)} onClick={() => setPicking(true)}>
              Add a book
            </Button>
          </>
        }
      >
        {books.length ? (
          <ul className="dl-books">
            {books.map((b, i) => (
              <li key={b.id} className="dl-book">
                <BookCover book={b} size="sm" />
                <div className="dl-book-text">
                  <span className="dl-book-title">{b.title}</span>
                  <span className="dl-book-author">{b.author}</span>
                </div>
                <RowActions>
                  <RowAction
                    icon="chevron-up"
                    label="Move up"
                    disabled={i === 0}
                    onClick={() => set({ books: move(list.books, i, -1) })}
                  />
                  <RowAction
                    icon="chevron-down"
                    label="Move down"
                    disabled={i === books.length - 1}
                    onClick={() => set({ books: move(list.books, i, 1) })}
                  />
                  <RowAction
                    icon="trash"
                    label="Take off the list"
                    onClick={() => set({ books: list.books.filter((id) => id !== b.id) })}
                  />
                </RowActions>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<Icon name="book-2" size={26} />}
            title="Nothing on the shelf yet"
            description="Add a book here, or send one over from Recommendations — the shelf appears on Discover as soon as it has something on it."
            action={<Button onClick={() => setPicking(true)}>Add a book</Button>}
          />
        )}
      </SectionCard>

      <BookPicker
        open={picking}
        onClose={() => setPicking(false)}
        onAdd={add}
        already={list?.books ?? []}
      />
    </div>
  )
}

/** Swap a book with its neighbour. The order is the order on the shelf. */
function move(ids, i, dir) {
  const next = [...ids]
  const j = i + dir
  if (j < 0 || j >= next.length) return next
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}
