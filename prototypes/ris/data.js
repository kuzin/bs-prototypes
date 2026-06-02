// Riverside Unified School District — mock data

export const DISTRICT = {
  name: 'Riverside Unified School District',
  students: 12400,
  schools: 6,
  year: '2024–25 School Year',
}

export const SCHOOLS = [
  {
    id: 'jefferson',
    name: 'Jefferson Elementary',
    students: 1820,
    grades: 'K–5',
    color: '#0DA7BC',
  },
  { id: 'lincoln', name: 'Lincoln Elementary', students: 1650, grades: 'K–5', color: '#E8866A' },
  { id: 'kennedy', name: 'Kennedy K-8', students: 2340, grades: 'K–8', color: '#7CB5F5' },
  { id: 'roosevelt', name: 'Roosevelt Middle', students: 2100, grades: '6–8', color: '#16A97A' },
  { id: 'washington', name: 'Washington Middle', students: 1980, grades: '6–8', color: '#F0C050' },
  { id: 'adams', name: 'Adams High', students: 2510, grades: '9–12', color: '#C084FC' },
]

const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']

// ── RMI Trends (0–100) ─────────────────────────────────────────────────────
export const RMI_TRENDS = MONTHS.map((month, i) => ({
  month,
  district: [68, 69, 71, 70, 72, 74, 73, 75, 76][i],
  jefferson: [72, 73, 75, 74, 76, 78, 77, 79, 80][i],
  lincoln: [64, 65, 67, 66, 68, 69, 68, 70, 71][i],
  kennedy: [70, 71, 72, 71, 73, 75, 74, 76, 77][i],
  roosevelt: [66, 67, 69, 68, 70, 71, 72, 73, 74][i],
  washington: [61, 60, 62, 61, 62, 63, 60, 61, 62][i],
  adams: [74, 75, 77, 76, 78, 80, 81, 82, 83][i],
}))

// ── Session Length Trends (minutes, weekly) ────────────────────────────────
export const SESSION_TRENDS = MONTHS.map((month, i) => ({
  month,
  district: [14, 15, 16, 15, 17, 18, 18, 19, 20][i],
  jefferson: [16, 17, 18, 17, 19, 20, 21, 22, 22][i],
  lincoln: [12, 13, 14, 13, 15, 16, 15, 16, 17][i],
  kennedy: [14, 15, 16, 15, 17, 18, 19, 19, 20][i],
  roosevelt: [15, 16, 17, 16, 18, 19, 20, 21, 22][i],
  washington: [11, 11, 12, 11, 12, 12, 11, 12, 13][i],
  adams: [17, 18, 20, 19, 21, 23, 24, 25, 26][i],
}))

// ── Streak data: % students at each milestone ─────────────────────────────
export const STREAK_DATA = [
  {
    milestone: '1+ days',
    jefferson: 78,
    lincoln: 71,
    kennedy: 75,
    roosevelt: 72,
    washington: 63,
    adams: 81,
  },
  {
    milestone: '7+ days',
    jefferson: 54,
    lincoln: 46,
    kennedy: 51,
    roosevelt: 49,
    washington: 38,
    adams: 62,
  },
  {
    milestone: '14+ days',
    jefferson: 38,
    lincoln: 30,
    kennedy: 35,
    roosevelt: 33,
    washington: 24,
    adams: 46,
  },
  {
    milestone: '30+ days',
    jefferson: 22,
    lincoln: 17,
    kennedy: 20,
    roosevelt: 19,
    washington: 12,
    adams: 31,
  },
]

// ── Reading velocity: avg books/month ─────────────────────────────────────
export const VELOCITY_TRENDS = MONTHS.map((month, i) => ({
  month,
  elementary: [3.2, 3.4, 3.6, 3.1, 3.8, 4.0, 4.1, 4.3, 4.4][i],
  middle: [2.4, 2.5, 2.7, 2.3, 2.8, 3.0, 3.1, 3.2, 3.3][i],
  high: [1.8, 1.9, 2.1, 1.8, 2.2, 2.4, 2.5, 2.6, 2.7][i],
}))

// ── Book Talks with Benny — engagement & integrity ────────────────────────
// completionRate: % of triggered Book Talks students complete
// flagRate: % of completed talks flagged for concerning patterns (declining = good)
export const BOOK_TALKS_TRENDS = MONTHS.map((month, i) => ({
  month,
  completionRate: [71, 72, 74, 73, 75, 77, 76, 78, 79][i],
  flagRate: [16, 15, 15, 16, 14, 13, 14, 12, 11][i],
}))

