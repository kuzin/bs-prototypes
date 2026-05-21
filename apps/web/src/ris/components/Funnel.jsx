import './Funnel.css'
import { Tooltip } from './Primitives'

/**
 * Funnel chart — vertical stack of stages on a percentage scale.
 *   • Left column: percentage as a right-aligned tick label.
 *   • Middle column: a fixed-width bar track. The bar is absolutely
 *     positioned at width = pct% of the track, so the visual width is
 *     literally pct% (no scaling, no clamping — bars stay accurate).
 *   • Each label is also absolutely positioned at left = pct%, so it
 *     sits right at the end of its own bar. The track has a reserved
 *     overflow lane on the right so even the 100% label has room.
 *   • Hovering a row reveals the period-over-period delta in a tooltip.
 *
 * <Funnel items={[…]} />
 */

function colorAt(t) {
  const hue = 200 - t * 170
  return `hsl(${hue}, 65%, 45%)`
}

export function Funnel({ items }) {
  const n = items.length
  const colors = items.map((_, i) => colorAt(n > 1 ? i / (n - 1) : 0))

  return (
    <div className="fn">
      <div className="fn-steps">
        {items.map((step, i) => {
          const hasDelta = step.delta != null && step.delta !== 0
          const row = (
            <div
              className="fn-step"
              style={{ '--step-color': colors[i] }}
            >
              <div className="fn-pct">{step.pct}%</div>
              <div className="fn-bar-track">
                <div className="fn-bar" style={{ width: `${step.pct}%` }} />
                <div className="fn-label" style={{ left: `${step.pct}%` }}>
                  <strong>{step.count.toLocaleString()}</strong>
                  <span className="fn-stage">{step.stage}</span>
                </div>
              </div>
            </div>
          )
          return hasDelta ? (
            <Tooltip
              key={step.stage}
              content={`↑${step.delta} pts vs. start of school year`}
              followCursor
            >
              {row}
            </Tooltip>
          ) : (
            <div key={step.stage}>{row}</div>
          )
        })}
      </div>

      <div className="fn-legend">
        <span className="fn-legend-label">Top of funnel</span>
        <div
          className="fn-legend-bar"
          style={{ background: `linear-gradient(90deg, ${colors.join(', ')})` }}
        />
        <span className="fn-legend-label">Deepest engagement</span>
      </div>
    </div>
  )
}
