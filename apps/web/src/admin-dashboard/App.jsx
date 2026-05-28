import { useState } from "react";

import { DEFAULT_ROWS_BY_ROLE, DEFAULT_SETTINGS_BY_ROLE } from "./data";
import { WIDGET_CATALOG } from "./components/widgets";
import { SettingsPopover } from "./components/SettingsPopover";
import { FixedRail, FeatureBar } from "./components/FixedRegions";
import { CardGrid } from "./components/CardGrid";
import { MainRail } from "../MainRail";
import { PrototypeNav } from "../PrototypeNav";
import { Button } from "../ris/components/Button";
import { CustomSelect } from "../ris/components/CustomSelect";
import { Modal } from "../ris/components/Modal";
import { IconButton, EmptyState } from "../ris/components/Primitives";
import "../ris/components/Button.css";
import "../ris/components/CustomSelect.css";
import "../ris/components/Primitives.css";
import "../MainRail.css";
import "./index.css";

const ROLES = [
  { value: "teacher", label: "Teacher view" },
  { value: "media",   label: "Media Specialist view" },
  { value: "library", label: "Public Library view" },
  { value: "kitchen", label: "Kitchen Sink view" },
];
// The Kitchen Sink view is a catalog demo — it shows every widget regardless of
// the per-widget `roles` gate.
const widgetAllowed = (cat, role) => !!cat && (role === "kitchen" || !cat.roles || cat.roles.includes(role));
const ROLE_KEY = "adm-user-role";

function greeting() {
  const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return `👋 Happy ${day}, Ellen!`;
}

// Small icon helpers (use SVG so they scale with the Button)
const Caret = () => (
  <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="4,6 8,10 12,6" />
  </svg>
);
const Pencil = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 2l3 3-9 9H2v-3z" />
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3,8 7,12 13,4" />
  </svg>
);
const Cog = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);
const Grip = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="6" r="1.2" fill="currentColor" />
    <circle cx="9" cy="12" r="1.2" fill="currentColor" />
    <circle cx="9" cy="18" r="1.2" fill="currentColor" />
    <circle cx="15" cy="6" r="1.2" fill="currentColor" />
    <circle cx="15" cy="12" r="1.2" fill="currentColor" />
    <circle cx="15" cy="18" r="1.2" fill="currentColor" />
  </svg>
);
const Megaphone = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 11v2a3 3 0 0 0 3 3h2l8 4V4l-8 4H6a3 3 0 0 0-3 3z" />
    <path d="M18 8a4 4 0 0 1 0 8" />
  </svg>
);
// Empty-state icon for "every widget is already placed" — a 2x2 grid with
// a checkmark over the top-right cell.
const DashboardFullSvg = () => (
  <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4"  y="4"  width="10" height="10" rx="2" />
    <rect x="4"  y="18" width="10" height="10" rx="2" />
    <rect x="18" y="18" width="10" height="10" rx="2" />
    <rect x="18" y="4"  width="10" height="10" rx="2" fill="currentColor" fillOpacity="0.1" />
    <polyline points="20.5,9 22.5,11 25.5,7.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

// Tiny visual previews for the Add Widget panel.
function WidgetThumb({ id }) {
  const stats = <div className="thumb-stats"><span /><span /><span /><span /></div>;
  const rows = <div className="thumb-rows"><span /><span /><span /><span /></div>;
  const grid = <div className="thumb-grid">{Array.from({ length: 6 }).map((_, i) => <span key={i} />)}</div>;
  const lines = <div className="thumb-lines"><span /><span /><span /></div>;
  const map = {
    "stat-tiles": stats,
    "flagged-sessions": stats,
    "leaderboard-combo": rows,
    "daily-tracker": (
      <div className="thumb-table">
        <div className="thumb-table-row" />
        <div className="thumb-table-row" />
        <div className="thumb-table-row" />
      </div>
    ),
    "leaderboard-students": rows,
    "leaderboard-classes": rows,
    "leaderboard-staff": rows,
    "leaderboard-patrons": rows,
    "leaderboard-branches": rows,
    "top-books": rows,
    "top-badges": rows,
    "quick-links": grid,
    "questions": lines,
  };
  return map[id] || stats;
}

// ─── Per-role row layout persistence ──────────────────────────────────────────
const STORAGE_KEY_BASE = "adm-dashboard-rows-v1";
const storageKey = (role) => `${STORAGE_KEY_BASE}-${role}`;
const isFullBleed = (id) => !!WIDGET_CATALOG[id]?.fixedWidth;

function defaultsFor(role) {
  const rows = DEFAULT_ROWS_BY_ROLE[role] || DEFAULT_ROWS_BY_ROLE.teacher;
  return {
    rows: rows.map((r) => [...r]),
    settings: { ...(DEFAULT_SETTINGS_BY_ROLE[role] || {}) },
  };
}
function loadState(role) {
  try {
    const raw = localStorage.getItem(storageKey(role));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.rows)) {
        return { rows: parsed.rows, settings: parsed.settings || {} };
      }
    }
  } catch {}
  return defaultsFor(role);
}
function saveState(role, state) {
  try { localStorage.setItem(storageKey(role), JSON.stringify(state)); } catch {}
}

