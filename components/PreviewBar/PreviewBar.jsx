import { Icon } from '@components/Icon/Icon'
import './PreviewBar.css'

/**
 * The dev/preview bar that sits above a multi-persona prototype and switches
 * between its views. Every prototype that has one uses this, so the bar reads
 * the same everywhere — Benny, the prototype's name, and a segmented strip of
 * views on the right.
 *
 * <PreviewBar
 *   title="Words with Benny"
 *   subtitle="Site-wide completion setting"    // optional second line
 *   views={[{ id: 'log', label: 'Reader · Log Reading', short: 'Log', icon: 'book' }]}
 *   active={view}
 *   onChange={setView}
 *   actions={<button …>Reset</button>}          // optional controls, far right
 *   sticky={false}                              // opt out inside a flex-column shell
 * />
 *
 * `short` is the label the strip swaps to before it would start overflowing;
 * it falls back to `label`. Deliberately no accent prop — the active pill is
 * white on every prototype, which is what keeps the bars consistent.
 */
export function PreviewBar({
  title,
  subtitle,
  views = [],
  active,
  onChange,
  actions,
  sticky = true,
  ariaLabel = 'Preview view',
  className = '',
}) {
  const cls = ['pvb', sticky && 'pvb--sticky', className].filter(Boolean).join(' ')
  return (
    <div className={cls}>
      <div className="pvb-brand">
        <img src="/bs-prototypes/benny.png" alt="" className="pvb-benny" />
        <div className="pvb-titles">
          <span className="pvb-title">{title}</span>
          {subtitle && <span className="pvb-subtitle">{subtitle}</span>}
        </div>
      </div>

      {views.length > 0 && (
        <div className="pvb-views" role="tablist" aria-label={ariaLabel}>
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={active === v.id}
              className={`pvb-view${active === v.id ? ' is-active' : ''}`}
              title={v.label}
              onClick={() => onChange?.(v.id)}
            >
              {v.icon && <Icon name={v.icon} size={15} />}
              <span className="pvb-view-label">{v.label}</span>
              <span className="pvb-view-label-short">{v.short ?? v.label}</span>
            </button>
          ))}
        </div>
      )}

      {actions && <div className="pvb-actions">{actions}</div>}
    </div>
  )
}
