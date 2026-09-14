import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Avatar } from '@components/Avatar/Avatar'
import { Modal } from '@components/Modal/Modal'
import { Tabs } from '@components/Tabs/Tabs'
import { StatCard } from '@components/Cards/Cards'
import { badgeSrc, bannerSrc } from '@components/ReaderApp/ReaderApp'
import {
  BadgeArt,
  CollectionCard,
  ShelfGrid,
  ShelfHead,
} from '@components/CollectionShelf/CollectionShelf'

import { AchievementArt } from '../../books/components/AchievementArt'
import { BookCover } from '../../logging-flow/components/BookCover'
import { BOOKS, CHALLENGES } from '../../logging-flow/data'
import { getFriend } from '../data'
import './FriendProfile.css'

import '@components/Avatar/Avatar.css'
import '@components/Modal/Modal.css'
import '@components/Tabs/Tabs.css'
import '@components/Cards/Cards.css'

/**
 * A friend's profile, opened from the Friends grid or a leaderboard row.
 * Read-only, and structured the way the live friend view is: Overview /
 * Challenges / Reading Log.
 *
 * Book Discovery drew this first. This version is the same anatomy on the
 * shared parts — `StatCard` for the counters, `CollectionShelf` for the badges
 * and achievements (which were a smaller, earlier copy of that same card), the
 * real challenge banners, and `BookCover` for the log.
 */

const prettyMinutes = (m) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`)

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'log', label: 'Reading Log' },
]

function Overview({ friend }) {
  const badges = friend.badges ?? []
  const achievements = friend.achievements ?? []

  if (badges.length === 0 && achievements.length === 0) {
    return <p className="fp-empty">{friend.name} hasn&apos;t earned anything yet.</p>
  }

  return (
    <>
      {badges.length > 0 && (
        <>
          <ShelfHead as="h3" title="Earned badges" />
          <ShelfGrid>
            {badges.map((b) => (
              <CollectionCard
                key={b.name}
                art={<BadgeArt src={badgeSrc(b.set, b.art)} />}
                name={b.name}
                blurb={`Earned in ${CHALLENGES.find((c) => c.badges === b.set)?.title ?? 'a challenge'}`}
                date={`Completed on ${b.date}`}
              />
            ))}
          </ShelfGrid>
        </>
      )}

      {achievements.length > 0 && (
        <>
          <ShelfHead as="h3" title="Achievements" />
          <ShelfGrid>
            {achievements.map((a) => (
              <CollectionCard
                key={a.name}
                art={<AchievementArt art={a.art} />}
                name={a.name}
                blurb={a.detail}
                date={a.date}
              />
            ))}
          </ShelfGrid>
        </>
      )}
    </>
  )
}

function Challenges({ friend }) {
  const joined = (friend.challenges ?? [])
    .map((id) => CHALLENGES.find((c) => c.id === id))
    .filter(Boolean)

  if (joined.length === 0) {
    return <p className="fp-empty">{friend.name} isn&apos;t in any challenges right now.</p>
  }

  return (
    <ul className="fp-challenges">
      {joined.map((c) => (
        <li className="fp-challenge" key={c.id}>
          <img className="fp-challenge-art" src={bannerSrc(c.banner)} alt="" />
          <div className="fp-challenge-meta">
            <strong>{c.title}</strong>
            <span>{c.dates === 'Ongoing' ? 'Ongoing Challenge' : c.dates}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

function ReadingLog({ friend }) {
  const logged = friend.logged ?? []
  if (logged.length === 0) {
    return <p className="fp-empty">{friend.name} hasn&apos;t logged anything yet.</p>
  }
  return (
    <ul className="fp-log">
      {logged.map((entry, i) => {
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
  )
}

export function FriendProfile({ friendId, onClose }) {
  const [tab, setTab] = useState('overview')
  const friend = friendId ? getFriend(friendId) : null

  return (
    <Modal
      open={Boolean(friend)}
      onClose={onClose}
      variant="center"
      ariaLabel={friend ? `${friend.name}'s profile` : 'Friend profile'}
    >
      {friend && (
        <div className="fp">
          <button type="button" className="fp-close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>

          <header className="fp-head">
            <span className="fp-band" style={{ background: friend.color }} />
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
          </header>

          {/* The counters the leaderboards rank on, on the system's stat tile. */}
          <div className="fp-stats">
            <StatCard
              value={friend.streak}
              unit="days"
              label="Current streak"
              color="#DC493A"
              icon={<Icon name="flame-filled" size={20} />}
            />
            <StatCard
              value={friend.booksThisYear}
              label="Books this year"
              color="#1A6DD5"
              icon={<Icon name="book-2" size={20} />}
            />
            <StatCard
              value={prettyMinutes(friend.minutesLogged ?? 0)}
              label="Minutes logged"
              color="#0B6B78"
              icon={<Icon name="clock" size={20} />}
            />
          </div>

          <div className="fp-tabs">
            <Tabs
              variant="underline"
              size="sm"
              active={tab}
              accent="#1A6DD5"
              onChange={setTab}
              ariaLabel="Which part of the profile"
              items={TABS}
            />
          </div>

          <div className="fp-body">
            {tab === 'overview' && <Overview friend={friend} />}
            {tab === 'challenges' && <Challenges friend={friend} />}
            {tab === 'log' && <ReadingLog friend={friend} />}
          </div>
        </div>
      )}
    </Modal>
  )
}
