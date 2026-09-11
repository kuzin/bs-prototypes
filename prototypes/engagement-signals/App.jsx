import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'

// Both surfaces are the real ones out of the Student Profile prototype — the
// classroom page and the profile panel — with the signal added through the
// additive slots they already expose. Nothing here is a lookalike of either.
import { ClassroomView } from '../student-profile/BeanstackProfile'
import '../student-profile/BeanstackProfile.css'

import { ClassEngagement } from './components/ClassEngagement'
import { StudentProfilePanel } from './components/StudentProfilePanel'

import './index.css'

export function App() {
  // `{ key, section }` — the reader the profile panel is open on, and where it
  // lands. There's no view switcher: the class page is the way in, and a row
  // opens the reader behind it, which is the path a teacher actually takes.
  const [open, setOpen] = useState(null)
  const openStudent = (key, section = null) => setOpen({ key, section })

  return (
    <div className="es-root">
      <div className="es-stage">
        <ClassroomView
          // The Daily Reading table's own rows still open the Overview; the
          // Engagement tab's rows name Engagement themselves.
          onStudentClick={openStudent}
          extraTabs={[{ id: 'engagement', label: 'Engagement' }]}
          initialTab="engagement"
          renderExtra={() => <ClassEngagement onOpenStudent={openStudent} />}
        />
      </div>

      <StudentProfilePanel
        studentKey={open?.key}
        section={open?.section}
        onClose={() => setOpen(null)}
      />

      <PrototypeNav currentHref="/bs-prototypes/engagement-signals/" />
    </div>
  )
}
