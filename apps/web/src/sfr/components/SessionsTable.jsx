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

function FlagCount({ flags }) {
  if (!flags || flags.length === 0) return <span className="sess-na">—</span>
  return (
    <span className="sess-flags">
      <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v12"/>
        <path d="M3 2h8l-2 4 2 4H3"/>
      </svg>
      {flags.length}
    </span>
  )
}

function TypePill({ type }) {
  if (type === 'flagged')    return <Pill color="#DC2626" variant="soft" size="sm">Flagged</Pill>
  if (type === 'engagement') return <Pill color="#0DA7BC" variant="soft" size="sm">Engagement</Pill>
  if (type === 'both')       return <Pill color="#7C3AED" variant="soft" size="sm">Both</Pill>
  return null
}

function DotsButton({ onClick }) {
  return (
    <button className="sess-dots" onClick={e => { e.stopPropagation(); onClick() }} aria-label="Open session">
      <span /><span /><span />
    </button>
  )
}

export function SessionsTable({ sessions, onSelectSession, showTypeColumn = true, hideStudentColumns = false }) {
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
        render: (_, row) => <span className="sess-student-name">{row.student.name}</span>,
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
      render: (_, row) => <span className="sess-book-title">{row.book.title}</span>,
    },
    ...(showTypeColumn ? [{
      key: 'type',
      label: 'Type',
      render: (_, row) => <TypePill type={row.type} />,
    }] : []),
    {
      key: 'engagement',
      label: 'Engagement',
      render: (_, row) => <RatingDot rating={row.engagementRating} />,
    },
    {
      key: 'flags',
      label: 'Flags',
      render: (_, row) => <FlagCount flags={row.flags} />,
    },
    {
      key: 'action',
      label: '',
      render: (_, row) => <DotsButton onClick={() => onSelectSession(row)} />,
    },
  ]

  return (
    <div style={{ overflowX: 'auto', minWidth: 0 }}>
      <Table
        columns={columns}
        rows={sessions}
        getRowKey={r => r.id}
        onRowClick={onSelectSession}
        compact
        pageSize={12}
        empty="No sessions match your filters."
      />
    </div>
  )
}
