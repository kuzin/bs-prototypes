// The demo classroom behind the standalone app: one educator, one roster, and
// the index periods they've run this school year.
//
// Nothing here is a stored score. Each reader carries a *personality* — a bias
// per factor — which seeds their 20 answers for a given index, and every number
// the reports show is then derived by `scoring.js`, the same path a real
// response takes. Changing an answer changes the report, which is what makes
// the student quiz and the educator view line up.

import { QUESTIONS } from './domain'
import { scoreAnswers, aggregateScores } from './scoring'

export const EDUCATOR = {
  name: 'Renee Alvarez',
  initials: 'RA',
  email: 'ralvarez@willowcreek.k12.us',
  school: 'Willow Creek Elementary',
  slug: 'malvarez-4b',
  plan: 'Classroom',
  indexesLimit: 4, // "Create up to four indexes each school year."
  grades: [3, 5], // the classroom's grade band; titles are filtered to it
  studentsLimit: 40, // the roster's "N students out of M students added." notice
}

// Access codes are the 8-character alphanumerics the app prints onto the
// student handout — the reader types one to start their survey.
const ROSTER = [
  ['Amara Osei', 'K7QX2M4B', { curiosity: 1.0, enjoyment: 0.8, confidence: 0.5 }],
  ['Ben Kowalski', 'T3WN8PZR', { competition: 1.0, recognition: 0.7, social: 0.4 }],
  ['Camila Reyes', 'H9FD5LJV', { social: 1.0, enjoyment: 0.7, curiosity: 0.5 }],
  ['Dev Patel', 'B2MK7XQT', { challenge: 1.0, confidence: 0.8, curiosity: 0.6 }],
  ['Eliza Thornton', 'R6VC3NHW', { enjoyment: 1.0, importance: 0.6, curiosity: 0.5 }],
  ['Finn Gallagher', 'J8ZP4TBK', { grades: 0.9, compliance: 0.8, importance: 0.4 }],
  ['Grace Liu', 'W5NT9QDM', { confidence: 1.0, importance: 0.8, challenge: 0.5 }],
  ['Hassan Ali', 'P4XB6KRF', { curiosity: 0.9, challenge: 0.7, enjoyment: 0.5 }],
  ['Isla Brennan', 'M7JQ2WVT', { recognition: 0.9, social: 0.7, competition: 0.5 }],
  // Answers "very different from me" to all 20 — every factor lands on 1.0, so
  // the engine's low-score path takes over: The Mystery, and the recommendation
  // set that asks the educator to talk the survey through with them.
  ['Jonah Whitfield', 'C3KD8MNX', {}, { floor: true }],
  ['Keira Nakamura', 'V9TR5BHJ', { importance: 1.0, confidence: 0.7, grades: 0.5 }],
  ['Liam Doherty', 'N2WF7QCK', { compliance: 0.9, grades: 0.8, competition: 0.3 }],
  ['Maya Okonkwo', 'D6BZ3XPL', { enjoyment: 1.0, social: 0.8, curiosity: 0.6 }],
  ['Noah Ferreira', 'Q8HM4TWV', { competition: 1.0, confidence: 0.6, challenge: 0.5 }],
  ['Priya Raman', 'F5CJ9KNB', { curiosity: 1.0, importance: 0.7, challenge: 0.6 }],
  ['Quinn Sullivan', 'Z7VP2DGM', { enjoyment: 0.9, challenge: 0.6, social: 0.4 }],
  ['Rosa Delgado', 'L4NQ8BFT', { social: 0.9, recognition: 0.7, enjoyment: 0.5 }],
  ['Samir Haddad', 'X2KW6JRC', { grades: 1.0, importance: 0.7, compliance: 0.6 }],
  ['Tessa Lindqvist', 'G9MB5PHN', { confidence: 0.9, enjoyment: 0.7, curiosity: 0.6 }],
  ['Uma Krishnan', 'Y3TD7VQK', { challenge: 1.0, curiosity: 0.8, importance: 0.5 }],
  ['Victor Ramirez', 'S6PL4XNW', { recognition: 1.0, competition: 0.8, grades: 0.4 }],
  ['Willa Byrne', 'A8QF2MJD', { importance: 0.9, compliance: 0.7, confidence: 0.5 }],
  ['Xavier Dubois', 'E5RN9WTB', { enjoyment: 0.8, curiosity: 0.7, social: 0.5 }],
  ['Yara Mansour', 'U7JC3KPV', { confidence: 1.0, challenge: 0.8, competition: 0.5 }],
]

