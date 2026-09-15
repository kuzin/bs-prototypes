import { useState, useEffect } from 'react'
import { Icon } from '@components/Icon/Icon'
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
import { RatingInline } from './Stars'
import { BookCard } from './BookCard'
import { Reviews } from './Reviews'
import { ReadNow } from './ReadNow'
import { ExpandableText } from './ExpandableText'
import { PartnerMark } from './PartnerBits'
import { Avatar } from '@components/Avatar/Avatar'
import { GENRES, FORMATS, PARTNERS, getBooks, friendsWhoRead } from '../data'

const isMagazine = (book) => book.formats.includes('magazine') && !book.formats.includes('print')

// Partners with an in-app reader — "Read now" opens it, branded for that partner.
const READABLE_PARTNERS = ['comicsplus', 'scholastic']
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

// What this title comes in. A rail card rather than a line under the credits:
// it is a fact about the book, like its stats and where to read it, not part of
// what the book is called.
function FormatChips({ formats }) {
  return (
    <SectionCard header="divider" title="Available as">
      <span className="bk-formatchips">
        {formats.map((f) => (
          <span key={f} className="bk-formatchip">
            <Icon name={FORMATS[f].icon} size={14} />
            {FORMATS[f].label}
          </span>
        ))}
      </span>
    </SectionCard>
  )
}

// Per-book reading stats — a compact card in the rail.
function StatStrip({ book, sessions, status }) {
  const totalMin = sessions.reduce((a, s) => a + s.minutes, 0)
  const stats = [
    { value: totalMin ? fmtMins(totalMin) : '0m', label: 'Minutes read', c: '#0B6B78' },
    { value: status === 'finished' ? 1 : 0, label: 'Times read', c: '#0F7A55' },
    {
      value: sessions.length,
      label: sessions.length === 1 ? 'Session' : 'Sessions',
      c: '#1A6DD5',
    },
    { value: book.readersAtSchool, label: 'Readers at school', c: '#5B21B6' },
  ]
  return (
    <SectionCard header="divider" title="Your stats">
      <div className="bk-statgrid">
        {stats.map((s) => (
          <StatCard key={s.label} value={s.value} label={s.label} color={s.c} />
        ))}
      </div>
    </SectionCard>
  )
}

/**
 * This title's reading log — web-app's `BookPage` Reading Log tab: two of the
 * reading log's own stat tiles over the design system's table.
 *
 * It was a tinted panel with a list of rows inside it, which is a card where
 * the app has a table — a session is a date, an amount, what of the book it
 * covered and what it was read on, and none of those reads as a sentence.
 */
