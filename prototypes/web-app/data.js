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

const friend = (id, name, initials, color, grade, streak, minutes, books, avatar) => ({
  id,
  name,
  initials,
  color,
  grade,
  streak,
  minutesThisWeek: minutes,
  booksThisYear: books,
  avatar: avatar ? `/bs-prototypes/avatars/${id}.jpg` : null,
})

export const FRIENDS = [
  friend('jayden', 'Jayden P.', 'JP', '#196DD5', 'Grade 5', 21, 214, 34, true),
  friend('sofia', 'Sofia R.', 'SR', '#DB2777', 'Grade 4', 14, 186, 28, true),
  friend('noah', 'Noah K.', 'NK', '#0CA7BC', 'Grade 5', 9, 152, 22, true),
  friend('emma', 'Emma L.', 'EL', '#0BA85F', 'Grade 4', 0, 131, 19, true),
  friend('diego', 'Diego H.', 'DH', '#0891B2', 'Grade 5', 6, 118, 17, true),
  friend('priya', 'Priya S.', 'PS', '#9333EA', 'Grade 4', 31, 205, 30, true),
  friend('liam', 'Liam T.', 'LT', '#B43DD0', 'Grade 6', 3, 96, 12, false),
]

export const PENDING_INVITES = [
  { id: 'ava', name: 'Ava M.', initials: 'AM', grade: 'Grade 3', pending: true },
  { id: 'zoe', name: 'Zoe B.', initials: 'ZB', grade: 'Grade 3', pending: true },
]

// One new request waiting, which is what puts the banner on the page.
export const FRIEND_REQUESTS = [
  { id: 'maya', name: 'Maya C.', initials: 'MC', color: '#F0966F', grade: 'Grade 4' },
]

// ─── Leaderboards ────────────────────────────────────────────────────────────
// `leaderboards/index.html.haml` tabs three boards — Friends, Grade, School —
// each over the same table: rank, reader, and the log type's total. The period
// dropdown and the log-type tabs are the app's own wording.

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
  const pool = board === 'friends' ? [...FRIENDS, ME] : board === 'grade' ? GRADES : SCHOOLS
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
    title: 'The Harvest Party, in marker',
    book: 'Welcome to the Forest: The Harvest Party',
    author: 'Katie Risor',
    date: 'Jun 14, 2026',
    hearts: 3,
    status: 'pending',
    art: ['#0CA7BC', '#0BA85F'],
  },
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

// The Overview's "Overall Progress" ring tiles, in the app's render order.
const goal = (label, have, need, icon) => ({ label, have, need, icon })

export const CHALLENGE_DETAIL = {
  spring: {
    startedOn: 'April 3, 2026',
    description:
      'Spring Into Reading runs the whole month of April. Log your minutes, earn a badge for every milestone, and help Magnolia Middle hit its school goal of 40,000 minutes. Every 250 minutes you log earns you a ticket for the end-of-month drawing.',
    types: ['Minutes', 'Activities', 'Reviews'],
    goals: [
      goal('Minutes Completed', 620, 1000, 'clock'),
      goal('Badges Earned', 3, 8, 'award'),
      goal('Titles Completed', 5, 10, 'book-2'),
      goal('Reviews', 1, 3, 'writing'),
      goal('Completed Activities', 2, 5, 'circle-check'),
      goal('Tickets Earned', 2, 4, 'ticket'),
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
      goal('Minutes Completed', 310, 600, 'clock'),
      goal('Badges Earned', 2, 17, 'award'),
      goal('Reviews', 2, 3, 'writing'),
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
      goal('Minutes Completed', 88, 500, 'clock'),
      goal('Badges Earned', 2, 28, 'award'),
      goal('Completed Activities', 7, 25, 'circle-check'),
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
}

export const getChallengeDetail = (id) => CHALLENGE_DETAIL[id]
