import { useEffect, useState, useCallback } from 'react'
import { STUDENTS_TO_WATCH } from '../data'
import { StudentProfileView } from '../../student-profile/BeanstackProfile'
import './StudentPanel.css'

const ANIM_DURATION = 220

export function StudentPanel({ studentId, onClose }) {
  const [closing, setClosing] = useState(false)
  const student = studentId ? STUDENTS_TO_WATCH.find(s => s.id === studentId) : null

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, ANIM_DURATION)
  }, [onClose])

  useEffect(() => {
    if (!student) return
    function onKey(e) { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [student, handleClose])

  if (!student) return null

  // Map 'marcus-chen' → 'marcus', 'anne-boonchuy' → 'anne', etc.
  const profileKey = student.id.split('-')[0]

  return (
    <>
      <div className={`stp-backdrop${closing ? ' stp-backdrop--closing' : ''}`} onClick={handleClose} />
      <aside className={`stp-panel${closing ? ' stp-panel--closing' : ''}`} aria-label={`${student.name} profile`}>
        <StudentProfileView studentKey={profileKey} onClose={handleClose} />
      </aside>
    </>
  )
}
