// ─── School + connection context ─────────────────────────────────────────────
export const SCHOOL = {
  name: 'Stiles Point Elementary School',
  district: 'Charleston County School District',
  shortCode: 'CCSD',
}

export const SOURCE = {
  name: 'Clever',
  type: 'api',             // 'api' (auto-sync) | 'csv' (file upload)
  status: 'healthy',       // 'healthy' | 'warning' | 'error'
  connectedSince: '2022-08-14',
  lastSyncAt: '2026-05-26T02:00:00-04:00',
  nextSyncAt: '2026-05-27T02:00:00-04:00',
  rosteringContact: { name: 'Daniel Reyes', role: 'District IT', email: 'dreyes@ccsdschools.com' },
}

// Recent sync log (most recent first). Each entry carries the per-entity
// change counts so the log reads like a series of mini diffs.
export const SYNC_LOG = [
  { at: '2026-05-26T02:00:00-04:00', result: 'success', changes: { classes: { new: 12, removed: 3 }, students: { new: 8, removed: 2 }, staff: { new: 1, removed: 0 } } },
  { at: '2026-05-25T02:00:00-04:00', result: 'success', changes: { classes: { new: 0, removed: 0 }, students: { new: 0, removed: 0 }, staff: { new: 0, removed: 0 } } },
  { at: '2026-05-24T02:00:00-04:00', result: 'success', changes: { classes: { new: 0, removed: 0 }, students: { new: 0, removed: 2 }, staff: { new: 0, removed: 0 } } },
  { at: '2026-05-23T02:00:00-04:00', result: 'warning', changes: { classes: { new: 2, removed: 0 }, students: { new: 4, removed: 0 }, staff: { new: 1, removed: 0 } } },
  { at: '2026-05-22T02:00:00-04:00', result: 'success', changes: { classes: { new: 0, removed: 0 }, students: { new: 0, removed: 0 }, staff: { new: 0, removed: 0 } } },
]

// ─── Subject rules (per-school) ──────────────────────────────────────────────
// Binary: a subject either syncs (allowed) or it doesn't (excluded).
// New subjects detected in a sync default to excluded — they never pollute the
// data until Janie opts them in.
export const DEFAULT_RULES = {
  allowed:  ['ELA', 'Reading', 'Language Arts', 'Library', 'Social Studies'],
  excluded: ['Arts and Music', 'Homeroom', 'Math', 'Science', 'PE', 'Health', 'Spanish', 'Lunch', 'Recess', 'Dismissal', 'Bus Duty'],
}

// Subjects first seen in the most recent sync — surfaced with a "New" badge in
// the edit list so Janie knows which ones to review.
export const NEW_SUBJECTS = ['Arts and Music', 'Homeroom', 'Math', 'Science']

// All subjects that show up in incoming classes (used to render chip counts).
// Each subject lists how many incoming classes carry it.
export const SUBJECT_COUNTS = {
  'Arts and Music':  42,
  'Homeroom':        18,
  'Reading':         24,
  'ELA':             18,
  'Language Arts':   12,
  'Math':             8,
  'Library':          4,
  'Social Studies':   6,
  'Science':          6,
  'PE':               6,
  'Lunch':            8,
  'Recess':           5,
  'Health':           3,
  'Spanish':          3,
  'Dismissal':        2,
  'Bus Duty':         1,
}

// Total counts (derived but hardcoded for prototype clarity)
export const TOTALS = {
  classesIncoming: 166,
  classesWillSync: 64,   // Allowed subjects
  classesFiltered: 16,   // Excluded subjects
  classesUnsorted: 86,   // Unsorted subjects (held in limbo)
  staff: 47,
  students: 1204,
}

// ─── Pre-sync diff ───────────────────────────────────────────────────────────
export const DIFF = {
  classes: { new: 12, removed: 3, changed: 5 },
  staff:   { new: 1, removed: 0, changed: 2 },
  students: { new: 8, removed: 2, changed: 0 },
}

// ─── Helpers for generating realistic class names ────────────────────────────
const TEACHER_POOL = {
  'Arts and Music':  [['Katherine Weller', 'Catherine Comer']],
  'Homeroom':        [['Sarah Holcombe'], ['Marcus Bell'], ['Diana Pruitt'], ['Carolyn McAlister']],
  'Reading':         [['Janie Hill'], ['Patricia Owens'], ['Sandra Park']],
  'ELA':             [['Diana Pruitt'], ['Marcus Bell'], ['Linda Park'], ['Maria Davis']],
  'Language Arts':   [['Diana Pruitt'], ['Linda Park']],
  'Math':            [['Carolyn McAlister'], ['Robert Chen']],
  'Library':         [['Janie Hill']],
  'Social Studies':  [['Marcus Bell'], ['Diana Pruitt']],
  'Science':         [['Robert Chen'], ['Aisha Patel']],
  'PE':              [['Marcus Greene']],
  'Lunch':           [['Cafeteria Staff']],
  'Recess':          [['Yard Duty']],
  'Health':          [['Aisha Patel']],
  'Spanish':         [['Elena Morales']],
  'Dismissal':       [['Front Office']],
  'Bus Duty':        [['Front Office']],
}

