import { useState } from 'react'
import { Modal } from '@components/Modal/Modal'
import { Tabs } from '@components/Tabs/Tabs'
import { Field, Input } from '@components/Form/Form'
import { Button } from '@components/Button/Button'
import { BookCover } from '@components/BookCover/BookCover'
import { EmptyState, Banner } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import '@components/Modal/Modal.css'
import '@components/Tabs/Tabs.css'
import '@components/Form/Form.css'
import '@components/Button/Button.css'
import '@components/BookCover/BookCover.css'
import '@components/Primitives/Primitives.css'

import { MAX_BOOKS, SEARCH_TABS, searchCatalog } from '../data'
import './BookPicker.css'

/**
 * "Add a Book to this List" — the app's own modal, two sources and all.
 *
 * `reading_list_editor.html.haml` opens on a radio pair, **Curated Books** /
 * **Web Search**, each with its own infobox saying what it searches: the first
 * is "all the books that you have added or that have been curated by
 * Beanstack", the second "an external search of other databases… by title and
 * author, or by ISBN". Same two sources here, as a pill group rather than two
 * radios, because that is what this system's segmented controls are.
 *
 * Title and author are separate fields in the real form, not one search box —
 * a librarian usually knows one of the two and not the other.
 */
export function BookPicker({ open, onClose, onAdd, already = [] }) {
  const [tab, setTab] = useState('curated')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [isbn, setIsbn] = useState('')

  const meta = SEARCH_TABS.find((t) => t.id === tab)
  /* `already` is the live list, so it grows as this visit adds to it — there is
     nothing to add on top of it. Counting a local tally *as well* made the
     shelf read as full one book early. */
  const full = already.length >= MAX_BOOKS
  const results = searchCatalog({ tab, title, author, isbn })
  const searched = Boolean(title.trim() || author.trim() || isbn.trim())

  function close() {
    setTitle('')
    setAuthor('')
    setIsbn('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      variant="center"
      ariaLabel="Add a book to this list"
      className="dlp-modal"
      closeBadge
    >
      {({ close: dismiss }) => (
        <div className="dlp">
          <header className="dlp-head">
            <h2 className="dlp-title">Add a book to this list</h2>
            <Tabs
              variant="pill"
              size="sm"
              block
              active={tab}
              onChange={setTab}
              ariaLabel="Where to search"
              items={SEARCH_TABS.map((t) => ({ id: t.id, label: t.label }))}
            />
          </header>

          <div className="dlp-body">
            <Banner level={full ? 'warning' : 'info'} className="dlp-note">
              {full
                ? `That is ${MAX_BOOKS} books — a full shelf. Take one off to make room for another.`
                : meta.blurb}
            </Banner>

            <div className="dlp-fields">
              <Field label="Title">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="The Wild Robot"
                  maxLength={255}
                />
              </Field>
              <Field label="Author">
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Peter Brown"
                  maxLength={255}
                />
              </Field>
              {/* The real form offers ISBN on the web tab only — the curated
                  side searches the books your site already named. */}
              {tab === 'web' && (
                <Field label="or ISBN">
                  <Input
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="9780316382045"
                  />
                </Field>
              )}
            </div>

            {!searched ? (
              <EmptyState
                icon={<Icon name="search" size={26} />}
                title="Search for a book"
                description={
                  tab === 'web'
                    ? 'Type a title, an author, or an ISBN.'
                    : 'Type a title or an author to see what your site already has.'
                }
              />
            ) : results.length ? (
              <ul className="dlp-results">
                {results.map((b) => {
                  const on = already.includes(b.id)
                  return (
                    <li key={b.id} className="dlp-result">
                      <BookCover book={b} size="sm" />
                      <div className="dlp-result-text">
                        <span className="dlp-result-title">{b.title}</span>
                        <span className="dlp-result-sub">
                          {b.author}
                          {b.published ? ` · ${b.published}` : ''}
                        </span>
                      </div>
                      <Button
                        variant={on ? 'ghost' : 'secondary'}
                        size="sm"
                        disabled={on || full}
                        onClick={() => onAdd(b.id)}
                      >
                        {on ? 'On the list' : 'Add'}
                      </Button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <EmptyState
                icon={<Icon name="search" size={26} />}
                title="Nothing found"
                description={
                  tab === 'curated'
                    ? 'Your site hasn’t added this one. Try a web search instead.'
                    : 'No match. Check the spelling, or try just the author.'
                }
              />
            )}
          </div>

          <footer className="dlp-foot">
            <Button onClick={dismiss}>Done</Button>
          </footer>
        </div>
      )}
    </Modal>
  )
}