// Per-school BTWB month-by-month trends (completionRate rising = good, flagRate falling = good)
export const SCHOOL_INTEGRITY_TRENDS = {
  jefferson: MONTHS.map((month, i) => ({
    month,
    completionRate: [70, 72, 74, 73, 76, 78, 79, 80, 82][i],
    flagRate: [15, 14, 14, 13, 12, 11, 10, 9, 8][i],
  })),
  lincoln: MONTHS.map((month, i) => ({
    month,
    completionRate: [76, 75, 73, 74, 73, 72, 72, 71, 71][i],
    flagRate: [12, 13, 13, 14, 15, 16, 16, 17, 18][i],
  })),
  kennedy: MONTHS.map((month, i) => ({
    month,
    completionRate: [67, 68, 70, 70, 72, 73, 74, 76, 77][i],
    flagRate: [16, 15, 15, 14, 14, 13, 12, 12, 11][i],
  })),
  roosevelt: MONTHS.map((month, i) => ({
    month,
    completionRate: [66, 67, 69, 68, 70, 71, 72, 74, 75][i],
    flagRate: [16, 15, 16, 15, 15, 14, 15, 14, 14][i],
  })),
  washington: MONTHS.map((month, i) => ({
    month,
    completionRate: [72, 70, 68, 68, 67, 66, 65, 64, 62][i],
    flagRate: [15, 16, 17, 17, 18, 19, 20, 21, 22][i],
  })),
  adams: MONTHS.map((month, i) => ({
    month,
    completionRate: [75, 77, 79, 78, 81, 83, 84, 86, 88][i],
    flagRate: [14, 13, 12, 11, 10, 9, 8, 7, 6][i],
  })),
}

// Per-school Book Talks stats (May 2025)
// trend: pp change in completionRate vs prior month (+ve = more students completing = good)
export const BOOK_TALKS_BY_SCHOOL = [
  {
    id: 'jefferson',
    name: 'Jefferson El.',
    completionRate: 82,
    flagRate: 8,
    totalTalks: 148,
    trend: +4,
  },
  {
    id: 'lincoln',
    name: 'Lincoln El.',
    completionRate: 71,
    flagRate: 18,
    totalTalks: 117,
    trend: -3,
  },
  {
    id: 'kennedy',
    name: 'Kennedy K-8',
    completionRate: 77,
    flagRate: 11,
    totalTalks: 180,
    trend: +2,
  },
  {
    id: 'roosevelt',
    name: 'Roosevelt Mid.',
    completionRate: 75,
    flagRate: 14,
    totalTalks: 157,
    trend: +1,
  },
  {
    id: 'washington',
    name: 'Washington Mid.',
    completionRate: 62,
    flagRate: 22,
    totalTalks: 123,
    trend: -6,
  },
  { id: 'adams', name: 'Adams High', completionRate: 88, flagRate: 6, totalTalks: 221, trend: +5 },
]

// District-level "schools to watch" for the district dashboard
export const SCHOOLS_TO_WATCH = [
  {
    id: 'washington',
    name: 'Washington Middle',
    grades: '6–8',
    concern: 'Engagement down 39% vs. last month — grades 7–8 flagged',
    concernType: 'critical',
    bucket: 'habits',
    health: { motivation: 62, integrity: 78, habits: 48, skills: 50 },
  },
  {
    id: 'lincoln',
    name: 'Lincoln Elementary',
    grades: 'K–5',
    concern: '6-week Lexile plateau despite 94% engagement rate',
    concernType: 'critical',
    bucket: 'skills',
    health: { motivation: 71, integrity: 86, habits: 58, skills: 42 },
  },
  {
    id: 'roosevelt',
    name: 'Roosevelt Middle',
    grades: '6–8',
    concern: 'Book Talks flag rate rising — up 4pp this month',
    concernType: 'warning',
    bucket: 'integrity',
    health: { motivation: 74, integrity: 84, habits: 72, skills: 82 },
  },
]

// District-wide engagement funnel (all 12,400 enrolled students)
export const DISTRICT_FUNNEL = [
  {
    stage: 'Enrolled Students',
    count: 12400,
    pct: 100,
    delta: null,
    note: 'Active roster in Beanstack',
  },
  {
    stage: 'Logged This Month',
    count: 9672,
    pct: 78,
    delta: +4,
    note: 'At least 1 log in May 2025',
  },
  {
    stage: 'Logged This Week',
    count: 6820,
    pct: 55,
    delta: +6,
    note: '1+ log every week for 4+ weeks',
  },
  { stage: 'Logged Yesterday', count: 3100, pct: 25, delta: +3, note: '5+ days logged per week' },
  {
    stage: 'Has A Current Streak',
    count: 1860,
    pct: 15,
    delta: +2,
    note: 'Unbroken streak ≥ 30 days',
  },
]

