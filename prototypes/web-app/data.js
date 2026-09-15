// The reader's own content for the pages logging-flow's dashboard doesn't
// carry — badges, achievements, and the rest as they arrive.
//
// It lives here rather than in `logging-flow/data.js` because it belongs to the
// reader app as a whole, not to the logging flow: this prototype is where the
// four tabs that had never had a page (Friends, Leaderboards, Reviews, All
// Badges) get built out.

// ─── Badges ──────────────────────────────────────────────────────────────────
// The profile's "Earned Badges" page lists only what a reader has
// (`profiles/_badges_list.html.haml`); a challenge's Badges tab shows the whole
// set, graying what's still to come and stating the requirement in the footer
// (`earnables/grid/_earnable.html.haml`). This page does both, so a reader can
// see what's next without opening a challenge.
//
// The art is Beanstack's own, per challenge — there is no generic badge set in
// the product, because a badge belongs to the challenge that awards it. `set`
// and `art` name a file under `public/challenge-badges/`.
//
// `type` is the app's own badge taxonomy — `appropriate_badges_title` yields
// Reading/Logging, Activity, Review, Point, Challenge and Donation Badges.

const earned = (set, art, name, date, blurb, type = 'logging') => ({
  set,
  art,
  name,
  date,
  blurb,
  type,
})

// `have`/`need` drive the ring and the footer line the app writes as
// "12/30 Minutes Completed".
const locked = (set, art, name, blurb, have, need, unit, type = 'logging') => ({
  set,
  art,
  name,
  blurb,
  have,
  need,
  unit,
  type,
  locked: true,
})

const SPRING = 'spring-into-reading'
const LOVE = 'for-the-love-of-reading'
const COMICS = 'comics-choice'

export const BADGES = [
  earned(SPRING, 'butterfly', 'Butterfly', 'Apr 6, 2026', 'Earned for logging 100 minutes!'),
  earned(SPRING, 'rainbow', 'Rainbow', 'Apr 14, 2026', 'Earned for logging 7 days in a row!'),
  earned(
    SPRING,
    'completed',
    'Spring Into Reading',
    'Apr 30, 2026',
    'Earned for completing Spring Into Reading!',
    'challenge',
  ),
  earned(LOVE, 'heart-balloon', 'Heart Balloon', 'May 12, 2026', 'Earned for finishing 5 books!'),
  earned(
    LOVE,
    'writing-love-letter',
    'Writing a Love Letter',
    'May 30, 2026',
    'Earned for writing your first review!',
    'review',
  ),
  earned(
    COMICS,
    'registered',
    'Comics Choice',
    'Jun 1, 2026',
    'Earned for joining Comics Choice!',
    'challenge',
  ),
  earned(COMICS, 'pow', 'POW', 'Jun 9, 2026', 'Earned for finishing 3 graphic novels!'),
  locked(SPRING, 'bees', 'Bees', 'Log 1,000 minutes of reading.', 620, 1000, 'Minutes'),
  locked(
    LOVE,
    'rose',
    'Rose',
    'Write reviews for three different titles.',
    1,
    3,
    'Reviews',
    'review',
  ),
  locked(
    LOVE,
    'cupids-arrow',
    "Cupid's Arrow",
    'Log a title from five different genres.',
    3,
    5,
    'Books',
  ),
  locked(
    COMICS,
    'bingo',
    'Bingo!',
    'Fill a whole row of the Comics Choice card.',
    3,
    5,
    'Activity',
    'activity',
  ),
  locked(
    COMICS,
    'full-card',
    'Full Card',
    'Fill every square on the Comics Choice card.',
    7,
    25,
    'Activity',
    'activity',
  ),
  locked(
    SPRING,
    'umbrella',
    'Umbrella',
    'Log reading on 30 days in a single month.',
    11,
    30,
    'Days',
  ),
  locked(SPRING, 'strawberries', 'Strawberries', 'Read 2,000 pages.', 88, 2000, 'Pages'),
]

// ─── Achievements ────────────────────────────────────────────────────────────
// `art` picks the illustrated medallion in books/AchievementArt.jsx.

const achievement = (name, date, detail, art = 'books') => ({ name, date, detail, art })

export const ACHIEVEMENTS = [
  achievement('Read 12 books', 'Jun 22, 2026', 'Grade 6 goal was 10', 'books'),
  achievement('Logged 40 sessions', 'Jun 18, 2026', 'Most in Room 14 this term', 'streak'),
  achievement('Wrote 4 reviews', 'May 30, 2026', 'Two of them on nonfiction', 'reviews'),
  achievement('Finished a series', 'May 12, 2026', 'All nine Amulet books', 'series'),
  achievement('Top of the class', 'Apr 28, 2026', 'Most minutes in Room 14 in April', 'top'),
]

// ─── Friends ─────────────────────────────────────────────────────────────────
// The real card (`profiles/_friend.html.haml`) is a colour band, the reader's
// avatar or initials over it, their name, and their current streak — or a
// "Pending Invite" tag where the streak would be. The kebab offers "View
// Friend" and "Remove Friend" (or "Cancel this Invitation" on a pending one).
//
// The photographs are the same six readers Book Discovery uses, so a face here
// is the same person there.

const friend = (id, name, initials, color, grade, streak, minutes, books, avatar, extra = {}) => ({
  id,
  name,
  initials,
  color,
  grade,
  streak,
  minutesThisWeek: minutes,
  booksThisYear: books,
  avatar: avatar ? `/bs-prototypes/avatars/${id}.jpg` : null,
  ...extra,
})

// A friend's own badges, from the same three challenges the reader is in.
const fbadge = (set, art, name, date) => ({ set, art, name, date })
const log = (book, date, minutes) => ({ book, date, minutes })

export const FRIENDS = [
  friend('jayden', 'Jayden P.', 'JP', '#196DD5', 'Grade 5', 21, 214, 34, true, {
    since: 'Friends since Sept 2025',
    longestStreak: 48,
    minutesLogged: 1840,
    challenges: ['spring', 'arresting'],
    badges: [
      fbadge(SPRING, 'rainbow', 'Rainbow', 'Apr 14, 2026'),
      fbadge(COMICS, 'pow', 'POW', 'Jun 2, 2026'),
      fbadge(COMICS, 'zap', 'ZAP', 'Jun 9, 2026'),
    ],
    achievements: [
      achievement('Read 30 books', 'May 6, 2026', 'Grade 5 goal was 25', 'books'),
      achievement('Logged 100 days', 'Apr 22, 2026', 'Longest run in his class', 'streak'),
    ],
    logged: [
      log('dog-man', 'Jun 9, 2026', 25),
      log('amulet', 'Jun 7, 2026', 30),
      log('rump', 'Jun 4, 2026', 45),
      log('superscience', 'Jun 2, 2026', 15),
      log('lucky-cap', 'May 28, 2026', 40),
    ],
  }),
  friend('sofia', 'Sofia R.', 'SR', '#DB2777', 'Grade 4', 14, 186, 28, true, {
    since: 'Friends since Jan 2026',
    longestStreak: 31,
    minutesLogged: 1420,
    challenges: ['love-hurts'],
    badges: [
      fbadge(LOVE, 'rose', 'Rose', 'May 3, 2026'),
      fbadge(LOVE, 'heart-balloon', 'Heart Balloon', 'May 18, 2026'),
    ],
    achievements: [achievement('Wrote 10 reviews', 'May 20, 2026', 'Most in Room 12', 'reviews')],
    logged: [
      log('telegraph-club', 'Jun 8, 2026', 35),
      log('darius', 'Jun 5, 2026', 20),
      log('storyworks', 'Jun 1, 2026', 15),
      log('she-gets-the-girl', 'May 27, 2026', 50),
    ],
  }),
  friend('noah', 'Noah K.', 'NK', '#0CA7BC', 'Grade 5', 9, 152, 22, true, {
    since: 'Friends since Oct 2025',
    longestStreak: 26,
    minutesLogged: 1105,
    challenges: ['arresting'],
    badges: [fbadge(COMICS, 'bam', 'BAM', 'Jun 6, 2026')],
    achievements: [
      achievement('Finished a series', 'May 2, 2026', 'All nine Amulet books', 'series'),
    ],
    logged: [
      log('amulet', 'Jun 6, 2026', 28),
      log('dog-man', 'Jun 3, 2026', 22),
      log('scope', 'May 30, 2026', 15),
    ],
  }),
  friend('emma', 'Emma L.', 'EL', '#0BA85F', 'Grade 4', 0, 131, 19, true, {
    since: 'Friends since Feb 2026',
    longestStreak: 17,
    minutesLogged: 890,
    challenges: ['spring'],
    badges: [fbadge(SPRING, 'butterfly', 'Butterfly', 'Apr 9, 2026')],
    achievements: [],
    logged: [log('lucky-cap', 'Jun 2, 2026', 30), log('scholastic-news', 'May 29, 2026', 12)],
  }),
  friend('diego', 'Diego H.', 'DH', '#0891B2', 'Grade 5', 6, 118, 17, true, {
    since: 'Friends since Nov 2025',
    longestStreak: 19,
    minutesLogged: 760,
    challenges: ['arresting'],
    badges: [fbadge(COMICS, 'boom', 'BOOM', 'Jun 4, 2026')],
    achievements: [],
    logged: [log('dog-man', 'Jun 4, 2026', 20), log('rump', 'May 31, 2026', 25)],
  }),
  friend('priya', 'Priya S.', 'PS', '#9333EA', 'Grade 4', 31, 205, 30, true, {
    since: 'Friends since Sept 2025',
    longestStreak: 54,
    minutesLogged: 1990,
    challenges: ['spring', 'love-hurts'],
    badges: [
      fbadge(SPRING, 'bees', 'Bees', 'Apr 28, 2026'),
      fbadge(LOVE, 'bouquet', 'Bouquet', 'May 14, 2026'),
      fbadge(SPRING, 'cherry-blossom', 'Cherry Blossom', 'Apr 20, 2026'),
    ],
    achievements: [
      achievement('Top of the class', 'May 1, 2026', 'Most minutes in Room 12 in April', 'top'),
    ],
    logged: [
      log('telegraph-club', 'Jun 10, 2026', 45),
      log('amulet', 'Jun 7, 2026', 35),
      log('storyworks', 'Jun 3, 2026', 15),
      log('darius', 'May 30, 2026', 40),
    ],
  }),
  friend('liam', 'Liam T.', 'LT', '#B43DD0', 'Grade 6', 3, 96, 12, false, {
    since: 'Friends since Mar 2026',
    longestStreak: 11,
    minutesLogged: 430,
    challenges: [],
    badges: [],
    achievements: [],
    logged: [log('scope', 'Jun 1, 2026', 15)],
  }),
]

