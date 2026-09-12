import { Table } from '@components/Table/Table'
import { Pill } from '@components/Pill/Pill'
import { DotsButton } from './SessionsTable'
import '@components/Table/Table.css'
import '@components/Pill/Pill.css'
import './SessionsTable.css'
import './ReaderGroupedView.css'

// "List by: By Reader" — the app's `FlaggedEntriesByReader` roll-up.
//
// One row per reader with how many sessions are behind them, not a grouped
// version of the session table: the question this view answers is *who* keeps
// turning up, and a list of readers answers it in one screen where an expanded
// tree answers it in several. Columns are the app's — Student / Grade / count
// — plus the same row menu the session table carries.
//
// It's the shared `<Table>` like every other list here; the grouped markup this
// replaced was the only hand-rolled `<table>` left in the prototype.
export function ReaderGroupedView({
  sessions,
  countLabel = 'Sessions',
  onSelectSession,
  onApproveRequest,
  onViewProfile,
  onClearFilters,
}) {
  const seen = new Map()
  for (const s of sessions) {
    const key = s.student.id ?? s.student.name
    const at = seen.get(key)
    if (!at) seen.set(key, { id: key, student: s.student, sessions: [s] })
    else at.sessions.push(s)
  }
  // Most first: the reader with six flagged sessions is the reason to open the
  // tab at all.
  const readers = [...seen.values()]
    .map((r) => ({ ...r, count: r.sessions.length }))
    .sort((a, b) => b.count - a.count)

  const columns = [
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
    {
      key: 'count',
      label: countLabel,
      sortable: true,
      render: (_, row) => (
        <Pill color="#E85648" variant="soft" size="sm">
          {row.count}
        </Pill>
      ),
    },
    {
      key: 'action',
      label: '',
      render: (_, row) => (
        <DotsButton
          session={row.sessions[0]}
          onSelectSession={onSelectSession}
          onApproveRequest={onApproveRequest}
          onViewProfile={onViewProfile}
        />
      ),
    },
  ]

  const empty = onClearFilters ? (
    <span className="rgv-empty">
      <span>No sessions match your filters.</span>
      <button className="tbl-clear-filters-btn" onClick={onClearFilters}>
        Clear filters
      </button>
    </span>
  ) : (
    'No sessions match your filters.'
  )

  return (
    <div className="rgv-shell">
      <Table
        columns={columns}
        rows={readers}
        getRowKey={(r) => r.id}
        onRowClick={(r) => onSelectSession(r.sessions[0])}
        pageSize={12}
        scrollX
        empty={empty}
      />
    </div>
  )
}
