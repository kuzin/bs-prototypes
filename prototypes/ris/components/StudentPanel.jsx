import { STUDENTS_TO_WATCH } from '../data'
import { StudentProfileView } from '../../student-profile/BeanstackProfile'
import { Modal } from '@components/Modal/Modal'
import '@components/Modal/Modal.css'
import './StudentPanel.css'

export function StudentPanel({ studentId, student: studentProp, onClose }) {
  const student =
    studentProp || (studentId ? STUDENTS_TO_WATCH.find((s) => s.id === studentId) : null)

  // Resolve profile key:
  //   – explicit override on the student object
  //   – existing 'marcus-chen' → 'marcus' id convention
  //   – fall back to first name lowercased (Tyler Williams → tyler)
  const profileKey =
    student &&
    (student.profileKey ||
      (student.id?.includes('-') ? student.id.split('-')[0] : null) ||
      student.name.toLowerCase().split(' ')[0])

  return (
    <Modal
      open={!!student}
      onClose={onClose}
      variant="side"
      ariaLabel={student ? `${student.name} profile` : undefined}
    >
      {({ close }) => (
        <div className="stp-content">
          {student && <StudentProfileView studentKey={profileKey} onClose={close} />}
        </div>
      )}
    </Modal>
  )
}
