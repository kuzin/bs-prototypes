import { useState } from 'react'

import { DEFAULT_ROWS_BY_ROLE, DEFAULT_SETTINGS_BY_ROLE } from './data'
import { WIDGET_CATALOG } from './components/widgets'
import { SettingsPopover } from './components/SettingsPopover'
import { FixedRail, FeatureBar } from './components/FixedRegions'
import { CardGrid } from './components/CardGrid'
import { MainRail } from '@components/MainRail/MainRail'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { Button } from '@components/Button/Button'
import { CustomSelect } from '@components/CustomSelect/CustomSelect'
import { Modal } from '@components/Modal/Modal'
import { IconButton, EmptyState } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import '@components/Button/Button.css'
import '@components/CustomSelect/CustomSelect.css'
import '@components/Primitives/Primitives.css'
import '@components/MainRail/MainRail.css'
import './index.css'

const ROLES = [
  { value: 'teacher', label: 'Teacher' },
  { value: 'media', label: 'Media Specialist' },
  { value: 'library', label: 'Public Library' },
  { value: 'kitchen', label: 'Kitchen Sink' },
  { value: 'kitchen-full', label: 'Kitchen Sink (full width)' },
  { value: 'empty', label: 'Empty Sink' },
]
// Kitchen Sink, Kitchen Sink (full width), and Empty Sink are catalog demos —
// they show every widget regardless of per-widget role gates. Empty Sink
// additionally tells each widget to render its no-data state.
const widgetAllowed = (cat, role) =>
  !!cat &&
  (role === 'kitchen' ||
    role === 'kitchen-full' ||
    role === 'empty' ||
    !cat.roles ||
    cat.roles.includes(role))
const ROLE_KEY = 'adm-user-role'

function greeting() {
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  return `👋 Happy ${day}, Ellen!`
}

// Small icon helpers (use SVG so they scale with the Button)
const Caret = () => <Icon name="chevron-down" size={11} />
const Pencil = () => <Icon name="pencil" size={13} />
const Check = () => <Icon name="check" size={13} stroke={2.4} />
const Cog = () => <Icon name="settings" size={18} />
const XIcon = () => <Icon name="x" size={18} />
const Grip = () => <Icon name="grip" size={18} />
const Megaphone = () => <Icon name="speakerphone" size={16} />
// Empty-state icon for "every widget is already placed" — a dashboard grid.
const DashboardFullSvg = () => <Icon name="layout-grid" size={40} />

// Tiny visual previews for the Add Widget panel.
function WidgetThumb({ id }) {
  const stats = (
    <div className="thumb-stats">
      <span />
      <span />
      <span />
      <span />
    </div>
  )
  const rows = (
    <div className="thumb-rows">
      <span />
      <span />
      <span />
      <span />
    </div>
  )
  const grid = (
    <div className="thumb-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  )
  const lines = (
    <div className="thumb-lines">
      <span />
      <span />
      <span />
    </div>
  )
  const map = {
    'stat-tiles': stats,
    'flagged-sessions': stats,
    'leaderboard-combo': rows,
    'daily-tracker': (
      <div className="thumb-table">
        <div className="thumb-table-row" />
        <div className="thumb-table-row" />
        <div className="thumb-table-row" />
      </div>
    ),
    'leaderboard-students': rows,
    'leaderboard-classes': rows,
    'leaderboard-staff': rows,
    'leaderboard-patrons': rows,
    'leaderboard-branches': rows,
    'top-books': rows,
    'top-badges': rows,
    'quick-links': grid,
    questions: lines,
  }
  return map[id] || stats
}

// ─── Per-role row layout persistence ──────────────────────────────────────────
const STORAGE_KEY_BASE = 'adm-dashboard-rows-v1'
const storageKey = (role) => `${STORAGE_KEY_BASE}-${role}`
const isFullBleed = (id) => !!WIDGET_CATALOG[id]?.fixedWidth

function defaultsFor(role) {
  const rows = DEFAULT_ROWS_BY_ROLE[role] || DEFAULT_ROWS_BY_ROLE.teacher
  return {
    rows: rows.map((r) => [...r]),
    settings: { ...(DEFAULT_SETTINGS_BY_ROLE[role] || {}) },
  }
}
function loadState(role) {
  try {
    const raw = localStorage.getItem(storageKey(role))
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed.rows)) {
        return { rows: parsed.rows, settings: parsed.settings || {} }
      }
    }
  } catch {}
  return defaultsFor(role)
}
function saveState(role, state) {
  try {
    localStorage.setItem(storageKey(role), JSON.stringify(state))
  } catch {}
}

