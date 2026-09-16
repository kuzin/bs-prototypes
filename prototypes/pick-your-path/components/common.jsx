import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tooltip } from '@components/Primitives/Primitives'
import { VOCAB_BY_WORD } from '../data'

// The cluster's target words, as small chips. Used everywhere a title, activity,
// or path needs to show which of the four words it puts to work — each chip
// carries the kid-facing definition on hover, so the words are teachable
// wherever they appear. `size="xs"` is the dense variant for grid captions.
export function WordChips({ words, size = 'sm', collected, className = '' }) {
  if (!words?.length) return null
  // `collected` turns the row into a scoreboard: a word you have banked reads
  // normally, one still out there is a blank of the right length. Left off,
  // every chip reads — which is what the teacher's own screens want.
  const kept = collected && new Set(collected)
  return (
    <span className={`pyp-words pyp-words--${size} ${className}`.trim()}>
      {words.map((w) =>
        kept && !kept.has(w) ? (
          <span key={w} className="pyp-word pyp-word--hidden" aria-label="Not found yet">
            {'•'.repeat(Math.min(w.length, 10))}
          </span>
        ) : (
          <Tooltip key={w} content={VOCAB_BY_WORD[w]?.definition ?? w}>
            <span className="pyp-word">{w}</span>
          </Tooltip>
        ),
      )}
    </span>
  )
}

/**
 * A path's shelf as a stack — the first few covers fanned over each other, the
 * way a pile of books reads. It stands for the shelf rather than listing it:
 * how many titles there are is the row's business, not the picture's.
 */
export function CoverStack({ path, limit = 3, className = '' }) {
  const shown = path.titles.slice(0, limit)
  return (
    <span className={`pyp-coverstack ${className}`.trim()} aria-hidden="true">
      {shown.map((t, i) => (
        <span key={t.id} className="pyp-coverstack-item" style={{ '--i': i }}>
          <CoverTile cover={t.cover} label={t.title} path={path} />
        </span>
      ))}
    </span>
  )
}

// A nonfiction cover — the real book's cover art (a live Open Library image),
// with an optional title overlay and a designed fallback if art is missing or
// fails to load. The fallback is a LIGHT tint of the path color: a shelf where
// most titles lack CDN art was a wall of saturated blocks that drowned out the
// captions next to it.
export function CoverTile({ cover, label, path, read, showTitle = false }) {
  const [errored, setErrored] = useState(false)
  const showImg = !!cover && !errored
  return (
    <div
      className={`pyp-cover${read ? ' is-read' : ''}${showImg ? '' : ' is-placeholder'}`}
      style={
        showImg
          ? undefined
          : {
              '--cover-ink': path.color,
              background: `linear-gradient(150deg, color-mix(in srgb, ${path.color} 15%, #fff) 0%, color-mix(in srgb, ${path.color} 30%, #fff) 100%)`,
            }
      }
    >
      {showImg ? (
        <img
          className="pyp-cover-img"
          src={cover}
          alt={label ? `Cover of ${label}` : ''}
          loading="lazy"
          onError={() => setErrored(true)}
        />
      ) : (
        <Icon name={path.icon} size={72} stroke={1.4} className="pyp-cover-wm" />
      )}
      {showTitle && (
        <span className="pyp-cover-overlay">
          <span className="pyp-cover-kicker">Nonfiction</span>
          <span className="pyp-cover-title">{label}</span>
        </span>
      )}
      {read && (
        // `.completed-checkmarker-wrapper` — the same mark the logging flow
        // puts on a title you've finished (`.lf-tile-mark--done`), so a read
        // cover looks the same wherever you meet one.
        <span className="pyp-cover-read" title="Completed">
          <Icon name="check" size={15} stroke={3} />
        </span>
      )}
    </div>
  )
}

// A badge medallion — the generated art (earned in full color, locked greyed),
// with an icon-in-ring fallback. Check / lock status overlay. Set
// showLabel={false} for a compact icon-only disc (pair with a Tooltip).
export function BadgeDisc({ badge, size = 74, onClick, showLabel = true, showStatus = true }) {
  const clickable = !!onClick
  const hasArt = !!badge.art
  return (
    <div
      className={`pyp-badge${badge.earned ? ' is-earned' : ' is-locked'}${clickable ? ' is-clickable' : ''}`}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
    >
      <div
        className={`pyp-badge-art${hasArt ? '' : ' pyp-badge-art--icon'}`}
        style={{ width: size, height: size, '--badge-color': badge.color }}
      >
        {hasArt ? (
          <img className="pyp-badge-img" src={badge.art} alt="" loading="lazy" />
        ) : (
          <span className="pyp-badge-face">
            <Icon name={badge.icon} size={Math.round(size * 0.4)} stroke={1.8} />
          </span>
        )}
        {showStatus &&
          (badge.earned ? (
            <span className="pyp-badge-status pyp-badge-status--done">
              <Icon name="circle-check-filled" size={Math.round(size * 0.28)} color="#0BA85F" />
            </span>
          ) : (
            <span className="pyp-badge-status pyp-badge-status--lock">
              <Icon name="lock" size={Math.round(size * 0.24)} stroke={2.2} />
            </span>
          ))}
      </div>
      {showLabel && (
        <>
          <div className="pyp-badge-name">{badge.name}</div>
          <div className="pyp-badge-sub">{badge.sub}</div>
        </>
      )}
    </div>
  )
}

// A compact gamified stat (icon + value + label) for the progress strip.
export function StatChip({ icon, value, label, color, tint }) {
  return (
    <div className="pyp-stat">
      <span className="pyp-stat-icon" style={{ background: tint, color }}>
        <Icon name={icon} size={20} stroke={1.9} />
      </span>
      <span className="pyp-stat-text">
        <span className="pyp-stat-value">{value}</span>
        <span className="pyp-stat-label">{label}</span>
      </span>
    </div>
  )
}
