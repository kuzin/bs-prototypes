import { useState } from "react";
import "@bs/ui/css";
import {
  C, LABEL, GENRE_COLORS,
  Ic, StatusBadge, Pill, Bar, Card, SectionHeading, GoalRing, CoverImage,
} from "@bs/ui";
import { MainRail } from "../MainRail";
import { BackBar } from "../BackBar";

// ─── Heatmap data generator ───────────────────────────────────────────────────
// Monthly density modifiers per student profile (index 0 = Jan, 11 = Dec)
const MONTHLY_MODS = {
  consistent: [1.0, 1.0, 0.95, 0.95, 0.9, 0.7, 0.55, 0.6, 1.0, 1.0, 1.0, 1.05],
  peaky:      [0.7, 0.8, 1.1, 0.75, 0.85, 0.4, 0.3, 0.45, 1.1, 1.2, 0.9, 0.6],
  sporadic:   [0.5, 0.3, 0.7, 0.2, 0.6, 0.15, 0.1, 0.2, 0.45, 0.55, 0.35, 0.25],
};

function makeHeatmapData(density, profile = "consistent") {
  const map = {};
  const today = new Date("2025-05-15");
  const start = new Date("2023-09-01");
  const mods = MONTHLY_MODS[profile];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    const dow = d.getDay();
    const mon = d.getMonth();
    // two independent hash values for richer variation
    const n  = (d.getDate() * 13 + d.getMonth() * 97 + 7) % 100;
    const n2 = (d.getDate() * 31 + d.getMonth() * 53 + d.getFullYear() * 3 + 41) % 100;
    const weekend = dow === 0 || dow === 6;
    const monthMod = mods[mon] ?? 1.0;
    const adjDensity = Math.min(0.97, density * monthMod);
    const threshold = Math.min(Math.round((1 - adjDensity) * 100 * (weekend ? 1.3 : 1)), 99);
    map[key] = n < threshold ? 0 : 10 + (n2 % 45);
  }
  return map;
}

// ─── Score helpers ────────────────────────────────────────────────────────────
function motivationScore(sec) {
  const rmi = sec.rmiHistory[0];
  return Math.round((rmi.motivationAvg / rmi.motivationMax) * 100);
}
function sectionScore(key, sec) {
  return key === "motivation" ? motivationScore(sec) : sec.score;
}
function compositeScore(sections) {
  const vals = Object.entries(sections).map(([k, s]) => sectionScore(k, s));
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

// ─── Section tag chip ─────────────────────────────────────────────────────────
function SectionTag({ sectionKey }) {
  const c = C[sectionKey];
  return (
    <span className="bp-section-tag" style={{ "--tag-bg": c.bg, "--tag-color": c.text }}>
      <Ic name={c.icon} size={11} />
      {LABEL[sectionKey]}
    </span>
  );
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
  );
}

// ─── Dropdown menu ────────────────────────────────────────────────────────────
function DropdownMenu({ items, onClose }) {
  return (
    <>
      <div className="bp-dropdown-backdrop" onClick={onClose} />
      <div className="bp-dropdown">
        {items.map((item, i) =>
          item.divider
            ? <div key={i} className="bp-dropdown-divider" />
            : (
              <button key={i} className="bp-dropdown-item" onClick={onClose}
                style={item.color ? { color: item.color } : {}}>
                {item.icon && <span className="bp-dropdown-item-icon">{item.icon}</span>}
                {item.label}
              </button>
            )
        )}
      </div>
    </>
  );
}

