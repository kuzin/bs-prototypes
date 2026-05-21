import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Table } from '../../ris/components/Table'
import { Pill } from '../../ris/components/Pill'
import '../../ris/components/Table.css'
import '../../ris/components/Pill.css'
import './SessionsTable.css'

const RATING_CONFIG = {
  green:  { color: '#16A97A', label: 'Positive',  bg: '#F0FDF4' },
  yellow: { color: '#D97706', label: 'Mixed',      bg: '#FFFBEB' },
  red:    { color: '#DC2626', label: 'Disengaged', bg: '#FEF2F2' },
}

function RatingDot({ rating }) {
  if (!rating) return <span className="sess-na">—</span>
  const cfg = RATING_CONFIG[rating]
  return (
    <span className="sess-rating" style={{ background: cfg.bg }}>
      <span className="sess-rating-dot" style={{ background: cfg.color }} />
      <span style={{ color: cfg.color, fontWeight: 700, fontSize: 12 }}>{cfg.label}</span>
    </span>
  )
}

const FLAG_TYPE_CONFIG = {
  'copy-paste': {
    label: 'Copied Response', color: '#DC2626', bg: '#FEF2F2',
    icon: <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="8" height="9" rx="1.5"/><path d="M4 4V2.5A1.5 1.5 0 0 1 5.5 1h5A1.5 1.5 0 0 1 12 2.5v7A1.5 1.5 0 0 1 10.5 11H10"/>
    </svg>,
  },
  'no-recall': {
    label: 'Unable to Recall', color: '#DC2626', bg: '#FEF2F2',
    icon: <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="5.5"/><path d="M5.5 5.5a1.8 1.8 0 0 1 3.1 1.2c0 1-1.4 1.5-1.6 2.3"/><circle cx="7" cy="10.5" r="0.6" fill="currentColor" stroke="none"/>
    </svg>,
  },
  'minimal': {
    label: 'Minimal Engagement', color: '#DC2626', bg: '#FEF2F2',
    icon: <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h10M2 7h7M2 10h5"/>
    </svg>,
  },
  'unintelligible': {
    label: 'Unintelligible', color: '#DC2626', bg: '#FEF2F2',
    icon: <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5.5 Q3.5 3 5 5.5 Q6.5 8 8 5.5 Q9.5 3 11 5.5"/><path d="M2 9 Q3.5 6.5 5 9 Q6.5 11.5 8 9 Q9.5 6.5 11 9"/>
    </svg>,
  },
  'quit-early': {
    label: 'Did Not Complete', color: '#DC2626', bg: '#FEF2F2',
    icon: <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="5.5"/><line x1="4.5" y1="4.5" x2="9.5" y2="9.5"/><line x1="9.5" y1="4.5" x2="4.5" y2="9.5"/>
    </svg>,
  },
}

const POS_FLAG_CONFIG = {
  'positive-sentiment': {
    label: 'Positive Sentiment', color: '#16A97A', bg: '#F0FDF4',
    icon: <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="5.5"/><path d="M4.5 8.5 Q7 11 9.5 8.5"/><circle cx="5" cy="5.5" r="0.7" fill="currentColor" stroke="none"/><circle cx="9" cy="5.5" r="0.7" fill="currentColor" stroke="none"/>
    </svg>,
  },
  'answer-length': {
    label: 'Long Answer', color: '#16A97A', bg: '#F0FDF4',
    icon: <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="4" x2="12" y2="4"/><line x1="2" y1="7" x2="12" y2="7"/><line x1="2" y1="10" x2="8" y2="10"/>
    </svg>,
  },
  'references-details': {
    label: 'References Details', color: '#16A97A', bg: '#F0FDF4',
    icon: <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="4"/><line x1="9" y1="9" x2="12.5" y2="12.5"/>
    </svg>,
  },
  'makes-connection': {
    label: 'Made a Connection', color: '#16A97A', bg: '#F0FDF4',
    icon: <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 8.5L8.5 5.5"/><path d="M4.5 10L3 11.5a2 2 0 0 0 2.8 2.8l.2-.2"/><path d="M9.5 4L11 2.5a2 2 0 0 0-2.8-2.8l-.2.2"/>
    </svg>,
  },
}

export { FLAG_TYPE_CONFIG, POS_FLAG_CONFIG }

export function FlagIconBadge({ type, cfg }) {
  return (
    <span className="sess-flag-icon" style={{ background: cfg.bg, color: cfg.color }} data-tooltip={cfg.label}>
      {cfg.icon}
    </span>
  )
}

function PosFlagCount({ positiveFlags }) {
  if (!positiveFlags || positiveFlags.length === 0) return <span className="sess-na">—</span>
  if (positiveFlags.length >= 3) {
    return (
      <span className="sess-flags sess-flags--pos">
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="#16A97A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v12"/><path d="M3 2h8l-2 4 2 4H3"/>
        </svg>
        {positiveFlags.length}
      </span>
    )
  }
  return (
    <span className="sess-flag-icons">
      {positiveFlags.map((f, i) => {
        const cfg = POS_FLAG_CONFIG[f.type] ?? { label: f.type, color: '#16A97A', bg: '#F0FDF4', icon: null }
        return <FlagIconBadge key={i} type={f.type} cfg={cfg} />
      })}
    </span>
  )
}

