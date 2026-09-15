import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { Modal } from '@components/Modal/Modal'
import { StatCard } from '@components/Cards/Cards'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { Banner } from '@components/Primitives/Primitives'
import { PartnerMark } from '@components/PartnerBrand/PartnerBrand'

import { BOOKS, READING_LOG, LOG_STREAK, LOG_MONTH } from '../data'
import { CONNECTIONS, CONNECTION_LIST } from '../connections'
import { BookCover } from './BookCover'
import './ReadingLog.css'

import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'
import '@components/Modal/Modal.css'
import '@components/Cards/Cards.css'
import '@components/Primitives/Primitives.css'

// Beanstack's Reading Log — calendar and list views over the same entries.
// Sessions that arrived from a linked reading app are tagged with that app's
// mark and say when they were imported, so a reader can tell at a glance which
// rows they logged themselves.

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const entriesOn = (entries, key) => entries.filter((e) => e.date === key)

/** The calendar grid always shows whole weeks, so it spills into both neighbours. */
function monthGrid(year, month) {
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  const weeks = []
  const cursor = new Date(start)
  while (weeks.length < 6) {
    const week = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
    // Stop once we've passed the last day of the month.
    if (cursor.getMonth() !== month && cursor.getDate() > 7) break
  }
  return weeks
}

function amount(e) {
  const bits = []
  if (e.minutes) bits.push(`${e.minutes} Minutes`)
  if (e.pages) bits.push(`${e.pages} Pages`)
  return bits
}

/** "Imported from Comics Plus on 6/3/26" — hover the partner mark to see it. */
function ImportedTag({ entry }) {
  const p = CONNECTIONS[entry.source]
  if (!p) return null
  return (
    <span className="rl-imported" tabIndex={0}>
      <PartnerMark id={entry.source} size={16} />
      <span className="rl-tip" role="tooltip">
        Imported from {p.name} on {entry.importedOn}
      </span>
    </span>
  )
}