export const STUDENTS = ROSTER.map(([name, accessCode, bias, opts = {}], i) => ({
  id: `s${i + 1}`,
  name,
  accessCode,
  bias,
  ...opts,
}))

// ── Seeded answers ────────────────────────────────────────────────────────
// A reader's answer to a question is their bias for that factor, nudged by a
// per-index drift and a little deterministic noise, then clamped onto the 1–4
// Likert scale the survey actually offers.
function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 1000) / 1000
}

function answersFor(student, indexId, drift = 0) {
  const answers = {}
  for (const q of QUESTIONS) {
    if (student.floor) {
      answers[q.id] = 1
      continue
    }
    const bias = student.bias[q.factor] ?? 0
    const noise = hash(`${student.id}:${indexId}:${q.id}`) * 1.1 - 0.35
    const raw = 1.35 + bias * 2.5 + noise + drift
    answers[q.id] = Math.max(1, Math.min(4, Math.round(raw)))
  }
  return answers
}

// ── Index periods ─────────────────────────────────────────────────────────
// A SurveyRequest in the engine: a named window with a start and an end. The
// creator can't run two that overlap, so they read as a sequence down the year.
// `completion` is how far through the roster that period got.
const INDEX_DEFS = [
  {
    id: 'fall',
    name: 'Fall Check-In',
    startDate: '2025-09-08',
    endDate: '2025-09-26',
    completion: 24,
    drift: 0,
  },
  {
    id: 'winter',
    name: 'Winter Check-In',
    startDate: '2026-01-12',
    endDate: '2026-01-30',
    completion: 21,
    drift: 0.28, // the class moved a little after a semester of reading
  },
  {
    id: 'spring',
    name: 'Spring Check-In',
    startDate: '2026-04-13',
    endDate: '2026-05-01',
    completion: 9, // still collecting
    drift: 0.34,
  },
]

export const INDEXES = INDEX_DEFS.map((def) => {
  const responders = STUDENTS.slice(0, def.completion)
  const responses = responders.map((student) => {
    const answers = answersFor(student, def.id, def.drift)
    return {
      studentId: student.id,
      accessCode: student.accessCode,
      answers,
      scores: scoreAnswers(answers),
      status: 'scored',
    }
  })

  return {
    ...def,
    responses,
    scores: aggregateScores(responses.map((r) => r.scores)),
    totalStudents: STUDENTS.length,
    // "Analysis last run on …" under the Benny bubble.
    analysedAt: `${def.endDate}T16:42:00`,
  }
})

export const INDEX_BY_ID = Object.fromEntries(INDEXES.map((i) => [i.id, i]))

/**
 * A freshly created index period. It has no responses yet, so no scores — which
 * is the state the summary's "No data collected." empty case is for.
 */
export function makeIndex({ name, startDate, endDate }) {
  return {
    id: `ix${Date.now()}`,
    name,
    startDate,
    endDate,
    responses: [],
    scores: null,
    totalStudents: STUDENTS.length,
    analysedAt: null,
  }
}

/**
 * `SurveyRequest`'s overlap validation: a creator cannot have two index periods
 * whose date ranges overlap, partially or one inside the other. Returns the
 * clashing period, or null.
 */
export function overlappingIndex(indexes, { id, startDate, endDate }) {
  return (
    indexes.find((i) => i.id !== id && startDate <= i.endDate && endDate >= i.startDate) ?? null
  )
}

export function responseFor(indexId, studentId) {
  return INDEX_BY_ID[indexId]?.responses.find((r) => r.studentId === studentId) ?? null
}

export function studentById(id) {
  return STUDENTS.find((s) => s.id === id) ?? null
}

/** The survey URL the educator copies onto the board — `/s/:account_slug`. */
export const SURVEY_URL = `rmi.beanstack.com/s/${EDUCATOR.slug}`
