import { ReaderBoard } from '../../gameboard-reader/components/ReaderBoard'
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
        it&apos;s earned. Geometry, palette, badge art and trees are the exported Figma design, laid
        out in its own 948 × 586 coordinate space and rendered as percentages — so the board scales
        to its container without being measured in JS. The road is generated from the spaces
        themselves: an orthogonal run with rounded corners, which is what puts the two turn spaces
        on the vertical legs. Pass <code>booksFinished</code> to move the reader along it.
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
