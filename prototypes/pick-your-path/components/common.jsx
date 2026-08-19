import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tooltip } from '@components/Primitives/Primitives'
import { VOCAB_BY_WORD } from '../data'

// The cluster's target words, as small chips. Used everywhere a title, activity,
// or path needs to show which of the four words it puts to work — each chip
// carries the kid-facing definition on hover, so the words are teachable
// wherever they appear. `size="xs"` is the dense variant for grid captions.
export function WordChips({ words, size = 'sm', className = '' }) {
  if (!words?.length) return null
  return (
    <span className={`pyp-words pyp-words--${size} ${className}`.trim()}>
      {words.map((w) => (
        <Tooltip key={w} content={VOCAB_BY_WORD[w]?.definition ?? w}>
          <span className="pyp-word">{w}</span>
        </Tooltip>
      ))}
    </span>
  )
}

// A row of small cover previews — each reveals its title via tooltip on
// hover, with no visible caption, so a path can be previewed without adding
// text clutter to the layout. A path's shelf runs ~10 deep, so only the first
// `limit` are shown and the remainder collapse into a "+N more" tile.
export function CoverPreviewRow({ path, limit = 3, className = '' }) {
  const shown = path.titles.slice(0, limit)
  const rest = path.titles.length - shown.length
  return (
    <div className={`pyp-coverpreview ${className}`.trim()}>
      {shown.map((t) => (
        // The grid item is a plain div (stretches to fill its column
        // reliably); Tooltip wraps just the tile inside it, so the shared
        // component's own inline-flex wrapper is never the thing being
        // sized by the grid.
        <div key={t.id} className="pyp-coverpreview-item">
          <Tooltip content={t.title}>
            <CoverTile cover={t.cover} label={t.title} path={path} />
          </Tooltip>
        </div>
      ))}
      {rest > 0 && (
        <div className="pyp-coverpreview-item">
          <Tooltip content={`${rest} more titles on this path`}>
            <span className="pyp-coverpreview-more">+{rest}</span>
          </Tooltip>
        </div>
      )}
    </div>
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
        // A tinted wash plus a banner across the foot of the cover: a small
        // floating check was too easy to miss on busy cover art.
        <span className="pyp-cover-read">
          <span className="pyp-cover-read-banner">
            <Icon name="check" size={13} stroke={3} /> Read
          </span>
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
              <Icon name="circle-check-filled" size={Math.round(size * 0.28)} color="#16A97A" />
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
