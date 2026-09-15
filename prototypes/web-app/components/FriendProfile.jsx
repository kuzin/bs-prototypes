import { useEffect, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Avatar } from '@components/Avatar/Avatar'
import { Button } from '@components/Button/Button'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { Tabs } from '@components/Tabs/Tabs'
import { StatCard } from '@components/Cards/Cards'
import { EmptyState } from '@components/Primitives/Primitives'
import { ChallengeCard, badgeSrc } from '@components/ReaderApp/ReaderApp'
import { BadgeArt, CollectionCard, ShelfHead } from '@components/CollectionShelf/CollectionShelf'

import { AchievementArt } from '../../books/components/AchievementArt'
import { BookCover } from '../../logging-flow/components/BookCover'
import { BOOKS, CHALLENGES } from '../../logging-flow/data'
import { getFriend } from '../data'
import './FriendProfile.css'

import '@components/Avatar/Avatar.css'
import '@components/Button/Button.css'
import '@components/Modal/Modal.css'
import '@components/Tabs/Tabs.css'
import '@components/Cards/Cards.css'
import '@components/Primitives/Primitives.css'

/**
 * A friend's profile, opened from the Friends grid or a leaderboard row.
 *
 * Anatomy from the app's own `friendships/_friend_modal.html.haml`: a
 * full-bleed band in the friend's colour ending in the scalloped curve, their
 * avatar hung over it, the name, and the tabs — Overview / Challenges /
 * Reading Log — inside that header rather than under it. Overview is Latest
 * badges, Latest achievements, then Statistics, in that order; the counters
 * live in the tab, not the header.
 *
 * The parts are ours: `BadgeArt` on a horizontal strip for the badges and
 * achievements (the app's own `.badges-container` is a row of thumbnails, not a
 * wall of cards), `StatCard` stacked into the Statistics list, `ChallengeCard`
 * for the challenges, `BookCover` for the log, `EmptyState` where a section has
 * nothing in it.
 */

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'log', label: 'Reading Log' },
]

// The Reading Log tab shows the latest few; the rest are behind "View full
// reading log", which is its own modal in the app.
const LOG_PREVIEW = 3

const prettyMinutes = (m) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`)

/**
 * The band's bottom edge. Two overlapping scallops in the friend's colour with
 * a 3% black shade between them — `.friend-modal-curve`, path for path. Drawn
 * artwork rather than a glyph, so it stays inline SVG.
 */
function HeaderCurve({ color }) {
  return (
    <svg
      className="fp-curve"
      viewBox="0 0 480 40"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 0H480V40C410.88 30.6667 330.667 26 239.36 26C148.053 26 68.2667 30.6667 0 40V0Z"
        fill={color}
      />
      <path
        d="M0 0H480V40C410.88 30.6667 330.667 26 239.36 26C148.053 26 68.2667 30.6667 0 40V0Z"
        fill="black"
        fillOpacity="0.03"
      />
      <path
        d="M480 0C411.733 9.33333 331.947 14 240.64 14C149.333 14 69.12 9.33333 0 0H480Z"
        fill={color}
      />
    </svg>
  )
}

/** The app's `.badges-container`: a row of earned things, scrolled if it
    overruns. They are the design system's own `CollectionCard` at `sm` — the
    same card All Badges and the challenge page use, so a badge looks like a
    badge wherever you meet one. They were art over a name with everything else
    on a tooltip, which is a thing you have to hover to read. */
function EarnedStrip({ children }) {
  return <div className="fp-strip">{children}</div>
}

function Overview({ friend }) {
  const badges = friend.badges ?? []
  const achievements = friend.achievements ?? []

  return (
    <>
      <ShelfHead as="h3" title="Latest badges" />
      {badges.length > 0 ? (
        <EarnedStrip>
          {badges.map((b) => (
            <CollectionCard
              key={b.name}
              size="sm"
              art={<BadgeArt src={badgeSrc(b.set, b.art)} />}
              name={b.name}
              blurb={CHALLENGES.find((c) => c.badges === b.set)?.title ?? 'A challenge'}
              date={b.date}
            />
          ))}
        </EarnedStrip>
      ) : (
        <EmptyState
          variant="dashed"
          title="No badges to show"
          description={`${friend.name} hasn't earned any badges yet.`}
        />
      )}

      <ShelfHead as="h3" title="Latest achievements" />
      {achievements.length > 0 ? (
        <EarnedStrip>
          {achievements.map((a) => (
            <CollectionCard
              key={a.name}
              size="sm"
              art={<AchievementArt art={a.art} />}
              name={a.name}
              blurb={a.detail}
              date={a.date}
            />
          ))}
        </EarnedStrip>
      ) : (
        <EmptyState
          variant="dashed"
          title="No achievements to show"
          description={`${friend.name} hasn't earned any achievements yet.`}
        />
      )}

      {/* The app's Statistics block: both streaks, then what they've read. */}
      <ShelfHead as="h3" title="Statistics" />
      <div className="fp-stats">
        <StatCard
          value={friend.streak}
          unit="days"
          label="Current streak"
          color="#DC493A"
          icon={<Icon name="flame-filled" size={20} />}
        />
        <StatCard
          value={friend.longestStreak}
          unit="days"
          label="Longest streak"
          color="#D97706"
          icon={<Icon name="trophy" size={20} />}
        />
        <StatCard
          value={prettyMinutes(friend.minutesLogged ?? 0)}
          label="Minutes read"
          color="#0B6B78"
          icon={<Icon name="clock" size={20} />}
        />
        <StatCard
          value={friend.booksThisYear}
          label="Books logged"
          color="#1A6DD5"
          icon={<Icon name="book-2" size={20} />}
        />
      </div>
    </>
  )
}