// ── Lexile growth per school ───────────────────────────────────────────────
export const LEXILE_DATA = [
  {
    school: 'Jefferson',
    id: 'jefferson',
    avgLexile: 680,
    lexileGrowth: 62,
    volume: 38,
    students: 1820,
    aboveExpected: true,
  },
  {
    school: 'Lincoln',
    id: 'lincoln',
    avgLexile: 620,
    lexileGrowth: -8,
    volume: 41,
    students: 1650,
    aboveExpected: false,
  },
  {
    school: 'Kennedy',
    id: 'kennedy',
    avgLexile: 740,
    lexileGrowth: 74,
    volume: 35,
    students: 2340,
    aboveExpected: true,
  },
  {
    school: 'Roosevelt',
    id: 'roosevelt',
    avgLexile: 890,
    lexileGrowth: 88,
    volume: 28,
    students: 2100,
    aboveExpected: true,
  },
  {
    school: 'Washington',
    id: 'washington',
    avgLexile: 850,
    lexileGrowth: -3,
    volume: 24,
    students: 1980,
    aboveExpected: false,
  },
  {
    school: 'Adams',
    id: 'adams',
    avgLexile: 1050,
    lexileGrowth: 112,
    volume: 22,
    students: 2510,
    aboveExpected: true,
  },
]

// ── Lexile by grade (grouped bar) ─────────────────────────────────────────
export const LEXILE_BY_GRADE = [
  { grade: '3rd', start: 420, growth: 58, expected: 50 },
  { grade: '4th', start: 510, growth: 71, expected: 55 },
  { grade: '5th', start: 620, growth: 65, expected: 55 },
  { grade: '6th', start: 720, growth: 82, expected: 60 },
  { grade: '7th', start: 830, growth: 91, expected: 60 },
  { grade: '8th', start: 920, growth: 88, expected: 65 },
  { grade: '9th', start: 980, growth: 95, expected: 65 },
  { grade: '10th', start: 1050, growth: 110, expected: 70 },
  { grade: '11th', start: 1110, growth: 118, expected: 70 },
  { grade: '12th', start: 1160, growth: 108, expected: 70 },
]

// ── School stats summary ───────────────────────────────────────────────────
export const SCHOOL_STATS = [
  {
    id: 'jefferson',
    name: 'Jefferson El.',
    avgSession: 22,
    streakPct: 54,
    rmi: 80,
    lexileGrowth: 62,
    engagement: 81,
  },
  {
    id: 'lincoln',
    name: 'Lincoln El.',
    avgSession: 17,
    streakPct: 38,
    rmi: 71,
    lexileGrowth: -8,
    engagement: 63,
  },
  {
    id: 'kennedy',
    name: 'Kennedy K-8',
    avgSession: 20,
    streakPct: 47,
    rmi: 77,
    lexileGrowth: 74,
    engagement: 72,
  },
  {
    id: 'roosevelt',
    name: 'Roosevelt Mid.',
    avgSession: 22,
    streakPct: 44,
    rmi: 74,
    lexileGrowth: 88,
    engagement: 74,
  },
  {
    id: 'washington',
    name: 'Washington Mid.',
    avgSession: 13,
    streakPct: 29,
    rmi: 62,
    lexileGrowth: -3,
    engagement: 51,
  },
  {
    id: 'adams',
    name: 'Adams High',
    avgSession: 26,
    streakPct: 63,
    rmi: 83,
    lexileGrowth: 112,
    engagement: 84,
  },
]

// ── Alerts ─────────────────────────────────────────────────────────────────
export const ALERTS = [
  {
    id: 'lincoln-lexile',
    level: 'critical',
    title: 'Lincoln Elementary',
    description: 'Stuck Lexile plateau — 6 weeks, no growth',
    detail:
      '94% engagement rate despite zero measurable Lexile progression. Likely text complexity mismatch.',
    action: 'Review curriculum materials',
    tab: 'skills',
  },
  {
    id: 'washington-engagement',
    level: 'warning',
    title: 'Washington Middle',
    description: 'Student engagement down 39% vs. last month',
    detail:
      'Drop concentrated in grades 7–8. Session lengths also declining. Early intervention recommended.',
    action: 'View reading habits',
    tab: 'habits',
  },
  {
    id: 'adams-sessions',
    level: 'positive',
    title: 'Adams High',
    description: '+65% increase in avg session length over 30 days',
    detail:
      'Students averaging 26 min/session, up from 16 min. Strongest growth in 11th grade cohort.',
    action: 'View details',
    tab: 'habits',
  },
]

