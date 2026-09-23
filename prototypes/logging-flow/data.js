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
// `kind: 'magazine'` titles are Scholastic classroom magazines — they have no
// ISBN cover, so BookCover gives them a masthead treatment (`masthead` name +
// `issue`), and they carry an issue line instead of a page count you'd read
// cover-to-cover. `masthead` is the short logo name a real cover shows.

// The cover CDN helpers moved to BookCover, which is the only thing that uses
// them; re-exported here for the fixtures that already reach for them.
export { coverUrl, coverIdUrl } from '@components/BookCover/covers'

export const BOOKS = {
  'she-gets-the-girl': {
    id: 'she-gets-the-girl',
    title: 'She Gets the Girl',
    author: 'Rachel Lippincott and Alyson Derrick',
    cover: ['#9DC7F0', '#F4A98B'],
    coverId: 13195498,
    measure: 'minutes',
    pages: 400,
  },
  rump: {
    id: 'rump',
    title: 'Rump',
    author: 'Liesl Shurtliff',
    cover: ['#3B4A3A', '#6E7A53'],
    coverId: 7303733,
    isbn: '9780307977939',
    measure: 'pages',
    pages: 272,
  },
  'lucky-cap': {
    id: 'lucky-cap',
    title: 'Lucky Cap',
    author: 'Patrick Jennings',
    cover: ['#3FA9E0', '#E23B3B'],
    coverId: 10783462,
    measure: 'minutes',
    pages: 176,
  },
  'lesbianas-guide': {
    id: 'lesbianas-guide',
    title: "The Lesbiana's Guide to Catholic School",
    author: 'Sonora Reyes',
    cover: ['#2BB3C0', '#F2B705'],
    coverId: 12791802,
    isbn: '9780062981066',
    measure: 'minutes',
    pages: 336,
  },
  'telegraph-club': {
    id: 'telegraph-club',
    title: 'Last Night at the Telegraph Club',
    author: 'Malinda Lo',
    cover: ['#1A2433', '#3A506B'],
    coverId: 15254093,
    isbn: '9780525555254',
    measure: 'minutes',
    pages: 416,
  },
  darius: {
    id: 'darius',
    title: 'Darius the Great Is Not Okay',
    author: 'Adib Khorram',
    cover: ['#C0432F', '#E87A2C'],
    coverId: 9274780,
    isbn: '9780525552963',
    measure: 'minutes',
    pages: 316,
  },
  amari: {
    id: 'amari',
    title: 'Amari and the Night Brothers',
    author: 'B. B. Alston',
    cover: ['#6D28D9', '#2E1065'],
    coverId: 12714908,
    isbn: '9780062975171',
    measure: 'minutes',
    pages: 407,
  },

  // ── Titles that come from a linked reading partner ─────────────────────────
  // `partner` means the title lives in that partner's catalog: once the reader
  // links the account, reading it there logs itself in Beanstack.
  'dog-man': {
    id: 'dog-man',
    title: 'Dog Man',
    author: 'Dav Pilkey',
    cover: ['#F0A024', '#D9822B'],
    coverId: 7894142,
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
    coverId: 2420582,
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
    partner: 'scholastic',
  },
  'sn-jr': {
    id: 'sn-jr',
    title: 'Scholastic Let’s Find Out',
    author: 'Scholastic',
    cover: ['#F2B705', '#B06A00'],
    kind: 'magazine',
    masthead: 'Let’s Find Out',
    issue: 'May 2026 · Bugs Up Close',
    cadence: 'Weekly',
    measure: 'pages',
    pages: 8,
    partner: 'scholastic',
  },
  'storyworks-jr': {
    id: 'storyworks-jr',
    title: 'Storyworks Jr.',
    author: 'Scholastic',
    cover: ['#FF8A3D', '#C2410C'],
    kind: 'magazine',
    masthead: 'Storyworks Jr.',
    issue: 'May 2026 · The Lost Dog',
    cadence: 'Monthly',
    measure: 'minutes',
    pages: 24,
    partner: 'scholastic',
  },
  junior: {
    id: 'junior',
    title: 'Junior Scholastic',
    author: 'Scholastic',
    cover: ['#1E9E6A', '#0B5F3E'],
    kind: 'magazine',
    masthead: 'Junior Scholastic',
    issue: 'May 2026 · Inside the Amazon',
    cadence: 'Monthly',
    measure: 'minutes',
    pages: 24,
    partner: 'scholastic',
  },
  'science-world': {
    id: 'science-world',
    title: 'Science World',
    author: 'Scholastic',
    cover: ['#22B8CF', '#0B6B78'],
    kind: 'magazine',
    masthead: 'Science World',
    issue: 'May 2026 · Sharks Decoded',
    cadence: 'Monthly',
    measure: 'minutes',
    pages: 20,
    partner: 'scholastic',
  },
  action: {
    id: 'action',
    title: 'Scholastic Action',
    author: 'Scholastic',
    cover: ['#E8443A', '#8A1C16'],
    kind: 'magazine',
    masthead: 'Action',
    issue: 'May 2026 · True Survival',
    cadence: 'Monthly',
    measure: 'minutes',
    pages: 20,
    partner: 'scholastic',
  },
  dynamath: {
    id: 'dynamath',
    title: 'DynaMath',
    author: 'Scholastic',
    cover: ['#7C5CFA', '#3B1E9E'],
    kind: 'magazine',
    masthead: 'DynaMath',
    issue: 'May 2026 · Puzzle Palace',
    cadence: 'Monthly',
    measure: 'pages',
    pages: 16,
    partner: 'scholastic',
  },
  choices: {
    id: 'choices',
    title: 'Scholastic Choices',
    author: 'Scholastic',
    cover: ['#EC4899', '#9D174D'],
    kind: 'magazine',
    masthead: 'Choices',
    issue: 'May 2026 · Sleep Better',
    cadence: 'Monthly',
    measure: 'minutes',
    pages: 20,
    partner: 'scholastic',
  },
  upfront: {
    id: 'upfront',
    title: 'The New York Times Upfront',
    author: 'Scholastic',
    cover: ['#334155', '#0F172A'],
    kind: 'magazine',
    masthead: 'Upfront',
    issue: 'May 2026 · The Vote Ahead',
    cadence: 'Monthly',
    measure: 'minutes',
    pages: 28,
    partner: 'scholastic',
  },
}

