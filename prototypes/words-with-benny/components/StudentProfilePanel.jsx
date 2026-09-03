import { useState, useEffect } from 'react'
import { Modal } from '@components/Modal/Modal'
import '@components/Modal/Modal.css'

// The real Student Profile, opened from the classroom roster straight onto its
// Vocabulary section — the same side-panel treatment RIS and SfR already use
// (`ris/components/StudentPanel`), rather than a second, bespoke student window.
import { StudentProfileView } from '../../student-profile/BeanstackProfile'
import '../../student-profile/BeanstackProfile.css'
import '../../ris/components/StudentPanel.css'

import { StudentVocabulary } from './StudentVocabulary'
import { profileFor } from '../data'

// Appended to the profile's own left rail.
const EXTRA_NAV = [{ icon: 'ti-vocabulary', section: 'vocabulary', label: 'Vocabulary' }]

export function StudentProfilePanel({ studentId, onClose }) {
  // The panel owns its width, so expanding is the host's call to make — the
  // profile's control rail just asks for it. Reset on close so the next reader
  // opens as a side panel. (Same contract as RIS's StudentPanel.)
  const [expanded, setExpanded] = useState(false)
  const profile = studentId ? profileFor(studentId) : null

  useEffect(() => {
    if (!studentId) setExpanded(false)
  }, [studentId])

  return (
    <Modal open={Boolean(profile)} onClose={onClose} variant="side" ariaLabel="Student profile">
      {({ close }) => (
        <div className={`stp-content${expanded ? ' stp-content--full' : ''}`}>
          {profile && (
            <StudentProfileView
              studentKey={profile.studentKey}
              overrides={profile.overrides}
              onClose={close}
              expanded={expanded}
              onToggleExpand={() => setExpanded((v) => !v)}
              initialSection="vocabulary"
              extraNav={EXTRA_NAV}
              renderExtra={() => <StudentVocabulary studentId={studentId} />}
            />
          )}
        </div>
      )}
    </Modal>
  )
}
