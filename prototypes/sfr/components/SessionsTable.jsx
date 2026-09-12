import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Table } from '@components/Table/Table'
import { Pill } from '@components/Pill/Pill'
import { Tooltip } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { FlagIcon } from '@components/BsIcons/BsIcons'
import { talkKind, sessionConfidence, CONFIDENCE_META, CONFIDENCE_BLURB } from '../data'
import '@components/Table/Table.css'
import '@components/Pill/Pill.css'
import '@components/Primitives/Primitives.css'
import './SessionsTable.css'

const RATING_CONFIG = {
  green: { color: '#0BA85F', label: 'Positive' },
  yellow: { color: '#AB720A', label: 'Mixed' },
  red: { color: '#E85648', label: 'Disengaged' },
}

export function RatingDot({ rating }) {
  if (!rating) return <span className="sess-na">—</span>
  const cfg = RATING_CONFIG[rating]
  return (
    <Pill color={cfg.color} variant="soft" size="sm">
      {cfg.label}
    </Pill>
  )
}

const FLAG_TYPE_CONFIG = {
  'copy-paste': {
    label: 'Copied Response',
    color: '#E85648',
    bg: '#FEF2F2',
    icon: <Icon name="copy" size={12} />,
  },
  'no-recall': {
    label: 'Unable to Recall',
    color: '#E85648',
    bg: '#FEF2F2',
    icon: <Icon name="help" size={12} />,
  },
  minimal: {
    label: 'Minimal Engagement',
    color: '#E85648',
    bg: '#FEF2F2',
    icon: <Icon name="align-left" size={12} />,
  },
  unintelligible: {
    label: 'Unintelligible',
    color: '#E85648',
    bg: '#FEF2F2',
    icon: <Icon name="wave" size={12} />,
  },
  'quit-early': {
    label: 'Did Not Complete',
    color: '#E85648',
    bg: '#FEF2F2',
    icon: <Icon name="circle-x" size={12} />,
  },
}

const POS_FLAG_CONFIG = {
  'positive-sentiment': {
    label: 'Positive Sentiment',
    color: '#0BA85F',
    bg: '#F0FDF4',
    icon: <Icon name="smile" size={12} />,
  },
  'answer-length': {
    label: 'Long Answer',
    color: '#0BA85F',
    bg: '#F0FDF4',
    icon: <Icon name="list" size={12} />,
  },
  'references-details': {
    label: 'References Details',
    color: '#0BA85F',
    bg: '#F0FDF4',
    icon: <Icon name="search" size={12} />,
  },
  'makes-connection': {
    label: 'Made a Connection',
    color: '#0BA85F',
    bg: '#F0FDF4',
    icon: <Icon name="link" size={12} />,
  },
}

export { FLAG_TYPE_CONFIG, POS_FLAG_CONFIG }

// ── Safety signals (self-harm / harm-to-others review) ───────────────────────
// Additive: only the Safety Signals prototype attaches `session.safety`. SFR's
// own sessions have none, so the Safety column / tags below never render there.
export const SAFETY_SEVERITY = {
  critical: {
    label: 'Critical',
    sub: 'Imminent risk',
    color: '#E85648',
    bg: '#FEF2F2',
    border: '#FECACA',
    icon: 'alert-hexagon',
    blurb: 'Explicit self-harm, threats to others, or abuse. Escalate now.',
  },
  warning: {
    label: 'Warning',
    sub: 'Concerning',
    color: '#AB720A',
    bg: '#FFFBEB',
    border: '#FDE68A',
    icon: 'alert-triangle',
    blurb: 'Distress, hopelessness, or bullying. Review promptly.',
  },
  possible: {
    label: 'Possible',
    sub: 'Low confidence',
    color: '#CA8A04',
    bg: '#FEFCE8',
    border: '#FEF08A',
    icon: 'help',
    blurb: 'A keyword match that may be benign. Logged for awareness.',
  },
}

export const SAFETY_CATEGORY = {
  'self-harm': { label: 'Self-Harm', icon: 'mood-cry' },
  'harm-others': { label: 'Harm to Others', icon: 'alert-triangle' },
  abuse: { label: 'Possible Abuse', icon: 'shield-alert' },
  bullying: { label: 'Bullying', icon: 'message-report' },
  distress: { label: 'Emotional Distress', icon: 'mood-sad' },
}