// ── Per-school Lexile growth by grade (YTD, Lexile units) ─────────────────
export const SCHOOL_LEXILE_BY_GRADE = {
  jefferson: [
    { grade: '3rd', growth: 68, expected: 50 },
    { grade: '4th', growth: 78, expected: 55 },
    { grade: '5th', growth: 72, expected: 55 },
  ],
  lincoln: [
    { grade: '3rd', growth: 12, expected: 50 },
    { grade: '4th', growth: 9, expected: 55 },
    { grade: '5th', growth: 4, expected: 55 },
  ],
  kennedy: [
    { grade: '3rd', growth: 62, expected: 50 },
    { grade: '4th', growth: 74, expected: 55 },
    { grade: '5th', growth: 70, expected: 55 },
    { grade: '6th', growth: 85, expected: 60 },
    { grade: '7th', growth: 88, expected: 60 },
    { grade: '8th', growth: 82, expected: 65 },
  ],
  roosevelt: [
    { grade: '6th', growth: 88, expected: 60 },
    { grade: '7th', growth: 94, expected: 60 },
    { grade: '8th', growth: 92, expected: 65 },
  ],
  washington: [
    { grade: '6th', growth: 28, expected: 60 },
    { grade: '7th', growth: 22, expected: 60 },
    { grade: '8th', growth: 18, expected: 65 },
  ],
  adams: [
    { grade: '9th', growth: 98, expected: 65 },
    { grade: '10th', growth: 115, expected: 70 },
    { grade: '11th', growth: 122, expected: 70 },
    { grade: '12th', growth: 108, expected: 70 },
  ],
}

// ── Goal completion rate (% students meeting monthly reading goal) ─────────
export const GOALS_MET_TRENDS = MONTHS.map((month, i) => ({
  month,
  district: [58, 60, 62, 60, 64, 66, 65, 68, 70][i],
  jefferson: [64, 66, 68, 67, 70, 72, 73, 75, 76][i],
  lincoln: [52, 53, 55, 54, 56, 57, 56, 58, 59][i],
  kennedy: [60, 62, 64, 62, 65, 67, 68, 70, 71][i],
  roosevelt: [58, 60, 62, 61, 63, 65, 67, 69, 70][i],
  washington: [48, 47, 48, 46, 47, 46, 44, 43, 42][i],
  adams: [70, 72, 74, 73, 76, 79, 81, 83, 85][i],
}))

// ── School-level metadata ─────────────────────────────────────────────────
export const SCHOOL_DETAILS = {
  jefferson: { titleI: false, frl: 18, principal: 'Dr. Sarah Chen', alertIds: [] },
  lincoln: { titleI: true, frl: 61, principal: 'Mr. James Rivera', alertIds: ['lincoln-lexile'] },
  kennedy: { titleI: false, frl: 31, principal: 'Ms. Patricia Moore', alertIds: [] },
  roosevelt: { titleI: true, frl: 52, principal: 'Dr. Marcus Johnson', alertIds: [] },
  washington: {
    titleI: true,
    frl: 68,
    principal: 'Ms. Linda Torres',
    alertIds: ['washington-engagement'],
  },
  adams: { titleI: false, frl: 18, principal: 'Mr. Robert Kim', alertIds: ['adams-sessions'] },
}

// Grade-level indices into LEXILE_BY_GRADE per school
export const SCHOOL_GRADE_LEVELS = {
  jefferson: [0, 1, 2], // 3rd–5th
  lincoln: [0, 1, 2], // 3rd–5th
  kennedy: [0, 1, 2, 3, 4, 5], // 3rd–8th
  roosevelt: [3, 4, 5], // 6th–8th
  washington: [3, 4, 5], // 6th–8th
  adams: [6, 7, 8, 9], // 9th–12th
}

