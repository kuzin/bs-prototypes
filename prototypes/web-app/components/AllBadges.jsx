import { useState } from 'react'
import { Tabs } from '@components/Tabs/Tabs'
import { badgeSrc } from '@components/ReaderApp/ReaderApp'
import { Icon } from '@components/Icon/Icon'
import {
  BadgeShelf,
  CollectionCard,
  ShelfGrid,
  ShelfHead,
} from '@components/CollectionShelf/CollectionShelf'
import '@components/Tabs/Tabs.css'

// The illustrated achievement medallions already exist in the Book Discovery
// prototype — no reason to draw a second set.
import { AchievementArt } from '../../books/components/AchievementArt'

import { ACHIEVEMENTS, BADGES } from '../data'

/**
 * All Badges — everything the reader has earned, and what is still to come.
 *
 * The profile page splits this two ways (`_badges_and_achievements_tabs`:
 * "Earned Badges" | "Achievements") and lists only what has been **earned**.
 * That is the whole of it: an unearned badge belongs to a challenge, and you
 * see it on that challenge's own Badges tab, grayed with its requirement in the
 * footer. A reader's collection is what they have collected, so the only filter
 * here is the badge's type.
 */
/* Only what the reader has. Unearned badges live on a challenge's Badges tab
   and nowhere else. */
const EARNED = BADGES.filter((b) => !b.locked)

export function AllBadges() {
  const [pane, setPane] = useState('badges')

  return (
    <div className="co">
      {/* The pane switcher sits on a full-bleed band flush under the main nav —
          the same shape the Reading Log's sub-tabs use next door. */}
      <div className="co-subtabs">
        <Tabs
          variant="pill"
          plain
          size="md"
          active={pane}
          onChange={setPane}
          accent="#1A6DD5"
          ariaLabel="Which collection"
          items={[
            { id: 'badges', label: 'Badges', count: EARNED.length },
            { id: 'achievements', label: 'Achievements', count: ACHIEVEMENTS.length },
          ]}
        />
      </div>

      {pane === 'badges' ? (
        <>
          <ShelfHead title="Badges" />
          <BadgeShelf
            badges={EARNED}
            src={(b) => badgeSrc(b.set, b.art)}
            emptyIcon={<Icon name="award" size={26} />}
          />
        </>
      ) : (
        <>
          <ShelfHead title="Achievements" />
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
