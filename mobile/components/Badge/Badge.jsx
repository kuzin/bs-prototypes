import { Img } from '@mobile/components'
import './Badge.css'

/**
 * `src/components/badges/Badge/Badge.tsx`, list variant — the row used on the Log tab's Badges
 * screen and inside a challenge. (Its `circle` variant is the strip on Home; that is
 * `HomeBadges`.)
 *
 * The medallion is a 76pt ring around a 56pt disc, and the two report different things: the RING
 * turns green only when `earnedOn` is set, while the DISC takes the tenant colour whenever the
 * badge counts as earned — which includes a repeatable badge with any completions but no
 * earned date. So a repeatable in progress shows a coloured disc inside a grey ring.
 *
 * The three lines are badge title (bodySmaller, greyDark3), badge name (titleRegular), and the
 * earned line, which is green once completed and grey while in progress.
 */
/**
 * The stacked `*Marker` flags mapped to the standalone glyphs the Challenge Overview uses. Callers
 * still pass the app's own marker names, so the data does not have to know about the swap.
 */
const MARKER_GLYPH = {
  CertificatesMarker: 'challengeStatsCertificates',
  TicketsMarker: 'challengeStatsTickets',
  RewardsMarker: 'challengeStatsRewards',
}

export function Badge({
  title,
  name,
  earnedOn,
  earnedText,
  art,
  repeatable = false,
  completedItems = 0,
  markers = [],
  onPress,
}) {
  const isEarned = earnedOn != null || (repeatable && completedItems > 0)
  const showIcons = markers.length > 0

  return (
    <div className="m-badge-row">
      <button type="button" className="m-badge" onClick={onPress}>
        <span className="m-badge-view">
          <span className={`m-badge-ring${earnedOn != null ? ' is-earned' : ''}`}>
            <span
              className="m-badge-art"
              style={{
                background: isEarned ? (art ?? 'var(--m-accent)') : 'var(--m-grey-light-2)',
              }}
            />
            {earnedOn != null && (
              <span className="m-badge-check">
                <Img name="badgeCheckmark" size={16} />
              </span>
            )}
          </span>

          <span className="m-badge-text">
            <span className="m-badge-title">{title}</span>
            <span className="m-badge-name">{name}</span>
            <span className={`m-badge-earned${isEarned ? ' is-earned' : ''}`}>{earnedText}</span>
          </span>
          {/* DIVERGENCE — ONE chip of glyphs, not a stack of tags.
           *
           * `badgeIconView` stacks up to three 40×28 `*Marker` rasters vertically at the right edge.
           * Each is a notched flag with its own pastel ground and a coloured glyph inside, so a badge
           * that earned all three shows three differently-tinted blocks in a column — competing with
           * the medallion on the left and taking the row's full height to say something secondary.
           *
           * The glyphs themselves are reused rather than redrawn: `challengeStatsCertificates`,
           * `challengeStatsTickets` and `challengeStatsRewards` are the app's own art for exactly
           * these three concepts, drawn standalone for the Challenge Overview. Set in one neutral
           * chip they read as a single "this came with things" rather than three separate flags. */}
          {showIcons && (
            <span className="m-badge-markers">
              {markers.map((m) => (
                <Img key={m} name={MARKER_GLYPH[m] ?? m} size={16} className="m-badge-marker" />
              ))}
            </span>
          )}
        </span>
      </button>
    </div>
  )
}
