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
  { id: 'mia', name: 'Mia Chen', initials: 'MC', color: '#0CA7BC', grade: '6th Grade' },
  { id: 'liam', name: 'Liam Park', initials: 'LP', color: '#0BA85F', grade: '5th Grade' },
]

// ─── Books ───────────────────────────────────────────────────────────────────
// `measure` drives the log-details step: 'minutes' shows Time Spent Reading,
// 'pages' shows How many pages were read? (the two "combined logging" variants).
// `readable: true` means there's a digital edition you can open in the in-app
// e-reader — reading it live-counts minutes that carry straight into the log.
// `kind: 'magazine'` titles are Scholastic classroom magazines — they have no
// ISBN cover, so BookCover gives them a masthead treatment (`masthead` name +
// `issue`), and they carry an issue line instead of a page count you'd read
// cover-to-cover. `masthead` is the short logo name a real cover shows.

// Open Library cover CDN — `?default=false` 404s on a missing cover so
// BookCover can fall back to the color gradient.
export const coverUrl = (isbn) =>
  isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false` : null

// The same CDN by Open Library's own numeric cover id. An ISBN can resolve to a
// foreign or coverless edition; a cover id is the exact image, so it's the more
// reliable handle when you have one (`coverId` wins over `isbn` in BookCover).
export const coverIdUrl = (id) =>
  id ? `https://covers.openlibrary.org/b/id/${id}-M.jpg?default=false` : null

export const BOOKS = {
  'she-gets-the-girl': {
    id: 'she-gets-the-girl',
    title: 'She Gets the Girl',
    author: 'Rachel Lippincott and Alyson Derrick',
    cover: ['#9DC7F0', '#F4A98B'],
    measure: 'minutes',
    pages: 400,
    readable: true,
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
    readable: true,
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
    readable: true,
  },
  darius: {
    id: 'darius',
    title: 'Darius the Great Is Not Okay',
    author: 'Adib Khorram',
    cover: ['#C0432F', '#E87A2C'],
    isbn: '9780735231856',
    measure: 'minutes',
    pages: 316,
    readable: true,
  },

  // ── Titles that come from a linked reading partner ─────────────────────────
  // `partner` means the title lives in that partner's catalog: once the reader
  // links the account, reading it there logs itself in Beanstack.
  'dog-man': {
    id: 'dog-man',
    title: 'Dog Man',
    author: 'Dav Pilkey',
    cover: ['#F0A024', '#D9822B'],
    isbn: '9780545581608',
    measure: 'minutes',
    pages: 240,
    partner: 'comicsplus',
  },
  amulet: {
    id: 'amulet',
    title: 'Amulet: The Stonekeeper',
    author: 'Kazu Kibuishi',
    cover: ['#5B21B6', '#312E81'],
    isbn: '9780439846806',
    measure: 'minutes',
    pages: 192,
    partner: 'comicsplus',
  },

  // ── Scholastic classroom magazines (see the `books` prototype's rack) ───────
  'scholastic-news': {
    id: 'scholastic-news',
    title: 'Scholastic News',
    author: 'Scholastic',
    cover: ['#F04B4B', '#B3070E'],
    kind: 'magazine',
    issue: 'May 2026 · Save the Bees!',
    cadence: 'Weekly',
    measure: 'pages',
    pages: 8,
    partner: 'scholastic',
  },
  storyworks: {
    id: 'storyworks',
    title: 'Storyworks',
    author: 'Scholastic',
    cover: ['#9C6BFF', '#5B21B6'],
    kind: 'magazine',
    issue: 'May 2026 · The Mystery at Cabin 9',
    cadence: 'Monthly',
    measure: 'minutes',
    pages: 24,
    readable: true,
    partner: 'scholastic',
  },
  superscience: {
    id: 'superscience',
    title: 'SuperScience',
    author: 'Scholastic',
    cover: ['#4D8BF5', '#1E3FA8'],
    kind: 'magazine',
    masthead: 'Super Science',
    issue: 'May 2026 · Inside a Volcano',
    cadence: 'Monthly',
    measure: 'minutes',
    pages: 16,
    readable: true,
    partner: 'scholastic',
  },
  scope: {
    id: 'scope',
    title: 'Scholastic Scope',
    author: 'Scholastic',
    cover: ['#2AA5B8', '#0B5566'],
    kind: 'magazine',
    masthead: 'Scope',
    issue: 'May 2026 · Survival Stories',
    cadence: 'Monthly',
    measure: 'minutes',
    pages: 24,
    readable: true,
    partner: 'scholastic',
  },
}

