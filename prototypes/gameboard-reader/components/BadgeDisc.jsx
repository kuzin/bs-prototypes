import { useId } from 'react'
import { BOARD } from '../data'

// The wide ring is 140 across and the badge art 80, so the cream band the word
// sits in runs from radius 40 to radius 70 — put the arc down its middle and
// center the glyphs on it, rather than resting them on top of it and letting
// them grow outward over the ring's edge.
const RING_R = 70
const ART_R = 40
const ARC_R = (RING_R + ART_R) / 2

/**
 * START / HALFWAY / FINISH, curved around the badge's cream ring in the board's
 * ink. `below` mirrors the arc under the badge — START carries the word twice.
 */
export function CurvedLabel({ text, below }) {
  const id = useId().replace(/:/g, '')
  const c = RING_R // the ring box is 140 wide, so its center
  const d = below
    ? `M ${c - ARC_R} ${c} A ${ARC_R} ${ARC_R} 0 0 0 ${c + ARC_R} ${c}`
    : `M ${c - ARC_R} ${c} A ${ARC_R} ${ARC_R} 0 0 1 ${c + ARC_R} ${c}`
  return (
    <svg
      className={`gr-arc${below ? ' gr-arc--below' : ''}`}
      viewBox="0 0 140 140"
      aria-hidden="true"
    >
      <path id={id} d={d} fill="none" />
      {/* `central` centers the em box on the path, which is what keeps the word
          in the middle of the band whichever way the arc runs. */}
      <text className="gr-arc-text" dominantBaseline="central">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  )
}

/**
 * One space on the board: the exported badge art sitting in a cream ring.
 *
 * The art is the same image whether or not the reader has it — a locked badge
 * is the Figma's own treatment, half opacity under a `mix-blend-mode: color`
 * wash in the board's ink, which drains the badge to tan while keeping its
 * shading. `isolation` keeps that wash on the badge instead of bleeding onto
 * the ring and the board behind it.
 */
export function BadgeDisc({ space, earned, size = 'board', bare = false }) {
  // `bare` drops the ring and the curved word — the treatment the unlock modal
  // and its progress strip use, where the badge stands on its own.
  const wide = !bare && !!space.label

  return (
    <span
      className={[
        'gr-disc',
        `gr-disc--${size}`,
        wide && 'gr-disc--wide',
        bare && 'gr-disc--bare',
        earned && 'is-earned',
      ]
        .filter(Boolean)
        .join(' ')}
      role="img"
      aria-label={earned ? space.name : `${space.name} — locked`}
    >
      {!bare && <span className="gr-ring" aria-hidden="true" />}
      {!bare && space.label && <CurvedLabel text={space.label} />}
      {!bare && space.label && space.labelBelow && <CurvedLabel text={space.label} below />}
      <span className="gr-art">
        <img src={space.art} alt="" draggable={false} />
        {!earned && <span className="gr-art-lock" style={{ background: BOARD.ink }} />}
      </span>
    </span>
  )
}
