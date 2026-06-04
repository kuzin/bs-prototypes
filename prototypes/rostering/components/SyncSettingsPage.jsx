import { useState, useMemo, useEffect, useRef } from 'react'
import { ChartCard } from '@components/Cards/Cards'
import { Table } from '@components/Table/Table'
import { Modal } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { Spinner } from '@components/Primitives/Primitives'
import '@components/Primitives/Primitives.css'
import { SearchInput } from '@components/SearchInput/SearchInput'
import {
  SOURCE,
  INCOMING_CLASSES,
  MODE_OPTIONS,
  classImportSource,
  LAST_SYNC,
  DISTRICT,
  SCHOOLS,
} from '../data'

/**
 * The single Roster Sync Settings page:
 *
 *   1. Connection — passive "you're connected to Clever" strip
 *   2. Subject Rules — import filter (mode + custom keywords) with live preview
 *   3. Summer sync pause — pause/restart dates
 *   4. Last sync — school-tool-style totals; deactivations open in a modal
 */

const ACCENT = '#7C5CFA'

// ─── Icons ────────────────────────────────────────────────────────────────
const IcRules = <Icon name="clipboard-check" />
const IcCalendar = <Icon name="calendar" />
const IcHistory = <Icon name="history" />
function ChevronDown() {
  return <Icon name="chevron-down" size={14} className="rost-select-chevron" aria-hidden="true" />
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function fmtSyncTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// ─── Connection (small passive strip) ─────────────────────────────────────
function ConnectionSection({ scope }) {
  const isDistrict = scope === 'district'
  return (
    <section className="rost-conn-strip">
      <div className="rost-conn-strip-logo">C</div>
      <div className="rost-conn-strip-id">
        <div className="rost-conn-strip-name">{SOURCE.name}</div>
        <span className="rost-conn-live">
          <span className="rost-conn-live-dot" />
          {isDistrict
            ? `Connected · syncing ${DISTRICT.schoolCount} schools daily`
            : 'Connected · syncing daily'}
        </span>
      </div>
      <dl className="rost-conn-meta">
        <div className="rost-conn-meta-item">
          <dt>Last sync</dt>
          <dd>Today, 2:00 AM</dd>
        </div>
        <div className="rost-conn-meta-item">
          <dt>Next sync</dt>
          <dd>Tomorrow, 2:00 AM</dd>
        </div>
      </dl>
    </section>
  )
}

// ─── Subject Rules — import filter + live preview ─────────────────────────
function ModeCard({ option, active, onSelect }) {
  return (
    <button
      type="button"
      className={`rost-mode-card${active ? ' rost-mode-card--active' : ''}`}
      onClick={() => onSelect(option.id)}
      aria-pressed={active}
    >
      <span
        className={`rost-mode-radio${active ? ' rost-mode-radio--on' : ''}`}
        aria-hidden="true"
      />
      <span className="rost-mode-card-body">
        <span className="rost-mode-card-titlerow">
          <span className="rost-mode-card-title">{option.label}</span>
          {option.tag && <span className="rost-mode-card-tag">{option.tag}</span>}
        </span>
        <span className="rost-mode-card-desc">{option.desc}</span>
      </span>
    </button>
  )
}

function CustomSubjects({ words, onAdd, onRemove }) {
  const [draft, setDraft] = useState('')

  function commit() {
    const t = draft.trim()
    if (t && !words.some((w) => w.toLowerCase() === t.toLowerCase())) onAdd(t)
    setDraft('')
  }

  return (
    <div
      className="rost-custom-field"
      onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
    >
      {words.map((w) => (
        <span key={w} className="rost-custom-chip">
          {w}
          <button
            type="button"
            className="rost-custom-chip-x"
            onClick={() => onRemove(w)}
            aria-label={`Remove ${w}`}
          >
            <Icon name="x" size={10} />
          </button>
        </span>
      ))}
      <input
        className="rost-custom-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            commit()
          }
          if (e.key === 'Backspace' && !draft && words.length) onRemove(words[words.length - 1])
        }}
        onBlur={commit}
        placeholder={words.length ? 'Add another…' : 'e.g. Book Club, Guided Reading'}
      />
    </div>
  )
}