export function safetyStatusMeta(safety) {
  if (safety.status === 'resolved') {
    return safety.resolution === 'dismissed'
      ? { label: 'Dismissed', color: '#707070', bg: '#F5F5F5' }
      : { label: 'Resolved', color: '#0BA85F', bg: '#F0FDF4' }
  }
  return { label: 'Unresolved', color: '#E85648', bg: '#FEF2F2' }
}

/** What kind of talk it was — engagement, comprehension, or integrity. */
export function TalkKindPill({ session }) {
  const kind = talkKind(session)
  if (!kind) return <span className="sess-na">—</span>
  return (
    <Tooltip content={`${kind.label} — ${kind.measures}`}>
      <Pill color={kind.color} variant="soft" size="sm">
        {kind.short}
      </Pill>
    </Tooltip>
  )
}

/** Reading Confidence — a comprehension talk's own read, and only its own. */
export function ConfidencePill({ session }) {
  const key = sessionConfidence(session)
  if (!key) return <span className="sess-na">—</span>
  const cfg = CONFIDENCE_META[key]
  return (
    <Tooltip content={CONFIDENCE_BLURB}>
      <Pill color={cfg.color} variant="soft" size="sm">
        {cfg.label.replace(' confidence', '')}
      </Pill>
    </Tooltip>
  )
}

// The same `Pill` every other tag in these tables is — it used to be a
// bespoke outlined tag, which made the one column that matters most the only
// one drawn differently from its neighbours.
export function SafetySeverityTag({ severity }) {
  const cfg = SAFETY_SEVERITY[severity]
  if (!cfg) return null
  return (
    <Tooltip content={`${cfg.label} — ${cfg.sub}. ${cfg.blurb}`}>
      <Pill color={cfg.color} variant="soft" size="sm">
        {cfg.label}
      </Pill>
    </Tooltip>
  )
}

/**
 * The flags cell, the way the shipped row draws it
 * (`FlaggedEntryAnalysis` + `_admin_flagged_entries.scss`):
 *
 *   0 flags   → a grey "N/A" chip, not an em dash
 *   1–2       → the app's own drawing per flag, 24px in a 32px box
 *   3 or more → one chip carrying the count, in the sentiment's pair
 *
 * The threshold is the app's: past two icons a row stops being readable at a
 * glance, and the number is the thing you'd have counted anyway.
 */
function FlagCell({ flags, sentiment }) {
  const list = flags ?? []
  const cfg = sentiment === 'positive' ? POS_FLAG_CONFIG : FLAG_TYPE_CONFIG

  if (list.length === 0) return <span className="fe-chip fe-chip--none">N/A</span>

  if (list.length > 2) {
    return <span className={`fe-chip fe-chip--${sentiment}`}>{list.length}</span>
  }

  return (
    <span className="fe-analysis">
      {list.map((f, i) => (
        <Tooltip key={f.id ?? i} content={cfg[f.type]?.label ?? f.type}>
          <span className="fe-icon">
            <FlagIcon
              type={f.type}
              fallback={sentiment === 'positive' ? 'positive' : 'negative'}
              size={24}
              label={cfg[f.type]?.label ?? f.type}
            />
          </span>
        </Tooltip>
      ))}
    </span>
  )
}

export function PosFlagCount({ positiveFlags }) {
  return <FlagCell flags={positiveFlags} sentiment="positive" />
}

export function FlagCount({ flags }) {
  return <FlagCell flags={flags} sentiment="negative" />
}

export function FlagTypeIcons({ flags }) {
  return <FlagCell flags={flags} sentiment="negative" />
}

export function TypePill({ session, type }) {
  const wasApproved = session?.changeLog?.some((e) => e.kind === 'approved')
  if (wasApproved) {
    return (
      <Pill color="#0BA85F" variant="soft" size="sm">
        Approved
      </Pill>
    )
  }
  if (type === 'flagged')
    return (
      <Pill color="#E85648" variant="soft" size="sm">
        Flagged
      </Pill>
    )
  if (type === 'engagement')
    return (
      <Pill color="#0CA7BC" variant="soft" size="sm">
        Engagement
      </Pill>
    )
  if (type === 'both')
    return (
      <Pill color="#B43DD0" variant="soft" size="sm">
        Both
      </Pill>
    )
  return null
}

