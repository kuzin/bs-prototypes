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

export function AllBTWBView({
  sessions,
  onSelectSession,
  onApproveRequest,
  onViewProfile,
  groupBy,
  defaultFilters = {},
  allowSourceFilter = false,
}) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState(defaultFilters.type ?? 'all')
  const [rating, setRating] = useState(defaultFilters.rating ?? 'all')
  const [status, setStatus] = useState(defaultFilters.status ?? 'all')
  const [posFlags, setPosFlags] = useState(defaultFilters.posFlags ?? 'all')
  const [source, setSource] = useState(defaultFilters.source ?? 'all')

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
    const matchSearch =
      !search ||
      s.student.name.toLowerCase().includes(search.toLowerCase()) ||
      s.book.title.toLowerCase().includes(search.toLowerCase())
    return matchType && matchRating && matchStatus && matchPosFlags && matchSource && matchSearch
  })

  const TYPE_LABELS = { flagged: 'Flagged', engagement: 'Engagement', approved: 'Approved' }
  const RATING_LABELS = { green: 'Positive', yellow: 'Mixed', red: 'Disengaged' }
  const STATUS_LABELS = { completed: 'Completed', unfinished: 'Unfinished' }
  const SOURCE_LABELS = { activity: 'Activity Badge', title: 'Title Completion' }
  const activeFilters = [
    ...(search ? [{ key: 'search', label: `"${search}"`, onClear: () => setSearch('') }] : []),
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
      <div className="lv-toolbar">
        <div className="lv-count">{sessions.length} Book Talks Total</div>
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
          <FilterItem label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All types</option>
              <option value="flagged">Flagged</option>
              <option value="engagement">Engagement</option>
              <option value="approved">Approved</option>
            </Select>
          </FilterItem>
          <FilterItem label="Engagement Rating">
            <Select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="all">All ratings</option>
              <option value="green">Positive</option>
              <option value="yellow">Mixed</option>
              <option value="red">Disengaged</option>
            </Select>
          </FilterItem>
          <FilterItem label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="completed">Completed</option>
              <option value="unfinished">Unfinished</option>
            </Select>
          </FilterItem>
          <FilterItem label="Positive Flags">
            <Select value={posFlags} onChange={(e) => setPosFlags(e.target.value)}>
              <option value="all">All sessions</option>
              <option value="has">Has positive flags</option>
              <option value="none">No positive flags</option>
            </Select>
          </FilterItem>
          {allowSourceFilter && hasSource && (
            <FilterItem label="Source">
              <Select value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="all">All sources</option>
                <option value="activity">Activity Badge</option>
                <option value="title">Title Completion</option>
              </Select>
            </FilterItem>
          )}
        </FilterBar>
        <ActiveFilters
          filters={activeFilters}
          onClearAll={() => {
            setSearch('')
            setType('all')
            setRating('all')
            setStatus('all')
            setPosFlags('all')
            setSource('all')
          }}
        />
      </div>
      {groupBy === 'reader' ? (
        <ReaderGroupedView
          sessions={filtered}
          onSelectSession={(s) => onSelectSession(s, filtered)}
          onApproveRequest={onApproveRequest}
          onViewProfile={onViewProfile}
          showTypeColumn
          showFlagIcons
          onClearFilters={() => {
            setSearch('')
            setType('all')
            setRating('all')
            setStatus('all')
            setPosFlags('all')
            setSource('all')
          }}
        />
      ) : (
        <SessionsTable
          sessions={filtered}
          onSelectSession={(s) => onSelectSession(s, filtered)}
          onApproveRequest={onApproveRequest}
          onViewProfile={onViewProfile}
          showTypeColumn
          showFlagIcons
          onClearFilters={() => {
            setSearch('')
            setType('all')
            setRating('all')
            setStatus('all')
            setPosFlags('all')
            setSource('all')
          }}
        />
      )}
    </div>
  )
}
