// Student-Profile UI kit — small `bp-`styled primitives used only by this
// prototype. Styles live in ../BeanstackProfile.css (imported by the prototype
// root + the Pattern Library catalog). Shared bits (Ic, COVER_PALETTES) come
// from @components/ui; everything generic lives in @components/*.
import { useId, useState } from 'react'
import { Ic, COVER_PALETTES } from '@components/ui'
import { Icon } from '@components/Icon/Icon'
import { ProfileCard, ProfileCardTitle } from '@components/ProfileCard/ProfileCard'

// ─── Status badge ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Watch: { icon: 'ti-alert-triangle', cls: 'bp-status--watch' },
  Improving: { icon: 'ti-trending-up', cls: 'bp-status--improving' },
  Strong: { icon: 'ti-check', cls: 'bp-status--strong' },
  'Trending up': { icon: 'ti-trending-up', cls: 'bp-status--trending' },
}

export function StatusBadge({ label, size = 11, accent }) {
  const cfg = STATUS_CONFIG[label] ?? { icon: 'ti-circle-check', cls: 'bp-status--strong' }
  const style = accent ? { background: accent } : undefined
  return (
    <span className={`bp-status ${cfg.cls}`} style={style}>
      <Ic name={cfg.icon} size={size} />
      {label}
    </span>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
// The visuals live in the shared ProfileCard pattern; the `bp-` classes ride
// along on the same elements because a lot of local CSS keys off them
// (`.bp-card > .bp-tb-item`, heading rows, and so on).
export function Card({ children, flush }) {
  return (
    <ProfileCard flush={flush} className={`bp-card${flush ? ' bp-card--flush' : ''}`}>
      {children}
    </ProfileCard>
  )
}

// ─── Section heading ──────────────────────────────────────────────────────────
export function SectionHeading({ children }) {
  return <ProfileCardTitle className="bp-section-heading">{children}</ProfileCardTitle>
}

// ─── Goal ring ────────────────────────────────────────────────────────────────
// The ring arc carries the progress; the caller states the goal in its own label,
// so the ring shows only what was logged (no "/ 30 min" denominator to re-read).
// Everything is drawn from the accent at different opacities rather than mixed
// into new hex values, so the ring works with whatever colour the section
// hands it and still reads as one object: a tinted track and a gradient arc.
// `met` gets a real check badge capping the ring instead of a '✓' smuggled
// into the unit label. Minutes past the goal are not drawn — an inner arc for
// the surplus just read as a second ring; the filled ring says "done" and the
// number says by how much.
export function GoalRing({ minutes, goal, color }) {
  const SIZE = 96
  const MID = SIZE / 2
  const SW = 9
  const R = 38 // leaves room for the badge, which sits 8px off the centreline
  const circ = 2 * Math.PI * R

  const pct = minutes == null ? 0 : Math.min(minutes / goal, 1)
  const met = minutes != null && minutes >= goal

  const gradId = useId()

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ flexShrink: 0 }}
      role="img"
      aria-label={
        minutes == null ? `No reading logged today` : `${minutes} of ${goal} minutes read today`
      }
    >
      <defs>
        {/* Light at the start of the sweep, full strength by the end, so a
            part-finished ring still has somewhere to go. */}
        <linearGradient id={gradId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity={0.45} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </linearGradient>
      </defs>

      <circle cx={MID} cy={MID} r={R} fill="none" stroke={color} strokeWidth={SW} opacity={0.13} />

      {pct > 0 && (
        <circle
          cx={MID}
          cy={MID}
          r={R}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={SW}
          strokeLinecap="round"
          strokeDasharray={`${pct * circ} ${circ}`}
          transform={`rotate(-90 ${MID} ${MID})`}
          style={{ transition: 'stroke-dasharray 0.4s ease' }}
        />
      )}

      {met && (
        <g transform={`translate(${MID} ${MID - R})`}>
          <circle r={9} fill={color} />
          <path
            d="M -3.6 0.2 L -1 2.8 L 3.8 -2.6"
            fill="none"
            stroke="#fff"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      <text
        x={MID}
        y={MID + 4}
        textAnchor="middle"
        fontSize={27}
        fontWeight={800}
        letterSpacing="-0.5"
        fill={met ? color : '#111827'}
        fontFamily="inherit"
      >
        {minutes ?? '–'}
      </text>
      <text
        x={MID}
        y={MID + 19}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        letterSpacing="0.3"
        fill={met ? color : '#9CA3AF'}
        fontFamily="inherit"
        opacity={met ? 0.85 : 1}
      >
        min
      </text>
    </svg>
  )
}

// ─── Cover image ──────────────────────────────────────────────────────────────
export function CoverImage({ isbn, title }) {
  const [failed, setFailed] = useState(false)
  const seed = title.charCodeAt(0) + (title.charCodeAt(1) || 0)
  const [bg, fg] = COVER_PALETTES[seed % COVER_PALETTES.length]

  if (failed) {
    return (
      <div
        className="bp-title-cover bp-title-cover--placeholder"
        style={{ background: bg, color: fg }}
      >
        <Icon name="book" size={18} style={{ opacity: 0.6 }} />
      </div>
    )
  }
  return (
    <img
      className="bp-title-cover"
      src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`}
      alt={title}
      onLoad={(e) => {
        if (e.target.naturalWidth <= 1) setFailed(true)
      }}
      onError={() => setFailed(true)}
    />
  )
}
