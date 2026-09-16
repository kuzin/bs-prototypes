import { useRef, useState } from 'react'
import './Loading.css'

/**
 * The app's three loading states, which are NOT interchangeable — every Log tab picks one, and
 * which one it picks says what the screen is about to become.
 *
 *   LoadingIndicator   a spinner. Covers the whole area, absolutely, at `zIndex: 2` — so on
 *                      Statistics it sits OVER the chart and dims it rather than replacing it
 *   LogLoader          five rows, each a 32pt circle. All Titles' first tab
 *   CompletedLoader    nine 100pt squares in three columns. All Titles' second tab
 *
 * The two skeletons are `rn-placeholder` with a `Fade` — 300ms, fading to white, not the shimmer
 * sweep most design systems use. Worth reproducing as a fade: a shimmer reads as a different
 * product.
 *
 * Neither skeleton draws text lines. `LogLoader`'s `Placeholder` children is an EMPTY View, so a
 * loading row is a bare circle with nothing beside it — which looks unfinished and is what ships.
 */

/** `ActivityIndicator` — iOS's twelve-spoke spinner, `dustyGray`, large (36) or small (20). */
export function LoadingIndicator({ size = 'large', overlay = true, className = '' }) {
  const px = size === 'large' ? 36 : 20
  return (
    <div
      className={`m-load${overlay ? ' is-overlay' : ''} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="m-load-spinner" style={{ width: px, height: px }}>
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            style={{ transform: `rotate(${i * 30}deg)`, animationDelay: `${i * 83}ms` }}
          />
        ))}
      </span>
    </div>
  )
}

/** LogLoader — `paddingTop: 28` on the list, then rows at `paddingHorizontal: 20, paddingTop: 16`. */
export function LogLoader({ rows = 5 }) {
  return (
    <div className="m-skel m-skel-log" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="m-skel-row">
          <span className="m-skel-circle" />
        </div>
      ))}
    </div>
  )
}

/** CompletedLoader — nine 100pt squares, `numColumns={3}`, list `paddingTop: 44`. */
export function CompletedLoader({ tiles = 9 }) {
  return (
    <div className="m-skel m-skel-completed" aria-hidden="true">
      {Array.from({ length: tiles }, (_, i) => (
        <div key={i} className="m-skel-cell">
          <span className="m-skel-square" />
        </div>
      ))}
    </div>
  )
}

/**
 * `RefreshControl` — the pull-to-refresh spinner.
 *
 * Seven of the nine Log tabs have one. Most pass `refreshing` / `onRefresh` straight to the
 * FlatList or SectionList, which builds the control for them; Streaks is the only one that
 * constructs a `<RefreshControl>` itself, and it passes no `tintColor` either — so every one of
 * them is iOS's DEFAULT grey spinner. There is no branded refresh state to reproduce.
 *
 * On iOS the control lives in the overscroll area: the list stays where it is and the spinner is
 * revealed ABOVE it as you drag, then the list holds that offset while the fetch runs. That is why
 * this is a revealed strip rather than an overlay — an overlay would cover the first row, which is
 * exactly what the platform avoids.
 *
 * Dragging works here too (pointer or wheel, at the top of the scroller), because a refresh state
 * you can only reach from a toggle tells you what it looks like but not what it feels like.
 */
export function RefreshControl({ refreshing = false, onRefresh, className = '', children }) {
  const [pull, setPull] = useState(0)
  const ref = useRef(null)
  const drag = useRef(null)

  const THRESHOLD = 64
  const MAX = 96
  const open = refreshing ? THRESHOLD : pull

  const atTop = () => (ref.current?.scrollTop ?? 0) <= 0

  const onPointerDown = (e) => {
    if (!onRefresh || refreshing || !atTop()) return
    drag.current = e.clientY
  }

  const onPointerMove = (e) => {
    if (drag.current == null) return
    // Resistance, the way iOS damps an overscroll — the strip never tracks the finger 1:1.
    const dy = Math.max(0, (e.clientY - drag.current) * 0.5)
    setPull(Math.min(MAX, dy))
  }

  const endDrag = () => {
    if (drag.current == null) return
    drag.current = null
    if (pull >= THRESHOLD) onRefresh?.()
    setPull(0)
  }

  return (
    <div
      ref={ref}
      className={`m-ptr ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      <div
        className={`m-ptr-slot${refreshing ? ' is-refreshing' : ''}`}
        style={{ height: open }}
        aria-hidden={!refreshing}
      >
        {/* The spinner fades in with the pull rather than appearing at the threshold. */}
        <span className="m-ptr-spin" style={{ opacity: Math.min(1, open / THRESHOLD) }}>
          <LoadingIndicator size="small" overlay={false} />
        </span>
      </div>
      {children}
    </div>
  )
}

/**
 * `ListFooterComponent={isFetchingNextPage ? <LoadingIndicator /> : null}` — the next-page spinner.
 *
 * Five Log tabs paginate (All Titles, Badges, Achievements, Reviews, Book Talks), all with
 * `onEndReached` plus `onEndReachedThreshold` of 0.5 — half a screen from the bottom, so the fetch
 * starts before you arrive rather than after. Achievements uses an `ActivityIndicator` directly at
 * `size="small"`; the rest use `LoadingIndicator`, and Reviews pads it `paddingVertical: 20`.
 */
export function ListFooter({ loading = false }) {
  if (!loading) return null
  return (
    <div className="m-listfooter">
      <LoadingIndicator size="small" overlay={false} />
    </div>
  )
}
