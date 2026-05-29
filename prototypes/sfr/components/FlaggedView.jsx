import { useState, useEffect } from 'react'
import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import { Select } from '@components/Form/Form'
import { SessionsTable } from './SessionsTable'
import { ReaderGroupedView } from './ReaderGroupedView'
import { ActiveFilters } from '@components/ActiveFilters/ActiveFilters'
import '@components/FilterBar/FilterBar.css'
import '@components/Form/Form.css'
import './ListView.css'

export function FlaggedView({
  sessions,
  onSelectSession,
  onApproveRequest,
  onViewProfile,
  groupBy,
  defaultFilters = {},
}) {
  const [search, setSearch] = useState('')
  const [grade, setGrade] = useState(defaultFilters.grade ?? 'all')
  const [classFilter, setClassFilter] = useState(defaultFilters.classFilter ?? 'all')
  const [flagType, setFlagType] = useState(defaultFilters.flagType ?? 'all')
  const [status, setStatus] = useState(defaultFilters.status ?? 'all')
  const [challenge, setChallenge] = useState(defaultFilters.challenge ?? 'all')

  useEffect(() => {
    setGrade(defaultFilters.grade ?? 'all')
    setClassFilter(defaultFilters.classFilter ?? 'all')
    setFlagType(defaultFilters.flagType ?? 'all')
    setStatus(defaultFilters.status ?? 'all')
    setChallenge(defaultFilters.challenge ?? 'all')
  }, [
    defaultFilters.grade,
    defaultFilters.classFilter,
    defaultFilters.flagType,
    defaultFilters.status,
    defaultFilters.challenge,
  ])

  const flagged = sessions.filter(
    (s) => (s.type === 'flagged' || s.type === 'both') && (s.flags?.length ?? 0) > 0,
  )

  const filtered = flagged.filter((s) => {
    const matchGrade = grade === 'all' || s.student.grade === grade
    const matchClass = classFilter === 'all' || s.student.class === classFilter
    const matchFlagType = flagType === 'all' || s.flags?.some((f) => f.type === flagType)
    const matchStatus = status === 'all' || s.status === status
    const matchChallenge = challenge === 'all' || s.challenge === challenge
    const matchSearch =
      !search ||
      s.student.name.toLowerCase().includes(search.toLowerCase()) ||
      s.book.title.toLowerCase().includes(search.toLowerCase())
    return matchGrade && matchClass && matchFlagType && matchStatus && matchChallenge && matchSearch
  })

  const FLAG_TYPE_LABELS = {
    'copy-paste': 'Copied Response',
    'no-recall': 'Unable to Recall',
    minimal: 'Minimal Engagement',
    unintelligible: 'Unintelligible',
    'quit-early': 'Did Not Complete',
  }

  const activeFilters = [
    ...(search ? [{ key: 'search', label: `"${search}"`, onClear: () => setSearch('') }] : []),
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
    ...(status !== 'all'
      ? [
          {
            key: 'status',
            label: status === 'completed' ? 'Finished' : 'Unfinished',
            onClear: () => setStatus('all'),
          },
        ]
      : []),
    ...(challenge !== 'all'
      ? [{ key: 'challenge', label: `Challenge: ${challenge}`, onClear: () => setChallenge('all') }]
      : []),
  ]

  return (
    <div className="lv-shell">
      <div className="lv-toolbar">
        <div className="lv-count">
          {flagged.length} Flagged {flagged.length === 1 ? 'Session' : 'Sessions'}
        </div>
        <div className="lv-search-wrap">
          <svg
            className="lv-search-icon"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <circle cx="7" cy="7" r="4.5" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" />
          </svg>
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
          <FilterItem label="Flag Type">
            <Select value={flagType} onChange={(e) => setFlagType(e.target.value)}>
              <option value="all">All flag types</option>
              <option value="copy-paste">Copied Response</option>
              <option value="no-recall">Unable to Recall</option>
              <option value="minimal">Minimal Engagement</option>
              <option value="unintelligible">Unintelligible</option>
              <option value="quit-early">Did Not Complete</option>
            </Select>
          </FilterItem>
          <FilterItem label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="completed">Finished</option>
              <option value="unfinished">Unfinished</option>
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
          <FilterItem label="Class">
            <Select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="all">All classes</option>
              <option value="Mrs. Johnson">Mrs. Johnson</option>
              <option value="Mr. Okafor">Mr. Okafor</option>
              <option value="Mr. Kim">Mr. Kim</option>
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
            setGrade('all')
            setClassFilter('all')
            setFlagType('all')
            setStatus('all')
            setChallenge('all')
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
          showPosFlags={false}
          showEngagementColumn={false}
          onClearFilters={() => {
            setSearch('')
            setGrade('all')
            setClassFilter('all')
            setFlagType('all')
            setStatus('all')
            setChallenge('all')
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
          showPosFlags={false}
          showEngagementColumn={false}
          onClearFilters={() => {
            setSearch('')
            setGrade('all')
            setClassFilter('all')
            setFlagType('all')
            setStatus('all')
            setChallenge('all')
          }}
        />
      )}
    </div>
  )
}
