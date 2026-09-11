// Sample data for Words with Benny — the vocabulary layer that sits on top of
// reading logs (design brief `17d0pZJaeOlHU9KatmFmgoR05f4PGoJYnyd06Km0f9_w`,
// Asana "Words with Benny (Vocabulary Feature)" 1217697238509892).
//
// The premise the data has to support: there is no dependable vocabulary list
// across districts, so words are NOT curriculum-aligned. They hang off the
// book — its plot, themes, characters and ideas — which is why every word here
// carries a `why` line naming the book it came from.

// The reader is logging-flow's reader, because this prototype opens on that
// prototype's real dashboard and log flow.
export { READER, coverUrl, STREAK, DAILY_GOAL } from '../logging-flow/data'

import { BOOKS as LF_BOOKS } from '../logging-flow/data'

// ─── Books ───────────────────────────────────────────────────────────────────
// Ordinary books only. logging-flow's catalog carries titles that live in a
// partner's app (Comics Plus, the Scholastic magazines); account linking is
// beside the point here, so those are dropped and the shelf is filled out with
// six more normal library books instead.
//
// Covers are real: `coverId` is Open Library's own numeric cover id, looked up
// per title through their search API and eyeballed one by one rather than
// guessed. A cover id beats an ISBN here — an arbitrary ISBN off a title's list
// can resolve to a foreign or coverless edition. Each still falls back to the
// `cover` gradient if the CDN misses.

// The inherited titles that don't resolve to a cover on their own — two carry
// no ISBN at all, and Lesbiana's Guide has one Open Library holds no image for.
// Patched in here so this prototype's shelf is real covers throughout, without
// restating the books or changing how they look in logging-flow.
const INHERITED_COVER_IDS = {
  'she-gets-the-girl': 13195498,
  'lucky-cap': 10783462,
  'lesbianas-guide': 12791802,
}

// Anything with a `partner` lives in a linked app's catalog — drop those.
//
// `readable` goes too, on every title. It marks a book with a digital edition
// you can open in Beanstack's own reader, which puts a read-or-log fork in
// front of picking a title — a whole second thing to explain in a demo that is
// about what happens *after* a log. It's data-driven, so dropping the flag
// takes the corner chip, the callout and the reader path with it.
//
// And every title is logged in minutes. logging-flow carries both measures on
// purpose; here a book that asks for pages is just a second thing the details
// step can say, and the challenges this reader is in are all minutes anyway.
const PLAIN_BOOKS = Object.fromEntries(
  Object.entries(LF_BOOKS)
    .filter(([, b]) => !b.partner)
    // eslint-disable-next-line no-unused-vars
    .map(([id, { readable, ...b }]) => [
      id,
      {
        ...b,
        measure: 'minutes',
        ...(INHERITED_COVER_IDS[id] ? { coverId: INHERITED_COVER_IDS[id] } : null),
      },
    ]),
)

export const BOOKS = {
  ...PLAIN_BOOKS,
  matilda: {
    id: 'matilda',
    coverId: 12889769,
    title: 'Matilda',
    author: 'Roald Dahl',
    cover: ['#1E3A8A', '#DC2626'],
    measure: 'minutes',
    pages: 240,
  },
  wonder: {
    id: 'wonder',
    coverId: 8223160,
    title: 'Wonder',
    author: 'R. J. Palacio',
    cover: ['#3B82F6', '#93C5FD'],
    measure: 'minutes',
    pages: 320,
  },
  holes: {
    id: 'holes',
    coverId: 19797,
    title: 'Holes',
    author: 'Louis Sachar',
    cover: ['#B45309', '#FBBF24'],
    measure: 'minutes',
    pages: 233,
  },
  crossover: {
    id: 'crossover',
    coverId: 7336870,
    title: 'The Crossover',
    author: 'Kwame Alexander',
    cover: ['#C2410C', '#7C2D12'],
    measure: 'minutes',
    pages: 240,
  },
  terabithia: {
    id: 'terabithia',
    coverId: 12627341,
    title: 'Bridge to Terabithia',
    author: 'Katherine Paterson',
    cover: ['#15803D', '#65A30D'],
    measure: 'minutes',
    pages: 208,
  },
  hatchet: {
    id: 'hatchet',
    coverId: 11240448,
    title: 'Hatchet',
    author: 'Gary Paulsen',
    cover: ['#166534', '#0F766E'],
    measure: 'minutes',
    pages: 208,
  },
}

/** Covers on the log flow's "Recently Logged Titles" row. */
export const RECENTLY_LOGGED = ['matilda', 'she-gets-the-girl', 'holes', 'hatchet']

// A word surfaces after a log, but not after *every* log — "periodically", per
// the brief. Every Nth log unlocks one.
export const UNLOCK_EVERY = 2

// ─── Words, by book ──────────────────────────────────────────────────────────
// `why` is the line Benny says to tie the word back to what was just read.
// `check` is the collect-it interaction: one sentence uses the word correctly,
// the others are near-misses a 5th–8th grader would plausibly pick.

const w = (word, say, part, meaning, why, correct, wrong) => ({
  word,
  say,
  part,
  meaning,
  why,
  check: { correct, wrong },
})

