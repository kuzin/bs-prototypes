import { useState, useEffect } from 'react'
import { Modal } from '@components/Modal/Modal'
import '@components/Modal/Modal.css'

// The real Student Profile, opened from the classroom roster — the same
// side-panel treatment RIS, SfR and Words with Benny already use, rather than a
// second, bespoke student window. Engagement rides in through the profile's own
// additive slots: `extraNav`/`renderExtra` for the section, and
// `renderAfterSummary` for the card that leads the Overview.
import { StudentProfileView } from '../../student-profile/BeanstackProfile'
import '../../student-profile/BeanstackProfile.css'
import '../../ris/components/StudentPanel.css'

import { StudentSignal, SignalOverviewCard } from './StudentSignal'

// Added to the profile's own left rail, ahead of Motivation: the signal is a
// reading across the four analysis sections, so it leads them rather than being
// filed last after Points Summary. (`before` is the profile's own hook for
// placing an `extraNav` item — without it, items append.)
const EXTRA_NAV = [
  { icon: 'insights', section: 'engagement', label: 'Engagement', before: 'motivation' },
]

/**
 * @param studentKey  which reader to open — the profile's own key ('marcus').
 * @param section     a profile section to land on, or null for the Overview.
 */
export function StudentProfilePanel({ studentKey, section = null, onClose }) {
  // The panel owns its width, so expanding is the host's call to make — the
  // profile's control rail just asks for it. Reset on close so the next reader
  // opens as a side panel. (Same contract as RIS's StudentPanel.)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!studentKey) setExpanded(false)
  }, [studentKey])

  return (
    <Modal open={Boolean(studentKey)} onClose={onClose} variant="side" ariaLabel="Student profile">
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
              renderExtra={(_section, student) => <StudentSignal student={student} />}
              renderAfterSummary={(student, onNavigate) => (
                <SignalOverviewCard student={student} onNavigate={() => onNavigate('engagement')} />
              )}
            />
          )}
        </div>
      )}
    </Modal>
  )
}