export const getFriend = (id) => FRIENDS.find((f) => f.id === id)

export const PENDING_INVITES = [
  { id: 'ava', name: 'Ava M.', initials: 'AM', grade: 'Grade 3', pending: true },
  { id: 'zoe', name: 'Zoe B.', initials: 'ZB', grade: 'Grade 3', pending: true },
]

// Two waiting, so the bar's copy pluralises and the menu has a queue to work
// through — the app keeps it open between answers for exactly that.
export const FRIEND_REQUESTS = [
  { id: 'maya', name: 'Maya C.', initials: 'MC', color: '#F0966F', grade: 'Grade 4' },
  { id: 'theo', name: 'Theo N.', initials: 'TN', color: '#0F766E', grade: 'Grade 6' },
]

// ─── Leaderboards ────────────────────────────────────────────────────────────
// `leaderboards/index.html.haml` tabs three boards — Friends, Grade, School —
// each over the same table: rank, reader, and the log type's total. The period
// dropdown and the log-type tabs are the app's own wording.
//
// One departure: the app's Friends board ranks only confirmed friends, so a
// reader who has two friends sees a board of three and there is nothing on the
// page to do about it. Here the board also carries the readers at the site you
// haven't added, which gives the ranking someone to be a ranking against and
// gives the page its one useful action — the same "Add Friend" the Friends tab
// offers, on the row where you noticed the person.

export const LEADERBOARD_BOARDS = [
  { id: 'friends', label: 'Friends' },
  { id: 'grade', label: 'Grade' },
  { id: 'school', label: 'School' },
]

export const LEADERBOARD_PERIODS = [
  { value: 'week', label: 'This Week (Since Monday)' },
  { value: 'month', label: 'This Month (Since the 1st)' },
]

export const LEADERBOARD_TYPES = [
  { id: 'minutes', label: 'Minutes', column: 'Minutes logged' },
  { id: 'books', label: 'Books', column: 'Books read' },
]

// The three boards rank three different things — the app's own table header
// says "Reader" on the friends board and "Grade" / "School" on the other two.

const ME = {
  id: 'olivia',
  name: 'Olivia M.',
  initials: 'OM',
  color: '#F26430',
  grade: 'Grade 6',
  minutesThisWeek: 176,
  booksThisYear: 27,
  isMe: true,
}

const GRADES = [
  { id: 'g6', name: '6th grade', minutesThisWeek: 412, booksThisYear: 388, isMe: true },
  { id: 'g5', name: '5th grade', minutesThisWeek: 388, booksThisYear: 341 },
  { id: 'g7', name: '7th grade', minutesThisWeek: 271, booksThisYear: 302 },
  { id: 'g4', name: '4th grade', minutesThisWeek: 244, booksThisYear: 286 },
  { id: 'g8', name: '8th grade', minutesThisWeek: 190, booksThisYear: 214 },
]

// Readers at the site who aren't friends. `pending` is one you've already
// asked — `profile.has_pending_friends?` in the app, the state between asking
// and being accepted.
const otherReader = (id, name, initials, color, grade, minutes, books, pending = false) => ({
  id,
  name,
  initials,
  color,
  grade,
  minutesThisWeek: minutes,
  booksThisYear: books,
  pending,
})

export const SITE_READERS = [
  otherReader('ravi', 'Ravi K.', 'RK', '#0F766E', 'Grade 6', 233, 31),
  otherReader('nina', 'Nina B.', 'NB', '#7C5CFA', 'Grade 5', 162, 24),
  otherReader('kai', 'Kai T.', 'KT', '#B45309', 'Grade 6', 121, 19),
  otherReader('ava', 'Ava M.', 'AM', '#0EA5A5', 'Grade 3', 148, 22, true),
  otherReader('zoe', 'Zoe B.', 'ZB', '#DC493A', 'Grade 3', 97, 16, true),
]

const SCHOOLS = [
  { id: 'magnolia', name: 'Magnolia Middle', minutesThisWeek: 198, booksThisYear: 174, isMe: true },
  { id: 'oak', name: 'Oak Elementary', minutesThisWeek: 157, booksThisYear: 168 },
  { id: 'hickory', name: 'Hickory Middle School', minutesThisWeek: 104, booksThisYear: 131 },
  { id: 'juniper', name: 'Juniper Elementary', minutesThisWeek: 92, booksThisYear: 118 },
  { id: 'cedar', name: 'Cedar Ridge Middle', minutesThisWeek: 76, booksThisYear: 94 },
]

// A month is roughly four and a bit weeks of the same reading.
const PERIOD_FACTOR = { week: 1, month: 4.3 }

