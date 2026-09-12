import { SECTIONS } from '@components/ReadingHealth/ReadingHealth'
import { Icon } from '@components/Icon/Icon'
import { PageHeader } from '@components/PageHeader/PageHeader'
import '@components/Hero/Hero.css'

/**
 * Unified page header. Replaces OverviewHero / BucketHero / PageHero.
 *
 * Three call shapes:
 *
 *   // OverviewHero style — avatar + title/subtitle
 *   <Hero initials="LE" title="Lincoln Elementary" subtitle="K–5 · 1,650 students" accent="#F26430" />
 *
 *   // BucketHero style — icon + title + right-side score/delta
 *   <Hero bucket="motivation" score={71} delta={7} />
 *
 *   // PageHero style — icon + title/subtitle
 *   <Hero icon={<svg/>} title="Analytics" subtitle="…" accent="#0CA7BC" accentBg="#ECFEFF" />
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
 *   variant   — 'hero' (default) or 'page'
 *
 * `variant="page"` renders the same content through the shared <PageHeader>,
 * the port of the app's own `.page-header`. A page that titles a whole screen
 * takes it, so its title lands on the same baseline and at the same size as
 * every other admin page; `hero` stays for the panel headers inside a page,
 * where 30px would out-shout the content under it.
 *
 * It drops the section icon and the bottom rule the panel header carries. At
 * 30px the title names the page on its own, and the page already says which
 * section you are in — the tinted glyph beside it was decoration, and the rule
 * under it fenced the header off from the blocks it belongs to. An `initials`
 * avatar stays: that is the school or district's identity, not decoration.
 */

function DeltaArrow({ positive, flat }) {
  if (flat) {
    return <Icon name="minus" size={11} stroke={2.5} />
  }
  return (
    <Icon
      name="arrow-up"
      size={11}
      stroke={2.5}
      style={{ transform: positive ? 'none' : 'rotate(180deg)' }}
    />
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
  variant = 'hero',
}) {
  // Auto-derive from a section bucket key. `icon={false}` opts out: with a
  // `bucket` the section's icon would otherwise always win, and there was no
  // way to ask for a bare title.
  let resolvedTitle = title
  let resolvedIcon = icon === false ? null : icon
  let resolvedAccent = accent
  let resolvedAccentBg = accentBg
  if (bucket) {
    const section = SECTIONS.find((s) => s.key === bucket)
    if (section) {
      resolvedTitle = title ?? section.label
      if (icon !== false) resolvedIcon = icon ?? section.icon
      resolvedAccent = accent ?? section.color
      resolvedAccentBg = accentBg ?? section.bg
    }
  }

  const style = {
    '--hero-color': resolvedAccent,
    '--hero-bg': resolvedAccentBg,
  }

  const lead = initials ? (
    <div
      className="hero-avatar"
      style={resolvedAccent ? { background: resolvedAccent } : undefined}
    >
      {initials}
    </div>
  ) : resolvedIcon ? (
    <div className="hero-icon" aria-hidden="true">
      {resolvedIcon}
    </div>
  ) : null

  if (variant === 'page') {
    return (
      <PageHeader
        className="hero-page"
        style={style}
        before={initials ? lead : null}
        title={resolvedTitle}
        subtitle={subtitle}
        actions={
          score != null || action ? (
            <>
              {score != null && (
                <div className="hero-score-card">
                  <div className="hero-score-row">
                    <span className="hero-score">{score}</span>
                    <span className="hero-score-suffix">/100</span>
                  </div>
                  <Delta value={delta} />
                </div>
              )}
              {action}
            </>
          ) : null
        }
      />
    )
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
        <h2 className="hero-title" title={typeof title === 'string' ? title : undefined}>
          {resolvedTitle}
        </h2>
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
