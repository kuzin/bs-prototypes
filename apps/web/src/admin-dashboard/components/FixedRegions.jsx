import { useState, useRef } from "react";
import { NOTIFICATIONS, GOAL_OPTIONS, WHATS_NEW, FEATURE_BAR, ACTIONS, ADMIN_STATE, ACTION_ROW_CAP } from "../data";
import { SettingsPopover } from "./SettingsPopover";

const fmt = (n) => n.toLocaleString();
const RAIL_GOAL_KEY = "adm-rail-goal-scope";

const RAIL_GOAL_FIELDS = [
  { key: "scope", label: "Show", type: "select",
    help: "Pick which goal to show in the right rail.",
    options: [
      { value: "community", label: "Community Goal" },
      { value: "district",  label: "District Goal" },
    ]},
];

// Tiny svg cog (matches the in-widget version)
const RailCog = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// ─── Alerts card (lives in the right rail on desktop, moves to top on mobile) ─
export function AlertsCard() {
  if (!NOTIFICATIONS.length) return null;
  return (
    <div className="adm-rail-card adm-rail-card--alerts">
      <div className="adm-rail-alerts">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className={`adm-alert adm-alert--${n.tone}`}>
            <div className="adm-alert-row">
              <span className="adm-alert-ico">
                {n.tone === "warn" ? "⚠" : n.tone === "danger" ? "✕" : n.tone === "good" ? "✓" : "🔥"}
              </span>
              <div className="adm-alert-text">
                <div className="adm-alert-title">{n.title}</div>
                {n.body && <div className="adm-alert-body">{n.body}</div>}
                {n.action && <button className="adm-alert-cta">{n.action}</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Community / District Goal (right rail) ─────────────────────────────
function CommunityGoalCard({ editing = false }) {
  const [scope, setScope] = useState(() => {
    try { return localStorage.getItem(RAIL_GOAL_KEY) || "community"; } catch { return "community"; }
  });
  const [settingsOpen, setSettingsOpen] = useState(null); // anchorRect | null
  const cogRef = useRef(null);

  const g = GOAL_OPTIONS[scope] || GOAL_OPTIONS.community;
  const pct = Math.min(100, Math.round((g.value / g.goal) * 100));
  const goalShort = g.goal >= 1_000_000_000 ? `${(g.goal / 1_000_000_000).toFixed(0)}B`
                  : g.goal >= 1_000_000     ? `${(g.goal / 1_000_000).toFixed(0)}M`
                  : g.goal >= 1_000         ? `${(g.goal / 1_000).toFixed(0)}K`
                  : g.goal;

  function updateScope(next) {
    setScope(next);
    try { localStorage.setItem(RAIL_GOAL_KEY, next); } catch {}
  }

  return (
    <div className="adm-rail-card">
      <div className="adm-rail-head">
        <h3 className="adm-rail-title">{g.name}</h3>
        <div className="adm-rail-head-actions">
          {editing && (
            <button
              ref={cogRef}
              type="button"
              className="adm-rail-cog"
              onClick={() => {
                if (settingsOpen) setSettingsOpen(null);
                else setSettingsOpen(cogRef.current.getBoundingClientRect());
              }}
              title="Goal settings"
              aria-label="Goal settings"
            >
              <RailCog />
            </button>
          )}
          <button className="adm-rail-action">Update Goal</button>
        </div>
      </div>
      <div className="adm-rail-goal">
        <div className="adm-rail-goal-row">
          <span className="adm-rail-goal-val">{fmt(g.value)}</span>
          <span className="adm-rail-goal-meta">/ {goalShort} {g.unit}</span>
        </div>
        <div className="adm-goal-bar">
          <div className="adm-goal-fill adm-goal-fill--blue" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {settingsOpen && (
        <SettingsPopover
          anchorRect={settingsOpen}
          fields={RAIL_GOAL_FIELDS}
          value={{ scope }}
          defaults={{ scope: "community" }}
          onChange={(patch) => updateScope(patch.scope)}
          onReset={() => updateScope("community")}
          onClose={() => setSettingsOpen(null)}
        />
      )}
    </div>
  );
}

// ─── What's New cards (right rail) ────────────────────────────────────────
function WhatsNewSection() {
  return (
    <div className="adm-rail-card">
      <div className="adm-rail-head">
        <h3 className="adm-rail-title">What's New?</h3>
        <a className="adm-rail-action" href="#">View Blog</a>
      </div>
      <div className="adm-rail-news">
        {WHATS_NEW.map((n) => (
          <article key={n.id} className="adm-news">
            <div className={`adm-news-img adm-news-img--${n.kind}`}>
              {n.kind === "badges" && (
                <div className="adm-news-badges">
                  <span className="adm-news-badge adm-news-badge--gold">SPARK</span>
                  <span className="adm-news-badge adm-news-badge--green">IGNITER</span>
                  <span className="adm-news-badge adm-news-badge--pink">PATHFINDER</span>
                  <span className="adm-news-badge adm-news-badge--purple">TRAILBLAZER</span>
                </div>
              )}
              {n.kind === "case-study" && (
                <div className="adm-news-illust">
                  <div className="adm-news-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <span key={i} className={`adm-news-cell ${i < 5 ? "is-check" : ""}`}>
                        {i < 5 ? "✓" : "📖"}
                      </span>
                    ))}
                  </div>
                  <div className="adm-news-figure">👩🏻‍🦰📱</div>
                </div>
              )}
              {n.kind === "event" && (
                <div className="adm-news-event">
                  <div className="adm-news-event-logo">
                    <span className="adm-news-event-heart">💛</span>
                    <span>beanstack <span className="adm-news-event-edu">edu</span></span>
                  </div>
                  <div className="adm-news-event-sub">School &amp; District Admins</div>
                  {n.date && (
                    <div className="adm-news-event-date">
                      <span className="m">{n.date.month}</span>
                      <span className="d">{n.date.day}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="adm-news-body">
              <div className="adm-news-cat">{n.category}</div>
              <h4 className="adm-news-title">{n.title}</h4>
              <a href={n.href} className="adm-news-link">{n.cta} ›</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

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

// ─── Action row (admin-controlled, sits above the editable grid) ─────────
// Renders ACTIONS filtered by role, plus conditional CTAs derived from
// ADMIN_STATE (no goal in 12+ months, no live challenges). Not editable —
// the brief asks us to drive users toward action ASAP, so these stay pinned.
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
};
export function ActionRow({ role = "teacher" }) {
  const items = ACTIONS.filter((a) => !a.roles || a.roles.includes(role));
  // Conditional admin CTAs — inserted at the front so they're hard to miss.
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
  // Conditional CTAs always show; remaining slots are filled with role
  // actions in their declared (priority) order. Total is capped so the row
  // doesn't sprawl past the most important 3–4 things.
  const cap = (typeof ACTION_ROW_CAP === "object" ? ACTION_ROW_CAP[role] : ACTION_ROW_CAP) ?? 4;
  const slotsForRole = Math.max(0, cap - conditional.length);
  const tiles = [...conditional, ...items.slice(0, slotsForRole)];
  if (!tiles.length) return null;
  return (
    <section className="adm-action-row" aria-label="Quick actions">
      {tiles.map((t) => (
        <div
          key={t.id}
          className={`adm-action ${t.tone ? `adm-action--${t.tone}` : ""}`}
        >
          <span className="adm-action-ico">{ACTION_ICONS[t.icon] || ACTION_ICONS.target}</span>
          <span className="adm-action-text">
            <span className="adm-action-title">{t.title}</span>
            <span className="adm-action-sub">{t.subtitle}</span>
          </span>
          <button type="button" className={`adm-action-btn ${t.tone ? `adm-action-btn--${t.tone}` : ""}`}>
            {t.cta || "Open"}
          </button>
        </div>
      ))}
    </section>
  );
}

// ─── Right rail combo ──────────────────────────────────────────────────────
// Engagement moved out of the rail into the editable grid (see widgets.jsx).
export function FixedRail({ editing = false, role = "teacher" }) {
  return (
    <aside className="adm-rail">
      <AlertsCard />
      <CommunityGoalCard editing={editing} />
      <WhatsNewSection />
    </aside>
  );
}
