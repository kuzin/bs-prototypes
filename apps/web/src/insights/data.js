// Real numbers from the production Insights Dashboard screenshot (2026-05-26)
// kept here so each concept renders the same content and the only thing
// changing is *when* the data shows up.

export const METRICS = [
  { id: 'active-readers',       label: 'Active Readers',       value: 18   },
  { id: 'new-registrations',    label: 'New Registrations',    value: 4    },
  { id: 'challenge-completions',label: 'Challenge Completions',value: 0    },
  { id: 'completed-activities', label: 'Completed Activities', value: 0    },
  { id: 'rewards-redeemed',     label: 'Rewards Redeemed',     value: 0    },
  { id: 'badges-earned',        label: 'Badges Earned',        value: 4    },
  { id: 'reviews-submitted',    label: 'Reviews Submitted',    value: 0    },
  { id: 'books-read',           label: 'Books Read',           value: 15   },
  { id: 'minutes-read',         label: 'Minutes Read',         value: 2040 },
]

// ── Top books ───────────────────────────────────────────────────────────
// Open Library cover URLs are derived from ISBN. We fall back to a colored
// rectangle with the title overlaid when the cover image fails to load.
export const TOP_BOOKS = [
  { title: 'Bird Builds a Nest',                  author: 'Martin Jenkins',           reads: 6, isbn: '0763699276', color: '#C8E2EE' },
  { title: 'Wash Wash Wash!',                     author: 'Pamela Chanko',            reads: 5, isbn: '0531020371', color: '#D43233' },
  { title: 'Project Hail Mary',                   author: 'Andy Weir',                reads: 4, isbn: '0593135202', color: '#0D0D0D' },
  { title: 'The Incredibles',                     author: 'Disney Press',             reads: 4, isbn: '0786845082', color: '#1E40AF' },
  { title: 'Rites of the Starling',               author: 'Devney Perry',             reads: 3, isbn: '1737567989', color: '#A67B4A' },
  { title: 'Papa, Please Get the Moon for Me',    author: 'Eric Carle',               reads: 3, isbn: '0689838743', color: '#0F1F3F' },
  { title: 'Miss Willie',                         author: 'Janice Holt Giles',        reads: 2, isbn: '0813190304', color: '#D7C29D' },
  { title: 'How the Grinch Stole Christmas',      author: 'Dr. Seuss',                reads: 2, isbn: '0394800796', color: '#D43233' },
  { title: '23rd Midnight',                       author: 'James Patterson',          reads: 2, isbn: '0316411493', color: '#1A1A1A' },
  { title: 'A Court of Wings and Ruin',           author: 'Sarah J. Maas',            reads: 2, isbn: '1635575605', color: '#6B1F47' },
  { title: 'Beautiful Venom',                     author: 'Rina Kent',                reads: 1, isbn: '1685451187', color: '#0F0F0F' },
  { title: 'Bookshops & Bonedust',                author: 'Travis Baldree',           reads: 1, isbn: '1250886120', color: '#10243A' },
]

