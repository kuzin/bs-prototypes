import { useId, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { BadgeDisc } from './BadgeDisc'
import { SPACES, BOARD_W, BOARD_H, boardBg, isEarned } from '../data'

// START / HALFWAY / FINISH arc over their disc, matching the creator's board.
function CurvedLabel({ text }) {
  const id = useId().replace(/:/g, '')
  const r = 46
  const box = (r + 14) * 2
  const c = box / 2
  return (
    <svg className="gr-arc" viewBox={`0 0 ${box} ${box}`} aria-hidden="true">
      <path id={id} d={`M ${c - r} ${c} A ${r} ${r} 0 0 1 ${c + r} ${c}`} fill="none" />
      <text className="gr-arc-text">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  )
}

/**
 * The read-only board a reader sees.
 *
 * Same winding route as the creator's GameBoard, but nothing drags: spaces are
 * earned or locked, and the one that unlocks next gets a pulse so there's an
 * obvious "you are here". Everything is positioned as a percentage of the
 * BOARD_W × BOARD_H coordinate space taken from the Figma, so the board scales
 * to its container instead of being measured in JS.
 */
export function ReaderBoard({ booksFinished, justUnlocked, onSpace }) {
  const [tip, setTip] = useState(null)

  // Pad the raw coordinate space so the discs (and their arc labels) have room
  // inside the green before the trees start.
  const PAD = 90
  const vbW = BOARD_W + PAD * 2
  const vbH = BOARD_H + PAD * 2
  const pct = (v, total) => `${((v + PAD) / total) * 100}%`

  const road = SPACES.map((s, i) => `${i ? 'L' : 'M'} ${s.x + PAD} ${s.y + PAD}`).join(' ')

  // The next locked space — the reader's current target.
  const target = SPACES.find((s) => !isEarned(s, booksFinished))

  return (
    <div
      className="gr-board"
      style={{ backgroundImage: `url(${boardBg})`, aspectRatio: `${vbW} / ${vbH}` }}
    >
      <svg className="gr-road" viewBox={`0 0 ${vbW} ${vbH}`} aria-hidden="true">
        <path
          d={road}
          fill="none"
          stroke="rgba(255,255,255,0.34)"
          strokeWidth={30}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={road}
          fill="none"
          stroke="#EFD9AE"
          strokeWidth={24}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {SPACES.map((s) => {
        const earned = isEarned(s, booksFinished)
        const isTarget = target?.id === s.id
        const popped = justUnlocked === s.id
        return (
          <button
            key={s.id}
            type="button"
            className={[
              'gr-space',
              isTarget && 'is-target',
              popped && 'is-popped',
              tip === s.id && 'is-tipped',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ left: pct(s.x, vbW), top: pct(s.y, vbH) }}
            onMouseEnter={() => setTip(s.id)}
            onMouseLeave={() => setTip((t) => (t === s.id ? null : t))}
            onFocus={() => setTip(s.id)}
            onBlur={() => setTip((t) => (t === s.id ? null : t))}
            onClick={() => onSpace?.(s, earned)}
          >
            {s.label && <CurvedLabel text={s.label} />}
            <BadgeDisc space={s} earned={earned} />
            {s.reward && (
              <span className="gr-space-reward" aria-hidden="true">
                <Icon name="gift" size={11} stroke={2.2} />
              </span>
            )}
            <span className="gr-tip" role="tooltip">
              <strong>{s.name}</strong>
              <span>{earned ? 'Earned' : s.requirement}</span>
              {s.reward && <span className="gr-tip-reward">Comes with a reward</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}
