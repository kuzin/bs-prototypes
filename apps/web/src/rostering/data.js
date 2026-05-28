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

// ─── Subject categories (mirrors Clever's section "subject" taxonomy) ─────────
// Every incoming class carries a Clever subject category. The import filter
// decides which categories flow into Beanstack.
export const CATEGORY_LABEL = {
  ela:              'English / Language Arts',
  homeroom:         'Homeroom / Advisory',
  other:            'Other / Uncategorized',
  'social-studies': 'Social Studies',
  'arts-music':     'Arts & Music',
  math:             'Math',
  science:          'Science',
  'pe-health':      'PE & Health',
  language:         'World Languages',
  enrichment:       'Enrichment',
}

export const SUBJECT_CATEGORY = {
  'ELA':            'ela',
  'Reading':        'ela',
  'Language Arts':  'ela',
  'Homeroom':       'homeroom',
  'Library':        'other',
  'Lunch':          'other',
  'Recess':         'other',
  'Dismissal':      'other',
  'Bus Duty':       'other',
  'Social Studies': 'social-studies',
  'Arts and Music': 'arts-music',
  'Math':           'math',
  'Science':        'science',
  'PE':             'pe-health',
  'Health':         'pe-health',
  'Spanish':        'language',
  'Book Club':      'enrichment',
}

// ─── Import filter (per-school) ──────────────────────────────────────────────
// mode:
//   'filtered_import'            → import ELA + Homeroom classes
//   'import__filtered_and_other' → import ELA + Homeroom + Other classes
// customSubjects: extra keywords. A class also imports when its name or subject
// contains one of these — ON TOP OF whatever the mode pulls in.
export const MODE_CATEGORIES = {
  filtered_import:            ['ela', 'homeroom'],
  import__filtered_and_other: ['ela', 'homeroom', 'other'],
}

export const MODE_OPTIONS = [
  {
    id: 'filtered_import',
    label: 'ELA & Homeroom only',
    desc: 'Only classes tagged English/Language Arts or Homeroom.',
  },
  {
    id: 'import__filtered_and_other',
    label: 'ELA, Homeroom & Other',
    desc: 'Also includes classes tagged “Other” (often uncategorized).',
  },
]

// Default: the focused filter, plus one custom keyword to show the additive
// behaviour (Stiles Point runs "Book Club" sections that aren't tagged ELA).
export const DEFAULT_FILTER = { mode: 'filtered_import', customSubjects: ['Book Club'] }

