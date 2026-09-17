import { RMI_ICONS } from '@components/RmiIcons/RmiIcons'
import { Icon } from '@components/Icon/Icon'
import { FACTORS, MOTIVATION_OF } from '../domain'
import { rankedFactors } from '../scoring'
import { asset } from '../assets'
import './ReportBlocks.css'

/**
 * The body every RMI report is assembled from — the same four blocks in the
 * same order on the index summary and on one student's page
 * (`classroom/survey_requests/show`, `classroom/survey_responses/show` and the
 * shared `_report_summary` partial all render exactly this sequence):
 *
 *   ScoreCards → BennySays → ReadingGoalAndActions → FactorTable
 *
 * The two views differ only in what they pass: a class's aggregate scores or
 * one reader's, and `group` / `reader_internal` recommendations.
 */

// ── Score cards ──────────────────────────────────────────────────────────
// The gauge spec is `summary_controller.ts`: 360° sweep, radius 38, 12px
// stroke, intrinsic #17BFD5 and extrinsic #c849e5. The intrinsic and extrinsic
// cards each fill against 20; the overall card stacks both against 40, so its
// ring reads as the two halves of one score rather than a third number.
const INTRINSIC_COLOR = '#17bfd5'
const EXTRINSIC_COLOR = '#c849e5'

const R = 38
const CIRC = 2 * Math.PI * R