export function leaderboardRows(board, type, period) {
  const pool =
    board === 'friends'
      ? [...FRIENDS.map((f) => ({ ...f, isFriend: true })), ME, ...SITE_READERS]
      : board === 'grade'
        ? GRADES
        : SCHOOLS
  const factor = PERIOD_FACTOR[period] ?? 1
  return pool
    .map((p) => ({
      ...p,
      value:
        type === 'minutes'
          ? Math.round(p.minutesThisWeek * factor)
          : Math.max(1, Math.round((p.booksThisYear / 34) * factor * 4)),
    }))
    .sort((a, b) => b.value - a.value)
    .map((row, i) => ({ ...row, rank: i + 1 }))
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
// `profiles/reviews.html.haml` → `reviews/_review.html.haml`. A written review
// is the book's title as a link, "by {author}", who wrote it and when, the text
// (truncated at 200 characters behind a "Read more..."), and an Edit button.
// Picture reviews are their own type: an image, the book it's for, who made it,
// a heart counter, and an approval state while staff look at it.
//
// There is no star rating on a Beanstack review — the app asks for words.

const written = (id, title, author, date, body) => ({
  id,
  kind: 'written',
  title,
  author,
  date,
  body,
})

export const REVIEWS = [
  written(
    'rv-amulet',
    'Amulet: The Stonekeeper',
    'Kazu Kibuishi',
    'Jun 12, 2026',
    "I did not expect to care about the house. It's the kind of book where the scary part is not the monsters, it's that the grown-ups keep being wrong about what is safe. Emily figures things out faster than anyone believes she can, and the art does half the talking — there are pages with no words where you still know exactly how bad it is getting. I read it in two sittings and then went straight back to the beginning to look at the panels I had rushed past. If you like books where the world is bigger than the first chapter lets on, this one keeps opening.",
  ),
  written(
    'rv-dogman',
    'Dog Man',
    'Dav Pilkey',
    'May 28, 2026',
    'Funny the whole way through. I read three chapters out loud to my little brother and he asked for more, which never happens. The drawings are messy on purpose and that is the point.',
  ),
  written(
    'rv-percy',
    'Percy Jackson and the Olympians #1: The Lightning Thief',
    'Rick Riordan',
    'May 3, 2026',
    'Best part is that the gods are annoying. Not wise, not mysterious — annoying, like relatives who show up and rearrange your kitchen. Percy spends the whole book being told what he is and deciding he would rather find out himself. I have read a lot of books where the kid turns out to be special and this is the first one where being special mostly sounded exhausting. The bus scene had me genuinely nervous. Now I want to read the next four.',
  ),
  {
    id: 'rv-snapdragon',
    kind: 'picture',
    image: 'snapdragon',
    title: 'Snapdragon, drawn with chalk',
    book: 'Snapdragon',
    author: 'Kat Leyh',
    date: 'Jun 2, 2026',
    hearts: 14,
    status: 'approved',
    art: ['#DC493A', '#F0A024'],
  },
  {
    id: 'rv-forest',
    kind: 'picture',
    image: 'harvest',
    title: 'The Harvest Party, in marker',
    book: 'Welcome to the Forest: The Harvest Party',
    author: 'Katie Risor',
    date: 'Jun 14, 2026',
    hearts: 3,
    status: 'pending',
    art: ['#0CA7BC', '#0BA85F'],
  },
]

// ─── Wish list ───────────────────────────────────────────────────────────────
// `profiles/wish_list.html.haml` — books the reader means to get to. A row is
// a cover, the title, who put it there and when, and three things you can do
// with it: log it, get it from the library, or take it off the list.
//
// `addedBy` matters: a parent or a teacher can add to a reader's list, so the
// row says whose idea it was rather than assuming the reader's own.

const wish = (book, addedBy, dateAdded, library = true) => ({
  book,
  addedBy,
  dateAdded,
  library,
})

export const WISH_LIST = [
  wish('telegraph-club', 'Olivia M.', 'Jun 12, 2026'),
  wish('darius', 'Mr. Reyes', 'Jun 8, 2026'),
  wish('scope', 'Olivia M.', 'Jun 1, 2026', false),
  wish('lucky-cap', 'Olivia M.', 'May 24, 2026'),
  wish('superscience', 'Mr. Reyes', 'May 19, 2026', false),
]

// ─── Book lists ──────────────────────────────────────────────────────────────
// `reading_lists#index` — "Book Lists", the curated shelves a site publishes
// and where "Find Books" sends you from the Wish List. A row is the list's
// cover, its name and how many books are on it, a description, who made it,
// and the genres it covers. The page filters by grade level and genre, both
// of which take several values at once (`with_grade_levels[]`, `with_genres[]`).
//
// `external` is the app's own second kind of list (`ReadingList#external_list`,
// with `external_lists` / `internal_lists` scopes): a list that lives somewhere
// else. It has no books of its own, so it shows no count and its name opens the
// other site rather than a detail page here.
//
// `keywords` stands in for `searchable_keywords`, the column the search matches
// on — which is why searching "graphic novel" finds a list whose name never
// says it.

// `reading_list_books` — which books are on which list, by catalog id. The
// count on the index comes from here rather than being carried separately, so
// a list can't claim eighteen books and then show four.
export const BOOK_LIST_BOOKS = {
  'bl-graphic': ['new-kid', 'el-deafo', 'amulet', 'dog-man', 'crossover'],
  'bl-scary': ['when-you-trap-tiger', 'amulet', 'hatchet', 'last-cuentista'],
  'bl-true': ['el-deafo', 'bud-not-buddy', 'telegraph-club', 'crossover', 'front-desk'],
  'bl-funny': ['dragons-tacos', 'mercy-watson', 'dog-man', 'stella-diaz', 'lucky-cap', 'rump'],
  'bl-first': ['mercy-watson', 'stella-diaz', 'julian', 'market-street', 'winn-dixie'],
}

const bookList = (id, name, by, grades, genres, description, tint, extra = {}) => ({
  id,
  name,
  count: BOOK_LIST_BOOKS[id]?.length ?? 0,
  by,
  grades,
  genres,
  description,
  tint,
  ...extra,
})

export const BOOK_LIST_GRADES = [
  'Babies and Toddlers',
  'Preschool',
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  'Adult',
]

export const BOOK_LISTS = [
  bookList(
    'bl-graphic',
    'Start Here: Graphic Novels',
    'Magnolia Middle Library',
    ['3rd Grade', '4th Grade', '5th Grade', '6th Grade'],
    ['Graphic Novels', 'Adventure'],
    'If a wall of text puts you off, start here. Every one of these tells as much in its pictures as in its words.',
    '#61B2F1',
    { keywords: 'comics manga graphic novel reluctant reader visual' },
  ),
  bookList(
    'bl-scary',
    'Scary, But Not Too Scary',
    'Mr. Reyes',
    ['3rd Grade', '4th Grade', '5th Grade'],
    ['Mystery', 'Fantasy'],
    'Spooky enough to be worth reading with the light on, and nothing in them that will keep you up.',
    '#7C5CFA',
    { keywords: 'spooky halloween ghost creepy mild horror' },
  ),
  bookList(
    'bl-true',
    'True Stories Worth Arguing About',
    'Magnolia Middle Library',
    ['6th Grade', '7th Grade', '8th Grade', '9th Grade'],
    ['Nonfiction', 'Historical Fiction'],
    'Real people who did difficult things, told well enough that you will want to check whether they really happened that way.',
    '#0B6B78',
    { keywords: 'true stories biography memoir debate history' },
  ),
  bookList(
    'bl-funny',
    'Books That Are Actually Funny',
    'Ms. Whitfield',
    ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade'],
    ['Humor', 'Graphic Novels'],
    'Tested on a room of nine-year-olds. These are the ones that got a laugh out loud, not a polite one.',
    '#F0A024',
    { keywords: 'funny humour laugh silly jokes' },
  ),
  bookList(
    'bl-first',
    'First Chapter Books',
    'Magnolia Middle Library',
    ['Kindergarten', '1st Grade', '2nd Grade'],
    ['Realistic Fiction', 'Adventure'],
    'Short chapters, big type, and a story that finishes before anyone loses the thread.',
    '#16A97A',
    { keywords: 'early reader beginning chapter book transitional' },
  ),

  // ── Lists that live somewhere else ─────────────────────────────────────────
  // `external_list` — the site points at somebody else's list rather than
  // keeping one. No books of its own, so no count and no page here: the name
  // opens the other site.
  bookList(
    'bl-nyt',
    'Notable Children’s Books of the Year',
    'The New York Public Library',
    ['3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade'],
    ['Realistic Fiction', 'Nonfiction'],
    'The library’s own annual pick of the hundred best books for children, published each December.',
    '#334155',
    {
      external: true,
      url: 'https://www.nypl.org/books-more/recommendations/best-books/kids',
      keywords: 'award best of the year notable librarians choice',
    },
  ),
  bookList(
    'bl-state',
    'Bluebonnet Award Nominees',
    'Texas Library Association',
    ['3rd Grade', '4th Grade', '5th Grade', '6th Grade'],
    ['Adventure', 'Mystery', 'Humor'],
    'The twenty titles up for this year’s state award — read at least five and you can vote in the spring.',
    '#7C2D12',
    {
      external: true,
      url: 'https://txla.org/tools-resources/reading-lists/texas-bluebonnet-award/',
      keywords: 'award state nominees voting bluebonnet',
    },
  ),
]

// ─── Peer reviews ────────────────────────────────────────────────────────────
// `microsite#peer_reviews` — other readers' approved reviews, not your own.
// Three scopes for picture reviews: your own site, every library (when the site
// opts in with `include_picture_review_from_other_microsites`), and the most
// hearted. Written reviews only ever have the first.
//
// Every one here is approved: the page filters to `with_approved_review`, so a
// reader never sees another reader's review waiting on staff.

const peerWritten = (id, title, author, by, library, date, body, hearts) => ({
  id,
  kind: 'written',
  title,
  author,
  by,
  library,
  date,
  body,
  hearts,
})

const peerPicture = (id, title, book, author, by, library, date, hearts, art, image) => ({
  id,
  kind: 'picture',
  image,
  title,
  book,
  author,
  by,
  library,
  date,
  hearts,
  art,
  status: 'approved',
})

export const PEER_REVIEWS = [
  peerWritten(
    'pr-wings',
    'Wings of Fire: The Dragonet Prophecy',
    'Tui T. Sutherland',
    'Noah K.',
    'Magnolia Middle',
    'Jun 11, 2026',
    'Five dragonets raised under a mountain because a scroll said they would stop a war. What I liked is that none of them wants the job. Clay keeps trying to feed everyone and Tsunami keeps trying to leave, and the prophecy never once asks what they want. The escape is good but the part I kept thinking about after is that the grown-ups who raised them are the villains and they still think they did the right thing.',
    22,
  ),
  peerWritten(
    'pr-newkid',
    'New Kid',
    'Jerry Craft',
    'Sofia R.',
    'Magnolia Middle',
    'Jun 9, 2026',
    'Jordan wants to go to art school and gets sent to a fancy private school instead. Everything he draws in his sketchbook is funnier and truer than what the adults say out loud. Teachers keep getting his name wrong, in a way the book lets you notice before it says anything about it.',
    31,
  ),
  peerWritten(
    'pr-frontdesk',
    'Front Desk',
    'Kelly Yang',
    'Priya S.',
    'Magnolia Middle',
    'Jun 4, 2026',
    'Mia is ten and running the front desk of a motel while her parents clean the rooms, and she decides she is going to be a writer in English even though everyone tells her to stick to maths. She hides people in empty rooms. She writes letters for other people and they work. It is funny more often than you expect for a book where the family has no money.',
    18,
  ),
  peerPicture(
    'pr-hatchet',
    'The lake, in watercolour',
    'Hatchet',
    'Gary Paulsen',
    'Diego H.',
    'Magnolia Middle',
    'Jun 10, 2026',
    47,
    ['#0B6B78', '#16A97A'],
    'lake',
  ),
  peerPicture(
    'pr-amulet',
    'The house on the hill',
    'Amulet: The Stonekeeper',
    'Kazu Kibuishi',
    'Jayden P.',
    'Magnolia Middle',
    'Jun 7, 2026',
    29,
    ['#3B2A6B', '#7C5CFA'],
    'house',
  ),
  peerPicture(
    'pr-onlyone',
    'Ivan in his enclosure',
    'The One and Only Ivan',
    'Katherine Applegate',
    'Emma L.',
    'Oak Elementary',
    'Jun 6, 2026',
    63,
    ['#B45309', '#F0A024'],
    'gorilla',
  ),
  peerPicture(
    'pr-wild',
    'Where the wild things went',
    'Where the Wild Things Are',
    'Maurice Sendak',
    'Theo N.',
    'Hickory Middle School',
    'Jun 2, 2026',
    91,
    ['#0891B2', '#61B2F1'],
    'wild',
  ),
  peerPicture(
    'pr-charlotte',
    "Charlotte's web, in thread",
    "Charlotte's Web",
    'E. B. White',
    'Maya C.',
    'Oak Elementary',
    'May 30, 2026',
    12,
    ['#DB2777', '#F0966F'],
    'web',
  ),
]

// ─── Challenge detail ────────────────────────────────────────────────────────
// `programs/_show.html.haml` + `_program_header.html.haml`. The reader's page
// for one challenge: a banner, the name and date span, then Overview / Badges /
// Rewards / Challenge Log. Fields follow the real Program — `date_span`,
// `description`, `startedOn`, `program_types`.
//
// The banner and badge art come from the challenge's own `banner` / `badges`
// keys in logging-flow's data — all three of these are real Beanstack
// challenges, so each carries the art its design team ships.

// The Overview's "Overall Progress" tiles. The app has two shapes and renders
// them in one fixed order (`_overview_list_goals`): the titles from a reading
// list, then Badges Earned, then one per log type, then Reviews, then
// Completed Activities, then Rewards / Tickets / Certificates Earned.
//
// A `goal` is `_progress_card` — it has a denominator, so it draws a ring and
// reads "620 / 1,000". A `total` is `_total_card` — a count with nothing to
// reach, so no ring. Badges Earned is a total in the app, not a fraction; as a
// ring it promised a badge set you could finish.
//
// `tab` is where the app's own href goes: every tile is a link to the tab that
// explains its number.
const goal = (label, have, need, icon, tab = 'badges') => ({ label, have, need, icon, tab })
const total = (label, value, icon, accent, tab = 'badges') => ({ label, value, icon, accent, tab })

/* The colours the total tiles carry, matched to the fundraiser's own. */
const BADGE_ACCENT = '#B45309'
const REWARD_ACCENT = '#7C5CFA'
const TICKET_ACCENT = '#E1511C'
const CERT_ACCENT = '#0F7A55'

export const CHALLENGE_DETAIL = {
  spring: {
    startedOn: 'April 3, 2026',
    description:
      'Spring Into Reading runs the whole month of April. Log your minutes, earn a badge for every milestone, and help Magnolia Middle hit its school goal of 40,000 minutes. Every 250 minutes you log earns you a ticket for the end-of-month drawing.',
    types: ['Minutes', 'Activities', 'Reviews'],
    goals: [
      goal('Titles Completed', 5, 10, 'book-2', 'reading-list'),
      total('Badges Earned', 3, 'award', BADGE_ACCENT),
      goal('Minutes Completed', 620, 1000, 'clock'),
      goal('Reviews', 1, 3, 'writing'),
      goal('Completed Activities', 2, 5, 'circle-check'),
      total('Rewards Earned', 2, 'gift', REWARD_ACCENT, 'rewards'),
      total('Tickets Earned', 8, 'ticket', TICKET_ACCENT, 'drawings'),
      total('Certificates Earned', 1, 'award', CERT_ACCENT, 'certificates'),
    ],
    rewards: [
      {
        name: 'Bookmark set',
        detail: 'A set of four Benny bookmarks, collected from the front office.',
        at: 250,
        earned: true,
        on: 'April 12, 2026',
      },
      {
        name: 'Free book from the cart',
        detail: 'Pick any title from the reading cart outside the library.',
        at: 500,
        earned: true,
        on: 'April 21, 2026',
      },
      {
        name: 'Extra library period',
        detail: 'One extra library period, arranged with your teacher.',
        at: 750,
        earned: false,
      },
      {
        name: 'Spring Into Reading t-shirt',
        detail: 'Handed out at the end-of-month assembly.',
        at: 1000,
        earned: false,
      },
    ],
  },
  'love-hurts': {
    startedOn: 'February 2, 2026',
    description:
      'For the Love of Reading is an ongoing challenge — no end date. Log whatever you are reading and collect the badge set as you go: a rose, a bouquet, a love letter, and eleven more. Write a review of something you loved and Benny will find you a badge for that too.',
    types: ['Minutes', 'Reviews'],
    goals: [
      total('Badges Earned', 2, 'award', BADGE_ACCENT),
      goal('Minutes Completed', 310, 600, 'clock'),
      goal('Reviews', 2, 3, 'writing'),
      total('Rewards Earned', 1, 'gift', REWARD_ACCENT, 'rewards'),
    ],
    rewards: [
      {
        name: 'Sticker sheet',
        detail: 'Collect from the library desk.',
        at: 200,
        earned: true,
        on: 'March 9, 2026',
      },
      { name: 'Poster', detail: 'Chosen from this year’s four designs.', at: 600, earned: false },
    ],
  },
  arresting: {
    startedOn: 'June 2, 2026',
    description:
      'Comics Choice is a bingo card. Every square is a different kind of comic or graphic novel — read one, log it, and the square is yours. Fill a row for a Bingo badge, fill the whole card for the Full Card badge, and everything you read on Comics Plus counts automatically.',
    types: ['Bingo', 'Minutes', 'Activities'],
    goals: [
      total('Badges Earned', 2, 'award', BADGE_ACCENT),
      goal('Minutes Completed', 88, 500, 'clock'),
      goal('Completed Activities', 7, 25, 'circle-check'),
      total('Rewards Earned', 0, 'gift', REWARD_ACCENT, 'rewards'),
    ],
    rewards: [
      {
        name: 'Comics Choice enamel pin',
        detail: 'For filling a whole row.',
        at: 250,
        earned: false,
      },
      {
        name: 'Graphic novel of your choice',
        detail: 'For the full card — pick any title from the Comics Plus shelf.',
        at: 500,
        earned: false,
      },
    ],
  },
  // The two that have ended. A past challenge is the same page with the reading
  // finished: the rings are full, the rewards are collected, and the line under
  // the description says when it closed rather than when it opened. Without
  // these the page had nothing to render for a challenge from the Past scope.
  winter: {
    startedOn: 'December 1, 2025',
    endedOn: 'February 28, 2026',
    description:
      'Read With Benny ran the whole winter — log your minutes, and every fortnight brought an activity to go with them: a snow-day book swap, a cocoa-and-comics hour, and a family read-aloud night.',
    types: ['Minutes', 'Activities'],
    goals: [
      total('Badges Earned', 6, 'award', BADGE_ACCENT),
      goal('Minutes Completed', 900, 900, 'clock'),
      goal('Completed Activities', 3, 3, 'circle-check'),
      total('Rewards Earned', 2, 'gift', REWARD_ACCENT, 'rewards'),
    ],
    rewards: [
      {
        name: 'Winter Reading tote',
        detail: 'Collected from the library desk.',
        at: 450,
        earned: true,
        on: 'January 20, 2026',
      },
      {
        name: 'Hot cocoa party',
        detail: 'For every reader who finished — held on the last Friday.',
        at: 900,
        earned: true,
        on: 'February 27, 2026',
      },
    ],
  },
  'read-across': {
    startedOn: 'March 2, 2026',
    endedOn: 'March 8, 2026',
    description:
      'Read Across America is one week and one list. Read any four of the titles the school picked, log them as you go, and the week counts as complete.',
    types: ['Reading List', 'Books'],
    goals: [
      goal('Titles Completed', 4, 4, 'book-2', 'reading-list'),
      total('Badges Earned', 2, 'award', BADGE_ACCENT),
      total('Rewards Earned', 1, 'gift', REWARD_ACCENT, 'rewards'),
    ],
    rewards: [
      {
        name: 'Read Across America sticker',
        detail: 'Handed out in homeroom on the Friday.',
        at: 4,
        earned: true,
        on: 'March 6, 2026',
      },
    ],
  },
}

// ─── What else a challenge can carry ─────────────────────────────────────────
// `navigation/sidebar/_single_program_nav` — the challenge's nav is built from
// what the challenge actually *has*: a Reading List tab only on a `book_list`
// challenge, Ticket Drawings only where `@ticket_rewards_exist`, Certificates
// only where `@certificates_exist`. Nothing is greyed out; a challenge without
// them simply hasn't got those tabs.

// `TicketReward` — a prize drawn from the tickets readers earn. A reader spends
// their earned tickets entering the ones they want, so the same tickets can't
// go in twice.
const drawing = (id, title, description, endsOn, entered, ended = false) => ({
  id,
  title,
  description,
  endsOn,
  entered,
  ended,
})

export const CHALLENGE_EXTRAS = {
  spring: {
    // Every 250 minutes earns a ticket; five of the eight are already in
    // drawings (two of those in one that has since closed).
    tickets: { earned: 8 },
    drawings: [
      drawing(
        'dw-switch',
        'Nintendo Switch Grand Prize',
        'The console and two games, drawn at the end-of-year assembly. Every reader in the school is in with a chance.',
        'Apr 30',
        2,
      ),
      drawing(
        'dw-bikes',
        'A Bike from Riverside Cycles',
        'Riverside donated two bikes and two helmets. One goes to a reader in grades K–5 and one to a reader in 6–8.',
        'Apr 30',
        0,
      ),
      drawing(
        'dw-pizza',
        'Pizza Party for Your Class',
        'Lunch for your whole class, on the PTA. Drawn once, from every ticket entered.',
        'Mar 28',
        3,
        true,
      ),
    ],
    certificates: [
      {
        id: 'cert-1',
        name: 'Spring Into Reading — Completed',
        earnedOn: 'April 28, 2026',
        line: 'Awarded to Olivia M. for reading 1,000 minutes this spring.',
      },
    ],
    // A `book_list` challenge's own shelf — the titles it asks you to read.
    readingList: {
      name: 'Spring Into Reading Picks',
      description: 'Read any four of these and the challenge counts it as a milestone.',
      books: ['wild-robot', 'new-kid', 'front-desk', 'when-you-trap-tiger', 'crossover', 'ghost'],
    },
  },
  // A `book_list` challenge, so the list is the challenge — which is what its
  // card's "Reading List" pill is promising.
  'read-across': {
    readingList: {
      name: 'Read Across America Picks',
      description: 'The school picked ten. Read any four of them during the week.',
      books: ['last-cuentista', 'stella-diaz', 'el-deafo', 'julian', 'bud-not-buddy', 'lucky-cap'],
    },
  },
}

export const getChallengeExtras = (id) => CHALLENGE_EXTRAS[id] ?? {}

/* A challenge with no detail behind it used to take the page down with it —
   `detail.types` on undefined. The fixture is the fix (every challenge you can
   open has an entry now); this is so the next one that doesn't renders a thin
   page rather than a white one. */
const NO_DETAIL = { description: '', types: [], goals: [], rewards: [] }

export const getChallengeDetail = (id) => CHALLENGE_DETAIL[id] ?? NO_DETAIL

// ─── The book catalog ────────────────────────────────────────────────────────
// `books#index` ("Find Books") and `books#show` — the site's own catalog, the
// one every other page's titles are records in.
//
// A catalog book carries more than a logged title does: the age band it's for,
// its language, the moods readers gave it, and the five tag families the app
// filters on — Favorite Genres, Topics, Main Characters, Awards and Misc. The
// book page shows all of them; the browse page filters on the first four.
//
// The catalog is a superset of the reading log's own `BOOKS`: everything a
// reader has logged is in here, plus everything they haven't read yet.

export const AGES = ['0–2', '3–5', '6–8', '9–11', '12–14', '15–18']

export const LANGUAGES = ['English', 'Spanish']

export const GENRES = [
  'Adventure',
  'Fantasy',
  'Graphic Novels',
  'Historical Fiction',
  'Humor',
  'Mystery',
  'Nonfiction',
  'Picture Books',
  'Poetry',
  'Realistic Fiction',
  'Science Fiction',
  'Sports',
]

// Kept under its old name for the Book Lists page, which filters on the same
// Genre records the catalog does — one vocabulary, two pages.
export const BOOK_LIST_GENRES = GENRES

// `topic_groups` → `topics`, and `background_groups` → `backgrounds`. Both are
// grouped in the app's own filter sidebar, with the group title as a subhead
// over its own set of checkboxes.
export const TOPIC_GROUPS = {
  'Life Events': ['Starting School', 'Moving', 'Loss'],
  Feelings: ['Anxiety', 'Anger', 'Friendship', 'Belonging'],
  Interests: ['Sports', 'Space', 'Animals', 'Cooking', 'Inventing'],
}

export const BACKGROUND_GROUPS = {
  'Race & Ethnicity': ['Black', 'Latine', 'Asian', 'Indigenous', 'Multiracial'],
  'Family Structure': ['Single Parent', 'Grandparents', 'Foster & Adoption', 'Immigrant Family'],
  'Gender & Identity': ['Girls', 'Boys', 'LGBTQ+'],
  Disability: ['Deaf & Hard of Hearing', 'Neurodivergent', 'Physical Disability'],
}

export const MOODS = {
  funny: { title: 'Funny', emoji: '😂' },
  adventurous: { title: 'Adventurous', emoji: '🧭' },
  heartwarming: { title: 'Heartwarming', emoji: '🥰' },
  suspenseful: { title: 'Suspenseful', emoji: '😬' },
  thoughtful: { title: 'Thought-Provoking', emoji: '🤔' },
  magical: { title: 'Magical', emoji: '✨' },
  sad: { title: 'Sad', emoji: '😢' },
  inspiring: { title: 'Inspiring', emoji: '💪' },
  silly: { title: 'Silly', emoji: '🤪' },
  scary: { title: 'Scary', emoji: '👻' },
}

/**
 * One catalog record. `id` matches the reading log's own book id where the
 * title is one a reader can log, so a logged session and a catalog entry are
 * the same book rather than two that happen to share a name.
 */
const book = (id, title, author, isbn, cover, extra) => ({
  id,
  title,
  author,
  isbn,
  cover,
  measure: 'minutes',
  ...extra,
})

export const CATALOG = [
  book('wild-robot', 'The Wild Robot', 'Peter Brown', '9780316381994', ['#5FB48A', '#2F7A5C'], {
    ages: ['6–8', '9–11'],
    language: 'English',
    pages: 288,
    lexile: '740L',
    genres: ['Adventure', 'Science Fiction'],
    topics: { Interests: ['Animals', 'Inventing'], Feelings: ['Belonging'] },
    moods: ['adventurous', 'heartwarming', 'thoughtful'],
    tip: 'Ask what Roz learns from watching the animals — and what she teaches them back.',
    body: 'A robot wakes alone on a wild island with no idea how she got there, and has to learn the animals’ ways to survive her first winter.',
    source: 'Publisher summary',
    misc: ['Series', 'Read-Aloud'],
  }),
  book('new-kid', 'New Kid', 'Jerry Craft', '9780062691200', ['#F0A024', '#C2410C'], {
    ages: ['9–11', '12–14'],
    language: 'English',
    pages: 256,
    lexile: 'GN320L',
    genres: ['Graphic Novels', 'Realistic Fiction'],
    topics: { 'Life Events': ['Starting School'], Feelings: ['Belonging', 'Friendship'] },
    backgrounds: { 'Race & Ethnicity': ['Black'] },
    moods: ['funny', 'thoughtful', 'heartwarming'],
    awards: ['Newbery Medal', 'Coretta Scott King Author Award'],
    tip: 'Jordan draws what he can’t say out loud. Try keeping a sketch journal for a week.',
    body: 'Jordan would rather be at art school, but his parents send him to a private school across town where he is one of the few Black students in his grade.',
    misc: ['Book Club Pick'],
  }),
  book('front-desk', 'Front Desk', 'Kelly Yang', '9781338157796', ['#E23B6B', '#9D174D'], {
    ages: ['9–11'],
    language: 'English',
    pages: 304,
    lexile: '640L',
    genres: ['Realistic Fiction', 'Historical Fiction'],
    topics: { 'Life Events': ['Moving'], Feelings: ['Belonging'] },
    backgrounds: { 'Race & Ethnicity': ['Asian'], 'Family Structure': ['Immigrant Family'] },
    moods: ['inspiring', 'heartwarming', 'thoughtful'],
    tip: 'Mia writes letters to fix things. Ask who your reader would write to.',
    body: 'Mia’s parents manage a motel, and ten-year-old Mia runs the front desk — hiding families in empty rooms and talking her way past a landlord who misses nothing.',
    misc: ['Series'],
  }),
  book('wonder', 'Wonder', 'R.J. Palacio', '9780375869020', ['#2BB3C0', '#0B5566'], {
    ages: ['9–11', '12–14'],
    language: 'English',
    pages: 320,
    lexile: '790L',
    genres: ['Realistic Fiction'],
    topics: { 'Life Events': ['Starting School'], Feelings: ['Belonging', 'Friendship'] },
    backgrounds: { Disability: ['Physical Disability'] },
    moods: ['heartwarming', 'sad', 'inspiring'],
    tip: 'Each section switches narrator. Ask whose version of a scene felt truest.',
    body: 'August has been homeschooled all his life. Fifth grade is his first year in a real classroom, and everyone there has already decided what his face means.',
    misc: ['Book Club Pick', 'Read-Aloud'],
  }),
  book('el-deafo', 'El Deafo', 'Cece Bell', '9781419712173', ['#7C5CFA', '#4C1D95'], {
    ages: ['6–8', '9–11'],
    language: 'English',
    pages: 248,
    lexile: 'GN420L',
    genres: ['Graphic Novels', 'Nonfiction'],
    topics: { Feelings: ['Friendship', 'Belonging'], 'Life Events': ['Starting School'] },
    backgrounds: { Disability: ['Deaf & Hard of Hearing'] },
    moods: ['funny', 'heartwarming', 'inspiring'],
    awards: ['Newbery Honor'],
    tip: 'The speech bubbles change as Cece’s hearing does. Look at how they’re drawn.',
    body: 'A memoir in comics about growing up deaf, the enormous hearing aid strapped to her chest, and the superpower she decides it gives her.',
  }),
  book(
    'last-cuentista',
    'The Last Cuentista',
    'Donna Barba Higuera',
    '9781646140923',
    ['#1A2433', '#5B21B6'],
    {
      ages: ['9–11', '12–14'],
      language: 'English',
      pages: 336,
      lexile: '630L',
      genres: ['Science Fiction', 'Adventure'],
      topics: { Interests: ['Space'], Feelings: ['Belonging'] },
      backgrounds: { 'Race & Ethnicity': ['Latine'] },
      moods: ['suspenseful', 'thoughtful', 'magical'],
      awards: ['Newbery Medal', 'Pura Belpré Award'],
      tip: 'Petra keeps the old stories alive. Ask which story your reader would save.',
      body: 'Earth is gone, and on the ship that left it someone has quietly erased everyone’s memory of it. Petra wakes up still remembering her grandmother’s stories.',
    },
  ),
  book(
    'when-you-trap-tiger',
    'When You Trap a Tiger',
    'Tae Keller',
    '9781524715700',
    ['#F2B705', '#B45309'],
    {
      ages: ['9–11'],
      language: 'English',
      pages: 304,
      lexile: '590L',
      genres: ['Fantasy', 'Realistic Fiction'],
      topics: { 'Life Events': ['Moving', 'Loss'], Feelings: ['Anxiety'] },
      backgrounds: {
        'Race & Ethnicity': ['Asian', 'Multiracial'],
        'Family Structure': ['Grandparents'],
      },
      moods: ['magical', 'sad', 'heartwarming'],
      awards: ['Newbery Medal'],
      body: 'Lily’s halmoni is sick, and a tiger out of her grandmother’s Korean folktales turns up on the road offering a bargain Lily is not sure she should take.',
    },
  ),
  book('crossover', 'The Crossover', 'Kwame Alexander', '9780544107717', ['#DC493A', '#7F1D1D'], {
    ages: ['9–11', '12–14'],
    language: 'English',
    pages: 240,
    lexile: '750L',
    genres: ['Poetry', 'Sports', 'Realistic Fiction'],
    topics: { Interests: ['Sports'], 'Life Events': ['Loss'], Feelings: ['Anger'] },
    backgrounds: { 'Race & Ethnicity': ['Black'] },
    moods: ['inspiring', 'sad', 'thoughtful'],
    awards: ['Newbery Medal', 'Coretta Scott King Honor'],
    tip: 'It’s written in verse. Read a page out loud and hear the ball bouncing.',
    body: 'Twin brothers rule the basketball court until one of them falls for a girl and the other has to work out who he is without him.',
    misc: ['Novel in Verse'],
  }),
  book('ghost', 'Ghost', 'Jason Reynolds', '9781481450157', ['#03B5AA', '#0B6B78'], {
    ages: ['9–11', '12–14'],
    language: 'English',
    pages: 192,
    lexile: '730L',
    genres: ['Sports', 'Realistic Fiction'],
    topics: { Interests: ['Sports'], Feelings: ['Anger', 'Belonging'] },
    backgrounds: {
      'Race & Ethnicity': ['Black'],
      'Family Structure': ['Single Parent'],
      'Gender & Identity': ['Boys'],
    },
    moods: ['inspiring', 'suspenseful', 'thoughtful'],
    body: 'Castle Cranshaw has been running from one night for years. A track coach sees the speed in it and offers him a place on the team.',
    misc: ['Series'],
  }),
  book('hatchet', 'Hatchet', 'Gary Paulsen', '9781416936473', ['#2F7A5C', '#14532D'], {
    ages: ['9–11', '12–14'],
    language: 'English',
    pages: 208,
    lexile: '1020L',
    genres: ['Adventure', 'Realistic Fiction'],
    topics: { Interests: ['Animals'], Feelings: ['Anxiety'] },
    backgrounds: { 'Gender & Identity': ['Boys'] },
    moods: ['suspenseful', 'adventurous', 'inspiring'],
    awards: ['Newbery Honor'],
    tip: 'Brian survives on what he notices. Ask what your reader would look for first.',
    body: 'A thirteen-year-old is the only one left alive after a bush-plane crash, with a hatchet on his belt and a Canadian forest in every direction.',
    misc: ['Classic', 'Series'],
  }),
  book(
    'winn-dixie',
    'Because of Winn-Dixie',
    'Kate DiCamillo',
    '9780763644321',
    ['#F26430', '#B45309'],
    {
      ages: ['6–8', '9–11'],
      language: 'English',
      pages: 192,
      lexile: '610L',
      genres: ['Realistic Fiction'],
      topics: { 'Life Events': ['Moving', 'Loss'], Interests: ['Animals'] },
      backgrounds: { 'Family Structure': ['Single Parent'] },
      moods: ['heartwarming', 'sad', 'funny'],
      awards: ['Newbery Honor'],
      body: 'India Opal walks into a supermarket for groceries and walks out with a dog, who proceeds to introduce her to everyone lonely in town.',
      misc: ['Classic', 'Read-Aloud'],
    },
  ),
  book(
    'bud-not-buddy',
    'Bud, Not Buddy',
    'Christopher Paul Curtis',
    '9780553494105',
    ['#1D70A2', '#0F3D5E'],
    {
      ages: ['9–11', '12–14'],
      language: 'English',
      pages: 256,
      lexile: '950L',
      genres: ['Historical Fiction', 'Adventure'],
      topics: { 'Life Events': ['Loss'], Feelings: ['Belonging'] },
      backgrounds: { 'Race & Ethnicity': ['Black'], 'Family Structure': ['Foster & Adoption'] },
      moods: ['funny', 'adventurous', 'heartwarming'],
      awards: ['Newbery Medal', 'Coretta Scott King Author Award'],
      body: 'It’s 1936 and ten-year-old Bud has run from another foster home, carrying flyers he is certain will lead him to the father he has never met.',
      misc: ['Classic'],
    },
  ),
  book(
    'stella-diaz',
    'Stella Díaz Has Something to Say',
    'Angela Dominguez',
    '9781626728479',
    ['#19BFD5', '#0E7490'],
    {
      ages: ['6–8'],
      language: 'English',
      pages: 208,
      lexile: '610L',
      genres: ['Realistic Fiction', 'Humor'],
      topics: { 'Life Events': ['Starting School'], Feelings: ['Anxiety', 'Friendship'] },
      backgrounds: { 'Race & Ethnicity': ['Latine'], 'Family Structure': ['Immigrant Family'] },
      moods: ['funny', 'heartwarming'],
      tip: 'Stella mixes up her Spanish and English when she’s nervous. Ask when that happens to your reader.',
      body: 'Stella knows exactly what she wants to say and freezes every time she has to say it — until a class presentation gives her no way around it.',
      misc: ['Series'],
    },
  ),
  book(
    'dragons-tacos',
    'Dragons Love Tacos',
    'Adam Rubin',
    '9780803736801',
    ['#F0A024', '#DC493A'],
    {
      ages: ['3–5', '6–8'],
      language: 'English',
      pages: 40,
      lexile: 'AD450L',
      genres: ['Picture Books', 'Humor', 'Fantasy'],
      topics: { Interests: ['Cooking'] },
      moods: ['silly', 'funny', 'magical'],
      tip: 'Read the salsa warning slowly. The pause is the whole joke.',
      body: 'Dragons love tacos. Dragons do not love spicy salsa. A party planner who ignores this will regret it.',
      misc: ['Read-Aloud'],
    },
  ),
  book(
    'market-street',
    'Last Stop on Market Street',
    'Matt de la Peña',
    '9780399257742',
    ['#6761A8', '#312E81'],
    {
      ages: ['3–5', '6–8'],
      language: 'English',
      pages: 32,
      lexile: 'AD610L',
      genres: ['Picture Books', 'Realistic Fiction'],
      topics: { Feelings: ['Belonging'] },
      backgrounds: { 'Race & Ethnicity': ['Black'], 'Family Structure': ['Grandparents'] },
      moods: ['heartwarming', 'thoughtful'],
      awards: ['Newbery Medal', 'Caldecott Honor'],
      tip: 'CJ asks why they don’t have things. Nana answers every time with something they do have.',
      body: 'CJ and his grandmother ride the bus across town after church, and she shows him what there is to see on a route he thinks is boring.',
      misc: ['Read-Aloud'],
    },
  ),
  book('julian', 'Julián Is a Mermaid', 'Jessica Love', '9780763690458', ['#2BB3C0', '#9D174D'], {
    ages: ['3–5', '6–8'],
    language: 'English',
    pages: 40,
    lexile: 'AD350L',
    genres: ['Picture Books'],
    topics: { Feelings: ['Belonging'] },
    backgrounds: { 'Gender & Identity': ['LGBTQ+'], 'Family Structure': ['Grandparents'] },
    moods: ['magical', 'heartwarming', 'inspiring'],
    body: 'Julián sees three women dressed as mermaids on the subway and knows at once what he wants to be. His abuela sees him seeing them.',
    misc: ['Read-Aloud', 'Nearly Wordless'],
  }),
  book(
    'mercy-watson',
    'Mercy Watson to the Rescue',
    'Kate DiCamillo',
    '9780763645045',
    ['#FFBC42', '#D97706'],
    {
      ages: ['3–5', '6–8'],
      language: 'English',
      pages: 80,
      lexile: '450L',
      genres: ['Humor', 'Adventure'],
      topics: { Interests: ['Animals', 'Cooking'] },
      moods: ['silly', 'funny'],
      body: 'The Watsons’ pig sleeps in their bed, the bed goes through the floor, and Mercy goes for help — or possibly for toast with a great deal of butter.',
      misc: ['First Chapter Book', 'Series'],
    },
  ),
  book(
    'llama-llama',
    'Llama Llama Red Pajama',
    'Anna Dewdney',
    '9780670059836',
    ['#E23B6B', '#F2B705'],
    {
      ages: ['0–2', '3–5'],
      language: 'English',
      pages: 40,
      lexile: 'AD420L',
      genres: ['Picture Books', 'Poetry'],
      topics: { Feelings: ['Anxiety'] },
      moods: ['silly', 'heartwarming'],
      body: 'Baby Llama cannot sleep, and the longer Mama takes to come back upstairs the worse it gets.',
      misc: ['Read-Aloud', 'Board Book', 'Series'],
    },
  ),
  book(
    'parker-inheritance',
    'The Parker Inheritance',
    'Varian Johnson',
    '9781338053012',
    ['#0F766E', '#14532D'],
    {
      ages: ['9–11', '12–14'],
      language: 'English',
      pages: 352,
      lexile: '600L',
      genres: ['Mystery', 'Historical Fiction'],
      topics: { 'Life Events': ['Moving'], Feelings: ['Belonging'] },
      backgrounds: { 'Race & Ethnicity': ['Black'] },
      moods: ['suspenseful', 'thoughtful'],
      awards: ['Coretta Scott King Honor'],
      tip: 'The puzzle is solvable. Keep a list of the clues as they turn up.',
      body: 'A letter in Candice’s grandmother’s attic points at a fortune hidden somewhere in town, and at what the town did in 1957.',
    },
  ),
  book(
    'this-promise',
    'I Can Make This Promise',
    'Christine Day',
    '9780062871992',
    ['#B45309', '#7C2D12'],
    {
      ages: ['9–11'],
      language: 'English',
      pages: 256,
      lexile: '790L',
      genres: ['Realistic Fiction'],
      topics: { Feelings: ['Belonging'], 'Life Events': ['Loss'] },
      backgrounds: {
        'Race & Ethnicity': ['Indigenous', 'Multiracial'],
        'Family Structure': ['Foster & Adoption'],
      },
      moods: ['thoughtful', 'sad', 'heartwarming'],
      body: 'Edie finds a box of letters and a photograph of a woman who looks like her, and starts asking what her mother was never told about her own family.',
    },
  ),

  // ── The site's Spanish shelf ───────────────────────────────────────────────
  // `language` is a facet of its own (`languages/_filters.html.haml`), which is
  // how a bilingual site's catalog is browsed one language at a time.
  book(
    'ninas-rebeldes',
    'Cuentos de buenas noches para niñas rebeldes',
    'Elena Favilli y Francesca Cavallo',
    undefined,
    ['#C0432F', '#7C2D12'],
    {
      ages: ['6–8', '9–11'],
      language: 'Spanish',
      pages: 224,
      lexile: '920L',
      genres: ['Nonfiction'],
      topics: { Interests: ['Inventing', 'Sports'], Feelings: ['Belonging'] },
      backgrounds: { 'Gender & Identity': ['Girls'] },
      moods: ['inspiring', 'thoughtful'],
      body: 'Cien mujeres que hicieron algo difícil, una página cada una, para leer una por noche.',
      misc: ['Series'],
    },
  ),
  book(
    'frida-animalitos',
    'Frida Kahlo y sus animalitos',
    'Monica Brown',
    undefined,
    ['#16A97A', '#0F766E'],
    {
      ages: ['3–5', '6–8'],
      language: 'Spanish',
      pages: 32,
      lexile: 'AD630L',
      genres: ['Picture Books', 'Nonfiction'],
      topics: { Interests: ['Animals'] },
      backgrounds: { 'Race & Ethnicity': ['Latine'], 'Gender & Identity': ['Girls'] },
      moods: ['magical', 'inspiring'],
      body: 'La vida de Frida contada a través de sus animales: dos monos, un loro, tres perros, dos pavos y un venado.',
      misc: ['Read-Aloud'],
    },
  ),

  // ── Titles the reader has already logged ───────────────────────────────────
  // Same ids as the reading log's own `BOOKS` where the log has one, and a
  // record here for the three it doesn't: every title in the log has a page to
  // link to, which is the point of a catalog.
  book('snapdragon', 'Snapdragon', 'Kat Leyh', '9781250171115', ['#E23B6B', '#5B21B6'], {
    ages: ['9–11', '12–14'],
    language: 'English',
    pages: 240,
    lexile: 'GN360L',
    genres: ['Graphic Novels', 'Fantasy'],
    topics: { Interests: ['Animals'], Feelings: ['Friendship', 'Belonging'] },
    backgrounds: { 'Gender & Identity': ['LGBTQ+'], 'Family Structure': ['Single Parent'] },
    moods: ['magical', 'heartwarming', 'scary'],
    body: 'Snap thinks the woman at the edge of town is a witch. She is right, and the witch is willing to teach her.',
  }),
  book(
    'lightning-thief',
    'Percy Jackson and the Olympians #1: The Lightning Thief',
    'Rick Riordan',
    '9780786838653',
    ['#1D70A2', '#0F3D5E'],
    {
      ages: ['9–11', '12–14'],
      language: 'English',
      pages: 400,
      lexile: '740L',
      measure: 'pages',
      genres: ['Fantasy', 'Adventure'],
      topics: { Feelings: ['Belonging'], Interests: ['Inventing'] },
      backgrounds: {
        Disability: ['Neurodivergent'],
        'Family Structure': ['Single Parent'],
        'Gender & Identity': ['Boys'],
      },
      moods: ['adventurous', 'funny', 'suspenseful'],
      tip: 'Percy’s dyslexia turns out to be Ancient Greek. Ask what else he has been wrong about himself.',
      body: 'Percy gets thrown out of another school, finds out his father is a Greek god, and has ten days to return a stolen lightning bolt.',
      misc: ['Series', 'Classic'],
    },
  ),
  book(
    'harvest-party',
    'Welcome to the Forest: The Harvest Party',
    'Katie Risor',
    undefined,
    ['#2F7A5C', '#14532D'],
    {
      ages: ['6–8'],
      language: 'English',
      pages: 48,
      lexile: 'GN280L',
      genres: ['Graphic Novels', 'Picture Books'],
      topics: { Interests: ['Animals', 'Cooking'], Feelings: ['Friendship'] },
      moods: ['heartwarming', 'silly'],
      body: 'The animals of the forest are throwing a harvest party, and nobody has told the badger what he is supposed to bring.',
      misc: ['Series'],
    },
  ),
  // Same ids as the reading log's own `BOOKS`, so a logged session and a
  // catalog record are one book.
  book(
    'she-gets-the-girl',
    'She Gets the Girl',
    'Rachel Lippincott and Alyson Derrick',
    undefined,
    ['#9DC7F0', '#F4A98B'],
    {
      ages: ['15–18'],
      language: 'English',
      pages: 400,
      lexile: 'HL620L',
      genres: ['Realistic Fiction', 'Humor'],
      topics: { Feelings: ['Friendship', 'Belonging'], 'Life Events': ['Starting School'] },
      backgrounds: { 'Gender & Identity': ['LGBTQ+', 'Girls'] },
      moods: ['funny', 'heartwarming'],
      body: 'Two college freshmen with nothing in common strike a deal: one helps the other win a girl back, and neither expects how that goes.',
    },
  ),
  book('rump', 'Rump', 'Liesl Shurtliff', '9780307977939', ['#3B4A3A', '#6E7A53'], {
    ages: ['9–11'],
    language: 'English',
    pages: 272,
    lexile: '660L',
    measure: 'pages',
    genres: ['Fantasy', 'Humor'],
    topics: { Feelings: ['Belonging'] },
    moods: ['funny', 'magical', 'adventurous'],
    tip: 'It retells Rumpelstiltskin from his side. Read the original first and compare.',
    body: 'In a kingdom where your name is your destiny, a boy called Rump has been handed half of one — and a gift for spinning straw into gold he cannot control.',
  }),
  book('lucky-cap', 'Lucky Cap', 'Patrick Jennings', undefined, ['#3FA9E0', '#E23B3B'], {
    ages: ['9–11'],
    language: 'English',
    pages: 176,
    lexile: '680L',
    genres: ['Humor', 'Realistic Fiction'],
    topics: { 'Life Events': ['Starting School'], Interests: ['Sports'] },
    moods: ['funny', 'silly'],
    body: 'Enzo starts middle school with a prototype cap from his dad’s company, and everything that happens next is either the cap’s doing or his own.',
  }),
  book(
    'lesbianas-guide',
    "The Lesbiana's Guide to Catholic School",
    'Sonora Reyes',
    '9780062981066',
    ['#2BB3C0', '#F2B705'],
    {
      ages: ['15–18'],
      language: 'English',
      pages: 336,
      lexile: 'HL680L',
      genres: ['Realistic Fiction'],
      topics: { 'Life Events': ['Starting School'], Feelings: ['Belonging', 'Anxiety'] },
      backgrounds: { 'Race & Ethnicity': ['Latine'], 'Gender & Identity': ['LGBTQ+'] },
      moods: ['thoughtful', 'funny', 'heartwarming'],
      body: 'Yamilet transfers to a Catholic school planning to keep her head down for one year, which lasts until she meets the only out kid in it.',
    },
  ),
  book(
    'telegraph-club',
    'Last Night at the Telegraph Club',
    'Malinda Lo',
    '9780525555254',
    ['#1A2433', '#3A506B'],
    {
      ages: ['15–18'],
      language: 'English',
      pages: 416,
      lexile: 'HL710L',
      genres: ['Historical Fiction'],
      topics: { Feelings: ['Belonging'] },
      backgrounds: { 'Race & Ethnicity': ['Asian'], 'Gender & Identity': ['LGBTQ+'] },
      moods: ['thoughtful', 'suspenseful'],
      awards: ['National Book Award'],
      body: '1954, San Francisco Chinatown. Lily and Kath start slipping out to a club neither can be seen in, while the Red Scare makes every family a suspect.',
    },
  ),
  book(
    'darius',
    'Darius the Great Is Not Okay',
    'Adib Khorram',
    '9780735231856',
    ['#C0432F', '#E87A2C'],
    {
      ages: ['12–14', '15–18'],
      language: 'English',
      pages: 316,
      lexile: 'HL830L',
      genres: ['Realistic Fiction'],
      topics: { 'Life Events': ['Moving'], Feelings: ['Anxiety', 'Friendship'] },
      backgrounds: {
        'Race & Ethnicity': ['Asian'],
        'Family Structure': ['Immigrant Family'],
        'Gender & Identity': ['Boys'],
      },
      moods: ['heartwarming', 'thoughtful', 'sad'],
      tip: 'Darius names his depression plainly. That matters — talk about how he does it.',
      body: 'Darius visits Iran for the first time to meet his dying grandfather, and finds the friend he has never had waiting on the other side of the world.',
    },
  ),
  book('dog-man', 'Dog Man', 'Dav Pilkey', '9780545581608', ['#F0A024', '#D9822B'], {
    ages: ['6–8', '9–11'],
    language: 'English',
    pages: 240,
    lexile: 'GN390L',
    genres: ['Graphic Novels', 'Humor'],
    topics: { Interests: ['Animals'] },
    moods: ['silly', 'funny'],
    body: 'A police officer and his dog are put back together in the wrong order, and the result fights crime with more enthusiasm than judgement.',
    misc: ['Series'],
  }),
  book(
    'amulet',
    'Amulet: The Stonekeeper',
    'Kazu Kibuishi',
    '9780439846806',
    ['#5B21B6', '#312E81'],
    {
      ages: ['9–11'],
      language: 'English',
      pages: 192,
      lexile: 'GN210L',
      genres: ['Graphic Novels', 'Fantasy', 'Adventure'],
      topics: { 'Life Events': ['Moving', 'Loss'] },
      moods: ['suspenseful', 'magical', 'adventurous'],
      body: 'After their father dies, Emily and Navin move into a great-grandfather’s empty house, and what lives under it takes their mother the first night.',
      misc: ['Series'],
    },
  ),
]

export const CATALOG_BY_ID = Object.fromEntries(CATALOG.map((b) => [b.id, b]))
export const CATALOG_BY_TITLE = new Map(CATALOG.map((b) => [b.title, b]))

/** The catalog record for a logged title, by name — what the log links to. */
export const catalogBook = (title) => CATALOG_BY_TITLE.get(title)

// ─── Personalize Reader ──────────────────────────────────────────────────────
// `profiles#edit_options` and the funnel behind it. The Preferences list is a
// row per filter the reader can set, each showing whether it *has* been set —
// `@profile_presenter.is_personalized?`, which is the app's own finished /
// not-finished class on those links. The forms themselves are
// `profiles/personalization_forms/*`.
//
// Which rows appear depends on the profile: a child gets the six recommendation
// filters, an adult or teen gets Reading Doorways instead (and only where the
// site does `adult_curated_recommendations?`). Grade Level is a site setting,
// and a rostered site drops Basic Information because the roster owns it.

/** `Pick up to N` — the app's own per-filter limits. */
export const PREFERENCE_LIMITS = {
  interests: 5,
  genres: 5,
  backgrounds: 5,
  readingLevels: 2,
  doorways: 2,
}

// `Interest` — what the reader likes, not what they read. The app ships an icon
// per interest; a prototype has the emoji it would have drawn.
export const INTERESTS = [
  { id: 'animals', name: 'Animals', emoji: '🐾' },
  { id: 'space', name: 'Space', emoji: '🚀' },
  { id: 'sports', name: 'Sports', emoji: '⚽️' },
  { id: 'art', name: 'Art & Drawing', emoji: '🎨' },
  { id: 'music', name: 'Music', emoji: '🎸' },
  { id: 'cooking', name: 'Cooking', emoji: '🍳' },
  { id: 'building', name: 'Building & Inventing', emoji: '🔧' },
  { id: 'nature', name: 'Nature & Outdoors', emoji: '🌲' },
  { id: 'history', name: 'History', emoji: '🏺' },
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'magic', name: 'Magic & Myths', emoji: '🐉' },
  { id: 'scary', name: 'Scary Stories', emoji: '👻' },
  { id: 'jokes', name: 'Jokes & Silliness', emoji: '🤪' },
  { id: 'friends', name: 'Friendship', emoji: '🤝' },
  { id: 'vehicles', name: 'Trucks & Trains', emoji: '🚂' },
]

