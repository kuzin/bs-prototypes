// Student-Profile UI kit — small `rp-`styled primitives used only by this
// prototype. Styles live in ../ReaderProfile.css (imported by the prototype
// root + the Pattern Library catalog). Shared bits (Ic, COVER_PALETTES) come
// from @components/ui; everything generic lives in @components/*.
import { useState } from 'react'
import { Ic, COVER_PALETTES } from '@components/ui'
import { Icon } from '@components/Icon/Icon'

// ─── Status badge ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Watch: { icon: 'ti-alert-triangle', cls: 'rp-status--watch' },
  Improving: { icon: 'ti-trending-up', cls: 'rp-status--improving' },
  Strong: { icon: 'ti-check', cls: 'rp-status--strong' },
  'Trending up': { icon: 'ti-trending-up', cls: 'rp-status--trending' },
}

export function StatusBadge({ label, size = 11, accent }) {
  const cfg = STATUS_CONFIG[label] ?? { icon: 'ti-circle-check', cls: 'rp-status--strong' }
  const style = accent ? { background: accent } : undefined
  return (
    <span className={`rp-status ${cfg.cls}`} style={style}>
      <Ic name={cfg.icon} size={size} />
      {label}
    </span>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, flush }) {
  return <div className={`rp-card${flush ? ' rp-card--flush' : ''}`}>{children}</div>
}

// ─── Section heading ──────────────────────────────────────────────────────────
export function SectionHeading({ children }) {
  return <div className="rp-section-heading">{children}</div>
}

// ─── Goal ring ────────────────────────────────────────────────────────────────
// The ring arc carries the progress; the caller states the goal in its own label,
// so the ring shows only what was logged (no "/ 30 min" denominator to re-read).
export function GoalRing({ minutes, goal, color }) {
  const R = 34
  const sw = 7
  const circ = 2 * Math.PI * R
  const pct = minutes == null ? 0 : Math.min(minutes / goal, 1)
  const dash = pct * circ
  const met = minutes !== null && minutes >= goal

  return (
    <svg width={88} height={88} viewBox="0 0 88 88" style={{ flexShrink: 0 }}>
      <circle cx={44} cy={44} r={R} fill="none" stroke="#EAECF0" strokeWidth={sw} />
      {minutes > 0 && (
        <circle
          cx={44}
          cy={44}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 44 44)"
          style={{ transition: 'stroke-dasharray 0.4s ease' }}
        />
      )}
      <text
        x={44}
        y={met ? 44 : 45}
        textAnchor="middle"
        fontSize={met ? 20 : 21}
        fontWeight={800}
        fill={met ? color : '#111827'}
        fontFamily="inherit"
      >
        {minutes ?? '–'}
      </text>
      <text
        x={44}
        y={met ? 59 : 60}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={met ? color : '#9CA3AF'}
        fontFamily="inherit"
      >
        {met ? 'min ✓' : 'min'}
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
        className="rp-title-cover rp-title-cover--placeholder"
        style={{ background: bg, color: fg }}
      >
        <Icon name="book" size={18} style={{ opacity: 0.6 }} />
      </div>
    )
  }
  return (
    <img
      className="rp-title-cover"
      src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`}
      alt={title}
      onLoad={(e) => {
        if (e.target.naturalWidth <= 1) setFailed(true)
      }}
      onError={() => setFailed(true)}
    />
  )
}
