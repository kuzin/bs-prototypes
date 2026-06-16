// Pattern Library — RIS group.
// RIS-specific reusable components shared across the School/District views (the
// view shells themselves live in the prototype). Styles loaded by catalog.jsx.
import { SchoolCell } from '../../ris/components/SchoolCell'
import { StudentsToWatch } from '../../ris/components/StudentsToWatch'
import { Variant } from './_shared'

export const risSections = [
  {
    group: 'ris',
    id: 'ris-school-cell',
    name: 'SchoolCell',
    desc: (
      <>
        Compact school-identity cell — <code>name</code> over an optional <code>meta</code> line.
        Used inside District <code>Table</code>s and ranked lists.
      </>
    ),
    render: () => (
      <Variant label="with meta · name only">
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          <SchoolCell name="Lincoln Elementary" meta="K–5 · 1,650 students" />
          <SchoolCell name="Roosevelt Middle" />
        </div>
      </Variant>
    ),
  },
  {
    group: 'ris',
    id: 'ris-students-to-watch',
    name: 'StudentsToWatch',
    desc: (
      <>
        Dashboard watch-list of students flagged in a reading-health area; each row links to the
        student profile. Reuses the canonical <code>SECTIONS</code> buckets + <code>Avatar</code>,
        and falls back to an <code>EmptyState</code> when a school is on track.
      </>
    ),
    render: () => (
      <Variant label="school watch-list" full>
        <div style={{ maxWidth: 640 }}>
          <StudentsToWatch schoolId="lincoln" onOpenStudent={() => {}} />
        </div>
      </Variant>
    ),
  },
]
