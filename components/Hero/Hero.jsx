import { SECTIONS } from '@components/ReadingHealth/ReadingHealth'
import '@components/Hero/Hero.css'

/**
 * Unified page header. Replaces OverviewHero / BucketHero / PageHero.
 *
 * Three call shapes:
 *
 *   // OverviewHero style — avatar + title/subtitle
 *   <Hero initials="LE" title="Lincoln Elementary" subtitle="K–5 · 1,650 students" accent="#E8866A" />
 *
 *   // BucketHero style — icon + title + right-side score/delta
 *   <Hero bucket="motivation" score={71} delta={7} />
 *
 *   // PageHero style — icon + title/subtitle
 *   <Hero icon={<svg/>} title="Analytics" subtitle="…" accent="#0DA7BC" accentBg="#ECFEFF" />
 *
 * Props:
 *   bucket    — auto-derives icon/title/accent/accentBg from SECTIONS
 *   initials  — renders a colored square avatar (mutually exclusive with icon)
 *   icon      — renders a tinted icon block (mutually exclusive with initials)
 *   title     — required (auto from `bucket` if not given)
 *   subtitle  — optional, sits below title
 *   score     — optional, big number on the right (BucketHero style)
 *   delta     — optional, ↑/↓ pts indicator next to score
 *   accent    — primary color (icon stroke, avatar bg, score color)
 *   accentBg  — background tint for the icon block (defaults to a soft mix of accent)
 */

function DeltaArrow({ positive, flat }) {
  if (flat) {
    return (
      <svg
        viewBox="0 0 14 14"
        width="11"
        height="11"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="7" x2="11" y2="7" />
      </svg>
    )
  }
  return (
    <svg
      viewBox="0 0 14 14"
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: positive ? 'none' : 'rotate(180deg)' }}
    >
      <polyline points="3,8 7,4 11,8" />
      <line x1="7" y1="4" x2="7" y2="12" />
    </svg>
  )
}

function Delta({ value }) {
  if (value == null) return null
  if (value === 0) {
    return (
      <span className="hero-delta hero-delta--flat">
        <DeltaArrow flat />
        ±0 pts
      </span>
    )
  }
  const positive = value > 0
  return (
    <span className={`hero-delta hero-delta--${positive ? 'up' : 'down'}`}>
      <DeltaArrow positive={positive} />
      {Math.abs(value)} pts
    </span>
  )
}

export function Hero({
  bucket,
  initials,
  icon,
  title,
  subtitle,
  score,
  delta,
  accent,
  accentBg,
  action,
}) {
  // Auto-derive from a section bucket key
  let resolvedTitle = title
  let resolvedIcon = icon
  let resolvedAccent = accent
  let resolvedAccentBg = accentBg
  if (bucket) {
    const section = SECTIONS.find((s) => s.key === bucket)
    if (section) {
      resolvedTitle = title ?? section.label
      resolvedIcon = icon ?? section.icon
      resolvedAccent = accent ?? section.color
      resolvedAccentBg = accentBg ?? section.bg
    }
  }

  const style = {
    '--hero-color': resolvedAccent,
    '--hero-bg': resolvedAccentBg,
  }

  return (
    <header className="hero" style={style}>
      {initials && (
        <div
          className="hero-avatar"
          style={resolvedAccent ? { background: resolvedAccent } : undefined}
        >
          {initials}
        </div>
      )}
      {!initials && resolvedIcon && (
        <div className="hero-icon" aria-hidden="true">
          {resolvedIcon}
        </div>
      )}

      <div className="hero-text">
        <h2 className="hero-title">{resolvedTitle}</h2>
        {subtitle && <div className="hero-sub">{subtitle}</div>}
      </div>

      {score != null && (
        <div className="hero-score-card">
          <div className="hero-score-row">
            <span className="hero-score">{score}</span>
            <span className="hero-score-suffix">/100</span>
          </div>
          <Delta value={delta} />
        </div>
      )}

      {action && <div className="hero-action">{action}</div>}
    </header>
  )
}