// `ReadingLevel` — a band with a description the site can override
// (`custom_description`), and an age range that greys it out for a reader it
// doesn't fit (`age_limits_with_half_years`).
export const READING_LEVELS = [
  {
    id: 'board',
    name: 'Board Books',
    description: 'A few words a page, and pages you can chew on.',
    ages: [0, 3],
  },
  {
    id: 'picture',
    name: 'Picture Books',
    description: 'A story told as much in the pictures as in the words — read together.',
    ages: [3, 7],
  },
  {
    id: 'early',
    name: 'Early Readers',
    description: 'Short sentences and repeated words, for a reader sounding it out alone.',
    ages: [5, 8],
  },
  {
    id: 'first-chapter',
    name: 'First Chapter Books',
    description: 'Short chapters and big type, with a picture every few pages.',
    ages: [6, 10],
  },
  {
    id: 'middle',
    name: 'Middle Grade',
    description: 'A full novel, and a plot that runs for more than one sitting.',
    ages: [8, 13],
  },
  {
    id: 'ya',
    name: 'Young Adult',
    description: 'Longer, harder, and written for a reader who wants to be taken seriously.',
    ages: [12, 18],
  },
]

// The site's languages, as a reader preference rather than a catalog facet.
export const PREFERENCE_LANGUAGES = LANGUAGES

