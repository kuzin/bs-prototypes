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

// ─── Engagement (RCA levels) ─────────────────────────────────────────────────
// Reading Culture Awards has 4 named levels; current school engagement places
// the school in one of them. Widget shows current %, current level, next-level
// threshold, and a 4-segment progress bar with a caret over the active segment.
export const ENGAGEMENT = {
  current: 45, // % engagement
  label: "Engagement",
  levels: [
    { id: "spark",       name: "Spark",       color: "orange", min: 0  },
    { id: "igniter",     name: "Igniter",     color: "green",  min: 25 },
    { id: "pathfinder",  name: "Pathfinder",  color: "blue",   min: 50 },
    { id: "trailblazer", name: "Trailblazer", color: "purple", min: 75 },
  ],
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
  { id: "minutes",      label: "Minutes",            value: "3,252",   color: "red",    icon: "clock"  },
  { id: "active",       label: "Active Readers",     value: "1",       color: "yellow", icon: "user"   },
  { id: "avgLevel",     label: "Average Title Level",value: "665L",    color: "green",  icon: "book"   },
  { id: "staffMinutes", label: "Staff Minutes",      value: "1,348",   color: "red",    icon: "timer",  roles: ["media"] },
  { id: "activeStaff",  label: "Active Staff",       value: "142",     color: "yellow", icon: "people", roles: ["media"] },
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
// Labels are verbs ("Recognize…", "Review…") so each link reads as something
// the user can do, not a place to browse. `icon` is one of the keys in
// LINK_ICONS in widgets.jsx; `color` keys into .adm-link--<color>.
export const LINKS = [
  { id: "l1", label: "Recognize top readers",   color: "yellow", icon: "trophy" },
  { id: "l2", label: "Review flagged sessions", color: "blue",   icon: "flag" },
  { id: "l3", label: "See Lexile Insights",     color: "purple", icon: "lexile" },
  { id: "l4", label: "Distribute rewards",      color: "pink",   icon: "reward" },
  { id: "l5", label: "Update reading goal",     color: "green",  icon: "target" },
  { id: "l6", label: "Find a class or reader",  color: "red",    icon: "classes" },
];

// ─── Action row (admin-controlled, sits above the editable grid) ──────────────
// Each entry is a key action from the brief. `roles` filters which roles see
// it. `attention` is an optional badge count (rendered as a small chip).
export const ACTIONS = [
  { id: "a-flags",     title: "Review flagged sessions", subtitle: "3 sessions need a teacher's eyes", icon: "flag",      attention: 3,  cta: "Review",   roles: ["teacher", "media"] },
  { id: "a-rewards",   title: "Distribute rewards",      subtitle: "12 students newly earned a reward", icon: "reward",   attention: 12, cta: "Distribute", roles: ["media"] },
  { id: "a-challenge", title: "Create a challenge",      subtitle: "Pick a template or build your own",  icon: "trophy",  cta: "Start",    roles: ["teacher", "media"] },
  { id: "a-bnc",       title: "Run BNC",                 subtitle: "Weekly nudge to capture rewards data", icon: "chart",   cta: "Open BNC", roles: ["media"] },
  { id: "a-lexile",    title: "Explore Lexile Insights", subtitle: "See where readers are growing",      icon: "lexile",  cta: "Open",     roles: ["teacher", "media"] },
];

// ─── Admin condition flags — drive contextual CTAs in the action row ──────────
// These would come from the backend in prod. The action row reads them and
// surfaces a CTA tile when a condition is unmet (no live goal, no challenges).
export const ADMIN_STATE = {
  goalUpdatedMonthsAgo: 14, // > 12 → show "Set a goal" CTA
  liveChallengeCount: 0,    // 0    → show "Turn on auto-publish" CTA
};

// Max tiles shown in the action row (combined: conditional + role), per role.
// Media specialists already have a denser dashboard, so we keep their row
// tighter than the teacher view.
export const ACTION_ROW_CAP = { teacher: 4, media: 3 };

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
// New users land on the "Engagement health" template instead of an empty
// canvas, so they see a representative arrangement of widgets immediately.
// Community Goal starts in district scope (set centrally — read-only for the
// user). See DEFAULT_PRESET_ID + DEFAULT_SETTINGS below.
export const DEFAULT_PRESET_ID = "engagement-health";
export const DEFAULT_LAYOUT = [
  { i: "engagement",     x: 0, y: 0,  w: 4,  h: 10, minW: 4, minH: 6  },
  { i: "community-goal", x: 4, y: 0,  w: 4,  h: 10, minW: 4, minH: 4  },
  { i: "stat-tiles",     x: 0, y: 10, w: 12, h: 8,  minW: 4, minH: 4  },
  { i: "daily-tracker",  x: 0, y: 18, w: 12, h: 20, minW: 4, minH: 6  },
];
export const DEFAULT_SETTINGS = {
  "community-goal": { scope: "district" },
};

// ─── Layout presets ───────────────────────────────────────────────────────────
// Templates are organized by INTENT (what I'm trying to do) rather than by
// data shape. Picking one replaces the editable grid's layout + settings.
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
    id: "run-classroom",
    name: "Run my classroom",
    description: "Daily Reading Tracker up top, with shortcuts and a student roster for quick lookups.",
    widgetNames: ["Daily Reading Tracker", "Quick Links", "Students"],
    roles: ["teacher", "media"],
    layout: [
      { i: "daily-tracker",        x: 0, y: 0,   w: 12, h: 20, minW: 4, minH: 6 },
      { i: "quick-links",          x: 0, y: 20,  w: 12, h: 14, minW: 4, minH: 14 },
      { i: "leaderboard-students", x: 0, y: 28,  w: 12, h: 34, minW: 4, minH: 10 },
    ],
    settings: {},
  },
  {
    id: "manage-rewards",
    name: "Manage rewards & recognition",
    description: "Surface who's earning, who's ready for a reward, and shortcuts to distribute.",
    widgetNames: ["Students", "Classes", "Quick Links"],
    roles: ["teacher", "media"],
    layout: [
      { i: "leaderboard-students", x: 0, y: 0,   w: 4,  h: 34, minW: 4, minH: 10 },
      { i: "leaderboard-classes",  x: 4, y: 0,   w: 8,  h: 34, minW: 4, minH: 10 },
      { i: "quick-links",          x: 0, y: 34,  w: 12, h: 14, minW: 4, minH: 14 },
    ],
    settings: {
      "leaderboard-students": { sort: "active-desc", range: "week", limit: "15" },
      "leaderboard-classes":  { sort: "active-desc", range: "week", limit: "15" },
    },
  },
  {
    id: "engagement-health",
    name: "Engagement health",
    description: "Spot quiet readers and stalled classes — engagement, the community goal, and weekly tracking.",
    widgetNames: ["Engagement", "Community Goal", "What's Happened", "Daily Reading Tracker"],
    roles: ["teacher", "media"],
    layout: [
      { i: "engagement",     x: 0, y: 0,  w: 4,  h: 10, minW: 4, minH: 6 },
      { i: "community-goal", x: 4, y: 0,  w: 4,  h: 10, minW: 4, minH: 4 },
      { i: "stat-tiles",     x: 0, y: 10, w: 12, h: 8,  minW: 4, minH: 4 },
      { i: "daily-tracker",  x: 0, y: 18, w: 12, h: 20, minW: 4, minH: 6 },
    ],
    settings: {},
  },
  {
    id: "explore-data",
    name: "Explore the data",
    description: "Number Cruncher, stat tiles, and rosters for ad-hoc questions and digging in.",
    widgetNames: ["Number Cruncher", "What's Happened", "Students"],
    roles: ["teacher", "media"],
    layout: [
      { i: "questions",            x: 0, y: 0,  w: 12, h: 14, minW: 4, minH: 14 },
      { i: "stat-tiles",           x: 0, y: 8,  w: 12, h: 8,  minW: 4, minH: 4 },
      { i: "leaderboard-students", x: 0, y: 16, w: 12, h: 34, minW: 4, minH: 10 },
    ],
    settings: {
      "questions": { selected: ["q1","q2","q3","q4","q5","q6"] },
    },
  },
];
