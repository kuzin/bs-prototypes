import { RMI_ICONS } from '@components/RmiIcons/RmiIcons'
import { Icon } from '@components/Icon/Icon'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import { Table } from '@components/Table/Table'
import '@components/BennyBubble/BennyBubble.css'
import '@components/Table/Table.css'
import { FACTORS, MOTIVATION_OF } from '../domain'
import { GENRES_BY_FACTOR } from '../genres'
import { rankedFactors, topThreeFactors } from '../scoring'
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
/**
 * The generated summary in Benny's speech bubble, inside the white card the app
 * gives it (`.benny-says`: 20px padding, 12px radius, an 18px/800 title above).
 * The bubble itself is the shared <BennyBubble> — same 52px avatar, same grey
 * ground and left-pointing tail, and it already renders the "Analysis last run
 * on …" line this page wants.
 */
export function BennySays({ summary, analysedAt }) {
  return (
    <section className="rmi-benny-says">
      <h3 className="rmi-block-title">Benny Says...</h3>
      <BennyBubble avatar={asset('benny-thinking.svg')} timestamp={analysedAt}>
        {summary}
      </BennyBubble>
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
/**
 * `.actions-reading-goals` — a six-column grid, the goal taking two and the
 * actions four, each its own white card with its title *inside* it. Below 960px
 * they stack.
 */
export function ReadingGoalAndActions({ goal, recommendations }) {
  return (
    <div className="rmi-actions-goals">
      <section className="rmi-reading-goals">
        <h3 className="rmi-block-title rmi-block-title--center">Recommended Reading Goals</h3>
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

// ── Top motivation types ─────────────────────────────────────────────────
/**
 * The three motivation types this reader came out as — the same ones their own
 * reveal shows them, named the way they were named there.
 *
 * `top_three_factors` drives the summary and the recommendations, but until now
 * it was only legible on the reader's side. Here it's the personas alone — the
 * factor each scores against, its definition and its score are all in the table
 * directly below, so anything more would make this a worse version of that
 * table rather than the one thing the table can't say.
 *
 * `mystery` is a motivation type like any other, with its own portrait and its
 * own definition — it's what the engine returns when nothing clears the
 * threshold, so it renders as a row rather than as an absence.
 */
export function TopMotivationTypes({ scores }) {
  const top = topThreeFactors(scores)

  return (
    <section className="rmi-top-types">
      <h3 className="rmi-block-title">Top Motivation Types</h3>

      <ol className="rmi-top-types-list">
        {top.map((factor, i) => {
          const def = FACTORS[factor.name]
          const slug = def.student_name.toLowerCase().replace(/\s+/g, '-')
          const mystery = factor.name === 'mystery'

          return (
            <li key={factor.name} className="rmi-top-type">
              {!mystery && <span className="rmi-top-type-rank">{i + 1}</span>}

              <img
                className="rmi-top-type-portrait"
                src={asset(`factors/${slug}.png`)}
                alt=""
                width={44}
                height={44}
              />

              <span className="rmi-top-type-name">{def.student_name}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

// ── Genre recommendations ────────────────────────────────────────────────
/**
 * Three genres for each of the reader's top motivation types, from the RMI
 * toolkit's own mapping.
 *
 * This is the reader's-advisory half of the report: the recommended *actions*
 * above tell an educator what to do, and these tell them what to put in the
 * reader's hands. Each genre carries the reason it suits that type, because the
 * point isn't the list — it's that a librarian can explain the choice.
 *
 * `mystery` has no genres. It isn't a reading taste, it's the absence of a
 * clear one, so the block doesn't render rather than inventing a shelf.
 */
export function GenreRecommendations({ scores, subject = 'reader' }) {
  const types = topThreeFactors(scores).filter((f) => GENRES_BY_FACTOR[f.name])
  if (types.length === 0) return null

  return (
    <section className="rmi-genres">
      <h3 className="rmi-block-title">Genre Recommendations</h3>
      <p className="rmi-genres-lede">
        Genres that suit {subject === 'class' ? "this class's" : "this reader's"} top motivation
        types.
      </p>

      <div className="rmi-genres-types">
        {types.map((factor) => {
          const def = FACTORS[factor.name]
          const slug = def.student_name.toLowerCase().replace(/\s+/g, '-')

          return (
            <div key={factor.name} className="rmi-genre-type">
              <div className="rmi-genre-type-head">
                <img
                  className="rmi-genre-type-portrait"
                  src={asset(`factors/${slug}.png`)}
                  alt=""
                  width={32}
                  height={32}
                />
                <span className="rmi-genre-type-name">{def.student_name}</span>
              </div>

              <ul className="rmi-genre-list">
                {GENRES_BY_FACTOR[factor.name].map((genre) => (
                  <li key={genre.name} className="rmi-genre">
                    <span className="rmi-genre-name">{genre.name}</span>
                    <span className="rmi-genre-why">{genre.why}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Factor table ─────────────────────────────────────────────────────────
/**
 * All ten factors ranked, each with its 1.0–4.0 bar, on the shared <Table>.
 * The app tints the first three rows (`.factors-table tr:nth-child(-n+3)`),
 * which is what makes the table read as "these are the motivators" rather than
 * a flat list — here that's Table's own `highlightRow`.
 */
export function FactorTable({ scores, deltas = {}, scoreLabel = 'Motivation Score' }) {
  const rows = rankedFactors(scores).map((factor, i) => ({
    ...factor,
    id: factor.name,
    rank: i + 1,
  }))

  const columns = [
    {
      key: 'name',
      label: 'Motivation Type',
      render: (name, row) => (
        <div className="rmi-table-factors">
          <span className="rmi-table-factors-number">{row.rank}.</span>
          <FactorIcon factor={name} />
          <div className="rmi-table-factors-content">
            <span className="rmi-table-factors-name">{name[0].toUpperCase() + name.slice(1)}</span>
            <span className="rmi-table-factors-description">
              {FACTORS[name]?.educator_definition}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'score',
      label: scoreLabel,
      width: 300,
      align: 'right',
      render: (score, row) => (
        <div className="rmi-factor-score">
          <div className="rmi-factor-bar">
            <div className="rmi-factor-bar-bg" />
            <div className="rmi-factor-bar-total" style={{ width: `${(score / 4) * 100}%` }} />
          </div>
          <span className="rmi-factor-score-number">{score.toFixed(1)}</span>
          <Delta value={deltas[row.name]} />
        </div>
      ),
    },
  ]

  return (
    <Table
      className="rmi-factors-table"
      columns={columns}
      rows={rows}
      getRowKey={(r) => r.id}
      highlightRow={(r) => r.rank <= 3}
      scrollX
    />
  )
}