function ReadingLogTab({ book, sessions, status, onEditSession, onRemoveSession }) {
  const [editing, setEditing] = useState(null) // session index being corrected
  const [draft, setDraft] = useState('')
  const [removing, setRemoving] = useState(null) // session awaiting confirmation
  const total = sessions.reduce((a, s) => a + s.minutes, 0)
  const prog = status === 'reading' ? readProgress(book, sessions) : null

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

      <div className="bkp-readnums">
        <StatCard
          value={sessions.length}
          label={sessions.length === 1 ? 'Session' : 'Sessions'}
          color="#B45309"
          icon={<Icon name="calendar" size={20} />}
        />
        <StatCard
          value={fmtMins(total)}
          label="Minutes"
          color="#0B6B78"
          icon={<Icon name="clock" size={20} />}
        />
      </div>

      {/* How far through the book those sessions have got — the one thing a
          list of dates can't say, on the system's own bar and in a card of its
          own rather than a hairline floating between two blocks. */}
      {prog && (
        <SectionCard className="bk-progresscard">
          <ProgressBar
            value={prog.toPage}
            max={book.pageCount}
            color="#0D9488"
            label="How far you’ve got"
            subLabel={`Page ${prog.toPage} of ${book.pageCount}`}
            valueLabel={`${prog.pct}%`}
          />
        </SectionCard>
      )}

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
          {
            key: 'pages',
            label: 'Pages',
            width: 130,
            render: (_v, s) => (s.fromPage && s.toPage ? `p. ${s.fromPage}–${s.toPage}` : '—'),
          },
          {
            key: 'format',
            label: 'Format',
            width: 130,
            render: (_v, s) => (
              <span className="bk-session-fmt">
                <Icon name={FORMATS[s.format]?.icon || 'book-2'} size={15} />
                {FORMATS[s.format]?.label}
              </span>
            ),
          },
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

function OverviewTab({ book }) {
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
        <h3 className="bk-section-h">Synopsis</h3>
        <p className="bk-synopsis">{synopsis}</p>
      </div>

      <div className="bk-section">
        <h3 className="bk-section-h">About this {isMagazine(book) ? 'issue' : 'book'}</h3>
        <ExpandableText text={about} lines={3} className="bk-desc" />
      </div>

      <div className="bk-section">
        <h3 className="bk-section-h">Genres + Themes</h3>
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
          {book.themes.map((t, i) => {
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
    </div>
  )
}

function DetailsTab({ book }) {
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
    ['Formats', book.formats.map((f) => FORMATS[f].label).join(', ')],
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

// Friends who logged this title — derived from their own reading records, so it
// always matches what their profile shows.
function FriendsWhoRead({ book, onOpenProfile }) {
  const friends = friendsWhoRead(book.id)
  if (!friends.length) return null
  return (
    <SectionCard header="divider" title="Friends who read this">
      <div className="bk-fwr-list">
        {friends.map((f) => (
          <button key={f.id} className="bk-fwr-row" onClick={() => onOpenProfile?.(f.id)}>
            <Avatar initials={f.initials} color={f.color} size="sm" />
            <span className="bk-fwr-info">
              <span className="bk-fwr-name">{f.name}</span>
              <span className="bk-fwr-meta">Logged {f.loggedOn}</span>
            </span>
            <Icon name="chevron-right" size={15} className="bk-fwr-chev" />
          </button>
        ))}
      </div>
    </SectionCard>
  )
}

function WhereToRead({ availability, onRead }) {
  if (!availability.length) return null
  return (
    <SectionCard header="divider" title="Where to read">
      <div className="bk-where-list">
        {availability.map((a, i) => {
          const p = PARTNERS[a.partner]
          const isAudio = a.format === 'audiobook'
          const readable =
            READABLE_PARTNERS.includes(a.partner) &&
            (a.format === 'ebook' || a.format === 'magazine')
          return (
            <div key={i} className="bk-where-row" style={{ '--p': p.accent, '--p-soft': p.soft }}>
              <PartnerMark id={a.partner} size={34} />
              <div className="bk-where-info">
                <span className="bk-where-name">{p.name}</span>
                <span className="bk-where-meta">
                  <Icon name={isAudio ? 'headphones' : FORMATS[a.format].icon} size={12} />
                  {FORMATS[a.format].label}
                </span>
              </div>
              <button
                className="bk-where-cta"
                onClick={readable ? () => onRead(a.partner) : undefined}
              >
                {a.action}
              </button>
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
  onFinish,
  onPlay,
  onOpen,
  onOpenProfile,
  onBack,
  backLabel = 'Back to Discover',
  userReviews,
  onAddReview,
  settings = { sora: true, scholastic: true, audiobooks: true, libby: false },
}) {
  const [tab, setTab] = useState('overview')
  const [readerVia, setReaderVia] = useState(null) // partner id the reader is open on
  const status = shelf[book.id] || null
  const wished = !!status
  // Feature flags hide Sora borrowing + audiobooks from availability + formats.
  const availability = (book.availability || []).filter(
    (a) =>
      (a.partner !== 'sora' || settings.sora) &&
      (a.partner !== 'libby' || settings.libby) &&
      (a.format !== 'audiobook' || settings.audiobooks),
  )
  const formats = book.formats.filter((f) => f !== 'audiobook' || settings.audiobooks)
  const similar = getBooks(book.similar)
  const reviewCount = (userReviews?.length || 0) + book.reviews.length
  // Read now = an ebook/magazine on an in-app reader (Comics Plus / Scholastic).
  // Keep the partner, not just a boolean — the reader brands itself with it.
  const readNowVia = availability.find(
    (a) =>
      READABLE_PARTNERS.includes(a.partner) && (a.format === 'ebook' || a.format === 'magazine'),
  )?.partner
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
        {/* Its own cell rather than the rail's first child: stacked, the cover
            belongs at the top with the title, not after the rail. */}
        <div className="bkp-cover">
          <BookCover book={book} size="fill" />
        </div>

        <div className="bkp-main">
          <header className="bkp-head">
            {book.issue && <span className="bk-dhero-series">{book.issue}</span>}
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
            {readNowVia && <Button onClick={() => setReaderVia(readNowVia)}>Read now</Button>}
            {hasAudio && (
              <Button
                variant={readNowVia ? 'secondary' : 'primary'}
                onClick={() => onPlay(book.id)}
              >
                Listen now
              </Button>
            )}
            <Button
              variant={wished || readNowVia || hasAudio ? 'secondary' : 'primary'}
              onClick={() => onWish(book.id)}
            >
              {wished ? 'On your shelf' : 'Add to shelf'}
            </Button>
            <Button variant="secondary">Log reading</Button>
          </div>

          <div className="bkp-tabs">
            <Tabs
              active={tab}
              onChange={setTab}
              variant="pill"
              size="md"
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
            {tab === 'overview' && <OverviewTab book={book} />}
            {tab === 'reading' && (
              <ReadingLogTab
                book={book}
                sessions={sessions}
                status={status}
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
            {tab === 'details' && <DetailsTab book={book} />}
            {tab === 'similar' && (
              <div className="bk-similar">
                <h3 className="bk-section-h">Readers also liked</h3>
                <div className="bk-similar-grid">
                  {similar.map((b) => (
                    <BookCard
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
          <FormatChips formats={formats} />
          <StatStrip book={book} sessions={sessions} status={status} />
          <FriendsWhoRead book={book} onOpenProfile={onOpenProfile} />
          <WhereToRead availability={availability} onRead={setReaderVia} />
        </aside>
      </article>

      {readerVia && (
        <ReadNow
          book={book}
          partner={readerVia}
          onClose={() => setReaderVia(null)}
          onFinish={() => onFinish(book.id)}
        />
      )}
    </div>
  )
}