const SUBJECT_PREFIX = {
  'Arts and Music': 'Art',
  'Homeroom': 'HR',
  'Reading': 'Read',
  'ELA': 'ELA',
  'Language Arts': 'LA',
  'Math': 'Math',
  'Library': 'Lib',
  'Social Studies': 'SS',
  'Science': 'Sci',
  'PE': 'PE',
  'Lunch': 'Lunch',
  'Recess': 'Recess',
  'Health': 'Hlth',
  'Spanish': 'Span',
  'Dismissal': 'Dis',
  'Bus Duty': 'Bus',
}

// Periods within a school day for elementary
const PERIODS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const GRADES  = ['K', '1', '2', '3', '4', '5', '6']

// Builds a Clever-style class identifier like '84-NOBSID-RA6-A-6'.
function classCode(prefix, grade, period, idx) {
  return `84-NOBSID-${prefix.toUpperCase()}${grade}-${period}-${idx}`
}

function pickTeachers(subject, idx) {
  const pool = TEACHER_POOL[subject] || [['Unknown Teacher']]
  return pool[idx % pool.length]
}

// Generate ALL incoming classes deterministically. Each entry has full metadata.
function buildClasses() {
  const out = []
  let nextId = 1
  for (const [subject, count] of Object.entries(SUBJECT_COUNTS)) {
    const prefix = SUBJECT_PREFIX[subject]
    for (let i = 0; i < count; i++) {
      const grade  = GRADES[i % GRADES.length]
      const period = PERIODS[i % PERIODS.length]
      const teachers = pickTeachers(subject, i)
      const teacherLast = teachers[0].split(' ').pop()
      const code = classCode(prefix, grade, period, (i % 12) + 1)
      out.push({
        id: `c-${nextId++}`,
        name: `${SUBJECT_PREFIX[subject]} ${grade} - ${code} - ${teacherLast}`,
        period: code,
        students: 14 + ((i * 3) % 12),
        subject,
        teachers,
        avgLexile: subject === 'Reading' || subject === 'ELA' || subject === 'Language Arts'
          ? 320 + ((i * 17) % 480)
          : null,
        // Status is computed dynamically from rules — but we tag a handful as
        // 'new' or 'removed' to power the diff.
        diff: null,
      })
    }
  }
  // Tag the first 12 of certain subjects as NEW to match DIFF.classes.new = 12
  let newCount = 0
  for (const c of out) {
    if (newCount >= 12) break
    if (['Arts and Music', 'Reading', 'Homeroom'].includes(c.subject)) {
      c.diff = 'new'
      newCount++
    }
  }
  return out
}

export const INCOMING_CLASSES = buildClasses()

// Removed classes (gone in the next sync). Carry minimal data, all flagged 'removed'.
export const REMOVED_CLASSES = [
  { id: 'r-1', name: 'Math 2 - 84-NOBSID-MA-E-11 - McAlister', period: '84-NOBSID-MA-E-11', subject: 'Math',     teachers: ['Carolyn McAlister'], students: 0, avgLexile: null, diff: 'removed' },
  { id: 'r-2', name: 'Read 4 - 84-NOBSID-RD-B-3 - Owens',      period: '84-NOBSID-RD-B-3',  subject: 'Reading',  teachers: ['Patricia Owens'],    students: 0, avgLexile: null, diff: 'removed' },
  { id: 'r-3', name: 'HR K - 84-NOBSID-HR-A-1 - Pruitt',       period: '84-NOBSID-HR-A-1',  subject: 'Homeroom', teachers: ['Diana Pruitt'],     students: 0, avgLexile: null, diff: 'removed' },
]

// Binary: a subject either syncs or it's filtered out.
export function statusFromRules(subject, rules) {
  return rules.allowed.includes(subject) ? 'will-sync' : 'filtered'
}

