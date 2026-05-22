// ─── Fixed top banners (admin-defined, not user-editable) ─────────────────────
export const NOTIFICATIONS = [
  {
    id: "n-maint",
    tone: "warn",
    title: "Server Maintenance",
    body: "Beanstack will be unavailable between 11:00 PM and 1:00 AM ET on Saturday, Aug 17 for scheduled maintenance.",
    action: null,
  },
  {
    id: "n-webinar",
    tone: "info",
    title: "[Webinar] What's New for Back to School",
    body:
      "Discover the latest Beanstack features—Book Talks with Benny, daily reading tracking, rewards, editable badges & more! Join us Aug 12 at 2 PM ET and get ready to supercharge student engagement this year!",
    action: "Register here",
  },
];

// ─── Fixed right rail — Goal options (community vs district) ─────────────────
export const GOAL_OPTIONS = {
  community: {
    name: "Community Goal",
    description: "Aggregated reading minutes from all Beanstack users.",
    value: 102162237,
    goal: 500000000,
    unit: "minutes",
  },
  district: {
    name: "District Goal",
    description: "Your district's reading minutes year-to-date.",
    value: 4827102,
    goal: 10000000,
    unit: "minutes",
  },
};

// Back-compat alias for components still importing COMMUNITY_GOAL
export const COMMUNITY_GOAL = GOAL_OPTIONS.community;

// ─── Fixed top — feature announcement bar ─────────────────────────────────────
export const FEATURE_BAR = {
  badge: "New",
  title: "Daily Reading Tracker is now available",
  body: "See per-student weekly progress at a glance and spot gaps before they grow.",
  cta: "Take a tour",
  href: "#",
};

// ─── Engagement tracker (variants per role) ───────────────────────────────────
export const ENGAGEMENT = {
  teacher: {
    title: "Teacher Engagement",
    label: "Active Students",
    active: 12,
    threshold: 10,
    segments: [
      { until: 3,  color: "red"    },
      { until: 9,  color: "yellow" },
      { until: 99, color: "green"  },
    ],
    message:
      "Congratulations! 10 of your students have logged. Get your 3 free Benny plushies!",
    cta: "Redeem",
  },
  media: {
    title: "Media Specialist Engagement",
    label: "Active Classes",
    active: 7,
    threshold: 10,
    segments: [
      { until: 3,  color: "red"    },
      { until: 9,  color: "yellow" },
      { until: 99, color: "green"  },
    ],
    message:
      "Encourage 3 more classes to log to earn a Beanstack swag bundle for your library!",
    cta: "Learn more",
  },
};

// ─── Fixed right rail — What's New cards ──────────────────────────────────────
export const WHATS_NEW = [
  {
    id: "wn1",
    category: "Product News",
    title: "(Re)Introducing the Reading Culture Awards",
    cta: "Read Article",
    href: "#",
    kind: "badges",
  },
  {
    id: "wn2",
    category: "Event",
    title: "Beanstack EDU: How to Train (and Engage!) Your Teachers",
    cta: "View Event",
    href: "#",
    kind: "event",
    date: { month: "AUG", day: "8" },
  },
];

// ─── Big number stat tiles ────────────────────────────────────────────────────
// `roles` (optional) limits which roles see a given tile. Tiles without
// `roles` are shown to everyone. Staff-related tiles only appear for
// the Media Specialist role.
export const STAT_TILES = [
  { id: "minutes",      label: "Minutes",            value: "3,252",   color: "red",    icon: "ti-clock" },
  { id: "active",       label: "Active Readers",     value: "1",       color: "yellow", icon: "ti-user" },
  { id: "avgLevel",     label: "Average Title Level",value: "665L",    color: "green",  icon: "ti-user" },
  { id: "staffMinutes", label: "Staff Minutes",      value: "1,348",   color: "red",    icon: "ti-clock", roles: ["media"] },
  { id: "activeStaff",  label: "Active Staff",       value: "142",     color: "yellow", icon: "ti-user",  roles: ["media"] },
];