export const WORDS_BY_BOOK = {
  'she-gets-the-girl': [
    w(
      'earnest',
      'UR-nist',
      'adjective',
      'Deeply sincere — you really mean it, no joke behind it.',
      'Alex plays it cool, but Molly is earnest about everything she wants.',
      'Her earnest apology made it clear she actually felt bad.',
      [
        'The earnest thunderstorm knocked out the power.',
        'He ran an earnest mile in under six minutes.',
      ],
    ),
    w(
      'reluctant',
      'ri-LUK-tint',
      'adjective',
      'Unwilling — you do the thing, but you drag your feet.',
      'Alex is a very reluctant matchmaker at the start of this book.',
      'She gave a reluctant nod, still not sure it was a good idea.',
      [
        'The reluctant sunlight was bright and hot all afternoon.',
        'He was reluctant, so he volunteered first.',
      ],
    ),
    w(
      'infatuated',
      'in-FAT-choo-ay-tid',
      'adjective',
      'Crushing hard on someone, in a way that crowds out everything else.',
      'Molly is completely infatuated with Cora — that’s the whole plan.',
      'He was so infatuated with her that he forgot his own locker combination.',
      [
        'She was infatuated with the homework and finished it early.',
        'The infatuated bus arrived twelve minutes late.',
      ],
    ),
  ],
  rump: [
    w(
      'destiny',
      'DES-tuh-nee',
      'noun',
      'What is supposed to happen to you — the future your life is pointed at.',
      'Rump’s whole quest is about whether a name can decide your destiny.',
      'He refused to believe that being small was his destiny.',
      ['She destiny the gold into thread overnight.', 'The destiny was heavy and made of iron.'],
    ),
    w(
      'bargain',
      'BAR-gin',
      'noun or verb',
      'A deal where each side gives something up — or the act of making one.',
      'Every time Rump spins gold, someone strikes a bargain with him.',
      'They struck a bargain: her necklace for his last loaf of bread.',
      [
        'The bargain flew over the mountain before sunrise.',
        'He bargained the soup until it was hot.',
      ],
    ),
    w(
      'peculiar',
      'pi-KYOOL-yer',
      'adjective',
      'Strange or odd in a way that makes you look twice.',
      'A boy who can spin straw into gold is a peculiar thing to have in your village.',
      'There was a peculiar smell coming from the back of the fridge.',
      ['She ran peculiar and won the race.', 'The peculiar of the story was on page ten.'],
    ),
  ],
  'lucky-cap': [
    w(
      'coincidence',
      'ko-IN-si-dins',
      'noun',
      'Two things happening together by chance, not because one caused the other.',
      'Enzo thinks the cap is magic. It might just be a run of coincidence.',
      'Meeting my cousin at the airport was a total coincidence.',
      [
        'He coincidenced the ball into the net.',
        'The coincidence was too small to fit on his head.',
      ],
    ),
    w(
      'superstition',
      'soo-per-STI-shin',
      'noun',
      'A belief that an object or action brings luck, with no real reason behind it.',
      'A cap that makes good things happen is a superstition Enzo is happy to keep.',
      'Not stepping on cracks is a superstition, not a rule.',
      [
        'She superstitioned her homework before dinner.',
        'The superstition measured four feet across.',
      ],
    ),
  ],
  'lesbianas-guide': [
    w(
      'conform',
      'kun-FORM',
      'verb',
      'To change yourself to match what everyone around you expects.',
      'Yamilet spends a lot of this book deciding how much she’ll conform at her new school.',
      'He cut his hair short to conform to the team’s rules.',
      ['The conform of the room was painted blue.', 'She conformed a sandwich for lunch.'],
    ),
    w(
      'resilient',
      'ri-ZIL-yint',
      'adjective',
      'Able to bounce back after something hard knocks you down.',
      'Yamilet keeps getting back up — she’s resilient, even when she’s scared.',
      'The team was resilient and won the next three games after that loss.',
      ['He resilient the door open with his shoulder.', 'The resilient was due on Friday.'],
    ),
  ],
  'telegraph-club': [
    w(
      'clandestine',
      'klan-DES-tin',
      'adjective',
      'Kept secret, usually because it would get you in trouble.',
      'Lily’s trips to the Telegraph Club are clandestine for a reason.',
      'They held a clandestine meeting in the basement after everyone left.',
      [
        'The clandestine sandwich was made with rye bread.',
        'She clandestined across the finish line.',
      ],
    ),
    w(
      'suspicion',
      'suh-SPI-shin',
      'noun',
      'A feeling that something is wrong or that someone is hiding something.',
      'In 1954 San Francisco, suspicion follows Lily’s family everywhere.',
      'His long silence raised her suspicion that he already knew.',
      ['He suspicioned the letter into the mailbox.', 'The suspicion weighed nine pounds.'],
    ),
    w(
      'defiance',
      'di-FY-ints',
      'noun',
      'Openly refusing to obey — standing your ground on purpose.',
      'Going back to the club, knowing the risk, is an act of defiance.',
      'She stayed seated in quiet defiance of the order.',
      ['The defiance was served cold with lemon.', 'He defianced his shoes before the game.'],
    ),
  ],
  darius: [
    w(
      'melancholy',
      'MEL-in-kol-ee',
      'noun or adjective',
      'A heavy, quiet sadness that hangs around without a single cause.',
      'Darius names his depression out loud — melancholy is the weather of this book.',
      'A melancholy mood settled over him on the last day of the trip.',
      [
        'She melancholied the kitchen floor until it shone.',
        'The melancholy scored two goals in the final minute.',
      ],
    ),
    w(
      'heritage',
      'HAIR-i-tij',
      'noun',
      'The traditions, language and history your family passes down to you.',
      'Meeting his grandparents in Yazd puts Darius face to face with his heritage.',
      'Cooking her grandmother’s recipes kept her heritage alive.',
      ['He heritaged the ball to first base.', 'The heritage was parked outside the school.'],
    ),
    w(
      'awkward',
      'AWK-werd',
      'adjective',
      'Uncomfortable and clumsy — nobody knows quite what to do.',
      'Darius calls himself a Fractional Persian, and most of this trip is beautifully awkward.',
      'There was an awkward pause after nobody laughed at his joke.',
      ['She awkwarded the letter to her cousin.', 'The awkward held eight gallons of water.'],
    ),
  ],
  matilda: [
    w(
      'mischievous',
      'MISS-chuh-vus',
      'adjective',
      'Playful in a way that causes a little trouble.',
      'Matilda glues her father’s hat to his head — that is mischievous.',
      'The mischievous puppy hid one shoe from every pair.',
      ['The mischievous mountain was covered in snow.', 'She ran mischievous and won the race.'],
    ),
    w(
      'tyrant',
      'TY-runt',
      'noun',
      'Someone with power who uses it cruelly.',
      'Miss Trunchbull runs Crunchem Hall like a tyrant.',
      'The coach was a tyrant who made them run until they cried.',
      ['He tyranted the ball down the court.', 'The tyrant was baked for forty minutes.'],
    ),
    w(
      'prodigy',
      'PROD-i-jee',
      'noun',
      'A child who is astonishingly good at something.',
      'Matilda reads Dickens at four years old — she’s a prodigy.',
      'The five-year-old pianist was a prodigy.',
      ['She prodigied the letter to her aunt.', 'The prodigy was parked behind the school.'],
    ),
  ],
  wonder: [
    w(
      'precept',
      'PREE-sept',
      'noun',
      'A short rule for how to live.',
      'Mr. Browne writes a precept on the board every month.',
      'His favourite precept was "choose kind."',
      ['He precepted the window shut.', 'The precept was nine feet tall.'],
    ),
    w(
      'empathy',
      'EM-puh-thee',
      'noun',
      'Feeling what someone else is feeling, from their side of it.',
      'Everyone who narrates a chapter learns some empathy for Auggie.',
      'It took empathy to see why she had gone quiet.',
      ['She empathied the dishes after dinner.', 'The empathy rolled down the hill.'],
    ),
    w(
      'conspicuous',
      'kun-SPIK-yoo-us',
      'adjective',
      'Impossible not to notice.',
      'Auggie wants an ordinary day, but he is conspicuous everywhere he goes.',
      'His bright orange coat made him conspicuous in the crowd.',
      ['The conspicuous tasted mostly of salt.', 'He conspicuoused his homework before class.'],
    ),
  ],
  holes: [
    w(
      'desolate',
      'DESS-uh-lit',
      'adjective',
      'Empty and bleak, with nothing living in it.',
      'Camp Green Lake has no lake and no green — it’s desolate.',
      'Nothing grew on that desolate stretch of rock.',
      ['She desolated the letter and sent it.', 'The desolate rang for a full minute.'],
    ),
    w(
      'futile',
      'FYOO-tile',
      'adjective',
      'Pointless — it cannot possibly work.',
      'Digging holes all day to find nothing is exactly as futile as it sounds.',
      'Arguing with the referee was futile.',
      ['He futiled the tent into the ground.', 'The futile was served with rice.'],
    ),
    w(
      'ancestor',
      'AN-sess-ter',
      'noun',
      'A family member from long before you were born.',
      'Stanley blames his no-good-dirty-rotten-pig-stealing-great-great-grandfather — an ancestor.',
      'Her ancestor arrived on a ship in 1890.',
      ['She ancestored the cake into eight slices.', 'The ancestor was painted pale blue.'],
    ),
  ],
  crossover: [
    w(
      'rivalry',
      'RY-vul-ree',
      'noun',
      'An ongoing competition between two people who both want to win.',
      'Josh and Jordan’s rivalry runs through every poem in this book.',
      'The rivalry between the two schools went back thirty years.',
      ['He rivalried the ball to the hoop.', 'The rivalry was made of cardboard.'],
    ),
    w(
      'legacy',
      'LEG-uh-see',
      'noun',
      'What someone leaves behind that outlasts them.',
      'Josh’s dad played pro ball, and that legacy sits on both twins.',
      'Her legacy was the library she built for the town.',
      ['She legacied the note under his door.', 'The legacy boiled for ten minutes.'],
    ),
    w(
      'momentum',
      'mo-MEN-tum',
      'noun',
      'The force something builds up once it’s already moving.',
      'A team on a scoring run has momentum, and this book is full of them.',
      'They scored twice more and never lost the momentum.',
      ['He momentumed the door open.', 'The momentum was knitted from wool.'],
    ),
  ],
  terabithia: [
    w(
      'grief',
      'GREEF',
      'noun',
      'The deep sadness that comes after losing someone.',
      'The last third of this book is about Jess carrying his grief.',
      'His grief came in waves for months afterwards.',
      ['She griefed the shelf onto the wall.', 'The grief measured six inches.'],
    ),
    w(
      'solace',
      'SOL-iss',
      'noun',
      'Comfort you find in the middle of something painful.',
      'Jess finds solace in painting, and then in the bridge he builds.',
      'She found solace in long walks by the river.',
      ['He solaced the ball over the fence.', 'The solace arrived by post on Tuesday.'],
    ),
    w(
      'imaginary',
      'i-MAJ-i-nair-ee',
      'adjective',
      'Existing only in someone’s mind.',
      'Terabithia is imaginary, which is exactly what makes it real to them.',
      'Her imaginary kingdom had its own flag and language.',
      ['He imaginaried the fence around the yard.', 'The imaginary weighed four pounds.'],
    ),
  ],
  hatchet: [
    w(
      'resourceful',
      'ri-SORSS-ful',
      'adjective',
      'Good at solving problems with whatever you happen to have.',
      'Brian has a hatchet and a windbreaker. He gets resourceful fast.',
      'She was resourceful enough to fix the bike with a shoelace.',
      [
        'The resourceful was frozen solid overnight.',
        'He resourcefuled the letter into the mailbox.',
      ],
    ),
    w(
      'instinct',
      'IN-stinkt',
      'noun',
      'Knowing what to do without being taught it.',
      'Brian stops thinking and starts trusting instinct about halfway through.',
      'Some instinct told her not to open the door.',
      ['She instincted the soup until it was hot.', 'The instinct was three metres wide.'],
    ),
    w(
      'provisions',
      'pruh-VIZH-unz',
      'noun',
      'The food and supplies you set aside to get you through.',
      'Every berry and fish Brian stores away is provisions.',
      'They packed enough provisions for a week in the woods.',
      ['He provisioned the wall a bright yellow.', 'The provisions sang the last verse.'],
    ),
  ],
}

