import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { DEFAULT_LAYOUT, REQUIRED_WIDGETS } from "./data";
import { WIDGET_CATALOG, WIDTH_TO_COLS, COLS_TO_WIDTH, WIDTH_FIELD } from "./components/widgets";
import { SettingsPopover } from "./components/SettingsPopover";
import { TemplatesPanel } from "./components/TemplatesPanel";
import { FixedRail, AlertsCard, FeatureBar } from "./components/FixedRegions";
import { MainRail } from "../MainRail";
import { PrototypeNav } from "../PrototypeNav";
import { Button } from "../ris/components/Button";
import { CustomSelect } from "../ris/components/CustomSelect";
import "../ris/components/Button.css";
import "../ris/components/CustomSelect.css";
import "../MainRail.css";
import "./index.css";

const DISTRICTS = [
  { value: "main",   label: "Main District" },
  { value: "north",  label: "Northside Schools" },
  { value: "south",  label: "Southside Schools" },
];

const ROLES = [
  { value: "teacher", label: "Teacher view" },
  { value: "media",   label: "Media Specialist view" },
];
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

// Chrome action icons — clean SVGs in place of emojis
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
// Tiny visual previews for the Add Widget panel — schematic rectangles that
// hint at each widget's shape.
function WidgetThumb({ id }) {
  const stats = (
    <div className="thumb-stats">
      <span /><span /><span /><span />
    </div>
  );
  const rows = (
    <div className="thumb-rows">
      <span /><span /><span /><span />
    </div>
  );
  const grid = (
    <div className="thumb-grid">
      {Array.from({ length: 6 }).map((_, i) => <span key={i} />)}
    </div>
  );
  const lines = (
    <div className="thumb-lines">
      <span /><span /><span />
    </div>
  );
  const map = {
    "stat-tiles": stats,
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
    "leaderboard-schools": rows,
    "quick-links": grid,
    "questions": lines,
  };
  return map[id] || stats;
}

const Pin = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="17" x2="12" y2="22" />
    <path d="M5 17h14l-3-4V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v7z" />
  </svg>
);

const ResponsiveGrid = WidthProvider(Responsive);
// NOTE: react-grid-layout's Responsive uses the *container* width (not the
// window width) for breakpoint detection. Our grid wrap is roughly
// (viewport - sidebar - rail - padding) wide, so a 1280px viewport yields a
// ~720px container. These breakpoints are tuned to that container width.
const BREAKPOINTS = { lg: 640, md: 480, sm: 320, xs: 0 };
const COLS        = { lg: 12,  md: 8,   sm: 4,   xs: 2 };
const STORAGE_KEY = "adm-dashboard-rgl-v17";

/**
 * Stretch each row's items so they fill the available column width.
 * Items are grouped by their `y` start; if a row's total `w` is less than the
 * column count, the remaining columns are distributed proportionally among the
 * items in that row (with min-width clamping). Items that already fill the row
 * (or overflow) are left alone.
 */
function stretchRowsToFill(layout, cols) {
  if (!layout || !layout.length) return layout;
  const byY = new Map();
  for (const item of layout) {
    const row = byY.get(item.y) || [];
    row.push(item);
    byY.set(item.y, row);
  }
  const result = [];
  for (const [, row] of byY) {
    const sorted = [...row].sort((a, b) => a.x - b.x);
    const totalW = sorted.reduce((s, i) => s + i.w, 0);
    if (totalW >= cols) {
      result.push(...sorted);
      continue;
    }
    // Distribute extra columns proportionally based on current widths
    const free = cols - totalW;
    let runningX = 0;
    sorted.forEach((item, idx) => {
      const share = idx === sorted.length - 1
        ? cols - runningX
        : Math.max(item.minW || 1, Math.round(item.w + (item.w / totalW) * free));
      result.push({ ...item, x: runningX, w: share });
      runningX += share;
    });
  }
  return result;
}