// ─── Goal tracker (kept for the Community Goal in the sidebar) ────────────────
export const GOALS = [
  { id: "g1", value: 607162237, goal: 500000000, label: "minutes", complete: true },
  { id: "g2", value: 102162237, goal: 500000000, label: "minutes", complete: false },
];

// ─── Daily reading tracker ────────────────────────────────────────────────────
// Per-student table (mirrors the Student Profile AdminMockup class view):
// each row is a student with a per-student goal, a weekly average percent,
// and seven day cells. Day cells encode "met" (true → green check),
// "partial" (numeric percent → colored pill), or "no log" (null → dash).
export const DAILY_TRACKER = {
  range: "5/11 – 5/17 (This Week)",
  days: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
  classAverage: { avg: 67, days: [null, "58%", "50%", "33%", "67%", "24%", null] },
  rows: [
    { id: 1, rank: 1, name: "Marcus Chen",   goal: "30m", avg: 98, ac: "blue",
      days: [true,  true,  true,  true,  true,  null,  null] },
    { id: 2, rank: 2, name: "Anne Boonchuy", goal: "20m", avg: 73, ac: "blue",
      days: [null,  true,  true,  null,  true,  "24%", null] },
    { id: 3, rank: 3, name: "Tyler Voss",    goal: "15m", avg: 31, ac: "red",
      days: [null,  "18%", null,  null,  null,  null,  null] },
  ],
};

// ─── Leaderboards ─────────────────────────────────────────────────────────────
export const LEADERBOARDS = {
  students: [
    { id: 1,  name: "Lisandro Matos",      value: "250 Minutes" },
    { id: 2,  name: "Chinaza Akachi",      value: "212 Minutes" },
    { id: 3,  name: "Ngô Hải Giang",        value: "189 Minutes" },
    { id: 4,  name: "Abbie Wilson",        value: "177 Minutes" },
    { id: 5,  name: "Svyatoslav Taushev",  value: "152 Minutes" },
    { id: 6,  name: "Marcus Chen",         value: "144 Minutes" },
    { id: 7,  name: "Anne Boonchuy",       value: "138 Minutes" },
    { id: 8,  name: "Priya Raman",         value: "127 Minutes" },
    { id: 9,  name: "Jamal Washington",    value: "119 Minutes" },
    { id: 10, name: "Sofia Reyes",         value: "112 Minutes" },
    { id: 11, name: "Hiroshi Tanaka",      value: "108 Minutes" },
    { id: 12, name: "Layla Mansour",       value: "97 Minutes" },
    { id: 13, name: "Tyler Voss",          value: "91 Minutes" },
    { id: 14, name: "Aria Patel",          value: "84 Minutes" },
    { id: 15, name: "Diego Hernandez",     value: "78 Minutes" },
    { id: 16, name: "Mei Lin",             value: "72 Minutes" },
    { id: 17, name: "Kofi Adjei",          value: "65 Minutes" },
    { id: 18, name: "Zoë Becker",          value: "59 Minutes" },
  ],
  classes: [
    { id: 1,  name: "Class E · Grade 5", value: "3,948 Minutes" },
    { id: 2,  name: "Class A · Grade 3", value: "3,510 Minutes" },
    { id: 3,  name: "Class G · Grade 4", value: "2,068 Minutes" },
    { id: 4,  name: "Class D · Grade 4", value: "1,676 Minutes" },
    { id: 5,  name: "Class B · Grade 3", value: "1,554 Minutes" },
    { id: 6,  name: "Class C · Grade 3", value: "1,402 Minutes" },
    { id: 7,  name: "Class F · Grade 5", value: "1,318 Minutes" },
    { id: 8,  name: "Class H · Grade 4", value: "1,247 Minutes" },
    { id: 9,  name: "Class I · Grade 5", value: "1,180 Minutes" },
    { id: 10, name: "Class J · Grade 2", value: "1,095 Minutes" },
    { id: 11, name: "Class K · Grade 2", value: "1,012 Minutes" },
    { id: 12, name: "Class L · Grade 5", value: "967 Minutes" },
    { id: 13, name: "Class M · Grade 4", value: "892 Minutes" },
    { id: 14, name: "Class N · Grade 3", value: "830 Minutes" },
    { id: 15, name: "Class O · Grade 2", value: "771 Minutes" },
    { id: 16, name: "Class P · Grade 1", value: "702 Minutes" },
  ],
  staff: [
    { id: 1,  name: "Luz Noceda",        value: "127 Minutes" },
    { id: 2,  name: "Amity Blight",      value: "114 Minutes" },
    { id: 3,  name: "Ellen Gren",        value: "90 Minutes" },
    { id: 4,  name: "Greg Eddie",        value: "85 Minutes" },
    { id: 5,  name: "Moa Hammar",        value: "81 Minutes" },
    { id: 6,  name: "Tessa Reilly",      value: "78 Minutes" },
    { id: 7,  name: "Marcus Vandell",    value: "74 Minutes" },
    { id: 8,  name: "Naomi Trent",       value: "69 Minutes" },
    { id: 9,  name: "Hank Beaumont",     value: "64 Minutes" },
    { id: 10, name: "Priya Sandhu",      value: "60 Minutes" },
    { id: 11, name: "Roan Calloway",     value: "55 Minutes" },
    { id: 12, name: "Imogen Pearce",     value: "51 Minutes" },
    { id: 13, name: "Devon Ashcroft",    value: "47 Minutes" },
    { id: 14, name: "Felipe Cardoso",    value: "42 Minutes" },
    { id: 15, name: "Saskia Holm",       value: "38 Minutes" },
    { id: 16, name: "Yusuf Mahmoud",     value: "33 Minutes" },
  ],
};