// A book Beanstack has no words for yet (a manual entry, or an untitled log)
// still owes the reader a word — these are the general-interest fallbacks.
export const FALLBACK_WORDS = [
  w(
    'vivid',
    'VIV-id',
    'adjective',
    'So clear and bright in your head that it feels real.',
    'Whatever you just read, the parts you can still picture are the vivid ones.',
    'She had a vivid memory of her first day at that school.',
    ['He vivided the paint onto the wall.', 'The vivid weighed about a pound.'],
  ),
  w(
    'narrator',
    'NAIR-ay-ter',
    'noun',
    'The voice telling you the story.',
    'Every book has a narrator — sometimes a character, sometimes not.',
    'The narrator turned out to be lying the whole time.',
    ['She narratored the ball to third base.', 'The narrator was made of glass.'],
  ),
  w(
    'motive',
    'MO-tiv',
    'noun',
    'The reason someone does what they do.',
    'Ask what a character’s motive is and the plot usually opens right up.',
    'Nobody could work out his motive for hiding the letter.',
    ['He motived the door closed with his foot.', 'The motive was served with rice.'],
  ),
]

/** Every word in the prototype, flattened, with the book it came from attached. */
export const ALL_WORDS = [
  ...Object.entries(WORDS_BY_BOOK).flatMap(([bookId, words]) =>
    words.map((word) => ({ ...word, bookId })),
  ),
  ...FALLBACK_WORDS.map((word) => ({ ...word, bookId: null })),
]

export const wordByName = (name) => ALL_WORDS.find((x) => x.word === name)

/**
 * The next word this book still owes the reader. Falls back to the general pool
 * once a book's words are spent (or when the book has none — a manual entry).
 */
export function pickWord(bookId, collectedWords = []) {
  const has = new Set(collectedWords)
  const fromBook = (WORDS_BY_BOOK[bookId] ?? []).find((x) => !has.has(x.word))
  if (fromBook) return { ...fromBook, bookId }
  const spare = FALLBACK_WORDS.find((x) => !has.has(x.word))
  return spare ? { ...spare, bookId: null } : null
}

// ─── Olivia's collection so far ──────────────────────────────────────────────
// `firstTry: false` means she picked a wrong sentence before getting it — the
// signal the educator roll-up reports as first-try accuracy.

const collected = (word, bookId, date, firstTry = true) => ({ word, bookId, date, firstTry })

// Deliberately at least one word short of exhausting each book: whichever
// title the demo logs against, Benny still has a real word from it to hand over
// rather than falling through to the general-interest pool.
export const SEED_COLLECTION = [
  collected('earnest', 'she-gets-the-girl', '2026-06-01'),
  collected('reluctant', 'she-gets-the-girl', '2026-06-02', false),
  collected('destiny', 'rump', '2026-06-04'),
  collected('bargain', 'rump', '2026-06-05'),
  collected('coincidence', 'lucky-cap', '2026-06-07'),
  collected('conform', 'lesbianas-guide', '2026-06-09', false),
  collected('desolate', 'holes', '2026-06-11'),
  collected('futile', 'holes', '2026-06-12'),
  collected('mischievous', 'matilda', '2026-06-14'),
  collected('tyrant', 'matilda', '2026-06-15'),
  collected('precept', 'wonder', '2026-06-17'),
  collected('empathy', 'wonder', '2026-06-18', false),
  collected('resourceful', 'hatchet', '2026-06-20'),
  collected('rivalry', 'crossover', '2026-06-21'),
  collected('grief', 'terabithia', '2026-06-22'),
  collected('melancholy', 'darius', '2026-06-23'),
  collected('heritage', 'darius', '2026-06-24'),
  collected('clandestine', 'telegraph-club', '2026-06-25'),
  collected('suspicion', 'telegraph-club', '2026-06-26'),
]

// ─── Olivia's other collections ──────────────────────────────────────────────
// Badges and achievements share the Collections tab with her words, so they use
// the same shapes the `books` prototype already established (its `badge` /
// `achievement` helpers and illustrated AchievementArt medallions).

const badge = (name, date, blurb, color, icon = 'award') => ({ name, date, blurb, color, icon })
// `art` picks the illustrated medallion in books/AchievementArt.jsx.
const achievement = (name, date, detail, art = 'books') => ({ name, date, detail, art })

// Earned badges only — the shelf in the product is "Earned Badges", and unearned
// ones live behind their own switch. Each carries the line the card shows under
// its name, the way a real badge states what completed it.
export const BADGES = [
  badge(
    'Word Collector',
    'Jun 26, 2026',
    'Earned for collecting 10 words!',
    '#7C3AED',
    'vocabulary',
  ),
  badge(
    '2-Week Streak',
    'Jun 24, 2026',
    'Earned for logging 14 days in a row!',
    '#F0A024',
    'flame',
  ),
  badge(
    'Spring Into Reading',
    'Apr 30, 2026',
    'Earned for completing Spring Into Reading!',
    '#0DA7BC',
    'trophy',
  ),
  badge(
    'First Review',
    'Apr 18, 2026',
    'Earned for writing your first review!',
    '#16A97A',
    'writing',
  ),
  badge('Ten Titles', 'Apr 6, 2026', 'Earned for finishing 10 books!', '#2563EB', 'book-2'),
]

