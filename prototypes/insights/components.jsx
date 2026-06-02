import { useState } from 'react'
import { Skeleton } from '@components/Primitives/Primitives'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { fmt, coverUrl } from './data'

// ── MetricCard ──────────────────────────────────────────────────────────
// The boxy metric tile from the production Insights dashboard.
// Renders one of three states: loading, empty (not-yet-fetched), value.
// When state='value' and onClick is supplied, the whole card is clickable.
export function MetricCard({ label, note, value, state = 'value', onLoad, onClick }) {
  const clickable = state === 'value' && typeof onClick === 'function'
  // Empty + onLoad → whole card is a button that triggers the load
  if (state === 'empty' && onLoad) {
    return (
      <button
        type="button"
        className="ins-metric ins-metric--empty ins-metric--load"
        onClick={onLoad}
      >
        <div className="ins-metric-head">
          <div className="ins-metric-label">{label}</div>
          {note && <div className="ins-metric-note">{note}</div>}
        </div>
        <div className="ins-metric-body">
          <span className="ins-metric-load">
            <Icon name="download" size={13} stroke={2} />
            Load
          </span>
        </div>
      </button>
    )
  }
  const Tag = clickable ? 'button' : 'div'
  return (
    <Tag
      className={`ins-metric ins-metric--${state}${clickable ? ' ins-metric--clickable' : ''}`}
      onClick={clickable ? onClick : undefined}
      type={clickable ? 'button' : undefined}
    >
      <div className="ins-metric-head">
        <div className="ins-metric-label">{label}</div>
        {note && <div className="ins-metric-note">{note}</div>}
      </div>
      <div className="ins-metric-body">
        {state === 'loading' && <Skeleton width={64} height={36} />}
        {state === 'empty' && <div className="ins-metric-empty">—</div>}
        {state === 'value' && <div className="ins-metric-value">{fmt(value)}</div>}
      </div>
      {clickable && (
        <span className="ins-metric-chev" aria-hidden="true">
          <Icon name="chevron-right" size={14} stroke={2} />
        </span>
      )}
    </Tag>
  )
}

// ── PanelCard ───────────────────────────────────────────────────────────
// A wider card used for Top Books / Top Badges / Ages.
export function PanelCard({ title, state = 'value', kind, onLoad, onClick, children }) {
  const clickable = state === 'value' && typeof onClick === 'function'
  return (
    <div className={`ins-panel ins-panel--${state}${clickable ? ' ins-panel--clickable' : ''}`}>
      <div className="ins-panel-head">
        <div className="ins-panel-title">{title}</div>
        {clickable && (
          <button className="ins-panel-open" type="button" onClick={onClick}>
            View details
            <Icon name="chevron-right" size={12} stroke={2} />
          </button>
        )}
      </div>
      <div className="ins-panel-body">
        {state === 'loading' && <PanelSkeleton kind={kind} />}
        {state === 'empty' && onLoad && (
          <button type="button" className="ins-panel-load" onClick={onLoad}>
            <Icon name="download" size={14} stroke={2} />
            Load this panel
          </button>
        )}
        {state === 'value' && children}
      </div>
    </div>
  )
}

function PanelSkeleton({ kind }) {
  if (kind === 'books') return <TopBooksSkeleton />
  if (kind === 'badges') return <TopBadgesSkeleton />
  if (kind === 'ages') return <AgesSkeleton />
  return (
    <div className="ins-panel-skel">
      <Skeleton height={24} />
      <Skeleton height={24} style={{ marginTop: 8, width: '80%' }} />
    </div>
  )
}

// ── Content-shaped skeletons ────────────────────────────────────────────
// Each panel gets a skeleton that mirrors the shape of its real content so
// the page doesn't jump around when data lands.
export function TopBooksSkeleton({ count = 12 }) {
  return (
    <div className="ins-books">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ins-book ins-book--skel" />
      ))}
    </div>
  )
}

export function TopBadgesSkeleton({ count = 2 }) {
  return (
    <div className="ins-badges">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ins-badge">
          <div className="ins-badge-skel-circle" />
          <div className="ins-badge-skel-label" />
        </div>
      ))}
    </div>
  )
}

export function AgesSkeleton({ count = 15 }) {
  const heights = [10, 25, 40, 60, 80, 70, 90, 95, 70, 50, 35, 25, 18, 12, 8]
  return (
    <div className="ins-ages">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ins-age">
          <div className="ins-age-bar-wrap">
            <div
              className="ins-age-bar ins-age-bar--skel"
              style={{ height: `${heights[i % heights.length]}%` }}
            />
          </div>
          <div className="ins-age-label-skel" />
        </div>
      ))}
    </div>
  )
}

// ── Top books grid ─────────────────────────────────────────────────────
// Uses Open Library covers via ISBN. When the cover fails to load (offline,
// missing edition, etc.) we fall back to the colored rectangle with the
// title overlaid.
function BookTile({ book }) {
  const [failed, setFailed] = useState(false)
  if (failed || !book.isbn) {
    return (
      <div
        className="ins-book ins-book--fallback"
        style={{ background: book.color }}
        title={book.title}
      >
        <span className="ins-book-title">{book.title}</span>
      </div>
    )
  }
  return (
    <div className="ins-book" title={`${book.title} — ${book.author}`}>
      <img
        src={coverUrl(book.isbn, 'M')}
        alt={book.title}
        onError={() => setFailed(true)}
        loading="lazy"
      />
    </div>
  )
}

