import { useState } from 'react'
import { BadgeDisc } from './BadgeDisc'
import { BOARD, SPACES, TREES, isEarned, roadPath, rewardMark, rewardMarkFinish } from '../data'

const pctX = (px) => `${(px / BOARD.w) * 100}%`
const pctY = (px) => `${(px / BOARD.h) * 100}%`

/**
 * The read-only board a reader sees.
 *
 * Same route the creator's GameBoard builds, but nothing drags: spaces are
 * earned or locked, the next one to clear pulses, and hovering explains how
 * it's earned. Everything is laid out in the Figma's own 948 × 586 coordinate
 * space and converted to percentages, so the board scales to its container
 * without being measured in JS.
 */
export function ReaderBoard({ booksFinished, justUnlocked, onSpace }) {
  const [tip, setTip] = useState(null)

  // The next locked space — the reader's current target.
  const target = SPACES.find((s) => !isEarned(s, booksFinished))

  return (
    <div
      className="gr-board"
      style={{
        aspectRatio: `${BOARD.w} / ${BOARD.h}`,
        background: BOARD.green,
        borderRadius: BOARD.radius,
      }}
    >
      {TREES.map((t, i) => (
        <img
          key={i}
          className="gr-trees"
          src={t.art}
          alt=""
          style={{
            left: `${t.left}%`,
            top: `${t.top}%`,
            width: `${t.width}%`,
            height: `${t.height}%`,
          }}
        />
      ))}

      <svg
        className="gr-road"
        viewBox={`0 0 ${BOARD.w} ${BOARD.h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={roadPath()}
          fill="none"
          stroke={BOARD.cream}
          strokeWidth={BOARD.road}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {SPACES.map((s) => {
        const earned = isEarned(s, booksFinished)
        return (
          <button
            key={s.id}
            type="button"
            className={[
              'gr-space',
              s.label && 'is-wide',
              target?.id === s.id && 'is-target',
              justUnlocked === s.id && 'is-popped',
              tip === s.id && 'is-tipped',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ left: pctX(s.x), top: pctY(s.y) }}
            onMouseEnter={() => setTip(s.id)}
            onMouseLeave={() => setTip((t) => (t === s.id ? null : t))}
            onFocus={() => setTip(s.id)}
            onBlur={() => setTip((t) => (t === s.id ? null : t))}
            onClick={() => onSpace?.(s, earned)}
          >
            <BadgeDisc space={s} earned={earned} />
            {s.reward && (
              <img
                className="gr-space-reward"
                src={s.reward === 'finish' ? rewardMarkFinish : rewardMark}
                alt=""
              />
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
