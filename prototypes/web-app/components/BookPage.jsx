import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { Tabs } from '@components/Tabs/Tabs'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { StatCard } from '@components/Cards/Cards'
import { Table } from '@components/Table/Table'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { ReaderBack } from '@components/ReaderApp/ReaderApp'
import { PartnerMark } from '@components/PartnerBrand/PartnerBrand'

import { BookCover } from '@components/BookCover/BookCover'
import { CONNECTIONS } from '../../logging-flow/connections'
import { CATALOG, MOODS } from '../data'
import './BookPage.css'

import '@components/Button/Button.css'
import '@components/Pill/Pill.css'
import '@components/Tabs/Tabs.css'
import '@components/Modal/Modal.css'
import '@components/RowAction/RowAction.css'
import '@components/Cards/Cards.css'
import '@components/Table/Table.css'

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

/**
 * What the reader has put into this title, in whatever it was measured in. A
 * title logged in pages has no minutes and vice versa, so the tile reports the
 * one that has a number rather than showing both and dashing one.
 */
function totalRead(sessions) {
  const minutes = sessions.reduce((n, e) => n + (e.minutes ?? 0), 0)
  const pages = sessions.reduce((n, e) => n + (e.pages ?? 0), 0)
  if (minutes && pages) return { value: minutes, label: 'Minutes (and pages)' }
  if (pages) return { value: pages, label: 'Pages' }
  return { value: minutes || '—', label: 'Minutes' }
}

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

      <article className="bkp-card">
        {/* Its own cell rather than the rail's first child: stacked, the cover
            belongs at the top with the title, not after the moods. The app
            pushes the same column first on a small screen. */}
        <div className="bkp-cover">
          <BookCover book={book} size="fill" />
        </div>

        <div className="bkp-main">
          <header className="bkp-head">
            <h1 className="bkp-title">{book.title}</h1>
            <p className="bkp-credits">
              <span className="bkp-person">{book.author}</span>
              <span className="bkp-role">(Author)</span>
              {ages && <span className="bkp-ages">{ages}</span>}
            </p>
          </header>

          <div className="bkp-buttons">
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

          <div className="bkp-tabs">
            <Tabs
              variant="pill"
              size="md"
              active={tab}
              onChange={setTab}
              ariaLabel="About this book"
              items={tabs}
            />
          </div>

          <div className="bkp-panel">
            {tab === 'reading' && (
              <section className="bkp-section">
                {sessions.length === 0 ? (
                  <p className="bkp-noreading">
                    You haven’t logged any reading for this title yet.
                  </p>
                ) : (
                  <>
                    {/* The same tile the reading log puts its numbers on, so this
                        title's totals read as a slice of that page's. Two of
                        them: how often, and how much. Whether a session was
                        measured in minutes or pages is the table's own column,
                        and a tile that can only say "—" is a tile that says
                        nothing. */}
                    <div className="bkp-readnums">
                      <StatCard
                        value={sessions.length}
                        label={sessions.length === 1 ? 'Session' : 'Sessions'}
                        color="#B45309"
                        icon={<Icon name="calendar" size={20} />}
                      />
                      <StatCard
                        value={totalRead(sessions).value}
                        label={totalRead(sessions).label}
                        color="#0B6B78"
                        icon={<Icon name="clock" size={20} />}
                      />
                    </div>

                    {/* The design system's table, header and all: these rows
                        carry four things now and the app's own session list is
                        a table in everything but markup. */}
                    <Table
                      className="bkp-sessions"
                      bordered
                      columns={[
                        {
                          key: 'date',
                          label: 'Date',
                          render: (_v, e) => (
                            <span className="bkp-session-date">{longDate(e.date)}</span>
                          ),
                        },
                        {
                          key: 'amount',
                          label: 'Logged',
                          width: 150,
                          render: (_v, e) =>
                            editing === e.id ? (
                              <span className="bkp-session-edit">
                                <input
                                  className="bkp-session-input"
                                  type="number"
                                  min="1"
                                  value={draft}
                                  onChange={(ev) => setDraft(ev.target.value)}
                                  aria-label={`${e.minutes ? 'minutes' : 'pages'} read`}
                                  autoFocus
                                />
                                <span className="bkp-session-unit">
                                  {e.minutes ? 'min' : 'pages'}
                                </span>
                              </span>
                            ) : (
                              <strong className="bkp-session-amount">
                                {e.minutes
                                  ? `${e.minutes} min`
                                  : e.pages
                                    ? `${e.pages} pages`
                                    : 'Logged'}
                              </strong>
                            ),
                        },
                        {
                          key: 'source',
                          label: 'From',
                          align: 'center',
                          width: 80,
                          /* The partner's mark and nothing else — its name is
                             on the tooltip. Spelling "Comics Plus" out on every
                             row of a table whose rows are all the same app is a
                             column of repeated text. */
                          render: (_v, e) =>
                            e.source ? (
                              <RowAction
                                as="span"
                                label={`Imported from ${CONNECTIONS[e.source].name}`}
                              >
                                <PartnerMark id={e.source} size={18} />
                              </RowAction>
                            ) : (
                              <RowAction as="span" icon="user" label="Logged by hand" />
                            ),
                        },
                        {
                          key: 'id',
                          label: '',
                          align: 'right',
                          width: 100,
                          render: (_v, e) => (
                            <RowActions>
                              {editing === e.id ? (
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
                                  {/* A session that came in from a reading app
                                      has nothing here to correct —
                                      `logged_book_can_be_edited`. */}
                                  {!e.source && onEditSession && (
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
                          ),
                        },
                      ]}
                      rows={[...sessions].sort((a, b) => b.date.localeCompare(a.date))}
                      getRowKey={(e) => e.id}
                      highlightRow={(e) => editing === e.id}
                    />
                  </>
                )}
              </section>
            )}

            {tab === 'overview' && book.tip && (
              <section className="bkp-section bkp-tip">
                <h2>Learning Tip</h2>
                <p>{book.tip}</p>
              </section>
            )}

            {tab === 'overview' && book.body && (
              <section className="bkp-section">
                <h2>Description</h2>
                <p>{book.body}</p>
                {book.source && <p className="bkp-source">Source: {book.source}</p>}
              </section>
            )}

            {tab === 'overview' && book.moods?.length > 0 && (
              <section className="bkp-section">
                <h2>How Readers Felt</h2>
                <ul className="bkp-moods">
                  {book.moods.map((m) => (
                    <li key={m}>
                      <span className="bkp-mood-face" aria-hidden="true">
                        {MOODS[m].emoji}
                      </span>
                      <span className="bkp-mood-title">{MOODS[m].title}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {tab === 'similar' && (
              <section className="bkp-section">
                <ul className="bkp-related">
                  {related.map((b) => (
                    <li key={b.id}>
                      <button type="button" className="is-hit" onClick={() => onOpenBook?.(b)}>
                        <span className="bkp-related-cover">
                          <BookCover book={b} size="fill" />
                        </span>
                        <span className="bkp-related-meta">
                          <span className="bkp-related-title">{b.title}</span>
                          <span className="bkp-related-author">{b.author}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        <aside className="bkp-aside">
          {book.lexile && (
            <section className="bkp-tags">
              <h2>Lexile Measure</h2>
              <ul className="bkp-taglist bkp-tags--teal">
                <TagLink>{book.lexile}</TagLink>
              </ul>
            </section>
          )}

          <section className="bkp-tags">
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
              <div className="bkp-taggroup">
                <h3>Awards</h3>
                <ul className="bkp-awards">
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
    <div className="bkp-taggroup">
      <h3>{title}</h3>
      <ul className={`bkp-taglist bkp-tags--${tone}`}>{items}</ul>
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
        <button type="button" className="bkp-tag" onClick={onClick}>
          {children}
        </button>
      ) : (
        <span className="bkp-tag bkp-tag--static">{children}</span>
      )}
    </li>
  )
}