function ensureRequired(layouts) {
  // For every breakpoint, make sure every required widget is present
  // at its pinned position. Missing required widgets get inserted.
  const out = {};
  for (const bp of Object.keys(layouts)) {
    const items = [...(layouts[bp] || [])];
    for (const [id, pos] of Object.entries(REQUIRED_WIDGETS)) {
      const idx = items.findIndex((l) => l.i === id);
      const pinned = { i: id, ...pos };
      if (idx === -1) items.unshift(pinned);
      else items[idx] = { ...items[idx], ...pinned };
    }
    out[bp] = items;
  }
  if (!out.lg) out.lg = DEFAULT_LAYOUT.map((l) => ({ ...l }));
  return out;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        layouts: ensureRequired(parsed.layouts || { lg: [] }),
        settings: parsed.settings || {},
        presetId: parsed.presetId || "blank",
      };
    }
  } catch {}
  return {
    layouts: ensureRequired({ lg: DEFAULT_LAYOUT }),
    settings: {},
    presetId: "blank",
  };
}
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function App() {
  const [editing, setEditing] = useState(false);
  const [role, setRole] = useState(() => {
    try { return localStorage.getItem(ROLE_KEY) || "teacher"; } catch { return "teacher"; }
  });
  const updateRole = (next) => {
    setRole(next);
    try { localStorage.setItem(ROLE_KEY, next); } catch {}
  };
  const [featureOn, setFeatureOn] = useState(() => {
    try { return localStorage.getItem("adm-feature-on") !== "0"; } catch { return true; }
  });
  const toggleFeature = () => {
    const next = !featureOn;
    setFeatureOn(next);
    try { localStorage.setItem("adm-feature-on", next ? "1" : "0"); } catch {}
  };
  const [{ layouts, settings, presetId }, _setState] = useState(loadState);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(null); // { id, anchorRect } | null
  const [contentHeights, setContentHeights] = useState({}); // px per widget id
  const measureRefs = useRef({});

  // ResizeObserver wiring: for each non-scrollable widget, watch the measure
  // wrapper's scrollHeight so we can auto-fit its RGL row count to content.
  const setMeasureRef = useCallback((id, el) => {
    if (el) measureRefs.current[id] = el;
    else delete measureRefs.current[id];
  }, []);

  useEffect(() => {
    const observers = [];
    for (const [id, wrapper] of Object.entries(measureRefs.current)) {
      const w = wrapper.firstElementChild; // .adm-w
      if (!w) continue;
      // Natural height = head + body's true content (children + padding) + footer.
      // We sum children instead of reading .adm-w.offsetHeight because .adm-w
      // is stretched (height: 100%) so its offsetHeight = cell height, not
      // natural content size.
      const update = () => {
        const head = w.querySelector('.adm-w-head');
        const body = w.querySelector('.adm-w-body');
        const footer = w.querySelector('.adm-w-footer');
        const headH = head ? head.offsetHeight : 0;
        const footerH = footer ? footer.offsetHeight : 0;
        let bodyH = 0;
        if (body) {
          const cs = window.getComputedStyle(body);
          const pad = parseFloat(cs.paddingTop || 0) + parseFloat(cs.paddingBottom || 0);
          const innerH = [...body.children].reduce((s, c) => s + c.offsetHeight, 0);
          bodyH = innerH + pad;
        }
        const h = headH + bodyH + footerH;
        if (!h) return;
        setContentHeights((prev) => (prev[id] === h ? prev : { ...prev, [id]: h }));
      };
      // Observe every child so any inner change re-fires
      const ro = new ResizeObserver(update);
      ro.observe(w);
      for (const c of w.children) ro.observe(c);
      update();
      observers.push(ro);
    }
    return () => { for (const ro of observers) ro.disconnect(); };
  }, [layouts, settings]);  // re-run when widgets are added/removed/configured

  const setState = (next) => {
    _setState(next);
    saveState(next);
  };

  // The lg layout is the source of truth for which widgets are placed.
  // Filter out any items whose widget id is no longer in WIDGET_CATALOG
  // (avoids a blank-looking grid when stale localStorage references
  // deprecated widgets). Also filter widgets disallowed for the current
  // role (e.g. teachers don't see staff widgets).
  const baseLayout = useMemo(
    () => (layouts.lg || DEFAULT_LAYOUT).filter((l) => {
      const cat = WIDGET_CATALOG[l.i];
      if (!cat) return false;
      if (cat.roles && !cat.roles.includes(role)) return false;
      return true;
    }),
    [layouts, role]
  );
  const placedIds = useMemo(() => new Set(baseLayout.map((l) => l.i)), [baseLayout]);

  // ─── Mutators ────────────────────────────────────────────────────────
  const onLayoutChange = (current, allLayouts) => {
    const merged = {};
    for (const bp of Object.keys(allLayouts)) {
      merged[bp] = allLayouts[bp].map((n) => {
        const prev = (layouts[bp] || []).find((l) => l.i === n.i) || {};
        return { ...prev, ...n };
      });
    }
    setState({ layouts: merged, settings, presetId: "custom" });
  };

  // Edit-mode toggle. Scrollable widgets get a few extra rows added to their
  // cell so the visible widget body stays the same size as view mode (edit
  // mode adds 56px chrome + 48px footer that view mode doesn't have). We
  // pad on enter / strip on exit instead of doing it in computedLayouts so
  // RGL doesn't race with our state updates during user drags.
  //
  // We need body_edit ≈ body_view. cell_edit - body padding (56+48) should
  // equal cell_view - widget head (~57px). So cell_edit - cell_view ≈ 47px.
  // 3 rows × 17px = 51px → body_edit ends up 4px larger than body_view, just
  // enough headroom to keep dragged content visible after exiting edit.
  const EDIT_EXTRA_ROWS = 3;
  const toggleEditing = () => {
    const next = !editing;
    const delta = next ? EDIT_EXTRA_ROWS : -EDIT_EXTRA_ROWS;
    const merged = {};
    for (const bp of Object.keys(layouts)) {
      merged[bp] = (layouts[bp] || []).map((l) => {
        const cat = WIDGET_CATALOG[l.i];
        if (!cat?.scrollable) return l;
        return { ...l, h: Math.max(cat.min?.h || 1, (l.h || 0) + delta) };
      });
    }
    setEditing(next);
    setState({ layouts: merged, settings, presetId });
  };

  const removeWidget = (id) => {
    if (REQUIRED_WIDGETS[id]) return;
    const next = {};
    for (const bp of Object.keys(layouts)) {
      next[bp] = (layouts[bp] || []).filter((l) => l.i !== id);
    }
    const nextSettings = { ...settings };
    delete nextSettings[id];
    setState({
      layouts: next,
      settings: nextSettings,
      presetId: "custom",
    });
  };

  const addWidget = (id) => {
    const cat = WIDGET_CATALOG[id];
    if (!cat) return;
    const maxY = baseLayout.reduce((m, l) => Math.max(m, l.y + l.h), 0);
    const startW = Math.max(cat.min.w * 3, 6);
    // Scrollable widgets get a starter h sized for ~15 rows of list content
    // (~34 rows × 17px = ~562px cell, which fits 15 rows + header). Non-
    // scrollable widgets get min.h since they auto-grow via measurement.
    const startH = cat.scrollable ? 34 : (cat.min.h || 4);
    const item = {
      i: id,
      x: 0,
      y: maxY,
      w: startW,
      h: startH,
      minW: cat.min.w * 3,
      minH: cat.min.h || 4,
    };
    const next = {};
    for (const bp of Object.keys(layouts)) {
      next[bp] = [...(layouts[bp] || []), item];
    }
    if (!next.lg) next.lg = [...baseLayout, item];
    setState({
      layouts: next,
      settings: { ...settings, [id]: { ...(settings[id] || {}), width: COLS_TO_WIDTH(startW) } },
      presetId: "custom",
    });
  };

  const setWidgetWidth = (id, width) => {
    setState({
      layouts, presetId: "custom",
      settings: { ...settings, [id]: { ...(settings[id] || {}), width } },
    });
  };

  const updateSettings = (id, patch) => {
    setState({
      layouts, presetId,
      settings: { ...settings, [id]: { ...(settings[id] || {}), ...patch } },
    });
  };

  const resetSettings = (id) => {
    const nextSettings = { ...settings };
    delete nextSettings[id];
    setState({ layouts, settings: nextSettings, presetId });
  };

  const resetLayout = () => {
    setState({
      layouts: ensureRequired({ lg: DEFAULT_LAYOUT.map((l) => ({ ...l })) }),
      settings: {},
      presetId: "blank",
    });
  };

  const applyPreset = (preset) => {
    // Drop widgets disallowed for the current role before applying.
    const layout = preset.layout.filter((l) => {
      const c = WIDGET_CATALOG[l.i];
      return !!c && (!c.roles || c.roles.includes(role));
    });
    const seededSettings = { ...preset.settings };
    for (const item of layout) {
      seededSettings[item.i] = {
        ...seededSettings[item.i],
        width: COLS_TO_WIDTH(item.w),
      };
    }
    setState({
      layouts: ensureRequired({ lg: layout.map((l) => ({ ...l })) }),
      settings: seededSettings,
      presetId: preset.id,
    });
    setTemplatesOpen(false);
  };

  // Apply lock state + force required widgets to static + their pinned pos,
  // auto-fit row count for non-scrollable widgets to their content height,
  // then stretch each row to fill the available column width for that breakpoint.
  // RGL row math: each row is rowHeight (56) + marginY (14), with the first
  // row's margin absorbed → h_px = rows * 56 + (rows-1) * 14.
  // Inverse: rows = ceil((h_px + 14) / 70).
  const computedLayouts = useMemo(() => {
    const out = {};
    for (const bp of Object.keys(layouts)) {
      let items = (layouts[bp] || [])
        .filter((l) => {
          const c = WIDGET_CATALOG[l.i];
          return !!c && (!c.roles || c.roles.includes(role));
        })
        .map((l) => {
          const req = REQUIRED_WIDGETS[l.i];
          if (req) return { ...l, ...req, static: true };
          return l;
        });
      const cols = COLS[bp] ?? 12;
      // Width from settings.width — overrides layout w if explicitly set.
      // At narrow breakpoints (anything below lg), force full width so widgets
      // stretch instead of leaving empty space when they wrap.
      // Widgets with catalog.fixedWidth are also locked to that width
      // (e.g. daily-tracker is always "full").
      items = items.map((l) => {
        const cat = WIDGET_CATALOG[l.i];
        if (cat?.fixedWidth) return { ...l, w: WIDTH_TO_COLS[cat.fixedWidth] };
        if (bp !== "lg") return { ...l, w: cols };
        const s = settings[l.i] || {};
        if (s.width && WIDTH_TO_COLS[s.width]) {
          return { ...l, w: WIDTH_TO_COLS[s.width] };
        }
        return l;
      });
      // Auto-height: non-scrollable widgets get their h derived from measured
      // content height + their resize handle disabled. In edit mode .adm-w-head
      // is hidden but the cell gains a 56px chrome and a 48px footer (width
      // controls) — both sit OUTSIDE the measured .adm-w. Reserve that space
      // so the body content isn't clipped.
      // Grid math: rowHeight = 1, marginY = 16 → per row unit = 17px.
      // Cell px for h rows = h*1 + (h-1)*16 = 17h - 16.
      // marginY = 16 = the visual gap between adjacent cells.
      //
      // Edit mode adds 56px of cell chrome on top, plus a 48px cell footer
      // (S/M/L/Full width controls) — except for fixedWidth and required
      // widgets, which skip the cell footer entirely.
      items = items.map((l) => {
        const cat = WIDGET_CATALOG[l.i];
        if (!cat) return l;
        if (cat.scrollable) return l;
        const cellFooterH = editing && !cat.fixedWidth && !REQUIRED_WIDGETS[l.i] ? 48 : 0;
        const chromeBuffer = editing ? 56 + cellFooterH : 0;
        // Non-scrollable: always recompute h from measured (or min.h fallback).
        // These widgets are 100% auto-height — adjacent scrollable widgets
        // get a matching height adjustment in toggleEditing so the dashboard
        // doesn't visibly resize when toggling edit mode.
        const measured = contentHeights[l.i] || 0;
        const rows = Math.max(
          cat.min.h || 1,
          Math.ceil((measured + chromeBuffer + 16) / 17)
        );
        return { ...l, h: rows, isResizable: false };
      });
      // Row equalization: widgets sharing the same y coordinate live in the
      // same visual row. Stretch each scrollable widget in a row up to the
      // tallest non-scrollable neighbor so cells stay aligned — the
      // scrollable list just shows more rows. Non-scrollable widgets keep
      // their auto-fit h (they shouldn't grow taller than content).
      const rowGroups = {};
      for (const item of items) {
        if (rowGroups[item.y]) rowGroups[item.y].push(item);
        else rowGroups[item.y] = [item];
      }
      for (const group of Object.values(rowGroups)) {
        if (group.length < 2) continue;
        const maxH = Math.max(...group.map((i) => i.h));
        for (const item of group) {
          const cat = WIDGET_CATALOG[item.i];
          // Only inflate scrollable widgets to match — auto-h widgets stay
          // at their natural content size.
          if (cat?.scrollable && item.h < maxH) {
            item.h = maxH;
          }
        }
      }
      out[bp] = items;
    }
    return out;
  }, [layouts, settings, contentHeights, editing, role]);

  return (
    <>
    <div className="adm-shell">
      <MainRail activeIndex={4} />
      <div className="adm">

      {/* Topbar — uses shared Hero + Button + CustomSelect components */}
      <header className="adm-topbar">
        <h1 className="adm-h1">{greeting()}</h1>
        <div className="adm-topbar-r">
          <CustomSelect
            options={ROLES}
            value={role}
            onChange={updateRole}
            placeholder="Role"
            size="md"
          />
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

      {/* Feature announcement bar — admin-controlled, not in editable area */}
      {featureOn && <FeatureBar onClose={toggleFeature} />}

      {/* Main: editable grid (left, fluid) + fixed right rail.
          On mobile (.adm-main becomes flex-column), the .adm-mobile-alerts
          wrapper jumps to the top via flex order so alerts stay visible. */}
      <div className="adm-main">
      <div className="adm-mobile-alerts"><AlertsCard /></div>
      <div className={`adm-grid-wrap ${editing ? "is-editing" : ""}`}>
      {/* Edit hint — inside the grid wrap so it doesn't span across the rail */}
      {editing && (
        <div className="adm-edit-hint">
          <span>Drag tiles to rearrange, then choose a size.</span>
          <div style={{ display: "flex", gap: 6 }}>
            <Button size="sm" variant="secondary" onClick={() => setTemplatesOpen(true)}>
              View Templates
            </Button>
            <Button size="sm" variant="primary" onClick={() => setPaletteOpen(true)}>
              ＋ Add widget
            </Button>
          </div>
        </div>
      )}
        {baseLayout.length === 0 && (
          <div className="adm-empty">
            <h3>Your dashboard is empty</h3>
            <p>Start with a pre-built template, or build your own from scratch.</p>
            <div className="adm-empty-actions">
              <button className="adm-btn adm-btn--primary" onClick={() => setTemplatesOpen(true)}>
                Browse templates
              </button>
              {!editing && (
                <button className="adm-btn" onClick={toggleEditing}>
                  Edit dashboard
                </button>
              )}
              {editing && (
                <button className="adm-btn" onClick={() => setPaletteOpen(true)}>
                  ＋ Add widget
                </button>
              )}
            </div>
          </div>
        )}
        <ResponsiveGrid
          className="adm-rgl"
          layouts={computedLayouts}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          rowHeight={1}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          isDraggable={editing}
          isResizable={editing}
          resizeHandles={["s"]}
          draggableHandle=".adm-cell-handle"
          onLayoutChange={onLayoutChange}
          compactType="vertical"
        >
          {baseLayout.map((item) => {
            const cat = WIDGET_CATALOG[item.i];
            if (!cat) return null;
            const Comp = cat.component;
            const isRequired = !!REQUIRED_WIDGETS[item.i];
            const widgetSettings = settings[item.i] || {};
            // Settings popover only shows widget-specific fields now (width is
            // exposed inline as a segmented control in the chrome).
            const widgetFields = cat.settingsFields || [];
            const widgetDefaults = cat.defaults || {};
            const hasSettings = widgetFields.length > 0;
            const isSettingsOpen = openSettings?.id === item.i;
            const currentWidth = widgetSettings.width || COLS_TO_WIDTH(item.w);
            return (
              <div
                key={item.i}
                className={[
                  "adm-cell",
                  editing && "adm-cell--editing",
                  isRequired && "adm-cell--required",
                ].filter(Boolean).join(" ")}
              >
                {editing && (
                  <div className="adm-cell-chrome">
                    <span
                      className="adm-cell-handle"
                      title={isRequired ? "Required — pinned" : "Drag to reorder"}
                    >
                      <span className="adm-cell-grip">
                        {isRequired ? <Pin /> : <Grip />}
                      </span>
                      <span>{cat.name}</span>
                      {isRequired && <span className="adm-cell-tag">Required</span>}
                    </span>
                    <div className="adm-cell-actions">
                      {hasSettings && (
                        <button
                          type="button"
                          className={`adm-cell-action ${isSettingsOpen ? "is-on" : ""}`}
                          onClick={(e) => {
                            if (isSettingsOpen) {
                              setOpenSettings(null);
                            } else {
                              setOpenSettings({
                                id: item.i,
                                anchorRect: e.currentTarget.getBoundingClientRect(),
                              });
                            }
                          }}
                          title="Widget settings"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <Cog />
                        </button>
                      )}
                      {!isRequired && (
                        <button
                          type="button"
                          className="adm-cell-action"
                          onClick={() => removeWidget(item.i)}
                          title="Remove widget"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <XIcon />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {isSettingsOpen && (
                  <SettingsPopover
                    anchorRect={openSettings.anchorRect}
                    fields={widgetFields}
                    value={widgetSettings}
                    defaults={widgetDefaults}
                    onChange={(patch) => updateSettings(item.i, patch)}
                    onReset={() => resetSettings(item.i)}
                    onClose={() => setOpenSettings(null)}
                  />
                )}
                {cat.scrollable ? (
                  <Comp settings={{ ...(cat.defaults || {}), ...widgetSettings }} />
                ) : (
                  <div
                    className="adm-measure"
                    ref={(el) => setMeasureRef(item.i, el)}
                  >
                    <Comp settings={{ ...(cat.defaults || {}), ...widgetSettings }} role={role} />
                  </div>
                )}
                {editing && !isRequired && !cat.fixedWidth && (
                  <div
                    className="adm-cell-footer"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="adm-cell-width">
                      {[
                        { v: "sm",   label: "S" },
                        { v: "md",   label: "M" },
                        { v: "lg",   label: "L" },
                        { v: "full", label: "Full" },
                      ].map((opt) => (
                        <button
                          key={opt.v}
                          type="button"
                          className={currentWidth === opt.v ? "is-active" : ""}
                          onClick={() => setWidgetWidth(item.i, opt.v)}
                          title={`Width: ${opt.label}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </ResponsiveGrid>
      </div>

      <FixedRail editing={editing} role={role} />
      </div>


      {/* Palette panel — only widgets allowed for this role */}
      {paletteOpen && <div className="adm-overlay" onClick={() => setPaletteOpen(false)} />}
      <aside className={`adm-panel ${paletteOpen ? "is-open" : ""}`}>
        <div className="adm-panel-head">
          <div>
            <div className="adm-panel-title">Add widget</div>
            <div className="adm-panel-sub">
              {Object.entries(WIDGET_CATALOG).filter(([id, c]) => !REQUIRED_WIDGETS[id] && !placedIds.has(id) && (!c.roles || c.roles.includes(role))).length} available
            </div>
          </div>
          <button className="adm-btn adm-btn--ghost adm-btn--icon" onClick={() => setPaletteOpen(false)}>✕</button>
        </div>
        <div className="adm-card-list">
          {Object.entries(WIDGET_CATALOG)
            .filter(([id, c]) => !REQUIRED_WIDGETS[id] && !placedIds.has(id) && (!c.roles || c.roles.includes(role)))
            .map(([id, c]) => (
              <button
                key={id}
                type="button"
                className="adm-card"
                onClick={() => {
                  addWidget(id);
                  setPaletteOpen(false);
                }}
              >
                <div className="adm-card-thumb">
                  <WidgetThumb id={id} />
                </div>
                <div className="adm-card-body">
                  <div className="adm-card-title">{c.name}</div>
                  <p className="adm-card-desc">{c.desc}</p>
                </div>
                <span className="adm-card-add">＋</span>
              </button>
            ))}
          {Object.entries(WIDGET_CATALOG).filter(([id, c]) => !REQUIRED_WIDGETS[id] && !placedIds.has(id) && (!c.roles || c.roles.includes(role))).length === 0 && (
            <div className="adm-panel-empty">All widgets are already on your dashboard.</div>
          )}
        </div>
        <div className="adm-panel-foot">
          <button className="adm-btn" onClick={() => setPaletteOpen(false)}>Close</button>
        </div>
      </aside>

      {/* Templates panel */}
      <TemplatesPanel
        open={templatesOpen}
        currentId={presetId}
        role={role}
        onApply={applyPreset}
        onClose={() => setTemplatesOpen(false)}
      />
      </div>
    </div>
    <PrototypeNav currentHref="/bs-prototypes/admin-dashboard/" />
    </>
  );
}
