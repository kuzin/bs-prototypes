import { Modal } from '../ris/components/Modal'
import { Button } from '../ris/components/Button'
import { IconButton } from '../ris/components/Primitives'
import { METRICS } from './data'

const PANELS = [
  { id: 'top-books',  label: 'Top Books',          thumb: 'books'  },
  { id: 'top-badges', label: 'Top Earned Badges',  thumb: 'badges' },
]
const DEMOGRAPHICS = [
  { id: 'ages',       label: 'Ages',               thumb: 'bars'   },
]

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  )
}

// Mini schematic of what each tile looks like — purely visual, scaled to fit
// the toggle card's thumbnail area.
function TileThumb({ kind, value }) {
  if (kind === 'metric') {
    return (
      <div className="ins-cust-thumb ins-cust-thumb--metric">
        <span className="ins-cust-thumb-num">{value ?? '—'}</span>
        <span className="ins-cust-thumb-line" />
      </div>
    )
  }
  if (kind === 'books') {
    return (
      <div className="ins-cust-thumb ins-cust-thumb--books">
        {Array.from({ length: 6 }).map((_, i) => <span key={i} />)}
      </div>
    )
  }
  if (kind === 'badges') {
    return (
      <div className="ins-cust-thumb ins-cust-thumb--badges">
        <span /><span />
      </div>
    )
  }
  if (kind === 'bars') {
    return (
      <div className="ins-cust-thumb ins-cust-thumb--bars">
        {[20, 60, 40, 90, 50, 30].map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
    )
  }
  return null
}

export function CustomizeModal({ open, onClose, visibleTiles, onChange }) {
  function toggle(id) {
    onChange(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll(ids, on) {
    onChange(prev => {
      const next = new Set(prev)
      ids.forEach(id => {
        if (on) next.add(id)
        else next.delete(id)
      })
      return next
    })
  }

  function isOn(id) { return visibleTiles.has(id) }

  const metricIds = METRICS.map(m => m.id)
  const panelIds  = PANELS.map(p => p.id)
  const demoIds   = DEMOGRAPHICS.map(d => d.id)
  const totalIds  = metricIds.length + panelIds.length + demoIds.length

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Customize Dashboard">
      {({ close }) => (
        <div className="ins-modal-wrap">
          <div className="modal-header">
            <div className="modal-header-text">
              <h3 className="modal-title">Customize Dashboard</h3>
            </div>
            <IconButton variant="ghost" size="sm" onClick={close} aria-label="Close" className="modal-close">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="modal-body ins-modal-body ins-modal-body--padded">
            <Section
              label="Metrics"
              allChecked={metricIds.every(isOn)}
              someChecked={metricIds.some(isOn)}
              onToggleAll={() => toggleAll(metricIds, !metricIds.every(isOn))}
            >
              {METRICS.map(m => (
                <ToggleCard
                  key={m.id}
                  checked={isOn(m.id)}
                  label={m.label}
                  onToggle={() => toggle(m.id)}
                >
                  <TileThumb kind="metric" value={m.value} />
                </ToggleCard>
              ))}
            </Section>

            <Section
              label="Top Statistics"
              allChecked={panelIds.every(isOn)}
              someChecked={panelIds.some(isOn)}
              onToggleAll={() => toggleAll(panelIds, !panelIds.every(isOn))}
            >
              {PANELS.map(p => (
                <ToggleCard
                  key={p.id}
                  checked={isOn(p.id)}
                  label={p.label}
                  onToggle={() => toggle(p.id)}
                >
                  <TileThumb kind={p.thumb} />
                </ToggleCard>
              ))}
            </Section>

            <Section
              label="Demographics"
              allChecked={demoIds.every(isOn)}
              someChecked={demoIds.some(isOn)}
              onToggleAll={() => toggleAll(demoIds, !demoIds.every(isOn))}
            >
              {DEMOGRAPHICS.map(d => (
                <ToggleCard
                  key={d.id}
                  checked={isOn(d.id)}
                  label={d.label}
                  onToggle={() => toggle(d.id)}
                >
                  <TileThumb kind={d.thumb} />
                </ToggleCard>
              ))}
            </Section>
          </div>

          <div className="modal-footer modal-footer--between">
            <span className="ins-modal-foot-note">
              {visibleTiles.size} of {totalIds} tiles visible
            </span>
            <Button variant="primary" onClick={close}>OK</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

function Section({ label, allChecked, someChecked, onToggleAll, children }) {
  return (
    <div className="ins-cust-section">
      <div className="ins-cust-section-bar">
        <span className="ins-cust-section-label">{label}</span>
        <button
          type="button"
          className="ins-cust-section-toggle"
          onClick={onToggleAll}
        >
          {allChecked ? 'Hide all' : someChecked ? 'Show all' : 'Show all'}
        </button>
      </div>
      <div className="ins-cust-cards">{children}</div>
    </div>
  )
}

function ToggleCard({ checked, label, onToggle, children }) {
  return (
    <button
      type="button"
      className={`ins-cust-card${checked ? ' ins-cust-card--on' : ''}`}
      onClick={onToggle}
      aria-pressed={checked}
    >
      <span className="ins-cust-card-thumb">{children}</span>
      <span className="ins-cust-card-foot">
        <span className="ins-cust-card-label">{label}</span>
        <Switch checked={checked} />
      </span>
    </button>
  )
}

function Switch({ checked }) {
  return (
    <span className={`ins-cust-switch${checked ? ' ins-cust-switch--on' : ''}`} aria-hidden="true">
      <span className="ins-cust-switch-thumb" />
    </span>
  )
}
