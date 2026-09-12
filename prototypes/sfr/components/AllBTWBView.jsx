import { useState, useEffect } from 'react'
import { SessionsTable } from './SessionsTable'
import { ReaderGroupedView } from './ReaderGroupedView'
import { SessionsFilters } from './SessionsFilters'
import './ListView.css'

// All Book Talks — not a shipped tab, so its filters follow the mock: types,
// flags, classes, grades, conversations, ratings. `listBy` isn't offered
// (there's no reader roll-up behind this one), and `groupBy` stays for the
// Book Talks prototype, which drives the grouping from its own header.
export function AllBTWBView({
  sessions,
  search = '',
  onSelectSession,
  onApproveRequest,
  onViewProfile,
  groupBy,
  defaultFilters = {},
  allowSourceFilter = false,
}) {
  const [type, setType] = useState(defaultFilters.type ?? 'all')
  const [rating, setRating] = useState(defaultFilters.rating ?? 'all')
  const [status, setStatus] = useState(defaultFilters.status ?? 'all')
  const [posFlags, setPosFlags] = useState(defaultFilters.posFlags ?? 'all')
  const [source, setSource] = useState(defaultFilters.source ?? 'all')
  const [posOrNegFlags, setPosOrNegFlags] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [kindId, setKindId] = useState('all')
  const [grade, setGrade] = useState('all')

  useEffect(() => {
    setType(defaultFilters.type ?? 'all')
    setRating(defaultFilters.rating ?? 'all')
    setStatus(defaultFilters.status ?? 'all')
    setPosFlags(defaultFilters.posFlags ?? 'all')
    setSource(defaultFilters.source ?? 'all')
  }, [
    defaultFilters.type,
    defaultFilters.rating,
    defaultFilters.status,
    defaultFilters.posFlags,
    defaultFilters.source,
  ])

  // The Book Talks prototype tags each conversation with a `source` (Activity
  // Badge vs Title Completion); SFR's own sessions have none, so this filter
  // only surfaces where sources exist.
  const hasSource = sessions.some((s) => s.source)

  const wasApproved = (s) => s.changeLog?.some((e) => e.kind === 'approved')
  const filtered = sessions.filter((s) => {
    const matchType =
      type === 'all'
        ? true
        : type === 'approved'
          ? wasApproved(s)
          : type === 'flagged'
            ? (s.type === 'flagged' || s.type === 'both') && !wasApproved(s)
            : type === 'engagement'
              ? (s.type === 'engagement' || s.type === 'both') && !wasApproved(s)
              : false
    const matchRating = rating === 'all' || s.engagementRating === rating
    const matchStatus = status === 'all' || s.status === status
    const matchPosFlags =
      posFlags === 'all' ||
      (posFlags === 'has' ? s.positiveFlags?.length > 0 : s.positiveFlags?.length === 0)
    const matchSource = source === 'all' || s.source === source
    const matchClass = classFilter === 'all' || s.student.class === classFilter
    const matchKind = kindId === 'all' || s.kindId === kindId
    const matchGrade = grade === 'all' || s.student.grade === grade
    const matchFlags =
      posOrNegFlags === 'all' ||
      (posOrNegFlags === 'has' ? s.flags?.length > 0 : s.flags?.length === 0)
    const matchSearch = !search || s.student.name.toLowerCase().includes(search.toLowerCase())
    return (
      matchKind &&
      matchType &&
      matchRating &&
      matchStatus &&
      matchPosFlags &&
      matchSource &&
      matchClass &&
      matchGrade &&
      matchFlags &&
      matchSearch
    )
  })

  const TYPE_LABELS = { flagged: 'Flagged', engagement: 'Engagement', approved: 'Approved' }
  const RATING_LABELS = { green: 'Positive', yellow: 'Mixed', red: 'Disengaged' }
  const STATUS_LABELS = { completed: 'Completed', unfinished: 'Unfinished' }
  const SOURCE_LABELS = { self: 'Self-Started', title: 'Title Completion' }
  function clearAll() {
    setKindId('all')
    setType('all')
    setRating('all')
    setStatus('all')
    setPosFlags('all')
    setSource('all')
    setPosOrNegFlags('all')
    setClassFilter('all')
    setGrade('all')
  }

  const activeFilters = [
    ...(type !== 'all'
      ? [{ key: 'type', label: `Type: ${TYPE_LABELS[type]}`, onClear: () => setType('all') }]
      : []),
    ...(rating !== 'all'
      ? [
          {
            key: 'rating',
            label: `Engagement: ${RATING_LABELS[rating]}`,
            onClear: () => setRating('all'),
          },
        ]
      : []),
    ...(status !== 'all'
      ? [
          {
            key: 'status',
            label: `Status: ${STATUS_LABELS[status]}`,
            onClear: () => setStatus('all'),
          },
        ]
      : []),
    ...(posFlags !== 'all'
      ? [
          {
            key: 'posFlags',
            label: posFlags === 'has' ? 'Has positive flags' : 'No positive flags',
            onClear: () => setPosFlags('all'),
          },
        ]
      : []),
    ...(allowSourceFilter && source !== 'all'
      ? [
          {
            key: 'source',
            label: `Source: ${SOURCE_LABELS[source]}`,
            onClear: () => setSource('all'),
          },
        ]
      : []),
  ]

  return (
    <div className="lv-shell">
      <SessionsFilters
        activeFilters={activeFilters}
        onClearAll={clearAll}
        filters={[
          {
            key: 'type',
            label: 'Types',
            value: type,
            onChange: setType,
            options: [['all', 'All Types'], ...Object.entries(TYPE_LABELS)],
          },
          {
            key: 'flags',
            label: 'Flags',
            value: posOrNegFlags,
            onChange: setPosOrNegFlags,
            options: [
              ['all', 'All Flags'],
              ['has', 'Has flags'],
              ['none', 'No flags'],
            ],
          },
          {
            key: 'talk',
            label: 'Talks',
            value: kindId,
            onChange: setKindId,
            options: [
              ['all', 'All Talks'],
              ['engagement', 'Engagement'],
              ['comprehension', 'Comprehension'],
              ['integrity', 'Integrity'],
            ],
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
          {
            key: 'status',
            label: 'Conversations',
            secondary: true,
            value: status,
            onChange: setStatus,
            options: [
              ['all', 'All conversations'],
              ['completed', 'Finished'],
              ['unfinished', 'Unfinished'],
            ],
          },
          {
            key: 'rating',
            label: 'Ratings',
            secondary: true,
            value: rating,
            onChange: setRating,
            options: [['all', 'All Ratings'], ...Object.entries(RATING_LABELS)],
          },
          ...(allowSourceFilter && hasSource
            ? [
                {
                  key: 'source',
                  label: 'Sources',
                  secondary: true,
                  value: source,
                  onChange: setSource,
                  options: [['all', 'All Sources'], ...Object.entries(SOURCE_LABELS)],
                },
              ]
            : []),
        ]}
      />
      {groupBy === 'reader' ? (
        <ReaderGroupedView
          sessions={filtered}
          countLabel="Book Talks"
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
          onClearFilters={clearAll}
        />
      )}
    </div>
  )
}
