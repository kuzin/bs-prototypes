import { useMemo, useState } from 'react'
import { Tabs } from '../../ris/components/Tabs'
import { Table } from '../../ris/components/Table'
import {
  INCOMING_CLASSES, REMOVED_CLASSES, STAFF, STUDENTS_SAMPLE,
  SOURCE, TOTALS, DIFF, statusFromRules,
} from '../data'

/**
 * Side-slide modal that shows the data Clever will push tonight.
 * Three tabs: Classes / Staff / Students. Each is a paginated table.
 * Subject Rules controls live on the Sync Settings page (not in here) —
 * but the active rules are summarized as chips so you can see what's being
 * filtered as you browse.
 */

const STATUS_LABEL = {
  'will-sync': 'Will sync',
  'filtered':  'Filtered',
  'unsorted':  'Needs a rule',
  'new':       'New',
  'removed':   'Removed',
}

function StatusPill({ status }) {
  const cls =
    status === 'will-sync' ? 'rost-status--sync' :
    status === 'filtered'  ? 'rost-status--filter' :
    'rost-status--unsorted'
  return (
    <span className={`rost-status ${cls}`}>
      <span className="rost-status-dot" />
      {STATUS_LABEL[status]}
    </span>
  )
}
function CompoundStatus({ status, diff }) {
  if (diff === 'removed') return <span className="rost-status rost-status--removed"><span className="rost-status-dot" /> Removed</span>
  if (diff === 'new') return (
    <span className="rost-compound">
      <span className="rost-status rost-status--new"><span className="rost-status-dot" /> New</span>
      <StatusPill status={status} />
    </span>
  )
  return <StatusPill status={status} />
}

function StaffSyncPill({ status }) {
  if (status === 'included') return <span className="rost-status rost-status--sync"><span className="rost-status-dot" />Included</span>
  if (status === 'new')      return <span className="rost-status rost-status--new"><span className="rost-status-dot" />New this sync</span>
  return <span className="rost-status rost-status--unsorted"><span className="rost-status-dot" />Not in sync</span>
}

function StudentSyncPill({ status }) {
  if (status === 'new')     return <span className="rost-status rost-status--new"><span className="rost-status-dot" />New</span>
  if (status === 'removed') return <span className="rost-status rost-status--removed"><span className="rost-status-dot" />Removed</span>
  return <span className="rost-status rost-status--sync"><span className="rost-status-dot" />Current</span>
}

