import { useState, useEffect } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Pill } from '@components/Pill/Pill'
import '@components/Pill/Pill.css'
import { ReaderBack } from '@components/ReaderApp/ReaderApp'
import { Button } from '@components/Button/Button'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { StatCard } from '@components/Cards/Cards'
import '@components/SectionCard/SectionCard.css'
import '@components/Cards/Cards.css'
import { Tabs } from '@components/Tabs/Tabs'
import { ChatBubble } from '@components/ChatBubble/ChatBubble'
import { Table } from '@components/Table/Table'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { Flyout, FlyoutMenu, FlyoutMenuItem } from '@components/Flyout/Flyout'
import '@components/Flyout/Flyout.css'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import '@components/Modal/Modal.css'
import '@components/RowAction/RowAction.css'
import '@components/ProgressBar/ProgressBar.css'
import { EmptyState } from '@components/Primitives/Primitives'
import '@components/Primitives/Primitives.css'
import '@components/Table/Table.css'
import { BookCover } from '@components/BookCover/BookCover'
/* The page's frame is web-app's `books#show` — one card, the cover and the
   rail in a 280px column beside the title, the buttons and the tabs. A book
   opened here and a book opened there is the same page; only what goes on the
   rail and in the panel differs. */
import '../../web-app/components/BookPage.css'
import { RatingInline } from '@components/Stars/Stars'
import { BookCard } from './BookCard'
import { Reviews } from './Reviews'
import { FriendCard } from '../../web-app/components/Friends'
import '../../web-app/components/Friends.css'
import { ReadNow } from '@components/ReadNow/ReadNow'
import { ExpandableText } from './ExpandableText'
import { PartnerMark } from './PartnerBits'
import { Avatar } from '@components/Avatar/Avatar'
import {
  GENRES,
  FORMATS,
  PARTNERS,
  PLACE_ORDER,
  CERTAINTY_CTA,
  getBooks,
  friendsWhoRead,
  readNowPartners,
  rowEnabled,
  shelfLocation,
} from '../data'

const isMagazine = (book) => book.formats.includes('magazine') && !book.formats.includes('print')

/* One row's own answer: an app with a reader, a format you read, and a licence
   in hand. `readNowPartners` asks the same question of a whole book. */
const canOpen = (a) =>
  a.certainty === 'own' &&
  (a.format === 'ebook' || a.format === 'magazine') &&
  a.partner !== 'library' &&
  a.partner !== 'classroom'