// Each class's status relative to the saved filter: it's being newly added,
// removed, kept (already synced), or left out — so the preview shows additions
// AND subtractions, not just what's dropped.
function classStatus(cls, filter, savedFilter) {
  const before = classImportSource(cls, savedFilter) !== null
  const after = classImportSource(cls, filter) !== null
  if (!before && after) return 'adding'
  if (before && !after) return 'removing'
  return after ? 'synced' : 'excluded'
}

const STATUS_META = {
  adding: { cls: 'rost-status--added', label: 'Adding', icon: 'plus' },
  removing: { cls: 'rost-status--removed', label: 'Removing', icon: 'minus' },
  synced: { cls: 'rost-status--sync', label: 'Synced', icon: null },
  excluded: { cls: 'rost-status--filter', label: 'Not synced', icon: null },
}

function ClassStatusPill({ status }) {
  const m = STATUS_META[status]
  return (
    <span className={`rost-status ${m.cls}`}>
      {m.icon ? (
        <Icon name={m.icon} size={11} stroke={2.4} />
      ) : (
        <span className="rost-status-dot" />
      )}
      {m.label}
    </span>
  )
}

const VIEW_OPTIONS = [
  { id: 'syncing', label: 'Syncing' },
  { id: 'changes', label: 'Changes' },
  { id: 'all', label: 'All' },
]

