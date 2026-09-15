import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { ReaderBack } from '@components/ReaderApp/ReaderApp'
import { PartnerMark } from '@components/PartnerBrand/PartnerBrand'

import { BookCover } from '../../logging-flow/components/BookCover'
import { CONNECTIONS } from '../../logging-flow/connections'
import { CATALOG, MOODS } from '../data'
import './BookPage.css'

import '@components/Button/Button.css'
import '@components/Pill/Pill.css'

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
 * only where the site allows book logging. The wish-list button turns into
 * "Added!" in place rather than navigating, which is what the app's own
 * `ajax:success` handler does to it.
 *
 * The tag rail is `books/_product_aside.html.haml` in full: Lexile Measure over
 * Favorite Genres, Topics, Main Characters, Awards and Misc. Every tag is a
 * link back into a filtered catalog, so the rail is how a reader gets from one
 * book to the next — `onFilter` is where those go.
 *
 * `sessions` is the reader's own log for this title, and it goes first, under
 * the buttons: the app sends a logged title's tile to that book's own log page,
 * so a book you have read has to answer "how much of it?" before it tells you
 * what it's about. A title nobody has logged says so and offers the one button
 * that changes that.
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
  wished = false,
  features = {},
}) {
  const [added, setAdded] = useState(wished)
  const { getThisBook = true, wishList = true, bookLogging = true } = features

  // "Related Picks" — the app's own `@related_books`, four titles that share a
  // genre with this one. A book with no genre in common falls back to the rest
  // of the catalog rather than showing an empty section.
  const related = CATALOG.filter(
    (b) => b.id !== book.id && b.genres?.some((g) => book.genres?.includes(g)),
  ).slice(0, 4)

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
              <Button
                variant="secondary"
                disabled={added}
                onClick={() => {
                  setAdded(true)
                  onWish?.(book)
                }}
              >
                {added ? 'Added!' : 'Add to Wish List'}
              </Button>
            )}
            {bookLogging && (
              <Button variant="secondary" onClick={() => onLog?.(book)}>
                Log Reading
              </Button>
            )}
          </div>

          <section className="bp-section">
            <h2>Your Reading</h2>
            {sessions.length === 0 ? (
              <p className="bp-noreading">You haven’t logged any reading for this title yet.</p>
            ) : (
              <>
                <dl className="bp-readnums">
                  <div>
                    <dt>Sessions</dt>
                    <dd>{sessions.length}</dd>
                  </div>
                  <div>
                    <dt>Minutes</dt>
                    <dd>{sessions.reduce((n, e) => n + (e.minutes ?? 0), 0) || '—'}</dd>
                  </div>
                  <div>
                    <dt>Pages</dt>
                    <dd>{sessions.reduce((n, e) => n + (e.pages ?? 0), 0) || '—'}</dd>
                  </div>
                  {sessions.some((e) => e.completed) && (
                    <div className="bp-readdone">
                      <Pill color="#0F7A55" variant="soft" size="sm">
                        Completed
                      </Pill>
                    </div>
                  )}
                </dl>
                <ul className="bp-sessions">
                  {[...sessions]
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((e) => (
                      <li key={e.id}>
                        <span className="bp-session-date">{longDate(e.date)}</span>
                        <span className="bp-session-amount">
                          {e.minutes ? `${e.minutes} min` : e.pages ? `${e.pages} pages` : 'Logged'}
                        </span>
                        <span className="bp-session-source">
                          {e.source ? (
                            <>
                              <PartnerMark id={e.source} size={15} /> {CONNECTIONS[e.source].name}
                            </>
                          ) : (
                            <span className="bp-session-manual">Logged by hand</span>
                          )}
                        </span>
                      </li>
                    ))}
                </ul>
              </>
            )}
          </section>

          {book.tip && (
            <section className="bp-section bp-tip">
              <h2>Learning Tip</h2>
              <p>{book.tip}</p>
            </section>
          )}

          {book.body && (
            <section className="bp-section">
              <h2>Description</h2>
              <p>{book.body}</p>
              {book.source && <p className="bp-source">Source: {book.source}</p>}
            </section>
          )}

          {book.moods?.length > 0 && (
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

          {related.length > 0 && (
            <section className="bp-section">
              <h2>Related Picks</h2>
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

        <aside className="bp-aside">
          <div className="bp-cover">
            <BookCover book={book} size="fill" />
          </div>

          {book.lexile && (
            <section className="bp-tags">
              <h2>Lexile Measure</h2>
              <ul className="bp-taglist">
                <TagLink>{book.lexile}</TagLink>
              </ul>
            </section>
          )}

          <section className="bp-tags">
            <h2>Tags</h2>

            <TagGroup title="Favorite Genres">
              {book.genres?.map((g) => (
                <TagLink key={g} onClick={() => onFilter?.({ genres: [g] })}>
                  {g}
                </TagLink>
              ))}
            </TagGroup>

            <TagGroup title="Topics">
              {Object.values(book.topics ?? {}).flatMap((topics) =>
                topics.map((t) => (
                  <TagLink key={t} onClick={() => onFilter?.({ topics: [t] })}>
                    {t}
                  </TagLink>
                )),
              )}
            </TagGroup>

            <TagGroup title="Main Characters">
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

            <TagGroup title="Misc.">
              {book.misc?.map((m) => (
                <TagLink key={m}>{m}</TagLink>
              ))}
            </TagGroup>
          </section>
        </aside>
      </article>
    </div>
  )
}

/** One block of the tag rail — nothing at all when the book has no such tag. */
function TagGroup({ title, children }) {
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean)
  if (items.length === 0) return null
  return (
    <div className="bp-taggroup">
      <h3>{title}</h3>
      <ul className="bp-taglist">{items}</ul>
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