// ── Students to Watch (fake roster for the prototype) ─────────────────────
// Each: { id, name, grade, schoolId, concern, concernType: critical|warning|info, bucket,
//   health: { motivation, integrity, habits, skills },
//   recentLogs: [{ date, minutes, title }] }
export const STUDENTS_TO_WATCH = [
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    grade: '5th',
    schoolId: 'lincoln',
    concern: 'Lexile stuck for 4 weeks despite high engagement',
    concernType: 'critical',
    bucket: 'skills',
    health: { motivation: 78, integrity: 88, habits: 72, skills: 42 },
    recentLogs: [
      { date: 'May 15', minutes: 32, title: 'Diary of a Wimpy Kid: The Last Straw' },
      { date: 'May 14', minutes: 28, title: 'Diary of a Wimpy Kid: The Last Straw' },
      { date: 'May 13', minutes: 30, title: 'Diary of a Wimpy Kid: Dog Days' },
    ],
  },
  {
    id: 'anne-boonchuy',
    name: 'Anne Boonchuy',
    grade: '4th',
    schoolId: 'lincoln',
    concern: 'Reading streak dropped from 21 days to 0',
    concernType: 'warning',
    bucket: 'habits',
    health: { motivation: 70, integrity: 84, habits: 38, skills: 65 },
    recentLogs: [
      { date: 'May 4', minutes: 24, title: "Charlotte's Web" },
      { date: 'May 3', minutes: 30, title: "Charlotte's Web" },
    ],
  },
  {
    id: 'tyler-voss',
    name: 'Tyler Voss',
    grade: '5th',
    schoolId: 'lincoln',
    concern: '3 flagged log entries this week (gibberish titles)',
    concernType: 'critical',
    bucket: 'integrity',
    health: { motivation: 66, integrity: 51, habits: 74, skills: 60 },
    recentLogs: [
      { date: 'May 15', minutes: 90, title: 'asdfgh' },
      { date: 'May 14', minutes: 75, title: 'qwerty book' },
    ],
  },
  {
    id: 'maya-patel',
    name: 'Maya Patel',
    grade: '11th',
    schoolId: 'adams',
    concern: 'RMI dropped 12 points after winter break',
    concernType: 'warning',
    bucket: 'motivation',
    health: { motivation: 58, integrity: 86, habits: 70, skills: 78 },
    recentLogs: [
      { date: 'May 12', minutes: 25, title: 'The Great Gatsby' },
      { date: 'May 8', minutes: 20, title: 'The Great Gatsby' },
    ],
  },
  {
    id: 'jordan-kim',
    name: 'Jordan Kim',
    grade: '7th',
    schoolId: 'roosevelt',
    concern: 'No reading log in 9 days',
    concernType: 'warning',
    bucket: 'habits',
    health: { motivation: 68, integrity: 82, habits: 42, skills: 74 },
    recentLogs: [{ date: 'May 6', minutes: 22, title: 'Wonder' }],
  },
  {
    id: 'sam-rivera',
    name: 'Sam Rivera',
    grade: '3rd',
    schoolId: 'jefferson',
    concern: 'Below expected Lexile growth (+12L vs +65L)',
    concernType: 'critical',
    bucket: 'skills',
    health: { motivation: 74, integrity: 86, habits: 71, skills: 38 },
    recentLogs: [
      { date: 'May 15', minutes: 18, title: 'Junie B. Jones #4' },
      { date: 'May 14', minutes: 20, title: 'Junie B. Jones #4' },
    ],
  },
  {
    id: 'aisha-ali',
    name: 'Aisha Ali',
    grade: '8th',
    schoolId: 'washington',
    concern: 'Engagement -45% vs class avg',
    concernType: 'warning',
    bucket: 'motivation',
    health: { motivation: 45, integrity: 80, habits: 52, skills: 66 },
    recentLogs: [{ date: 'May 11', minutes: 10, title: 'The Outsiders' }],
  },
  {
    id: 'leo-tanaka',
    name: 'Leo Tanaka',
    grade: '6th',
    schoolId: 'kennedy',
    concern: 'Logging time spikes — possible padding',
    concernType: 'warning',
    bucket: 'integrity',
    health: { motivation: 72, integrity: 58, habits: 80, skills: 70 },
    recentLogs: [
      { date: 'May 15', minutes: 120, title: 'Holes' },
      { date: 'May 14', minutes: 110, title: 'Holes' },
    ],
  },
  {
    id: 'priya-shah',
    name: 'Priya Shah',
    grade: '4th',
    schoolId: 'lincoln',
    concern: 'Long streak ended at 30 days — re-engagement chance',
    concernType: 'info',
    bucket: 'habits',
    health: { motivation: 72, integrity: 88, habits: 55, skills: 68 },
    recentLogs: [
      { date: 'May 4', minutes: 22, title: 'The One and Only Ivan' },
      { date: 'May 3', minutes: 25, title: 'The One and Only Ivan' },
    ],
  },
]

// ── Reading Health rollup (mirrors student profile sections) ──────────────
// Each: { motivation, integrity, habits, skills } 0-100 + deltas (vs Sep)
export const SCHOOL_HEALTH = {
  jefferson: { motivation: 80, integrity: 91, habits: 75, skills: 71, dM: 8, dI: 5, dH: 6, dS: 8 },
  lincoln: { motivation: 71, integrity: 86, habits: 58, skills: 42, dM: 7, dI: 3, dH: 5, dS: -3 },
  kennedy: { motivation: 77, integrity: 88, habits: 70, skills: 76, dM: 7, dI: 4, dH: 7, dS: 11 },
  roosevelt: { motivation: 74, integrity: 84, habits: 72, skills: 82, dM: 8, dI: 4, dH: 8, dS: 14 },
  washington: {
    motivation: 62,
    integrity: 78,
    habits: 48,
    skills: 50,
    dM: 1,
    dI: 2,
    dH: -2,
    dS: 1,
  },
  adams: { motivation: 83, integrity: 89, habits: 88, skills: 89, dM: 9, dI: 6, dH: 10, dS: 18 },
}