export const RECENTLY_LOGGED = ['scholastic-news', 'she-gets-the-girl', 'rump', 'lucky-cap']

// A shelf of issues pulled from a linked partner's catalog, so it only appears
// once that account is connected.
export const READING_LIST = {
  partner: 'scholastic',
  title: 'Top Scholastic Picks',
  total: 10,
  unit: 'issues',
  completed: ['superscience', 'scholastic-news'],
  titles: ['scope', 'superscience', 'storyworks', 'scholastic-news'],
}

// ─── Dashboard backdrop (the "Challenges" page the flow opens on top of) ─────

export const STREAK = { current: 0, longest: 12 }
export const DAILY_GOAL = { minutes: 0, goal: 20 }

// Three real Beanstack challenges, with the banner art the design team ships
// for each (`Design/Projects/Challenges/<name>/Banner`, 920×351 — or 1840×702
// at 2× — converted to 1200px webp in `public/challenge-banners/`). `banner` is
// a Program's `header_image`; `badges` is the folder its badge art lives in,
// under `public/challenge-badges/`.
//
// `tint` is the banner's dominant colour. The app samples it off the image at
// runtime with ColorThief and blends it with white to paint the two bands
// behind the header; here it is measured once at build time
// (`magick … -colors 8 histogram:`) so the page needs no colour library.
export const CHALLENGES = [
  {
    id: 'spring',
    title: 'Spring Into Reading',
    dates: 'Apr 1 — Apr 30',
    badge: 'Minutes',
    canSelfUnenroll: true,
    logTypes: ['minutes', 'books'],
    types: ['activities'],
    banner: 'spring-into-reading',
    tint: '#B4E0CC',
    badges: 'spring-into-reading',
  },
  {
    id: 'love-hurts',
    title: 'For the Love of Reading',
    dates: 'Ongoing',
    badge: 'Minutes',
    logTypes: ['minutes'],
    types: ['reviews'],
    canSelfUnenroll: true,
    banner: 'for-the-love-of-reading',
    tint: '#FA4856',
    badges: 'for-the-love-of-reading',
  },
  {
    id: 'arresting',
    title: 'Comics Choice',
    dates: 'Jun 1 — Jun 30',
    badge: 'Bingo',
    canSelfUnenroll: true,
    logTypes: ['books'],
    types: ['bingo'],
    bookTalks: true,
    banner: 'comics-choice',
    tint: '#61B2F1',
    badges: 'comics-choice',
  },
]

// The app's Challenges page is four lists, not one: what you're in
// (`current_challenges`), what else is open to you (`more_challenges`), what
// has ended (`completed_challenges`), and what you've ignored
// (`dismissed_challenges`). Ignored starts empty — you make it yourself.

/** "More Challenges — Other available challenges." */
export const MORE_CHALLENGES = [
  {
    id: 'summer',
    title: 'Summer Reading',
    dates: 'Jun 15 — Aug 22',
    upcoming: true,
    logTypes: ['minutes', 'books'],
    types: ['activities'],
    banner: 'summer-reading',
    tint: '#D5EDFD',
    badges: 'spring-into-reading',
    description:
      'Keep reading all summer long. Log your minutes, finish activities, and earn a badge for every two weeks you keep it going.',
    range: 'Grades K–8',
    // Not open yet and you can sign up anyway — the app's `allow_preregistration`.
    allowPreregistration: true,
  },
  {
    id: 'battle',
    title: 'Battle of the Books',
    dates: 'Sep 8 — Nov 14',
    upcoming: true,
    logTypes: ['books'],
    types: ['book_list'],
    bookTalks: true,
    banner: 'battle-of-the-books',
    tint: '#FD452B',
    badges: 'comics-choice',
    description:
      "Read your way through this year's battle list, then talk about what you read. Every title you finish puts your class closer to the final round.",
    range: 'Grades 4–8',
    // Upcoming with no pre-registration: the modal shows it, but with nothing
    // to press. And it's one of a set you pick from.
    alternatives: ['Nonfiction November', 'Graphic Novel Gauntlet'],
  },
  {
    id: '25-in-25',
    title: '25 in 25',
    dates: 'Jan 1 — Dec 31',
    logTypes: ['books'],
    types: ['reviews'],
    banner: '25-in-25',
    tint: '#A8D6D6',
    badges: 'for-the-love-of-reading',
    description:
      'Twenty-five books in a year — about one every fortnight. Write a review for any five of them and the badge is yours.',
    range: '5–12',
    ageDeterminant: 'ages',
  },
]

