import { useState, useEffect } from 'react'
import { SessionsTable } from './SessionsTable'
import { ReaderGroupedView } from './ReaderGroupedView'
import { SessionsFilters } from './SessionsFilters'
import './ListView.css'

// Flagged Sessions — the shipped tab. Its filter set is
// `FlaggedEntriesFilters` with `kind: 'logged_book_analysis'`: a Book Talks
// filter, the negative flags, classes, grades, and List by.
export function FlaggedView({
  sessions,
  search = '',
  onSelectSession,
  onApproveRequest,
  onViewProfile,
  listBy = 'date',
  onListBy,
  defaultFilters = {},
}) {
  const [bookTalks, setBookTalks] = useState('all')
  const [grade, setGrade] = useState(defaultFilters.grade ?? 'all')
  const [classFilter, setClassFilter] = useState(defaultFilters.classFilter ?? 'all')
  const [flagType, setFlagType] = useState(defaultFilters.flagType ?? 'all')

  useEffect(() => {
    setGrade(defaultFilters.grade ?? 'all')
    setClassFilter(defaultFilters.classFilter ?? 'all')
    setFlagType(defaultFilters.flagType ?? 'all')
  }, [defaultFilters.grade, defaultFilters.classFilter, defaultFilters.flagType])

  const flagged = sessions.filter(
    (s) => (s.type === 'flagged' || s.type === 'both') && (s.flags?.length ?? 0) > 0,
  )

  const filtered = flagged.filter((s) => {
    const matchGrade = grade === 'all' || s.student.grade === grade
    const matchClass = classFilter === 'all' || s.student.class === classFilter
    const matchFlagType = flagType === 'all' || s.flags?.some((f) => f.type === flagType)
    // "All Book Talks" / "No Book Talks": whether the flags came out of a talk
    // with Benny or out of the log itself.
    const matchBookTalks =
      bookTalks === 'all' ||
      (bookTalks === 'with' ? s.conversation != null : s.conversation == null)
    // The page's one search, matched the way the app matches it — on the
    // student's name.
    const matchSearch = !search || s.student.name.toLowerCase().includes(search.toLowerCase())
    return matchGrade && matchClass && matchFlagType && matchBookTalks && matchSearch
  })

  const FLAG_TYPE_LABELS = {
    'copy-paste': 'Copied Response',
    'no-recall': 'Unable to Recall',
    minimal: 'Minimal Engagement',
    unintelligible: 'Unintelligible',
    'quit-early': 'Did Not Complete',
  }

  function clearAll() {
    setBookTalks('all')
    setGrade('all')
    setClassFilter('all')
    setFlagType('all')
  }

  const activeFilters = [
    ...(grade !== 'all'
      ? [{ key: 'grade', label: `Grade: ${grade}`, onClear: () => setGrade('all') }]
      : []),
    ...(classFilter !== 'all'
      ? [{ key: 'class', label: `Class: ${classFilter}`, onClear: () => setClassFilter('all') }]
      : []),
    ...(flagType !== 'all'
      ? [
          {
            key: 'flagType',
            label: `Flag: ${FLAG_TYPE_LABELS[flagType] ?? flagType}`,
            onClear: () => setFlagType('all'),
          },
        ]
      : []),
  ]

  return (
    <div className="lv-shell">
      <SessionsFilters
        activeFilters={activeFilters}
        onClearAll={clearAll}
        listBy={listBy}
        onListBy={onListBy}
        filters={[
          {
            key: 'bookTalks',
            label: 'Book Talks',
            value: bookTalks,
            onChange: setBookTalks,
            options: [
              ['all', 'All'],
              ['with', 'All Book Talks'],
              ['without', 'No Book Talks'],
            ],
          },
          {
            key: 'flags',
            label: 'Flags',
            value: flagType,
            onChange: setFlagType,
            options: [['all', 'All Flags'], ...Object.entries(FLAG_TYPE_LABELS)],
          },
          {
            key: 'class',
            label: 'Classes',
            value: classFilter,
            onChange: setClassFilter,
            options: [
              ['all', 'All Classes'],
              ['Mrs. Johnson', 'Mrs. Johnson'],
              ['Mr. Okafor', 'Mr. Okafor'],
              ['Mr. Kim', 'Mr. Kim'],
            ],
          },
          {
            key: 'grade',
            label: 'Grades',
            value: grade,
            onChange: setGrade,
            options: [
              ['all', 'All Grades'],
              ['3rd', '3rd'],
              ['4th', '4th'],
              ['5th', '5th'],
            ],
          },
        ]}
      />
      {listBy === 'reader' ? (
        <ReaderGroupedView
          sessions={filtered}
          countLabel="Flagged Entries"
          onSelectSession={(s) => onSelectSession(s, filtered)}
          onApproveRequest={onApproveRequest}
          onViewProfile={onViewProfile}
          onClearFilters={clearAll}
        />
      ) : (
        <SessionsTable
          sessions={filtered}
          onSelectSession={(s) => onSelectSession(s, filtered)}
          onApproveRequest={onApproveRequest}
          onViewProfile={onViewProfile}
          dateLabel="Flagged On"
          showUnitColumn
          showTypeColumn={false}
          showEngagementColumn={false}
          showPosFlags={false}
          showFlagIcons
          onClearFilters={clearAll}
        />
      )}
    </div>
  )
}
