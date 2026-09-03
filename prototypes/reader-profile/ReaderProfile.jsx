import { useState, useEffect, useRef } from 'react'
import './ReaderProfile.css'
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
import { RMI_ICONS } from '@components/RmiIcons/RmiIcons'
import { Icon } from '@components/Icon/Icon'
import { PartnerMark, PARTNER_BRANDS } from '@components/PartnerBrand/PartnerBrand'
import { Flyout } from '@components/Flyout/Flyout'
import { Modal } from '@components/Modal/Modal'
import { Tabs } from '@components/Tabs/Tabs'
import { Toggle } from '@components/Toggle/Toggle'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { Hero } from '@components/Hero/Hero'
import { SessionModal } from '../sfr/components/SessionModal'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { ChartLegend } from '@components/charts/charts'

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
        className={`rp-showmore${inCard ? ' rp-showmore--incard' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? `Hide ${label}` : `Show ${label}`}
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} stroke={2.4} />
      </button>
    </>
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
const LOG_ITEMS = [{ label: 'Log Reading' }, { label: 'Log Activities' }]

// ─── Action modals ────────────────────────────────────────────────────────────
// The five Actions entries that have a real screen behind them. Each is a form
// the demo can open and fill; Save just closes — nothing is persisted, the same
// stance as the rest of the prototype's affordances.
const YES_NO = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
]

function ActionModal({ open, onClose, title, children, save = 'Save', saveDisabled, secondary }) {
  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel={title}>
      {({ close }) => (
        <div className="rp-act-modal">
          <div className="rp-act-modal-head">
            <span className="rp-act-modal-title">{title}</span>
            <Tooltip content="Close">
              <IconButton variant="ghost" size="sm" aria-label="Close" onClick={close}>
                <Icon name="x" size={18} stroke={2.2} />
              </IconButton>
            </Tooltip>
          </div>
          <div className="rp-form-body">{children}</div>
          <div className="rp-form-foot">
            {secondary && (
              <Button variant="secondary" onClick={close}>
                {secondary}
              </Button>
            )}
            <Button onClick={close} disabled={saveDisabled}>
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
        <div className="rp-form-row">
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

function ReaderActions({ onClose, student }) {
  const [action, setAction] = useState(null)
  const close = () => setAction(null)
  const items = ACTIONS_ITEMS.map((it) =>
    it.action ? { ...it, onSelect: () => setAction(it.action) } : it,
  )

  return (
    <div className="rp-student-actions">
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
                className="rp-btn-caret"
                style={{ flexShrink: 0 }}
              />
            }
            onClick={toggle}
            aria-label="Actions"
          >
            <span className="rp-btn-label">Actions</span>
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
                className="rp-btn-caret"
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
        <Tooltip content="Close profile">
          <button className="rp-header-close" onClick={onClose} aria-label="Close profile">
            <Icon name="arrow-right" size={15} />
          </button>
        </Tooltip>
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
// header because each one changes how you read the rest of the page: imported
// sessions explain minutes nobody logged by hand, and a tandem link explains
// reading done somewhere else entirely.
//
// Verified and Frozen are missing on purpose — those are Reading Integrity
// actions a teacher takes on a student, and a library has neither the log
// limits to verify past nor a classroom to freeze someone out of.
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
            <span className={`rp-status rp-status--${f.tone}`}>
              {f.icon && <Icon name={f.icon} size={13} stroke={2.1} />}
              {f.label}
            </span>
          </Tooltip>
        )
      })}
    </>
  )
}

function ReaderHeader({ student, onClose }) {
  return (
    <div className="rp-panel-header">
      <div className="rp-panel-identity">
        {/* A round, per-reader colour: the header is a person, not an
    organisation, and stepping between readers should visibly change reader.
    The hues are identity only — deliberately none of the status palette. */}
        <Avatar initials={initialsOf(student.name)} color={student.avatarColor} size="lg" />
        <div className="rp-panel-titles">
          <div className="rp-panel-name">{student.name}</div>
          <div className="rp-panel-meta">
            <span>{student.grade}</span>
            <StatusFlags flags={student.status} tandemWith="school" />
          </div>
        </div>
      </div>
      <div className="rp-header-right">
        <ReaderActions onClose={onClose} student={student} />
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

// One flat rail — every destination is labelled and styled the same. Account is
// the library-only addition: a reader belongs to a login account that can hold
// several readers, so the account is a place you can go, not just a label.
const NAV_ITEMS = [
  { icon: 'ti-user', section: null, label: 'Overview' },
  // What the reader actually did comes before the analysis derived from it.
  { icon: 'ti-reading-log', section: 'readinglog', label: 'Reading Log' },
  { icon: 'ti-trophy', section: 'challenges', label: 'Challenges' },
  { icon: 'ti-gift', section: 'rewards', label: 'Rewards' },
  { icon: 'ti-pencil', section: 'drawings', label: 'Drawings' },
  { icon: 'ti-puzzle', section: 'activities', label: 'Activities' },
  { icon: 'ti-badge', section: 'badges', label: 'Badges' },
  { icon: 'ti-certificate', section: 'achievements', label: 'Achievements' },
  { icon: 'ti-rating', section: 'reviews', label: 'Reviews' },
  { icon: 'ti-paragraph', section: 'textchallenges', label: 'Text Box' },
]

// Every profile-coloured tint (control rail, nav active state, the Log button)
// derives from this one property in CSS via `color-mix`, so a reader needs a
// single authored hex rather than a hand-mixed scale. The Hero icon chips stay
// on `SECTION_ACCENT` — the section you're on still has its own colour.
const profileVars = (student) => ({ '--rp-profile': student.avatarColor })

function LeftNav({ activeSection, onNavigate, pager }) {
  return (
    <nav className="rp-nav">
      <div className="rp-nav-items">
        {NAV_ITEMS.map(({ icon, section, label }) => {
          const active = activeSection === section
          return (
            <div
              key={label}
              className={`rp-nav-item${active ? ' rp-nav-item--active' : ''}`}
              onClick={() => onNavigate(section)}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate(section)}
              role="button"
              tabIndex={0}
              title={label}
              aria-label={label}
            >
              <Ic name={icon} size={18} style={{ opacity: active ? 1 : 0.4 }} />
              <span className="rp-nav-label">{label}</span>
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
function MobileSectionNav({ activeSection, onNavigate }) {
  return (
    <div className="rp-mobile-nav">
      <Select
        size="sm"
        aria-label="Profile section"
        value={activeSection ?? 'overview'}
        onChange={(e) => onNavigate(e.target.value === 'overview' ? null : e.target.value)}
      >
        {NAV_ITEMS.map(({ section, label }) => (
          <option key={label} value={section ?? 'overview'}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  )
}

// Tints for the Overview's habit stats. Deliberately outside the section
// palettes in `C` so these don't read as belonging to one of the sections:
// gold for streaks (matching the gold goal stars), teal for the brand's own
// accent, slate for elapsed time, violet for books.
const STAT_TINTS = {
  current: { bg: '#FEF3C7', text: '#92400E', bar: '#D97706' },
  longest: { bg: '#DFF4F7', text: '#0B6B78', bar: '#0E9AAB' },
  minutes: { bg: '#EEF2F7', text: '#334155', bar: '#64748B' },
  books: { bg: '#EDE9FE', text: '#5B21B6', bar: '#7C3AED' },
}

// ─── Overview stats ───────────────────────────────────────────────────────────
// The Overview's seven figures are described once here, then rendered as a
// single hairline-divided list — labels in one column, figures in another, so
// the whole snapshot scans top to bottom.
// Order: logging volume first, then the habit signals, then what the reader
// has taken part in. Longest streak and Challenges joined sit behind "Show
// more"; they answer a question you go looking for rather than one you scan.
//
// No "Daily goals met" here — a daily reading goal is a classroom construct.
// Public libraries set challenges, not daily targets, so the row had nothing
// behind it.
//
// Every row carries a `trend` against the same window (`ov.trend.label` says
// which), so the column of chips reads as one comparison rather than five
// different ones. Even the streaks: "18 days, up 11 on last year" is a real
// answer to whether this reader's habit is building.
function overviewMetrics(ov) {
  const mo = ov.trend ?? {}
  const days = (n) => (n === 1 ? 'day' : 'days')
  return [
    {
      key: 'minutes',
      section: 'readinglog',
      icon: 'clock',
      accent: STAT_TINTS.minutes,
      label: 'Total minutes read',
      value: ov.minutes.toLocaleString(),
      unit: 'min',
      trend: { delta: mo.minutesPct, format: (n) => `${n}%` },
    },
    {
      key: 'current',
      section: 'readinglog',
      icon: 'flame',
      accent: STAT_TINTS.current,
      label: 'Current streak',
      value: ov.currentStreak,
      unit: days(ov.currentStreak),
      trend: { delta: mo.currentStreak, format: (n) => `${n} ${days(n)}` },
    },
    {
      key: 'books',
      section: 'readinglog',
      icon: 'book-2',
      accent: STAT_TINTS.books,
      label: 'Books finished',
      value: ov.booksCompleted,
      unit: ov.booksCompleted === 1 ? 'book' : 'books',
      trend: { delta: mo.books },
    },
    {
      key: 'longest',
      section: 'readinglog',
      icon: 'trophy',
      accent: STAT_TINTS.longest,
      label: 'Longest streak',
      value: ov.longestStreak,
      unit: days(ov.longestStreak),
      trend: { delta: mo.longestStreak, format: (n) => `${n} ${days(n)}` },
      more: true,
    },
    {
      key: 'challenges',
      section: 'challenges',
      icon: 'trophy',
      accent: SECTION_ACCENT.challenges,
      label: 'Challenges joined',
      value: ov.challengesJoined,
      unit: ov.challengesJoined === 1 ? 'challenge' : 'challenges',
      trend: { delta: mo.challenges },
      more: true,
    },
  ]
}

// One row shape for every label-and-figure pair in the profile: tinted icon
// chip, label, then whatever figure the caller passes. With `onOpen` it's a
// button that opens a section (the Overview list); without it the row is a
// static summary sitting inside another card.
function StatRow({ icon, accent, label, children, onOpen }) {
  const Tag = onOpen ? 'button' : 'div'
  return (
    <Tag
      className={`rp-statrow${onOpen ? '' : ' rp-statrow--static'}`}
      {...(onOpen ? { type: 'button', onClick: onOpen } : {})}
    >
      <span
        className="rp-statrow-icon"
        style={{ background: accent.bg, color: accent.bar || accent.text }}
      >
        <Icon name={icon} size={16} />
      </span>
      <span className="rp-statrow-label">{label}</span>
      {children}
      {onOpen && (
        <Icon name="chevron-right" size={16} className="rp-statrow-go" aria-hidden="true" />
      )}
    </Tag>
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
      <div className="rp-latest-head">
        <SectionHeading>Latest titles</SectionHeading>
        <div className="rp-latest-head-right">
          {scrollable && (
            <div className="rp-latest-arrows">
              <Tooltip content="Previous titles">
                <button
                  type="button"
                  className="rp-heatmap-nav-btn"
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
                  className="rp-heatmap-nav-btn"
                  onClick={() => page(1)}
                  disabled={!right}
                  aria-label="More titles"
                >
                  <Icon name="chevron-right" size={13} stroke={2.2} />
                </button>
              </Tooltip>
            </div>
          )}
          <button type="button" className="rp-latest-link" onClick={() => onNavigate('readinglog')}>
            Reading Log
            <Icon name="arrow-right" size={14} />
          </button>
        </div>
      </div>
      <div className="rp-latest-grid" ref={ref} onScroll={sync}>
        {titles
          .slice()
          .reverse()
          .map((t, i) => (
            <a
              key={i}
              className="rp-latest-item"
              href={`https://openlibrary.org/isbn/${t.isbn}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="rp-latest-cover">
                <CoverImage isbn={t.isbn} title={t.title} />
              </div>
              <div className="rp-latest-title">{t.title}</div>
              <div className="rp-latest-author">{t.author}</div>
            </a>
          ))}
      </div>
    </>
  )
}