function FilterImpact({ filter, savedFilter, scope, schools = [], schoolId, onSchoolId }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState('syncing') // 'syncing' | 'changes' | 'all'
  const [query, setQuery] = useState('')

  const isDistrict = scope === 'district'
  // District: preview the filter against the chosen school's roster. School: the
  // single roster. (The filter itself is district-wide policy either way.)
  const classes = isDistrict
    ? (schools.find((s) => s.id === schoolId)?.classes ?? INCOMING_CLASSES)
    : INCOMING_CLASSES

  // Classify EVERY incoming class so the preview reflects the full picture —
  // what the edited filter will add as well as what it'll remove.
  const classified = useMemo(
    () => classes.map((c) => ({ ...c, status: classStatus(c, filter, savedFilter) })),
    [classes, filter, savedFilter],
  )
  const total = classified.length
  const afterCount = classified.filter((c) => c.status === 'synced' || c.status === 'adding').length
  const addCount = classified.filter((c) => c.status === 'adding').length
  const remCount = classified.filter((c) => c.status === 'removing').length
  const changeCount = addCount + remCount

  // Simulate the round-trip of fetching a fresh preview whenever the filter (or
  // the previewed school) changes — "hold tight, grabbing this for you", same as
  // the wait after a CSV roster upload. Skip the very first render.
  const previewKey = `${filter.mode}|${[...filter.customSubjects]
    .map((w) => w.toLowerCase())
    .sort()
    .join(',')}|${schoolId ?? ''}`
  const [previewing, setPreviewing] = useState(false)
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    setPreviewing(true)
    const t = setTimeout(() => setPreviewing(false), 750)
    return () => clearTimeout(t)
  }, [previewKey])

  // Expanding the class list also "goes and fetches" the per-class breakdown —
  // show a brief loading state in the panel each time it opens.
  const [opening, setOpening] = useState(false)
  useEffect(() => {
    if (!open) return
    setOpening(true)
    const t = setTimeout(() => setOpening(false), 600)
    return () => clearTimeout(t)
  }, [open])

  // Table rows: apply the segmented view, then the text search.
  const rows = useMemo(() => {
    let r = classified
    if (view === 'syncing') r = r.filter((c) => c.status === 'synced' || c.status === 'adding')
    else if (view === 'changes')
      r = r.filter((c) => c.status === 'adding' || c.status === 'removing')
    const q = query.trim().toLowerCase()
    if (q)
      r = r.filter((c) =>
        `${c.name} ${c.subject} ${c.teachers.join(' ')}`.toLowerCase().includes(q),
      )
    return r
  }, [classified, view, query])

  const columns = [
    {
      key: 'name',
      label: 'Class',
      render: (_, row) => (
        <div className="rost-class-cell-row">
          <span className="rost-class-cell-name">{row.name.split(' - ')[0]}</span>
          <span className="rost-class-cell-code">{row.period}</span>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: true,
      render: (v) => <span style={{ fontWeight: 600, fontSize: 13 }}>{v}</span>,
    },
    { key: 'teachers', label: 'Teacher(s)', render: (v) => v.join(', ') },
    { key: 'students', label: '# Students', align: 'right', sortable: true },
    {
      key: 'status',
      label: 'Filter Status',
      align: 'right',
      render: (v) => <ClassStatusPill status={v} />,
    },
  ]

  return (
    <div className="rost-fi">
      <div className="rost-rules-label">Filter preview</div>

      <div className="rost-fi-bar">
        <span className="rost-fi-text">
          {isDistrict && (
            <>
              Previewing{' '}
              <select
                className="rost-fi-school-select"
                value={schoolId}
                onChange={(e) => onSchoolId(e.target.value)}
                aria-label="Choose a school to preview the filter against"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>{' '}
              —{' '}
            </>
          )}
          {previewing ? (
            <span className="rost-fi-loading" role="status">
              <Spinner size="sm" />
              <span className="rost-fi-loading-text">Fetching preview</span>
              <span className="rost-fi-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </span>
          ) : (
            <>
              {isDistrict ? 'syncing' : 'Syncing'} <b>{afterCount.toLocaleString()}</b> of{' '}
              {total.toLocaleString()} classes
              {changeCount > 0 && (
                <span className="rost-fi-delta">
                  {addCount > 0 && <span className="rost-fi-delta-add">+{addCount} added</span>}
                  {remCount > 0 && <span className="rost-fi-delta-rem">−{remCount} removed</span>}
                </span>
              )}
            </>
          )}
        </span>
        <Button
          variant="secondary"
          size="sm"
          className="rost-fi-btn"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          iconRight={
            <Icon
              name="chevron-down"
              size={14}
              className={`rost-fi-chevron${open ? ' rost-fi-chevron--open' : ''}`}
            />
          }
        >
          {open ? 'Hide classes' : 'See which classes'}
        </Button>
      </div>

      {open && (
        <div className="rost-fi-panel">
          {opening ? (
            <div className="rost-fi-panel-loading">
              <Spinner />
              <span>Fetching classes…</span>
            </div>
          ) : (
            <>
              <div className="rost-fi-toolbar">
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  placeholder="Search classes, subjects, teachers…"
                  className="rost-fi-search"
                />
                <div className="rost-seg" role="tablist" aria-label="Filter preview view">
                  {VIEW_OPTIONS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      role="tab"
                      aria-selected={view === v.id}
                      className={`rost-seg-btn${view === v.id ? ' rost-seg-btn--active' : ''}`}
                      onClick={() => setView(v.id)}
                    >
                      {v.label}
                      {v.id === 'changes' && changeCount > 0 && ` (${changeCount})`}
                    </button>
                  ))}
                </div>
                <span className="rost-fi-count">{rows.length.toLocaleString()} shown</span>
              </div>
              <div className="rost-card rost-classes-table" style={{ padding: 0 }}>
                <Table
                  columns={columns}
                  rows={rows}
                  getRowKey={(r) => r.id}
                  zebra
                  stickyHeader
                  scrollX
                  pageSize={12}
                  flush
                  loading={previewing}
                  empty={query ? 'No classes match your search.' : 'No classes in this view.'}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function SubjectRulesSection({
  filter,
  savedFilter,
  filterDirty,
  onSetMode,
  onAddCustom,
  onRemoveCustom,
  onSave,
  onCancel,
  scope,
  schools,
  schoolId,
  onSchoolId,
}) {
  const isDistrict = scope === 'district'
  const footer = filterDirty ? (
    <div className="rost-card-footer-bar">
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="accent" accent="var(--rost-accent)" onClick={onSave}>
        Save rules
      </Button>
    </div>
  ) : null

  return (
    <ChartCard
      title="Subject Rules"
      subtitle={
        isDistrict
          ? 'Pick which classes sync into Beanstack across your district.'
          : 'Pick which classes sync into Beanstack.'
      }
      icon={IcRules}
      accent={ACCENT}
      footer={footer}
      bodyPad="padded"
    >
      <div className="rost-rules-label">Import filter</div>
      <div className="rost-mode-options">
        {MODE_OPTIONS.map((opt) => (
          <ModeCard
            key={opt.id}
            option={opt}
            active={filter.mode === opt.id}
            onSelect={onSetMode}
          />
        ))}
      </div>

      {/* Custom keywords are pointless under "All Subjects" — everything imports
          already — so hide the section in that mode. */}
      {filter.mode !== 'import_all' && (
        <>
          <div className="rost-rules-label rost-rules-label--spaced">
            Custom subjects <span className="rost-rules-label-opt">optional</span>
          </div>
          <div className="rost-rules-help">
            Also sync any class whose name contains one of these keywords.
          </div>
          <CustomSubjects
            words={filter.customSubjects}
            onAdd={onAddCustom}
            onRemove={onRemoveCustom}
          />
        </>
      )}

      <FilterImpact
        filter={filter}
        savedFilter={savedFilter}
        scope={scope}
        schools={schools}
        schoolId={schoolId}
        onSchoolId={onSchoolId}
      />
    </ChartCard>
  )
}

// ─── Schedule (pause / restart) ───────────────────────────────────────────
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

const SCHEDULE_DEFAULT = { pauseMonth: 'May', pauseDay: 23, restartMonth: 'August', restartDay: 1 }

function ScheduleSection() {
  const [dates, setDates] = useState(SCHEDULE_DEFAULT)
  const [saved, setSaved] = useState(SCHEDULE_DEFAULT)
  const dirty = JSON.stringify(dates) !== JSON.stringify(saved)

  const set = (k) => (v) => setDates((d) => ({ ...d, [k]: v }))

  const footer = dirty ? (
    <div className="rost-card-footer-bar">
      <Button variant="secondary" onClick={() => setDates(saved)}>
        Cancel
      </Button>
      <Button variant="accent" accent="var(--rost-accent)" onClick={() => setSaved(dates)}>
        Save
      </Button>
    </div>
  ) : null

  return (
    <ChartCard
      title="Summer rostering sync pause"
      subtitle="Pause syncing over the summer to keep end-of-year data."
      icon={IcCalendar}
      accent={ACCENT}
      footer={footer}
      bodyPad="padded"
    >
      <div className="rost-info-banner">
        <div className="rost-info-icon">
          <Icon name="info" size={16} />
        </div>
        <div>
          Share rostering data up to the pause date and again on the restart date, so no logs are
          lost.
        </div>
      </div>

      <div className="rost-field">
        <label className="rost-field-label">Pause date</label>
        <div className="rost-field-help">Usually your last day of school.</div>
        <div className="rost-field-row">
          <div className="rost-select-wrap rost-select-wrap--day">
            <select
              value={dates.pauseDay}
              onChange={(e) => set('pauseDay')(+e.target.value)}
              className="rost-select"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
          <span className="rost-field-of">of</span>
          <div className="rost-select-wrap rost-select-wrap--grow">
            <select
              value={dates.pauseMonth}
              onChange={(e) => set('pauseMonth')(e.target.value)}
              className="rost-select"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      <div className="rost-field" style={{ marginTop: 16 }}>
        <label className="rost-field-label">Restart date</label>
        <div className="rost-field-help">
          A few days before students return, <strong>after</strong> your summer challenge ends.
        </div>
        <div className="rost-field-row">
          <div className="rost-select-wrap rost-select-wrap--day">
            <select
              value={dates.restartDay}
              onChange={(e) => set('restartDay')(+e.target.value)}
              className="rost-select"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
          <span className="rost-field-of">of</span>
          <div className="rost-select-wrap rost-select-wrap--grow">
            <select
              value={dates.restartMonth}
              onChange={(e) => set('restartMonth')(e.target.value)}
              className="rost-select"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      <div className="rost-warn-banner" style={{ marginTop: 16 }}>
        <div style={{ flexShrink: 0 }}>
          <Icon name="alert-triangle" size={16} />
        </div>
        <div>
          No syncs will run from{' '}
          <strong>
            {dates.pauseDay + 1} of {dates.pauseMonth}
          </strong>{' '}
          through{' '}
          <strong>
            {dates.restartDay - 1 || 31} of {dates.restartMonth}
          </strong>
          .
        </div>
      </div>
    </ChartCard>
  )
}

// ─── Last sync (school-tool-style totals; deactivations open a modal) ─────
function fmtDeactivatedAt(iso) {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function fmtScheduledDeletion(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// Scalable deactivated-user list for the drill-down modals. A site can deactivate
// hundreds of users at end of year, so this searches + paginates via the shared
// Table rather than dumping every row into one long scroll.
function DeactivatedList({ users, showType = false, initialRole = 'all' }) {
  const [query, setQuery] = useState('')
  // Mixed teacher + student lists can be filtered by role. `initialRole` lets a
  // caller open straight onto a specific tab (e.g. the school view's Teachers row
  // opens this already filtered to Teachers).
  const [role, setRole] = useState(initialRole) // 'all' | 'Teacher' | 'Student'
  const roleCounts = useMemo(
    () => ({
      Teacher: users.filter((u) => u.role === 'Teacher').length,
      Student: users.filter((u) => u.role === 'Student').length,
    }),
    [users],
  )
  const rows = useMemo(() => {
    let r = users
    if (showType && role !== 'all') r = r.filter((u) => u.role === role)
    const q = query.trim().toLowerCase()
    if (q) r = r.filter((u) => `${u.name} ${u.role ?? ''}`.toLowerCase().includes(q))
    return r
  }, [users, query, role, showType])

  const columns = [
    {
      key: 'name',
      label: 'User Name',
      sortable: true,
      render: (v) => <span className="rost-ls-drill-name">{v}</span>,
    },
    ...(showType ? [{ key: 'role', label: 'Type', sortable: true }] : []),
    {
      key: 'deactivatedAt',
      label: 'Deactivation Date',
      sortable: true,
      render: (v) => fmtDeactivatedAt(v),
    },
    {
      key: 'scheduledDeletion',
      label: 'Scheduled Deletion',
      sortable: true,
      render: (v) => fmtScheduledDeletion(v),
    },
  ]

  return (
    <div className="rost-deact-list">
      <div className="rost-deact-toolbar">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by name…"
          className="rost-deact-search"
        />
        {showType && (
          <div className="rost-seg" role="tablist" aria-label="Filter by user type">
            {[
              { id: 'all', label: `All (${users.length})` },
              { id: 'Teacher', label: `Teachers (${roleCounts.Teacher})` },
              { id: 'Student', label: `Students (${roleCounts.Student})` },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={role === opt.id}
                className={`rost-seg-btn${role === opt.id ? ' rost-seg-btn--active' : ''}`}
                onClick={() => setRole(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
        <span className="rost-fi-count">
          {rows.length.toLocaleString()}
          {rows.length !== users.length ? ` of ${users.length.toLocaleString()}` : ''} users
        </span>
      </div>
      <div className="rost-deact-tablewrap">
        <Table
          columns={columns}
          rows={rows}
          getRowKey={(r, i) => `${r.name}-${i}`}
          zebra
          stickyHeader
          scrollX
          flush
          pageSize={9}
          defaultSortKey="name"
          empty="No users match your search."
        />
      </div>
    </div>
  )
}

function LastSyncSection({ scope }) {
  return scope === 'district' ? <DistrictLastSync /> : <SchoolLastSync />
}

// School: one school's most recent sync; deactivations open a drill-down modal.
function SchoolLastSync() {
  // Which role tab to open the (combined) modal on: 'Teacher' | 'Student' | null.
  const [drill, setDrill] = useState(null)
  const ls = LAST_SYNC
  const tD = ls.teachersDeactivated
  const sD = ls.studentsDeactivated
  // One combined list, same as the district modal — the clicked row just picks
  // which tab it opens on.
  const allDeactivated = useMemo(() => [...tD, ...sD], [tD, sD])

  const items = [
    { key: 'teachers', role: 'Teacher', label: 'Teachers', value: ls.teachers, deact: tD.length },
    { key: 'students', role: 'Student', label: 'Students', value: ls.students, deact: sD.length },
    { key: 'sections', label: 'Sections', value: ls.sections },
    { key: 'enrollments', label: 'Enrollments', value: ls.enrollments },
  ]

  return (
    <ChartCard
      title="Last sync"
      subtitle={`Your most recent sync · ${fmtSyncTime(ls.at)}`}
      icon={IcHistory}
      accent={ACCENT}
      bodyPad="flush"
    >
      <ul className="rost-ls-list">
        {items.map((it) => (
          <li key={it.key} className="rost-ls-li">
            <span className="rost-ls-li-label">{it.label}</span>
            <span className="rost-ls-li-right">
              {it.deact > 0 && (
                <button
                  type="button"
                  className="rost-ls-li-deact"
                  onClick={() => setDrill(it.role)}
                  aria-haspopup="dialog"
                >
                  {it.deact} deactivated
                  <Icon name="arrow-right" size={11} />
                </button>
              )}
              <span className="rost-ls-li-value">{it.value.toLocaleString()}</span>
            </span>
          </li>
        ))}
      </ul>

      <Modal
        open={!!drill}
        onClose={() => setDrill(null)}
        variant="center"
        ariaLabel="Deactivated users"
      >
        {({ close }) => (
          <div className="rost-deact-modal">
            <div className="modal-header">
              <div className="modal-header-text">
                <h3 className="modal-title">Deactivated users</h3>
                <div className="rost-deact-sub">
                  Removed on the deletion date unless they return in a later sync.
                </div>
              </div>
              <button className="rost-modal-close" onClick={close} aria-label="Close">
                <Icon name="x" size={16} />
              </button>
            </div>
            <div className="modal-body">
              <DeactivatedList
                key={drill}
                users={allDeactivated}
                showType
                initialRole={drill ?? 'all'}
              />
            </div>
          </div>
        )}
      </Modal>
    </ChartCard>
  )
}

// District: per-school last-sync totals in a borderless table. Clicking a
// school's deactivated count opens that school's deactivation drill-down.
function DistrictLastSync() {
  const [drillSchool, setDrillSchool] = useState(null)

  const columns = [
    { key: 'name', label: 'School', render: (v) => <span style={{ fontWeight: 600 }}>{v}</span> },
    { key: 'teachers', label: 'Teachers', align: 'right', render: (v) => v.toLocaleString() },
    { key: 'students', label: 'Students', align: 'right', render: (v) => v.toLocaleString() },
    { key: 'sections', label: 'Sections', align: 'right', render: (v) => v.toLocaleString() },
    { key: 'enrollments', label: 'Enrollments', align: 'right', render: (v) => v.toLocaleString() },
    {
      key: 'deactivatedUsers',
      label: 'Deactivated',
      align: 'right',
      render: (users, row) =>
        users.length === 0 ? (
          <span style={{ color: '#9CA3AF' }}>0</span>
        ) : (
          <button
            type="button"
            className="rost-ls-li-deact"
            onClick={() => setDrillSchool(row)}
            aria-haspopup="dialog"
          >
            {users.length} deactivated
            <Icon name="arrow-right" size={11} />
          </button>
        ),
    },
  ]

  return (
    <ChartCard
      title="Last sync"
      subtitle={`Across all ${DISTRICT.schoolCount} schools · ${fmtSyncTime(DISTRICT.lastSyncAt)}`}
      icon={IcHistory}
      accent={ACCENT}
      bodyPad="flush"
    >
      <Table
        columns={columns}
        rows={SCHOOLS}
        getRowKey={(r) => r.id}
        zebra
        stickyHeader
        scrollX
        flush
        className="rost-ls-tbl"
        empty="No schools."
      />

      <Modal
        open={!!drillSchool}
        onClose={() => setDrillSchool(null)}
        variant="center"
        ariaLabel="Deactivated users"
      >
        {({ close }) => (
          <div className="rost-deact-modal">
            <div className="modal-header">
              <div className="modal-header-text">
                <h3 className="modal-title">Deactivated users — {drillSchool?.name}</h3>
                <div className="rost-deact-sub">
                  Removed on the deletion date unless they return in a later sync.
                </div>
              </div>
              <button className="rost-modal-close" onClick={close} aria-label="Close">
                <Icon name="x" size={16} />
              </button>
            </div>
            <div className="modal-body">
              <DeactivatedList users={drillSchool?.deactivatedUsers ?? []} showType />
            </div>
          </div>
        )}
      </Modal>
    </ChartCard>
  )
}

// ─── Page composition ─────────────────────────────────────────────────────
export function SyncSettingsPage({
  filter,
  savedFilter,
  filterDirty,
  onSetMode,
  onAddCustom,
  onRemoveCustom,
  onSaveFilter,
  onCancelFilter,
  scope,
  schools,
  schoolId,
  onSchoolId,
}) {
  return (
    <>
      <ConnectionSection scope={scope} />
      <SubjectRulesSection
        filter={filter}
        savedFilter={savedFilter}
        filterDirty={filterDirty}
        onSetMode={onSetMode}
        onAddCustom={onAddCustom}
        onRemoveCustom={onRemoveCustom}
        onSave={onSaveFilter}
        onCancel={onCancelFilter}
        scope={scope}
        schools={schools}
        schoolId={schoolId}
        onSchoolId={onSchoolId}
      />
      <LastSyncSection scope={scope} />
      {/* Least-used control sits at the bottom. */}
      <ScheduleSection />
    </>
  )
}
