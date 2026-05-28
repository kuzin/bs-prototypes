import { SCHOOLS, STUDENTS_TO_WATCH } from '../data'
import { SECTIONS } from '@components/ReadingHealth/ReadingHealth'
import './StudentsToWatch.css'
import { Avatar } from '@components/Avatar/Avatar'
import { EmptyState } from '@components/Primitives/Primitives'

const BUCKETS = Object.fromEntries(SECTIONS.map((s) => [s.key, s]))

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
}

function StudentRow({ student, onOpen }) {
  const school = SCHOOLS.find((s) => s.id === student.schoolId)
  const bucket = BUCKETS[student.bucket]

  return (
    <button
      type="button"
      className="stw-row"
      onClick={() => onOpen?.(student.id)}
      title={`Open ${student.name}'s details`}
    >
      <Avatar
        initials={initials(student.name)}
        color={school?.color || '#94A3B8'}
        shape="rounded"
      />
      <span className="stw-name">{student.name}</span>
      {bucket && (
        <span
          className="stw-bucket"
          style={{ '--bucket-color': bucket.color, '--bucket-bg': bucket.bg }}
        >
          {bucket.label}
        </span>
      )}
      <span className="stw-chevron" aria-hidden="true">
        →
      </span>
    </button>
  )
}

export function StudentsToWatch({ schoolId, onOpenStudent }) {
  const students = schoolId
    ? STUDENTS_TO_WATCH.filter((s) => s.schoolId === schoolId)
    : STUDENTS_TO_WATCH

  if (students.length === 0) {
    return <EmptyState title="No students to watch" description="All schools are on track." />
  }

  return (
    <div className="stw-section">
      <div className="stw-header">
        <h3>Students to Watch</h3>
        <span className="stw-count">{students.length}</span>
      </div>
      <div className="stw-list">
        {students.map((s) => (
          <StudentRow key={s.id} student={s} onOpen={onOpenStudent} />
        ))}
      </div>
    </div>
  )
}
