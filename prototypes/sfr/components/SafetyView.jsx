import { useState, useEffect } from 'react'
import { SessionsFilters } from './SessionsFilters'
import { SessionsTable, SAFETY_SEVERITY, SAFETY_CATEGORY } from './SessionsTable'
import { isSafety, isSafetyOpen } from '../data'
import './ListView.css'

const STATUS_LABELS = {
  open: 'Open',
  new: 'New',
  acknowledged: 'Acknowledged',
  escalated: 'Escalated',
  resolved: 'Resolved',
}

// Safety Risk. There's no shipped tab behind this one, so the filter set is
// the mock's three — Classes / Grades / Statuses — plus the two this page
// can't do without: a severity and a concern. A safety queue you can't narrow
// to "critical" is a list, not a queue.
export function SafetyView({ sessions, search = '', onSelectSession, defaultFilters = {} }) {
  const [severity, setSeverity] = useState(defaultFilters.severity ?? 'all')
  const [category, setCategory] = useState(defaultFilters.category ?? 'all')
  const [status, setStatus] = useState(defaultFilters.status ?? 'all')
  const [grade, setGrade] = useState(defaultFilters.grade ?? 'all')
  const [classFilter, setClassFilter] = useState(defaultFilters.classFilter ?? 'all')

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
    const matchClass = classFilter === 'all' || s.student.class === classFilter
    const matchSearch = !search || s.student.name.toLowerCase().includes(search.toLowerCase())
    return matchSev && matchCat && matchStatus && matchGrade && matchClass && matchSearch
  })

  function clearAll() {
    setClassFilter('all')
    setSeverity('all')
    setCategory('all')
    setStatus('all')
    setGrade('all')
  }

  const activeFilters = [
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
    ...(classFilter !== 'all'
      ? [{ key: 'class', label: `Class: ${classFilter}`, onClear: () => setClassFilter('all') }]
      : []),
  ]

  return (
    <div className="lv-shell">
      <SessionsFilters
        activeFilters={activeFilters}
        onClearAll={clearAll}
        filters={[
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
            label: 'Statuses',
            value: status,
            onChange: setStatus,
            options: [
              ['all', 'All Statuses'],
              ['open', 'Open'],
              ['new', 'New'],
              ['acknowledged', 'Acknowledged'],
              ['escalated', 'Escalated'],
              ['resolved', 'Resolved'],
            ],
          },
          {
            key: 'severity',
            label: 'Severities',
            secondary: true,
            value: severity,
            onChange: setSeverity,
            options: [
              ['all', 'All Severities'],
              ['critical', 'Critical'],
              ['warning', 'Warning'],
              ['possible', 'Possible'],
            ],
          },
          {
            key: 'category',
            label: 'Concerns',
            secondary: true,
            value: category,
            onChange: setCategory,
            options: [
              ['all', 'All Concerns'],
              ['self-harm', 'Self-Harm'],
              ['harm-others', 'Harm to Others'],
              ['abuse', 'Possible Abuse'],
              ['bullying', 'Bullying'],
              ['distress', 'Emotional Distress'],
            ],
          },
        ]}
      />
      {/* Logged On · Student · Grade · Title · Status · ⋯ — the queue's own
          six. Severity lives in the filter above and in the row detail; a
          column for every attribute is what made this table scroll. */}
      <SessionsTable
        sessions={filtered}
        onSelectSession={(s) => onSelectSession(s, filtered)}
        safetyDetail
        showSafetyColumn={false}
        showTypeColumn={false}
        showEngagementColumn={false}
        showPosFlags={false}
        showFlagsColumn={false}
        onClearFilters={clearAll}
      />
    </div>
  )
}
