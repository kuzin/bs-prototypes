import { ReaderBoard } from '../../gameboard-reader/components/ReaderBoard'
import { BadgeDisc } from '../../gameboard-reader/components/BadgeDisc'
import { BennyCheer } from '../../gameboard-reader/components/Benny'
import { SPACES } from '../../gameboard-reader/data'
import { Variant } from './_shared'

// The reader components read their sizing and palette from the prototype's own
// stylesheet, so pull it in the way the other prototype groups do.
import '../../gameboard-reader/index.css'

const noop = () => {}

// A row of discs at the three states the board puts them in.
function DiscRow() {
  const start = SPACES[0]
  const two = SPACES[2]
  const five = SPACES[5]
  const finish = SPACES[SPACES.length - 1]
  return (
    <div style={{ display: 'flex', gap: 26, alignItems: 'center', padding: '8px 4px' }}>
      {[
        [start, true, 'START'],
        [two, true, 'Earned'],
        [five, false, 'Locked'],
        [finish, false, 'FINISH, locked'],
      ].map(([space, earned, label]) => (
        <div key={space.id} style={{ display: 'grid', gap: 8, justifyItems: 'center', width: 96 }}>
          <div style={{ width: 72 }}>
            <BadgeDisc space={space} earned={earned} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>{label}</span>
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
        it&apos;s earned. Positions come from the Figma as a fixed coordinate space rendered in
        percentages, so the board scales to its container without measuring in JS — pass
        <code> booksFinished</code> to move the reader along it.
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
        One space on the board. Earned discs wear the badge&apos;s color with the soft horizontal
        banding the badge art uses; locked ones drop to the board&apos;s tan so the route still
        reads but the reward stays hidden. START and FINISH carry a curved word instead of a number.
        The same disc is reused at <code>lg</code> in the Badge Unlocked modal and at
        <code> sm</code> in its progress strip.
      </>
    ),
    render: () => (
      <Variant label="start · earned · locked · finish" full>
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
        Benny mid-cheer, for the &ldquo;You did it!&rdquo; celebration. Drawn as SVG because every
        other Benny in the repo is either a circular avatar crop or badge art baked onto a colored
        disc — this frame needs the whole character standing free on white.
      </>
    ),
    render: () => (
      <Variant label="default (118px)">
        <BennyCheer />
      </Variant>
    ),
  },
]
