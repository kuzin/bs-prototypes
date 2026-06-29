import {
  NOTIFICATIONS,
  STAT_TILES,
  DAILY_TRACKER,
  LEADERBOARDS,
  LINKS,
  QUESTIONS,
  FLAGGED_SESSIONS,
  TOP_BOOKS,
  TOP_BADGES,
  coverUrl,
} from '../data'
import { useState } from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import { EmptyState } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'

// ─── Empty-state plumbing ────────────────────────────────────────────────
// The Empty Sink role view renders every widget in its empty state so we can
// preview the no-data UX without hand-toggling each widget. Each widget that
// can be meaningfully empty checks `role === "empty"` and returns a shared
// shell wrapping <EmptyState>.
function WidgetEmpty({ title, action, empty }) {
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <div className="adm-w-title">{title}</div>
        {action && <button className="adm-w-action">{action}</button>}
      </div>
      <div className="adm-w-body adm-w-body--empty">
        <EmptyState title={empty.title} description={empty.description} />
      </div>
    </div>
  )
}

// ─── Width system ────────────────────────────────────────────────────────────
// Simplified 3-step width: 1/3, 2/3, or full. Internally we still use a
// 12-column RGL grid (4/8/12) so the underlying math is unchanged, but the
// width selector only ever offers these three options.
export const WIDTH_TO_COLS = { sm: 4, half: 6, lg: 8, full: 12 }
export const COLS_TO_WIDTH = (w) => (w <= 4 ? 'sm' : w <= 6 ? 'half' : w <= 8 ? 'lg' : 'full')
export const WIDTH_FIELD = {
  key: 'width',
  label: 'Width',
  type: 'select',
  options: [
    { value: 'sm', label: '1/3' },
    { value: 'half', label: '1/2' },
    { value: 'lg', label: '2/3' },
    { value: 'full', label: 'Full width' },
  ],
}