export function SessionStatusBadge({ status }) {
  if (status === 'unfinished')
    return <span className="sess-status sess-status--partial">Unfinished</span>
  return null
}

export function RowFlyout({
  session,
  anchor,
  onClose,
  onSelectSession,
  onApproveRequest,
  onViewProfile,
}) {
  const flyoutRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!anchor) return
    const rect = anchor.getBoundingClientRect()
    setPos({ top: rect.bottom + 4, left: rect.right - 168 })
  }, [anchor])

  useEffect(() => {
    function onDown(e) {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target)) onClose()
    }
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const isApproved = session.changeLog?.some((e) => e.kind === 'approved')
  const canApprove = (session.type === 'flagged' || session.type === 'both') && !isApproved

  return createPortal(
    <div
      ref={flyoutRef}
      className="sess-flyout"
      style={{ top: pos.top, left: pos.left }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="sess-flyout-item"
        onClick={(e) => {
          e.stopPropagation()
          onSelectSession(session)
          onClose()
        }}
      >
        <Icon name="eye" size={14} />
        View details
      </button>
      {onViewProfile && (
        <button
          className="sess-flyout-item"
          onClick={(e) => {
            e.stopPropagation()
            onViewProfile(session.student)
            onClose()
          }}
        >
          <Icon name="user" size={14} />
          View profile
        </button>
      )}
      <button className="sess-flyout-item" onClick={(e) => e.stopPropagation()}>
        <Icon name="pencil" size={14} />
        Edit session
      </button>
      {canApprove && onApproveRequest && (
        <button
          className="sess-flyout-item"
          onClick={(e) => {
            e.stopPropagation()
            onApproveRequest(session)
            onClose()
          }}
        >
          <Icon name="check" size={14} />
          Approve session
        </button>
      )}
      <div className="sess-flyout-divider" />
      <button
        className="sess-flyout-item sess-flyout-item--danger"
        onClick={(e) => e.stopPropagation()}
      >
        <Icon name="trash" size={14} />
        Delete session
      </button>
    </div>,
    document.body,
  )
}

export function DotsButton({ session, onSelectSession, onApproveRequest, onViewProfile }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)

  return (
    <>
      <button
        ref={btnRef}
        className="sess-dots"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        aria-label="Session actions"
      >
        <span />
        <span />
        <span />
      </button>
      {open && (
        <RowFlyout
          session={session}
          anchor={btnRef.current}
          onClose={() => setOpen(false)}
          onSelectSession={onSelectSession}
          onApproveRequest={onApproveRequest}
          onViewProfile={onViewProfile}
        />
      )}
    </>
  )
}