export const DISTRICT_HEALTH = {
  motivation: 76,
  integrity: 86,
  habits: 72,
  skills: 75,
  dM: 8,
  dI: 5,
  dH: 6,
  dS: 11,
}

// ── RMI: the 10 motivation factors from the Reading Motivation Index ─────────
// Five intrinsic + five extrinsic, each scored 1–4 in the student assessment.
// School-level values = avg across all students who completed the RMI this year.
export const RMI_FACTORS = [
  // Intrinsic
  {
    name: 'Enjoyment',
    iconKey: 'enjoyment',
    kind: 'intrinsic',
    score: 3.1,
    max: 4,
    delta: 0.2,
    color: '#E8866A',
    desc: 'Reading for personal pleasure and fun',
  },
  {
    name: 'Curiosity',
    iconKey: 'curiosity',
    kind: 'intrinsic',
    score: 2.9,
    max: 4,
    delta: 0.3,
    color: '#F0A060',
    desc: 'Reading to explore topics and answer questions',
  },
  {
    name: 'Importance',
    iconKey: 'importance',
    kind: 'intrinsic',
    score: 2.8,
    max: 4,
    delta: 0.2,
    color: '#F0C050',
    desc: 'Valuing reading as meaningful and worthwhile',
  },
  {
    name: 'Confidence',
    iconKey: 'confidence',
    kind: 'intrinsic',
    score: 2.6,
    max: 4,
    delta: 0.1,
    color: '#16A97A',
    desc: 'Belief in oneself as a capable reader',
  },
  {
    name: 'Challenge',
    iconKey: 'challenge',
    kind: 'intrinsic',
    score: 2.4,
    max: 4,
    delta: 0.1,
    color: '#0DA7BC',
    desc: 'Seeking complex or difficult texts',
  },
  // Extrinsic
  {
    name: 'Social Connection',
    iconKey: 'social',
    kind: 'extrinsic',
    score: 2.5,
    max: 4,
    delta: 0.3,
    color: '#7CB5F5',
    desc: 'Reading to share and discuss with others',
  },
  {
    name: 'Recognition',
    iconKey: 'recognition',
    kind: 'extrinsic',
    score: 2.3,
    max: 4,
    delta: 0.1,
    color: '#C084FC',
    desc: 'Reading to receive praise or acknowledgment',
  },
  {
    name: 'Grades',
    iconKey: 'grades',
    kind: 'extrinsic',
    score: 2.4,
    max: 4,
    delta: 0.0,
    color: '#94A3B8',
    desc: 'Reading for academic performance',
  },
  {
    name: 'Competition',
    iconKey: 'competition',
    kind: 'extrinsic',
    score: 2.0,
    max: 4,
    delta: -0.1,
    color: '#CBD5E1',
    desc: 'Reading to outperform or beat peers',
  },
  {
    name: 'Compliance',
    iconKey: 'compliance',
    kind: 'extrinsic',
    score: 1.8,
    max: 4,
    delta: -0.2,
    color: '#E2E8F0',
    desc: 'Reading because required by teacher or parent',
  },
]

// Intrinsic subscore = sum of 5 intrinsic factors (max 20)
// Extrinsic subscore = sum of 5 extrinsic factors (max 20)
// Monthly trend of avg subscores across school
export const INTRINSIC_EXTRINSIC_TRENDS = MONTHS.map((month, i) => ({
  month,
  intrinsic: [12.1, 12.4, 12.8, 12.6, 13.1, 13.5, 13.7, 14.0, 14.2][i],
  extrinsic: [11.4, 11.5, 11.6, 11.5, 11.6, 11.7, 11.6, 11.7, 11.8][i],
}))

// Avg intrinsic subscores by grade band (out of 20)
// Pattern: intrinsic rises with age; extrinsic driven by Grades/Recognition in middle grades
export const MOTIVATION_BY_GRADE = [
  { band: 'K–2', intrinsic: 11.2, extrinsic: 12.1, topFactor: 'Enjoyment' },
  { band: '3–5', intrinsic: 13.0, extrinsic: 11.8, topFactor: 'Enjoyment' },
  { band: '6–8', intrinsic: 13.8, extrinsic: 12.4, topFactor: 'Curiosity' },
  { band: '9–12', intrinsic: 15.1, extrinsic: 11.2, topFactor: 'Challenge' },
]

