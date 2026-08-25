import { useState } from 'react'

import { GameBoard } from '../../gameboard/components/GameBoard'
import { GAMEBOARD_THEMES } from '../../gameboard/data'
import { Variant } from './_shared'

// The board renders inside the prototype's own chrome (it reads --ink / --track
// from the themed board element, which the component sets itself).
import '../../gameboard/index.css'

// Badge art from the real "Have You Seen Benny?" challenge, so the showcase
// board looks like a board rather than a row of placeholders.
const BENNY = import.meta.glob('../../gameboard/assets/templates/benny/*.webp', {
  eager: true,
  import: 'default',
})
const benny = (file) => BENNY[`../../gameboard/assets/templates/benny/${file}`]

// In the prototype these come from the challenge's Badges + Rewards steps; here
// they're a fixture so the component can be shown on its own.
const POOL = [
  ['book-lover.webp', 'Book Lover', 1],
  ['hit-the-books.webp', 'Hit the Books', 2],
  ['reading-explorer.webp', 'Reading Explorer', 3],
  ['speed-reader.webp', 'Speed Reader', 5, true],
  ['reading-star.webp', 'Reading Star', 8],
  ['reading-champion.webp', 'Reading Champion', 10, true],
  ['reading-royalty.webp', 'Reading Royalty', 12],
  ['rock-star.webp', 'Rock Star', 15],
  ['top-reader.webp', 'Top Reader', 18],
  ['out-of-this-world.webp', 'Out of This World', 20, true],
].map(([file, name, goal, reward], i) => ({
  id: `log-${i}`,
  name,
  img: benny(file),
  logType: 'books',
  goal,
  reward: !!reward,
  meta: `Log ${goal} ${goal === 1 ? 'book' : 'books'}`,
}))

const ACTIVITY_POOL = [
  {
    id: 'act-0',
    name: 'Library Scavenger Hunt',
    meta: 'Complete 3 activities',
  },
  { id: 'act-1', name: 'Reading Buddy', meta: 'Complete 1 activity' },
]

const REG_BADGE = { name: 'You’re Registered!', img: benny('registration.webp') }
const COMP_BADGE = { name: 'Challenge Complete', img: benny('completion.webp') }

function BoardDemo({ theme = 'meadow', spaces = 8, showRewards = true, showHalfway = true }) {
  const [cells, setCells] = useState(() =>
    Array.from({ length: spaces }, (_, i) => POOL[i]?.id ?? null),
  )
  return (
    <div className="gb-root" style={{ position: 'static', inset: 'auto', padding: 16 }}>
      <GameBoard
        cells={cells}
        pool={POOL}
        activityPool={ACTIVITY_POOL}
        themeObj={GAMEBOARD_THEMES.find((t) => t.id === theme)}
        showRewards={showRewards}
        showHalfway={showHalfway}
        regBadge={REG_BADGE}
        compBadge={COMP_BADGE}
        onChange={setCells}
      />
    </div>
  )
}

export const gameboardSections = [
  {
    group: 'gameboard',
    id: 'gb-board',
    name: 'Gameboard',
    desc: (
      <>
        The board readers travel as they read: logging badges drag from the tray onto a serpentine
        path from <strong>START</strong> (the registration badge) to <strong>FINISH</strong> (the
        completion badge). A placed badge can be dragged space-to-space to swap, dropped back on the
        tray, or cleared with its ×. Activity badges sit in the tray for context but can&apos;t take
        a space. The road is a single rounded SVG stroke, and the column count is measured from the
        available width — so the same board reflows to one vertical column on narrow screens.
      </>
    ),
    render: () => (
      <>
        <Variant label="Meadow · 8 spaces, halfway + reward markers" full>
          <BoardDemo />
        </Variant>
        <Variant label="Aurora · 12 spaces, markers off" full>
          <BoardDemo theme="aurora" spaces={12} showRewards={false} showHalfway={false} />
        </Variant>
      </>
    ),
  },
  {
    group: 'gameboard',
    id: 'gb-themes',
    name: 'Board Theme Picker',
    desc: (
      <>
        Six illustrated board backgrounds, each carrying its own road color and label ink so the
        board stays legible over the art. The <strong>Custom</strong> tile reveals a color scheme
        and a background upload instead.
      </>
    ),
    render: () => (
      <Variant label="all six themes, Meadow selected" full>
        <div className="gb-root" style={{ position: 'static', inset: 'auto', padding: 16 }}>
          <div className="gb-themes">
            {GAMEBOARD_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`gb-theme${t.id === 'meadow' ? ' is-on' : ''}`}
                style={{ backgroundImage: `url(${t.bgImg})` }}
              >
                <span className="gb-theme-name">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </Variant>
    ),
  },
]