/* The rest of a 25-title reading list — the sort of middle-grade shelf a
   school's “25 in 25” is built from. */
BOOKS['wonder'] = {
  id: 'wonder',
  title: 'Wonder',
  author: 'R. J. Palacio',
  cover: ['#3FA9E0', '#1B5E8C'],
  coverId: 8223160,
  measure: 'minutes',
  pages: 320,
}
BOOKS['crossover'] = {
  id: 'crossover',
  title: 'The Crossover',
  author: 'Kwame Alexander',
  cover: ['#F26430', '#A34320'],
  coverId: 7336870,
  measure: 'minutes',
  pages: 240,
}
BOOKS['front-desk'] = {
  id: 'front-desk',
  title: 'Front Desk',
  author: 'Kelly Yang',
  cover: ['#E0457B', '#F5A623'],
  coverId: 8803949,
  measure: 'minutes',
  pages: 286,
}
BOOKS['new-kid'] = {
  id: 'new-kid',
  title: 'New Kid',
  author: 'Jerry Craft',
  cover: ['#2BB3C0', '#F2B705'],
  coverId: 12355597,
  measure: 'minutes',
  pages: 256,
}
BOOKS['ghost'] = {
  id: 'ghost',
  title: 'Ghost',
  author: 'Jason Reynolds',
  cover: ['#1A2433', '#6B4FA8'],
  coverId: 9257673,
  measure: 'minutes',
  pages: 192,
}
BOOKS['esperanza'] = {
  id: 'esperanza',
  title: 'Esperanza Rising',
  author: 'Pam Muñoz Ryan',
  cover: ['#C1272D', '#F7941E'],
  coverId: 275937,
  measure: 'minutes',
  pages: 262,
}
BOOKS['holes'] = {
  id: 'holes',
  title: 'Holes',
  author: 'Louis Sachar',
  cover: ['#B06A00', '#F2B705'],
  coverId: 19797,
  measure: 'minutes',
  pages: 233,
}
BOOKS['refugee'] = {
  id: 'refugee',
  title: 'Refugee',
  author: 'Alan Gratz',
  cover: ['#0B6B78', '#22B8CF'],
  coverId: 9122402,
  measure: 'minutes',
  pages: 352,
}
BOOKS['merci-suarez'] = {
  id: 'merci-suarez',
  title: 'Merci Suárez Changes Gears',
  author: 'Meg Medina',
  cover: ['#00AEEF', '#7C4DA8'],
  coverId: 9312852,
  measure: 'minutes',
  pages: 368,
}
BOOKS['trap-a-tiger'] = {
  id: 'trap-a-tiger',
  title: 'When You Trap a Tiger',
  author: 'Tae Keller',
  cover: ['#F2B705', '#E8443A'],
  coverId: 9256649,
  measure: 'minutes',
  pages: 304,
}
BOOKS['last-cuentista'] = {
  id: 'last-cuentista',
  title: 'The Last Cuentista',
  author: 'Donna Barba Higuera',
  cover: ['#3C0458', '#00AEEF'],
  coverId: 12579345,
  measure: 'minutes',
  pages: 336,
}
BOOKS['show-me-a-sign'] = {
  id: 'show-me-a-sign',
  title: 'Show Me a Sign',
  author: 'Ann Clare LeZotte',
  cover: ['#1E7A5A', '#8DC63F'],
  coverId: 9294651,
  measure: 'minutes',
  pages: 288,
}
BOOKS['other-words'] = {
  id: 'other-words',
  title: 'Other Words for Home',
  author: 'Jasmine Warga',
  cover: ['#EC4899', '#7C5CFA'],
  coverId: 8737138,
  measure: 'minutes',
  pages: 352,
}
BOOKS['brown-girl'] = {
  id: 'brown-girl',
  title: 'Brown Girl Dreaming',
  author: 'Jacqueline Woodson',
  cover: ['#7C4DA8', '#EC7C3C'],
  coverId: 7435102,
  measure: 'minutes',
  pages: 336,
}
BOOKS['wild-robot'] = {
  id: 'wild-robot',
  title: 'The Wild Robot',
  author: 'Peter Brown',
  cover: ['#1E9E6A', '#0B5F3E'],
  coverId: 7443301,
  measure: 'minutes',
  pages: 288,
}
BOOKS['roll-of-thunder'] = {
  id: 'roll-of-thunder',
  title: 'Roll of Thunder, Hear My Cry',
  author: 'Mildred D. Taylor',
  cover: ['#8A1C16', '#E8443A'],
  coverId: 12632397,
  measure: 'minutes',
  pages: 288,
}
BOOKS['hatchet'] = {
  id: 'hatchet',
  title: 'Hatchet',
  author: 'Gary Paulsen',
  cover: ['#334155', '#22B8CF'],
  coverId: 11240448,
  measure: 'minutes',
  pages: 208,
}

