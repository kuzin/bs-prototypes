import { useState, useEffect, useRef, cloneElement } from 'react'
import './BeanstackProfile.css'
import '../ris/components/SchoolDashboard.css'
import { C, LABEL, Ic } from '@components/ui'
import { Card, SectionHeading, CoverImage } from './components/kit'
import { GoalMeter } from '@components/ReaderApp/ReaderApp'
import '@components/ReaderApp/ReaderApp.css'
import {
  DonutChart,
  SplitDonutChart,
  ReadingHeatmap,
  GoalTracker,
  INTRINSIC_COLOR,
  EXTRINSIC_COLOR,
} from './components/widgets'
import { Button } from '@components/Button/Button'
import {
  Select,
  Checkbox,
  Field,
  Input,
  Textarea,
  DateInput,
  NumberInput,
} from '@components/Form/Form'
import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import '@components/Form/Form.css'
import { Avatar } from '@components/Avatar/Avatar'
import { IconButton, EmptyState, Banner, Tooltip } from '@components/Primitives/Primitives'
import { Pill } from '@components/Pill/Pill'
import { BarList } from '@components/BarList/BarList'
import { ChartCard } from '@components/Cards/Cards'
import { Table } from '@components/Table/Table'
import '@components/Table/Table.css'
import { BackBar } from '@components/BackBar/BackBar'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { DailyReadingTracker } from '@components/DailyReadingTracker/DailyReadingTracker'
import { Sidebar } from '@components/Sidebar/Sidebar'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import { RMI_ICONS } from '@components/RmiIcons/RmiIcons'
import { TrendChip } from '@components/TrendChip/TrendChip'
import { ToastStack, useToasts } from '@components/Toast/Toast'
import { CompleteToggle } from '@components/CompleteToggle/CompleteToggle'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { PlumpyIcon, hasPlumpy } from '@components/PlumpyIcon/PlumpyIcon'
import { BsIcon, FlagIcon } from '@components/BsIcons/BsIcons'
import { Icon } from '@components/Icon/Icon'
import { PartnerMark, PARTNER_BRANDS } from '@components/PartnerBrand/PartnerBrand'
import { Flyout } from '@components/Flyout/Flyout'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { Tabs } from '@components/Tabs/Tabs'
import { Toggle } from '@components/Toggle/Toggle'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { Hero } from '@components/Hero/Hero'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { ChartLegend } from '@components/charts/charts'
import { SessionModal } from '../sfr/components/SessionModal'
import { TALK_KINDS, POS_FLAG_DESCS } from '../btwb/data'

// ─── Heatmap data generator ───────────────────────────────────────────────────
// Monthly density modifiers per student profile (index 0 = Jan, 11 = Dec)
const MONTHLY_MODS = {
  consistent: [1.0, 1.0, 0.95, 0.95, 0.9, 0.7, 0.55, 0.6, 1.0, 1.0, 1.0, 1.05],
  peaky: [0.7, 0.8, 1.1, 0.75, 0.85, 0.4, 0.3, 0.45, 1.1, 1.2, 0.9, 0.6],
  sporadic: [0.5, 0.3, 0.7, 0.2, 0.6, 0.15, 0.1, 0.2, 0.45, 0.55, 0.35, 0.25],
}

function makeHeatmapData(density, profile = 'consistent') {
  const map = {}
  const today = new Date('2025-05-15')
  const start = new Date('2023-09-01')
  const mods = MONTHLY_MODS[profile]
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10)
    const dow = d.getDay()
    const mon = d.getMonth()
    // two independent hash values for richer variation
    const n = (d.getDate() * 13 + d.getMonth() * 97 + 7) % 100
    const n2 = (d.getDate() * 31 + d.getMonth() * 53 + d.getFullYear() * 3 + 41) % 100
    const weekend = dow === 0 || dow === 6
    const monthMod = mods[mon] ?? 1.0
    const adjDensity = Math.min(0.97, density * monthMod)
    const threshold = Math.min(Math.round((1 - adjDensity) * 100 * (weekend ? 1.3 : 1)), 99)
    map[key] = n < threshold ? 0 : 10 + (n2 % 45)
  }
  return map
}

// ─── Benny's emphasis ─────────────────────────────────────────────────────────
// Benny's summaries are a paragraph of prose, and the figures a teacher is
// scanning for get lost in it. The copy carries `**…**` around the load-bearing
// numbers and phrases; this turns them into <strong>. Strings without markers
// render exactly as before, so nothing has to be marked up to work.
function emphasize(text) {
  if (typeof text !== 'string' || !text.includes('**')) return text
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    // Odd indices are the captured groups — the emphasised runs.
    i % 2 ? <strong key={i}>{part}</strong> : part,
  )
}

// ─── Show more ────────────────────────────────────────────────────────────────
// The review asked for several blocks to be "cut or hidden behind a show more".
// Tucked rather than cut: the detail still belongs to the page it's on, it just
// isn't what you came to the page for. One component, so every disclosure on
// the profile opens the same way.
function ShowMore({ label, inCard = false, children }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && children}
      <button
        type="button"
        className={`bp-showmore${inCard ? ' bp-showmore--incard' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? `Hide ${label}` : `Show ${label}`}
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} stroke={2.4} />
      </button>
    </>
  )
}

// ─── Action footer ────────────────────────────────────────────────────────────
function ActionFooter({ actions }) {
  return (
    <div className="bp-action-footer">
      <SectionHeading>Suggested actions</SectionHeading>
      {actions.map((action, i) => (
        <div key={i} className="bp-action-footer-item">
          <div className="bp-action-footer-title">{action.title}</div>
          <div className="bp-action-footer-body">{action.body}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Dropdown menu ────────────────────────────────────────────────────────────
function DropdownMenu({ items, onClose }) {
  return (
    <div className="flyout-menu">
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} className="flyout-menu-sep" />
        ) : (
          <button
            key={i}
            type="button"
            className={`flyout-menu-item${item.danger ? ' flyout-menu-item--danger' : ''}`}
            onClick={() => {
              item.onSelect?.()
              onClose()
            }}
            style={item.color && !item.danger ? { color: item.color } : undefined}
          >
            {item.icon && <span className="flyout-menu-icon">{item.icon}</span>}
            {item.label}
          </button>
        ),
      )}
    </div>
  )
}

// ─── Reusable student action buttons (3-dots + Log + Close) ──────────────────
// The product's header carries an Actions menu plus three log buttons. The
// flyout is far narrower than a full page, so the two secondary log actions
// fold into the primary button's own menu rather than sitting beside it.
const ACTIONS_ITEMS = [
  { label: 'Add a Review', action: 'review' },
  { label: 'Edit Information', action: 'edit' },
  { label: 'Add Notes', action: 'notes' },
  { label: 'Advisory Settings', action: 'advisory' },
  { label: 'Recalculate Streaks' },
  { label: 'Transfer Reader', action: 'transfer' },
  { divider: true },
  { label: 'Delete Reader', danger: true },
]

// Verify and Freeze are the two Reading Integrity actions on a student, and
// unlike the rest of this menu they're stateful: each one toggles, and the
// header says which state the student is in. Verified students log past the
// site's limits; frozen students can't log for themselves for ten days.
const INTEGRITY_ITEMS = [
  {
    key: 'verified',
    label: 'Verify Student',
    undo: 'Unverify Student',
    icon: <Icon name="verified-badge" size={17} color="#2563EB" />,
  },
  {
    key: 'frozen',
    label: 'Freeze Access',
    undo: 'Unfreeze Access',
    icon: <Icon name="circle-minus" size={17} stroke={2.2} color="#E85648" />,
  },
]
const LOG_ITEMS = [{ label: 'Log Reading' }, { label: 'Log Activities' }]

// ─── Action modals ────────────────────────────────────────────────────────────
// The five Actions entries that have a real screen behind them. Each is a form
// the demo can open and fill; Save just closes — nothing is persisted, the same
// stance as the rest of the prototype's affordances.
const YES_NO = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
]

function ActionModal({
  open,
  onClose,
  title,
  children,
  save = 'Save',
  saveDisabled,
  secondary,
  onSave,
}) {
  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel={title} closeBadge>
      {({ close }) => (
        <div className="bp-act-modal">
          <ModalClose onClick={close} />
          <div className="bp-act-modal-head">
            <span className="bp-act-modal-title">{title}</span>
          </div>
          <div className="bp-form-body">{children}</div>
          <div className="bp-form-foot">
            {secondary && (
              <Button variant="secondary" onClick={close}>
                {secondary}
              </Button>
            )}
            <Button
              onClick={() => {
                onSave?.()
                close()
              }}
              disabled={saveDisabled}
            >
              {save}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

function AddReviewModal({ open, onClose }) {
  const [form, setForm] = useState({ title: '', author: '', date: '', text: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title="Add a Review"
      saveDisabled={!form.title.trim() || !form.date || !form.text.trim()}
    >
      <SectionHeading>Review details</SectionHeading>
      <Field label="Book title" required>
        <Input value={form.title} onChange={set('title')} />
      </Field>
      <Field label="Book author">
        <Input value={form.author} onChange={set('author')} />
      </Field>
      <Field label="Date" required>
        <DateInput value={form.date} onChange={set('date')} />
      </Field>
      <SectionHeading>Review</SectionHeading>
      <Field label="Written review" required>
        <Textarea rows={7} value={form.text} onChange={set('text')} />
      </Field>
    </ActionModal>
  )
}

function EditInfoModal({ open, onClose, student }) {
  const [first, last] = student.name.split(' ')
  const [form, setForm] = useState({ first, last, grade: student.grade, emails: true })
  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title={`Edit ${first}`}
      secondary="Remind me later"
      saveDisabled={!form.first.trim()}
    >
      <Banner level="warning">
        This reader&apos;s information was last updated on 01/04/2026 and may be out of date. You
        should update their information before proceeding.
      </Banner>
      <Field label="Name" required>
        <div className="bp-form-row">
          <Input
            value={form.first}
            aria-label="First name"
            onChange={(e) => setForm((f) => ({ ...f, first: e.target.value }))}
          />
          <Input
            value={form.last}
            aria-label="Last name"
            onChange={(e) => setForm((f) => ({ ...f, last: e.target.value }))}
          />
        </div>
      </Field>
      <Field label="Grade">
        <Select
          value={form.grade}
          onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
        >
          {['4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade'].map((g) => (
            <option key={g}>{g}</option>
          ))}
        </Select>
      </Field>
      <Field
        label="Does this reader want to receive email notifications?"
        help="If you disable email notifications, the account creator will not receive email notifications about rewards for this reader."
      >
        <Toggle checked={form.emails} onChange={(v) => setForm((f) => ({ ...f, emails: v }))}>
          {form.emails ? 'Enabled' : 'Disabled'}
        </Toggle>
      </Field>
    </ActionModal>
  )
}

function AddNotesModal({ open, onClose }) {
  const [notes, setNotes] = useState('')
  return (
    <ActionModal open={open} onClose={onClose} title="Add Notes" saveDisabled={!notes.trim()}>
      <Field label="Notes" required>
        <Textarea
          rows={6}
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>
    </ActionModal>
  )
}

function AdvisoryModal({ open, onClose }) {
  const [recs, setRecs] = useState('no')
  const [emails, setEmails] = useState('yes')
  return (
    <ActionModal open={open} onClose={onClose} title="Advisory Settings">
      <Field label="Does this reader want to receive personalized recommendations?">
        <Tabs variant="pill" size="sm" active={recs} onChange={setRecs} items={YES_NO} />
      </Field>
      <Field
        label="Does this reader want to receive email notifications?"
        help="If you disable email notifications, the account creator will not receive email notifications about rewards for this reader."
      >
        <Tabs variant="pill" size="sm" active={emails} onChange={setEmails} items={YES_NO} />
      </Field>
    </ActionModal>
  )
}

function TransferModal({ open, onClose }) {
  const [to, setTo] = useState('')
  return (
    <ActionModal open={open} onClose={onClose} title="Transfer Reader" saveDisabled={!to.trim()}>
      <Field label="Who would you like to transfer this reader to?">
        <Input
          placeholder="Enter email or phone #…"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </Field>
    </ActionModal>
  )
}

function StudentActions({ onClose, student, status = [], onToggleStatus }) {
  const [action, setAction] = useState(null)
  const close = () => setAction(null)
  const items = [
    ...ACTIONS_ITEMS.map((it) =>
      it.action ? { ...it, onSelect: () => setAction(it.action) } : it,
    ),
    { divider: true },
    ...INTEGRITY_ITEMS.map((it) => ({
      label: status.includes(it.key) ? it.undo : it.label,
      icon: it.icon,
      onSelect: () => onToggleStatus?.(it.key),
    })),
  ]

  return (
    <div className="bp-student-actions">
      <Flyout
        placement="bottom-end"
        trigger={({ toggle }) => (
          <Button
            variant="secondary"
            iconRight={
              <Icon
                name="chevron-down"
                size={14}
                stroke={2.4}
                className="bp-btn-caret"
                style={{ flexShrink: 0 }}
              />
            }
            onClick={toggle}
            aria-label="Actions"
          >
            <span className="bp-btn-label">Actions</span>
          </Button>
        )}
      >
        {({ close }) => <DropdownMenu items={items} onClose={close} />}
      </Flyout>
      <Flyout
        placement="bottom-end"
        trigger={({ toggle }) => (
          <Button
            variant="primary"
            iconRight={
              <Icon
                name="chevron-down"
                size={14}
                stroke={2.4}
                className="bp-btn-caret"
                style={{ flexShrink: 0 }}
              />
            }
            onClick={toggle}
          >
            Log
          </Button>
        )}
      >
        {({ close }) => <DropdownMenu items={LOG_ITEMS} onClose={close} />}
      </Flyout>
      {onClose && (
        <button className="bp-header-close" onClick={onClose} aria-label="Close profile">
          <Icon name="arrow-right" size={15} />
        </button>
      )}

      <AddReviewModal open={action === 'review'} onClose={close} />
      {student && <EditInfoModal open={action === 'edit'} onClose={close} student={student} />}
      <AddNotesModal open={action === 'notes'} onClose={close} />
      <AdvisoryModal open={action === 'advisory'} onClose={close} />
      <TransferModal open={action === 'transfer'} onClose={close} />
    </div>
  )
}

// ─── Persistent student header ────────────────────────────────────────────────
// ─── Header status flags ──────────────────────────────────────────────────────
// Standing facts about the reader, as against the numbers below them: who they
// are connected to, and what has been done to their account. They belong in the
// header because each one changes how you read the rest of the page — imported
// sessions explain minutes nobody logged by hand, a tandem link explains
// reading done somewhere else entirely, and a banned reader's totals are
// already excluded from the leaderboard you'd otherwise compare them against.
//
// A mark, not a sentence: the label is short and the Tooltip carries the
// meaning, so a reader with four of these still has a legible name.
const STATUS_FLAGS = {
  comicsplus: {
    label: 'Comics Plus',
    tone: 'partner',
    tip: 'Connected to Comics Plus — reading done in the app imports on its own',
  },
  tandem: {
    label: 'Tandem',
    icon: 'link',
    tone: 'info',
    tip: 'Tandem account — linked to a %s profile, and reading counts on both',
  },
  // `Profile.offline_readers` — a reader with no login of their own (the app
  // spots them by a `qa_` username). Staff log for them, so their totals are
  // real but nothing on the log was self-reported.
  offline: {
    label: 'Offline',
    icon: 'user-off',
    tone: 'neutral',
    tip: 'Offline reader — no login of their own, so staff log their reading for them',
  },
  // The two school-only states, and the product's own two words for them. Both
  // come from Actions on this header, and both are reversible from the same
  // menu entry — see help.beanstack.com "How to verify or freeze a student".
  verified: {
    label: 'Verified',
    icon: 'verified-badge',
    tone: 'verified',
    tip: 'Verified student — can log past the site log and daily limits, and other readers see the badge on leaderboards',
  },
  frozen: {
    label: 'Frozen',
    icon: 'circle-minus',
    tone: 'bad',
    tip: 'Access frozen for 10 days — they cannot log reading themselves, though staff still can. Not shown to other readers.',
  },
}

function StatusFlags({ flags = [], tandemWith }) {
  if (!flags.length) return null
  return (
    <>
      {flags.map((key) => {
        const f = STATUS_FLAGS[key]
        if (!f) return null
        return (
          <Tooltip key={key} content={f.tip.replace('%s', tandemWith)}>
            <span className={`bp-status bp-status--${f.tone}`}>
              {f.icon && <Icon name={f.icon} size={13} stroke={2.1} />}
              {f.label}
            </span>
          </Tooltip>
        )
      })}
    </>
  )
}

function StudentHeader({ student, onClose }) {
  // Verified / frozen live here rather than in the fixture because Actions can
  // change them — the chip beside the name is the same fact the menu toggles.
  const [status, setStatus] = useState(student.status ?? [])
  useEffect(() => setStatus(student.status ?? []), [student])
  const toggle = (key) =>
    setStatus((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]))

  return (
    <div className="bp-panel-header">
      <div className="bp-panel-identity">
        {/* Was a per-student hue so stepping the pager visibly changed
    student; now the admin accent, so the whole panel reads as one themed
    surface. `avatarColor` is still on the data if that identity cue is
    wanted back. */}
        <Avatar
          initials={student.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)}
          color="var(--c-accent)"
          size="lg"
        />
        <div>
          <div className="bp-panel-name">{student.name}</div>
          {/* Status only. The grade is on every roster row and in the class
              header you came from — repeating it under the name spent a line
              on something already established. */}
          <div className="bp-panel-meta">
            <StatusFlags flags={status} tandemWith="library" />
          </div>
        </div>
      </div>
      <div className="bp-header-right">
        <StudentActions
          onClose={onClose}
          student={student}
          status={status}
          onToggleStatus={toggle}
        />
      </div>
    </div>
  )
}

// ─── Left nav ─────────────────────────────────────────────────────────────────
// One accent per destination, used by BOTH the nav's active state and that
// page's Hero — they were drifting apart when each page hardcoded its own.
// The four analysis sections keep the shared `C` palette.
const SECTION_ACCENT = {
  overview: { bg: '#F5F5F5', text: '#707070' },
  motivation: C.motivation,
  integrity: C.integrity,
  habits: C.habits,
  skills: C.skills,
  readinglog: { bg: '#E0F2FE', text: '#0284C7' },
  classes: { bg: '#E7F0FE', text: '#196DD5' },
  challenges: { bg: '#FFECC8', text: '#B45309' },
  rewards: { bg: '#FCE7F3', text: '#9D174D' },
  drawings: { bg: '#EEF2FF', text: '#4F46E5' },
  activities: { bg: '#F1EBFF', text: '#B43DD0' },
  badges: { bg: '#EFFBF9', text: '#0D9488' },
  achievements: { bg: '#FFEDD5', text: '#C2410C' },
  reviews: { bg: '#FFE4E6', text: '#BE123C' },
  points: { bg: '#FEF9C3', text: '#A16207' },
}
const accentFor = (section) => SECTION_ACCENT[section ?? 'overview'] ?? SECTION_ACCENT.overview

// One flat rail — every destination is labelled and styled the same. The old
// split (Overview apart, the four analysis sections in a bracketed subgroup,
// the rest icon-only) made the lower nine look like second-class items you had
// to hover to identify.
const NAV_ITEMS = [
  { icon: 'user', section: null, label: 'Overview' },
  // What the reader actually did comes first, then the challenges that asked
  // for it and what those paid out — the reader's own run through the site.
  { icon: 'reading', section: 'readinglog', label: 'Reading Log' },
  { icon: 'challenges', section: 'challenges', label: 'Challenges' },
  { icon: 'gift', section: 'rewards', label: 'Rewards' },
  { icon: 'ticket', section: 'drawings', label: 'Drawings' },
  // Then the analysis derived from all of it.
  { icon: 'chat', section: 'integrity', label: LABEL.integrity },
  { icon: 'calendar', section: 'habits', label: LABEL.habits },
  { icon: 'fire', section: 'motivation', label: LABEL.motivation },
  { icon: 'book', section: 'skills', label: LABEL.skills },
  // Then everything the reader has collected, and the roster fact last.
  { icon: 'medal', section: 'badges', label: 'Badges' },
  { icon: 'puzzle', section: 'activities', label: 'Activities' },
  { icon: 'star', section: 'reviews', label: 'Book Reviews' },
  { icon: 'points', section: 'points', label: 'Points' },
  { icon: 'classroom', section: 'classes', label: 'Classes' },
]
const ANALYSIS_SECTIONS = new Set(['motivation', 'integrity', 'habits', 'skills'])

// `extraNav` items append to the end of the rail unless one names a `before`
// section, in which case it's spliced in ahead of it — Engagement Signals wants
// its section leading the four analysis pages it's derived from, not filed last
// after Points Summary. One helper, so the rail and the phone stepper below
// can't disagree about the order.
function mergeNav(extraNav = []) {
  const items = [...NAV_ITEMS]
  const appended = []
  for (const item of extraNav) {
    const at = item.before ? items.findIndex((n) => n.section === item.before) : -1
    if (at === -1) appended.push(item)
    else items.splice(at, 0, item)
  }
  return [...items, ...appended]
}

// Every profile-coloured tint (control rail, nav active state, the Log button)
// derives from this one property in CSS via `color-mix`, so a reader needs a
// single authored hex rather than a hand-mixed scale. The Hero icon chips stay
// on `SECTION_ACCENT` — the section you're on still has its own colour.
function LeftNav({ activeSection, onNavigate, pager, extraNav = [] }) {
  return (
    <nav className="bp-nav">
      <div className="bp-nav-items">
        {mergeNav(extraNav).map(({ icon, section, label }) => {
          const active = activeSection === section
          return (
            <div
              key={label}
              className={`bp-nav-item${active ? ' bp-nav-item--active' : ''}`}
              onClick={() => onNavigate(section)}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate(section)}
              role="button"
              tabIndex={0}
              title={label}
              aria-label={label}
            >
              {/* Plumpy is duotone: inactive is currentColor, active is the
                  accent, and both layers tint together — so it needs no
                  hand-dimmed opacity the way a line icon did. */}
              <PlumpyIcon name={icon} size={20} />
              <span className="bp-nav-label">{label}</span>
            </div>
          )
        })}
      </div>
      {pager}
    </nav>
  )
}

// ─── Mobile section nav ───────────────────────────────────────────────────────
// Under 700px the 168px nav rail costs too much of the screen, so it's hidden
// and this bar takes over with the same fourteen destinations as a select. It
// used to carry a second copy of the student pager; the control rail keeps
// that (and close, and copy link) at every width now, so there's one home for
// panel chrome instead of three.
function MobileSectionNav({ activeSection, onNavigate, extraNav = [] }) {
  const items = mergeNav(extraNav)
  const at = Math.max(
    0,
    items.findIndex((n) => (n.section ?? 'overview') === (activeSection ?? 'overview')),
  )

  // Steppers either side of the select. Fourteen sections is a long menu to
  // open every time you want the next one, and on a phone the rail's own pager
  // is gone — so the arrows walk the list in order and the select is there for
  // jumping.
  const step = (d) => {
    const next = items[at + d]
    if (next) onNavigate(next.section ?? null)
  }

  return (
    <div className="bp-mobile-nav">
      <RowAction
        icon="chevron-left"
        label="Previous section"
        tooltip={false}
        disabled={at === 0}
        onClick={() => step(-1)}
      />
      <Select
        size="sm"
        aria-label="Profile section"
        value={activeSection ?? 'overview'}
        onChange={(e) => onNavigate(e.target.value === 'overview' ? null : e.target.value)}
      >
        {items.map(({ section, label }) => (
          <option key={label} value={section ?? 'overview'}>
            {label}
          </option>
        ))}
      </Select>
      <RowAction
        icon="chevron-right"
        label="Next section"
        tooltip={false}
        disabled={at === items.length - 1}
        onClick={() => step(1)}
      />
    </div>
  )
}

// ─── Title row ────────────────────────────────────────────────────────────────
// The Lexile page's "Recent titles" list. (The Overview's "Latest titles" is a
// cover-first grid instead — see `.bp-latest-grid`.)
function TitleRow({ title: t }) {
  const href = `https://openlibrary.org/isbn/${t.isbn}`
  return (
    <div className="bp-title-row">
      <a href={href} target="_blank" rel="noreferrer" className="bp-title-cover-link">
        <CoverImage isbn={t.isbn} title={t.title} author={t.author} />
      </a>
      <div className="bp-title-row-main">
        <div className="bp-title-row-top">
          <div>
            <a href={href} target="_blank" rel="noreferrer" className="bp-title-name-link">
              {t.title}
            </a>
            <div className="bp-title-author">{t.author}</div>
          </div>
          <span className="bp-title-lexile-pill">{t.lexile}L</span>
        </div>
      </div>
    </div>
  )
}

// ─── Overview ─────────────────────────────────────────────────────────────────
const OVERVIEW_RANGES = [
  { id: 'year', label: 'This School Year' },
  { id: 'all', label: 'All Time' },
]

// Tints for the Overview's habit stats. Deliberately outside the four section
// palettes in `C` so these don't read as belonging to one of the sections:
// gold for streaks (matching the gold goal stars), teal for the brand's own
// accent, slate for elapsed time.
const STAT_TINTS = {
  current: { bg: '#FFECC8', text: '#92400E', bar: '#AB720A' },
  longest: { bg: '#DFF4F7', text: '#0B6B78', bar: '#0E9AAB' },
  minutes: { bg: '#EEF2F7', text: '#424242', bar: '#707070' },
}

// ─── Overview stats ───────────────────────────────────────────────────────────
// The Overview's seven figures are described once here, then rendered as a
// single hairline-divided list — labels in one column, figures in another, so
// the whole snapshot scans top to bottom.
// Order comes from the review: logging volume first, then the habit signals,
// then flags, then motivation — what a teacher scans for disengagement, in the
// order they'd scan it. Longest streak and Lexile sit behind "Show more"; they
// answer a question you go looking for rather than one you scan.
//
// `trend` belongs to the range you're viewing — This School Year moves against
// last year — so the chips always compare like with like. All Time carries
// none: there's no period before it.
//
// Every row carries one, including the streaks: "18 days, up 11 on last year"
// is a real answer to whether the habit is building. The motivation row's chip
// is the reader's Motivation Index movement — the top factor is a name, not a
// number, so the trend belongs to the score behind it.
function overviewMetrics(ov) {
  const mo = ov.trend ?? {}
  const days = (n) => (n === 1 ? 'day' : 'days')
  return [
    {
      key: 'minutes',
      section: 'habits',
      icon: 'clock',
      accent: STAT_TINTS.minutes,
      label: 'Total minutes read',
      value: ov.minutes.toLocaleString(),
      unit: 'min',
      trend: { delta: mo.minutesPct, format: (n) => `${n}%` },
    },
    {
      key: 'current',
      section: 'habits',
      icon: 'fire',
      accent: STAT_TINTS.current,
      label: 'Current streak',
      value: ov.currentStreak,
      unit: days(ov.currentStreak),
      trend: { delta: mo.currentStreak, format: (n) => `${n} ${days(n)}` },
    },
    {
      key: 'habits',
      section: 'habits',
      icon: 'calendar',
      accent: C.habits,
      label: 'Daily goals met',
      value: ov.daysRead > 0 ? ov.daysRead : null,
      unit: `of ${ov.daysPossible} days`,
      empty: 'No reading logged',
      trend: { delta: mo.goalDays, format: (n) => `${n} ${days(n)}` },
    },
    {
      key: 'integrity',
      section: 'integrity',
      icon: 'alert',
      accent: C.integrity,
      label: 'Recent flags',
      value: ov.flags,
      unit: ov.flags === 1 ? 'flag' : 'flags',
      trend: { delta: mo.flags, inverse: true },
    },
    {
      key: 'motivation',
      section: 'motivation',
      icon: 'fire',
      accent: C.motivation,
      label: 'Top motivation factor',
      motivators: ov.motivators?.slice(0, 1),
      empty: 'No clear motivator found',
      // No trend: the value here is *which* factor leads, and a category can't
      // go up or down. The index's own movement belongs to the Motivation
      // section, where there's a number for it to describe.
    },
    {
      key: 'longest',
      section: 'habits',
      icon: 'trophy',
      accent: STAT_TINTS.longest,
      label: 'Longest streak',
      value: ov.longestStreak,
      unit: days(ov.longestStreak),
      trend: { delta: mo.longestStreak, format: (n) => `${n} ${days(n)}` },
      more: true,
    },
    {
      key: 'skills',
      section: 'skills',
      icon: 'book',
      accent: C.skills,
      label: 'Average Lexile',
      value: `${ov.lexile}L`,
      trend: { delta: mo.lexile, format: (n) => `${n}L` },
      more: true,
    },
  ]
}

// One row shape for every label-and-figure pair in the profile: tinted icon
// chip, label, then whatever figure the caller passes. With `onOpen` it's a
// button that opens a section (the Overview list); without it the row is a
// static summary sitting inside another card.
export function StatRow({ icon, accent, label, children, onOpen }) {
  const Tag = onOpen ? 'button' : 'div'
  return (
    <Tag
      className={`bp-statrow${onOpen ? '' : ' bp-statrow--static'}`}
      {...(onOpen ? { type: 'button', onClick: onOpen } : {})}
    >
      <span
        className="bp-statrow-icon"
        style={{ background: accent.bg, color: accent.bar || accent.text }}
      >
        {/* Plumpy where the pack has the glyph, a line icon otherwise — same
            fallback `RowAction` uses, so a name that isn't in the pack still
            draws rather than vanishing. Plumpy runs a rung bigger: it's a
            filled duotone shape, so it reads smaller than a stroked icon at
            the same box. */}
        {hasPlumpy(icon) ? <PlumpyIcon name={icon} size={18} /> : <Icon name={icon} size={16} />}
      </span>
      <span className="bp-statrow-label">{label}</span>
      {children}
      {onOpen && (
        <Icon
          name="chevron-right"
          size={18}
          stroke={2.2}
          className="bp-statrow-go"
          aria-hidden="true"
        />
      )}
    </Tag>
  )
}

// Motivator names carry their own RMI glyph; the key differs from the label for
// the one two-word factor.
function MotivatorNames({ names, className }) {
  return (
    <div className={className}>
      {names.map((name) => {
        const iconKey = name === 'Social Connection' ? 'social' : name.toLowerCase()
        return (
          <span key={name} className="bp-mv-name">
            <span className="bp-mv-icon">
              {cloneElement(RMI_ICONS[iconKey], { width: 13, height: 13 })}
            </span>
            {name}
          </span>
        )
      })}
    </div>
  )
}