export function App() {
  const [editing, setEditing] = useState(false);
  const [role, setRole] = useState(() => {
    try { return localStorage.getItem(ROLE_KEY) || "teacher"; } catch { return "teacher"; }
  });
  const [featureOn, setFeatureOn] = useState(() => {
    try { return localStorage.getItem("adm-feature-on") !== "0"; } catch { return true; }
  });
  const [{ rows, settings }, _setState] = useState(() => loadState(role));
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(null); // { id, anchorRect } | null

  const setState = (next) => { _setState(next); saveState(role, next); };

  const updateRole = (next) => {
    setRole(next);
    _setState(loadState(next));
    setOpenSettings(null);
    try { localStorage.setItem(ROLE_KEY, next); } catch {}
  };
  const toggleFeature = () => {
    const next = !featureOn;
    setFeatureOn(next);
    try { localStorage.setItem("adm-feature-on", next ? "1" : "0"); } catch {}
  };
  const toggleEditing = () => { setOpenSettings(null); setEditing((e) => !e); };
  const resetDashboard = () => {
    try { localStorage.removeItem(storageKey(role)); } catch {}
    _setState(defaultsFor(role));
    setOpenSettings(null);
    setPaletteOpen(false);
  };

  // Rows visible for this role (filter ids by catalog + role; drop empty rows).
  const visibleRows = rows
    .map((row) => row.filter((id) => widgetAllowed(WIDGET_CATALOG[id], role)))
    .filter((row) => row.length > 0);
  const placedIds = new Set(visibleRows.flat());

  // ─── Mutators ────────────────────────────────────────────────────────
  const onRowsChange = (nextRows) => setState({ rows: nextRows, settings });

  const addWidget = (id) => {
    if (!WIDGET_CATALOG[id] || placedIds.has(id)) return;
    setState({ rows: [...rows, [id]], settings });
  };
  const removeWidget = (id) => {
    const nextRows = rows.map((r) => r.filter((x) => x !== id)).filter((r) => r.length > 0);
    const nextSettings = { ...settings };
    delete nextSettings[id];
    setState({ rows: nextRows, settings: nextSettings });
  };
  const updateSettings = (id, patch) =>
    setState({ rows, settings: { ...settings, [id]: { ...(settings[id] || {}), ...patch } } });
  const resetSettings = (id) => {
    const nextSettings = { ...settings };
    delete nextSettings[id];
    setState({ rows, settings: nextSettings });
  };

  // Render a single widget card (chrome in edit mode + widget body).
  const renderCard = (id) => {
    const cat = WIDGET_CATALOG[id];
    if (!cat) return null;
    const Comp = cat.component;
    const widgetSettings = settings[id] || {};
    const widgetFields = typeof cat.settingsFields === "function"
      ? cat.settingsFields(role)
      : (cat.settingsFields || []);
    const hasSettings = widgetFields.length > 0;
    const isSettingsOpen = openSettings?.id === id;
    return (
      <div
        data-widget-id={id}
        className={[
          "adm-cell",
          editing && "adm-cell--editing",
          cat.scrollable && "adm-cell--scroll",
          cat.size === "small" && "adm-cell--small",
        ].filter(Boolean).join(" ")}
      >
        {editing && (
          <div className="adm-cell-chrome">
            <span className="adm-cell-handle">
              <span className="adm-cell-grip"><Grip /></span>
              <span>{cat.titleFn ? cat.titleFn(widgetSettings) : cat.name}</span>
            </span>
            <div className="adm-cell-actions">
              {hasSettings && (
                <button
                  type="button"
                  className={`adm-cell-action ${isSettingsOpen ? "is-on" : ""}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) =>
                    setOpenSettings(
                      isSettingsOpen
                        ? null
                        : { id, anchorRect: e.currentTarget.getBoundingClientRect() }
                    )
                  }
                  title="Widget settings"
                >
                  <Cog />
                </button>
              )}
              <button
                type="button"
                className="adm-cell-action"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => removeWidget(id)}
                title="Remove widget"
              >
                <XIcon />
              </button>
            </div>
          </div>
        )}
        {isSettingsOpen && (
          <SettingsPopover
            anchorRect={openSettings.anchorRect}
            fields={widgetFields}
            value={widgetSettings}
            defaults={cat.defaults || {}}
            onChange={(patch) => updateSettings(id, patch)}
            onReset={() => resetSettings(id)}
            onClose={() => setOpenSettings(null)}
          />
        )}
        <Comp settings={{ ...(cat.defaults || {}), ...widgetSettings }} role={role} />
      </div>
    );
  };

  const availableWidgets = Object.entries(WIDGET_CATALOG).filter(
    ([id, c]) => !placedIds.has(id) && widgetAllowed(c, role)
  );

  return (
    <>
    <div className="adm-shell">
      <MainRail activeIndex={4} />
      <div className="adm">

      <header className="adm-topbar">
        <h1 className="adm-h1">{greeting()}</h1>
        <div className="adm-topbar-r">
          <CustomSelect options={ROLES} value={role} onChange={updateRole} placeholder="Role" size="md" />
          <Button variant="primary" iconRight={<Caret />}>Log Reading</Button>
          <Button
            variant={featureOn ? "primary" : "secondary"}
            icon={<Megaphone />}
            onClick={toggleFeature}
            title={featureOn ? "Hide feature announcement" : "Show feature announcement"}
            aria-label="Toggle feature announcement"
            className="adm-edit-btn"
          />
          <Button
            variant={editing ? "primary" : "secondary"}
            icon={editing ? <Check /> : <Pencil />}
            onClick={toggleEditing}
            title={editing ? "Done editing" : "Edit dashboard"}
            aria-label={editing ? "Done editing" : "Edit dashboard"}
            className="adm-edit-btn"
          />
        </div>
      </header>

      {featureOn && <FeatureBar onClose={toggleFeature} />}

      <div className="adm-main">
        <div className={`adm-grid-wrap ${editing ? "is-editing" : ""}`}>
          {editing && (
            <div className="adm-edit-hint">
              <span>Drag a card onto another to place them side by side, or into a gap for a new row.</span>
              <div className="adm-edit-hint-actions">
                <Button size="sm" variant="secondary" onClick={resetDashboard}>
                  Reset to default
                </Button>
                <Button size="sm" variant="primary" onClick={() => setPaletteOpen(true)}>
                  ＋ Add widget
                </Button>
              </div>
            </div>
          )}
          {visibleRows.length === 0 ? (
            <div className="adm-empty">
              <h3>Your dashboard is empty</h3>
              <p>Add widgets to build your dashboard.</p>
              <div className="adm-empty-actions">
                {!editing && (
                  <button className="adm-btn adm-btn--primary" onClick={toggleEditing}>Edit dashboard</button>
                )}
                {editing && (
                  <button className="adm-btn adm-btn--primary" onClick={() => setPaletteOpen(true)}>＋ Add widget</button>
                )}
              </div>
            </div>
          ) : (
            <CardGrid
              rows={visibleRows}
              editing={editing}
              renderCard={renderCard}
              onRowsChange={onRowsChange}
              isFullBleed={isFullBleed}
            />
          )}
        </div>

        <FixedRail
          editing={editing}
          role={role}
          settings={settings}
          updateSettings={updateSettings}
          resetSettings={resetSettings}
          openSettings={openSettings}
          setOpenSettings={setOpenSettings}
        />
      </div>

      {/* Palette panel — only widgets allowed for this role */}
      <Modal
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        variant="side"
        ariaLabel="Add widget"
      >
        {({ close }) => (
          <div className="adm-side-pane">
            <header className="adm-side-head">
              <div className="adm-side-head-text">
                <h2 className="adm-side-title">Add widget</h2>
                {availableWidgets.length > 0 && (
                  <div className="adm-side-sub">{availableWidgets.length} available</div>
                )}
              </div>
              <IconButton variant="ghost" size="sm" onClick={close} aria-label="Close">
                <XIcon />
              </IconButton>
            </header>
            <div className={`adm-side-body ${availableWidgets.length === 0 ? "adm-side-body--empty" : ""}`}>
              {availableWidgets.length === 0 ? (
                <EmptyState
                  icon={<DashboardFullSvg />}
                  title="Your dashboard is fully loaded"
                  description="Every widget for this role is already on the dashboard. Remove a card to free up space for something new."
                />
              ) : (
                <div className="adm-card-list">
                  {availableWidgets.map(([id, c]) => (
                    <button
                      key={id}
                      type="button"
                      className="adm-card"
                      onClick={() => { addWidget(id); close(); }}
                    >
                      <div className="adm-card-thumb"><WidgetThumb id={id} /></div>
                      <div className="adm-card-body">
                        <div className="adm-card-title">{c.name}</div>
                        <p className="adm-card-desc">{c.desc}</p>
                      </div>
                      <span className="adm-card-add">＋</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
      </div>
    </div>
    <PrototypeNav currentHref="/bs-prototypes/admin-dashboard/" />
    </>
  );
}
