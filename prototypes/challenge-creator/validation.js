// ─── Form validation ──────────────────────────────────────────────────────────
// Per-step validators return a map of { fieldKey: 'error message' }. A step with
// an empty map is valid. The wizard blocks Next / Publish on any errors.

export const LIMITS = {
  name: 60,
  ribbon: 28,
}

const CODE_RE = /^[A-Za-z0-9]{5,25}$/

function validateDetails(challenge, { role } = {}) {
  const d = challenge.details || {}
  const errors = {}

  const name = (d.name || '').trim()
  if (!name) errors.name = 'Give your challenge a name.'
  else if (name.length > LIMITS.name) errors.name = `Keep the name under ${LIMITS.name} characters.`

  if (d.requireCode) {
    const code = d.code || ''
    if (!code) errors.code = 'Enter a registration code, or turn off “Require a code.”'
    else if (!CODE_RE.test(code)) errors.code = 'Codes are 5–25 letters/numbers, with no spaces.'
  }

  if (d.start && d.end && d.end < d.start) {
    errors.end = 'The end date must be on or after the start date.'
  }

  // Teacher/MS challenges publish to specific classrooms — at least one required.
  if (role?.tier === 'simple' && (d.basis || 'grade') !== 'age' && !d.classrooms?.length) {
    errors.classrooms = 'Pick at least one classroom.'
  }

  return errors
}

function validateBadges(challenge, { type } = {}) {
  const errors = {}
  // Badge window: one combined error, and only for a genuinely broken range —
  // it never errors just because the window is empty (it defaults to the
  // challenge dates), so turning the restriction on doesn't start in an error.
  if (challenge.badgeTime === 'restricted') {
    const { start, end } = challenge.badgeWindow || {}
    if (start && end && end < start) {
      errors.badgeWindow = 'The badge window must end on or after it starts.'
    } else if (!!start !== !!end) {
      errors.badgeWindow = 'Set both a start and end date for the badge window.'
    }
  }

  // Every logging badge must carry a log value (log type + goal ≥ 1).
  const loggingOn = type?.primaryMethod === 'log' || !!challenge.methods?.log
  if (loggingOn) {
    const incomplete = (challenge.badges || []).some((b) => !b.logType || !(Number(b.goal) >= 1))
    if (incomplete) errors.badges = 'Give every logging badge a log type and goal.'
  }
  return errors
}

const VALIDATORS = {
  type: (challenge) => (challenge.typeId ? {} : { type: 'Choose a challenge type.' }),
  details: validateDetails,
  badges: validateBadges,
}

// Which screen of the walk-through owns each error. A screen only shows (and
// only blocks Next on) its own fields — so a name you haven't typed yet can't
// stop you leaving the dates screen; it stops you leaving the name screen.
const SCREEN_FIELDS = {
  'details.basics': ['name'],
  'details.dates': ['end'],
  'details.audience': ['classrooms', 'code'],
  'badges.methods': ['badgeWindow'],
  'badges.logging': ['badges'],
}

// Every phase names one screen that catches errors no screen claims, so a new
// validation rule can never go unreported (and can never block Publish from a
// screen the wizard won't stop on).
const PHASE_CATCHALL = {
  details: 'details.basics',
  badges: 'badges.methods',
}

// The phase a screen belongs to ('details.basics' → 'details'; 'type' → 'type').
export const phaseOf = (screenId) => String(screenId).split('.')[0]

export function validateStep(stepId, challenge, ctx = {}) {
  const phase = phaseOf(stepId)
  const fn = VALIDATORS[phase]
  const errors = fn ? fn(challenge, ctx) : {}
  // A whole-phase id (no dot, e.g. 'completion') keeps every error it produced.
  if (stepId === phase) return errors
  const own = SCREEN_FIELDS[stepId] || []
  const claimed = new Set(
    Object.entries(SCREEN_FIELDS)
      .filter(([id]) => phaseOf(id) === phase)
      .flatMap(([, keys]) => keys),
  )
  const isCatchAll = PHASE_CATCHALL[phase] === stepId
  return Object.fromEntries(
    Object.entries(errors).filter(([k]) => own.includes(k) || (isCatchAll && !claimed.has(k))),
  )
}

export function isStepValid(stepId, challenge, ctx = {}) {
  return Object.keys(validateStep(stepId, challenge, ctx)).length === 0
}

// First step (in the given order) that has errors, or null if the form is valid.
export function firstInvalidStep(steps, challenge, ctx = {}) {
  for (const s of steps) {
    if (!isStepValid(s.id, challenge, ctx)) return s.id
  }
  return null
}