export const ACHIEVEMENTS = [
  achievement('Read 12 books', 'Jun 22, 2026', 'Grade 6 goal was 10', 'books'),
  achievement('Logged 40 sessions', 'Jun 18, 2026', 'Most in Room 14 this term', 'streak'),
  achievement('Collected 19 words', 'Jun 26, 2026', 'From 12 different books', 'series'),
  achievement('Wrote 4 reviews', 'May 30, 2026', 'Two of them on nonfiction', 'reviews'),
]

// ─── The educator side ───────────────────────────────────────────────────────
// One teacher, one class. The brief asks for "student and classroom level", so
// the roster carries the per-student numbers the roll-up aggregates.

export const TEACHER = { name: 'Mr. Reyes', initials: 'JR', school: 'Lincoln Middle School' }

export const CLASS = {
  id: 'room-14',
  name: 'Room 14',
  initials: 'R14',
  grade: '6th Grade ELA',
  year: '2025–26 School Year',
  term: 'This school year',
}

// `id` doubles as the Student Profile's own key where one exists — marcus,
// anne and tyler are the three the profile actually has data for, and the three
// on Beanstack's real classroom page. Everyone else opens the profile with
// their name carried over (see PROFILE_KEYS below).
const student = (id, name, initials, color, words, week, firstTry, last, lastBook, logs) => ({
  id,
  name,
  initials,
  color,
  words, // words collected all year
  week, // words collected in the last 7 days
  firstTry, // % of words banked on the first sentence pick
  last, // most recent word
  lastBook,
  logs, // reading logs all year — the thing the feature is trying to move
})

export const ROSTER = [
  student(
    'olivia',
    'Olivia Martinez',
    'OM',
    '#F09A77',
    19,
    7,
    84,
    'suspicion',
    'telegraph-club',
    41,
  ),
  student('noah', 'Noah Martinez', 'NM', '#7C5CFA', 28, 6, 90, 'instinct', 'hatchet', 58),
  student('marcus', 'Marcus Chen', 'MC', '#0DA7BC', 27, 7, 94, 'defiance', 'telegraph-club', 62),
  student('tyler', 'Tyler Voss', 'TV', '#16A97A', 27, 4, 78, 'momentum', 'crossover', 49),
  student('anne', 'Anne Boonchuy', 'AB2', '#E8734A', 22, 5, 86, 'earnest', 'she-gets-the-girl', 44),
  student('ethan', 'Ethan Brooks', 'EB', '#5B7CFA', 12, 0, 71, 'tyrant', 'matilda', 26),
  student('sofia', 'Sofia Ramirez', 'SR', '#D946A0', 26, 6, 88, 'resilient', 'lesbianas-guide', 53),
  student('jayden', 'Jayden Cole', 'JC', '#0EA5A5', 9, 0, 64, 'grief', 'terabithia', 19),
  student('harper', 'Harper Quinn', 'HQ', '#F0A024', 25, 5, 84, 'precept', 'wonder', 47),
  student('mateo', 'Mateo Silva', 'MS', '#8B5CF6', 20, 4, 80, 'desolate', 'holes', 38),
  student('zoe', 'Zoe Nakamura', 'ZN', '#14B8A6', 28, 8, 92, 'melancholy', 'darius', 66),
  student('caleb', 'Caleb Owens', 'CO', '#F472B6', 6, 0, 58, 'vivid', null, 11),
  student('amara', 'Amara Bello', 'AB', '#22C55E', 28, 6, 87, 'legacy', 'crossover', 51),
  student('lucas', 'Lucas Fenn', 'LF', '#3B82F6', 17, 3, 76, 'bargain', 'rump', 34),
  student('nora', 'Nora Ellis', 'NE', '#EF4444', 24, 5, 82, 'solace', 'terabithia', 45),
  student('idris', 'Idris Haddad', 'IH', '#A855F7', 15, 4, 74, 'peculiar', 'rump', 31),
  student('lena', 'Lena Petrov', 'LP', '#06B6D4', 26, 7, 91, 'infatuated', 'she-gets-the-girl', 59),
  student('omar', 'Omar Aziz', 'OA', '#F59E0B', 11, 0, 68, 'provisions', 'hatchet', 22),
  student('grace', 'Grace Whitfield', 'GW', '#EC4899', 26, 5, 85, 'conform', 'lesbianas-guide', 48),
  student('tobias', 'Tobias Reyes', 'TR', '#10B981', 21, 4, 79, 'motive', null, 40),
  student('priya', 'Priya Raman', 'PR', '#6366F1', 27, 6, 89, 'conspicuous', 'wonder', 55),
  student('devon', 'Devon Marsh', 'DM', '#F97316', 4, 0, 50, 'narrator', null, 8),
  student('kaia', 'Kaia Lindqvist', 'KL', '#0891B2', 23, 5, 81, 'coincidence', 'lucky-cap', 43),
  student(
    'reuben',
    'Reuben Ortiz',
    'RO',
    '#84CC16',
    19,
    4,
    77,
    'reluctant',
    'she-gets-the-girl',
    37,
  ),
]

/** The roster ids the Student Profile has real data behind. */
export const PROFILE_KEYS = new Set(['marcus', 'anne', 'tyler'])

/**
 * What to open the Student Profile with. A row the profile knows gets its own
 * profile; every other row borrows one of the three as stand-in analysis and
 * overrides the name, so the header still shows who you clicked.
 */
export function profileFor(studentId) {
  const person = ROSTER.find((s) => s.id === studentId)
  if (!person) return null
  if (PROFILE_KEYS.has(person.id)) return { studentKey: person.id, overrides: undefined }
  const standIns = [...PROFILE_KEYS]
  const key = standIns[ROSTER.findIndex((s) => s.id === person.id) % standIns.length]
  return { studentKey: key, overrides: { name: person.name, grade: '6th Grade' } }
}

/**
 * The class word wall — every word anyone in the room has collected, and how
 * many of the 24 students have it. This is what the word cloud is drawn from,
 * so it covers the whole vocabulary rather than a top-eight: the long tail is
 * the point, and it is what makes the cloud look like a class rather than a
 * chart.
 *
 * Two invariants hold it to the rest of the data — `wordByName` has to know
 * every word here, and the counts sum to the 490 words the roster says the
 * class has collected, because each one is a student-word pair.
 */
export const CLASS_TOP_WORDS = [
  { word: 'mischievous', students: 24 },
  { word: 'empathy', students: 23 },
  { word: 'grief', students: 22 },
  { word: 'precept', students: 20 },
  { word: 'desolate', students: 19 },
  { word: 'resilient', students: 19 },
  { word: 'resourceful', students: 18 },
  { word: 'destiny', students: 18 },
  { word: 'legacy', students: 17 },
  { word: 'instinct', students: 17 },
  { word: 'rivalry', students: 16 },
  { word: 'melancholy', students: 15 },
  { word: 'prodigy', students: 15 },
  { word: 'solace', students: 15 },
  { word: 'awkward', students: 14 },
  { word: 'tyrant', students: 14 },
  { word: 'imaginary', students: 14 },
  { word: 'defiance', students: 13 },
  { word: 'momentum', students: 13 },
  { word: 'peculiar', students: 12 },
  { word: 'futile', students: 12 },
  { word: 'suspicion', students: 12 },
  { word: 'clandestine', students: 11 },
  { word: 'ancestor', students: 11 },
  { word: 'conspicuous', students: 11 },
  { word: 'reluctant', students: 10 },
  { word: 'heritage', students: 10 },
  { word: 'earnest', students: 10 },
  { word: 'bargain', students: 9 },
  { word: 'conform', students: 9 },
  { word: 'coincidence', students: 8 },
  { word: 'superstition', students: 8 },
  { word: 'vivid', students: 7 },
  { word: 'infatuated', students: 7 },
  { word: 'narrator', students: 6 },
  { word: 'provisions', students: 6 },
  { word: 'motive', students: 5 },
]