// ─── Dashboard quick links ────────────────────────────────────────────────────
// `icon` is one of the keys in LINK_ICONS (rendered as a stroked SVG in
// widgets.jsx). `color` keys into .adm-link--<color> pill backgrounds.
export const LINKS = [
  { id: "l1", label: "View Classes",        color: "red",    icon: "classes" },
  { id: "l2", label: "View Leaderboards",   color: "yellow", icon: "trophy" },
  { id: "l3", label: "View Flagged Entries",color: "blue",   icon: "flag" },
  { id: "l4", label: "Manage Goals",        color: "green",  icon: "target" },
  { id: "l5", label: "Reading Reports",     color: "purple", icon: "chart" },
  { id: "l6", label: "Roster Students",     color: "pink",   icon: "clipboard" },
];

// ─── Quick-question library ──────────────────────────────────────────────────
// All available; widget settings choose which subset to display.
export const QUESTIONS = [
  { id: "q1", icon: "clock",    text: "Which students have the most minutes read?" },
  { id: "q2", icon: "calendar", text: "Which students logged every day last week?" },
  { id: "q3", icon: "check",    text: "Which students have recently logged a book as completed?" },
  { id: "q4", icon: "target",   text: "Which classes are on track to hit their goal?" },
  { id: "q5", icon: "book",     text: "What's the average book level across grades?" },
  { id: "q6", icon: "warning",  text: "Who hasn't logged in 7+ days?" },
  { id: "q7", icon: "trending", text: "Which titles are most-read this month?" },
  { id: "q8", icon: "people",   text: "How many staff have reviewed BTWB this week?" },
];

// ─── Required widgets (inside the editable grid) ──────────────────────────────
// Reserved for widgets that admin pins inside the user-editable region. Empty
// for now — the truly fixed content (top banners, right rail) lives outside the
// grid entirely.
export const REQUIRED_WIDGETS = {};

// ─── Default layout (react-grid-layout format) ────────────────────────────────
// Editable area starts empty — user adds from the Add Widget panel or picks a
// preset from the Templates panel.
export const DEFAULT_LAYOUT = [];

