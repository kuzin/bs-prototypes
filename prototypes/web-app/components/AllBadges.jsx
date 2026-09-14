import { useState } from 'react'
import { Tabs } from '@components/Tabs/Tabs'
import { badgeSrc } from '@components/ReaderApp/ReaderApp'
import {
  BadgeArt,
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
 * "Earned Badges" | "Achievements") and lists only what has been earned. The
 * unearned half exists in the product too, on a challenge's own Badges tab,
 * where a badge goes gray with its requirement in the footer. Both are here:
 * the two shelves the profile has, with the whole badge set on the first, so a
 * reader can see what is next without opening every challenge one at a time.
 */
export function AllBadges() {
  const [pane, setPane] = useState('badges')

  const earned = BADGES.filter((b) => !b.locked)
  // Earned first, the way the app lists them — what you have, then what's left.
  const badges = [...earned, ...BADGES.filter((b) => b.locked)]

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
            { id: 'badges', label: 'Badges', count: BADGES.length },
            { id: 'achievements', label: 'Achievements', count: ACHIEVEMENTS.length },
          ]}
        />
      </div>

      {pane === 'badges' ? (
        <>
          <ShelfHead title="Badges" />
          <ShelfGrid>
            {badges.map((b) => (
              <CollectionCard
                key={b.name}
                art={<BadgeArt src={badgeSrc(b.set, b.art)} />}
                name={b.name}
                blurb={b.blurb}
                locked={b.locked}
                progress={b.locked ? Math.round((b.have / b.need) * 100) : undefined}
                // The app states a locked badge's requirement where an earned
                // one states its date: "12/30 Minutes Completed".
                date={
                  b.locked
                    ? `${b.have.toLocaleString()}/${b.need.toLocaleString()} ${b.unit} Completed`
                    : `Completed on ${b.date}`
                }
              />
            ))}
          </ShelfGrid>
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
