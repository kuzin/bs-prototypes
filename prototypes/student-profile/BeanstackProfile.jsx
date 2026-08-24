import { useState, cloneElement } from 'react'
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
import { Select } from '@components/Form/Form'
import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import '@components/Form/Form.css'
import { Avatar } from '@components/Avatar/Avatar'
import { IconButton, EmptyState, Divider } from '@components/Primitives/Primitives'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { BarList } from '@components/BarList/BarList'
import { StatCard, CardNote, ChartCard } from '@components/Cards/Cards'
import { Table } from '@components/Table/Table'
import '@components/Table/Table.css'
import { BackBar } from '@components/BackBar/BackBar'
import { Sidebar } from '@components/Sidebar/Sidebar'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import { RMI_ICONS } from '@components/RmiIcons/RmiIcons'
import { Icon } from '@components/Icon/Icon'
import { Flyout } from '@components/Flyout/Flyout'
import { Tabs } from '@components/Tabs/Tabs'
import { Hero } from '@components/Hero/Hero'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { ChartLegend } from '@components/charts/charts'
import { SessionModal } from '../sfr/components/SessionModal'
import { TALK_KINDS } from '../btwb/data'
import { SESSIONS as SFR_SESSIONS } from '../sfr/data'

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
            onClick={onClose}
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
function StudentActions({ onClose }) {
  const dotsItems = [
    { label: 'Add a Review' },
    { label: 'Add Notes' },
    { divider: true },
    { label: 'Verify Student', icon: '✅', color: '#1D4ED8' },
    { label: 'Suspend Student', icon: '🚫', danger: true },
  ]
  const logItems = [{ label: 'Log Reading' }, { label: 'Log Activities' }]

  return (
    <div className="bp-student-actions">
      <Flyout
        placement="bottom-end"
        trigger={({ toggle }) => (
          <IconButton variant="ghost" size="md" aria-label="More options" onClick={toggle}>
            <Icon name="dots-vertical" size={16} aria-hidden="true" />
          </IconButton>
        )}
      >
        {({ close }) => <DropdownMenu items={dotsItems} onClose={close} />}
      </Flyout>
      <Flyout
        placement="bottom-end"
        trigger={({ toggle }) => (
          <Button
            variant="primary"
            iconRight={
              <Icon name="chevron-down" size={11} stroke={2.5} style={{ flexShrink: 0 }} />
            }
            onClick={toggle}
          >
            Log
          </Button>
        )}
      >
        {({ close }) => <DropdownMenu items={logItems} onClose={close} />}
      </Flyout>
      {onClose && (
        <button className="bp-header-close" onClick={onClose} aria-label="Close profile">
          <Icon name="x" size={13} />
        </button>
      )}
    </div>
  )
}

// ─── Persistent student header ────────────────────────────────────────────────
function StudentHeader({ student, onClose }) {
  return (
    <div className="bp-panel-header">
      <div className="bp-panel-identity">
        <Avatar
          initials={student.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)}
          color="#1D4ED8"
          size="lg"
          shape="square"
        />
        <div>
          <div className="bp-panel-name">{student.name}</div>
          <div className="bp-panel-meta">{student.grade}</div>
        </div>
      </div>
      <div className="bp-header-right">
        <StudentActions onClose={onClose} />
      </div>
    </div>
  )
}

// ─── Left nav ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: 'ti-user', section: null, label: 'Overview' },
  { icon: 'ti-flame', section: 'motivation', label: LABEL.motivation },
  { icon: 'ti-shield-check', section: 'integrity', label: LABEL.integrity },
  { icon: 'ti-calendar-stats', section: 'habits', label: LABEL.habits },
  { icon: 'ti-book-2', section: 'skills', label: LABEL.skills },
  { divider: true },
  { icon: 'ti-reading-log', section: 'readinglog', label: 'Reading Log', compact: true },
  { icon: 'ti-trophy', section: 'challenges', label: 'Challenges', compact: true },
  { icon: 'ti-gift', section: 'rewards', label: 'Rewards', compact: true },
  { icon: 'ti-pencil', section: 'drawings', label: 'Drawings', compact: true },
  { icon: 'ti-puzzle', section: 'activities', label: 'Activities', compact: true },
  { icon: 'ti-badge', section: 'badges', label: 'Badges', compact: true },
  { icon: 'ti-certificate', section: 'achievements', label: 'Achievements', compact: true },
  { icon: 'ti-rating', section: 'reviews', label: 'Reviews', compact: true },
  { icon: 'ti-paragraph', section: 'textchallenges', label: 'Text Box', compact: true },
]
const ANALYSIS_SECTIONS = new Set(['motivation', 'integrity', 'habits', 'skills'])

