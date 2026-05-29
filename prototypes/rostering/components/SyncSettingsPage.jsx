import { useState, useMemo } from 'react'
import { ChartCard } from '@components/Cards/Cards'
import { Table } from '@components/Table/Table'
import { Modal } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
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

// ─── Icons (Feather-style, 24x24 viewBox, 1.8 stroke) ─────────────────────
const IcRules = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
)
const IcCalendar = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const IcHistory = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </svg>
)
function ChevronDown() {
  return (
    <svg
      className="rost-select-chevron"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="4,6 8,10 12,6" />
    </svg>
  )
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
        <span className="rost-mode-card-title">{option.label}</span>
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
            <svg
              viewBox="0 0 12 12"
              width="10"
              height="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <line x1="3" y1="3" x2="9" y2="9" />
              <line x1="9" y1="3" x2="3" y2="9" />
            </svg>
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

// Of the classes currently syncing, whether the (draft) filter keeps each one
// or would drop it from the sync.
function FilterStatusPill({ synced }) {
  return synced ? (
    <span className="rost-status rost-status--sync">
      <span className="rost-status-dot" />
      Synced
    </span>
  ) : (
    <span className="rost-status rost-status--removed">
      <span className="rost-status-dot" />
      Filtered Out
    </span>
  )
}

function FilterImpact({ filter, savedFilter, scope, schools = [], schoolId, onSchoolId }) {
  const [open, setOpen] = useState(false)

  const isDistrict = scope === 'district'
  // District: preview the filter against the chosen school's roster. School: the
  // single roster. (The filter itself is district-wide policy either way.)
  const classes = isDistrict
    ? (schools.find((s) => s.id === schoolId)?.classes ?? INCOMING_CLASSES)
    : INCOMING_CLASSES

  // We can only preview against the classes that are actually synced today —
  // i.e. those the currently-saved filter pulls in. For each, show whether the
  // edited filter keeps it ("Synced") or would drop it ("Filtered Out").
  const classified = useMemo(
    () =>
      classes
        .filter((c) => classImportSource(c, savedFilter) !== null)
        .map((c) => ({ ...c, synced: classImportSource(c, filter) !== null })),
    [classes, filter, savedFilter],
  )
  const total = classified.length
  const kept = classified.filter((c) => c.synced).length

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
      render: (v) => <span style={{ fontWeight: 600, fontSize: 13 }}>{v}</span>,
    },
    { key: 'teachers', label: 'Teacher(s)', render: (v) => v.join(', ') },
    { key: 'students', label: '# Students', align: 'right', sortable: true },
    {
      key: 'synced',
      label: 'Filter Status',
      align: 'right',
      render: (v) => <FilterStatusPill synced={v} />,
    },
  ]

  return (
    <div className="rost-fi">
      <div className="rost-rules-label">Filter preview</div>

      <div className="rost-fi-bar">
        <span className="rost-fi-text">
          Keeping <b>{kept}</b> of {total} synced classes
          {isDistrict && (
            <>
              {' '}
              for{' '}
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
              </select>
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
            <svg
              className={`rost-fi-chevron${open ? ' rost-fi-chevron--open' : ''}`}
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4,6 8,10 12,6" />
            </svg>
          }
        >
          {open ? 'Hide classes' : 'See which classes'}
        </Button>
      </div>

      {open && (
        <div className="rost-fi-panel">
          <div className="rost-card rost-classes-table" style={{ padding: 0 }}>
            <Table
              columns={columns}
              rows={classified}
              getRowKey={(r) => r.id}
              zebra
              stickyHeader
              scrollX
              pageSize={12}
              flush
              empty="No classes."
            />
          </div>
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

      <div className="rost-rules-label rost-rules-label--spaced">
        Custom subjects <span className="rost-rules-label-opt">optional</span>
      </div>
      <div className="rost-rules-help">
        Also sync any class whose name contains one of these keywords.
      </div>
      <CustomSubjects words={filter.customSubjects} onAdd={onAddCustom} onRemove={onRemoveCustom} />

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
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="8" r="6.5" />
            <line x1="8" y1="7" x2="8" y2="11" />
            <circle cx="8" cy="5" r="0.6" fill="currentColor" />
          </svg>
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
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 4v5" />
            <circle cx="8" cy="11.5" r="0.6" fill="currentColor" />
          </svg>
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

function LastSyncSection({ scope }) {
  return scope === 'district' ? <DistrictLastSync /> : <SchoolLastSync />
}

// School: one school's most recent sync; deactivations open a drill-down modal.
function SchoolLastSync() {
  const [drill, setDrill] = useState(null) // 'teachers' | 'students' | null
  const ls = LAST_SYNC
  const tD = ls.teachersDeactivated
  const sD = ls.studentsDeactivated
  const drillRows = drill === 'teachers' ? tD : drill === 'students' ? sD : []

  const items = [
    { key: 'teachers', label: 'Teachers', value: ls.teachers, deact: tD.length },
    { key: 'students', label: 'Students', value: ls.students, deact: sD.length },
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
                  onClick={() => setDrill(it.key)}
                  aria-haspopup="dialog"
                >
                  {it.deact} deactivated
                  <svg
                    viewBox="0 0 16 16"
                    width="11"
                    height="11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="8" x2="12" y2="8" />
                    <polyline points="8,4 12,8 8,12" />
                  </svg>
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
                <h3 className="modal-title">
                  Deactivated {drill === 'teachers' ? 'teachers' : 'students'}
                </h3>
                <div className="rost-deact-sub">
                  Removed on the deletion date unless they return in a later sync.
                </div>
              </div>
              <button className="rost-modal-close" onClick={close} aria-label="Close">
                <svg
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="4" x2="12" y2="12" />
                  <line x1="12" y1="4" x2="4" y2="12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <table className="rost-ls-drill-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User Name</th>
                    <th>Deactivation Date</th>
                    <th>Scheduled Deletion</th>
                  </tr>
                </thead>
                <tbody>
                  {drillRows.map((r, i) => (
                    <tr key={r.name}>
                      <td>{i + 1}</td>
                      <td className="rost-ls-drill-name">{r.name}</td>
                      <td>{fmtDeactivatedAt(r.deactivatedAt)}</td>
                      <td>{fmtScheduledDeletion(r.scheduledDeletion)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <svg
              viewBox="0 0 16 16"
              width="11"
              height="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="8" x2="12" y2="8" />
              <polyline points="8,4 12,8 8,12" />
            </svg>
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
                <svg
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="4" x2="12" y2="12" />
                  <line x1="12" y1="4" x2="4" y2="12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <table className="rost-ls-drill-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User Name</th>
                    <th>Type</th>
                    <th>Deactivation Date</th>
                    <th>Scheduled Deletion</th>
                  </tr>
                </thead>
                <tbody>
                  {(drillSchool?.deactivatedUsers ?? []).map((r, i) => (
                    <tr key={r.name}>
                      <td>{i + 1}</td>
                      <td className="rost-ls-drill-name">{r.name}</td>
                      <td>{r.role}</td>
                      <td>{fmtDeactivatedAt(r.deactivatedAt)}</td>
                      <td>{fmtScheduledDeletion(r.scheduledDeletion)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
