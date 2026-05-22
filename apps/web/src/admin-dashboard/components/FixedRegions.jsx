import { useState, useRef } from "react";
import { NOTIFICATIONS, GOAL_OPTIONS, WHATS_NEW, FEATURE_BAR, ENGAGEMENT } from "../data";
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

// ─── Engagement tracker (variants per role) ─────────────────────────────
function EngagementCard({ role = "teacher" }) {
  const e = ENGAGEMENT[role] || ENGAGEMENT.teacher;
  // Build the 3 segmented progress bar — pill above the active segment
  const segments = [
    { color: "red",    label: "0–3" },
    { color: "yellow", label: "4–9" },
    { color: "green",  label: "10+" },
  ];
  const activeIdx = e.active <= 3 ? 0 : e.active <= 9 ? 1 : 2;
  const tone = segments[activeIdx].color;
  return (
    <div className="adm-rail-card adm-engage">
      <div className="adm-rail-head">
        <h3 className="adm-rail-title">{e.title}</h3>
      </div>
      <div className={`adm-engage-bar adm-engage-bar--${tone}`}>
        {segments.map((s, i) => (
          <span key={i} className={`adm-engage-seg adm-engage-seg--${s.color} ${i === activeIdx ? "is-active" : ""}`} />
        ))}
      </div>
      <div className={`adm-engage-pill adm-engage-pill--${tone}`}>
        {e.active} {e.label}
      </div>
      <p className="adm-engage-msg">{e.message}</p>
      {e.cta && tone === "green" && (
        <button className="adm-btn adm-btn--primary" style={{ alignSelf: "flex-start" }}>{e.cta}</button>
      )}
    </div>
  );
}

// ─── Right rail combo ──────────────────────────────────────────────────────
export function FixedRail({ editing = false, role = "teacher" }) {
  return (
    <aside className="adm-rail">
      <AlertsCard />
      <CommunityGoalCard editing={editing} />
      <EngagementCard role={role} />
      <WhatsNewSection />
    </aside>
  );
}
