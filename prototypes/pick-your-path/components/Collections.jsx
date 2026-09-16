import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import { BadgeModal } from '@components/BadgeModal/BadgeModal'
import {
  BadgeArt,
  CollectionCard,
  ShelfGrid,
  ShelfHead,
} from '@components/CollectionShelf/CollectionShelf'
import '@components/Tabs/Tabs.css'

// The illustrated achievement medallions already exist in the Book Discovery
// prototype, and `web-app`'s own Collections draws them — no reason for a third
// set, or a second fixture of generic reader achievements.
import { AchievementArt } from '../../books/components/AchievementArt'
import { ACHIEVEMENTS } from '../../web-app/data'

import { ReaderShell } from './ReaderChrome'
/* The collection, the review deck and the word tiles are `words-with-benny`'s
   own — same surfaces, this prototype's words. They take their two lookups as
   props so the shelf doesn't have to know whose collection it is showing. */
import { MyWords } from '../../words-with-benny/components/MyWords'
import { Flashcards, ReviewStrip } from '../../words-with-benny/components/Flashcards'
import '../../words-with-benny/components/MyWords.css'
import '../../words-with-benny/components/Flashcards.css'

import { badgesForPath, wordCollection, wordFor, bookFor } from '../data'

/**
 * **Collections** — the reader's own shelf, built the way `web-app` builds it
 * (`AllBadges`): the pane switcher on a full-bleed band flush under the nav,
 * then a `ShelfHead` over a shelf of `CollectionCard`s.
 *
 * The profile splits it two ways (`_badges_and_achievements_tabs`) and lists
 * only what has been **earned** — an unearned badge belongs to a challenge and
 * is seen on that challenge's own Badges tab.
 *
 * This site adds a third kind of collectable. A **word** is banked by logging
 * the book it was hiding in and working through its round, and once it is yours
 * it is yours — so the Words pane is every word Maya has, from every challenge,
 * not the four this path happens to teach.
 */
export function Collections({
  path,
  readIds,
  doneIds,
  collected,
  loggedOn,
  cards,
  newestWord,
  onGrade,
  onNav,
  onLog,
}) {
  const [pane, setPane] = useState('words')
  const [open, setOpen] = useState(null)
  const [deckOpen, setDeckOpen] = useState(false)

  const badges = badgesForPath(path, readIds, doneIds).filter((b) => b.earned)
  const words = wordCollection(path, collected, loggedOn)
  const bookOf = (id) => bookFor(path, id)

  return (
    <ReaderShell active="badges" onNav={onNav} onLog={onLog}>
      <div className="co">
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
              { id: 'badges', label: 'Badges', count: badges.length },
              { id: 'achievements', label: 'Achievements', count: ACHIEVEMENTS.length },
              { id: 'words', label: 'Words', count: words.length },
            ]}
          />
        </div>

        {pane === 'badges' ? (
          <>
            <ShelfHead title="Badges" />
            <ShelfGrid>
              {badges.map((b) => (
                <CollectionCard
                  key={b.id}
                  art={<BadgeArt src={b.art} />}
                  name={b.name}
                  blurb={b.sub}
                  date="Earned"
                  onOpen={() => setOpen(b)}
                />
              ))}
            </ShelfGrid>
          </>
        ) : pane === 'achievements' ? (
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
                  onOpen={() => setOpen({ ...a, achievement: true })}
                />
              ))}
            </ShelfGrid>
          </>
        ) : (
          <>
            <ShelfHead title="Words" />

            {/* The collection is also the deck — `MyWords` leads with it,
                because a word revisited is worth more than the next word
                collected. Grouped by month here: this shelf runs across every
                challenge the reader has been in, so *when* is worth reading. */}
            <MyWords
              collection={words}
              newestWord={newestWord}
              cards={cards}
              onReview={() => setDeckOpen(true)}
              wordFor={wordFor}
              bookFor={bookOf}
              weekStart="2026-04-20"
              groupByMonth
              accent="#1A6DD5"
            />

            <Flashcards
              open={deckOpen}
              cards={cards}
              collection={words}
              onGrade={onGrade}
              onClose={() => setDeckOpen(false)}
              wordFor={wordFor}
              bookFor={bookOf}
            />
          </>
        )}

        {/* `earnables/_earnable_modal` — the thing you tapped, opened. An
            achievement leads with what you did; a badge leads with its own name
            and puts what it took underneath, which is the other way round. */}
        <BadgeModal
          badge={
            open &&
            (open.achievement
              ? { blurb: open.name, about: open.detail, date: open.date }
              : { name: open.name, blurb: open.name, about: open.sub })
          }
          art={
            open &&
            (open.achievement ? <AchievementArt art={open.art} /> : <img src={open.art} alt="" />)
          }
          open={Boolean(open)}
          onClose={() => setOpen(null)}
        />
      </div>
    </ReaderShell>
  )
}