// ─── Classes tab ───────────────────────────────────────────────────────────
function ClassesTab({ rules, onExcludeSubject }) {
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [statusFilter, setStatusFilter]   = useState('all')
  const [search, setSearch] = useState('')

  const rows = useMemo(() => {
    const base = [...INCOMING_CLASSES, ...REMOVED_CLASSES]
    return base.map(c => ({ ...c, status: statusFromRules(c.subject, rules) }))
  }, [rules])

  const filtered = useMemo(() => rows.filter(r => {
    if (subjectFilter !== 'all' && r.subject !== subjectFilter) return false
    if (statusFilter !== 'all') {
      if (statusFilter === 'new' && r.diff !== 'new') return false
      if (statusFilter === 'removed' && r.diff !== 'removed') return false
      if (['will-sync','filtered','unsorted'].includes(statusFilter) && r.status !== statusFilter) return false
    }
    if (search) {
      const q = search.toLowerCase()
      if (!`${r.name} ${r.teachers.join(' ')} ${r.subject}`.toLowerCase().includes(q)) return false
    }
    return true
  }), [rows, subjectFilter, statusFilter, search])

  const subjectOptions = useMemo(() => {
    const subjects = [...new Set(rows.map(r => r.subject))].sort()
    return [{ value: 'all', label: 'All subjects' }, ...subjects.map(s => ({ value: s, label: s }))]
  }, [rows])

  const counts = useMemo(() => {
    const out = { 'will-sync': 0, filtered: 0, unsorted: 0, new: 0, removed: 0 }
    for (const r of rows) {
      out[r.status] = (out[r.status] || 0) + 1
      if (r.diff === 'new') out.new++
      if (r.diff === 'removed') out.removed++
    }
    return out
  }, [rows])

  // Only surface the syncing subjects — the excluded list is long and less useful here.
  const syncingSubjects = [...rules.allowed].sort()

  const columns = [
    {
      key: 'name',
      label: 'Class',
      render: (_, row) => {
        const display = row.name.split(' - ')[0]
        return (
          <div className="rost-class-cell-row">
            <span className="rost-class-cell-name">{display}</span>
            <span className="rost-class-cell-code">{row.period}</span>
          </div>
        )
      },
    },
    { key: 'subject', label: 'Subject', render: v => <span style={{ fontWeight: 600, fontSize: 13 }}>{v}</span> },
    { key: 'teachers', label: 'Teacher(s)', render: v => v.join(', ') },
    { key: 'students', label: '# Students', align: 'right', sortable: true },
    { key: 'avgLexile', label: 'Avg Lexile', align: 'right', render: v => v ? `${v}L` : <span style={{ color: '#9CA3AF' }}>N/A</span> },
    { key: 'status', label: 'Status', align: 'right', render: (_, row) => <CompoundStatus status={row.status} diff={row.diff} /> },
    {
      key: 'actions',
      label: '',
      render: (_, row) => {
        if (rules.excluded.includes(row.subject)) return null
        return (
          <button
            className="rost-row-action"
            onClick={() => onExcludeSubject(row.subject)}
            title={`Exclude all "${row.subject}" classes from future syncs`}
          >
            <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="4" x2="10" y2="10"/><line x1="10" y1="4" x2="4" y2="10"/></svg>
            Exclude subject
          </button>
        )
      },
    },
  ]

  return (
    <>
      <div className="rost-filters">
        <input
          type="text"
          className="rost-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search class, teacher…"
        />
        <select className="rost-filter-select" value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
          {subjectOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="rost-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="will-sync">Will sync ({counts['will-sync']})</option>
          <option value="filtered">Filtered ({counts.filtered})</option>
          <option value="new">New ({counts.new})</option>
          <option value="removed">Removed ({counts.removed})</option>
        </select>
        <span className="rost-filters-count">{filtered.length} of {rows.length}</span>
      </div>

      <div className="rost-active-rules">
        <span className="rost-active-rules-label">Syncing:</span>
        {syncingSubjects.length === 0 ? (
          <span className="rost-active-rules-empty">No subjects syncing</span>
        ) : (
          syncingSubjects.map(s => (
            <span key={s} className="rost-rule-tag rost-rule-tag--allowed">✓ {s}</span>
          ))
        )}
      </div>

      <div className="rost-card rost-classes-table" style={{ padding: 0, overflowX: 'auto' }}>
        <Table
          columns={columns}
          rows={filtered}
          getRowKey={r => r.id}
          zebra
          stickyHeader
          pageSize={12}
          flush
          empty="No classes match these filters."
        />
      </div>
    </>
  )
}

// ─── Staff tab ─────────────────────────────────────────────────────────────
function StaffTab() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => STAFF.filter(s => {
    if (statusFilter !== 'all' && s.syncStatus !== statusFilter) return false
    if (!search) return true
    return `${s.name} ${s.email} ${s.role}`.toLowerCase().includes(search.toLowerCase())
  }), [search, statusFilter])

  const missing = STAFF.filter(s => s.syncStatus === 'not-synced')

  const columns = [
    {
      key: 'name', label: 'Name', sortable: true,
      render: (v, row) => (
        <span style={{ fontWeight: 600 }}>
          {v}
          {row.isYou && <span className="rost-staff-you">You</span>}
        </span>
      ),
    },
    { key: 'email', label: 'Email', render: v => <span style={{ color: '#4B5563' }}>{v}</span> },
    { key: 'role',  label: 'Role',  sortable: true },
    {
      key: 'syncStatus', label: 'Sync status', align: 'right',
      render: (v, row) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {row.notedBy && <span className="rost-noted" title={`Flagged as missing by ${row.notedBy}`}>★ flagged by you</span>}
          <StaffSyncPill status={v} />
        </span>
      ),
    },
  ]

  return (
    <>
      {missing.length > 0 && (
        <div className="rost-warn-banner" style={{ marginBottom: 12 }}>
          <div style={{ flexShrink: 0, color: '#92400E' }}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 1l7 12H1z" /><line x1="8" y1="6" x2="8" y2="9" /><circle cx="8" cy="11" r="0.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <strong>{missing.length} staff missing</strong> from {SOURCE.name}: {missing.map(s => `${s.name} (${s.role})`).join(' · ')}.
            <div style={{ marginTop: 4, fontSize: 12.5, color: '#7C3F09' }}>
              Contact {SOURCE.rosteringContact.name} ({SOURCE.rosteringContact.email}) at {SOURCE.rosteringContact.role} to add them.
            </div>
          </div>
        </div>
      )}

      <div className="rost-filters">
        <input
          type="text" className="rost-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff…"
        />
        <select className="rost-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All statuses ({STAFF.length})</option>
          <option value="included">Included ({STAFF.filter(s => s.syncStatus === 'included').length})</option>
          <option value="new">New this sync ({STAFF.filter(s => s.syncStatus === 'new').length})</option>
          <option value="not-synced">Not in sync ({missing.length})</option>
        </select>
        <span className="rost-filters-count">{filtered.length} of {STAFF.length}</span>
      </div>

      <div className="rost-card rost-classes-table" style={{ padding: 0, overflowX: 'auto' }}>
        <Table columns={columns} rows={filtered} getRowKey={r => r.id} zebra stickyHeader flush pageSize={10} empty="No staff match these filters." />
      </div>
    </>
  )
}