// ─── Notifications ───────────────────────────────────────────────────────
export function AdmNotifications() {
  return (
    <div className="adm-w" style={{ padding: 14 }}>
      <div className="adm-banners">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className={`adm-banner adm-banner--${n.tone}`}>
            <div className="adm-banner-ico">
              {n.tone === 'warn' ? '⚠' : n.tone === 'danger' ? '✕' : n.tone === 'good' ? '✓' : '🔥'}
            </div>
            <div className="adm-banner-text">
              <div className="adm-banner-title">{n.title}</div>
              <div className="adm-banner-body">{n.body}</div>
            </div>
            <button className="adm-banner-cta">{n.action}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Stat tiles ──────────────────────────────────────────────────────────
const STAT_ICONS = {
  clock: <Icon name="clock" size={20} />,
  user: <Icon name="user" size={20} />,
  book: <Icon name="book-2" size={20} />,
  people: <Icon name="users" size={20} />,
  timer: <Icon name="timer" size={20} />,
  calendar: <Icon name="calendar-event" size={20} />,
}
const STAT_RANGE_LABEL = {
  week: 'This Week',
  month: 'This Month',
  year: 'This Year',
}
// Per-log-type overrides for the count metrics (Minutes / Staff Minutes).
// Other tiles (Active Readers, Lexile Avg, etc.) are independent of log type.
const LOG_TYPE_TILES = {
  minutes: {
    minutes: { value: '3,252', label: 'Minutes', hint: 'Insights' },
    staffMinutes: { value: '1,348', label: 'Staff Minutes', hint: undefined },
  },
  pages: {
    minutes: { value: '12,840', label: 'Pages', hint: 'Insights' },
    staffMinutes: { value: '5,210', label: 'Staff Pages', hint: undefined },
  },
  books: {
    minutes: { value: '287', label: 'Books', hint: 'Insights' },
    staffMinutes: { value: '126', label: 'Staff Books', hint: undefined },
  },
}
// Catalog-demo roles (Kitchen Sink + variants) bypass per-tile role gates so
// every metric in the catalog is visible.
const IS_CATALOG_ROLE = (role) => role === 'kitchen' || role === 'kitchen-full'

export function AdmStatTiles({ settings = {}, role = 'teacher' }) {
  if (role === 'empty')
    return (
      <WidgetEmpty
        title="What's Happened"
        action="View in Insights"
        empty={{
          title: 'No reading logged yet',
          description:
            "Once students start logging, you'll see weekly minutes, active readers, and Lexile averages here.",
        }}
      />
    )
  // Tiles available to this role (staff-related ones are media-only)
  const available = STAT_TILES.filter(
    (s) => IS_CATALOG_ROLE(role) || !s.roles || s.roles.includes(role),
  )
  const selectedIds =
    settings.selected && settings.selected.length ? settings.selected : available.map((s) => s.id)
  const range = settings.range || 'week'
  const logType = settings.logType || 'minutes'
  const logOverrides = LOG_TYPE_TILES[logType] || LOG_TYPE_TILES.minutes
  // Preserve catalog order, drop any selected ids the role can't see.
  const tiles = available.filter((s) => selectedIds.includes(s.id))
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <div className="adm-w-title">
          What's Happened
          <span className="adm-w-meta">{STAT_RANGE_LABEL[range]}</span>
        </div>
        <button className="adm-w-action">View in Insights</button>
      </div>
      <div className="adm-w-body">
        <div className="adm-stats">
          {tiles.map((s) => {
            // Count metrics swap their value + label based on the selected
            // log type (Minutes / Pages / Books).
            const tile = { ...s, ...(logOverrides[s.id] || {}) }
            const linkable = !!tile.hint
            const Tag = linkable ? 'a' : 'div'
            const linkProps = linkable ? { href: '#', onClick: (e) => e.preventDefault() } : {}
            return (
              <Tag
                key={tile.id}
                className={`adm-stat adm-stat--${tile.color}${linkable ? ' adm-stat--link' : ''}`}
                {...linkProps}
              >
                <div className="adm-stat-main">
                  <div className="adm-stat-val">{tile.value}</div>
                  <div className="adm-stat-lbl">{tile.label}</div>
                  {linkable && (
                    <span className="adm-stat-hint">
                      {tile.hint}
                      <span className="adm-stat-hint-arrow" aria-hidden="true">
                        →
                      </span>
                    </span>
                  )}
                </div>
              </Tag>
            )
          })}
          {tiles.length === 0 && (
            <div className="adm-stats-empty">Pick at least one metric in widget settings.</div>
          )}
        </div>
      </div>
    </div>
  )
}
const STAT_DEFAULTS = {
  selected: STAT_TILES.map((s) => s.id),
  range: 'week',
  logType: 'minutes',
}
// Role-aware: the multi-select only lists tiles the current role can see, so
// a teacher doesn't see media-only metrics like "Staff Minutes" in the cog.
// Kitchen Sink is the catalog demo and gets the full list.
const STAT_FIELDS = (role) => {
  const visible = STAT_TILES.filter(
    (s) => IS_CATALOG_ROLE(role) || !s.roles || s.roles.includes(role),
  )
  return [
    {
      key: 'logType',
      label: 'Log type',
      type: 'select',
      help: 'Switches the primary count tile between minutes, pages, and books.',
      options: [
        { value: 'minutes', label: 'Minutes' },
        { value: 'pages', label: 'Pages' },
        { value: 'books', label: 'Books' },
      ],
    },
    {
      key: 'selected',
      label: 'Show metrics',
      type: 'multi',
      max: 4,
      help: 'Pick up to 4 stat tiles to show in this widget.',
      options: visible.map((s) => ({ value: s.id, label: s.label })),
    },
    {
      key: 'range',
      label: 'Time range',
      type: 'select',
      options: [
        { value: 'week', label: 'This week' },
        { value: 'month', label: 'This month' },
        { value: 'year', label: 'This year' },
      ],
    },
  ]
}

// ─── Daily reading tracker ───────────────────────────────────────────────
// Per-student table modeled on the Student Profile AdminMockup class view:
// each row is a student with their own goal, a weekly average, and a check
// circle (or partial-percent pill / dash) for each day. Class Average row
// at the bottom + a color-key legend in the footer.
const GROUP_LABEL = {
  'class-a': 'Class A · Grade 3',
  'class-b': 'Class B · Grade 4',
  'class-c': 'Class C · Grade 5',
  'grade-3': 'Grade 3',
  'grade-4': 'Grade 4',
}
const EditIcon = () => <Icon name="pencil" size={11} />
const CheckIcon = () => <Icon name="check" size={10} />
export function AdmDailyTracker({ settings = {}, role = 'teacher' }) {
  if (role === 'empty')
    return (
      <WidgetEmpty
        title="Daily Reading Tracker"
        action="View All Classes"
        empty={{
          title: 'No daily logs this week',
          description:
            'Set a per-student goal and ask students to log each day. Their daily progress will appear here.',
        }}
      />
    )
  const group = settings.group || 'class-a'
  const t = DAILY_TRACKER
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <div className="adm-w-title">
          Daily Reading Tracker
          <span className="adm-w-meta">{GROUP_LABEL[group] || 'Class A · Grade 3'}</span>
        </div>
        <button className="adm-w-action">View All Classes</button>
      </div>
      <div className="adm-w-body adm-drt">
        <div className="adm-drt-week-nav">
          <button className="adm-drt-nav-btn" aria-label="Previous week">
            ‹
          </button>
          <span className="adm-drt-week-label">{t.range}</span>
          <button className="adm-drt-nav-btn" aria-label="Next week" disabled>
            ›
          </button>
        </div>
        <table className="adm-drt-table">
          <thead>
            <tr>
              <th className="adm-drt-th adm-drt-th--student">Student</th>
              <th className="adm-drt-th adm-drt-th--goal">Goal</th>
              <th className="adm-drt-th adm-drt-th--center">Average</th>
              {t.days.map((d) => (
                <th key={d} className="adm-drt-th adm-drt-th--center">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((s) => (
              <tr key={s.id} className="adm-drt-row">
                <td className="adm-drt-td">
                  <div className="adm-drt-student">
                    <span className="adm-drt-rank-num">{s.rank}.</span>
                    <span className="adm-drt-student-name">{s.name}</span>
                  </div>
                </td>
                <td className="adm-drt-td adm-drt-td--goal">
                  <div className="adm-drt-goal-cell">
                    <span className="adm-drt-goal-val">{s.goal}</span>
                    <button
                      className="adm-drt-edit-btn"
                      title="Edit goal"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EditIcon />
                    </button>
                  </div>
                </td>
                <td className="adm-drt-td adm-drt-td--center">
                  <span className={`adm-drt-pct adm-drt-pct--${s.ac}`}>{s.avg}%</span>
                </td>
                {s.days.map((d, i) => (
                  <td key={i} className="adm-drt-td adm-drt-td--center">
                    {d === null ? (
                      <span className="adm-drt-dash">–</span>
                    ) : d === true ? (
                      <span className="adm-drt-check">
                        <CheckIcon />
                      </span>
                    ) : (
                      <span
                        className={`adm-drt-pct adm-drt-pct--${s.ac === 'red' ? 'red' : 'orange'}`}
                      >
                        {d}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="adm-drt-avg-row">
              <td className="adm-drt-td">
                <div className="adm-drt-student">
                  <span>Average</span>
                </div>
              </td>
              <td className="adm-drt-td adm-drt-td--goal" />
              <td className="adm-drt-td adm-drt-td--center">{t.classAverage.avg}%</td>
              {t.classAverage.days.map((v, i) => (
                <td key={i} className="adm-drt-td adm-drt-td--center">
                  {v === null ? '–' : v}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="adm-w-footer adm-drt-legend">
        <span className="lg-red">● 0–33%</span>
        <span className="lg-yellow">● 34–66%</span>
        <span className="lg-blue">● 66–99%</span>
        <span className="lg-green">✓ 100%</span>
      </div>
    </div>
  )
}
const TRACKER_DEFAULTS = { group: 'class-a' }
const TRACKER_FIELDS = [
  {
    key: 'group',
    label: 'Class',
    type: 'select',
    options: [
      { value: 'class-a', label: 'Class A · Grade 3' },
      { value: 'class-b', label: 'Class B · Grade 4' },
      { value: 'class-c', label: 'Class C · Grade 5' },
      { value: 'grade-3', label: 'Grade 3' },
      { value: 'grade-4', label: 'Grade 4' },
    ],
  },
]

// ─── Leaderboard (generic, settings-driven) ──────────────────────────────
// Parse the numeric portion of "250 Minutes" / "3,948 Minutes" → 250 / 3948
function parseValue(v) {
  return parseInt(String(v).replace(/[^0-9]/g, ''), 10) || 0
}

const SORT_FNS = {
  'active-desc': (a, b) => parseValue(b.value) - parseValue(a.value),
  'active-asc': (a, b) => parseValue(a.value) - parseValue(b.value),
  alpha: (a, b) => a.name.localeCompare(b.name),
  recent: (a, b) => b.id - a.id, // proxy: higher id = more recent
}

const SORT_LABEL = {
  'active-desc': 'Most Active',
  'active-asc': 'Least Active',
  alpha: 'Alphabetical',
  recent: 'Recently Added',
}

const RANGE_LABEL = {
  week: 'This Week',
  lastweek: 'Last Week',
  month: 'This Month',
  year: 'This Year',
}

function makeLeaderboard(kind, list) {
  return function ({ settings = {}, role = 'teacher' }) {
    const sort = settings.sort || 'active-desc'
    const range = settings.range || 'week'
    const limit = parseInt(settings.limit || 5, 10)

    if (role === 'empty' || !list || list.length === 0) {
      return (
        <WidgetEmpty
          title={kind}
          action="View Report"
          empty={{
            title: `No active ${kind.toLowerCase()}`,
            description: `Once reading activity rolls in, the most active ${kind.toLowerCase()} will rank here.`,
          }}
        />
      )
    }

    const sorted = [...list].sort(SORT_FNS[sort] || SORT_FNS['active-desc']).slice(0, limit)
    const titlePrefix = sort === 'alpha' ? '' : `${SORT_LABEL[sort]} `

    return (
      <div className="adm-w">
        <div className="adm-w-head">
          <div className="adm-w-title">
            {titlePrefix}
            {kind}
            <span className="adm-w-meta">{RANGE_LABEL[range]}</span>
          </div>
          <button className="adm-w-action">View Report</button>
        </div>
        <div className="adm-w-body adm-lb">
          <div className="adm-lb-list">
            {sorted.map((r) => (
              <div key={r.id} className="adm-lb-row">
                <span className="adm-lb-name">{r.name}</span>
                <span className="adm-lb-val">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
export const AdmLeaderboardStudents = makeLeaderboard('Students', LEADERBOARDS.students)
export const AdmLeaderboardClasses = makeLeaderboard('Classes', LEADERBOARDS.classes)
export const AdmLeaderboardStaff = makeLeaderboard('Staff', LEADERBOARDS.staff)
// Public-library rosters (patrons + branches reuse the reader/branch data).
export const AdmLeaderboardPatrons = makeLeaderboard('Patrons', LEADERBOARDS.students)
export const AdmLeaderboardBranches = makeLeaderboard('Branches', LEADERBOARDS.branches)

// Shared leaderboard settings schema + defaults
const LEADERBOARD_DEFAULTS = { sort: 'active-desc', range: 'week', limit: '15' }
const LEADERBOARD_FIELDS = [
  {
    key: 'sort',
    label: 'Sort by',
    type: 'select',
    options: [
      { value: 'active-desc', label: 'Most active' },
      { value: 'active-asc', label: 'Least active' },
      { value: 'alpha', label: 'Alphabetical' },
      { value: 'recent', label: 'Recently added' },
    ],
  },
  {
    key: 'range',
    label: 'Time range',
    type: 'select',
    options: [
      { value: 'week', label: 'This week' },
      { value: 'lastweek', label: 'Last week' },
      { value: 'month', label: 'This month' },
      { value: 'year', label: 'This year' },
    ],
  },
  {
    key: 'limit',
    label: 'Show top',
    type: 'select',
    options: [
      { value: '5', label: '5 rows' },
      { value: '10', label: '10 rows' },
      { value: '15', label: '15 rows' },
      { value: '25', label: '25 rows' },
    ],
  },
]

// ─── Combined leaderboard (Classes / Students toggle, top 3) ──────────────
// One block with an in-widget toggle, showing only the top 3 and linking out
// to the full Insights leaderboard. The toggle seeds from settings.entity
// (defaults to Top Classes). Used as the Media Specialist default.
// Entities are role-aware: schools rank Classes/Students, public libraries
// rank Readers/Branches.
function lbEntities(role) {
  if (role === 'library') {
    return [
      { value: 'readers', label: 'Top Readers', list: LEADERBOARDS.students },
      { value: 'branches', label: 'Branches', list: LEADERBOARDS.branches },
    ]
  }
  return [
    { value: 'classes', label: 'Top Classes', list: LEADERBOARDS.classes },
    { value: 'students', label: 'Top Students', list: LEADERBOARDS.students },
  ]
}
export function AdmLeaderboardCombo({ settings = {}, role = 'teacher' }) {
  const [picked, setPicked] = useState(settings.entity)
  if (role === 'empty')
    return (
      <WidgetEmpty
        title="Leaderboard"
        action="View in Insights"
        empty={{
          title: 'No activity to rank yet',
          description:
            'Students and classes will appear here as soon as someone starts logging reading minutes.',
        }}
      />
    )
  const entities = lbEntities(role)
  // Fall back to the role's first entity if the picked value isn't valid for
  // this role (e.g. after switching roles without remounting).
  const activeValue = entities.some((e) => e.value === picked) ? picked : entities[0].value
  const cfg = entities.find((e) => e.value === activeValue)
  const top = [...cfg.list].sort(SORT_FNS['active-desc']).slice(0, 5)
  const rankName = (i) => (i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'plain')
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <div className="adm-w-title">
          Leaderboard
          <span className="adm-w-meta">Top 5 · This Week</span>
        </div>
        <button className="adm-w-action">View in Insights</button>
      </div>
      <div className="adm-w-body adm-lbc">
        <Tabs
          variant="pill"
          block
          accent="#1A6DD5"
          ariaLabel="Leaderboard view"
          className="adm-lbc-toggle"
          active={activeValue}
          onChange={setPicked}
          items={entities.map((e) => ({ id: e.value, label: e.label }))}
        />
        <ol className="adm-lbc-list">
          {top.map((r, i) => (
            <li key={r.id} className="adm-lbc-row">
              <span className={`adm-lbc-rank adm-lbc-rank--${rankName(i)}`}>{i + 1}</span>
              <span className="adm-lbc-name">{r.name}</span>
              <span className="adm-lbc-val">{r.value}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
const LB_COMBO_DEFAULTS = { entity: 'classes' }

// ─── Flagged sessions (Reading Integrity Suite priority card) ─────────────
const FlagIcon = () => <Icon name="flag" size={22} />
export function AdmFlaggedSessions({ role = 'teacher' } = {}) {
  if (role === 'empty')
    return (
      <WidgetEmpty
        title="Flagged Sessions"
        action="Review All"
        empty={{
          title: 'Nothing to review',
          description:
            "Reading Integrity hasn't flagged any sessions this week — your students are reading clean.",
        }}
      />
    )
  const f = FLAGGED_SESSIONS
  const sessions = f.sessions || []
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <div className="adm-w-title">
          Flagged Sessions
          <span className="adm-w-meta">
            {sessions.length} to review · {f.range}
          </span>
        </div>
        <button className="adm-w-action">Review All</button>
      </div>
      <div className="adm-w-body adm-flagged">
        <ul className="adm-flagged-list">
          {sessions.map((s) => (
            <li key={s.id} className="adm-flagged-row">
              <div className="adm-flagged-info">
                <div className="adm-flagged-reader">{s.reader}</div>
                <div className="adm-flagged-book">{s.title}</div>
              </div>
              <span className="adm-flagged-flags">
                {s.flags.map((fl, i) => (
                  <Tippy key={i} content={fl.label}>
                    <span className={`adm-flag adm-flag--${fl.tone}`}>
                      <FlagIcon />
                    </span>
                  </Tippy>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── Top Books + Top Badges (visual, Insights-style) ──────────────
const TB_RANGE_META = { week: 'This Week', month: 'This Month', year: 'This Year' }
const TB_RANGE_MULT = { week: 1, month: 4, year: 48 }
const TB_DEFAULTS = { range: 'week', limit: 5 }
const TB_FIELDS = [
  {
    key: 'range',
    label: 'Time range',
    type: 'select',
    options: [
      { value: 'week', label: 'Weekly' },
      { value: 'month', label: 'Monthly' },
      { value: 'year', label: 'Yearly' },
    ],
  },
  { key: 'limit', label: 'Show top', type: 'range', min: 5, max: 15, step: 1 },
]
const BadgeStar = () => <Icon name="star-filled" size={26} />

// Real Open Library cover by ISBN; on load failure (offline, missing edition)
// fall back to a colored block with the title overlaid.
function BookCover({ book, rank }) {
  const [failed, setFailed] = useState(false)
  const showFallback = failed || !book.isbn
  return (
    <div className="adm-book-cover" style={showFallback ? { background: book.color } : undefined}>
      <span className="adm-book-rank">{rank}</span>
      {showFallback ? (
        <span className="adm-book-fallback">{book.name}</span>
      ) : (
        <img src={coverUrl(book.isbn, 'M')} alt="" loading="lazy" onError={() => setFailed(true)} />
      )}
    </div>
  )
}

export function AdmTopBooks({ settings = {}, role = 'teacher' }) {
  if (role === 'empty')
    return (
      <WidgetEmpty
        title="Top Books"
        action="View Report"
        empty={{
          title: 'No books logged yet',
          description: 'As your readers log titles, the most-read books will rank here.',
        }}
      />
    )
  const range = settings.range || 'week'
  const mult = TB_RANGE_MULT[range] || 1
  const limit = Number(settings.limit) || 5
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <div className="adm-w-title">
          Top Books
          <span className="adm-w-meta">{TB_RANGE_META[range]}</span>
        </div>
        <button className="adm-w-action">View Report</button>
      </div>
      <div className="adm-w-body adm-shelf">
        {TOP_BOOKS.slice(0, limit).map((b, i) => (
          <Tippy key={b.id} content={b.name}>
            <div className="adm-shelf-item">
              <BookCover book={b} rank={i + 1} />
              <div className="adm-shelf-meta">
                {Math.round(b.count * mult).toLocaleString()} reads
              </div>
            </div>
          </Tippy>
        ))}
      </div>
    </div>
  )
}

export function AdmTopBadges({ settings = {}, role = 'teacher' }) {
  if (role === 'empty')
    return (
      <WidgetEmpty
        title="Top Badges"
        action="View Report"
        empty={{
          title: 'No badges earned yet',
          description:
            'Once students hit reading milestones, the badges they earn most will land here.',
        }}
      />
    )
  const range = settings.range || 'week'
  const mult = TB_RANGE_MULT[range] || 1
  const limit = Number(settings.limit) || 5
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <div className="adm-w-title">
          Top Badges
          <span className="adm-w-meta">{TB_RANGE_META[range]}</span>
        </div>
        <button className="adm-w-action">View Report</button>
      </div>
      <div className="adm-w-body adm-badges">
        {TOP_BADGES.slice(0, limit).map((b) => (
          <Tippy key={b.id} content={b.name}>
            <div className="adm-badge-item">
              <span className={`adm-badge-medal adm-badge-medal--${b.color}`}>
                <BadgeStar />
              </span>
              <div className="adm-shelf-meta">
                {Math.round(b.count * mult).toLocaleString()} earned
              </div>
            </div>
          </Tippy>
        ))}
      </div>
    </div>
  )
}

// ─── Quick links ──────────────────────────────────────────────────────
// Per-link semantic icons. Keys match the `icon` field on each LINKS entry.
const LINK_ICONS = {
  classes: <Icon name="users" size={16} />,
  trophy: <Icon name="trophy" size={16} />,
  flag: <Icon name="flag" size={16} />,
  target: <Icon name="target" size={16} />,
  chart: <Icon name="chart-bar" size={16} />,
  clipboard: <Icon name="clipboard-list" size={16} />,
  lexile: <Icon name="book-2" size={16} />,
  reward: <Icon name="award" size={16} />,
}
export function AdmQuickLinks({ settings = {} }) {
  const selectedIds =
    settings.selected && settings.selected.length ? settings.selected : LINKS.map((l) => l.id)
  const visible = LINKS.filter((l) => selectedIds.includes(l.id))
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <div className="adm-w-title">
          Quick Links
          <span className="adm-w-meta">
            {visible.length} link{visible.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>
      <div className="adm-w-body">
        <div className="adm-links">
          {visible.map((l) => (
            <a key={l.id} href="#" className={`adm-link adm-link--${l.color}`}>
              <span className="adm-link-ico">{LINK_ICONS[l.icon] || LINK_ICONS.classes}</span>
              <span>{l.label}</span>
              <span className="adm-link-arrow">›</span>
            </a>
          ))}
          {visible.length === 0 && (
            <div style={{ padding: 16, color: '#94A3B8', fontSize: 13 }}>
              Pick at least one link in widget settings.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
const QUICK_LINKS_DEFAULTS = { selected: LINKS.map((l) => l.id) }
const QUICK_LINKS_FIELDS = [
  {
    key: 'selected',
    label: 'Show links',
    type: 'multi',
    help: 'Pick which shortcut tiles appear in this widget.',
    options: LINKS.map((l) => ({ value: l.id, label: l.label })),
  },
]

// ─── Quick questions ──────────────────────────────────────────────────
const Q_ICONS = {
  clock: <Icon name="clock" size={18} />,
  calendar: <Icon name="calendar" size={18} />,
  check: <Icon name="circle-check" size={18} />,
  target: <Icon name="target" size={18} />,
  book: <Icon name="book-2" size={18} />,
  warning: <Icon name="alert-triangle" size={18} />,
  trending: <Icon name="trending-up" size={18} />,
  people: <Icon name="users" size={18} />,
}

export function AdmQuestions({ settings = {}, role = 'teacher' }) {
  if (role === 'empty')
    return (
      <WidgetEmpty
        title="Number Cruncher"
        action="More Questions"
        empty={{
          title: 'No questions selected',
          description:
            "Open the cog to pick the questions you want quick answers to — they'll appear here ready to click.",
        }}
      />
    )
  const selectedIds =
    settings.selected && settings.selected.length
      ? settings.selected
      : QUESTIONS.slice(0, 4).map((q) => q.id)
  const list = QUESTIONS.filter((q) => selectedIds.includes(q.id))
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <div className="adm-nc-head-left">
          <img
            src="/bs-prototypes/benny-thinking.svg"
            alt=""
            className="adm-nc-benny"
            aria-hidden="true"
          />
          <div className="adm-w-title">
            Number Cruncher
            <span className="adm-w-meta">
              {list.length} question{list.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
        <button className="adm-w-action">More Questions</button>
      </div>
      <div className="adm-w-body">
        <div className="adm-questions">
          {list.map((q) => (
            <button key={q.id} className="adm-question">
              <span className="adm-question-ico">{Q_ICONS[q.icon] || Q_ICONS.target}</span>
              <span className="adm-question-text">{q.text}</span>
              <span className="adm-question-arrow">›</span>
            </button>
          ))}
          {list.length === 0 && (
            <div style={{ padding: 16, color: '#94A3B8', fontSize: 13 }}>
              Pick at least one question in widget settings.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
const QUESTIONS_DEFAULTS = { selected: ['q1', 'q2', 'q3', 'q4'] }
const QUESTIONS_FIELDS = [
  {
    key: 'selected',
    label: 'Show questions',
    type: 'multi',
    help: 'Pick from the question library.',
    options: QUESTIONS.map((q) => ({ value: q.id, label: q.text })),
  },
]

// ─── Catalog ──────────────────────────────────────────────────────────
// `scrollable: true` means the widget has a fixed height (set in layout) and
// its body scrolls internally — good for long lists. Otherwise the dashboard
// auto-sizes the cell to fit content.
// `roles` controls which views can add a widget from the palette. Omit it for
// widgets available to everyone (What's Happened, Number Cruncher, Top Books,
// Top Badges).
export const WIDGET_CATALOG = {
  'stat-tiles': {
    name: "What's Happened",
    desc: 'At-a-glance metric tiles — pick which ones',
    min: { w: 2, h: 4 },
    component: AdmStatTiles,
    defaults: STAT_DEFAULTS,
    settingsFields: STAT_FIELDS,
  },
  'flagged-sessions': {
    name: 'Flagged Sessions',
    desc: 'Reading sessions auto-flagged for review this week',
    min: { w: 1, h: 4 },
    component: AdmFlaggedSessions,
    scrollable: true,
    roles: ['teacher', 'media'],
  },
  'leaderboard-combo': {
    name: 'Leaderboard',
    desc: 'Top 5 with an in-widget toggle',
    min: { w: 2, h: 6 },
    component: AdmLeaderboardCombo,
    defaults: LB_COMBO_DEFAULTS,
    scrollable: true,
    roles: ['media', 'library'],
  },
  'daily-tracker': {
    name: 'Daily Reading Tracker',
    desc: 'Per-student weekly progress with daily check-ins',
    min: { w: 2, h: 6 },
    component: AdmDailyTracker,
    defaults: TRACKER_DEFAULTS,
    settingsFields: TRACKER_FIELDS,
    roles: ['teacher'],
  },
  'leaderboard-students': {
    name: 'Students',
    desc: 'Roster of students with configurable sort',
    min: { w: 1, h: 6 },
    component: AdmLeaderboardStudents,
    defaults: LEADERBOARD_DEFAULTS,
    settingsFields: LEADERBOARD_FIELDS,
    scrollable: true,
    roles: ['teacher', 'media'],
  },
  'leaderboard-classes': {
    name: 'Classes',
    desc: 'Roster of classes with configurable sort',
    min: { w: 1, h: 6 },
    component: AdmLeaderboardClasses,
    defaults: LEADERBOARD_DEFAULTS,
    settingsFields: LEADERBOARD_FIELDS,
    scrollable: true,
    roles: ['teacher', 'media'],
  },
  'leaderboard-staff': {
    name: 'Staff',
    desc: 'Roster of staff with configurable sort',
    min: { w: 1, h: 6 },
    component: AdmLeaderboardStaff,
    defaults: LEADERBOARD_DEFAULTS,
    settingsFields: LEADERBOARD_FIELDS,
    scrollable: true,
    roles: ['media', 'library'],
  },
  'leaderboard-patrons': {
    name: 'Patrons',
    desc: 'Roster of patrons with configurable sort',
    min: { w: 1, h: 6 },
    component: AdmLeaderboardPatrons,
    defaults: LEADERBOARD_DEFAULTS,
    settingsFields: LEADERBOARD_FIELDS,
    scrollable: true,
    roles: ['library'],
  },
  'leaderboard-branches': {
    name: 'Branches',
    desc: 'Roster of branches with configurable sort',
    min: { w: 1, h: 6 },
    component: AdmLeaderboardBranches,
    defaults: LEADERBOARD_DEFAULTS,
    settingsFields: LEADERBOARD_FIELDS,
    scrollable: true,
    roles: ['library'],
  },
  questions: {
    name: 'Number Cruncher',
    desc: 'Pick which questions to show',
    min: { w: 2, h: 14 },
    component: AdmQuestions,
    defaults: QUESTIONS_DEFAULTS,
    settingsFields: QUESTIONS_FIELDS,
    scrollable: true,
  },
  'top-badges': {
    name: 'Top Badges',
    desc: 'Badges earned most this week',
    min: { w: 1, h: 6 },
    component: AdmTopBadges,
    defaults: TB_DEFAULTS,
    settingsFields: TB_FIELDS,
  },
  'top-books': {
    name: 'Top Books',
    desc: 'Most-read titles this week',
    min: { w: 1, h: 6 },
    component: AdmTopBooks,
    defaults: TB_DEFAULTS,
    settingsFields: TB_FIELDS,
  },
}