/** Words collected per week, against reading logs per week, since the feature turned on. */
export const CLASS_TREND = [
  { week: 'Mar 30', words: 0, logs: 61 },
  { week: 'Apr 6', words: 34, logs: 68 },
  { week: 'Apr 13', words: 51, logs: 74 },
  { week: 'Apr 20', words: 48, logs: 71 },
  { week: 'Apr 27', words: 63, logs: 83 },
  { week: 'May 4', words: 70, logs: 88 },
  { week: 'May 11', words: 66, logs: 85 },
  { week: 'May 18', words: 79, logs: 94 },
  { week: 'May 25', words: 84, logs: 97 },
  { week: 'Jun 1', words: 91, logs: 103 },
  { week: 'Jun 8', words: 88, logs: 99 },
  { week: 'Jun 15', words: 104, logs: 112 },
]

/** A student's own collection, invented per-student so the drill-down is real. */
export function collectionFor(studentId) {
  if (studentId === 'olivia') return SEED_COLLECTION
  const person = ROSTER.find((s) => s.id === studentId)
  if (!person) return []
  // Only words that name a book, so every row in the drill-down cites a title.
  const pool = ALL_WORDS.filter((x) => x.bookId)
  const start = ROSTER.findIndex((s) => s.id === studentId) * 3
  const n = Math.min(person.words, pool.length)
  // How many of these took a second go has to come out at the roster's own
  // `firstTry` percentage — the profile prints that figure directly above the
  // list, and the list is now filterable by exactly that split, so a fixed
  // one-in-seven would have had the two disagreeing in plain sight.
  const retries = Math.round((n * (100 - person.firstTry)) / 100)
  // Spread evenly through the run rather than clustered, and deterministic.
  const retried = new Set(
    Array.from({ length: retries }, (_, k) => Math.floor(((k + 0.5) * n) / Math.max(retries, 1))),
  )
  // Dated oldest-first, one every couple of days up to Jun 26, so the view's
  // newest-first ordering actually descends.
  const END = Date.UTC(2026, 5, 26)
  return Array.from({ length: n }, (_, i) => {
    const src = pool[(start + i) % pool.length]
    const day = new Date(END - (n - 1 - i) * 2 * 86400000)
    return {
      word: src.word,
      bookId: src.bookId,
      date: day.toISOString().slice(0, 10),
      firstTry: !retried.has(i),
    }
  })
}

// ─── Activities ──────────────────────────────────────────────────────────────
// One word, three activities. The single multiple-choice question the first
// version shipped with turned out to be the thing reviewers pushed back on
// hardest — watching a student use Flocabulary, "she had to identify
// definitions, pick accurate statements, etc. probably 3–5 times per key vocab
// word", where Benny was asking once. So collecting a word is now a short round
// that climbs a ladder: recognise it, use it, then produce something with it.
//
// Only `passage` and `write` need authored content beyond what a word already
// carries — the other three are derived, so adding a word to WORDS_BY_BOOK
// still costs one entry.

export const ACTIVITY_TYPES = [
  {
    id: 'definition',
    rung: 'Recognise it',
    label: 'Match the meaning',
    short: 'Meaning',
    icon: 'vocabulary',
    blurb: 'The word, three meanings, one of them right.',
  },
  {
    id: 'blank',
    rung: 'Recognise it',
    label: 'Fill in the blank',
    short: 'Blank',
    icon: 'edit',
    blurb: 'A sentence with a hole in it and three words to drop in.',
  },
  {
    id: 'sentence',
    rung: 'Use it',
    label: 'Pick the right sentence',
    short: 'Sentence',
    icon: 'quote',
    blurb: 'Three sentences, one of which actually uses the word correctly.',
  },
  {
    id: 'passage',
    rung: 'Use it',
    label: 'Finish the passage',
    short: 'Passage',
    icon: 'book',
    blurb: 'A paragraph about the book with words dragged into its gaps.',
  },
  {
    id: 'write',
    rung: 'Produce it',
    label: 'Write your own',
    short: 'Write',
    icon: 'pencil',
    blurb: 'Write a sentence using the word; Benny reads it back.',
  },
  {
    id: 'synonym',
    rung: 'Recognise it',
    label: 'Find the near-match',
    short: 'Near-match',
    icon: 'arrows-exchange',
    blurb: 'Which everyday word means almost the same thing.',
  },
  {
    id: 'pairs',
    rung: 'Recognise it',
    label: 'Match the pairs',
    short: 'Pairs',
    icon: 'layout-columns',
    blurb: 'Words down one side, meanings down the other — tap across.',
  },
  {
    id: 'card',
    rung: 'Use it',
    label: 'Pick a card',
    short: 'Card',
    icon: 'layers',
    blurb: 'Turn one over and say whether it uses the word right.',
  },
  {
    id: 'oddoneout',
    rung: 'Use it',
    label: 'Spot the odd one',
    short: 'Odd one',
    icon: 'circle-x',
    blurb: 'Four sentences, one of which gets its word wrong.',
  },
]

export const activityType = (id) => ACTIVITY_TYPES.find((t) => t.id === id)

export const ROUND_LENGTH = 3

// Four rounds, rotated by word. Every round is three *different* activities and
// climbs the same ladder; across the four, all five types get used and writing
// lands in half of them, so a reader banking several words in a week is neither
// asked the same question three times nor made to type every single time.
const ROUNDS = [
  ['definition', 'card', 'write'],
  ['blank', 'passage', 'sentence'],
  ['synonym', 'oddoneout', 'write'],
  ['pairs', 'sentence', 'card'],
]

/** The three activities this word takes to collect. */
export function roundFor(word) {
  return ROUNDS[word.word.length % ROUNDS.length]
}

/** Deterministic rotation, so the right answer isn't always in the same slot. */
export function arrange(options, seed) {
  const by = seed % options.length
  return [...options.slice(by), ...options.slice(0, by)]
}

/** Other words that could plausibly be confused with this one — same part of
 *  speech where the pool has enough of them, in a stable order. */
export function decoys(word, count = 2) {
  const sameKind = ALL_WORDS.filter((x) => x.word !== word.word && x.part === word.part)
  const pool = sameKind.length >= count ? sameKind : ALL_WORDS.filter((x) => x.word !== word.word)
  const start = word.word.length % pool.length
  // Strided, then filled in sequence. The stride keeps the decoys spread
  // through the list rather than adjacent; the second pass exists because a
  // stride alone repeats itself once `count` is large (offsets 0, 3, 6, 9 all
  // collide in a pool of nine), which put the same chip on screen twice.
  const out = []
  for (let i = 0; i < pool.length && out.length < count; i++) {
    const pick = pool[(start + i * 3) % pool.length]
    if (!out.includes(pick)) out.push(pick)
  }
  for (let i = 0; i < pool.length && out.length < count; i++) {
    const pick = pool[(start + i) % pool.length]
    if (!out.includes(pick)) out.push(pick)
  }
  return out
}