export function TopBooksGrid({ books }) {
  return (
    <div className="ins-books">
      {books.map((b, i) => (
        <BookTile key={i} book={b} />
      ))}
    </div>
  )
}

// ── Top badges row ──────────────────────────────────────────────────────
// Replace emoji placeholders with SVG illustrations sized like real badges.
function BadgeArt({ name }) {
  if (name === 'book-stack') {
    return (
      <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
        <defs>
          <linearGradient id="bs-ring" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#bs-ring)" stroke="#92400E" strokeWidth="2" />
        {/* book stack */}
        <rect
          x="14"
          y="38"
          width="36"
          height="6"
          rx="1.5"
          fill="#1F2937"
          stroke="#0F172A"
          strokeWidth="1"
        />
        <rect x="14" y="38" width="6" height="6" fill="#FCA5A5" />
        <rect
          x="16"
          y="30"
          width="32"
          height="6"
          rx="1.5"
          fill="#1F2937"
          stroke="#0F172A"
          strokeWidth="1"
        />
        <rect x="16" y="30" width="6" height="6" fill="#FDBA74" />
        <rect
          x="18"
          y="22"
          width="28"
          height="6"
          rx="1.5"
          fill="#1F2937"
          stroke="#0F172A"
          strokeWidth="1"
        />
        <rect x="18" y="22" width="6" height="6" fill="#86EFAC" />
        <rect
          x="20"
          y="14"
          width="24"
          height="6"
          rx="1.5"
          fill="#1F2937"
          stroke="#0F172A"
          strokeWidth="1"
        />
        <rect x="20" y="14" width="6" height="6" fill="#93C5FD" />
      </svg>
    )
  }
  if (name === 'star-shield') {
    return (
      <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
        <defs>
          <linearGradient id="bs-ring2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#bs-ring2)" stroke="#92400E" strokeWidth="2" />
        {/* ribbon banner */}
        <path
          d="M14 18 L32 14 L50 18 L50 24 L32 20 L14 24 Z"
          fill="#1D4ED8"
          stroke="#1E3A8A"
          strokeWidth="1.2"
        />
        <text
          x="32"
          y="22"
          fontSize="6"
          fill="#fff"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="Nunito, sans-serif"
        >
          Registered
        </text>
        {/* star */}
        <polygon
          points="32,28 35,38 45,38 37,44 40,54 32,48 24,54 27,44 19,38 29,38"
          fill="#fff"
          stroke="#0F172A"
          strokeWidth="0.8"
        />
      </svg>
    )
  }
  return null
}

export function TopBadgesRow({ badges }) {
  return (
    <div className="ins-badges">
      {badges.map((b) => (
        <div key={b.id} className="ins-badge">
          <BadgeArt name={b.art} />
          <div className="ins-badge-label">{b.label}</div>
          <div className="ins-badge-count">{b.earned} earned</div>
        </div>
      ))}
    </div>
  )
}

// ── Ages histogram ──────────────────────────────────────────────────────
export function AgesChart({ ages }) {
  const max = Math.max(...ages.map((a) => a.count), 1)
  return (
    <div className="ins-ages">
      {ages.map((a, i) => (
        <div key={i} className="ins-age">
          <div className="ins-age-bar-wrap">
            <div
              className="ins-age-bar"
              style={{ height: `${(a.count / max) * 100}%` }}
              title={`${a.age}: ${a.count}`}
            />
          </div>
          <div className="ins-age-label">{a.age}</div>
        </div>
      ))}
    </div>
  )
}

// ── Filter bar (chrome only — not a real filter) ────────────────────────
// Named `InsightsFilterBar` to avoid colliding with the shared
// `@components/FilterBar/FilterBar`. This one mirrors the production Insights
// dashboard's gray pill filter row (`.ins-filter*`), which has a distinct look
// the shared FilterBar (label-above-control card) would not reproduce.
export function InsightsFilterBar({ onCustomize, visibleCount, totalCount }) {
  return (
    <div className="ins-filters">
      <div className="ins-filters-grid">
        <div className="ins-filter">
          <Icon name="calendar" size={14} />
          <span>This Week (Since Monday)</span>
          <Caret />
        </div>
        <div className="ins-filter">
          <span className="ins-filter-dot" />
          <span>Readers in Challenges</span>
          <Caret />
        </div>
        <div className="ins-filter ins-filter--muted">
          <span>Last Week</span>
          <Caret />
        </div>
        <div className="ins-filter">
          <span>All Challenges</span>
          <Caret />
        </div>
        <div className="ins-filter">
          <span>All Ages</span>
          <Caret />
        </div>
      </div>
      {onCustomize && (
        <button
          type="button"
          className="ins-filter-cog"
          onClick={onCustomize}
          title="Customize Dashboard"
          aria-label="Customize Dashboard"
        >
          <CogIcon />
          {visibleCount != null && visibleCount < totalCount && (
            <span className="ins-filter-cog-badge">{visibleCount}</span>
          )}
        </button>
      )}
    </div>
  )
}

function CogIcon() {
  return <Icon name="settings" size={18} aria-hidden="true" />
}

function Caret() {
  return <Icon name="chevron-down" size={10} stroke={2} style={{ marginLeft: 'auto' }} />
}