/**
 * A reader at a school inside a district also sees what the district's other
 * site is running — `connected_programs`. The app opens these on that site.
 */
export const CONNECTED_SITE = 'Oak Elementary'

export const CONNECTED_CHALLENGES = [
  {
    id: 'benny-bean',
    title: 'Read with Benny',
    dates: 'Sep 1 — Oct 31',
    logTypes: ['minutes'],
    types: ['activities'],
    banner: 'benny-bean',
    badges: 'spring-into-reading',
    tint: '#E8A33D',
    connectedSite: CONNECTED_SITE,
    range: 'Grades K–5',
    description:
      "Oak Elementary's autumn challenge, open to the whole district. Log your minutes and work through Benny's activities.",
  },
]

/** "Past Challenges — Challenges that {name} is participating in and have ended." */
export const PAST_CHALLENGES = [
  {
    id: 'winter',
    title: 'Winter Reading',
    dates: 'Dec 1 — Feb 28',
    logTypes: ['minutes'],
    types: ['activities'],
    banner: 'winter-reading',
    tint: '#DDAF86',
    badges: 'spring-into-reading',
  },
  {
    id: 'read-across',
    title: 'Read Across America',
    dates: 'Mar 2 — Mar 8',
    logTypes: ['books'],
    types: ['book_list'],
    banner: 'read-across-america',
    tint: '#7E6F94',
    badges: 'comics-choice',
  },
]

export const TOP_SCHOOLS = [
  {
    rank: 1,
    name: 'Magnolia Middle',
    value: 198,
    color: '#FFBC42',
    stats: { week: { minutes: 198, books: 24 }, month: { minutes: 812, books: 97 } },
  },
  {
    rank: 2,
    name: 'Oak Elementary',
    value: 157,
    color: '#ACACAC',
    stats: { week: { minutes: 157, books: 19 }, month: { minutes: 690, books: 81 } },
  },
  {
    rank: 3,
    name: 'Hickory Middle School',
    value: 104,
    color: '#C2884F',
    stats: { week: { minutes: 104, books: 12 }, month: { minutes: 455, books: 58 } },
  },
]

export const TOP_GRADES = [
  {
    rank: 1,
    name: '6th grade',
    value: 412,
    color: '#FFBC42',
    stats: { week: { minutes: 412, books: 47 }, month: { minutes: 1680, books: 193 } },
  },
  {
    rank: 2,
    name: '5th grade',
    value: 388,
    color: '#ACACAC',
    stats: { week: { minutes: 388, books: 51 }, month: { minutes: 1544, books: 205 } },
  },
  {
    rank: 3,
    name: '7th grade',
    value: 271,
    color: '#C2884F',
    stats: { week: { minutes: 271, books: 33 }, month: { minutes: 1120, books: 141 } },
  },
]

// ─── Reading Log ─────────────────────────────────────────────────────────────
// A month of activity for the Reading Log page. Entries with a `source` were
// imported from a linked reading app rather than logged by hand — those carry an
// `importedOn` date so the log can say where they came from.
//
// `kind`: log | badge | achievement. `tone` picks the row colour.

export const LOG_STREAK = { current: 2, longest: 5 }

export const LOG_MONTH = { label: 'June 2026', year: 2026, month: 5 } // month is 0-based

