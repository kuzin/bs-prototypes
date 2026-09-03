import { useState, useEffect, useRef, cloneElement } from 'react'
import './BeanstackProfile.css'
import '../ris/components/SchoolDashboard.css'
import { C, LABEL, Ic } from '@components/ui'
import { Card, SectionHeading, GoalRing, CoverImage } from './components/kit'
import {
  DonutChart,
  SplitDonutChart,
  ReadingHeatmap,
  GoalTracker,
  EXTRINSIC_COLOR,
} from './components/widgets'
import { Button } from '@components/Button/Button'
import { Select, Checkbox, Field, Input, Textarea, DateInput } from '@components/Form/Form'
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
import { Sidebar } from '@components/Sidebar/Sidebar'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import { RMI_ICONS } from '@components/RmiIcons/RmiIcons'
import { Icon } from '@components/Icon/Icon'
import { PartnerMark, PARTNER_BRANDS } from '@components/PartnerBrand/PartnerBrand'
import { Flyout } from '@components/Flyout/Flyout'
import { Modal } from '@components/Modal/Modal'
import { Tabs } from '@components/Tabs/Tabs'
import { Toggle } from '@components/Toggle/Toggle'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { Hero } from '@components/Hero/Hero'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { ChartLegend } from '@components/charts/charts'
import { SessionModal } from '../sfr/components/SessionModal'
import { TALK_KINDS } from '../btwb/data'

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
    icon: <Icon name="circle-minus" size={17} stroke={2.2} color="#DC2626" />,
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
    <Modal open={open} onClose={onClose} variant="center" ariaLabel={title}>
      {({ close }) => (
        <div className="bp-act-modal">
          <div className="bp-act-modal-head">
            <span className="bp-act-modal-title">{title}</span>
            <IconButton variant="ghost" size="sm" aria-label="Close" onClick={close}>
              <Icon name="x" size={18} stroke={2.2} />
            </IconButton>
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
            icon={<Icon name="dots" size={16} />}
            iconRight={
              <Icon
                name="chevron-down"
                size={11}
                stroke={2.5}
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
                size={11}
                stroke={2.5}
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
        {/* A round, per-reader colour: the header is a person, not an
    organisation, and stepping the pager should visibly change reader. The
    hues are identity only — deliberately none of the status palette, so
    Tyler doesn't read as "the red student". */}
        <Avatar
          initials={student.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)}
          color={student.avatarColor}
          size="lg"
        />
        <div>
          <div className="bp-panel-name">{student.name}</div>
          <div className="bp-panel-meta">
            <span>{student.grade}</span>
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
  overview: { bg: '#F1F5F9', text: '#64748B' },
  motivation: C.motivation,
  integrity: C.integrity,
  habits: C.habits,
  skills: C.skills,
  readinglog: { bg: '#E0F2FE', text: '#0284C7' },
  challenges: { bg: '#FEF3C7', text: '#B45309' },
  rewards: { bg: '#FCE7F3', text: '#9D174D' },
  drawings: { bg: '#EEF2FF', text: '#4F46E5' },
  activities: { bg: '#F1EBFF', text: '#7C3AED' },
  badges: { bg: '#EFFBF9', text: '#0D9488' },
  achievements: { bg: '#FFEDD5', text: '#C2410C' },
  reviews: { bg: '#FFE4E6', text: '#BE123C' },
  textchallenges: { bg: '#E6F1FF', text: '#1A6DD5' },
}
const accentFor = (section) => SECTION_ACCENT[section ?? 'overview'] ?? SECTION_ACCENT.overview

// One flat rail — every destination is labelled and styled the same. The old
// split (Overview apart, the four analysis sections in a bracketed subgroup,
// the rest icon-only) made the lower nine look like second-class items you had
// to hover to identify.
const NAV_ITEMS = [
  { icon: 'ti-user', section: null, label: 'Overview' },
  // What the reader actually did comes before the analysis derived from it.
  { icon: 'ti-reading-log', section: 'readinglog', label: 'Reading Log' },
  { icon: 'ti-trophy', section: 'challenges', label: 'Challenges' },
  { icon: 'ti-flame', section: 'motivation', label: LABEL.motivation },
  { icon: 'ti-shield-check', section: 'integrity', label: LABEL.integrity },
  { icon: 'ti-calendar-stats', section: 'habits', label: LABEL.habits },
  { icon: 'ti-book-2', section: 'skills', label: LABEL.skills },
  { icon: 'ti-gift', section: 'rewards', label: 'Rewards' },
  { icon: 'ti-pencil', section: 'drawings', label: 'Drawings' },
  { icon: 'ti-puzzle', section: 'activities', label: 'Activities' },
  { icon: 'ti-badge', section: 'badges', label: 'Badges' },
  { icon: 'ti-certificate', section: 'achievements', label: 'Achievements' },
  { icon: 'ti-rating', section: 'reviews', label: 'Reviews' },
  { icon: 'ti-paragraph', section: 'textchallenges', label: 'Text Box' },
]
const ANALYSIS_SECTIONS = new Set(['motivation', 'integrity', 'habits', 'skills'])

// Every profile-coloured tint (control rail, nav active state, the Log button)
// derives from this one property in CSS via `color-mix`, so a reader needs a
// single authored hex rather than a hand-mixed scale. The Hero icon chips stay
// on `SECTION_ACCENT` — the section you're on still has its own colour.
const profileVars = (student) => ({ '--bp-profile': student.avatarColor })

function LeftNav({ activeSection, onNavigate, pager, extraNav = [] }) {
  return (
    <nav className="bp-nav">
      <div className="bp-nav-items">
        {[...NAV_ITEMS, ...extraNav].map(({ icon, section, label }) => {
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
              <Ic name={icon} size={18} style={{ opacity: active ? 1 : 0.4 }} />
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
  return (
    <div className="bp-mobile-nav">
      <Select
        size="sm"
        aria-label="Profile section"
        value={activeSection ?? 'overview'}
        onChange={(e) => onNavigate(e.target.value === 'overview' ? null : e.target.value)}
      >
        {[...NAV_ITEMS, ...extraNav].map(({ section, label }) => (
          <option key={label} value={section ?? 'overview'}>
            {label}
          </option>
        ))}
      </Select>
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
        <CoverImage isbn={t.isbn} title={t.title} />
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
  current: { bg: '#FEF3C7', text: '#92400E', bar: '#D97706' },
  longest: { bg: '#DFF4F7', text: '#0B6B78', bar: '#0E9AAB' },
  minutes: { bg: '#EEF2F7', text: '#334155', bar: '#64748B' },
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
      icon: 'flame',
      accent: STAT_TINTS.current,
      label: 'Current streak',
      value: ov.currentStreak,
      unit: days(ov.currentStreak),
      trend: { delta: mo.currentStreak, format: (n) => `${n} ${days(n)}` },
    },
    {
      key: 'habits',
      section: 'habits',
      icon: 'calendar-stats',
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
      icon: 'shield-check',
      accent: C.integrity,
      label: 'Recent flags',
      value: ov.flags,
      unit: ov.flags === 1 ? 'flag' : 'flags',
      trend: { delta: mo.flags, inverse: true },
    },
    {
      key: 'motivation',
      section: 'motivation',
      icon: 'flame',
      accent: C.motivation,
      label: 'Top motivation factor',
      motivators: ov.motivators?.slice(0, 1),
      empty: 'No clear motivator found',
      trend: { delta: mo.rmi, format: (n) => `${n} RMI` },
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
      icon: 'book-2',
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
        <Icon name={icon} size={16} />
      </span>
      <span className="bp-statrow-label">{label}</span>
      {children}
      {onOpen && (
        <Icon name="chevron-right" size={16} className="bp-statrow-go" aria-hidden="true" />
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
        <div className="bp-latest-head-right">
          {scrollable && (
            <div className="bp-latest-arrows">
              <Tooltip content="Previous titles">
                <button
                  type="button"
                  className="bp-heatmap-nav-btn"
                  onClick={() => page(-1)}
                  disabled={!left}
                  aria-label="Previous titles"
                >
                  <Icon name="chevron-left" size={13} stroke={2.2} />
                </button>
              </Tooltip>
              <Tooltip content="More titles">
                <button
                  type="button"
                  className="bp-heatmap-nav-btn"
                  onClick={() => page(1)}
                  disabled={!right}
                  aria-label="More titles"
                >
                  <Icon name="chevron-right" size={13} stroke={2.2} />
                </button>
              </Tooltip>
            </div>
          )}
          <button type="button" className="bp-latest-link" onClick={() => onNavigate('readinglog')}>
            Reading Log
            <Icon name="arrow-right" size={14} />
          </button>
        </div>
      </div>
      <div className="bp-latest-grid" ref={ref} onScroll={sync}>
        {titles
          .slice()
          .reverse()
          .map((t, i) => (
            <a
              key={i}
              className="bp-latest-item"
              href={`https://openlibrary.org/isbn/${t.isbn}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="bp-latest-cover">
                <CoverImage isbn={t.isbn} title={t.title} />
                <span className="bp-latest-lexile">{t.lexile}L</span>
              </div>
              <div className="bp-latest-title">{t.title}</div>
              <div className="bp-latest-author">{t.author}</div>
            </a>
          ))}
      </div>
    </>
  )
}

function OverviewStats({ metrics, onOpen, range, onRangeChange }) {
  const [showMore, setShowMore] = useState(false)
  const shown = metrics.filter((m) => !m.more || showMore)
  const hidden = metrics.filter((m) => m.more).length

  return (
    <div className="bp-card bp-statlist">
      <div className="bp-statlist-head">
        <SectionHeading>At a glance</SectionHeading>
        <Tabs
          variant="pill"
          size="sm"
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
        <button type="button" className="bp-statlist-more" onClick={() => setShowMore((v) => !v)}>
          {showMore ? 'Show less' : `Show ${hidden} more`}
          <Icon name={showMore ? 'chevron-up' : 'chevron-down'} size={14} stroke={2.4} />
        </button>
      )}
    </div>
  )
}

function Overview({ student, onNavigate, goal }) {
  const [range, setRange] = useState('year')
  const ov = student.overview[range]
  const metrics = overviewMetrics(ov)

  return (
    <div className="bp-content">
      <Hero
        icon={<Ic name="ti-user" />}
        title="Overview"
        accent={SECTION_ACCENT.overview.text}
        accentBg={SECTION_ACCENT.overview.bg}
      />
      {/* Benny says — the summary leads the page */}
      <Card>
        <SectionHeading>Benny says...</SectionHeading>
        <BennyBubble timestamp={student.lastRun}>{emphasize(student.bennySummary)}</BennyBubble>
      </Card>

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
        icon={<Ic name={c.icon} />}
        title={LABEL[sectionKey]}
        accent={c.text}
        accentBg={c.bg}
        action={
          sectionKey === 'habits' ? (
            <Button
              variant="secondary"
              size="sm"
              icon={<Icon name="pencil" size={14} />}
              onClick={onEditGoal}
            >
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

  // `rmiHistory` is newest first; a chart reads the other way. Every index has
  // carried its own deltas all along — they were just never shown, so a page
  // about motivation couldn't say whether motivation was rising.
  const history = [...sec.rmiHistory].reverse()
  const prev = sec.rmiHistory[periodIdx + 1]
  const goalDelta = prev ? rmi.readingGoalMinutes - prev.readingGoalMinutes : null
  const trend = (delta) => <TrendDelta delta={delta} format={(n) => `${n}%`} />

  return (
    <>
      <Card>
        <Select
          value={periodIdx}
          onChange={(e) => setPeriodIdx(Number(e.target.value))}
          style={{ width: '100%' }}
        >
          {sec.rmiHistory.map((r, i) => (
            <option key={i} value={i}>
              {r.period} ({r.range})
            </option>
          ))}
        </Select>

        <div className="bp-rmi-donuts">
          <DonutChart
            value={rmi.intrinsicAvg}
            max={rmi.intrinsicMax}
            label="Intrinsic"
            color={c.bar}
            trend={trend(rmi.intrinsicDelta)}
          />
          <SplitDonutChart
            intrinsicVal={rmi.intrinsicAvg}
            extrinsicVal={rmi.extrinsicAvg}
            max={rmi.motivationMax}
            label="Overall"
            intrinsicColor={c.bar}
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
        <div className="bp-rmi-donuts-note">Change against the previous index</div>
      </Card>

      {/* Where the index has been. One period's donuts can't tell you whether a
          19.2 is a recovery or a slide, which is the question the page is for. */}
      {history.length > 1 && (
        <Card>
          <SectionHeading>Index over time</SectionHeading>
          <div className="bp-chart-fit" style={{ '--chart-h': '180px' }}>
            <TrendChart
              type="line"
              data={history.map((r) => ({
                period: r.period.replace(' Index', ''),
                overall: r.motivationAvg,
                intrinsic: r.intrinsicAvg,
                extrinsic: r.extrinsicAvg,
              }))}
              xKey="period"
              yDomain={[0, rmi.motivationMax]}
              height="sm"
              series={[
                { key: 'overall', name: 'Overall', color: c.bar },
                { key: 'intrinsic', name: 'Intrinsic', color: c.bar, dashed: true, fillOpacity: 0 },
                {
                  key: 'extrinsic',
                  name: 'Extrinsic',
                  color: EXTRINSIC_COLOR,
                  dashed: true,
                  fillOpacity: 0,
                },
              ]}
            />
          </div>
          <ChartLegend
            items={[
              { color: c.bar, label: 'Overall' },
              { color: c.bar, label: 'Intrinsic', dashed: true },
              { color: EXTRINSIC_COLOR, label: 'Extrinsic', dashed: true },
            ]}
          />
        </Card>
      )}

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
            const mColor = EXTRINSIC_NAMES.has(m.name) ? EXTRINSIC_COLOR : c.bar
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
  'book-swap': { icon: 'swap', label: 'Book transfer', color: '#D97706' },
  'time-warning': { icon: 'clock', label: 'Time concern', color: '#6B7280' },
  'btwb-incomplete': { icon: 'signature', label: 'BTWB incomplete', color: '#059669' },
  'missing-details': { icon: 'list', label: 'Missing details', color: '#DC2626' },
  'over-limit': { icon: 'alert-triangle', label: 'Logged over limit', color: '#D97706' },
}

function SessionFlag({ type }) {
  const cfg = SESSION_FLAGS[type]
  if (!cfg) return null
  return (
    <span className="bp-session-flag" title={cfg.label} style={{ '--flag-color': cfg.color }}>
      <Icon name={cfg.icon} size={15} />
    </span>
  )
}

// Flag filter values that aren't a single flag type.
const FLAG_FILTER_ANY = 'any'
const FLAG_FILTER_NONE = 'none'

// Which flags this student actually drew, most frequent first. Derived from the
// talk rows rather than an authored breakdown, so the ranking always agrees
// with the list underneath it.
function topFlags(talks) {
  const counts = {}
  for (const t of talks) for (const f of t.flags) counts[f] = (counts[f] ?? 0) + 1
  return Object.entries(counts)
    .map(([type, count]) => ({ type, count, ...SESSION_FLAGS[type] }))
    .sort((a, b) => b.count - a.count)
}

function IntegrityDetail({ sec, student }) {
  const [openSession, setOpenSession] = useState(null)
  // Real sessions built from this student's own talks — not SFR's fixtures.
  const [sessions, setSessions] = useState(() =>
    sec.bookTalks.map((talk, i) => talkSession(talk, student, i)),
  )
  const [kindFilter, setKindFilter] = useState('all')
  const [flagFilter, setFlagFilter] = useState(FLAG_FILTER_ANY)

  const talks = sec.bookTalks
  const flags = topFlags(talks)

  const shown = talks.filter((t) => {
    if (kindFilter !== 'all' && t.kind !== kindFilter) return false
    if (flagFilter === FLAG_FILTER_NONE) return t.flags.length === 0
    if (flagFilter !== FLAG_FILTER_ANY) return t.flags.includes(flagFilter)
    return true
  })

  // The row you clicked opens *its* session.
  function openRow(rowIdx) {
    const talk = shown[rowIdx]
    const idx = sec.bookTalks.indexOf(talk)
    setOpenSession(sessions[idx] ?? null)
  }

  function handleUpdateSession(updated) {
    setSessions(sessions.map((s) => (s.id === updated.id ? updated : s)))
    setOpenSession(updated)
  }

  return (
    <>
      <Card>
        <SectionHeading>Top flags</SectionHeading>
        {flags.length > 0 ? (
          flags.map((f) => (
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

      <FilterBar>
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
            <option value={FLAG_FILTER_NONE}>No flags</option>
            {flags.map((f) => (
              <option key={f.type} value={f.type}>
                {f.label}
              </option>
            ))}
          </Select>
        </FilterItem>
      </FilterBar>

      <Card flush>
        <Table
          flush
          compact
          scrollX
          columns={[
            { key: 'date', label: 'Date', width: 84 },
            { key: 'title', label: 'Title' },
            {
              key: 'kind',
              label: 'Type',
              width: 116,
              render: (kind) => (
                <Pill color={TALK_KINDS[kind].color} size="sm">
                  {TALK_KINDS[kind].short}
                </Pill>
              ),
            },
            {
              key: 'flags',
              label: 'Flags',
              align: 'right',
              width: 78,
              render: (rowFlags) =>
                rowFlags.length ? (
                  <span className="bp-session-flags">
                    {rowFlags.map((f) => (
                      <SessionFlag key={f} type={f} />
                    ))}
                  </span>
                ) : (
                  <span className="bp-talk-noflag">—</span>
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
        <div className="bp-goal-hero">
          <GoalRing minutes={todayMins} goal={goal} color={c.bar} />
          <div className="bp-goal-hero-main">
            <div className="bp-goal-title">{goal} minutes a day</div>
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
        </div>
      </Card>

      {/* Heatmap */}
      <ChartCard
        title="Reading activity"
        bodyPad="padded"
        footer={
          <div className="bp-heatmap-legend">
            {[
              { bg: '#EAECF0', label: 'No reading' },
              { bg: c.bar, label: 'Read', read: true },
              { bg: c.bar, label: 'Goal met', read: true, goal: true },
              { bg: c.bar, label: 'Streak', read: true, goal: true, streak: true },
            ].map((item, i) => (
              <div key={i} className="bp-heatmap-legend-item">
                <div
                  className={[
                    'bp-heatmap-cell',
                    item.read && 'bp-heatmap-cell--read',
                    item.goal && 'bp-heatmap-cell--goal',
                    item.streak && 'bp-heatmap-cell--streak',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ '--cell-bg': item.bg }}
                />
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
function TrendDelta({ delta, format, inverse = false, suffix }) {
  if (delta == null || delta === 0) return null
  const up = delta > 0
  const good = inverse ? !up : up
  const n = Math.abs(delta)
  return (
    <span className={`bp-trend${good ? ' bp-trend--good' : ' bp-trend--bad'}`}>
      {up ? '↑' : '↓'}
      {format ? format(n) : n}
      {suffix ? ` ${suffix}` : ''}
    </span>
  )
}

function LexileDelta({ value, suffix }) {
  return <TrendDelta delta={value} format={(n) => `${n}L`} suffix={suffix} />
}

function SkillsDetail({ sec, c }) {
  const lexileAxis = niceLexileAxis([...sec.lexileHistory.map((d) => d.avg), sec.gradeLevel])

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
          <span className="bp-statrow-note">{topTitle.title}</span>
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

      <Card>
        <SectionHeading>Lexile trend</SectionHeading>
        <div className="bp-chart-fit" style={{ '--chart-h': '180px' }}>
          <TrendChart
            type="line"
            data={sec.lexileHistory.map((d) => ({
              month: d.month,
              avg: d.avg,
              grade: sec.gradeLevel,
            }))}
            xKey="month"
            yDomain={lexileAxis.domain}
            yTicks={lexileAxis.ticks}
            yUnit="L"
            height="sm"
            series={[
              { key: 'avg', name: 'Lexile', color: c.bar },
              {
                key: 'grade',
                name: sec.gradeLevelLabel || 'Grade level',
                color: '#9CA3AF',
                dashed: true,
                fillOpacity: 0,
              },
            ]}
          />
        </div>
        <ChartLegend
          items={[
            { color: c.bar, label: 'Monthly Lexile' },
            { color: '#9CA3AF', label: sec.gradeLevelLabel || 'Grade level', dashed: true },
          ]}
        />
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
    avatarColor: '#0F766E',
    // Marcus reads in Comics Plus, and is verified — his 1,000-minute read-a-thon
    // day is real, so his logs are trusted past the site's daily limit.
    status: ['comicsplus', 'verified'],
    grade: '7th Grade',
    lastRun: 'May 15 at 9:55am',
    rewards: [
      { name: 'Free Book Coupon', claimed: true },
      { name: 'Beanstack Bookmark', claimed: true },
      { name: 'Front-of-Lunch-Line Pass', claimed: true },
      { name: 'Library Tote Bag', claimed: false },
    ],
    drawings: [
      { name: 'Logging Week 2', claimed: true },
      { name: 'Spring Reading -- April', claimed: true },
      { name: 'Shout Out', claimed: false },
    ],
    challenges: [
      {
        name: 'Spring Reading Challenge 2025',
        dates: 'Mar 1, 2025 - May 31, 2025',
        startedOn: 'March 3, 2025',
        minutes: 2140,
        status: 'current',
      },
      {
        name: 'Read Across America',
        dates: 'Ongoing',
        startedOn: 'March 2, 2025',
        minutes: 480,
        status: 'current',
      },
      {
        name: 'Winter Reading Bingo',
        dates: 'Jan 6, 2025 - Feb 28, 2025',
        startedOn: 'January 8, 2025',
        minutes: 1620,
        status: 'ended',
      },
      {
        name: 'Summer Reading 2024',
        dates: 'Jun 1, 2024 - Aug 31, 2024',
        startedOn: 'June 4, 2024',
        minutes: 3010,
        status: 'past',
      },
    ],
    // Activity badges from the site's exploration challenge: each badge is a set
    // of activities the reader checks off.
    activityBadges: [
      {
        name: 'Space',
        icon: 'rocket',
        color: '#4F46E5',
        activities: [
          {
            text: 'Watch a live feed from the International Space Station and write down one thing you saw that surprised you.',
            done: true,
          },
          {
            text: "Read a book or article about a planet you couldn't point to on a map. What is one fact you didn't know?",
            done: true,
          },
          {
            text: 'Find out what time the ISS passes over your town tonight, then go outside and look for it.',
            done: false,
          },
        ],
      },
      {
        name: 'American Landmark',
        icon: 'building-monument',
        color: '#B45309',
        activities: [
          {
            text: 'Pick an American landmark and find out who built it and why. Was it built for the reason you expected?',
            done: true,
          },
          {
            text: 'Take a virtual tour of a national monument and describe the view from the top.',
            done: false,
          },
        ],
      },
      {
        name: 'Museums',
        icon: 'building-arch',
        color: '#7C3AED',
        activities: [
          {
            text: 'Browse a museum collection online and pick the one object you would most want to see in person. Why that one?',
            done: true,
          },
          {
            text: 'Find a museum within an hour of where you live that you have never visited. What is it known for?',
            done: true,
          },
        ],
      },
      {
        name: 'Aquarium',
        icon: 'fish',
        color: '#0891B2',
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
        date: 'Jan 16, 2026',
        icon: 'building',
        color: '#2563EB',
      },
      {
        name: "Author Louisa May Alcott's Birthday 2025",
        date: 'Nov 29, 2025',
        icon: 'writing',
        color: '#7C3AED',
      },
      {
        name: 'National Cookbook Month 2025',
        date: 'Oct 1, 2025',
        icon: 'apple',
        color: '#D97706',
      },
      { name: 'Dear Diary Day 2025', date: 'Sep 22, 2025', icon: 'notebook', color: '#DB2777' },
      {
        name: 'National Read a Book Day 2025',
        date: 'Sep 7, 2025',
        icon: 'book',
        color: '#0D9488',
      },
      {
        name: 'Library Card Sign-Up Month 2025',
        date: 'Sep 1, 2025',
        icon: 'barcode',
        color: '#DC2626',
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
        earned: true,
        top: '10',
        mid: 'TALKS',
        earnedNote: 'Earned for finishing 10 book talks in Spring Reading Challenge 2025',
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
        challenge: 'Spring Reading Challenge 2025',
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
        challenge: 'Winter Reading Bingo',
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
      "Marcus is an outstanding reader. He's logged reading on **21 of the last 30 days** — the highest consistency in the class — and is reading well above grade level at **870L**. His intrinsic motivation is the highest on record, and his integrity score is nearly perfect with **only 1 flagged session all year**. He's ready for books 1–2 grade levels up, and would benefit from leadership opportunities like book talks or reading buddy programs.",
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
              "Marcus's motivation is at its highest point this year. His intrinsic score of **19.2/20** is exceptional — Enjoyment, Curiosity, and Challenge are his top three drivers. He's genuinely in love with reading right now. The best thing you can do is keep the material challenging and get out of his way.",
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
              'Marcus shows strong and consistently improving motivation. His intrinsic drivers continue to lead, and his Social Connection score is picking up — consider pairing him with a reading buddy or discussion group to capitalize on this emerging motivator.',
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
              { day: 'Sun', minutes: 35 },
              { day: 'Mon', minutes: 40 },
              { day: 'Tue', minutes: 38 },
              { day: 'Wed', minutes: 32 },
              { day: 'Thu', minutes: 40 },
              { day: 'Fri', minutes: 35 },
              { day: 'Sat', minutes: null },
            ],
          },
          {
            label: 'May 4–10',
            current: false,
            days: [
              { day: 'Sun', minutes: 30 },
              { day: 'Mon', minutes: 38 },
              { day: 'Tue', minutes: 42 },
              { day: 'Wed', minutes: 35 },
              { day: 'Thu', minutes: 45 },
              { day: 'Fri', minutes: 36 },
              { day: 'Sat', minutes: 28 },
            ],
          },
          {
            label: 'Apr 27 – May 3',
            current: false,
            days: [
              { day: 'Sun', minutes: 32 },
              { day: 'Mon', minutes: 40 },
              { day: 'Tue', minutes: 38 },
              { day: 'Wed', minutes: 35 },
              { day: 'Thu', minutes: 42 },
              { day: 'Fri', minutes: 0 },
              { day: 'Sat', minutes: 31 },
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
    avatarColor: '#7C3AED',
    // Anne logs at her public library too, so her school profile is tandemed.
    status: ['tandem', 'comicsplus'],
    grade: '6th Grade',
    lastRun: 'May 15 at 9:55am',
    rewards: [
      { name: 'Beanstack Bookmark', claimed: true },
      { name: 'Free Book Coupon', claimed: false },
    ],
    drawings: [
      { name: 'Logging Week 2', claimed: true },
      { name: 'Shout Out', claimed: false },
    ],
    challenges: [
      {
        name: 'Spring Reading Challenge 2025',
        dates: 'Mar 1, 2025 - May 31, 2025',
        startedOn: 'March 11, 2025',
        minutes: 760,
        status: 'current',
      },
      {
        name: 'Winter Reading Bingo',
        dates: 'Jan 6, 2025 - Feb 28, 2025',
        startedOn: 'January 21, 2025',
        minutes: 540,
        status: 'ended',
      },
      {
        name: 'Summer Reading 2024',
        dates: 'Jun 1, 2024 - Aug 31, 2024',
        startedOn: 'July 2, 2024',
        minutes: 610,
        status: 'past',
      },
    ],
    activityBadges: [
      {
        name: 'Aquarium',
        icon: 'fish',
        color: '#0891B2',
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
        color: '#7C3AED',
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
      { name: 'Dear Diary Day 2025', date: 'Sep 22, 2025', icon: 'notebook', color: '#DB2777' },
      {
        name: 'National Read a Book Day 2025',
        date: 'Sep 7, 2025',
        icon: 'book',
        color: '#0D9488',
      },
      {
        name: 'Library Card Sign-Up Month 2025',
        date: 'Sep 1, 2025',
        icon: 'barcode',
        color: '#DC2626',
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
        earned: false,
        top: '10',
        mid: 'TALKS',
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
        challenge: 'Spring Reading Challenge 2025',
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
        challenge: 'Winter Reading Bingo',
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
      "Anne is making real progress this month! Her reading habits are building — she's logged reading on **10 of the last 30 days** and has already logged 85 minutes this week. Her Lexile average has **climbed 50 points since April**, and she's consistently choosing harder books. Integrity is improving, with **flags down from 7 to 4**. The main thing to keep an eye on is her extrinsic motivation, which has dipped 4 points, and **2 unfinished BTWB conversations** that are worth following up on.",
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
              "Anne's motivation is mixed this period. Recognition and Social Connection are her clearest levers — she responds well to public acknowledgment and peer interaction. Her Enjoyment score has slipped, which is worth watching. A shoutout or leaderboard mention could give her a quick boost while you work on rebuilding deeper engagement.",
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
              "Anne showed steady motivation this period with Compliance and Recognition leading. Her Enjoyment score dropped noticeably though — she may be reading to meet expectations rather than out of genuine interest. Consider giving her full choice over her next book, even if it's shorter or easier than usual.",
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
              "This was a difficult period for Anne's motivation — nearly every dimension declined, with Enjoyment hitting a record low. This likely coincided with her tackling harder books. The Lexile challenge may be outpacing her confidence. Consider stepping back slightly on difficulty to let intrinsic motivation recover before pushing growth again.",
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
              { day: 'Sun', minutes: 0 },
              { day: 'Mon', minutes: 25 },
              { day: 'Tue', minutes: 22 },
              { day: 'Wed', minutes: 0 },
              { day: 'Thu', minutes: 12 },
              { day: 'Fri', minutes: 12 },
              { day: 'Sat', minutes: null },
            ],
          },
          {
            label: 'May 4–10',
            current: false,
            days: [
              { day: 'Sun', minutes: 0 },
              { day: 'Mon', minutes: 28 },
              { day: 'Tue', minutes: 20 },
              { day: 'Wed', minutes: 0 },
              { day: 'Thu', minutes: 32 },
              { day: 'Fri', minutes: 25 },
              { day: 'Sat', minutes: 0 },
            ],
          },
          {
            label: 'Apr 27 – May 3',
            current: false,
            days: [
              { day: 'Sun', minutes: 18 },
              { day: 'Mon', minutes: 22 },
              { day: 'Tue', minutes: 21 },
              { day: 'Wed', minutes: 19 },
              { day: 'Thu', minutes: 0 },
              { day: 'Fri', minutes: 0 },
              { day: 'Sat', minutes: 25 },
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
    avatarColor: '#1D4ED8',
    // Tyler's over-logging is what a freeze is for: he keeps his profile, but
    // can't log for himself for ten days.
    status: ['frozen'],
    grade: '6th Grade',
    lastRun: 'May 15 at 9:55am',
    rewards: [{ name: 'Beanstack Bookmark', claimed: false }],
    drawings: [{ name: 'Logging Week 2', claimed: false }],
    challenges: [
      {
        name: 'Spring Reading Challenge 2025',
        dates: 'Mar 1, 2025 - May 31, 2025',
        startedOn: 'April 9, 2025',
        minutes: 120,
        status: 'current',
      },
      {
        name: 'Winter Reading Bingo',
        dates: 'Jan 6, 2025 - Feb 28, 2025',
        startedOn: 'February 14, 2025',
        minutes: 95,
        status: 'ended',
      },
    ],
    activityBadges: [
      {
        name: 'Zoo',
        icon: 'paw',
        color: '#16A34A',
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
        color: '#7C3AED',
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
        date: 'Sep 1, 2025',
        icon: 'barcode',
        color: '#DC2626',
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
        earned: false,
        top: '10',
        mid: 'TALKS',
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
        challenge: 'Spring Reading Challenge 2025',
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
        challenge: 'Winter Reading Bingo',
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
      'Tyler needs immediate attention. He has **no logged reading days in the past 30 days** — the only student in the class with zero recent activity. His Lexile average has **declined 15 points since March**, and he has **13 flagged sessions** including **6 suspected over-logs**, which means his reading data may not be reliable. His motivation scores are critically low across all dimensions. A direct one-on-one conversation this week is the highest-impact action available.',
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
              "Tyler's motivation scores are critically low across **all 10 dimensions**. Enjoyment — the single strongest predictor of long-term reading engagement — is at **0.8 out of 4**. No extrinsic motivator is compensating for it. A personal conversation about what he genuinely finds interesting, completely disconnected from school expectations, is the most important next step.",
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
              "Tyler's motivation was already low this period and has continued to slide since. Compliance and Grades are his only active motivators — and even those are weakening. He's reading because he feels he has to, not because he wants to. This level of disconnection typically requires a significant intervention, starting with giving him full agency over his next book choice.",
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
              { day: 'Sun', minutes: 0 },
              { day: 'Mon', minutes: 0 },
              { day: 'Tue', minutes: 0 },
              { day: 'Wed', minutes: 0 },
              { day: 'Thu', minutes: 0 },
              { day: 'Fri', minutes: 0 },
              { day: 'Sat', minutes: null },
            ],
          },
          {
            label: 'May 4–10',
            current: false,
            days: [
              { day: 'Sun', minutes: 0 },
              { day: 'Mon', minutes: 0 },
              { day: 'Tue', minutes: 22 },
              { day: 'Wed', minutes: 0 },
              { day: 'Thu', minutes: 0 },
              { day: 'Fri', minutes: 0 },
              { day: 'Sat', minutes: 0 },
            ],
          },
          {
            label: 'Apr 27 – May 3',
            current: false,
            days: [
              { day: 'Sun', minutes: 0 },
              { day: 'Mon', minutes: 0 },
              { day: 'Tue', minutes: 0 },
              { day: 'Wed', minutes: 0 },
              { day: 'Thu', minutes: 0 },
              { day: 'Fri', minutes: 19 },
              { day: 'Sat', minutes: 0 },
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
    days: [true, true, true, true, true, null, null],
  },
  {
    key: 'anne',
    rank: 2,
    avg: 73,
    ac: 'blue',
    days: [null, true, true, null, true, '24%', null],
  },
  {
    key: 'tyler',
    rank: 3,
    avg: 31,
    ac: 'red',
    days: [null, '18%', null, null, null, null, null],
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
function talkSession(talk, student, i) {
  const kindRating = { engagement: 'green', comprehension: 'green', integrity: null }
  return {
    id: `talk-${student.key ?? 'x'}-${i}`,
    date: `20${talk.date.slice(6)}-${talk.date.slice(0, 2)}-${talk.date.slice(3, 5)}`,
    dateLabel: talk.date,
    type: talk.kind === 'integrity' ? 'flagged' : 'engagement',
    kind: talk.kind,
    status: 'completed',
    challenge: 'Spring Reading Challenge 2025',
    minutesLogged: 20 + ((i * 7) % 25),
    engagementRating: kindRating[talk.kind] ?? null,
    book: { title: talk.title, author: BOOK_AUTHORS[talk.title] ?? '', color: '#0D9488' },
    flags: talk.flags.map((f, fi) => ({
      id: `tf-${i}-${fi}`,
      type: f,
      label: SESSION_FLAGS[f]?.label ?? f,
      description: SESSION_FLAG_DESCS[f] ?? '',
    })),
    positiveFlags: [],
    conversation: TALK_CONVERSATION(talk, student),
    changeLog: [
      {
        id: `tc-${i}`,
        label: 'Book talk completed',
        icon: 'circle-check',
        color: '#16A97A',
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
        color: '#DC2626',
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
    book: { title: 'Snapdragon', author: 'Kat Leyh', color: '#7C3AED', isbn: '9781250312846' },
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
        color: '#DC2626',
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
        color: '#16A97A',
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
    weekLabel: 'June 30–July 6',
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
      {
        date: 30,
        day: 'Sunday',
        faded: true,
        streak: 1,
        entries: [
          { title: 'Holes', author: 'Louis Sachar', amount: '844 Minutes', flagged: false },
        ],
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
      icon: 'flag',
      className: 'bp-rl-mark bp-rl-mark--neg',
      label: session.flags.length === 1 ? session.flags[0].label : `${session.flags.length} flags`,
    },
    session?.positiveFlags?.length && {
      key: 'pos',
      icon: 'flag',
      className: 'bp-rl-mark bp-rl-mark--pos',
      label:
        session.positiveFlags.length === 1
          ? session.positiveFlags[0].label
          : `${session.positiveFlags.length} positive flags`,
    },
    session?.conversation?.length && {
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
        className={m.className}
        onClick={() => onOpen?.(entry)}
        aria-label={m.label}
      >
        <Icon name={m.icon} size={14} />
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
        <PartnerMark id={source} size={15} />
      </span>
    </Tooltip>
  )
}

function RLEntryMenu() {
  return (
    <Flyout
      placement="bottom-end"
      trigger={({ toggle }) => (
        <Tooltip content="Entry actions">
          <button type="button" className="bp-rl-dots" onClick={toggle} aria-label="Entry actions">
            <Icon name="dots" size={15} />
          </button>
        </Tooltip>
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
  const tone = entry.completed
    ? ' bp-rl-entry--completed'
    : entry.flagged
      ? ' bp-rl-entry--flagged'
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
        <div className="bp-rl-entry-menu">
          <RLSource source={entry.source} />
          <RLMarks marks={marks} entry={entry} onOpen={onOpen} />
          <RLEntryMenu />
        </div>
      </div>
      <div className="bp-rl-entry-author">
        {entry.author}
        {/* The table listed a Lexile per row; the card was the only view
            without one. */}
        {entry.lexile && <span className="bp-rl-entry-lexile">{entry.lexile}</span>}
      </div>
      <div className="bp-rl-entry-foot">
        {entry.completed ? (
          <span className="bp-rl-completed">Completed</span>
        ) : (
          <div className="bp-rl-entry-amount">{entry.amount}</div>
        )}
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
      scrollX
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
        icon={<Ic name="ti-reading-log" />}
        title="Reading Log"
        accent={SECTION_ACCENT.readinglog.text}
        accentBg={SECTION_ACCENT.readinglog.bg}
        action={
          <Button variant="secondary" size="sm">
            Print log
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
              <Icon name="chevron-left" size={11} />
            </button>
            <button className="bp-heatmap-nav-btn" aria-label="Next month">
              <Icon name="chevron-right" size={11} />
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
                  <div key={di} className={`bp-rl-day${day.faded ? ' bp-rl-day--faded' : ''}`}>
                    <div className="bp-rl-day-col">
                      <div className="bp-rl-day-num">{day.date}</div>
                      <div className="bp-rl-day-name">{day.day}</div>
                      {day.streak > 0 && (
                        <span className="bp-rl-flame">
                          {day.streak}
                          <Icon name="flame-filled" size={13} />
                        </span>
                      )}
                    </div>
                    {day.entries.length === 0 ? (
                      <div className="bp-rl-empty-day" aria-label="Nothing logged" />
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
// ─── Text box challenges ──────────────────────────────────────────────────────
// A "text box challenge" is a site-authored prompt the reader answers in a free
// text box (see the Challenge Creator's activity types). This page is the
// reader's own words, grouped by the challenge that asked for them.
function TextChallengesPage({ student }) {
  const [challengeFilter, setChallengeFilter] = useState('all')
  const challenges = student.textChallenges ?? []
  const shown =
    challengeFilter === 'all'
      ? challenges
      : challenges.filter((ch) => ch.challenge === challengeFilter)

  return (
    <div className="bp-content">
      <Hero
        icon={<Ic name="ti-paragraph" />}
        title="Text Box"
        accent={SECTION_ACCENT.textchallenges.text}
        accentBg={SECTION_ACCENT.textchallenges.bg}
      />
      {challenges.length > 1 && (
        <FilterBar>
          <FilterItem label="Challenge">
            <Select
              size="sm"
              value={challengeFilter}
              onChange={(e) => setChallengeFilter(e.target.value)}
            >
              <option value="all">All challenges</option>
              {challenges.map((ch) => (
                <option key={ch.challenge} value={ch.challenge}>
                  {ch.challenge}
                </option>
              ))}
            </Select>
          </FilterItem>
        </FilterBar>
      )}
      {challenges.length === 0 ? (
        <EmptyState
          title="No responses yet"
          description="Answers to text box challenges will show up here."
        />
      ) : (
        shown.map((ch) => (
          <Card key={ch.challenge}>
            <div className="bp-latest-head">
              <SectionHeading>{ch.challenge}</SectionHeading>
              <span className="bp-titles-header-meta">
                {ch.responses.length} {ch.responses.length === 1 ? 'response' : 'responses'}
              </span>
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
    </div>
  )
}

// ─── Book reviews ─────────────────────────────────────────────────────────────
const REVIEW_ACTIONS = [
  { label: 'Manage', icon: 'tools' },
  { label: 'Edit', icon: 'pencil' },
  { label: 'Delete', icon: 'trash' },
]

// Reviews the reader wrote and published to the site: the book, the date, and
// their own words. Cover + title come from the same Open Library lookup the
// Lexile page's title rows use.
function ReviewsPage({ student }) {
  const reviews = student.reviews ?? []
  return (
    <div className="bp-content">
      <Hero
        icon={<Ic name="ti-rating" />}
        title="Reviews"
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
              <a
                href={`https://openlibrary.org/isbn/${r.isbn}`}
                target="_blank"
                rel="noreferrer"
                className="bp-title-cover-link"
              >
                <CoverImage isbn={r.isbn} title={r.title} />
              </a>
              <div className="bp-review-main">
                <div className="bp-review-head">
                  <div>
                    <div className="bp-review-title">{r.title}</div>
                    <div className="bp-title-author">{r.author}</div>
                  </div>
                  <span className="bp-tb-date">{r.date}</span>
                </div>
                <div className="bp-review-text">{r.text}</div>
              </div>
            </div>
            {/* Card footer, full width past the cover column. Inert, like the Log
                and Edit Goal buttons — the demo wants the affordances to look
                right, not to wire up CRUD. */}
            <div className="bp-review-actions">
              {REVIEW_ACTIONS.map((a) => (
                <IconButton key={a.label} variant="ghost" size="sm" aria-label={a.label}>
                  <Icon name={a.icon} size={16} />
                </IconButton>
              ))}
            </div>
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
function SearchToggle({ open, onToggle }) {
  return (
    <Button variant="secondary" size="sm" onClick={onToggle}>
      {open ? 'Hide search' : 'Show search'}
    </Button>
  )
}

// One modal shape for both pages: the artwork, a small label line, the bold
// line, an optional green earned note, then the action footer. The action is
// deliberately inert — it closes the modal without touching the data, the same
// stance as the Log and Edit Goal buttons.
function MedalModal({ open, onClose, art, label, headline, note, action }) {
  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel={headline}>
      {({ close }) => (
        <div className="bp-medal-modal">
          <IconButton
            variant="ghost"
            size="sm"
            className="bp-medal-modal-close"
            aria-label="Close"
            onClick={close}
          >
            <Icon name="x" size={18} stroke={2.2} />
          </IconButton>
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

function AchievementsPage({ student }) {
  const [q, setQ] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [openItem, setOpenItem] = useState(null)
  const all = student.achievements ?? []
  const shown = searchOpen
    ? all.filter((a) => a.name.toLowerCase().includes(q.trim().toLowerCase()))
    : all

  return (
    <div className="bp-content">
      <Hero
        icon={<Ic name="ti-certificate" />}
        title="Achievements"
        accent={SECTION_ACCENT.achievements.text}
        accentBg={SECTION_ACCENT.achievements.bg}
        action={
          all.length > 0 && (
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
          placeholder="Search for achievement name…"
          ariaLabel="Search achievements"
        />
      )}
      {shown.length === 0 ? (
        <EmptyState
          variant="dashed"
          title={all.length === 0 ? 'No achievements yet' : 'No matches'}
          description={
            all.length === 0
              ? 'Seasonal achievements this reader earns will show up here.'
              : 'Try a different achievement name.'
          }
        />
      ) : (
        <div className="bp-medal-grid">
          {shown.map((a) => (
            <button
              key={a.name}
              type="button"
              className="bp-medal-card"
              onClick={() => setOpenItem(a)}
            >
              <AchievementMedal item={a} />
              <span className="bp-medal-name">{a.name}</span>
              <span className="bp-medal-sub">Earned on {a.date}</span>
            </button>
          ))}
        </div>
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
    </div>
  )
}

const BADGE_TABS = [
  { id: 'earned', label: 'Earned' },
  { id: 'unearned', label: 'Unearned' },
]
const BADGE_KINDS = [
  { id: 'all', label: 'All badges' },
  { id: 'logging', label: 'Logging badges' },
  { id: 'challenge', label: 'Challenge badges' },
]

function BadgesPage({ student }) {
  const [tab, setTab] = useState('earned')
  const [kind, setKind] = useState('all')
  const [q, setQ] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [openItem, setOpenItem] = useState(null)
  const all = student.badges ?? []

  const shown = all.filter(
    (b) =>
      b.earned === (tab === 'earned') &&
      (kind === 'all' || b.kind === kind) &&
      (!searchOpen || b.name.toLowerCase().includes(q.trim().toLowerCase())),
  )

  return (
    <div className="bp-content">
      <Hero
        icon={<Ic name="ti-badge" />}
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
          placeholder="Search for badge name…"
          ariaLabel="Search badges"
        />
      )}
      <FilterBar>
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
            q || kind !== 'all'
              ? 'Try a different search or badge type.'
              : `Badges this reader has ${tab === 'earned' ? 'earned' : 'still to earn'} will show up here.`
          }
        />
      ) : (
        <div className="bp-medal-grid">
          {shown.map((b) => (
            <button
              key={b.name}
              type="button"
              className="bp-medal-card"
              onClick={() => setOpenItem(b)}
            >
              <BadgeSeal badge={b} />
              <span className="bp-medal-name">{b.name}</span>
              <span className="bp-medal-sub">{b.detail}</span>
            </button>
          ))}
        </div>
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
    </div>
  )
}

// ─── Activity badges ──────────────────────────────────────────────────────────
// A challenge's activity badge is a set of activities the reader checks off;
// the badge lands once they're all done. The checkboxes are live so the demo
// can show a badge completing, but nothing is persisted.
function ActivitiesPage({ student }) {
  const [badges, setBadges] = useState(student.activityBadges ?? [])
  const [openIdx, setOpenIdx] = useState(null)

  function toggleActivity(badgeIdx, actIdx, done) {
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
    setBadges((prev) =>
      prev.map((b, i) =>
        i !== badgeIdx ? b : { ...b, activities: b.activities.map((a) => ({ ...a, done })) },
      ),
    )
  }

  const openBadge = openIdx == null ? null : badges[openIdx]
  const doneCount = (b) => b.activities.filter((a) => a.done).length

  return (
    <div className="bp-content">
      <Hero
        icon={<Ic name="ti-puzzle" />}
        title="Activities"
        accent={SECTION_ACCENT.activities.text}
        accentBg={SECTION_ACCENT.activities.bg}
      />
      <FilterBar action={<Button size="sm">Update activity badges</Button>}>
        <FilterItem label="Challenge">
          <Select size="sm" defaultValue="all">
            <option value="all">All challenges</option>
            <option value="spring">Spring Reading Challenge 2025</option>
            <option value="winter">Winter Reading Bingo</option>
          </Select>
        </FilterItem>
      </FilterBar>
      <Card flush>
        <div className="bp-titles-header">
          <span className="bp-titles-header-label">Activity badges</span>
          <span className="bp-titles-header-meta">Completed?</span>
        </div>
        {badges.length === 0 ? (
          <EmptyState title="No activity badges" description="This reader has none assigned yet." />
        ) : (
          badges.map((b, i) => {
            const done = doneCount(b)
            const all = b.activities.length
            return (
              <div key={b.name} className="bp-act-row">
                <MedalDisc icon={b.icon} color={b.color} size={42} />
                <div className="bp-act-main">
                  <div className="bp-act-name">{b.name}</div>
                  <div className="bp-act-count">
                    {done} of {all} activities completed
                  </div>
                </div>
                <Checkbox checked={done === all} onChange={(v) => toggleBadge(i, v)} />
                <Button variant="secondary" size="sm" onClick={() => setOpenIdx(i)}>
                  View activity
                </Button>
              </div>
            )
          })
        )}
      </Card>

      <Modal
        open={openIdx != null}
        onClose={() => setOpenIdx(null)}
        variant="center"
        ariaLabel={openBadge?.name}
      >
        {({ close }) => (
          <div className="bp-act-modal">
            <div className="bp-act-modal-head">
              {openBadge && <MedalDisc icon={openBadge.icon} color={openBadge.color} size={34} />}
              <span className="bp-act-modal-title">{openBadge?.name}</span>
              <IconButton variant="ghost" size="sm" aria-label="Close" onClick={close}>
                <Icon name="x" size={18} stroke={2.2} />
              </IconButton>
            </div>
            <div className="bp-act-modal-cols">
              <span>Activity</span>
              <span>Completed?</span>
            </div>
            <div className="bp-act-modal-body">
              {openBadge?.activities.map((a, j) => (
                <div key={a.text} className="bp-act-modal-row">
                  <span className="bp-act-modal-text">{a.text}</span>
                  <Checkbox checked={a.done} onChange={(v) => toggleActivity(openIdx, j, v)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ─── Drawings & rewards ───────────────────────────────────────────────────────
// Same page twice: a list of things the reader has won, with "Claimed?" as the
// only column that moves — and it's the librarian's to tick.
function ClaimListPage({ items: initial, icon, title, accent, accentBg, nameLabel, empty }) {
  const [items, setItems] = useState(initial ?? [])

  return (
    <div className="bp-content">
      <Hero icon={<Ic name={icon} />} title={title} accent={accent} accentBg={accentBg} />
      <Card flush>
        <div className="bp-titles-header">
          <span className="bp-titles-header-label">{nameLabel}</span>
          <span className="bp-titles-header-meta">Claimed?</span>
        </div>
        {items.length === 0 ? (
          <EmptyState title={empty.title} description={empty.description} />
        ) : (
          items.map((item, i) => (
            <div key={item.name} className="bp-act-row">
              <div className="bp-act-main">
                <div className="bp-act-name">{item.name}</div>
              </div>
              <Checkbox
                checked={item.claimed}
                onChange={(v) =>
                  setItems((prev) => prev.map((x, j) => (j === i ? { ...x, claimed: v } : x)))
                }
              />
            </div>
          ))
        )}
      </Card>
    </div>
  )
}

// `key` on the student remounts the list so the checkbox state doesn't carry
// across readers when the pager steps.
function DrawingsPage({ student }) {
  return (
    <ClaimListPage
      key={student.name}
      items={student.drawings}
      icon="ti-pencil"
      title="Drawings"
      accent={SECTION_ACCENT.drawings.text}
      accentBg={SECTION_ACCENT.drawings.bg}
      nameLabel="Drawing name"
      empty={{ title: 'No drawings', description: 'Drawings this reader enters will show here.' }}
    />
  )
}

function RewardsPage({ student }) {
  return (
    <ClaimListPage
      key={student.name}
      items={student.rewards}
      icon="ti-gift"
      title="Rewards"
      accent={SECTION_ACCENT.rewards.text}
      accentBg={SECTION_ACCENT.rewards.bg}
      nameLabel="Reward name"
      empty={{ title: 'No rewards', description: 'Rewards this reader earns will show here.' }}
    />
  )
}

// ─── Challenges ───────────────────────────────────────────────────────────────
const CHALLENGE_TABS = [
  { id: 'current', label: 'Current' },
  { id: 'ended', label: 'Recently ended' },
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
          <Button
            variant="secondary"
            size="sm"
            icon={<Icon name="chevron-left" size={14} />}
            onClick={onClose}
          >
            Back
          </Button>
          <span className="bp-clog-bar-title">Challenge log</span>
          <Button size="sm" icon={<Icon name="printer" size={15} />} onClick={() => window.print()}>
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
  const all = student.challenges ?? []
  const shown = all.filter((c) => c.status === tab)

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
        icon={<Ic name="ti-trophy" />}
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
      <Card flush>
        <div className="bp-titles-header">
          <span className="bp-titles-header-label">Challenge</span>
          <span className="bp-titles-header-meta">Enrolled?</span>
        </div>
        {shown.length === 0 ? (
          <EmptyState
            title={`No ${tab === 'ended' ? 'recently ended' : tab} challenges`}
            description="Nothing to show for this reader here."
          />
        ) : (
          shown.map((c) => (
            <div key={c.name} className="bp-chal-row">
              <div className="bp-chal-main">
                <div className="bp-act-name">{c.name}</div>
                <div className="bp-chal-dates">{c.dates}</div>
                <div className="bp-chal-meta">
                  <span>Started on: {c.startedOn}</span>
                  {c.minutes != null && <span>Minutes reading: {c.minutes.toLocaleString()}</span>}
                </div>
                {/* The printable sheet, not a detour to the reading log. */}
                <button type="button" className="bp-latest-link" onClick={() => setLogFor(c)}>
                  View challenge log
                  <Icon name="arrow-right" size={14} />
                </button>
              </div>
              {/* Enrolment is a state, not a control — a green tick, not a checkbox */}
              <span className="bp-chal-enrolled" aria-label="Enrolled">
                <Icon name="check" size={15} stroke={2.6} />
              </span>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}

function PlaceholderPage({ pageKey }) {
  const item = NAV_ITEMS.find((n) => !n.divider && n.section === pageKey)
  return (
    <div className="bp-content">
      <Hero
        icon={<Ic name={item?.icon || 'ti-user'} />}
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
export function ClassroomView({ onStudentClick, selectedKey, extraTabs = [], renderExtra }) {
  const [admTab, setAdmTab] = useState('daily')
  const extraIds = extraTabs.map((t) => t.id)
  return (
    <div className="bp-adm">
      <Sidebar
        title="People"
        subtitle="Find and log for my students and classes."
        mainRailIndex={1}
        nav={[
          { id: 'classes', label: 'Classes', icon: 'overview' },
          { id: 'students', label: 'Students', icon: 'demographics' },
          { id: 'view-students', label: 'View Students', icon: 'person', subgroup: true },
          { id: 'flagged', label: 'Flagged Entries', icon: 'flag', subgroup: true },
        ]}
        active="view-students"
      />

      {/* Main content area */}
      <div className="bp-adm-main">
        <BackBar label="Back to Classes" />
        <div className="bp-adm-main-body">
          <div className="bp-adm-class-header">
            <div className="bp-adm-class-identity">
              <div className="bp-adm-class-avatar">CA</div>
              <div>
                <div className="bp-adm-class-title">Class A</div>
                <div className="bp-adm-class-meta">24 students · 2024–25 School Year</div>
              </div>
            </div>
            <div className="bp-adm-class-btns">
              <Button variant="ghost">Set Classroom Goal</Button>
              <Button variant="primary">Log for Class</Button>
            </div>
          </div>

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
              <div className="bp-adm-filter-wrap">
                <FilterBar>
                  <FilterItem label="View as …">
                    <Select defaultValue="goal" size="sm">
                      <option value="goal">Reading Goal</option>
                      <option value="pages">Pages</option>
                      <option value="minutes">Minutes</option>
                    </Select>
                  </FilterItem>
                  <FilterItem label="Log Type">
                    <Select defaultValue="minutes" size="sm">
                      <option value="minutes">Minutes</option>
                      <option value="pages">Pages</option>
                      <option value="sessions">Sessions</option>
                    </Select>
                  </FilterItem>
                  <FilterItem label="Show as …">
                    <Select defaultValue="pct" size="sm">
                      <option value="pct">Percentages</option>
                      <option value="raw">Raw values</option>
                    </Select>
                  </FilterItem>
                </FilterBar>
              </div>

              <div className="bp-adm-card">
                <div className="bp-adm-week-nav">
                  <IconButton variant="ghost" size="md" aria-label="Previous week">
                    <Icon name="chevron-left" size={16} />
                  </IconButton>
                  <span className="bp-adm-week-label">5/11 – 5/17 (This Week)</span>
                  <IconButton
                    variant="ghost"
                    size="md"
                    aria-label="Next week"
                    style={{ opacity: 0.3 }}
                  >
                    <Icon name="chevron-right" size={16} />
                  </IconButton>
                </div>
                <table className="tbl tbl--compact tbl--flush">
                  <thead>
                    <tr>
                      <th className="tbl-th" style={{ width: 160, textAlign: 'left' }}>
                        Student
                      </th>
                      <th className="tbl-th bp-adm-th--goal">Goal</th>
                      <th className="tbl-th tbl-cell--center">Average</th>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                        <th key={d} className="tbl-th tbl-cell--center">
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CLASS_TABLE.map((s) => (
                      <tr
                        key={s.key}
                        className={`tbl-row tbl-row--clickable${selectedKey === s.key ? ' bp-adm-row--selected' : ''}`}
                        onClick={() => onStudentClick?.(s.key)}
                        onKeyDown={(e) => e.key === 'Enter' && onStudentClick?.(s.key)}
                        role="button"
                        tabIndex={0}
                      >
                        <td className="tbl-td">
                          <div className="bp-adm-student-cell">
                            <span
                              className={`bp-adm-rank bp-adm-rank--${s.rank === 1 ? 'gold' : s.rank === 2 ? 'silver' : 'bronze'}`}
                            >
                              {s.rank}
                            </span>
                            <button
                              type="button"
                              className="bp-adm-student-name"
                              title={`Open ${STUDENTS[s.key].name}'s profile`}
                              onClick={(e) => {
                                e.stopPropagation()
                                onStudentClick?.(s.key)
                              }}
                            >
                              {STUDENTS[s.key].name}
                            </button>
                          </div>
                        </td>
                        <td className="tbl-td bp-adm-td--goal">
                          <div className="bp-adm-goal-cell">
                            <span className="bp-adm-goal-val">
                              {STUDENTS[s.key].sections.habits.dailyGoalMinutes}m
                            </span>
                            <IconButton
                              variant="ghost"
                              size="sm"
                              title="Edit goal"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Icon name="pencil" size={11} />
                            </IconButton>
                          </div>
                        </td>
                        <td className="tbl-td tbl-cell--center">
                          <span className={`bp-adm-pct bp-adm-pct--${s.ac}`}>{s.avg}%</span>
                        </td>
                        {s.days.map((d, i) => (
                          <td key={i} className="tbl-td tbl-cell--center">
                            {d === null ? (
                              <span className="bp-adm-dash">–</span>
                            ) : d === true ? (
                              <span className="bp-adm-check-circle">
                                <Icon name="check" size={10} />
                              </span>
                            ) : (
                              <span
                                className={`bp-adm-pct bp-adm-pct--${s.ac === 'red' ? 'red' : 'orange'}`}
                              >
                                {d}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bp-adm-avg-row">
                      <td className="tbl-td">Class Average</td>
                      <td className="tbl-td bp-adm-td--goal" />
                      <td className="tbl-td tbl-cell--center">67%</td>
                      {['–', '58%', '50%', '33%', '67%', '24%', '–'].map((v, i) => (
                        <td key={i} className="tbl-td tbl-cell--center">
                          {v}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <div className="bp-adm-legend">
                  <span style={{ color: '#EF4444' }}>● 0–33%</span>
                  <span style={{ color: '#F59E0B' }}>● 34–66%</span>
                  <span style={{ color: '#3B82F6' }}>● 66–99%</span>
                  <span style={{ color: '#10B981' }}>✓ 100%</span>
                </div>
              </div>
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
  const icon = float ? { size: 15, stroke: 2.2 } : { size: 17, stroke: 2.2 }

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
  textchallenges: 'text-box',
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
          <Icon name="x" size={15} stroke={2.2} />
        </button>
        <button
          type="button"
          className="bp-ctrl-btn bp-ctrl-btn--expand"
          onClick={onToggleExpand}
          title={expanded ? 'Exit full screen' : 'Expand to full screen'}
          aria-label={expanded ? 'Exit full screen' : 'Expand to full screen'}
        >
          <Icon name={expanded ? 'minimize' : 'maximize'} size={14} stroke={2.1} />
        </button>
        <button
          type="button"
          className={`bp-ctrl-btn${copied ? ' bp-ctrl-btn--done' : ''}`}
          onClick={copyLink}
          title={copied ? 'Link copied' : 'Copy link to this view'}
          aria-label={copied ? 'Link copied' : 'Copy link to this view'}
        >
          <Icon name={copied ? 'check' : 'link'} size={14} stroke={2.1} />
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
  extraNav = [],
  renderExtra,
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
                <Overview student={student} onNavigate={onNavigate} goal={goal} />
              ) : ANALYSIS_SECTIONS.has(activeSection) ? (
                <SectionDetail
                  student={student}
                  sectionKey={activeSection}
                  goal={goal}
                  onEditGoal={() => setEditingGoal(true)}
                />
              ) : activeSection === 'readinglog' ? (
                <ReadingLogPage reader={student} />
              ) : activeSection === 'textchallenges' ? (
                <TextChallengesPage student={student} />
              ) : activeSection === 'reviews' ? (
                <ReviewsPage student={student} />
              ) : activeSection === 'achievements' ? (
                <AchievementsPage student={student} />
              ) : activeSection === 'badges' ? (
                <BadgesPage student={student} />
              ) : activeSection === 'activities' ? (
                <ActivitiesPage student={student} />
              ) : activeSection === 'drawings' ? (
                <DrawingsPage student={student} />
              ) : activeSection === 'rewards' ? (
                <RewardsPage student={student} />
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
 * `initialSection`, `extraNav`, `renderExtra` and `overrides` are optional and
 * additive — they let another prototype open the real profile on a section of
 * its own (Words with Benny adds Vocabulary) instead of building a second,
 * bespoke student panel. `overrides` merges onto the resolved student, so a
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
    <div className={`bp-embed${expanded ? ' bp-embed--full' : ''}`} style={profileVars(student)}>
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
        <ClassroomView onStudentClick={handleStudentClick} selectedKey={selectedStudentKey} />
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
          <div className="bp-profile-slider" style={profileVars(student)}>
            <ProfileBody
              student={student}
              activeSection={activeSection}
              onNavigate={setActiveSection}
              onClose={closeProfile}
              expanded={profileMode === 'full'}
              onToggleExpand={toggleExpand}
              currentKey={selectedStudentKey}
              onSelectStudent={setSelectedStudentKey}
            />
          </div>
        </div>
      )}
    </div>
  )
}
