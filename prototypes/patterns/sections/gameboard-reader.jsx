import { useState } from 'react'

import { ReaderBoard } from '../../gameboard-reader/components/ReaderBoard'
import { BadgesTab } from '../../gameboard-reader/components/BadgesTab'
import { BadgeDisc } from '../../gameboard-reader/components/BadgeDisc'
import { BennyCheer } from '../../gameboard-reader/components/Benny'
import { SPACES } from '../../gameboard-reader/data'
import { Variant } from './_shared'

// The reader components read their sizing and palette from the prototype's own
// stylesheet, so pull it in the way the other prototype groups do.
import '../../gameboard-reader/index.css'

const noop = () => {}

// A row of discs at the states the board puts them in.
function DiscRow() {
  const cases = [
    [SPACES[0], true, 'START, earned'],
    [SPACES[2], true, 'Earned'],
    [SPACES[5], false, 'Locked, HALFWAY'],
    [SPACES[SPACES.length - 1], false, 'FINISH, locked'],
    [SPACES[4], true, 'Bare (unlock modal)'],
  ]
  return (
    <div
      style={{
        display: 'flex',
        gap: 22,
        alignItems: 'center',
        padding: '10px 4px',
        background: 'var(--gr-green)',
        borderRadius: 12,
      }}
    >
      {cases.map(([space, earned, label], i) => (
        <div key={i} style={{ display: 'grid', gap: 8, justifyItems: 'center', width: 116 }}>
          <div style={{ width: 100 }}>
            <BadgeDisc space={space} earned={earned} bare={i === 4} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#4a5a20' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

// Self-contained so the showcase can be ticked through like the real thing.
function BadgesTabDemo() {
  const [done, setDone] = useState([])
  return (
    <Variant label="segmented — Badges / Activities" full>
      <div style={{ padding: 20 }}>
        <BadgesTab
          booksFinished={3}
          doneActivities={done}
          onActivity={(id) =>
            setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))
          }
          onBadge={noop}
        />
      </div>
    </Variant>
  )
}

export const gameboardReaderSections = [
  {
    group: 'gameboard-reader',
    id: 'gr-board',
    name: 'Reader Board',
    desc: (
      <>
        The read-only counterpart to the creator&apos;s <strong>Gameboard</strong>: same winding
        route, but nothing drags. Spaces are earned or locked, the next one to clear carries a
        steady pulse so &ldquo;you are here&rdquo; is obvious, and hovering a space explains how
        it&apos;s earned. Palette, badge art and trees are the exported Figma design.
        <br />
        <br />
        The board <strong>reflows</strong>: it lays out over as many columns as its container can
        take, and only then scales to fit. Five columns reproduces the Figma almost to the pixel;
        fewer gives a narrower, taller board rather than the same shape shrunk past reading. It
        prefers scaling a wider layout down to shedding a column — keeping the five-column shape at
        74% beats dropping to three and stretching it. The road is generated from the spaces
        themselves, which is what puts the turn spaces out on the vertical legs.
      </>
    ),
    render: () => (
      <>
        <Variant label="3 of 10 cleared — badge 4 is the next target" full>
          <ReaderBoard booksFinished={3} onSpace={noop} />
        </Variant>
        <Variant label="8 of 10 cleared — most of the route earned" full>
          <ReaderBoard booksFinished={8} onSpace={noop} />
        </Variant>
        <Variant label="reflowed — the same board in a 360px column" full>
          <div style={{ width: 360 }}>
            <ReaderBoard booksFinished={3} onSpace={noop} />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'gameboard-reader',
    id: 'gr-disc',
    name: 'Badge Disc',
    desc: (
      <>
        One space on the board: the badge art sitting in a cream ring the same color as the road, so
        a badge reads as a bulge in it. A locked badge is the Figma&apos;s own treatment — the same
        art at half opacity under a <code>mix-blend-mode: color</code> wash, which drains it to tan
        while keeping its shading, so there is only ever one image per badge. Spaces carrying a
        curved word (START, HALFWAY, FINISH) get the wider ring that word sits on. The{' '}
        <code>bare</code> variant drops ring and word for the unlock modal and its progress strip.
      </>
    ),
    render: () => (
      <Variant label="earned · locked · bare — shown on the board green" full>
        <DiscRow />
      </Variant>
    ),
  },
  {
    group: 'gameboard-reader',
    id: 'gr-badges-tab',
    name: 'Badges Tab',
    desc: (
      <>
        Everything the challenge has to earn, split by a segmented control (
        <code>Tabs variant=&quot;pill&quot;</code>). <strong>Badges</strong> is one grid of the
        board&apos;s spaces plus the activity badges — the only place the two appear together, since
        an activity badge never sits on the board. <strong>Activities</strong> is the same set from
        the to-do side: each activity badge with the activities that earn it listed underneath,
        typed from the creator&apos;s own activity list. Completing the last activity earns the
        badge on the spot. Locked badges desaturate here rather than taking the board&apos;s tan
        wash, which is tuned to sit in a cream ring and turns pale art to mud on white.
      </>
    ),
    render: () => <BadgesTabDemo />,
  },
  {
    group: 'gameboard-reader',
    id: 'gr-benny',
    name: 'Benny Cheering',
    desc: (
      <>
        Benny mid-cheer, for the &ldquo;You did it!&rdquo; celebration — the Figma&apos;s own
        layered character, one exported SVG per body part stacked in the design&apos;s order.
        Offsets are percentages of a 116 × 170 box, so the whole figure scales from a single{' '}
        <code>width</code>.
      </>
    ),
    render: () => (
      <>
        <Variant label="default (116px)">
          <BennyCheer />
        </Variant>
        <Variant label="width=180">
          <BennyCheer width={180} />
        </Variant>
      </>
    ),
  },
]
