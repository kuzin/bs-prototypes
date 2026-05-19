import './ProgressBar.css'

/**
 * Horizontal progress bar with optional label + value rows.
 *
 * <ProgressBar value={62} color="#E8866A" />
 * <ProgressBar value={62} max={100} color="#E8866A" label="Engagement" valueLabel="62%" />
 * <ProgressBar value={3.1} max={4} color="#E8866A" label="Enjoyment" valueLabel="3.1" subLabel="Reading for fun" />
 *
 * sizes: sm | md | lg (changes bar thickness)
 */
export function ProgressBar({
  value,
  max = 100,
  color = '#1D4ED8',
  label,
  valueLabel,
  subLabel,
  size = 'md',
  className = '',
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))

  const hasHeader = label || valueLabel || subLabel
  return (
    <div className={`pgb pgb--${size} ${className}`.trim()}>
      {hasHeader && (
        <div className="pgb-head">
          <div className="pgb-label-wrap">
            {label && <span className="pgb-label">{label}</span>}
            {subLabel && <span className="pgb-sub">{subLabel}</span>}
          </div>
          {valueLabel != null && <span className="pgb-value">{valueLabel}</span>}
        </div>
      )}
      <div className="pgb-track">
        <div className="pgb-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
