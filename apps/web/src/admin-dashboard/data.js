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
    action: "Register Here",
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
  cta: "Take a Tour",
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
// the Media Specialist role. `hint` (optional) labels where the tile links —
// shown as a small "→ destination" caption and makes the tile clickable.
export const STAT_TILES = [
  { id: "minutes",        label: "Minutes",             value: "3,252", color: "red",    icon: "clock",    hint: "Insights" },
  { id: "active",         label: "Active Readers",      value: "1,204", color: "yellow", icon: "user",     hint: "Insights" },
  { id: "lexileAvg",      label: "Lexile Average",      value: "740L",  color: "purple", icon: "book",     hint: "Lexile Insights", roles: ["teacher", "media"] },
  { id: "loggedEveryDay", label: "Logged Every Day",    value: "38",    color: "green",  icon: "calendar", hint: "BNC" },
  { id: "avgLevel",       label: "Average Title Level", value: "665L",  color: "green",  icon: "book",     hint: "Lexile Insights", roles: ["teacher", "media"] },
  { id: "staffMinutes",   label: "Staff Minutes",       value: "1,348", color: "red",    icon: "timer",  roles: ["media"] },
  { id: "activeStaff",    label: "Active Staff",        value: "142",   color: "yellow", icon: "people", roles: ["media"] },
  { id: "newReaders",     label: "New Readers",         value: "264",   color: "blue",   icon: "user",   hint: "Insights", roles: ["library"] },
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
  branches: [
    { id: 1,  name: "Main Library",        value: "18,420 Minutes" },
    { id: 2,  name: "Eastside Branch",     value: "12,910 Minutes" },
    { id: 3,  name: "Riverside Branch",    value: "9,755 Minutes" },
    { id: 4,  name: "Oak Park Branch",     value: "8,140 Minutes" },
    { id: 5,  name: "Lakeview Branch",     value: "6,302 Minutes" },
    { id: 6,  name: "Northgate Branch",    value: "5,488 Minutes" },
    { id: 7,  name: "Westend Branch",      value: "4,011 Minutes" },
    { id: 8,  name: "Harborview Branch",   value: "3,260 Minutes" },
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

// ─── Flagged sessions (Reading Integrity Suite) ───────────────────────────────
// Reading sessions auto-flagged for review this week. Each session carries one
// or more `flags` from the "Take a Closer Look" categories; `tone` drives the
// flag-icon color (red = exceeded / inappropriate, orange = title/content,
// yellow = approaching a limit). `label` is the icon's hover tooltip.
export const FLAGGED_SESSIONS = {
  range: "This Week",
  sessions: [
    { id: 1, reader: "Tyler Voss",      title: "The Hobbit",                           flags: [{ label: "Exceeds warning threshold", tone: "red" }] },
    { id: 2, reader: "Mei Lin",         title: "Diary of a Wimpy Kid",                 flags: [{ label: "Approaching warning threshold", tone: "yellow" }] },
    { id: 3, reader: "Diego Hernandez", title: "Percy Jackson & the Lightning Thief",  flags: [{ label: "Exceeds warning threshold", tone: "red" }, { label: "Inappropriate language", tone: "red" }] },
    { id: 4, reader: "Layla Mansour",   title: "Wonder",                               flags: [{ label: "Approaching logging limit", tone: "yellow" }] },
    { id: 5, reader: "Kofi Adjei",      title: "Dog Man: Mothering Heights",           flags: [{ label: "Approaching warning threshold", tone: "yellow" }] },
    { id: 6, reader: "Aria Patel",      title: "Wings of Fire: The Dragonet Prophecy", flags: [{ label: "Unusually long title", tone: "orange" }, { label: "Exceeds warning threshold", tone: "red" }] },
    { id: 7, reader: "Zoë Becker",      title: "Front Desk",                           flags: [{ label: "Exceeds warning threshold", tone: "red" }, { label: "Approaching logging limit", tone: "yellow" }] },
  ],
};

// ─── Top books + most-earned badges (optional widgets) ────────────────────────
// `count` is the weekly figure; the widget's range setting scales it (×~4 month,
// ×~48 year). Covers come from Open Library by ISBN; `color` is the fallback
// block shown when a cover image fails to load.
export const TOP_BOOKS = [
  { id: 1,  name: "Dog Man: Mothering Heights",          count: 142, isbn: "1338680455", color: "#1D4ED8" },
  { id: 2,  name: "The Hobbit",                          count: 98,  isbn: "0345339681", color: "#6D28D9" },
  { id: 3,  name: "Percy Jackson & the Lightning Thief", count: 87,  isbn: "0786838655", color: "#047857" },
  { id: 4,  name: "Wonder",                              count: 76,  isbn: "0375869026", color: "#C2410C" },
  { id: 5,  name: "Wings of Fire: The Dragonet Prophecy",count: 64,  isbn: "0545349184", color: "#B91C1C" },
  { id: 6,  name: "Front Desk",                          count: 58,  isbn: "1338157795", color: "#0F766E" },
  { id: 7,  name: "New Kid",                             count: 49,  isbn: "0062691198", color: "#BE185D" },
  { id: 8,  name: "Diary of a Wimpy Kid",                count: 44,  isbn: "0810993139", color: "#CA8A04" },
  { id: 9,  name: "Harry Potter and the Sorcerer's Stone", count: 41, isbn: "0590353403", color: "#7C3AED" },
  { id: 10, name: "Holes",                               count: 36,  isbn: "0440414806", color: "#B45309" },
  { id: 11, name: "Charlotte's Web",                     count: 32,  isbn: "0064400557", color: "#15803D" },
  { id: 12, name: "Matilda",                             count: 28,  isbn: "014241038X", color: "#0E7490" },
  { id: 13, name: "The Giver",                           count: 25,  isbn: "0440237688", color: "#374151" },
  { id: 14, name: "A Wrinkle in Time",                   count: 22,  isbn: "0312367546", color: "#1E40AF" },
  { id: 15, name: "Hatchet",                             count: 19,  isbn: "1416936475", color: "#92400E" },
];
// Open Library cover by ISBN. `default=false` makes a missing cover 404 (rather
// than returning a 1×1 placeholder) so the widget's onError fallback fires.
export function coverUrl(isbn, size = "M") {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg?default=false`;
}
export const TOP_BADGES = [
  { id: 1,  name: "Bookworm",         count: 210, color: "green"  },
  { id: 2,  name: "Streak Star",      count: 156, color: "yellow" },
  { id: 3,  name: "Genre Explorer",   count: 98,  color: "blue"   },
  { id: 4,  name: "Night Owl Reader", count: 64,  color: "purple" },
  { id: 5,  name: "Marathon Reader",  count: 41,  color: "orange" },
  { id: 6,  name: "Series Finisher",  count: 33,  color: "teal"   },
  { id: 7,  name: "Word Wizard",      count: 28,  color: "green"  },
  { id: 8,  name: "Plot Detective",   count: 25,  color: "yellow" },
  { id: 9,  name: "Speed Reader",     count: 22,  color: "blue"   },
  { id: 10, name: "Adventure Seeker", count: 19,  color: "purple" },
  { id: 11, name: "Library Lion",     count: 17,  color: "orange" },
  { id: 12, name: "Page Turner",      count: 15,  color: "teal"   },
  { id: 13, name: "Comic Book Pro",   count: 12,  color: "blue"   },
  { id: 14, name: "Magic Bookmark",   count:  9,  color: "purple" },
  { id: 15, name: "Storyteller",      count:  7,  color: "green"  },
];

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
  { id: "a-challenge", title: "Create a Challenge",      subtitle: "Pick a template or build your own",  icon: "trophy",  cta: "Start",    roles: ["teacher", "media"] },
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

// ─── Quick Actions (right rail) ───────────────────────────────────────────────
// A compact launcher of the most common jumps, keyed by role. Sits under the
// Flagged Sessions block in the rail. `icon` keys into ACTION_ICONS in
// FixedRegions.jsx. The first three are the same for both roles so they land
// above the fold.
export const QUICK_ACTIONS = {
  teacher: [
    { id: "qa-reader",    label: "Find a Reader",      icon: "user"    },
    { id: "qa-class",     label: "Find a Class",       icon: "classes" },
    { id: "qa-challenge", label: "Create a Challenge", icon: "trophy"  },
    { id: "qa-reports",   label: "View Reports",       icon: "chart"   },
    { id: "qa-library",   label: "Classroom Library",  icon: "book"    },
  ],
  media: [
    { id: "qa-reader",    label: "Find a Reader",      icon: "user"    },
    { id: "qa-class",     label: "Find a Class",       icon: "classes" },
    { id: "qa-challenge", label: "Create a Challenge", icon: "trophy"  },
    { id: "qa-rewards",   label: "Manage Rewards",     icon: "reward"  },
    { id: "qa-reports",   label: "Reports",            icon: "chart"   },
    { id: "qa-library",   label: "Classroom Library",  icon: "book"    },
  ],
  library: [
    { id: "qa-reader",    label: "Find a Reader",      icon: "user"    },
    { id: "qa-challenge", label: "Create a Challenge", icon: "trophy"  },
    { id: "qa-rewards",   label: "Manage Rewards",     icon: "reward"  },
    { id: "qa-reports",   label: "View Reports",       icon: "chart"   },
    { id: "qa-branches",  label: "Branches",           icon: "classes" },
  ],
};

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

// ─── Teacher default layout (react-grid-layout format) ────────────────────────
// Teachers land on a "run my room" arrangement: the Daily Reading Tracker
// paired with Flagged Sessions up top, followed by a compact row of linked
// metric tiles. Engagement and the Community Goal sit in the right rail
// (fixed, not widgets).
export const DEFAULT_PRESET_ID = "run-my-room";
export const DEFAULT_LAYOUT = [
  { i: "daily-tracker",    x: 0, y: 0,  w: 8,  h: 20, minW: 4, minH: 6 },
  { i: "flagged-sessions", x: 8, y: 0,  w: 4,  h: 20, minW: 4, minH: 4 },
  { i: "stat-tiles",       x: 0, y: 20, w: 12, h: 8,  minW: 4, minH: 4 },
];
export const DEFAULT_SETTINGS = {
  "community-goal": { scope: "district" },
  "stat-tiles": { selected: ["minutes", "active", "lexileAvg", "loggedEveryDay"], range: "week" },
};

// ─── Media Specialist default ─────────────────────────────────────────────────
// Media specialists land on a review-and-act layout: the metric row up top, then
// a top-3 leaderboard (defaults to Top Classes, switchable to Students) beside
// a Flagged Sessions widget. No Daily Reading Tracker or Quick Links (those are
// teacher-only widgets now).
export const MEDIA_DEFAULT_PRESET_ID = "media-overview";
export const MEDIA_DEFAULT_LAYOUT = [
  { i: "stat-tiles",        x: 0, y: 0,  w: 12, h: 8,  minW: 4, minH: 4 },
  { i: "leaderboard-combo", x: 0, y: 8,  w: 8,  h: 12, minW: 4, minH: 6 },
  { i: "flagged-sessions",  x: 8, y: 8,  w: 4,  h: 8,  minW: 4, minH: 4 },
];
export const MEDIA_DEFAULT_SETTINGS = {
  "leaderboard-combo": { entity: "classes" },
  "stat-tiles": { selected: ["minutes", "active", "lexileAvg", "loggedEveryDay"], range: "week" },
};

// ─── Public Library default ───────────────────────────────────────────────────
// Public libraries run community reading programs (e.g. summer reading) for
// patrons across branches — no classes/students. Lands on a Top Readers
// leaderboard (switchable to Branches) with patron metrics below. The
// community reading goal sits in the right rail.
export const LIBRARY_DEFAULT_PRESET_ID = "library-overview";
export const LIBRARY_DEFAULT_LAYOUT = [
  { i: "leaderboard-combo", x: 0, y: 0,  w: 12, h: 12, minW: 4, minH: 6 },
  { i: "stat-tiles",        x: 0, y: 12, w: 12, h: 8,  minW: 4, minH: 4 },
];
export const LIBRARY_DEFAULT_SETTINGS = {
  "community-goal": { scope: "community" },
  "leaderboard-combo": { entity: "readers" },
  "stat-tiles": { selected: ["minutes", "active", "loggedEveryDay", "newReaders"], range: "week" },
};

// Kitchen Sink demo view settings (every widget rendered at once).
export const KITCHEN_DEFAULT_SETTINGS = {
  "community-goal": { scope: "district" },
  "stat-tiles": { selected: ["minutes", "active", "lexileAvg", "loggedEveryDay"], range: "week" },
  "leaderboard-combo": { entity: "classes" },
};

// Empty Sink demo view — same shape as Kitchen, but each widget renders its
// no-data empty state instead of populated content. Useful for reviewing the
// empty UX across the catalog in one pass.
export const EMPTY_DEFAULT_SETTINGS = { ...KITCHEN_DEFAULT_SETTINGS };

// Per-role defaults — picked up by loadState(role) when a role has no saved
// layout yet.
export const DEFAULT_LAYOUT_BY_ROLE   = { teacher: DEFAULT_LAYOUT,     media: MEDIA_DEFAULT_LAYOUT,     library: LIBRARY_DEFAULT_LAYOUT };
export const DEFAULT_SETTINGS_BY_ROLE = {
  teacher:        DEFAULT_SETTINGS,
  media:          MEDIA_DEFAULT_SETTINGS,
  library:        LIBRARY_DEFAULT_SETTINGS,
  kitchen:        KITCHEN_DEFAULT_SETTINGS,
  "kitchen-full": KITCHEN_DEFAULT_SETTINGS,
  empty:          EMPTY_DEFAULT_SETTINGS,
};
export const DEFAULT_PRESET_BY_ROLE   = { teacher: DEFAULT_PRESET_ID,  media: MEDIA_DEFAULT_PRESET_ID,  library: LIBRARY_DEFAULT_PRESET_ID };

// ─── Row-based defaults (flexbox layout — rows of widget ids) ─────────────────
// The dashboard is a stack of rows; each row holds 1–3 cards that split the
// width equally (flex). Full-bleed widgets (fixedWidth) sit alone in their row.
export const DEFAULT_ROWS = [
  ["daily-tracker", "flagged-sessions"],
  ["stat-tiles"],
];
export const MEDIA_DEFAULT_ROWS = [
  ["stat-tiles"],
  ["leaderboard-combo", "flagged-sessions"],
];
export const LIBRARY_DEFAULT_ROWS = [
  ["leaderboard-combo"],
  ["stat-tiles"],
];
// Kitchen Sink: a demo view that places every widget at once (role gating is
// bypassed for this view), so the whole catalog can be eyeballed on one page.
// Every row is a paired half-width slot so the compact behaviors are easy to
// review across the entire catalog.
export const KITCHEN_DEFAULT_ROWS = [
  ["daily-tracker", "stat-tiles"],
  ["flagged-sessions", "leaderboard-combo"],
  ["leaderboard-students", "leaderboard-classes"],
  ["leaderboard-staff", "leaderboard-patrons"],
  ["leaderboard-branches", "questions"],
  ["top-badges", "top-books"],
];
// Kitchen Sink (full width): same catalog, but every widget occupies its
// own row at 100% width — useful for reviewing the spacious rendering of
// each widget in one pass.
export const KITCHEN_FULL_DEFAULT_ROWS = [
  ["daily-tracker"],
  ["stat-tiles"],
  ["flagged-sessions"],
  ["leaderboard-combo"],
  ["leaderboard-students"],
  ["leaderboard-classes"],
  ["leaderboard-staff"],
  ["leaderboard-patrons"],
  ["leaderboard-branches"],
  ["questions"],
  ["top-badges"],
  ["top-books"],
];
// Empty Sink uses the same row layout as Kitchen so the empty states sit
// in the same positions as the populated demo.
export const EMPTY_DEFAULT_ROWS = KITCHEN_DEFAULT_ROWS;
export const DEFAULT_ROWS_BY_ROLE = {
  teacher:        DEFAULT_ROWS,
  media:          MEDIA_DEFAULT_ROWS,
  library:        LIBRARY_DEFAULT_ROWS,
  kitchen:        KITCHEN_DEFAULT_ROWS,
  "kitchen-full": KITCHEN_FULL_DEFAULT_ROWS,
  empty:          EMPTY_DEFAULT_ROWS,
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
    id: "run-my-room",
    name: "Run my room",
    description: "Daily Reading Tracker beside Flagged Sessions up top, with linked metric tiles below.",
    widgetNames: ["Daily Reading Tracker", "Flagged Sessions", "What's Happened"],
    roles: ["teacher"],
    layout: DEFAULT_LAYOUT,
    settings: DEFAULT_SETTINGS,
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
    description: "Spot quiet readers and stalled classes with weekly tracking and at-a-glance metrics.",
    widgetNames: ["What's Happened", "Daily Reading Tracker"],
    roles: ["teacher", "media"],
    layout: [
      { i: "stat-tiles",    x: 0, y: 0,  w: 12, h: 8,  minW: 4, minH: 4 },
      { i: "daily-tracker", x: 0, y: 8,  w: 12, h: 20, minW: 4, minH: 6 },
    ],
    settings: {},
  },
  {
    id: "media-overview",
    name: "Media specialist overview",
    description: "A top-3 leaderboard and key metrics — the at-a-glance view for media specialists. Flagged sessions live in the rail.",
    widgetNames: ["Leaderboard", "What's Happened"],
    roles: ["media"],
    layout: MEDIA_DEFAULT_LAYOUT,
    settings: MEDIA_DEFAULT_SETTINGS,
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