export function SessionsTable({
  sessions,
  // The app names the date column for what happened on it — "Logged On"
  // everywhere, "Flagged On" on the flagged tab.
  dateLabel = 'Logged On',
  showUnitColumn = false,
  showSafetyColumn,
  onSelectSession,
  onApproveRequest,
  onViewProfile,
  showTypeColumn = true,
  showTalkColumn = true,
  showFlagIcons = false,
  showPosFlags = true,
  showEngagementColumn = true,
  showFlagsColumn = true,
  safetyDetail = false,
  hideStudentColumns = false,
  onClearFilters,
}) {
  // Show a Source column when sessions carry an origin (self-started book
  // talks vs. post-logging title completions). Off for plain BTWB lists.
  const showSource = sessions.some((s) => s.source)
  // Show a Safety column when any session carries a safety signal (Safety
  // Signals prototype). SFR's own sessions have none, so this stays off there.
  const showSafety = showSafetyColumn ?? sessions.some((s) => s.safety)
  const columns = [
    {
      key: 'date',
      label: dateLabel,
      sortable: true,
      render: (_, row) => {
        const d = new Date(row.date)
        return (
          <span className="sess-date">
            {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )
      },
    },
    ...(!hideStudentColumns
      ? [
          {
            key: 'student',
            label: 'Student',
            render: (_, row) =>
              onViewProfile ? (
                <button
                  className="sess-student-name sess-student-name--link"
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewProfile(row.student)
                  }}
                >
                  {row.student.name}
                </button>
              ) : (
                <span className="sess-student-name">{row.student.name}</span>
              ),
          },
          {
            key: 'grade',
            label: 'Grade',
            render: (_, row) => <span className="sess-grade">{row.student.grade}</span>,
          },
        ]
      : []),
    {
      key: 'book',
      label: 'Title',
      render: (_, row) => (
        // Unfinished is a filter and a column of its own; a badge in the
        // title cell said it a third time, in the one cell you read first.
        <button
          className="sess-book-title sess-book-title--link"
          onClick={(e) => {
            e.stopPropagation()
            onSelectSession?.(row)
          }}
        >
          {row.book.title}
        </button>
      ),
    },
    // "Unit" is how much was logged — the flagged tab's own column, since a
    // flag is usually about the amount.
    ...(showUnitColumn
      ? [
          {
            key: 'unit',
            label: 'Unit',
            render: (_, row) =>
              row.minutesLogged ? (
                <span className="sess-unit">{row.minutesLogged} minutes</span>
              ) : (
                <span className="sess-na">—</span>
              ),
          },
        ]
      : []),
    ...(showSafety
      ? [
          {
            key: 'safety',
            label: 'Safety',
            render: (_, row) =>
              row.safety ? (
                <SafetySeverityTag severity={row.safety.severity} />
              ) : (
                <span className="sess-na">—</span>
              ),
          },
        ]
      : []),
    ...(safetyDetail
      ? [
          {
            key: 'safetyStatus',
            label: 'Status',
            render: (_, row) => {
              if (!row.safety) return <span className="sess-na">—</span>
              const m = safetyStatusMeta(row.safety)
              return (
                <Pill color={m.color} variant="soft" size="sm">
                  {m.label}
                </Pill>
              )
            },
          },
        ]
      : []),
    ...(showSource
      ? [
          {
            key: 'source',
            label: 'Source',
            render: (_, row) => {
              const selfStarted = row.source === 'self'
              return (
                <span className={`sess-source-tag${selfStarted ? '' : ' sess-source-tag--title'}`}>
                  {selfStarted ? 'Self-Started' : 'Title Completion'}
                </span>
              )
            },
          },
        ]
      : []),
    ...(showTalkColumn
      ? [
          {
            key: 'talk',
            label: 'Talk',
            render: (_, row) => <TalkKindPill session={row} />,
          },
        ]
      : []),
    // Only shown when something in view actually reports one — a column of
    // dashes for every engagement talk isn't a column.
    ...(sessions.some((s) => sessionConfidence(s))
      ? [
          {
            key: 'confidence',
            label: 'Confidence',
            render: (_, row) => <ConfidencePill session={row} />,
          },
        ]
      : []),
    ...(showTypeColumn
      ? [
          {
            key: 'type',
            label: 'Type',
            render: (_, row) => <TypePill session={row} type={row.type} />,
          },
        ]
      : []),
    ...(showEngagementColumn
      ? [
          {
            key: 'engagement',
            label: 'Engagement',
            render: (_, row) => <RatingDot rating={row.engagementRating} />,
          },
        ]
      : []),
    ...(showPosFlags
      ? [
          {
            key: 'positiveFlags',
            label: <Icon name="flag" size={13} color="#0BA85F" />,
            render: (_, row) => <PosFlagCount positiveFlags={row.positiveFlags} />,
          },
        ]
      : []),
    ...(showFlagsColumn
      ? [
          {
            key: 'flags',
            label: <Icon name="flag" size={13} color="#E85648" />,
            render: (_, row) =>
              showFlagIcons ? <FlagTypeIcons flags={row.flags} /> : <FlagCount flags={row.flags} />,
          },
        ]
      : []),
    {
      key: 'action',
      label: '',
      render: (_, row) => (
        <DotsButton
          session={row}
          onSelectSession={onSelectSession}
          onApproveRequest={onApproveRequest}
          onViewProfile={onViewProfile}
        />
      ),
    },
  ]

  const emptyNode = onClearFilters ? (
    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <span>No sessions match your filters.</span>
      <button className="tbl-clear-filters-btn" onClick={onClearFilters}>
        Clear filters
      </button>
    </span>
  ) : (
    'No sessions match your filters.'
  )

  return (
    <div style={{ overflowX: 'auto', minWidth: 0 }}>
      <Table
        className="sess-table"
        columns={columns}
        rows={sessions}
        getRowKey={(r) => r.id}
        onRowClick={onSelectSession}
        pageSize={12}
        empty={emptyNode}
      />
    </div>
  )
}
