import { useState } from 'react'
import { Tabs } from '@components/Tabs/Tabs'
import { EmptyState } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import {
  SafetySeverityTag,
  FlagIconBadge,
  FLAG_TYPE_CONFIG,
  POS_FLAG_CONFIG,
} from './SessionsTable'
import { isSafety, isSafetyOpen, isIntegrityFlagged, SEV_ORDER } from '../data'
import './SessionsToReview.css'

// Sessions to Review — the SFR review hub, rebuilt as a single dashboard card
// for the Admin-Dashboard-V2 mock. The four dashboard "alerts" (critical
// safety / safety to review / reading-integrity flags / positive engagement)
// are worked INTO this card: their counts become the segment badges, and each
// segment filters the in-card session list in place. Rows + "Review All" deep
// -link into the existing SfrPage tabs via onGoToSfr.

const ROW_CAP = 6

// Fallback badge for a green session with no specific positive flags, so every
// Celebrate row still reads as positive (mirrors POS_FLAG_CONFIG styling).
const POSITIVE_FALLBACK = {
  label: 'Positively Engaged',
  color: '#16A97A',
  bg: '#F0FDF4',
  icon: <Icon name="flame" size={12} />,
}

const EMPTY = {
  all: {
    title: 'Nothing to review',
    description: 'No safety signals or integrity flags this week — your readers are doing great.',
  },
  safety: { title: 'No safety signals', description: 'No open safety signals this week.' },
  integrity: {
    title: 'No integrity flags',
    description: "Reading Integrity hasn't flagged any sessions this week.",
  },
  celebrate: {
    title: 'Nothing to celebrate yet',
    description: 'No standout positive Book Talks logged this week.',
  },
}

const TAIL_TAB = {
  all: 'overview',
  safety: 'safety',
  integrity: 'flagged',
  celebrate: 'engagement',
}

function rowTab(s, seg) {
  if (seg === 'celebrate') return 'engagement'
  if (isSafety(s)) return 'safety'
  return 'flagged'
}

function RowBadges({ session, seg }) {
  // In Celebrate, always show the positive flags (a green session may also carry
  // a low-severity safety signal — don't surface that here). If a green session
  // has no specific positive flags, show a single fallback "positive" badge.
  if (seg === 'celebrate') {
    const pos = session.positiveFlags || []
    if (!pos.length) return <FlagIconBadge type="positive" cfg={POSITIVE_FALLBACK} />
    return pos.map((pf) => {
      const cfg = POS_FLAG_CONFIG[pf.type]
      return cfg ? <FlagIconBadge key={pf.id} type={pf.type} cfg={cfg} /> : null
    })
  }
  if (isSafety(session)) return <SafetySeverityTag severity={session.safety.severity} />
  return (session.flags || []).map((f) => {
    const cfg = FLAG_TYPE_CONFIG[f.type]
    return cfg ? <FlagIconBadge key={f.id} type={f.type} cfg={cfg} /> : null
  })
}

// Rendered inside each Tab's label rather than via Tabs' built-in `count` prop,
// because the count must be color-coded per alert level (Tabs' count is not).
function SegBadge({ n, level }) {
  if (!n) return null
  return <span className={`sfr-seg-badge sfr-seg-badge--${level}`}>{n}</span>
}

export function SessionsToReview({ sessions = [], onGoToSfr }) {
  const [seg, setSeg] = useState('all')

  // ─── Derive the four alerts from live SFR sessions (same logic the old
  //     dashboard AlertsBanner used) ─────────────────────────────────────────
  const openSafety = sessions.filter(isSafetyOpen)
  const critical = openSafety.filter((s) => s.safety.severity === 'critical').length
  const otherSafety = openSafety.length - critical
  const safetyCount = critical + otherSafety
  const integrity = sessions.filter(isIntegrityFlagged)
  const flagged = integrity.length
  const green = sessions.filter((s) => s.engagementRating === 'green')
  const positive = green.length
  const attention = critical + otherSafety + flagged // excludes celebratory positive

  const safetyList = [...openSafety].sort(
    (a, b) => SEV_ORDER[a.safety.severity] - SEV_ORDER[b.safety.severity],
  )
  const allList = [...safetyList, ...integrity]

  const listFor = (k) =>
    k === 'safety'
      ? safetyList
      : k === 'integrity'
        ? integrity
        : k === 'celebrate'
          ? green
          : allList

  const items = [
    {
      id: 'all',
      label: (
        <>
          All
          <SegBadge n={attention} level="neutral" />
        </>
      ),
    },
    {
      id: 'safety',
      label: (
        <>
          Safety
          <SegBadge n={safetyCount} level={critical ? 'critical' : 'warning'} />
        </>
      ),
    },
    {
      id: 'integrity',
      label: (
        <>
          Integrity
          <SegBadge n={flagged} level="info" />
        </>
      ),
    },
    {
      id: 'celebrate',
      label: (
        <>
          Celebrate
          <SegBadge n={positive} level="positive" />
        </>
      ),
    },
  ]

  const full = listFor(seg)
  const shown = full.slice(0, ROW_CAP)
  const hasMore = full.length > shown.length
  const empty = EMPTY[seg]

  return (
    <div className="adm-w sfr-review">
      <div className="adm-w-head">
        <div className="adm-w-title">
          Sessions to Review
          <span className="adm-w-meta">
            {attention > 0 ? `${attention} to review` : 'All clear'} · This Week
          </span>
        </div>
        <button className="adm-w-action" onClick={() => onGoToSfr?.('overview')}>
          Review All
        </button>
      </div>

      {/* Alert summary, worked into the card: the four counts ARE the segment
          badges, and selecting a segment filters the list below in place. */}
      <div className="sfr-seg-bar">
        <Tabs variant="pill" block accent="#16A97A" active={seg} onChange={setSeg} items={items} />
      </div>

      {shown.length === 0 ? (
        <div className="adm-w-body adm-flagged sfr-review-empty">
          <EmptyState title={empty.title} description={empty.description} />
        </div>
      ) : (
        <div className="adm-w-body adm-flagged">
          <div className="adm-flagged-list">
            {shown.map((s) => (
              <button
                key={s.id}
                className="adm-flagged-row sfr-review-row"
                onClick={() => onGoToSfr?.(rowTab(s, seg))}
              >
                <div className="adm-flagged-info">
                  <div className="adm-flagged-reader">{s.student.name}</div>
                  <div className="adm-flagged-book">{s.book.title}</div>
                </div>
                <span className="adm-flagged-flags">
                  <RowBadges session={s} seg={seg} />
                </span>
                <Icon name="chevron-right" size={14} className="sfr-review-chev" />
              </button>
            ))}
            {hasMore && (
              <button
                className="adm-flagged-row sfr-review-row sfr-review-tail"
                onClick={() => onGoToSfr?.(TAIL_TAB[seg])}
              >
                View all {full.length} sessions →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