// Open Library returns a 1×1 placeholder when a cover isn't available unless
// we pass default=false, which makes the URL 404 so our onError fallback fires.
export function coverUrl(isbn, size = 'L') {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg?default=false`
}

// ── Top badges ──────────────────────────────────────────────────────────
// Inline SVG illustrations replace the emoji placeholders. Each badge has a
// shape + color so we don't have to ship raster assets.
export const TOP_BADGES = [
  { id: 'book-stack',  label: 'Book Stack',  earned: 3, art: 'book-stack' },
  { id: 'registered',  label: 'Registered',  earned: 1, art: 'star-shield' },
]

// ── Ages histogram ──────────────────────────────────────────────────────
export const AGES = [
  { age: '5',   count: 0  },
  { age: '6',   count: 0  },
  { age: '7',   count: 0  },
  { age: '8',   count: 2  },
  { age: '9',   count: 0  },
  { age: '10',  count: 1  },
  { age: '11',  count: 0  },
  { age: '12',  count: 0  },
  { age: '13',  count: 0  },
  { age: '14',  count: 0  },
  { age: '15',  count: 0  },
  { age: '16',  count: 0  },
  { age: '17',  count: 0  },
  { age: '18',  count: 0  },
  { age: '19+', count: 1  },
]

// ── Mock readers used for the detail modals ─────────────────────────────
const PROGRAMS = ['Kids Summer 2026', 'Read It Your Way', 'Adult Summer 2026', 'Lincoln Reading Club']

const READERS = [
  { first: 'Brynn',    last: 'Leidy',     age: 8.0,  program: 'Read It Your Way',   startedOn: '2026-05-25 22:04:17 -0400' },
  { first: 'Joshua',   last: 'Barnell',   age: 10.0, program: 'Kids Summer 2026',   startedOn: '2026-05-26 00:36:49 -0400' },
  { first: 'Elijah',   last: 'Barnell',   age: 8.0,  program: 'Kids Summer 2026',   startedOn: '2026-05-26 00:37:50 -0400' },
  { first: 'Ashley',   last: 'Barnell',   age: '19+',program: 'Adult Summer 2026',  startedOn: '2026-05-26 00:38:17 -0400' },
  { first: 'Maya',     last: 'Patel',     age: 9.0,  program: 'Kids Summer 2026',   startedOn: '2026-05-22 18:11:02 -0400' },
  { first: 'Liam',     last: 'Chen',      age: 10.0, program: 'Kids Summer 2026',   startedOn: '2026-05-22 09:45:31 -0400' },
  { first: 'Ava',      last: 'Nguyen',    age: 7.0,  program: 'Kids Summer 2026',   startedOn: '2026-05-21 14:23:19 -0400' },
  { first: 'Noah',     last: 'Garcia',    age: 11.0, program: 'Lincoln Reading Club', startedOn: '2026-05-21 11:08:53 -0400' },
  { first: 'Olivia',   last: 'Robinson',  age: 12.0, program: 'Lincoln Reading Club', startedOn: '2026-05-20 19:33:00 -0400' },
  { first: 'Ethan',    last: 'Walker',    age: 8.0,  program: 'Kids Summer 2026',   startedOn: '2026-05-20 16:47:18 -0400' },
  { first: 'Sofia',    last: 'Martinez',  age: 9.0,  program: 'Kids Summer 2026',   startedOn: '2026-05-20 10:02:44 -0400' },
  { first: 'Jackson',  last: 'Cooper',    age: 7.0,  program: 'Kids Summer 2026',   startedOn: '2026-05-19 21:14:01 -0400' },
  { first: 'Isabella', last: 'Hughes',    age: 10.0, program: 'Lincoln Reading Club', startedOn: '2026-05-19 17:36:25 -0400' },
  { first: 'Aiden',    last: 'Ramirez',   age: 11.0, program: 'Lincoln Reading Club', startedOn: '2026-05-19 09:55:12 -0400' },
  { first: 'Mia',      last: 'Brooks',    age: 9.0,  program: 'Kids Summer 2026',   startedOn: '2026-05-18 20:41:09 -0400' },
  { first: 'Lucas',    last: 'Foster',    age: 12.0, program: 'Lincoln Reading Club', startedOn: '2026-05-18 13:27:50 -0400' },
  { first: 'Amelia',   last: 'Bennett',   age: 8.0,  program: 'Kids Summer 2026',   startedOn: '2026-05-18 08:19:33 -0400' },
  { first: 'Henry',    last: 'Russell',   age: 10.0, program: 'Lincoln Reading Club', startedOn: '2026-05-17 22:54:08 -0400' },
]

// Each metric exposes a different detail view: the columns, the rows, and a
// caption explaining how the table was computed.
export const METRIC_DETAILS = {
  'active-readers': {
    title: 'Active Readers',
    caption: 'Readers who have logged a reading session in the selected period. A reader logging in 2 of the selected challenges is counted once.',
    columns: [
      { key: 'first',       label: 'First Name' },
      { key: 'last',        label: 'Last Name'  },
      { key: 'age',         label: 'Age'        },
      { key: 'program',     label: 'Program'    },
      { key: 'lastSession', label: 'Last Session' },
    ],
    rows: READERS.slice(0, 18).map((r, i) => ({
      ...r,
      lastSession: `2026-05-${(26 - (i % 6)).toString().padStart(2, '0')} ${(8 + (i % 12)).toString().padStart(2, '0')}:${(((i * 7) % 60)).toString().padStart(2, '0')}`,
    })),
  },
  'new-registrations': {
    title: 'New Registrations',
    caption: 'Total of readers who have registered for a challenge. A reader who has registered for 2 of the selected challenges will be included as 2 readers in this calculation.',
    columns: [
      { key: 'first',     label: 'First Name' },
      { key: 'last',      label: 'Last Name'  },
      { key: 'age',       label: 'Age'        },
      { key: 'program',   label: 'Program'    },
      { key: 'startedOn', label: 'Started On' },
      { key: 'completedOn', label: 'Completed On' },
    ],
    rows: READERS.slice(0, 4).map(r => ({ ...r, completedOn: '' })),
  },
  'challenge-completions': {
    title: 'Challenge Completions',
    caption: 'Readers who have completed all required activities in a challenge.',
    columns: [
      { key: 'first',     label: 'First Name' },
      { key: 'last',      label: 'Last Name'  },
      { key: 'age',       label: 'Age'        },
      { key: 'program',   label: 'Program'    },
      { key: 'completedOn', label: 'Completed On' },
    ],
    rows: [],
    emptyMessage: 'No readers have completed a challenge yet in this period.',
  },
  'completed-activities': {
    title: 'Completed Activities',
    caption: 'Activities marked complete by a reader (could be a custom activity, badge requirement, or reward).',
    columns: [
      { key: 'first',     label: 'First Name' },
      { key: 'last',      label: 'Last Name'  },
      { key: 'activity',  label: 'Activity'   },
      { key: 'completedOn', label: 'Completed On' },
    ],
    rows: [],
    emptyMessage: 'No activities completed in this period.',
  },
  'rewards-redeemed': {
    title: 'Rewards Redeemed',
    caption: 'Rewards that have been redeemed by a reader.',
    columns: [
      { key: 'first',     label: 'First Name' },
      { key: 'last',      label: 'Last Name'  },
      { key: 'reward',    label: 'Reward'     },
      { key: 'redeemedOn', label: 'Redeemed On' },
    ],
    rows: [],
    emptyMessage: 'No rewards redeemed in this period.',
  },
  'badges-earned': {
    title: 'Badges Earned',
    caption: 'Earned badges for completing reading milestones.',
    columns: [
      { key: 'first',     label: 'First Name' },
      { key: 'last',      label: 'Last Name'  },
      { key: 'badge',     label: 'Badge'      },
      { key: 'earnedOn',  label: 'Earned On'  },
    ],
    rows: [
      { first: 'Brynn',  last: 'Leidy',   badge: 'Registered',  earnedOn: '2026-05-25 22:04' },
      { first: 'Joshua', last: 'Barnell', badge: 'Book Stack',  earnedOn: '2026-05-26 09:12' },
      { first: 'Elijah', last: 'Barnell', badge: 'Book Stack',  earnedOn: '2026-05-26 10:33' },
      { first: 'Maya',   last: 'Patel',   badge: 'Book Stack',  earnedOn: '2026-05-25 14:18' },
    ],
  },
  'reviews-submitted': {
    title: 'Reviews Submitted',
    caption: 'Book reviews submitted by readers.',
    columns: [
      { key: 'first',     label: 'First Name' },
      { key: 'last',      label: 'Last Name'  },
      { key: 'book',      label: 'Book'       },
      { key: 'submittedOn', label: 'Submitted On' },
    ],
    rows: [],
    emptyMessage: 'No reviews submitted in this period.',
  },
  'books-read': {
    title: 'Books Read',
    caption: 'Books logged by readers in the selected period.',
    columns: [
      { key: 'first',     label: 'First Name' },
      { key: 'last',      label: 'Last Name'  },
      { key: 'title',     label: 'Title'      },
      { key: 'author',    label: 'Author'     },
      { key: 'loggedOn',  label: 'Logged On'  },
    ],
    rows: [
      { first: 'Brynn',    last: 'Leidy',    title: 'Bird Builds a Nest',                   author: 'Martin Jenkins',   loggedOn: '2026-05-25 22:14' },
      { first: 'Joshua',   last: 'Barnell',  title: 'Wash Wash Wash!',                      author: 'Pamela Chanko',    loggedOn: '2026-05-26 09:45' },
      { first: 'Elijah',   last: 'Barnell',  title: 'Wash Wash Wash!',                      author: 'Pamela Chanko',    loggedOn: '2026-05-26 10:12' },
      { first: 'Maya',     last: 'Patel',    title: 'Project Hail Mary',                    author: 'Andy Weir',        loggedOn: '2026-05-22 18:25' },
      { first: 'Liam',     last: 'Chen',     title: 'How the Grinch Stole Christmas',       author: 'Dr. Seuss',        loggedOn: '2026-05-22 10:01' },
      { first: 'Ava',      last: 'Nguyen',   title: 'Bird Builds a Nest',                   author: 'Martin Jenkins',   loggedOn: '2026-05-21 14:48' },
      { first: 'Noah',     last: 'Garcia',   title: '23rd Midnight',                        author: 'James Patterson',  loggedOn: '2026-05-21 11:32' },
      { first: 'Olivia',   last: 'Robinson', title: 'A Court of Wings and Ruin',            author: 'Sarah J. Maas',    loggedOn: '2026-05-20 19:55' },
      { first: 'Ethan',    last: 'Walker',   title: 'The Incredibles',                      author: 'Disney Press',     loggedOn: '2026-05-20 17:02' },
      { first: 'Sofia',    last: 'Martinez', title: 'Papa, Please Get the Moon for Me',     author: 'Eric Carle',       loggedOn: '2026-05-20 10:21' },
      { first: 'Jackson',  last: 'Cooper',   title: 'The Incredibles',                      author: 'Disney Press',     loggedOn: '2026-05-19 21:30' },
      { first: 'Isabella', last: 'Hughes',   title: 'Beautiful Venom',                      author: 'Rina Kent',        loggedOn: '2026-05-19 17:55' },
      { first: 'Aiden',    last: 'Ramirez',  title: 'Bookshops & Bonedust',                 author: 'Travis Baldree',   loggedOn: '2026-05-19 10:13' },
      { first: 'Mia',      last: 'Brooks',   title: 'Miss Willie',                          author: 'Janice Holt Giles', loggedOn: '2026-05-18 20:58' },
      { first: 'Lucas',    last: 'Foster',   title: 'Rites of the Starling',                author: 'Devney Perry',     loggedOn: '2026-05-18 13:44' },
    ],
  },
  'minutes-read': {
    title: 'Minutes Read',
    caption: 'Total minutes logged across all reading sessions in this period.',
    columns: [
      { key: 'first',     label: 'First Name' },
      { key: 'last',      label: 'Last Name'  },
      { key: 'minutes',   label: 'Minutes',   align: 'right' },
      { key: 'sessions',  label: 'Sessions',  align: 'right' },
    ],
    rows: READERS.slice(0, 14).map((r, i) => ({
      ...r,
      minutes: Math.round(80 + (Math.sin(i * 0.7) + 1) * 100) + (i * 4),
      sessions: 1 + (i % 5),
    })),
  },
}

export const QUERY_TILES = [
  ...METRICS.map(m => ({ id: m.id, kind: 'metric' })),
  { id: 'top-books',  kind: 'panel' },
  { id: 'top-badges', kind: 'panel' },
  { id: 'ages',       kind: 'panel' },
]

export const TOTAL_QUERIES = QUERY_TILES.length // 12 queries total

export function fmt(n) {
  return n.toLocaleString('en-US')
}