// Behavioral signals from reading logs that proxy specific RMI intrinsic factors
export const MOTIVATION_SIGNALS = [
  { signal: 'Logged when no challenge active', factor: 'Enjoyment', pct: 31, delta: 4 },
  { signal: 'Self-selected book', factor: 'Curiosity', pct: 44, delta: 7 },
  { signal: 'Exceeded minimum log time', factor: 'Challenge', pct: 58, delta: 5 },
  { signal: 'New book started within 48h', factor: 'Curiosity', pct: 22, delta: 3 },
  { signal: 'Re-read a previously logged book', factor: 'Enjoyment', pct: 18, delta: 2 },
  { signal: 'Logged on a weekend or holiday', factor: 'Enjoyment', pct: 41, delta: 6 },
  { signal: 'Finished a book above grade band', factor: 'Challenge', pct: 27, delta: 4 },
  { signal: 'Tried a new genre this month', factor: 'Curiosity', pct: 35, delta: 5 },
  { signal: 'Logged 3+ sessions in one day', factor: 'Enjoyment', pct: 14, delta: -1 },
  { signal: 'Maintained streak ≥ 14 days', factor: 'Challenge', pct: 24, delta: 3 },
]

// ── Engagement funnel ─────────────────────────────────────────────────────
export const ENGAGEMENT_FUNNEL = [
  {
    stage: 'Enrolled Students',
    count: 2510,
    pct: 100,
    delta: null,
    note: 'Active roster in Beanstack',
  },
  {
    stage: 'Logged This Month',
    count: 1958,
    pct: 78,
    delta: +4,
    note: 'At least 1 log in May 2025',
  },
  {
    stage: 'Logged This Week',
    count: 1382,
    pct: 55,
    delta: +6,
    note: '1+ log every week for 4+ weeks',
  },
  { stage: 'Logged Yesterday', count: 628, pct: 25, delta: +3, note: '5+ days logged per week' },
  {
    stage: 'Has A Current Streak',
    count: 377,
    pct: 15,
    delta: +2,
    note: 'Unbroken streak ≥ 30 days',
  },
]

// ── Grade-level performance (RMI total 0–40 + engagement %) ───────────────
export const GRADE_PERFORMANCE = [
  { grade: 'K', rmiTotal: 19.5, engagement: 76, count: 980 },
  { grade: '1', rmiTotal: 20.5, engagement: 79, count: 1020 },
  { grade: '2', rmiTotal: 21.0, engagement: 78, count: 1050 },
  { grade: '3', rmiTotal: 21.5, engagement: 77, count: 1100 },
  { grade: '4', rmiTotal: 22.5, engagement: 76, count: 1080 },
  { grade: '5', rmiTotal: 22.0, engagement: 74, count: 1060 },
  { grade: '6', rmiTotal: 21.0, engagement: 71, count: 1120 },
  { grade: '7', rmiTotal: 20.0, engagement: 68, count: 1180 },
  { grade: '8', rmiTotal: 20.5, engagement: 69, count: 1200 },
  { grade: '9', rmiTotal: 21.0, engagement: 70, count: 1180 },
  { grade: '10', rmiTotal: 22.0, engagement: 73, count: 1140 },
  { grade: '11', rmiTotal: 22.5, engagement: 75, count: 1090 },
  { grade: '12', rmiTotal: 21.5, engagement: 71, count: 1200 },
]

// ── Future state: Reading diet mock data ──────────────────────────────────
export const READING_DIET = [
  { genre: 'Sci-Fi & Fantasy', pct: 28, color: '#7C3AED' },
  { genre: 'Sports & Adventure', pct: 19, color: '#0DA7BC' },
  { genre: 'Realistic Fiction', pct: 17, color: '#16A97A' },
  { genre: 'Graphic & Manga', pct: 14, color: '#E8866A' },
  { genre: 'Mystery & Thriller', pct: 11, color: '#F0C050' },
  { genre: 'Other', pct: 11, color: '#CBD5E1' },
]

// ── Future state: ROI correlations ────────────────────────────────────────
export const ROI_TRENDS = MONTHS.map((month, i) => ({
  month,
  engagement: [68, 69, 71, 70, 72, 74, 73, 75, 76][i],
  attendance: [92, 92, 93, 92, 93, 94, 94, 95, 95][i],
  incidents: [38, 36, 34, 35, 32, 30, 29, 27, 26][i],
}))