function EntryChip({ entry, dense, showImported = true, onOpenBook, bookFor }) {
  const amounts = amount(entry)
  // Every row is a book, so its title goes to that book's page — but only
  // where the prototype has one and the catalog knows the title. A title the
  // catalog has never heard of stays plain text rather than linking nowhere.
  const book = onOpenBook ? bookFor?.(entry.title) : null
  return (
    <div className={`rl-entry rl-entry--${entry.tone}${dense ? ' rl-entry--dense' : ''}`}>
      <div className="rl-entry-main">
        {book ? (
          <button
            type="button"
            className="rl-entry-title rl-entry-link"
            onClick={() => onOpenBook(book)}
          >
            {entry.title}
          </button>
        ) : (
          <div className="rl-entry-title">{entry.title}</div>
        )}
        {entry.author && <div className="rl-entry-author">{entry.author}</div>}
        {amounts.length > 0 && (
          <div className="rl-entry-amounts">
            {amounts.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
        )}
        {entry.completed && (
          <span className="rl-entry-pill">
            <Pill color="#0F7A55" variant="soft" size="sm">
              Completed
            </Pill>
          </span>
        )}
      </div>
      {showImported && entry.source && <ImportedTag entry={entry} />}
    </div>
  )
}

function CalendarView({ entries, showImported, onOpenBook, bookFor }) {
  const weeks = monthGrid(LOG_MONTH.year, LOG_MONTH.month)
  return (
    <div className="rl-cal">
      <div className="rl-cal-head">
        {WEEKDAYS.map((d) => (
          <div key={d} className="rl-cal-dow">
            {d}
          </div>
        ))}
      </div>
      <div className="rl-cal-body">
        {weeks.map((week, wi) => (
          <div key={wi} className="rl-cal-week">
            {week.map((day) => {
              const key = iso(day)
              const rows = entriesOn(entries, key)
              const outside = day.getMonth() !== LOG_MONTH.month
              const streak = rows.find((r) => r.streak)?.streak
              return (
                <div key={key} className={`rl-cal-cell${outside ? ' is-outside' : ''}`}>
                  <div className="rl-cal-date">{day.getDate()}</div>
                  {streak && (
                    <div className="rl-cal-streak">
                      {streak} day streak
                      <Icon name="flame-filled" size={13} />
                    </div>
                  )}
                  {rows.map((e) => (
                    <EntryChip
                      key={e.id}
                      entry={e}
                      dense
                      showImported={showImported}
                      onOpenBook={onOpenBook}
                      bookFor={bookFor}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function ListView({ entries, showImported, onOpenBook, bookFor }) {
  const weeks = monthGrid(LOG_MONTH.year, LOG_MONTH.month)
  return (
    <div className="rl-list">
      {weeks.map((week, wi) => {
        const days = week.filter((d) => entriesOn(entries, iso(d)).length > 0)
        if (days.length === 0) return null
        const first = week[0]
        const last = week[6]
        const range =
          first.getMonth() === last.getMonth()
            ? `${MONTHS[first.getMonth()]} ${first.getDate()}–${last.getDate()}`
            : `${MONTHS[first.getMonth()]} ${first.getDate()}–${MONTHS[last.getMonth()]} ${last.getDate()}`
        return (
          <section key={wi} className="rl-week">
            <div className="rl-week-range">{range}</div>
            {/* Most recent day first, matching the product. */}
            {[...days].reverse().map((day) => {
              const rows = entriesOn(entries, iso(day))
              const streak = rows.find((r) => r.streak)?.streak
              return (
                <div key={iso(day)} className="rl-day">
                  <div className="rl-day-when">
                    <div className="rl-day-num">{day.getDate()}</div>
                    <div className="rl-day-name">{DAY_NAMES[day.getDay()]}</div>
                    {streak && (
                      <div className="rl-day-streak">
                        <Icon name="flame-filled" size={12} /> {streak}
                      </div>
                    )}
                  </div>
                  <div className="rl-day-rows">
                    {rows.map((e) => (
                      <EntryChip
                        key={e.id}
                        entry={e}
                        showImported={showImported}
                        onOpenBook={onOpenBook}
                        bookFor={bookFor}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}

// ─── All Titles ─────────────────────────────────────────────────────────────
// The real page is a shelf, not a table: covers grouped by the month they were
// logged in (`reading_log/_content.html.haml`), with the title and its numbers
// behind a click rather than spread across five columns.

/** The colours the app cycles a coverless tile through — `.log-item-1..7`. */
const NO_COVER_COLORS = [
  '#dc493a',
  '#f26430',
  '#ffbc42',
  '#03b5aa',
  '#19bfd5',
  '#1d70a2',
  '#6761a8',
]

const BOOK_BY_TITLE = new Map(Object.values(BOOKS).map((b) => [b.title, b]))

/**
 * The record `BookCover` wants for one logged title. A title in the catalog
 * brings its real cover; one that only exists in the log gets a tile in the
 * next of the app's seven colours, so a miss still looks designed.
 *
 * `known` is the record a wider catalog than the log's own found for the title
 * — web-app's, which has a cover for things the log only has a name for.
 */
function coverBook(title, author, i, known) {
  if (known) return known
  const c = NO_COVER_COLORS[i % NO_COVER_COLORS.length]
  return { title, author, cover: [c, c] }
}

const prettyMinutes = (n) => (n >= 60 ? `${Math.floor(n / 60)}h ${n % 60}m` : `${n}m`)

/** `2026-06-16` → `June 2026`, without constructing a Date (and its timezone). */
const monthLabel = (key) => {
  const [y, m] = key.split('-')
  return `${MONTHS[Number(m) - 1]} ${y}`
}

const longDate = (key) => {
  const [y, m, d] = key.split('-')
  return `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`
}

/**
 * Roll the log up per title *within each month*. The real grid is grouped by
 * month, so a title read across two months belongs under both — rolling up
 * globally would collapse exactly the thing the page is organised by.
 */
function titlesByMonth(entries) {
  const months = new Map()
  for (const e of entries) {
    if (e.kind !== 'log') continue
    const key = e.date.slice(0, 7)
    if (!months.has(key)) months.set(key, new Map())
    const byTitle = months.get(key)
    const row = byTitle.get(e.title) ?? {
      title: e.title,
      author: e.author,
      minutes: 0,
      pages: 0,
      sessions: [],
      sources: new Set(),
      completed: false,
    }
    row.minutes += e.minutes ?? 0
    row.pages += e.pages ?? 0
    row.sessions.push(e)
    row.completed = row.completed || Boolean(e.completed)
    if (e.source) row.sources.add(e.source)
    byTitle.set(e.title, row)
  }
  return [...months.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, byTitle]) => ({ key, label: monthLabel(key), rows: [...byTitle.values()] }))
}

/**
 * The stat strip over the shelf — `ul.reading-log-overview` in the app, on the
 * design system's own StatCard rather than a local copy of its shape.
 */
function TitleStats({ entries }) {
  const logs = entries.filter((e) => e.kind === 'log')
  const done = logs.filter((e) => e.completed)
  const stats = [
    { icon: 'circle-check', label: 'Total Completions', value: done.length, c: '#0F7A55' },
    {
      icon: 'book-2',
      label: 'Completed Titles',
      value: new Set(done.map((e) => e.title)).size,
      c: '#1A6DD5',
    },
    {
      icon: 'file-text',
      label: 'Pages Read',
      value: logs.reduce((n, e) => n + (e.pages ?? 0), 0),
      c: '#5B21B6',
    },
    {
      icon: 'clock',
      label: 'Reading Time',
      value: prettyMinutes(logs.reduce((n, e) => n + (e.minutes ?? 0), 0)),
      c: '#0B6B78',
    },
    {
      icon: 'calendar',
      label: 'Days of Reading',
      value: new Set(logs.map((e) => e.date)).size,
      c: '#B45309',
    },
  ]
  return (
    <div className="rl-overview">
      {stats.map((s) => (
        <StatCard
          key={s.label}
          value={s.value}
          label={s.label}
          color={s.c}
          icon={<Icon name={s.icon} size={20} />}
        />
      ))}
    </div>
  )
}

/** One shelf tile: the cover, a completed check, and the app it came from. */
function TitleTile({ row, index, onOpen, book }) {
  const [source] = [...row.sources]
  return (
    <li className="rl-tile">
      <button
        type="button"
        className="rl-tile-hit"
        onClick={onOpen}
        aria-label={`${row.title}${row.completed ? ' — completed' : ''}`}
      >
        <BookCover book={coverBook(row.title, row.author, index, book)} size="fill" />
        {/* Both marks stack in one corner rather than taking a corner each: a
            magazine's masthead runs left-to-right across the top of its tile,
            and a mark in the opposite corner cut the front off its name. */}
        <span className="rl-tile-marks" aria-hidden="true">
          {row.completed && (
            <span className="rl-tile-check">
              <Icon name="check" size={20} stroke={3} />
            </span>
          )}
          {source && (
            <span className="rl-tile-src">
              <PartnerMark id={source} size={16} />
            </span>
          )}
        </span>
      </button>
    </li>
  )
}

/**
 * What the five columns used to say, on the title you actually asked about.
 *
 * The app links a tile through to that book's own log page. Where a prototype
 * has built one — web-app's `BookPage`, which carries these same sessions — the
 * tile goes there instead and this never opens. It is what's left for a title
 * the log knows and the catalog doesn't.
 */
function TitleDetail({ row, index, onClose }) {
  return (
    <Modal open={Boolean(row)} onClose={onClose} variant="center" ariaLabel="Title detail">
      {row && (
        <div className="rl-detail">
          <button type="button" className="rl-detail-close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={17} />
          </button>
          <div className="rl-detail-body">
            <div className="rl-detail-head">
              <div className="rl-detail-cover">
                <BookCover book={coverBook(row.title, row.author, index)} size="fill" />
              </div>
              <div className="rl-detail-meta">
                <h2 className="rl-detail-title">{row.title}</h2>
                {row.author && <p className="rl-detail-author">by {row.author}</p>}
                {row.completed && (
                  <Pill color="#0F7A55" variant="soft" size="sm">
                    Completed
                  </Pill>
                )}
                <dl className="rl-detail-nums">
                  <div>
                    <dt>Sessions</dt>
                    <dd>{row.sessions.length}</dd>
                  </div>
                  <div>
                    <dt>Minutes</dt>
                    <dd>{row.minutes || '—'}</dd>
                  </div>
                  <div>
                    <dt>Pages</dt>
                    <dd>{row.pages || '—'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <ul className="rl-detail-sessions">
              {row.sessions.map((e) => (
                <li key={e.id}>
                  <span className="rl-detail-date">{longDate(e.date)}</span>
                  <span className="rl-detail-amount">
                    {e.minutes ? `${e.minutes} min` : e.pages ? `${e.pages} pages` : 'Logged'}
                  </span>
                  <span className="rl-detail-source">
                    {e.source ? (
                      <>
                        <PartnerMark id={e.source} size={15} /> {CONNECTIONS[e.source].name}
                      </>
                    ) : (
                      <span className="rl-detail-manual">Logged by hand</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Modal>
  )
}

/** "All Titles" — every logged title as a cover, grouped by month. */
function TitlesView({ entries, stats = true, onOpenBook, bookFor }) {
  // The app's own pair of tabs on this page: everything, or just what's done.
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(null)

  const all = titlesByMonth(entries)
  const months = all
    .map((m) => ({ ...m, rows: filter === 'done' ? m.rows.filter((r) => r.completed) : m.rows }))
    .filter((m) => m.rows.length)

  // What each tab would show, so the choice says how much is behind it.
  const rows = all.flatMap((m) => m.rows)
  const counts = { all: rows.length, done: rows.filter((r) => r.completed).length }

  // One running index across the whole shelf, so the coverless tiles cycle
  // through the seven colours rather than restarting inside every month.
  let i = -1

  return (
    <div className="rl-titles">
      {stats && <TitleStats entries={entries} />}

      <div className="rl-titles-filter">
        <Tabs
          variant="pill"
          size="md"
          active={filter}
          onChange={setFilter}
          ariaLabel="Which titles"
          items={[
            { id: 'all', label: 'All Titles', count: counts.all },
            { id: 'done', label: 'Completed', count: counts.done },
          ]}
        />
      </div>

      {months.map((m) => (
        <section key={m.key} className="rl-titlemonth">
          <p className="rl-titlemonth-label">{m.label}</p>
          <ul className="rl-tilegrid">
            {m.rows.map((row) => {
              i += 1
              const at = i
              // A tile goes to that book's page where there is one — it
              // carries these sessions and the record besides. The roll-up
              // modal is what a title the catalog has never heard of gets.
              // The record also supplies the cover, which is why it's resolved
              // whether or not there's anywhere to send the click.
              const book = bookFor?.(row.title)
              return (
                <TitleTile
                  key={row.title}
                  row={row}
                  index={at}
                  book={book}
                  onOpen={() =>
                    book && onOpenBook ? onOpenBook(book) : setOpen({ row, index: at })
                  }
                />
              )
            })}
          </ul>
        </section>
      ))}

      <TitleDetail row={open?.row} index={open?.index ?? 0} onClose={() => setOpen(null)} />
    </div>
  )
}

// `partners` is the list of reading apps this prototype offers to link; pass
// `[]` and the log drops everything about imported sessions — the note and the
// per-entry partner marks — since with nothing linked there's nothing to
// explain. Defaults to logging-flow's own list, so that prototype is unchanged.
//
// `titlesView={false}` drops "All Titles" from the view switcher, for a
// prototype where the shelf isn't the point.
//
// `extraTabs` / `renderExtra` hang another sub-tab off this strip, the same way
// `Dashboard` lets a prototype hang one off the main nav — web-app puts its
// Wish List and Book Lists here.
//
// `heading` overrides the page title, `subtabs={false}` drops the strip,
// `defaultTab` picks which sub-tab opens, `defaultView` picks which of the
// three views it opens on, and `stats={false}` drops the shelf's summary row —
// all for when this log is embedded in a page that already has those. A
// challenge's log opens on the titles shelf and leaves the totals to the
// Overview tab's own "Overall Progress". Left off, the page is exactly as it was.
//
// `onOpenBook` is where a logged title goes when you click it: the calendar and
// list rows link straight through, and the shelf's roll-up modal offers it in
// its footer. `bookFor` says which catalog record a logged title *is* — a
// prototype whose catalog is wider than the log's own passes its own resolver.
export function ReadingLog({
  entries = READING_LOG,
  partners = CONNECTION_LIST,
  titlesView = true,
  extraTabs = [],
  renderExtra,
  heading,
  subtabs = true,
  defaultTab = 'log',
  defaultView,
  stats = true,
  // Optional control of which sub-tab is showing, so a parent can move between
  // them — the Wish List's "Find Books" goes to Book Lists next door.
  tab: tabProp,
  onTab,
  onOpenBook,
  bookFor = (title) => BOOK_BY_TITLE.get(title),
}) {
  const [ownTab, setOwnTab] = useState(defaultTab)
  const tab = tabProp ?? ownTab
  const setTab = (id) => {
    setOwnTab(id)
    onTab?.(id)
  }
  // Calendar, list, or the shelf of every title — three views of one log, the
  // way the app's own Calendar/List toggle is two. All Titles was a sub-tab of
  // its own and read as a different page; it is the same entries, counted by
  // book instead of by day.
  //
  // A seven-column month gives each day ~43px on a phone, which can't carry a
  // book title — so a phone opens on the list and leaves the calendar one tap
  // away rather than showing a grid of clipped words.
  const [ownView, setOwnView] = useState(
    () =>
      defaultView ??
      (typeof window !== 'undefined' && window.matchMedia('(max-width: 560px)').matches
        ? 'list'
        : 'calendar'),
  )
  const view = titlesView || ownView !== 'titles' ? ownView : 'calendar'
  const extraIds = extraTabs.map((t) => t.id)

  const imported = partners.length ? entries.filter((e) => e.source).length : 0

  return (
    <div className="rl-page">
      {subtabs && (
        <div className="rl-subtabs">
          <Tabs
            variant="pill"
            plain
            size="md"
            active={tab}
            onChange={setTab}
            items={[{ id: 'log', label: 'Reading Log' }, ...extraTabs]}
          />
        </div>
      )}

      {/* An extra tab owns its whole page — its own header included — so the
          log's header and streaks drop out entirely rather than sitting above
          somebody else's content. */}
      {extraIds.includes(tab) && renderExtra?.(tab)}

      {!extraIds.includes(tab) && (
        <>
          <ReaderPageHead
            title={heading ?? 'Reading Log'}
            actions={
              <>
                <Button variant="secondary" size="md">
                  Print log
                </Button>
                {/* Calendar, list or shelf is a segmented control, which in this
                    system is a pill Tabs — it was a two-button toggle of its
                    own, on its own active blue. */}
                <Tabs
                  variant="pill"
                  size="md"
                  active={view}
                  accent="#1A6DD5"
                  onChange={setOwnView}
                  ariaLabel="Which view"
                  items={[
                    {
                      id: 'calendar',
                      label: 'Calendar',
                      icon: <Icon name="layout-grid" size={15} />,
                    },
                    { id: 'list', label: 'List', icon: <Icon name="list" size={15} /> },
                    ...(titlesView
                      ? [
                          {
                            id: 'titles',
                            label: 'All Titles',
                            icon: <Icon name="book-2" size={15} />,
                          },
                        ]
                      : []),
                  ]}
                />
              </>
            }
          />

          {view !== 'titles' && (
            <>
              {/* The design system's stat tile, not a local copy of its shape —
                  the same tile the All Titles shelf puts its numbers on. */}
              <div className="rl-streaks">
                <StatCard
                  value={LOG_STREAK.current}
                  unit="Days"
                  label="Current streak"
                  color="#DC493A"
                  icon={<Icon name="flame-filled" size={20} />}
                />
                <StatCard
                  value={LOG_STREAK.longest}
                  unit="Days"
                  label="Longest streak"
                  color="#F0A024"
                  icon={<Icon name="flame-filled" size={20} />}
                />
              </div>

              {/* Banner, not InfoBox: InfoBox is the announcement shape — a 26px
                  Plumpy glyph on its own 44px tile, with room for two actions.
                  This is an inline notice, so it takes the plain info circle
                  and the tighter bar. */}
              {imported > 0 && (
                <Banner level="info" className="rl-importnote">
                  {imported} of these sessions came in from your linked reading apps — hover a logo
                  to see where and when.
                </Banner>
              )}

              <div className="rl-month">
                <h2 className="rl-month-label">{LOG_MONTH.label}</h2>
                <div className="rl-month-nav">
                  <button type="button" className="rl-navbtn" aria-label="Previous month">
                    <Icon name="chevron-left" size={17} />
                  </button>
                  <button type="button" className="rl-navbtn" aria-label="Next month">
                    <Icon name="chevron-right" size={17} />
                  </button>
                </div>
              </div>
            </>
          )}

          {view === 'calendar' && (
            <CalendarView
              entries={entries}
              showImported={imported > 0}
              onOpenBook={onOpenBook}
              bookFor={bookFor}
            />
          )}
          {view === 'list' && (
            <ListView
              entries={entries}
              showImported={imported > 0}
              onOpenBook={onOpenBook}
              bookFor={bookFor}
            />
          )}
          {view === 'titles' && (
            <TitlesView entries={entries} stats={stats} onOpenBook={onOpenBook} bookFor={bookFor} />
          )}
        </>
      )}
    </div>
  )
}