function OverviewStats({ metrics, note, onOpen }) {
  const [showMore, setShowMore] = useState(false)
  const shown = metrics.filter((m) => !m.more || showMore)
  const hidden = metrics.filter((m) => m.more).length

  return (
    <div className="rp-card rp-statlist">
      <div className="rp-statlist-head">
        <SectionHeading>At a glance</SectionHeading>
        {/* Stated once here rather than repeated in every chip. Absent on a
            range with nothing to compare against, along with the chips. */}
        {note && <span className="rp-statlist-note">Trend {note}</span>}
      </div>
      {shown.map((m) => (
        <StatRow
          key={m.key}
          icon={m.icon}
          accent={m.accent}
          label={m.label}
          onOpen={() => onOpen(m.section)}
        >
          {m.value == null ? (
            <span className="rp-statrow-empty">{m.empty}</span>
          ) : (
            <span className="rp-statrow-value">
              {m.value}
              {m.unit && <span className="rp-statrow-unit"> {m.unit}</span>}
            </span>
          )}
          {m.trend && <TrendPill {...m.trend} />}
        </StatRow>
      ))}
      {hidden > 0 && (
        <button type="button" className="rp-statlist-more" onClick={() => setShowMore((v) => !v)}>
          {showMore ? 'Show less' : `Show ${hidden} more`}
          <Icon name={showMore ? 'chevron-up' : 'chevron-down'} size={14} stroke={2.4} />
        </button>
      )}
    </div>
  )
}

// A library's Overview is deliberately thin. No "Benny says" summary and no
// recommended actions: those read a reader's behaviour and tell staff what to
// do about it, which is a teacher's job over a class, not a librarian's over a
// cardholder. And no range switcher — a library account has no school year to
// scope to, so the page is simply "how this reader is doing", with each figure
// carrying its own year-over-year chip.
function Overview({ student, onNavigate }) {
  const ov = student.overview.year
  const metrics = overviewMetrics(ov)

  return (
    <div className="rp-content">
      <Hero
        icon={<Ic name="ti-user" />}
        title="Overview"
        accent={SECTION_ACCENT.overview.text}
        accentBg={SECTION_ACCENT.overview.bg}
      />

      {/* Overview figures */}
      <OverviewStats metrics={metrics} note={ov.trend?.label} onOpen={onNavigate} />

      {/* Latest titles — covers first, so the shelf reads at a glance */}
      <Card>
        <TitleShelf titles={student.recentTitles} onNavigate={onNavigate} />
      </Card>
    </div>
  )
}

// ─── Section detail wrapper ───────────────────────────────────────────────────
// ─── Trend chip ───────────────────────────────────────────────────────────────
// A delta chip beside a figure. Green means the number moved the way you'd want
// it to, which is not always up: `inverse` covers figures like flags, where
// fewer is better. A zero delta renders nothing — "no change" is not news.
function TrendPill({ delta, format, inverse = false, suffix }) {
  if (delta == null || delta === 0) return null
  const up = delta > 0
  const good = inverse ? !up : up
  const n = Math.abs(delta)
  return (
    <Pill color={good ? '#16A34A' : '#DC2626'} size="sm">
      {up ? '↑' : '↓'}
      {format ? format(n) : n}
      {suffix ? ` ${suffix}` : ''}
    </Pill>
  )
}

