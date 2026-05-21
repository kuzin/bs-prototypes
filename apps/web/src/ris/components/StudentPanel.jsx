import { useEffect, useState, useCallback } from 'react'
import { STUDENTS_TO_WATCH } from '../data'
import { StudentProfileView } from '../../student-profile/BeanstackProfile'
import './StudentPanel.css'

const ANIM_DURATION = 220

export function StudentPanel({ studentId, student: studentProp, onClose }) {
  const [closing, setClosing] = useState(false)
  const student = studentProp
    || (studentId ? STUDENTS_TO_WATCH.find(s => s.id === studentId) : null)

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

  // Resolve profile key:
  //   – explicit override on the student object
  //   – existing 'marcus-chen' → 'marcus' id convention
  //   – fall back to first name lowercased (Tyler Williams → tyler)
  const profileKey = student.profileKey
    || (student.id?.includes('-') ? student.id.split('-')[0] : null)
    || student.name.toLowerCase().split(' ')[0]

  return (
    <>
      <div className={`stp-backdrop${closing ? ' stp-backdrop--closing' : ''}`} onClick={handleClose} />
      <aside className={`stp-panel${closing ? ' stp-panel--closing' : ''}`} aria-label={`${student.name} profile`}>
        <StudentProfileView studentKey={profileKey} onClose={handleClose} />
      </aside>
    </>
  )
}