export function definitionOptions(word) {
  const options = [
    { text: word.meaning, correct: true },
    ...decoys(word).map((d) => ({ text: d.meaning, correct: false })),
  ]
  return arrange(options, word.word.length)
}

/**
 * The sentence for the fill-in-the-blank, with the word punched out. It uses
 * Benny's book line rather than the generic example, for two reasons: the gap
 * then sits in a sentence about the book the reader just put down, and the
 * generic example stays unspent for the pick-a-sentence activity — the two can
 * land in the same round, and asking the same sentence twice would show.
 */
export function clozeFor(word) {
  const hole = new RegExp(`\\b${word.word}\\b`, 'i')
  const source = hole.test(word.why) ? word.why : word.check.correct
  return source.replace(hole, '____')
}

/** Fill-in-the-blank: the word against four others of the same kind. Single
 *  words are quick to scan, so a three-chip row was a one-in-three guess — this
 *  makes reading the sentence cheaper than trying them all. */
export function blankOptions(word) {
  const options = [
    { text: word.word, correct: true },
    ...decoys(word, 4).map((d) => ({ text: d.word, correct: false })),
  ]
  return arrange(options, word.word.length + 1)
}

// ─── Passages ────────────────────────────────────────────────────────────────
// The drag-into-context activity. Each passage is about the book the word came
// from and takes that book's whole set of words, so the activity reviews words
// the reader already banked while it teaches the new one — the point of the
// exercise is the words sitting next to each other in one piece of writing.
//
// `text` carries {0}-style slots; `answers[i]` is the word that belongs in slot
// i. The tray adds two near-miss words on top of the answers.

const passage = (text, answers) => ({ text, answers })

export const PASSAGES = {
  'she-gets-the-girl': passage(
    'Alex agrees to help, but she is a deeply {0} wingman — she would rather be anywhere else. Molly is the opposite: she is completely {1} with Cora, and she is so {2} about the whole plan that she writes it down step by step.',
    ['reluctant', 'infatuated', 'earnest'],
  ),
  rump: passage(
    'Rump believes his half-a-name has already decided his {0}. The spinning is a {1} kind of magic, and every time he uses it he ends up striking another {2} he does not fully understand.',
    ['destiny', 'peculiar', 'bargain'],
  ),
  'lucky-cap': passage(
    'Enzo is sure the cap is what turned his luck around, which makes it less of a {0} than a full-blown {1} — he will not step onto the field without it.',
    ['coincidence', 'superstition'],
  ),
  'lesbianas-guide': passage(
    'Dani spends the first half of the book trying to {0} to what everyone at school expects of her. What makes her {1} is that she keeps going anyway, even after the parts that should have flattened her.',
    ['conform', 'resilient'],
  ),
  'telegraph-club': passage(
    'Lily’s trips to the club are {0} — nobody at home can know. In 1954 that secrecy draws {1} all on its own, and every night she goes back is a quiet act of {2}.',
    ['clandestine', 'suspicion', 'defiance'],
  ),
  darius: passage(
    'Darius lands in Yazd feeling {0} about a {1} he has only ever heard about second-hand. The first few days are {2} in every direction, until a boy named Sohrab knocks on the door.',
    ['melancholy', 'heritage', 'awkward'],
  ),
  matilda: passage(
    'Miss Trunchbull runs Crunchem Hall like a {0}, and the children learn to keep their heads down. Matilda is a genuine {1} — she has read half the library before she turns five — and just {2} enough to start getting even.',
    ['tyrant', 'prodigy', 'mischievous'],
  ),
  wonder: passage(
    'Mr. Browne writes a {0} on the board every month, and the one everybody remembers is about choosing kind. Auggie is the most {1} kid in the building on his first day; the book is really about how much {2} the rest of them can find.',
    ['precept', 'conspicuous', 'empathy'],
  ),
  holes: passage(
    'Camp Green Lake is a {0} stretch of dried-up dirt, and digging a hole a day feels completely {1} — until Stanley works out that the curse on his family goes all the way back to one {2}.',
    ['desolate', 'futile', 'ancestor'],
  ),
  crossover: passage(
    'Josh and Jordan’s {0} runs the whole season, on the court and off it. Their dad’s {1} is the thing they are both playing against, and once Josh loses his {2} he cannot get it back.',
    ['rivalry', 'legacy', 'momentum'],
  ),
  terabithia: passage(
    'Terabithia is an {0} kingdom the two of them rule out past the creek, and it is where Jess finds {1} when everything at home is loud. What the last chapters are really about is {2}.',
    ['imaginary', 'solace', 'grief'],
  ),
  hatchet: passage(
    'Brian has no {0} beyond a bag of snacks, so he has to be {1} with a single hatchet and whatever the lake will give him. By the end he trusts his own {2} more than anything he was ever told.',
    ['provisions', 'resourceful', 'instinct'],
  ),
  // A manual log, or a title Beanstack has no words for yet.
  _default: passage(
    'The parts of a book you can still picture afterwards are the {0} ones. Ask who the {1} is and what each character’s {2} is, and most stories open right up.',
    ['vivid', 'narrator', 'motive'],
  ),
}

/** The passage for a book, with the tray it needs: the answers plus four
 *  near-misses, in a stable order. Two extras against three gaps meant the last
 *  gap could be filled by elimination without reading it. */
export function passageFor(bookId) {
  const p = PASSAGES[bookId] ?? PASSAGES._default
  const spare = ALL_WORDS.filter((x) => !p.answers.includes(x.word))
  const start = p.answers.join('').length % spare.length
  const extra = [0, 7, 13, 19].map((n) => spare[(start + n) % spare.length].word)
  return { ...p, tray: arrange([...p.answers, ...new Set(extra)], p.answers.length) }
}

// ─── The writing activity ────────────────────────────────────────────────────
// "Write a sentence using the word" with an automated read-back. The check here
// is deliberately shallow — a prototype cannot run the model — but it is the
// same shape a real one would take: did they use the word, is it a sentence,
// and did they write something of their own rather than copy the example back.
// Anything it can't confidently accept is sent on for the teacher to look at,
// which is what the educator view's review queue is.

export const WRITING_PROMPTS = {
  definition: 'Write one sentence that shows you know what it means.',
  book: (title) => `Write one sentence using it — about ${title} if you like, or anything else.`,
}

export function checkSentence(text, word) {
  const clean = text.trim()
  const words = clean.split(/\s+/).filter(Boolean)
  const stem = word.word.slice(0, Math.max(4, word.word.length - 3))
  const usedIt = new RegExp(stem, 'i').test(clean)

  if (!usedIt) return { verdict: 'retry', note: `This one needs the word ${word.word} in it.` }
  if (words.length < 5)
    return { verdict: 'retry', note: 'Give me a bit more — a whole sentence, not just a phrase.' }

  const copied =
    clean.toLowerCase().replace(/[^a-z ]/g, '') ===
    word.check.correct.toLowerCase().replace(/[^a-z ]/g, '')
  if (copied) return { verdict: 'retry', note: 'That’s my sentence! Try one that’s yours.' }

  // A sentence that just restates the definition is accepted, but it's the kind
  // of thing a teacher would want to see — so it goes in the queue flagged.
  const restated = word.meaning
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 5)
    .filter((t) => clean.toLowerCase().includes(t)).length

  if (restated >= 2)
    return {
      verdict: 'flag',
      note: 'Got it — though that’s close to the definition. I’ll pass it to Mr. Reyes.',
    }

  return { verdict: 'accept', note: 'That works. You used it the way it’s meant to be used.' }
}