// Beeverso's own, for the pages that offer that integration. Spanish titles
// read in the partner's app, so they carry `partner` the way the Comics Plus
// and Scholastic books do.
BOOKS.platero = {
  id: 'platero',
  title: 'Platero y yo',
  author: 'Juan Ramón Jiménez',
  cover: ['#7C4DA8', '#EC7C3C'],
  partner: 'beeverso',
  measure: 'minutes',
  pages: 144,
}
BOOKS.monarca = {
  id: 'monarca',
  title: 'El viaje de la mariposa monarca',
  author: 'Texto corto · Ciencias',
  cover: ['#00AEEF', '#662D91'],
  partner: 'beeverso',
  measure: 'minutes',
}

/* Six, so the shelf can show five after a page has filtered out a partner it
   doesn't offer (web-app drops Scholastic). */
export const RECENTLY_LOGGED = [
  'scholastic-news',
  'she-gets-the-girl',
  'rump',
  'lucky-cap',
  'dog-man',
  'amulet',
]

// A shelf of issues pulled from a linked partner's catalog, so it only appears
// once that account is connected.
export const READING_LIST = {
  partner: 'scholastic',
  title: 'Top Scholastic Picks',
  unit: 'issues',
  completed: ['superscience', 'scholastic-news', 'junior'],
  // The whole classroom-magazine line-up this reader's school subscribes to —
  // the shelf shows four and its View More card opens the rest.
  titles: [
    'scope',
    'superscience',
    'storyworks',
    'scholastic-news',
    'storyworks-jr',
    'junior',
    'science-world',
    'action',
    'dynamath',
    'choices',
    'upfront',
    'sn-jr',
  ],
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

/* Every challenge a page can be opened for, by id — so a reload can put the
   reader back on the one they had open. */
export const CHALLENGE_BY_ID = Object.fromEntries(
  [...CHALLENGES, ...MORE_CHALLENGES, ...CONNECTED_CHALLENGES, ...PAST_CHALLENGES].map((c) => [
    c.id,
    c,
  ]),
)

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

/* How long the run already was on the day before this log's first entry.
   A streak is a run of consecutive logged days, so every number the log shows
   is derived from the entries themselves — except the part of the run that
   happened before the window starts, which the entries can't know about. This
   is that part, and it is the only hand-set streak number left: the two that
   used to sit on individual entries stopped the count wherever they happened
   to be, so the first week climbed 4, 5 and then said nothing for four more
   logged days. */
export const STREAK_SEED = 3

export const LOG_MONTH = { label: 'June 2026', year: 2026, month: 5 } // month is 0-based

/** The month the reader is actually in, in `LOG_MONTH`'s shape. */
export const currentMonth = (d = new Date()) => ({
  label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  year: d.getFullYear(),
  month: d.getMonth(),
})

export const READING_LOG = [
  {
    id: 'l1',
    date: '2026-05-31',
    kind: 'log',
    title: 'Snapdragon',
    author: 'Kat Leyh',
    minutes: 20,
    tone: 'blue',
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
  /* Epic rows. Not a linked account that keeps logging — a batch the reader
     imported in one go, which is why they all carry the same `importedOn`. */
  {
    id: 'l5e',
    date: '2026-06-02',
    kind: 'log',
    title: 'The Bad Guys in Intergalactic Gas',
    author: 'Aaron Blabey',
    minutes: 25,
    tone: 'blue',
    source: 'epic',
    importedOn: '6/4/26',
  },
  {
    id: 'l5f',
    date: '2026-06-04',
    kind: 'log',
    title: 'Ada Twist, Scientist',
    author: 'Andrea Beaty',
    minutes: 18,
    tone: 'violet',
    source: 'epic',
    importedOn: '6/4/26',
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

/**
 * `reading_list_challenges#index` — the book-list challenges this reader is
 * enrolled in. A `Program` of type `book_list`: a set of titles the library or
 * teacher picked, some of them required.
 *
 * `required` is the app's three shapes — every title, a count, or a count that
 * must include specific ones (`all_program_books_required?`,
 * `minimum_required_program_books`, `specific_program_books_required?`).
 *
 * Per book: `done` is `cached_completed_book_ids`, and `readNow`/`goNow` are the two ways
 * the app offers to go and read it rather than just log it.
 *
 * A title can sit on two lists — the same book is on plenty of them — so these
 * deliberately overlap. They're all drawn from `BOOKS`, and a consumer that
 * filters its catalog (the reader app drops Scholastic) simply shows fewer.
 */
export const READING_LIST_CHALLENGES = [
  {
    id: 'rlc-summer',
    title: 'Battle of the Books',
    banner: 'battle-of-the-books',
    dates: 'Sep 8 – Nov 14',
    tint: '#E8443A',
    required: { kind: 'specific', count: 6 },
    books: [
      { id: 'rump', required: true, done: true },
      { id: 'she-gets-the-girl', required: true, done: true },
      { id: 'lucky-cap', required: true, readNow: true },
      { id: 'darius', required: true },
      { id: 'dog-man', goNow: true },
      { id: 'telegraph-club' },
    ],
  },
  {
    id: 'rlc-25',
    title: '25 in 25',
    banner: '25-in-25',
    dates: 'Jan 1 – Dec 31',
    tint: '#4C8DD8',
    required: { kind: 'count', count: 25 },
    books: [
      { id: 'amulet', done: true },
      { id: 'lesbianas-guide' },
      { id: 'dog-man' },
      { id: 'rump' },
      { id: 'wonder', done: true },
      { id: 'crossover' },
      { id: 'front-desk', done: true },
      { id: 'new-kid', done: true },
      { id: 'ghost' },
      { id: 'esperanza' },
      { id: 'holes', done: true },
      { id: 'refugee' },
      { id: 'merci-suarez' },
      { id: 'trap-a-tiger' },
      { id: 'last-cuentista' },
      { id: 'show-me-a-sign' },
      { id: 'other-words' },
      { id: 'brown-girl' },
      { id: 'wild-robot' },
      { id: 'roll-of-thunder' },
      { id: 'hatchet', done: true },
      { id: 'she-gets-the-girl' },
      { id: 'lucky-cap' },
      { id: 'telegraph-club' },
      { id: 'darius' },
    ],
  },
]

/**
 * The demo catalog the shared `LogFlow` searches, as one object to spread.
 *
 * The component itself ships no fixtures — it's in `@components` now, and a
 * shared component doesn't get to know about any one prototype's data — so
 * every consumer hands it a shelf. This is the one this prototype family uses:
 *
 *   <LogFlow {...LOG_FIXTURES} partners={CONNECTION_LIST} … />
 */
/* ── What to read next ─────────────────────────────────────────────────────
   Finishing a title is the one moment the reader is guaranteed to be between
   books, so it's the one moment a recommendation is useful rather than an
   interruption. Keyed by the title just finished, because the reason is about
   the pair — "another X, now that you've read Y" is not a fact about either
   book on its own, which is why it doesn't live on the recommended one the way
   the `books` prototype's `bennyReason` does.

   Every target is in this catalog, so the shelf it lands on can draw it. */
const NEXT_UP = {
  'she-gets-the-girl': [
    {
      id: 'lesbianas-guide',
      reason: 'Another funny, messy, big-hearted romance — Yamilet has a voice you won’t forget.',
    },
    { id: 'telegraph-club', reason: 'The same courage, quieter, in 1950s San Francisco.' },
    { id: 'darius', reason: 'Warm and honest about working out who you are.' },
  ],
  'lesbianas-guide': [
    {
      id: 'telegraph-club',
      reason: 'If you loved Yami finding her people, wait until you meet Lily.',
    },
    { id: 'she-gets-the-girl', reason: 'Lighter and funnier — two girls, one very bad plan.' },
    { id: 'darius', reason: 'Another kid caught between two families and two languages.' },
  ],
  'telegraph-club': [
    { id: 'darius', reason: 'Quieter and warmer, and just as honest about who you are.' },
    {
      id: 'she-gets-the-girl',
      reason: 'Something lighter next — a romance that keeps tripping over itself.',
    },
    { id: 'lesbianas-guide', reason: 'Funny and sharp, with a lot going on underneath.' },
  ],
  darius: [
    {
      id: 'other-words',
      reason: 'Another kid caught between two homes, in poems you can read in a sitting.',
    },
    {
      id: 'front-desk',
      reason: 'Another family making a life in a country that keeps testing it.',
    },
    { id: 'telegraph-club', reason: 'Careful and quiet, about finding the room where you fit.' },
  ],
  rump: [
    {
      id: 'amari',
      reason: 'You just backed a hero nobody believed in — Amari has a magical Bureau behind her.',
    },
    { id: 'wild-robot', reason: 'Another underdog working out what it’s actually for.' },
    { id: 'trap-a-tiger', reason: 'More folklore, and a bargain you should probably not take.' },
  ],
  'lucky-cap': [
    {
      id: 'ghost',
      reason:
        'Another kid with more talent than he knows what to do with, and a coach who spots it.',
    },
    { id: 'crossover', reason: 'The same sport-sized feelings, told in verse that moves.' },
    { id: 'new-kid', reason: 'Middle school, drawn — funny and uncomfortably accurate.' },
  ],
  'dog-man': [
    {
      id: 'amulet',
      reason: 'Epic graphic-novel fantasy — perfect after Dog Man, with a much bigger adventure.',
    },
    { id: 'new-kid', reason: 'More comics, this time about surviving a new school.' },
    { id: 'wild-robot', reason: 'Short chapters and a lot of heart, if you want words next.' },
  ],
  amulet: [
    {
      id: 'new-kid',
      reason: 'A graphic novel about real life this time — funny, honest, expressive art.',
    },
    { id: 'amari', reason: 'Another kid handed a world nobody warned her about.' },
    { id: 'dog-man', reason: 'Something ridiculous, to clear your head.' },
  ],
  'new-kid': [
    {
      id: 'front-desk',
      reason: 'Another kid working out where he fits — Mia runs a whole motel while she’s at it.',
    },
    { id: 'wonder', reason: 'The same school year, from a very different desk.' },
    { id: 'amulet', reason: 'More comics, with a whole world to get lost in.' },
  ],
  amari: [
    {
      id: 'last-cuentista',
      reason: 'More magic and a bigger mystery, out past the edge of the solar system.',
    },
    { id: 'amulet', reason: 'Another kid in over her head, drawn rather than described.' },
    { id: 'rump', reason: 'A funnier kind of magic, and a name worth arguing about.' },
  ],
  wonder: [
    {
      id: 'merci-suarez',
      reason: 'Another kid holding a lot together — Merci’s family will stay with you.',
    },
    { id: 'new-kid', reason: 'The same middle-school feeling, in panels.' },
    { id: 'front-desk', reason: 'A kid carrying far more than a kid should, and funny about it.' },
  ],
  crossover: [
    {
      id: 'ghost',
      reason: 'Another kid with a gift and a temper, and a coach worth listening to.',
    },
    { id: 'brown-girl', reason: 'More verse — a whole childhood in short lines.' },
    { id: 'other-words', reason: 'Poems again, and a girl learning a country one word at a time.' },
  ],
  'front-desk': [
    {
      id: 'other-words',
      reason: 'Another new-country story, this one in poems — short lines, big feelings.',
    },
    { id: 'merci-suarez', reason: 'Another kid doing grown-up work and still being a kid.' },
    { id: 'refugee', reason: 'The journey Mia’s family is on the far side of.' },
  ],
  ghost: [
    {
      id: 'crossover',
      reason: 'Fast, rhythmic and full of heart — try this one as an audiobook.',
    },
    { id: 'lucky-cap', reason: 'Another kid whose luck and talent get tangled up.' },
    { id: 'new-kid', reason: 'Another kid sizing up a school that wasn’t built for him.' },
  ],
  esperanza: [
    {
      id: 'refugee',
      reason: 'Three kids, three escapes, three eras — gripping from the first page.',
    },
    { id: 'brown-girl', reason: 'Another childhood you can feel the heat and the dust of.' },
    {
      id: 'roll-of-thunder',
      reason: 'The same country, from inside one family holding its ground.',
    },
  ],
  holes: [
    {
      id: 'hatchet',
      reason: 'Pure survival tension: one boy, one hatchet and a great deal of forest.',
    },
    { id: 'wild-robot', reason: 'Another castaway working out the rules of somewhere new.' },
    { id: 'amari', reason: 'Another kid dropped somewhere impossible, with a lot more magic.' },
  ],
  refugee: [
    { id: 'esperanza', reason: 'A moving story of courage and starting over.' },
    { id: 'front-desk', reason: 'What arriving looks like once the journey is over.' },
    { id: 'other-words', reason: 'The same arrival, told in short poems.' },
  ],
  'merci-suarez': [
    {
      id: 'front-desk',
      reason: 'Another kid doing grown-up work and still being a kid about it.',
    },
    { id: 'wonder', reason: 'Another school year that asks a lot of one kid.' },
    { id: 'new-kid', reason: 'The same middle school, drawn.' },
  ],
  'trap-a-tiger': [
    { id: 'last-cuentista', reason: 'More folklore turned into something strange and beautiful.' },
    { id: 'amari', reason: 'More magic, more family, and a mystery to pull at.' },
    { id: 'wild-robot', reason: 'Quiet and strange — a robot learning a wild island.' },
  ],
  'last-cuentista': [
    {
      id: 'wild-robot',
      reason: 'A gentler kind of strange — a robot working out how to belong on a wild island.',
    },
    { id: 'trap-a-tiger', reason: 'Folklore again, with a tiger who wants something back.' },
    { id: 'amari', reason: 'More magic and a bigger mystery, closer to home.' },
  ],
  'show-me-a-sign': [
    { id: 'other-words', reason: 'Another girl finding her own language for the world.' },
    { id: 'esperanza', reason: 'Another girl whose whole world changes in a season.' },
    { id: 'roll-of-thunder', reason: 'Another family holding a line, and a girl watching them.' },
  ],
  'other-words': [
    { id: 'brown-girl', reason: 'A memoir in verse — try it on audiobook for the full magic.' },
    { id: 'crossover', reason: 'More verse, faster on its feet.' },
    { id: 'front-desk', reason: 'The same arriving, told straight through.' },
  ],
  'brown-girl': [
    { id: 'esperanza', reason: 'Another childhood you can feel the heat and the dust of.' },
    { id: 'other-words', reason: 'More verse, and another girl between two languages.' },
    { id: 'roll-of-thunder', reason: 'The same history, told from inside one family.' },
  ],
  'wild-robot': [
    {
      id: 'last-cuentista',
      reason: 'If you liked Roz learning to be alive, wait until you meet Petra.',
    },
    { id: 'hatchet', reason: 'Surviving the woods again, this time with no circuitry.' },
    { id: 'amulet', reason: 'Another world to work out, drawn rather than described.' },
  ],
  'roll-of-thunder': [
    { id: 'brown-girl', reason: 'The same history, told from inside one family’s memory.' },
    { id: 'esperanza', reason: 'Another family pushed off its own land.' },
    { id: 'refugee', reason: 'Three escapes, three eras, one long run for safety.' },
  ],
  hatchet: [
    { id: 'holes', reason: 'A clever mystery where every last detail pays off.' },
    { id: 'wild-robot', reason: 'Another castaway learning the ground it landed on.' },
    { id: 'refugee', reason: 'Survival again, with people on the other side of it.' },
  ],
}
for (const [id, next] of Object.entries(NEXT_UP)) {
  BOOKS[id].nextUp = next
}

/* No `bennyPicks` here. The shelf is the Recommendation Engine speaking, and
   that belongs to the prototype that has an engine behind it — Book Discovery
   passes its own `BENNY_PICKS`, drawn from the same list its Discover page
   uses. Handed out with the shared fixtures, every prototype that spread them
   grew a recommendation shelf it had nothing to recommend from. `LogFlow`
   still takes the prop; it just defaults to none. */
export const LOG_FIXTURES = {
  books: BOOKS,
  recentlyLogged: RECENTLY_LOGGED,
  readingList: READING_LIST,
  readingListChallenges: READING_LIST_CHALLENGES,
  reader: READER,
  readers: OTHER_READERS,
}
