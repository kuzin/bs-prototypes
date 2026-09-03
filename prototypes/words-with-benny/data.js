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
const PLAIN_BOOKS = Object.fromEntries(
  Object.entries(LF_BOOKS)
    .filter(([, b]) => !b.partner)
    .map(([id, b]) => [
      id,
      INHERITED_COVER_IDS[id] ? { ...b, coverId: INHERITED_COVER_IDS[id] } : b,
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
    measure: 'pages',
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
    readable: true,
  },
  holes: {
    id: 'holes',
    coverId: 19797,
    title: 'Holes',
    author: 'Louis Sachar',
    cover: ['#B45309', '#FBBF24'],
    measure: 'pages',
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
    readable: true,
  },
  terabithia: {
    id: 'terabithia',
    coverId: 12627341,
    title: 'Bridge to Terabithia',
    author: 'Katherine Paterson',
    cover: ['#15803D', '#65A30D'],
    measure: 'pages',
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
    readable: true,
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

const badge = (name, date, color, icon = 'award') => ({ name, date, color, icon })
const locked = (name, hint, color, icon = 'award') => ({ name, hint, color, icon, locked: true })
// `art` picks the illustrated medallion in books/AchievementArt.jsx.
const achievement = (name, date, detail, art = 'books') => ({ name, date, detail, art })

export const BADGES = [
  badge('Word Collector', 'Jun 26, 2026', '#7C3AED', 'vocabulary'),
  badge('2-Week Streak', 'Jun 24, 2026', '#F0A024', 'flame'),
  badge('Spring Into Reading', 'Apr 30, 2026', '#0DA7BC', 'trophy'),
  badge('First Review', 'Apr 18, 2026', '#16A97A', 'writing'),
  badge('Ten Titles', 'Apr 6, 2026', '#2563EB', 'book-2'),
  locked('Word Hoarder', 'Collect 25 words — 19 so far', '#8B5CF6', 'vocabulary'),
  locked('Month-Long Streak', 'Log 30 days in a row', '#F59E0B', 'flame'),
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

/** Words the class has collected most — the "word wall" an educator can point to. */
export const CLASS_TOP_WORDS = [
  { word: 'mischievous', students: 21 },
  { word: 'empathy', students: 19 },
  { word: 'precept', students: 18 },
  { word: 'desolate', students: 17 },
  { word: 'resilient', students: 15 },
  { word: 'destiny', students: 14 },
  { word: 'melancholy', students: 12 },
  { word: 'clandestine', students: 9 },
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
      firstTry: (start + i) % 7 !== 0,
    }
  })
}
