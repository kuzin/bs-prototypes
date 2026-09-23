import { useState } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { useToasts, ToastStack } from '@components/Toast/Toast'
import '@components/Toast/Toast.css'

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
import {
  CLASSROOMS,
  ROLES,
  SEED_LISTS,
  blankList,
  isFull,
  resolveBooks,
} from '../discover-lists/data'
import '../discover-lists/index.css'

import { ClassRecommendations } from './components/ClassRecommendations'
import { ReaderProfilePanel } from './components/ReaderProfilePanel'

import './index.css'

/* This page is Class A's, so the list it shows is Class A's. */
const CLASSROOM = CLASSROOMS[0]
const TEACHER = ROLES.teacher

/* A toast names the book it is about, and an id is not a name. The list's own
   resolver does this already — it reaches into whichever catalog holds the
   title, which is the same trip a recommendation makes to get here. */
const titleName = (id) => resolveBooks([id])[0]?.title ?? 'This title'

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

  const { toasts, push, dismiss } = useToasts()

  /* Both ways in land here — the Book List tab's picker and the bookmark on a
     recommendation — and the first book is what brings the list into being.
     It toggles: the mark on a recommendation is a bookmark, and a bookmark you
     can only ever switch on is a trap on a shelf capped at a fixed size. The
     toast closes the loop, because the list is a tab away and nothing else on
     this page says the press landed. */
  /* Puts a title on the list whatever is already there — the undo path. It is
     not `toggleOnList` called a second time: that one reads whether the title
     is on the list from the render it was created in, which is right when the
     press is the one you just made and wrong by the time a toast is answered. */
  function putOnList(titleId) {
    setList((cur) => {
      if (!cur) return { ...blankList(TEACHER, CLASSROOM), books: [titleId] }
      if (cur.books.includes(titleId)) return cur
      return { ...cur, books: [...cur.books, titleId] }
    })
    push({
      title: 'Back on the class Book List',
      body: titleName(titleId),
      action: { label: 'View list', onClick: () => setPreviewing(true) },
    })
  }

  function toggleOnList(titleId) {
    const on = Boolean(list?.books?.includes(titleId))
    if (!on && isFull(list)) return

    setList((cur) => {
      if (!cur) return { ...blankList(TEACHER, CLASSROOM), books: [titleId] }
      if (cur.books.includes(titleId))
        return { ...cur, books: cur.books.filter((id) => id !== titleId) }
      return { ...cur, books: [...cur.books, titleId] }
    })

    const name = titleName(titleId)
    push(
      on
        ? {
            title: 'Taken off the class Book List',
            body: name,
            tone: 'info',
            action: { label: 'Undo', onClick: () => putOnList(titleId) },
          }
        : {
            title: 'Added to the class Book List',
            body: name,
            action: { label: 'View list', onClick: () => setPreviewing(true) },
          },
    )
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
                onAddToList={toggleOnList}
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

      <ToastStack toasts={toasts} onDismiss={dismiss} />

      <PrototypeNav currentHref="/bs-prototypes/collection-engine-teacher/" />
    </div>
  )
}
