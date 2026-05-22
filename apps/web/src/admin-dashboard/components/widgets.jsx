import {
  NOTIFICATIONS, STAT_TILES, DAILY_TRACKER, LEADERBOARDS,
  LINKS, QUESTIONS,
} from "../data";
import { useState } from "react";

const fmt = (n) => n.toLocaleString();

// ─── Width system ────────────────────────────────────────────────────────────
// Every widget has a universal "Width" setting (S/M/L/Full). The selected
// width maps to grid columns; settings.width drives layouts.lg[i].w.
export const WIDTH_TO_COLS = { sm: 4, md: 6, lg: 8, full: 12 };
export const COLS_TO_WIDTH = (w) =>
  w <= 4  ? "sm"
  : w <= 6  ? "md"
  : w <= 8  ? "lg"
  :           "full";
export const WIDTH_FIELD = {
  key: "width", label: "Width", type: "select",
  options: [
    { value: "sm",   label: "Small (1/3)" },
    { value: "md",   label: "Medium (1/2)" },
    { value: "lg",   label: "Large (2/3)" },
    { value: "full", label: "Full width" },
  ],
};

// ─── Notifications ───────────────────────────────────────────────────────
export function AdmNotifications() {
  return (
    <div className="adm-w" style={{ padding: 14 }}>
      <div className="adm-banners">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className={`adm-banner adm-banner--${n.tone}`}>
            <div className="adm-banner-ico">
              {n.tone === "warn" ? "⚠" : n.tone === "danger" ? "✕" : n.tone === "good" ? "✓" : "🔥"}
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
  );
}