// The cover shelf scrolls rather than wrapping, so it needs a way to get at the
// titles that are off the end. The arrows page by a viewport's worth and
// disable at each end — and hide entirely when everything already fits, which
// is the common case on a wide screen.
function TitleShelf({ titles, onNavigate }) {
  const ref = useRef(null)
  const [{ left, right }, setEnds] = useState({ left: false, right: false })

  const sync = () => {
    const el = ref.current
    if (!el) return
    // 1px of slack: fractional scroll widths never land exactly on the end.
    setEnds({
      left: el.scrollLeft > 1,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    })
    // Publish the rendered cover height so the pager arrows can centre on the
    // artwork rather than on the whole tile. The covers are fluid (item width
    // x 1.5 via `aspect-ratio`), so there's no fixed number to use in CSS.
    const cover = el.querySelector('[class$="-latest-cover"]')
    if (cover) {
      el.parentElement?.style.setProperty(
        '--shelf-cover-h',
        `${Math.round(cover.getBoundingClientRect().height)}px`,
      )
    }
  }

  useEffect(() => {
    sync()
    const el = ref.current
    if (!el) return undefined
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => ro.disconnect()
  }, [titles])

  const page = (dir) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(el.clientWidth - 40, 120), behavior: 'smooth' })
  }

  const scrollable = left || right

  return (
    <>
      <div className="bp-latest-head">
        <SectionHeading>Latest titles</SectionHeading>
        <button type="button" className="bp-latest-link" onClick={() => onNavigate('readinglog')}>
          Reading Log
          <Icon name="arrow-right" size={14} />
        </button>
      </div>
      {/* The pager sits over the rail it scrolls, not up in the header — the
          header is for what the block is and where it goes. */}
      <div className="bp-latest-body">
        {scrollable && (
          <>
            <button
              type="button"
              className="bp-heatmap-nav-btn bp-latest-arrow bp-latest-arrow--prev"
              onClick={() => page(-1)}
              disabled={!left}
              aria-label="Previous titles"
            >
              <Icon name="chevron-left" size={13} stroke={2.2} />
            </button>
            <button
              type="button"
              className="bp-heatmap-nav-btn bp-latest-arrow bp-latest-arrow--next"
              onClick={() => page(1)}
              disabled={!right}
              aria-label="More titles"
            >
              <Icon name="chevron-right" size={13} stroke={2.2} />
            </button>
          </>
        )}
        <div className="bp-latest-grid" ref={ref} onScroll={sync}>
          {titles
            .slice()
            .reverse()
            .map((t, i) => (
              // Covers are display only — the shelf is a summary, and the
              // Reading Log link in the header is the way through. Cover art
              // only: the title and author under each one turned a scannable
              // shelf into six stacked captions, and the art already says
              // which book it is (`title` carries it for anyone who needs it).
              <div key={i} className="bp-latest-item" title={`${t.title} — ${t.author}`}>
                <div className="bp-latest-cover">
                  <CoverImage isbn={t.isbn} title={t.title} author={t.author} />
                  <span className="bp-latest-lexile">{t.lexile}L</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

function OverviewStats({ metrics, onOpen, range, onRangeChange }) {
  const [showMore, setShowMore] = useState(false)
  const shown = metrics.filter((m) => !m.more || showMore)
  const hidden = metrics.filter((m) => m.more).length

  return (
    <div className="section-card bp-card bp-statlist">
      <div className="bp-statlist-head">
        <SectionHeading>At a glance</SectionHeading>
        <Tabs
          variant="pill"
          size="xs"
          ariaLabel="Overview time range"
          active={range}
          onChange={onRangeChange}
          items={OVERVIEW_RANGES}
        />
      </div>
      {shown.map((m) => (
        <StatRow
          key={m.key}
          icon={m.icon}
          accent={m.accent}
          label={m.label}
          onOpen={() => onOpen(m.section)}
        >
          {m.motivators ? (
            <MotivatorNames names={m.motivators} className="bp-statrow-motivators" />
          ) : m.value == null ? (
            <span className="bp-statrow-empty">{m.empty}</span>
          ) : (
            <span className="bp-statrow-value">
              {m.value}
              {m.unit && <span className="bp-statrow-unit"> {m.unit}</span>}
            </span>
          )}
          {m.trend && <TrendDelta {...m.trend} />}
        </StatRow>
      ))}
      {hidden > 0 && (
        <button
          type="button"
          className="bp-showmore bp-showmore--incard"
          onClick={() => setShowMore((v) => !v)}
        >
          {showMore ? 'Show less' : `Show ${hidden} more`}
          <Icon name={showMore ? 'chevron-up' : 'chevron-down'} size={14} stroke={2.4} />
        </button>
      )}
    </div>
  )
}

function Overview({ student, onNavigate, goal, renderAfterSummary }) {
  const [range, setRange] = useState('year')
  const ov = student.overview[range]
  const metrics = overviewMetrics(ov)

  return (
    <div className="bp-content">
      <Hero
        variant="page"
        icon={<PlumpyIcon name="user" size={22} />}
        title="Overview"
        accent={SECTION_ACCENT.overview.text}
        accentBg={SECTION_ACCENT.overview.bg}
      />
      {/* Benny says — the summary leads the page */}
      <Card>
        <SectionHeading>Benny says...</SectionHeading>
        <BennyBubble>{emphasize(student.bennySummary)}</BennyBubble>
      </Card>

      {/* An optional slot under the summary, for a prototype that adds a card
          of its own near the top of the Overview (Engagement Signals puts the
          reader's signal here). It's handed the student and the navigator so it
          can follow the pager and link into its own section. Left off, the
          Overview is exactly as it was. */}
      {renderAfterSummary?.(student, onNavigate)}

      {/* Overview figures — every one is scoped to the selected range */}
      <OverviewStats metrics={metrics} onOpen={onNavigate} range={range} onRangeChange={setRange} />

      {/* This week against the daily goal. It was behind a toggle on the Goals
          page; "did they read this week" is a scanning question, so it belongs
          on the page you scan. */}
      <Card>
        <div className="bp-latest-head">
          <SectionHeading>Daily Goals</SectionHeading>
          <button type="button" className="bp-latest-link" onClick={() => onNavigate('habits')}>
            Goals and Streaks
            <Icon name="arrow-right" size={14} />
          </button>
        </div>
        <WeekTracker sec={student.sections.habits} goalMinutes={goal} />
      </Card>

      {/* Latest titles — covers first, so the shelf reads at a glance */}
      <Card>
        <TitleShelf titles={student.sections.skills.titles} onNavigate={onNavigate} />
      </Card>

      {/* Recommended Actions */}
      <Card flush>
        <div className="bp-actions-title">Recommended actions</div>
        {/* Three at most — a longer list stops reading as a shortlist. */}
        {student.recommendedActions.slice(0, 3).map((action, i) => (
          <div key={i} className="bp-action-item">
            <div className="bp-action-body">
              <div className="bp-action-title">{action.title}</div>
              <div className="bp-action-text">{action.body}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Section detail wrapper ───────────────────────────────────────────────────
// ─── Week tracker ─────────────────────────────────────────────────────────────
// The week's days against the daily goal, with its own week stepper. It lives
// on the Overview — "did they read this week" is a scanning question, and it
// was buried behind a "show this week's tracker" toggle on the Goals page.
function WeekTracker({ sec, goalMinutes }) {
  const [weekIdx, setWeekIdx] = useState(0)
  const week = sec.weeks[weekIdx]

  return (
    <>
      <div className="bp-goal-week-nav">
        <button
          className="bp-heatmap-nav-btn"
          onClick={() => setWeekIdx((i) => Math.min(i + 1, sec.weeks.length - 1))}
          disabled={weekIdx === sec.weeks.length - 1}
          aria-label="Previous week"
        >
          <Icon name="chevron-left" size={11} />
        </button>
        <span className="bp-goal-week-label">
          {week.label}
          {week.current ? ' (This Week)' : ''}
        </span>
        <button
          className="bp-heatmap-nav-btn"
          onClick={() => setWeekIdx((i) => Math.max(i - 1, 0))}
          disabled={weekIdx === 0}
          aria-label="Next week"
        >
          <Icon name="chevron-right" size={11} />
        </button>
      </div>
      <GoalTracker week={week} goalMinutes={goalMinutes} />
    </>
  )
}

// ─── Edit goal ────────────────────────────────────────────────────────────────
// The one editable thing in this prototype. It was inert twice before, which
// made the Goals page read as a mock of itself; now Save actually moves the
// number, and every ring, tracker and "of N days" figure that reads the goal
// moves with it. Nothing is persisted past a reload — the same stance as the
// rest of the demo's forms.
const GOAL_PRESETS = [10, 15, 20, 30, 45, 60]

function EditGoalModal({ open, onClose, goal, onSave }) {
  const [minutes, setMinutes] = useState(goal)

  // Reopening after a cancel should show the goal as it stands, not the number
  // that was abandoned.
  useEffect(() => {
    if (open) setMinutes(goal)
  }, [open, goal])

  const value = Number(minutes)
  const valid = Number.isFinite(value) && value >= 1 && value <= 240

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title="Edit reading goal"
      save="Save goal"
      saveDisabled={!valid}
      secondary="Cancel"
      onSave={() => onSave(value)}
    >
      <Field label="Daily goal" hint="Minutes a day, between 1 and 240.">
        <Input
          type="number"
          min={1}
          max={240}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
      </Field>
      {/* The common goals, so the usual case is one click rather than typing. */}
      <div className="bp-goal-presets">
        {GOAL_PRESETS.map((n) => (
          <button
            key={n}
            type="button"
            className={`bp-goal-preset${value === n ? ' bp-goal-preset--on' : ''}`}
            onClick={() => setMinutes(n)}
          >
            {n} min
          </button>
        ))}
      </div>
    </ActionModal>
  )
}

function SectionDetail({ student, sectionKey, goal, onEditGoal }) {
  const sec = student.sections[sectionKey]
  const c = C[sectionKey]
  const firstName = student.name.split(' ')[0]
  return (
    <div className="bp-content">
      {/* `.text` is the palette's on-tint tone (what the nav and every other
          page's Hero use); `.bar` is the chart-stroke tone, too light here.
          Editing the goal is a page action, so it sits in the header's top
          right with Reading Log's "Print log" rather than inside a card. */}
      <Hero
        variant="page"
        icon={<PlumpyIcon name={c.plumpy} size={22} />}
        title={LABEL[sectionKey]}
        accent={c.text}
        accentBg={c.bg}
        action={
          sectionKey === 'habits' ? (
            <Button variant="secondary" size="msm" onClick={onEditGoal}>
              Edit Goal
            </Button>
          ) : undefined
        }
      />
      {sectionKey === 'motivation' && <MotivationDetail sec={sec} c={c} />}
      {sectionKey === 'integrity' && <IntegrityDetail sec={sec} c={c} student={student} />}
      {sectionKey === 'habits' && <HabitsDetail sec={sec} c={c} goal={goal} />}
      {sectionKey === 'skills' && <SkillsDetail sec={sec} c={c} firstName={firstName} />}
      {sectionKey === 'motivation' && (
        <ShowMore label="suggested actions">
          <Card>
            <ActionFooter actions={sec.actions} />
          </Card>
        </ShowMore>
      )}
    </div>
  )
}

// ─── Motivation detail ────────────────────────────────────────────────────────
function MotivationDetail({ sec, c }) {
  const [periodIdx, setPeriodIdx] = useState(0)
  const rmi = sec.rmiHistory[periodIdx]

  // Each index carries its own deltas, so a period can say which way it moved
  // without a chart of the whole run beside it.
  const prev = sec.rmiHistory[periodIdx + 1]
  const goalDelta = prev ? rmi.readingGoalMinutes - prev.readingGoalMinutes : null
  const trend = (delta) => <TrendDelta delta={delta} format={(n) => `${n}%`} />

  return (
    <>
      {/* The period picker is a filter over everything below it, so it sits in
          the same bar every other tab filters from rather than inside the card
          it happens to change first. */}
      <FilterBar compact>
        <FilterItem label="Index period">
          <Select
            size="sm"
            value={periodIdx}
            onChange={(e) => setPeriodIdx(Number(e.target.value))}
          >
            {sec.rmiHistory.map((r, i) => (
              <option key={i} value={i}>
                {r.period} ({r.range})
              </option>
            ))}
          </Select>
        </FilterItem>
      </FilterBar>

      <Card>
        <div className="bp-rmi-donuts">
          <DonutChart
            value={rmi.intrinsicAvg}
            max={rmi.intrinsicMax}
            label="Intrinsic"
            color={INTRINSIC_COLOR}
            trend={trend(rmi.intrinsicDelta)}
          />
          <SplitDonutChart
            intrinsicVal={rmi.intrinsicAvg}
            extrinsicVal={rmi.extrinsicAvg}
            max={rmi.motivationMax}
            label="Overall"
            intrinsicColor={INTRINSIC_COLOR}
            trend={trend(rmi.motivationDelta)}
          />
          <DonutChart
            value={rmi.extrinsicAvg}
            max={rmi.extrinsicMax}
            label="Extrinsic"
            color={EXTRINSIC_COLOR}
            trend={trend(rmi.extrinsicDelta)}
          />
        </div>
      </Card>

      <Card>
        <SectionHeading>Benny says...</SectionHeading>
        <BennyBubble>{emphasize(rmi.bennySummary)}</BennyBubble>
      </Card>

      <Card>
        <SectionHeading>Recommended reading goal</SectionHeading>
        <StatRow icon="target" accent={c} label="Minutes per day">
          <span className="bp-statrow-value">{rmi.readingGoalMinutes}</span>
          {/* The recommendation follows the index, so it moves too. */}
          <TrendDelta delta={goalDelta} format={(n) => `${n} min`} />
        </StatRow>
      </Card>

      <Card>
        <SectionHeading>Motivator rankings</SectionHeading>
        <BarList
          items={rmi.rankings.map((m) => {
            const iconKey = m.name === 'Social Connection' ? 'social' : m.name.toLowerCase()
            const EXTRINSIC_NAMES = new Set([
              'Social Connection',
              'Recognition',
              'Grades',
              'Competition',
              'Compliance',
            ])
            const mColor = EXTRINSIC_NAMES.has(m.name) ? EXTRINSIC_COLOR : INTRINSIC_COLOR
            return {
              icon: cloneElement(RMI_ICONS[iconKey], { width: 15, height: 15 }),
              iconColor: mColor,
              label: m.name,
              value: (m.score / m.max) * 100,
              color: mColor,
              valueLabel: String(m.score),
              delta: m.delta,
            }
          })}
        />
      </Card>
    </>
  )
}

// ─── Book talk types ──────────────────────────────────────────────────────────
// Benny runs three kinds of book talk. `TALK_KINDS` is the canonical definition
// over in the BTWB prototype (label / color / tint / icon), so the wording and
// colors here can't drift from it. The order drives both the talk-type filter
// and the `Type` pill in the talk list.
const TALK_ORDER = ['engagement', 'comprehension', 'integrity']

// ─── Integrity detail ─────────────────────────────────────────────────────────
const SESSION_FLAGS = {
  'book-swap': { icon: 'swap', label: 'Book transfer', color: '#AB720A' },
  'time-warning': { icon: 'clock', label: 'Time concern', color: '#6B7280' },
  'btwb-incomplete': { icon: 'signature', label: 'BTWB incomplete', color: '#059669' },
  'missing-details': { icon: 'list', label: 'Missing details', color: '#E85648' },
  'over-limit': { icon: 'alert-triangle', label: 'Logged over limit', color: '#AB720A' },
}

// The flag drawings are the app's own (see BsIcons) — they carry their own
// colour, so the tile behind them drops the tint it used to need to tell one
// flag from another.
function SessionFlag({ type, size = 20 }) {
  // A flag is either one of the profile's own concerns or one of Book Talks'
  // positive signals — the two columns draw from different vocabularies, so
  // resolve against both rather than rendering nothing for half of them.
  const cfg = SESSION_FLAGS[type] ?? POS_FLAG_DESCS[type]
  if (!cfg) return null
  return (
    <span className="bp-session-flag" title={cfg.label}>
      <FlagIcon type={type} size={size} label={cfg.label} />
    </span>
  )
}

/* The app's Engagement column: a pastel tag per rating, or its grey `N/A` chip
   when a talk has no rating to give (`.flagged-entry__none` — `$gray150` on
   `$gray350`). Colours are the hues' own `500` tones, which is what the tag
   styling derives its fill from. */
const TALK_RATINGS = {
  positive: { label: 'Positive', color: '#1dc174' },
  mixed: { label: 'Mixed', color: '#e7a327' },
  negative: { label: 'Negative', color: '#df3f30' },
}

/* `.flagged-entry__none` is its own 68px box in the app, which made the empty
   chip wider than the ratings beside it. Here it's the same Pill on the app's
   own empty pairing ($gray350 text over the $gray150 fill the soft variant
   derives), so every chip in the column measures the same way. */
const RATING_NONE = '#d0d0d0'

function TalkRating({ rating }) {
  const cfg = TALK_RATINGS[rating]
  return (
    <Pill color={cfg?.color ?? RATING_NONE} size="sm">
      {cfg?.label ?? 'N/A'}
    </Pill>
  )
}

/* `.flagged-entry__analysis`: a row of 32px targets, each holding the flag's
   24px drawing, and the empty chip when there are none.
   Past two drawings the cell stops growing and the rest collapse into a count —
   the app's own `.flagged-entry__more`, tinted to the column it sits in
   ($green50/$green500 positive, $red50/$red500 negative). Three flag drawings
   in a table cell is a puzzle; "2 + 4 more" is a fact. */
const FLAG_CELL_SHOWN = 2
const FLAG_MORE_COLOR = { positive: '#1dc174', negative: '#df3f30' }

function TalkFlagCell({ flags, tone = 'negative' }) {
  if (!flags?.length)
    return (
      <Pill color={RATING_NONE} size="sm">
        N/A
      </Pill>
    )
  const shown = flags.slice(0, FLAG_CELL_SHOWN)
  const rest = flags.length - shown.length
  return (
    <span className="bp-session-flags">
      {shown.map((f) => (
        <SessionFlag key={f} type={f} />
      ))}
      {rest > 0 && (
        <Pill color={FLAG_MORE_COLOR[tone]} size="sm" title={`${rest} more`}>
          +{rest}
        </Pill>
      )}
    </span>
  )
}

/* The row menu the app puts on a flagged entry / book talk
   (`ui/src/sections/NewAdmin/SessionsForReview/components/FlaggedEntryMenu`):
   its `ActionsMenu` trigger is a `more-horizontal` button, and the items are
   Unflag Entry · Edit Entry · Delete Entry · View Entry, then a rule and
   `CertificationMenuOptions` — Verify/Unverify Student and Freeze/Unfreeze
   Access, whichever of each pair applies. The app gates those on
   `profile.user.role === 'patron'` and a `displayCertification` flag; here
   they're always shown, because this is a school profile and that's the case
   they exist for (see the Verify / Freeze note in the docs).

   Unflag only appears on a talk that actually drew a concern — the app hides it
   for an engagement session, which is its name for a talk with nothing to
   answer for. Everything is inert, like the rest of the profile's actions. */
function TalkRowMenu({ talk, student, onView }) {
  const flagged = talk.flags.length > 0
  const verified = student.status?.includes('verified')
  const frozen = student.status?.includes('frozen')

  const items = [
    flagged && { label: 'Unflag Entry', icon: <Icon name="flag-off" size={15} /> },
    { label: 'Edit Entry', icon: <Icon name="pencil" size={15} /> },
    { label: 'Delete Entry', icon: <Icon name="trash" size={15} />, danger: true },
    { label: 'View Entry', icon: <Icon name="book" size={15} />, onSelect: onView },
    { divider: true },
    {
      label: verified ? 'Unverify Student' : 'Verify Student',
      icon: <Icon name="rosette-discount-check" size={15} />,
    },
    {
      label: frozen ? 'Unfreeze Access' : 'Freeze Access',
      icon: <Icon name="snowflake" size={15} />,
    },
  ].filter(Boolean)

  return (
    <Flyout
      placement="bottom-end"
      trigger={({ toggle }) => (
        <RowAction
          icon="dots"
          label="Actions"
          tooltip={false}
          onClick={(e) => {
            e.stopPropagation()
            toggle()
          }}
        />
      )}
    >
      {({ close }) => <DropdownMenu items={items} onClose={close} />}
    </Flyout>
  )
}

// Flag filter values that aren't a single flag type.
const FLAG_FILTER_ANY = 'any'
const FLAG_FILTER_NONE = 'none'

// Which flags this reader actually drew, most frequent first. Derived from the
// talk rows rather than an authored breakdown, so a ranking always agrees with
// the list underneath it.
//
// `key` is which column: `flags` are the concerns, `posFlags` the positive
// signals, and the two draw from different vocabularies (`SESSION_FLAGS` and
// the BTWB prototype's `POS_FLAG_DESCS`), so the descriptor is resolved against
// both.
function countFlags(talks, key) {
  const counts = {}
  for (const t of talks) for (const f of t[key] ?? []) counts[f] = (counts[f] ?? 0) + 1
  return Object.entries(counts)
    .map(([type, count]) => ({
      type,
      count,
      ...(SESSION_FLAGS[type] ?? POS_FLAG_DESCS[type]),
    }))
    .sort((a, b) => b.count - a.count)
}

// The card leads with what to look at first; the rest of the tally is one
// click away behind its "Show N more". The *filter* gets the uncapped lists.
const TOP_FLAGS_SHOWN = 3

function IntegrityDetail({ sec, student }) {
  const [openSession, setOpenSession] = useState(null)
  // Real sessions built from this student's own talks — not SFR's fixtures.
  const [sessions, setSessions] = useState(() =>
    sec.bookTalks.map((talk, i) => talkSession(talk, student, i)),
  )
  const [kindFilter, setKindFilter] = useState('all')
  const [flagFilter, setFlagFilter] = useState(FLAG_FILTER_ANY)
  // The top three, with the rest behind a "Show N more" under the card — the
  // card is a summary above the table, not a second list of it.
  const [showAllFlags, setShowAllFlags] = useState(false)
  const topFlagsInfo = `Most common flags in ${student.name.split(' ')[0]}'s book talks.`

  // The table's Engagement and positive-flag columns are derived per talk, so
  // a fixture that predates them still fills them (see `talkRating`).
  const talks = sec.bookTalks.map((t) => ({
    ...t,
    engagement: talkRating(t),
    posFlags: talkPosFlags(t),
  }))
  const concerns = countFlags(talks, 'flags')
  const positives = countFlags(talks, 'posFlags')
  const flags = concerns
  const shownFlags = showAllFlags ? flags : flags.slice(0, TOP_FLAGS_SHOWN)
  const hiddenFlags = Math.max(flags.length - TOP_FLAGS_SHOWN, 0)

  const shown = talks.filter((t) => {
    if (kindFilter !== 'all' && t.kind !== kindFilter) return false
    if (flagFilter === FLAG_FILTER_NONE) return t.flags.length === 0
    // A selected flag can come from either column, so match both rather than
    // silently returning nothing for every positive signal in the list.
    if (flagFilter !== FLAG_FILTER_ANY)
      return t.flags.includes(flagFilter) || t.posFlags.includes(flagFilter)
    return true
  })

  // The row you clicked opens *its* session. Callers pass the talk's index in
  // `talks`, which is `sec.bookTalks` one-for-one — and so is `sessions`. It
  // used to look the talk up again in `sec.bookTalks`, but `talks` holds
  // copies, so that search always came back -1 and no row opened anything.
  function openRow(talkIdx) {
    setOpenSession(sessions[talkIdx] ?? null)
  }

  function handleUpdateSession(updated) {
    setSessions(sessions.map((s) => (s.id === updated.id ? updated : s)))
    setOpenSession(updated)
  }

  return (
    <>
      <Card>
        <SectionHeading
          actions={
            <Tooltip content={topFlagsInfo}>
              <button type="button" className="rc-card-info" aria-label={topFlagsInfo}>
                i
              </button>
            </Tooltip>
          }
        >
          Top flags
        </SectionHeading>
        {flags.length > 0 ? (
          shownFlags.map((f) => (
            <StatRow
              key={f.type}
              icon={f.icon}
              accent={{ bg: `color-mix(in srgb, ${f.color} 12%, white)`, text: f.color }}
              label={f.label}
            >
              <span className="bp-statrow-value">{f.count}</span>
            </StatRow>
          ))
        ) : (
          <EmptyState title="No flags raised" />
        )}
      </Card>
      {hiddenFlags > 0 && (
        <button
          type="button"
          className="bp-showmore bp-showmore--before-filters"
          onClick={() => setShowAllFlags((v) => !v)}
        >
          {showAllFlags ? 'Show less' : `Show ${hiddenFlags} more`}
          <Icon name={showAllFlags ? 'chevron-up' : 'chevron-down'} size={14} stroke={2.4} />
        </button>
      )}

      <FilterBar compact>
        <FilterItem label="Talk type">
          <Select size="sm" value={kindFilter} onChange={(e) => setKindFilter(e.target.value)}>
            <option value="all">All types</option>
            {TALK_ORDER.map((id) => (
              <option key={id} value={id}>
                {TALK_KINDS[id].short}
              </option>
            ))}
          </Select>
        </FilterItem>
        <FilterItem label="Flags">
          <Select size="sm" value={flagFilter} onChange={(e) => setFlagFilter(e.target.value)}>
            <option value={FLAG_FILTER_ANY}>Any</option>
            <option value={FLAG_FILTER_NONE}>No concerns</option>
            {/* Grouped, because the two columns are different questions: what
                went wrong, and what went right. Ungrouped they read as one
                list where half the options mean the opposite of the rest. */}
            {concerns.length > 0 && (
              <optgroup label="Concerns">
                {concerns.map((f) => (
                  <option key={f.type} value={f.type}>
                    {f.label}
                  </option>
                ))}
              </optgroup>
            )}
            {positives.length > 0 && (
              <optgroup label="Positive signals">
                {positives.map((f) => (
                  <option key={f.type} value={f.type}>
                    {f.label}
                  </option>
                ))}
              </optgroup>
            )}
          </Select>
        </FilterItem>
      </FilterBar>

      <Card flush>
        <Table
          flush
          scrollX
          columns={[
            // Column order follows the app's Flagged Entries table: Logged On
            // · Title · positive flags · negative flags · row actions. Student
            // and Grade are the app's first two and are dropped here — you're
            // already inside one reader's profile. Type and Engagement are
            // dropped too: the talk type is what the filter above selects, and
            // the rating is a summary of the flags in the two columns beside
            // it.
            { key: 'date', label: 'Logged On', width: 96 },
            {
              key: 'title',
              label: 'Title',
              // A floor, not a hint: `width` alone still lost the auto-layout
              // argument to the columns that declare theirs, and titles wrapped
              // one word per line. 170 fits "A Wrinkle in Time" on one line and
              // lets a longer title take two rather than holding a third of the
              // table for the rare case.
              minWidth: 170,
              // The row opens the talk too, but a title that opens something
              // should look like it does — the row click is the convenience,
              // not the affordance.
              render: (title, row) => (
                <button
                  type="button"
                  className="bp-talk-title"
                  onClick={(e) => {
                    e.stopPropagation()
                    openRow(talks.indexOf(row))
                  }}
                >
                  {title}
                </button>
              ),
            },
            // Two flag columns headed by the app's own green and red flags —
            // positive signals on the left, concerns on the right, so a row's
            // shape tells you which kind it drew before you read either.
            {
              key: 'posFlags',
              label: <BsIcon set="flags" name="positive-flag" size={18} alt="Positive flags" />,
              width: 104,
              // Centred under the flag that heads them: the cell holds one or
              // two small drawings, and left-aligned they drifted away from a
              // header that's a single 18px mark.
              align: 'center',
              render: (flags) => <TalkFlagCell flags={flags} tone="positive" />,
            },
            {
              key: 'flags',
              label: <BsIcon set="flags" name="negative-flag" size={18} alt="Concerns" />,
              width: 104,
              align: 'center',
              render: (flags) => <TalkFlagCell flags={flags} tone="negative" />,
            },
            {
              key: 'actions',
              label: '',
              align: 'right',
              width: 56,
              render: (_v, row) => (
                <TalkRowMenu
                  talk={row}
                  student={student}
                  onView={() => openRow(talks.indexOf(row))}
                />
              ),
            },
          ]}
          rows={shown}
          getRowKey={(r, i) => i}
          onRowClick={(row) => openRow(talks.indexOf(row))}
          empty="No talks match these filters"
        />
      </Card>

      {/* No reader list: you're already inside this reader's profile, so the
          sidebar's "their other sessions" is the page you came from. */}
      <SessionModal
        session={openSession}
        allSessions={sessions}
        onClose={() => setOpenSession(null)}
        onUpdateSession={handleUpdateSession}
        onSelectSession={setOpenSession}
        showReaderList={false}
      />
    </>
  )
}

// ─── Habits detail ────────────────────────────────────────────────────────────
function HabitsDetail({ sec, c, goal }) {
  // Derive today's minutes from the current week (last non-null day)
  const currentWeek = sec.weeks.find((w) => w.current)
  const todayMins = currentWeek
    ? ([...currentWeek.days].reverse().find((d) => d.minutes !== null)?.minutes ?? 0)
    : 0

  // The card used to print today's minutes twice — once in the ring and once
  // beside it — and said nothing else. The ring keeps the figure; the text
  // beside it answers the two questions it left open: what the goal is, and
  // how much of today is left to make it. The month grid below covers the
  // week-in-context job a strip in here used to do, badly.
  const met = todayMins >= goal
  const remaining = Math.max(goal - todayMins, 0)

  // Per-session and best-day stats are only meaningful once there is reading to
  // average over — otherwise they show a leftover figure next to "0 of 30 days".
  const hasRecentReading = sec.daysRead30 > 0
  const hasMonthReading = sec.daysReadThisMonth > 0
  const EMPTY = '—'

  return (
    <>
      {/* Daily goal */}
      <Card>
        <SectionHeading>Daily goal</SectionHeading>
        {/* The web app's own goal bar (`GoalMeter`, the reader dashboard's
            `reading_goal_banner`), so staff see today's goal the way the
            student does. The status line under it says what the bar leaves
            implicit: met, or how much of today is left. */}
        <div className="bp-goal-bar">
          <GoalMeter minutes={todayMins} goal={goal} />
          <div
            className={`bp-goal-hero-status${met ? ' bp-goal-hero-status--met' : ''}`}
            style={met ? { '--goal-c': c.bar } : undefined}
          >
            {met ? (
              <>
                <Icon name="check" size={14} stroke={2.6} />
                Goal met today
              </>
            ) : (
              `${remaining} min to go today`
            )}
          </div>
        </div>
      </Card>

      {/* Heatmap */}
      <ChartCard
        title="Reading activity"
        bodyPad="padded"
        footer={
          <div className="bp-heatmap-legend">
            {[
              { bg: c.bar, label: 'Logged Reading', read: true },
              { label: 'Goal met', goal: true },
              { bg: c.bar, label: 'Streak', read: true, streak: true },
            ].map((item, i) => (
              <div key={i} className="bp-heatmap-legend-item">
                {/* Goal met is the star alone — on the calendar it's the one
                    mark on top of the reading green, so the key shows just it. */}
                {item.goal ? (
                  <Icon name="star-filled" size={13} className="bp-heatmap-legend-star" />
                ) : (
                  <div
                    className={[
                      'bp-heatmap-cell',
                      item.read && 'bp-heatmap-cell--read',
                      item.streak && 'bp-heatmap-cell--streak',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{ '--cell-bg': item.bg }}
                  />
                )}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        }
      >
        <ReadingHeatmap goalMinutes={goal} color={c.bar} data={sec.heatmapData} />
      </ChartCard>

      {/* Consistency sits under the heatmap rather than above it: the Overview
          already carries these three figures, so on this page they're a
          footnote to the activity chart, not the headline. */}
      <Card>
        <SectionHeading>Consistency</SectionHeading>
        <StatRow icon="calendar-stats" accent={c} label="Days read">
          <span className="bp-statrow-value">
            {sec.daysRead30}
            <span className="bp-statrow-unit"> of last 30</span>
          </span>
        </StatRow>
        <StatRow icon="flame" accent={c} label="Current streak">
          <span className="bp-statrow-value">
            {sec.currentStreak}
            <span className="bp-statrow-unit"> {sec.currentStreak === 1 ? 'day' : 'days'}</span>
          </span>
        </StatRow>
        <StatRow icon="trophy" accent={c} label="Longest streak">
          <span className="bp-statrow-value">
            {sec.personalBest}
            <span className="bp-statrow-unit"> {sec.personalBest === 1 ? 'day' : 'days'}</span>
          </span>
        </StatRow>
      </Card>

      {/* Habit patterns */}
      <ShowMore label="reading patterns">
        <Card>
          <SectionHeading>Reading patterns</SectionHeading>
          <StatRow icon="clock" accent={c} label="Avg session length">
            <span className="bp-statrow-value">
              {hasRecentReading ? sec.avgSessionMins : EMPTY}
              {hasRecentReading && <span className="bp-statrow-unit"> min</span>}
            </span>
          </StatRow>
          <StatRow icon="calendar-event" accent={c} label="Days read this month">
            <span className="bp-statrow-value">
              {sec.daysReadThisMonth}
              <span className="bp-statrow-unit"> of {sec.daysInMonth}</span>
            </span>
          </StatRow>
          <StatRow icon="history" accent={c} label="Longest gap">
            <span className="bp-statrow-value">
              {sec.longestGap}
              <span className="bp-statrow-unit"> {sec.longestGap === 1 ? 'day' : 'days'}</span>
            </span>
          </StatRow>
          <StatRow icon="star-filled" accent={c} label="Best reading day">
            <span className="bp-statrow-value">{hasMonthReading ? sec.topReadingDay : EMPTY}</span>
          </StatRow>
        </Card>
      </ShowMore>
    </>
  )
}

// ─── Lexile axis ──────────────────────────────────────────────────────────────
// A fixed 400–1000 band wasted most of the plot for a reader who only moves
// 720→870, so the axis is derived from the series (including the grade-level
// line) and snapped out to friendly round ticks.
const NICE_STEPS = [25, 50, 100, 200, 250, 500]

function niceLexileAxis(values, targetTicks = 5) {
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const span = Math.max(hi - lo, NICE_STEPS[0])
  const pad = span * 0.15
  const rawStep = (span + pad * 2) / (targetTicks - 1)
  const step = NICE_STEPS.find((v) => v >= rawStep) ?? NICE_STEPS[NICE_STEPS.length - 1]
  const min = Math.max(0, Math.floor((lo - pad) / step) * step)
  const max = Math.ceil((hi + pad) / step) * step
  const ticks = []
  for (let v = min; v <= max; v += step) ticks.push(v)
  return { domain: [min, max], ticks }
}

// ─── Skills detail ────────────────────────────────────────────────────────────
// A signed Lexile delta, coloured the way it reads: up is good, down isn't.
// A delta beside a figure. Green means the number moved the way you'd want it
// to, which is not always up: `inverse` covers figures like flags, where fewer
// is better. A zero delta renders nothing — "no change" is not news. Text, not
// a pill: the arrow and the colour already carry the whole message, and five
// tinted capsules down the side of a card competed with the figures they were
// annotating.
// The trend chip is shared now (components/TrendChip) so a profile stat row, a
// Lexile delta and a bar-list row are visibly the same thing. This stays as the
// profiles' own name for it, and as the one place the `inverse`/`format`
// conventions for these metrics are written down.
function TrendDelta({ delta, format, inverse = false, suffix }) {
  return <TrendChip delta={delta} format={format} suffix={suffix} inverse={inverse} />
}

function LexileDelta({ value, suffix }) {
  return <TrendDelta delta={value} format={(n) => `${n}L`} suffix={suffix} />
}

function SkillsDetail({ sec, c }) {
  const lexileAxis = niceLexileAxis([...sec.lexileHistory.map((d) => d.avg), sec.gradeLevel])
  // The app labels the plot with the span it covers and steps through it with
  // the arrows beside — `lexile-chart__current-period` and its two
  // IconButtons. Derived from the history so the two can't disagree.
  const lexilePeriod = `${sec.lexileHistory[0]?.month} – ${sec.lexileHistory[sec.lexileHistory.length - 1]?.month}`

  // Every figure below is derived from the titles and the history already on
  // the page — nothing authored separately that could drift from the chart.
  const topTitle = sec.titles.reduce((a, b) => (b.lexile > a.lexile ? b : a))
  const vsGrade = sec.monthlyAvg - sec.gradeLevel
  const history = sec.lexileHistory
  const growth = history[history.length - 1].avg - history[0].avg
  const firstMonth = history[0].month

  return (
    <>
      <Card>
        <SectionHeading>Lexile summary</SectionHeading>
        <StatRow icon="book-2" accent={c} label="Monthly average">
          <span className="bp-statrow-value">{sec.monthlyAvg}L</span>
          <LexileDelta value={sec.monthlyDelta} suffix="vs Apr" />
        </StatRow>
        <StatRow icon="arrow-up" accent={c} label="Highest logged recently">
          <span className="bp-statrow-value">{topTitle.lexile}L</span>
        </StatRow>
        <StatRow icon="target" accent={c} label={`Vs. ${sec.gradeLevelLabel || 'grade level'}`}>
          <span className="bp-statrow-value">{sec.gradeLevel}L</span>
          <LexileDelta value={vsGrade} />
        </StatRow>
        <StatRow icon="trending-up" accent={c} label="Growth this year">
          <span className="bp-statrow-value">
            {growth >= 0 ? '+' : '−'}
            {Math.abs(growth)}L
          </span>
          <span className="bp-statrow-note">since {firstMonth}</span>
        </StatRow>
      </Card>

      {/* Drawn the way the shipped chart is (bs-product
          `NewAdmin/ReaderProfile/.../LexileChart`): coral `#F26430` at 2px with
          a 6px marker ringed in white, vertical gridlines in `$gray200` and
          **no** horizontal ones, no X labels — the date comes from the tooltip
          — and Y ticks every 50. Its period selector sits above the plot. */}
      <Card>
        {/* One header row, like every other card's: the title, and on the
            right the period with the steppers that move it. This used to be a
            hand-rolled bar, because wrapping the heading to fit the steppers
            beside it took it out of the first-child slot that draws every other
            card's header. SectionCard's `actions` is that slot. */}
        <SectionHeading
          actions={
            <div className="bp-lex-period-nav">
              <span className="bp-lex-period">{lexilePeriod}</span>
              <div className="bp-rl-month-arrows">
                <button className="bp-heatmap-nav-btn" aria-label="Previous period">
                  <Icon name="chevron-left" size={16} stroke={2.4} />
                </button>
                <button className="bp-heatmap-nav-btn" aria-label="Next period" disabled>
                  <Icon name="chevron-right" size={16} stroke={2.4} />
                </button>
              </div>
            </div>
          }
        >
          Lexile trend
        </SectionHeading>
        <div className="bp-chart-fit" style={{ '--chart-h': '180px' }}>
          <TrendChart
            type="line"
            data={sec.lexileHistory.map((d) => ({ month: d.month, avg: d.avg }))}
            xKey="month"
            yDomain={lexileAxis.domain}
            yTicks={lexileAxis.ticks}
            yUnit="L"
            height="sm"
            gridX
            gridY={false}
            xAxisHidden
            points
            series={[{ key: 'avg', name: 'Lexile', color: LEXILE_LINE, strokeWidth: 2 }]}
            /* The app's own tooltip: a dark chip carrying the value over the
               word "Average" and nothing else — no date, no series name —
               centred above the point it belongs to (`externalTooltip.ts` +
               `admin/components/_charts.scss`). */
            pointTooltip
            tooltipContent={({ payload }) => (
              <div className="bp-lex-tip">
                <span className="bp-lex-tip-value">{payload[0]?.value}L</span>
                <span className="bp-lex-tip-caption">Average</span>
              </div>
            )}
          />
        </div>
      </Card>

      <ShowMore label="recent titles">
        <div className="bp-titles-section">
          <div className="bp-titles-header">
            <span className="bp-titles-header-label">Recent titles</span>
          </div>
          {sec.titles.map((t, i) => (
            <TitleRow key={i} title={t} />
          ))}
        </div>
      </ShowMore>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── Student data ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

const STUDENTS = {
  // ── Marcus Chen — Exceptional ──────────────────────────────────────────────
  marcus: {
    name: 'Marcus Chen',
    // `classes` — every section this student is rostered into, with the
    // section's primary teacher. Two sections sharing a teacher is the case
    // the ticket's mock shows.
    classes: [
      { name: 'MWD Science 0621 FDK', teacher: 'Camila Noceda' },
      { name: 'MWD Biology 3272 WER', teacher: 'Camila Noceda' },
      { name: 'MWD Math 716 UEIW', teacher: 'Raine Whispers' },
    ],
    avatarColor: '#0F766E',
    // Marcus reads in Comics Plus, and is verified — his 1,000-minute read-a-thon
    // day is real, so his logs are trusted past the site's daily limit.
    status: ['comicsplus', 'verified'],
    grade: '7th Grade',
    lastRun: 'May 15 at 9:55am',
    rewards: [
      {
        name: 'Free Book Coupon',
        challenge: 'Benny the Bean Reading Challenge',
        earnedOn: 'Mar 14, 2025',
        redeemed: true,
        // Earned more than 90 days ago, so the app files it under Past Rewards.
        era: 'past',
      },
      {
        name: 'Beanstack Bookmark',
        challenge: 'Benny the Bean Reading Challenge',
        earnedOn: 'Mar 28, 2025',
        redeemed: true,
      },
      {
        name: 'Front-of-Lunch-Line Pass',
        challenge: 'Benny the Bean Reading Challenge',
        earnedOn: 'Apr 11, 2025',
        redeemed: true,
      },
      {
        name: 'Library Tote Bag',
        challenge: 'Read Across America',
        earnedOn: 'May 2, 2025',
        redeemed: false,
      },
    ],
    // `ticket_rewards` — a prize you enter a drawing for by spending tickets.
    // `available` is what the challenge has awarded and not yet spent;
    // `maxEntries` 0 means unlimited (the app's `unlimited_entries`).
    ticketDrawings: [
      {
        name: 'Nintendo Switch Grand Prize',
        challenge: 'Benny the Bean Reading Challenge',
        description:
          'The new home video game system from Nintendo — play at home or take it on the go.',
        entered: 5,
        available: 3,
        maxEntries: 10,
        endsOn: 'May 31, 2025',
      },
      {
        name: 'Skate Park Season Pass',
        challenge: 'Benny the Bean Reading Challenge',
        description: 'A season pass to the city skate park, good through Labor Day.',
        entered: 2,
        available: 3,
        maxEntries: 0,
        endsOn: 'May 31, 2025',
      },
      // A second challenge, with its own pile — `available` is per challenge
      // (`available_tickets_for_program`), so entering tickets here doesn't
      // touch the balance above.
      {
        name: 'Bookstore Gift Card',
        challenge: 'Read Across America',
        description: 'A $25 gift card to the bookstore on Main Street.',
        entered: 1,
        available: 4,
        maxEntries: 5,
        endsOn: 'Mar 31, 2025',
      },
    ],
    // `raffle_winners` — a drawing this reader actually won. `place` is only
    // set on an Ordered Placement drawing; Equal Winners has no places.
    drawingWins: [
      { name: 'Logging Week 2', type: 'All Eligible Readers', place: null, claimed: true },
      { name: 'Spring Reading -- April', type: 'Total Minutes Read', place: 1, claimed: true },
      { name: 'Shout Out', type: 'Specific Earned Badge(s)', place: null, claimed: false },
    ],
    // `profile.points_summary` — the running total per point type. Only the
    // types this reader has actually earned appear; the app's partial switches
    // on whatever keys are present.
    pointsSummary: {
      book: 120,
      page: 340,
      minute: 5480,
      day: 148,
      'standard-activity': 60,
      review: 15,
    },
    challenges: [
      {
        name: 'Benny the Bean Reading Challenge',
        // `program.has_ticket_rewards` — the challenges whose drawings the
        // reader spends tickets on, so their rows get the drill-in link.
        hasTicketRewards: true,
        banner: 'benny-bean',
        dates: 'Mar 1, 2025 - May 31, 2025',
        startedOn: 'March 3, 2025',
        minutes: 2140,
        status: 'current',
      },
      {
        name: 'Read Across America',
        // `program.has_ticket_rewards` — the challenges whose drawings the
        // reader spends tickets on, so their rows get the drill-in link.
        hasTicketRewards: true,
        banner: 'read-across-america',
        dates: 'Ongoing',
        startedOn: 'March 2, 2025',
        minutes: 480,
        status: 'current',
      },
      {
        name: 'Read with Benny: Winter Reading',
        banner: 'winter-reading',
        dates: 'Jan 6, 2025 - Feb 28, 2025',
        startedOn: 'January 8, 2025',
        completedOn: 'February 24, 2025',
        minutes: 1620,
        status: 'ended',
      },
      {
        name: 'Battle of the Books',
        banner: 'battle-of-the-books',
        dates: 'Jun 1, 2024 - Aug 31, 2024',
        startedOn: 'June 4, 2024',
        minutes: 3010,
        status: 'past',
      },
      {
        name: 'Find Your Reading Joy',
        banner: 'summer-reading',
        dates: 'Jun 1, 2025 - Aug 31, 2025',
        // Not started, so no start date and nothing logged — the app's
        // Upcoming tab is challenges the reader is enrolled in that haven't
        // opened yet.
        status: 'upcoming',
      },
    ],
    // Activity badges from the site's exploration challenge: each badge is a set
    // of activities the reader checks off.
    activityBadges: [
      {
        name: 'Space',
        icon: 'rocket',
        color: '#4F46E5',
        challenge: 'Benny the Bean Reading Challenge',
        activities: [
          // A text box challenge carries the reader's own words; staff can read
          // it and tick the box, but the product won't let them write one.
          {
            text: 'Watch a live feed from the International Space Station and write down one thing you saw that surprised you.',
            type: 'Text Box Challenge',
            answer:
              "You can see whole weather systems from up there. I thought clouds would look like clouds but they look like they're painted on.",
            done: true,
          },
          {
            text: "Read a book or article about a planet you couldn't point to on a map. What is one fact you didn't know?",
            type: 'Text Box Challenge',
            answer: 'Neptune has winds over 1,200 mph. Fastest in the solar system.',
            done: true,
          },
          // `activity_codes` is a list — one activity can accept several, which
          // is how a site runs the same code at two branches.
          {
            text: 'Find out what time the ISS passes over your town tonight, then go outside and look for it.',
            type: 'Activity Code',
            codes: ['SPOTTED-ISS', 'LOOKUP2025'],
            done: false,
          },
        ],
      },
      {
        name: 'American Landmark',
        icon: 'building-monument',
        color: '#B45309',
        challenge: 'Benny the Bean Reading Challenge',
        activities: [
          {
            text: 'Pick an American landmark and find out who built it and why. Was it built for the reason you expected?',
            done: true,
          },
          {
            text: 'Take a virtual tour of a national monument and describe the view from the top.',
            type: 'Text Box Challenge',
            done: false,
          },
        ],
      },
      {
        name: 'Museums',
        icon: 'building-arch',
        color: '#B43DD0',
        challenge: 'Benny the Bean Reading Challenge',
        activities: [
          {
            text: 'Browse a museum collection online and pick the one object you would most want to see in person. Why that one?',
            done: true,
          },
          {
            text: 'Find a museum within an hour of where you live that you have never visited. What is it known for?',
            type: 'Activity Code',
            codes: ['MUSEUM-VISIT'],
            done: true,
          },
        ],
      },
      {
        name: 'Aquarium',
        icon: 'fish',
        color: '#0891B2',
        challenge: 'Read with Benny: Winter Reading',
        activities: [
          {
            text: 'Come see the fish, sea jellies, turtles, and more at the magnificent Monterey Bay Aquarium. Watch the animals swim, glide, and soar, and even take a peek outside the aquarium to see wildlife in its natural habitat. Which animal did you most enjoy visiting?',
            done: false,
          },
          {
            text: 'Climb, click, and spin your way through the National Aquarium in Baltimore. Each level offers a variety of sea life, as well as a rainforest exhibit. Spot fish, sharks, and jellies through their live cams.',
            done: false,
          },
        ],
      },
      {
        name: 'National Parks',
        icon: 'trees',
        color: '#15803D',
        challenge: 'Read with Benny: Winter Reading',
        activities: [
          {
            text: 'Pick a national park and find out which animals live there that live nowhere else.',
            done: false,
          },
          {
            text: 'Read a park ranger interview or blog post. What is the strangest part of the job?',
            done: false,
          },
          {
            text: 'Plan a one-day visit to a national park you could actually get to. What would you do first?',
            done: false,
          },
        ],
      },
      {
        name: 'Zoo',
        icon: 'paw',
        color: '#16A34A',
        challenge: 'Read with Benny: Winter Reading',
        activities: [
          {
            text: 'Watch a zoo live cam for ten minutes and describe what the animals actually did — not what you expected them to do.',
            done: false,
          },
          { text: 'Find out what one zoo animal eats in a day. Were you close?', done: false },
        ],
      },
    ],
    // Site-wide seasonal achievements the reader earned, newest first.
    achievements: [
      {
        name: 'Book Publishers Day 2026',
        category: 'literacy',
        date: 'Jan 16, 2026',
        icon: 'building',
        color: '#2563EB',
      },
      {
        name: "Author Louisa May Alcott's Birthday 2025",
        category: 'literacy',
        date: 'Nov 29, 2025',
        icon: 'writing',
        color: '#B43DD0',
      },
      {
        name: 'National Cookbook Month 2025',
        category: 'us',
        date: 'Oct 1, 2025',
        icon: 'apple',
        color: '#AB720A',
      },
      {
        name: 'Dear Diary Day 2025',
        category: 'literacy',
        date: 'Sep 22, 2025',
        icon: 'notebook',
        color: '#DB2777',
      },
      {
        name: 'National Read a Book Day 2025',
        category: 'literacy',
        date: 'Sep 7, 2025',
        icon: 'book',
        color: '#0D9488',
      },
      {
        name: 'Library Card Sign-Up Month 2025',
        category: 'us',
        date: 'Sep 1, 2025',
        icon: 'barcode',
        color: '#E85648',
      },
    ],
    // Logging milestones and challenge badges. `earned` splits the two tabs;
    // `kind` drives the category filter.
    badges: [
      {
        name: '100 Books | 2025',
        detail: 'Read 100 books',
        kind: 'logging',
        earned: true,
        top: '100',
        mid: 'BOOKS',
        earnedNote: 'Earned for reading 100 books in the 2025 school year',
        year: '2025',
      },
      {
        name: '10,000 Minutes | 2025',
        detail: 'Read 10,000 minutes',
        kind: 'logging',
        earned: true,
        top: '10,000',
        mid: 'MINUTES',
        earnedNote: 'Earned for logging 10,000 minutes in the 2025 school year',
        year: '2025',
      },
      {
        name: '180 Days | 2025',
        detail: 'Log 180 days',
        kind: 'logging',
        earned: true,
        top: '180',
        mid: 'DAYS',
        earnedNote: 'Earned for logging on 180 days in the 2025 school year',
        year: '2025',
      },
      {
        name: 'Book Chatter | 2025',
        detail: 'Finish 10 book talks',
        kind: 'challenge',
        // A challenge badge belongs to the challenge that defined it — that's
        // what the Challenge filter above the list reads. A logging badge has
        // no challenge: the site awards it for the year's totals.
        challenge: 'Benny the Bean Reading Challenge',
        earned: true,
        top: '10',
        mid: 'TALKS',
        earnedNote: 'Earned for finishing 10 book talks in Benny the Bean Reading Challenge',
        year: '2025',
      },
      {
        name: '365 Days | 2025',
        detail: 'Log 365 days',
        kind: 'logging',
        earned: false,
        top: '365',
        mid: 'DAYS',
        year: '2025',
      },
      {
        name: '15,000 Minutes | 2025',
        detail: 'Read 15,000 minutes',
        kind: 'logging',
        earned: false,
        top: '15,000',
        mid: 'MINUTES',
        year: '2025',
      },
      {
        name: 'Genre Explorer | 2025',
        detail: 'Finish a book in 8 genres',
        kind: 'challenge',
        challenge: 'Read Across America',
        earned: false,
        top: '8',
        mid: 'GENRES',
        year: '2025',
      },
    ],
    // Book reviews the reader wrote and published to the site.
    reviews: [
      {
        isbn: '9781451673319',
        title: 'Fahrenheit 451',
        author: 'Ray Bradbury',
        date: '05/06/25',
        text: "Read this for the spring challenge and it's stuck with me more than anything else I've read this year. The part that got me wasn't the book burning, it was that nobody made them do it — everyone just stopped wanting to read on their own. Montag's wife with the earbuds in all day felt way too close to home. The ending is kind of confusing but I think that's on purpose.",
      },
      {
        isbn: '9780451526342',
        title: 'Animal Farm',
        author: 'George Orwell',
        date: '03/30/25',
        text: 'Short but it does a lot. I did not see the ending coming even though looking back it was obvious the whole time. Would recommend if you like books where the animals are actually about something else.',
      },
      {
        isbn: '9780399501487',
        title: 'Lord of the Flies',
        author: 'William Golding',
        date: '01/19/25',
        text: 'Everyone in my class hated this book but I thought it was good. Piggy deserved better.',
      },
    ],
    // Text box challenge responses, newest challenge first. Prompts are authored
    // by the site; answers are what the reader typed, so they read like a
    // 7th-grader who is genuinely into the books.
    textChallenges: [
      {
        challenge: 'Benny the Bean Reading Challenge',
        responses: [
          {
            date: '05/09/25',
            prompt:
              'Look back at everything you read for this challenge. What was the weirdest or most unexpected thing you learned?',
            answer:
              'That Bradbury wrote Fahrenheit 451 in a library basement on a typewriter you had to pay a dime to use. The whole book cost him like $9.80.',
          },
          {
            date: '04/21/25',
            prompt: 'Finally read a book from your TBR pile! Which did you choose?',
            answer: "A Wrinkle in Time. It's been on my shelf since 5th grade.",
          },
          {
            date: '04/02/25',
            prompt: 'Did the critics get it right?',
            answer:
              "Mostly. Everyone says Ender's Game is about war but I think it's really about adults lying to kids to get them to do things.",
          },
        ],
      },
      {
        challenge: 'Read with Benny: Winter Reading',
        responses: [
          {
            date: '02/14/25',
            prompt: 'What did you read?',
            answer: 'The Hobbit, chapters 1-6. Got to the trolls.',
          },
          {
            date: '01/28/25',
            prompt: 'Recommend a book to someone in your class. Who and why?',
            answer:
              "I'd give Ender's Game to Tyler because it moves fast and there's a lot of fighting in it.",
          },
        ],
      },
    ],
    // Overview stats per range. `daysPossible` counts school days: ~172 so far
    // this year, ~344 across the two years of logging history.
    overview: {
      year: {
        motivators: ['Enjoyment', 'Curiosity'],
        flags: 1,
        daysRead: 148,
        daysPossible: 172,
        lexile: 870,
        lexileDelta: 120,
        currentStreak: 18,
        longestStreak: 18,
        booksCompleted: 24,
        minutes: 5480,
        // This year against last — the trend follows the range you're viewing.
        trend: {
          minutesPct: 26,
          lexile: 120,
          goalDays: 19,
          flags: -2,
          currentStreak: 11,
          longestStreak: 6,
          rmi: 7,
          label: 'vs last year',
        },
      },
      all: {
        motivators: ['Enjoyment', 'Challenge'],
        flags: 3,
        daysRead: 281,
        daysPossible: 344,
        lexile: 870,
        lexileDelta: 230,
        currentStreak: 18,
        longestStreak: 24,
        booksCompleted: 41,
        minutes: 10120,
      },
    },
    bennySummary:
      "Marcus is reading on **21 of the last 30 days** — the best consistency in the class — and well above grade level at **870L**, with **only 1 flagged session all year**. He's ready for books 1–2 grade levels up.",
    sections: {
      motivation: {
        status: 'Strong',
        intrinsic: 88,
        intrinsicDelta: 12,
        extrinsic: 82,
        extrinsicDelta: 6,
        tileSub: '/ 100 score',
        motivatorInsight: { type: 'clear', top: ['Enjoyment', 'Curiosity'] },
        rmiHistory: [
          {
            period: 'Apr 25 Index',
            range: '4/15/25–5/15/25',
            intrinsicAvg: 19.2,
            intrinsicMax: 20,
            intrinsicDelta: 8,
            motivationAvg: 36.4,
            motivationMax: 40,
            motivationDelta: 12,
            extrinsicAvg: 17.8,
            extrinsicMax: 20,
            extrinsicDelta: 6,
            readingGoalMinutes: 30,
            bennySummary:
              "Marcus's intrinsic score of **19.2/20** is his best this year, led by Enjoyment, Curiosity and Challenge. Keep the material challenging and get out of his way.",
            recommendedActions: [
              {
                label: 'Advanced Challenge',
                text: 'Marcus is ready for books 1–2 grade levels above. Consider recommending titles in the 950–1000L range to keep him growing.',
              },
              {
                label: 'Leadership',
                text: 'Invite Marcus to share his reading experience with classmates through a short book talk or reading buddy program.',
              },
            ],
            rankings: [
              { name: 'Enjoyment', score: 4.0, max: 4, delta: 3 },
              { name: 'Curiosity', score: 3.9, max: 4, delta: 5 },
              { name: 'Challenge', score: 3.8, max: 4, delta: 8 },
              { name: 'Confidence', score: 3.8, max: 4, delta: 4 },
              { name: 'Importance', score: 3.7, max: 4, delta: 6 },
              { name: 'Social Connection', score: 3.5, max: 4, delta: 2 },
              { name: 'Recognition', score: 3.4, max: 4, delta: 5 },
              { name: 'Grades', score: 3.2, max: 4, delta: 2 },
              { name: 'Competition', score: 3.0, max: 4, delta: 1 },
              { name: 'Compliance', score: 2.8, max: 4, delta: -1 },
            ],
          },
          {
            period: 'Mar 25 Index',
            range: '3/15/25–4/15/25',
            intrinsicAvg: 18.1,
            intrinsicMax: 20,
            intrinsicDelta: 5,
            motivationAvg: 33.8,
            motivationMax: 40,
            motivationDelta: 8,
            extrinsicAvg: 16.5,
            extrinsicMax: 20,
            extrinsicDelta: 4,
            readingGoalMinutes: 30,
            bennySummary:
              'Intrinsic drivers still lead, and Social Connection is picking up — a reading buddy or discussion group would build on it.',
            recommendedActions: [
              {
                label: 'Peer sharing',
                text: 'Marcus is highly motivated by social connection. Consider setting up a reading club or partner discussions.',
              },
              {
                label: 'Genre stretch',
                text: 'Encourage Marcus to explore a genre outside his comfort zone — historical fiction or biography — to broaden engagement.',
              },
            ],
            rankings: [
              { name: 'Enjoyment', score: 3.9, max: 4, delta: 4 },
              { name: 'Curiosity', score: 3.7, max: 4, delta: 3 },
              { name: 'Confidence', score: 3.6, max: 4, delta: 6 },
              { name: 'Challenge', score: 3.5, max: 4, delta: 2 },
              { name: 'Importance', score: 3.4, max: 4, delta: 3 },
              { name: 'Social Connection', score: 3.3, max: 4, delta: 5 },
              { name: 'Recognition', score: 3.1, max: 4, delta: 1 },
              { name: 'Grades', score: 3.0, max: 4, delta: 2 },
              { name: 'Competition', score: 2.9, max: 4, delta: 3 },
              { name: 'Compliance', score: 2.8, max: 4, delta: -2 },
            ],
          },
        ],
        actions: [
          {
            title: 'Nominate Marcus for a reading recognition award',
            body: "His consistent reading record and near-perfect motivation scores make him an ideal candidate. Public recognition could also strengthen classmates' motivation.",
          },
          {
            title: 'Give Marcus a voice — try a student book recommendation',
            body: 'High-curiosity, high-enjoyment readers like Marcus do well as peer recommenders. A short class book talk would channel his engagement productively.',
          },
        ],
      },
      integrity: {
        score: 96,
        status: 'Strong',
        flaggedSessions: 1,
        flagDelta: -2,
        unfinishedConversations: 0,
        // Talks held, by type. `unfinished` sums to `unfinishedConversations`.
        talks: {
          engagement: { total: 11, unfinished: 0, positive: 10, mixed: 1, disengaged: 0 },
          comprehension: { total: 6, unfinished: 0, strong: 5, developing: 1 },
          integrity: { total: 1, unfinished: 0, concerns: 1 },
        },
        tileStat: '1',
        tileSub: 'flag ↓2',
        // The 8 most recent of the 18 talks held. `flags` is what the Reading
        // Integrity check raised on the session behind the talk — most are clean.
        bookTalks: [
          { date: '05/12/25', title: 'The Hobbit', kind: 'engagement', flags: [] },
          { date: '05/06/25', title: 'The Hobbit', kind: 'comprehension', flags: [] },
          { date: '04/28/25', title: 'A Wrinkle in Time', kind: 'engagement', flags: [] },
          { date: '04/19/25', title: 'A Wrinkle in Time', kind: 'comprehension', flags: [] },
          { date: '04/08/25', title: "Ender's Game", kind: 'engagement', flags: [] },
          { date: '03/26/25', title: "Ender's Game", kind: 'comprehension', flags: [] },
          { date: '03/14/25', title: "Ender's Game", kind: 'integrity', flags: ['time-warning'] },
          { date: '03/02/25', title: 'Fahrenheit 451', kind: 'engagement', flags: [] },
        ],
        actions: [
          {
            title: "Marcus's integrity is exemplary — acknowledge it",
            body: '1 flag all year is exceptional. A brief acknowledgment reinforces the behavior and sets a positive example for the class.',
          },
          {
            title: "Keep BTWB conversations going — he's completing all of them",
            body: 'Marcus has a 100% BTWB completion rate. Encourage deeper reflection prompts to match his reading sophistication.',
          },
        ],
      },
      habits: {
        score: 93,
        status: 'Strong',
        currentStreak: 18,
        avgStreak: 15,
        personalBest: 18,
        minutesThisWeek: 185,
        minutesDelta: 25,
        booksLogged: 4,
        goalHitRate: 94,
        avgSessionMins: 37,
        daysReadThisMonth: 14,
        daysInMonth: 15,
        longestGap: 1,
        topReadingDay: 'Thursdays',
        daysRead30: 21,
        tileStat: '18',
        tileSub: 'day streak',
        dailyGoalMinutes: 30,
        heatmapData: makeHeatmapData(0.85, 'consistent'),
        weeks: [
          {
            label: 'May 11–17',
            current: true,
            days: [
              { day: 'Mon', minutes: 40 },
              { day: 'Tue', minutes: 38 },
              { day: 'Wed', minutes: 32 },
              { day: 'Thu', minutes: 40 },
              { day: 'Fri', minutes: 35 },
              { day: 'Sat', minutes: null },
              { day: 'Sun', minutes: null },
            ],
          },
          {
            label: 'May 4–10',
            current: false,
            days: [
              { day: 'Mon', minutes: 38 },
              { day: 'Tue', minutes: 42 },
              { day: 'Wed', minutes: 35 },
              { day: 'Thu', minutes: 45 },
              { day: 'Fri', minutes: 36 },
              { day: 'Sat', minutes: 28 },
              { day: 'Sun', minutes: 30 },
            ],
          },
          {
            label: 'Apr 27 – May 3',
            current: false,
            days: [
              { day: 'Mon', minutes: 40 },
              { day: 'Tue', minutes: 38 },
              { day: 'Wed', minutes: 35 },
              { day: 'Thu', minutes: 42 },
              { day: 'Fri', minutes: 0 },
              { day: 'Sat', minutes: 31 },
              { day: 'Sun', minutes: 32 },
            ],
          },
        ],
        actions: [
          {
            title: 'Keep habits accountability light-touch',
            body: 'Marcus is highly self-directed. A weekly leaderboard or simple goal counter is all he needs — daily nudges would feel patronizing.',
          },
          {
            title: "Consider raising Marcus's daily goal to 40 minutes",
            body: "He's consistently hitting 30+ minutes and his engagement shows no signs of burnout. A modest goal increase could deepen his growth.",
          },
        ],
      },
      skills: {
        score: 95,
        status: 'Trending up',
        titles: [
          {
            title: 'Found',
            author: 'Margaret Peterson Haddix',
            lexile: 700,
            genre: 'Sci-Fi',
            sessions: 4,
            current: false,
            isbn: '9781416954170',
          },
          {
            title: 'A Wrinkle in Time',
            author: "Madeleine L'Engle",
            lexile: 740,
            genre: 'Sci-Fi',
            sessions: 7,
            current: false,
            isbn: '9780312367558',
          },
          {
            title: "Ender's Game",
            author: 'Orson Scott Card',
            lexile: 780,
            genre: 'Sci-Fi',
            sessions: 14,
            current: false,
            isbn: '9780812550702',
          },
          {
            title: 'The Hunger Games',
            author: 'Suzanne Collins',
            lexile: 810,
            genre: 'Dystopian',
            sessions: 9,
            current: false,
            isbn: '9780439023481',
          },
          {
            title: 'Fahrenheit 451',
            author: 'Ray Bradbury',
            lexile: 890,
            genre: 'Dystopian',
            sessions: 11,
            current: true,
            isbn: '9781451673319',
          },
        ],
        genreCloud: [
          { genre: 'Sci-Fi', count: 21 },
          { genre: 'Dystopian', count: 11 },
          { genre: 'Mystery', count: 8 },
          { genre: 'Adventure', count: 6 },
          { genre: 'Historical', count: 4 },
          { genre: 'Fantasy', count: 3 },
        ],
        recommendedTitles: [
          {
            title: 'Animal Farm',
            author: 'George Orwell',
            lexile: 940,
            genre: 'Dystopian',
            isbn: '9780451526342',
          },
          {
            title: 'Lord of the Flies',
            author: 'William Golding',
            lexile: 1010,
            genre: 'Dystopian',
            isbn: '9780399501487',
          },
          {
            title: 'The Giver of Stars',
            author: 'Jojo Moyes',
            lexile: 880,
            genre: 'Historical',
            isbn: '9780399177644',
          },
        ],
        recommendedRange: '900–950L',
        monthlyAvg: 870,
        monthlyDelta: 80,
        gradeLevel: 750,
        gradeLevelLabel: 'Grade 7',
        lexileHistory: [
          { month: 'Jan', avg: 720 },
          { month: 'Feb', avg: 760 },
          { month: 'Mar', avg: 800 },
          { month: 'Apr', avg: 830 },
          { month: 'May', avg: 870 },
        ],
        tileStat: '870L',
        tileSub: '↑80L this month',
        actions: [
          {
            title: 'Recommend titles in the 900–950L range',
            body: "Marcus's Lexile average is 870L and climbing fast. He's outpacing the grade 7 benchmark and is ready for a significant challenge.",
          },
          {
            title: 'Explore Dystopian and Sci-Fi series to sustain momentum',
            body: 'These are his two dominant genres. Series books at his next Lexile level reduce friction and keep engagement high between teacher check-ins.',
          },
        ],
      },
    },
    recommendedActions: [
      {
        title: 'Nominate Marcus for a reading recognition award',
        body: 'His consistent reading record and near-perfect motivation scores make him an ideal candidate.',
        section: 'motivation',
      },
      {
        title: 'Celebrate his near-perfect integrity record',
        body: 'Only 1 flagged session all year — a brief shoutout reinforces the behavior for the class.',
        section: 'integrity',
      },
      {
        title: 'Keep habits accountability light-touch',
        body: "Marcus is self-directed. A weekly leaderboard or simple goal counter is enough — he doesn't need daily nudges.",
        section: 'habits',
      },
      {
        title: 'Recommend titles in the 900–950L range',
        body: "He's at 870L and climbing. He's significantly above grade level and ready for a real challenge.",
        section: 'skills',
      },
    ],
  },

  // ── Anne Boonchuy — Normal ─────────────────────────────────────────────────
  anne: {
    name: 'Anne Boonchuy',
    classes: [
      { name: 'MWD English 0418 QLM', teacher: 'Sasha Waybright' },
      { name: 'MWD Math 716 UEIW', teacher: 'Raine Whispers' },
    ],
    avatarColor: '#B43DD0',
    // Anne logs at her public library too, so her school profile is tandemed.
    status: ['tandem', 'comicsplus'],
    grade: '6th Grade',
    lastRun: 'May 15 at 9:55am',
    rewards: [
      {
        name: 'Beanstack Bookmark',
        challenge: 'Benny the Bean Reading Challenge',
        earnedOn: 'Mar 21, 2025',
        redeemed: true,
        // Earned more than 90 days ago, so the app files it under Past Rewards.
        era: 'past',
      },
      {
        name: 'Free Book Coupon',
        challenge: 'Benny the Bean Reading Challenge',
        earnedOn: 'Apr 25, 2025',
        redeemed: false,
      },
    ],
    ticketDrawings: [
      {
        name: 'Nintendo Switch Grand Prize',
        challenge: 'Benny the Bean Reading Challenge',
        description:
          'The new home video game system from Nintendo — play at home or take it on the go.',
        entered: 1,
        available: 2,
        maxEntries: 10,
        endsOn: 'May 31, 2025',
      },
    ],
    drawingWins: [
      { name: 'Logging Week 2', type: 'All Eligible Readers', place: null, claimed: true },
      { name: 'Shout Out', type: 'Specific Earned Badge(s)', place: 2, claimed: false },
    ],
    // `profile.points_summary` — the running total per point type. Only the
    // types this reader has actually earned appear; the app's partial switches
    // on whatever keys are present.
    pointsSummary: {
      book: 80,
      page: 210,
      minute: 3120,
      day: 96,
      'standard-activity': 40,
      review: 10,
    },
    challenges: [
      {
        name: 'Benny the Bean Reading Challenge',
        // `program.has_ticket_rewards` — the challenges whose drawings the
        // reader spends tickets on, so their rows get the drill-in link.
        hasTicketRewards: true,
        banner: 'benny-bean',
        dates: 'Mar 1, 2025 - May 31, 2025',
        startedOn: 'March 11, 2025',
        minutes: 760,
        status: 'current',
      },
      {
        name: 'Read with Benny: Winter Reading',
        banner: 'winter-reading',
        dates: 'Jan 6, 2025 - Feb 28, 2025',
        startedOn: 'January 21, 2025',
        completedOn: 'February 26, 2025',
        minutes: 540,
        status: 'ended',
      },
      {
        name: 'Battle of the Books',
        banner: 'battle-of-the-books',
        dates: 'Jun 1, 2024 - Aug 31, 2024',
        startedOn: 'July 2, 2024',
        minutes: 610,
        status: 'past',
      },
      {
        name: 'Find Your Reading Joy',
        banner: 'summer-reading',
        dates: 'Jun 1, 2025 - Aug 31, 2025',
        // Not started, so no start date and nothing logged — the app's
        // Upcoming tab is challenges the reader is enrolled in that haven't
        // opened yet.
        status: 'upcoming',
      },
    ],
    activityBadges: [
      {
        name: 'Aquarium',
        icon: 'fish',
        color: '#0891B2',
        challenge: 'Read with Benny: Winter Reading',
        activities: [
          {
            text: 'Come see the fish, sea jellies, turtles, and more at the magnificent Monterey Bay Aquarium. Watch the animals swim, glide, and soar, and even take a peek outside the aquarium to see wildlife in its natural habitat. Which animal did you most enjoy visiting?',
            done: true,
          },
          {
            text: 'Climb, click, and spin your way through the National Aquarium in Baltimore. Each level offers a variety of sea life, as well as a rainforest exhibit. Spot fish, sharks, and jellies through their live cams.',
            done: true,
          },
        ],
      },
      {
        name: 'National Parks',
        icon: 'trees',
        color: '#15803D',
        challenge: 'Read with Benny: Winter Reading',
        activities: [
          {
            text: 'Pick a national park and find out which animals live there that live nowhere else.',
            done: true,
          },
          {
            text: 'Read a park ranger interview or blog post. What is the strangest part of the job?',
            done: false,
          },
          {
            text: 'Plan a one-day visit to a national park you could actually get to. What would you do first?',
            done: false,
          },
        ],
      },
      {
        name: 'Zoo',
        icon: 'paw',
        color: '#16A34A',
        challenge: 'Read with Benny: Winter Reading',
        activities: [
          {
            text: 'Watch a zoo live cam for ten minutes and describe what the animals actually did — not what you expected them to do.',
            done: true,
          },
          { text: 'Find out what one zoo animal eats in a day. Were you close?', done: false },
        ],
      },
      {
        name: 'Museums',
        icon: 'building-arch',
        color: '#B43DD0',
        challenge: 'Benny the Bean Reading Challenge',
        activities: [
          {
            text: 'Browse a museum collection online and pick the one object you would most want to see in person. Why that one?',
            done: false,
          },
          {
            text: 'Find a museum within an hour of where you live that you have never visited. What is it known for?',
            done: false,
          },
        ],
      },
      {
        name: 'Space',
        icon: 'rocket',
        color: '#4F46E5',
        challenge: 'Benny the Bean Reading Challenge',
        activities: [
          {
            text: 'Watch a live feed from the International Space Station and write down one thing you saw that surprised you.',
            done: false,
          },
          {
            text: "Read a book or article about a planet you couldn't point to on a map. What is one fact you didn't know?",
            done: false,
          },
          {
            text: 'Find out what time the ISS passes over your town tonight, then go outside and look for it.',
            done: false,
          },
        ],
      },
    ],
    achievements: [
      {
        name: 'Dear Diary Day 2025',
        category: 'literacy',
        date: 'Sep 22, 2025',
        icon: 'notebook',
        color: '#DB2777',
      },
      {
        name: 'National Read a Book Day 2025',
        category: 'literacy',
        date: 'Sep 7, 2025',
        icon: 'book',
        color: '#0D9488',
      },
      {
        name: 'Library Card Sign-Up Month 2025',
        category: 'us',
        date: 'Sep 1, 2025',
        icon: 'barcode',
        color: '#E85648',
      },
    ],
    badges: [
      {
        name: '25 Books | 2025',
        detail: 'Read 25 books',
        kind: 'logging',
        earned: true,
        top: '25',
        mid: 'BOOKS',
        earnedNote: 'Earned for reading 25 books in the 2025 school year',
        year: '2025',
      },
      {
        name: '2,500 Minutes | 2025',
        detail: 'Read 2,500 minutes',
        kind: 'logging',
        earned: true,
        top: '2,500',
        mid: 'MINUTES',
        earnedNote: 'Earned for logging 2,500 minutes in the 2025 school year',
        year: '2025',
      },
      {
        name: '60 Days | 2025',
        detail: 'Log 60 days',
        kind: 'logging',
        earned: true,
        top: '60',
        mid: 'DAYS',
        earnedNote: 'Earned for logging on 60 days in the 2025 school year',
        year: '2025',
      },
      {
        name: '50 Books | 2025',
        detail: 'Read 50 books',
        kind: 'logging',
        earned: false,
        top: '50',
        mid: 'BOOKS',
        year: '2025',
      },
      {
        name: '5,000 Minutes | 2025',
        detail: 'Read 5,000 minutes',
        kind: 'logging',
        earned: false,
        top: '5,000',
        mid: 'MINUTES',
        year: '2025',
      },
      {
        name: 'Book Chatter | 2025',
        detail: 'Finish 10 book talks',
        kind: 'challenge',
        challenge: 'Benny the Bean Reading Challenge',
        earned: false,
        top: '10',
        mid: 'TALKS',
        year: '2025',
      },
      {
        name: 'Cocoa Club | 2025',
        detail: 'Finish 5 books in winter',
        kind: 'challenge',
        challenge: 'Read with Benny: Winter Reading',
        earned: true,
        top: '5',
        mid: 'BOOKS',
        earnedNote: 'Earned for finishing 5 books in Read with Benny: Winter Reading',
        year: '2025',
      },
    ],
    reviews: [
      {
        isbn: '9780689840920',
        title: 'Hatchet',
        author: 'Gary Paulsen',
        date: '05/04/25',
        text: 'I liked this book a lot. Brian has to figure out everything by himself which made me think about what I would do, and honestly I would not have made it past the first week. The part with the porcupine was gross. My favorite part was when he finally got the fire started because you could tell how much it mattered to him.',
      },
      {
        isbn: '9780618662369',
        title: 'The Giver',
        author: 'Lois Lowry',
        date: '02/25/25',
        text: 'This book was confusing at the start because you dont know whats going on but then it all makes sense. I still dont totally get the ending though. My sister says nobody does.',
      },
      {
        isbn: '9780140348101',
        title: 'My Side of the Mountain',
        author: 'Jean Craighead George',
        date: '11/12/24',
        text: 'If you liked Hatchet you will like this one too. There is a falcon!!',
      },
    ],
    textChallenges: [
      {
        challenge: 'Benny the Bean Reading Challenge',
        responses: [
          {
            date: '05/11/25',
            prompt:
              'Look back at everything you read for this challenge. What was the weirdest or most unexpected thing you learned?',
            answer:
              "That Karana's island is real!! It's called San Nicolas Island and there really was a woman who lived there by herself for 18 years.",
          },
          {
            date: '05/01/25',
            prompt: 'Did the critics get it right?',
            answer: 'Kind of? Everyone said Hatchet was scary but I thought it was more sad.',
          },
          {
            date: '04/12/25',
            prompt: 'What did you end up reading about?',
            answer: 'survival',
          },
        ],
      },
      {
        challenge: 'Read with Benny: Winter Reading',
        responses: [
          {
            date: '02/20/25',
            prompt: 'Finally read a book from your TBR pile! Which did you choose?',
            answer: 'The Giver',
          },
          {
            date: '01/30/25',
            prompt: 'How did you find it and why did you pick it?',
            answer:
              'My sister had it from her class last year and the cover looked kind of creepy so I wanted to see what it was about.',
          },
        ],
      },
    ],
    overview: {
      year: {
        motivators: ['Recognition', 'Social Connection'],
        flags: 4,
        daysRead: 74,
        daysPossible: 172,
        lexile: 730,
        lexileDelta: 90,
        currentStreak: 4,
        longestStreak: 6,
        booksCompleted: 11,
        minutes: 1780,
        trend: {
          minutesPct: 21,
          lexile: 90,
          goalDays: 14,
          flags: -3,
          currentStreak: 2,
          longestStreak: 3,
          rmi: 4,
          label: 'vs last year',
        },
      },
      all: {
        motivators: ['Recognition', 'Curiosity'],
        flags: 11,
        daysRead: 138,
        daysPossible: 344,
        lexile: 730,
        lexileDelta: 180,
        currentStreak: 4,
        longestStreak: 9,
        booksCompleted: 19,
        minutes: 3170,
      },
    },
    bennySummary:
      'Anne is building real momentum — **10 of the last 30 days** logged, Lexile **up 50 points since April**, and **flags down from 7 to 4**. Worth a look: **2 unfinished BTWB conversations**.',
    sections: {
      motivation: {
        status: 'Watch',
        intrinsic: 72,
        intrinsicDelta: 7,
        extrinsic: 48,
        extrinsicDelta: -4,
        tileSub: '/ 100 score',
        motivatorInsight: { type: 'clear', top: ['Recognition', 'Social Connection'] },
        rmiHistory: [
          {
            period: 'Apr 25 Index',
            range: '4/15/25–5/15/25',
            intrinsicAvg: 16.4,
            intrinsicMax: 20,
            intrinsicDelta: -5,
            motivationAvg: 28.6,
            motivationMax: 40,
            motivationDelta: 9,
            extrinsicAvg: 12.2,
            extrinsicMax: 20,
            extrinsicDelta: 9,
            readingGoalMinutes: 15,
            bennySummary:
              'Mixed this period. Recognition and Social Connection are her clearest levers, but Enjoyment has slipped — a shoutout buys time while you rebuild the deeper interest.',
            recommendedActions: [
              {
                label: 'Recognition',
                text: 'Recognize Anne for reading accomplishments (like meeting her goal or logging consistently) with a high five or a shoutout.',
              },
              {
                label: 'Social Connection',
                text: "Encourage Anne to use Beanstack's friends and leaderboards functionality.",
              },
            ],
            rankings: [
              { name: 'Recognition', score: 3.4, max: 4, delta: 9 },
              { name: 'Social Connection', score: 3.4, max: 4, delta: 9 },
              { name: 'Compliance', score: 3.3, max: 4, delta: 4 },
              { name: 'Confidence', score: 3.2, max: 4, delta: 6 },
              { name: 'Grades', score: 3.1, max: 4, delta: 3 },
              { name: 'Importance', score: 3.0, max: 4, delta: 5 },
              { name: 'Curiosity', score: 2.9, max: 4, delta: 3 },
              { name: 'Competition', score: 2.7, max: 4, delta: 7 },
              { name: 'Enjoyment', score: 2.5, max: 4, delta: -2 },
              { name: 'Challenge', score: 2.3, max: 4, delta: 4 },
            ],
          },
          {
            period: 'Mar 25 Index',
            range: '3/15/25–4/15/25',
            intrinsicAvg: 17.2,
            intrinsicMax: 20,
            intrinsicDelta: 4,
            motivationAvg: 26.1,
            motivationMax: 40,
            motivationDelta: -3,
            extrinsicAvg: 11.1,
            extrinsicMax: 20,
            extrinsicDelta: -5,
            readingGoalMinutes: 20,
            bennySummary:
              'Steady, but led by Compliance and Recognition while Enjoyment dropped — she may be reading to meet expectations. Give her full choice of her next book, even an easier one.',
            recommendedActions: [
              {
                label: 'Challenge',
                text: "Set a stretch reading goal with Anne — a longer book or a new genre she hasn't tried before.",
              },
              {
                label: 'Enjoyment',
                text: 'Let Anne pick her next book freely to rebuild intrinsic motivation.',
              },
            ],
            rankings: [
              { name: 'Compliance', score: 3.5, max: 4, delta: 6 },
              { name: 'Recognition', score: 3.3, max: 4, delta: 2 },
              { name: 'Grades', score: 3.2, max: 4, delta: 8 },
              { name: 'Social Connection', score: 3.1, max: 4, delta: -1 },
              { name: 'Confidence', score: 3.0, max: 4, delta: 3 },
              { name: 'Challenge', score: 2.8, max: 4, delta: 5 },
              { name: 'Importance', score: 2.7, max: 4, delta: 2 },
              { name: 'Enjoyment', score: 2.6, max: 4, delta: -4 },
              { name: 'Curiosity', score: 2.4, max: 4, delta: -1 },
              { name: 'Competition', score: 2.1, max: 4, delta: 3 },
            ],
          },
          {
            period: 'Feb 25 Index',
            range: '2/15/25–3/15/25',
            intrinsicAvg: 15.8,
            intrinsicMax: 20,
            intrinsicDelta: -8,
            motivationAvg: 24.4,
            motivationMax: 40,
            motivationDelta: -6,
            extrinsicAvg: 10.5,
            extrinsicMax: 20,
            extrinsicDelta: -4,
            readingGoalMinutes: 10,
            bennySummary:
              'Nearly every dimension declined, with Enjoyment at a record low — the harder books may be outpacing her confidence. Ease off difficulty until intrinsic motivation recovers.',
            recommendedActions: [
              {
                label: 'Enjoyment',
                text: "Anne's enjoyment scores have dipped — try connecting reading to topics she genuinely loves.",
              },
              {
                label: 'Confidence',
                text: "Choose books at or slightly below Anne's current Lexile to rebuild reading confidence.",
              },
            ],
            rankings: [
              { name: 'Compliance', score: 3.6, max: 4, delta: 1 },
              { name: 'Grades', score: 3.2, max: 4, delta: 5 },
              { name: 'Recognition', score: 3.1, max: 4, delta: -3 },
              { name: 'Confidence', score: 2.9, max: 4, delta: -4 },
              { name: 'Social Connection', score: 2.8, max: 4, delta: -6 },
              { name: 'Importance', score: 2.6, max: 4, delta: -2 },
              { name: 'Challenge', score: 2.5, max: 4, delta: -1 },
              { name: 'Curiosity', score: 2.3, max: 4, delta: -5 },
              { name: 'Enjoyment', score: 2.2, max: 4, delta: -8 },
              { name: 'Competition', score: 1.9, max: 4, delta: -2 },
            ],
          },
        ],
        actions: [
          {
            title: "Connect Anne's reading to a self-chosen goal",
            body: 'Extrinsic motivation is down 4 points since last index. Building a personal challenge around her top motivators — Recognition and Social Connection — could help rebuild it.',
          },
          {
            title: 'Check in before her next BTWB conversation',
            body: 'Two open reflections remain incomplete. A brief prompt from you before her next log entry could keep her reflection habit on track.',
          },
        ],
      },
      integrity: {
        score: 75,
        status: 'Improving',
        flaggedSessions: 4,
        flagDelta: -3,
        unfinishedConversations: 2,
        talks: {
          engagement: { total: 8, unfinished: 1, positive: 5, mixed: 3, disengaged: 0 },
          comprehension: {
            total: 3,
            unfinished: 1,
            strong: 1,
            developing: 2,
          },
          integrity: { total: 2, unfinished: 0, concerns: 2 },
        },
        tileStat: '4',
        tileSub: 'flags ↓3',
        // 10 most recent of 13 talks; 4 carry flags, matching `flaggedSessions`.
        bookTalks: [
          { date: '05/13/25', title: 'Island of the Blue Dolphins', kind: 'engagement', flags: [] },
          {
            date: '05/10/25',
            title: 'Island of the Blue Dolphins',
            kind: 'comprehension',
            flags: ['btwb-incomplete'],
          },
          {
            date: '05/07/25',
            title: 'Hatchet',
            kind: 'integrity',
            flags: ['time-warning', 'missing-details'],
          },
          { date: '05/02/25', title: 'Hatchet', kind: 'engagement', flags: [] },
          {
            date: '04/28/25',
            title: 'The Giver',
            kind: 'integrity',
            flags: ['book-swap', 'time-warning'],
          },
          { date: '04/22/25', title: 'The Giver', kind: 'engagement', flags: [] },
          {
            date: '04/15/25',
            title: 'Hatchet',
            kind: 'comprehension',
            flags: ['missing-details'],
          },
          { date: '04/10/25', title: 'Hatchet', kind: 'engagement', flags: [] },
          { date: '04/03/25', title: 'Because of Winn-Dixie', kind: 'engagement', flags: [] },
          { date: '03/27/25', title: 'Because of Winn-Dixie', kind: 'comprehension', flags: [] },
        ],
        actions: [
          {
            title: "Review Anne's 2 unfinished BTWB conversations",
            body: "She hasn't completed 2 open reflections. Prompting her to finish them before her next log entry would keep her reflection habit on track.",
          },
          {
            title: 'Watch for time-warning patterns on long sessions',
            body: "3 of Anne's last 8 sessions triggered a time warning. Consider discussing realistic session lengths with her.",
          },
        ],
      },
      habits: {
        score: 85,
        status: 'Strong',
        currentStreak: 4,
        avgStreak: 6,
        personalBest: 6,
        minutesThisWeek: 85,
        minutesDelta: 12,
        booksLogged: 2,
        goalHitRate: 68,
        avgSessionMins: 24,
        daysReadThisMonth: 9,
        daysInMonth: 15,
        longestGap: 3,
        topReadingDay: 'Mondays',
        daysRead30: 10,
        tileStat: '4',
        tileSub: 'day streak',
        dailyGoalMinutes: 20,
        heatmapData: makeHeatmapData(0.63, 'peaky'),
        weeks: [
          {
            label: 'May 11–17',
            current: true,
            days: [
              { day: 'Mon', minutes: 25 },
              { day: 'Tue', minutes: 22 },
              { day: 'Wed', minutes: 0 },
              { day: 'Thu', minutes: 12 },
              { day: 'Fri', minutes: 12 },
              { day: 'Sat', minutes: null },
              { day: 'Sun', minutes: null },
            ],
          },
          {
            label: 'May 4–10',
            current: false,
            days: [
              { day: 'Mon', minutes: 28 },
              { day: 'Tue', minutes: 20 },
              { day: 'Wed', minutes: 0 },
              { day: 'Thu', minutes: 32 },
              { day: 'Fri', minutes: 25 },
              { day: 'Sat', minutes: 0 },
              { day: 'Sun', minutes: 0 },
            ],
          },
          {
            label: 'Apr 27 – May 3',
            current: false,
            days: [
              { day: 'Mon', minutes: 22 },
              { day: 'Tue', minutes: 21 },
              { day: 'Wed', minutes: 19 },
              { day: 'Thu', minutes: 0 },
              { day: 'Fri', minutes: 0 },
              { day: 'Sat', minutes: 25 },
              { day: 'Sun', minutes: 18 },
            ],
          },
        ],
        actions: [
          {
            title: 'Encourage Anne to keep logging consistently',
            body: "She's been steadily building logging days this month. A quick nudge today can help reinforce the habit.",
          },
          {
            title: 'Help Anne hit her daily goal more consistently',
            body: "She's meeting her daily goal on reading days but skipping Wed and Sun regularly. A quick habit check-in could smooth that out.",
          },
        ],
      },
      skills: {
        score: 90,
        status: 'Trending up',
        titles: [
          {
            title: 'Because of Winn-Dixie',
            author: 'Kate DiCamillo',
            lexile: 610,
            genre: 'Adventure',
            sessions: 4,
            current: false,
            isbn: '9780763680862',
          },
          {
            title: 'Number the Stars',
            author: 'Lois Lowry',
            lexile: 670,
            genre: 'Historical',
            sessions: 5,
            current: false,
            isbn: '9780547577098',
          },
          {
            title: 'The Giver',
            author: 'Lois Lowry',
            lexile: 680,
            genre: 'Dystopian',
            sessions: 6,
            current: false,
            isbn: '9780618662369',
          },
          {
            title: 'Hatchet',
            author: 'Gary Paulsen',
            lexile: 720,
            genre: 'Survival',
            sessions: 8,
            current: false,
            isbn: '9780689840920',
          },
          {
            title: 'Island of the Blue Dolphins',
            author: "Scott O'Dell",
            lexile: 750,
            genre: 'Historical',
            sessions: 5,
            current: true,
            isbn: '9780547328614',
          },
        ],
        genreCloud: [
          { genre: 'Survival', count: 14 },
          { genre: 'Historical', count: 9 },
          { genre: 'Dystopian', count: 8 },
          { genre: 'Adventure', count: 5 },
          { genre: 'Fantasy', count: 3 },
          { genre: 'Mystery', count: 2 },
        ],
        recommendedTitles: [
          {
            title: 'My Side of the Mountain',
            author: 'Jean Craighead George',
            lexile: 810,
            genre: 'Survival',
            isbn: '9780140348101',
          },
          {
            title: 'The Phantom Tollbooth',
            author: 'Norton Juster',
            lexile: 780,
            genre: 'Fantasy',
            isbn: '9780394820378',
          },
          {
            title: 'From the Mixed-Up Files…',
            author: 'E.L. Konigsburg',
            lexile: 800,
            genre: 'Mystery',
            isbn: '9780689711817',
          },
        ],
        recommendedRange: '760–800L',
        monthlyAvg: 730,
        monthlyDelta: 50,
        gradeLevel: 800,
        gradeLevelLabel: 'Grade 5–6',
        lexileHistory: [
          { month: 'Jan', avg: 610 },
          { month: 'Feb', avg: 635 },
          { month: 'Mar', avg: 655 },
          { month: 'Apr', avg: 680 },
          { month: 'May', avg: 730 },
        ],
        tileStat: '730L',
        tileSub: '↑50L this month',
        actions: [
          {
            title: 'Suggest titles in the 760–800L range',
            body: "Anne's Lexile average is 730L and rising. She's currently reading at 750L — she's ready for a meaningful step up in challenge.",
          },
          {
            title: 'Explore Survival and Historical titles at her next Lexile level',
            body: 'These are her two dominant genres. Sticking in familiar territory while pushing Lexile is the lowest-friction path to growth.',
          },
        ],
      },
    },
    recommendedActions: [
      {
        title: "Connect Anne's reading to a self-chosen goal",
        body: 'Extrinsic motivation is down 4 pts. Her top motivators are Recognition and Social Connection.',
        section: 'motivation',
      },
      {
        title: "Follow up on Anne's 2 unfinished BTWB conversations",
        body: "She hasn't completed 2 open reflections. A quick prompt before her next log could help.",
        section: 'integrity',
      },
      {
        title: 'Encourage Anne to keep up her logging momentum',
        body: "She's been logging steadily this week. A quick nudge today can reinforce the habit while motivation is up.",
        section: 'habits',
      },
      {
        title: 'Suggest titles in the 760–800L range',
        body: "Anne's Lexile avg is 730L and rising. She's ready for a meaningful step up.",
        section: 'skills',
      },
    ],
  },

  // ── Tyler Voss — Struggling ────────────────────────────────────────────────
  tyler: {
    name: 'Tyler Voss',
    classes: [{ name: 'MWD English 0418 QLM', teacher: 'Sasha Waybright' }],
    avatarColor: '#196DD5',
    // Tyler's over-logging is what a freeze is for: he keeps his profile, but
    // can't log for himself for ten days.
    status: ['frozen', 'offline'],
    grade: '6th Grade',
    lastRun: 'May 15 at 9:55am',
    rewards: [
      {
        name: 'Beanstack Bookmark',
        challenge: 'Benny the Bean Reading Challenge',
        earnedOn: 'Apr 9, 2025',
        redeemed: false,
      },
    ],
    ticketDrawings: [],
    drawingWins: [
      { name: 'Logging Week 2', type: 'All Eligible Readers', place: null, claimed: false },
    ],
    // `profile.points_summary` — the running total per point type. Only the
    // types this reader has actually earned appear; the app's partial switches
    // on whatever keys are present.
    pointsSummary: {
      book: 30,
      page: 60,
      minute: 840,
      day: 28,
      'standard-activity': 20,
      review: 0,
    },
    challenges: [
      {
        name: 'Benny the Bean Reading Challenge',
        // `program.has_ticket_rewards` — the challenges whose drawings the
        // reader spends tickets on, so their rows get the drill-in link.
        hasTicketRewards: true,
        banner: 'benny-bean',
        dates: 'Mar 1, 2025 - May 31, 2025',
        startedOn: 'April 9, 2025',
        minutes: 120,
        status: 'current',
      },
      {
        name: 'Read with Benny: Winter Reading',
        banner: 'winter-reading',
        dates: 'Jan 6, 2025 - Feb 28, 2025',
        startedOn: 'February 14, 2025',
        minutes: 95,
        status: 'ended',
      },
      {
        name: 'Find Your Reading Joy',
        banner: 'summer-reading',
        dates: 'Jun 1, 2025 - Aug 31, 2025',
        // Not started, so no start date and nothing logged — the app's
        // Upcoming tab is challenges the reader is enrolled in that haven't
        // opened yet.
        status: 'upcoming',
      },
    ],
    activityBadges: [
      {
        name: 'Zoo',
        icon: 'paw',
        color: '#16A34A',
        challenge: 'Read with Benny: Winter Reading',
        activities: [
          {
            text: 'Watch a zoo live cam for ten minutes and describe what the animals actually did — not what you expected them to do.',
            done: true,
          },
          { text: 'Find out what one zoo animal eats in a day. Were you close?', done: false },
        ],
      },
      {
        name: 'Aquarium',
        icon: 'fish',
        color: '#0891B2',
        challenge: 'Read with Benny: Winter Reading',
        activities: [
          {
            text: 'Come see the fish, sea jellies, turtles, and more at the magnificent Monterey Bay Aquarium. Watch the animals swim, glide, and soar, and even take a peek outside the aquarium to see wildlife in its natural habitat. Which animal did you most enjoy visiting?',
            done: false,
          },
          {
            text: 'Climb, click, and spin your way through the National Aquarium in Baltimore. Each level offers a variety of sea life, as well as a rainforest exhibit. Spot fish, sharks, and jellies through their live cams.',
            done: false,
          },
        ],
      },
      {
        name: 'Museums',
        icon: 'building-arch',
        color: '#B43DD0',
        challenge: 'Benny the Bean Reading Challenge',
        activities: [
          {
            text: 'Browse a museum collection online and pick the one object you would most want to see in person. Why that one?',
            done: false,
          },
          {
            text: 'Find a museum within an hour of where you live that you have never visited. What is it known for?',
            done: false,
          },
        ],
      },
      {
        name: 'Space',
        icon: 'rocket',
        color: '#4F46E5',
        challenge: 'Benny the Bean Reading Challenge',
        activities: [
          {
            text: 'Watch a live feed from the International Space Station and write down one thing you saw that surprised you.',
            done: false,
          },
          {
            text: "Read a book or article about a planet you couldn't point to on a map. What is one fact you didn't know?",
            done: false,
          },
          {
            text: 'Find out what time the ISS passes over your town tonight, then go outside and look for it.',
            done: false,
          },
        ],
      },
    ],
    achievements: [
      {
        name: 'Library Card Sign-Up Month 2025',
        category: 'us',
        date: 'Sep 1, 2025',
        icon: 'barcode',
        color: '#E85648',
      },
    ],
    badges: [
      {
        name: '5 Books | 2025',
        detail: 'Read 5 books',
        kind: 'logging',
        earned: true,
        top: '5',
        mid: 'BOOKS',
        earnedNote: 'Earned for reading 5 books in the 2025 school year',
        year: '2025',
      },
      {
        name: '10 Books | 2025',
        detail: 'Read 10 books',
        kind: 'logging',
        earned: false,
        top: '10',
        mid: 'BOOKS',
        year: '2025',
      },
      {
        name: '500 Minutes | 2025',
        detail: 'Read 500 minutes',
        kind: 'logging',
        earned: false,
        top: '500',
        mid: 'MINUTES',
        year: '2025',
      },
      {
        name: '30 Days | 2025',
        detail: 'Log 30 days',
        kind: 'logging',
        earned: false,
        top: '30',
        mid: 'DAYS',
        year: '2025',
      },
      {
        name: 'Book Chatter | 2025',
        detail: 'Finish 10 book talks',
        kind: 'challenge',
        challenge: 'Benny the Bean Reading Challenge',
        earned: false,
        top: '10',
        mid: 'TALKS',
        year: '2025',
      },
      {
        name: 'Cocoa Club | 2025',
        detail: 'Finish 5 books in winter',
        kind: 'challenge',
        challenge: 'Read with Benny: Winter Reading',
        earned: true,
        top: '5',
        mid: 'BOOKS',
        earnedNote: 'Earned for finishing 5 books in Read with Benny: Winter Reading',
        year: '2025',
      },
    ],
    reviews: [
      {
        isbn: '9780374332662',
        title: 'Holes',
        author: 'Louis Sachar',
        date: '05/09/25',
        text: 'it was good',
      },
      {
        isbn: '9780545581608',
        title: 'Dog Man',
        author: 'Dav Pilkey',
        date: '03/06/25',
        text: 'funny. I read all of them already but this one is the best one',
      },
    ],
    // Tyler answers the prompts, but barely — the same low-effort pattern as his
    // unfinished book talks.
    textChallenges: [
      {
        challenge: 'Benny the Bean Reading Challenge',
        responses: [
          {
            date: '05/12/25',
            prompt:
              'Look back at everything you read for this challenge. What was the weirdest or most unexpected thing you learned?',
            answer: 'idk',
          },
          { date: '05/03/25', prompt: 'What did you read?', answer: 'Holes' },
          { date: '04/24/25', prompt: 'Did the critics get it right?', answer: 'yes' },
        ],
      },
      {
        challenge: 'Read with Benny: Winter Reading',
        responses: [
          {
            date: '02/18/25',
            prompt: 'Finally read a book from your TBR pile! Which did you choose?',
            answer: 'the one and only ivan. my teacher picked it',
          },
        ],
      },
    ],
    overview: {
      year: {
        motivators: null,
        flags: 13,
        daysRead: 26,
        daysPossible: 172,
        lexile: 510,
        lexileDelta: -20,
        currentStreak: 0,
        longestStreak: 3,
        booksCompleted: 3,
        minutes: 470,
        trend: {
          minutesPct: -58,
          lexile: -20,
          goalDays: -12,
          flags: 9,
          currentStreak: -4,
          longestStreak: -2,
          rmi: -11,
          label: 'vs last year',
        },
      },
      all: {
        motivators: null,
        flags: 24,
        daysRead: 61,
        daysPossible: 344,
        lexile: 510,
        lexileDelta: 40,
        currentStreak: 0,
        longestStreak: 5,
        booksCompleted: 7,
        minutes: 1040,
      },
    },
    bennySummary:
      'Tyler needs attention now: **no logged reading in 30 days**, the only such student in the class. Lexile is **down 15 points since March** and **13 flagged sessions** make his data unreliable. A one-on-one this week is the highest-impact thing available.',
    sections: {
      motivation: {
        status: 'Watch',
        intrinsic: 32,
        intrinsicDelta: -8,
        extrinsic: 44,
        extrinsicDelta: -5,
        tileSub: '/ 100 score',
        motivatorInsight: { type: 'mystery' },
        rmiHistory: [
          {
            period: 'Apr 25 Index',
            range: '4/15/25–5/15/25',
            intrinsicAvg: 6.1,
            intrinsicMax: 20,
            intrinsicDelta: -4,
            motivationAvg: 15.2,
            motivationMax: 40,
            motivationDelta: -6,
            extrinsicAvg: 8.8,
            extrinsicMax: 20,
            extrinsicDelta: -3,
            readingGoalMinutes: 10,
            bennySummary:
              'Critically low across **all 10 dimensions**, with Enjoyment — the strongest predictor of long-term engagement — at **0.8 of 4** and nothing extrinsic compensating. Ask him what he actually finds interesting, away from school expectations.',
            recommendedActions: [
              {
                label: 'Find the Hook',
                text: 'Ask Tyler to name one topic he genuinely cares about — gaming, sports, comics — and find books that connect to it.',
              },
              {
                label: 'Reduce Pressure',
                text: "Tyler's extrinsic motivators (Grades, Compliance) are bottoming out. Consider reducing assessment pressure around reading and focusing on enjoyment first.",
              },
            ],
            rankings: [
              { name: 'Compliance', score: 2.2, max: 4, delta: -3 },
              { name: 'Grades', score: 2.0, max: 4, delta: -5 },
              { name: 'Recognition', score: 1.9, max: 4, delta: -2 },
              { name: 'Social Connection', score: 1.7, max: 4, delta: -4 },
              { name: 'Confidence', score: 1.5, max: 4, delta: -6 },
              { name: 'Competition', score: 1.4, max: 4, delta: -1 },
              { name: 'Importance', score: 1.3, max: 4, delta: -3 },
              { name: 'Challenge', score: 1.1, max: 4, delta: -4 },
              { name: 'Curiosity', score: 0.9, max: 4, delta: -5 },
              { name: 'Enjoyment', score: 0.8, max: 4, delta: -7 },
            ],
          },
          {
            period: 'Mar 25 Index',
            range: '3/15/25–4/15/25',
            intrinsicAvg: 8.5,
            intrinsicMax: 20,
            intrinsicDelta: -3,
            motivationAvg: 18.8,
            motivationMax: 40,
            motivationDelta: -4,
            extrinsicAvg: 10.4,
            extrinsicMax: 20,
            extrinsicDelta: -2,
            readingGoalMinutes: 15,
            bennySummary:
              "Already low here and sliding since. Compliance and Grades are his only live motivators and both are weakening — he's reading because he feels he has to. Start by handing him full choice of his next book.",
            recommendedActions: [
              {
                label: 'Choice',
                text: "Give Tyler full control over his next book selection — even if it's below grade level. Agency can jumpstart motivation.",
              },
              {
                label: 'Momentum',
                text: 'Focus on completing short books successfully rather than challenging Tyler with long texts he may not finish.',
              },
            ],
            rankings: [
              { name: 'Compliance', score: 2.8, max: 4, delta: -1 },
              { name: 'Grades', score: 2.5, max: 4, delta: -2 },
              { name: 'Recognition', score: 2.2, max: 4, delta: -3 },
              { name: 'Social Connection', score: 2.0, max: 4, delta: -2 },
              { name: 'Confidence', score: 1.9, max: 4, delta: -4 },
              { name: 'Competition', score: 1.8, max: 4, delta: 1 },
              { name: 'Importance', score: 1.7, max: 4, delta: -2 },
              { name: 'Challenge', score: 1.5, max: 4, delta: -3 },
              { name: 'Curiosity', score: 1.4, max: 4, delta: -2 },
              { name: 'Enjoyment', score: 1.3, max: 4, delta: -4 },
            ],
          },
        ],
        actions: [
          {
            title: 'Have a one-on-one conversation with Tyler about reading',
            body: 'His motivation scores are critically low across all 10 dimensions. System nudges alone will not be enough — personal connection is essential at this level.',
          },
          {
            title: 'Find one book Tyler will actually want to read',
            body: 'Ask Tyler directly what topics excite him outside school. A single book he chooses and finishes can reset the motivation spiral.',
          },
        ],
      },
      integrity: {
        score: 40,
        status: 'Watch',
        flaggedSessions: 13,
        flagDelta: 5,
        unfinishedConversations: 7,
        talks: {
          engagement: { total: 5, unfinished: 3, positive: 1, mixed: 2, disengaged: 2 },
          comprehension: {
            total: 2,
            unfinished: 2,
            strong: 0,
            developing: 2,
          },
          integrity: { total: 6, unfinished: 2, concerns: 5 },
        },
        tileStat: '13',
        tileSub: 'flags ↑5',
        // Tyler's talks skew to integrity triggers and almost all carry flags —
        // the one clean row keeps the "No flags" filter honest for him too.
        bookTalks: [
          {
            date: '05/13/25',
            title: 'Holes',
            kind: 'integrity',
            flags: ['over-limit', 'missing-details'],
          },
          {
            date: '05/10/25',
            title: 'Holes',
            kind: 'engagement',
            flags: ['over-limit', 'btwb-incomplete'],
          },
          {
            date: '05/08/25',
            title: 'Holes',
            kind: 'integrity',
            flags: ['over-limit', 'time-warning', 'btwb-incomplete'],
          },
          {
            date: '04/30/25',
            title: 'The One and Only Bob',
            kind: 'comprehension',
            flags: ['missing-details', 'btwb-incomplete'],
          },
          {
            date: '04/25/25',
            title: 'The One and Only Bob',
            kind: 'integrity',
            flags: ['over-limit'],
          },
          { date: '04/22/25', title: 'The One and Only Bob', kind: 'engagement', flags: [] },
          {
            date: '04/18/25',
            title: 'The One and Only Ivan',
            kind: 'integrity',
            flags: ['time-warning', 'btwb-incomplete'],
          },
          {
            date: '04/10/25',
            title: 'The One and Only Ivan',
            kind: 'comprehension',
            flags: ['missing-details', 'btwb-incomplete'],
          },
          {
            date: '04/02/25',
            title: 'The One and Only Ivan',
            kind: 'integrity',
            flags: ['over-limit', 'time-warning'],
          },
        ],
        actions: [
          {
            title: 'Address the over-logging pattern directly',
            body: "6 of 13 flags are suspected over-logs. Tyler's reading data is likely inflated. A brief conversation about honest logging — framed positively — is needed before any skill assessment is meaningful.",
          },
          {
            title: "Review Tyler's 7 unfinished BTWB conversations",
            body: 'He has the most incomplete reflections in the class. Consider simplifying the prompts or doing one verbally to rebuild the habit.',
          },
        ],
      },
      habits: {
        score: 30,
        status: 'Watch',
        currentStreak: 0,
        avgStreak: 2,
        personalBest: 3,
        minutesThisWeek: 0,
        minutesDelta: -30,
        booksLogged: 0,
        goalHitRate: 0,
        avgSessionMins: 18,
        daysReadThisMonth: 0,
        daysInMonth: 15,
        longestGap: 30,
        topReadingDay: 'Thursdays',
        daysRead30: 0,
        tileStat: '0',
        tileSub: 'day streak',
        dailyGoalMinutes: 15,
        heatmapData: makeHeatmapData(0.18, 'sporadic'),
        weeks: [
          {
            label: 'May 11–17',
            current: true,
            days: [
              { day: 'Mon', minutes: 0 },
              { day: 'Tue', minutes: 0 },
              { day: 'Wed', minutes: 0 },
              { day: 'Thu', minutes: 0 },
              { day: 'Fri', minutes: 0 },
              { day: 'Sat', minutes: null },
              { day: 'Sun', minutes: null },
            ],
          },
          {
            label: 'May 4–10',
            current: false,
            days: [
              { day: 'Mon', minutes: 0 },
              { day: 'Tue', minutes: 22 },
              { day: 'Wed', minutes: 0 },
              { day: 'Thu', minutes: 0 },
              { day: 'Fri', minutes: 0 },
              { day: 'Sat', minutes: 0 },
              { day: 'Sun', minutes: 0 },
            ],
          },
          {
            label: 'Apr 27 – May 3',
            current: false,
            days: [
              { day: 'Mon', minutes: 0 },
              { day: 'Tue', minutes: 0 },
              { day: 'Wed', minutes: 0 },
              { day: 'Thu', minutes: 0 },
              { day: 'Fri', minutes: 19 },
              { day: 'Sat', minutes: 0 },
              { day: 'Sun', minutes: 0 },
            ],
          },
        ],
        actions: [
          {
            title: 'Set a micro-goal Tyler can actually hit — 3 days this week',
            body: 'Tyler averaged less than 1 logged day per week last month. Rather than raising the bar, focus on showing up at all — even briefly.',
          },
          {
            title: "Check in personally — a system nudge won't work here",
            body: 'Tyler has been unresponsive to automated reminders for 6 weeks. A direct personal conversation is the only reliable intervention at this engagement level.',
          },
        ],
      },
      skills: {
        score: 35,
        status: 'Watch',
        titles: [
          {
            title: 'Dog Man: Fetch-22',
            author: 'Dav Pilkey',
            lexile: 390,
            genre: 'Graphic Novel',
            sessions: 3,
            current: false,
            isbn: '9781338323214',
          },
          {
            title: 'Sarah, Plain and Tall',
            author: 'Patricia MacLachlan',
            lexile: 560,
            genre: 'Historical',
            sessions: 2,
            current: false,
            isbn: '9780064402057',
          },
          {
            title: 'The One and Only Ivan',
            author: 'Katherine Applegate',
            lexile: 570,
            genre: 'Adventure',
            sessions: 2,
            current: false,
            isbn: '9780062291639',
          },
          {
            title: 'The One and Only Bob',
            author: 'Katherine Applegate',
            lexile: 530,
            genre: 'Adventure',
            sessions: 2,
            current: false,
            isbn: '9780062991577',
          },
          {
            title: 'Holes',
            author: 'Louis Sachar',
            lexile: 660,
            genre: 'Adventure',
            sessions: 1,
            current: true,
            isbn: '9780374332662',
          },
        ],
        genreCloud: [
          { genre: 'Adventure', count: 5 },
          { genre: 'Humor', count: 3 },
          { genre: 'Mystery', count: 1 },
        ],
        recommendedTitles: [
          {
            title: 'Big Nate: In a Class by Himself',
            author: 'Lincoln Peirce',
            lexile: 560,
            genre: 'Humor',
            isbn: '9780061944352',
          },
          {
            title: 'Dog Man',
            author: 'Dav Pilkey',
            lexile: 520,
            genre: 'Humor',
            isbn: '9780545581608',
          },
          {
            title: 'Diary of a Wimpy Kid',
            author: 'Jeff Kinney',
            lexile: 950,
            genre: 'Humor',
            isbn: '9780810993136',
          },
        ],
        recommendedRange: '530–570L',
        monthlyAvg: 510,
        monthlyDelta: -15,
        gradeLevel: 800,
        gradeLevelLabel: 'Grade 6',
        lexileHistory: [
          { month: 'Jan', avg: 570 },
          { month: 'Feb', avg: 555 },
          { month: 'Mar', avg: 540 },
          { month: 'Apr', avg: 525 },
          { month: 'May', avg: 510 },
        ],
        tileStat: '510L',
        tileSub: '↓15L this month',
        actions: [
          {
            title: 'Move to books Tyler will actually finish',
            body: "His Lexile is declining. Books at 520–560L where he can build fluency and confidence will do more than aspirational titles he doesn't engage with.",
          },
          {
            title: 'Address integrity flags before trusting skill data',
            body: 'Tyler has 13 flagged sessions including 6 suspected over-logs. His true Lexile level may not be reflected in the data until logging integrity improves.',
          },
        ],
      },
    },
    recommendedActions: [
      {
        title: 'Intervene directly — Tyler needs a one-on-one conversation',
        body: 'Across all four health indicators, Tyler is in the bottom tier of the class. A personal check-in this week is the highest-impact action.',
        section: 'motivation',
      },
      {
        title: 'Investigate the 13 flagged sessions before trusting reading data',
        body: "Suspected over-logging means Tyler's numbers may not reflect actual reading. Address integrity first.",
        section: 'integrity',
      },
      {
        title: 'Set a micro-goal: just 3 days logged this week',
        body: 'Tyler has logged 1 day this week. Rather than raising the bar, focus on showing up consistently — even briefly.',
        section: 'habits',
      },
      {
        title: 'Switch to lower-Lexile titles Tyler will actually complete',
        body: "Tyler's Lexile is declining. Books at 520–560L will build fluency and confidence better than aspirational titles.",
        section: 'skills',
      },
    ],
  },
}

// ─── Class table data ─────────────────────────────────────────────────────────
// `goal` is deliberately absent — it lives in BeanstackProfile's `goals` state so
// the table and the profile's Habits tab can never disagree about it.
const CLASS_TABLE = [
  {
    key: 'marcus',
    rank: 1,
    avg: 98,
    ac: 'blue',
    days: [true, true, true, true, null, null, true],
  },
  {
    key: 'anne',
    rank: 2,
    avg: 73,
    ac: 'blue',
    days: [true, true, null, true, '24%', null, null],
  },
  {
    key: 'tyler',
    rank: 3,
    avg: 31,
    ac: 'red',
    days: ['18%', null, null, null, null, null, null],
  },
  // The rest of the roster. These rows carry their own `name` / `goal` because
  // there's no built-out profile behind them — only Marcus, Anne and Tyler have
  // one, so only their rows open the quick look. Everything else on the row
  // renders identically, which is the point: the table needs a realistic
  // number of rows to design against.
  {
    key: 'priya',
    name: 'Priya Shah',
    goal: 20,
    rank: 4,
    avg: 91,
    ac: 'blue',
    days: [true, true, true, '82%', true, null, null],
  },
  {
    key: 'devon',
    name: 'Devon Brooks',
    goal: 20,
    rank: 5,
    avg: 88,
    ac: 'blue',
    days: [true, '76%', true, true, true, null, null],
  },
  {
    key: 'mei',
    name: 'Mei Tanaka',
    goal: 15,
    rank: 6,
    avg: 84,
    ac: 'blue',
    days: [true, true, true, null, true, null, '67%'],
  },
  {
    key: 'omar',
    name: 'Omar Haddad',
    goal: 30,
    rank: 7,
    avg: 79,
    ac: 'blue',
    days: [true, true, '58%', true, null, null, null],
  },
  {
    key: 'sofia',
    name: 'Sofía Reyes',
    goal: 15,
    rank: 8,
    avg: 71,
    ac: 'blue',
    days: ['64%', true, true, null, '55%', null, null],
  },
  {
    key: 'liam',
    name: 'Liam O’Donnell',
    goal: 20,
    rank: 9,
    avg: 66,
    ac: 'blue',
    days: [true, '48%', null, true, '61%', null, null],
  },
  {
    key: 'ava',
    name: 'Ava Nwosu',
    goal: 15,
    rank: 10,
    avg: 58,
    ac: 'orange',
    days: ['52%', null, true, '44%', null, null, null],
  },
  {
    key: 'noah',
    name: 'Noah Feldman',
    goal: 20,
    rank: 11,
    avg: 49,
    ac: 'orange',
    days: ['41%', '38%', null, null, '68%', null, null],
  },
  {
    key: 'zara',
    name: 'Zara Mahmood',
    goal: 15,
    rank: 12,
    avg: 42,
    ac: 'orange',
    days: [null, '35%', '49%', null, null, null, null],
  },
  {
    key: 'jonah',
    name: 'Jonah Whitfield',
    goal: 30,
    rank: 13,
    avg: 24,
    ac: 'red',
    days: ['22%', null, null, '26%', null, null, null],
  },
]

// ─── Reading Log ──────────────────────────────────────────────────────────────
// Sessions the reading log can open. There is **one** session modal in this
// repo — Sessions for Review's — so these are shaped the way it expects: a
// session may carry flags, a book talk (`conversation`), both, or neither.
// Sessions with a book talk are the ones that surface on the Book Talks tab.
// A log entry with no key here still opens; it just has details and nothing else.
// A book talk row *is* a session. Building it here rather than picking an
// unrelated SFR fixture by row index is what makes the Book Talks tab and the
// reading log agree: both open the same object, and a flag removed in one is
// gone in the other.
/* The app's Flagged Entries table carries an engagement rating and a positive-
   flag set per row. Our talk fixtures predate both columns, so they're derived
   here rather than hand-authored eight times over: an integrity talk has no
   rating to give (the app shows `N/A`), a talk that drew a concern reads Mixed,
   and a clean talk reads Positive with the signals that earned it. */
const TALK_POS_BY_KIND = {
  engagement: ['positive-sentiment', 'answer-length'],
  comprehension: ['references-details', 'answer-length'],
  integrity: [],
}

function talkRating(talk) {
  if (talk.rating) return talk.rating
  if (talk.kind === 'integrity') return null
  return talk.flags.length ? 'mixed' : 'positive'
}

function talkPosFlags(talk) {
  if (talk.posFlags) return talk.posFlags
  if (talk.kind === 'integrity' || talk.flags.length) return []
  return TALK_POS_BY_KIND[talk.kind] ?? []
}

function talkSession(talk, student, i) {
  const kindRating = { engagement: 'green', comprehension: 'green', integrity: null }
  return {
    id: `talk-${student.key ?? 'x'}-${i}`,
    date: `20${talk.date.slice(6)}-${talk.date.slice(0, 2)}-${talk.date.slice(3, 5)}`,
    dateLabel: talk.date,
    type: talk.kind === 'integrity' ? 'flagged' : 'engagement',
    kind: talk.kind,
    status: 'completed',
    challenge: 'Benny the Bean Reading Challenge',
    minutesLogged: 20 + ((i * 7) % 25),
    engagementRating: kindRating[talk.kind] ?? null,
    book: { title: talk.title, author: BOOK_AUTHORS[talk.title] ?? '', color: '#0D9488' },
    flags: talk.flags.map((f, fi) => ({
      id: `tf-${i}-${fi}`,
      type: f,
      label: SESSION_FLAGS[f]?.label ?? f,
      description: SESSION_FLAG_DESCS[f] ?? '',
    })),
    positiveFlags: talkPosFlags(talk).map((f, fi) => ({
      id: `tp-${i}-${fi}`,
      type: f,
      label: POS_FLAG_DESCS[f]?.label ?? f,
      description: POS_FLAG_DESCS[f]?.desc ?? '',
    })),
    conversation: TALK_CONVERSATION(talk, student),
    changeLog: [
      {
        id: `tc-${i}`,
        label: 'Book talk completed',
        icon: 'circle-check',
        color: '#0BA85F',
        by: 'Benny',
        at: talk.date,
      },
    ],
    student,
  }
}

const BOOK_AUTHORS = {
  'The Hobbit': 'J.R.R. Tolkien',
  'A Wrinkle in Time': "Madeleine L'Engle",
  "Ender's Game": 'Orson Scott Card',
  'Fahrenheit 451': 'Ray Bradbury',
  'Island of the Blue Dolphins': "Scott O'Dell",
  Holes: 'Louis Sachar',
  Hatchet: 'Gary Paulsen',
  'The Giver': 'Lois Lowry',
  Wonder: 'R.J. Palacio',
  "Charlotte's Web": 'E.B. White',
}

const SESSION_FLAG_DESCS = {
  'time-warning': 'The conversation took much longer than this reader usually takes.',
  'book-swap': 'The book on this session changed after logging.',
  'btwb-incomplete': 'The reader left the conversation before finishing it.',
  'missing-details': "The reader couldn't recall specific events or characters.",
  'over-limit': "The minutes logged exceeded your site's logging warning.",
}

// A short talk in the reader's own register — enough to read as a real
// conversation without authoring eight transcripts by hand.
const TALK_CONVERSATION = (talk, student) => {
  const first = student.name.split(' ')[0]
  const opener = {
    engagement: `Hi ${first}! What did you think of ${talk.title}?`,
    comprehension: `Hi ${first}! What was ${talk.title} really about, in your own words?`,
    integrity: `Hi ${first}! Tell me about your reading session for ${talk.title}.`,
  }[talk.kind]
  return [
    { role: 'benny', text: opener },
    { role: 'student', text: TALK_ANSWERS[talk.kind]?.[0] ?? 'It was good.' },
    { role: 'benny', text: 'What made you say that?' },
    {
      role: 'student',
      text: TALK_ANSWERS[talk.kind]?.[1] ?? 'I liked it.',
      flagged: talk.flags.length > 0,
    },
  ]
}

const TALK_ANSWERS = {
  engagement: [
    'i really liked it, especially the middle part where everything goes wrong',
    'because you think you know what happens next and then it doesnt go that way at all',
  ],
  comprehension: [
    "it's about someone figuring out where they belong",
    'the main character keeps trying to fit in and then realises they dont have to',
  ],
  integrity: ['idk it was fine', 'i read it'],
}

const RL_SESSIONS = {
  'Fifteen Hundred Miles from the Sun': {
    id: 'rl-sess-1',
    date: '2024-07-16',
    type: 'flagged',
    status: 'completed',
    challenge: 'Summer Reading 2026',
    minutesLogged: 1000,
    engagementRating: null,
    book: {
      title: 'Fifteen Hundred Miles from the Sun',
      author: 'Jonny Garza Villa',
      color: '#B45309',
      isbn: '9781510763128',
    },
    flags: [
      {
        id: 'rf1',
        type: 'exceeded-warning',
        label: 'Exceeded Warning',
        description: "The number of minutes logged exceeded your site's logging warning.",
      },
    ],
    positiveFlags: [],
    conversation: [],
    changeLog: [
      {
        id: 'rc1',
        label: 'Session flagged',
        icon: 'flag',
        color: '#E85648',
        by: 'Benny',
        at: 'Jul 16, 8:02 PM',
      },
    ],
  },
  Snapdragon: {
    id: 'rl-sess-2',
    date: '2024-07-11',
    type: 'flagged',
    status: 'completed',
    challenge: 'Summer Reading 2026',
    minutesLogged: 512,
    engagementRating: null,
    book: { title: 'Snapdragon', author: 'Kat Leyh', color: '#B43DD0', isbn: '9781250312846' },
    flags: [
      {
        id: 'rf2',
        type: 'exceeded-warning',
        label: 'Exceeded Warning',
        description: "512 minutes in one sitting is above this site's logging warning.",
      },
      {
        id: 'rf3',
        type: 'slow-response',
        label: 'Took a While to Respond',
        description: 'Took over one minute to respond.',
      },
    ],
    positiveFlags: [],
    conversation: [],
    changeLog: [
      {
        id: 'rc2',
        label: 'Session flagged',
        icon: 'flag',
        color: '#E85648',
        by: 'Benny',
        at: 'Jul 11, 7:41 PM',
      },
    ],
  },
  Found: {
    id: 'rl-sess-3',
    date: '2024-07-16',
    type: 'engagement',
    status: 'completed',
    challenge: 'Summer Reading 2026',
    minutesLogged: 23,
    engagementRating: 'green',
    book: {
      title: 'Found',
      author: 'Margaret Peterson Haddix',
      color: '#0D9488',
      isbn: '9781416954170',
    },
    flags: [],
    positiveFlags: [
      {
        id: 'rp1',
        type: 'key-idea',
        label: 'Accurate Key Idea',
        description: 'Named a real idea from the book rather than a plot summary.',
      },
      {
        id: 'rp2',
        type: 'connection',
        label: 'Draws Connections',
        description: 'Connected the book to something outside it.',
      },
    ],
    conversation: [
      {
        role: 'benny',
        text: "Hi! It looks like you're reading Found. How far in are you?",
      },
      { role: 'student', text: "I'm about halfway" },
      { role: 'benny', text: 'What did you like about the book so far?' },
      {
        role: 'student',
        text: 'the ending!! i did NOT see it coming. i had to go back and read the last chapter twice',
      },
      { role: 'benny', text: 'Would you recommend it to a friend?' },
      {
        role: 'student',
        text: 'yes definitely. my friend likes mysteries and this is kind of a mystery but with a twist',
      },
      {
        role: 'benny',
        text: 'Wonderful! Thank you for sharing. Your thoughts about Found were very interesting.',
      },
    ],
    changeLog: [
      {
        id: 'rc3',
        label: 'Book talk completed',
        icon: 'circle-check',
        color: '#0BA85F',
        by: 'Benny',
        at: 'Jul 16, 5:20 PM',
      },
    ],
  },
}

const RL_DATA = [
  {
    weekLabel: 'July 14–20',
    days: [
      {
        date: 16,
        day: 'Tuesday',
        streak: 1,
        entries: [
          // Logged straight from Comics Plus — the reader borrowed and read it
          // there, and the session arrived in Beanstack on its own.
          {
            title: 'Lumberjanes, Vol. 1',
            author: 'Noelle Stevenson',
            amount: '35 Minutes',
            flagged: false,
            lexile: 'GN340L',
            source: 'comicsplus',
          },
          // Also a book talk — opening this row and opening its row on the Book
          // Talks tab land on the same session.
          {
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            amount: '20 Minutes',
            flagged: false,
            lexile: '1000L',
          },
          {
            title: 'Fifteen Hundred Miles from the Sun',
            author: 'Jonny Garza Villa',
            amount: '1,000 Minutes',
            flagged: true,
            lexile: 'HL610L',
          },
          {
            title: 'Found',
            author: 'Margaret Peterson Haddix',
            amount: '23 Minutes',
            flagged: false,
            lexile: '700L',
          },
          { title: 'Found', author: 'Margaret Peterson Haddix', completed: true, lexile: '700L' },
        ],
      },
      { date: 15, day: 'Monday', entries: [] },
      { date: 14, day: 'Sunday', entries: [] },
    ],
  },
  {
    weekLabel: 'July 7–13',
    days: [
      { date: 13, day: 'Saturday', entries: [] },
      { date: 12, day: 'Friday', entries: [] },
      {
        date: 11,
        day: 'Thursday',
        streak: 2,
        entries: [
          {
            title: 'Mighty Jack',
            author: 'Ben Hatke',
            amount: 'Completed',
            completed: true,
            lexile: 'GN320L',
            source: 'comicsplus',
          },
          {
            title: 'Snapdragon',
            author: 'Kat Leyh',
            amount: '512 Minutes',
            flagged: true,
            lexile: 'GN390L',
          },
          { title: 'Snapdragon', author: 'Kat Leyh', completed: true, lexile: 'GN390L' },
        ],
      },
      {
        date: 10,
        day: 'Wednesday',
        streak: 1,
        entries: [
          {
            title: 'Found',
            author: 'Margaret Peterson Haddix',
            amount: '18 Minutes',
            flagged: false,
            lexile: '700L',
          },
        ],
      },
      { date: 9, day: 'Tuesday', entries: [] },
      { date: 8, day: 'Monday', entries: [] },
      { date: 7, day: 'Sunday', entries: [] },
    ],
  },
  {
    weekLabel: 'July 1–6',
    days: [
      {
        date: 6,
        day: 'Saturday',
        streak: 2,
        entries: [
          {
            title: 'Fifteen Hundred Miles from the Sun',
            author: 'Jonny Garza Villa',
            amount: '921 Minutes',
            flagged: true,
            lexile: 'HL610L',
          },
        ],
      },
      {
        date: 5,
        day: 'Friday',
        streak: 1,
        entries: [
          {
            title: 'Percy Jackson and the Olympians #1: The Lightning Thief',
            author: 'Rick Riordan',
            amount: '34 Pages',
            flagged: false,
          },
        ],
      },
      { date: 4, day: 'Thursday', entries: [] },
      { date: 3, day: 'Wednesday', entries: [] },
      { date: 2, day: 'Tuesday', entries: [] },
      {
        date: 1,
        day: 'Monday',
        streak: 2,
        entries: [{ title: 'Holes', author: 'Louis Sachar', amount: '677 Pages', flagged: true }],
      },
    ],
  },
]

// ─── Reading Log page ─────────────────────────────────────────────────────────
// Entry state drives the card's colour: finished books read red with a
// Completed pill, integrity-flagged sessions amber, everything else blue.
// The marks a log entry advertises: what opening it will show. Derived once and
// shared, because the calendar card and the table row have to agree — a flag
// visible in one view and missing in the other reads as a data bug.
function rlMarks(entry, session) {
  return [
    session?.flags?.length && {
      key: 'flag',
      // The flag's own drawing, the same art the Book Talks table shows for it
      // — a session flagged for time reads as the time drawing in both places.
      flagType: session.flags[0].type ?? session.flags[0],
      flagFallback: 'negative',
      className: 'bp-rl-mark bp-rl-mark--neg',
      label: session.flags.length === 1 ? session.flags[0].label : `${session.flags.length} flags`,
    },
    session?.positiveFlags?.length && {
      key: 'pos',
      flagType: session.positiveFlags[0].type ?? session.positiveFlags[0],
      flagFallback: 'positive',
      className: 'bp-rl-mark bp-rl-mark--pos',
      label:
        session.positiveFlags.length === 1
          ? session.positiveFlags[0].label
          : `${session.positiveFlags.length} positive flags`,
    },
    session?.conversation?.length && {
      // No product art for "there is a talk here" — the flag set covers what a
      // talk was flagged *for*, not that it happened — so this one stays a
      // glyph.
      key: 'talk',
      icon: 'message-chatbot',
      className: 'bp-rl-mark bp-rl-mark--talk',
      label: 'Book talk with Benny',
    },
  ].filter(Boolean)
}

function RLMarks({ marks, entry, onOpen }) {
  return marks.map((m) => (
    <Tooltip key={m.key} content={m.label}>
      <button
        type="button"
        className={`row-action ${m.className}`}
        onClick={() => onOpen?.(entry)}
        aria-label={m.label}
      >
        {m.flagType ? (
          <FlagIcon type={m.flagType} fallback={m.flagFallback} size={20} />
        ) : (
          /* A book talk is a talk *with Benny*, so it's Benny who marks it —
             the flag set has art for what a talk was flagged for, not for the
             fact of one happening. */
          <img className="bp-rl-benny" src="/bs-prototypes/benny-happy.svg" alt="" />
        )}
      </button>
    </Tooltip>
  ))
}

// Where the session came from. A partner-logged session isn't something the
// reader typed in — it arrived from the app they read in.
function RLSource({ source }) {
  if (!source || !PARTNER_BRANDS[source]) return null
  return (
    <Tooltip content={`Logged from ${PARTNER_BRANDS[source].name}`}>
      <span className="bp-rl-source" style={{ '--bp-mark-bg': PARTNER_BRANDS[source].accent }}>
        <PartnerMark id={source} size={18} />
      </span>
    </Tooltip>
  )
}

function RLEntryMenu() {
  return (
    <Flyout
      placement="bottom-end"
      trigger={({ toggle }) => (
        <RowAction icon="dots" label="Entry actions" tooltip={false} onClick={toggle} />
      )}
    >
      {({ close }) => (
        <DropdownMenu
          items={[
            { label: 'Edit', icon: <Icon name="pencil" size={15} /> },
            { label: 'Remove', icon: <Icon name="trash" size={15} />, danger: true },
          ]}
          onClose={close}
        />
      )}
    </Flyout>
  )
}

function RLEntryCard({ entry, onOpen, talkFor }) {
  // Completed and flagged come first: they're what a reviewer is scanning for,
  // and a session's provenance shouldn't outrank the state of it. Below them,
  // a partner-logged session gets its own green — reading that arrived from the
  // app the reader was reading in, rather than typed into Beanstack.
  const tone = entry.completed
    ? ' bp-rl-entry--completed'
    : entry.flagged
      ? ' bp-rl-entry--flagged'
      : entry.source
        ? ' bp-rl-entry--partner'
        : ''
  const session = RL_SESSIONS[entry.title] ?? talkFor?.(entry.title)
  const marks = rlMarks(entry, session)

  return (
    <div className={`bp-rl-entry${tone}`}>
      <div className="bp-rl-entry-top">
        {/* The title opens the session — flags and any book talk live there, not
            squeezed into the log row. */}
        <button type="button" className="bp-rl-entry-title" onClick={() => onOpen?.(entry)}>
          {entry.title}
        </button>
        {/* One cluster, one grid: where the session came from, what's on it,
            and what you can do to it. The partner mark used to sit alone in
            the card's foot, which read as a stray badge on a second row
            whenever the entry had no marks of its own. */}
        <RowActions className="bp-rl-entry-menu">
          <RLSource source={entry.source} />
          <RLMarks marks={marks} entry={entry} onOpen={onOpen} />
          <RLEntryMenu />
        </RowActions>
      </div>
      <div className="bp-rl-entry-author">{entry.author}</div>
      <div className="bp-rl-entry-foot">
        {entry.completed ? (
          <span className="bp-rl-completed">Completed</span>
        ) : (
          <div className="bp-rl-entry-amount">{entry.amount}</div>
        )}
        {/* Beside what was logged, not on the author line: both are readings of
            the session, and the author is the book's. */}
        {entry.lexile && <span className="bp-rl-entry-lexile">{entry.lexile}</span>}
      </div>
    </div>
  )
}

// The product offers the same month two ways: grouped by day, or as a flat
// table of every logged unit. `RL_ROWS` is the second one — one row per unit,
// which is how Beanstack stores them (5 minutes / 1 day / 1 book are separate
// entries against the same sitting). Sorted newest first: the week grouping
// hid that `RL_DATA`'s day order isn't strictly descending, but a flat list
// shows it.
const RL_MONTH = { label: 'July 2024', mm: '07', yy: '24' }

const RL_ROWS = RL_DATA.flatMap((week) =>
  week.days.flatMap((day) =>
    day.entries.map((e) => ({
      date: `${RL_MONTH.mm}/${String(day.date).padStart(2, '0')}/${RL_MONTH.yy}`,
      unit: e.completed ? '1 book' : e.amount.toLowerCase().replace(' minutes', ' min'),
      lexile: e.lexile ?? null,
      // The entry itself rides along so the row can advertise the same flags,
      // book talk and partner source the calendar card does, and open the same
      // session.
      entry: e,
    })),
  ),
).sort((a, b) => b.date.localeCompare(a.date))

const RL_VIEWS = [
  // "Calendar", not "List": it's the month laid out by day, with streaks in the
  // margin — the flat list is the other one.
  { id: 'calendar', label: 'Calendar', icon: <Icon name="calendar" size={15} /> },
  { id: 'table', label: 'Table', icon: <Icon name="layout-grid" size={15} /> },
]

function ReadingLogTable({ onOpen, talkFor }) {
  return (
    <Table
      flush
      compact
      // `scrollX` is the guard, not the layout: this table is sized to fit, so
      // the scroller only earns its keep if a phone can't take even that.
      scrollX
      className="bp-rl-tbl"
      columns={[
        {
          key: 'date',
          label: 'Date',
          width: 74,
          render: (d) => <span className="bp-rl-tbl-dim">{d}</span>,
        },
        {
          key: 'title',
          label: 'Title',
          render: (_v, row) => (
            <div className="bp-rl-tbl-title">
              {/* Same target as the calendar card's title: one session, two
                  ways of finding it. */}
              <button type="button" className="bp-rl-tbl-name" onClick={() => onOpen?.(row.entry)}>
                {row.entry.title}
              </button>
              <span className="bp-rl-tbl-author">{row.entry.author}</span>
              {/* Their own row: chips mixed into the author line broke it in
                  awkward places and read as part of the name. */}
              <span className="bp-rl-tbl-tags">
                <span className="bp-rl-entry-lexile bp-rl-entry-unit">{row.unit}</span>
                {row.lexile && <span className="bp-rl-entry-lexile">{row.lexile}</span>}
              </span>
            </div>
          ),
        },
        {
          key: 'marks',
          label: '',
          width: 100,
          align: 'right',
          render: (_v, row) => {
            const session = RL_SESSIONS[row.entry.title] ?? talkFor?.(row.entry.title)
            return (
              <div className="bp-rl-tbl-marks">
                <RLMarks marks={rlMarks(row.entry, session)} entry={row.entry} onOpen={onOpen} />
                <RLSource source={row.entry.source} />
                <RLEntryMenu />
              </div>
            )
          },
        },
      ]}
      rows={RL_ROWS}
      getRowKey={(r, i) => i}
    />
  )
}

function ReadingLogPage({ reader }) {
  // The app's own two readings of the same month. The calendar is the default
  // — it's the one with the streaks in the margin — and the table is every
  // logged unit as a flat list, newest first.
  const [view, setView] = useState('calendar')
  const [openSession, setOpenSession] = useState(null)
  const month = RL_MONTH.label

  // An entry with no authored session still opens — you get the details, which
  // is all a plain minutes log has.
  // Lets a log row know whether its book has a talk behind it.
  const talkFor = (title) => {
    const talks = reader?.sections?.integrity?.bookTalks ?? []
    const i = talks.findIndex((talk) => talk.title === title)
    return i > -1 ? talkSession(talks[i], reader, i) : undefined
  }

  // Shaped for the shared session modal. An entry with no authored session is
  // still a session — it just has no flags and no book talk.
  const openEntry = (entry) => {
    // A log entry whose book was talked about opens that talk's session — the
    // Book Talks tab and the log are the same sessions seen two ways.
    const talkIdx = reader?.sections?.integrity?.bookTalks?.findIndex(
      (talk) => talk.title === entry.title,
    )
    if (talkIdx != null && talkIdx > -1) {
      setOpenSession(talkSession(reader.sections.integrity.bookTalks[talkIdx], reader, talkIdx))
      return
    }
    const authored = RL_SESSIONS[entry.title]
    setOpenSession({
      id: authored?.id ?? `rl-${entry.title}-${entry.amount ?? 'completed'}`,
      date: authored?.date ?? '2024-07-16',
      type: authored?.type ?? 'engagement',
      status: 'completed',
      challenge: authored?.challenge ?? 'Summer Reading 2026',
      minutesLogged: authored?.minutesLogged ?? (parseInt(entry.amount, 10) || 0),
      engagementRating: authored?.engagementRating ?? null,
      book: authored?.book ?? { title: entry.title, author: entry.author, color: '#0284C7' },
      flags: authored?.flags ?? [],
      positiveFlags: authored?.positiveFlags ?? [],
      conversation: authored?.conversation ?? [],
      changeLog: authored?.changeLog ?? [],
      student: reader,
    })
  }

  return (
    <div className="bp-content">
      <Hero
        variant="page"
        icon={<PlumpyIcon name="reading" size={22} />}
        title="Reading Log"
        accent={SECTION_ACCENT.readinglog.text}
        accentBg={SECTION_ACCENT.readinglog.bg}
        action={
          <Button variant="secondary" size="msm" aria-label="Print log" title="Print log">
            <span className="bp-btn-label">Print log</span>
          </Button>
        }
      />
      <Tabs
        variant="pill"
        size="sm"
        block
        ariaLabel="Reading log view"
        active={view}
        onChange={setView}
        items={RL_VIEWS}
      />
      <Card flush>
        {/* The month and its arrows are this card's header */}
        <div className="bp-titles-header">
          <span className="bp-titles-header-label">{month}</span>
          <div className="bp-rl-month-arrows">
            <button className="bp-heatmap-nav-btn" aria-label="Previous month">
              <Icon name="chevron-left" size={16} stroke={2.4} />
            </button>
            {/* Nowhere forward to go: the log opens on its newest month. */}
            <button className="bp-heatmap-nav-btn" aria-label="Next month" disabled>
              <Icon name="chevron-right" size={16} stroke={2.4} />
            </button>
          </div>
        </div>
        {view === 'table' ? (
          <ReadingLogTable onOpen={openEntry} talkFor={talkFor} />
        ) : (
          <div className="bp-rl-body">
            {RL_DATA.map((week, wi) => (
              <div key={wi} className="bp-rl-week">
                <div className="bp-rl-week-label">{week.weekLabel}</div>
                {week.days.map((day, di) => (
                  <div key={di} className="bp-rl-day">
                    <div className="bp-rl-day-col">
                      <div className="bp-rl-day-num">{day.date}</div>
                      <div className="bp-rl-day-name">{day.day}</div>
                      {day.streak > 0 && (
                        <span className="bp-rl-flame">
                          {day.streak}
                          <Icon name="flame-filled" size={15} />
                        </span>
                      )}
                    </div>
                    {day.entries.length === 0 ? (
                      <div className="bp-rl-empty-day">No logged sessions</div>
                    ) : (
                      <div className="bp-rl-entries">
                        {day.entries.map((e, ei) => (
                          <RLEntryCard key={ei} entry={e} onOpen={openEntry} talkFor={talkFor} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* The one session modal. No reader list: you're inside this reader's
          own profile, so "their other sessions" is the page you came from. */}
      <SessionModal
        session={openSession}
        onClose={() => setOpenSession(null)}
        showReaderList={false}
      />
    </div>
  )
}

// ─── Placeholder page ─────────────────────────────────────────────────────────
// ─── Text box answers ────────────────────────────────────────────────────────
// A "text box challenge" is a site-authored prompt the reader answers in a free
// text box (see the Challenge Creator's activity types) — so an answer is a
// completed activity, which is why this is a tab inside Activities rather than
// a destination of its own. It's the reader's own words, grouped by the
// challenge that asked for them; `challenge` is the Activities page's own
// filter, which scopes both tabs.
function TextChallengesBody({ student, challenge = 'all' }) {
  const challenges = student.textChallenges ?? []
  const shown =
    challenge === 'all' ? challenges : challenges.filter((ch) => ch.challenge === challenge)

  return (
    <>
      {shown.length === 0 ? (
        <EmptyState
          title="No responses yet"
          description={
            challenges.length === 0
              ? 'Answers to text box challenges will show up here.'
              : 'Nothing answered in this challenge.'
          }
        />
      ) : (
        shown.map((ch) => (
          <Card key={ch.challenge}>
            <div className="bp-latest-head">
              <SectionHeading>{ch.challenge}</SectionHeading>
            </div>
            {ch.responses.map((r) => (
              <div key={r.prompt + r.date} className="bp-tb-item">
                <div className="bp-tb-head">
                  <span className="bp-tb-prompt">{r.prompt}</span>
                  <span className="bp-tb-date">{r.date}</span>
                </div>
                <div className="bp-tb-answer">{r.answer}</div>
              </div>
            ))}
          </Card>
        ))
      )}
    </>
  )
}

// ─── Book reviews ─────────────────────────────────────────────────────────────
const REVIEW_ACTIONS = [
  { label: 'Manage', icon: 'tools' },
  { label: 'Edit', icon: 'pencil' },
  { label: 'Delete', icon: 'trash' },
]

// Reviews the reader wrote and published to the site: the book, the date, and
// their own words. No cover — at review length the words are the record, and the
// art was pushing the text into a narrow column beside it.
function ReviewsPage({ student }) {
  const reviews = student.reviews ?? []
  return (
    <div className="bp-content">
      <Hero
        variant="page"
        icon={<PlumpyIcon name="star" size={22} />}
        title="Book Reviews"
        accent={SECTION_ACCENT.reviews.text}
        accentBg={SECTION_ACCENT.reviews.bg}
      />
      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Reviews this reader publishes will show up here."
        />
      ) : (
        reviews.map((r) => (
          <Card key={r.isbn}>
            <div className="bp-review-item">
              <div className="bp-review-head">
                <div>
                  <div className="bp-review-title">{r.title}</div>
                  <div className="bp-title-author">{r.author}</div>
                </div>
                <span className="bp-tb-date">{r.date}</span>
              </div>
              <div className="bp-review-text">{r.text}</div>
            </div>
            {/* Card footer, full width past the cover column. Inert, like the Log
                and Edit Goal buttons — the demo wants the affordances to look
                right, not to wire up CRUD. */}
            {/* Same control as a table's row action — a record's actions shouldn't
                change size and hover just because the record is drawn as a card. */}
            <RowActions className="bp-card-actions">
              {REVIEW_ACTIONS.map((a) => (
                <RowAction key={a.label} icon={a.icon} label={a.label} />
              ))}
            </RowActions>
          </Card>
        ))
      )}
    </div>
  )
}

// ─── Achievements & badges ────────────────────────────────────────────────────
// The real medallions are commissioned illustrations. These are drawn stand-ins
// that keep the *shape* readers recognise — a coloured disc with a year ribbon
// for achievements, a stamped seal for logging badges — so the pages read right
// without pretending to be the real art.
function MedalDisc({ icon, color, year, size = 68 }) {
  return (
    <div
      className={`bp-medal${year ? '' : ' bp-medal--plain'}`}
      style={{ '--medal': color, '--medal-size': `${size}px` }}
    >
      <span className="bp-medal-glyph">
        <Icon name={icon} size={Math.round(size * 0.44)} />
      </span>
      {year && <span className="bp-medal-year">{year}</span>}
    </div>
  )
}

function AchievementMedal({ item, size = 68 }) {
  return <MedalDisc icon={item.icon} color={item.color} year={item.date.slice(-4)} size={size} />
}

function BadgeSeal({ badge, size = 68 }) {
  return (
    <div
      className={`bp-seal${badge.earned ? '' : ' bp-seal--locked'}`}
      style={{ '--medal-size': `${size}px` }}
    >
      <span className="bp-seal-top">{badge.top}</span>
      <span className="bp-seal-mid">{badge.mid}</span>
      <span className="bp-seal-year">{badge.year}</span>
    </div>
  )
}

// Show/hide search matches the real pages, which start with the field hidden
// behind a toggle rather than spending a row on it by default.
// The Hero's action slot. Text only, like every full-size button.
function SearchToggle({ open, onToggle }) {
  const label = open ? 'Hide search' : 'Show search'
  return (
    <Button variant="secondary" size="msm" onClick={onToggle}>
      {label}
    </Button>
  )
}

// One modal shape for both pages: the artwork, a small label line, the bold
// line, an optional green earned note, then the action footer. The action is
// deliberately inert — it closes the modal without touching the data, the same
// stance as the Log and Edit Goal buttons.
function MedalModal({ open, onClose, art, label, headline, note, action }) {
  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel={headline} closeBadge>
      {({ close }) => (
        <div className="bp-medal-modal">
          <ModalClose onClick={close} />
          <div className="bp-medal-modal-art">{art}</div>
          <div className="bp-medal-modal-label">{label}</div>
          <div className="bp-medal-modal-headline">{headline}</div>
          {note && <div className="bp-medal-modal-note">{note}</div>}
          <div className="bp-medal-modal-foot">
            <button
              type="button"
              className={`bp-medal-modal-btn bp-medal-modal-btn--${action.tone}`}
              onClick={close}
            >
              {action.label}
            </button>
            {action.caution && (
              <div className="bp-medal-modal-caution">
                <Icon name="bell-ringing" size={16} />
                <span>{action.caution}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}

/* The six achievement **categories** — the `achievement_categories` table
   (ids 1-6). This is the taxonomy readers and admins actually see: Setup >
   Achievement Settings toggles achievements on and off by these, grouped there
   as "Action-related" (1-3) and "On Specific Dates" (4-6). Names from the
   Outline wiki's Achievements page, which is where the seeded rows are written
   down (they're DB data, not an enum in the code).

   Not to be confused with `achievements.achievement_type` — Activity /
   Challenge / Friend / LoggedBook / Review — which is the *trigger event* an
   internal admin picks when authoring an achievement in classic_admin, and is
   never shown to a reader. (Its sibling `condition_type` is the rule: First
   Time / Streak / Holiday.) A date-based achievement is authored as
   `achievement_type: "LoggedBook"` + `condition_type: "Holiday"`, so those
   columns would drop every badge on this wall into one bucket.

   `full` is the product's own wording, kept verbatim as the record of it;
   `label` is what fits a filter — the official names run to 50 characters and
   three of them start with the same nine words, which is unreadable in a
   dropdown. */
const ACHIEVEMENT_CATEGORIES = [
  { id: 'logging', label: 'Logging', full: 'Logging' },
  { id: 'streaks', label: 'Streaks', full: 'Streaks' },
  { id: 'friends', label: 'Friends & leaderboards', full: 'Friends & Leaderboards' },
  {
    id: 'literacy',
    label: 'Literacy days & months',
    full: 'Literacy Themed Special Days, Weeks, & Months',
  },
  {
    id: 'us',
    label: 'US heritage days & months',
    full: 'Other Special Days, Weeks, & Months (United States)',
  },
  {
    id: 'intl',
    label: 'International days & months',
    full: 'Other Special Days, Weeks, & Months (International)',
  },
]

function achievementYear(a) {
  return String(a.date).trim().slice(-4)
}

// The achievements themselves — the two filters and the list. They're the
// Achievements tab inside Badges, which is how the shipped profile pairs them
// (`profiles/_badges_and_achievements_tabs.html.haml`): both are a medal with
// a name and a date, so one page holds them instead of two rail destinations.
// `q` comes from the Badges page, which owns the search box.
function AchievementsBody({ student, q = '' }) {
  const [openItem, setOpenItem] = useState(null)
  const [cat, setCat] = useState('all')
  const [year, setYear] = useState('all')
  const all = student.achievements ?? []
  // Both filters offer only what this reader actually has — six categories with
  // four dead options is a worse control than two live ones. Years newest first.
  const cats = ACHIEVEMENT_CATEGORIES.filter((c) => all.some((a) => a.category === c.id))
  const years = [...new Set(all.map(achievementYear))].sort().reverse()
  const filtered = all.filter(
    (a) => (cat === 'all' || a.category === cat) && (year === 'all' || achievementYear(a) === year),
  )
  const shown = q.trim()
    ? filtered.filter((a) => a.name.toLowerCase().includes(q.trim().toLowerCase()))
    : filtered

  return (
    <>
      {all.length > 0 && (
        <FilterBar compact>
          <FilterItem label="Category">
            <Select size="sm" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="all">All categories</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </Select>
          </FilterItem>
          <FilterItem label="Year">
            <Select size="sm" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="all">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </FilterItem>
        </FilterBar>
      )}
      {shown.length === 0 ? (
        <EmptyState
          variant="dashed"
          title={all.length === 0 ? 'No achievements yet' : 'No matches'}
          description={
            all.length === 0
              ? 'Seasonal achievements this reader earns will show up here.'
              : 'Try a different category, year or name.'
          }
        />
      ) : (
        // The same row as an activity badge: art, name, its one line of
        // detail, then the row action. The shipped app draws these as 250px
        // centred tiles, but three medals across a 561px panel spent a screen
        // on six records — the list scans, and the art still leads it.
        <Card flush>
          {shown.map((a) => (
            <div key={a.name} className="bp-act-row">
              <AchievementMedal item={a} size={42} />
              <div className="bp-act-main">
                <div className="bp-act-name">{a.name}</div>
                <div className="bp-act-count">Earned on {a.date}</div>
              </div>
              <RowAction icon="view" label="View achievement" onClick={() => setOpenItem(a)} />
            </div>
          ))}
        </Card>
      )}

      <MedalModal
        open={openItem != null}
        onClose={() => setOpenItem(null)}
        art={openItem && <AchievementMedal item={openItem} size={112} />}
        label="Achievement"
        headline={openItem?.name}
        note={openItem && `Earned on ${openItem.date}`}
        action={{ tone: 'danger', label: 'Remove Achievement' }}
      />
    </>
  )
}

// Unearned first: it's the half with something to do in it — awarding a badge
// the reader has finished the work for. The page still lands on Earned, which
// is the reader's record.
// Achievements ride along as a third tab: the shipped profile pairs "Earned
// Badges" and "Achievements" as sibling tabs of one page
// (`profiles/_badges_and_achievements_tabs.html.haml`), and both are the same
// thing to a reader — a medal with a name and a date.
const BADGE_TABS = [
  { id: 'unearned', label: 'Unearned' },
  { id: 'earned', label: 'Earned' },
  { id: 'achievements', label: 'Achievements' },
]
const BADGE_KINDS = [
  { id: 'all', label: 'All badges' },
  { id: 'logging', label: 'Logging badges' },
  { id: 'challenge', label: 'Challenge badges' },
]

function BadgesPage({ student }) {
  const [tab, setTab] = useState('earned')
  const [kind, setKind] = useState('all')
  const [challenge, setChallenge] = useState('all')
  const [q, setQ] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [openItem, setOpenItem] = useState(null)
  const [all, setAll] = useState(student.badges ?? [])
  useEffect(() => setAll(student.badges ?? []), [student])
  const { toasts, push, dismiss } = useToasts()

  // Awarding or removing a badge is real state here, the way marking an
  // activity complete is — it moves the row to the other tab.
  function award(badge, earned) {
    setAll((prev) => prev.map((b) => (b.name === badge.name ? { ...b, earned } : b)))
    push({
      title: earned ? 'Badge awarded' : 'Badge removed',
      body: badge.name,
      tone: earned ? 'info' : undefined,
    })
  }

  // `list` is everything on this tab; `shown` is what survives the filters.
  // The bar's reading is one against the other, so a narrow filter reads
  // differently from an empty tab.
  const list = all.filter((b) => b.earned === (tab === 'earned'))
  const shown = list.filter(
    (b) =>
      (kind === 'all' || b.kind === kind) &&
      (challenge === 'all' || b.challenge === challenge) &&
      (!searchOpen || b.name.toLowerCase().includes(q.trim().toLowerCase())),
  )

  // A challenge badge belongs to a challenge, the way an activity badge does,
  // and this is where that lives. Only the challenges this reader actually has
  // badges from — and picking one leaves the logging badges out, because the
  // site awards those for the year, not for any challenge.
  const challenges = [...new Set(all.map((b) => b.challenge).filter(Boolean))]

  const onAchievements = tab === 'achievements'

  return (
    <div className="bp-content">
      <Hero
        variant="page"
        icon={<PlumpyIcon name="medal" size={22} />}
        title="Badges"
        accent={SECTION_ACCENT.badges.text}
        accentBg={SECTION_ACCENT.badges.bg}
        action={
          <SearchToggle
            open={searchOpen}
            onToggle={() => {
              setSearchOpen((v) => !v)
              setQ('')
            }}
          />
        }
      />
      <Tabs
        variant="pill"
        size="sm"
        block
        ariaLabel="Badge status"
        active={tab}
        onChange={setTab}
        items={BADGE_TABS}
      />
      {searchOpen && (
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder={onAchievements ? 'Search for achievement name…' : 'Search for badge name…'}
          ariaLabel={onAchievements ? 'Search achievements' : 'Search badges'}
        />
      )}
      {/* Achievements carry their own two filters and their own list — the
          badge filters below don't apply to them. */}
      {onAchievements ? (
        <AchievementsBody student={student} q={searchOpen ? q : ''} />
      ) : (
        <>
          <FilterBar compact>
            <FilterItem label="Challenge">
              <Select size="sm" value={challenge} onChange={(e) => setChallenge(e.target.value)}>
                <option value="all">All challenges</option>
                {challenges.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </FilterItem>
            <FilterItem label="Badge type">
              <Select size="sm" value={kind} onChange={(e) => setKind(e.target.value)}>
                {BADGE_KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
              </Select>
            </FilterItem>
          </FilterBar>
          {shown.length === 0 ? (
            <EmptyState
              variant="dashed"
              title={`No ${tab} badges`}
              description={
                q || kind !== 'all' || challenge !== 'all'
                  ? 'Try a different search, challenge or badge type.'
                  : `Badges this reader has ${tab === 'earned' ? 'earned' : 'still to earn'} will show up here.`
              }
            />
          ) : (
            // An activity-badge row, and the same two trailing controls: the
            // CompleteToggle is the modal's own Award / Remove Badge, which is
            // what earning a badge means here, and the row action opens the
            // detail. Toggling moves the badge between the two tabs.
            <Card flush>
              {shown.map((b) => (
                <div key={b.name} className="bp-act-row">
                  <BadgeSeal badge={b} size={42} />
                  <div className="bp-act-main">
                    <div className="bp-act-name">{b.name}</div>
                    <div className="bp-act-count">{b.detail}</div>
                  </div>
                  <CompleteToggle
                    done={b.earned}
                    label={b.name}
                    wording={{
                      set: 'Award badge',
                      unset: 'Remove badge',
                      on: 'Earned',
                      off: 'Not earned',
                    }}
                    onChange={(v) => award(b, v)}
                  />
                  <RowAction icon="view" label="View badge" onClick={() => setOpenItem(b)} />
                </div>
              ))}
            </Card>
          )}
        </>
      )}

      <MedalModal
        open={openItem != null}
        onClose={() => setOpenItem(null)}
        art={openItem && <BadgeSeal badge={openItem} size={112} />}
        label={openItem?.name}
        headline={openItem?.detail}
        note={openItem?.earnedNote}
        action={
          openItem?.earned
            ? {
                tone: 'danger',
                label: 'Remove Badge',
                caution: "Removing this badge will not change a reader's log.",
              }
            : {
                tone: 'primary',
                label: 'Award Badge',
                caution: "Awarding this badge will not add reading to the reader's log.",
              }
        }
      />

      {/* Mounted once per page — the stack is `position: fixed`. */}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

// ─── Activity badges ──────────────────────────────────────────────────────────
// A challenge's activity badge is a set of activities the reader checks off;
// the badge lands once they're all done. The checkboxes are live so the demo
// can show a badge completing, but nothing is persisted.
/* Activity badges and the three activity types, from the product itself.
   `LearningTrack` is the model behind an **Activity Badge**; the activities
   under it carry `activity_type` — "Activity", "Activity Code" or
   "Text Box Challenge" (bs-product `activities.activity_type`, and the
   Outline wiki's "Activity and Review Badges") — plus `activity_codes` (a
   list: one activity can hold several codes), `point_value`, `link_url` /
   `link_title` and `max_completions`.

   A reader's completion is a `completed_activities` row carrying
   `text_box_challenge_answer`, which is why a text box answer belongs to the
   completion rather than the activity.

   Two constraints from the docs that the UI has to respect:
   - staff **cannot type a text box answer** from the back end; they can only
     check the activity off as complete;
   - **repeatable** activity badges exist only inside points challenges. Their
     activities can be completed without limit, the badge itself can never be
     earned, and a repeatable text box answer can't be edited. */
const ACTIVITY_TYPES = {
  Activity: { label: 'Activity', icon: 'circle-check' },
  'Activity Code': { label: 'Code', icon: 'key' },
  'Text Box Challenge': { label: 'Text box', icon: 'align-left' },
}

function ActivityTypeTag({ type }) {
  const cfg = ACTIVITY_TYPES[type]
  if (!cfg || type === 'Activity') return null
  return (
    <span className="bp-act-type">
      <Icon name={cfg.icon} size={13} stroke={2.2} />
      {cfg.label}
    </span>
  )
}

/* One activity, drawn for its type. The checkbox is the only control staff get
   on any of them — the code and the answer are there to be read. */
function ActivityDetail({ activity }) {
  const { type = 'Activity', codes, answer, points } = activity
  return (
    <div className="bp-act-detail">
      {/* Type and points are what kind of thing this is; they read as a label
          above the activity rather than a trailer after it, which is where a
          long prompt kept pushing them anyway. */}
      <div className="bp-act-detail-head">
        <ActivityTypeTag type={type} />
        {points > 0 && <span className="bp-act-points">{points} pts</span>}
      </div>
      <span className="bp-act-modal-text">{activity.text}</span>

      {/* `activity_codes` is a list — one activity can accept several. Staff
          see them because the admin set them; there's nothing to enter here. */}
      {type === 'Activity Code' && codes?.length > 0 && (
        <div className="bp-act-codes">
          {codes.map((c) => (
            <code key={c} className="bp-act-code">
              {c}
            </code>
          ))}
        </div>
      )}

      {/* The reader's own words, from `text_box_challenge_answer`. Read-only by
          design: the product doesn't let staff write one. */}
      {type === 'Text Box Challenge' &&
        (answer ? (
          <blockquote className="bp-act-answer">{answer}</blockquote>
        ) : (
          <span className="bp-act-answer bp-act-answer--empty">No response yet</span>
        ))}
    </div>
  )
}

function ActivitiesPage({ student }) {
  const [badges, setBadges] = useState(student.activityBadges ?? [])
  const [openIdx, setOpenIdx] = useState(null)
  const [kind, setKind] = useState('activity')
  const [challenge, setChallenge] = useState('all')
  const { toasts, push, dismiss } = useToasts()

  // Anything that lands a completion announces itself in the corner, and an
  // activity that tips the badge over its threshold announces the badge too —
  // that's the moment worth telling someone about.
  function announce(badge, before, after) {
    if (after > before) {
      push({ title: 'Activity marked complete', body: badge.name })
      const need = requiredFor(badge)
      if (before < need && after >= need) {
        push({ title: 'Badge earned', body: badge.name, tone: 'info' })
      }
    }
  }

  function toggleActivity(badgeIdx, actIdx, done) {
    const badge = badges[badgeIdx]
    if (badge) {
      const before = doneCount(badge)
      announce(badge, before, done ? before + 1 : before - 1)
    }
    setBadges((prev) =>
      prev.map((b, i) =>
        i !== badgeIdx
          ? b
          : {
              ...b,
              activities: b.activities.map((a, j) => (j === actIdx ? { ...a, done } : a)),
            },
      ),
    )
  }

  // Ticking the badge-level box marks every activity under it, matching the
  // product's "mark the whole badge complete" affordance.
  function toggleBadge(badgeIdx, done) {
    const badge = badges[badgeIdx]
    if (badge && done) {
      push({ title: 'Badge earned', body: badge.name, tone: 'info' })
    }
    setBadges((prev) =>
      prev.map((b, i) =>
        i !== badgeIdx ? b : { ...b, activities: b.activities.map((a) => ({ ...a, done })) },
      ),
    )
  }

  // Repeatable badges are their own kind of thing — they can't be earned, they
  // count instead of completing, and they only exist inside points challenges.
  // Mixing them into one list means two different sentences in one column, so
  // they get their own tab. The tab only appears when there are any: points
  // challenges aren't supported on school sites, so a student never has one.
  const plainBadges = badges.filter((b) => !b.repeatable)
  const repeatBadges = badges.filter((b) => b.repeatable)
  const inKind = kind === 'repeatable' ? repeatBadges : plainBadges
  const listed = challenge === 'all' ? inKind : inKind.filter((b) => b.challenge === challenge)

  // A badge belongs to a challenge, and the filter above is where that lives.
  // Text box answers are grouped by challenge too, so the one filter covers
  // both tabs and the options are the union of what either has.
  const challenges = [
    ...new Set(
      [
        ...badges.map((b) => b.challenge),
        ...(student.textChallenges ?? []).map((ch) => ch.challenge),
      ].filter(Boolean),
    ),
  ]

  const openBadge = openIdx == null ? null : badges[openIdx]
  const doneCount = (b) => b.activities.filter((a) => a.done).length
  // A repeatable badge is never earned, so "3 of 4 completed" is the wrong
  // sentence for it — it gets a running total of completions instead.
  const completionCount = (b) =>
    b.activities.reduce((n, a) => n + (a.completions ?? (a.done ? 1 : 0)), 0)

  // "Activity badges are earned when readers complete the specified number of
  // activities within them" — so the bar is a count, not necessarily all of
  // them. `required` is that number; absent, the badge needs the lot.
  const requiredFor = (b) => b.required ?? b.activities.length
  const isEarned = (b) => !b.repeatable && doneCount(b) >= requiredFor(b)

  return (
    <div className="bp-content">
      <Hero
        variant="page"
        icon={<PlumpyIcon name="puzzle" size={22} />}
        title="Activities"
        accent={SECTION_ACCENT.activities.text}
        accentBg={SECTION_ACCENT.activities.bg}
      />
      <FilterBar compact>
        <FilterItem label="Challenge">
          <Select size="sm" value={challenge} onChange={(e) => setChallenge(e.target.value)}>
            <option value="all">All challenges</option>
            {challenges.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FilterItem>
      </FilterBar>
      {/* A text box answer is a completed activity — `completed_activities`
          carries `text_box_challenge_answer` — so the reader's words live here
          beside the badges those activities belong to, rather than in a
          destination of their own. Repeatable only appears when the reader has
          one; text box answers are always a tab. */}
      <Tabs
        variant="pill"
        block
        ariaLabel="Activity type"
        active={kind}
        onChange={setKind}
        items={[
          { id: 'activity', label: 'Activity badges' },
          ...(repeatBadges.length > 0 ? [{ id: 'repeatable', label: 'Repeatable' }] : []),
          { id: 'textbox', label: 'Text Box Answers' },
        ]}
      />
      {kind === 'textbox' ? (
        <TextChallengesBody student={student} challenge={challenge} />
      ) : (
        <Card flush>
          {listed.length === 0 ? (
            <EmptyState
              title={kind === 'repeatable' ? 'No repeatable badges' : 'No activity badges'}
              description={
                kind === 'repeatable'
                  ? 'Repeatable badges come from points challenges.'
                  : 'This reader has none assigned yet.'
              }
            />
          ) : (
            // One flat list. The challenge each badge belongs to is what the
            // filter above is for; repeating it as a heading every few rows just
            // broke the run of rows up.
            listed.map((b) => {
              // The modal indexes into the full list, not the filtered one.
              const i = badges.indexOf(b)
              const done = doneCount(b)
              const all = b.activities.length
              return (
                <div key={b.name} className="bp-act-row">
                  <MedalDisc icon={b.icon} color={b.color} size={42} />
                  <div className="bp-act-main">
                    <div className="bp-act-name">
                      {b.name}
                      {b.repeatable && (
                        <Pill color="#c849e5" size="sm">
                          Repeatable
                        </Pill>
                      )}
                    </div>
                    <div className="bp-act-count">
                      {/* The app's exact sentences: "X of Y Activities
                            Completed" and, for a repeatable badge, "N Total
                            Activity Completions". */}
                      {b.repeatable
                        ? `${completionCount(b)} Total Activity Completions`
                        : `${done} of ${all} Activities Completed`}
                    </div>
                  </div>
                  {/* The product's own control: a filled checkbox glyph, green
                        when complete, grey when not, clickable either way — and
                        a repeatable row has no completion column at all, only
                        the add glyph and its running count. Un-earning is the
                        same toggle, which is how staff take a badge back. */}
                  <CompleteToggle
                    done={isEarned(b)}
                    repeatable={b.repeatable}
                    count={b.repeatable ? completionCount(b) : undefined}
                    onChange={b.repeatable ? undefined : (v) => toggleBadge(i, v)}
                    label={b.name}
                  />
                  {/* The app draws this as a text `View Activity` button
                    (`.view-activity-button-container`); here it's the same row
                    action every other table ends with, so a row's trailing
                    control is one shape across the whole profile. */}
                  <RowAction icon="view" label="View activities" onClick={() => setOpenIdx(i)} />
                </div>
              )
            })
          )}
        </Card>
      )}

      <Modal
        open={openIdx != null}
        onClose={() => setOpenIdx(null)}
        variant="center"
        ariaLabel={openBadge?.name}
        closeBadge
      >
        {({ close }) => (
          <div className="bp-act-modal">
            <ModalClose onClick={close} />
            <div className="bp-act-modal-head">
              <span className="bp-act-modal-title">{openBadge?.name}</span>
            </div>
            <div className="bp-act-modal-cols">
              <span>Activity</span>
              <span>{openBadge?.repeatable ? 'Times' : 'Completed?'}</span>
            </div>
            <div className="bp-act-modal-body">
              {openBadge?.activities.map((a, j) => (
                <div key={a.text} className="bp-act-modal-row">
                  <ActivityDetail activity={a} />
                  {/* Repeatable activities have no single done state — the
                      count is the record. */}
                  <CompleteToggle
                    done={a.done}
                    repeatable={openBadge.repeatable}
                    count={openBadge.repeatable ? (a.completions ?? 0) : undefined}
                    onChange={
                      openBadge.repeatable ? undefined : (v) => toggleActivity(openIdx, j, v)
                    }
                    label={a.text}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Mounted once per page — the stack is `position: fixed`. */}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

// ─── Drawings & rewards ───────────────────────────────────────────────────────
// The claim tables, drawn the way the app draws them. On a reader's page
// bs-product's `new_admin/earned_rewards/_incentive.html.haml` puts two side by
// side — a drawing table keyed "Drawing / Redeemed?" and an incentive table
// keyed "Earned Incentive / Challenge / Redeemed?" — and both are ticked with
// the very same toggle rule that runs the Activities column
// (`.redeem-incentive-toggle, .redeem-raffle-toggle` sit in that selector list).
//
// A row's trailing control is the class-level table's own icon action
// (`.redeem-reward-icon` holding `icons/reward.svg`): an icon rather than a
// labelled button because it repeats on every single row.

// The shared row action, carrying one of the app's own drawings.
function RowIconAction({ icon, title, onClick, disabled = false }) {
  return (
    <RowAction label={title} onClick={onClick} disabled={disabled}>
      <BsIcon set="actions" name={icon} size={20} />
    </RowAction>
  )
}

// The app splits earned rewards by *age*, not by kind: `_rewards.html.haml` is
// a Current Rewards / Past Rewards tab pair over one table, and Past carries a
// helpbox saying what "past" means. A challenge's ticket drawings aren't a tab
// here — they're reached from that challenge's own row, which is where the app
// puts them and where the per-challenge ticket balance makes sense.
const REWARD_KINDS = [
  { id: 'current', label: 'Current Rewards' },
  { id: 'past', label: 'Past Rewards' },
]

// The app's own button copy for a ticket drawing, case by case
// (`ticket_rewards/_ticket_rewards_modal_overview.html.haml`).
function ticketAction(t) {
  const atMax = t.maxEntries > 0 && t.entered >= t.maxEntries
  if (t.ended) return { label: 'Ended', disabled: true }
  if (atMax) return { label: 'Max Entered (Subtract Tickets)', disabled: false }
  if (t.available <= 0 && t.entered === 0) return { label: 'No Tickets Available', disabled: true }
  if (t.available <= 0) return { label: 'Subtract Tickets', disabled: false }
  return { label: 'Add/Remove Tickets', disabled: false }
}

function RewardsPage({ student }) {
  const [rewards, setRewards] = useState(student.rewards ?? [])
  const [kind, setKind] = useState('current')
  const [q, setQ] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const { toasts, push, dismiss } = useToasts()

  // Search runs over the list that's showing — a reader with forty earned
  // rewards is the case this is for, and the name is the only thing worth
  // matching on.
  const match = (name) => !searchOpen || name.toLowerCase().includes(q.trim().toLowerCase())

  function redeem(reward) {
    setRewards((prev) => prev.map((r) => (r === reward ? { ...r, redeemed: !r.redeemed } : r)))
    push(
      reward.redeemed
        ? { title: 'Marked not redeemed', body: reward.name, tone: 'info' }
        : { title: 'Reward redeemed', body: reward.name },
    )
  }

  // The app's profile-level table is two columns — "Earned Reward" and
  // "Redeemed?" — so the challenge a reward came from rides under its name
  // rather than taking a column the panel doesn't have.
  const rewardCols = [
    {
      key: 'name',
      label: 'Earned Reward',
      minWidth: 200,
      render: (v, r) => (
        <>
          <span className="bp-tbl-name">{v}</span>
          <span className="bp-tbl-sub">{r.challenge}</span>
        </>
      ),
    },
    {
      key: 'redeemed',
      label: 'Redeemed?',
      minWidth: 96,
      align: 'right',
      render: (v, r) => <CompleteToggle done={v} onChange={() => redeem(r)} label={r.name} />,
    },
  ]

  // `era` is the 90-day line the app draws; anything unmarked is current.
  const shown = rewards.filter((r) => (r.era ?? 'current') === kind && match(r.name))

  return (
    <div className="bp-content">
      <Hero
        variant="page"
        icon={<PlumpyIcon name="gift" size={22} />}
        title="Rewards"
        accent={SECTION_ACCENT.rewards.text}
        accentBg={SECTION_ACCENT.rewards.bg}
        action={
          rewards.length > 0 && (
            <SearchToggle
              open={searchOpen}
              onToggle={() => {
                setSearchOpen((v) => !v)
                setQ('')
              }}
            />
          )
        }
      />
      {searchOpen && (
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Search for a reward name…"
          ariaLabel="Search rewards"
        />
      )}
      <Tabs
        variant="pill"
        block
        ariaLabel="Reward age"
        active={kind}
        onChange={setKind}
        items={REWARD_KINDS}
      />
      {/* `.infobox.helpbox` on the real page, shown only on the Past tab. */}
      {kind === 'past' && (
        <Banner level="info">These are rewards that were earned more than 90 days ago.</Banner>
      )}
      <Card flush>
        <Table
          flush
          scrollX
          columns={rewardCols}
          rows={shown}
          getRowKey={(r) => r.name}
          empty={kind === 'past' ? 'No past rewards.' : 'No rewards to redeem.'}
        />
      </Card>

      {/* Mounted once per page — the stack is `position: fixed`. */}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

// One challenge's ticket drawings. The app reaches this from a challenge row's
// `View Ticket Rewards` link and draws it as a sub-view of Challenges — a Back
// link, "Ticket Rewards for {challenge}", and how many tickets the reader has
// left to spend — not as a tab of its own under Rewards.
// One challenge's ticket drawings. The app reaches this from a challenge row's
// `View Ticket Rewards` link and draws it as a sub-view of Challenges — a Back
// link, "Ticket Rewards for {challenge}", and how many tickets the reader has
// left to spend on it — because the balance is per challenge, not per reader
// (`available_tickets_for_program`).
function TicketRewardsView({ student, program, onBack }) {
  const [tickets, setTickets] = useState(() =>
    (student.ticketDrawings ?? []).filter((t) => t.challenge === program.name),
  )
  const [openIdx, setOpenIdx] = useState(null)
  const [stepping, setStepping] = useState(false)
  const { toasts, push, dismiss } = useToasts()

  const open = openIdx == null ? null : tickets[openIdx]
  const action = open ? ticketAction(open) : null

  // Every drawing in this challenge draws on the same pile — the app's balance
  // is `available_tickets_for_program(program_id)` — so it's one number, and
  // the rows are kept in step with each other.
  const available = tickets[0]?.available ?? 0

  // Entering tickets moves them out of the challenge's pile and into this
  // drawing (the app tracks the two as one balance, earned minus entered), so
  // every drawing here sees the reduced pile, not just the one just changed.
  function enterTickets(count) {
    const row = tickets[openIdx]
    const delta = count - row.entered
    setTickets((prev) =>
      prev.map((t, j) => ({
        ...t,
        entered: j === openIdx ? count : t.entered,
        available: t.available - delta,
      })),
    )
    setStepping(false)
    setOpenIdx(null)
    push({
      title: `${count === 1 ? '1 Ticket' : `${count} Tickets`} Entered`,
      body: row.name,
    })
  }

  const ticketCols = [
    {
      key: 'name',
      label: 'Drawing',
      minWidth: 150,
      // When it closes rides under the prize rather than taking a column of
      // its own — it's a fact about the drawing, and the panel hasn't the width
      // for a third column beside the count and the action.
      render: (v, r) => (
        <>
          <span className="bp-tbl-name">{v}</span>
          <span className="bp-tbl-sub">Ends {r.endsOn}</span>
        </>
      ),
    },
    {
      key: 'entered',
      label: 'Tickets Entered',
      minWidth: 110,
      // The app words this "5 Tickets Entered", with its ticket mark beside it.
      render: (v) => (
        <span className="bp-ticket-count">
          <BsIcon set="actions" name="ticket" size={18} />
          {v}
        </span>
      ),
    },
    // `max_entries` isn't a column either: the app only ever says it as part of
    // the button that spends them — "Enter 3 (Max 10)".
    {
      key: 'act',
      label: '',
      minWidth: 48,
      align: 'right',
      render: (_, r) => (
        <RowIconAction
          icon="ticket"
          title="View drawing"
          onClick={() => setOpenIdx(tickets.indexOf(r))}
        />
      ),
    },
  ]

  return (
    <div className="bp-content">
      <BackBar label="Back to Challenges" onClick={onBack} />
      {/* No icon chip: this is a sub-view of Challenges reached from a row, not
          a destination in the rail, and the Back link above already says where
          you are. `Hero` renders without one. */}
      <Hero
        variant="page"
        title={`Ticket Rewards for ${program.name}`}
        accent={SECTION_ACCENT.rewards.text}
        accentBg={SECTION_ACCENT.rewards.bg}
      />
      {/* The app says this as a bare line under the heading. Boxed here, with
          the ticket mark: it's the balance every drawing below spends from, so
          it reads as a wallet rather than as a caption. */}
      <div className="bp-draw-avail">
        <BsIcon set="actions" name="ticket" size={20} />
        <span>
          <strong>{available}</strong> {available === 1 ? 'ticket' : 'tickets'} available
        </span>
      </div>
      <Card flush>
        <Table
          flush
          scrollX
          columns={ticketCols}
          rows={tickets}
          getRowKey={(r) => r.name}
          empty="No drawings to enter."
        />
      </Card>

      {/* The app's drawing overview: the prize, when it closes, how many
          tickets are in, and the one button that changes that. */}
      <Modal
        open={open != null}
        onClose={() => {
          setOpenIdx(null)
          setStepping(false)
        }}
        variant="center"
        ariaLabel={open?.name}
        closeBadge
      >
        {({ close }) => (
          <div className="bp-draw-modal">
            <ModalClose onClick={close} />
            {/* Same chrome as every other modal on the page: a bordered head
                holding the title, then a body. */}
            <div className="bp-act-modal-head">
              <span className="bp-act-modal-title">{open?.name}</span>
            </div>
            {stepping ? (
              <TicketStepper
                drawing={open}
                onCancel={() => setStepping(false)}
                onEnter={enterTickets}
              />
            ) : (
              <div className="bp-draw-body">
                <div className="bp-draw-meta">
                  <span className="bp-ticket-count">
                    <BsIcon set="actions" name="ticket" size={18} />
                    {open?.entered ?? 0} Tickets Entered
                  </span>
                  <span className="bp-draw-date">Ends on {open?.endsOn}</span>
                </div>
                <p className="bp-draw-text">{open?.description}</p>
                <Button
                  variant="secondary"
                  disabled={action?.disabled}
                  onClick={() => setStepping(true)}
                >
                  {action?.label}
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Mounted once per page — the stack is `position: fixed`. */}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

// The app's ticket stepper: a ± control over the reader's own balance, and a
// button that spells out exactly what pressing it will do — including the max,
// and "No Change" when the number is back where it started.
function TicketStepper({ drawing, onCancel, onEnter }) {
  const [n, setN] = useState(drawing.entered)
  // You can never enter more than you hold, and never more than the drawing
  // allows — `calculateMaxEntries` in the app's own words.
  const pool = drawing.available + drawing.entered
  const cap = drawing.maxEntries > 0 ? Math.min(drawing.maxEntries, pool) : pool
  const left = pool - n
  const maxText = drawing.maxEntries > 0 ? ` (Max ${drawing.maxEntries})` : ' (No Max)'

  return (
    <div className="bp-draw-body">
      <span className="bp-draw-date">
        {left === 1 ? '1 Ticket Available' : `${left} Tickets Available`}
      </span>
      <div className="bp-draw-stepper">
        <NumberInput value={n} min={0} max={cap} onChange={setN} aria-label="Tickets to enter" />
      </div>
      <div className="bp-draw-actions">
        <Button disabled={n === drawing.entered} onClick={() => onEnter(n)}>
          {n === drawing.entered ? 'No Change' : `Enter ${n === 1 ? '1 Ticket' : n}${maxText}`}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

// Every row here is a drawing this reader *won* — a `raffle_winners` record,
// not a drawing they entered. Entering is the Rewards tab's ticket list.
// `key` on the student remounts the list so a toggle doesn't carry across
// readers when the pager steps.
function DrawingsPage({ student }) {
  const [wins, setWins] = useState(student.drawingWins ?? [])
  const [q, setQ] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const { toasts, push, dismiss } = useToasts()
  const shown = searchOpen
    ? wins.filter((w) => w.name.toLowerCase().includes(q.trim().toLowerCase()))
    : wins

  function claim(win) {
    setWins((prev) => prev.map((w) => (w === win ? { ...w, claimed: !w.claimed } : w)))
    push(
      win.claimed
        ? { title: 'Prize marked unclaimed', body: win.name, tone: 'info' }
        : { title: 'Successfully Redeemed', body: win.name },
    )
  }

  // `raffle_winners.place` is only filled in on an Ordered Placement drawing —
  // an Equal Winners drawing has winners but no order, so the cell is empty
  // rather than guessing a 1st.
  const cols = [
    {
      key: 'name',
      label: 'Drawing',
      minWidth: 140,
      render: (v) => <span className="bp-tbl-name">{v}</span>,
    },
    {
      key: 'place',
      label: 'Place',
      minWidth: 68,
      // Centred, and the placement itself is a tag: it's a standing this
      // reader holds, not a measurement, so it reads like the other pills on
      // the profile rather than as loose text in a column.
      align: 'center',
      render: (v) =>
        v == null ? (
          <span className="bp-none">—</span>
        ) : (
          <span className="bp-place">{ordinal(v)}</span>
        ),
    },
    {
      key: 'claimed',
      label: 'Redeemed?',
      minWidth: 96,
      align: 'right',
      render: (v, r) => <CompleteToggle done={v} onChange={() => claim(r)} label={r.name} />,
    },
  ]

  return (
    <div className="bp-content">
      <Hero
        variant="page"
        icon={<PlumpyIcon name="ticket" size={22} />}
        title="Drawings"
        accent={SECTION_ACCENT.drawings.text}
        accentBg={SECTION_ACCENT.drawings.bg}
        action={
          wins.length > 0 && (
            <SearchToggle
              open={searchOpen}
              onToggle={() => {
                setSearchOpen((v) => !v)
                setQ('')
              }}
            />
          )
        }
      />
      {searchOpen && (
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Search for a drawing name…"
          ariaLabel="Search drawings"
        />
      )}
      <Card flush>
        <Table
          flush
          scrollX
          columns={cols}
          rows={shown}
          getRowKey={(r) => r.name}
          empty="There are no drawings to redeem."
        />
      </Card>
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

// 1 → 1st. The app's `getOrdinal` / Rails `ordinalize`, which is what the
// ordered-placement winners table prints.
function ordinal(n) {
  const rem100 = n % 100
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`
}

// ─── Challenges ───────────────────────────────────────────────────────────────
// ─── Challenge banners ────────────────────────────────────────────────────────
// A challenge is a `Program`, and a Program has a `header_image` — the banner
// staff upload when they build it, with `no-challenge-image.png` as the app's
// fallback. These are the **real** banners Beanstack's design team ships with
// its own challenges (Dropbox `Design/Projects/Challenges/<name>/Banner`),
// copied into `public/challenge-banners/` and converted to 1200px webp.
//
// Every one of them is 2.62:1 — 920×351, or 1840×702 at 2× — which is the
// product's banner ratio, and the same ratio the challenge creator generates
// its theme art at. `.chal-banner` holds that ratio rather than a fixed height.
const CHALLENGE_BANNERS = {
  'read-across-america': 'read-across-america',
  'winter-reading': 'winter-reading',
  'summer-reading': 'summer-reading',
  'benny-bean': 'benny-bean',
  'battle-of-the-books': 'battle-of-the-books',
  '25-in-25': '25-in-25',
}
const bannerSrc = (key) =>
  CHALLENGE_BANNERS[key] ? `/bs-prototypes/challenge-banners/${CHALLENGE_BANNERS[key]}.webp` : null

// The app's four, in its order: Current / Recently Ended / Upcoming / Past
// Challenges (`showProgramTab` gates each on there being any).
// The date a staff-set completion is stamped with, in the same long form the
// challenge fixtures write "Started On" in.
const longToday = () =>
  new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

const CHALLENGE_TABS = [
  { id: 'current', label: 'Current' },
  { id: 'ended', label: 'Recent' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
]

// ─── Challenge log sheet ──────────────────────────────────────────────────────
// The printable log a teacher hands in or files: everything a reader logged
// toward one challenge, on one sheet, with somewhere to sign. It's a full-page
// overlay rather than a panel because it's a document — and it really prints:
// `@media print` drops the app around it and leaves the sheet on the page.
//
// The rows are the reader's own log entries; the totals are derived from them
// rather than authored, so the sheet can't disagree with the log it came from.
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

function challengeLogRows(startedOn) {
  const m = /^(\w+)\s+\d+,\s*(\d{4})$/.exec(startedOn ?? '')
  const mm = m ? String(MONTHS.indexOf(m[1]) + 1).padStart(2, '0') : RL_MONTH.mm
  const yy = m ? m[2].slice(2) : RL_MONTH.yy

  return RL_DATA.flatMap((week) =>
    week.days.flatMap((day) =>
      day.entries.map((e) => ({
        date: `${mm}/${String(day.date).padStart(2, '0')}/${yy}`,
        title: e.title,
        author: e.author,
        minutes: e.completed ? null : parseInt(e.amount.replace(/,/g, ''), 10) || 0,
        completed: !!e.completed,
        source: e.source,
      })),
    ),
  ).sort((a, b) => a.date.localeCompare(b.date))
}

function ChallengeLogSheet({ open, onClose, student, challenge }) {
  const rows = challengeLogRows(challenge.startedOn)
  const minutes = rows.reduce((n, r) => n + (r.minutes ?? 0), 0)
  const books = rows.filter((r) => r.completed).length
  const days = new Set(rows.map((r) => r.date)).size

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Challenge log">
      <div className="bp-clog">
        {/* Screen-only chrome: it must not print. */}
        <div className="bp-clog-bar">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Back
          </Button>
          <span className="bp-clog-bar-title">Challenge log</span>
          <Button size="sm" onClick={() => window.print()}>
            Print
          </Button>
        </div>

        <div className="bp-clog-sheet">
          <div className="bp-clog-head">
            <div>
              <h1 className="bp-clog-title">{challenge.name}</h1>
              <div className="bp-clog-dates">{challenge.dates}</div>
            </div>
            <div className="bp-clog-benny">
              <img src="/bs-prototypes/benny.png" alt="" width={40} height={40} />
              <span>Beanstack</span>
            </div>
          </div>

          <div className="bp-clog-reader">
            {[
              ['Reader', student.name],
              ['Grade', student.grade],
              ['Started', challenge.startedOn],
              ['Enrolled', 'Yes'],
            ].map(([label, value]) => (
              <div key={label} className="bp-clog-field">
                <span className="bp-clog-field-label">{label}</span>
                <span className="bp-clog-field-value">{value}</span>
              </div>
            ))}
          </div>

          <div className="bp-clog-totals">
            {[
              ['Minutes read', minutes.toLocaleString()],
              ['Books finished', books],
              ['Days logged', days],
              ['Sessions', rows.length],
            ].map(([label, value]) => (
              <div key={label} className="bp-clog-total">
                <span className="bp-clog-total-num">{value}</span>
                <span className="bp-clog-total-label">{label}</span>
              </div>
            ))}
          </div>

          <table className="bp-clog-table">
            <thead>
              <tr>
                <th className="bp-clog-th bp-clog-th--date">Date</th>
                <th className="bp-clog-th">Title</th>
                <th className="bp-clog-th bp-clog-th--num">Logged</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="bp-clog-td bp-clog-td--date">{r.date}</td>
                  <td className="bp-clog-td">
                    <span className="bp-clog-book">{r.title}</span>
                    <span className="bp-clog-by">
                      {r.author}
                      {/* Named, not marked: a printed sheet has no tooltips. */}
                      {r.source && PARTNER_BRANDS[r.source]
                        ? ` · via ${PARTNER_BRANDS[r.source].name}`
                        : ''}
                    </span>
                  </td>
                  <td className="bp-clog-td bp-clog-td--num">
                    {r.completed ? 'Finished' : `${r.minutes} min`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bp-clog-foot">
            <div className="bp-clog-sign">
              <span className="bp-clog-sign-line" />
              <span className="bp-clog-field-label">Parent or guardian signature</span>
            </div>
            <div className="bp-clog-sign">
              <span className="bp-clog-sign-line" />
              <span className="bp-clog-field-label">Date</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

function ChallengesPage({ student }) {
  const [tab, setTab] = useState('current')
  const [logFor, setLogFor] = useState(null)
  // Enrolment is something staff set from this page: the app's own toggle calls
  // `enrollProgram` on every click and draws `check`/`cross` from
  // `isEnrolled`, so the same control puts a reader in a challenge and takes
  // them back out.
  const [rows, setRows] = useState(() =>
    (student.challenges ?? []).map((c) => ({ ...c, enrolled: c.enrolled ?? true })),
  )
  const { toasts, push, dismiss } = useToasts()
  // The app's `viewTicketRewards`: a challenge's drawings replace the page
  // until you come back.
  const [ticketsFor, setTicketsFor] = useState(null)

  function toggleEnrolled(challenge) {
    setRows((prev) => prev.map((c) => (c === challenge ? { ...c, enrolled: !c.enrolled } : c)))
    push(
      challenge.enrolled
        ? { title: 'Unenrolled', body: challenge.name, tone: 'info' }
        : { title: 'Enrolled', body: challenge.name },
    )
  }

  // The app's second column: `completeProgram`, which stamps the challenge
  // complete for this reader and is what the "Completed On" total reads. It's
  // staff's override — a challenge normally completes itself when the reader
  // finishes the work — so unsetting it clears the date again. You can't
  // complete a challenge the reader isn't in, so the control follows enrolment.
  function toggleCompleted(challenge) {
    const on = !challenge.completedOn
    setRows((prev) =>
      prev.map((c) => (c === challenge ? { ...c, completedOn: on ? longToday() : null } : c)),
    )
    push(
      on
        ? { title: 'Marked complete', body: challenge.name }
        : { title: 'Marked not complete', body: challenge.name, tone: 'info' },
    )
  }

  // The app's own table is three columns wide — Challenge, Enrolled?,
  // Completed? — and everything else lives *inside* the challenge cell: the
  // name, the date span, a `ul.program-log-totals` of label:value pairs, and a
  // "View Challenge Log" link. Giving Started and Minutes columns of their own
  // is what made every name wrap in a 560px panel.
  // One card per challenge rather than rows in a table. A challenge isn't a
  // record you scan a column of — it's a block of label:value totals with its
  // own actions — so the single "Challenge" header the table carried was a
  // heading over nothing.
  const renderCard = (c) => (
    <Card key={c.name}>
      {/* The banner bleeds to the card's own edges and takes its top corners —
          it's the challenge's header image, not a thumbnail inside the card. */}
      {bannerSrc(c.banner) && <img className="bp-chal-banner" src={bannerSrc(c.banner)} alt="" />}
      <div className="bp-chal-cell">
        <span className="bp-tbl-name">{c.name}</span>
        <span className="bp-tbl-sub">{c.dates}</span>
        <ul className="bp-chal-totals">
          {c.startedOn && (
            <li>
              <span>Started On:</span> {c.startedOn}
            </li>
          )}
          {c.completedOn && (
            <li>
              <span>Completed On:</span> {c.completedOn}
            </li>
          )}
          {c.minutes != null && (
            <li>
              <span>Minutes:</span> {c.minutes.toLocaleString()}
            </li>
          )}
        </ul>
      </div>
      {/* The app puts these inline in the cell as `View Challenge Log` and
          `View Ticket Rewards` text links; here they're the same row actions
          every table on the profile ends with. Enrolment leads the cluster —
          it's the one control that changes the record rather than opening
          something. The log is the printable sheet, not a detour to the
          reading log, and an upcoming challenge has nothing logged yet;
          Ticket Rewards follows the app's own condition,
          `program.has_ticket_rewards && isEnrolled`. */}
      <RowActions className="bp-card-actions">
        {/* Two identical checkboxes side by side say nothing about which
            column is which — the app has "Enrolled?" and "Completed?" as table
            headers, and a card has no headers to borrow. The tooltip is that
            heading. */}
        <Tooltip content={c.enrolled ? 'Enrolled — unenroll this reader' : 'Enroll this reader'}>
          <CompleteToggle
            done={c.enrolled}
            onChange={() => toggleEnrolled(c)}
            label={c.name}
            wording={{
              set: 'Enroll',
              unset: 'Unenroll',
              on: 'Enrolled',
              off: 'Not enrolled',
            }}
          />
        </Tooltip>
        <Tooltip
          content={
            !c.enrolled
              ? 'Enroll this reader before completing the challenge'
              : c.completedOn
                ? `Completed ${c.completedOn} — mark not complete`
                : 'Mark this challenge complete'
          }
        >
          <CompleteToggle
            done={!!c.completedOn}
            onChange={() => toggleCompleted(c)}
            disabled={!c.enrolled}
            label={c.name}
          />
        </Tooltip>
        {c.startedOn && (
          <RowAction icon="log" label="View challenge log" onClick={() => setLogFor(c)} />
        )}
        {c.hasTicketRewards && c.enrolled && (
          <RowAction icon="ticket" label="View ticket rewards" onClick={() => setTicketsFor(c)} />
        )}
      </RowActions>
    </Card>
  )

  const shown = rows.filter((c) => c.status === tab)

  if (ticketsFor) {
    return (
      <TicketRewardsView
        student={student}
        program={ticketsFor}
        onBack={() => setTicketsFor(null)}
      />
    )
  }

  return (
    <div className="bp-content">
      {logFor && (
        <ChallengeLogSheet
          open={!!logFor}
          onClose={() => setLogFor(null)}
          student={student}
          challenge={logFor}
        />
      )}
      <Hero
        variant="page"
        icon={<PlumpyIcon name="challenges" size={22} />}
        title="Challenges"
        accent={SECTION_ACCENT.challenges.text}
        accentBg={SECTION_ACCENT.challenges.bg}
      />
      <Tabs
        variant="pill"
        size="sm"
        block
        ariaLabel="Challenge status"
        active={tab}
        onChange={setTab}
        items={CHALLENGE_TABS}
      />
      {shown.length === 0 ? (
        <EmptyState
          variant="dashed"
          title={`No ${tab === 'ended' ? 'recent' : tab} challenges`}
          description="Challenges this reader is in will show up here."
        />
      ) : (
        // The container has to be an *ancestor* of what queries it — an element
        // can't match a container query it declares itself. It's this wrapper
        // rather than `.bp-content` because layout containment would make that
        // pane the containing block for the page's `position: fixed`
        // ToastStack.
        <div className="bp-chal-cols">
          <div className="bp-chal-grid">{shown.map(renderCard)}</div>
        </div>
      )}

      {/* Mounted once per page — the stack is `position: fixed`. */}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

// ─── Points ───────────────────────────────────────────────────────────────────
// The app's `_points_summary.html.haml`: one row per point type with its
// running total, and nothing else — no dates, no source, no drill-in. The ten
// types are the ones the partial switches on, in its order.
const POINT_TYPE_LABELS = {
  book: 'Book Points',
  page: 'Page Points',
  minute: 'Minute Points',
  day: 'Day Points',
  moment: 'Learning Moment Points',
  event: 'Library Event Points',
  'standard-activity': 'Standard Activity Points',
  'big-activity': 'Big Activity Points',
  'super-activity': 'Super Activity Points',
  review: 'Review Points',
}
const POINT_TYPE_ORDER = Object.keys(POINT_TYPE_LABELS)

function PointsPage({ student }) {
  const summary = student.pointsSummary ?? {}
  const rows = POINT_TYPE_ORDER.filter((t) => summary[t] != null).map((t) => ({
    type: t,
    label: POINT_TYPE_LABELS[t],
    total: summary[t],
  }))
  const total = rows.reduce((n, r) => n + r.total, 0)

  return (
    <div className="bp-content">
      <Hero
        variant="page"
        icon={<PlumpyIcon name="points" size={22} />}
        title="Points"
        accent={SECTION_ACCENT.points.text}
        accentBg={SECTION_ACCENT.points.bg}
      />
      {rows.length === 0 ? (
        <EmptyState
          variant="dashed"
          title="No points earned"
          description="This reader has not earned any points."
        />
      ) : (
        <Card flush>
          <Table
            flush
            scrollX
            columns={[
              // Plain cell text: a column of point types is a list of labels,
              // and at `.bp-tbl-name`'s 16px/800 every row read as a heading
              // and out-weighed the Total under them.
              { key: 'label', label: 'Point Type', minWidth: 200 },
              {
                key: 'total',
                label: 'Points',
                minWidth: 96,
                align: 'right',
                render: (v) => <span className="bp-pts-value">{v.toLocaleString()}</span>,
              },
            ]}
            rows={rows}
            getRowKey={(r) => r.type}
          />
          {/* Not in the app's table — but a column of subtotals with no total
              is a sum you have to do yourself, and the reader's point balance
              is the question the tab exists to answer. */}
          <div className="bp-pts-total">
            <span>Total</span>
            <span className="bp-pts-value">{total.toLocaleString()}</span>
          </div>
        </Card>
      )}
    </div>
  )
}

// The shipped Lexile chart's own colour — `#F26430`, set on both the line and
// its markers in `useChartData.ts`. Not the section's accent: this one chart
// carries the product's own hue.
const LEXILE_LINE = '#F26430'

// ─── Classes ──────────────────────────────────────────────────────────────────
// Asana 1208185510273613, "Display sections and teachers in a reader's profile":
// a `Classes` tab on school sites with a two-column table — Classroom (linking
// to that section in Classes & Readers > Classes) and Teacher, the section's
// primary teacher as "<First Name> <Last Name>".
//
// The ask behind it: a librarian reviewing sessions for review can't see whose
// class a student is in, and reverse-searching it means running the Individual
// Student Participation and Section Report. School-only, so this is the student
// profile's tab and not the library reader's.
function ClassesPage({ student, onOpenClass }) {
  const classes = student.classes ?? []
  return (
    <div className="bp-content">
      <Hero
        variant="page"
        icon={<PlumpyIcon name="classroom" size={22} />}
        title="Classes"
        accent={SECTION_ACCENT.classes.text}
        accentBg={SECTION_ACCENT.classes.bg}
      />
      {classes.length === 0 ? (
        <EmptyState
          variant="dashed"
          title="No classes"
          description="Sections this student is rostered into will show up here."
        />
      ) : (
        <Card flush>
          <Table
            flush
            scrollX
            columns={[
              {
                key: 'name',
                label: 'Classroom',
                minWidth: 200,
                // The ticket's link: it takes you to that section's page under
                // Classes & Readers. Here that's the classroom behind the
                // panel, so opening one closes the profile onto it.
                render: (v) => (
                  <button type="button" className="bp-class-link" onClick={() => onOpenClass?.(v)}>
                    {v}
                  </button>
                ),
              },
              { key: 'teacher', label: 'Teacher', minWidth: 140 },
            ]}
            rows={classes}
            getRowKey={(c) => c.name}
          />
        </Card>
      )}
    </div>
  )
}

function PlaceholderPage({ pageKey }) {
  const item = NAV_ITEMS.find((n) => !n.divider && n.section === pageKey)
  return (
    <div className="bp-content">
      <Hero
        variant="page"
        icon={<PlumpyIcon name={item?.icon || 'user'} size={22} />}
        title={item?.label || pageKey}
        accent={accentFor(pageKey).text}
        accentBg={accentFor(pageKey).bg}
      />
      <EmptyState title="Coming soon" description="This section is coming soon." />
    </div>
  )
}

// ─── Admin mockup ─────────────────────────────────────────────────────────────
/**
 * The classroom page a teacher opens from Classes — People rail, class header,
 * and the Daily Reading / Students / Earned Rewards tabs.
 *
 * `extraTabs` / `renderExtra` are optional and additive: they let another
 * prototype hang its own tab off this real page instead of cloning it (Words
 * with Benny adds Vocabulary). Left off, the page is exactly as it was — though
 * note the Daily Reading body is now gated on the selected tab, where before it
 * rendered whichever tab was active.
 */
export function ClassroomView({
  onStudentClick,
  className = 'Class A',
  extraTabs = [],
  renderExtra,
  // Which tab to open on. Additive and defaulted, so a prototype that hangs an
  // extra tab off this page can also link straight to it.
  initialTab = 'daily',
}) {
  const [admTab, setAdmTab] = useState(initialTab)
  const extraIds = extraTabs.map((t) => t.id)
  return (
    <div className="bp-adm">
      <Sidebar
        title="People"
        subtitle="Find and log for my students and classes."
        mainRailActive="people"
        nav={[
          { id: 'classes', label: 'Classes', icon: 'overview', desc: 'View and log for classes.' },
          {
            id: 'students',
            label: 'Students',
            icon: 'demographics',
            desc: 'View and log for students.',
          },
          {
            id: 'view-students',
            label: 'View Students',
            icon: 'person',
            subgroup: true,
            desc: 'View and log for students.',
          },
          {
            id: 'flagged',
            label: 'Flagged Entries',
            icon: 'flag',
            subgroup: true,
            desc: 'View and delete all sessions for review, including Flagged Entries.',
          },
        ]}
        active="classes"
      />

      {/* Main content area */}
      <div className="bp-adm-main">
        <div className="bp-adm-main-body">
          <BackBar label="Back to Classes" />
          <PageHeader
            title={className}
            actions={
              <>
                <Button variant="secondary">Print</Button>
                <Button variant="primary">Log for Class</Button>
              </>
            }
          />

          <div className="bp-adm-tabs-wrap">
            <Tabs
              active={admTab}
              onChange={setAdmTab}
              items={[
                { id: 'daily', label: 'Daily Reading' },
                { id: 'students', label: 'Students' },
                { id: 'rewards', label: 'Earned Rewards' },
                ...extraTabs,
              ]}
            />
          </div>

          {extraIds.includes(admTab) ? (
            renderExtra?.(admTab)
          ) : (
            <>
              {/* `compact`: the app's filter *bar* rather than its filter
                  *form* — grey pill controls on a white strip, no labels above
                  them, because each control already names what it filters
                  ("Daily Reading Goal", "Percentages"). It's the newer of the
                  two shapes and costs one row instead of two. */}
              <div className="bp-adm-filter-wrap">
                <FilterBar compact action={<Button variant="primary">Save &amp; Update</Button>}>
                  <FilterItem label="View As">
                    <Select defaultValue="goal">
                      <option value="goal">Daily Reading Goal</option>
                      <option value="pages">Pages</option>
                      <option value="minutes">Minutes</option>
                    </Select>
                  </FilterItem>
                  <FilterItem label="Show As">
                    <Select defaultValue="pct">
                      <option value="pct">Percentages</option>
                      <option value="raw">Raw values</option>
                    </Select>
                  </FilterItem>
                </FilterBar>
              </div>

              {/* `.infobox.helpbox` on the real page — see DailyReading.tsx */}
              <Banner level="info">
                Daily reading is calculated nightly. All reading logged today will appear on the
                tracker tomorrow.
              </Banner>

              <DailyReadingTracker
                weekLabel="5/11 – 5/17 (This Week)"
                rows={CLASS_TABLE.map((row) => {
                  // Only the three built-out students have a profile behind
                  // them; the rest of the roster carries its own name/goal.
                  const profile = STUDENTS[row.key]
                  return {
                    key: row.key,
                    rank: row.rank,
                    name: profile?.name ?? row.name,
                    goal: profile?.sections.habits.dailyGoalMinutes ?? row.goal,
                    average: row.avg,
                    tone: row.ac,
                    days: row.days,
                    onOpen: profile ? () => onStudentClick?.(row.key) : undefined,
                  }
                })}
                average={{ average: '67%', days: ['58%', '50%', '33%', '67%', '24%', null, null] }}
              />
            </>
          )}
        </div>
        {/* bp-adm-main-body */}
      </div>
    </div>
  )
}

// ─── Profile pager ────────────────────────────────────────────────────────────
// Step between the students on the page without closing the panel. The section
// stays put, so you can compare the same tab across readers.
export const STUDENT_ORDER = ['marcus', 'anne', 'tyler']

// `variant`: 'inline' is the pair of wide buttons in the mobile nav bar;
// 'float' is the round pair in the floating control rail beside the panel. Both
// use left/right chevrons — the rail stacks them, but they step through a
// horizontal list of readers, not up and down one.
function ProfilePager({ currentKey, onSelect, variant = 'inline' }) {
  const idx = STUDENT_ORDER.indexOf(currentKey)
  const prev = idx > 0 ? STUDENT_ORDER[idx - 1] : null
  const next = idx < STUDENT_ORDER.length - 1 ? STUDENT_ORDER[idx + 1] : null
  const float = variant === 'float'
  const btnClass = float ? 'bp-ctrl-btn' : 'bp-pager-btn'
  const icon = float ? { size: 18, stroke: 2.2 } : { size: 17, stroke: 2.2 }

  return (
    <div className={float ? 'bp-ctrl-group' : 'bp-pager'}>
      <button
        type="button"
        className={btnClass}
        disabled={!prev}
        onClick={() => prev && onSelect(prev)}
        title={prev ? `Previous — ${STUDENTS[prev].name}` : 'No previous student'}
        aria-label={prev ? `Previous student, ${STUDENTS[prev].name}` : 'No previous student'}
      >
        <Icon name="chevron-left" {...icon} />
      </button>
      <button
        type="button"
        className={btnClass}
        disabled={!next}
        onClick={() => next && onSelect(next)}
        title={next ? `Next — ${STUDENTS[next].name}` : 'No next student'}
        aria-label={next ? `Next student, ${STUDENTS[next].name}` : 'No next student'}
      >
        <Icon name="chevron-right" {...icon} />
      </button>
    </div>
  )
}

// ─── Deep links ───────────────────────────────────────────────────────────────
// The panel is addressable: `#/marcus` opens Marcus's overview in the side
// panel, `#/marcus/lexile` opens a tab, `#/marcus/lexile/full` opens it
// expanded. A link to a reader was the piece of the review that the expand
// button alone didn't answer — you can send someone the exact view you're
// looking at, the way you would an Asana task.
const SECTION_KEYS = new Set(NAV_ITEMS.map((n) => n.section).filter(Boolean))

// Links carry the reader-facing name, not the data key: the four analysis
// sections were renamed for teachers while their keys stayed put, so `skills`
// and `habits` would make for links nobody could read. Everything else already
// matches its label.
const SECTION_SLUGS = {
  motivation: 'motivation',
  integrity: 'book-talks',
  habits: 'goals',
  skills: 'lexile',
  readinglog: 'reading-log',
}
const slugFor = (section) => (section ? (SECTION_SLUGS[section] ?? section) : 'overview')
const sectionFor = (slug) => {
  if (!slug || slug === 'overview') return null
  const named = Object.entries(SECTION_SLUGS).find(([, v]) => v === slug)
  if (named) return named[0]
  return SECTION_KEYS.has(slug) ? slug : null
}

function readHash() {
  const [key, slug, mode] = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (!STUDENTS[key]) return null
  return { key, section: sectionFor(slug), mode: mode === 'full' ? 'full' : 'side' }
}

// `replaceState` rather than assigning `location.hash`: it doesn't fire
// `hashchange` (so reading and writing can't loop) and switching tabs doesn't
// pile up history entries.
function writeHash(key, section, mode) {
  const next = key
    ? `#/${[key, slugFor(section), mode === 'full' ? 'full' : null].filter(Boolean).join('/')}`
    : window.location.pathname + window.location.search
  if (next !== (key ? window.location.hash : window.location.href)) {
    window.history.replaceState(null, '', next)
  }
}

// ─── Floating control rail ────────────────────────────────────────────────────
// Panel chrome — close, expand, step between readers — lives in its own column
// beside the panel rather than in the student header, which is the reader's
// identity and their Actions/Log menus. Only the standalone prototype has it;
// the RIS embed is inside RIS's own side Modal and keeps the header close.
function ProfileCtrls({ onClose, expanded, onToggleExpand, currentKey, onSelectStudent }) {
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="bp-profile-ctrls">
      <div className="bp-ctrl-group">
        <button
          type="button"
          className="bp-ctrl-btn"
          onClick={onClose}
          title="Close profile"
          aria-label="Close profile"
        >
          <Icon name="x" size={18} stroke={2.2} />
        </button>
        <button
          type="button"
          className="bp-ctrl-btn bp-ctrl-btn--expand"
          onClick={onToggleExpand}
          title={expanded ? 'Exit full screen' : 'Expand to full screen'}
          aria-label={expanded ? 'Exit full screen' : 'Expand to full screen'}
        >
          <Icon name={expanded ? 'minimize' : 'maximize'} size={18} stroke={2.1} />
        </button>
        <button
          type="button"
          className={`bp-ctrl-btn${copied ? ' bp-ctrl-btn--done' : ''}`}
          onClick={copyLink}
          title={copied ? 'Link copied' : 'Copy link to this view'}
          aria-label={copied ? 'Link copied' : 'Copy link to this view'}
        >
          <Icon name={copied ? 'check' : 'link'} size={18} stroke={2.1} />
        </button>
      </div>
      <ProfilePager variant="float" currentKey={currentKey} onSelect={onSelectStudent} />
    </div>
  )
}

// ─── The profile panel ────────────────────────────────────────────────────────
// Control rail + header + nav + page — everything inside the panel, in one
// place. Both surfaces render this: the standalone prototype inside its own
// sliding wrap, and the RIS/SFR embed inside a side Modal. It used to be two
// near-identical trees, which meant every new page had to be routed twice and
// the chrome quietly drifted apart between them.
function ProfileBody({
  student,
  activeSection,
  onNavigate,
  onClose,
  expanded,
  onToggleExpand,
  currentKey,
  onSelectStudent,
  onOpenClass,
  extraNav = [],
  renderExtra,
  renderAfterSummary,
}) {
  const extraSections = extraNav.map((n) => n.section)
  // The daily goal lives here because three places read it — the Overview's
  // week tracker, the Goals page's ring, and the modal that changes it — and
  // only the body sees all three. Reset per student: it's their goal, not the
  // panel's. Not persisted past a reload, like the rest of the demo's forms.
  const [goal, setGoal] = useState(student.sections.habits.dailyGoalMinutes)
  const [editingGoal, setEditingGoal] = useState(false)
  useEffect(() => setGoal(student.sections.habits.dailyGoalMinutes), [student])

  return (
    <>
      <EditGoalModal
        open={editingGoal}
        onClose={() => setEditingGoal(false)}
        goal={goal}
        onSave={setGoal}
      />
      <ProfileCtrls
        onClose={onClose}
        expanded={expanded}
        onToggleExpand={onToggleExpand}
        currentKey={currentKey}
        onSelectStudent={onSelectStudent}
      />
      <div className="bp-root">
        {/* The header spans the rail as well as the content — it identifies the
    whole panel, not just the page inside it. Panel chrome (close, expand,
    reader stepping) is in `ProfileCtrls`; the header keeps a close button for
    the phone breakpoint, where the rail is hidden. */}
        <StudentHeader student={student} onClose={onClose} />
        <div className="bp-root-body">
          <LeftNav activeSection={activeSection} onNavigate={onNavigate} extraNav={extraNav} />
          <div className="bp-panel">
            <MobileSectionNav
              activeSection={activeSection}
              onNavigate={onNavigate}
              extraNav={extraNav}
            />
            <div key={`${currentKey}-${activeSection ?? 'overview'}`} className="bp-page-fade">
              {extraSections.includes(activeSection) ? (
                renderExtra?.(activeSection, student)
              ) : activeSection === null ? (
                <Overview
                  student={student}
                  onNavigate={onNavigate}
                  goal={goal}
                  renderAfterSummary={renderAfterSummary}
                />
              ) : ANALYSIS_SECTIONS.has(activeSection) ? (
                <SectionDetail
                  student={student}
                  sectionKey={activeSection}
                  goal={goal}
                  onEditGoal={() => setEditingGoal(true)}
                />
              ) : activeSection === 'readinglog' ? (
                <ReadingLogPage reader={student} />
              ) : activeSection === 'classes' ? (
                <ClassesPage student={student} onOpenClass={onOpenClass} />
              ) : activeSection === 'points' ? (
                <PointsPage student={student} />
              ) : activeSection === 'reviews' ? (
                <ReviewsPage student={student} />
              ) : activeSection === 'badges' ? (
                <BadgesPage student={student} />
              ) : activeSection === 'activities' ? (
                <ActivitiesPage student={student} />
              ) : activeSection === 'drawings' ? (
                <DrawingsPage student={student} key={student.name} />
              ) : activeSection === 'rewards' ? (
                <RewardsPage student={student} key={student.name} />
              ) : activeSection === 'challenges' ? (
                <ChallengesPage student={student} />
              ) : (
                <PlaceholderPage pageKey={activeSection} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Embeddable profile panel (used by RIS + SFR's StudentPanel slide-in) ─────
// Same rail, same pager, same expand as the standalone: the host only supplies
// the close handler and, because it owns the panel's width, the expanded flag.
/**
 * `initialSection`, `extraNav`, `renderExtra`, `renderAfterSummary` and
 * `overrides` are optional and additive — they let another prototype open the
 * real profile on a section of its own (Words with Benny adds Vocabulary,
 * Engagement Signals adds Engagement and a card at the top of the Overview)
 * instead of building a second, bespoke student panel. `overrides` merges onto the resolved student, so a
 * roster row that has no full profile behind it still shows the right person in
 * the header. Left off, the profile is exactly as it was.
 */
export function StudentProfileView({
  studentKey,
  onClose,
  expanded,
  onToggleExpand,
  initialSection = null,
  extraNav = [],
  renderExtra,
  renderAfterSummary,
  overrides,
}) {
  const [activeSection, setActiveSection] = useState(initialSection)
  // The pager steps readers inside the panel, so the open reader is local state
  // seeded from the host — which stays in charge of *opening* the panel.
  const [currentKey, setCurrentKey] = useState(studentKey)
  useEffect(() => setCurrentKey(studentKey), [studentKey])
  const base = STUDENTS[currentKey] || STUDENTS.marcus
  const student = overrides ? { ...base, ...overrides } : base

  return (
    <div className={`bp-embed${expanded ? ' bp-embed--full' : ''}`}>
      <ProfileBody
        student={student}
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onClose={onClose}
        expanded={expanded}
        onToggleExpand={onToggleExpand}
        currentKey={currentKey}
        onSelectStudent={setCurrentKey}
        extraNav={extraNav}
        renderExtra={renderExtra}
        renderAfterSummary={renderAfterSummary}
      />
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
// Kept in step with the `slideInRight` / `slideOutRight` timing in the CSS.
const SLIDE_MS = 260

export default function BeanstackProfile() {
  const [activeSection, setActiveSection] = useState(null)
  const [profileMode, setProfileMode] = useState('closed')
  const [selectedStudentKey, setSelectedStudentKey] = useState(null)
  const [closing, setClosing] = useState(false)

  const student = selectedStudentKey ? STUDENTS[selectedStudentKey] : null

  // The class table opens a reader two ways, as the product does: the row is a
  // quick look (slide-in panel), the name is the profile page itself.
  const handleStudentClick = (key, mode = 'side') => {
    setSelectedStudentKey(key)
    setActiveSection(null)
    setClosing(false)
    setProfileMode(mode)
  }

  const toggleExpand = () => setProfileMode((m) => (m === 'full' ? 'side' : 'full'))

  // The URL is the source of truth on load and on back/forward; after that the
  // panel keeps it in step. `hydrated` stops the writer clobbering the incoming
  // hash on the very first render, before the reader's state has landed.
  const hydrated = useRef(false)

  useEffect(() => {
    const apply = () => {
      const route = readHash()
      if (!route) {
        setProfileMode('closed')
        return
      }
      setSelectedStudentKey(route.key)
      setActiveSection(route.section)
      setClosing(false)
      setProfileMode(route.mode)
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [])

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true
      return
    }
    if (profileMode === 'closed' || !selectedStudentKey) writeHash(null)
    else writeHash(selectedStudentKey, activeSection, profileMode)
  }, [profileMode, selectedStudentKey, activeSection])

  // The class a profile's Classes tab sent us to. The ticket's link "takes the
  // user to that section's page in Classes & Readers > Classes" — here that
  // page is the classroom behind the panel, so opening a section names it and
  // closes the profile onto it.
  const [shownClass, setShownClass] = useState('Class A')
  const openClass = (name) => {
    setShownClass(name)
    closeProfile()
  }

  // Slide out the way it slid in, then unmount — the panel used to vanish on
  // the same frame as the click.
  const closeProfile = () => {
    if (closing) return
    setClosing(true)
    setTimeout(() => {
      setProfileMode('closed')
      setClosing(false)
    }, SLIDE_MS)
  }

  return (
    <div className="bp-shell">
      {/* Admin bg */}
      <div className={`bp-shell-admin${profileMode === 'full' ? ' bp-shell-admin--hidden' : ''}`}>
        <ClassroomView onStudentClick={handleStudentClick} className={shownClass} />
      </div>

      {/* Dim overlay */}
      {profileMode === 'side' && (
        <div
          className={`bp-shell-overlay${closing ? ' bp-shell-overlay--closing' : ''}`}
          onClick={closeProfile}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        />
      )}

      {/* Profile panel */}
      {profileMode !== 'closed' && student && (
        <div
          className={`bp-profile-wrap${profileMode === 'full' ? ' bp-profile-wrap--full' : ''}${closing ? ' bp-profile-wrap--closing' : ''}`}
        >
          {/* Rail + panel are one sliding unit, so the controls travel with the
    panel edge on open, close and expand instead of sitting still. */}
          <div className="bp-profile-slider">
            <ProfileBody
              student={student}
              activeSection={activeSection}
              onNavigate={setActiveSection}
              onClose={closeProfile}
              expanded={profileMode === 'full'}
              onToggleExpand={toggleExpand}
              currentKey={selectedStudentKey}
              onSelectStudent={setSelectedStudentKey}
              onOpenClass={openClass}
            />
          </div>
        </div>
      )}
    </div>
  )
}