// ─── Staff ───────────────────────────────────────────────────────────────────
export const STAFF = [
  { id: 's-1',  name: 'Janie Hill',         email: 'jhill@stilespoint.edu',     role: 'Librarian / Media Specialist', syncStatus: 'included', isYou: true },
  { id: 's-2',  name: 'Diana Pruitt',       email: 'dpruitt@stilespoint.edu',   role: 'ELA Teacher',                  syncStatus: 'included' },
  { id: 's-3',  name: 'Marcus Bell',        email: 'mbell@stilespoint.edu',     role: 'Teacher',                      syncStatus: 'included' },
  { id: 's-4',  name: 'Carolyn McAlister',  email: 'cmcalister@stilespoint.edu',role: 'Teacher',                      syncStatus: 'included' },
  { id: 's-5',  name: 'Katherine Weller',   email: 'kweller@stilespoint.edu',   role: 'Specials Teacher',             syncStatus: 'included' },
  { id: 's-6',  name: 'Catherine Comer',    email: 'ccomer@stilespoint.edu',    role: 'Specials Teacher',             syncStatus: 'included' },
  { id: 's-7',  name: 'Patricia Owens',     email: 'powens@stilespoint.edu',    role: 'Reading Specialist',           syncStatus: 'included' },
  { id: 's-8',  name: 'Sandra Park',        email: 'spark@stilespoint.edu',     role: 'Reading Specialist',           syncStatus: 'included' },
  { id: 's-9',  name: 'Robert Chen',        email: 'rchen@stilespoint.edu',     role: 'Teacher',                      syncStatus: 'included' },
  { id: 's-10', name: 'Aisha Patel',        email: 'apatel@stilespoint.edu',    role: 'Science Teacher',              syncStatus: 'included' },
  { id: 's-11', name: 'Linda Park',         email: 'lpark@stilespoint.edu',     role: 'ELA Teacher',                  syncStatus: 'included' },
  { id: 's-12', name: 'Maria Davis',        email: 'mdavis@stilespoint.edu',    role: 'ELA Teacher',                  syncStatus: 'included' },
  { id: 's-13', name: 'Sarah Holcombe',     email: 'sholcombe@stilespoint.edu', role: 'Teacher',                      syncStatus: 'included' },
  { id: 's-14', name: 'Elena Morales',      email: 'emorales@stilespoint.edu',  role: 'World Languages',              syncStatus: 'included' },
  { id: 's-15', name: 'Marcus Greene',      email: 'mgreene@stilespoint.edu',   role: 'PE Coach',                     syncStatus: 'not-synced', notedBy: 'Janie' },
  { id: 's-16', name: 'Tasha Williams',     email: 'twilliams@stilespoint.edu', role: 'School Counselor',             syncStatus: 'not-synced', notedBy: 'Janie' },
  { id: 's-17', name: 'Principal Jack Mosley', email: 'jmosley@stilespoint.edu',role: 'Principal',                    syncStatus: 'included' },
  { id: 's-18', name: 'Vice Principal Lopez', email: 'mlopez@stilespoint.edu',  role: 'Vice Principal',               syncStatus: 'new' },
]

// ─── Students (sample — table will say "of 1,204") ───────────────────────────
export const STUDENTS_SAMPLE = [
  { id: 'st-1',  name: 'Ralph Abel',        username: 'aberal7871', grade: '1st',  syncStatus: 'current' },
  { id: 'st-2',  name: 'Virginia Abel',     username: 'abevir1181', grade: 'PK',   syncStatus: 'current' },
  { id: 'st-3',  name: 'Emmie Adams',       username: 'adaemm1453', grade: '2nd',  syncStatus: 'current' },
  { id: 'st-4',  name: 'Paisley Adams',     username: 'adapai0552', grade: '3rd',  syncStatus: 'current' },
  { id: 'st-5',  name: 'Samuel Adams',      username: 'adasam7917', grade: 'K',    syncStatus: 'current' },
  { id: 'st-6',  name: 'Cora Albertson',    username: 'albcor4543', grade: '5th',  syncStatus: 'current' },
  { id: 'st-7',  name: 'Blakely Alexander', username: 'alebla0533', grade: '3rd',  syncStatus: 'current' },
  { id: 'st-8',  name: 'Evelyn Alexander',  username: 'aleeve7894', grade: '1st',  syncStatus: 'current' },
  { id: 'st-9',  name: 'Hope Alexander',    username: 'alehop6709', grade: '2nd',  syncStatus: 'current' },
  { id: 'st-10', name: 'May Alexander',     username: 'alemay1349', grade: '4th',  syncStatus: 'current' },
  { id: 'st-11', name: 'Owen Bauer',        username: 'baowe2240', grade: '5th',  syncStatus: 'new' },
  { id: 'st-12', name: 'Hazel Bauer',       username: 'bahaz1991', grade: '3rd',  syncStatus: 'new' },
  { id: 'st-13', name: 'Levi Carrington',   username: 'calev0021', grade: 'K',    syncStatus: 'new' },
  { id: 'st-14', name: 'Iris Carrington',   username: 'cairi9912', grade: '2nd',  syncStatus: 'new' },
  { id: 'st-15', name: 'Theodore Drake',    username: 'drthe4421', grade: '5th',  syncStatus: 'new' },
  { id: 'st-16', name: 'Sage Edwards',      username: 'edsag1124', grade: '4th',  syncStatus: 'new' },
  { id: 'st-17', name: 'Phoenix Greene',    username: 'grpho7710', grade: '3rd',  syncStatus: 'new' },
  { id: 'st-18', name: 'Wren Hall',         username: 'hawre0813', grade: '1st',  syncStatus: 'new' },
]