function FlagCount({ flags }) {
  if (!flags || flags.length === 0) return <span className="sess-na">—</span>
  return (
    <span className="sess-flags sess-flags--neg">
      <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v12"/><path d="M3 2h8l-2 4 2 4H3"/>
      </svg>
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
        const cfg = FLAG_TYPE_CONFIG[f.type] ?? { label: f.type, color: '#DC2626', bg: '#FEF2F2', icon: null }
        return <FlagIconBadge key={i} type={f.type} cfg={cfg} />
      })}
    </span>
  )
}

function TypePill({ session, type }) {
  const wasApproved = session?.changeLog?.some(e => e.kind === 'approved')
  if (wasApproved) {
    return <Pill color="#16A97A" variant="soft" size="sm">Approved</Pill>
  }
  if (type === 'flagged')    return <Pill color="#DC2626" variant="soft" size="sm">Flagged</Pill>
  if (type === 'engagement') return <Pill color="#0DA7BC" variant="soft" size="sm">Engagement</Pill>
  if (type === 'both')       return <Pill color="#7C3AED" variant="soft" size="sm">Both</Pill>
  return null
}

export function StatusBadge({ status }) {
  if (status === 'unfinished') return <span className="sess-status sess-status--partial">Unfinished</span>
  return null
}

export function RowFlyout({ session, anchor, onClose, onSelectSession, onApproveRequest, onViewProfile }) {
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
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const hasFlags = session.flags?.length > 0
  const isApproved = session.changeLog?.some(e => e.kind === 'approved')
  const canApprove = (session.type === 'flagged' || session.type === 'both') && !isApproved

  return createPortal(
    <div
      ref={flyoutRef}
      className="sess-flyout"
      style={{ top: pos.top, left: pos.left }}
      onClick={e => e.stopPropagation()}
    >
      <button className="sess-flyout-item" onClick={e => { e.stopPropagation(); onSelectSession(session); onClose() }}>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/>
        </svg>
        View details
      </button>
      {onViewProfile && (
        <button className="sess-flyout-item" onClick={e => { e.stopPropagation(); onViewProfile(session.student); onClose() }}>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="6" r="3"/><path d="M2.5 14a5.5 5.5 0 0 1 11 0"/>
          </svg>
          View profile
        </button>
      )}
      <button className="sess-flyout-item" onClick={e => e.stopPropagation()}>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 2l3 3-8 8H3v-3L11 2z"/>
        </svg>
        Edit session
      </button>
      {canApprove && onApproveRequest && (
        <button className="sess-flyout-item" onClick={e => { e.stopPropagation(); onApproveRequest(session); onClose() }}>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3,8 7,12 13,4"/>
          </svg>
          Approve session
        </button>
      )}
      <div className="sess-flyout-divider" />
      <button className="sess-flyout-item sess-flyout-item--danger" onClick={e => e.stopPropagation()}>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2,4 14,4"/><path d="M5 4V2h6v2"/><path d="M6 7v5M10 7v5"/><path d="M3 4l1 10h8l1-10"/>
        </svg>
        Delete session
      </button>
    </div>,
    document.body
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
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
        aria-label="Session actions"
      >
        <span /><span /><span />
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

export function SessionsTable({ sessions, onSelectSession, onApproveRequest, onViewProfile, showTypeColumn = true, showFlagIcons = false, showPosFlags = true, showEngagementColumn = true, hideStudentColumns = false, onClearFilters }) {
  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (_, row) => {
        const d = new Date(row.date)
        return <span className="sess-date">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      },
    },
    ...(!hideStudentColumns ? [
      {
        key: 'student',
        label: 'Student',
        render: (_, row) => onViewProfile
          ? (
            <button
              className="sess-student-name sess-student-name--link"
              onClick={e => { e.stopPropagation(); onViewProfile(row.student) }}
            >{row.student.name}</button>
          )
          : <span className="sess-student-name">{row.student.name}</span>,
      },
      {
        key: 'grade',
        label: 'Grade',
        render: (_, row) => <span className="sess-grade">{row.student.grade}</span>,
      },
    ] : []),
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
    ...(showTypeColumn ? [{
      key: 'type',
      label: 'Type',
      render: (_, row) => <TypePill session={row} type={row.type} />,
    }] : []),
    ...(showEngagementColumn ? [{
      key: 'engagement',
      label: 'Engagement',
      render: (_, row) => <RatingDot rating={row.engagementRating} />,
    }] : []),
    ...(showPosFlags ? [{
      key: 'positiveFlags',
      label: (
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="#16A97A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v12"/>
          <path d="M3 2h8l-2 4 2 4H3"/>
        </svg>
      ),
      render: (_, row) => <PosFlagCount positiveFlags={row.positiveFlags} />,
    }] : []),
    {
      key: 'flags',
      label: (
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v12"/>
          <path d="M3 2h8l-2 4 2 4H3"/>
        </svg>
      ),
      render: (_, row) => showFlagIcons
        ? <FlagTypeIcons flags={row.flags} />
        : <FlagCount flags={row.flags} />,
    },
    {
      key: 'action',
      label: '',
      render: (_, row) => <DotsButton session={row} onSelectSession={onSelectSession} onApproveRequest={onApproveRequest} onViewProfile={onViewProfile} />,
    },
  ]

  const emptyNode = onClearFilters ? (
    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <span>No sessions match your filters.</span>
      <button className="tbl-clear-filters-btn" onClick={onClearFilters}>Clear filters</button>
    </span>
  ) : 'No sessions match your filters.'

  return (
    <div style={{ overflowX: 'auto', minWidth: 0 }}>
      <Table
        columns={columns}
        rows={sessions}
        getRowKey={r => r.id}
        onRowClick={onSelectSession}
        compact
        pageSize={12}
        empty={emptyNode}
      />
    </div>
  )
}
