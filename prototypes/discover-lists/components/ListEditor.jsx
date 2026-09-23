import { useState } from 'react'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { BackBar } from '@components/BackBar/BackBar'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { Field, Input, Textarea, Select, MultiSelect } from '@components/Form/Form'
import { Toggle } from '@components/Toggle/Toggle'
import { Button } from '@components/Button/Button'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { BookCover } from '@components/BookCover/BookCover'
import { EmptyState, Banner } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import '@components/SectionCard/SectionCard.css'
import '@components/Form/Form.css'
import '@components/Toggle/Toggle.css'
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

      <PageHeader
        title={list.name || 'New book list'}
        subtitle={
          readOnly
            ? `${list.ownerName}’s list — you can read it, but only they can change it.`
            : 'A list is a shelf on Discover. Give it a name, pick who it’s for, then add the books.'
        }
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

          {/* The app's Active toggle, which is the whole of "is this on
              Discover" — a hidden list is still a list, it just isn't a shelf. */}
          <Field label="On Discover">
            <Toggle checked={list.active} onChange={(v) => set({ active: v })} disabled={readOnly}>
              {list.active ? 'Shown to readers' : 'Hidden'}
            </Toggle>
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

        <SectionCard header="divider" title="Where the list lives" className="dl-card">
          <Field label="Where will this list be located?">
            <Select
              value={list.external ? 'true' : 'false'}
              onChange={(e) => set({ external: e.target.value === 'true' })}
              disabled={readOnly}
            >
              <option value="false">The list will exist on this site.</option>
              <option value="true">The list will exist on another site.</option>
            </Select>
          </Field>

          {list.external && (
            <Field label="List URL" required error={showErr('externalUrl')}>
              <Input
                value={list.externalUrl}
                onChange={(e) => set({ externalUrl: e.target.value })}
                placeholder="https://…"
                maxLength={255}
                disabled={readOnly}
              />
            </Field>
          )}
        </SectionCard>

        {/* The second half of the app's pair, folded in. An external list has
            no books of its own — it's a link out — so the card says so instead
            of offering a picker that would go nowhere. */}
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
            !readOnly &&
            !list.external && (
              <Button disabled={isFull(list)} onClick={() => setPicking(true)}>
                Add a book
              </Button>
            )
          }
        >
          {list.external ? (
            <EmptyState
              icon={<Icon name="external-link" size={26} />}
              title="This list lives somewhere else"
              description="Readers follow the link out, so there are no books to pick here."
            />
          ) : books.length ? (
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
