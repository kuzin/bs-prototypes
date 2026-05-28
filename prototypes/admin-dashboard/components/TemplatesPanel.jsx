import { LAYOUT_PRESETS } from '../data'

/**
 * Slide-in panel listing layout presets. Picking one replaces the editable
 * grid's layout + per-widget settings. Uses the shared `.adm-card` style so
 * it visually matches the Add Widget panel.
 */
export function TemplatesPanel({ open, onClose, onApply, currentId, role = 'teacher' }) {
  const presets = LAYOUT_PRESETS.filter((p) => !p.roles || p.roles.includes(role))
  return (
    <>
      {open && <div className="adm-overlay" onClick={onClose} />}
      <aside className={`adm-panel adm-panel--templates ${open ? 'is-open' : ''}`}>
        <div className="adm-panel-head">
          <div>
            <div className="adm-panel-title">Choose a template</div>
            <div className="adm-panel-sub">
              {presets.length} layouts · picking one replaces your current dashboard
            </div>
          </div>
          <button className="adm-btn adm-btn--ghost adm-btn--icon" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="adm-card-list">
          {presets.map((p) => {
            const isCurrent = currentId === p.id
            return (
              <button
                key={p.id}
                type="button"
                className={`adm-card ${isCurrent ? 'is-current' : ''}`}
                onClick={() => onApply(p)}
              >
                <div className="adm-card-thumb">
                  <PreviewMini preset={p} />
                </div>
                <div className="adm-card-body">
                  <div className="adm-card-title">
                    {p.name}
                    {isCurrent && <span className="adm-card-current">Current</span>}
                  </div>
                  <p className="adm-card-desc">{p.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="adm-panel-foot">
          <button className="adm-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </aside>
    </>
  )
}

// Tiny wireframe preview of a preset's layout — fits inside the .adm-card-thumb box.
// Uses absolutely-positioned blocks (% sized) instead of CSS grid so the tiny
// preview doesn't suffer from sub-pixel grid track rounding artifacts.
function PreviewMini({ preset }) {
  if (!preset.layout.length) {
    return <div className="thumb-empty">Empty</div>
  }
  const cols = 12
  const maxY = preset.layout.reduce((m, l) => Math.max(m, l.y + l.h), 1)
  return (
    <div className="thumb-layout">
      {preset.layout.map((l) => (
        <span
          key={l.i}
          style={{
            left: `${(l.x / cols) * 100}%`,
            width: `${(l.w / cols) * 100}%`,
            top: `${(l.y / maxY) * 100}%`,
            height: `${(l.h / maxY) * 100}%`,
          }}
        />
      ))}
    </div>
  )
}
