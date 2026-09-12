import { useState, useEffect } from 'react'
import { SessionsTable } from './SessionsTable'
import { ReaderGroupedView } from './ReaderGroupedView'
import { SessionsFilters } from './SessionsFilters'
import './ListView.css'

// Engagement Sessions — the shipped tab. `FlaggedEntriesFilters` with
// `kind: 'challenge'`: challenges, the positive flags, classes, grades, the
// finished/unfinished conversation switch, and List by.
export function EngagementView({
  sessions,
  search = '',
  onSelectSession,
  onApproveRequest,
  onViewProfile,
  listBy = 'date',
  onListBy,
  defaultFilters = {},
}) {
  const [rating, setRating] = useState(defaultFilters.rating ?? 'all')
  const [posFlags, setPosFlags] = useState(defaultFilters.posFlags ?? 'all')
  const [classFilter, setClassFilter] = useState(defaultFilters.classFilter ?? 'all')
  const [kindId, setKindId] = useState('all')
  const [grade, setGrade] = useState(defaultFilters.grade ?? 'all')
  const [challenge, setChallenge] = useState(defaultFilters.challenge ?? 'all')
  const [chatStatus, setChatStatus] = useState('ended')

  useEffect(() => {
    setRating(defaultFilters.rating ?? 'all')
    setPosFlags(defaultFilters.posFlags ?? 'all')
    setClassFilter(defaultFilters.classFilter ?? 'all')
    setGrade(defaultFilters.grade ?? 'all')
    setChallenge(defaultFilters.challenge ?? 'all')
  }, [
    defaultFilters.rating,
    defaultFilters.posFlags,
    defaultFilters.classFilter,
    defaultFilters.grade,
    defaultFilters.challenge,
  ])

  const engagement = sessions.filter((s) => s.type === 'engagement' || s.type === 'both')
  const filtered = engagement.filter((s) => {
    const matchRating = rating === 'all' || s.engagementRating === rating
    const matchPosFlags =
      posFlags === 'all' ||
      (posFlags === 'has' ? s.positiveFlags?.length > 0 : s.positiveFlags?.length === 0)
    const matchClassFilter = classFilter === 'all' || s.student.class === classFilter
    const matchKind = kindId === 'all' || s.kindId === kindId
    const matchGrade = grade === 'all' || s.student.grade === grade
    const matchChallenge = challenge === 'all' || s.challenge === challenge
    // 'ended' is the default: an unfinished conversation has nothing to read
    // yet, so the app keeps them out until you ask for them.
    const matchChat = chatStatus === 'ended' ? s.status !== 'unfinished' : s.status === 'unfinished'
    const matchSearch = !search || s.student.name.toLowerCase().includes(search.toLowerCase())
    return (
      matchKind &&
      matchRating &&
      matchPosFlags &&
      matchClassFilter &&
      matchGrade &&
      matchChallenge &&
      matchChat &&
      matchSearch
    )
  })

  const RATING_LABELS = { green: 'Positive', yellow: 'Mixed', red: 'Disengaged' }
  const activeFilters = [
    ...(rating !== 'all'
      ? [
          {
            key: 'rating',
            label: `Engagement: ${RATING_LABELS[rating]}`,
            onClear: () => setRating('all'),
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
    ...(classFilter !== 'all'
      ? [
          {
            key: 'classFilter',
            label: `Class: ${classFilter}`,
            onClear: () => setClassFilter('all'),
          },
        ]
      : []),
    ...(grade !== 'all'
      ? [{ key: 'grade', label: `Grade: ${grade}`, onClear: () => setGrade('all') }]
      : []),
    ...(challenge !== 'all'
      ? [{ key: 'challenge', label: `Challenge: ${challenge}`, onClear: () => setChallenge('all') }]
      : []),
  ]

  function clearAll() {
    setKindId('all')
    setRating('all')
    setPosFlags('all')
    setClassFilter('all')
    setGrade('all')
    setChallenge('all')
    setChatStatus('ended')
  }

  return (
    <div className="lv-shell">
      <SessionsFilters
        activeFilters={activeFilters}
        onClearAll={clearAll}
        listBy={listBy}
        onListBy={onListBy}
        filters={[
          {
            key: 'challenge',
            label: 'Challenges',
            value: challenge,
            onChange: setChallenge,
            options: [
              ['all', 'All Challenges'],
              ['Genre Explorer', 'Genre Explorer'],
              ['Chapter Book Challenge', 'Chapter Book Challenge'],
              ['Summer Reading', 'Summer Reading'],
            ],
          },
          {
            key: 'flags',
            label: 'Flags',
            value: posFlags,
            onChange: setPosFlags,
            options: [
              ['all', 'All Flags'],
              ['has', 'Has positive flags'],
              ['none', 'No positive flags'],
            ],
          },
          {
            key: 'talk',
            label: 'Talks',
            secondary: true,
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
            key: 'chatStatus',
            label: 'Conversations',
            secondary: true,
            value: chatStatus,
            onChange: setChatStatus,
            options: [
              ['ended', 'Finished Conversations Only'],
              ['started', 'Show Unfinished Conversations'],
            ],
          },
          {
            key: 'rating',
            label: 'Ratings',
            secondary: true,
            value: rating,
            onChange: setRating,
            options: [
              ['all', 'All Ratings'],
              ['green', 'Positive'],
              ['yellow', 'Mixed'],
              ['red', 'Disengaged'],
            ],
          },
        ]}
      />
      {listBy === 'reader' ? (
        <ReaderGroupedView
          sessions={filtered}
          countLabel="Engagement Sessions"
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
          showTypeColumn={false}
          showFlagIcons
          onClearFilters={clearAll}
        />
      )}
    </div>
  )
}
