import { SessionsTable } from './SessionsTable'
import './ReaderGroupedView.css'

export function ReaderGroupedView({ sessions, onSelectSession, showTypeColumn = true }) {
  // Group sessions by student, preserving first-seen order
  const groups = []
  const seen = {}
  for (const s of sessions) {
    const id = s.student.id
    if (!seen[id]) {
      seen[id] = { student: s.student, sessions: [] }
      groups.push(seen[id])
    }
    seen[id].sessions.push(s)
  }

  if (groups.length === 0) {
    return <div className="rgv-empty">No sessions match your filters.</div>
  }

  return (
    <div className="rgv-shell">
      {groups.map(({ student, sessions: studentSessions }) => (
        <div key={student.id} className="rgv-group">
          <div className="rgv-header">
            <div className="rgv-avatar" style={{ background: student.color }}>
              {student.initials}
            </div>
            <span className="rgv-name">{student.name}</span>
            <span className="rgv-grade">{student.grade} grade</span>
            <span className="rgv-count">
              {studentSessions.length} {studentSessions.length === 1 ? 'session' : 'sessions'}
            </span>
          </div>
          <div className="rgv-table">
            <SessionsTable
              sessions={studentSessions}
              onSelectSession={onSelectSession}
              showTypeColumn={showTypeColumn}
              hideStudentColumns
            />
          </div>
        </div>
      ))}
    </div>
  )
}
