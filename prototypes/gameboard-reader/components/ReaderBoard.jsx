import { useEffect, useMemo, useRef, useState } from 'react'
import { BadgeDisc } from './BadgeDisc'
import {
  BOARD,
  SPACES,
  TREES,
  isEarned,
  layoutBoard,
  colsForWidth,
  roadPath,
  rewardMark,
  rewardMarkFinish,
} from '../data'

// Place a tree cluster against whichever corner it belongs to, in board pixels,
// so the decoration follows the board through a reflow. The `left` anchor takes
// its `dy` as a fraction of the board height instead — that cluster sits beside
// the middle of the route rather than in a corner.
function treeStyle(t, w, h) {
  const left = t.anchor.includes('right') ? w + t.dx : t.dx
  const top = t.anchor === 'left' ? h * t.dy : t.anchor.includes('bottom') ? h + t.dy : t.dy
  const pct = (v, total) => `${(v / total) * 100}%`
  return { left: pct(left, w), top: pct(top, h), width: pct(t.w, w), height: pct(t.h, h) }
}

/**
 * The read-only board a reader sees.
 *
 * Same route the creator's GameBoard builds, but nothing drags: spaces are
 * earned or locked, the next one to clear pulses, and hovering explains how
 * it's earned.
 *
 * The board reflows. It's laid out over as many columns as the container can
 * take — five reproduces the Figma, fewer gives a narrower, taller board — and
 * everything inside is then positioned as a percentage of that layout, so it
 * scales the rest of the way without a second measurement.
 */
export function ReaderBoard({ booksFinished, justUnlocked, onSpace }) {
  const [tip, setTip] = useState(null)

  const wrapRef = useRef(null)
  const [avail, setAvail] = useState(0)
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => setAvail(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { points, w, h } = useMemo(() => layoutBoard(SPACES, colsForWidth(avail)), [avail])

  // A space's slot is a fixed 140 board-units wide, so its share of the board
  // changes with the board — hand it to CSS rather than hard-coding a percentage.
  const spaceWidth = `${(BOARD.space / w) * 100}%`

  // The next locked space — the reader's current target.
  const target = SPACES.find((s) => !isEarned(s, booksFinished))

  return (
    <div ref={wrapRef}>
      <div
        className="gr-board"
        style={{
          aspectRatio: `${w} / ${h}`,
          background: BOARD.green,
          borderRadius: BOARD.radius,
          '--gr-space-w': spaceWidth,
        }}
      >
        {TREES.map((t, i) => (
          <img key={i} className="gr-trees" src={t.art} alt="" style={treeStyle(t, w, h)} />
        ))}

        <svg
          className="gr-road"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={roadPath(points)}
            fill="none"
            stroke={BOARD.cream}
            strokeWidth={BOARD.road}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {points.map(({ space: s, x, y }) => {
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
              style={{ left: `${(x / w) * 100}%`, top: `${(y / h) * 100}%` }}
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
    </div>
  )
}
