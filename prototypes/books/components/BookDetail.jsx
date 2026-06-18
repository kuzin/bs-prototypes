import { useState, useEffect } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Cover } from './Cover'
import { RatingInline } from './Stars'
import { BookCard } from './BookCard'
import { Reviews } from './Reviews'
import { ReadNow } from './ReadNow'
import { ExpandableText } from './ExpandableText'
import { PartnerMark } from './PartnerBits'
import { GENRES, FORMATS, PARTNERS, getBooks } from '../data'

const isMagazine = (book) => book.formats.includes('magazine') && !book.formats.includes('print')
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
  { bg: '#FEF3C7', color: '#B45309' },
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

function FormatChips({ formats }) {
  return (
    <span className="bk-formatchips">
      <span className="bk-avail-label">Available as</span>
      {formats.map((f) => (
        <span key={f} className="bk-formatchip">
          <Icon name={FORMATS[f].icon} size={14} />
          {FORMATS[f].label}
        </span>
      ))}
    </span>
  )
}

// Per-book reading stats — a compact card in the rail.
function StatStrip({ book, sessions, status }) {
  const totalMin = sessions.reduce((a, s) => a + s.minutes, 0)
  const stats = [
    { value: totalMin ? fmtMins(totalMin) : '0m', label: 'Minutes read' },
    { value: status === 'finished' ? 1 : 0, label: 'Times read' },
    { value: sessions.length, label: sessions.length === 1 ? 'Session' : 'Sessions' },
    { value: book.readersAtSchool, label: 'Readers at school' },
  ]
  return (
    <div className="bk-rail-card">
      <h3 className="bk-rail-title">
        <Icon name="chart-bar" size={16} /> Your stats
      </h3>
      <div className="bk-statgrid">
        {stats.map((s) => (
          <div key={s.label} className="bk-statcell">
            <span className="bk-statcell-val">{s.value}</span>
            <span className="bk-statcell-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SessionRow({ s }) {
  return (
    <li className="bk-readlog-row">
      <span className="bk-readlog-fmt">
        <Icon name={FORMATS[s.format]?.icon || 'book-2'} size={15} />
      </span>
      <div className="bk-readlog-main">
        <span className="bk-readlog-date">{s.date}</span>
        <span className="bk-readlog-meta">
          {fmtMins(s.minutes)}
          {s.fromPage && s.toPage ? ` · p. ${s.fromPage}–${s.toPage}` : ''} ·{' '}
          {FORMATS[s.format].label}
        </span>
      </div>
    </li>
  )
}

// Full reading log — its own tab.
function ReadingLogTab({ book, sessions, status }) {
  const total = sessions.reduce((a, s) => a + s.minutes, 0)
  const prog = status === 'reading' ? readProgress(book, sessions) : null
  return (
    <div className="bk-readlog">
      <div className="bk-readlog-head">
        <h3 className="bk-section-h">
          <Icon name="reading-log" size={16} /> Your reading
        </h3>
        {sessions.length > 0 && (
          <span className="bk-readlog-sum">
            {sessions.length} session{sessions.length > 1 ? 's' : ''} · {fmtMins(total)} total
          </span>
        )}
      </div>

      {prog && (
        <div className="bk-readlog-progress">
          <div className="bk-readlog-pbar">
            <span style={{ width: `${prog.pct}%` }} />
          </div>
          <span className="bk-readlog-ptext">
            p. {prog.toPage} of {book.pageCount} · {prog.pct}%
          </span>
        </div>
      )}

      {sessions.length > 0 ? (
        <ul className="bk-readlog-list">
          {sessions.map((s, i) => (
            <SessionRow key={i} s={s} />
          ))}
        </ul>
      ) : (
        <p className="bk-readlog-empty">No sessions logged yet — track your minutes as you read.</p>
      )}
    </div>
  )
}

// Compact preview shown in Overview — latest session + a link to the full tab.
function ReadingPreview({ sessions, onView }) {
  const total = sessions.reduce((a, s) => a + s.minutes, 0)
  return (
    <div className="bk-readlog bk-readlog--preview">
      <div className="bk-readlog-head">
        <h3 className="bk-section-h">
          <Icon name="reading-log" size={16} /> Your reading
        </h3>
        <span className="bk-readlog-sum">
          {sessions.length} session{sessions.length > 1 ? 's' : ''} · {fmtMins(total)} total
        </span>
      </div>
      <ul className="bk-readlog-list">
        <SessionRow s={sessions[0]} />
      </ul>
      <button className="bk-readlog-viewlog" onClick={onView}>
        View reading log <Icon name="arrow-right" size={14} />
      </button>
    </div>
  )
}

function OverviewTab({ book, sessions, onViewReading }) {
  const { synopsis, about } = splitDescription(book.description)
  return (
    <div className="bk-overview">
      {sessions.length > 0 && <ReadingPreview sessions={sessions} onView={onViewReading} />}

      <div className="bk-section">
        <h3 className="bk-section-h bk-section-h--benny">
          Benny’s take <Icon name="sparkles" size={15} />
        </h3>
        <div className="bk-benny-take">
          <img src="/bs-prototypes/benny-happy.svg" alt="" className="bk-benny-take-avatar" />
          <div className="bk-benny-take-bubble">
            <p>{book.bennyTake}</p>
          </div>
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
            const c = GENRES[g] || { bg: '#E2E8F0', color: '#334155' }
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

function WhereToRead({ availability, onRead }) {
  if (!availability.length) return null
  return (
    <div className="bk-rail-card">
      <h3 className="bk-rail-title">
        <Icon name="bolt" size={16} /> Where to read
      </h3>
      <div className="bk-where-list">
        {availability.map((a, i) => {
          const p = PARTNERS[a.partner]
          const isAudio = a.format === 'audiobook'
          const readable = a.partner === 'comicsplus'
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
              <button className="bk-where-cta" onClick={readable ? onRead : undefined}>
                {a.action}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function BookDetail({
  book,
  sessions = [],
  shelf,
  onWish,
  onFinish,
  onPlay,
  onOpen,
  onBack,
  backLabel = 'Discover',
  userReviews,
  onAddReview,
  settings = { sora: true, scholastic: true, audiobooks: true, libby: false },
}) {
  const [tab, setTab] = useState('overview')
  const [reader, setReader] = useState(false)
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
  const readNow = availability.some(
    (a) =>
      (a.partner === 'comicsplus' || a.partner === 'scholastic') &&
      (a.format === 'ebook' || a.format === 'magazine'),
  )
  // Listen now = an audiobook borrowable from a library app (Sora / Libby).
  const hasAudio = availability.some(
    (a) => a.format === 'audiobook' && (a.partner === 'sora' || a.partner === 'libby'),
  )

  useEffect(() => {
    setTab('overview')
    window.scrollTo({ top: 0 })
  }, [book.id])

  return (
    <div className="bk-detail">
      <div className="bk-backbar">
        <button className="bk-back" onClick={onBack}>
          <Icon name="arrow-left" size={16} /> {backLabel}
        </button>
      </div>

      {/* Hero — book identity */}
      <header className="bk-dhero" style={{ '--accent': book.color }}>
        <div className="bk-dhero-glow" aria-hidden="true" />
        <div className="bk-dhero-inner">
          <div className="bk-dhero-coverwrap">
            <Cover book={book} size="lg" />
          </div>

          <div className="bk-dhero-content">
            {book.issue && <span className="bk-dhero-series">{book.issue}</span>}
            <h1 className="bk-dhero-title">{book.title}</h1>
            <p className="bk-dhero-author">by {book.author}</p>

            <button className="bk-dhero-rating" onClick={() => setTab('reviews')}>
              <RatingInline value={book.rating} count={book.ratingCount} size={18} />
              <span className="bk-dhero-rating-link">See reviews</span>
            </button>

            <FormatChips formats={formats} />

            {(readNow || hasAudio) && (
              <div className="bk-hero-ctas">
                {readNow && (
                  <button className="bk-readnow" onClick={() => setReader(true)}>
                    <Icon name="device-tablet" size={15} /> Read now
                  </button>
                )}
                {hasAudio && (
                  <button className="bk-readnow bk-readnow--audio" onClick={() => onPlay(book.id)}>
                    <Icon name="headphones" size={15} /> Listen now
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body — main column + rail */}
      <div className="bk-dbody">
        <div className="bk-dmain">
          <Tabs
            active={tab}
            onChange={setTab}
            variant="underline"
            accent={book.color}
            items={[
              { id: 'overview', label: 'Overview' },
              { id: 'reading', label: 'Reading Log' },
              { id: 'reviews', label: 'Reviews', count: reviewCount },
              { id: 'details', label: 'Details' },
              { id: 'similar', label: 'More Like This' },
            ]}
          />
          <div className="bk-tabpanel">
            {tab === 'overview' && (
              <OverviewTab
                book={book}
                sessions={sessions}
                onViewReading={() => setTab('reading')}
              />
            )}
            {tab === 'reading' && <ReadingLogTab book={book} sessions={sessions} status={status} />}
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
                <h3 className="bk-section-h">More Like This</h3>
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

        <aside className="bk-drail">
          <div className="bk-rail-card bk-rail-actions">
            <Button
              variant={wished ? 'secondary' : 'primary'}
              size="md"
              onClick={() => onWish(book.id)}
            >
              {wished ? 'On your shelf' : 'Add to shelf'}
            </Button>
            <Button variant="secondary" size="md">
              Log reading
            </Button>
          </div>
          <StatStrip book={book} sessions={sessions} status={status} />
          <WhereToRead availability={availability} onRead={() => setReader(true)} />
        </aside>
      </div>

      {reader && (
        <ReadNow book={book} onClose={() => setReader(false)} onFinish={() => onFinish(book.id)} />
      )}
    </div>
  )
}
