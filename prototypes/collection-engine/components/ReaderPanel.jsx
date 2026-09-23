import { useState, useEffect } from 'react'
import { Modal } from '@components/Modal/Modal'
import '@components/Modal/Modal.css'

// The real Student Profile, opened from the book panel — the same side panel
// RIS, SfR, Engagement Signals and the teacher view already use, rather than a
// second, bespoke reader window.
import { StudentProfileView } from '../../student-profile/BeanstackProfile'
import '../../student-profile/BeanstackProfile.css'
import '../../ris/components/StudentPanel.css'

// The same Recommendations section the classroom view shows, so a reader opened
// from a book panel has the engine's side of their profile too — it was only
// ever wired up on the teacher side. One feature, two ways in; the teacher's
// data module already imports this prototype's `derive`, so the pair reads as
// one thing split over two entry points rather than two copies.
import { ReaderRecommendations } from '../../collection-engine-teacher/components/ReaderRecommendations'

/**
 * <ReaderPanel studentKey="marcus" section="integrity" onClose={…} />
 *
 * `studentKey` is a key into the Student Profile prototype's own fixtures.
 * Three of a school's readers are seeded from `PROFILED` and carry their own;
 * the rest are generated for the funnel maths and carry one of those three as a
 * stand-in, so every name in the panel is a link.
 */
// Placed ahead of Motivation: what a reader has been handed to read sits with
// the rest of their reading life, not filed last behind the analysis sections.
// Same entry the classroom view uses.
const EXTRA_NAV = [
  { icon: 'book', section: 'recommendations', label: 'Recommendations', before: 'motivation' },
]

export function ReaderPanel({ studentKey, section = null, onClose }) {
  // The panel owns its width, so expanding is the host's call — the profile's
  // control rail just asks for it. (Same contract as RIS's StudentPanel.)
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
              // Remounting on the section is what lets a book-talk row land on
              // Book Talks while a plain name opens the Overview.
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