// Classes per subject in the incoming roster.
export const SUBJECT_COUNTS = {
  'Arts and Music':  42,
  'Reading':         24,
  'Homeroom':        18,
  'ELA':             18,
  'Language Arts':   12,
  'Math':             8,
  'Lunch':            8,
  'Social Studies':   6,
  'Science':          6,
  'PE':               6,
  'Recess':           5,
  'Library':          4,
  'Book Club':        4,
  'Health':           3,
  'Spanish':          3,
  'Dismissal':        2,
  'Bus Duty':         1,
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
  'Book Club':       [['Janie Hill'], ['Patricia Owens']],
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
  'Book Club': 'Book Club',
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

// Subjects whose classes carry a reading level.
const READING_SUBJECTS = ['Reading', 'ELA', 'Language Arts', 'Book Club']

// Periods within a school day for elementary
const PERIODS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const GRADES  = ['K', '1', '2', '3', '4', '5', '6']

// Builds a Clever-style class identifier like '84-NOBSID-RA6-A-6'.
function classCode(prefix, grade, period, idx) {
  return `84-NOBSID-${prefix.toUpperCase().replace(/\s+/g, '')}${grade}-${period}-${idx}`
}

function pickTeachers(subject, idx) {
  const pool = TEACHER_POOL[subject] || [['Unknown Teacher']]
  return pool[idx % pool.length]
}

// Generate ALL incoming classes deterministically. Each entry carries its
// Clever subject category so the import filter can classify it.
function buildClasses(counts = SUBJECT_COUNTS, idPrefix = 'c') {
  const out = []
  let nextId = 1
  for (const [subject, count] of Object.entries(counts)) {
    const prefix = SUBJECT_PREFIX[subject]
    for (let i = 0; i < count; i++) {
      const grade  = GRADES[i % GRADES.length]
      const period = PERIODS[i % PERIODS.length]
      const teachers = pickTeachers(subject, i)
      const teacherLast = teachers[0].split(' ').pop()
      const code = classCode(prefix, grade, period, (i % 12) + 1)
      out.push({
        id: `${idPrefix}-${nextId++}`,
        name: `${prefix} ${grade} - ${code} - ${teacherLast}`,
        period: code,
        students: 14 + ((i * 3) % 12),
        subject,
        cleverCategory: SUBJECT_CATEGORY[subject],
        teachers,
        avgLexile: READING_SUBJECTS.includes(subject) ? 320 + ((i * 17) % 480) : null,
      })
    }
  }
  return out
}

export const INCOMING_CLASSES = buildClasses()

// Why a class imports: by the mode's category filter, by a custom keyword, or
// not at all. Returns 'filter' | 'custom' | null.
export function classImportSource(cls, filter) {
  const cats = MODE_CATEGORIES[filter.mode] || []
  if (cats.includes(cls.cleverCategory)) return 'filter'
  const hay = `${cls.name} ${cls.subject}`.toLowerCase()
  for (const word of filter.customSubjects) {
    const t = (word || '').trim().toLowerCase()
    if (t && hay.includes(t)) return 'custom'
  }
  return null
}

// ─── Last sync snapshot (school-tool style) ──────────────────────────────────
// Totals from the most recent sync, with the deactivated users behind each
// "Deactivated" count. Deactivated users are deleted on their scheduled date
// unless they reappear in a later sync.
export const LAST_SYNC = {
  at: '2026-05-26T02:00:00-04:00',
  result: 'success',
  teachers: 47,
  students: 1204,
  sections: 72,
  enrollments: 5412,
  teachersDeactivated: [
    { name: 'Marcus Greene',  deactivatedAt: '2026-05-20T02:41:00', scheduledDeletion: '2026-05-31' },
    { name: 'Tasha Williams', deactivatedAt: '2026-05-20T02:41:00', scheduledDeletion: '2026-05-31' },
  ],
  studentsDeactivated: [
    { name: 'Harper Gantt',        deactivatedAt: '2026-05-16T04:48:00', scheduledDeletion: '2026-05-24' },
    { name: 'Janesha Salters',     deactivatedAt: '2026-05-16T04:48:00', scheduledDeletion: '2026-05-24' },
    { name: 'Ayden Carter',        deactivatedAt: '2026-05-20T02:41:00', scheduledDeletion: '2026-05-31' },
    { name: 'Jacqueline McDaniel', deactivatedAt: '2026-05-20T02:41:00', scheduledDeletion: '2026-05-31' },
  ],
}

// ─── District context (powers the district version of this prototype) ─────────
// The district version reuses every component via a `scope="district"` prop and
// adds a school picker that scopes the live filter preview. The import filter and
// summer pause read as district-wide policy; only the preview is per-school.
// Each school carries its own deterministically-built roster so the preview
// changes per school. Stiles Point reuses the school version's roster so the
// default selection lines up with the single-school prototype.
function scaleCounts(counts, factor) {
  const out = {}
  for (const [k, v] of Object.entries(counts)) out[k] = Math.max(1, Math.round(v * factor))
  return out
}

// Per-school deactivated-user pool for the Last Sync drill-down modals.
const DEACT_POOL = [
  { name: 'Marcus Greene',       role: 'Teacher' },
  { name: 'Harper Gantt',        role: 'Student' },
  { name: 'Tasha Williams',      role: 'Teacher' },
  { name: 'Janesha Salters',     role: 'Student' },
  { name: 'Ayden Carter',        role: 'Student' },
  { name: 'Jacqueline McDaniel', role: 'Teacher' },
  { name: 'Devon Boyd',          role: 'Student' },
  { name: 'Mia Nunez',           role: 'Student' },
  { name: 'Caleb Frye',          role: 'Student' },
  { name: 'Nadia Rahman',        role: 'Teacher' },
  { name: 'Owen Vance',          role: 'Student' },
  { name: 'Priya Desai',         role: 'Teacher' },
]

function buildDeactivated(n, offset = 0) {
  return Array.from({ length: n }, (_, i) => {
    const u = DEACT_POOL[(offset + i) % DEACT_POOL.length]
    const early = i % 2 === 0
    return {
      ...u,
      deactivatedAt: early ? '2026-05-16T04:48:00' : '2026-05-20T02:41:00',
      scheduledDeletion: early ? '2026-05-24' : '2026-05-31',
    }
  })
}

// Each school carries its own roster (for the filter preview), last-sync totals,
// and deactivated-user list (for the Last Sync table + drill-down modal). Stiles
// Point's numbers match the school version's LAST_SYNC.
export const SCHOOLS = [
  { id: 'stiles-point',   name: 'Stiles Point Elementary School', grades: 'PK–5', teachers: 47, students: 1204, sections: 72,  enrollments: 5412, deactivatedUsers: buildDeactivated(6, 0), classes: INCOMING_CLASSES },
  { id: 'james-island',   name: 'James Island Elementary',        grades: 'PK–5', teachers: 44, students: 1098, sections: 66,  enrollments: 4940, deactivatedUsers: buildDeactivated(3, 2), classes: buildClasses(scaleCounts(SUBJECT_COUNTS, 0.88), 'ji') },
  { id: 'harbor-view',    name: 'Harbor View Elementary',         grades: 'PK–5', teachers: 41, students: 1012, sections: 60,  enrollments: 4550, deactivatedUsers: buildDeactivated(2, 5), classes: buildClasses(scaleCounts(SUBJECT_COUNTS, 0.74), 'hv') },
  { id: 'murray-lasaine', name: 'Murray-LaSaine Montessori',      grades: 'PK–8', teachers: 52, students: 1340, sections: 80,  enrollments: 6030, deactivatedUsers: buildDeactivated(5, 7), classes: buildClasses(scaleCounts(SUBJECT_COUNTS, 1.18), 'ml') },
  { id: 'camp-road',      name: 'Camp Road Middle School',        grades: '6–8',  teachers: 58, students: 1486, sections: 88,  enrollments: 6680, deactivatedUsers: buildDeactivated(4, 1), classes: buildClasses(scaleCounts(SUBJECT_COUNTS, 1.32), 'cr') },
  { id: 'fort-johnson',   name: 'Fort Johnson Middle School',     grades: '6–8',  teachers: 70, students: 1720, sections: 102, enrollments: 7740, deactivatedUsers: buildDeactivated(6, 4), classes: buildClasses(scaleCounts(SUBJECT_COUNTS, 1.5),  'fj') },
]

export const DISTRICT = {
  name: 'Charleston County School District',
  shortCode: 'CCSD',
  schoolCount: SCHOOLS.length,
  lastSyncAt: LAST_SYNC.at,
}