/**
 * The Four Doorways — `Category::FOUR_DOORWAYS`, and the reason an adult
 * profile has a preferences page at all. The descriptions and the "People often
 * describe these kinds of books as…" phrases are `CategoryPresenter`'s own,
 * word for word: they are the reading-expert framing the feature is built on
 * (Nancy Pearl's four doorways), not copy a prototype should paraphrase.
 */
export const DOORWAYS = [
  {
    id: 'plot',
    name: 'Plot Driven',
    emoji: '🎢',
    tint: '#F0A024',
    description:
      "Books which are action packed and fast paced; the type of books you can't put down. Think of adventure, thrillers, mystery, true crime or true adventure.",
    phrases: [
      'Page turning!',
      'I couldn’t put it down!',
      'I wanted to find out what happened next.',
      'It was adrenaline-fueled.',
    ],
  },
  {
    id: 'people',
    name: 'People Focused',
    emoji: '💬',
    tint: '#E23B6B',
    description:
      "Books where you fall in love with the characters and think about them even after you've finished reading the book. This could include fiction, romance, biography, detective stories or memoirs.",
    phrases: [
      'The people I am reading about seem utterly real.',
      'When the book was over, I felt like I lost someone dear to me because I’ll never spend time with the character again.',
    ],
  },
  {
    id: 'place',
    name: 'Place Focused',
    emoji: '🗺️',
    tint: '#0B6B78',
    description:
      "Books where the setting is a key element of the story. This is the kind of book where you feel you've been transported to another place or time. This could include fiction, travel, fantasy, science fiction or western.",
    phrases: [
      'I felt like I knew every street and shop of that town.',
      'It made me wish I had grown up there.',
    ],
  },
  {
    id: 'prose',
    name: 'Prose Driven',
    emoji: '✒️',
    tint: '#5B21B6',
    description:
      'Books where language and the crafting of the text is notable; the type of the books where you linger over the sentences because they are so beautifully written. This will include both fiction and non-fiction.',
    phrases: [
      'I kept reading slower and slower because I wanted to savor the language.',
      'I’m not even sure what the book was about, but I loved the way the author wrote.',
    ],
  },
]

