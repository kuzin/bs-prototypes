import { useState, useEffect } from 'react'
import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import { Select } from '@components/Form/Form'
import { SessionsTable } from './SessionsTable'
import { ReaderGroupedView } from './ReaderGroupedView'
import { ActiveFilters } from '@components/ActiveFilters/ActiveFilters'
import { Icon } from '@components/Icon/Icon'
import '@components/FilterBar/FilterBar.css'
import '@components/Form/Form.css'
import './ListView.css'

export function EngagementView({
  sessions,
  onSelectSession,
  onApproveRequest,
  onViewProfile,
  groupBy,
  defaultFilters = {},
}) {
  const [search, setSearch] = useState('')
  const [rating, setRating] = useState(defaultFilters.rating ?? 'all')
  const [posFlags, setPosFlags] = useState(defaultFilters.posFlags ?? 'all')
  const [classFilter, setClassFilter] = useState(defaultFilters.classFilter ?? 'all')
  const [grade, setGrade] = useState(defaultFilters.grade ?? 'all')
  const [challenge, setChallenge] = useState(defaultFilters.challenge ?? 'all')
  const [status, setStatus] = useState(defaultFilters.status ?? 'all')
  const [hasFlags, setHasFlags] = useState(defaultFilters.hasFlags ?? 'all')

  useEffect(() => {
    setRating(defaultFilters.rating ?? 'all')
    setPosFlags(defaultFilters.posFlags ?? 'all')
    setClassFilter(defaultFilters.classFilter ?? 'all')
    setGrade(defaultFilters.grade ?? 'all')
    setChallenge(defaultFilters.challenge ?? 'all')
    setStatus(defaultFilters.status ?? 'all')
    setHasFlags(defaultFilters.hasFlags ?? 'all')
  }, [
    defaultFilters.rating,
    defaultFilters.posFlags,
    defaultFilters.classFilter,
    defaultFilters.grade,
    defaultFilters.challenge,
    defaultFilters.status,
    defaultFilters.hasFlags,
  ])

  const engagement = sessions.filter((s) => s.type === 'engagement' || s.type === 'both')
  const filtered = engagement.filter((s) => {
    const matchRating = rating === 'all' || s.engagementRating === rating
    const matchPosFlags =
      posFlags === 'all' ||
      (posFlags === 'has' ? s.positiveFlags?.length > 0 : s.positiveFlags?.length === 0)
    const matchClassFilter = classFilter === 'all' || s.student.class === classFilter
    const matchGrade = grade === 'all' || s.student.grade === grade
    const matchChallenge = challenge === 'all' || s.challenge === challenge
    const matchStatus = status === 'all' || s.status === status
    const matchHasFlags =
      hasFlags === 'all' || (hasFlags === 'has' ? s.flags?.length > 0 : s.flags?.length === 0)
    const matchSearch =
      !search ||
      s.student.name.toLowerCase().includes(search.toLowerCase()) ||
      s.book.title.toLowerCase().includes(search.toLowerCase())
    return (
      matchRating &&
      matchPosFlags &&
      matchClassFilter &&
      matchGrade &&
      matchChallenge &&
      matchStatus &&
      matchHasFlags &&
      matchSearch
    )
  })

  const RATING_LABELS = { green: 'Positive', yellow: 'Mixed', red: 'Disengaged' }
  const activeFilters = [
    ...(search ? [{ key: 'search', label: `"${search}"`, onClear: () => setSearch('') }] : []),
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
    ...(status !== 'all'
      ? [
          {
            key: 'status',
            label: status === 'completed' ? 'Finished' : 'Unfinished',
            onClear: () => setStatus('all'),
          },
        ]
      : []),
    ...(hasFlags !== 'all'
      ? [
          {
            key: 'hasFlags',
            label: hasFlags === 'has' ? 'Has integrity flags' : 'No integrity flags',
            onClear: () => setHasFlags('all'),
          },
        ]
      : []),
  ]

  return (
    <div className="lv-shell">
      <div className="lv-toolbar">
        <div className="lv-count">
          {engagement.length} Engagement {engagement.length === 1 ? 'Session' : 'Sessions'}
        </div>
        <div className="lv-search-wrap">
          <Icon name="search" size={14} className="lv-search-icon" />
          <input
            className="lv-search"
            type="search"
            placeholder="Search student or book…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="lv-filters">
        <FilterBar>
          <FilterItem label="Engagement Rating">
            <Select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="all">All ratings</option>
              <option value="green">Positive</option>
              <option value="yellow">Mixed</option>
              <option value="red">Disengaged</option>
            </Select>
          </FilterItem>
          <FilterItem label="Positive Flags">
            <Select value={posFlags} onChange={(e) => setPosFlags(e.target.value)}>
              <option value="all">All sessions</option>
              <option value="has">Has positive flags</option>
              <option value="none">No positive flags</option>
            </Select>
          </FilterItem>
          <FilterItem label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="completed">Finished</option>
              <option value="unfinished">Unfinished</option>
            </Select>
          </FilterItem>
          <FilterItem label="Flags">
            <Select value={hasFlags} onChange={(e) => setHasFlags(e.target.value)}>
              <option value="all">All sessions</option>
              <option value="has">Has flags</option>
              <option value="none">No flags</option>
            </Select>
          </FilterItem>
          <FilterItem label="Class">
            <Select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="all">All classes</option>
              <option value="Mrs. Johnson">Mrs. Johnson</option>
              <option value="Mr. Okafor">Mr. Okafor</option>
              <option value="Mr. Kim">Mr. Kim</option>
            </Select>
          </FilterItem>
          <FilterItem label="Grade">
            <Select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="all">All grades</option>
              <option value="3rd">3rd grade</option>
              <option value="4th">4th grade</option>
              <option value="5th">5th grade</option>
            </Select>
          </FilterItem>
          <FilterItem label="Challenge">
            <Select value={challenge} onChange={(e) => setChallenge(e.target.value)}>
              <option value="all">All challenges</option>
              <option value="Genre Explorer">Genre Explorer</option>
              <option value="Chapter Book Challenge">Chapter Book Challenge</option>
              <option value="Summer Reading">Summer Reading</option>
            </Select>
          </FilterItem>
        </FilterBar>
        <ActiveFilters
          filters={activeFilters}
          onClearAll={() => {
            setSearch('')
            setRating('all')
            setPosFlags('all')
            setClassFilter('all')
            setGrade('all')
            setChallenge('all')
            setStatus('all')
            setHasFlags('all')
          }}
        />
      </div>
      {groupBy === 'reader' ? (
        <ReaderGroupedView
          sessions={filtered}
          onSelectSession={(s) => onSelectSession(s, filtered)}
          onApproveRequest={onApproveRequest}
          onViewProfile={onViewProfile}
          showTypeColumn={false}
          showFlagIcons
          onClearFilters={() => {
            setSearch('')
            setRating('all')
            setPosFlags('all')
            setClassFilter('all')
            setGrade('all')
            setChallenge('all')
            setStatus('all')
            setHasFlags('all')
          }}
        />
      ) : (
        <SessionsTable
          sessions={filtered}
          onSelectSession={(s) => onSelectSession(s, filtered)}
          onApproveRequest={onApproveRequest}
          onViewProfile={onViewProfile}
          showTypeColumn={false}
          showFlagIcons
          onClearFilters={() => {
            setSearch('')
            setRating('all')
            setPosFlags('all')
            setClassFilter('all')
            setGrade('all')
            setChallenge('all')
            setStatus('all')
            setHasFlags('all')
          }}
        />
      )}
    </div>
  )
}
