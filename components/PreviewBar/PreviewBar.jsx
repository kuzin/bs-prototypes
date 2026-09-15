import { useEffect, useRef } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Toggle } from '@components/Toggle/Toggle'
import { Flyout } from '@components/Flyout/Flyout'
import '@components/Toggle/Toggle.css'
import '@components/Flyout/Flyout.css'
import './PreviewBar.css'

/**
 * The dev/preview bar that sits above a multi-persona prototype and switches
 * between its views. Every prototype that has one uses this, so the bar reads
 * the same everywhere — the prototype's name, and a segmented strip of views
 * on the right.
 *
 * Deliberately neutral: this is the reviewer's chrome, not part of the screen
 * under review, so it carries no brand colour and no mascot. It used to be a
 * teal gradient with Benny on it, which read as another Beanstack surface and
 * fought whatever prototype was sitting underneath it.
 *
 * <PreviewBar
 *   title="Words with Benny"
 *   subtitle="Site-wide completion setting"    // optional second line
 *   views={[{ id: 'log', label: 'Reader · Log Reading', short: 'Log', icon: 'book' }]}
 *   active={view}
 *   onChange={setView}
 *   toggles={[{ id: 'rmi', label: 'RMI', on: true }]}  // optional feature switches
 *   onToggle={(id, on) => …}
 *   actions={<button …>Reset</button>}          // optional controls, far right
 *   sticky={false}                              // opt out inside a flex-column shell
 * />
 *
 * `toggles` is for the settings a screen is gated on — the things an admin
 * turns on per site, which decide whether half a page is there at all. A
 * prototype that has them can be read in every configuration instead of the
 * one its fixtures happen to describe. They live behind a cog rather than
 * along the bar: there are usually more of them than fit, and they are
 * something you set once and then forget while you read the page.
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
  toggles = [],
  onToggle,
  togglesLabel = 'Site settings',
  actions,
  sticky = true,
  ariaLabel = 'Preview view',
  className = '',
}) {
  const cls = ['pvb', sticky && 'pvb--sticky', className].filter(Boolean).join(' ')
  const barRef = useRef(null)

  // `--preview-bar-h` is derived from one pill height in CSS, which is right
  // until the bar wraps: at phone width it runs to two or three rows and the
  // variable still said 61px. Everything keyed to it — a sticky header's `top`,
  // a full-height shell's height, a centred modal's centre — was then off by
  // however much the bar had grown, and the modal's title sat behind the bar.
  // Publishing the measured height keeps them honest.
  useEffect(() => {
    const el = barRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const sync = () =>
      document.documentElement.style.setProperty(
        '--preview-bar-h',
        `${Math.round(el.getBoundingClientRect().height)}px`,
      )
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => {
      ro.disconnect()
      document.documentElement.style.removeProperty('--preview-bar-h')
    }
  }, [])
  // What's been turned off is the interesting number — the cog says it so you
  // aren't reading a half-empty page wondering why.
  const offCount = toggles.filter((t) => !t.on).length
  return (
    <div className={cls} ref={barRef}>
      <div className="pvb-titles">
        <span className="pvb-title">{title}</span>
        {subtitle && <span className="pvb-subtitle">{subtitle}</span>}
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

      {toggles.length > 0 && (
        <Flyout
          placement="bottom-end"
          trigger={({ toggle, open }) => (
            <button
              type="button"
              className={`pvb-cog${open ? ' is-open' : ''}`}
              onClick={toggle}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-label={togglesLabel}
            >
              <Icon name="settings" size={16} />
              <span className="pvb-cog-label">{togglesLabel}</span>
              {offCount > 0 && <span className="pvb-cog-count">{offCount} off</span>}
            </button>
          )}
        >
          {() => (
            <div className="pvb-panel">
              <div className="pvb-panel-head">{togglesLabel}</div>
              {toggles.map((t) => (
                <label key={t.id} className="pvb-panel-row">
                  <span className="pvb-panel-text">
                    <span className="pvb-panel-label">{t.label}</span>
                    {t.hint && <span className="pvb-panel-hint">{t.hint}</span>}
                  </span>
                  <Toggle size="sm" checked={t.on} onChange={(on) => onToggle?.(t.id, on)} />
                </label>
              ))}
            </div>
          )}
        </Flyout>
      )}

      {actions && <div className="pvb-actions">{actions}</div>}
    </div>
  )
}