function LeftNav({ activeSection, onNavigate }) {
  function renderItem(item, idx) {
    if (item.divider) return <Divider key={`divider-${idx}`} />
    const { icon, section, label, compact } = item
    const active = activeSection === section
    const pal = section ? C[section] : null
    const activeBg = pal ? pal.bg : '#E6F1FF'
    const activeColor = pal ? pal.text : '#1A6DD5'
    return (
      <div
        key={label}
        className={`bp-nav-item${active ? ' bp-nav-item--active' : ''}${compact ? ' bp-nav-item--compact' : ''}`}
        style={active ? { '--nav-active-bg': activeBg, '--nav-active-color': activeColor } : {}}
        onClick={() => onNavigate(section)}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate(section)}
        role="button"
        tabIndex={0}
        title={label}
        aria-label={label}
      >
        <Ic name={icon} size={compact ? 18 : 20} style={{ opacity: active ? 1 : 0.4 }} />
        {!compact && <span className="bp-nav-label">{label}</span>}
      </div>
    )
  }

  const overviewItem = NAV_ITEMS[0]
  const subItems = NAV_ITEMS.slice(1, 5) // the four analysis sections
  const restItems = NAV_ITEMS.slice(5)

  return (
    <nav className="bp-nav">
      {/* Overview stands on its own — it summarises the analysis sections rather
          than being one of them, so it sits outside the grouped rail below. */}
      <div className="bp-nav-overview">{renderItem(overviewItem, 0)}</div>
      <div className="bp-nav-subgroup">{subItems.map((item, i) => renderItem(item, i + 1))}</div>
      {restItems.map((item, i) => renderItem(item, i + 5))}
    </nav>
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

// Overview tiles are named for the figure they show, which is not the same as the
// section they open — the rail and page headings keep `LABEL` (Motivation Index,
// Book Talks, Goals, Lexile).
const OVERVIEW_TILE_LABEL = {
  motivation: 'Top Motivation Factors',
  integrity: 'Recent Flags',
  habits: 'Daily Goals',
  skills: 'Average Lexile',
}

// Tints for the Overview's habit stats. Deliberately outside the four section
// palettes in `C` so these don't read as belonging to one of the sections:
// gold for streaks (matching the gold goal stars), teal for the brand's own
// accent, slate for elapsed time.
const STAT_TINTS = {
  current: { bg: '#FEF3C7', text: '#92400E' },
  longest: { bg: '#DFF4F7', text: '#0B6B78' },
  minutes: { bg: '#EEF2F7', text: '#334155' },
}

// One tile shape for everything on the Overview — the four section tiles and the
// habits stats below them — so the page reads as a single grid, not two systems.
function OverviewTile({ label, accent, onOpen, children }) {
  return (
    <div
      className="bp-tile"
      style={{ '--tile-bg': accent.bg, '--tile-text': accent.text }}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      role="button"
      tabIndex={0}
    >
      <div className="bp-tile-head">
        <div className="bp-tile-label">{label}</div>
        {/* Every tile opens its section — the arrow says so without needing a hover */}
        <Icon name="arrow-right" size={15} className="bp-tile-go" aria-hidden="true" />
      </div>
      <div className="bp-tile-body">{children}</div>
    </div>
  )
}

function Overview({ student, onNavigate }) {
  const [range, setRange] = useState('year')
  const ov = student.overview[range]
  const rangeLabel = range === 'year' ? 'this school year' : 'all time'

  return (
    <div className="bp-content">
      <Hero
        icon={<Ic name="ti-user" />}
        title="Overview"
        accent="#64748B"
        accentBg="#F1F5F9"
        action={
          <Tabs
            variant="pill"
            size="sm"
            ariaLabel="Overview time range"
            active={range}
            onChange={setRange}
            items={OVERVIEW_RANGES}
          />
        }
      />

      {/* Benny Says — the summary leads the page */}
      <Card>
        <SectionHeading>Benny Says...</SectionHeading>
        <BennyBubble timestamp={student.lastRun}>{student.bennySummary}</BennyBubble>
      </Card>

      {/* Section tiles — every figure here is scoped to the selected range */}
      <div className="bp-tiles">
        {Object.entries(student.sections).map(([key]) => {
          const c = C[key]
          const open = () => onNavigate(key)

          if (key === 'motivation') {
            return (
              <OverviewTile key={key} label={OVERVIEW_TILE_LABEL[key]} accent={c} onOpen={open}>
                {ov.motivators ? (
                  <div className="bp-tile-motivators">
                    {ov.motivators.map((name) => {
                      const iconKey = name === 'Social Connection' ? 'social' : name.toLowerCase()
                      return (
                        <div key={name} className="bp-tile-motivator-row">
                          <span className="bp-tile-motivator-icon">
                            {cloneElement(RMI_ICONS[iconKey], { width: 14, height: 14 })}
                          </span>
                          {name}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bp-tile-empty">⚠ No clear motivator found</div>
                )}
              </OverviewTile>
            )
          }

          if (key === 'integrity') {
            return (
              <OverviewTile key={key} label={OVERVIEW_TILE_LABEL[key]} accent={c} onOpen={open}>
                <div className="bp-tile-stat">
                  {ov.flags}
                  <span className="bp-tile-unit"> {ov.flags === 1 ? 'Flag' : 'Flags'}</span>
                </div>
              </OverviewTile>
            )
          }

          if (key === 'habits') {
            return (
              <OverviewTile key={key} label={OVERVIEW_TILE_LABEL[key]} accent={c} onOpen={open}>
                {ov.daysRead > 0 ? (
                  <div>
                    <div className="bp-tile-stat">
                      {ov.daysRead}
                      <span className="bp-tile-unit"> of {ov.daysPossible} days</span>
                    </div>
                    <div className="bp-tile-sub">
                      {Math.round((ov.daysRead / ov.daysPossible) * 100)}% of school days
                    </div>
                  </div>
                ) : (
                  <div className="bp-tile-empty">No reading logged</div>
                )}
              </OverviewTile>
            )
          }

          const up = ov.lexileDelta >= 0
          return (
            <OverviewTile key={key} label={OVERVIEW_TILE_LABEL[key]} accent={c} onOpen={open}>
              <div>
                <div className="bp-tile-stat">{ov.lexile}L</div>
                <div className="bp-tile-sub">
                  {up ? '↑' : '↓'}
                  {Math.abs(ov.lexileDelta)}L {rangeLabel}
                </div>
              </div>
            </OverviewTile>
          )
        })}
      </div>

      {/* Streaks + minutes — same tile treatment, all of it Goals and Streaks data.
          Current streak is an as-of-today figure, so only the longest moves with the range. */}
      <div className="bp-tiles bp-tiles--stats">
        <OverviewTile
          label="Current streak"
          accent={STAT_TINTS.current}
          onOpen={() => onNavigate('habits')}
        >
          <div className="bp-tile-stat">
            {ov.currentStreak}
            <span className="bp-tile-unit"> {ov.currentStreak === 1 ? 'day' : 'days'}</span>
          </div>
        </OverviewTile>
        <OverviewTile
          label="Longest streak"
          accent={STAT_TINTS.longest}
          onOpen={() => onNavigate('habits')}
        >
          <div>
            <div className="bp-tile-stat">
              {ov.longestStreak}
              <span className="bp-tile-unit"> {ov.longestStreak === 1 ? 'day' : 'days'}</span>
            </div>
            <div className="bp-tile-sub">{rangeLabel}</div>
          </div>
        </OverviewTile>
        <OverviewTile
          label="Total Minutes Read"
          accent={STAT_TINTS.minutes}
          onOpen={() => onNavigate('habits')}
        >
          <div>
            <div className="bp-tile-stat">
              {ov.minutes.toLocaleString()}
              <span className="bp-tile-unit"> min</span>
            </div>
            <div className="bp-tile-sub">{rangeLabel}</div>
          </div>
        </OverviewTile>
      </div>

      {/* Latest titles — covers first, so the shelf reads at a glance */}
      <Card>
        <div className="bp-latest-head">
          <div>
            <SectionHeading>Latest titles</SectionHeading>
            <div className="bp-latest-meta">
              {ov.booksCompleted} books finished {rangeLabel}
            </div>
          </div>
          <button type="button" className="bp-latest-link" onClick={() => onNavigate('readinglog')}>
            Reading Log
            <Icon name="arrow-right" size={14} />
          </button>
        </div>
        <div className="bp-latest-grid">
          {student.sections.skills.titles
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
      </Card>

      {/* Recommended Actions */}
      <Card flush>
        <div className="bp-actions-title">Recommended Actions</div>
        {student.recommendedActions.map((action, i) => (
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
function SectionDetail({ student, sectionKey }) {
  const sec = student.sections[sectionKey]
  const c = C[sectionKey]
  const firstName = student.name.split(' ')[0]
  return (
    <div className="bp-content">
      <Hero icon={<Ic name={c.icon} />} title={LABEL[sectionKey]} accent={c.bar} accentBg={c.bg} />
      {sectionKey === 'motivation' && <MotivationDetail sec={sec} c={c} />}
      {sectionKey === 'integrity' && <IntegrityDetail sec={sec} c={c} />}
      {sectionKey === 'habits' && <HabitsDetail sec={sec} c={c} />}
      {sectionKey === 'skills' && <SkillsDetail sec={sec} c={c} firstName={firstName} />}
      {sectionKey === 'motivation' && (
        <Card>
          <ActionFooter actions={sec.actions} />
        </Card>
      )}
    </div>
  )
}

// ─── Motivation detail ────────────────────────────────────────────────────────
function MotivationDetail({ sec, c }) {
  const [periodIdx, setPeriodIdx] = useState(0)
  const rmi = sec.rmiHistory[periodIdx]

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
          />
          <SplitDonutChart
            intrinsicVal={rmi.intrinsicAvg}
            extrinsicVal={rmi.extrinsicAvg}
            max={rmi.motivationMax}
            label="Overall"
            intrinsicColor={c.bar}
          />
          <DonutChart
            value={rmi.extrinsicAvg}
            max={rmi.extrinsicMax}
            label="Extrinsic"
            color={EXTRINSIC_COLOR}
          />
        </div>
      </Card>

      <Card>
        <SectionHeading>Benny Says...</SectionHeading>
        <BennyBubble>{rmi.bennySummary}</BennyBubble>
      </Card>

      <Card>
        <SectionHeading>Recommended Reading Goal</SectionHeading>
        <div className="bp-rmi-goal-row">
          <span className="bp-rmi-goal-num">{rmi.readingGoalMinutes}</span>
          <span className="bp-rmi-goal-unit"> min/day</span>
        </div>
      </Card>

      <Card>
        <SectionHeading>Motivator Rankings</SectionHeading>
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
// colors here can't drift from it.
const TALK_ORDER = ['engagement', 'comprehension', 'integrity']

// The one-line read differs per type: engagement measures how it landed,
// comprehension how well it was understood, integrity whether the log holds up.
function talkRead(kindId, t) {
  if (!t.total) return 'No talks yet'
  if (kindId === 'engagement') {
    const parts = [
      t.positive && `${t.positive} positive`,
      t.mixed && `${t.mixed} mixed`,
      t.disengaged && `${t.disengaged} disengaged`,
    ].filter(Boolean)
    return parts.join(' · ')
  }
  if (kindId === 'comprehension') {
    const parts = [
      t.strong && `${t.strong} showed strong understanding`,
      t.developing && `${t.developing} still developing`,
    ].filter(Boolean)
    return parts.join(' · ')
  }
  return t.concerns === 1 ? '1 raised a concern' : `${t.concerns} raised a concern`
}

function TalkKindRow({ kind, talk }) {
  return (
    <div className="bp-talk-kind" style={{ '--kind-color': kind.color, '--kind-tint': kind.tint }}>
      <span className="bp-talk-kind-icon">
        <Icon name={kind.icon} size={17} />
      </span>
      <div className="bp-talk-kind-main">
        <div className="bp-talk-kind-top">
          <span className="bp-talk-kind-label">{kind.label}</span>
          {talk.unfinished > 0 && (
            <Pill color="#B45309" size="sm">
              {talk.unfinished} unfinished
            </Pill>
          )}
        </div>
        <div className="bp-talk-kind-read">{talkRead(kind.id, talk)}</div>
      </div>
      <div className="bp-talk-kind-count">{talk.total}</div>
    </div>
  )
}

// ─── Integrity detail ─────────────────────────────────────────────────────────
const SESSION_FLAGS = {
  'book-swap': { icon: 'ti-swap', label: 'Book transfer', color: '#D97706' },
  'time-warning': { icon: 'ti-clock', label: 'Time concern', color: '#6B7280' },
  'btwb-incomplete': { icon: 'ti-signature', label: 'BTWB not completed', color: '#059669' },
  'missing-details': { icon: 'ti-list', label: 'Missing details', color: '#DC2626' },
  'over-limit': { icon: 'ti-alert-triangle', label: 'Logged over limit', color: '#D97706' },
}

function SessionFlag({ type }) {
  const cfg = SESSION_FLAGS[type]
  if (!cfg) return null
  return (
    <span className="bp-session-flag" title={cfg.label} style={{ '--flag-color': cfg.color }}>
      <Ic name={cfg.icon} size={15} />
    </span>
  )
}

function IntegrityDetail({ sec }) {
  const [openSession, setOpenSession] = useState(null)
  const [sessions, setSessions] = useState(SFR_SESSIONS)

  function openRow(rowIdx) {
    setOpenSession(sessions[rowIdx % sessions.length])
  }

  function handleUpdateSession(updated) {
    setSessions(sessions.map((s) => (s.id === updated.id ? updated : s)))
    setOpenSession(updated)
  }

  return (
    <>
      <Card>
        <SectionHeading>Book talks</SectionHeading>
        <div className="bp-talk-kinds">
          {TALK_ORDER.map((id) => (
            <TalkKindRow key={id} kind={TALK_KINDS[id]} talk={sec.talks[id]} />
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeading>Session integrity</SectionHeading>
        <div className="bp-flagged-summary">
          <span className="bp-flagged-label">Flagged sessions</span>
          <div className="bp-flagged-count-group">
            <span className="bp-flagged-count">{sec.flaggedSessions}</span>
          </div>
        </div>
        {sec.unfinishedConversations > 0 && (
          <div className="bp-flagged-summary">
            <span className="bp-flagged-label">Unfinished book talks</span>
            <div className="bp-flagged-count-group">
              <span className="bp-flagged-count">{sec.unfinishedConversations}</span>
            </div>
          </div>
        )}
      </Card>

      <Card flush>
        <div className="bp-titles-header">
          <span className="bp-titles-header-label">Flagged sessions</span>
        </div>
        <Table
          flush
          compact
          columns={[
            { key: 'date', label: 'Date', width: 96 },
            { key: 'title', label: 'Title' },
            {
              key: 'flags',
              label: 'Flags',
              align: 'right',
              render: (flags) => (
                <span className="bp-session-flags">
                  {flags.map((f) => (
                    <SessionFlag key={f} type={f} />
                  ))}
                </span>
              ),
            },
          ]}
          rows={sec.sessions}
          getRowKey={(r, i) => i}
          onRowClick={(row) => openRow(sec.sessions.indexOf(row))}
        />
      </Card>

      <SessionModal
        session={openSession}
        allSessions={sessions}
        onClose={() => setOpenSession(null)}
        onUpdateSession={handleUpdateSession}
        onSelectSession={setOpenSession}
      />
    </>
  )
}

// ─── Habits detail ────────────────────────────────────────────────────────────
function HabitsDetail({ sec, c }) {
  const [weekIdx, setWeekIdx] = useState(0)
  const week = sec.weeks[weekIdx]

  const goal = sec.dailyGoalMinutes

  // Derive today's minutes from the current week (last non-null day)
  const currentWeek = sec.weeks.find((w) => w.current)
  const todayMins = currentWeek
    ? ([...currentWeek.days].reverse().find((d) => d.minutes !== null)?.minutes ?? 0)
    : 0

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
        <div className="bp-goal-ring-header">
          <GoalRing minutes={todayMins} goal={goal} color={c.bar} />
          <div className="bp-goal-ring-info">
            <div className="bp-goal-title">{goal} minutes a day</div>
            <div className="bp-goal-ring-meta">
              <span className="bp-goal-ring-num">{todayMins} min</span>
              <span className="bp-goal-ring-dot">·</span>
              <span>logged today</span>
            </div>
          </div>
          <Button variant="secondary" size="sm" icon={<Icon name="pencil" size={14} />}>
            Edit Goal
          </Button>
        </div>
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
        <GoalTracker week={week} goalMinutes={goal} />
      </Card>

      {/* Consistency — days read and both streak figures in one place, so the
          longest streak isn't restated as a separate "personal best" line. */}
      <Card>
        <SectionHeading>Consistency</SectionHeading>
        <div className="bp-streak-hero">
          <div className="bp-streak-hero-left">
            <div>
              <div className="bp-streak-hero-num">
                {sec.daysRead30}
                <span className="bp-streak-hero-unit"> of last 30 days</span>
              </div>
              <div className="bp-streak-hero-sublabel">
                {hasRecentReading
                  ? `Logged on ${Math.round((sec.daysRead30 / 30) * 100)}% of days`
                  : 'No reading logged'}
              </div>
            </div>
          </div>
          <div className="bp-streak-hero-right">
            {hasRecentReading ? (
              <ProgressBar value={sec.daysRead30} max={30} color={c.bar} size="sm" />
            ) : (
              <CardNote tone="accent">
                <Ic name="ti-alert-triangle" size={14} /> Worth checking in
              </CardNote>
            )}
          </div>
        </div>
        <div className="bp-streaks-row">
          <StatCard
            value={sec.currentStreak}
            unit={sec.currentStreak === 1 ? 'day' : 'days'}
            label="Current streak"
            color={c.bar}
          />
          <StatCard
            value={sec.personalBest}
            unit={sec.personalBest === 1 ? 'day' : 'days'}
            label="Longest streak"
            color={c.bar}
          />
        </div>
      </Card>

      {/* Habit patterns */}
      <Card>
        <SectionHeading>Reading patterns</SectionHeading>
        <BarList
          showBar={false}
          items={[
            {
              label: 'Avg session length',
              valueLabel: hasRecentReading ? `${sec.avgSessionMins} min` : EMPTY,
              subValue: hasRecentReading ? 'per sitting' : 'no sessions logged',
            },
            {
              label: 'Days read this month',
              valueLabel: `${sec.daysReadThisMonth} of ${sec.daysInMonth}`,
              subValue: `${Math.round((sec.daysReadThisMonth / sec.daysInMonth) * 100)}% consistency`,
            },
            {
              label: 'Longest gap',
              valueLabel: `${sec.longestGap} ${sec.longestGap === 1 ? 'day' : 'days'}`,
              subValue: 'without reading',
            },
            {
              label: 'Best reading day',
              valueLabel: hasMonthReading ? sec.topReadingDay : EMPTY,
              subValue: hasMonthReading ? 'most consistent' : 'not enough data',
            },
          ]}
        />
      </Card>

      {/* Heatmap */}
      <ChartCard
        title="Reading activity"
        bodyPad="padded"
        footer={
          <div className="bp-heatmap-legend">
            {[
              { bg: '#EAECF0', label: 'No reading' },
              { bg: c.bar, label: 'Read' },
              { bg: c.bar, label: 'Goal met', goal: true },
              { bg: c.bar, label: 'Streak', streak: true },
            ].map((item, i) => (
              <div key={i} className="bp-heatmap-legend-item">
                <div
                  className={`bp-heatmap-cell${item.goal ? ' bp-heatmap-cell--goal' : ''}${item.streak ? ' bp-heatmap-cell--streak' : ''}`}
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
function SkillsDetail({ sec, c }) {
  const deltaUp = sec.monthlyDelta >= 0
  const lexileAxis = niceLexileAxis([...sec.lexileHistory.map((d) => d.avg), sec.gradeLevel])
  return (
    <>
      <Card>
        <SectionHeading>Lexile Trend</SectionHeading>
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
        <div className="bp-lexile-summary">
          <span className="bp-lexile-summary-label">Monthly Lexile average</span>
          <div className="bp-lexile-summary-right">
            <span className="bp-lexile-avg">{sec.monthlyAvg}L</span>
            <Pill color={deltaUp ? '#16A34A' : '#DC2626'} size="sm">
              {deltaUp ? '↑' : '↓'}
              {Math.abs(sec.monthlyDelta)}L vs Apr
            </Pill>
          </div>
        </div>
      </Card>

      <div className="bp-titles-section">
        <div className="bp-titles-header">
          <span className="bp-titles-header-label">Recent titles</span>
        </div>
        {sec.titles.map((t, i) => (
          <TitleRow key={i} title={t} />
        ))}
      </div>
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
    grade: '7th Grade',
    lastRun: 'May 15 at 9:55am',
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
      "Marcus is an outstanding reader. He's logged reading on 21 of the last 30 days — the highest consistency in the class — and is reading well above grade level at 870L. His intrinsic motivation is the highest on record, and his integrity score is nearly perfect with only 1 flagged session all year. He's ready for books 1–2 grade levels up, and would benefit from leadership opportunities like book talks or reading buddy programs.",
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
              "Marcus's motivation is at its highest point this year. His intrinsic score of 19.2/20 is exceptional — Enjoyment, Curiosity, and Challenge are his top three drivers. He's genuinely in love with reading right now. The best thing you can do is keep the material challenging and get out of his way.",
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
        flagBreakdown: [{ type: 'Time concern', count: 1 }],
        unfinishedConversations: 0,
        // Talks held, by type. `unfinished` sums to `unfinishedConversations`.
        talks: {
          engagement: { total: 11, unfinished: 0, positive: 10, mixed: 1, disengaged: 0 },
          comprehension: { total: 6, unfinished: 0, strong: 5, developing: 1 },
          integrity: { total: 1, unfinished: 0, concerns: 1 },
        },
        tileStat: '1',
        tileSub: 'flag ↓2',
        sessions: [{ date: '03/14/25', title: "Ender's Game", flags: ['time-warning'] }],
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
    grade: '6th Grade',
    lastRun: 'May 15 at 9:55am',
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
      "Anne is making real progress this month! Her reading habits are building — she's logged reading on 10 of the last 30 days and has already logged 85 minutes this week. Her Lexile average has climbed 50 points since April, and she's consistently choosing harder books. Integrity is improving, with flags down from 7 to 4. The main thing to keep an eye on is her extrinsic motivation, which has dipped 4 points, and 2 unfinished BTWB conversations that are worth following up on.",
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
        flagBreakdown: [
          { type: "Didn't cite details", count: 3 },
          { type: 'Logged above limit', count: 1 },
        ],
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
        sessions: [
          { date: '05/13/25', title: 'Island of the Blue Dolphins', flags: ['time-warning'] },
          { date: '05/10/25', title: 'Island of the Blue Dolphins', flags: ['btwb-incomplete'] },
          {
            date: '05/07/25',
            title: 'Hatchet',
            flags: ['time-warning', 'missing-details', 'btwb-incomplete'],
          },
          { date: '05/02/25', title: 'Hatchet', flags: ['btwb-incomplete'] },
          { date: '04/28/25', title: 'The Giver', flags: ['book-swap', 'time-warning'] },
          { date: '04/22/25', title: 'The Giver', flags: ['book-swap'] },
          { date: '04/15/25', title: 'Hatchet', flags: ['time-warning', 'missing-details'] },
          { date: '04/10/25', title: 'Hatchet', flags: ['time-warning'] },
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
    grade: '6th Grade',
    lastRun: 'May 15 at 9:55am',
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
      'Tyler needs immediate attention. He has no logged reading days in the past 30 days — the only student in the class with zero recent activity. His Lexile average has declined 15 points since March, and he has 13 flagged sessions including 6 suspected over-logs, which means his reading data may not be reliable. His motivation scores are critically low across all dimensions. A direct one-on-one conversation this week is the highest-impact action available.',
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
              "Tyler's motivation scores are critically low across all 10 dimensions. Enjoyment — the single strongest predictor of long-term reading engagement — is at 0.8 out of 4. No extrinsic motivator is compensating for it. A personal conversation about what he genuinely finds interesting, completely disconnected from school expectations, is the most important next step.",
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
        flagBreakdown: [
          { type: 'Logged above limit', count: 6 },
          { type: "Didn't cite details", count: 4 },
          { type: 'Suspicious length', count: 3 },
        ],
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
        sessions: [
          { date: '05/13/25', title: 'Holes', flags: ['over-limit', 'missing-details'] },
          { date: '05/10/25', title: 'Holes', flags: ['over-limit', 'btwb-incomplete'] },
          {
            date: '05/08/25',
            title: 'Holes',
            flags: ['over-limit', 'time-warning', 'btwb-incomplete'],
          },
          {
            date: '04/30/25',
            title: 'The One and Only Bob',
            flags: ['missing-details', 'btwb-incomplete'],
          },
          { date: '04/25/25', title: 'The One and Only Bob', flags: ['over-limit'] },
          {
            date: '04/18/25',
            title: 'The One and Only Ivan',
            flags: ['time-warning', 'btwb-incomplete'],
          },
          {
            date: '04/10/25',
            title: 'The One and Only Ivan',
            flags: ['missing-details', 'btwb-incomplete'],
          },
          {
            date: '04/02/25',
            title: 'The One and Only Ivan',
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
const RL_DATA = [
  {
    weekLabel: 'July 14–20',
    days: [
      {
        date: 16,
        day: 'Tuesday',
        streak: 1,
        entries: [
          {
            title: 'Fifteen Hundred Miles from the Sun',
            author: 'Jonny Garza Villa',
            amount: '1,000 Minutes',
            flagged: true,
          },
          {
            title: 'Found',
            author: 'Margaret Peterson Haddix',
            amount: '23 Minutes',
            flagged: false,
          },
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
          { title: 'Snapdragon', author: 'Kat Leyh', amount: '512 Minutes', flagged: true },
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
function RLEntryCard({ entry }) {
  return (
    <div className={`bp-rl-entry${entry.flagged ? ' bp-rl-entry--flagged' : ''}`}>
      <div className="bp-rl-entry-top">
        <div className="bp-rl-entry-title">{entry.title}</div>
        <div className="bp-rl-entry-menu">
          {entry.flagged && <span className="bp-rl-flag">⚑</span>}
          <span className="bp-rl-dots">···</span>
        </div>
      </div>
      <div className="bp-rl-entry-author">{entry.author}</div>
      <div className="bp-rl-entry-amount">{entry.amount}</div>
    </div>
  )
}

function ReadingLogPage() {
  const [month] = useState('July 2024')
  return (
    <div className="bp-content">
      <Hero
        icon={<Ic name="ti-reading-log" />}
        title="Reading Log"
        accent="#0284C7"
        accentBg="#E0F2FE"
        action={
          <Button variant="ghost" size="sm">
            Print log
          </Button>
        }
      />
      <div className="bp-rl-month-nav">
        <div className="bp-rl-month-label">{month}</div>
        <div className="bp-rl-month-arrows">
          <button className="bp-heatmap-nav-btn" aria-label="Previous month">
            <Icon name="chevron-left" size={11} />
          </button>
          <button className="bp-heatmap-nav-btn" aria-label="Next month">
            <Icon name="chevron-right" size={11} />
          </button>
        </div>
      </div>
      {RL_DATA.map((week, wi) => (
        <div key={wi} className="bp-rl-week">
          <div className="bp-rl-week-label">{week.weekLabel}</div>
          {week.days.map((day, di) => (
            <div key={di} className={`bp-rl-day${day.faded ? ' bp-rl-day--faded' : ''}`}>
              <div className="bp-rl-day-col">
                <div className="bp-rl-day-num">{day.date}</div>
                <div className="bp-rl-day-name">{day.day}</div>
                {day.streak > 0 && (
                  <div className="bp-rl-flame">
                    🔥<span>{day.streak}</span>
                  </div>
                )}
              </div>
              <div className="bp-rl-entries">
                {day.entries.length > 0
                  ? day.entries.map((e, ei) => <RLEntryCard key={ei} entry={e} />)
                  : !day.faded && <EmptyState title="No reading logged" />}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Placeholder page ─────────────────────────────────────────────────────────
function PlaceholderPage({ pageKey }) {
  const item = NAV_ITEMS.find((n) => !n.divider && n.section === pageKey)
  return (
    <div className="bp-content">
      <Hero
        icon={<Ic name={item?.icon || 'ti-user'} />}
        title={item?.label || pageKey}
        accent="#94A3B8"
        accentBg="#F1F5F9"
      />
      <EmptyState title="Coming soon" description="This section is coming soon." />
    </div>
  )
}

// ─── Admin mockup ─────────────────────────────────────────────────────────────
function AdminMockup({ onStudentClick, selectedKey }) {
  const [admTab, setAdmTab] = useState('daily')
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
              ]}
            />
          </div>

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
              <IconButton variant="ghost" size="md" aria-label="Next week" style={{ opacity: 0.3 }}>
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
                        <span className="bp-adm-student-name">{STUDENTS[s.key].name}</span>
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
        </div>
        {/* bp-adm-main-body */}
      </div>
    </div>
  )
}

// ─── Embeddable profile panel (used by RIS StudentPanel slide-in) ─────────────
export function StudentProfileView({ studentKey, onClose }) {
  const [activeSection, setActiveSection] = useState(null)
  const student = STUDENTS[studentKey] || STUDENTS.marcus

  return (
    <div className="bp-root" style={{ width: '100%', flex: 1, minHeight: 0, boxShadow: 'none' }}>
      <LeftNav activeSection={activeSection} onNavigate={setActiveSection} />
      <div className="bp-panel">
        <StudentHeader student={student} onClose={onClose} />
        <div key={`${studentKey}-${activeSection ?? 'overview'}`} className="bp-page-fade">
          {activeSection === null ? (
            <Overview student={student} onNavigate={setActiveSection} />
          ) : ANALYSIS_SECTIONS.has(activeSection) ? (
            <SectionDetail student={student} sectionKey={activeSection} />
          ) : activeSection === 'readinglog' ? (
            <ReadingLogPage />
          ) : (
            <PlaceholderPage pageKey={activeSection} />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function BeanstackProfile() {
  const [activeSection, setActiveSection] = useState(null)
  const [profileMode, setProfileMode] = useState('closed')
  const [selectedStudentKey, setSelectedStudentKey] = useState(null)

  const student = selectedStudentKey ? STUDENTS[selectedStudentKey] : null

  const handleStudentClick = (key) => {
    setSelectedStudentKey(key)
    setActiveSection(null)
    setProfileMode('side')
  }

  const closeProfile = () => setProfileMode('closed')

  return (
    <div className="bp-shell">
      {/* Admin bg */}
      <div className={`bp-shell-admin${profileMode === 'full' ? ' bp-shell-admin--hidden' : ''}`}>
        <AdminMockup onStudentClick={handleStudentClick} selectedKey={selectedStudentKey} />
      </div>

      {/* Dim overlay */}
      {profileMode === 'side' && (
        <div
          className="bp-shell-overlay"
          onClick={closeProfile}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        />
      )}

      {/* Profile panel */}
      {profileMode !== 'closed' && student && (
        <div className={`bp-profile-wrap${profileMode === 'full' ? ' bp-profile-wrap--full' : ''}`}>
          {/* Mobile-only top bar — hidden on desktop via CSS */}
          <div className="bp-profile-topbar">
            <div className="bp-profile-topbar-title">
              <span className="bp-profile-topbar-name">{student.name}</span>
              <span className="bp-profile-topbar-grade">{student.grade}</span>
            </div>
            <StudentActions onClose={closeProfile} />
          </div>

          <div className="bp-root">
            <LeftNav activeSection={activeSection} onNavigate={setActiveSection} />
            <div className="bp-panel">
              <StudentHeader student={student} onClose={closeProfile} />
              <div
                key={`${selectedStudentKey}-${activeSection ?? 'overview'}`}
                className="bp-page-fade"
              >
                {activeSection === null ? (
                  <Overview student={student} onNavigate={setActiveSection} />
                ) : ANALYSIS_SECTIONS.has(activeSection) ? (
                  <SectionDetail student={student} sectionKey={activeSection} />
                ) : activeSection === 'readinglog' ? (
                  <ReadingLogPage />
                ) : (
                  <PlaceholderPage pageKey={activeSection} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
