// Sample data for the Logging Flow prototype — a replica of Beanstack's
// "combined logging" reader flow (log a book together with minutes/pages in
// one pass). See the Figma "Logging Flow" project, Option 1.

// ─── Reader (the person reading) + others for the reader picker ──────────────

export const READER = {
  id: 'olivia',
  name: 'Olivia',
  initials: 'OM',
  color: '#F09A77',
  grade: '6th Grade',
}

// "Select a different reader" — a parent/teacher logging on behalf of others.
export const OTHER_READERS = [
  { id: 'olivia', name: 'Olivia Martinez', initials: 'OM', color: '#F09A77', grade: '6th Grade' },
  { id: 'noah', name: 'Noah Martinez', initials: 'NM', color: '#7C5CFA', grade: '3rd Grade' },
  { id: 'mia', name: 'Mia Chen', initials: 'MC', color: '#0DA7BC', grade: '6th Grade' },
  { id: 'liam', name: 'Liam Park', initials: 'LP', color: '#16A97A', grade: '5th Grade' },
]

// ─── Books ───────────────────────────────────────────────────────────────────
// `measure` drives the log-details step: 'minutes' shows Time Spent Reading,
// 'pages' shows How many pages were read? (the two "combined logging" variants).

// Open Library cover CDN — `?default=false` 404s on a missing cover so
// BookCover can fall back to the color gradient.
export const coverUrl = (isbn) =>
  isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false` : null

export const BOOKS = {
  'she-gets-the-girl': {
    id: 'she-gets-the-girl',
    title: 'She Gets the Girl',
    author: 'Rachel Lippincott and Alyson Derrick',
    cover: ['#9DC7F0', '#F4A98B'],
    measure: 'minutes',
    pages: 400,
  },
  rump: {
    id: 'rump',
    title: 'Rump',
    author: 'Liesl Shurtliff',
    cover: ['#3B4A3A', '#6E7A53'],
    isbn: '9780307977939',
    measure: 'pages',
    pages: 272,
  },
  'lucky-cap': {
    id: 'lucky-cap',
    title: 'Lucky Cap',
    author: 'Patrick Jennings',
    cover: ['#3FA9E0', '#E23B3B'],
    measure: 'minutes',
    pages: 176,
  },
  'lesbianas-guide': {
    id: 'lesbianas-guide',
    title: "The Lesbiana's Guide to Catholic School",
    author: 'Sonora Reyes',
    cover: ['#2BB3C0', '#F2B705'],
    isbn: '9780062981066',
    measure: 'minutes',
    pages: 336,
  },
  'telegraph-club': {
    id: 'telegraph-club',
    title: 'Last Night at the Telegraph Club',
    author: 'Malinda Lo',
    cover: ['#1A2433', '#3A506B'],
    isbn: '9780525555254',
    measure: 'minutes',
    pages: 416,
  },
  darius: {
    id: 'darius',
    title: 'Darius the Great Is Not Okay',
    author: 'Adib Khorram',
    cover: ['#C0432F', '#E87A2C'],
    isbn: '9780735231856',
    measure: 'minutes',
    pages: 316,
  },
}

export const RECENTLY_LOGGED = ['she-gets-the-girl', 'rump', 'lucky-cap']

// Titles surfaced from the reader's active Reading List challenge.
export const READING_LIST = {
  challenge: 'Queer Coming of Age',
  byline: 'A Becky Albertalli Challenge',
  total: 12,
  reward: 'Pride Reader badge',
  completed: ['she-gets-the-girl', 'telegraph-club'],
  titles: ['lesbianas-guide', 'telegraph-club', 'darius', 'she-gets-the-girl'],
}

// ─── Dashboard backdrop (the "Challenges" page the flow opens on top of) ─────

export const STREAK = { current: 0, longest: 12 }
export const DAILY_GOAL = { minutes: 0, goal: 20 }

export const CHALLENGES = [
  {
    id: 'spring',
    title: 'Spring Into Reading',
    dates: 'Apr 1 — Apr 30',
    badge: 'Minutes',
    art: 'spring',
  },
  { id: 'love-hurts', title: 'Love Hurts', dates: 'Ongoing', badge: 'Minutes', art: 'love-hurts' },
  {
    id: 'arresting',
    title: 'Arresting Strangeness',
    dates: 'Jun 1 — Jun 30',
    badge: 'Minutes',
    art: 'arresting',
  },
]

export const TOP_SCHOOLS = [
  { rank: 1, name: 'Magnolia Middle', value: 198, color: '#F59E0B' },
  { rank: 2, name: 'Oak Elementary', value: 157, color: '#94A3B8' },
  { rank: 3, name: 'Hickory Middle School', value: 104, color: '#C2884F' },
]

export const TOP_GRADES = [
  { rank: 1, name: '6th grade', value: 412, color: '#F59E0B' },
  { rank: 2, name: '5th grade', value: 388, color: '#94A3B8' },
  { rank: 3, name: '7th grade', value: 271, color: '#C2884F' },
]
