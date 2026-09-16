import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import {
  BadgeDisc,
  CollectionCard,
  ShelfGrid,
  ShelfHead,
} from '@components/CollectionShelf/CollectionShelf'
import '@components/Tabs/Tabs.css'

// The illustrated achievement medallions already exist in the Book Discovery
// prototype — no reason to draw a second set.
import { AchievementArt } from '../../books/components/AchievementArt'

import { MyWords } from './MyWords'
import { ACHIEVEMENTS, BADGES } from '../data'

// Everything a reader has accumulated, in one place: the words Benny handed
// over, the badges they earned, and their milestone achievements. Replaces the
// dashboard's separate "All Badges" tab — three shelves of the same kind of
// thing shouldn't be three top-level destinations.

export function Collections({ collection, newestWord, cards, onReview }) {
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
          accent="#B43DD0"
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
          <ShelfHead title="Words" count={collection.length} noun="collected" />
          <MyWords
            collection={collection}
            newestWord={newestWord}
            cards={cards}
            onReview={onReview}
          />
        </>
      )}

      {pane === 'badges' && (
        <>
          <ShelfHead title="Earned Badges" count={BADGES.length} noun="Badges" />
          <ShelfGrid>
            {BADGES.map((b) => (
              <CollectionCard
                key={b.name}
                art={
                  <BadgeDisc color={b.color}>
                    <Icon name={b.icon} size={38} stroke={1.7} />
                  </BadgeDisc>
                }
                name={b.name}
                blurb={b.blurb}
                date={b.date}
              />
            ))}
          </ShelfGrid>
        </>
      )}

      {pane === 'achievements' && (
        <>
          <ShelfHead title="Achievements" count={ACHIEVEMENTS.length} noun="Achievements" />
          <ShelfGrid>
            {ACHIEVEMENTS.map((a) => (
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
    </div>
  )
}