// ─── Accounts ─────────────────────────────────────────────────────────────────
// The structural difference from a school: a library reader doesn't stand
// alone. Readers sit under a login account — one household, one email, one set
// of credentials — and an account can hold several of them. A parent signing
// the family up for summer reading creates one account and adds a reader per
// child (and often themselves).
const ACCOUNTS = {
  torres: {
    id: 'torres',
    name: 'Torres Family',
    creator: 'Elena Torres',
    email: 'elena.torres@gmail.com',
    phone: '(612) 555-0148',
    joined: 'Joined June 2023',
    zip: '55403',
    lastSignIn: 'Mon, 27 Jul 2026 22:13:50 -0400',
    created: '06-14-2023',
    updated: '05-15-2026',
    branch: 'Main Branch',
    cardNumber: '2199 0043 8871',
    // Readers on this account, in the order they were added.
    readers: ['elena', 'mateo', 'sofia'],
  },
}

const initialsOf = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

// ─── Reader data ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

const READERS = {
  // ── Mateo Torres — Exceptional ──────────────────────────────────────────────
  mateo: {
    key: 'mateo',
    age: '12',
    username: 'mateo.torres',
    groups: ['Summer Camp — Blue Team'],
    lastLogged: 'May 15',
    name: 'Mateo Torres',
    avatarColor: '#0F766E',
    // Promoted and banned are school-only — a library has no class leaderboard
    // to feature a reader on, and no teacher deciding who is off it.
    status: ['comicsplus'],
    // Libraries identify readers by age, not grade, and every reader sits on a
    // login account that can hold several of them.
    grade: 'Age 12',
    accountId: 'torres',
    friendCode: 'MTZ4K9P',
    recentTitles: [
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
        title: 'Fahrenheit 451',
        author: 'Ray Bradbury',
        lexile: 890,
        genre: 'Dystopian',
        sessions: 11,
        current: true,
        isbn: '9781451673319',
      },
      {
        title: 'The Giver',
        author: 'Lois Lowry',
        genre: 'Dystopian',
        isbn: '9780544336261',
      },
      {
        title: 'Hatchet',
        author: 'Gary Paulsen',
        genre: 'Adventure',
        isbn: '9781416936473',
      },
      {
        title: 'The Lightning Thief',
        author: 'Rick Riordan',
        genre: 'Fantasy',
        isbn: '9780786838653',
      },
    ],
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
        name: 'Review Writer | 2025',
        detail: 'Write 10 book reviews',
        kind: 'challenge',
        earned: true,
        top: '10',
        mid: 'REVIEWS',
        earnedNote: 'Earned for writing 10 reviews in Summer Reading 2026',
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
              'That Bradbury wrote Fahrenheit 451 in a library basement on a typewriter you had to pay a dime to use. The whole book cost them like $9.80.',
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
              "I'd give Ender's Game to my cousin because it moves fast and there's a lot of fighting in it.",
          },
        ],
      },
    ],
    // Overview stats per range. `daysPossible` counts school days: ~172 so far
    // this year, ~344 across the two years of logging history.
    overview: {
      year: {
        daysRead: 148,
        daysPossible: 172,
        currentStreak: 18,
        longestStreak: 18,
        booksCompleted: 24,
        challengesJoined: 4,
        // This year against last — the trend follows the range you're viewing.
        trend: {
          minutesPct: 27,
          books: 7,
          currentStreak: 11,
          longestStreak: 6,
          challenges: 2,
          label: 'vs last year',
        },
        minutes: 5480,
      },
      all: {
        daysRead: 281,
        daysPossible: 344,
        currentStreak: 18,
        longestStreak: 24,
        booksCompleted: 41,
        challengesJoined: 9,
        minutes: 10120,
      },
      // This month against last. Mateo is steady, so their flag count doesn't
      // move — a zero delta renders no chip at all.
    },
  },

  // ── Sofía Torres — Normal ─────────────────────────────────────────────────
  sofia: {
    key: 'sofia',
    age: '9',
    username: 'sofia.torres',
    groups: ['Storytime Club'],
    lastLogged: 'May 14',
    name: 'Sofía Torres',
    avatarColor: '#7C3AED',
    status: ['tandem', 'comicsplus'],
    // Libraries identify readers by age, not grade, and every reader sits on a
    // login account that can hold several of them.
    grade: 'Age 9',
    accountId: 'torres',
    friendCode: 'SF7B2QX',
    recentTitles: [
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
      {
        title: "Charlotte's Web",
        author: 'E. B. White',
        genre: 'Classic',
        isbn: '9780064410939',
      },
      {
        title: 'Because of Winn-Dixie',
        author: 'Kate DiCamillo',
        genre: 'Realistic',
        isbn: '9780763680863',
      },
      {
        title: 'The Bad Guys',
        author: 'Aaron Blabey',
        genre: 'Humor',
        isbn: '9780545912402',
      },
    ],
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
        name: 'Review Writer | 2025',
        detail: 'Write 10 book reviews',
        kind: 'challenge',
        earned: false,
        top: '10',
        mid: 'REVIEWS',
        year: '2025',
      },
    ],
    reviews: [
      {
        isbn: '9780689840920',
        title: 'Hatchet',
        author: 'Gary Paulsen',
        date: '05/04/25',
        text: 'I liked this book a lot. Brian has to figure out everything by himself which made me think about what I would do, and honestly I would not have made it past the first week. The part with the porcupine was gross. My favorite part was when they finally got the fire started because you could tell how much it mattered to them.',
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
              'My sister had it from their class last year and the cover looked kind of creepy so I wanted to see what it was about.',
          },
        ],
      },
    ],
    overview: {
      year: {
        daysRead: 74,
        daysPossible: 172,
        currentStreak: 4,
        longestStreak: 6,
        booksCompleted: 11,
        challengesJoined: 3,
        // This year against last — the trend follows the range you're viewing.
        trend: {
          minutesPct: 24,
          books: 4,
          currentStreak: 2,
          longestStreak: 3,
          challenges: 1,
          label: 'vs last year',
        },
        minutes: 1780,
      },
      all: {
        daysRead: 138,
        daysPossible: 344,
        currentStreak: 4,
        longestStreak: 9,
        booksCompleted: 19,
        challengesJoined: 6,
        minutes: 3170,
      },
    },
  },

  // ── Elena Torres — Struggling ────────────────────────────────────────────────
  elena: {
    key: 'elena',
    age: '18+',
    username: 'etorres',
    groups: [],
    lastLogged: 'Mar 2',
    name: 'Elena Torres',
    avatarColor: '#1D4ED8',
    status: [],
    // Libraries identify readers by age, not grade, and every reader sits on a
    // login account that can hold several of them.
    grade: 'Adult',
    accountId: 'torres',
    friendCode: 'EL3M8RW',
    recentTitles: [
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
      {
        title: 'Educated',
        author: 'Tara Westover',
        genre: 'Memoir',
        isbn: '9780399590504',
      },
      {
        title: 'The Midnight Library',
        author: 'Matt Haig',
        genre: 'Fiction',
        isbn: '9780525559474',
      },
      {
        title: 'Braiding Sweetgrass',
        author: 'Robin Wall Kimmerer',
        genre: 'Nature',
        isbn: '9781571313560',
      },
    ],
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
        name: 'Review Writer | 2025',
        detail: 'Write 10 book reviews',
        kind: 'challenge',
        earned: false,
        top: '10',
        mid: 'REVIEWS',
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
    // Elena answers the prompts, but barely — the same low-effort pattern as the
    // rest of their logging.
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
        daysRead: 26,
        daysPossible: 172,
        currentStreak: 0,
        longestStreak: 3,
        booksCompleted: 3,
        challengesJoined: 1,
        // This year against last — the trend follows the range you're viewing.
        trend: {
          minutesPct: -62,
          books: -5,
          currentStreak: -9,
          longestStreak: -4,
          challenges: -2,
          label: 'vs last year',
        },
        minutes: 470,
      },
      all: {
        daysRead: 61,
        daysPossible: 344,
        currentStreak: 0,
        longestStreak: 5,
        booksCompleted: 7,
        challengesJoined: 2,
        minutes: 1040,
      },
    },
  },
}

