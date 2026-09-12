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
import {
  Select,
  Checkbox,
  CheckboxGroup,
  CheckboxGroupItem,
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
import { BarList } from '@components/BarList/BarList'
import { ChartCard } from '@components/Cards/Cards'
import { Table } from '@components/Table/Table'
import '@components/Table/Table.css'
import { BackBar } from '@components/BackBar/BackBar'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { Sidebar } from '@components/Sidebar/Sidebar'
import { RMI_ICONS } from '@components/RmiIcons/RmiIcons'
import { TrendChip } from '@components/TrendChip/TrendChip'
import { ToastStack, useToasts } from '@components/Toast/Toast'
import { CompleteToggle } from '@components/CompleteToggle/CompleteToggle'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { PlumpyIcon, PLUMPY_NAMES } from '@components/PlumpyIcon/PlumpyIcon'
import { BsIcon, FlagIcon } from '@components/BsIcons/BsIcons'
import { Pill } from '@components/Pill/Pill'
import { Icon } from '@components/Icon/Icon'
import { PartnerMark, PARTNER_BRANDS } from '@components/PartnerBrand/PartnerBrand'
import { Flyout } from '@components/Flyout/Flyout'
import { Modal, ModalClose } from '@components/Modal/Modal'
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
// the demo can open and fill. Most just close on Save — nothing is persisted,
// the same stance as the rest of the prototype's affordances — but a modal that
// passes `onSave` gets it run first, which is how the recommendation-filter
// editor writes its picks back.
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
        <div className="rp-act-modal">
          <ModalClose onClick={close} />
          <div className="rp-act-modal-head">
            <span className="rp-act-modal-title">{title}</span>
          </div>
          <div className="rp-form-body">{children}</div>
          <div className="rp-form-foot">
            {secondary && (
              <Button variant="secondary" onClick={close}>
                {secondary}
              </Button>
            )}
            {/* Save has to run `onSave` before closing. This copy had drifted
                from student-profile's, which does: it took the prop and then
                ignored it, so a modal that passed one saved nothing. */}
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
                size={14}
                stroke={2.4}
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
                size={14}
                stroke={2.4}
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
  // `Profile.offline_readers` — a reader with no login of their own (the app
  // spots them by a `qa_` username). Staff log for them, so their totals are
  // real but nothing on the log was self-reported.
  offline: {
    label: 'Offline',
    icon: 'user-off',
    tone: 'neutral',
    tip: 'Offline reader — no login of their own, so staff log their reading for them',
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

// The account creator belongs under the reader's name, not only in the search
// results you came from: a library reader is *on* an account, and which
// household holds the card is the first thing staff need about them. It's the
// one identity fact the school profile has no equivalent for. Elena is both a
// reader and the creator of her own account, so a reader who is the creator
// says so rather than naming themselves back at you.
function AccountCreatorLine({ student, onOpenAccount }) {
  const account = ACCOUNTS[student.accountId]
  if (!account) return null
  const isSelf = account.creator === student.name
  const label = isSelf ? 'Account creator' : `Account: ${account.creator}`
  const content = (
    <>
      <Icon name="user" size={13} stroke={2.1} />
      {label}
    </>
  )
  // No account surface behind an embedded panel, so there's nowhere to go —
  // the fact is still worth stating.
  if (!onOpenAccount) return <span className="rp-panel-acct">{content}</span>
  return (
    <Tooltip content={`Open ${account.creator}'s account`}>
      <button
        type="button"
        className="rp-panel-acct rp-panel-acct--link"
        onClick={() => onOpenAccount(student.accountId)}
      >
        {content}
      </button>
    </Tooltip>
  )
}

function ReaderHeader({ student, onClose, onOpenAccount }) {
  return (
    <div className="rp-panel-header">
      <div className="rp-panel-identity">
        {/* Was a per-reader hue so stepping between readers visibly changed
    reader; now the admin accent, so the whole panel reads as one themed
    surface. `avatarColor` is still on the data if that identity cue is
    wanted back — the reader avatars in the results list still use it. */}
        <Avatar initials={initialsOf(student.name)} color="var(--c-accent)" size="lg" />
        <div className="rp-panel-titles">
          <div className="rp-panel-name">{student.name}</div>
          {/* Status only. The grade is on every roster row and in the class
              header you came from — repeating it under the name spent a line
              on something already established. */}
          <div className="rp-panel-meta">
            <AccountCreatorLine student={student} onOpenAccount={onOpenAccount} />
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
  points: { bg: '#FEF9C3', text: '#A16207' },
  recofilters: { bg: '#F1F5F9', text: '#475569' },
  recommended: { bg: '#FFE4E6', text: '#9F1239' },
  wishlist: { bg: '#F5F3FF', text: '#6D28D9' },
}
const accentFor = (section) => SECTION_ACCENT[section ?? 'overview'] ?? SECTION_ACCENT.overview

// One flat rail — every destination is labelled and styled the same. Account is
// the library-only addition: a reader belongs to a login account that can hold
// several readers, so the account is a place you can go, not just a label.
const NAV_ITEMS = [
  { icon: 'user', section: null, label: 'Overview' },
  // What the reader actually did comes first, then the challenges that asked
  // for it and what those paid out — the same running order as the school
  // profile's rail, minus the sections a library doesn't have.
  { icon: 'reading', section: 'readinglog', label: 'Reading Log' },
  { icon: 'challenges', section: 'challenges', label: 'Challenges' },
  { icon: 'gift', section: 'rewards', label: 'Rewards' },
  { icon: 'ticket', section: 'drawings', label: 'Drawings' },
  // Then everything the reader has collected.
  { icon: 'medal', section: 'badges', label: 'Badges' },
  { icon: 'puzzle', section: 'activities', label: 'Activities' },
  { icon: 'star', section: 'reviews', label: 'Book Reviews' },
  { icon: 'points', section: 'points', label: 'Points' },
  // Library-only: what this reader wants to be recommended, and what they've
  // saved for later.
  { icon: 'filter', section: 'recofilters', label: 'Filters' },
  { icon: 'heart', section: 'recommended', label: 'Recommendations' },
  { icon: 'bookmark', section: 'wishlist', label: 'Wish List' },
]

// Every profile-coloured tint (control rail, nav active state, the Log button)
// derives from this one property in CSS via `color-mix`, so a reader needs a
// single authored hex rather than a hand-mixed scale. The Hero icon chips stay
// on `SECTION_ACCENT` — the section you're on still has its own colour.
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
              {/* Plumpy is duotone: inactive is currentColor, active is the
                  accent, and both layers tint together — so it needs no
                  hand-dimmed opacity the way a line icon did. */}
              <PlumpyIcon name={icon} size={20} />
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
  const at = Math.max(
    0,
    NAV_ITEMS.findIndex((n) => (n.section ?? 'overview') === (activeSection ?? 'overview')),
  )

  // Steppers either side of the select — a long menu to open every time you
  // want the next section, and the rail's own pager is gone on a phone. The
  // arrows walk the list in order; the select is for jumping.
  const step = (d) => {
    const next = NAV_ITEMS[at + d]
    if (next) onNavigate(next.section ?? null)
  }

  return (
    <div className="rp-mobile-nav">
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
        {NAV_ITEMS.map(({ section, label }) => (
          <option key={label} value={section ?? 'overview'}>
            {label}
          </option>
        ))}
      </Select>
      <RowAction
        icon="chevron-right"
        label="Next section"
        tooltip={false}
        disabled={at === NAV_ITEMS.length - 1}
        onClick={() => step(1)}
      />
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
      icon: 'fire',
      accent: STAT_TINTS.current,
      label: 'Current streak',
      value: ov.currentStreak,
      unit: days(ov.currentStreak),
      trend: { delta: mo.currentStreak, format: (n) => `${n} ${days(n)}` },
    },
    {
      key: 'books',
      section: 'readinglog',
      icon: 'book',
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
        {/* Plumpy where the pack has the glyph, a line icon otherwise — same
            fallback `RowAction` uses, so a name that isn't in the pack still
            draws rather than vanishing. Plumpy runs a rung bigger: it's a
            filled duotone shape, so it reads smaller than a stroked icon at
            the same box. */}
        {PLUMPY_NAMES.includes(icon) ? (
          <PlumpyIcon name={icon} size={18} />
        ) : (
          <Icon name={icon} size={16} />
        )}
      </span>
      <span className="rp-statrow-label">{label}</span>
      {children}
      {onOpen && (
        <Icon
          name="chevron-right"
          size={18}
          stroke={2.2}
          className="rp-statrow-go"
          aria-hidden="true"
        />
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
      <div className="rp-latest-head">
        <SectionHeading>Latest titles</SectionHeading>
        <button type="button" className="rp-latest-link" onClick={() => onNavigate('readinglog')}>
          Reading Log
          <Icon name="arrow-right" size={14} />
        </button>
      </div>
      {/* The pager sits over the rail it scrolls, not up in the header — the
          header is for what the block is and where it goes. */}
      <div className="rp-latest-body">
        {scrollable && (
          <>
            <button
              type="button"
              className="rp-heatmap-nav-btn rp-latest-arrow rp-latest-arrow--prev"
              onClick={() => page(-1)}
              disabled={!left}
              aria-label="Previous titles"
            >
              <Icon name="chevron-left" size={13} stroke={2.2} />
            </button>
            <button
              type="button"
              className="rp-heatmap-nav-btn rp-latest-arrow rp-latest-arrow--next"
              onClick={() => page(1)}
              disabled={!right}
              aria-label="More titles"
            >
              <Icon name="chevron-right" size={13} stroke={2.2} />
            </button>
          </>
        )}
        <div className="rp-latest-grid" ref={ref} onScroll={sync}>
          {titles
            .slice()
            .reverse()
            .map((t, i) => (
              // Covers are display only — the shelf is a summary, and the
              // Reading Log link in the header is the way through. Cover art
              // only: the title and author under each one turned a scannable
              // shelf into six stacked captions, and the art already says
              // which book it is (`title` carries it for anyone who needs it).
              <div key={i} className="rp-latest-item" title={`${t.title} — ${t.author}`}>
                <div className="rp-latest-cover">
                  <CoverImage isbn={t.isbn} title={t.title} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

function OverviewStats({ metrics, onOpen }) {
  const [showMore, setShowMore] = useState(false)
  const shown = metrics.filter((m) => !m.more || showMore)
  const hidden = metrics.filter((m) => m.more).length

  return (
    <div className="section-card rp-card rp-statlist">
      <div className="rp-statlist-head">
        <SectionHeading>At a glance</SectionHeading>
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
          {m.trend && <TrendDelta {...m.trend} />}
        </StatRow>
      ))}
      {hidden > 0 && (
        <button
          type="button"
          className="rp-showmore rp-showmore--incard"
          onClick={() => setShowMore((v) => !v)}
        >
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
        icon={<PlumpyIcon name="user" size={22} />}
        title="Overview"
        accent={SECTION_ACCENT.overview.text}
        accentBg={SECTION_ACCENT.overview.bg}
      />

      {/* Overview figures */}
      <OverviewStats metrics={metrics} onOpen={onNavigate} />

      {/* Latest titles — covers first, so the shelf reads at a glance */}
      <Card>
        <TitleShelf titles={student.recentTitles} onNavigate={onNavigate} />
      </Card>
    </div>
  )
}

// ─── Section detail wrapper ───────────────────────────────────────────────────
// ─── Trend chip ───────────────────────────────────────────────────────────────
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
      book: 95,
      page: 260,
      minute: 4210,
      day: 112,
      'standard-activity': 45,
      review: 20,
    },
    // `_customized_filters.html.haml` — the personalisation sets the reader
    // picked, each editable on its own screen.
    // Values are picked from `RECO_FILTERS`' own option lists — the app's real
    // vocabulary — so the edit modal opens with them already ticked.
    recoFilters: {
      backgrounds: ['Hispanic or Latino', 'Siblings'],
      genres: ['Fantasy & The Imagination', 'Adventure', 'Comedy & Humor'],
      interests: ['Sports & Recreation', 'Math, Science & Technology'],
      languages: ['English', 'Spanish'],
      readingLevels: [],
    },
    // `recommendedBooks` — what Beanstack has put in front of this reader, and
    // when. Display only in the app: no action on a row.
    recommendedBooks: [
      {
        isbn: '9780064471046',
        title: 'The Lion, the Witch and the Wardrobe',
        author: 'C. S. Lewis',
        date: 'May 04, 2026',
      },
      { isbn: '9780545790352', title: 'Ghosts', author: 'Raina Telgemeier', date: 'Apr 26, 2026' },
      { isbn: '9781338299151', title: 'Guts', author: 'Raina Telgemeier', date: 'Apr 12, 2026' },
      {
        isbn: '9780316228534',
        title: 'Wings of Fire: The Dragonet Prophecy',
        author: 'Tui T. Sutherland',
        date: 'Mar 30, 2026',
      },
    ],
    // `wishList` — titles the reader saved for later, each removable by staff.
    wishList: [
      { title: 'Amulet, Book One: The Stonekeeper', author: 'Kazu Kibuishi' },
      { title: 'New Kid', author: 'Jerry Craft' },
      { title: 'The Wild Robot', author: 'Peter Brown' },
    ],
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
      // A repeatable activity badge — points challenges only. Its activities
      // can be completed without limit, the badge can never be earned, and a
      // repeatable text box answer can't be edited once submitted.
      {
        name: 'Reading Streak Bonus',
        icon: 'fire',
        color: '#C849E5',
        repeatable: true,
        challenge: 'Summer Points 2025',
        activities: [
          {
            text: 'Log a day of reading outside — anywhere that is not a chair indoors.',
            type: 'Activity',
            points: 5,
            completions: 7,
          },
          {
            text: 'Tell us the best sentence you read today.',
            type: 'Text Box Challenge',
            points: 10,
            answer:
              'It is a truth universally acknowledged that a fish out of water makes a scene.',
            completions: 3,
          },
          {
            text: 'Ask a librarian for a recommendation, then enter the code they give you.',
            type: 'Activity Code',
            codes: ['ASK-A-LIBRARIAN'],
            points: 15,
            completions: 2,
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
        challenge: 'Benny the Bean Reading Challenge',
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
        challenge: 'Benny the Bean Reading Challenge',
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
        color: '#7C3AED',
      },
      {
        name: 'National Cookbook Month 2025',
        category: 'us',
        date: 'Oct 1, 2025',
        icon: 'apple',
        color: '#D97706',
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
        // A challenge badge belongs to the challenge that defined it — that's
        // what the Challenge filter above the list reads. A logging badge has
        // no challenge: the site awards it for the year's totals.
        challenge: 'Benny the Bean Reading Challenge',
        earned: true,
        top: '10',
        mid: 'REVIEWS',
        earnedNote: 'Earned for writing 10 reviews in Benny the Bean Reading Challenge',
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
      book: 60,
      page: 140,
      minute: 2380,
      day: 74,
      'standard-activity': 25,
      review: 5,
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
        color: '#7C3AED',
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
        challenge: 'Benny the Bean Reading Challenge',
        earned: false,
        top: '10',
        mid: 'REVIEWS',
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
    status: ['offline'],
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
      book: 20,
      page: 45,
      minute: 610,
      day: 19,
      'standard-activity': 10,
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
        color: '#7C3AED',
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
        challenge: 'Benny the Bean Reading Challenge',
        earned: false,
        top: '10',
        mid: 'REVIEWS',
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
    // Elena answers the prompts, but barely — the same low-effort pattern as the
    // rest of their logging.
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
// visible in one view and missing in the other reads as a data bug. Flags only:
// libraries don't run book talks, so there's no conversation to advertise.
function rlMarks(session) {
  return [
    session?.flags?.length && {
      key: 'flag',
      // The flag's own drawing, the same art the Book Talks table shows for it
      // — a session flagged for time reads as the time drawing in both places.
      flagType: session.flags[0].type ?? session.flags[0],
      flagFallback: 'negative',
      className: 'rp-rl-mark rp-rl-mark--neg',
      label: session.flags.length === 1 ? session.flags[0].label : `${session.flags.length} flags`,
    },
    session?.positiveFlags?.length && {
      key: 'pos',
      flagType: session.positiveFlags[0].type ?? session.positiveFlags[0],
      flagFallback: 'positive',
      className: 'rp-rl-mark rp-rl-mark--pos',
      label:
        session.positiveFlags.length === 1
          ? session.positiveFlags[0].label
          : `${session.positiveFlags.length} positive flags`,
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
          <img className="rp-rl-benny" src="/bs-prototypes/benny-happy.svg" alt="" />
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
      <span className="rp-rl-source" style={{ '--rp-mark-bg': PARTNER_BRANDS[source].accent }}>
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

function RLEntryCard({ entry, onOpen }) {
  // Completed and flagged come first: they're what a reviewer is scanning for,
  // and a session's provenance shouldn't outrank the state of it. Below them,
  // a partner-logged session gets its own green — reading that arrived from the
  // app the reader was reading in, rather than typed into Beanstack.
  const tone = entry.completed
    ? ' rp-rl-entry--completed'
    : entry.flagged
      ? ' rp-rl-entry--flagged'
      : entry.source
        ? ' rp-rl-entry--partner'
        : ''
  const session = RL_SESSIONS[entry.title]
  const marks = rlMarks(session)

  return (
    <div className={`rp-rl-entry${tone}`}>
      <div className="rp-rl-entry-top">
        {/* The title opens the session — its flags live there, not squeezed
            into the log row. */}
        <button type="button" className="rp-rl-entry-title" onClick={() => onOpen?.(entry)}>
          {entry.title}
        </button>
        {/* One cluster, one grid: where the session came from, what's on it,
            and what you can do to it. The partner mark used to sit alone in
            the card's foot, which read as a stray badge on a second row
            whenever the entry had no marks of its own. */}
        <RowActions className="rp-rl-entry-menu">
          <RLSource source={entry.source} />
          <RLMarks marks={marks} entry={entry} onOpen={onOpen} />
          <RLEntryMenu />
        </RowActions>
      </div>
      <div className="rp-rl-entry-author">{entry.author}</div>
      <div className="rp-rl-entry-foot">
        {entry.completed ? (
          <span className="rp-rl-completed">Completed</span>
        ) : (
          <div className="rp-rl-entry-amount">{entry.amount}</div>
        )}
        {/* Beside what was logged, not on the author line: both are readings of
            the session, and the author is the book's. */}
        {entry.lexile && <span className="rp-rl-entry-lexile">{entry.lexile}</span>}
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

function ReadingLogTable({ onOpen }) {
  return (
    <Table
      flush
      compact
      // `scrollX` is the guard, not the layout: this table is sized to fit, so
      // the scroller only earns its keep if a phone can't take even that.
      scrollX
      className="rp-rl-tbl"
      columns={[
        {
          key: 'date',
          label: 'Date',
          width: 74,
          render: (d) => <span className="rp-rl-tbl-dim">{d}</span>,
        },
        {
          key: 'title',
          label: 'Title',
          render: (_v, row) => (
            <div className="rp-rl-tbl-title">
              {/* Same target as the calendar card's title: one session, two
                  ways of finding it. */}
              <button type="button" className="rp-rl-tbl-name" onClick={() => onOpen?.(row.entry)}>
                {row.entry.title}
              </button>
              <span className="rp-rl-tbl-author">{row.entry.author}</span>
              {/* Their own row: chips mixed into the author line broke it in
                  awkward places and read as part of the name. */}
              <span className="rp-rl-tbl-tags">
                <span className="rp-rl-entry-lexile rp-rl-entry-unit">{row.unit}</span>
                {row.lexile && <span className="rp-rl-entry-lexile">{row.lexile}</span>}
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
            const session = RL_SESSIONS[row.entry.title]
            return (
              <div className="rp-rl-tbl-marks">
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
        icon={<PlumpyIcon name="reading" size={22} />}
        title="Reading Log"
        accent={SECTION_ACCENT.readinglog.text}
        accentBg={SECTION_ACCENT.readinglog.bg}
        action={
          <Button
            variant="secondary"
            size="msm"
            aria-label="Print log"
            title="Print log"
            icon={<Icon name="printer" size={16} stroke={2.1} />}
          >
            <span className="rp-btn-label">Print log</span>
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
                <Icon name="chevron-left" size={16} stroke={2.4} />
              </button>
            </Tooltip>
            <Tooltip content="Next month">
              {/* Nowhere forward to go: the log opens on its newest month. */}
              <button className="rp-heatmap-nav-btn" aria-label="Next month" disabled>
                <Icon name="chevron-right" size={16} stroke={2.4} />
              </button>
            </Tooltip>
          </div>
        </div>
        {view === 'table' ? (
          <ReadingLogTable onOpen={openEntry} />
        ) : (
          <div className="rp-rl-body">
            {RL_DATA.map((week, wi) => (
              <div key={wi} className="rp-rl-week">
                <div className="rp-rl-week-label">{week.weekLabel}</div>
                {week.days.map((day, di) => (
                  <div key={di} className="rp-rl-day">
                    <div className="rp-rl-day-col">
                      <div className="rp-rl-day-num">{day.date}</div>
                      <div className="rp-rl-day-name">{day.day}</div>
                      {day.streak > 0 && (
                        <span className="rp-rl-flame">
                          {day.streak}
                          <Icon name="flame-filled" size={15} />
                        </span>
                      )}
                    </div>
                    {day.entries.length === 0 ? (
                      <div className="rp-rl-empty-day">No logged sessions</div>
                    ) : (
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
            <div className="rp-latest-head">
              <SectionHeading>{ch.challenge}</SectionHeading>
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
// their own words. Covers come from the same Open Library lookup the Overview's
// title shelf uses.
function ReviewsPage({ student }) {
  const reviews = student.reviews ?? []
  return (
    <div className="rp-content">
      <Hero
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
            <div className="rp-review-item">
              <div className="rp-review-head">
                <div>
                  <div className="rp-review-title">{r.title}</div>
                  <div className="rp-title-author">{r.author}</div>
                </div>
                <span className="rp-tb-date">{r.date}</span>
              </div>
              <div className="rp-review-text">{r.text}</div>
            </div>
            {/* Card footer, full width past the cover column. Inert, like the Log
                and Edit Goal buttons — the demo wants the affordances to look
                right, not to wire up CRUD. */}
            {/* Same control as a table's row action — a record's actions shouldn't
                change size and hover just because the record is drawn as a card.
                `RowAction` carries its own tooltip. */}
            <RowActions className="rp-card-actions">
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
// The Hero's action slot. The label collapses on a phone — a 110px button beside
// a 150px title floor is what was pushing the whole action onto a second row —
// leaving the glyph, which is the whole message anyway.
function SearchToggle({ open, onToggle }) {
  const label = open ? 'Hide search' : 'Show search'
  return (
    <Button
      variant="secondary"
      size="msm"
      onClick={onToggle}
      aria-label={label}
      title={label}
      icon={<Icon name={open ? 'x' : 'search'} size={16} stroke={2.1} />}
    >
      <span className="rp-btn-label">{label}</span>
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
        <div className="rp-medal-modal">
          <ModalClose onClick={close} />
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
            <div key={a.name} className="rp-act-row">
              <AchievementMedal item={a} size={42} />
              <div className="rp-act-main">
                <div className="rp-act-name">{a.name}</div>
                <div className="rp-act-count">Earned on {a.date}</div>
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
    <div className="rp-content">
      <Hero
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
                <div key={b.name} className="rp-act-row">
                  <BadgeSeal badge={b} size={42} />
                  <div className="rp-act-main">
                    <div className="rp-act-name">{b.name}</div>
                    <div className="rp-act-count">{b.detail}</div>
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
    <span className="rp-act-type">
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
    <div className="rp-act-detail">
      {/* Type and points are what kind of thing this is; they read as a label
          above the activity rather than a trailer after it, which is where a
          long prompt kept pushing them anyway. */}
      <div className="rp-act-detail-head">
        <ActivityTypeTag type={type} />
        {points > 0 && <span className="rp-act-points">{points} pts</span>}
      </div>
      <span className="rp-act-modal-text">{activity.text}</span>

      {/* `activity_codes` is a list — one activity can accept several. Staff
          see them because the admin set them; there's nothing to enter here. */}
      {type === 'Activity Code' && codes?.length > 0 && (
        <div className="rp-act-codes">
          {codes.map((c) => (
            <code key={c} className="rp-act-code">
              {c}
            </code>
          ))}
        </div>
      )}

      {/* The reader's own words, from `text_box_challenge_answer`. Read-only by
          design: the product doesn't let staff write one. */}
      {type === 'Text Box Challenge' &&
        (answer ? (
          <blockquote className="rp-act-answer">{answer}</blockquote>
        ) : (
          <span className="rp-act-answer rp-act-answer--empty">No response yet</span>
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
    <div className="rp-content">
      <Hero
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
                <div key={b.name} className="rp-act-row">
                  <MedalDisc icon={b.icon} color={b.color} size={42} />
                  <div className="rp-act-main">
                    <div className="rp-act-name">
                      {b.name}
                      {b.repeatable && (
                        <Pill color="#c849e5" size="sm">
                          Repeatable
                        </Pill>
                      )}
                    </div>
                    <div className="rp-act-count">
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
          <div className="rp-act-modal">
            <ModalClose onClick={close} />
            <div className="rp-act-modal-head">
              <span className="rp-act-modal-title">{openBadge?.name}</span>
            </div>
            <div className="rp-act-modal-cols">
              <span>Activity</span>
              <span>Completed?</span>
            </div>
            <div className="rp-act-modal-body">
              {openBadge?.activities.map((a, j) => (
                <div key={a.text} className="rp-act-modal-row">
                  <ActivityDetail activity={a} />
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
          <span className="rp-tbl-name">{v}</span>
          <span className="rp-tbl-sub">{r.challenge}</span>
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
    <div className="rp-content">
      <Hero
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
          <span className="rp-tbl-name">{v}</span>
          <span className="rp-tbl-sub">Ends {r.endsOn}</span>
        </>
      ),
    },
    {
      key: 'entered',
      label: 'Tickets Entered',
      minWidth: 110,
      // The app words this "5 Tickets Entered", with its ticket mark beside it.
      render: (v) => (
        <span className="rp-ticket-count">
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
    <div className="rp-content">
      <BackBar label="Back to Challenges" onClick={onBack} />
      {/* No icon chip: this is a sub-view of Challenges reached from a row, not
          a destination in the rail, and the Back link above already says where
          you are. `Hero` renders without one. */}
      <Hero
        title={`Ticket Rewards for ${program.name}`}
        accent={SECTION_ACCENT.rewards.text}
        accentBg={SECTION_ACCENT.rewards.bg}
      />
      {/* The app says this as a bare line under the heading. Boxed here, with
          the ticket mark: it's the balance every drawing below spends from, so
          it reads as a wallet rather than as a caption. */}
      <div className="rp-draw-avail">
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
          <div className="rp-draw-modal">
            <ModalClose onClick={close} />
            {/* Same chrome as every other modal on the page: a bordered head
                holding the title, then a body. */}
            <div className="rp-act-modal-head">
              <span className="rp-act-modal-title">{open?.name}</span>
            </div>
            {stepping ? (
              <TicketStepper
                drawing={open}
                onCancel={() => setStepping(false)}
                onEnter={enterTickets}
              />
            ) : (
              <div className="rp-draw-body">
                <div className="rp-draw-meta">
                  <span className="rp-ticket-count">
                    <BsIcon set="actions" name="ticket" size={18} />
                    {open?.entered ?? 0} Tickets Entered
                  </span>
                  <span className="rp-draw-date">Ends on {open?.endsOn}</span>
                </div>
                <p className="rp-draw-text">{open?.description}</p>
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
    <div className="rp-draw-body">
      <span className="rp-draw-date">
        {left === 1 ? '1 Ticket Available' : `${left} Tickets Available`}
      </span>
      <div className="rp-draw-stepper">
        <NumberInput value={n} min={0} max={cap} onChange={setN} aria-label="Tickets to enter" />
      </div>
      <div className="rp-draw-actions">
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
      render: (v) => <span className="rp-tbl-name">{v}</span>,
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
          <span className="rp-none">—</span>
        ) : (
          <span className="rp-place">{ordinal(v)}</span>
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
    <div className="rp-content">
      <Hero
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
      <div className="rp-clog">
        {/* Screen-only chrome: it must not print. */}
        <div className="rp-clog-bar">
          <Button
            variant="secondary"
            size="sm"
            icon={<Icon name="chevron-left" size={14} />}
            onClick={onClose}
          >
            Back
          </Button>
          <span className="rp-clog-bar-title">Challenge log</span>
          <Button size="sm" icon={<Icon name="printer" size={15} />} onClick={() => window.print()}>
            Print
          </Button>
        </div>

        <div className="rp-clog-sheet">
          <div className="rp-clog-head">
            <div>
              <h1 className="rp-clog-title">{challenge.name}</h1>
              <div className="rp-clog-dates">{challenge.dates}</div>
            </div>
            <div className="rp-clog-benny">
              <img src="/bs-prototypes/benny.png" alt="" width={40} height={40} />
              <span>Beanstack</span>
            </div>
          </div>

          <div className="rp-clog-reader">
            {[
              ['Reader', student.name],
              ['Age', String(student.grade).replace(/^Age\s+/, '')],
              ['Started', challenge.startedOn],
              ['Enrolled', 'Yes'],
            ].map(([label, value]) => (
              <div key={label} className="rp-clog-field">
                <span className="rp-clog-field-label">{label}</span>
                <span className="rp-clog-field-value">{value}</span>
              </div>
            ))}
          </div>

          <div className="rp-clog-totals">
            {[
              ['Minutes read', minutes.toLocaleString()],
              ['Books finished', books],
              ['Days logged', days],
              ['Sessions', rows.length],
            ].map(([label, value]) => (
              <div key={label} className="rp-clog-total">
                <span className="rp-clog-total-num">{value}</span>
                <span className="rp-clog-total-label">{label}</span>
              </div>
            ))}
          </div>

          <table className="rp-clog-table">
            <thead>
              <tr>
                <th className="rp-clog-th rp-clog-th--date">Date</th>
                <th className="rp-clog-th">Title</th>
                <th className="rp-clog-th rp-clog-th--num">Logged</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="rp-clog-td rp-clog-td--date">{r.date}</td>
                  <td className="rp-clog-td">
                    <span className="rp-clog-book">{r.title}</span>
                    <span className="rp-clog-by">
                      {r.author}
                      {/* Named, not marked: a printed sheet has no tooltips. */}
                      {r.source && PARTNER_BRANDS[r.source]
                        ? ` · via ${PARTNER_BRANDS[r.source].name}`
                        : ''}
                    </span>
                  </td>
                  <td className="rp-clog-td rp-clog-td--num">
                    {r.completed ? 'Finished' : `${r.minutes} min`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="rp-clog-foot">
            <div className="rp-clog-sign">
              <span className="rp-clog-sign-line" />
              <span className="rp-clog-field-label">Parent or guardian signature</span>
            </div>
            <div className="rp-clog-sign">
              <span className="rp-clog-sign-line" />
              <span className="rp-clog-field-label">Date</span>
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
      {bannerSrc(c.banner) && <img className="rp-chal-banner" src={bannerSrc(c.banner)} alt="" />}
      <div className="rp-chal-cell">
        <span className="rp-tbl-name">{c.name}</span>
        <span className="rp-tbl-sub">{c.dates}</span>
        <ul className="rp-chal-totals">
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
      <RowActions className="rp-card-actions">
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
    <div className="rp-content">
      {logFor && (
        <ChallengeLogSheet
          open={!!logFor}
          onClose={() => setLogFor(null)}
          student={student}
          challenge={logFor}
        />
      )}
      <Hero
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
        // rather than `.rp-content` because layout containment would make that
        // pane the containing block for the page's `position: fixed`
        // ToastStack.
        <div className="rp-chal-cols">
          <div className="rp-chal-grid">{shown.map(renderCard)}</div>
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
    <div className="rp-content">
      <Hero
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
              // and at `.rp-tbl-name`'s 16px/800 every row read as a heading
              // and out-weighed the Total under them.
              { key: 'label', label: 'Point Type', minWidth: 200 },
              {
                key: 'total',
                label: 'Points',
                minWidth: 96,
                align: 'right',
                render: (v) => <span className="rp-pts-value">{v.toLocaleString()}</span>,
              },
            ]}
            rows={rows}
            getRowKey={(r) => r.type}
          />
          {/* Not in the app's table — but a column of subtotals with no total
              is a sum you have to do yourself, and the reader's point balance
              is the question the tab exists to answer. */}
          <div className="rp-pts-total">
            <span>Total</span>
            <span className="rp-pts-value">{total.toLocaleString()}</span>
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── Recommendation filters ───────────────────────────────────────────────────
// `_customized_filters.html.haml`: the five personalisation sets a reader picks
// during onboarding, each row a label, the reader's picks, and an Edit link to
// that set's own screen (`/profiles/:id/edit_genres`, and so on). The order is
// the partial's.
//
// `limit` is the app's own cap — `rpgenres_limit` / `rpinterests_limit` /
// `rpbackgrounds_limit` are all 3 in `profiles_controller`, and languages and
// reading levels have none. `title` is the edit screen's own heading, which for
// backgrounds is "Edit Character Backgrounds" rather than the row's label.
//
// Options are the app's real vocabulary, from the migrations that seeded them
// (`add_spanish_attributes_to_genre` / `_interest` / `_background_type`).
// Reading levels and languages are configured per site, so those two are a
// plausible set rather than a fixed list.
const RECO_FILTERS = [
  {
    key: 'backgrounds',
    label: 'Backgrounds',
    title: 'Edit Character Backgrounds',
    noun: 'character preferences',
    limit: 3,
    options: [
      'No Main Character',
      'More Than One Main Character',
      'People',
      'Animals',
      'Humanoids',
      'Female',
      'Male',
      'Transgender',
      'Siblings',
      'Twins',
      'Brothers',
      'Sisters',
      'Brother & Sister',
      'Mother & Child',
      'Father & Child',
      'Mother, Father, and Child',
      'Mother, Mother, and Child',
      'Father, Father, and Child',
      'Grandparent & Child',
      'Extended Family',
      'Adopted Children',
      'American Indian',
      'Asian or Asian-American',
      'Biracial or Multiracial',
      'Black or African-American',
      'Hispanic or Latino',
      'Middle-Eastern',
      'Pacific Islander',
      'White or European-American',
      'Buddhist',
      'Christian',
      'Hindu',
      'Jewish',
      'Muslim',
    ],
  },
  {
    key: 'genres',
    label: 'Genres',
    title: 'Edit Genres',
    noun: 'genres',
    limit: 3,
    options: [
      'Adventure',
      'Classics',
      'Comedy & Humor',
      'Early Learning',
      'Fables, Fairy Tales & Folklore',
      'Fantasy & The Imagination',
      'History & Biography',
      'Mystery & Suspense',
      'Nature & The Natural World',
      'Non-Fiction',
      'Poetry & Verse',
      'Sports',
    ],
  },
  {
    key: 'interests',
    label: 'Interests',
    title: 'Edit Interests',
    noun: 'interests',
    limit: 3,
    options: [
      'Ballerinas & Princesses',
      'Daring to be Different',
      'Diverse Main Characters',
      'Feelings & Friendship',
      'Math, Science & Technology',
      'Ninjas, Pirates & Warriors',
      'Not So Pink Girls',
      'Sports & Recreation',
      'The Arts',
      'Trains, Planes & Transportation',
      'Zany',
    ],
  },
  {
    key: 'languages',
    label: 'Languages',
    title: 'Edit Languages',
    noun: 'languages',
    options: ['English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Vietnamese', 'Portuguese'],
  },
  {
    key: 'readingLevels',
    label: 'Reading levels',
    title: 'Edit Reading Levels',
    noun: 'reading levels',
    options: ['Pre-K', 'Kindergarten', 'Grades 1–2', 'Grades 3–5', 'Grades 6–8', 'Grades 9–12'],
  },
]

// The app's edit screens are a pick-up-to-N grid of icon tiles with a "no
// preference" option and a limit notice. There's no icon art for the sets in
// this prototype, so the tiles are the shared checkbox group — the cap, the
// notice and the wording are the app's.
function EditFilterModal({ filter, picks, onClose, onSave }) {
  const [sel, setSel] = useState(picks ?? [])
  useEffect(() => setSel(picks ?? []), [picks, filter])
  if (!filter) return null

  const atLimit = filter.limit != null && sel.length >= filter.limit
  return (
    <ActionModal
      open
      onClose={onClose}
      title={filter.title}
      secondary="Cancel"
      onSave={() => onSave(filter.key, sel)}
    >
      {filter.limit != null && (
        <p className="rp-reco-limit">
          Please pick up to {filter.limit} {filter.noun}.
        </p>
      )}
      <CheckboxGroup value={sel} onChange={setSel} layout="column">
        {/* The app offers this on every set, and it's exclusive: picking it
            clears the rest. */}
        <Checkbox
          checked={sel.length === 0}
          onChange={(on) => on && setSel([])}
          className="rp-reco-nopref"
        >
          No preference
        </Checkbox>
        {filter.options.map((o) => (
          // Past the cap the app stops accepting new picks rather than swapping
          // one out, so the unchecked boxes go disabled.
          <CheckboxGroupItem key={o} value={o} disabled={atLimit && !sel.includes(o)}>
            {o}
          </CheckboxGroupItem>
        ))}
      </CheckboxGroup>
    </ActionModal>
  )
}

function RecoFiltersPage({ student }) {
  const [picks, setPicks] = useState(student.recoFilters ?? {})
  useEffect(() => setPicks(student.recoFilters ?? {}), [student])
  const [editing, setEditing] = useState(null)
  const { toasts, push, dismiss } = useToasts()

  function save(key, values) {
    setPicks((prev) => ({ ...prev, [key]: values }))
    setEditing(null)
    push({
      title: 'Filters updated',
      body: RECO_FILTERS.find((f) => f.key === key)?.label,
    })
  }

  return (
    <div className="rp-content">
      <Hero
        icon={<PlumpyIcon name="filter" size={22} />}
        title="Filters"
        accent={SECTION_ACCENT.recofilters.text}
        accentBg={SECTION_ACCENT.recofilters.bg}
      />
      <Card flush>
        <Table
          flush
          scrollX
          // One "Filter" header over a column of labels is a heading over
          // nothing — the rows say what they are.
          hideHeader
          columns={[
            {
              key: 'label',
              label: 'Filter',
              minWidth: 240,
              render: (v, r) => (
                <>
                  <span className="rp-tbl-name">{v}</span>
                  {/* An unset filter reads as "No preference", which is the
                      app's own word for it — the partial prints nothing, which
                      looks like a bug. */}
                  <span className="rp-tbl-sub">
                    {picks[r.key]?.length ? picks[r.key].join(', ') : 'No preference'}
                  </span>
                </>
              ),
            },
            {
              key: 'act',
              label: '',
              minWidth: 56,
              align: 'right',
              // The app's `Edit` text link, as the row action every other table
              // on the profile ends with.
              render: (_v, r) => (
                <RowAction
                  icon="pencil"
                  label={`Edit ${r.label.toLowerCase()}`}
                  onClick={() => setEditing(r)}
                />
              ),
            },
          ]}
          rows={RECO_FILTERS}
          getRowKey={(r) => r.key}
        />
      </Card>

      <EditFilterModal
        filter={editing}
        picks={editing ? picks[editing.key] : undefined}
        onClose={() => setEditing(null)}
        onSave={save}
      />

      {/* Mounted once per page — the stack is `position: fixed`. */}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

// ─── Recommended books ────────────────────────────────────────────────────────
// `_recommended_books.html.haml`: cover, title over author, and the date the
// recommendation was made. Paginated in the app at ten a page.
function RecommendedPage({ student }) {
  const books = student.recommendedBooks ?? []
  return (
    <div className="rp-content">
      <Hero
        icon={<PlumpyIcon name="heart" size={22} />}
        title="Recommendations"
        accent={SECTION_ACCENT.recommended.text}
        accentBg={SECTION_ACCENT.recommended.bg}
      />
      {books.length === 0 ? (
        <EmptyState
          variant="dashed"
          title="No recommendations yet"
          description="The reader hasn't received any book recommendations yet."
        />
      ) : (
        <Card flush>
          <Table
            flush
            scrollX
            pageSize={10}
            columns={[
              {
                key: 'title',
                label: 'Title / Author',
                minWidth: 220,
                render: (v, r) => (
                  <div className="rp-reco-cell">
                    <CoverImage isbn={r.isbn} title={v} />
                    <span>
                      <span className="rp-tbl-name">{v}</span>
                      <span className="rp-tbl-sub">{r.author}</span>
                    </span>
                  </div>
                ),
              },
              { key: 'date', label: 'Date Recommended', minWidth: 130 },
            ]}
            rows={books}
            getRowKey={(r) => r.isbn}
          />
        </Card>
      )}
    </div>
  )
}

// ─── Wish list ────────────────────────────────────────────────────────────────
// `_wish_list.html.haml`: titles the reader saved, each removable. The partial
// exists in the app but nothing navigates to it — there's no nav entry for
// `wishList` on the real page — so this is the tab that partial was written for.
function WishListPage({ student }) {
  const [items, setItems] = useState(student.wishList ?? [])
  const { toasts, push, dismiss } = useToasts()

  function remove(item) {
    setItems((prev) => prev.filter((i) => i !== item))
    push({ title: 'Removed from wish list', body: item.title, tone: 'info' })
  }

  return (
    <div className="rp-content">
      <Hero
        icon={<PlumpyIcon name="bookmark" size={22} />}
        title="Wish List"
        accent={SECTION_ACCENT.wishlist.text}
        accentBg={SECTION_ACCENT.wishlist.bg}
      />
      {items.length === 0 ? (
        <EmptyState
          variant="dashed"
          title="Nothing saved"
          description="There is nothing in this reader's wish list."
        />
      ) : (
        <Card flush>
          <Table
            flush
            scrollX
            columns={[
              {
                key: 'title',
                label: 'Title',
                minWidth: 220,
                render: (v, r) => (
                  <>
                    <span className="rp-tbl-name">{v}</span>
                    <span className="rp-tbl-sub">{r.author}</span>
                  </>
                ),
              },
              {
                key: 'act',
                label: '',
                minWidth: 56,
                align: 'right',
                // The app's `Remove` link, gated on `wish_list.can_destroy`.
                render: (_v, r) => (
                  <RowAction icon="trash" label="Remove" onClick={() => remove(r)} />
                ),
              },
            ]}
            rows={items}
            getRowKey={(r) => r.title}
          />
        </Card>
      )}
      {/* Mounted once per page — the stack is `position: fixed`. */}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

function PlaceholderPage({ pageKey }) {
  const item = NAV_ITEMS.find((n) => !n.divider && n.section === pageKey)
  return (
    <div className="rp-content">
      <Hero
        icon={<PlumpyIcon name={item?.icon || 'user'} size={22} />}
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
        mainRailActive="people"
        nav={PEOPLE_NAV}
        active="find"
      />

      <div className="rp-adm-main">
        <div className="rp-adm-main-body">
          <BackBar label="Back to Find a Person" onClick={onBack} />
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
// Titles and descriptions are the real strings from bs-product
// `new_admin/shared/menu/_people_menu.html.erb`.
const PEOPLE_NAV = [
  {
    id: 'find',
    label: 'Find a Person',
    icon: 'person',
    desc: 'Search for a reader or account creator.',
  },
  {
    id: 'add',
    label: 'Add an Account Creator and Reader',
    icon: 'demographics',
    desc: 'Create a new account.',
  },
  { id: 'messages', label: 'Contact Messages', icon: 'flag', desc: 'View contact messages.' },
  {
    id: 'merges',
    label: 'Account Merges',
    icon: 'overview',
    desc: 'Review queued, completed, and failed account merges.',
  },
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

function FindAPerson({ onReaderClick, onOpenAccount }) {
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
        mainRailActive="people"
        nav={PEOPLE_NAV}
        active="find"
      />

      <div className="rp-adm-main">
        <div className="rp-adm-main-body">
          <PageHeader
            title="Find a Person"
            subtitle="Search fields must contain at least two characters."
          />

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
                            className="tbl-row tbl-row--clickable"
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
                            <td className="tbl-td row-actions">
                              <Flyout
                                placement="bottom-end"
                                trigger={({ toggle }) => (
                                  <RowAction
                                    icon="dots"
                                    label="Actions"
                                    tooltip={false}
                                    onClick={(ev) => {
                                      ev.stopPropagation()
                                      toggle()
                                    }}
                                  />
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
  const icon = float ? { size: 18, stroke: 2.2 } : { size: 17, stroke: 2.2 }

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
            <Icon name="x" size={18} stroke={2.2} />
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
            <Icon name={expanded ? 'minimize' : 'maximize'} size={18} stroke={2.1} />
          </button>
        </Tooltip>
        <Tooltip content={copied ? 'Link copied' : 'Copy link to this view'} placement="right">
          <button
            type="button"
            className={`rp-ctrl-btn${copied ? ' rp-ctrl-btn--done' : ''}`}
            onClick={copyLink}
            aria-label={copied ? 'Link copied' : 'Copy link to this view'}
          >
            <Icon name={copied ? 'check' : 'link'} size={18} stroke={2.1} />
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
  onOpenAccount,
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
        <ReaderHeader student={student} onClose={onClose} onOpenAccount={onOpenAccount} />
        <div className="rp-root-body">
          <LeftNav activeSection={activeSection} onNavigate={onNavigate} />
          <div className="rp-panel">
            <MobileSectionNav activeSection={activeSection} onNavigate={onNavigate} />
            <div key={`${currentKey}-${activeSection ?? 'overview'}`} className="rp-page-fade">
              {activeSection === null ? (
                <Overview student={student} onNavigate={onNavigate} />
              ) : activeSection === 'readinglog' ? (
                <ReadingLogPage reader={student} />
              ) : activeSection === 'points' ? (
                <PointsPage student={student} />
              ) : activeSection === 'recofilters' ? (
                <RecoFiltersPage student={student} />
              ) : activeSection === 'recommended' ? (
                <RecommendedPage student={student} />
              ) : activeSection === 'wishlist' ? (
                <WishListPage student={student} key={student.name} />
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
    <div className={`rp-embed${expanded ? ' rp-embed--full' : ''}`}>
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

  // The account sits a level *above* the reader, so going to it closes the
  // panel rather than opening something inside it.
  const openAccountFor = (accountId) => {
    setOpenAccount(accountId)
    closeProfile()
  }

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
          <FindAPerson onReaderClick={handleReaderClick} onOpenAccount={setOpenAccount} />
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
          <div className="rp-profile-slider">
            <ProfileBody
              student={student}
              activeSection={activeSection}
              onNavigate={setActiveSection}
              onClose={closeProfile}
              expanded={profileMode === 'full'}
              onToggleExpand={toggleExpand}
              currentKey={selectedReaderKey}
              onSelectReader={setSelectedReaderKey}
              onOpenAccount={openAccountFor}
            />
          </div>
        </div>
      )}
    </div>
  )
}