const fmtMins = (m) =>
  m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 ? `${m % 60}m` : ''}`.trim() : `${m}m`

// Split a description into a short synopsis (the opening line) + the fuller rest.
function splitDescription(desc = '') {
  const parts = (desc.match(/[^.!?]+[.!?]+/g) || [desc]).map((s) => s.trim()).filter(Boolean)
  return { synopsis: parts[0] || desc, about: parts.slice(1).join(' ') || desc }
}

// Soft tinted palette so theme chips read playful + varied (cycled by index).
const THEME_COLORS = [
  { bg: '#E0F2F1', color: '#0F766E' },
  { bg: '#FFE7DE', color: '#C2410C' },
  { bg: '#EDE9FE', color: '#6D28D9' },
  { bg: '#E0F2FE', color: '#0369A1' },
  { bg: '#FFECC8', color: '#B45309' },
  { bg: '#DCFCE7', color: '#15803D' },
]

// newest session that recorded a page, for "currently on page X" progress
function readProgress(book, sessions) {
  const withPage = sessions.find((s) => s.toPage)
  if (!withPage || !book.pageCount) return null
  return {
    toPage: withPage.toPage,
    pct: Math.min(100, Math.round((withPage.toPage / book.pageCount) * 100)),
  }
}

// Per-book reading stats — a compact card in the rail.
function StatStrip({ book, sessions, status }) {
  const totalMin = sessions.reduce((a, s) => a + s.minutes, 0)
  /* `icon` as a name rather than a node: `StatCard` draws a name with the
     Plumpy pack, which is full-colour Icons8 art — a tile of one figure and
     one label is mostly empty until something sits beside it, and a flat
     stroked glyph on a tinted card reads as a missing image. */
  const prog = status === 'reading' ? readProgress(book, sessions) : null
  const stats = [
    { value: totalMin, show: fmtMins(totalMin), label: 'Minutes read', c: '#0B6B78', i: 'clock' },
    {
      value: status === 'finished' ? 1 : 0,
      show: status === 'finished' ? 1 : 0,
      label: 'Times read',
      c: '#0F7A55',
      i: 'check',
    },
    {
      value: sessions.length,
      show: sessions.length,
      label: sessions.length === 1 ? 'Session' : 'Sessions',
      c: '#1A6DD5',
      i: 'calendar',
    },
  ]

  /* A zero is not a statistic. Four tiles reading 0m / 0 / 0 said only that you
     haven't started, which is one sentence, not a grid — so the zeros drop out
     and, with nothing left, the card says that sentence instead.

     "Readers at school" goes with them: it is true either way, but this card is
     headed *Your* stats, and one tile about everybody else standing where your
     reading should be is the wrong answer to "what have I done with this
     book". */
  const shown = stats.filter((s) => s.value > 0)

  /* No card around it. An empty state is already a bordered block with its own
     heading, and inside a section card it was a box in a box saying the same
     thing twice — "Your stats" over "Nothing logged yet". */
  if (shown.length === 0)
    return (
      <EmptyState
        variant="dashed"
        icon={<Icon name="reading-log" size={24} />}
        title="Nothing logged yet"
        description="Log some reading for this title and your minutes, sessions and finishes show up here."
      />
    )

  return (
    <SectionCard header="divider" title="Your stats">
      {
        <div className="bk-statgrid">
          {/* How far through it you are, while you're reading it — the one
              figure here that's a length, so it carries its bar. A bookmark
              for the mark (your place in it), in a colour none of the other
              tiles use. */}
          {prog && (
            <StatCard
              value={prog.toPage}
              unit={`/${book.pageCount}`}
              label="Pages read"
              color="#C2410C"
              icon="bookmark"
              progress={{ value: prog.toPage, max: book.pageCount }}
            />
          )}
          {shown.map((s) => (
            <StatCard key={s.label} value={s.show} label={s.label} color={s.c} icon={s.i} />
          ))}
          <StatCard
            value={book.readersAtSchool}
            label="Readers at school"
            color="#5B21B6"
            icon="users"
          />
        </div>
      }
    </SectionCard>
  )
}

/**
 * This title's reading log — web-app's `BookPage` Reading Log tab: the design
 * system's table of sessions. The figures — minutes, sessions, pages read —
 * are the rail's Your stats, right beside it, so the tab doesn't repeat them.
 *
 * It was a tinted panel with a list of rows inside it, which is a card where
 * the app has a table — a session is a date, an amount, what of the book it
 * covered and what it was read on, and none of those reads as a sentence.
 */
function ReadingLogTab({ sessions, onEditSession, onRemoveSession }) {
  const [editing, setEditing] = useState(null) // session index being corrected
  const [draft, setDraft] = useState('')
  const [removing, setRemoving] = useState(null) // session awaiting confirmation
  if (sessions.length === 0) {
    return (
      <EmptyState
        variant="dashed"
        icon={<Icon name="reading-log" size={26} />}
        title="Nothing logged yet"
        description="You haven’t logged any reading for this title yet."
      />
    )
  }

  return (
    <div className="bk-readlogtab">
      <h3 className="bk-section-h">Your reading</h3>

      <Table
        className="bkp-sessions"
        bordered
        columns={[
          { key: 'date', label: 'Date', render: (_v, s) => <strong>{s.date}</strong> },
          {
            key: 'minutes',
            label: 'Logged',
            width: 140,
            /* Correcting a number happens where the number is — you are
               changing one figure, not filling in a form. */
            render: (_v, s) =>
              editing === s.id ? (
                <span className="bkp-session-edit">
                  <input
                    className="bkp-session-input"
                    type="number"
                    min="1"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    aria-label="minutes read"
                    autoFocus
                  />
                  <span className="bkp-session-unit">min</span>
                </span>
              ) : (
                fmtMins(s.minutes)
              ),
          },
          /* No page range and no format. A session is a date and an amount;
             which pages it covered is what the progress tile above already
             says, and what you happened to read it on is a fact about the
             copy, not about the reading. Four columns of it made a log of two
             sessions read like a spreadsheet. */
          {
            key: 'id',
            label: '',
            align: 'right',
            width: 100,
            render: (_v, s) => (
              <RowActions>
                {editing === s.id ? (
                  <>
                    <RowAction
                      icon="check"
                      label="Save"
                      onClick={() => {
                        const n = Number(draft)
                        if (n > 0) onEditSession?.(s.id, n)
                        setEditing(null)
                      }}
                    />
                    <RowAction icon="x" label="Cancel" onClick={() => setEditing(null)} />
                  </>
                ) : (
                  <>
                    <RowAction
                      icon="pencil"
                      label="Edit this session"
                      onClick={() => {
                        setDraft(String(s.minutes ?? ''))
                        setEditing(s.id)
                      }}
                    />
                    <RowAction
                      icon="trash"
                      label="Remove this session"
                      onClick={() => setRemoving(s)}
                    />
                  </>
                )}
              </RowActions>
            ),
          },
        ]}
        rows={sessions.map((s, i) => ({ id: i, ...s }))}
        getRowKey={(s) => s.id}
        highlightRow={(s) => editing === s.id}
      />

      {/* Taking a session back is the one thing here you can't undo, so it asks
          — and "Don't Delete" is the way out, the way the app words it. */}
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
              {removing.date} — {fmtMins(removing.minutes)}.
            </p>
          </div>
        )}
        <div className="modal-footer">
          <Button variant="ghost" onClick={() => setRemoving(null)}>
            Don’t Delete
          </Button>
          <Button
            onClick={() => {
              onRemoveSession?.(removing.id)
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

function OverviewTab({ book, onOpenProfile }) {
  const { synopsis, about } = splitDescription(book.description)
  return (
    <div className="bk-overview">
      <div className="bk-section">
        <h3 className="bk-section-h bk-section-h--benny">
          Benny’s take <Icon name="sparkles" size={15} />
        </h3>
        {/* Benny says it the way Benny says everything — the Book Talk bubble,
            which is the one chat module in the system. It was a bubble drawn
            here, with a different face and a different tail. */}
        <div className="bk-benny-take">
          <ChatBubble msg={{ role: 'benny', text: book.bennyTake }} />
        </div>
      </div>

      <div className="bk-section">
        <h3 className="bk-section-h">Quick Synopsis</h3>
        <p className="bk-synopsis">{synopsis}</p>
      </div>

      <div className="bk-section">
        <h3 className="bk-section-h">About this {isMagazine(book) ? 'issue' : 'book'}</h3>
        <ExpandableText text={about} lines={3} className="bk-desc" />
      </div>

      <div className="bk-section">
        <h3 className="bk-section-h">Themes</h3>
        <div className="bk-themes">
          {book.genres.map((g) => {
            const c = GENRES[g] || { bg: '#EAEAEA', color: '#424242' }
            return (
              <span
                key={`g-${g}`}
                className="bk-theme"
                style={{ background: c.bg, color: c.color }}
              >
                {g}
              </span>
            )
          })}
          {/* A word can be both a genre and a theme — Hatchet is filed under
              Survival and is about survival — and listed from both it appeared
              twice in the same row. The genre chip wins, since it is the one
              with its own colour. */}
          {book.themes
            .filter((t) => !book.genres.includes(t))
            .map((t, i) => {
              const c = THEME_COLORS[i % THEME_COLORS.length]
              return (
                <span
                  key={`t-${t}`}
                  className="bk-theme"
                  style={{ background: c.bg, color: c.color }}
                >
                  {t}
                </span>
              )
            })}
        </div>
      </div>

      <FriendsWhoRead book={book} onOpenProfile={onOpenProfile} />
    </div>
  )
}

/* `availability` is the list this *site* offers, already filtered by which
   title sources it has on — so the formats listed here are the ones the reader
   can actually get, and the row can't name a format the Where-to-read rail has
   no line for. */
function DetailsTab({ book, availability }) {
  const formats = Object.keys(FORMATS).filter((f) => availability.some((a) => a.format === f))

  const facts = [
    book.series && ['Series', `${book.series.name} · Book ${book.series.number}`],
    ['Genre', book.genres.join(', ')],
    ['Reading level', book.lexile],
    ['Best for ages', book.ageRange],
    book.issue && ['Issue', book.issue],
    book.cadence && ['Published', `${book.cadence} · ${book.publisher}`],
    !book.cadence && ['Published', `${book.published} · ${book.publisher}`],
    [
      'Length',
      book.audioLength
        ? `${book.pageCount} pages · ${book.audioLength} on audio`
        : `${book.pageCount} pages`,
    ],
    ['Language', book.language],
    book.isbn && ['ISBN', book.isbn],
    formats.length && ['Formats', formats.map((f) => FORMATS[f].label).join(', ')],
    book.awards?.length && ['Recognition', book.awards.join(', ')],
  ].filter(Boolean)

  return (
    <div className="bk-details">
      <h3 className="bk-section-h">Book details</h3>
      <dl className="bk-factgrid">
        {facts.map(([k, v]) => (
          <div key={k} className="bk-fact">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/* Friends who logged this title — derived from their own reading records, so it
   always matches what their profile shows.
 *
 * A section of the Overview rather than a rail card: who you know that read it
 * is part of deciding whether to read it, which is what the Overview is for.
 * The rail beside it is the book's standing facts — your stats, where to get
 * it — and this is neither. */
function FriendsWhoRead({ book, onOpenProfile }) {
  const friends = friendsWhoRead(book.id)
  if (!friends.length) return null
  return (
    <div className="bk-section">
      <h3 className="bk-section-h">Friends who read this</h3>
      {/* The Friends page's own card, not a list of rows: these are the same
          people, and a reader who has just learned what a card of theirs looks
          like shouldn't have to learn a second shape for it here. No kebab —
          there is nothing to remove from a list of who read a book — and the
          streak pill gives way to what this list is about. */}
      <div className="fr-grid bk-fwr-grid">
        {friends.map((f) => (
          <FriendCard
            key={f.id}
            person={f}
            onOpen={() => onOpenProfile?.(f.id)}
            tag={`Logged ${f.loggedOn}`}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Where to read — the same three claims the Collection Engine makes to staff,
 * made to the reader.
 *
 * The button used to carry a per-record string (`action`), which had drifted to
 * five different words for three different situations. It carries the verb the
 * engine's `CERTAINTY` model gives instead — Read now for a licence we own,
 * Borrow for a queue we can't see, Find it for a copy the school owns — so the
 * same claim reaches staff and reader through one definition.
 */
/* Strongest claim first, the order the tags under a jacket use: what opens
   now, then what lends, then the shelves — your own classroom's before the
   library's. Within a claim, the places' own order, so the rail leads with the
   same app as the Read now button and the play mark on the jacket. */
const WHERE_RANK = { own: 0, hold: 1, shelf: 2 }

function WhereToRead({ book, availability, onRead }) {
  if (!availability.length) return null
  const rows = [...availability].sort(
    (a, b) =>
      WHERE_RANK[a.certainty] - WHERE_RANK[b.certainty] ||
      PLACE_ORDER.indexOf(a.partner) - PLACE_ORDER.indexOf(b.partner),
  )
  return (
    <SectionCard header="divider" title="Where to read">
      <div className="bk-where-list">
        {rows.map((a, i) => {
          const p = PARTNERS[a.partner]
          /* The row's own certainty, not its partner's: a Sora copy with
             nobody waiting opens now, and the same app's next title doesn't. */
          const readable = canOpen(a)
          /* Where this particular copy is. A classroom shelf names whose room
             it is in; the library's names the run and what's on the spine. */
          const shelf = a.certainty === 'shelf' ? shelfLocation(book, a.partner) : null
          return (
            <div key={i} className="bk-where-row" style={{ '--p': p.accent, '--p-soft': p.soft }}>
              <PartnerMark id={a.partner} size={34} />
              <div className="bk-where-info">
                <span className="bk-where-name">{shelf?.name ?? p.name}</span>
              </div>
              {/* A shelf has nothing to press — what it owes the reader is the
                  walk, so the button gives way to where in the room it is. */}
              {shelf ? (
                <span className="bk-where-loc">
                  <Pill color={p.accent} size="sm">
                    {shelf.area}
                  </Pill>
                </span>
              ) : (
                <button
                  className="bk-where-cta"
                  onClick={readable ? () => onRead(a.partner) : undefined}
                >
                  {readable ? CERTAINTY_CTA.own : CERTAINTY_CTA[a.certainty]}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

export function BookDetail({
  book,
  sessions = [],
  /* Correcting a number and taking a session back — the reader's own log, so
     both are theirs to change. Left off, the table is read-only. */
  onEditSession,
  onRemoveSession,
  shelf,
  onWish,
  /* Logging this book rather than picking it out of a search: the flow opens
     on this title's form. Left off, the button isn't offered. */
  onLog,
  onPlay,
  onOpen,
  onOpenProfile,
  onBack,
  backLabel = 'Back to Discover',
  userReviews,
  onAddReview,
  settings = { sora: true, scholastic: false, audiobooks: false, libby: false },
}) {
  const [tab, setTab] = useState('overview')
  const [readerVia, setReaderVia] = useState(null) // partner id the reader is open on
  const status = shelf[book.id] || null
  const wished = !!status
  // Feature flags hide Sora borrowing and audiobooks from the ways in.
  /* One rule for which ways in this site actually offers, shared with the
     shelves so a mark on a jacket and a row in this rail can't disagree — and
     so Scholastic, which was never checked here, stops appearing on a site
     that has it switched off. */
  const availability = (book.availability || []).filter((a) => rowEnabled(a, settings))
  const similar = getBooks(book.similar)
  const reviewCount = (userReviews?.length || 0) + book.reviews.length
  /* Which apps can open it, from the catalog's own rule so the button, the
     rail and the mark on every shelf agree. Every one of them, not just the
     first: a title carried by two apps the reader has is a choice, and picking
     it for them sent them to whichever happened to be listed first. */
  const readNowVias = readNowPartners(book, settings)
  const readNowVia = readNowVias[0]
  // Listen now = an audiobook borrowable from a library app (Sora / Libby).
  const hasAudio = availability.some(
    (a) => a.format === 'audiobook' && (a.partner === 'sora' || a.partner === 'libby'),
  )

  useEffect(() => {
    setTab('overview')
    window.scrollTo({ top: 0 })
  }, [book.id])

  return (
    <div className="bk-detail bp">
      <ReaderBack onClick={onBack}>{backLabel}</ReaderBack>

      <article className="bkp-card">
        <div className="bkp-main">
          {/* The cover belongs beside what names the book — the title, the
              rating and the buttons — not off in the rail with the stats. The
              tabs and the panel start under the pair of them. */}
          <div className="bkp-top">
            {/* No "read now" mark here: this page already says it twice, on
                the button and in the rail. The mark belongs on the shelves,
                where a jacket is all there is to go on. */}
            <div className="bkp-cover">
              <BookCover book={book} size="fill" />
            </div>

            <div className="bkp-topmain">
              <header className="bkp-head">
                {/* No issue line above the title. A magazine's issue is on its
                    cover, right beside this, and set as an eyebrow it read as
                    the page's heading with the title demoted under it. */}
                <h1 className="bkp-title">{book.title}</h1>
                <p className="bkp-credits">
                  <span className="bkp-person">{book.author}</span>
                  <span className="bkp-role">(Author)</span>
                </p>

                <button
                  className="bk-dhero-rating"
                  onClick={() => setTab('reviews')}
                  aria-label="See reviews"
                >
                  <RatingInline value={book.rating} count={book.ratingCount} size={18} />
                </button>
              </header>

              {/* The app's own button row, in the app's own place — under the
              credits rather than split between a hero and a rail card. */}
              <div className="bkp-buttons">
                {/* One source opens straight away. Several ask which — the same
                flyout menu the log flow's tiles use, so "where do I read this"
                is answered the same way wherever it's asked. */}
                {/* In the colour of the app it opens in — the same colour as
                    that app's tag and its play mark on the shelves. Several
                    apps: the first, which is the one the menu leads with. */}
                {readNowVias.length === 1 && (
                  <Button
                    variant="accent"
                    accent={PARTNERS[readNowVia].accent}
                    onClick={() => setReaderVia(readNowVia)}
                  >
                    Read now
                  </Button>
                )}
                {readNowVias.length > 1 && (
                  <Flyout
                    placement="bottom"
                    arrow
                    trigger={({ toggle }) => (
                      <Button
                        variant="accent"
                        accent={PARTNERS[readNowVia].accent}
                        onClick={toggle}
                      >
                        Read now
                      </Button>
                    )}
                  >
                    {({ close }) => (
                      <FlyoutMenu>
                        {readNowVias.map((id) => (
                          <FlyoutMenuItem
                            key={id}
                            onClick={() => {
                              close()
                              setReaderVia(id)
                            }}
                          >
                            Read in {PARTNERS[id].name}
                          </FlyoutMenuItem>
                        ))}
                      </FlyoutMenu>
                    )}
                  </Flyout>
                )}
                {/* Nothing here opens the book? Then the one thing the reader can
                always do leads, and it leads from the left — a row whose first
                button was "Add to Wish List" made saving it for later the
                headline action on a title they may have just finished. */}
                {!readNowVias.length && onLog && (
                  <Button onClick={() => onLog(book)}>Log reading</Button>
                )}
                {hasAudio && (
                  <Button variant="secondary" onClick={() => onPlay(book.id)}>
                    Listen now
                  </Button>
                )}
                <Button
                  variant={
                    wished || readNowVias.length || hasAudio || onLog ? 'secondary' : 'primary'
                  }
                  onClick={() => onWish(book.id)}
                >
                  {wished ? 'On your Wish List' : 'Add to Wish List'}
                </Button>
                {/* Where something *does* open the book, logging is one of the ways
                out rather than the way in. */}
                {readNowVias.length > 0 && onLog && (
                  <Button variant="secondary" onClick={() => onLog(book)}>
                    Log reading
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="bkp-tabs">
            <Tabs
              active={tab}
              onChange={setTab}
              variant="pill"
              size="md"
              block
              /* Five labels don't fit this column once the rail and the cover
                 have taken their share, and a pill group that wraps to two rows
                 reads as two controls. `collapse` renders the select; the
                 container query below decides when it shows. */
              collapse
              ariaLabel="About this book"
              items={[
                { id: 'overview', label: 'Overview' },
                { id: 'reading', label: 'Reading Log' },
                { id: 'reviews', label: 'Reviews', count: reviewCount },
                { id: 'details', label: 'Details' },
                { id: 'similar', label: 'More Like This' },
              ]}
            />
          </div>

          <div className="bkp-panel bk-tabpanel">
            {tab === 'overview' && <OverviewTab book={book} onOpenProfile={onOpenProfile} />}
            {tab === 'reading' && (
              <ReadingLogTab
                sessions={sessions}
                onEditSession={onEditSession}
                onRemoveSession={onRemoveSession}
              />
            )}
            {tab === 'reviews' && (
              <Reviews
                book={book}
                userReviews={userReviews || []}
                onAdd={(r) => onAddReview(book.id, r)}
              />
            )}
            {tab === 'details' && <DetailsTab book={book} availability={availability} />}
            {tab === 'similar' && (
              <div className="bk-similar">
                <h3 className="bk-section-h">Readers also liked</h3>
                <div className="bk-similar-grid">
                  {similar.map((b) => (
                    <BookCard
                      settings={settings}
                      key={b.id}
                      book={b}
                      onOpen={onOpen}
                      onWish={onWish}
                      wished={!!shelf[b.id]}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="bkp-aside">
          {/* No "Available as" card: Where to read already names every format,
              beside the place it comes from and what can honestly be said about
              getting it. On its own, a row of format chips said less twice. */}
          {/* Where to read leads the rail: it is the one card here a reader
              acts on — the stats under it are about what they already did. */}
          <WhereToRead book={book} availability={availability} onRead={setReaderVia} />
          <StatStrip book={book} sessions={sessions} status={status} />
        </aside>
      </article>

      {readerVia && (
        <ReadNow
          book={book}
          partner={readerVia}
          onClose={() => setReaderVia(null)}
          /* Reaching the last page isn't the same as saying you read it: the
             reader hands off to the log form, where the minutes go in and
             Finished is confirmed. Marking the shelf is that form's job now. */
          onFinish={(minutes) => {
            setReaderVia(null)
            onLog?.(book, { finished: true, minutes })
          }}
        />
      )}
    </div>
  )
}
