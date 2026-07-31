import { useState } from 'react'
import { Modal } from '@components/Modal/Modal'
import { Tabs } from '@components/Tabs/Tabs'
import { Icon } from '@components/Icon/Icon'
import { Cover } from './Cover'
import { Stars } from './Stars'
import { AchievementArt } from './AchievementArt'
import { getBook, getChallenge, friendReviews, friendRatingAverage } from '../data'

// A friend's profile, opened from the Friends grid, a leaderboard row, or the
// "Friends who read this" section on a book page. Read-only, and structured like
// the live Beanstack friend view: Overview / Challenges / Reading Log / Reviews.

const fmtMins = (m) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`)

function StatCell({ icon, color, value, label }) {
  return (
    <div className="bk-fp-stat">
      <Icon name={icon} size={18} color={color} />
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

// The stat block under the header — the same counters the leaderboards rank on,
// plus what the other tabs contain.
function StatGrid({ friend, reviews }) {
  const totalLogged = friend.logged.reduce((a, l) => a + l.minutes, 0)
  const avg = friendRatingAverage(reviews)
  return (
    <div className="bk-fp-stats">
      <StatCell icon="flame-filled" color="#F0A024" value={friend.streak} label="day streak" />
      <StatCell
        icon="book-2"
        color="#0D9488"
        value={friend.booksThisYear}
        label="books this year"
      />
      <StatCell
        icon="clock"
        color="#1D4ED8"
        value={friend.minutesLogged.toLocaleString()}
        label="minutes logged"
      />
      <StatCell
        icon="calendar"
        color="#7C3AED"
        value={fmtMins(totalLogged)}
        label="last 5 sessions"
      />
      <StatCell icon="award" color="#DB2777" value={friend.badges.length} label="badges earned" />
      <StatCell
        icon="star-filled"
        color="#F59E0B"
        value={avg ? avg.toFixed(1) : '—'}
        label={`avg of ${reviews.length} reviews`}
      />
    </div>
  )
}

function Overview({ friend }) {
  return (
    <>
      <section className="bk-fp-sec">
        <h3 className="bk-fp-sec-title">Earned badges</h3>
        <div className="bk-fp-badgerow">
          {friend.badges.map((b) => (
            <div className="bk-fp-badge" key={b.name}>
              <span className="bk-fp-badgeart" style={{ '--bc': b.color }}>
                <Icon name={b.icon} size={26} />
              </span>
              <span className="bk-fp-badgename">{b.name}</span>
              <span className="bk-fp-badgedate">{b.date}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bk-fp-sec">
        <h3 className="bk-fp-sec-title">Achievements</h3>
        {/* same tile anatomy as the badges above — art disc, name, date */}
        <ul className="bk-fp-badgerow bk-fp-badgerow--ach">
          {friend.achievements.map((a) => (
            <li className="bk-fp-badge" key={a.name}>
              <AchievementArt art={a.art} />
              <span className="bk-fp-badgename">{a.name}</span>
              {a.detail && <span className="bk-fp-badgedetail">{a.detail}</span>}
              <span className="bk-fp-badgedate">{a.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

function Challenges({ friend }) {
  const challenges = (friend.challenges || []).map(getChallenge).filter(Boolean)
  if (!challenges.length) {
    return <p className="bk-fp-empty">{friend.name} isn&apos;t in any challenges right now.</p>
  }
  return (
    <div className="bk-fp-challenges">
      {challenges.map((c) => (
        <article className="bk-fp-chcard" key={c.id}>
          <div
            className="bk-fp-chart"
            style={{
              background: `linear-gradient(120deg, ${c.art[0]}, ${c.art[1]})`,
              color: c.ink,
            }}
          >
            <span>{c.title}</span>
          </div>
          <div className="bk-fp-chmeta">
            <strong>{c.title}</strong>
            <span>{c.dates}</span>
          </div>
        </article>
      ))}
    </div>
  )
}

const LOG_PAGE_SIZE = 5

function ReadingLog({ friend, onOpenBook }) {
  // App remounts the profile per friend, so page state starts fresh on its own.
  const [page, setPage] = useState(0)

  const pages = Math.ceil(friend.logged.length / LOG_PAGE_SIZE)
  const start = page * LOG_PAGE_SIZE
  const slice = friend.logged.slice(start, start + LOG_PAGE_SIZE)

  return (
    <>
      <ul className="bk-fp-logged">
        {slice.map((entry) => {
          const book = getBook(entry.book)
          if (!book) return null
          return (
            <li key={`${entry.book}-${entry.date}`}>
              <button className="bk-fp-logrow" onClick={() => onOpenBook?.(book.id)}>
                <span className="bk-fp-logcover">
                  <Cover book={book} size="xs" />
                </span>
                <span className="bk-fp-logmeta">
                  <span className="bk-fp-logtitle">{book.title}</span>
                  <span className="bk-fp-logsub">
                    {entry.date} · {entry.minutes} min
                  </span>
                </span>
                <Icon name="chevron-right" size={16} className="bk-fp-logchev" />
              </button>
            </li>
          )
        })}
      </ul>

      {pages > 1 && (
        <nav className="bk-fp-pager" aria-label="Reading log pages">
          <button
            className="bk-fp-pagebtn"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            aria-label="Previous page"
          >
            <Icon name="chevron-left" size={16} />
          </button>
          <span className="bk-fp-pagecount">
            {start + 1}–{Math.min(start + LOG_PAGE_SIZE, friend.logged.length)} of{' '}
            {friend.logged.length} sessions
          </span>
          <button
            className="bk-fp-pagebtn"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= pages - 1}
            aria-label="Next page"
          >
            <Icon name="chevron-right" size={16} />
          </button>
        </nav>
      )}
    </>
  )
}

// Their actual reviews, read back out of the catalog.
function Reviews({ reviews, onOpenBook }) {
  if (!reviews.length) {
    return <p className="bk-fp-empty">No reviews written yet.</p>
  }
  return (
    <ul className="bk-fp-reviews">
      {reviews.map((r) => (
        <li key={r.id} className="bk-fp-review">
          <button className="bk-fp-revbook" onClick={() => onOpenBook?.(r.book.id)}>
            <span className="bk-fp-logcover">
              <Cover book={r.book} size="xs" />
            </span>
            <span className="bk-fp-revbookmeta">
              <span className="bk-fp-logtitle">{r.book.title}</span>
              <span className="bk-fp-revstars">
                <Stars value={r.stars} size={13} />
                <span className="bk-fp-logsub">{r.date}</span>
              </span>
            </span>
          </button>
          <p className="bk-fp-revbody">{r.body}</p>
          <span className="bk-fp-revfoot">
            {r.verified && (
              <span className="bk-fp-revverified">
                <Icon name="circle-check-filled" size={13} color="#16A97A" /> Verified read
              </span>
            )}
            <span className="bk-fp-revhelpful">
              <Icon name="thumb-up" size={13} /> {r.helpful} found this helpful
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

// App keys this on the friend id, so each open starts fresh on Overview — no
// tab-resetting effect needed.
export function FriendProfile({ friend, onClose, onOpenBook }) {
  const [tab, setTab] = useState('overview')

  if (!friend) return null

  const reviews = friendReviews(friend.id)

  return (
    <Modal
      open={!!friend}
      onClose={onClose}
      variant="center"
      ariaLabel={`${friend.name}'s profile`}
    >
      <div className="bk-fp">
        <button className="bk-fp-close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={18} />
        </button>

        <header className="bk-fp-head" style={{ '--accent': friend.color }}>
          <span className="bk-fp-avatar" style={{ background: friend.color }}>
            {friend.avatar ? <img src={friend.avatar} alt="" /> : friend.initials}
          </span>
          <h2>{friend.name}</h2>
          <p>
            {friend.grade}
            {friend.since ? ` · ${friend.since}` : ''}
          </p>
        </header>

        <StatGrid friend={friend} reviews={reviews} />

        <div className="bk-fp-tabs">
          <Tabs
            variant="underline"
            size="sm"
            active={tab}
            accent="#0DA7BC"
            onChange={setTab}
            items={[
              { id: 'overview', label: 'Overview' },
              { id: 'challenges', label: 'Challenges' },
              { id: 'log', label: 'Reading Log' },
              { id: 'reviews', label: 'Reviews & Ratings' },
            ]}
          />
        </div>

        <div className="bk-fp-body">
          {tab === 'overview' && <Overview friend={friend} />}
          {tab === 'challenges' && <Challenges friend={friend} />}
          {tab === 'log' && <ReadingLog friend={friend} onOpenBook={onOpenBook} />}
          {tab === 'reviews' && <Reviews reviews={reviews} onOpenBook={onOpenBook} />}
        </div>
      </div>
    </Modal>
  )
}