// ─── Reusable student action buttons (3-dots + Log) ───────────────────────────
function StudentActions() {
  const [dotsOpen, setDotsOpen] = useState(false);
  const [logOpen,  setLogOpen]  = useState(false);

  const dotsItems = [
    { label: "Add a Review" },
    { label: "Add Notes" },
    { divider: true },
    { label: "Verify Student",  icon: "✅", color: "#1D4ED8" },
    { label: "Suspend Student", icon: "🚫", color: "#DC2626" },
  ];
  const logItems = [
    { label: "Log Reading" },
    { label: "Log Activities" },
  ];

  return (
    <div className="bp-student-actions">
      <div className="bp-dropdown-anchor">
        <button
          className="bp-btn-ghost"
          aria-label="More options"
          onClick={() => { setDotsOpen(o => !o); setLogOpen(false); }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="3.5" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="8"   r="1.5" fill="currentColor"/>
            <circle cx="8" cy="12.5" r="1.5" fill="currentColor"/>
          </svg>
        </button>
        {dotsOpen && <DropdownMenu items={dotsItems} onClose={() => setDotsOpen(false)} />}
      </div>
      <div className="bp-dropdown-anchor">
        <button
          className="bp-btn-primary"
          onClick={() => { setLogOpen(o => !o); setDotsOpen(false); }}
        >
          Log <Ic name="ti-chevron-down" size={13} />
        </button>
        {logOpen && <DropdownMenu items={logItems} onClose={() => setLogOpen(false)} />}
      </div>
    </div>
  );
}

// ─── Persistent student header ────────────────────────────────────────────────
function StudentHeader({ student, onClose }) {
  return (
    <div className="bp-panel-header">
      <div className="bp-panel-identity">
        <div className="bp-panel-avatar">
          {student.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
        </div>
        <div>
          <div className="bp-panel-name">{student.name}</div>
          <div className="bp-panel-meta">{student.grade}</div>
        </div>
      </div>
      <div className="bp-header-right">
        <StudentActions />
        {onClose && (
          <button className="bp-header-close" onClick={onClose} aria-label="Close profile">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Left nav ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: "ti-user",           section: null,             label: "Overview"   },
  { icon: "ti-flame",          section: "motivation",     label: "Motivation" },
  { icon: "ti-shield-check",   section: "integrity",      label: "Integrity"  },
  { icon: "ti-calendar-stats", section: "habits",         label: "Habits"     },
  { icon: "ti-book-2",         section: "skills",         label: "Skills"     },
  { divider: true },
  { icon: "ti-reading-log",    section: "readinglog",     label: "Reading Log",   compact: true },
  { icon: "ti-trophy",         section: "challenges",     label: "Challenges",    compact: true },
  { icon: "ti-gift",           section: "rewards",        label: "Rewards",       compact: true },
  { icon: "ti-pencil",         section: "drawings",       label: "Drawings",      compact: true },
  { icon: "ti-puzzle",         section: "activities",     label: "Activities",    compact: true },
  { icon: "ti-badge",          section: "badges",         label: "Badges",        compact: true },
  { icon: "ti-certificate",    section: "achievements",   label: "Achievements",  compact: true },
  { icon: "ti-rating",         section: "reviews",        label: "Reviews",       compact: true },
  { icon: "ti-paragraph",      section: "textchallenges", label: "Text Box",      compact: true },
];
const ANALYSIS_SECTIONS = new Set(["motivation", "integrity", "habits", "skills"]);

function LeftNav({ activeSection, onNavigate }) {
  function renderItem(item, idx) {
    if (item.divider) return <div key={`divider-${idx}`} className="bp-nav-divider" />
    const { icon, section, label, compact } = item
    const active = activeSection === section
    const pal = section ? C[section] : null
    const activeBg    = pal ? pal.bg   : "#E6F1FF"
    const activeColor = pal ? pal.text  : "#1A6DD5"
    return (
      <div
        key={label}
        className={`bp-nav-item${active ? " bp-nav-item--active" : ""}${compact ? " bp-nav-item--compact" : ""}`}
        style={active ? { "--nav-active-bg": activeBg, "--nav-active-color": activeColor } : {}}
        onClick={() => onNavigate(section)}
        onKeyDown={e => e.key === "Enter" && onNavigate(section)}
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

  const overviewItem  = NAV_ITEMS[0]
  const subItems      = NAV_ITEMS.slice(1, 5)   // Motivation, Integrity, Habits, Skills
  const restItems     = NAV_ITEMS.slice(5)

  return (
    <nav className="bp-nav">
      {renderItem(overviewItem, 0)}
      <div className="bp-nav-subgroup">
        {subItems.map((item, i) => renderItem(item, i + 1))}
      </div>
      {restItems.map((item, i) => renderItem(item, i + 5))}
    </nav>
  )
}

// ─── Shared page header ───────────────────────────────────────────────────────
function PageHeader({ icon, iconBg = "#F0F0F0", title, right }) {
  return (
    <div className="bp-section-header">
      <div className="bp-section-header-left">
        <div className="bp-section-icon" style={{ "--section-bg": iconBg }}>
          <Ic name={icon} size={22} />
        </div>
        <div className="bp-section-title">{title}</div>
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

// ─── Reading health color theme ───────────────────────────────────────────────
function healthTheme(score) {
  if (score >= 85) return { bar: "#16A97A", areaBg: "#E8FBF2", areaText: "#0A5E42", pillBg: "#0A5E42", icon: "ti-circle-check" };
  if (score >= 70) return { bar: "#1A6DD5", areaBg: "#E6F1FF", areaText: "#1A4AB0", pillBg: "#1A4AB0", icon: "ti-circle-check" };
  if (score >= 50) return { bar: "#D97706", areaBg: "#FEF3C7", areaText: "#854D0E", pillBg: "#854D0E", icon: "ti-alert-triangle" };
  return                  { bar: "#DC2626", areaBg: "#FEE2E2", areaText: "#991B1B", pillBg: "#991B1B", icon: "ti-alert-triangle" };
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function Overview({ student, onNavigate }) {
  const composite = compositeScore(student.sections);
  return (
    <div className="bp-content">
      <PageHeader
        icon="ti-user"
        iconBg="#E6F1FF"
        title="Overview"
        right={<button className="bp-btn-ghost">Regenerate Overview</button>}
      />

      {/* Snapshot tiles */}
      <div className="bp-tiles">
        {Object.entries(student.sections).map(([key, sec]) => {
          const c = C[key];
          const score = sectionScore(key, sec);
          const stat = key === "motivation" ? String(score) : sec.tileStat;
          return (
            <div
              key={key}
              className="bp-tile"
              style={{ "--tile-bg": c.bg, "--tile-text": c.text }}
              onClick={() => onNavigate(key)}
              onKeyDown={e => e.key === "Enter" && onNavigate(key)}
              role="button"
              tabIndex={0}
            >
              <div className="bp-tile-label">{LABEL[key]}</div>
              <div className="bp-tile-stat">{stat}</div>
              <div className="bp-tile-sub">{sec.tileSub}</div>
              <div className="bp-tile-status">
                <StatusBadge label={sec.status} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Benny Says */}
      <Card>
        <SectionHeading>Benny Says...</SectionHeading>
        <div className="bp-benny">
          <img className="bp-benny-avatar" src="/bs-prototypes/benny.png" alt="Benny" />
          <div className="bp-benny-body">
            <div className="bp-benny-bubble">{student.bennySummary}</div>
            <div className="bp-benny-timestamp">Analysis last run on {student.lastRun}</div>
          </div>
        </div>
      </Card>

      {/* Reading Health rollup */}
      <Card>
        <div className="bp-health-header">
          <div className="bp-health-title">Reading Health</div>
        </div>

        {/* Colored score verdict */}
        {(() => {
          const ht = healthTheme(composite);
          return (
            <div className="bp-health-verdict" style={{ "--ht-bar": ht.bar, "--ht-text": ht.areaText, "--ht-light": ht.areaBg }}>
              <div className="bp-health-verdict-row">
                <div className="bp-health-verdict-score">
                  <span className="bp-health-verdict-num">{composite}</span>
                  <span className="bp-health-verdict-outof">/100</span>
                </div>
                <span className="bp-health-verdict-pill">
                  <Ic name={ht.icon} size={12} />
                  {student.healthStatus}
                </span>
              </div>
              <div className="bp-health-verdict-track">
                <Bar value={composite} color={ht.bar} height={10} />
              </div>
            </div>
          );
        })()}

        <div className="bp-health-list">
          {Object.entries(student.sections).map(([key, sec]) => {
            const c = C[key];
            return (
              <div
                key={key}
                className="bp-health-row"
                onClick={() => onNavigate(key)}
                onKeyDown={e => e.key === "Enter" && onNavigate(key)}
                role="button"
                tabIndex={0}
              >
                <div className="bp-health-icon" style={{ "--section-bg": c.bg }}>
                  <Ic name={c.icon} size={18} />
                </div>
                <div className="bp-health-row-body">
                  <div className="bp-health-row-top">
                    <span className="bp-health-row-name">{LABEL[key]}</span>
                    <StatusBadge label={sec.status} />
                  </div>
                  <Bar value={sectionScore(key, sec)} color={c.bar} />
                </div>
                <span className="bp-health-row-link">
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                    <polyline points="1,1 6,6 1,11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            );
          })}
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
              <SectionTag sectionKey={action.section} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Section detail wrapper ───────────────────────────────────────────────────
function SectionDetail({ student, sectionKey }) {
  const sec = student.sections[sectionKey];
  const c = C[sectionKey];
  const firstName = student.name.split(" ")[0];
  return (
    <div className="bp-content">
      <PageHeader
        icon={c.icon}
        iconBg={c.bg}
        title={`Reading ${LABEL[sectionKey]}`}
        right={<StatusBadge label={sec.status} size={13} />}
      />
      {sectionKey === "motivation" && <MotivationDetail sec={sec} c={c} />}
      {sectionKey === "integrity"  && <IntegrityDetail  sec={sec} c={c} />}
      {sectionKey === "habits"     && <HabitsDetail     sec={sec} c={c} />}
      {sectionKey === "skills"     && <SkillsDetail     sec={sec} c={c} firstName={firstName} />}
      <Card><ActionFooter actions={sec.actions} /></Card>
    </div>
  );
}

// ─── Motivation detail ────────────────────────────────────────────────────────
function MotivationDetail({ sec, c }) {
  const [periodIdx, setPeriodIdx] = useState(0);
  const rmi = sec.rmiHistory[periodIdx];

  return (<>
    <Card>
      <div className="bp-rmi-header">
        <SectionHeading>Reading Motivation Index</SectionHeading>
        <select
          className="bp-rmi-period-select"
          value={periodIdx}
          onChange={e => setPeriodIdx(Number(e.target.value))}
        >
          {sec.rmiHistory.map((r, i) => (
            <option key={i} value={i}>{r.period} ({r.range})</option>
          ))}
        </select>
      </div>

      <div className="bp-rmi-metrics">
        {[
          { label: "Avg Intrinsic Score",  val: rmi.intrinsicAvg,  max: rmi.intrinsicMax,  delta: rmi.intrinsicDelta },
          { label: "Avg Motivation Score", val: rmi.motivationAvg, max: rmi.motivationMax, delta: rmi.motivationDelta },
          { label: "Avg Extrinsic Score",  val: rmi.extrinsicAvg,  max: rmi.extrinsicMax,  delta: rmi.extrinsicDelta },
        ].map(({ label, val, max, delta }) => (
          <div key={label} className="bp-rmi-metric">
            <div className="bp-rmi-score-row">
              <span className="bp-rmi-score">{val}</span>
              <span className="bp-rmi-max">/{max}</span>
              <span className={`bp-rmi-delta ${delta > 0 ? "bp-rmi-delta--up" : "bp-rmi-delta--down"}`}>
                {delta > 0 ? "▲" : "▼"}{Math.abs(delta)}%
              </span>
            </div>
            <div className="bp-rmi-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="bp-rmi-bars">
        {[
          { label: "Intrinsic", score: sec.intrinsic, delta: sec.intrinsicDelta },
          { label: "Extrinsic", score: sec.extrinsic, delta: sec.extrinsicDelta },
        ].map(({ label, score, delta }) => (
          <div key={label} className="bp-score-row">
            <div className="bp-score-row-header">
              <span className="bp-score-label">{label}</span>
              <div className="bp-score-value">
                <span className="bp-score-num">{score}</span>
                <Pill label={`${delta > 0 ? "+" : ""}${delta}`}
                  bg={delta > 0 ? "#CBFDE5" : "#FEDDD1"}
                  color={delta > 0 ? "#0F6E56" : "#993C1D"} small />
              </div>
            </div>
            <Bar value={score} color={c.bar} height={7} />
          </div>
        ))}
      </div>
    </Card>

    <Card>
      <SectionHeading>Benny Says...</SectionHeading>
      <div className="bp-benny">
        <img className="bp-benny-avatar" src="/bs-prototypes/benny.png" alt="Benny" />
        <div className="bp-benny-body">
          <div className="bp-benny-bubble">{rmi.bennySummary}</div>
        </div>
      </div>
    </Card>

    <Card>
      <SectionHeading>Recommendations</SectionHeading>
      <div className="bp-rmi-recs">
        <div className="bp-rmi-rec-goal">
          <div className="bp-rmi-rec-goal-label">Recommended Reading Goal</div>
          <div className="bp-rmi-rec-goal-value">{rmi.readingGoalMinutes}</div>
          <div className="bp-rmi-rec-goal-unit">Minutes Daily</div>
        </div>
        <div className="bp-rmi-rec-actions">
          <div className="bp-rmi-rec-actions-label">Recommended Actions</div>
          {rmi.recommendedActions.map((a, i) => (
            <div key={i} className="bp-rmi-rec-action">
              <Ic name="ti-circle-check" size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <p className="bp-rmi-rec-action-text">
                <strong>{a.label}:</strong> {a.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>

    <Card>
      <SectionHeading>Motivator Rankings</SectionHeading>
      <div className="bp-motivator-rankings">
        {rmi.rankings.map((m, i) => (
          <div key={m.name} className="bp-motivator-row">
            <span className="bp-motivator-rank">{i + 1}</span>
            <span className="bp-motivator-name">{m.name}</span>
            <div className="bp-motivator-bar-wrap">
              <Bar value={(m.score / m.max) * 100} color={c.bar} height={6} />
            </div>
            <span className="bp-motivator-score">{m.score}</span>
            <span className={`bp-motivator-delta ${m.delta >= 0 ? "bp-motivator-delta--up" : "bp-motivator-delta--down"}`}>
              {m.delta >= 0 ? "▲" : "▼"}{Math.abs(m.delta)}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  </>);
}

// ─── Integrity detail ─────────────────────────────────────────────────────────
const SESSION_FLAGS = {
  "book-swap":       { icon: "ti-swap",          label: "Book transfer",       color: "#D97706" },
  "time-warning":    { icon: "ti-clock",          label: "Time concern",        color: "#6B7280" },
  "btwb-incomplete": { icon: "ti-signature",      label: "BTWB not completed",  color: "#059669" },
  "missing-details": { icon: "ti-list",           label: "Missing details",     color: "#DC2626" },
  "over-limit":      { icon: "ti-alert-triangle", label: "Logged over limit",   color: "#D97706" },
};

function SessionFlag({ type }) {
  const cfg = SESSION_FLAGS[type];
  if (!cfg) return null;
  return (
    <span className="bp-session-flag" title={cfg.label} style={{ "--flag-color": cfg.color }}>
      <Ic name={cfg.icon} size={15} />
    </span>
  );
}

function IntegrityDetail({ sec }) {
  return (<>
    <Card>
      <SectionHeading>Session integrity</SectionHeading>
      <div className="bp-flagged-summary">
        <span className="bp-flagged-label">Flagged sessions</span>
        <div className="bp-flagged-count-group">
          <span className="bp-flagged-count">{sec.flaggedSessions}</span>
          {sec.flagDelta < 0
            ? <Pill label={`↓${Math.abs(sec.flagDelta)} vs last period`} bg="#CBFDE5" color="#0F6E56" small />
            : <Pill label={`↑${Math.abs(sec.flagDelta)} vs last period`} bg="#FEDDD1" color="#993C1D" small />
          }
        </div>
      </div>
      <div className="bp-flag-breakdown">
        <div className="bp-flag-breakdown-label">Top flags this period</div>
        <div className="bp-flag-list">
          {sec.flagBreakdown.map(f => (
            <div key={f.type} className="bp-flag-item">
              <span className="bp-flag-type">{f.type}</span>
              <Pill label={f.count} bg="#FFF3DC" color="#854F0B" small />
            </div>
          ))}
        </div>
      </div>
      {sec.unfinishedConversations > 0 && (
        <div className="bp-unfinished-banner">
          <Ic name="ti-message-x" size={16} />
          {sec.unfinishedConversations} unfinished BTWB conversations
        </div>
      )}
    </Card>

    <Card flush>
      <div className="bp-sessions-header">
        <span className="bp-sessions-col bp-sessions-col--date">Flagged on</span>
        <span className="bp-sessions-col bp-sessions-col--title">Title</span>
        <span className="bp-sessions-col bp-sessions-col--flags">Flags</span>
      </div>
      {sec.sessions.map((s, i) => (
        <div key={i} className="bp-session-row">
          <span className="bp-session-date">{s.date}</span>
          <span className="bp-session-title">{s.title}</span>
          <span className="bp-session-flags">
            {s.flags.map(f => <SessionFlag key={f} type={f} />)}
          </span>
        </div>
      ))}
    </Card>
  </>);
}

// ─── Reading heatmap ──────────────────────────────────────────────────────────
function ReadingHeatmap({ goalMinutes, color, data }) {
  const [monthOffset, setMonthOffset] = useState(0); // 0 = most recent 6-month window
  const MAX_OFFSET = 19; // go back to Sep 2023

  const today = new Date("2025-05-15");

  // End of window: last day of (today's month − monthOffset)
  const windowEndMonth = new Date(today.getFullYear(), today.getMonth() - monthOffset + 1, 0);
  const windowEnd = monthOffset === 0 ? today : windowEndMonth;

  // Start of window: first day of the month 5 months before windowEnd's month
  const windowStart = new Date(windowEndMonth.getFullYear(), windowEndMonth.getMonth() - 5, 1);

  // Grid starts on the Sunday on or before windowStart
  const gridStart = new Date(windowStart);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const FIXED_WEEKS = 27; // always render exactly 27 columns so grid height never jumps
  const weeks = [];
  const cur = new Date(gridStart);
  while (weeks.length < FIXED_WEEKS) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const key = cur.toISOString().slice(0, 10);
      const inRange = cur >= windowStart && cur <= windowEnd;
      week.push({ key, mins: inRange ? (data[key] ?? 0) : 0, inRange, month: cur.getMonth(), dateObj: new Date(cur) });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  const allDays = weeks.flat().filter(d => d.inRange).sort((a, b) => a.key < b.key ? -1 : 1);
  const streakMap = {};
  let run = 0;
  allDays.forEach(d => { run = d.mins > 0 ? run + 1 : 0; streakMap[d.key] = run; });

  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const first = week.find(d => d.inRange);
    if (first && first.month !== lastMonth) {
      monthLabels.push({ wi, label: first.dateObj.toLocaleString("en-US", { month: "short" }) });
      lastMonth = first.month;
    }
  });

  // Nav label: "Mar – May 2025" or "Dec 2024 – Feb 2025"
  const fmtMonth = d => d.toLocaleString("en-US", { month: "short" });
  const navLabel = windowStart.getFullYear() === windowEnd.getFullYear()
    ? `${fmtMonth(windowStart)} – ${fmtMonth(windowEnd)} ${windowEnd.getFullYear()}`
    : `${fmtMonth(windowStart)} ${windowStart.getFullYear()} – ${fmtMonth(windowEnd)} ${windowEnd.getFullYear()}`;

  const getBg = ({ mins, inRange }) => {
    if (!inRange || mins === undefined) return "transparent";
    if (mins === 0) return "#EAECF0";
    return color;
  };

  const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="bp-heatmap">
      <div className="bp-heatmap-nav">
        <button
          className="bp-heatmap-nav-btn"
          onClick={() => setMonthOffset(o => Math.min(o + 1, MAX_OFFSET))}
          disabled={monthOffset >= MAX_OFFSET}
          aria-label="Previous 6 months"
        >‹</button>
        <span className="bp-heatmap-nav-label">{navLabel}</span>
        <button
          className="bp-heatmap-nav-btn"
          onClick={() => setMonthOffset(o => Math.max(o - 1, 0))}
          disabled={monthOffset === 0}
          aria-label="Next 6 months"
        >›</button>
      </div>
      <div className="bp-heatmap-body">
        <div className="bp-heatmap-day-labels">
          {DAY_LABELS.map((d, i) => <span key={i} className="bp-heatmap-day-label">{d}</span>)}
        </div>
        <div className="bp-heatmap-grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="bp-heatmap-col">
              {week.map((day, di) => {
                const goalMet  = day.inRange && day.mins >= goalMinutes;
                const inStreak = day.inRange && streakMap[day.key] >= 2;
                let cls = "bp-heatmap-cell";
                if (goalMet)  cls += " bp-heatmap-cell--goal";
                if (inStreak) cls += " bp-heatmap-cell--streak";
                let tip = null;
                if (day.inRange) {
                  const label = day.dateObj.toLocaleString("en-US", { month: "short", day: "numeric" });
                  const minsTxt = day.mins > 0 ? `${day.mins} min` : "No reading";
                  const badges = [goalMet && "Goal met", inStreak && `🔥 ${streakMap[day.key]}-day streak`].filter(Boolean).join(" · ");
                  tip = badges ? `${label} · ${minsTxt} · ${badges}` : `${label} · ${minsTxt}`;
                }
                return (
                  <div
                    key={di}
                    className={cls}
                    style={{ "--cell-bg": getBg(day) }}
                    data-tooltip={tip ?? undefined}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="bp-heatmap-months">
        <div className="bp-heatmap-month-spacer" />
        {monthLabels.map((m, i) => {
          const span = (monthLabels[i + 1]?.wi ?? weeks.length) - m.wi;
          return <div key={i} className="bp-heatmap-month-label" style={{ flex: span }}>{m.label}</div>;
        })}
      </div>
    </div>
  );
}

// ─── Goal tracker ─────────────────────────────────────────────────────────────
function GoalTracker({ week, goalMinutes }) {
  return (
    <div className="bp-goal-tracker">
      {week.days.map((d, i) => {
        const met     = d.minutes !== null && d.minutes >= goalMinutes;
        const pending = d.minutes === null;
        const isToday = pending && week.current && i === week.days.findIndex(x => x.minutes === null);
        const prevMet = i > 0 && week.days[i - 1].minutes !== null && week.days[i - 1].minutes >= goalMinutes;

        const circleCls = met     ? "bp-goal-circle--met"
                        : isToday ? "bp-goal-circle--today"
                        : pending ? "bp-goal-circle--future"
                        :           "bp-goal-circle--missed";

        return (
          <div key={i} className="bp-goal-day">
            <div className="bp-goal-mins-area">
              {met && <span className="bp-goal-mins">{d.minutes}m</span>}
            </div>
            <div className="bp-goal-circle-row">
              {i > 0 && (
                <div className={`bp-goal-conn${met && prevMet ? " bp-goal-conn--lit" : ""}`} />
              )}
              <div className={`bp-goal-circle ${circleCls}`}>★</div>
            </div>
            <span className={`bp-goal-day-label${isToday ? " bp-goal-day-label--today" : ""}`}>
              {d.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Habits detail ────────────────────────────────────────────────────────────
function HabitsDetail({ sec, c }) {
  const [weekIdx, setWeekIdx] = useState(0);
  const week    = sec.weeks[weekIdx];
  const atBest  = sec.currentStreak >= sec.personalBest;
  const pct     = Math.min(sec.currentStreak / sec.personalBest, 1);
  const toGo    = sec.personalBest - sec.currentStreak;

  // Derive today's minutes from the current week (last non-null day)
  const currentWeek = sec.weeks.find(w => w.current);
  const todayMins   = currentWeek
    ? ([...currentWeek.days].reverse().find(d => d.minutes !== null)?.minutes ?? 0)
    : 0;

  return (<>
    {/* Daily goal tracker */}
    <Card>
      <div className="bp-goal-ring-header">
        <GoalRing minutes={todayMins} goal={sec.dailyGoalMinutes} color={c.bar} />
        <div className="bp-goal-ring-info">
          <div className="bp-goal-title">Daily Reading Goal</div>
          <div className="bp-goal-ring-meta">
            <span className="bp-goal-ring-num">{sec.dailyGoalMinutes} min</span>
            <span className="bp-goal-ring-dot">·</span>
            <span>Today</span>
          </div>
        </div>
        <button className="bp-btn-ghost">Edit Goal</button>
      </div>
      <div className="bp-goal-week-nav">
        <button
          className="bp-goal-nav-btn"
          onClick={() => setWeekIdx(i => Math.min(i + 1, sec.weeks.length - 1))}
          disabled={weekIdx === sec.weeks.length - 1}
        >‹</button>
        <span className="bp-goal-week-label">
          {week.label}{week.current ? " (This Week)" : ""}
        </span>
        <button
          className="bp-goal-nav-btn"
          onClick={() => setWeekIdx(i => Math.max(i - 1, 0))}
          disabled={weekIdx === 0}
        >›</button>
      </div>
      <GoalTracker week={week} goalMinutes={sec.dailyGoalMinutes} />
    </Card>

    {/* Streak hero */}
    <Card>
      <SectionHeading>Reading streak</SectionHeading>
      <div className="bp-streak-hero">
        <div className="bp-streak-hero-left">
          <span className="bp-streak-hero-flame">🔥</span>
          <div>
            <div className="bp-streak-hero-num">
              {sec.currentStreak}<span className="bp-streak-hero-unit">days</span>
            </div>
            <div className="bp-streak-hero-sublabel">current streak</div>
          </div>
        </div>
        <div className="bp-streak-hero-right">
          {atBest ? (
            <div className="bp-streak-pb-badge">🏆 Personal best!</div>
          ) : (
            <>
              <div className="bp-streak-pb-label">
                Personal best: <strong>{sec.personalBest} days</strong>
              </div>
              <div className="bp-streak-pb-track">
                <div className="bp-streak-pb-fill" style={{ width: `${pct * 100}%`, background: c.bar }} />
              </div>
              <div className="bp-streak-pb-sub">
                {toGo === 1 ? "1 more day to tie the record!" : `${toGo} days to tie the record`}
              </div>
            </>
          )}
        </div>
      </div>
    </Card>

    {/* Habit patterns */}
    <Card>
      <SectionHeading>Reading patterns</SectionHeading>
      <div className="bp-habit-patterns">
        {[
          { label: "Avg session length",    value: `${sec.avgSessionMins} min`,
            note: "per sitting" },
          { label: "Days read this month",  value: `${sec.daysReadThisMonth} of ${sec.daysInMonth}`,
            note: `${Math.round(sec.daysReadThisMonth / sec.daysInMonth * 100)}% consistency`,
            tone: sec.daysReadThisMonth / sec.daysInMonth >= 0.7 ? "good" : sec.daysReadThisMonth / sec.daysInMonth >= 0.4 ? "neutral" : "bad" },
          { label: "Longest gap",           value: `${sec.longestGap} ${sec.longestGap === 1 ? "day" : "days"}`,
            note: "without reading",
            tone: sec.longestGap <= 2 ? "good" : sec.longestGap <= 5 ? "neutral" : "bad" },
          { label: "Best reading day",      value: sec.topReadingDay,
            note: "most consistent" },
        ].map(({ label, value, note, tone }) => (
          <div key={label} className="bp-habit-row">
            <div className="bp-habit-row-label">{label}</div>
            <div className="bp-habit-row-right">
              <span className={`bp-habit-row-value${tone ? ` bp-habit-row-value--${tone}` : ""}`}>{value}</span>
              <span className="bp-habit-row-note">{note}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>

    {/* Heatmap */}
    <Card>
      <div className="bp-heatmap-heading-row">
        <SectionHeading>Reading activity</SectionHeading>
        <div className="bp-heatmap-legend">
          {[
            { bg: "#EAECF0", label: "No reading" },
            { bg: "#60A5FA", label: "Read" },
            { bg: "#60A5FA", label: "Goal met", goal: true },
            { bg: "#60A5FA", label: "Streak", streak: true },
          ].map((item, i) => (
            <div key={i} className="bp-heatmap-legend-item">
              <div
                className={`bp-heatmap-cell${item.goal ? " bp-heatmap-cell--goal" : ""}${item.streak ? " bp-heatmap-cell--streak" : ""}`}
                style={{ "--cell-bg": item.bg }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <ReadingHeatmap goalMinutes={sec.dailyGoalMinutes} color="#60A5FA" data={sec.heatmapData} />
    </Card>
  </>);
}

// ─── Lexile trend chart ───────────────────────────────────────────────────────
function LexileChart({ history, gradeLevel, gradeLevelLabel, color }) {
  const W = 540, H = 140;
  const PAD = { top: 20, right: 70, bottom: 30, left: 42 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const minL = 400, maxL = 1000;
  const toX = i => PAD.left + (i / (history.length - 1)) * chartW;
  const toY = l => PAD.top + chartH - ((l - minL) / (maxL - minL)) * chartH;
  const points = history.map((d, i) => [toX(i), toY(d.avg)]);
  const polyline = points.map(p => p.join(",")).join(" ");
  const glY = toY(gradeLevel);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {[500, 600, 700, 800, 900].map(l => (
        <line key={l} x1={PAD.left} y1={toY(l)} x2={W - PAD.right} y2={toY(l)}
          stroke="#F0F0F0" strokeWidth={1} />
      ))}
      {[400, 500, 600, 700, 800, 900, 1000].map(l => (
        <text key={l} x={PAD.left - 6} y={toY(l) + 4} fontSize={10} fill="#BFBFBF" textAnchor="end">{l}L</text>
      ))}
      <line x1={PAD.left} y1={glY} x2={W - PAD.right} y2={glY}
        stroke="#9CA3AF" strokeWidth={1.5} strokeDasharray="5 4" />
      <text x={W - PAD.right + 6} y={glY} fontSize={10} fill="#9CA3AF" dominantBaseline="middle">
        {gradeLevelLabel || "Grade"}
      </text>
      <polyline points={polyline} fill="none" stroke={color} strokeWidth={2.5}
        strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={5} fill={color} stroke="#fff" strokeWidth={2} />
          <text x={p[0]} y={p[1] - 11} fontSize={10} fill={color} textAnchor="middle" fontWeight="700">
            {history[i].avg}L
          </text>
        </g>
      ))}
      {history.map((d, i) => (
        <text key={i} x={toX(i)} y={H - 4} fontSize={10} fill="#ACACAC" textAnchor="middle">{d.month}</text>
      ))}
    </svg>
  );
}

// ─── Skills detail ────────────────────────────────────────────────────────────
function SkillsDetail({ sec, c, firstName }) {
  const maxL = 1000;
  const deltaUp = sec.monthlyDelta >= 0;
  return (<>
    <Card>
      <SectionHeading>Lexile Trend</SectionHeading>
      <LexileChart
        history={sec.lexileHistory}
        gradeLevel={sec.gradeLevel}
        gradeLevelLabel={sec.gradeLevelLabel}
        color={c.bar}
      />
      <div className="bp-lexile-summary">
        <span className="bp-lexile-summary-label">Monthly Lexile average</span>
        <div className="bp-lexile-summary-right">
          <span className="bp-lexile-avg">{sec.monthlyAvg}L</span>
          <Pill
            label={`${deltaUp ? "↑" : "↓"}${Math.abs(sec.monthlyDelta)}L vs Apr`}
            bg={deltaUp ? "#CBFDE5" : "#FEDDD1"}
            color={deltaUp ? "#0F6E56" : "#993C1D"}
            small
          />
        </div>
      </div>
    </Card>

    <div className="bp-titles-section">
      <div className="bp-titles-header">
        <span className="bp-titles-header-label">Recent titles</span>
      </div>
      {sec.titles.map((t, i) => (
        <div key={i} className="bp-title-row">
          <a href={`https://openlibrary.org/isbn/${t.isbn}`} target="_blank" rel="noreferrer" className="bp-title-cover-link">
            <CoverImage isbn={t.isbn} title={t.title} />
          </a>
          <div className="bp-title-row-main">
            <div className="bp-title-row-top">
              <div>
                <a href={`https://openlibrary.org/isbn/${t.isbn}`} target="_blank" rel="noreferrer" className="bp-title-name-link">
                  {t.title}
                </a>
                <div className="bp-title-author">{t.author}</div>
              </div>
              <span className="bp-title-lexile-pill">{t.lexile}L</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    <Card>
      <div className="bp-genre-header">
        <SectionHeading>Genre trends</SectionHeading>
        <span className="bp-genre-subhead">{firstName} gravitates toward these genres — good signals for recommendations</span>
      </div>
      <div className="bp-genre-cloud">
        {(() => {
          const maxCount = Math.max(...sec.genreCloud.map(g => g.count));
          return sec.genreCloud.map((g, i) => {
            const pal = GENRE_COLORS[g.genre] ?? { bg: "#F3F4F6", color: "#374151", border: "#D1D5DB" };
            const weight = g.count / maxCount; // 0–1 relative size
            return (
              <span
                key={i}
                className="bp-genre-chip"
                style={{
                  "--chip-bg":     pal.bg,
                  "--chip-color":  pal.color,
                  "--chip-border": pal.border,
                  fontSize: `${11 + Math.round(weight * 5)}px`,
                  opacity: 0.55 + weight * 0.45,
                }}
              >
                {g.genre}
                <span className="bp-genre-chip-count">{g.count}</span>
              </span>
            );
          });
        })()}
      </div>
    </Card>

    <Card flush>
      <div className="bp-titles-header">
        <span className="bp-titles-header-label">Suggested next reads</span>
        <span className="bp-titles-range-chip">{sec.recommendedRange}</span>
      </div>
      {sec.recommendedTitles.map((t, i) => (
        <div key={i} className="bp-title-row">
          <a href={`https://openlibrary.org/isbn/${t.isbn}`} target="_blank" rel="noreferrer" className="bp-title-cover-link">
            <CoverImage isbn={t.isbn} title={t.title} />
          </a>
          <div className="bp-title-row-main">
            <div className="bp-title-row-top">
              <div>
                <a href={`https://openlibrary.org/isbn/${t.isbn}`} target="_blank" rel="noreferrer" className="bp-title-name-link">
                  {t.title}
                </a>
                <div className="bp-title-author">{t.author}</div>
              </div>
              <span className="bp-title-lexile-pill">{t.lexile}L</span>
            </div>
          </div>
        </div>
      ))}
    </Card>
  </>);
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── Student data ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

const STUDENTS = {

  // ── Marcus Chen — Exceptional ──────────────────────────────────────────────
  marcus: {
    name: "Marcus Chen",
    grade: "7th Grade",
    lastRun: "May 15 at 9:55am",
    healthStatus: "Excellent",
    healthIcon: "ti-circle-check",
    bennySummary:
      "Marcus is an outstanding reader. He's maintained an 18-day reading streak — the longest in the class — and is reading well above grade level at 870L. His intrinsic motivation is the highest on record, and his integrity score is nearly perfect with only 1 flagged session all year. He's ready for books 1–2 grade levels up, and would benefit from leadership opportunities like book talks or reading buddy programs.",
    sections: {
      motivation: {
        status: "Strong",
        intrinsic: 88, intrinsicDelta: 12,
        extrinsic: 82, extrinsicDelta: 6,
        tileSub: "/ 100 score",
        rmiHistory: [
          {
            period: "Apr 25 Index",
            range: "4/15/25–5/15/25",
            intrinsicAvg: 19.2, intrinsicMax: 20, intrinsicDelta: 8,
            motivationAvg: 36.4, motivationMax: 40, motivationDelta: 12,
            extrinsicAvg: 17.8, extrinsicMax: 20, extrinsicDelta: 6,
            readingGoalMinutes: 30,
            bennySummary: "Marcus's motivation is at its highest point this year. His intrinsic score of 19.2/20 is exceptional — Enjoyment, Curiosity, and Challenge are his top three drivers. He's genuinely in love with reading right now. The best thing you can do is keep the material challenging and get out of his way.",
            recommendedActions: [
              { label: "Advanced Challenge", text: "Marcus is ready for books 1–2 grade levels above. Consider recommending titles in the 950–1000L range to keep him growing." },
              { label: "Leadership",         text: "Invite Marcus to share his reading experience with classmates through a short book talk or reading buddy program." },
            ],
            rankings: [
              { name: "Enjoyment",         score: 4.0, max: 4, delta: 3 },
              { name: "Curiosity",         score: 3.9, max: 4, delta: 5 },
              { name: "Challenge",         score: 3.8, max: 4, delta: 8 },
              { name: "Confidence",        score: 3.8, max: 4, delta: 4 },
              { name: "Importance",        score: 3.7, max: 4, delta: 6 },
              { name: "Social Connection", score: 3.5, max: 4, delta: 2 },
              { name: "Recognition",       score: 3.4, max: 4, delta: 5 },
              { name: "Grades",            score: 3.2, max: 4, delta: 2 },
              { name: "Competition",       score: 3.0, max: 4, delta: 1 },
              { name: "Compliance",        score: 2.8, max: 4, delta: -1 },
            ],
          },
          {
            period: "Mar 25 Index",
            range: "3/15/25–4/15/25",
            intrinsicAvg: 18.1, intrinsicMax: 20, intrinsicDelta: 5,
            motivationAvg: 33.8, motivationMax: 40, motivationDelta: 8,
            extrinsicAvg: 16.5, extrinsicMax: 20, extrinsicDelta: 4,
            readingGoalMinutes: 30,
            bennySummary: "Marcus shows strong and consistently improving motivation. His intrinsic drivers continue to lead, and his Social Connection score is picking up — consider pairing him with a reading buddy or discussion group to capitalize on this emerging motivator.",
            recommendedActions: [
              { label: "Peer sharing",    text: "Marcus is highly motivated by social connection. Consider setting up a reading club or partner discussions." },
              { label: "Genre stretch",   text: "Encourage Marcus to explore a genre outside his comfort zone — historical fiction or biography — to broaden engagement." },
            ],
            rankings: [
              { name: "Enjoyment",         score: 3.9, max: 4, delta: 4 },
              { name: "Curiosity",         score: 3.7, max: 4, delta: 3 },
              { name: "Confidence",        score: 3.6, max: 4, delta: 6 },
              { name: "Challenge",         score: 3.5, max: 4, delta: 2 },
              { name: "Importance",        score: 3.4, max: 4, delta: 3 },
              { name: "Social Connection", score: 3.3, max: 4, delta: 5 },
              { name: "Recognition",       score: 3.1, max: 4, delta: 1 },
              { name: "Grades",            score: 3.0, max: 4, delta: 2 },
              { name: "Competition",       score: 2.9, max: 4, delta: 3 },
              { name: "Compliance",        score: 2.8, max: 4, delta: -2 },
            ],
          },
        ],
        actions: [
          { title: "Nominate Marcus for a reading recognition award", body: "His 18-day streak and near-perfect motivation scores make him an ideal candidate. Public recognition could also strengthen classmates' motivation." },
          { title: "Give Marcus a voice — try a student book recommendation", body: "High-curiosity, high-enjoyment readers like Marcus do well as peer recommenders. A short class book talk would channel his engagement productively." },
        ],
      },
      integrity: {
        score: 96, status: "Strong",
        flaggedSessions: 1, flagDelta: -2,
        flagBreakdown: [
          { type: "Time concern", count: 1 },
        ],
        unfinishedConversations: 0,
        tileStat: "1", tileSub: "flag ↓2",
        sessions: [
          { date: "03/14/25", title: "Ender's Game", flags: ["time-warning"] },
        ],
        actions: [
          { title: "Marcus's integrity is exemplary — acknowledge it", body: "1 flag all year is exceptional. A brief acknowledgment reinforces the behavior and sets a positive example for the class." },
          { title: "Keep BTWB conversations going — he's completing all of them", body: "Marcus has a 100% BTWB completion rate. Encourage deeper reflection prompts to match his reading sophistication." },
        ],
      },
      habits: {
        score: 93, status: "Strong",
        currentStreak: 18, avgStreak: 15, personalBest: 18,
        minutesThisWeek: 185, minutesDelta: 25,
        booksLogged: 4, goalHitRate: 94,
        avgSessionMins: 37, daysReadThisMonth: 14, daysInMonth: 15, longestGap: 1, topReadingDay: "Thursdays",
        tileStat: "18", tileSub: "day streak",
        dailyGoalMinutes: 30,
        heatmapData: makeHeatmapData(0.85, "consistent"),
        weeks: [
          {
            label: "May 11–17", current: true,
            days: [
              { day: "Sun", minutes: 35 },
              { day: "Mon", minutes: 40 },
              { day: "Tue", minutes: 38 },
              { day: "Wed", minutes: 32 },
              { day: "Thu", minutes: 40 },
              { day: "Fri", minutes: 35 },
              { day: "Sat", minutes: null },
            ],
          },
          {
            label: "May 4–10", current: false,
            days: [
              { day: "Sun", minutes: 30 },
              { day: "Mon", minutes: 38 },
              { day: "Tue", minutes: 42 },
              { day: "Wed", minutes: 35 },
              { day: "Thu", minutes: 45 },
              { day: "Fri", minutes: 36 },
              { day: "Sat", minutes: 28 },
            ],
          },
          {
            label: "Apr 27 – May 3", current: false,
            days: [
              { day: "Sun", minutes: 32 },
              { day: "Mon", minutes: 40 },
              { day: "Tue", minutes: 38 },
              { day: "Wed", minutes: 35 },
              { day: "Thu", minutes: 42 },
              { day: "Fri", minutes: 0 },
              { day: "Sat", minutes: 31 },
            ],
          },
        ],
        actions: [
          { title: "Keep streak accountability low-touch", body: "Marcus is highly self-directed. A weekly leaderboard or quiet streak counter is all he needs — daily nudges would feel patronizing." },
          { title: "Consider raising Marcus's daily goal to 40 minutes", body: "He's consistently hitting 30+ minutes and his engagement shows no signs of burnout. A modest goal increase could deepen his growth." },
        ],
      },
      skills: {
        score: 95, status: "Trending up",
        titles: [
          { title: "A Wrinkle in Time",  author: "Madeleine L'Engle",  lexile: 740, genre: "Sci-Fi",     sessions: 7,  current: false, isbn: "9780312367558" },
          { title: "Ender's Game",       author: "Orson Scott Card",   lexile: 780, genre: "Sci-Fi",     sessions: 14, current: false, isbn: "9780812550702" },
          { title: "Fahrenheit 451",     author: "Ray Bradbury",       lexile: 890, genre: "Dystopian",  sessions: 11, current: true,  isbn: "9781451673319" },
        ],
        genreCloud: [
          { genre: "Sci-Fi",     count: 21 },
          { genre: "Dystopian",  count: 11 },
          { genre: "Mystery",    count: 8  },
          { genre: "Adventure",  count: 6  },
          { genre: "Historical", count: 4  },
          { genre: "Fantasy",    count: 3  },
        ],
        recommendedTitles: [
          { title: "Animal Farm",        author: "George Orwell",   lexile: 940,  genre: "Dystopian", isbn: "9780451526342" },
          { title: "Lord of the Flies",  author: "William Golding", lexile: 1010, genre: "Dystopian", isbn: "9780399501487" },
          { title: "The Giver of Stars", author: "Jojo Moyes",      lexile: 880,  genre: "Historical", isbn: "9780399177644" },
        ],
        recommendedRange: "900–950L",
        monthlyAvg: 870, monthlyDelta: 80,
        gradeLevel: 750, gradeLevelLabel: "Grade 7",
        lexileHistory: [
          { month: "Jan", avg: 720 },
          { month: "Feb", avg: 760 },
          { month: "Mar", avg: 800 },
          { month: "Apr", avg: 830 },
          { month: "May", avg: 870 },
        ],
        tileStat: "870L", tileSub: "↑80L this month",
        actions: [
          { title: "Recommend titles in the 900–950L range", body: "Marcus's Lexile average is 870L and climbing fast. He's outpacing the grade 7 benchmark and is ready for a significant challenge." },
          { title: "Explore Dystopian and Sci-Fi series to sustain momentum", body: "These are his two dominant genres. Series books at his next Lexile level reduce friction and keep engagement high between teacher check-ins." },
        ],
      },
    },
    recommendedActions: [
      { title: "Nominate Marcus for a reading recognition award", body: "His 18-day streak and near-perfect motivation scores make him an ideal candidate.", section: "motivation" },
      { title: "Celebrate his near-perfect integrity record", body: "Only 1 flagged session all year — a brief shoutout reinforces the behavior for the class.", section: "integrity" },
      { title: "Keep streak accountability low-touch", body: "Marcus is self-directed. A weekly leaderboard is enough — he doesn't need daily nudges.", section: "habits" },
      { title: "Recommend titles in the 900–950L range", body: "He's at 870L and climbing. He's significantly above grade level and ready for a real challenge.", section: "skills" },
    ],
  },

  // ── Anne Boonchuy — Normal ─────────────────────────────────────────────────
  anne: {
    name: "Anne Boonchuy",
    grade: "6th Grade",
    lastRun: "May 15 at 9:55am",
    healthStatus: "On Track",
    healthIcon: "ti-circle-check",
    bennySummary:
      "Anne is making real progress this month! Her reading habits are strong — she's on a 4-day streak and has already logged 85 minutes this week. Her Lexile average has climbed 50 points since April, and she's consistently choosing harder books. Integrity is improving, with flags down from 7 to 4. The main thing to keep an eye on is her extrinsic motivation, which has dipped 4 points, and 2 unfinished BTWB conversations that are worth following up on.",
    sections: {
      motivation: {
        status: "Watch",
        intrinsic: 72, intrinsicDelta: 7,
        extrinsic: 48, extrinsicDelta: -4,
        tileSub: "/ 100 score",
        rmiHistory: [
          {
            period: "Apr 25 Index",
            range: "4/15/25–5/15/25",
            intrinsicAvg: 16.4, intrinsicMax: 20, intrinsicDelta: -5,
            motivationAvg: 28.6, motivationMax: 40, motivationDelta: 9,
            extrinsicAvg: 12.2, extrinsicMax: 20, extrinsicDelta: 9,
            readingGoalMinutes: 15,
            bennySummary: "Anne's motivation is mixed this period. Recognition and Social Connection are her clearest levers — she responds well to public acknowledgment and peer interaction. Her Enjoyment score has slipped, which is worth watching. A shoutout or leaderboard mention could give her a quick boost while you work on rebuilding deeper engagement.",
            recommendedActions: [
              { label: "Recognition",       text: "Recognize Anne for reading accomplishments (like meeting their goal, or a reading streak) with a high five or a shoutout." },
              { label: "Social Connection", text: "Encourage Anne to use Beanstack's friends and leaderboards functionality." },
            ],
            rankings: [
              { name: "Recognition",       score: 3.4, max: 4, delta:  9 },
              { name: "Social Connection", score: 3.4, max: 4, delta:  9 },
              { name: "Compliance",        score: 3.3, max: 4, delta:  4 },
              { name: "Confidence",        score: 3.2, max: 4, delta:  6 },
              { name: "Grades",            score: 3.1, max: 4, delta:  3 },
              { name: "Importance",        score: 3.0, max: 4, delta:  5 },
              { name: "Curiosity",         score: 2.9, max: 4, delta:  3 },
              { name: "Competition",       score: 2.7, max: 4, delta:  7 },
              { name: "Enjoyment",         score: 2.5, max: 4, delta: -2 },
              { name: "Challenge",         score: 2.3, max: 4, delta:  4 },
            ],
          },
          {
            period: "Mar 25 Index",
            range: "3/15/25–4/15/25",
            intrinsicAvg: 17.2, intrinsicMax: 20, intrinsicDelta: 4,
            motivationAvg: 26.1, motivationMax: 40, motivationDelta: -3,
            extrinsicAvg: 11.1, extrinsicMax: 20, extrinsicDelta: -5,
            readingGoalMinutes: 20,
            bennySummary: "Anne showed steady motivation this period with Compliance and Recognition leading. Her Enjoyment score dropped noticeably though — she may be reading to meet expectations rather than out of genuine interest. Consider giving her full choice over her next book, even if it's shorter or easier than usual.",
            recommendedActions: [
              { label: "Challenge",  text: "Set a stretch reading goal with Anne — a longer book or a new genre she hasn't tried before." },
              { label: "Enjoyment",  text: "Let Anne pick her next book freely to rebuild intrinsic motivation." },
            ],
            rankings: [
              { name: "Compliance",        score: 3.5, max: 4, delta:  6 },
              { name: "Recognition",       score: 3.3, max: 4, delta:  2 },
              { name: "Grades",            score: 3.2, max: 4, delta:  8 },
              { name: "Social Connection", score: 3.1, max: 4, delta: -1 },
              { name: "Confidence",        score: 3.0, max: 4, delta:  3 },
              { name: "Challenge",         score: 2.8, max: 4, delta:  5 },
              { name: "Importance",        score: 2.7, max: 4, delta:  2 },
              { name: "Enjoyment",         score: 2.6, max: 4, delta: -4 },
              { name: "Curiosity",         score: 2.4, max: 4, delta: -1 },
              { name: "Competition",       score: 2.1, max: 4, delta:  3 },
            ],
          },
          {
            period: "Feb 25 Index",
            range: "2/15/25–3/15/25",
            intrinsicAvg: 15.8, intrinsicMax: 20, intrinsicDelta: -8,
            motivationAvg: 24.4, motivationMax: 40, motivationDelta: -6,
            extrinsicAvg: 10.5, extrinsicMax: 20, extrinsicDelta: -4,
            readingGoalMinutes: 10,
            bennySummary: "This was a difficult period for Anne's motivation — nearly every dimension declined, with Enjoyment hitting a record low. This likely coincided with her tackling harder books. The Lexile challenge may be outpacing her confidence. Consider stepping back slightly on difficulty to let intrinsic motivation recover before pushing growth again.",
            recommendedActions: [
              { label: "Enjoyment",   text: "Anne's enjoyment scores have dipped — try connecting reading to topics she genuinely loves." },
              { label: "Confidence",  text: "Choose books at or slightly below Anne's current Lexile to rebuild reading confidence." },
            ],
            rankings: [
              { name: "Compliance",        score: 3.6, max: 4, delta:  1 },
              { name: "Grades",            score: 3.2, max: 4, delta:  5 },
              { name: "Recognition",       score: 3.1, max: 4, delta: -3 },
              { name: "Confidence",        score: 2.9, max: 4, delta: -4 },
              { name: "Social Connection", score: 2.8, max: 4, delta: -6 },
              { name: "Importance",        score: 2.6, max: 4, delta: -2 },
              { name: "Challenge",         score: 2.5, max: 4, delta: -1 },
              { name: "Curiosity",         score: 2.3, max: 4, delta: -5 },
              { name: "Enjoyment",         score: 2.2, max: 4, delta: -8 },
              { name: "Competition",       score: 1.9, max: 4, delta: -2 },
            ],
          },
        ],
        actions: [
          { title: "Connect Anne's reading to a self-chosen goal", body: "Extrinsic motivation is down 4 points since last index. Building a personal challenge around her top motivators — Recognition and Social Connection — could help rebuild it." },
          { title: "Check in before her next BTWB conversation", body: "Two open reflections remain incomplete. A brief prompt from you before her next log entry could keep her reflection habit on track." },
        ],
      },
      integrity: {
        score: 75, status: "Improving",
        flaggedSessions: 4, flagDelta: -3,
        flagBreakdown: [
          { type: "Didn't cite details", count: 3 },
          { type: "Logged above limit", count: 1 },
        ],
        unfinishedConversations: 2,
        tileStat: "4", tileSub: "flags ↓3",
        sessions: [
          { date: "05/13/25", title: "Island of the Blue Dolphins", flags: ["time-warning"] },
          { date: "05/10/25", title: "Island of the Blue Dolphins", flags: ["btwb-incomplete"] },
          { date: "05/07/25", title: "Hatchet",                    flags: ["time-warning", "missing-details", "btwb-incomplete"] },
          { date: "05/02/25", title: "Hatchet",                    flags: ["btwb-incomplete"] },
          { date: "04/28/25", title: "The Giver",                  flags: ["book-swap", "time-warning"] },
          { date: "04/22/25", title: "The Giver",                  flags: ["book-swap"] },
          { date: "04/15/25", title: "Hatchet",                    flags: ["time-warning", "missing-details"] },
          { date: "04/10/25", title: "Hatchet",                    flags: ["time-warning"] },
        ],
        actions: [
          { title: "Review Anne's 2 unfinished BTWB conversations", body: "She hasn't completed 2 open reflections. Prompting her to finish them before her next log entry would keep her reflection habit on track." },
          { title: "Watch for time-warning patterns on long sessions", body: "3 of Anne's last 8 sessions triggered a time warning. Consider discussing realistic session lengths with her." },
        ],
      },
      habits: {
        score: 85, status: "Strong",
        currentStreak: 4, avgStreak: 6, personalBest: 6,
        minutesThisWeek: 85, minutesDelta: 12,
        booksLogged: 2, goalHitRate: 68,
        avgSessionMins: 24, daysReadThisMonth: 9, daysInMonth: 15, longestGap: 3, topReadingDay: "Mondays",
        tileStat: "4", tileSub: "day streak",
        dailyGoalMinutes: 20,
        heatmapData: makeHeatmapData(0.63, "peaky"),
        weeks: [
          {
            label: "May 11–17", current: true,
            days: [
              { day: "Sun", minutes: 0  },
              { day: "Mon", minutes: 25 },
              { day: "Tue", minutes: 22 },
              { day: "Wed", minutes: 0  },
              { day: "Thu", minutes: 12 },
              { day: "Fri", minutes: 12 },
              { day: "Sat", minutes: null },
            ],
          },
          {
            label: "May 4–10", current: false,
            days: [
              { day: "Sun", minutes: 0  },
              { day: "Mon", minutes: 28 },
              { day: "Tue", minutes: 20 },
              { day: "Wed", minutes: 0  },
              { day: "Thu", minutes: 32 },
              { day: "Fri", minutes: 25 },
              { day: "Sat", minutes: 0  },
            ],
          },
          {
            label: "Apr 27 – May 3", current: false,
            days: [
              { day: "Sun", minutes: 18 },
              { day: "Mon", minutes: 22 },
              { day: "Tue", minutes: 21 },
              { day: "Wed", minutes: 19 },
              { day: "Thu", minutes: 0  },
              { day: "Fri", minutes: 0  },
              { day: "Sat", minutes: 25 },
            ],
          },
        ],
        actions: [
          { title: "Celebrate the streak — encourage logging today", body: "Anne's personal best is 6 days. Logging today would tie it. A quick nudge could be all she needs." },
          { title: "Help Anne hit her daily goal more consistently", body: "She's meeting her 20-minute goal on reading days but skipping Wed and Sun regularly. A quick habit check-in could smooth that out." },
        ],
      },
      skills: {
        score: 90, status: "Trending up",
        titles: [
          { title: "The Giver",                   author: "Lois Lowry",        lexile: 680, genre: "Dystopian",  sessions: 6, current: false, isbn: "9780618662369" },
          { title: "Hatchet",                     author: "Gary Paulsen",      lexile: 720, genre: "Survival",   sessions: 8, current: false, isbn: "9780689840920" },
          { title: "Island of the Blue Dolphins", author: "Scott O'Dell",      lexile: 750, genre: "Historical", sessions: 5, current: true,  isbn: "9780547328614" },
        ],
        genreCloud: [
          { genre: "Survival",   count: 14 },
          { genre: "Historical", count: 9  },
          { genre: "Dystopian",  count: 8  },
          { genre: "Adventure",  count: 5  },
          { genre: "Fantasy",    count: 3  },
          { genre: "Mystery",    count: 2  },
        ],
        recommendedTitles: [
          { title: "My Side of the Mountain",  author: "Jean Craighead George", lexile: 810, genre: "Survival", isbn: "9780140348101" },
          { title: "The Phantom Tollbooth",    author: "Norton Juster",         lexile: 780, genre: "Fantasy",  isbn: "9780394820378" },
          { title: "From the Mixed-Up Files…", author: "E.L. Konigsburg",       lexile: 800, genre: "Mystery",  isbn: "9780689711817" },
        ],
        recommendedRange: "760–800L",
        monthlyAvg: 730, monthlyDelta: 50,
        gradeLevel: 800, gradeLevelLabel: "Grade 5–6",
        lexileHistory: [
          { month: "Jan", avg: 610 },
          { month: "Feb", avg: 635 },
          { month: "Mar", avg: 655 },
          { month: "Apr", avg: 680 },
          { month: "May", avg: 730 },
        ],
        tileStat: "730L", tileSub: "↑50L this month",
        actions: [
          { title: "Suggest titles in the 760–800L range", body: "Anne's Lexile average is 730L and rising. She's currently reading at 750L — she's ready for a meaningful step up in challenge." },
          { title: "Explore Survival and Historical titles at her next Lexile level", body: "These are her two dominant genres. Sticking in familiar territory while pushing Lexile is the lowest-friction path to growth." },
        ],
      },
    },
    recommendedActions: [
      { title: "Connect Anne's reading to a self-chosen goal", body: "Extrinsic motivation is down 4 pts. Her top motivators are Recognition and Social Connection.", section: "motivation" },
      { title: "Follow up on Anne's 2 unfinished BTWB conversations", body: "She hasn't completed 2 open reflections. A quick prompt before her next log could help.", section: "integrity" },
      { title: "Encourage logging today to tie her personal best streak", body: "Anne's on a 4-day streak — her best is 6. A quick nudge today could lock in the habit.", section: "habits" },
      { title: "Suggest titles in the 760–800L range", body: "Anne's Lexile avg is 730L and rising. She's ready for a meaningful step up.", section: "skills" },
    ],
  },

  // ── Tyler Voss — Struggling ────────────────────────────────────────────────
  tyler: {
    name: "Tyler Voss",
    grade: "6th Grade",
    lastRun: "May 15 at 9:55am",
    healthStatus: "Needs Attention",
    healthIcon: "ti-alert-triangle",
    bennySummary:
      "Tyler needs immediate attention. He's logged only 1 day this week and his reading streak has reset multiple times. His Lexile average has declined 15 points since March — the only student in the class trending downward. He has 13 flagged sessions including 6 suspected over-logs, which means his reading data may not be reliable. His motivation scores are critically low across all dimensions. A direct one-on-one conversation this week is the highest-impact action available.",
    sections: {
      motivation: {
        status: "Watch",
        intrinsic: 32, intrinsicDelta: -8,
        extrinsic: 44, extrinsicDelta: -5,
        tileSub: "/ 100 score",
        rmiHistory: [
          {
            period: "Apr 25 Index",
            range: "4/15/25–5/15/25",
            intrinsicAvg: 6.1, intrinsicMax: 20, intrinsicDelta: -4,
            motivationAvg: 15.2, motivationMax: 40, motivationDelta: -6,
            extrinsicAvg: 8.8, extrinsicMax: 20, extrinsicDelta: -3,
            readingGoalMinutes: 10,
            bennySummary: "Tyler's motivation scores are critically low across all 10 dimensions. Enjoyment — the single strongest predictor of long-term reading engagement — is at 0.8 out of 4. No extrinsic motivator is compensating for it. A personal conversation about what he genuinely finds interesting, completely disconnected from school expectations, is the most important next step.",
            recommendedActions: [
              { label: "Find the Hook",     text: "Ask Tyler to name one topic he genuinely cares about — gaming, sports, comics — and find books that connect to it." },
              { label: "Reduce Pressure",   text: "Tyler's extrinsic motivators (Grades, Compliance) are bottoming out. Consider reducing assessment pressure around reading and focusing on enjoyment first." },
            ],
            rankings: [
              { name: "Compliance",        score: 2.2, max: 4, delta: -3 },
              { name: "Grades",            score: 2.0, max: 4, delta: -5 },
              { name: "Recognition",       score: 1.9, max: 4, delta: -2 },
              { name: "Social Connection", score: 1.7, max: 4, delta: -4 },
              { name: "Confidence",        score: 1.5, max: 4, delta: -6 },
              { name: "Competition",       score: 1.4, max: 4, delta: -1 },
              { name: "Importance",        score: 1.3, max: 4, delta: -3 },
              { name: "Challenge",         score: 1.1, max: 4, delta: -4 },
              { name: "Curiosity",         score: 0.9, max: 4, delta: -5 },
              { name: "Enjoyment",         score: 0.8, max: 4, delta: -7 },
            ],
          },
          {
            period: "Mar 25 Index",
            range: "3/15/25–4/15/25",
            intrinsicAvg: 8.5, intrinsicMax: 20, intrinsicDelta: -3,
            motivationAvg: 18.8, motivationMax: 40, motivationDelta: -4,
            extrinsicAvg: 10.4, extrinsicMax: 20, extrinsicDelta: -2,
            readingGoalMinutes: 15,
            bennySummary: "Tyler's motivation was already low this period and has continued to slide since. Compliance and Grades are his only active motivators — and even those are weakening. He's reading because he feels he has to, not because he wants to. This level of disconnection typically requires a significant intervention, starting with giving him full agency over his next book choice.",
            recommendedActions: [
              { label: "Choice",   text: "Give Tyler full control over his next book selection — even if it's below grade level. Agency can jumpstart motivation." },
              { label: "Momentum", text: "Focus on completing short books successfully rather than challenging Tyler with long texts he may not finish." },
            ],
            rankings: [
              { name: "Compliance",        score: 2.8, max: 4, delta: -1 },
              { name: "Grades",            score: 2.5, max: 4, delta: -2 },
              { name: "Recognition",       score: 2.2, max: 4, delta: -3 },
              { name: "Social Connection", score: 2.0, max: 4, delta: -2 },
              { name: "Confidence",        score: 1.9, max: 4, delta: -4 },
              { name: "Competition",       score: 1.8, max: 4, delta:  1 },
              { name: "Importance",        score: 1.7, max: 4, delta: -2 },
              { name: "Challenge",         score: 1.5, max: 4, delta: -3 },
              { name: "Curiosity",         score: 1.4, max: 4, delta: -2 },
              { name: "Enjoyment",         score: 1.3, max: 4, delta: -4 },
            ],
          },
        ],
        actions: [
          { title: "Have a one-on-one conversation with Tyler about reading", body: "His motivation scores are critically low across all 10 dimensions. System nudges alone will not be enough — personal connection is essential at this level." },
          { title: "Find one book Tyler will actually want to read", body: "Ask Tyler directly what topics excite him outside school. A single book he chooses and finishes can reset the motivation spiral." },
        ],
      },
      integrity: {
        score: 40, status: "Watch",
        flaggedSessions: 13, flagDelta: 5,
        flagBreakdown: [
          { type: "Logged above limit",   count: 6 },
          { type: "Didn't cite details",  count: 4 },
          { type: "Suspicious length",    count: 3 },
        ],
        unfinishedConversations: 7,
        tileStat: "13", tileSub: "flags ↑5",
        sessions: [
          { date: "05/13/25", title: "Holes",                 flags: ["over-limit", "missing-details"] },
          { date: "05/10/25", title: "Holes",                 flags: ["over-limit", "btwb-incomplete"] },
          { date: "05/08/25", title: "Holes",                 flags: ["over-limit", "time-warning", "btwb-incomplete"] },
          { date: "04/30/25", title: "The One and Only Bob",  flags: ["missing-details", "btwb-incomplete"] },
          { date: "04/25/25", title: "The One and Only Bob",  flags: ["over-limit"] },
          { date: "04/18/25", title: "The One and Only Ivan", flags: ["time-warning", "btwb-incomplete"] },
          { date: "04/10/25", title: "The One and Only Ivan", flags: ["missing-details", "btwb-incomplete"] },
          { date: "04/02/25", title: "The One and Only Ivan", flags: ["over-limit", "time-warning"] },
        ],
        actions: [
          { title: "Address the over-logging pattern directly", body: "6 of 13 flags are suspected over-logs. Tyler's reading data is likely inflated. A brief conversation about honest logging — framed positively — is needed before any skill assessment is meaningful." },
          { title: "Review Tyler's 7 unfinished BTWB conversations", body: "He has the most incomplete reflections in the class. Consider simplifying the prompts or doing one verbally to rebuild the habit." },
        ],
      },
      habits: {
        score: 30, status: "Watch",
        currentStreak: 1, avgStreak: 2, personalBest: 3,
        minutesThisWeek: 18, minutesDelta: -12,
        booksLogged: 1, goalHitRate: 22,
        avgSessionMins: 18, daysReadThisMonth: 3, daysInMonth: 15, longestGap: 7, topReadingDay: "Thursdays",
        tileStat: "1", tileSub: "day streak",
        dailyGoalMinutes: 15,
        heatmapData: makeHeatmapData(0.18, "sporadic"),
        weeks: [
          {
            label: "May 11–17", current: true,
            days: [
              { day: "Sun", minutes: 0 },
              { day: "Mon", minutes: 0 },
              { day: "Tue", minutes: 0 },
              { day: "Wed", minutes: 0 },
              { day: "Thu", minutes: 0 },
              { day: "Fri", minutes: 0 },
              { day: "Sat", minutes: null },
            ],
          },
          {
            label: "May 4–10", current: false,
            days: [
              { day: "Sun", minutes: 0 },
              { day: "Mon", minutes: 0 },
              { day: "Tue", minutes: 22 },
              { day: "Wed", minutes: 0 },
              { day: "Thu", minutes: 0 },
              { day: "Fri", minutes: 0 },
              { day: "Sat", minutes: 0 },
            ],
          },
          {
            label: "Apr 27 – May 3", current: false,
            days: [
              { day: "Sun", minutes: 0 },
              { day: "Mon", minutes: 0 },
              { day: "Tue", minutes: 0 },
              { day: "Wed", minutes: 0 },
              { day: "Thu", minutes: 0 },
              { day: "Fri", minutes: 19 },
              { day: "Sat", minutes: 0 },
            ],
          },
        ],
        actions: [
          { title: "Set a micro-goal Tyler can actually hit — 3 days this week", body: "Tyler averaged less than 1 logged day per week last month. Rather than raising the bar, focus on showing up at all — even briefly." },
          { title: "Check in personally — a system nudge won't work here", body: "Tyler has been unresponsive to automated reminders for 6 weeks. A direct personal conversation is the only reliable intervention at this engagement level." },
        ],
      },
      skills: {
        score: 35, status: "Watch",
        titles: [
          { title: "The One and Only Ivan", author: "Katherine Applegate", lexile: 570, genre: "Adventure", sessions: 2, current: false, isbn: "9780062291639" },
          { title: "The One and Only Bob",  author: "Katherine Applegate", lexile: 530, genre: "Adventure", sessions: 2, current: false, isbn: "9780062991577" },
          { title: "Holes",                 author: "Louis Sachar",        lexile: 660, genre: "Adventure", sessions: 1, current: true,  isbn: "9780374332662" },
        ],
        genreCloud: [
          { genre: "Adventure", count: 5 },
          { genre: "Humor",     count: 3 },
          { genre: "Mystery",   count: 1 },
        ],
        recommendedTitles: [
          { title: "Big Nate: In a Class by Himself", author: "Lincoln Peirce", lexile: 560, genre: "Humor", isbn: "9780061944352" },
          { title: "Dog Man",                         author: "Dav Pilkey",     lexile: 520, genre: "Humor", isbn: "9780545581608" },
          { title: "Diary of a Wimpy Kid",            author: "Jeff Kinney",    lexile: 950, genre: "Humor", isbn: "9780810993136" },
        ],
        recommendedRange: "530–570L",
        monthlyAvg: 510, monthlyDelta: -15,
        gradeLevel: 800, gradeLevelLabel: "Grade 6",
        lexileHistory: [
          { month: "Jan", avg: 570 },
          { month: "Feb", avg: 555 },
          { month: "Mar", avg: 540 },
          { month: "Apr", avg: 525 },
          { month: "May", avg: 510 },
        ],
        tileStat: "510L", tileSub: "↓15L this month",
        actions: [
          { title: "Move to books Tyler will actually finish", body: "His Lexile is declining. Books at 520–560L where he can build fluency and confidence will do more than aspirational titles he doesn't engage with." },
          { title: "Address integrity flags before trusting skill data", body: "Tyler has 13 flagged sessions including 6 suspected over-logs. His true Lexile level may not be reflected in the data until logging integrity improves." },
        ],
      },
    },
    recommendedActions: [
      { title: "Intervene directly — Tyler needs a one-on-one conversation", body: "Across all four health indicators, Tyler is in the bottom tier of the class. A personal check-in this week is the highest-impact action.", section: "motivation" },
      { title: "Investigate the 13 flagged sessions before trusting reading data", body: "Suspected over-logging means Tyler's numbers may not reflect actual reading. Address integrity first.", section: "integrity" },
      { title: "Set a micro-goal: just 3 days logged this week", body: "Tyler has logged 1 day this week. Rather than raising the bar, focus on showing up consistently — even briefly.", section: "habits" },
      { title: "Switch to lower-Lexile titles Tyler will actually complete", body: "Tyler's Lexile is declining. Books at 520–560L will build fluency and confidence better than aspirational titles.", section: "skills" },
    ],
  },
};

// ─── Class table data ─────────────────────────────────────────────────────────
const CLASS_TABLE = [
  { key: "marcus", rank: 1, goal: "30m", avg: 98, ac: "blue",   days: [true,   true,   true,   true,   true,   null,  null] },
  { key: "anne",   rank: 2, goal: "20m", avg: 73, ac: "blue",   days: [null,   true,   true,   null,   true,   "24%", null] },
  { key: "tyler",  rank: 3, goal: "15m", avg: 31, ac: "red",    days: [null,   "18%",  null,   null,   null,   null,  null] },
];

// ─── Reading Log ──────────────────────────────────────────────────────────────
const RL_DATA = [
  {
    weekLabel: "July 14–20",
    days: [
      { date: 16, day: "Tuesday", streak: 1, entries: [
        { title: "Fifteen Hundred Miles from the Sun", author: "Jonny Garza Villa", amount: "1,000 Minutes", flagged: true },
        { title: "Found", author: "Margaret Peterson Haddix", amount: "23 Minutes", flagged: false },
      ]},
      { date: 15, day: "Monday",   entries: [] },
      { date: 14, day: "Sunday",   entries: [] },
    ],
  },
  {
    weekLabel: "July 7–13",
    days: [
      { date: 13, day: "Saturday",  entries: [] },
      { date: 12, day: "Friday",    entries: [] },
      { date: 11, day: "Thursday", streak: 2, entries: [
        { title: "Snapdragon", author: "Kat Leyh", amount: "512 Minutes", flagged: true },
      ]},
      { date: 10, day: "Wednesday", streak: 1, entries: [
        { title: "Found", author: "Margaret Peterson Haddix", amount: "18 Minutes", flagged: false },
      ]},
      { date: 9,  day: "Tuesday",   entries: [] },
      { date: 8,  day: "Monday",    entries: [] },
      { date: 7,  day: "Sunday",    entries: [] },
    ],
  },
  {
    weekLabel: "June 30–July 6",
    days: [
      { date: 6,  day: "Saturday", streak: 2, entries: [
        { title: "Fifteen Hundred Miles from the Sun", author: "Jonny Garza Villa", amount: "921 Minutes", flagged: true },
      ]},
      { date: 5,  day: "Friday", streak: 1, entries: [
        { title: "Percy Jackson and the Olympians #1: The Lightning Thief", author: "Rick Riordan", amount: "34 Pages", flagged: false },
      ]},
      { date: 4,  day: "Thursday",  entries: [] },
      { date: 3,  day: "Wednesday", entries: [] },
      { date: 2,  day: "Tuesday",   entries: [] },
      { date: 1,  day: "Monday", streak: 2, entries: [
        { title: "Holes", author: "Louis Sachar", amount: "677 Pages", flagged: true },
      ]},
      { date: 30, day: "Sunday", faded: true, streak: 1, entries: [
        { title: "Holes", author: "Louis Sachar", amount: "844 Minutes", flagged: false },
      ]},
    ],
  },
];

// ─── Reading Log page ─────────────────────────────────────────────────────────
function RLEntryCard({ entry }) {
  return (
    <div className={`bp-rl-entry${entry.flagged ? " bp-rl-entry--flagged" : ""}`}>
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
  );
}

function ReadingLogPage() {
  const [month] = useState("July 2024");
  return (
    <div className="bp-content">
      <PageHeader
        icon="ti-reading-log"
        iconBg="#E0F2FE"
        title="Reading Log"
        right={<button className="bp-btn-ghost bp-btn-ghost--sm">Print log</button>}
      />
      <div className="bp-rl-month-nav">
        <div className="bp-rl-month-label">{month}</div>
        <div className="bp-rl-month-arrows">
          <button className="bp-rl-arrow">‹</button>
          <button className="bp-rl-arrow">›</button>
        </div>
      </div>
      {RL_DATA.map((week, wi) => (
        <div key={wi} className="bp-rl-week">
          <div className="bp-rl-week-label">{week.weekLabel}</div>
          {week.days.map((day, di) => (
            <div key={di} className={`bp-rl-day${day.faded ? " bp-rl-day--faded" : ""}`}>
              <div className="bp-rl-day-col">
                <div className="bp-rl-day-num">{day.date}</div>
                <div className="bp-rl-day-name">{day.day}</div>
                {day.streak > 0 && (
                  <div className="bp-rl-flame">🔥<span>{day.streak}</span></div>
                )}
              </div>
              <div className="bp-rl-entries">
                {day.entries.length > 0
                  ? day.entries.map((e, ei) => <RLEntryCard key={ei} entry={e} />)
                  : !day.faded && <div className="bp-rl-empty">No reading logged</div>
                }
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Placeholder page ─────────────────────────────────────────────────────────
function PlaceholderPage({ pageKey }) {
  const item = NAV_ITEMS.find(n => !n.divider && n.section === pageKey);
  return (
    <div className="bp-content">
      <PageHeader
        icon={item?.icon || "ti-user"}
        iconBg="#F0F0F0"
        title={item?.label || pageKey}
      />
      <div className="bp-placeholder-empty">
        <Ic name={item?.icon || "ti-user"} size={36} style={{ opacity: 0.18 }} />
        <div className="bp-placeholder-text">This section is coming soon.</div>
      </div>
    </div>
  );
}

// ─── Admin mockup ─────────────────────────────────────────────────────────────
function AdminMockup({ onStudentClick, selectedKey }) {
  return (
    <div className="bp-adm">
      {/* Far-left icon rail (shared across prototypes) */}
      <MainRail activeIndex={1} />

      {/* People sidebar */}
      <div className="bp-adm-people">
        <div className="bp-adm-people-top">
          <div className="bp-adm-people-title">People</div>
          <div className="bp-adm-people-sub">Find and log for my students and classes.</div>
        </div>
        <div className="bp-adm-nav">
          <div className="bp-adm-nav-item">
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,opacity:0.75}}>
              <rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="11" y="3" width="6" height="6" rx="1.5"/>
              <rect x="3" y="11" width="6" height="6" rx="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5"/>
            </svg>
            <span>Classes</span>
          </div>
          <div className="bp-adm-nav-item bp-adm-nav-item--open">
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,opacity:0.85}}>
              <circle cx="7.5" cy="6" r="2.5"/>
              <path d="M2 17c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/>
              <circle cx="14.5" cy="6" r="2" opacity="0.7"/>
              <path d="M17 17c0-2.5-1.5-4-3.5-4.5" opacity="0.7"/>
            </svg>
            <span>Students</span>
          </div>
          <div className="bp-adm-nav-subgroup">
            <div className="bp-adm-nav-child bp-adm-nav-child--active">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,opacity:0.8}}>
                <circle cx="10" cy="7" r="3"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
              </svg>
              View Students
            </div>
            <div className="bp-adm-nav-child">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,opacity:0.8}}>
                <path d="M5 3h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
                <path d="M7 8h6M7 11h6M7 14h3"/>
                <circle cx="15.5" cy="14.5" r="2.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor"/>
                <line x1="14.5" y1="14.5" x2="16.5" y2="14.5"/><line x1="15.5" y1="13.5" x2="15.5" y2="15.5"/>
              </svg>
              Flagged Entries
            </div>
          </div>
        </div>
      </div>

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
            <button className="bp-adm-btn-ghost">Set Classroom Goal</button>
            <button className="bp-adm-btn-primary">Log for Class</button>
          </div>
        </div>

        <div className="bp-adm-tabs">
          {["Daily Reading","Students","Earned Rewards"].map((t,i) => (
            <div key={t} className={`bp-adm-tab${i===0?" bp-adm-tab--active":""}`}>{t}</div>
          ))}
        </div>

        <div className="bp-adm-filters">
          {[["View as …","Reading Goal"],["Log Type","Minutes"],["Show as …","Percentages"]].map(([lbl,val]) => (
            <div key={lbl} className="bp-adm-filter">
              <div className="bp-adm-filter-lbl">{lbl}</div>
              <div className="bp-adm-filter-sel">{val} <span style={{opacity:0.5}}>∨</span></div>
            </div>
          ))}
          <button className="bp-adm-save-btn" disabled>Save &amp; Update</button>
        </div>

        <div className="bp-adm-card">
          <div className="bp-adm-week-nav">
            <button className="bp-adm-week-btn">‹</button>
            <span className="bp-adm-week-label">5/11 – 5/17 (This Week)</span>
            <button className="bp-adm-week-btn" style={{opacity:0.3}}>›</button>
          </div>
          <table className="bp-adm-table">
            <thead>
              <tr>
                <th style={{width:160}}></th>
                <th>Goal</th>
                <th>Average</th>
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {CLASS_TABLE.map(s => (
                <tr
                  key={s.key}
                  className={`bp-adm-row${selectedKey === s.key ? " bp-adm-row--selected" : ""}`}
                  onClick={() => onStudentClick?.(s.key)}
                  onKeyDown={e => e.key === "Enter" && onStudentClick?.(s.key)}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <div className="bp-adm-student-cell">
                      <span className={`bp-adm-rank bp-adm-rank--${s.rank===1?"gold":s.rank===2?"silver":"bronze"}`}>{s.rank}</span>
                      <span className="bp-adm-student-name">{STUDENTS[s.key].name}</span>
                    </div>
                  </td>
                  <td className="bp-adm-goal-cell">
                    <span className="bp-adm-goal-val">{s.goal}</span>
                    <button className="bp-adm-goal-edit-btn" title="Edit goal" onClick={e => e.stopPropagation()}>
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
                        <path d="M8.5 1.5 l2 2 L3 11 l-2.5.5.5-2.5z"/>
                        <path d="M7 3l2 2"/>
                      </svg>
                    </button>
                  </td>
                  <td><span className={`bp-adm-pct bp-adm-pct--${s.ac}`}>{s.avg}%</span></td>
                  {s.days.map((d,i)=>(
                    <td key={i} className="bp-adm-day-td">
                      {d===null ? <span className="bp-adm-dash">–</span>
                       : d===true ? <span className="bp-adm-check-circle"><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="10" height="10"><polyline points="1.5,5 4,7.5 8.5,2.5"/></svg></span>
                       : <span className={`bp-adm-pct bp-adm-pct--${s.ac === "red" ? "red" : "orange"}`}>{d}</span>}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bp-adm-avg-row">
                <td colSpan={2}>Class Average</td>
                <td>67%</td>
                {["–","58%","50%","33%","67%","24%","–"].map((v,i)=><td key={i}>{v}</td>)}
              </tr>
            </tbody>
          </table>
          <div className="bp-adm-legend">
            <span style={{color:"#EF4444"}}>● 0–33%</span>
            <span style={{color:"#F59E0B"}}>● 34–66%</span>
            <span style={{color:"#3B82F6"}}>● 66–99%</span>
            <span style={{color:"#10B981"}}>✓ 100%</span>
          </div>
        </div>
        </div>{/* bp-adm-main-body */}
      </div>
    </div>
  );
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
          {activeSection === null
            ? <Overview student={student} onNavigate={setActiveSection} />
            : ANALYSIS_SECTIONS.has(activeSection)
              ? <SectionDetail student={student} sectionKey={activeSection} />
              : activeSection === 'readinglog'
                ? <ReadingLogPage />
                : <PlaceholderPage pageKey={activeSection} />
          }
        </div>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function BeanstackProfile() {
  const [activeSection,      setActiveSection]      = useState(null);
  const [profileMode,        setProfileMode]        = useState("closed");
  const [selectedStudentKey, setSelectedStudentKey] = useState(null);

  const student = selectedStudentKey ? STUDENTS[selectedStudentKey] : null;

  const handleStudentClick = (key) => {
    setSelectedStudentKey(key);
    setActiveSection(null);
    setProfileMode("side");
  };

  const closeProfile = () => setProfileMode("closed");

  return (
    <div className="bp-shell">
      {/* Admin bg */}
      <div className={`bp-shell-admin${profileMode === "full" ? " bp-shell-admin--hidden" : ""}`}>
        <AdminMockup onStudentClick={handleStudentClick} selectedKey={selectedStudentKey} />
      </div>

      {/* Dim overlay */}
      {profileMode === "side" && (
        <div className="bp-shell-overlay" onClick={closeProfile} style={{ pointerEvents: "auto", cursor: "pointer" }} />
      )}

      {/* Profile panel */}
      {profileMode !== "closed" && student && (
        <div className={`bp-profile-wrap${profileMode === "full" ? " bp-profile-wrap--full" : ""}`}>
          <div className="bp-profile-ctrls">
            <button className="bp-ctrl-btn" onClick={closeProfile} title="Close profile">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <line x1="1" y1="1" x2="10" y2="10" stroke="#555" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="10" y1="1" x2="1"  y2="10" stroke="#555" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Mobile-only top bar — hidden on desktop via CSS */}
          <div className="bp-profile-topbar">
            <button className="bp-profile-topbar-close" onClick={closeProfile} aria-label="Close profile">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8"/>
              </svg>
            </button>
            <div className="bp-profile-topbar-title">
              <span className="bp-profile-topbar-name">{student.name}</span>
              <span className="bp-profile-topbar-grade">{student.grade}</span>
            </div>
            <StudentActions />
          </div>

          <div className="bp-root">
            <LeftNav activeSection={activeSection} onNavigate={setActiveSection} />
            <div className="bp-panel">
              <StudentHeader student={student} />
              <div key={`${selectedStudentKey}-${activeSection ?? "overview"}`} className="bp-page-fade">
                {activeSection === null
                  ? <Overview student={student} onNavigate={setActiveSection} />
                  : ANALYSIS_SECTIONS.has(activeSection)
                    ? <SectionDetail student={student} sectionKey={activeSection} />
                    : activeSection === "readinglog"
                      ? <ReadingLogPage />
                      : <PlaceholderPage pageKey={activeSection} />
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
