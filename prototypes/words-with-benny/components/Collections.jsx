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

// Badges and achievements are the same card in the product — circular art over
// a bold name and a line of copy, with the earned date on its own footer strip
// in green. One component, used by both panes.
function CollectionCard({ art, name, blurb, date }) {
  return (
    <article className="co-card">
      <div className="co-card-art" aria-hidden="true">
        {art}
      </div>
      <h3 className="co-card-name">{name}</h3>
      <p className="co-card-blurb">{blurb}</p>
      <div className="co-card-foot">{date}</div>
    </article>
  )
}

/**
 * Every pane gets the same head: what it holds and how much of it, over a
 * hairline. There's no separate page title — the tab strip above already says
 * you're in Collections.
 */
function ShelfHead({ title, count, noun }) {
  return (
    <header className="co-shelf-head">
      <div className="co-shelf-copy">
        <h2 className="co-shelf-title">{title}</h2>
        <p className="co-shelf-count">
          {count} {noun}
        </p>
      </div>
    </header>
  )
}

export function Collections({ collection, newestWord }) {
  const [pane, setPane] = useState('words')

  return (
    <div className="co">
      {/* The pane switcher is a full-bleed band above the title, flush under
          the main nav — the same shape the Reading Log's sub-tabs use. */}
      <div className="co-subtabs">
        <Tabs
          variant="pill"
          plain
          size="md"
          active={pane}
          onChange={setPane}
          accent="#7C3AED"
          ariaLabel="Which collection"
          className="co-panes"
          items={[
            { id: 'words', label: 'Words', count: collection.length },
            { id: 'badges', label: 'Badges', count: BADGES.length },
            { id: 'achievements', label: 'Achievements', count: ACHIEVEMENTS.length },
          ]}
        />
      </div>

      {pane === 'words' && (
        <>
          <ShelfHead title="Vocabulary" count={collection.length} noun="Words" />
          <MyWords collection={collection} newestWord={newestWord} />
        </>
      )}

      {pane === 'badges' && (
        <>
          <ShelfHead title="Earned Badges" count={BADGES.length} noun="Badges" />
          <div className="co-grid">
            {BADGES.map((b) => (
              <CollectionCard
                key={b.name}
                art={
                  <span className="co-card-disc" style={{ '--badge-color': b.color }}>
                    <Icon name={b.icon} size={38} stroke={1.7} />
                  </span>
                }
                name={b.name}
                blurb={b.blurb}
                date={b.date}
              />
            ))}
          </div>
        </>
      )}

      {pane === 'achievements' && (
        <>
          <ShelfHead title="Achievements" count={ACHIEVEMENTS.length} noun="Achievements" />
          <div className="co-grid">
            {ACHIEVEMENTS.map((a) => (
              <CollectionCard
                key={a.name}
                art={<AchievementArt art={a.art} />}
                name={a.name}
                blurb={a.detail}
                date={a.date}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
