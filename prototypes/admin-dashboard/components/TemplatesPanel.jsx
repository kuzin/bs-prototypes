import { LAYOUT_PRESETS } from '../data'
import { Modal } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import { IconButton } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import '@components/Modal/Modal.css'
import '@components/Button/Button.css'
import '@components/Primitives/Primitives.css'

const XIcon = () => <Icon name="x" size={18} />

/**
 * Slide-in panel listing layout presets. Picking one replaces the editable
 * grid's layout + per-widget settings. Uses the shared `Modal variant="side"`
 * slide-over plus the `.adm-side-*` chrome so it matches the Add Widget panel.
 */
export function TemplatesPanel({ open, onClose, onApply, currentId, role = 'teacher' }) {
  const presets = LAYOUT_PRESETS.filter((p) => !p.roles || p.roles.includes(role))
  return (
    <Modal open={open} onClose={onClose} variant="side" ariaLabel="Choose a template">
      {({ close }) => (
        <div className="adm-side-pane">
          <header className="adm-side-head">
            <div className="adm-side-head-text">
              <h2 className="adm-side-title">Choose a template</h2>
              <div className="adm-side-sub">
                {presets.length} layouts · picking one replaces your current dashboard
              </div>
            </div>
            <IconButton variant="ghost" size="sm" onClick={close} aria-label="Close">
              <XIcon />
            </IconButton>
          </header>

          <div className="adm-side-body">
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
          </div>

          <div className="adm-panel-foot">
            <Button variant="secondary" onClick={close}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
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
