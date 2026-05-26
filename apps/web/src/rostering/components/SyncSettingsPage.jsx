import { useState, useMemo } from 'react'
import { ChartCard } from '../../ris/components/Cards'
import { Toggle } from '../../ris/components/Toggle'
import '../../ris/components/Toggle.css'
import { SOURCE, SYNC_LOG, DIFF, SUBJECT_COUNTS, TOTALS, NEW_SUBJECTS, STAFF } from '../data'

/**
 * The single Roster Sync Settings page. Everything Janie needs lives here:
 *
 *   1. Connection — passive "you're connected to Clever" strip
 *   2. Tonight's incoming sync — data-oriented stat row + Preview CTA
 *   3. Subject Rules — single list with segmented control
 *   4. Summer sync pause — pause/restart dates
 *   5. Recent syncs — paginated log
 *
 * All sections use the shared ChartCard wrapper from ris/components for
 * consistent visual chrome.
 */

const ACCENT = '#7C5CFA'

// ─── Icons (Feather-style, 24x24 viewBox, 1.8 stroke) ─────────────────────
const IcSync = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
    <polyline points="21 3 21 8 16 8"/>
    <polyline points="3 21 3 16 8 16"/>
  </svg>
)
const IcRules = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
)
const IcCalendar = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IcHistory = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <polyline points="12 7 12 12 15 14"/>
  </svg>
)
const ArrowRight = (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="8" x2="13" y2="8"/><polyline points="9,4 13,8 9,12"/></svg>
)
function ChevronDown() {
  return (
    <svg className="rost-select-chevron" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="4,6 8,10 12,6"/>
    </svg>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function fmtSyncTime(iso) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}
function ResultBadge({ result }) {
  if (result === 'success') return <span className="rost-status rost-status--sync"><span className="rost-status-dot"/>Success</span>
  if (result === 'warning') return <span className="rost-status rost-status--unsorted"><span className="rost-status-dot"/>Warning</span>
  return <span className="rost-status rost-status--removed"><span className="rost-status-dot"/>Failed</span>
}

// ─── Connection (small passive strip) ─────────────────────────────────────
function ConnectionSection() {
  return (
    <section className="rost-conn-strip">
      <div className="rost-conn-strip-logo">C</div>
      <div className="rost-conn-strip-id">
        <div className="rost-conn-strip-name">{SOURCE.name}</div>
        <span className="rost-conn-live">
          <span className="rost-conn-live-dot" />
          Connected · syncing daily
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

// ─── Tonight's incoming sync — GitHub-style diff stats ───────────────────
// Symbols double as a non-color signal for ADA (info isn't conveyed by hue alone).
const PlusGlyph  = () => <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="6" y1="2.5" x2="6" y2="9.5"/><line x1="2.5" y1="6" x2="9.5" y2="6"/></svg>
const MinusGlyph = () => <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="2.5" y1="6" x2="9.5" y2="6"/></svg>
const TildeGlyph = () => <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7c1-1.6 2.2-1.6 3.2 0s2.2 1.6 3.2 0"/><path d="M9 7c.4-.6.8-.8 1-.8"/></svg>
const WarnGlyph  = () => <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 1.5l6.5 11H1.5z"/><line x1="8" y1="6" x2="8" y2="9"/><circle cx="8" cy="10.8" r="0.5" fill="currentColor"/></svg>

function DiffRow({ label, total, added, removed, changed, warning, onClick }) {
  const noChanges = !added && !removed && !changed
  return (
    <button type="button" className={`rost-diff-row${warning ? ' rost-diff-row--warn' : ''}`} onClick={onClick}>
      <div className="rost-diff-row-main">
        <span className="rost-diff-row-label">{label}</span>
        <div className="rost-diff-row-chips">
          {added > 0   && <span className="rost-delta-pill rost-delta-pill--add" aria-label={`${added} added`}><PlusGlyph /><b>{added}</b> added</span>}
          {removed > 0 && <span className="rost-delta-pill rost-delta-pill--del" aria-label={`${removed} removed`}><MinusGlyph /><b>{removed}</b> removed</span>}
          {changed > 0 && <span className="rost-delta-pill rost-delta-pill--mod" aria-label={`${changed} changed`}><TildeGlyph /><b>{changed}</b> changed</span>}
          {noChanges && <span className="rost-delta-pill rost-delta-pill--zero">No changes</span>}
          {warning && (
            <span className="rost-delta-pill rost-delta-pill--warn" aria-label={`${warning.count} ${warning.text}`}>
              <WarnGlyph /><b>{warning.count}</b> {warning.text}
            </span>
          )}
        </div>
      </div>

      <span className="rost-diff-row-total">{total}</span>

      <span className="rost-diff-row-chevron" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6,4 10,8 6,12"/>
        </svg>
      </span>
    </button>
  )
}

function DiffBanner({ onOpenPreview }) {
  const staffMissing = STAFF.filter(s => s.syncStatus === 'not-synced').length
  const previewAction = (
    <button className="rost-btn rost-btn--primary" onClick={() => onOpenPreview('classes')}>
      <span>Preview tonight's sync</span>
      {ArrowRight}
    </button>
  )
  return (
    <ChartCard
      title="Tonight's incoming sync"
      subtitle={`Tomorrow at 2:00 AM · from ${SOURCE.name}`}
      icon={IcSync}
      accent={ACCENT}
      action={previewAction}
      bodyPad="flush"
    >
      <div className="rost-diff-rows">
        <DiffRow
          label="Classes"
          total={TOTALS.classesIncoming.toLocaleString()}
          added={DIFF.classes.new}
          removed={DIFF.classes.removed}
          changed={DIFF.classes.changed}
          onClick={() => onOpenPreview('classes')}
        />
        <DiffRow
          label="Students"
          total={TOTALS.students.toLocaleString()}
          added={DIFF.students.new}
          removed={DIFF.students.removed}
          changed={DIFF.students.changed}
          onClick={() => onOpenPreview('students')}
        />
        <DiffRow
          label="Staff"
          total={TOTALS.staff.toLocaleString()}
          added={DIFF.staff.new}
          removed={DIFF.staff.removed}
          changed={DIFF.staff.changed}
          warning={staffMissing > 0 ? { count: staffMissing, text: 'not in sync' } : null}
          onClick={() => onOpenPreview('staff')}
        />
      </div>
    </ChartCard>
  )
}

// ─── Subject Rules ────────────────────────────────────────────────────────
function SubjectRulesSection({ rules, rulesDirty, onSetSubjectAllowed, onSaveRules, onCancelRules }) {
  const [editing, setEditing] = useState(false)

  // View mode: just the allowed subjects, sorted by class count
  const allowedList = useMemo(() =>
    [...rules.allowed].sort((a, b) => (SUBJECT_COUNTS[b] || 0) - (SUBJECT_COUNTS[a] || 0)),
    [rules.allowed]
  )

  // Edit mode: every known subject, sorted by class count
  const fullList = useMemo(() =>
    Object.keys(SUBJECT_COUNTS)
      .map(s => ({ subject: s, count: SUBJECT_COUNTS[s] || 0, allowed: rules.allowed.includes(s), isNew: NEW_SUBJECTS.includes(s) }))
      .sort((a, b) => b.count - a.count),
    [rules]
  )

  function handleSave()   { onSaveRules(); setEditing(false) }
  function handleCancel() { onCancelRules(); setEditing(false) }

  // Header action: in view mode show "Edit subjects"; in edit mode show nothing
  // (Save/Cancel live in the footer).
  const headerAction = !editing ? (
    <button className="rost-btn rost-btn--ghost" onClick={() => setEditing(true)}>
      <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5 }}><path d="M11.5 2.5l2 2L6 12l-2.5.5L4 10z"/></svg>
      Edit subjects
    </button>
  ) : null

  const footer = editing ? (
    <div className="rost-card-footer-bar">
      <span className="rost-card-footer-note">{rulesDirty ? 'You have unsaved changes' : 'No changes yet'}</span>
      <div className="rost-card-footer-actions">
        <button className="rost-btn rost-btn--ghost" onClick={handleCancel}>Cancel</button>
        <button className="rost-btn rost-btn--primary" onClick={handleSave} disabled={!rulesDirty}>Save rules</button>
      </div>
    </div>
  ) : null

  return (
    <ChartCard
      title="Subject Rules"
      subtitle="Which classroom subjects flow into your reports and leaderboards."
      icon={IcRules}
      accent={ACCENT}
      action={headerAction}
      footer={footer}
      bodyPad={editing ? 'flush' : 'padded'}
    >
      {!editing ? (
        // ── View mode — only what's syncing ──────────────────────────────
        <div className="rost-rules-view">
          <div className="rost-tag-row">
            {allowedList.map(s => (
              <span key={s} className="rost-subject-tag">
                {s}
                <span className="rost-subject-tag-count">{SUBJECT_COUNTS[s]}</span>
              </span>
            ))}
          </div>
        </div>
      ) : (
        // ── Edit mode — full list as plain rows, toggle on the far right ──
        <div className="rost-rules-list">
          {fullList.map(({ subject, count, allowed, isNew }) => (
            <div key={subject} className="rost-rule-row">
              <div className="rost-rule-row-label">
                <span className="rost-rule-row-name">
                  {subject}
                  {isNew && <span className="rost-new-badge">New</span>}
                </span>
                <span className="rost-rule-row-count">{count} {count === 1 ? 'class' : 'classes'}</span>
              </div>
              <label className="rost-rule-row-control">
                <span className={`rost-rule-status${allowed ? ' rost-rule-status--on' : ''}`}>{allowed ? 'Syncing' : 'Not syncing'}</span>
                <Toggle checked={allowed} onChange={v => onSetSubjectAllowed(subject, v)} />
              </label>
            </div>
          ))}
        </div>
      )}
    </ChartCard>
  )
}

// ─── Schedule (pause / restart) ───────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

const SCHEDULE_DEFAULT = { pauseMonth: 'May', pauseDay: 23, restartMonth: 'August', restartDay: 1 }

function ScheduleSection() {
  const [dates, setDates] = useState(SCHEDULE_DEFAULT)
  const [saved, setSaved] = useState(SCHEDULE_DEFAULT)
  const dirty = JSON.stringify(dates) !== JSON.stringify(saved)

  const set = (k) => (v) => setDates(d => ({ ...d, [k]: v }))

  const footer = (
    <div className="rost-card-footer-bar">
      <span className="rost-card-footer-note">{dirty ? 'You have unsaved changes' : 'No changes yet'}</span>
      <div className="rost-card-footer-actions">
        <button className="rost-btn rost-btn--ghost" onClick={() => setDates(saved)} disabled={!dirty}>Cancel</button>
        <button className="rost-btn rost-btn--primary" onClick={() => setSaved(dates)} disabled={!dirty}>Save</button>
      </div>
    </div>
  )

  return (
    <ChartCard
      title="Summer rostering sync pause"
      subtitle="Freeze your roster over the summer so end-of-year data is preserved."
      icon={IcCalendar}
      accent={ACCENT}
      footer={footer}
      bodyPad="padded"
    >
      <div className="rost-info-banner">
        <div className="rost-info-icon">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11"/><circle cx="8" cy="5" r="0.6" fill="currentColor"/>
          </svg>
        </div>
        <div>
          Make sure rostering data is shared right up until the pause date and again on the restart date — that way no logs get lost.
        </div>
      </div>

      <div className="rost-field">
        <label className="rost-field-label">Pause date</label>
        <div className="rost-field-help">Typically your last day of school for students.</div>
        <div className="rost-field-row">
          <div className="rost-select-wrap rost-select-wrap--grow">
            <select value={dates.pauseMonth} onChange={e => set('pauseMonth')(e.target.value)} className="rost-select">
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronDown />
          </div>
          <div className="rost-select-wrap rost-select-wrap--day">
            <select value={dates.pauseDay} onChange={e => set('pauseDay')(+e.target.value)} className="rost-select">
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      <div className="rost-field" style={{ marginTop: 16 }}>
        <label className="rost-field-label">Restart date</label>
        <div className="rost-field-help">Typically 3–5 days before students return, <strong>after</strong> your summer reading challenge ends.</div>
        <div className="rost-field-row">
          <div className="rost-select-wrap rost-select-wrap--grow">
            <select value={dates.restartMonth} onChange={e => set('restartMonth')(e.target.value)} className="rost-select">
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronDown />
          </div>
          <div className="rost-select-wrap rost-select-wrap--day">
            <select value={dates.restartDay} onChange={e => set('restartDay')(+e.target.value)} className="rost-select">
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      <div className="rost-warn-banner" style={{ marginTop: 16 }}>
        <div style={{ flexShrink: 0 }}>
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="6.5"/><path d="M8 4v5"/><circle cx="8" cy="11.5" r="0.6" fill="currentColor"/>
          </svg>
        </div>
        <div>
          Sync will be paused and no sync jobs will run from <strong>{dates.pauseMonth} {dates.pauseDay + 1}</strong> through <strong>{dates.restartMonth} {dates.restartDay - 1 || 31}</strong>.
        </div>
      </div>
    </ChartCard>
  )
}

// ─── Recent syncs (activity timeline) ─────────────────────────────────────
function relDate(iso) {
  const d = new Date(iso)
  const now = new Date('2026-05-26T10:00:00-04:00')
  const days = Math.round((now.setHours(0,0,0,0) - new Date(iso).setHours(0,0,0,0)) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
function relTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// One inline "+N −M entity" summary segment
function ChangeSummary({ label, change }) {
  const n = change?.new || 0, r = change?.removed || 0
  if (n === 0 && r === 0) return null
  return (
    <span className="rost-tl-change">
      {n > 0 && <span className="rost-gh-add">+{n}</span>}
      {r > 0 && <span className="rost-gh-del">−{r}</span>}
      {' '}{label}
    </span>
  )
}

function SyncLogSection() {
  return (
    <ChartCard
      title="Recent syncs"
      subtitle={`Activity from each sync run from ${SOURCE.name}`}
      icon={IcHistory}
      accent={ACCENT}
      bodyPad="padded"
    >
      <ol className="rost-timeline">
        {SYNC_LOG.map((entry, i) => {
          const c = entry.changes
          const hasChanges = c.classes.new || c.classes.removed || c.students.new || c.students.removed || c.staff.new || c.staff.removed
          return (
            <li key={i} className={`rost-tl-item rost-tl-item--${entry.result}`}>
              <span className="rost-tl-dot" />
              <div className="rost-tl-body">
                <div className="rost-tl-head">
                  <span className="rost-tl-date">{relDate(entry.at)}</span>
                  <span className="rost-tl-time">{relTime(entry.at)}</span>
                  <ResultBadge result={entry.result} />
                </div>
                <div className="rost-tl-changes">
                  {hasChanges ? (
                    <>
                      <ChangeSummary label="classes" change={c.classes} />
                      <ChangeSummary label="students" change={c.students} />
                      <ChangeSummary label="staff" change={c.staff} />
                    </>
                  ) : (
                    <span className="rost-tl-nochange">No changes</span>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </ChartCard>
  )
}

// ─── Page composition ─────────────────────────────────────────────────────
export function SyncSettingsPage({ rules, rulesDirty, onSetSubjectAllowed, onSaveRules, onCancelRules, onOpenPreview }) {
  return (
    <>
      <ConnectionSection />
      <DiffBanner onOpenPreview={onOpenPreview} />
      <SubjectRulesSection
        rules={rules}
        rulesDirty={rulesDirty}
        onSetSubjectAllowed={onSetSubjectAllowed}
        onSaveRules={onSaveRules}
        onCancelRules={onCancelRules}
      />
      <ScheduleSection />
      <SyncLogSection />
    </>
  )
}
