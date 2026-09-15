import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { Tabs } from '@components/Tabs/Tabs'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { StatCard } from '@components/Cards/Cards'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { ReaderBack } from '@components/ReaderApp/ReaderApp'
import { PartnerMark } from '@components/PartnerBrand/PartnerBrand'

import { BookCover } from '../../logging-flow/components/BookCover'
import { CONNECTIONS } from '../../logging-flow/connections'
import { CATALOG, MOODS } from '../data'
import './BookPage.css'

import '@components/Button/Button.css'
import '@components/Pill/Pill.css'
import '@components/Tabs/Tabs.css'
import '@components/Modal/Modal.css'
import '@components/RowAction/RowAction.css'
import '@components/Cards/Cards.css'

/**
 * One book — `books#show`, the record every other page's titles point at.
 *
 * The app's own anatomy: the cover and the tag rail on the right, the title,
 * credits and the three buttons on the left, and under them the Learning Tip,
 * the Description, the moods readers gave it, and Related Picks.
 *
 * The three buttons are the app's three (`books/_buttons.html.haml`) and they
 * are gated the same way: "Get This Book" only where the title has a library
 * URL, "Add to Wish List" unless the site hides the wish list, "Log Reading"
 * only where the site allows book logging.
 *
 * The wish-list button acts in place rather than navigating, which is what the
 * app's own `ajax:success` handler does to it — but it goes both ways here. The
 * app's turns into a dead "Added!" and leaves the Wish List page as the only
 * place to undo it, which is a long way to go to correct a mis-tap on the
 * button you are still looking at.
 *
 * The tag rail is `books/_product_aside.html.haml` in full: Lexile Measure over
 * Favorite Genres, Topics, Main Characters, Awards and Misc. Every tag is a
 * link back into a filtered catalog, so the rail is how a reader gets from one
 * book to the next — `onFilter` is where those go.
 *
 * `sessions` is the reader's own log for this title — the app sends a logged
 * title's tile to that book's own log page, so a book you have read has to be
 * able to answer "how much of it?" as well as what it's about. A title nobody
 * has logged says so.
 *
 * A session on the Reading Log tab can be corrected or taken back, which is
 * `reading_log/_sessions.html.haml`: a pencil and a remove on every row, the
 * amount turning into an input in place with Save and Cancel where the two were
 * (not a modal — you are changing one number), and a confirm for the delete.
 * `logged_book_can_be_edited` is why an imported session offers only the
 * remove: the number came from the reading app, so there is nothing here to
 * correct.
 *
 * The prose is behind tabs rather than stacked: the app's page runs the tip,
 * the description, the moods and the related picks one after another, which is
 * a long scroll past three things to reach the fourth. The names are Book
 * Discovery's own (Overview / Reading Log / More Like This), so a book detail
 * reads the same whichever prototype you opened it in. What stays out of the
 * tabs is what identifies the book — the cover, the title, the credits, the
 * buttons and the tag rail — because those are true on every tab.
 */

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'] // prettier-ignore

