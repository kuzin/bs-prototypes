import { FEATURE_BAR, QUICK_ACTIONS, ENGAGEMENT, GOAL_OPTIONS } from "../data";
import { SettingsPopover } from "./SettingsPopover";

// ─── Feature announcement bar (admin-controlled, not editable) ───────────
export function FeatureBar({ onClose }) {
  if (!FEATURE_BAR) return null;
  return (
    <div className="adm-feature-bar">
      <span className="adm-feature-badge">{FEATURE_BAR.badge}</span>
      <div className="adm-feature-text">
        <div className="adm-feature-title">{FEATURE_BAR.title}</div>
        <div className="adm-feature-body">{FEATURE_BAR.body}</div>
      </div>
      <a className="adm-feature-cta" href={FEATURE_BAR.href}>{FEATURE_BAR.cta}</a>
      {onClose && (
        <button
          type="button"
          className="adm-feature-close"
          onClick={onClose}
          aria-label="Dismiss"
        >✕</button>
      )}
    </div>
  );
}

// ─── Rail icons (shared by Quick Actions) ────────────────────────────────
const ACTION_ICONS = {
  flag: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 2v16" /><path d="M4 3h11l-2 3 2 3H4" />
    </svg>
  ),
  reward: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="8" r="4.5" /><path d="M7 12l-1.5 5L10 15l4.5 2L13 12" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 3h10v4a5 5 0 0 1-10 0z" /><path d="M5 5H3v1a3 3 0 0 0 2 2.8" /><path d="M15 5h2v1a3 3 0 0 1-2 2.8" /><path d="M10 12v3" /><path d="M6.5 17h7" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 17h14" /><rect x="5" y="9" width="2.5" height="6" rx="0.5" /><rect x="9" y="5" width="2.5" height="10" rx="0.5" /><rect x="13" y="11" width="2.5" height="4" rx="0.5" />
    </svg>
  ),
  lexile: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4h7a3 3 0 0 1 3 3v10a2 2 0 0 0-2-2H3z" /><path d="M17 4h-4a3 3 0 0 0-3 3v10a2 2 0 0 1 2-2h5z" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" /><circle cx="10" cy="10" r="4" /><circle cx="10" cy="10" r="1" fill="currentColor" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="7" r="3.2" /><path d="M3.5 17c0-3.2 2.9-5.5 6.5-5.5s6.5 2.3 6.5 5.5" />
    </svg>
  ),
  classes: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7" cy="7" r="2.5" /><circle cx="14" cy="8" r="2" /><path d="M2 16c0-2.5 2-4 5-4s5 1.5 5 4" /><path d="M12 16c0-1.8 1.5-3 3-3s3 1.2 3 3" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4h6a2.5 2.5 0 0 1 2.5 2.5V17a2 2 0 0 0-2-2H3z" /><path d="M17 4h-6A2.5 2.5 0 0 0 8.5 6.5V17a2 2 0 0 1 2-2H17z" />
    </svg>
  ),
};

const CogIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// ─── Quick Actions card ──────────────────────────────────────────────────
// A compact launcher of the most common jumps, keyed by role. The first three
// land above the fold.
function QuickActionsCard({ role = "teacher" }) {
  const actions = QUICK_ACTIONS[role] || QUICK_ACTIONS.teacher;
  return (
    <div className="adm-rail-card adm-rail-card--quick">
      <div className="adm-rail-head">
        <h3 className="adm-rail-title">Quick Actions</h3>
      </div>
      <div className="adm-quick-actions">
        {actions.map((a) => (
          <a
            key={a.id}
            href="#"
            className="adm-quick-action"
            onClick={(e) => e.preventDefault()}
          >
            <span className="adm-quick-action-ico">{ACTION_ICONS[a.icon] || ACTION_ICONS.target}</span>
            <span className="adm-quick-action-label">{a.label}</span>
            <span className="adm-quick-action-chev" aria-hidden="true">›</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Engagement card (rail-fixed; no settings) ───────────────────────────
function EngagementCard() {
  const { current, levels } = ENGAGEMENT;
  // Active level = highest `min` ≤ current. Next level (if any) drives the
  // "Next Level" row at the bottom.
  let activeIdx = 0;
  for (let i = 0; i < levels.length; i++) {
    if (current >= levels[i].min) activeIdx = i;
  }
  const active = levels[activeIdx];
  const next = levels[activeIdx + 1];
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
        <div className="adm-rca-bar" style={{ "--active": activeIdx }}>
          {levels.map((lv, i) => (
            <span key={lv.id} className={`adm-rca-seg adm-rca-seg--${lv.color} ${i === activeIdx ? "is-active" : ""}`} />
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
  );
}

// ─── Community / District Goal card (rail-fixed; scope is editable via cog) ──
const fmtN = (n) => n.toLocaleString();
function shortGoal(n) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(0)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
export const GOAL_FIELDS = [
  { key: "scope", label: "Show", type: "select",
    help: "Pick which goal to display.",
    options: [
      { value: "community", label: "Community Goal" },
      { value: "district",  label: "District Goal" },
    ]},
];
export const GOAL_DEFAULTS = { scope: "community" };

function CommunityGoalCard({
  editing,
  settings,
  openSettings,
  setOpenSettings,
  onChange,
  onReset,
}) {
  const scope = settings.scope || "community";
  const g = GOAL_OPTIONS[scope] || GOAL_OPTIONS.community;
  const pct = Math.min(100, Math.round((g.value / g.goal) * 100));
  // District goals are set centrally — only the community goal is user-managed.
  const canEdit = scope === "community";
  const isSettingsOpen = openSettings?.id === "community-goal";
  return (
    <div className="adm-rail-card adm-rail-card--goal">
      <div className="adm-rail-head">
        <h3 className="adm-rail-title">{g.name}</h3>
        <div className="adm-rail-head-actions">
          {canEdit && !editing && (
            <button type="button" className="adm-rail-action">Update Goal</button>
          )}
          {editing && (
            <button
              type="button"
              className={`adm-rail-cog ${isSettingsOpen ? "is-on" : ""}`}
              onClick={(e) =>
                setOpenSettings(
                  isSettingsOpen
                    ? null
                    : { id: "community-goal", anchorRect: e.currentTarget.getBoundingClientRect() }
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
          <span className="adm-goal-meta">/ {shortGoal(g.goal)} {g.unit}</span>
        </div>
        <div className="adm-goal-bar">
          <div className="adm-goal-fill adm-goal-fill--blue" style={{ width: `${pct}%` }} />
          <span className="adm-bar-thumb adm-bar-thumb--blue" style={{ left: `${pct}%` }} aria-hidden="true" />
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
  );
}

// ─── Right rail ──────────────────────────────────────────────────────────
// Quick Actions launcher, then Engagement (teacher/media only) and the
// Community/District Goal card. Both rail blocks are fixed (not draggable
// widgets) but their settings are still editable via the cog in edit mode.
export function FixedRail({
  editing = false,
  role = "teacher",
  settings = {},
  updateSettings,
  resetSettings,
  openSettings,
  setOpenSettings,
}) {
  const showEngagement = role === "teacher" || role === "media" || role === "kitchen";
  const goalSettings = { ...GOAL_DEFAULTS, ...(settings["community-goal"] || {}) };
  return (
    <aside className="adm-rail">
      <QuickActionsCard role={role} />
      {showEngagement && <EngagementCard />}
      <CommunityGoalCard
        editing={editing}
        settings={goalSettings}
        openSettings={openSettings}
        setOpenSettings={setOpenSettings}
        onChange={(patch) => updateSettings?.("community-goal", patch)}
        onReset={() => resetSettings?.("community-goal")}
      />
    </aside>
  );
}