// ═══════════════════════════════════════════════════════════════════════════
// RIS DISTRICT v2 — workable-data metrics (no 1–100 "health score")
// The district view leans on metrics we can actually compute today: the RMI
// total (sum of the 10 factors, 0–40), logging counts, flag rates over all
// logs, and Lexile deltas. The 0–100 SCHOOL_HEALTH / DISTRICT_HEALTH rollups
// above are kept only for the Analytics & Demographics surfaces.
// ═══════════════════════════════════════════════════════════════════════════

// Map a 0–100 RMI index onto the RMI total scale (sum of 10 factors, max 40).
// Lands the district in the low-20s and spreads schools ~15–25.
const toRmiTotal = (v) => Math.max(0, +(v * 0.5 - 16).toFixed(1))

// Per-school + district RMI total trend (0–40 scale) — derived from RMI_TRENDS
export const RMI_TOTAL_TRENDS = RMI_TRENDS.map((row) => {
  const out = { month: row.month }
  for (const key of Object.keys(row)) {
    if (key !== 'month') out[key] = toRmiTotal(row[key])
  }
  return out
})

const LATEST_RMI = RMI_TOTAL_TRENDS[RMI_TOTAL_TRENDS.length - 1]
const PREV_RMI = RMI_TOTAL_TRENDS[RMI_TOTAL_TRENDS.length - 2]

// Current district RMI total + change vs. the previous month
export const DISTRICT_RMI = {
  value: LATEST_RMI.district,
  prev: PREV_RMI.district,
  delta: +(LATEST_RMI.district - PREV_RMI.district).toFixed(1),
}

// Per-school RMI total (current month) for the ranked bar + high/low stats
export const RMI_TOTAL_BY_SCHOOL = SCHOOLS.map((s) => ({
  id: s.id,
  name: s.name,
  shortName: s.name.split(' ')[0],
  color: s.color,
  rmi: LATEST_RMI[s.id],
})).sort((a, b) => b.rmi - a.rmi)

// RMI total by grade band (0–40) — preferred over per-school for big districts
export const RMI_TOTAL_BAND_TRENDS = MONTHS.map((month, i) => ({
  month,
  'K–2': [17.5, 17.8, 18.4, 18.1, 18.9, 19.4, 19.2, 19.8, 20.1][i],
  '3–5': [18.2, 18.6, 19.2, 18.9, 19.8, 20.4, 20.2, 20.9, 21.3][i],
  '6–8': [16.8, 17.0, 17.6, 17.3, 18.0, 18.6, 18.3, 18.9, 19.2][i],
  '9–12': [19.5, 19.9, 20.6, 20.2, 21.2, 22.0, 22.4, 23.1, 23.6][i],
}))

export const RMI_GRADE_BANDS = [
  { key: 'K–2', color: '#7CB5F5' },
  { key: '3–5', color: '#16A97A' },
  { key: '6–8', color: '#F0C050' },
  { key: '9–12', color: '#C084FC' },
]

// Example demographic cut — RMI total broken out by gender (one illustrative slice)
export const MOTIVATION_BY_GENDER = [
  { gender: 'Female', rmi: 22.4, intrinsic: 14.6, extrinsic: 11.6, topFactor: 'Enjoyment' },
  { gender: 'Male', rmi: 20.1, intrinsic: 12.8, extrinsic: 11.9, topFactor: 'Competition' },
  {
    gender: 'Non-binary / other',
    rmi: 21.3,
    intrinsic: 13.9,
    extrinsic: 11.4,
    topFactor: 'Curiosity',
  },
]

// Habits — readers who logged this week (of all 12,400 enrolled)
export const READERS_THIS_WEEK = { count: 5332, pct: 43, prevCount: 4960, prevPct: 40 }

// % of students who grew their reading streak this week (replaces "active streaks")
export const STREAK_GREW_PCT = 41

// Avg session length (min) by grade band — district-wide, weekly
export const SESSION_BAND_TRENDS = MONTHS.map((month, i) => ({
  month,
  elementary: [15, 16, 17, 16, 18, 19, 20, 21, 21][i],
  middle: [13, 14, 15, 14, 16, 17, 17, 18, 19][i],
  high: [17, 18, 20, 19, 21, 23, 24, 25, 26][i],
}))

export const SESSION_BANDS = [
  { key: 'elementary', label: 'Elementary', color: '#0DA7BC' },
  { key: 'middle', label: 'Middle', color: '#16A97A' },
  { key: 'high', label: 'High', color: '#C084FC' },
]

// Integrity — % of ALL logged sessions flagged this week (not just Book Talks)
export const FLAGGED_LOGS = { pct: 2.1, prevPct: 2.4, delta: -0.3 }

// Skills — recent (weekly) Lexile movement for the district
export const LEXILE_WEEK = { growth: 12, thisWeek: 1018, lastWeek: 1006 }