/** `2026-06-16` → `June 16, 2026`, without constructing a Date (and its zone). */
const longDate = (key) => {
  const [y, m, d] = key.split('-')
  return `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`
}
export function BookPage({
  book,
  onBack,
  backLabel = 'Back to Find Books',
  onLog,
  onWish,
  onFilter,
  onOpenBook,
  sessions = [],
  /* Correcting a number and taking a session back — `logged_books#update` and
     `#destroy`. Left off, the rows are read-only. */
  onEditSession,
  onRemoveSession,
  /* Whether this title is on the reader's wish list, and the one handler that
     puts it on or takes it off — the list itself lives with the page that owns
     it, so adding here shows up there. */
  wished = false,
  features = {},
}) {
  const [tab, setTab] = useState('overview')
  const [editing, setEditing] = useState(null) // session id being corrected
  const [draft, setDraft] = useState('')
  const [removing, setRemoving] = useState(null) // session awaiting confirmation
  const { getThisBook = true, wishList = true, bookLogging = true } = features

  // "Related Picks" — the app's own `@related_books`, four titles that share a
  // genre with this one. A book with no genre in common falls back to the rest
  // of the catalog rather than showing an empty section.
  const related = CATALOG.filter(
    (b) => b.id !== book.id && b.genres?.some((g) => book.genres?.includes(g)),
  ).slice(0, 4)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reading', label: 'Reading Log', count: sessions.length || undefined },
    ...(related.length ? [{ id: 'similar', label: 'More Like This' }] : []),
  ]

  const ages = book.ages?.length
    ? book.ages.length === 1
      ? `Age ${book.ages[0]}`
      : `Ages ${book.ages[0]} – ${book.ages[book.ages.length - 1]}`
    : null

  return (
    <div className="bp">
      {onBack && <ReaderBack onClick={onBack}>{backLabel}</ReaderBack>}

      <article className="bp-card">
        <div className="bp-main">
          <header className="bp-head">
            <h1 className="bp-title">{book.title}</h1>
            <p className="bp-credits">
              <span className="bp-person">{book.author}</span>
              <span className="bp-role">(Author)</span>
              {ages && <span className="bp-ages">{ages}</span>}
            </p>
          </header>

          <div className="bp-buttons">
            {getThisBook && book.isbn && <Button>Get This Book</Button>}
            {wishList && (
              <Button variant="secondary" onClick={() => onWish?.(book)}>
                {wished ? 'Remove from Wish List' : 'Add to Wish List'}
              </Button>
            )}
            {bookLogging && (
              <Button variant="secondary" onClick={() => onLog?.(book)}>
                Log Reading
              </Button>
            )}
          </div>

          <div className="bp-tabs">
            <Tabs
              variant="pill"
              size="md"
              active={tab}
              onChange={setTab}
              ariaLabel="About this book"
              items={tabs}
            />
          </div>

          <div className="bp-panel">
            {tab === 'reading' && (
              <section className="bp-section">
                {sessions.length === 0 ? (
                  <p className="bp-noreading">You haven’t logged any reading for this title yet.</p>
                ) : (
                  <>
                    {/* The same tile the reading log puts its numbers on, so this
                    title's totals read as a slice of that page's. */}
                    <div className="bp-readnums">
                      <StatCard
                        value={sessions.length}
                        label="Sessions"
                        color="#B45309"
                        icon={<Icon name="calendar" size={20} />}
                      />
                      <StatCard
                        value={sessions.reduce((n, e) => n + (e.minutes ?? 0), 0) || '—'}
                        label="Minutes"
                        color="#0B6B78"
                        icon={<Icon name="clock" size={20} />}
                      />
                      <StatCard
                        value={sessions.reduce((n, e) => n + (e.pages ?? 0), 0) || '—'}
                        label="Pages"
                        color="#5B21B6"
                        icon={<Icon name="file-text" size={20} />}
                      />
                      {sessions.some((e) => e.completed) && (
                        <StatCard
                          value="Completed"
                          label="This title"
                          color="#0F7A55"
                          icon={<Icon name="circle-check" size={20} />}
                        />
                      )}
                    </div>
                    <ul className="bp-sessions">
                      {[...sessions]
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((e) => {
                          // A session that came in from a reading app has nothing
                          // here to correct — `logged_book_can_be_edited`.
                          const editable = !e.source && Boolean(onEditSession)
                          const unit = e.minutes ? 'min' : 'pages'
                          const open = editing === e.id
                          return (
                            <li key={e.id} className={open ? 'is-editing' : undefined}>
                              <span className="bp-session-date">{longDate(e.date)}</span>
                              <span className="bp-session-amount">
                                {open ? (
                                  <>
                                    <input
                                      className="bp-session-input"
                                      type="number"
                                      min="1"
                                      value={draft}
                                      onChange={(ev) => setDraft(ev.target.value)}
                                      aria-label={`${unit} read`}
                                      autoFocus
                                    />
                                    <span className="bp-session-unit">{unit}</span>
                                  </>
                                ) : e.minutes ? (
                                  `${e.minutes} min`
                                ) : e.pages ? (
                                  `${e.pages} pages`
                                ) : (
                                  'Logged'
                                )}
                              </span>
                              <span className="bp-session-source">
                                {e.source ? (
                                  <>
                                    <PartnerMark id={e.source} size={15} />{' '}
                                    {CONNECTIONS[e.source].name}
                                  </>
                                ) : (
                                  <span className="bp-session-manual">Logged by hand</span>
                                )}
                              </span>
                              <RowActions className="bp-session-actions">
                                {open ? (
                                  <>
                                    <RowAction
                                      icon="check"
                                      label="Save"
                                      onClick={() => {
                                        const n = Number(draft)
                                        if (n > 0) onEditSession(e, n)
                                        setEditing(null)
                                      }}
                                    />
                                    <RowAction
                                      icon="x"
                                      label="Cancel"
                                      onClick={() => setEditing(null)}
                                    />
                                  </>
                                ) : (
                                  <>
                                    {editable && (
                                      <RowAction
                                        icon="pencil"
                                        label="Edit this session"
                                        onClick={() => {
                                          setDraft(String(e.minutes ?? e.pages ?? ''))
                                          setEditing(e.id)
                                        }}
                                      />
                                    )}
                                    {onRemoveSession && (
                                      <RowAction
                                        icon="trash"
                                        label="Remove this session"
                                        onClick={() => setRemoving(e)}
                                      />
                                    )}
                                  </>
                                )}
                              </RowActions>
                            </li>
                          )
                        })}
                    </ul>
                  </>
                )}
              </section>
            )}

            {tab === 'overview' && book.tip && (
              <section className="bp-section bp-tip">
                <h2>Learning Tip</h2>
                <p>{book.tip}</p>
              </section>
            )}

            {tab === 'overview' && book.body && (
              <section className="bp-section">
                <h2>Description</h2>
                <p>{book.body}</p>
                {book.source && <p className="bp-source">Source: {book.source}</p>}
              </section>
            )}

            {tab === 'overview' && book.moods?.length > 0 && (
              <section className="bp-section">
                <h2>How Readers Felt</h2>
                <ul className="bp-moods">
                  {book.moods.map((m) => (
                    <li key={m}>
                      <span className="bp-mood-face" aria-hidden="true">
                        {MOODS[m].emoji}
                      </span>
                      <span className="bp-mood-title">{MOODS[m].title}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {tab === 'similar' && (
              <section className="bp-section">
                <ul className="bp-related">
                  {related.map((b) => (
                    <li key={b.id}>
                      <button type="button" onClick={() => onOpenBook?.(b)}>
                        <span className="bp-related-cover">
                          <BookCover book={b} size="fill" />
                        </span>
                        <span className="bp-related-meta">
                          <span className="bp-related-title">{b.title}</span>
                          <span className="bp-related-author">{b.author}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        <aside className="bp-aside">
          <div className="bp-cover">
            <BookCover book={book} size="fill" />
          </div>

          {book.lexile && (
            <section className="bp-tags">
              <h2>Lexile Measure</h2>
              <ul className="bp-taglist bp-tags--teal">
                <TagLink>{book.lexile}</TagLink>
              </ul>
            </section>
          )}

          <section className="bp-tags">
            <h2>Tags</h2>

            <TagGroup title="Favorite Genres" tone="green">
              {book.genres?.map((g) => (
                <TagLink key={g} onClick={() => onFilter?.({ genres: [g] })}>
                  {g}
                </TagLink>
              ))}
            </TagGroup>

            <TagGroup title="Topics" tone="purple">
              {Object.values(book.topics ?? {}).flatMap((topics) =>
                topics.map((t) => (
                  <TagLink key={t} onClick={() => onFilter?.({ topics: [t] })}>
                    {t}
                  </TagLink>
                )),
              )}
            </TagGroup>

            <TagGroup title="Main Characters" tone="blue">
              {Object.values(book.backgrounds ?? {}).flatMap((tags) =>
                tags.map((t) => (
                  <TagLink key={t} onClick={() => onFilter?.({ backgrounds: [t] })}>
                    {t}
                  </TagLink>
                )),
              )}
            </TagGroup>

            {/* Awards are a category like any other in the app; they get their
                own block because a medal is the reason a reader picks a book
                up, not a tag they scan past. */}
            {book.awards?.length > 0 && (
              <div className="bp-taggroup">
                <h3>Awards</h3>
                <ul className="bp-awards">
                  {book.awards.map((a) => (
                    <li key={a}>
                      <Pill color="#B45309" variant="soft" size="sm">
                        <Icon name="award" size={13} /> {a}
                      </Pill>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <TagGroup title="Misc." tone="gray">
              {book.misc?.map((m) => (
                <TagLink key={m}>{m}</TagLink>
              ))}
            </TagGroup>
          </section>
        </aside>
      </article>

      {/* `reading_log/_delete_session_modal.html.haml`, its wording included —
          "Don't Delete" is the app's own way out. */}
      <Modal
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        variant="center"
        closeBadge
        ariaLabel="Delete this session"
      >
        <ModalClose onClick={() => setRemoving(null)} />
        <div className="modal-header modal-header--flush">
          <h2 className="modal-title">Are you sure you want to delete this reading session?</h2>
        </div>
        {removing && (
          <div className="modal-body">
            <p>
              {longDate(removing.date)} —{' '}
              {removing.minutes
                ? `${removing.minutes} minutes`
                : removing.pages
                  ? `${removing.pages} pages`
                  : 'logged'}
              .
            </p>
          </div>
        )}
        <div className="modal-footer">
          <Button variant="ghost" onClick={() => setRemoving(null)}>
            Don’t Delete
          </Button>
          <Button
            onClick={() => {
              onRemoveSession?.(removing)
              setRemoving(null)
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

/**
 * One block of the tag rail — nothing at all when the book has no such tag.
 *
 * `tone` is which of the app's tag colours the block takes (`lib/_tag.scss`:
 * purple, teal, green, yellow, gray). A rail of forty grey chips is a wall;
 * colour per family is how you find the genres in it without reading the
 * headings.
 */
function TagGroup({ title, tone = 'gray', children }) {
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean)
  if (items.length === 0) return null
  return (
    <div className="bp-taggroup">
      <h3>{title}</h3>
      <ul className={`bp-taglist bp-tags--${tone}`}>{items}</ul>
    </div>
  )
}

/**
 * A tag is a link into the catalog filtered by it — that is its whole point.
 * The two the browse page has no facet for (a Lexile measure, and the Misc.
 * categories) state rather than navigate, since a link that filters by nothing
 * is worse than a label.
 */
function TagLink({ onClick, children }) {
  return (
    <li>
      {onClick ? (
        <button type="button" className="bp-tag" onClick={onClick}>
          {children}
        </button>
      ) : (
        <span className="bp-tag bp-tag--static">{children}</span>
      )}
    </li>
  )
}
