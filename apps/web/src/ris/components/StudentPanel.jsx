import { useEffect } from 'react'
import { STUDENTS_TO_WATCH } from '../data'
import { StudentProfileView } from '../../student-profile/BeanstackProfile'
import './StudentPanel.css'

export function StudentPanel({ studentId, onClose }) {
  const student = studentId ? STUDENTS_TO_WATCH.find(s => s.id === studentId) : null

  useEffect(() => {
    if (!student) return
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [student, onClose])

  if (!student) return null

  // Map 'marcus-chen' → 'marcus', 'anne-boonchuy' → 'anne', etc.
  const profileKey = student.id.split('-')[0]

  return (
    <>
      <div className="stp-backdrop" onClick={onClose} />
      <aside className="stp-panel" aria-label={`${student.name} profile`}>
        <button className="stp-close" onClick={onClose} aria-label="Close panel">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="3" x2="13" y2="13" />
            <line x1="13" y1="3" x2="3" y2="13" />
          </svg>
        </button>
        <StudentProfileView studentKey={profileKey} />
      </aside>
    </>
  )
}