/**
 * `profile.customized_filters` — what this reader has actually set. An empty
 * array is the app's "No Preference", which is a real answer and not a blank:
 * `is_personalized?` is false for it, so the row reads as unfinished and the
 * recommendations fall back to the whole catalog.
 */
export const READER_PREFERENCES = {
  gradeLevel: '6th Grade',
  interests: ['animals', 'magic', 'jokes'],
  genres: ['Graphic Novels', 'Fantasy', 'Humor'],
  backgrounds: [],
  readingLevels: ['middle'],
  languages: ['English'],
  doorways: [],
  birthday: 'March 4, 2014',
}

// `shared_accesses` — who can see this reader, and who has been asked and
// hasn't answered. The app lists them under the invite form, with Revoke on the
// first and Resend / Remove on the second.
export const SHARED_ACCESS = [
  { id: 'sa-1', name: 'Dana Moore' },
  { id: 'sa-2', name: 'Mr. Reyes' },
]

export const SHARED_INVITES = [{ id: 'si-1', email: 'grandma.jo@example.com' }]

// ─── Fundraisers ─────────────────────────────────────────────────────────────
// A read-a-thon: the site runs one, readers log as usual, and the people who
// sponsor them turn that reading into money. `Fundraiser` /
// `ProfileFundraiser` / `Donation`.
//
// The reader's side is `fundraisers#show` and its nav — Overview, Badges,
// Prizes, Donations, Challenge Log. What makes it a fundraiser rather than a
// challenge is the two numbers at the top (raised against the goal) and the
// share card: a reader's own donation page is the thing they're being asked to
// send to their family.