// ─── Reading Log ──────────────────────────────────────────────────────────────
// Sessions the reading log can open, keyed by title and shaped for the shared
// session modal.
//
// **No book talks here.** Book talks are a school feature — libraries don't run
// them — so a library session is a log entry and its flags, nothing more. That
// means no conversation, no engagement rating, and none of the positive flags
// that a talk produces; what a library *does* have is logging integrity, which
// is where these flags come from. A log entry with no key here still opens; it
// just has details and no flags.
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
        label: 'Logged in one sitting',
        description: 'A single entry covering more than eight hours of reading.',
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
function RLEntryCard({ entry, onOpen }) {
  const tone = entry.completed
    ? ' rp-rl-entry--completed'
    : entry.flagged
      ? ' rp-rl-entry--flagged'
      : ''
  // The row advertises what opening it will show. Flags only — libraries don't
  // run book talks, so there's no conversation to advertise.
  const session = RL_SESSIONS[entry.title]
  const marks = [
    session?.flags?.length && {
      key: 'flag',
      icon: 'flag',
      className: 'rp-rl-mark rp-rl-mark--neg',
      label: session.flags.length === 1 ? session.flags[0].label : `${session.flags.length} flags`,
    },
    session?.positiveFlags?.length && {
      key: 'pos',
      icon: 'flag',
      className: 'rp-rl-mark rp-rl-mark--pos',
      label:
        session.positiveFlags.length === 1
          ? session.positiveFlags[0].label
          : `${session.positiveFlags.length} positive flags`,
    },
  ].filter(Boolean)

  return (
    <div className={`rp-rl-entry${tone}`}>
      <div className="rp-rl-entry-top">
        {/* The title opens the session — its flags live there, not squeezed
            into the log row. */}
        <button type="button" className="rp-rl-entry-title" onClick={() => onOpen?.(entry)}>
          {entry.title}
        </button>
        <div className="rp-rl-entry-menu">
          {marks.map((m) => (
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
          ))}
          <Flyout
            placement="bottom-end"
            trigger={({ toggle }) => (
              <Tooltip content="Entry actions">
                <button
                  type="button"
                  className="rp-rl-dots"
                  onClick={toggle}
                  aria-label="Entry actions"
                >
                  <Icon name="dots" size={16} />
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
        </div>
      </div>
      <div className="rp-rl-entry-author">
        {entry.author}
        {/* Where the session came from. A partner-logged session isn't
            something the reader typed in — it arrived from the app they read
            in, which is worth saying on the row. */}
        {entry.source && PARTNER_BRANDS[entry.source] && (
          <Tooltip content={`Logged from ${PARTNER_BRANDS[entry.source].name}`}>
            <span
              className="rp-rl-source"
              style={{ '--rp-mark-bg': PARTNER_BRANDS[entry.source].accent }}
            >
              <PartnerMark id={entry.source} size={16} />
            </span>
          </Tooltip>
        )}
      </div>
      {entry.completed ? (
        <span className="rp-rl-completed">Completed</span>
      ) : (
        <div className="rp-rl-entry-amount">{entry.amount}</div>
      )}
    </div>
  )
}

// The product offers the same month two ways: grouped by day, or as a flat
// table of every logged unit. `RL_ROWS` is the second one — one row per unit,
// which is how Beanstack stores them (5 minutes / 1 day / 1 book are separate
// entries against the same sitting). Sorted newest first: the week grouping
// hid that `RL_DATA`'s day order isn't strictly descending, but a flat list
// shows it.
const RL_MONTH = { label: 'July 2024', mm: '07', yyyy: '2024' }

const RL_ROWS = RL_DATA.flatMap((week) =>
  week.days.flatMap((day) =>
    day.entries.map((e) => ({
      date: `${RL_MONTH.mm}/${String(day.date).padStart(2, '0')}/${RL_MONTH.yyyy}`,
      title: e.title,
      author: e.author,
      unit: e.completed ? '1 book' : e.amount.toLowerCase(),
      lexile: e.lexile ?? null,
      flagged: !!e.flagged,
    })),
  ),
).sort((a, b) => b.date.localeCompare(a.date))

const RL_VIEWS = [
  { id: 'list', label: 'List', icon: <Icon name="list" size={15} /> },
  { id: 'table', label: 'Table', icon: <Icon name="layout-grid" size={15} /> },
]

function ReadingLogTable() {
  return (
    <Table
      flush
      compact
      scrollX
      columns={[
        { key: 'date', label: 'Date', width: 96 },
        {
          key: 'title',
          label: 'Title',
          render: (title, row) => (
            <div className="rp-rl-tbl-title">
              <span className="rp-rl-tbl-name">{title}</span>
              <span className="rp-rl-tbl-author">{row.author}</span>
            </div>
          ),
        },
        { key: 'unit', label: 'Unit', width: 96 },
        {
          key: 'lexile',
          label: 'Lexile',
          width: 76,
          render: (lex) => lex ?? <span className="rp-talk-noflag">–</span>,
        },
        {
          key: 'flagged',
          label: '',
          width: 40,
          align: 'right',
          render: () => (
            <Tooltip content="Entry actions">
              <button type="button" className="rp-rl-dots" aria-label="Entry actions">
                <Icon name="dots" size={16} />
              </button>
            </Tooltip>
          ),
        },
      ]}
      rows={RL_ROWS}
      getRowKey={(r, i) => i}
    />
  )
}

function ReadingLogPage({ reader }) {
  const [view, setView] = useState('list')
  const [openSession, setOpenSession] = useState(null)
  const month = RL_MONTH.label

  // An entry with no authored session still opens — you get the details, which
  // is all a plain minutes log has.
  // Shaped for the shared session modal. An entry with no authored session is
  // still a session — it just has no flags and no book talk.
  const openEntry = (entry) => {
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
    <div className="rp-content">
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
        <div className="rp-titles-header">
          <span className="rp-titles-header-label">{month}</span>
          <div className="rp-rl-month-arrows">
            <Tooltip content="Previous month">
              <button className="rp-heatmap-nav-btn" aria-label="Previous month">
                <Icon name="chevron-left" size={11} />
              </button>
            </Tooltip>
            <Tooltip content="Next month">
              <button className="rp-heatmap-nav-btn" aria-label="Next month">
                <Icon name="chevron-right" size={11} />
              </button>
            </Tooltip>
          </div>
        </div>
        {view === 'table' ? (
          <ReadingLogTable />
        ) : (
          <div className="rp-rl-body">
            {RL_DATA.map((week, wi) => (
              <div key={wi} className="rp-rl-week">
                <div className="rp-rl-week-label">{week.weekLabel}</div>
                {week.days.map((day, di) => (
                  <div key={di} className={`rp-rl-day${day.faded ? ' rp-rl-day--faded' : ''}`}>
                    <div className="rp-rl-day-col">
                      <div className="rp-rl-day-num">{day.date}</div>
                      <div className="rp-rl-day-name">{day.day}</div>
                      {day.streak > 0 && (
                        <span className="rp-rl-flame">
                          {day.streak}
                          <Icon name="flame-filled" size={13} />
                        </span>
                      )}
                    </div>
                    {/* A day with nothing logged shows only its date — no filler row. */}
                    {day.entries.length > 0 && (
                      <div className="rp-rl-entries">
                        {day.entries.map((e, ei) => (
                          <RLEntryCard key={ei} entry={e} onOpen={openEntry} />
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

      {/* The one session modal. No reader list: you're inside this reader's own
          profile, so "their other sessions" is the page you came from. */}
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
    <div className="rp-content">
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
            <div className="rp-latest-head">
              <SectionHeading>{ch.challenge}</SectionHeading>
              <span className="rp-titles-header-meta">
                {ch.responses.length} {ch.responses.length === 1 ? 'response' : 'responses'}
              </span>
            </div>
            {ch.responses.map((r) => (
              <div key={r.prompt + r.date} className="rp-tb-item">
                <div className="rp-tb-head">
                  <span className="rp-tb-prompt">{r.prompt}</span>
                  <span className="rp-tb-date">{r.date}</span>
                </div>
                <div className="rp-tb-answer">{r.answer}</div>
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
// their own words. Covers come from the same Open Library lookup the Overview's
// title shelf uses.
function ReviewsPage({ student }) {
  const reviews = student.reviews ?? []
  return (
    <div className="rp-content">
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
            <div className="rp-review-item">
              <a
                href={`https://openlibrary.org/isbn/${r.isbn}`}
                target="_blank"
                rel="noreferrer"
                className="rp-title-cover-link"
              >
                <CoverImage isbn={r.isbn} title={r.title} />
              </a>
              <div className="rp-review-main">
                <div className="rp-review-head">
                  <div>
                    <div className="rp-review-title">{r.title}</div>
                    <div className="rp-title-author">{r.author}</div>
                  </div>
                  <span className="rp-tb-date">{r.date}</span>
                </div>
                <div className="rp-review-text">{r.text}</div>
              </div>
            </div>
            {/* Card footer, full width past the cover column. Inert, like the Log
                and Edit Goal buttons — the demo wants the affordances to look
                right, not to wire up CRUD. */}
            <div className="rp-review-actions">
              {REVIEW_ACTIONS.map((a) => (
                <Tooltip key={a.label} content={a.label}>
                  <IconButton variant="ghost" size="sm" aria-label={a.label}>
                    <Icon name={a.icon} size={16} />
                  </IconButton>
                </Tooltip>
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
      className={`rp-medal${year ? '' : ' rp-medal--plain'}`}
      style={{ '--medal': color, '--medal-size': `${size}px` }}
    >
      <span className="rp-medal-glyph">
        <Icon name={icon} size={Math.round(size * 0.44)} />
      </span>
      {year && <span className="rp-medal-year">{year}</span>}
    </div>
  )
}

function AchievementMedal({ item, size = 68 }) {
  return <MedalDisc icon={item.icon} color={item.color} year={item.date.slice(-4)} size={size} />
}

function BadgeSeal({ badge, size = 68 }) {
  return (
    <div
      className={`rp-seal${badge.earned ? '' : ' rp-seal--locked'}`}
      style={{ '--medal-size': `${size}px` }}
    >
      <span className="rp-seal-top">{badge.top}</span>
      <span className="rp-seal-mid">{badge.mid}</span>
      <span className="rp-seal-year">{badge.year}</span>
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
        <div className="rp-medal-modal">
          <IconButton
            variant="ghost"
            size="sm"
            className="rp-medal-modal-close"
            aria-label="Close"
            onClick={close}
          >
            <Icon name="x" size={18} stroke={2.2} />
          </IconButton>
          <div className="rp-medal-modal-art">{art}</div>
          <div className="rp-medal-modal-label">{label}</div>
          <div className="rp-medal-modal-headline">{headline}</div>
          {note && <div className="rp-medal-modal-note">{note}</div>}
          <div className="rp-medal-modal-foot">
            <button
              type="button"
              className={`rp-medal-modal-btn rp-medal-modal-btn--${action.tone}`}
              onClick={close}
            >
              {action.label}
            </button>
            {action.caution && (
              <div className="rp-medal-modal-caution">
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
    <div className="rp-content">
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
        <div className="rp-medal-grid">
          {shown.map((a) => (
            <button
              key={a.name}
              type="button"
              className="rp-medal-card"
              onClick={() => setOpenItem(a)}
            >
              <AchievementMedal item={a} />
              <span className="rp-medal-name">{a.name}</span>
              <span className="rp-medal-sub">Earned on {a.date}</span>
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
    <div className="rp-content">
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
        <div className="rp-medal-grid">
          {shown.map((b) => (
            <button
              key={b.name}
              type="button"
              className="rp-medal-card"
              onClick={() => setOpenItem(b)}
            >
              <BadgeSeal badge={b} />
              <span className="rp-medal-name">{b.name}</span>
              <span className="rp-medal-sub">{b.detail}</span>
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
    <div className="rp-content">
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
        <div className="rp-titles-header">
          <span className="rp-titles-header-label">Activity badges</span>
          <span className="rp-titles-header-meta">Completed?</span>
        </div>
        {badges.length === 0 ? (
          <EmptyState title="No activity badges" description="This reader has none assigned yet." />
        ) : (
          badges.map((b, i) => {
            const done = doneCount(b)
            const all = b.activities.length
            return (
              <div key={b.name} className="rp-act-row">
                <MedalDisc icon={b.icon} color={b.color} size={42} />
                <div className="rp-act-main">
                  <div className="rp-act-name">{b.name}</div>
                  <div className="rp-act-count">
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
          <div className="rp-act-modal">
            <div className="rp-act-modal-head">
              {openBadge && <MedalDisc icon={openBadge.icon} color={openBadge.color} size={34} />}
              <span className="rp-act-modal-title">{openBadge?.name}</span>
              <IconButton
                variant="ghost"
                size="sm"
                title="Close"
                aria-label="Close"
                onClick={close}
              >
                <Icon name="x" size={18} stroke={2.2} />
              </IconButton>
            </div>
            <div className="rp-act-modal-cols">
              <span>Activity</span>
              <span>Completed?</span>
            </div>
            <div className="rp-act-modal-body">
              {openBadge?.activities.map((a, j) => (
                <div key={a.text} className="rp-act-modal-row">
                  <span className="rp-act-modal-text">{a.text}</span>
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
    <div className="rp-content">
      <Hero icon={<Ic name={icon} />} title={title} accent={accent} accentBg={accentBg} />
      <Card flush>
        <div className="rp-titles-header">
          <span className="rp-titles-header-label">{nameLabel}</span>
          <span className="rp-titles-header-meta">Claimed?</span>
        </div>
        {items.length === 0 ? (
          <EmptyState title={empty.title} description={empty.description} />
        ) : (
          items.map((item, i) => (
            <div key={item.name} className="rp-act-row">
              <div className="rp-act-main">
                <div className="rp-act-name">{item.name}</div>
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

function ChallengesPage({ student, onNavigate }) {
  const [tab, setTab] = useState('current')
  const all = student.challenges ?? []
  const shown = all.filter((c) => c.status === tab)

  return (
    <div className="rp-content">
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
        <div className="rp-titles-header">
          <span className="rp-titles-header-label">Challenge</span>
          <span className="rp-titles-header-meta">Enrolled?</span>
        </div>
        {shown.length === 0 ? (
          <EmptyState
            title={`No ${tab === 'ended' ? 'recently ended' : tab} challenges`}
            description="Nothing to show for this reader here."
          />
        ) : (
          shown.map((c) => (
            <div key={c.name} className="rp-chal-row">
              <div className="rp-chal-main">
                <div className="rp-act-name">{c.name}</div>
                <div className="rp-chal-dates">{c.dates}</div>
                <div className="rp-chal-meta">
                  <span>Started on: {c.startedOn}</span>
                  {c.minutes != null && <span>Minutes reading: {c.minutes.toLocaleString()}</span>}
                </div>
                <button
                  type="button"
                  className="rp-latest-link"
                  onClick={() => onNavigate('readinglog')}
                >
                  View challenge log
                  <Icon name="arrow-right" size={14} />
                </button>
              </div>
              {/* Enrolment is a state, not a control — a green tick, not a checkbox */}
              <span className="rp-chal-enrolled" aria-label="Enrolled">
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
    <div className="rp-content">
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

// ─── Account ──────────────────────────────────────────────────────────────────
// A reader's login lives on the account, not on the reader, so this page is
// about the household: who holds the card, how to reach them, and everyone
// reading under it. Each reader row jumps straight into that reader's profile.
// The account creator's own record — the login, not a reader. Matches the
// admin form: everything here is shared by every reader on the account.
function EditAccountModal({ open, onClose, account }) {
  const [first, last] = account.creator.split(' ')
  return (
    <ActionModal open={open} onClose={onClose} title={`Edit ${account.creator}`} secondary="Cancel">
      <div className="rp-form-section">Account Creator&rsquo;s Basic Info</div>
      <div className="rp-form-row">
        <Field label="First Name" required>
          <Input defaultValue={first} />
        </Field>
        <Field label="Last Name">
          <Input defaultValue={last} />
        </Field>
      </div>
      <Field label="Email Address">
        <Input defaultValue={account.email} />
      </Field>
      <div className="rp-form-row">
        <Field label="Username">
          <Input defaultValue="" />
        </Field>
        <Field label="ZIP Code" required>
          <Input defaultValue={account.zip} />
        </Field>
      </div>
      <Field label="Library Card Number">
        <Input defaultValue={account.cardNumber} />
      </Field>
      <div className="rp-form-row">
        <Field label="Password" required>
          <Input type="password" defaultValue="" />
        </Field>
        <Field label="Password Confirmation" required>
          <Input type="password" defaultValue="" />
        </Field>
      </div>
      <Field label="Role">
        <Select defaultValue="patron">
          <option value="patron">Patron</option>
          <option value="staff">Staff</option>
        </Select>
      </Field>
    </ActionModal>
  )
}

// The account page — a level above the reader, not a tab inside them. Staff
// land here from a search result and pick a reader from it; the credentials,
// the rewards and the "log for everyone" action all belong to the account
// rather than to any one reader on it.
function AccountPage({ accountId, onReaderClick, onBack }) {
  const account = ACCOUNTS[accountId]
  const [editing, setEditing] = useState(false)

  return (
    <div className="rp-adm">
      <Sidebar
        title="People"
        subtitle="Find, add, delete, and take actions on behalf of account creators and readers."
        mainRailIndex={1}
        nav={PEOPLE_NAV}
        active="find"
      />

      <div className="rp-adm-main">
        <BackBar label="Back to Find a Person" onClick={onBack} />
        <div className="rp-adm-main-body">
          <div className="rp-acct-page-head">
            <h1 className="rp-find-title">{account.creator}</h1>
            <div className="rp-acct-page-btns">
              <Button variant="secondary">Log for All Readers</Button>
              <Flyout
                placement="bottom-end"
                trigger={({ toggle }) => (
                  <Button
                    variant="secondary"
                    onClick={toggle}
                    iconRight={<Icon name="chevron-down" size={11} stroke={2.5} />}
                  >
                    Add Readers
                  </Button>
                )}
              >
                {({ close }) => (
                  <DropdownMenu
                    items={[{ label: 'Add a Reader' }, { label: 'Add Multiple Readers' }]}
                    onClose={close}
                  />
                )}
              </Flyout>
              <Button variant="primary">Redeem Rewards</Button>
            </div>
          </div>

          <Banner level="info">Last sign in on {account.lastSignIn}</Banner>

          {/* Readers beside Account Info, as the real account screen lays it
              out — the readers are the point, the credentials are the aside. */}
          <div className="rp-acct-cols">
            <Card>
              <SectionHeading>Readers</SectionHeading>
              {account.readers.map((key) => {
                const r = READERS[key]
                return (
                  <div key={key} className="rp-acct-reader-block">
                    <Avatar initials={initialsOf(r.name)} color={r.avatarColor} size="md" />
                    <div className="rp-acct-reader-main">
                      <button
                        type="button"
                        className="rp-acct-reader-link"
                        onClick={() => onReaderClick?.(key)}
                      >
                        {r.name}
                      </button>
                      <div className="rp-acct-reader-sub">
                        {r.grade} · Friend code {r.friendCode}
                      </div>
                      <div className="rp-acct-reader-stats">
                        <span>
                          <b>{r.overview.year.minutes.toLocaleString()}</b> min
                        </span>
                        <span>
                          <b>{r.overview.year.booksCompleted}</b> books
                        </span>
                        <span>Last logged {r.lastLogged}</span>
                      </div>
                    </div>
                    <button type="button" className="rp-acct-edit-link">
                      Edit Information
                    </button>
                  </div>
                )
              })}
            </Card>

            <Card>
              <SectionHeading>Account info</SectionHeading>
              {[
                ['Email', account.email],
                ['Phone Number', account.phone],
                ['Library Branch', account.branch],
                ['Library Card', account.cardNumber ? 'Yes' : 'No'],
              ].map(([label, value]) => (
                <div key={label} className="rp-acct-field">
                  <div className="rp-acct-field-label">{label}</div>
                  <div className="rp-acct-field-value">{value}</div>
                </div>
              ))}
              <div className="rp-acct-info-btns">
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                  Edit
                </Button>
                <Button variant="secondary" size="sm">
                  Merge Account
                </Button>
              </div>
            </Card>
          </div>

          <div className="rp-find-footer">
            <span>© 2026, Joyful Reading Co.</span>
            <span>Beanstack-Melodic-Crocodile-273</span>
          </div>
        </div>
      </div>

      <EditAccountModal open={editing} onClose={() => setEditing(false)} account={account} />
    </div>
  )
}

// ─── Find a Person ────────────────────────────────────────────────────────────
// The library equivalent of the school's class table, modelled on the real
// People > Find a Person screen. Libraries have no classroom rosters to browse,
// so staff reach a reader by searching — and the search is a form of specific
// fields (name, email, card number, branch…), not one box, because staff are
// usually working from whatever detail the person at the desk gave them.
const PEOPLE_NAV = [
  { id: 'find', label: 'Find a Person', icon: 'person' },
  { id: 'add', label: 'Add an Account Creator', icon: 'demographics' },
  { id: 'messages', label: 'Contact Messages', icon: 'flag' },
  { id: 'merges', label: 'Account Merges', icon: 'overview' },
]

// Nine fields is a wall. The three staff reach for most stay in view and the
// rest sit behind "Advanced options" — the same set, one click away.
const SEARCH_FIELDS = [
  { id: 'first', label: 'First Name' },
  { id: 'last', label: 'Last Name' },
  { id: 'email', label: 'Email Address' },
  { id: 'phone', label: 'Phone', advanced: true },
  { id: 'username', label: 'Username', advanced: true },
  {
    id: 'branch',
    label: 'Library Branch',
    options: ['Main', 'East Side', 'Northgate'],
    advanced: true,
  },
  { id: 'card', label: 'Library Card Number', advanced: true },
  { id: 'group', label: 'Group Name', advanced: true },
  {
    id: 'challenge',
    label: 'Challenge',
    options: ['Summer Reading 2026', 'Winter Reading 2025', 'Read Across America'],
    advanced: true,
  },
]

const ADVANCED_COUNT = SEARCH_FIELDS.filter((f) => f.advanced).length

const BLANK_SEARCH = Object.fromEntries(SEARCH_FIELDS.map((f) => [f.id, '']))

// What each field matches against on a reader. Kept beside the field list so a
// new field can't silently become decorative.
const MATCHERS = {
  first: (r) => r.name.split(' ')[0],
  last: (r) => r.name.split(' ').slice(1).join(' '),
  email: (r) => ACCOUNTS[r.accountId].email,
  phone: (r) => ACCOUNTS[r.accountId].phone,
  username: (r) => r.username,
  branch: (r) => ACCOUNTS[r.accountId].branch,
  card: (r) => ACCOUNTS[r.accountId].cardNumber,
  group: (r) => r.groups.join(' '),
  challenge: (r) => r.challenges.map((ch) => ch.name).join(' '),
}

const READER_ROWS = ['elena', 'mateo', 'sofia']

// What staff can do to a reader straight from a search result, without opening
// the profile first. `icon` is a registry name, not an element — the menu wraps
// it at render time, and an element here silently renders an empty button.
const READER_ROW_ACTIONS = [
  { label: 'Edit Reader', icon: 'pencil' },
  { label: 'Redeem Rewards', icon: 'gift' },
  { label: 'Add to Log', icon: 'reading-log' },
  { label: 'Log Activities', icon: 'puzzle' },
  { label: 'Challenge Actions', icon: 'trophy' },
]

function FindAPerson({ onReaderClick, onOpenAccount, selectedKey }) {
  const [form, setForm] = useState(BLANK_SEARCH)
  const [searched, setSearched] = useState(false)
  const [advanced, setAdvanced] = useState(false)

  const set = (id, v) => setForm((f) => ({ ...f, [id]: v }))

  const field = (f) => (
    <Field key={f.id} label={f.label}>
      {f.options ? (
        <Select value={form[f.id]} onChange={(e) => set(f.id, e.target.value)}>
          <option value="">- Select -</option>
          {f.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          value={form[f.id]}
          onChange={(e) => set(f.id, e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setSearched(true)}
        />
      )}
    </Field>
  )
  const filled = Object.entries(form).filter(([, v]) => v.trim().length >= 2)
  // The real screen refuses a one-character search — it would return the world.
  const tooShort = Object.values(form).some((v) => v.trim() && v.trim().length < 2)

  const rows = READER_ROWS.filter((key) => {
    const r = READERS[key]
    return filled.every(([id, v]) =>
      (MATCHERS[id]?.(r) ?? '').toLowerCase().includes(v.trim().toLowerCase()),
    )
  })

  return (
    <div className="rp-adm">
      <Sidebar
        title="People"
        subtitle="Find, add, delete, and take actions on behalf of account creators and readers."
        mainRailIndex={1}
        nav={PEOPLE_NAV}
        active="find"
      />

      <div className="rp-adm-main">
        <div className="rp-adm-main-body">
          <div className="rp-find-head">
            <h1 className="rp-find-title">Find a Person</h1>
            <p className="rp-find-sub">Search fields must contain at least two characters.</p>
          </div>

          <div className="rp-find-card">
            <div className="rp-find-grid">
              {SEARCH_FIELDS.filter((f) => !f.advanced).map(field)}
            </div>

            <button
              type="button"
              className="rp-find-advanced"
              onClick={() => setAdvanced((v) => !v)}
              aria-expanded={advanced}
            >
              <Icon name={advanced ? 'chevron-up' : 'chevron-down'} size={14} stroke={2.4} />
              Advanced options
              {!advanced && <span className="rp-find-advanced-n">{ADVANCED_COUNT}</span>}
            </button>

            {advanced && (
              <div className="rp-find-grid rp-find-grid--advanced">
                {SEARCH_FIELDS.filter((f) => f.advanced).map(field)}
              </div>
            )}
            <div className="rp-find-actions">
              <Button variant="primary" onClick={() => setSearched(true)}>
                Search
              </Button>
              {searched && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setForm(BLANK_SEARCH)
                    setSearched(false)
                    setAdvanced(false)
                  }}
                >
                  Clear
                </Button>
              )}
              {tooShort && <span className="rp-find-warn">Enter at least two characters.</span>}
            </div>
          </div>

          {/* Before a search there's nothing to show — say so, rather than
              leaving the page looking like it failed to load. */}
          {!searched && (
            <EmptyState
              variant="dashed"
              icon={<Icon name="search" size={22} />}
              title="Search for a reader or account creator"
              description="Fill in any of the fields above — a name, an email, a library card number — and select Search."
            />
          )}

          {searched && (
            <>
              <h2 className="rp-find-count">
                There {rows.length === 1 ? 'is' : 'are'} {rows.length}{' '}
                {rows.length === 1 ? 'result' : 'results'} for your search.
              </h2>

              <Banner level="info">
                <a className="rp-find-add" href="#add">
                  Didn&rsquo;t find the right person? Add an account and reader.
                </a>
              </Banner>

              {rows.length === 0 ? (
                <EmptyState
                  variant="dashed"
                  title="No people found"
                  description="Try fewer fields, or search by email or library card number."
                />
              ) : (
                <div className="rp-adm-card">
                  {/* A row is a reader. The account creator travels with them —
                      it's the login they sit under, and what staff need when the
                      person at the desk isn't the reader themselves. */}
                  <table className="tbl tbl--flush rp-find-results">
                    <thead>
                      <tr>
                        <th className="tbl-th" style={{ textAlign: 'left' }}>
                          Account Creator
                        </th>
                        <th className="tbl-th" style={{ textAlign: 'left' }}>
                          Reader
                        </th>
                        <th className="tbl-th" style={{ textAlign: 'left' }}>
                          Reader&rsquo;s Age
                        </th>
                        <th className="tbl-th" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((key) => {
                        const r = READERS[key]
                        const acct = ACCOUNTS[r.accountId]
                        return (
                          <tr
                            key={key}
                            className={`tbl-row tbl-row--clickable${selectedKey === key ? ' rp-adm-row--selected' : ''}`}
                            onClick={() => onReaderClick?.(key)}
                            onKeyDown={(ev) => ev.key === 'Enter' && onReaderClick?.(key)}
                            role="button"
                            tabIndex={0}
                          >
                            <td className="tbl-td rp-find-creator">
                              <div className="rp-find-creator-name">
                                <button
                                  type="button"
                                  className="rp-find-creator-link"
                                  onClick={(ev) => {
                                    ev.stopPropagation()
                                    onOpenAccount?.(r.accountId)
                                  }}
                                >
                                  {acct.creator}
                                </button>
                              </div>
                              <div className="rp-find-creator-line">
                                <b>Email:</b> {acct.email}
                              </div>
                              <div className="rp-find-creator-line">
                                <b>Reader&rsquo;s Branch:</b> {acct.branch}
                              </div>
                              <div className="rp-find-creator-line">
                                <b>Account Created:</b> {acct.created}
                              </div>
                              <div className="rp-find-creator-line">
                                <b>Account Last Updated:</b> {acct.updated}
                              </div>
                            </td>
                            <td className="tbl-td">
                              <div className="rp-adm-student-cell">
                                <Avatar
                                  initials={initialsOf(r.name)}
                                  color={r.avatarColor}
                                  size="sm"
                                />
                                <button
                                  type="button"
                                  className="rp-adm-student-name"
                                  title={`Open ${r.name}'s profile`}
                                  onClick={(ev) => {
                                    ev.stopPropagation()
                                    onReaderClick?.(key)
                                  }}
                                >
                                  {r.name}
                                </button>
                              </div>
                            </td>
                            <td className="tbl-td">{r.age}</td>
                            <td className="tbl-td">
                              <span
                                className="rp-find-row-actions"
                                onClick={(ev) => ev.stopPropagation()}
                                role="presentation"
                              >
                                <Flyout
                                  placement="bottom-end"
                                  trigger={({ toggle }) => (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={toggle}
                                      iconRight={
                                        <Icon name="chevron-down" size={11} stroke={2.5} />
                                      }
                                    >
                                      Actions
                                    </Button>
                                  )}
                                >
                                  {({ close }) => (
                                    <DropdownMenu
                                      items={READER_ROW_ACTIONS.map((a) => ({
                                        ...a,
                                        icon: <Icon name={a.icon} size={15} />,
                                      }))}
                                      onClose={close}
                                    />
                                  )}
                                </Flyout>
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          <div className="rp-find-footer">
            <span>© 2026, Joyful Reading Co.</span>
            <span>Beanstack-Melodic-Crocodile-273</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Profile pager ────────────────────────────────────────────────────────────
// Step between the students on the page without closing the panel. The section
// stays put, so you can compare the same tab across readers.
export const READER_ORDER = ['mateo', 'sofia', 'elena']

// `variant`: 'inline' is the pair of wide buttons in the mobile nav bar;
// 'float' is the round pair in the floating control rail beside the panel. Both
// use left/right chevrons — the rail stacks them, but they step through a
// horizontal list of readers, not up and down one.
function ProfilePager({ currentKey, onSelect, variant = 'inline' }) {
  const idx = READER_ORDER.indexOf(currentKey)
  const prev = idx > 0 ? READER_ORDER[idx - 1] : null
  const next = idx < READER_ORDER.length - 1 ? READER_ORDER[idx + 1] : null
  const float = variant === 'float'
  const btnClass = float ? 'rp-ctrl-btn' : 'rp-pager-btn'
  const icon = float ? { size: 15, stroke: 2.2 } : { size: 17, stroke: 2.2 }

  return (
    <div className={float ? 'rp-ctrl-group' : 'rp-pager'}>
      <Tooltip
        content={prev ? `Previous — ${READERS[prev].name}` : 'No previous reader'}
        placement={float ? 'right' : 'top'}
      >
        <button
          type="button"
          className={btnClass}
          disabled={!prev}
          onClick={() => prev && onSelect(prev)}
          aria-label={prev ? `Previous reader, ${READERS[prev].name}` : 'No previous reader'}
        >
          <Icon name="chevron-left" {...icon} />
        </button>
      </Tooltip>
      <Tooltip
        content={next ? `Next — ${READERS[next].name}` : 'No next reader'}
        placement={float ? 'right' : 'top'}
      >
        <button
          type="button"
          className={btnClass}
          disabled={!next}
          onClick={() => next && onSelect(next)}
          aria-label={next ? `Next reader, ${READERS[next].name}` : 'No next reader'}
        >
          <Icon name="chevron-right" {...icon} />
        </button>
      </Tooltip>
    </div>
  )
}

// ─── Deep links ───────────────────────────────────────────────────────────────
// The panel is addressable: `#/marcus` opens Mateo's overview in the side
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
  if (!READERS[key]) return null
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
function ProfileCtrls({ onClose, expanded, onToggleExpand, currentKey, onSelectReader }) {
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="rp-profile-ctrls">
      <div className="rp-ctrl-group">
        <Tooltip content="Close profile" placement="right">
          <button
            type="button"
            className="rp-ctrl-btn"
            onClick={onClose}
            aria-label="Close profile"
          >
            <Icon name="x" size={15} stroke={2.2} />
          </button>
        </Tooltip>
        <Tooltip
          content={expanded ? 'Exit full screen' : 'Expand to full screen'}
          placement="right"
        >
          <button
            type="button"
            className="rp-ctrl-btn rp-ctrl-btn--expand"
            onClick={onToggleExpand}
            aria-label={expanded ? 'Exit full screen' : 'Expand to full screen'}
          >
            <Icon name={expanded ? 'minimize' : 'maximize'} size={14} stroke={2.1} />
          </button>
        </Tooltip>
        <Tooltip content={copied ? 'Link copied' : 'Copy link to this view'} placement="right">
          <button
            type="button"
            className={`rp-ctrl-btn${copied ? ' rp-ctrl-btn--done' : ''}`}
            onClick={copyLink}
            aria-label={copied ? 'Link copied' : 'Copy link to this view'}
          >
            <Icon name={copied ? 'check' : 'link'} size={14} stroke={2.1} />
          </button>
        </Tooltip>
      </div>
      <ProfilePager variant="float" currentKey={currentKey} onSelect={onSelectReader} />
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
  onSelectReader,
}) {
  return (
    <>
      <ProfileCtrls
        onClose={onClose}
        expanded={expanded}
        onToggleExpand={onToggleExpand}
        currentKey={currentKey}
        onSelectReader={onSelectReader}
      />
      <div className="rp-root">
        {/* The header spans the rail as well as the content — it identifies the
    whole panel, not just the page inside it. Panel chrome (close, expand,
    reader stepping) is in `ProfileCtrls`; the header keeps a close button for
    the phone breakpoint, where the rail is hidden. */}
        <ReaderHeader student={student} onClose={onClose} />
        <div className="rp-root-body">
          <LeftNav activeSection={activeSection} onNavigate={onNavigate} />
          <div className="rp-panel">
            <MobileSectionNav activeSection={activeSection} onNavigate={onNavigate} />
            <div key={`${currentKey}-${activeSection ?? 'overview'}`} className="rp-page-fade">
              {activeSection === null ? (
                <Overview student={student} onNavigate={onNavigate} />
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
                <ChallengesPage student={student} onNavigate={onNavigate} />
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

// ─── Embeddable profile panel ─────────────────────────────────────────────────
// Not embedded anywhere yet — the library equivalent of RIS doesn't exist in
// this repo — but kept so a host can drop the panel into its own side Modal the
// way RIS does with the student profile.
export function ReaderProfileView({ readerKey, onClose, expanded, onToggleExpand }) {
  const [activeSection, setActiveSection] = useState(null)
  // The pager steps readers inside the panel, so the open reader is local state
  // seeded from the host — which stays in charge of *opening* the panel.
  const [currentKey, setCurrentKey] = useState(readerKey)
  useEffect(() => setCurrentKey(readerKey), [readerKey])
  const student = READERS[currentKey] || READERS.mateo

  return (
    <div className={`rp-embed${expanded ? ' rp-embed--full' : ''}`} style={profileVars(student)}>
      <ProfileBody
        student={student}
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onClose={onClose}
        expanded={expanded}
        onToggleExpand={onToggleExpand}
        currentKey={currentKey}
        onSelectReader={setCurrentKey}
      />
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
// Kept in step with the `slideInRight` / `slideOutRight` timing in the CSS.
const SLIDE_MS = 260

export default function ReaderProfile() {
  const [activeSection, setActiveSection] = useState(null)
  const [profileMode, setProfileMode] = useState('closed')
  const [selectedReaderKey, setSelectedReaderKey] = useState(null)
  const [openAccount, setOpenAccount] = useState(null)
  const [closing, setClosing] = useState(false)

  const student = selectedReaderKey ? READERS[selectedReaderKey] : null

  // The class table opens a reader two ways, as the product does: the row is a
  // quick look (slide-in panel), the name is the profile page itself.
  const handleReaderClick = (key, mode = 'side') => {
    setSelectedReaderKey(key)
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
      setSelectedReaderKey(route.key)
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
    if (profileMode === 'closed' || !selectedReaderKey) writeHash(null)
    else writeHash(selectedReaderKey, activeSection, profileMode)
  }, [profileMode, selectedReaderKey, activeSection])

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
    <div className="rp-shell">
      {/* Admin bg */}
      <div className={`rp-shell-admin${profileMode === 'full' ? ' rp-shell-admin--hidden' : ''}`}>
        {/* Two levels sit behind the panel: search, then the account you
            picked from it. The reader profile opens on top of either. */}
        {openAccount ? (
          <AccountPage
            accountId={openAccount}
            onReaderClick={handleReaderClick}
            onBack={() => setOpenAccount(null)}
          />
        ) : (
          <FindAPerson
            onReaderClick={handleReaderClick}
            onOpenAccount={setOpenAccount}
            selectedKey={selectedReaderKey}
          />
        )}
      </div>

      {/* Dim overlay */}
      {profileMode === 'side' && (
        <div
          className={`rp-shell-overlay${closing ? ' rp-shell-overlay--closing' : ''}`}
          onClick={closeProfile}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        />
      )}

      {/* Profile panel */}
      {profileMode !== 'closed' && student && (
        <div
          className={`rp-profile-wrap${profileMode === 'full' ? ' rp-profile-wrap--full' : ''}${closing ? ' rp-profile-wrap--closing' : ''}`}
        >
          {/* Rail + panel are one sliding unit, so the controls travel with the
    panel edge on open, close and expand instead of sitting still. */}
          <div className="rp-profile-slider" style={profileVars(student)}>
            <ProfileBody
              student={student}
              activeSection={activeSection}
              onNavigate={setActiveSection}
              onClose={closeProfile}
              expanded={profileMode === 'full'}
              onToggleExpand={toggleExpand}
              currentKey={selectedReaderKey}
              onSelectReader={setSelectedReaderKey}
            />
          </div>
        </div>
      )}
    </div>
  )
}