// ─── Students tab ──────────────────────────────────────────────────────────
function StudentsTab() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => STUDENTS_SAMPLE.filter(s => {
    if (statusFilter !== 'all' && s.syncStatus !== statusFilter) return false
    if (!search) return true
    return `${s.name} ${s.username} ${s.grade}`.toLowerCase().includes(search.toLowerCase())
  }), [search, statusFilter])

  const newCount = STUDENTS_SAMPLE.filter(s => s.syncStatus === 'new').length
  const currentCount = STUDENTS_SAMPLE.filter(s => s.syncStatus === 'current').length

  const columns = [
    { key: 'name', label: 'Student name', sortable: true, render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { key: 'username', label: 'Username', render: v => <span style={{ color: '#4B5563', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 }}>{v}</span> },
    { key: 'grade', label: 'Grade', sortable: true },
    { key: 'syncStatus', label: 'Sync status', align: 'right', render: v => <StudentSyncPill status={v} /> },
  ]

  return (
    <>
      <div className="rost-info-banner" style={{ marginBottom: 12 }}>
        <div className="rost-info-icon">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11"/><circle cx="8" cy="5" r="0.6" fill="currentColor"/>
          </svg>
        </div>
        <div>
          Showing {STUDENTS_SAMPLE.length} of {TOTALS.students.toLocaleString()} students — including all <strong>+{DIFF.students.new} new</strong> arrivals.
          Student records sync automatically with the rest of the roster.
        </div>
      </div>

      <div className="rost-filters">
        <input type="text" className="rost-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student name, username…" />
        <select className="rost-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="current">Current ({currentCount})</option>
          <option value="new">New ({newCount})</option>
        </select>
        <span className="rost-filters-count">{filtered.length} of {STUDENTS_SAMPLE.length}</span>
      </div>

      <div className="rost-card rost-classes-table" style={{ padding: 0, overflowX: 'auto' }}>
        <Table columns={columns} rows={filtered} getRowKey={r => r.id} zebra stickyHeader flush pageSize={10} empty="No students match these filters." />
      </div>
    </>
  )
}

// ─── Modal shell ───────────────────────────────────────────────────────────
export function PreviewPanel({ rules, activeTab, onActiveTab, onClose, onExcludeSubject }) {
  const counts = {
    classes: TOTALS.classesIncoming,
    staff: TOTALS.staff,
    students: TOTALS.students,
  }

  return (
    <div className="rost-preview">
      {/* Header */}
      <div className="rost-preview-head">
        <div>
          <div className="rost-preview-title">Stiles Point Elementary School</div>
          <div className="rost-preview-meta">From <strong>{SOURCE.name}</strong> · arriving tomorrow at 2:00 AM</div>
        </div>
        <button className="rost-preview-close" onClick={onClose} aria-label="Close preview">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/>
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="rost-preview-tabs">
        <Tabs
          accent="#7C5CFA"
          active={activeTab}
          onChange={onActiveTab}
          items={[
            { id: 'classes',  label: 'Classes',  count: counts.classes },
            { id: 'staff',    label: 'Staff',    count: counts.staff },
            { id: 'students', label: 'Students', count: counts.students },
          ]}
        />
      </div>

      <div className="rost-preview-body">
        {activeTab === 'classes'  && <ClassesTab  rules={rules} onExcludeSubject={onExcludeSubject} />}
        {activeTab === 'staff'    && <StaffTab />}
        {activeTab === 'students' && <StudentsTab />}
      </div>

      <div className="rost-preview-footer">
        <div className="rost-preview-footer-note">
          Syncs run automatically — this preview is for confirmation only.
        </div>
        <button className="rost-btn rost-btn--primary" onClick={onClose}>Done</button>
      </div>
    </div>
  )
}
