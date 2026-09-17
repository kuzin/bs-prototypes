// The RMI scoring + recommendation pipeline, ported from the rmi-engine gem so
// the educator reports and the student quiz reveal are computed the same way
// rather than each carrying its own hand-written numbers.
//
// Ports, in order:
//   scoreAnswers        ← lib/rmi/engine/survey_response_scorer.rb
//   topThreeFactors     ← Recommendable#top_three_factors
//   recommendationsFor  ← lib/rmi/engine/recommendation_generator.rb
//   readingGoalFor      ← Recommendable#recommended_reading_goal
//   summaryFor          ← lib/rmi/engine/summary.rb + config/summaries.yml
//
// The one deliberate difference: the engine *samples* matching recommendations
// at random, which would reshuffle the page on every render. Here the pick is
// seeded off the responder so a given reader always shows the same advice.

import {
  QUESTIONS,
  RECOMMENDATIONS,
  INTRINSIC_FACTORS,
  EXTRINSIC_FACTORS,
  MOTIVATION_OF,
} from './domain'

// Rmi::Engine::Recommendable::LOW_SCORE_THRESHOLD — at or below this on every
// factor and the reader is "The Mystery" rather than any real motivator.
export const LOW_SCORE_THRESHOLD = 1.0

export const SCORE_RANGE = { factor: [1, 4], axis: [5, 20], overall: [10, 40] }

const QUESTIONS_BY_FACTOR = QUESTIONS.reduce((acc, q) => {
  ;(acc[q.factor] ||= []).push(q)
  return acc
}, {})

export const ALL_FACTORS = [...INTRINSIC_FACTORS, ...EXTRINSIC_FACTORS]

/**
 * `answers` is a map of question id → 1–4. Returns every score the app shows:
 * one per factor (mean of that factor's 2 answers, 1.0–4.0), one per axis (sum
 * of its 5 factors, 5.0–20.0) and overall (sum of both axes, 10.0–40.0).
 */
export function scoreAnswers(answers) {
  const factors = {}
  for (const [factor, questions] of Object.entries(QUESTIONS_BY_FACTOR)) {
    const given = questions.map((q) => answers[q.id]).filter((a) => a != null)
    factors[factor] = given.length ? given.reduce((a, b) => a + b, 0) / given.length : 0
  }

  const intrinsic = INTRINSIC_FACTORS.reduce((sum, f) => sum + factors[f], 0)
  const extrinsic = EXTRINSIC_FACTORS.reduce((sum, f) => sum + factors[f], 0)

  return { factors, intrinsic, extrinsic, overall: intrinsic + extrinsic }
}

/** Factors ranked high→low, the order the reports' factor table lists them in. */
export function rankedFactors(scores) {
  return ALL_FACTORS.map((name) => ({
    name,
    score: scores.factors[name],
    motivation: MOTIVATION_OF[name],
  })).sort((a, b) => b.score - a.score)
}

/**
 * The top three motivators. Only factors *above* the threshold are eligible; if
 * none are, the engine returns `{ mystery: 1.0 }` so the low-motivation state is
 * visible to the reveal and the tooltips instead of silently rendering nothing.
 */
export function topThreeFactors(scores) {
  const eligible = rankedFactors(scores).filter((f) => f.score > LOW_SCORE_THRESHOLD)
  if (eligible.length === 0) return [{ name: 'mystery', score: 1.0, motivation: 'unknown' }]
  return eligible.slice(0, 3)
}

export function isLowScoring(scores) {
  return ALL_FACTORS.every((f) => scores.factors[f] <= LOW_SCORE_THRESHOLD)
}

// Deterministic stand-in for the engine's `sample` — same reader, same advice.
function seededPick(pool, seed, count) {
  if (pool.length === 0) return []
  let h = 0
  const key = String(seed)
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0
  const picked = []
  const remaining = [...pool]
  for (let i = 0; i < count && remaining.length; i++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff
    picked.push(remaining.splice(h % remaining.length, 1)[0])
  }
  return picked
}

/**
 * Two recommendations of the given kind, each tied to one of the reader's top
 * factors — `group` for a class report, `reader_internal` for the educator's
 * view of one student, `reader_external` for the student themselves.
 */
export function recommendationsFor(scores, { kind, seed }) {
  if (isLowScoring(scores)) {
    const pool = RECOMMENDATIONS.filter((r) => r.kind === `${kind}_low_scores`)
    return seededPick(pool, seed, 2).map((r) => ({
      ...r,
      factor: 'mystery',
      motivation: 'unknown',
    }))
  }

  const top = topThreeFactors(scores)
  const out = []
  const used = new Set()

  for (const factor of top) {
    if (out.length >= 2) break
    const pool = RECOMMENDATIONS.filter(
      (r) => r.kind === kind && r.factors.includes(factor.name) && !used.has(r.id),
    )
    const [pick] = seededPick(pool, `${seed}:${factor.name}`, 1)
    if (!pick) continue
    used.add(pick.id)
    out.push({
      ...pick,
      factor: factor.name,
      motivation: MOTIVATION_OF[factor.name],
    })
  }

  return out
}

/** Recommendable#recommended_reading_goal — banded off the overall score. */
export function readingGoalFor(scores) {
  const overall = scores.overall
  if (overall < 10) return 15
  if (overall < 20) return 20
  if (overall < 30) return 25
  return 30
}