// ─── Review ──────────────────────────────────────────────────────────────────
// The flashcard deck, and the scheduling behind it. A word a reader collected
// once is a word they will lose — so the collection doubles as a deck that
// keeps handing back the words that are going stale, at widening intervals.
// Five boxes, Leitner-style: getting a word right moves it up a box and buys
// more time before it comes round again; missing it sends it back to the start.

export const TODAY = '2026-06-28'

export const REVIEW_BOXES = [
  { box: 1, days: 1, label: 'Learning' },
  { box: 2, days: 2, label: 'Getting there' },
  { box: 3, days: 4, label: 'Sticking' },
  { box: 4, days: 8, label: 'Nearly known' },
  { box: 5, days: 16, label: 'Known' },
]

export const boxInfo = (box) => REVIEW_BOXES[Math.min(Math.max(box, 1), 5) - 1]

/**
 * The five boxes are the deck's own bookkeeping — they decide when a word comes
 * back and nothing else. What a reader is shown is one of three bands, because
 * "is this sticking yet?" is the only question they're actually asking of the
 * collection. One vocabulary for the tile tags and the filter above them: two
 * sets of names for the same idea had a word tagged "Nearly known" sitting
 * under a filter called "Known well".
 */
export const KNOWN_BANDS = [
  { id: 'learning', label: 'Still learning', boxes: [1, 2] },
  { id: 'sticking', label: 'Sticking', boxes: [3] },
  { id: 'known', label: 'Known well', boxes: [4, 5] },
]

export const bandFor = (box) =>
  KNOWN_BANDS.find((b) => b.boxes.includes(Math.min(Math.max(box, 1), 5))) ?? KNOWN_BANDS[0]

const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000)

export const isDue = (card, today = TODAY) =>
  daysBetween(card.seen, today) >= boxInfo(card.box).days

/**
 * Where each collected word stands. A word banked on the first try starts a box
 * higher than one that took a second attempt, and the last time it was seen is
 * the day it was collected — so an older word with a low box is exactly the one
 * that has gone stale, which is what the deck should lead with.
 */
export function seedReviews(collection) {
  const cards = {}
  collection.forEach((entry, i) => {
    cards[entry.word] = {
      word: entry.word,
      box: entry.firstTry ? 1 + ((i + 1) % 4) : 1,
      seen: entry.date,
      right: 0,
      wrong: 0,
    }
  })
  return cards
}

/** Newly collected words enter at box 1 — they have never been reviewed. */
export const newCard = (word, seen = TODAY) => ({ word, box: 1, seen, right: 0, wrong: 0 })

/** Which words are asking to be looked at, stalest first. */
export function dueCards(cards, today = TODAY) {
  return Object.values(cards)
    .filter((c) => isDue(c, today))
    .sort((a, b) => daysBetween(a.seen, today) - daysBetween(b.seen, today))
    .reverse()
}

/** Where a card lands after the reader says whether they knew it. */
export function gradeCard(card, knewIt, today = TODAY) {
  return {
    ...card,
    box: knewIt ? Math.min(card.box + 1, 5) : 1,
    seen: today,
    right: card.right + (knewIt ? 1 : 0),
    wrong: card.wrong + (knewIt ? 0 : 1),
  }
}

// ─── What the educator sees of all this ──────────────────────────────────────
// With one activity type there was one number. With five there is a shape: the
// class is fine at picking a meaning out of a list and much shakier at putting
// the word into a sentence of their own, which is the distinction a teacher can
// actually act on.

export const ACTIVITY_ACCURACY = [
  { id: 'definition', attempts: 412, firstTry: 91 },
  { id: 'blank', attempts: 388, firstTry: 84 },
  { id: 'sentence', attempts: 431, firstTry: 79 },
  { id: 'passage', attempts: 301, firstTry: 68 },
  { id: 'write', attempts: 274, firstTry: 61 },
]

/**
 * The writing activity's output. Everything students wrote is here; `flagged`
 * ones are the ones the automatic check wasn't confident about and wants a
 * person to look at. This is the only part of the feature that puts work on a
 * teacher's desk, so it stays a short queue rather than a full inbox.
 */
const written = (student, word, bookId, text, status, date) => ({
  student,
  word,
  bookId,
  text,
  status, // 'flagged' — needs a look — or 'accepted'
  date,
})

export const WRITING_QUEUE = [
  written(
    'jayden',
    'grief',
    'terabithia',
    'The grief was a heavy thing that Jess carried around in his chest for a long time.',
    'accepted',
    '2026-06-27',
  ),
  written(
    'ethan',
    'tyrant',
    'matilda',
    'A tyrant is a person who is a cruel ruler with total power over people.',
    'flagged',
    '2026-06-27',
  ),
  written(
    'caleb',
    'vivid',
    null,
    'The dream was vivid so I remembered it.',
    'flagged',
    '2026-06-26',
  ),
  written(
    'zoe',
    'melancholy',
    'darius',
    'Darius gets melancholy on the plane because he is going somewhere he has never been but is supposed to be from.',
    'accepted',
    '2026-06-26',
  ),
  written(
    'omar',
    'provisions',
    'hatchet',
    'We packed provisions for the camping trip, mostly granola bars.',
    'accepted',
    '2026-06-25',
  ),
  written(
    'devon',
    'narrator',
    null,
    'The narrator is the voice telling you the story of the book.',
    'flagged',
    '2026-06-25',
  ),
]

// ─── Near-synonyms ───────────────────────────────────────────────────────────
// The one thing the synonym activity can't derive: a word the reader plausibly
// already owns that lands close to this one. Kept as its own map rather than an
// eighth argument to `w()` — adding a word still costs one entry there, and one
// line here, which is the trade the rest of this file is built on.
//
// Deliberately everyday words. The point is "you know a word for this already",
// not a thesaurus drill, so `clandestine → secret` rather than `→ surreptitious`.

export const SYNONYMS = {
  earnest: 'sincere',
  reluctant: 'unwilling',
  infatuated: 'smitten',
  destiny: 'fate',
  bargain: 'deal',
  peculiar: 'odd',
  coincidence: 'fluke',
  superstition: 'myth',
  conform: 'comply',
  resilient: 'tough',
  clandestine: 'secret',
  suspicion: 'doubt',
  defiance: 'resistance',
  melancholy: 'sadness',
  heritage: 'tradition',
  awkward: 'clumsy',
  mischievous: 'naughty',
  tyrant: 'dictator',
  prodigy: 'genius',
  precept: 'rule',
  empathy: 'compassion',
  conspicuous: 'noticeable',
  desolate: 'barren',
  futile: 'pointless',
  ancestor: 'forebear',
  rivalry: 'competition',
  legacy: 'inheritance',
  momentum: 'drive',
  grief: 'sorrow',
  solace: 'comfort',
  imaginary: 'make-believe',
  resourceful: 'inventive',
  instinct: 'hunch',
  provisions: 'supplies',
  vivid: 'lifelike',
  narrator: 'storyteller',
  motive: 'reason',
}

/** Which everyday word means almost the same — against two that don't. */
export function synonymOptions(word) {
  const right = SYNONYMS[word.word]
  // De-duplicated: two collected words can share a synonym, and the same chip
  // twice reads as a trick rather than a choice.
  const others = [
    ...new Set(
      ALL_WORDS.filter((x) => x.word !== word.word && SYNONYMS[x.word]).map(
        (x) => SYNONYMS[x.word],
      ),
    ),
  ].filter((t) => t !== right)
  const start = word.word.length % others.length
  const picks = []
  for (let i = 0; i < others.length && picks.length < 4; i++) {
    const t = others[(start + i * 5) % others.length]
    if (!picks.includes(t)) picks.push(t)
  }
  const options = [
    { text: right, correct: true },
    ...picks.map((text) => ({ text, correct: false })),
  ]
  return arrange(options, word.word.length + 2)
}