function Gauge({ segments, track }) {
  // Each segment is [color, fraction]; they lay end to end from 12 o'clock.
  let offset = 0
  return (
    <svg className="rmi-gauge" viewBox="0 0 100 100" aria-hidden="true">
      <circle
        className="rmi-gauge-track"
        cx="50"
        cy="50"
        r={R}
        strokeWidth="12"
        fill="none"
        style={{ stroke: track }}
      />
      {segments.map(([color, fraction], i) => {
        const dash = Math.max(0, Math.min(1, fraction)) * CIRC
        const el = (
          <circle
            key={i}
            cx="50"
            cy="50"
            r={R}
            strokeWidth="12"
            fill="none"
            stroke={color}
            strokeDasharray={`${dash} ${CIRC - dash}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 50 50)"
          />
        )
        offset += dash
        return el
      })}
    </svg>
  )
}

function Delta({ value }) {
  if (value == null) return null
  const dir = value > 0.5 ? 'increase' : value < -0.5 ? 'decrease' : 'no-change'
  const icon = dir === 'increase' ? 'arrow-up' : dir === 'decrease' ? 'arrow-down' : 'minus'
  return (
    <span className={`rmi-delta rmi-delta--${dir}`}>
      <Icon name={icon} size={14} stroke={2.4} />
      {Math.abs(Math.round(value))}%
    </span>
  )
}

function ScoreCard({ kind, score, total, label, segments, delta }) {
  return (
    <div className={`rmi-score-card rmi-score-card--${kind}`}>
      <div className="rmi-score-card-inner">
        <div className="rmi-score-card-chart">
          <Gauge segments={segments} track="var(--rmi-track)" />
        </div>
        <div className="rmi-score-card-content">
          <div className="rmi-score-card-numbers">
            <span className="rmi-score-card-score">{score.toFixed(1)}</span>
            <span className="rmi-score-card-total">/{total}</span>
            <Delta value={delta} />
          </div>
          <span className="rmi-score-card-description">{label}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * `labels` lets the class report say "Avg Intrinsic Score" where one student's
 * says "Intrinsic Score" — the only copy difference between the two views.
 */
export function ScoreCards({ scores, deltas = {}, average = false }) {
  const prefix = average ? 'Avg ' : ''
  return (
    <div className="rmi-score-cards">
      <ScoreCard
        kind="intrinsic"
        score={scores.intrinsic}
        total={20}
        label={`${prefix}Intrinsic Score`}
        segments={[[INTRINSIC_COLOR, scores.intrinsic / 20]]}
        delta={deltas.intrinsic}
      />
      <ScoreCard
        kind="overall"
        score={scores.overall}
        total={40}
        label={`${prefix}Overall Score`}
        segments={[
          [EXTRINSIC_COLOR, scores.extrinsic / 40],
          [INTRINSIC_COLOR, scores.intrinsic / 40],
        ]}
        delta={deltas.overall}
      />
      <ScoreCard
        kind="extrinsic"
        score={scores.extrinsic}
        total={20}
        label={`${prefix}Extrinsic Score`}
        segments={[[EXTRINSIC_COLOR, scores.extrinsic / 20]]}
        delta={deltas.extrinsic}
      />
    </div>
  )
}

// ── Benny says ───────────────────────────────────────────────────────────
/** The generated summary, in Benny's speech bubble, with when it last ran. */
export function BennySays({ summary, analysedAt }) {
  return (
    <section className="rmi-benny-says">
      <h3 className="rmi-benny-says-title">Benny Says...</h3>
      <div className="rmi-benny-says-body">
        <img className="rmi-benny-says-image" src={asset('benny-thinking.svg')} alt="Benny" />
        <div className="rmi-benny-says-content">
          <div className="rmi-benny-says-triangle" />
          <div className="rmi-benny-says-bubble-wrap">
            <p className="rmi-benny-says-bubble">{summary}</p>
            {analysedAt && (
              <span className="rmi-benny-says-last-run">Analysis last run on {analysedAt}</span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Factor icon ──────────────────────────────────────────────────────────
/** The factor's own drawing on its axis's tinted square — teal intrinsic, purple extrinsic. */
export function FactorIcon({ factor }) {
  const motivation = MOTIVATION_OF[factor] ?? 'unknown'
  return (
    <span
      className={`rmi-factor-icon rmi-factor-icon--${motivation}`}
      title={FACTORS[factor]?.educator_definition}
    >
      {RMI_ICONS[factor]}
    </span>
  )
}

// ── Reading goal + recommended actions ───────────────────────────────────
export function ReadingGoalAndActions({ goal, recommendations }) {
  return (
    <div className="rmi-actions-goals">
      <section className="rmi-reading-goals">
        <h3 className="rmi-block-title">Recommended Reading Goals</h3>
        <div className="rmi-reading-goals-content">
          <span className="rmi-reading-goals-number">{goal}</span>
          <span className="rmi-reading-goals-text">Minutes Daily</span>
        </div>
      </section>

      <section className="rmi-rec-actions">
        <h3 className="rmi-block-title">Recommended Actions</h3>
        <ul className="rmi-rec-actions-list">
          {recommendations.map((rec) => (
            <li key={rec.id} className="rmi-rec-actions-item">
              <FactorIcon factor={rec.factor} />
              {rec.text}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

// ── Factor table ─────────────────────────────────────────────────────────
/**
 * All ten factors ranked, each with its 1.0–4.0 bar. The app tints the first
 * three rows (`.factors-table tr:nth-child(-n+3)`), which is what makes the
 * table read as "these are the motivators" rather than a flat list.
 */
export function FactorTable({ scores, deltas = {}, scoreLabel = 'Motivation Score' }) {
  const rows = rankedFactors(scores)

  return (
    <div className="rmi-factors-table">
      <table>
        <thead>
          <tr>
            <th>Motivation Type</th>
            <th className="rmi-factors-score-col">{scoreLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((factor, i) => (
            <tr key={factor.name} className={i < 3 ? 'rmi-factors-top' : undefined}>
              <td>
                <div className="rmi-table-factors">
                  <span className="rmi-table-factors-number">{i + 1}.</span>
                  <FactorIcon factor={factor.name} />
                  <div className="rmi-table-factors-content">
                    <span className="rmi-table-factors-name">
                      {factor.name[0].toUpperCase() + factor.name.slice(1)}
                    </span>
                    <span className="rmi-table-factors-description">
                      {FACTORS[factor.name]?.educator_definition}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <div className="rmi-factor-score">
                  <div className="rmi-factor-bar">
                    <div className="rmi-factor-bar-bg" />
                    <div
                      className="rmi-factor-bar-total"
                      style={{ width: `${(factor.score / 4) * 100}%` }}
                    />
                  </div>
                  <span className="rmi-factor-score-number">{factor.score.toFixed(1)}</span>
                  <Delta value={deltas[factor.name]} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
