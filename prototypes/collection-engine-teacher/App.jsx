import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'

// Both surfaces are the real ones out of the Student Profile prototype — the
// classroom page and the profile panel — with recommendations added through the
// additive slots they already expose. Nothing here is a lookalike of either.
import { ClassroomView } from '../student-profile/BeanstackProfile'
import '../student-profile/BeanstackProfile.css'

/* The class's Book List, out of the Discover Lists prototype — the same tab and
   the same shelf, because this is the same classroom page. The import runs one
   way only: that prototype takes `ClassRecommendations` from here, and nothing
   it hands back reaches into this folder. */
import { ClassroomBookList } from '../discover-lists/components/ClassroomBookList'
import { ListPreview } from '../discover-lists/components/ListPreview'
import { CLASSROOMS, ROLES, SEED_LISTS, blankList, isFull } from '../discover-lists/data'
import '../discover-lists/index.css'

import { ClassRecommendations } from './components/ClassRecommendations'
import { ReaderProfilePanel } from './components/ReaderProfilePanel'

import './index.css'

/* This page is Class A's, so the list it shows is Class A's. */
const CLASSROOM = CLASSROOMS[0]
const TEACHER = ROLES.teacher

const TABS = [
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'booklist', label: 'Book List' },
]

export function App() {
  // `{ key, section }` — the reader the profile is open on, and where it lands.
  // There's no view switcher: the class page is the way in and a row opens the
  // reader behind it, which is the path a teacher actually takes.
  const [open, setOpen] = useState(null)
  const openStudent = (key, section = null) => setOpen({ key, section })

  const [list, setList] = useState(
    () => SEED_LISTS.find((l) => l.classroomId === CLASSROOM.id) ?? null,
  )
  const [previewing, setPreviewing] = useState(false)

  /* Both ways in land here — the Book List tab's picker and the bookmark on a
     recommendation — and the first book is what brings the list into being. */
  function addToList(titleId) {
    setList((cur) => {
      if (!cur) return { ...blankList(TEACHER, CLASSROOM), books: [titleId] }
      if (cur.books.includes(titleId) || isFull(cur)) return cur
      return { ...cur, books: [...cur.books, titleId] }
    })
  }

  return (
    <div className="cet-root">
      <div className="cet-stage">
        <ClassroomView
          onStudentClick={openStudent}
          extraTabs={TABS}
          initialTab="recommendations"
          renderExtra={(tab) =>
            tab === 'booklist' ? (
              <ClassroomBookList
                classroom={CLASSROOM}
                list={list}
                onChange={setList}
                onCreate={(classroom, books) =>
                  setList({ ...blankList(TEACHER, classroom), books })
                }
                onPreview={() => setPreviewing(true)}
              />
            ) : (
              <ClassRecommendations
                onOpenStudent={openStudent}
                onAddToList={addToList}
                listed={list?.books ?? []}
                listFull={isFull(list)}
              />
            )
          }
        />
      </div>

      <ReaderProfilePanel
        studentKey={open?.key}
        section={open?.section}
        onClose={() => setOpen(null)}
      />

      <ListPreview list={previewing ? list : null} onClose={() => setPreviewing(false)} />

      <PrototypeNav currentHref="/bs-prototypes/collection-engine-teacher/" />
    </div>
  )
}
