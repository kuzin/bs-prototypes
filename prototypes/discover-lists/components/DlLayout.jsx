import { useState } from 'react'
import { AppShell } from '@components/AppShell/AppShell'
import { PreviewBar } from '@components/PreviewBar/PreviewBar'
import { Select } from '@components/Form/Form'
import { useStickyState } from '@components/useStickyState/useStickyState'
import { useTooltipFlip } from '@components/useTooltipFlip/useTooltipFlip'
import '@components/Form/Form.css'

// The real classroom page, out of the Student Profile prototype, with the class
// list hung off the `extraTabs` / `renderExtra` slots it already exposes —
// rather than a second, lookalike classroom screen.
import { ClassroomView } from '../../student-profile/BeanstackProfile'
import '../../student-profile/BeanstackProfile.css'

import {
  CLASSROOMS,
  CLASSROOM_SLOT,
  ROLES,
  ROLE_ORDER,
  SEED_LISTS,
  blankList,
  canEdit,
  classroomsFor,
  isFull,
  isSlot,
} from '../data'
import { ListsPage } from './ListsPage'
import { ListEditor } from './ListEditor'
import { ListPreview } from './ListPreview'
import { ClassroomBookList } from './ClassroomBookList'

// The classroom's own recommendations shelf, out of the Collection Engine's
// teacher prototype, with the class Book List hung off the additive
// `onAddToList` / `listed` props it now takes. A teacher deciding a book
// belongs to the class is usually already looking at this shelf.
import { ClassRecommendations } from '../../collection-engine-teacher/components/ClassRecommendations'

/* Where this sits in the real admin: Discover is a reader surface, and the
   thing staff curate onto it is a Book List — the nav row
   `_recommendation_nav` already calls it that. So the section is Content, and
   Book Lists is the page inside it. Every sidebar row carries a description;
   a bare label reads as a broken row. */
const NAV = [
  {
    id: 'lists',
    label: 'Book Lists',
    icon: 'content',
    desc: 'The lists readers browse on Discover.',
  },
]

const CLASS_TABS = [
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'booklist', label: 'Book List' },
]

export function DlLayout() {
  const [roleId, setRoleId] = useStickyState('dl:role', 'media_specialist')
  const [classroomId, setClassroomId] = useStickyState('dl:classroom', CLASSROOMS[0].id)
  /* The slot rides in the same array as the lists, so moving it is the same
     operation as moving anything else. It opens third — after the two the
     school leads with, before the rest — which is a position a media
     specialist can then change. */
  const [lists, setLists] = useState(() => {
    const seeded = [...SEED_LISTS]
    seeded.splice(2, 0, CLASSROOM_SLOT)
    return seeded
  })
  const [editing, setEditing] = useState(null)
  const [previewing, setPreviewing] = useState(null)
  useTooltipFlip()

  const role = ROLES[roleId] ?? ROLES.media_specialist
  const list = editing ? lists.find((l) => l.id === editing && !isSlot(l)) : null
  const preview = previewing ? lists.find((l) => l.id === previewing && !isSlot(l)) : null
  const classroom = CLASSROOMS.find((c) => c.id === classroomId) ?? CLASSROOMS[0]
  const classList = lists.find((l) => l.classroomId === classroom.id)

  function upsert(next) {
    setLists((all) =>
      all.some((l) => l.id === next.id)
        ? all.map((l) => (l.id === next.id ? next : l))
        : [...all, next],
    )
  }

  function create(forClassroom = null, books = []) {
    const fresh = { ...blankList(role, forClassroom), books }
    setLists((all) => [...all, fresh])
    if (!forClassroom) setEditing(fresh.id)
    return fresh
  }

  /* One way in for both surfaces: the Book List tab's picker and the
     Recommendations shelf both land here, and the first book is what brings a
     class's list into being. */
  function addToClassList(titleId) {
    if (!classList) return create(classroom, [titleId])
    if (classList.books.includes(titleId) || isFull(classList)) return classList
    const next = { ...classList, books: [...classList.books, titleId] }
    upsert(next)
    return next
  }

  function remove(id) {
    setLists((all) => all.filter((l) => l.id !== id))
    setEditing(null)
  }

  function toggleActive(id) {
    setLists((all) => all.map((l) => (l.id === id ? { ...l, active: !l.active } : l)))
  }

  /* The order of the array is the order on Discover, so moving a list is
     moving it in the array — there is no separate position to keep in sync. */
  function move(id, dir) {
    setLists((all) => {
      const i = all.findIndex((l) => l.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= all.length) return all
      const next = [...all]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  // ── The teacher works from their classroom ────────────────────────────────
  // A class list belongs to a class, so it is managed on that class's page
  // beside its roster — not in the site-wide screen a media specialist works
  // in. Same editor, reached from where the work actually happens.
  const teacherView = role.ownOnly

  return (
    <>
      {/* The switcher is the prototype's argument: the same feature, seen by
          the three roles this would ship to. A teacher also picks which of
          their classes they are standing in — the real page gets there through
          the sidebar's Classes row, which a one-class view has no room for. */}
      <PreviewBar
        title="Discover Lists"
        views={ROLE_ORDER.map((id) => ({ id, label: ROLES[id].label }))}
        active={roleId}
        onChange={(id) => {
          setRoleId(id)
          // A list you could edit as one role may be read-only as another, and
          // landing on a form you can't use reads as a bug.
          setEditing((cur) => {
            const l = lists.find((x) => x.id === cur)
            return l && !canEdit(ROLES[id], l) ? null : cur
          })
        }}
        ariaLabel="Who is looking"
        actions={
          teacherView && (
            <Select
              size="sm"
              value={classroomId}
              onChange={(e) => setClassroomId(e.target.value)}
              aria-label="Which class"
            >
              {classroomsFor(role).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.grade}
                </option>
              ))}
            </Select>
          )
        }
      />

      {teacherView ? (
        <div className="dl-classroom">
          <ClassroomView
            className={classroom.name}
            extraTabs={CLASS_TABS}
            initialTab="booklist"
            /* `renderExtra` is handed the active tab id, so both of the
               teacher's ways into the class list render from one slot. */
            renderExtra={(tab) =>
              tab === 'recommendations' ? (
                <ClassRecommendations
                  onAddToList={addToClassList}
                  listed={classList?.books ?? []}
                  listFull={isFull(classList)}
                />
              ) : (
                <ClassroomBookList
                  classroom={classroom}
                  list={classList}
                  onChange={upsert}
                  onCreate={create}
                  onPreview={setPreviewing}
                />
              )
            }
          />
        </div>
      ) : (
        <AppShell
          className="dl-shell"
          sidebar={{
            nav: NAV,
            active: 'lists',
            onNavigate: () => setEditing(null),
            title: 'Content',
            subtitle: role.label,
          }}
        >
          <div
            className="app-shell-page dl-page"
            tabIndex={0}
            role="region"
            aria-label="Page content"
          >
            {list ? (
              <ListEditor
                role={role}
                list={list}
                onChange={upsert}
                onDone={() => setEditing(null)}
                onDelete={remove}
                onPreview={setPreviewing}
              />
            ) : (
              <ListsPage
                role={role}
                lists={lists}
                onOpen={setEditing}
                onCreate={create}
                onToggleActive={toggleActive}
                onMove={move}
                onPreview={setPreviewing}
              />
            )}
          </div>
        </AppShell>
      )}

      <ListPreview list={preview} onClose={() => setPreviewing(null)} />
    </>
  )
}