export function App() {
  const [editing, setEditing] = useState(false)
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem(ROLE_KEY) || 'teacher'
    } catch {
      return 'teacher'
    }
  })
  const [featureOn, setFeatureOn] = useState(() => {
    try {
      return localStorage.getItem('adm-feature-on') !== '0'
    } catch {
      return true
    }
  })
  const [{ rows, settings }, _setState] = useState(() => loadState(role))
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [openSettings, setOpenSettings] = useState(null) // { id, anchorRect } | null

  const setState = (next) => {
    _setState(next)
    saveState(role, next)
  }

  const updateRole = (next) => {
    setRole(next)
    _setState(loadState(next))
    setOpenSettings(null)
    try {
      localStorage.setItem(ROLE_KEY, next)
    } catch {}
  }
  const toggleFeature = () => {
    const next = !featureOn
    setFeatureOn(next)
    try {
      localStorage.setItem('adm-feature-on', next ? '1' : '0')
    } catch {}
  }
  const toggleEditing = () => {
    setOpenSettings(null)
    setEditing((e) => !e)
  }
  const resetDashboard = () => {
    try {
      localStorage.removeItem(storageKey(role))
    } catch {}
    _setState(defaultsFor(role))
    setOpenSettings(null)
    setPaletteOpen(false)
  }

  // Rows visible for this role (filter ids by catalog + role; drop empty rows).
  const visibleRows = rows
    .map((row) => row.filter((id) => widgetAllowed(WIDGET_CATALOG[id], role)))
    .filter((row) => row.length > 0)
  const placedIds = new Set(visibleRows.flat())

  // ─── Mutators ────────────────────────────────────────────────────────
  const onRowsChange = (nextRows) => setState({ rows: nextRows, settings })

  const addWidget = (id) => {
    if (!WIDGET_CATALOG[id] || placedIds.has(id)) return
    setState({ rows: [...rows, [id]], settings })
  }
  const removeWidget = (id) => {
    const nextRows = rows.map((r) => r.filter((x) => x !== id)).filter((r) => r.length > 0)
    const nextSettings = { ...settings }
    delete nextSettings[id]
    setState({ rows: nextRows, settings: nextSettings })
  }
  const updateSettings = (id, patch) =>
    setState({ rows, settings: { ...settings, [id]: { ...(settings[id] || {}), ...patch } } })
  const resetSettings = (id) => {
    const nextSettings = { ...settings }
    delete nextSettings[id]
    setState({ rows, settings: nextSettings })
  }

  // Render a single widget card (chrome in edit mode + widget body).
  const renderCard = (id) => {
    const cat = WIDGET_CATALOG[id]
    if (!cat) return null
    const Comp = cat.component
    const widgetSettings = settings[id] || {}
    const widgetFields =
      typeof cat.settingsFields === 'function' ? cat.settingsFields(role) : cat.settingsFields || []
    const hasSettings = widgetFields.length > 0
    const isSettingsOpen = openSettings?.id === id
    return (
      <div
        data-widget-id={id}
        className={[
          'adm-cell',
          editing && 'adm-cell--editing',
          cat.scrollable && 'adm-cell--scroll',
          cat.size === 'small' && 'adm-cell--small',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {editing && (
          <div className="adm-cell-chrome">
            <span className="adm-cell-handle">
              <span className="adm-cell-grip">
                <Grip />
              </span>
              <span>{cat.titleFn ? cat.titleFn(widgetSettings) : cat.name}</span>
            </span>
            <div className="adm-cell-actions">
              {hasSettings && (
                <button
                  type="button"
                  className={`adm-cell-action ${isSettingsOpen ? 'is-on' : ''}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) =>
                    setOpenSettings(
                      isSettingsOpen
                        ? null
                        : { id, anchorRect: e.currentTarget.getBoundingClientRect() },
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
    )
  }

  const availableWidgets = Object.entries(WIDGET_CATALOG).filter(
    ([id, c]) => !placedIds.has(id) && widgetAllowed(c, role),
  )

  return (
    <>
      <div className="adm-shell">
        <MainRail activeIndex={4} />
        <div className="adm">
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
              <Button variant="primary" iconRight={<Caret />}>
                Log Reading
              </Button>
              <Button
                variant={featureOn ? 'primary' : 'secondary'}
                icon={<Megaphone />}
                onClick={toggleFeature}
                title={featureOn ? 'Hide feature announcement' : 'Show feature announcement'}
                aria-label="Toggle feature announcement"
                className="adm-edit-btn"
              />
              <Button
                variant={editing ? 'primary' : 'secondary'}
                icon={editing ? <Check /> : <Pencil />}
                onClick={toggleEditing}
                title={editing ? 'Done editing' : 'Edit dashboard'}
                aria-label={editing ? 'Done editing' : 'Edit dashboard'}
                className="adm-edit-btn"
              />
            </div>
          </header>

          {featureOn && <FeatureBar onClose={toggleFeature} />}

          <div className="adm-main">
            <div className={`adm-grid-wrap ${editing ? 'is-editing' : ''}`}>
              {editing && (
                <div className="adm-edit-hint">
                  <span>
                    Drag a card onto another to place them side by side, or into a gap for a new
                    row.
                  </span>
                  <div className="adm-edit-hint-actions">
                    <Button size="sm" variant="secondary" onClick={resetDashboard}>
                      Reset to Default
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => setPaletteOpen(true)}>
                      ＋ Add Widget
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
                      <Button variant="primary" onClick={toggleEditing}>
                        Edit Dashboard
                      </Button>
                    )}
                    {editing && (
                      <Button variant="primary" onClick={() => setPaletteOpen(true)}>
                        ＋ Add Widget
                      </Button>
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
                <div
                  className={`adm-side-body ${availableWidgets.length === 0 ? 'adm-side-body--empty' : ''}`}
                >
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
                          onClick={() => {
                            addWidget(id)
                            close()
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
  )
}
