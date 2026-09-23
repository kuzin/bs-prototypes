import { useState } from 'react'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { BackBar } from '@components/BackBar/BackBar'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { Field, Input, Textarea, Select, MultiSelect } from '@components/Form/Form'
import { Button } from '@components/Button/Button'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { BookCover } from '@components/BookCover/BookCover'
import { EmptyState, Banner } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import '@components/SectionCard/SectionCard.css'
import '@components/Form/Form.css'
import '@components/Button/Button.css'
import '@components/RowAction/RowAction.css'
import '@components/BookCover/BookCover.css'
import '@components/Primitives/Primitives.css'

import {
  GRADE_LEVELS,
  GENRE_OPTIONS,
  MAX_BOOKS,
  isFull,
  resolveBooks,
  listErrors,
  canEdit,
} from '../data'
import { BookPicker } from './BookPicker'

/**
 * One list: what the real Book List form asks for, and the books on it.
 *
 * The app splits these across two screens — the form
 * (`new_admin/reading_lists/edit`) and a separate "Add/Remove Books" editor
 * (`reading_list_editor`). They are one page here because a list is its books:
 * on the real pair you named a list, saved, went back to the index and clicked
 * a second button before you could put anything in it.
 *
 * The chunks and their headings are the app's own — Book List Details, the
 * image, Reading List Information — minus the upload, which a prototype can't
 * honestly fake, and which the shelf on Discover doesn't use.
 */
export function ListEditor({
  role,
  list,
  onChange,
  onDone,
  onDelete,
  onPreview,
  embedded = false,
}) {
  const [picking, setPicking] = useState(false)
  const [touched, setTouched] = useState(false)
  const readOnly = !canEdit(role, list)
  const errors = listErrors(list)
  const showErr = (k) => (touched ? errors[k] : undefined)
  const books = resolveBooks(list.books)

  const set = (patch) => onChange({ ...list, ...patch })

  function save() {
    setTouched(true)
    if (Object.keys(errors).length) return
    onDone()
  }

  return (
    <>
      {!embedded && <BackBar label="Back to Book Lists" onClick={onDone} />}

      {/* No subtitle: the instructional half told an editor what a form already
          shows, and the read-only half repeated the banner underneath it. */}
      <PageHeader
        title={list.name || 'New book list'}
        actions={
          <>
            <Button variant="secondary" onClick={() => onPreview(list.id)}>
              Preview
            </Button>
            {!readOnly && !embedded && <Button onClick={save}>Save list</Button>}
          </>
        }
      />

      {readOnly && (
        <Banner level="info" className="dl-rolenote">
          Site-wide lists are built by your media specialist. Make your own from Book Lists.
        </Banner>
      )}

      <div className="dl-editor">
        <SectionCard header="divider" title="Book List Details" className="dl-card">
          <Field label="Title" required error={showErr('name')}>
            <Input
              value={list.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Graphic Novels We Love"
              maxLength={100}
              disabled={readOnly}
            />
          </Field>

          <Field label="Description">
            <Textarea
              rows={3}
              value={list.description}
              onChange={(e) => set({ description: e.target.value })}
              placeholder="Say what the list is for, in a sentence."
              disabled={readOnly}
            />
          </Field>
        </SectionCard>

        <SectionCard header="divider" title="Who it’s for" className="dl-card">
          <Field label="Suggested grade levels" required error={showErr('grades')}>
            <MultiSelect
              options={GRADE_LEVELS.map((g) => ({ value: g, label: g }))}
              value={list.grades}
              onChange={(v) => set({ grades: v })}
              placeholder="Pick grade levels…"
              disabled={readOnly}
            />
          </Field>

          <Field label="Genres">
            <MultiSelect
              options={GENRE_OPTIONS.map((g) => ({ value: g, label: g }))}
              value={list.genres}
              onChange={(v) => set({ genres: v })}
              placeholder="Pick genres…"
              disabled={readOnly}
            />
          </Field>

          <Field label="Searchable keywords">
            <Input
              value={list.keywords}
              onChange={(e) => set({ keywords: e.target.value })}
              placeholder="summer, award winners, read aloud"
              disabled={readOnly}
            />
          </Field>
        </SectionCard>

        {/* The second half of the app's pair, folded in. */}
        <SectionCard
          header="divider"
          className="dl-card dl-card--books"
          title={
            <>
              Books on this list{' '}
              <span className="dl-count">
                {list.books.length} / {MAX_BOOKS}
              </span>
            </>
          }
          actions={
            !readOnly && (
              <Button disabled={isFull(list)} onClick={() => setPicking(true)}>
                Add a book
              </Button>
            )
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
                  {!readOnly && (
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
                        label="Remove from list"
                        onClick={() => set({ books: list.books.filter((id) => id !== b.id) })}
                      />
                    </RowActions>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<Icon name="book-2" size={26} />}
              title="No books yet"
              description="Search your catalog, or the web, for the first one."
              action={!readOnly && <Button onClick={() => setPicking(true)}>Add a book</Button>}
            />
          )}
        </SectionCard>

        {!readOnly && onDelete && (
          <div className="dl-danger">
            <Button variant="danger" onClick={() => onDelete(list.id)}>
              Delete this list
            </Button>
          </div>
        )}
      </div>

      <BookPicker
        open={picking}
        onClose={() => setPicking(false)}
        onAdd={(id) => set({ books: [...list.books, id] })}
        already={list.books}
      />
    </>
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
