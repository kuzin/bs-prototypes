import { useState, useEffect } from 'react'
import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import { Select } from '@components/Form/Form'
import { ActiveFilters } from '@components/ActiveFilters/ActiveFilters'
import { Icon } from '@components/Icon/Icon'
import { SessionsTable, SAFETY_SEVERITY, SAFETY_CATEGORY } from './SessionsTable'
import { isSafety, isSafetyOpen } from '../data'
import '@components/FilterBar/FilterBar.css'
import '@components/Form/Form.css'
import './ListView.css'

const STATUS_LABELS = {
  open: 'Open',
  new: 'New',
  acknowledged: 'Acknowledged',
  escalated: 'Escalated',
  resolved: 'Resolved',
}

export function SafetyView({ sessions, onSelectSession, defaultFilters = {} }) {
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState(defaultFilters.severity ?? 'all')
  const [category, setCategory] = useState(defaultFilters.category ?? 'all')
  const [status, setStatus] = useState(defaultFilters.status ?? 'all')
  const [grade, setGrade] = useState(defaultFilters.grade ?? 'all')

  useEffect(() => {
    setSeverity(defaultFilters.severity ?? 'all')
    setCategory(defaultFilters.category ?? 'all')
    setStatus(defaultFilters.status ?? 'all')
    setGrade(defaultFilters.grade ?? 'all')
  }, [
    defaultFilters.severity,
    defaultFilters.category,
    defaultFilters.status,
    defaultFilters.grade,
  ])

  const safety = sessions.filter(isSafety)
  const filtered = safety.filter((s) => {
    const matchSev = severity === 'all' || s.safety.severity === severity
    const matchCat = category === 'all' || s.safety.category === category
    const matchStatus =
      status === 'all' ||
      (status === 'open'
        ? isSafetyOpen(s)
        : status === 'resolved'
          ? !isSafetyOpen(s)
          : s.safety.status === status)
    const matchGrade = grade === 'all' || s.student.grade === grade
    const matchSearch =
      !search ||
      s.student.name.toLowerCase().includes(search.toLowerCase()) ||
      s.safety.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      s.book.title.toLowerCase().includes(search.toLowerCase())
    return matchSev && matchCat && matchStatus && matchGrade && matchSearch
  })

  function clearAll() {
    setSearch('')
    setSeverity('all')
    setCategory('all')
    setStatus('all')
    setGrade('all')
  }

  const activeFilters = [
    ...(search ? [{ key: 'search', label: `"${search}"`, onClear: () => setSearch('') }] : []),
    ...(severity !== 'all'
      ? [
          {
            key: 'sev',
            label: `Severity: ${SAFETY_SEVERITY[severity].label}`,
            onClear: () => setSeverity('all'),
          },
        ]
      : []),
    ...(category !== 'all'
      ? [
          {
            key: 'cat',
            label: `Concern: ${SAFETY_CATEGORY[category].label}`,
            onClear: () => setCategory('all'),
          },
        ]
      : []),
    ...(status !== 'all'
      ? [
          {
            key: 'status',
            label: `Status: ${STATUS_LABELS[status] ?? status}`,
            onClear: () => setStatus('all'),
          },
        ]
      : []),
    ...(grade !== 'all'
      ? [{ key: 'grade', label: `Grade: ${grade}`, onClear: () => setGrade('all') }]
      : []),
  ]

  return (
    <div className="lv-shell">
      <div className="lv-toolbar">
        <div className="lv-count">
          {filtered.length} Safety {filtered.length === 1 ? 'Signal' : 'Signals'}
        </div>
        <div className="lv-search-wrap">
          <Icon name="search" size={14} className="lv-search-icon" />
          <input
            className="lv-search"
            type="search"
            placeholder="Search student, signal, or book…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="lv-filters">
        <FilterBar>
          <FilterItem label="Severity">
            <Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="all">All severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="possible">Possible</option>
            </Select>
          </FilterItem>
          <FilterItem label="Concern">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All concerns</option>
              <option value="self-harm">Self-Harm</option>
              <option value="harm-others">Harm to Others</option>
              <option value="abuse">Possible Abuse</option>
              <option value="bullying">Bullying</option>
              <option value="distress">Emotional Distress</option>
            </Select>
          </FilterItem>
          <FilterItem label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="open">Open</option>
              <option value="new">New</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
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
        </FilterBar>
        <ActiveFilters filters={activeFilters} onClearAll={clearAll} />
      </div>
      <SessionsTable
        sessions={filtered}
        onSelectSession={(s) => onSelectSession(s, filtered)}
        showFlagIcons
        safetyDetail
        onClearFilters={clearAll}
      />
    </div>
  )
}
