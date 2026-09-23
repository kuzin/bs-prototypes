import { useState, useEffect } from 'react'
import { Modal } from '@components/Modal/Modal'
import '@components/Modal/Modal.css'

// The real Student Profile, opened from the classroom roster — the same side
// panel RIS, SfR and Engagement Signals already use, rather than a second,
// bespoke student window. Recommendations ride in through the profile's own
// additive slot: `extraNav` for the section, `renderExtra` for its content.
import { StudentProfileView } from '../../student-profile/BeanstackProfile'
import '../../student-profile/BeanstackProfile.css'
import '../../ris/components/StudentPanel.css'

import { ReaderRecommendations } from './ReaderRecommendations'

// Placed ahead of Motivation: what a reader has been handed to read sits with
// the rest of their reading life, not filed last behind the analysis sections.
const EXTRA_NAV = [
  { icon: 'book', section: 'recommendations', label: 'Recommendations', before: 'motivation' },
]

export function ReaderProfilePanel({ studentKey, section = null, onClose }) {
  // The panel owns its width, so expanding is the host's call — the profile's
  // control rail just asks for it. Reset on close so the next reader opens as a
  // side panel. (Same contract as RIS's StudentPanel.)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!studentKey) setExpanded(false)
  }, [studentKey])

  return (
    <Modal open={Boolean(studentKey)} onClose={onClose} variant="side" ariaLabel="Reader profile">
      {({ close }) => (
        <div className={`stp-content${expanded ? ' stp-content--full' : ''}`}>
          {studentKey && (
            <StudentProfileView
              // Remounting on the section is what lets a row action land on a
              // page of its own while a plain row click opens the Overview.
              key={`${studentKey}-${section ?? 'overview'}`}
              studentKey={studentKey}
              initialSection={section}
              onClose={close}
              expanded={expanded}
              onToggleExpand={() => setExpanded((v) => !v)}
              extraNav={EXTRA_NAV}
              renderExtra={() => <ReaderRecommendations studentKey={studentKey} />}
            />
          )}
        </div>
      )}
    </Modal>
  )
}
