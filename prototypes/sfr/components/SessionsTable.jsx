import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Table } from '@components/Table/Table'
import { Pill } from '@components/Pill/Pill'
import { Tooltip } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import '@components/Table/Table.css'
import '@components/Pill/Pill.css'
import '@components/Primitives/Primitives.css'
import './SessionsTable.css'

const RATING_CONFIG = {
  green: { color: '#16A97A', label: 'Positive', bg: '#F0FDF4' },
  yellow: { color: '#D97706', label: 'Mixed', bg: '#FFFBEB' },
  red: { color: '#DC2626', label: 'Disengaged', bg: '#FEF2F2' },
}

function RatingDot({ rating }) {
  if (!rating) return <span className="sess-na">—</span>
  const cfg = RATING_CONFIG[rating]
  return (
    <span className="sess-rating" style={{ background: cfg.bg, borderColor: `${cfg.color}33` }}>
      <span style={{ color: cfg.color }}>{cfg.label}</span>
    </span>
  )
}

const FLAG_TYPE_CONFIG = {
  'copy-paste': {
    label: 'Copied Response',
    color: '#DC2626',
    bg: '#FEF2F2',
    icon: <Icon name="copy" size={12} />,
  },
  'no-recall': {
    label: 'Unable to Recall',
    color: '#DC2626',
    bg: '#FEF2F2',
    icon: <Icon name="help" size={12} />,
  },
  minimal: {
    label: 'Minimal Engagement',
    color: '#DC2626',
    bg: '#FEF2F2',
    icon: <Icon name="align-left" size={12} />,
  },
  unintelligible: {
    label: 'Unintelligible',
    color: '#DC2626',
    bg: '#FEF2F2',
    icon: <Icon name="wave" size={12} />,
  },
  'quit-early': {
    label: 'Did Not Complete',
    color: '#DC2626',
    bg: '#FEF2F2',
    icon: <Icon name="circle-x" size={12} />,
  },
}

const POS_FLAG_CONFIG = {
  'positive-sentiment': {
    label: 'Positive Sentiment',
    color: '#16A97A',
    bg: '#F0FDF4',
    icon: <Icon name="smile" size={12} />,
  },
  'answer-length': {
    label: 'Long Answer',
    color: '#16A97A',
    bg: '#F0FDF4',
    icon: <Icon name="list" size={12} />,
  },
  'references-details': {
    label: 'References Details',
    color: '#16A97A',
    bg: '#F0FDF4',
    icon: <Icon name="search" size={12} />,
  },
  'makes-connection': {
    label: 'Made a Connection',
    color: '#16A97A',
    bg: '#F0FDF4',
    icon: <Icon name="link" size={12} />,
  },
}

export { FLAG_TYPE_CONFIG, POS_FLAG_CONFIG }

export function FlagIconBadge({ cfg }) {
  return (
    <Tooltip content={cfg.label}>
      <span className="sess-flag-icon" style={{ background: cfg.bg, color: cfg.color }}>
        {cfg.icon}
      </span>
    </Tooltip>
  )
}

function PosFlagCount({ positiveFlags }) {
  if (!positiveFlags || positiveFlags.length === 0) return <span className="sess-na">—</span>
  if (positiveFlags.length >= 3) {
    return (
      <span className="sess-flags sess-flags--pos">
        <Icon name="flag" size={13} color="#16A97A" />
        {positiveFlags.length}
      </span>
    )
  }
  return (
    <span className="sess-flag-icons">
      {positiveFlags.map((f, i) => {
        const cfg = POS_FLAG_CONFIG[f.type] ?? {
          label: f.type,
          color: '#16A97A',
          bg: '#F0FDF4',
          icon: null,
        }
        return <FlagIconBadge key={i} type={f.type} cfg={cfg} />
      })}
    </span>
  )
}

function FlagCount({ flags }) {
  if (!flags || flags.length === 0) return <span className="sess-na">—</span>
  return (
    <span className="sess-flags sess-flags--neg">
      <Icon name="flag" size={13} color="#DC2626" />
      {flags.length}
    </span>
  )
}

function FlagTypeIcons({ flags }) {
  if (!flags || flags.length === 0) return <span className="sess-na">—</span>
  if (flags.length >= 3) return <FlagCount flags={flags} />
  return (
    <span className="sess-flag-icons">
      {flags.map((f, i) => {
        const cfg = FLAG_TYPE_CONFIG[f.type] ?? {
          label: f.type,
          color: '#DC2626',
          bg: '#FEF2F2',
          icon: null,
        }
        return <FlagIconBadge key={i} type={f.type} cfg={cfg} />
      })}
    </span>
  )
}

function TypePill({ session, type }) {
  const wasApproved = session?.changeLog?.some((e) => e.kind === 'approved')
  if (wasApproved) {
    return (
      <Pill color="#16A97A" variant="soft" size="sm">
        Approved
      </Pill>
    )
  }
  if (type === 'flagged')
    return (
      <Pill color="#DC2626" variant="soft" size="sm">
        Flagged
      </Pill>
    )
  if (type === 'engagement')
    return (
      <Pill color="#0DA7BC" variant="soft" size="sm">
        Engagement
      </Pill>
    )
  if (type === 'both')
    return (
      <Pill color="#7C3AED" variant="soft" size="sm">
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
  onSelectSession,
  onApproveRequest,
  onViewProfile,
  showTypeColumn = true,
  showFlagIcons = false,
  showPosFlags = true,
  showEngagementColumn = true,
  hideStudentColumns = false,
  onClearFilters,
}) {
  // Show a Source column when sessions carry an origin (Activity Badge book
  // talks vs. post-logging title completions). Off for plain BTWB lists.
  const showSource = sessions.some((s) => s.source)
  const columns = [
    {
      key: 'date',
      label: 'Date',
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
        <span className="sess-title-cell">
          <span className="sess-book-title">{row.book.title}</span>
          {row.status === 'unfinished' && <span className="sess-unfinished-badge">Unfinished</span>}
        </span>
      ),
    },
    ...(showSource
      ? [
          {
            key: 'source',
            label: 'Source',
            render: (_, row) => {
              const activity = row.source === 'activity'
              return (
                <span className={`sess-source-tag${activity ? '' : ' sess-source-tag--title'}`}>
                  {activity ? 'Activity Badge' : 'Title Completion'}
                </span>
              )
            },
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
            label: <Icon name="flag" size={13} color="#16A97A" />,
            render: (_, row) => <PosFlagCount positiveFlags={row.positiveFlags} />,
          },
        ]
      : []),
    {
      key: 'flags',
      label: <Icon name="flag" size={13} color="#DC2626" />,
      render: (_, row) =>
        showFlagIcons ? <FlagTypeIcons flags={row.flags} /> : <FlagCount flags={row.flags} />,
    },
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
        columns={columns}
        rows={sessions}
        getRowKey={(r) => r.id}
        onRowClick={onSelectSession}
        compact
        pageSize={12}
        empty={emptyNode}
      />
    </div>
  )
}