// ─── Odd one out ─────────────────────────────────────────────────────────────
// Four sentences about the *same* word; exactly one misuses it. Every option
// used to be a different word, which meant a reader could find the odd one by
// spotting the word they didn't know rather than by reading — the test was of
// vocabulary breadth, not of this word. Elimination rather than selection: a
// reader can often pick the right answer out of three without being able to say
// why the others are wrong, and this asks for the why.

/**
 * Two more sentences that use each word correctly, on top of the one in its
 * `check`. The odd-one-out needs them: every option in that activity is a
 * sentence about the *same* word, so three right uses have to exist before one
 * wrong one can hide among them.
 */
const MORE_USES = {
  earnest: [
    'He made an earnest promise to pay back every cent.',
    'Her earnest questions showed she had actually read the book.',
  ],
  reluctant: [
    'The cat was reluctant to come in out of the rain.',
    'He gave a reluctant thumbs-up from the back of the room.',
  ],
  infatuated: [
    'She was infatuated with the new drummer for exactly one week.',
    'Too infatuated to look up, he walked straight into the door.',
  ],
  destiny: [
    'The prophecy claimed her destiny was already written.',
    'He believed his destiny was waiting somewhere past the mountains.',
  ],
  bargain: [
    'They made a bargain: dishes tonight, laundry tomorrow.',
    'No bargain is fair if one side has no choice.',
  ],
  peculiar: [
    'He had a peculiar habit of walking backwards up the stairs.',
    'Something peculiar was happening to the clock in the hall.',
  ],
  coincidence: [
    'It was pure coincidence that we both wore green.',
    'Two friends sharing a birthday is just a coincidence.',
  ],
  superstition: [
    'Carrying a lucky coin is a superstition he refuses to drop.',
    'One old superstition says an open umbrella indoors brings bad luck.',
  ],
  conform: [
    'She refused to conform to a dress code she thought was silly.',
    'New students often conform to whatever the group does first.',
  ],
  resilient: [
    'Resilient plants grow back even after a hard frost.',
    'He proved resilient, back at practice a week after the injury.',
  ],
  clandestine: [
    'Their clandestine plan fell apart when somebody talked.',
    'He kept a clandestine notebook nobody else was allowed to read.',
  ],
  suspicion: [
    'A single muddy footprint confirmed her suspicion.',
    'He watched the empty hallway with growing suspicion.',
  ],
  defiance: [
    'He folded his arms in defiance and refused to move.',
    'Her defiance cost her a week of detention.',
  ],
  melancholy: [
    'The melancholy song made the whole room go quiet.',
    'A kind of melancholy follows him around every winter.',
  ],
  heritage: [
    'The festival celebrates the heritage of everyone in town.',
    'He learned the language to stay close to his heritage.',
  ],
  awkward: [
    'The awkward silence lasted until somebody changed the subject.',
    'She felt awkward standing alone at the edge of the gym.',
  ],
  mischievous: [
    'A mischievous grin gave away who had moved the chairs.',
    'His mischievous little brother swapped the sugar and the salt.',
  ],
  tyrant: [
    'The old king ruled as a tyrant for thirty years.',
    'Nobody spoke up at work, because the manager was a tyrant.',
  ],
  prodigy: [
    'The chess prodigy beat three adults in one afternoon.',
    'Being a prodigy did not make practice any easier.',
  ],
  precept: [
    'Every classroom had a precept painted above the door.',
    'His grandfather lived by one simple precept.',
  ],
  empathy: [
    'Empathy is what made him sit with her instead of leaving.',
    'She listened with real empathy and never once interrupted.',
  ],
  conspicuous: [
    'The new sign was conspicuous from the far end of the street.',
    'He tried to be quiet, but his boots made him conspicuous.',
  ],
  desolate: [
    'They crossed a desolate plain with no trees for miles.',
    'The station felt desolate at four in the morning.',
  ],
  futile: [
    'Bailing out the boat with a paper cup was futile.',
    'It is futile to call a phone that is switched off.',
  ],
  ancestor: [
    'An ancestor of hers built the mill by the river.',
    'He traced one ancestor back nine generations.',
  ],
  rivalry: [
    'Their rivalry pushed them both to train harder.',
    'A friendly rivalry grew between the two bakeries.',
  ],
  legacy: [
    'The legacy of that team is still up on the gym wall.',
    'He wanted his legacy to be more than a trophy.',
  ],
  momentum: [
    'The bus lost momentum halfway up the hill.',
    'Once the crowd started clapping, the momentum built fast.',
  ],
  grief: [
    'Grief made the house feel twice as large.',
    'She wrote about her grief in a notebook nobody read.',
  ],
  solace: [
    'He took solace in the fact that everyone else failed too.',
    'There was some solace in a warm kitchen and an old song.',
  ],
  imaginary: [
    'Her imaginary friend had a name and a birthday.',
    'The map led to an imaginary island that was never there.',
  ],
  resourceful: [
    'A resourceful camper can start a fire in the rain.',
    'She was resourceful enough to turn an old crate into a desk.',
  ],
  instinct: [
    'His instinct was to duck before he heard the crash.',
    'Trust your instinct when a room goes suddenly quiet.',
  ],
  provisions: [
    'Their provisions ran low on the fourth day.',
    'He loaded the sled with provisions and a spare rope.',
  ],
  vivid: [
    'His vivid description made the room easy to picture.',
    'She kept a vivid image of that beach all winter.',
  ],
  narrator: [
    'The narrator stops to explain what happened ten years earlier.',
    'A narrator you cannot trust makes the story twice as good.',
  ],
  motive: [
    'The detective could not find a motive for the theft.',
    'Her motive was simple: she wanted the job.',
  ],
}

export function oddOneOut(word) {
  const right = [word.check.correct, ...(MORE_USES[word.word] ?? [])].slice(0, 3)
  const options = [
    { text: word.check.wrong[0], odd: true },
    ...right.map((text) => ({ text, odd: false })),
  ]
  return arrange(options, word.word.length + 3)
}

// ─── Pick a card ─────────────────────────────────────────────────────────────
// Three face-down cards; whichever is turned over gets judged right or wrong.
// The chance is the point: the reader can't scan three options and pick the
// familiar-looking one, so they have to read the sentence in front of them.

export function cardDeck(word) {
  const options = [
    { text: word.check.correct, correct: true },
    ...word.check.wrong.map((text) => ({ text, correct: false })),
  ]
  return arrange(options, word.word.length + 4)
}

// ─── Match the pairs ─────────────────────────────────────────────────────────
// Three words and three meanings, to be paired across two columns. The only
// activity that makes the reader handle words they collected earlier while
// learning the new one, which is the repetition the whole round exists for.

export function pairsFor(word, bookId) {
  const fromBook = (WORDS_BY_BOOK[bookId] ?? []).filter((x) => x.word !== word.word)
  const spare = ALL_WORDS.filter((x) => x.word !== word.word && x.bookId !== bookId)
  const start = word.word.length % spare.length
  const others = [...fromBook, spare[start], spare[(start + 6) % spare.length]].slice(0, 2)
  return [word, ...others].map((w) => ({ word: w.word, meaning: w.meaning }))
}