// ─── Stat tiles ──────────────────────────────────────────────────────────
const STAT_RANGE_LABEL = {
  week:  "This Week",
  month: "This Month",
  year:  "This Year",
};
export function AdmStatTiles({ settings = {}, role = "teacher" }) {
  // Tiles available to this role (staff-related ones are media-only)
  const available = STAT_TILES.filter((s) => !s.roles || s.roles.includes(role));
  const selectedIds = settings.selected && settings.selected.length
    ? settings.selected
    : available.map((s) => s.id);
  const range = settings.range || "week";
  // Preserve catalog order, drop any selected ids the role can't see.
  const tiles = available.filter((s) => selectedIds.includes(s.id));
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <div className="adm-w-title">
          What's Happened
          <span className="adm-w-meta">{STAT_RANGE_LABEL[range]}</span>
        </div>
        <button className="adm-w-action">View report</button>
      </div>
      <div className="adm-w-body">
        <div className="adm-stats">
          {tiles.map((s) => (
            <div key={s.id} className={`adm-stat adm-stat--${s.color}`}>
              <div className="adm-stat-ico">{s.icon === "ti-user" ? "👤" : "⏱"}</div>
              <div>
                <div className="adm-stat-val">{s.value}</div>
                <div className="adm-stat-lbl">{s.label}</div>
              </div>
            </div>
          ))}
          {tiles.length === 0 && (
            <div className="adm-stats-empty">
              Pick at least one metric in widget settings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const STAT_DEFAULTS = {
  selected: STAT_TILES.map((s) => s.id),
  range: "week",
};
const STAT_FIELDS = [
  { key: "selected", label: "Show metrics", type: "multi",
    help: "Pick which stat tiles appear in this widget.",
    options: STAT_TILES.map((s) => ({ value: s.id, label: s.label })) },
  { key: "range", label: "Time range", type: "select", options: [
    { value: "week",  label: "This week" },
    { value: "month", label: "This month" },
    { value: "year",  label: "This year" },
  ]},
];

// ─── Daily reading tracker ───────────────────────────────────────────────
// Per-student table modeled on the Student Profile AdminMockup class view:
// each row is a student with their own goal, a weekly average, and a check
// circle (or partial-percent pill / dash) for each day. Class Average row
// at the bottom + a color-key legend in the footer.
const GROUP_LABEL = {
  "class-a": "Class A · Grade 3",
  "class-b": "Class B · Grade 4",
  "class-c": "Class C · Grade 5",
  "grade-3": "Grade 3",
  "grade-4": "Grade 4",
};
const EditIcon = () => (
  <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8.5 1.5 l2 2 L3 11 l-2.5.5.5-2.5z"/>
    <path d="M7 3l2 2"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 10 10" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="1.5,5 4,7.5 8.5,2.5"/>
  </svg>
);
export function AdmDailyTracker({ settings = {} }) {
  const group = settings.group || "class-a";
  const t = DAILY_TRACKER;
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <div className="adm-w-title">
          Daily Reading Tracker
          <span className="adm-w-meta">{GROUP_LABEL[group] || "Class A · Grade 3"}</span>
        </div>
        <button className="adm-w-action">View class</button>
      </div>
      <div className="adm-w-body adm-drt">
        <div className="adm-drt-week-nav">
          <button className="adm-drt-nav-btn" aria-label="Previous week">‹</button>
          <span className="adm-drt-week-label">{t.range}</span>
          <button className="adm-drt-nav-btn" aria-label="Next week" disabled>›</button>
        </div>
        <table className="adm-drt-table">
          <thead>
            <tr>
              <th className="adm-drt-th adm-drt-th--student">Student</th>
              <th className="adm-drt-th adm-drt-th--goal">Goal</th>
              <th className="adm-drt-th adm-drt-th--center">Average</th>
              {t.days.map((d) => (
                <th key={d} className="adm-drt-th adm-drt-th--center">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((s) => (
              <tr key={s.id} className="adm-drt-row">
                <td className="adm-drt-td">
                  <div className="adm-drt-student">
                    <span className={`adm-drt-rank adm-drt-rank--${s.rank===1?"gold":s.rank===2?"silver":"bronze"}`}>{s.rank}</span>
                    <span className="adm-drt-student-name">{s.name}</span>
                  </div>
                </td>
                <td className="adm-drt-td adm-drt-td--goal">
                  <div className="adm-drt-goal-cell">
                    <span className="adm-drt-goal-val">{s.goal}</span>
                    <button className="adm-drt-edit-btn" title="Edit goal" onClick={(e) => e.stopPropagation()}>
                      <EditIcon />
                    </button>
                  </div>
                </td>
                <td className="adm-drt-td adm-drt-td--center">
                  <span className={`adm-drt-pct adm-drt-pct--${s.ac}`}>{s.avg}%</span>
                </td>
                {s.days.map((d, i) => (
                  <td key={i} className="adm-drt-td adm-drt-td--center">
                    {d === null
                      ? <span className="adm-drt-dash">–</span>
                      : d === true
                      ? <span className="adm-drt-check"><CheckIcon /></span>
                      : <span className={`adm-drt-pct adm-drt-pct--${s.ac === "red" ? "red" : "orange"}`}>{d}</span>}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="adm-drt-avg-row">
              <td className="adm-drt-td">
                <div className="adm-drt-student">
                  <span className="adm-drt-rank adm-drt-rank--avg" aria-hidden="true" />
                  <span>Class Average</span>
                </div>
              </td>
              <td className="adm-drt-td adm-drt-td--goal" />
              <td className="adm-drt-td adm-drt-td--center">{t.classAverage.avg}%</td>
              {t.classAverage.days.map((v, i) => (
                <td key={i} className="adm-drt-td adm-drt-td--center">{v === null ? "–" : v}</td>
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
  );
}
const TRACKER_DEFAULTS = { group: "class-a" };
const TRACKER_FIELDS = [
  { key: "group", label: "Class", type: "select", options: [
    { value: "class-a", label: "Class A · Grade 3" },
    { value: "class-b", label: "Class B · Grade 4" },
    { value: "class-c", label: "Class C · Grade 5" },
    { value: "grade-3", label: "Grade 3" },
    { value: "grade-4", label: "Grade 4" },
  ]},
];

// ─── Leaderboard (generic, settings-driven) ──────────────────────────────
// Parse the numeric portion of "250 Minutes" / "3,948 Minutes" → 250 / 3948
function parseValue(v) {
  return parseInt(String(v).replace(/[^0-9]/g, ""), 10) || 0;
}

const SORT_FNS = {
  "active-desc": (a, b) => parseValue(b.value) - parseValue(a.value),
  "active-asc":  (a, b) => parseValue(a.value) - parseValue(b.value),
  "alpha":       (a, b) => a.name.localeCompare(b.name),
  "recent":      (a, b) => b.id - a.id, // proxy: higher id = more recent
};

const SORT_LABEL = {
  "active-desc": "Most Active",
  "active-asc":  "Least Active",
  "alpha":       "Alphabetical",
  "recent":      "Recently Added",
};

const RANGE_LABEL = {
  "week":     "This Week",
  "lastweek": "Last Week",
  "month":    "This Month",
  "year":     "This Year",
};

function makeLeaderboard(kind, list) {
  return function ({ settings = {} }) {
    const sort  = settings.sort  || "active-desc";
    const range = settings.range || "week";
    const limit = parseInt(settings.limit || 5, 10);

    if (!list || list.length === 0) {
      return (
        <div className="adm-w">
          <div className="adm-w-head">
            <div className="adm-w-title">{kind}</div>
            <button className="adm-w-action">View Report</button>
          </div>
          <div className="adm-lb-empty">
            <h4>No Active {kind}</h4>
            <p>Get your {kind.toLowerCase()} logging to see activity.</p>
            <button className="adm-btn adm-btn--primary">Log for {kind}</button>
          </div>
        </div>
      );
    }

    const sorted = [...list].sort(SORT_FNS[sort] || SORT_FNS["active-desc"]).slice(0, limit);
    const titlePrefix = sort === "alpha" ? "" : `${SORT_LABEL[sort]} `;

    return (
      <div className="adm-w">
        <div className="adm-w-head">
          <div className="adm-w-title">
            {titlePrefix}{kind}
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
    );
  };
}
export const AdmLeaderboardStudents = makeLeaderboard("Students", LEADERBOARDS.students);
export const AdmLeaderboardClasses  = makeLeaderboard("Classes",  LEADERBOARDS.classes);
export const AdmLeaderboardStaff    = makeLeaderboard("Staff",    LEADERBOARDS.staff);

// Shared leaderboard settings schema + defaults
const LEADERBOARD_DEFAULTS = { sort: "active-desc", range: "week", limit: "15" };
const LEADERBOARD_FIELDS = [
  { key: "sort", label: "Sort by", type: "select", options: [
    { value: "active-desc", label: "Most active" },
    { value: "active-asc",  label: "Least active" },
    { value: "alpha",       label: "Alphabetical" },
    { value: "recent",      label: "Recently added" },
  ]},
  { key: "range", label: "Time range", type: "select", options: [
    { value: "week",     label: "This week" },
    { value: "lastweek", label: "Last week" },
    { value: "month",    label: "This month" },
    { value: "year",     label: "This year" },
  ]},
  { key: "limit", label: "Show top", type: "select", options: [
    { value: "5",  label: "5 rows" },
    { value: "10", label: "10 rows" },
    { value: "15", label: "15 rows" },
    { value: "25", label: "25 rows" },
  ]},
];

// ─── Quick links ──────────────────────────────────────────────────────
// Per-link semantic icons. Keys match the `icon` field on each LINKS entry.
const LINK_ICONS = {
  classes: (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="14" cy="8" r="2" />
      <path d="M2 16c0-2.5 2-4 5-4s5 1.5 5 4" />
      <path d="M12 16c0-1.8 1.5-3 3-3s3 1.2 3 3" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 3h10v4a5 5 0 0 1-10 0z" />
      <path d="M5 5H3v1a3 3 0 0 0 2 2.8" />
      <path d="M15 5h2v1a3 3 0 0 1-2 2.8" />
      <path d="M10 12v3" />
      <path d="M6.5 17h7" />
    </svg>
  ),
  flag: (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 2v16" />
      <path d="M4 3h11l-2 3 2 3H4" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" />
      <circle cx="10" cy="10" r="4" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 17h14" />
      <rect x="5"  y="9"  width="2.5" height="6" rx="0.5" />
      <rect x="9"  y="5"  width="2.5" height="10" rx="0.5" />
      <rect x="13" y="11" width="2.5" height="4" rx="0.5" />
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="4" width="10" height="13" rx="1.5" />
      <rect x="7.5" y="2.5" width="5" height="3" rx="0.8" />
      <line x1="8" y1="10" x2="13" y2="10" />
      <line x1="8" y1="13" x2="12" y2="13" />
    </svg>
  ),
};
export function AdmQuickLinks({ settings = {} }) {
  const selectedIds = settings.selected && settings.selected.length
    ? settings.selected
    : LINKS.map((l) => l.id);
  const visible = LINKS.filter((l) => selectedIds.includes(l.id));
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <div className="adm-w-title">
          Quick Links
          <span className="adm-w-meta">{visible.length} link{visible.length === 1 ? "" : "s"}</span>
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
            <div style={{ padding: 16, color: "#94A3B8", fontSize: 13 }}>
              Pick at least one link in widget settings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const QUICK_LINKS_DEFAULTS = { selected: LINKS.map((l) => l.id) };
const QUICK_LINKS_FIELDS = [
  { key: "selected", label: "Show links", type: "multi",
    help: "Pick which shortcut tiles appear in this widget.",
    options: LINKS.map((l) => ({ value: l.id, label: l.label })) },
];

// ─── Quick questions ──────────────────────────────────────────────────
const Q_ICONS = {
  clock: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><polyline points="12,7 12,12 15,15"/>
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><polyline points="8,12 11,15 16,9"/>
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z"/>
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L2 21h20z"/><line x1="12" y1="10" x2="12" y2="14"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/>
    </svg>
  ),
  trending: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,17 9,11 13,15 21,7"/><polyline points="15,7 21,7 21,13"/>
    </svg>
  ),
  people: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M14 14c2.5 0 7 1.5 7 6"/>
    </svg>
  ),
};

export function AdmQuestions({ settings = {} }) {
  const selectedIds = settings.selected && settings.selected.length
    ? settings.selected
    : QUESTIONS.slice(0, 3).map((q) => q.id);
  const list = QUESTIONS.filter((q) => selectedIds.includes(q.id));
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <div className="adm-w-title">
          Number Cruncher
          <span className="adm-w-meta">{list.length} question{list.length === 1 ? "" : "s"}</span>
        </div>
        <button className="adm-w-action">More questions</button>
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
            <div style={{ padding: 16, color: "#94A3B8", fontSize: 13 }}>
              Pick at least one question in widget settings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const QUESTIONS_DEFAULTS = { selected: ["q1", "q2", "q3"] };
const QUESTIONS_FIELDS = [
  { key: "selected", label: "Show questions", type: "multi",
    help: "Pick from the question library.",
    options: QUESTIONS.map((q) => ({ value: q.id, label: q.text })) },
];

// ─── Catalog ──────────────────────────────────────────────────────────
// `scrollable: true` means the widget has a fixed height (set in layout) and
// its body scrolls internally — good for long lists. Otherwise the dashboard
// auto-sizes the cell to fit content.
export const WIDGET_CATALOG = {
  "stat-tiles":             { name: "What's Happened",      desc: "At-a-glance metric tiles — pick which ones", min: { w: 2, h: 4 }, component: AdmStatTiles, defaults: STAT_DEFAULTS, settingsFields: STAT_FIELDS },
  "daily-tracker":          { name: "Daily Reading Tracker",desc: "Daily goal ring + 7-day star strip (full width)", min: { w: 2, h: 6 }, component: AdmDailyTracker, defaults: TRACKER_DEFAULTS, settingsFields: TRACKER_FIELDS, fixedWidth: "full" },
  "leaderboard-students":   { name: "Students", desc: "Roster of students with configurable sort", min: { w: 1, h: 6 }, component: AdmLeaderboardStudents, defaults: LEADERBOARD_DEFAULTS, settingsFields: LEADERBOARD_FIELDS, scrollable: true },
  "leaderboard-classes":    { name: "Classes",  desc: "Roster of classes with configurable sort",  min: { w: 1, h: 6 }, component: AdmLeaderboardClasses,  defaults: LEADERBOARD_DEFAULTS, settingsFields: LEADERBOARD_FIELDS, scrollable: true },
  "leaderboard-staff":      { name: "Staff",    desc: "Roster of staff with configurable sort",    min: { w: 1, h: 6 }, component: AdmLeaderboardStaff,    defaults: LEADERBOARD_DEFAULTS, settingsFields: LEADERBOARD_FIELDS, scrollable: true, roles: ["media"] },
  "quick-links":            { name: "Quick Links",          desc: "Pick which shortcut tiles to show",    min: { w: 2, h: 6 }, component: AdmQuickLinks, defaults: QUICK_LINKS_DEFAULTS, settingsFields: QUICK_LINKS_FIELDS, scrollable: true },
  "questions":              { name: "Number Cruncher",      desc: "Pick which questions to show",        min: { w: 2, h: 4 }, component: AdmQuestions, defaults: QUESTIONS_DEFAULTS, settingsFields: QUESTIONS_FIELDS },
};