function Challenges({ friend }) {
  const joined = (friend.challenges ?? [])
    .map((id) => CHALLENGES.find((c) => c.id === id))
    .filter(Boolean)

  if (joined.length === 0) {
    return (
      <EmptyState
        variant="dashed"
        title="No challenges here"
        description={`${friend.name} isn't in any challenges right now.`}
      />
    )
  }

  // The card is read-only here — it's someone else's challenge, so no `onOpen`.
  return (
    <div className="fp-challenges">
      {joined.map((c) => (
        <ChallengeCard key={c.id} challenge={c} />
      ))}
    </div>
  )
}

function ReadingLog({ friend }) {
  const logged = friend.logged ?? []
  const [full, setFull] = useState(false)

  if (logged.length === 0) {
    return (
      <EmptyState
        variant="dashed"
        title="No titles to show"
        description={`${friend.name} hasn't logged any titles yet.`}
      />
    )
  }

  const shown = full ? logged : logged.slice(0, LOG_PREVIEW)

  return (
    <>
      <ul className="fp-log">
        {shown.map((entry, i) => {
          const book = BOOKS[entry.book]
          return (
            <li className="fp-log-row" key={`${entry.book}-${i}`}>
              <span className="fp-log-cover">
                <BookCover book={book} size="fill" />
              </span>
              <span className="fp-log-meta">
                <span className="fp-log-title">{book.title}</span>
                <span className="fp-log-author">{book.author}</span>
              </span>
              <span className="fp-log-when">
                <strong>{entry.minutes} min</strong>
                {entry.date}
              </span>
            </li>
          )
        })}
      </ul>
      {logged.length > LOG_PREVIEW && !full && (
        <Button variant="secondary" onClick={() => setFull(true)} className="fp-log-more">
          View full reading log
        </Button>
      )}
    </>
  )
}

export function FriendProfile({ friendId, onClose }) {
  const [tab, setTab] = useState('overview')
  const friend = friendId ? getFriend(friendId) : null

  // Every friend opens on Overview — the app fetches the modal fresh each time,
  // so the tab a previous friend was left on shouldn't carry over.
  useEffect(() => {
    if (friendId) setTab('overview')
  }, [friendId])

  return (
    <Modal
      open={Boolean(friend)}
      onClose={onClose}
      variant="center"
      ariaLabel={friend ? `${friend.name}'s profile` : 'Friend profile'}
      closeBadge
    >
      {friend && (
        <>
          <ModalClose onClick={onClose} />
          <div className="fp">
            <header className="fp-head">
              {/* Full-bleed, corner to corner, the way the app's own
                  `.friend-modal-bg` is — the avatar sits over it. */}
              <div className="fp-band" style={{ background: friend.color }} />
              <HeaderCurve color={friend.color} />
              <Avatar
                initials={friend.initials}
                src={friend.avatar ?? undefined}
                color={friend.color}
                size="xl"
                className="fp-avatar"
              />
              <h2 className="fp-name">{friend.name}</h2>
              <p className="fp-sub">
                {friend.grade}
                {friend.since ? ` · ${friend.since}` : ''}
              </p>
              <Tabs
                variant="underline"
                size="sm"
                center
                active={tab}
                accent="#1A6DD5"
                onChange={setTab}
                ariaLabel="Which part of the profile"
                items={TABS}
                className="fp-tabs"
              />
            </header>

            <div className="fp-body">
              {tab === 'overview' && <Overview friend={friend} />}
              {tab === 'challenges' && <Challenges friend={friend} />}
              {tab === 'log' && <ReadingLog friend={friend} />}
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
