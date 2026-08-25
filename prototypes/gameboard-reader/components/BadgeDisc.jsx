import { useId } from 'react'
import { BOARD } from '../data'

/**
 * START / HALFWAY / FINISH, curved around the badge's cream ring in the board's
 * ink. The arc radius is set just inside the wide ring so the word sits on the
 * ring rather than floating over the space above it.
 */
export function CurvedLabel({ text, below }) {
  const id = useId().replace(/:/g, '')
  const r = 56
  const c = 70 // the ring box is 140 wide, so its center
  const d = below
    ? `M ${c - r} ${c} A ${r} ${r} 0 0 0 ${c + r} ${c}`
    : `M ${c - r} ${c} A ${r} ${r} 0 0 1 ${c + r} ${c}`
  return (
    <svg
      className={`gr-arc${below ? ' gr-arc--below' : ''}`}
      viewBox="0 0 140 140"
      aria-hidden="true"
    >
      <path id={id} d={d} fill="none" />
      <text className="gr-arc-text" dominantBaseline={below ? 'hanging' : 'auto'}>
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
