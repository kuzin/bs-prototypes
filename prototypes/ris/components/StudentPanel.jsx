import { useState, useEffect } from 'react'
import { STUDENTS_TO_WATCH } from '../data'
import { StudentProfileView, STUDENT_ORDER } from '../../student-profile/BeanstackProfile'
import { Modal } from '@components/Modal/Modal'
import '@components/Modal/Modal.css'
import './StudentPanel.css'

export function StudentPanel({ studentId, student: studentProp, onClose }) {
  // The panel owns its width, so expanding is the host's call to make — the
  // profile's control rail just asks for it. Reset on close so the next reader
  // opens as a side panel.
  const [expanded, setExpanded] = useState(false)
  const student =
    studentProp || (studentId ? STUDENTS_TO_WATCH.find((s) => s.id === studentId) : null)

  // Resolve the profile key from whatever the host calls its students: an
  // explicit override, RIS's 'marcus-chen' → 'marcus' id convention, or the
  // first name. Each candidate is checked against the profile fixture before
  // it wins — SFR's ids are 'stu-1', so the id convention alone resolved every
  // reader to 'stu' and opened Marcus's profile for all of them.
  const candidates = student
    ? [student.profileKey, student.id?.split('-')[0], student.name?.toLowerCase().split(' ')[0]]
    : []
  const profileKey =
    candidates.find((k) => k && STUDENT_ORDER.includes(k)) ?? candidates.find(Boolean)

  useEffect(() => {
    if (!student) setExpanded(false)
  }, [student])

  return (
    <Modal
      open={!!student}
      onClose={onClose}
      variant="side"
      ariaLabel={student ? `${student.name} profile` : undefined}
    >
      {({ close }) => (
        <div className={`stp-content${expanded ? ' stp-content--full' : ''}`}>
          {student && (
            <StudentProfileView
              studentKey={profileKey}
              onClose={close}
              expanded={expanded}
              onToggleExpand={() => setExpanded((v) => !v)}
            />
          )}
        </div>
      )}
    </Modal>
  )
}
