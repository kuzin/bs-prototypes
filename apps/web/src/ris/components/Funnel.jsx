import { Fragment } from 'react'
import './Funnel.css'

/**
 * Stage-card funnel — drops the bar visualization for clean metric cards
 * stacked vertically with a drop-off indicator between each step.
 *
 * <Funnel
 *   items={[
 *     { stage: 'Enrolled', note: 'Active roster', count: 1650, pct: 100 },
 *     { stage: 'Logged',   note: 'At least 1 log', count: 1040, pct: 63, delta: 4 },
 *   ]}
 *   accent="#0DA7BC"
 *   dropoffLabel="students drop off"
 * />
 */
export function Funnel({ items, accent = '#0DA7BC', dropoffLabel = 'drop off' }) {
  return (
    <div className="fn">
      {items.map((step, i) => {
        const next    = items[i + 1]
        const dropOff = next ? step.count - next.count : null
        return (
          <Fragment key={step.stage}>
            <div className="fn-card">
              <div className="fn-count" style={{ color: accent }}>
                {step.count.toLocaleString()}
              </div>
              <div className="fn-meta">
                <div className="fn-stage">{step.stage}</div>
                {step.note && <div className="fn-note">{step.note}</div>}
              </div>
              <div className="fn-pct-wrap">
                <span className="fn-pct">{step.pct}%</span>
                {step.delta != null && step.delta !== 0 && (
                  <span className="fn-delta">↑{step.delta} pts</span>
                )}
              </div>
            </div>
            {dropOff > 0 && (
              <div className="fn-dropoff">
                <span className="fn-dropoff-arrow">↓</span>
                <span>{dropOff.toLocaleString()} {dropoffLabel}</span>
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
