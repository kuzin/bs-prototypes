import { FEATURE_BAR, QUICK_ACTIONS, ENGAGEMENT, GOAL_OPTIONS } from '../data'
import { SettingsPopover } from './SettingsPopover'
import { Icon } from '@components/Icon/Icon'

// ─── Feature announcement bar (admin-controlled, not editable) ───────────
export function FeatureBar({ onClose }) {
  if (!FEATURE_BAR) return null
  return (
    <div className="adm-feature-bar">
      <span className="adm-feature-badge">{FEATURE_BAR.badge}</span>
      <div className="adm-feature-text">
        <div className="adm-feature-title">{FEATURE_BAR.title}</div>
        <div className="adm-feature-body">{FEATURE_BAR.body}</div>
      </div>
      <a className="adm-feature-cta" href={FEATURE_BAR.href}>
        {FEATURE_BAR.cta}
      </a>
      {onClose && (
        <button type="button" className="adm-feature-close" onClick={onClose} aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  )
}

// ─── Rail icons (shared by Quick Actions) ────────────────────────────────
const ACTION_ICONS = {
  flag: <Icon name="flag" size={18} />,
  reward: <Icon name="award" size={18} />,
  trophy: <Icon name="trophy" size={18} />,
  chart: <Icon name="chart-bar" size={18} />,
  lexile: <Icon name="book-2" size={18} />,
  target: <Icon name="target" size={18} />,
  user: <Icon name="user" size={18} />,
  classes: <Icon name="users" size={18} />,
  book: <Icon name="book-2" size={18} />,
}

const CogIcon = () => <Icon name="settings" size={14} />

// ─── Quick Actions card ──────────────────────────────────────────────────
// A compact launcher of the most common jumps, keyed by role. The first three
// land above the fold.
function QuickActionsCard({ role = 'teacher' }) {
  const actions = QUICK_ACTIONS[role] || QUICK_ACTIONS.teacher
  return (
    <div className="adm-rail-card adm-rail-card--quick">
      <div className="adm-rail-head">
        <h3 className="adm-rail-title">Quick Actions</h3>
      </div>
      <div className="adm-quick-actions">
        {actions.map((a) => (
          <a key={a.id} href="#" className="adm-quick-action" onClick={(e) => e.preventDefault()}>
            <span className="adm-quick-action-ico">
              {ACTION_ICONS[a.icon] || ACTION_ICONS.target}
            </span>
            <span className="adm-quick-action-label">{a.label}</span>
            <span className="adm-quick-action-chev" aria-hidden="true">
              ›
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── Engagement card (rail-fixed; no settings) ───────────────────────────
function EngagementCard() {
  const { current, levels } = ENGAGEMENT
  // Active level = highest `min` ≤ current. Next level (if any) drives the
  // "Next Level" row at the bottom.
  let activeIdx = 0
  for (let i = 0; i < levels.length; i++) {
    if (current >= levels[i].min) activeIdx = i
  }
  const active = levels[activeIdx]
  const next = levels[activeIdx + 1]
  return (
    <div className="adm-rail-card adm-rail-card--engagement">
      <div className="adm-rail-head">
        <h3 className="adm-rail-title">Engagement</h3>
      </div>
      <div className="adm-rca">
        <div className="adm-rca-row">
          <span className={`adm-rca-val adm-rca-val--${active.color}`}>{active.name}</span>
          <span className="adm-rca-meta">{current}% engaged</span>
        </div>
        <div className="adm-rca-bar" style={{ '--active': activeIdx }}>
          {levels.map((lv, i) => (
            <span
              key={lv.id}
              className={`adm-rca-seg adm-rca-seg--${lv.color} ${i === activeIdx ? 'is-active' : ''}`}
            />
          ))}
          <span className={`adm-bar-thumb adm-bar-thumb--${active.color}`} aria-hidden="true" />
        </div>
        {next && (
          <div className="adm-rca-foot">
            Next level: <strong>{next.name}</strong> at {next.min}%
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Community / District Goal card (rail-fixed; scope is editable via cog) ──
const fmtN = (n) => n.toLocaleString()
function shortGoal(n) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(0)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}
export const GOAL_FIELDS = [
  {
    key: 'scope',
    label: 'Show',
    type: 'select',
    help: 'Pick which goal to display.',
    options: [
      { value: 'community', label: 'Community Goal' },
      { value: 'district', label: 'District Goal' },
    ],
  },
]
export const GOAL_DEFAULTS = { scope: 'community' }

function CommunityGoalCard({
  editing,
  settings,
  openSettings,
  setOpenSettings,
  onChange,
  onReset,
}) {
  const scope = settings.scope || 'community'
  const g = GOAL_OPTIONS[scope] || GOAL_OPTIONS.community
  const pct = Math.min(100, Math.round((g.value / g.goal) * 100))
  // District goals are set centrally — only the community goal is user-managed.
  const canEdit = scope === 'community'
  const isSettingsOpen = openSettings?.id === 'community-goal'
  return (
    <div className="adm-rail-card adm-rail-card--goal">
      <div className="adm-rail-head">
        <h3 className="adm-rail-title">{g.name}</h3>
        <div className="adm-rail-head-actions">
          {canEdit && !editing && (
            <button type="button" className="adm-rail-action">
              Update Goal
            </button>
          )}
          {editing && (
            <button
              type="button"
              className={`adm-rail-cog ${isSettingsOpen ? 'is-on' : ''}`}
              onClick={(e) =>
                setOpenSettings(
                  isSettingsOpen
                    ? null
                    : { id: 'community-goal', anchorRect: e.currentTarget.getBoundingClientRect() },
                )
              }
              title="Goal settings"
              aria-label="Goal settings"
            >
              <CogIcon />
            </button>
          )}
        </div>
      </div>
      <div className="adm-goal-widget">
        <div className="adm-goal-row">
          <span className="adm-goal-val">{fmtN(g.value)}</span>
          <span className="adm-goal-meta">
            / {shortGoal(g.goal)} {g.unit}
          </span>
        </div>
        <div className="adm-goal-bar">
          <div className="adm-goal-fill adm-goal-fill--blue" style={{ width: `${pct}%` }} />
          <span
            className="adm-bar-thumb adm-bar-thumb--blue"
            style={{ left: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="adm-goal-pct">{pct}% of goal</div>
      </div>
      {isSettingsOpen && (
        <SettingsPopover
          anchorRect={openSettings.anchorRect}
          fields={GOAL_FIELDS}
          value={settings}
          defaults={GOAL_DEFAULTS}
          onChange={onChange}
          onReset={onReset}
          onClose={() => setOpenSettings(null)}
        />
      )}
    </div>
  )
}

// ─── Right rail ──────────────────────────────────────────────────────────
// Quick Actions launcher, then Engagement (teacher/media only) and the
// Community/District Goal card. Both rail blocks are fixed (not draggable
// widgets) but their settings are still editable via the cog in edit mode.
export function FixedRail({
  editing = false,
  role = 'teacher',
  settings = {},
  updateSettings,
  resetSettings,
  openSettings,
  setOpenSettings,
}) {
  const showEngagement =
    role === 'teacher' ||
    role === 'media' ||
    role === 'kitchen' ||
    role === 'kitchen-full' ||
    role === 'empty'
  const goalSettings = { ...GOAL_DEFAULTS, ...(settings['community-goal'] || {}) }
  return (
    <aside className="adm-rail">
      <QuickActionsCard role={role} />
      {showEngagement && <EngagementCard />}
      <CommunityGoalCard
        editing={editing}
        settings={goalSettings}
        openSettings={openSettings}
        setOpenSettings={setOpenSettings}
        onChange={(patch) => updateSettings?.('community-goal', patch)}
        onReset={() => resetSettings?.('community-goal')}
      />
    </aside>
  )
}
