import { FEATURE_BAR, QUICK_ACTIONS, ACTIONS, ADMIN_STATE, ACTION_ROW_CAP } from "../data";

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

// ─── Rail icons (shared by Flagged Sessions + Quick Actions) ─────────────
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
// ─── "This week" attention list (what to pay attention to) ───────────────
// Vertical, compact list of the things needing attention this week: contextual
// CTAs derived from ADMIN_STATE (no goal in 12+ months, no live challenges)
// surface first, then role-relevant actions.
function ActionList({ role = "teacher" }) {
  const items = ACTIONS.filter((a) => !a.roles || a.roles.includes(role));
  const conditional = [];
  if (ADMIN_STATE.goalUpdatedMonthsAgo > 12) {
    conditional.push({
      id: "cta-goal", title: "Set this year's goal", subtitle: `Last updated ${ADMIN_STATE.goalUpdatedMonthsAgo} months ago`,
      icon: "target", cta: "Set goal", tone: "warn",
    });
  }
  if (ADMIN_STATE.liveChallengeCount === 0) {
    conditional.push({
      id: "cta-challenges", title: "Turn on a challenge", subtitle: "No live challenges right now",
      icon: "trophy", cta: "Auto-publish", tone: "warn",
    });
  }
  const cap = (typeof ACTION_ROW_CAP === "object" ? ACTION_ROW_CAP[role] : ACTION_ROW_CAP) ?? 4;
  const slotsForRole = Math.max(0, cap - conditional.length);
  const tiles = [...conditional, ...items.slice(0, slotsForRole)];
  if (!tiles.length) return null;
  return (
    <div className="adm-rail-card adm-rail-card--actions">
      <div className="adm-rail-head">
        <h3 className="adm-rail-title">This week</h3>
      </div>
      <ul className="adm-rail-actions">
        {tiles.map((t) => (
          <li key={t.id} className={`adm-rail-action-row ${t.tone ? `adm-rail-action-row--${t.tone}` : ""}`}>
            <span className="adm-rail-action-ico">{ACTION_ICONS[t.icon] || ACTION_ICONS.target}</span>
            <div className="adm-rail-action-text">
              <div className="adm-rail-action-title">{t.title}</div>
              <div className="adm-rail-action-sub">{t.subtitle}</div>
            </div>
            <button type="button" className={`adm-action-btn ${t.tone ? `adm-action-btn--${t.tone}` : ""}`}>
              {t.cta || "Open"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Quick Actions card ──────────────────────────────────────────────────
// A compact launcher of the most common jumps, keyed by role. Sits under the
// Flagged Sessions block. The first three land above the fold.
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

// ─── Right rail ──────────────────────────────────────────────────────────
// Role-aware Quick Actions launcher + a "This week" attention list. (Flagged
// Sessions now lives in the editable grid as a widget.)
export function FixedRail({ editing = false, role = "teacher" }) {
  return (
    <aside className="adm-rail">
      <QuickActionsCard role={role} />
      <ActionList role={role} />
    </aside>
  );
}