const donation = (id, name, amount, message, sponsor = false) => ({
  id,
  name,
  amount,
  message,
  sponsor,
})

export const FUNDRAISER = {
  id: 'read-a-thon',
  name: 'Magnolia Read-a-thon',
  banner: 'summer-reading',
  tint: '#2AA5B8',
  dates: 'May 1 — Jun 15',
  shortDescription: 'Every minute Olivia reads this month raises money for the school library.',
  description:
    'Our library is short two thousand books and one librarian’s wish list. For six weeks, every reader in the school is asking family and friends to sponsor their reading — and everything raised goes straight into new titles for the shelves. Log as you always do; the rest takes care of itself.',
  goal: 5000,
  raised: 3180,
  // What this reader has raised, and from whom.
  myGoal: 150,
  myRaised: 95,
  // `_overall_progress` — the app's own tiles, in its own order. The ones with
  // a `need` are `_progress_card`; the rest are `_total_card`.
  progress: [
    { id: 'raised', label: 'Total Raised', value: '$95', icon: 'coin', accent: '#0F7A55' },
    { id: 'donations', label: 'Total Donations', value: 4, icon: 'users', accent: '#1A6DD5' },
    { id: 'badges', label: 'Badges Earned', value: 3, icon: 'award', accent: '#B45309' },
    { id: 'minutes', label: 'Minutes Logged', have: 240, need: 300 },
    { id: 'activities', label: 'Activities Completed', have: 2, need: 3 },
    { id: 'reviews', label: 'Reviews Written', have: 1, need: 2 },
    { id: 'prizes', label: 'Prizes Earned', value: 1, icon: 'gift', accent: '#7C5CFA' },
  ],
  // `_fundraiser_rewards` — what raising a given amount earns. One of the five
  // is banked; the rest name what is still to raise.
  prizes: [
    { id: 'p1', name: 'Book Fair Voucher', art: '🎟️', at: 50, earned: true, on: 'May 14' },
    { id: 'p2', name: 'Sponsor a Shelf plaque', art: '🏷️', at: 100 },
    { id: 'p3', name: 'Pizza with the Principal', art: '🍕', at: 150 },
    { id: 'p4', name: 'Name a library cart', art: '🛒', at: 250 },
    { id: 'p5', name: 'Read-a-thon hoodie', art: '🧥', at: 400 },
  ],
  donations: [
    donation('d1', 'Grandma Jo', 40, 'Read something with a dragon in it for me. xx'),
    donation('d2', 'Dana Moore', 25, 'So proud of you, Liv!'),
    // A `donation_sponsor` is a business the site lined up, so it has no
    // message — it sponsored the fundraiser, not this reader.
    donation('d3', 'Riverside Books', 20, null, true),
    donation('d4', 'Mr. Reyes', 10, 'Room 14 is watching that minute count.'),
  ],
  shareUrl: 'https://magnolia.beanstack.org/f/olivia-m',
}