// The summary reads a recommendation back mid-sentence ("try …ing"), so each one
// needs a gerund form. The engine rewrites these in TextUtils; the ones the
// summaries actually reach are written out here.
const GERUNDS = {
  'Create a "stretch goal" and award readers for meeting or exceeding this reading goal.':
    'creating a "stretch goal" and awarding readers for meeting it',
  'Encourage students to step outside their comfort zone and read a new genre.':
    'encouraging students to step outside their comfort zone and read a new genre',
  'Celebrate all reading accomplishments, such as students starting a new book or reading every day for a week.':
    'celebrating all reading accomplishments, big and small',
  'Set a daily reading goal that provides them with a healthy challenge.':
    'setting a daily reading goal that provides a healthy challenge',
  'Feature a list of non-fiction texts that cover a wide range of interesting topics.':
    'featuring non-fiction texts across a wide range of interesting topics',
  'Encourage students to write book reviews and share their favorite books with other students.':
    'encouraging students to write book reviews and share their favorites',
  'Promote free-choice reading by setting aside 15 minutes per week for Drop Everything and Read (D.E.A.R.) time.':
    'setting aside time each week for Drop Everything and Read',
  'Create a classroom leaderboard that allows students to track their reading progress with their peers.':
    'creating a classroom leaderboard they can track themselves against',
  'Encourage your students to ask a friend or family member for a book recommendation.':
    'encouraging them to ask a friend or family member for a book recommendation',
  'Encourage them to step outside their comfort zone and read a new genre.':
    'encouraging them to step outside their comfort zone and read a new genre',
  'Celebrate all of their reading accomplishments, such as starting a new book or reading every day for a week.':
    'celebrating all of their reading accomplishments, big and small',
}

// Verbs that double their final consonant: "set" → "setting".
const DOUBLING = new Set(['set', 'put', 'plan', 'stop', 'get', 'run', 'cut', 'let', 'begin'])

/**
 * Every recommendation is an imperative ("Use your state's book award list…"),
 * and the summary quotes one mid-sentence ("may also appreciate …"), so the
 * leading verb has to become a gerund. GERUNDS above overrides the handful
 * whose *middle* also needs rewriting ("and award" → "and awarding"); this
 * conjugates the rest.
 */
function gerund(text) {
  if (GERUNDS[text]) return GERUNDS[text]

  const trimmed = text.replace(/[.!]$/, '')
  const [first, ...rest] = trimmed.split(' ')
  const verb = first.toLowerCase()

  let ing
  if (DOUBLING.has(verb)) ing = `${verb}${verb.slice(-1)}ing`
  else if (/[^aeiou]e$/.test(verb))
    ing = `${verb.slice(0, -1)}ing` // use → using
  else ing = `${verb}ing`

  return [ing, ...rest].join(' ')
}

/**
 * The "Benny says…" paragraph. Templates are the first variant of each sentence
 * in the engine's `config/summaries.yml`.
 */
export function summaryFor(scores, { subject, kind = 'reader', pronoun = 'their' }) {
  if (isLowScoring(scores)) {
    return kind === 'group'
      ? `Readers in ${subject} do not show a strong preference for any motivation factors and may need support finding books they love. It may be helpful to talk through the survey with them, to ensure that their responses are accurate.`
      : `${subject} does not show a strong preference for any motivation factors and may need support finding books they love. It may be helpful to talk through the survey with them, to ensure that their responses are accurate (you can edit their responses from this page).`
  }

  const names = topThreeFactors(scores).map((f) => f.name)
  const recKind = kind === 'group' ? 'group' : 'reader_internal'
  const recs = recommendationsFor(scores, { kind: recKind, seed: subject })

  const first =
    kind === 'group'
      ? `Readers in ${subject} are most commonly driven by ${names[0]}, ${names[1]}, and ${names[2]}.`
      : `${subject} is mainly driven by ${names[0]}, ${names[1]}, and ${names[2]}.`

  const second = recs[0]
    ? kind === 'group'
      ? `They may be particularly motivated by ${gerund(recs[0].text)}.`
      : `To appeal to ${pronoun} ${names[0]} motivator, try ${gerund(recs[0].text)}.`
    : ''

  const third = recs[1]
    ? kind === 'group'
      ? `Readers with higher ${names[1]} scores may also appreciate ${gerund(recs[1].text)}.`
      : `They may also benefit from ${gerund(recs[1].text)}, given ${pronoun} high ${names[1]} factor.`
    : ''

  return [first, second, third].filter(Boolean).join(' ')
}

/** Aggregate scores across a set of scored responses — SurveyRequest#calculate_scores. */
export function aggregateScores(scoreList) {
  if (scoreList.length === 0) return null
  const factors = {}
  for (const f of ALL_FACTORS) {
    factors[f] = scoreList.reduce((sum, s) => sum + s.factors[f], 0) / scoreList.length
  }
  const intrinsic = INTRINSIC_FACTORS.reduce((sum, f) => sum + factors[f], 0)
  const extrinsic = EXTRINSIC_FACTORS.reduce((sum, f) => sum + factors[f], 0)
  return { factors, intrinsic, extrinsic, overall: intrinsic + extrinsic }
}

/** The ± shown against a comparison index. Null when there's nothing to compare. */
export function percentChange(current, previous) {
  if (previous == null || current == null || previous === 0) return null
  return ((current - previous) / previous) * 100
}
