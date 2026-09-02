import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import '@components/Tabs/Tabs.css'

// The illustrated achievement medallions already exist in the Book Discovery
// prototype — no reason to draw a second set.
import { AchievementArt } from '../../books/components/AchievementArt'

import { MyWords } from './MyWords'
import { ACHIEVEMENTS, BADGES } from '../data'
import './Collections.css'

// Everything a reader has accumulated, in one place: the words Benny handed
// over, the badges they earned, and their milestone achievements. Replaces the
// dashboard's separate "All Badges" tab — three shelves of the same kind of
// thing shouldn't be three top-level destinations.

function BadgeDisc({ badge }) {
  return (
    <article
      className={`co-badge${badge.locked ? ' is-locked' : ''}`}
      style={{ '--badge-color': badge.color }}
    >
      <span className="co-badge-disc">
        <Icon name={badge.locked ? 'lock' : badge.icon} size={26} />
      </span>
      <h3 className="co-badge-name">{badge.name}</h3>
      <p className="co-badge-meta">{badge.locked ? badge.hint : `Earned ${badge.date}`}</p>
    </article>
  )
}

function AchievementCard({ item }) {
  return (
    <article className="co-ach">
      <div className="co-ach-art" aria-hidden="true">
        <AchievementArt art={item.art} />
      </div>
      <div className="co-ach-text">
        <h3 className="co-ach-name">{item.name}</h3>
        <p className="co-ach-detail">{item.detail}</p>
        <p className="co-ach-date">{item.date}</p>
      </div>
    </article>
  )
}

export function Collections({ collection, reader, newestWord }) {
  const [pane, setPane] = useState('words')
  const earned = BADGES.filter((b) => !b.locked).length

  return (
    <div className="co">
      {/* Same shape as the Reading Log's own header next door — a plain title
          row, no coloured banner. */}
      <header className="co-head">
        <div className="co-head-copy">
          <h1 className="co-title">{reader.name}’s Collections</h1>
          <p className="co-sub">
            Everything you’ve picked up by reading — words, badges and milestones. Nobody assigned
            any of it.
          </p>
        </div>
        <div className="co-benny">
          <img src="/bs-prototypes/benny-happy.svg" alt="" className="co-benny-face" />
          <p className="co-benny-line">
            {collection.length >= 12
              ? `${collection.length} words and ${earned} badges! Keep logging.`
              : 'Log some reading and I’ll dig up a word for you.'}
          </p>
        </div>
      </header>

      <Tabs
        variant="pill"
        size="md"
        active={pane}
        onChange={setPane}
        accent="#7C3AED"
        ariaLabel="Which collection"
        className="co-panes"
        items={[
          { id: 'words', label: 'Words', count: collection.length },
          { id: 'badges', label: 'Badges', count: earned },
          { id: 'achievements', label: 'Achievements', count: ACHIEVEMENTS.length },
        ]}
      />

      {pane === 'words' && <MyWords collection={collection} newestWord={newestWord} />}

      {pane === 'badges' && (
        <div className="co-badgegrid">
          {BADGES.map((b) => (
            <BadgeDisc key={b.name} badge={b} />
          ))}
        </div>
      )}

      {pane === 'achievements' && (
        <div className="co-achgrid">
          {ACHIEVEMENTS.map((a) => (
            <AchievementCard key={a.name} item={a} />
          ))}
        </div>
      )}
    </div>
  )
}