// ─── The account, and the profiles on it ─────────────────────────────────────
// The shape of a Beanstack reader differs by site type, and it is the biggest
// structural difference between the two:
//
//  * **A library** has an **account creator** — an adult who signs up — and
//    that account holds one or many *profiles*: one for the adult, one for each
//    child. Each profile has its own reading, its own badges and its own
//    settings. The gear is the *account's* settings; a profile's own are behind
//    its Edit.
//
//  * **A school** has no account layer. It is one-to-one: a student is a
//    profile, there is nothing above it, and there is nobody to switch to.
//
// `kind` is the profile's own — `adult?` / `teen?` / `child?` — and it decides
// which Preferences list Personalize Reader shows. On a school site every
// profile is a student, so the question never arises.

const profile = (id, name, initials, color, kind, grade) => ({
  id,
  name,
  initials,
  color,
  kind,
  grade,
})

export const ACCOUNT = {
  // `User` — the sign-in, which is not itself a reader.
  email: 'dana.martinez@example.com',
  name: 'Dana Martinez',
  profiles: [
    profile('dana', 'Dana Martinez', 'DM', '#0F766E', 'adult'),
    profile('olivia', 'Olivia Martinez', 'OM', '#F09A77', 'child', '6th Grade'),
    profile('noah', 'Noah Martinez', 'NM', '#7C5CFA', 'child', '3rd Grade'),
  ],
}

// The one profile a school site has: the student, and nothing above them.
export const STUDENT = profile('olivia', 'Olivia M.', 'OM', '#F09A77', 'child', '6th Grade')
