import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tooltip } from '@components/Primitives/Primitives'
import { badgesForPath } from '../data'

// A row of small cover previews — each reveals its title via tooltip on
// hover, with no visible caption, so a path can be previewed without adding
// text clutter to the layout.
export function CoverPreviewRow({ path, className = '' }) {
  return (
    <div className={`pyp-coverpreview ${className}`.trim()}>
      {path.titles.map((t) => (
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
    </div>
  )
}

// A nonfiction cover — the real book's cover art (a live Open Library image),
// with an optional title overlay and a designed gradient fallback if art is
// missing or fails to load.
export function CoverTile({ cover, label, path, read, showTitle = false }) {
  const [errored, setErrored] = useState(false)
  const showImg = !!cover && !errored
  return (
    <div
      className={`pyp-cover${read ? ' is-read' : ''}`}
      style={
        showImg
          ? undefined
          : {
              background: `linear-gradient(150deg, ${path.color} 0%, color-mix(in srgb, ${path.color} 62%, #0b3b39) 100%)`,
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
        <span className="pyp-cover-check">
          <Icon name="circle-check-filled" size={22} color="#16A97A" />
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

// A compact row of badge previews for a path, shown fully earned — this is a
// preview of the reward a path offers, not a student's actual progress — each
// reveals its name via tooltip, matching CoverPreviewRow.
export function BadgePreviewRow({ path, className = '' }) {
  const allTitleIds = path.titles.map((t) => t.id)
  const allActivityIds = path.activities.map((a) => a.id)
  const badges = badgesForPath(path, allTitleIds, allActivityIds)
  return (
    <div className={`pyp-badgepreview ${className}`.trim()}>
      {badges.map((b) => (
        <div key={b.id} className="pyp-badgepreview-item">
          <Tooltip content={b.name}>
            <BadgeDisc badge={b} size={52} showLabel={false} showStatus={false} />
          </Tooltip>
        </div>
      ))}
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