export const READING_LOG = [
  {
    id: 'l1',
    date: '2026-05-31',
    kind: 'log',
    title: 'Snapdragon',
    author: 'Kat Leyh',
    minutes: 20,
    tone: 'blue',
    streak: 4,
  },
  {
    id: 'l2',
    date: '2026-06-01',
    kind: 'log',
    title: 'Snapdragon',
    author: 'Kat Leyh',
    minutes: 15,
    pages: 32,
    completed: true,
    tone: 'pink',
    streak: 5,
  },
  {
    id: 'l3',
    date: '2026-06-01',
    kind: 'achievement',
    title: 'Earned an achievement!',
    author: 'International Day of Peace',
    tone: 'amber',
  },
  {
    id: 'l4',
    date: '2026-06-03',
    kind: 'log',
    title: 'Percy Jackson and the Olympians #1: The Lightning Thief',
    author: 'Rick Riordan',
    pages: 34,
    tone: 'blue',
  },
  {
    id: 'l5',
    date: '2026-06-03',
    kind: 'log',
    title: 'Welcome to the Forest: The Harvest Party',
    author: 'Katie Risor',
    minutes: 15,
    tone: 'green',
    source: 'comicsplus',
    importedOn: '6/3/26',
  },
  {
    id: 'l6',
    date: '2026-06-03',
    kind: 'badge',
    title: 'Earned a badge!',
    author: 'Read 60 Minutes',
    tone: 'violet',
  },
  {
    id: 'l7',
    date: '2026-06-04',
    kind: 'log',
    title: 'Scholastic News',
    author: 'Scholastic',
    minutes: 12,
    tone: 'red',
    source: 'scholastic',
    importedOn: '6/4/26',
  },
  {
    id: 'l8',
    date: '2026-06-05',
    kind: 'log',
    title: 'Dog Man',
    author: 'Dav Pilkey',
    minutes: 24,
    completed: true,
    tone: 'amber',
    source: 'comicsplus',
    importedOn: '6/5/26',
  },
  {
    id: 'l9',
    date: '2026-06-08',
    kind: 'log',
    title: 'Storyworks',
    author: 'Scholastic',
    minutes: 18,
    tone: 'red',
    source: 'scholastic',
    importedOn: '6/8/26',
  },
  {
    id: 'l10',
    date: '2026-06-09',
    kind: 'log',
    title: 'Amulet: The Stonekeeper',
    author: 'Kazu Kibuishi',
    minutes: 18,
    tone: 'violet',
    source: 'comicsplus',
    importedOn: '6/9/26',
  },
  {
    id: 'l11',
    date: '2026-06-09',
    kind: 'log',
    title: 'Rump',
    author: 'Liesl Shurtliff',
    pages: 22,
    tone: 'blue',
  },
  {
    id: 'l12',
    date: '2026-06-11',
    kind: 'log',
    title: 'SuperScience',
    author: 'Scholastic',
    minutes: 14,
    tone: 'red',
    source: 'scholastic',
    importedOn: '6/11/26',
  },
  {
    id: 'l13',
    date: '2026-06-12',
    kind: 'log',
    title: 'Amulet: The Stonekeeper',
    author: 'Kazu Kibuishi',
    minutes: 26,
    completed: true,
    tone: 'violet',
    source: 'comicsplus',
    importedOn: '6/12/26',
  },
  {
    id: 'l14',
    date: '2026-06-12',
    kind: 'badge',
    title: 'Earned a badge!',
    author: 'Graphic Novel Fan',
    tone: 'violet',
  },
  {
    id: 'l15',
    date: '2026-06-15',
    kind: 'log',
    title: 'Lucky Cap',
    author: 'Patrick Jennings',
    minutes: 25,
    tone: 'green',
  },
  {
    id: 'l16',
    date: '2026-06-16',
    kind: 'log',
    title: 'Scholastic Scope',
    author: 'Scholastic',
    minutes: 20,
    tone: 'red',
    source: 'scholastic',
    importedOn: '6/16/26',
  },
]

// ─── Registration questions ──────────────────────────────────────────────────
// `RegistrationQuestion` — a site's own questions, asked once when a reader
// first joins a challenge. Multiple choice and one answer only; the admin
// screen says so outright ("questions are only available in a multiple choice
// format… there is not currently an ability for free-form text answers"), which
// is why there is no text field here either.
//
// `active` is whether the site is asking it at all, `required` is whether the
// join is blocked without it (`active_and_required`), and the answers belong to
// the *profile* rather than the challenge — `registration_answers_profiles` —
// so a reader is asked once and never again, whatever they join next.

const question = (id, text, required, answers) => ({
  id,
  question: text,
  required,
  answers: answers.map((a, i) => ({ id: `${id}-${i}`, answer: a })),
})

export const REGISTRATION_QUESTIONS = [
  question('q-school', 'Which school do you go to?', true, [
    'Magnolia Middle School',
    'Oak Elementary',
    'Hickory Middle School',
    'I go somewhere else',
  ]),
  question('q-heard', 'How did you hear about our summer reading program?', true, [
    'My teacher told me',
    'A flyer or poster',
    'At the library',
    'A friend or family member',
    'Social media',
  ]),
  question('q-branch', 'Which library branch do you visit most?', false, [
    'Central',
    'Riverside',
    'Eastgate',
    'I use the bookmobile',
    'I don’t visit a branch',
  ]),
]