// ─── Layout presets ───────────────────────────────────────────────────────────
// Each preset defines a starting layout + optional per-widget settings.
// Five templates: Blank · School Overview · Reports & Analytics · Demographics
// · Rostering Data. Picking one replaces the current layout.
export const LAYOUT_PRESETS = [
  {
    id: "blank",
    name: "Blank",
    description: "Start from scratch and add widgets one at a time.",
    widgetNames: [],
    roles: ["teacher", "media"],
    layout: [],
    settings: {},
  },
  {
    id: "school-overview",
    name: "School Overview",
    description: "High-level engagement for the whole school — top metrics, daily reading, and class standings.",
    widgetNames: ["What's Happened", "Daily Reading Tracker", "Classes"],
    roles: ["teacher", "media"],
    layout: [
      { i: "stat-tiles",          x: 0, y: 0,  w: 12, h: 8,  minW: 6, minH: 4 },
      { i: "daily-tracker",       x: 0, y: 8,  w: 12, h: 20, minW: 5, minH: 6 },
      { i: "leaderboard-classes", x: 0, y: 28, w: 12, h: 34, minW: 3, minH: 10 },
    ],
    settings: {
      "leaderboard-classes": { sort: "active-desc", range: "week", limit: "15" },
    },
  },
  {
    id: "reports",
    name: "Reports & Analytics",
    description: "Data-heavy view with stat tiles, suggested questions, and weekly reading patterns.",
    widgetNames: ["What's Happened", "Number Cruncher", "Daily Reading Tracker"],
    roles: ["teacher", "media"],
    layout: [
      { i: "stat-tiles",    x: 0, y: 0,  w: 12, h: 8,  minW: 6, minH: 4 },
      { i: "questions",     x: 0, y: 8,  w: 12, h: 8,  minW: 6, minH: 4 },
      { i: "daily-tracker", x: 0, y: 16, w: 12, h: 20, minW: 5, minH: 6 },
    ],
    settings: {
      "questions": { selected: ["q1","q2","q3","q4","q5","q6"] },
    },
  },
  {
    id: "demographics",
    name: "Demographics",
    description: "Snapshot of who's reading — average title level, active readers, and how students compare.",
    widgetNames: ["What's Happened", "Number Cruncher", "Students"],
    roles: ["teacher", "media"],
    layout: [
      { i: "stat-tiles",           x: 0, y: 0,  w: 12, h: 8, minW: 6, minH: 4 },
      { i: "questions",            x: 0, y: 8,  w: 12, h: 8, minW: 6, minH: 4 },
      { i: "leaderboard-students", x: 0, y: 16, w: 12, h: 34, minW: 3, minH: 10 },
    ],
    settings: {
      "stat-tiles":                { selected: ["active", "avgLevel"] },
      "questions":                 { selected: ["q5", "q7", "q1", "q3"] },
      "leaderboard-students":      { sort: "alpha", range: "year", limit: "15" },
    },
  },
  {
    id: "rostering",
    name: "Rostering Data",
    description: "Side-by-side rosters for quick reference — students, classes, and (for media specialists) staff.",
    widgetNames: ["Students", "Classes", "Staff"],
    roles: ["teacher", "media"],
    layout: [
      { i: "leaderboard-students", x: 0, y: 0,  w: 6, h: 34, minW: 3, minH: 10 },
      { i: "leaderboard-classes",  x: 6, y: 0,  w: 6, h: 34, minW: 3, minH: 10 },
      { i: "leaderboard-staff",    x: 0, y: 34, w: 12, h: 34, minW: 3, minH: 10 },
    ],
    settings: {
      "leaderboard-students": { sort: "alpha", range: "week", limit: "15" },
      "leaderboard-classes":  { sort: "alpha", range: "week", limit: "15" },
      "leaderboard-staff":    { sort: "alpha", range: "week", limit: "15" },
    },
  },
];
