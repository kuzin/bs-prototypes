import './ProgressBar.css'

/**
 * `components/shared/ProgressBar` — the community goal's bar, and not the same thing as the daily
 * goal's. [[DailyGoalBanner]] caps its track with a 32pt STAR that fills when the goal is met;
 * this one caps it with a 30pt disc of the tenant colour, ringed in 5pt of white around a 10pt
 * white dot. Two bars, two different statements: one is a reward, this one is a position.
 *
 * The knob pulls back 15 — half its width — so it CENTRES on the bar's end rather than starting
 * there, which is what keeps it on the line at 0% and at 100%.
 *
 * The filled bar also carries a shadow in its own colour lightened to 91%, offset 4 down with no
 * blur: a flat band under the bar rather than a glow.
 */
const MAX = 100

export function ProgressBar({ progress = 0, color, className = '' }) {
  const pct = Math.min(MAX, Math.max(0, Number(progress) || 0))

  return (
    <div className={`m-pbar-progress ${className}`.trim()}>
      <div className="m-pbar-track" />
      <div className="m-pbar-fill-row">
        <div
          className="m-pbar-fill"
          style={{ width: `${pct}%`, ...(color ? { background: color } : null) }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={MAX}
        />
        <span className="m-pbar-knob" style={color ? { background: color } : undefined}>
          <span className="m-pbar-dot" />
        </span>
      </div>
    </div>
  )
}
