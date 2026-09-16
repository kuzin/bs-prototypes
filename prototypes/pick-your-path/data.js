// ─── Pick Your Path — sample data ────────────────────────────────────────────
// Models the vocabulary cut of the proposal: a teacher sets a Destination — a
// Tier-2 vocabulary cluster (Words of Motion: accelerate, propel, momentum,
// velocity) — and students pick a high-interest Path to practice those words
// through, then read titles + do offline extension activities to earn badges.
//
// The vocabulary cluster, the three path taglines, and each path's lead
// extension activity use the EXACT copy from the "Vocabulary Focus Shift"
// demo-examples doc.

import badgeReading from './assets/badges/reading.png'
import badgeCapstone from './assets/badges/capstone.png'
import badgeSports1 from './assets/badges/a-sports-1.png'
import badgeSports2 from './assets/badges/a-sports-2.png'
import badgeEng1 from './assets/badges/a-eng-1.png'
import badgeEng2 from './assets/badges/a-eng-2.png'
import badgeAnimals1 from './assets/badges/a-animals-1.png'
import badgeAnimals2 from './assets/badges/a-animals-2.png'
import bannerSports from './assets/paths/sports.webp'
import bannerEngineering from './assets/paths/engineering.webp'
import bannerAnimals from './assets/paths/animals.webp'
import bannerDestination from './assets/paths/destination.webp'

// Real book covers, via Open Library's cover CDN by numeric cover id (found by
// looking up each ISBN below; note the id-based endpoint — /b/id/{id}-L.jpg —
// not the /b/isbn/ redirect endpoint, which frequently 404s even for editions
// that do have art). Titles without a verified id fall back to CoverTile's
// designed gradient placeholder.
function olCover(id) {
  return id ? `https://covers.openlibrary.org/b/id/${id}-L.jpg` : undefined
}

// Generated flat-vector art (see assets/). Badge art keyed by activity id,
// plus the shared reading + capstone medallions.
export const BADGE_ART = {
  reading: badgeReading,
  capstone: badgeCapstone,
  'a-sports-1': badgeSports1,
  'a-sports-2': badgeSports2,
  'a-eng-1': badgeEng1,
  'a-eng-2': badgeEng2,
  'a-animals-1': badgeAnimals1,
  'a-animals-2': badgeAnimals2,
}
const PATH_BANNERS = {
  sports: bannerSports,
  engineering: bannerEngineering,
  animals: bannerAnimals,
}

// The Tier-2 words the cluster teaches. Definitions are kid-facing — they're
// what shows in each title's glossary page in the in-app reader, on the word
// chips throughout the student's path, and in the teacher's cluster picker.
// `say` and `part` are the shape a word record takes everywhere else in these
// prototypes (see `words-with-benny`): how you say it, what kind of word it is,
// what it means, and a sentence that puts it to work.
/* The four words, in the record shape the vocabulary activities read
   (`words-with-benny`): how you say it, what kind of word it is, what it means,
   why it turned up in this book, and a `check` — one sentence that uses it
   right beside near-misses a Grade-4 reader would plausibly pick. `definition`
   is kept as an alias of `meaning`, since the rest of this prototype reads it
   under that name. */
const w = (word, say, part, meaning, why, correct, wrong) => ({
  word,
  say,
  part,
  meaning,
  definition: meaning,
  why,
  example: correct,
  check: { correct, wrong },
})

export const VOCAB = [
  w(
    'accelerate',
    'ak-SEL-uh-rate',
    'verb',
    'To speed up — to go faster and faster.',
    'Everything on your path is something that gets going in a hurry.',
    'The snowboarder began to accelerate the moment the slope tipped downhill.',
    [
      'She had to accelerate the door open before the bell rang.',
      'The accelerate on his jacket was coming loose.',
    ],
  ),
  w(
    'propel',
    'pruh-PEL',
    'verb',
    'To push or drive something forward.',
    'Something has to do the pushing — a board, an engine, a pair of wings.',
    'One hard push off the lip was enough to propel her over the gap.',
    ['He felt propel about missing the bus.', 'They propel in the library every Tuesday.'],
  ),
  w(
    'momentum',
    'moh-MEN-tum',
    'noun',
    'The push a moving thing carries — more speed or more weight means more of it.',
    'Once something heavy is moving, it takes a lot to stop it.',
    'The truck had so much momentum that it kept rolling with the engine off.',
    ['She momentum the ball across the field.', 'The momentum tasted sweeter than he expected.'],
  ),
  w(
    'velocity',
    'vuh-LOSS-ih-tee',
    'noun',
    'How fast something is moving in one direction.',
    'Speed is only half of it — which way it is going matters too.',
    'A peregrine falcon reaches its highest velocity in a hunting dive.',
    ['He velocitied down the stairs two at a time.', 'Her velocity apology sounded sincere.'],
  ),
  w(
    'friction',
    'FRIK-shun',
    'noun',
    'The drag between two things rubbing together — what slows a moving thing down.',
    'Every one of these books has something trying to stop the thing that is moving.',
    'Fresh wax cuts the friction between the board and the snow.',
    ['She felt a friction of hunger before lunch.', 'They friction the room every Friday.'],
  ),
  w(
    'gravity',
    'GRAV-ih-tee',
    'noun',
    'The pull that brings everything back down to the ground.',
    'Whatever goes up on your path has to come down again.',
    'Gravity is what turns the top of a jump into the start of a landing.',
    ['He gravitied the ball toward the net.', 'The gravity of the paint was still wet.'],
  ),
  w(
    'inertia',
    'in-UR-shuh',
    'noun',
    'A thing’s habit of staying as it is — still if it is still, moving if it is moving.',
    'The hardest part of any of these is getting started, or stopping.',
    'It takes a real shove to beat the inertia of a parked monster truck.',
    ['She inertia’d the door shut behind her.', 'The inertia smelled of fresh bread.'],
  ),
]

export const VOCAB_BY_WORD = Object.fromEntries(VOCAB.map((v) => [v.word, v]))
export const WORD_LIST = VOCAB.map((v) => v.word)

/**
 * The word list, against what the reader has read — the vocabulary half of this
 * challenge.
 *
 * A word is *in* the titles whose `words` name it. Logging one of those titles
 * **turns it up**; what **banks** it is the unlock round, the same three
 * activities `words-with-benny` collects a word with. So a word has three
 * states: hiding, turned up (waiting on its round), and collected.
 */
export function wordsForPath(path, readTitleIds, collected = []) {
  const read = new Set(readTitleIds)
  const kept = new Set(collected)
  return VOCAB.map((v) => {
    const inTitles = path.titles.filter((t) => t.words.includes(v.word))
    const foundIn = inTitles.filter((t) => read.has(t.id))
    return {
      ...v,
      inTitles,
      foundIn,
      turnedUp: foundIn.length > 0,
      found: kept.has(v.word),
    }
  })
}

/** The word a freshly-logged title turns up and the reader hasn't banked yet. */
export function wordWaitingFor(path, title, collected = []) {
  const kept = new Set(collected)
  return VOCAB.find((v) => title.words.includes(v.word) && !kept.has(v.word)) ?? null
}

export const SITE = {
  school: 'Lincoln Elementary',
  teacher: { name: 'Mr. Reyes', role: 'Grade 4 Teacher', initials: 'JR' },
  classroom: 'Room 14 · Grade 4',
  student: { name: 'Maya Chen', firstName: 'Maya', grade: 'Grade 4', initials: 'MC' },
}

// The vocabulary destination the teacher assigns (a Tier-2 word cluster).
export const DESTINATION = {
  id: 'words-of-motion',
  subject: 'Vocabulary',
  standard: 'Tier 2 Vocabulary Cluster',
  title: 'Words of Motion',
  color: '#0F766E',
  banner: bannerDestination,
  words: WORD_LIST,
  blurb:
    'Every path below practices the same four motion words — students just get to pick the subject that excites them.',
}

// Other clusters shown in the teacher picker (only Words of Motion is wired up
// for this prototype — the rest illustrate the Tier-2 catalog).
export const DESTINATION_CATALOG = [
  {
    id: 'words-of-motion',
    subject: 'Tier 2 · Science',
    title: 'Words of Motion',
    words: 'accelerate · propel · momentum · velocity',
    icon: 'bolt',
    ready: true,
  },
  {
    id: 'words-of-life',
    subject: 'Tier 2 · Science',
    title: 'Words of Living Things',
    words: 'adapt · habitat · survive · thrive',
    icon: 'leaf',
    ready: false,
  },
  {
    id: 'words-of-matter',
    subject: 'Tier 2 · Science',
    title: 'Words of Matter',
    words: 'dissolve · expand · particle · solid',
    icon: 'atom',
    ready: false,
  },
  {
    id: 'words-of-power',
    subject: 'Tier 2 · Social Studies',
    title: 'Words of Power',
    words: 'govern · represent · debate · citizen',
    icon: 'building',
    ready: false,
  },
  {
    id: 'words-of-weather',
    subject: 'Tier 2 · Science',
    title: 'Words of Weather',
    words: 'predict · pattern · severe · climate',
    icon: 'sun',
    ready: false,
  },
  {
    id: 'words-of-the-past',
    subject: 'Tier 2 · Social Studies',
    title: 'Words of the Past',
    words: 'ancient · empire · trade · ruins',
    icon: 'building-community',
    ready: false,
  },
  {
    id: 'words-of-story',
    subject: 'Tier 2 · ELA',
    title: 'Words of Story',
    words: 'character · setting · conflict · theme',
    icon: 'book',
    ready: false,
  },
  {
    id: 'words-of-argument',
    subject: 'Tier 2 · ELA',
    title: 'Words of Argument',
    words: 'claim · evidence · reason · persuade',
    icon: 'message-circle',
    ready: false,
  },
  {
    id: 'words-of-measurement',
    subject: 'Tier 2 · Math',
    title: 'Words of Measurement',
    words: 'estimate · compare · precise · unit',
    icon: 'ruler',
    ready: false,
  },
]

// The three interest paths. Taglines and each path's lead activity are verbatim
// from the vocabulary demo examples; every title carries the two cluster words it
// puts to work, which is what the word chips throughout the student's path show.
export const PATHS = [
  {
    id: 'sports',
    name: 'The Sports Path',
    tagline: 'Snowboarders who accelerate down the mountain and propel off the jump.',
    icon: 'run',
    color: '#EA580C',
    titles: [
      {
        id: 's1',
        words: ['accelerate', 'propel'],
        title: 'Snowboarding',
        author: 'Matt Doeden',
        isbn: '9780736827317',
        cover: olCover(4307487),
        level: 'Grade 3–6',
        pages: 31,
        blurb:
          'The moves, gear, and history behind one of the world’s most thrilling winter sports.',
      },
      {
        id: 's2',
        words: ['momentum', 'velocity'],
        title: 'The Science of Baseball with Max Axiom, Super Scientist',
        author: 'David L. Dreier',
        isbn: '9781491460870',
        cover: olCover(12677009),
        level: 'Grade 3–6',
        pages: 32,
        blurb:
          'Super scientist Max Axiom breaks down the physics behind pitching, hitting, and fielding.',
      },
      {
        id: 's3',
        words: ['propel', 'momentum'],
        title: 'Skateboarding Vert',
        author: 'Patrick G. Cain',
        isbn: '9781467710855',
        cover: olCover(10349858),
        level: 'Grade 2–5',
        pages: 32,
        blurb: 'The tricks, gear, and physics behind skating ramps and halfpipes.',
      },
    ],
    activities: [
      {
        id: 'a-sports-1',
        name: 'The Play-by-Play Announcer',
        short: 'Call a championship race using accelerate and momentum.',
        icon: 'microphone',
        words: ['accelerate', 'momentum'],
        prompt:
          'Pretend you are a sports announcer calling a championship race. Write a short, three-sentence script describing the winning moment. You must use the words accelerate and momentum correctly. Read it out loud with your best announcer voice!',
        requirement: 'Type in the sentences you wrote using the target words.',
        placeholder:
          'e.g. She accelerates out of the final turn — and her momentum carries her right past the leader!',
      },
      {
        id: 'a-sports-2',
        name: 'Highlight Reel',
        short: 'Spot one real moment of momentum and one of top velocity.',
        icon: 'ball-basketball',
        words: ['momentum', 'velocity'],
        prompt:
          'Watch or play about ten minutes of any sport. Keep your eyes open for one moment where a player or a ball builds momentum, and one where something reaches its top velocity.',
        requirement: 'Describe the momentum moment and the velocity moment you spotted.',
        placeholder: 'e.g. Momentum: the runner kept sliding after… Velocity: the ball flew…',
      },
    ],
  },
  {
    id: 'engineering',
    name: 'The Engineering Path',
    tagline: 'Monster-truck engines that build enough momentum to fly.',
    icon: 'tools',
    color: '#2563EB',
    titles: [
      {
        id: 'e1',
        words: ['accelerate', 'momentum'],
        // Swapped in from the proposal's Kenney title, which Open Library has no
        // cover for — this is a real book whose title, author, and cover art all
        // come from one verified Open Library record.
        title: 'Forces and Motion',
        author: 'Chris Oxlade',
        cover: olCover(11633718),
        level: 'Grade 3–6',
        pages: 32,
        blurb:
          'How forces make things speed up, slow down, and change direction — with experiments to try.',
      },
      {
        id: 'e2',
        words: ['momentum', 'propel'],
        title: 'Monster Trucks',
        author: 'Kristin L. Nelson',
        isbn: '9780822506911',
        cover: olCover(1559234),
        level: 'Grade 2–5',
        pages: 32,
        blurb: 'How these oversized trucks are built to crush cars and fly through the air.',
      },
      {
        id: 'e3',
        words: ['velocity', 'accelerate'],
        title: 'Building a Roller Coaster',
        author: 'Karen Latchana Kenney',
        isbn: '9781681523507',
        cover: olCover(9210529),
        level: 'Grade K–3',
        pages: 24,
        blurb: 'Step-by-step, how a roller coaster goes from blueprint to a real thrill ride.',
      },
    ],
    activities: [
      {
        id: 'a-eng-1',
        name: 'The “Propel” Scavenger Hunt',
        short: 'Hunt down an object that is built to propel something forward.',
        icon: 'search',
        words: ['propel'],
        prompt:
          'Look around your home or neighborhood for an object that is designed to propel something forward (like a rubber band, a garden hose, or a fan).',
        requirement:
          'Submit the name of the object you found and write one sentence explaining how it propels something.',
        placeholder: 'e.g. A garden hose — the water pressure propels the spray across the yard.',
      },
      {
        id: 'a-eng-2',
        name: 'Ramp Report',
        short: 'Roll a car down a ramp, then narrate it with accelerate and velocity.',
        icon: 'gauge',
        words: ['accelerate', 'velocity'],
        prompt:
          'Prop up a book or board to build a ramp and roll a toy car down it. Run it twice — once from a low start, once from a high one — and watch closely what changes.',
        requirement: 'Write one sentence about the car using accelerate and one using velocity.',
        placeholder: 'e.g. The car accelerated faster off the tall ramp… its velocity was highest…',
      },
    ],
  },
  {
    id: 'animals',
    name: 'The Animal Path',
    tagline: 'Peregrine falcons that hit extreme velocities in a hunting dive.',
    icon: 'paw',
    color: '#16A34A',
    titles: [
      {
        id: 'n1',
        words: ['accelerate', 'velocity'],
        title: 'Cheetahs',
        author: 'Jody Sullivan Rake',
        isbn: '9780736813938',
        cover: olCover(1365889),
        level: 'Grade 1–3',
        pages: 24,
        blurb: 'How the fastest land animal is built for a full-speed sprint.',
      },
      {
        id: 'n2',
        words: ['velocity', 'momentum'],
        title: 'Peregrine Falcon',
        author: 'Josh Plattner',
        isbn: '9781629696720',
        cover: olCover(12515574),
        level: 'Grade 1–4',
        pages: 24,
        blurb: 'Meet the bird that dives faster than any other animal on Earth.',
      },
      {
        id: 'n3',
        words: ['accelerate', 'propel'],
        title: "World's Fastest Animals",
        author: 'Melissa Stewart',
        isbn: '9781454906339',
        cover: olCover(10277532),
        level: 'Grade 2–5',
        pages: 32,
        blurb: 'A tour of the fastest sprinters, flyers, and swimmers in the animal kingdom.',
      },
    ],
    activities: [
      {
        id: 'a-animals-1',
        name: 'Action Charades',
        short: 'Act out the difference between velocity and accelerate.',
        icon: 'run',
        words: ['accelerate', 'velocity'],
        prompt:
          'Teach a friend or family member the difference between the words velocity and accelerate by acting them out. For example, act out a cheetah accelerating from a standstill versus reaching its top velocity.',
        requirement:
          'Enter whether it was harder to act out accelerate or velocity, and explain why.',
        placeholder: 'e.g. Accelerate was harder to act out because…',
      },
      {
        id: 'a-animals-2',
        name: 'Two-Picture Field Guide',
        short: 'Draw one animal propelling itself and one at top velocity.',
        icon: 'pencil',
        words: ['propel', 'velocity'],
        prompt:
          'Pick a fast animal and draw it twice: once as it propels itself into a sprint, and once as it hits its top velocity. Label each drawing with the word it shows.',
        requirement:
          'Describe what you drew differently in the two pictures, using propel and velocity.',
        placeholder: 'e.g. In the first drawing the cheetah’s back legs propel it forward…',
      },
    ],
  },
]

// Each path's shelf runs ~10 titles deep, and every title on it — featured or
// not — carries verified Open Library cover art. Each `more()` row's title,
// author, and cover id all come from the SAME Open Library search result (and the
// cover was fetched to confirm it exists and is big enough to render), so no cover
// is ever attributed to the wrong book.
const more = (title, author, level, pages, coverId) => ({
  id: `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 22)}`,
  title,
  author,
  level,
  pages,
  cover: olCover(coverId),
})

const MORE_TITLES = {
  sports: [
    more('Football', 'Hugh Hornby', 'Grade 3–6', 32, 2594076),
    more('Gymnastics', 'Lloyd Readhead', 'Grade 3–6', 32, 1929362),
    more('Swimming', 'Rick Cross', 'Grade 2–5', 24, 9785812),
    more('BMX Street', 'Patrick G. Cain', 'Grade 2–5', 32, 10337910),
    more('Basketball', 'Suzanne Slade', 'Grade 3–6', 48, 9826185),
    more('Soccer', 'Charlotte Guillain', 'Grade 2–5', 24, 10336335),
    more('Neymar', 'Marty Gitlin', 'Grade 3–6', 48, 11516658),
  ],
  engineering: [
    more('Simple Machines', 'Rebecca Rissman', 'Grade 2–5', 32, 9046256),
    more('Levers', 'Mandy Suhr', 'Grade 2–5', 24, 10780681),
    more('Pulleys', 'Mandy Suhr', 'Grade 2–5', 24, 10393390),
    more("You Wouldn't Want to Live Without Gravity!", 'Anne Rooney', 'Grade 3–6', 32, 10161279),
    more('Wheels and Axles', 'Sian Smith', 'Grade 2–5', 24, 10203958),
    more('Machines on the Road', 'Sian Smith', 'Grade 1–4', 24, 10783697),
    more('Friction and Resistance', 'Chris Oxlade', 'Grade 3–6', 32, 1742738),
  ],
  animals: [
    more('Biggest, Strongest, Fastest', 'Steve Jenkins', 'Grade 1–4', 32, 256442),
    more('How Animals Move', 'Pamela Hickman', 'Grade 3–6', 32, 1871210),
    more('Predator Attack!', 'Katharine Kenah', 'Grade 2–5', 32, 14858666),
    more("It's a Hummingbird's Life", 'Irene Kelly', 'Grade 1–4', 32, 625526),
    more('Pronghorns', 'Tom Jackson', 'Grade 2–5', 24, 8180808),
    more('Jackrabbits', 'JoAnn Early Macken', 'Grade 1–4', 24, 13831397),
    more('Bats', 'Gail Gibbons', 'Grade 1–4', 32, 625416),
  ],
}

// Every title on a path teaches two of the cluster's words. The featured three
// name theirs by hand; the deeper shelf takes the next pair off this rotation,
// which walks the whole list so every word is hiding in at least two titles.
const WORD_PAIRS = [
  ['accelerate', 'propel'],
  ['momentum', 'velocity'],
  ['friction', 'gravity'],
  ['inertia', 'accelerate'],
  ['propel', 'friction'],
  ['gravity', 'momentum'],
  ['velocity', 'inertia'],
]

// Attach the deeper shelf + each path's generated theme banner.
PATHS.forEach((p) => {
  p.titles = [...p.titles, ...MORE_TITLES[p.id]]
  p.titles.forEach((t, i) => {
    t.words = t.words ?? WORD_PAIRS[i % WORD_PAIRS.length]
  })
})

PATHS.forEach((p) => {
  p.banner = PATH_BANNERS[p.id]
})

export const PATH_BY_ID = Object.fromEntries(PATHS.map((p) => [p.id, p]))

// Seed the student demo so the destination page opens with real progress
// (matches the proposal example: "read 2 of 3", activities still to do).
export const SEED = {
  /* Nobody has picked yet — which is the proposal's first beat, and the state
     the challenge card's three-up cover is for. The id below is what the
     student's own page falls back to when the dev switcher jumps straight to
     it without a choice having been made. */
  chosenPathId: null,
  fallbackPathId: 'sports',
  /* 2 of 3 read — the first and third titles rather than the first two,
     because on every path those two leave exactly one of the four words still
     hiding, which is the state the Word List has anything to say in. */
  readTitleIds: ['s1', 's3'],
  /* When each of those went on the log. A challenge log is a log: it has to say
     when, and the first two entries predate the demo. */
  loggedOn: { s1: 'April 18, 2026', s3: 'April 27, 2026' },
  loggedValue: { s1: 31, s3: 32 },
  // The words those two titles turned up, already banked.
  collectedWords: ['accelerate', 'propel', 'momentum'],
  doneActivityIds: [], // 0 of 2 done — the student completes these live
  streak: 5,
}

// ─── Challenge dashboard ──────────────────────────────────────────────────────
// The student's Challenges page — the surface a Destination actually lives on.
// Modelled on the reader prototype's dashboard (see prototypes/logging-flow).
// The Words of Motion card is the live one: opening it goes to the path view.

export const DAILY_GOAL = { minutes: 12, goal: 20 }

// `programs/_programs_list_item` — the shape the shared `ChallengeCard` reads:
// art, name, dates, the site under them, and the chips that say what format the
// challenge is and what you log for it. Words of Motion is the live one.
export const CHALLENGES = [
  {
    id: 'words-of-motion',
    title: 'Words of Motion',
    dates: 'Apr 14 — May 30',
    /* The card's third line is `connected_site` in the app — where a challenge
       you joined elsewhere came from. Only this one uses it, and for the one
       thing worth saying about it here: which path the reader is on. */
    types: ['book_list', 'activities'],
    logTypes: ['books'],
    bannerImg: bannerDestination,
    // the live one — opens the student's path
    live: true,
  },
  {
    id: 'spring',
    title: 'Spring Into Reading',
    dates: 'Apr 1 — Apr 30',
    types: [],
    logTypes: ['minutes'],
    art: 'spring',
  },
  {
    id: 'mystery-month',
    title: 'Mystery Month',
    dates: 'Ongoing',
    types: ['reviews'],
    logTypes: ['books'],
    art: 'mystery-month',
  },
]

// `_leaderboard_widget` — the shared card's two tabs are Top Schools and Top
// Grades on a school site, and each row carries a figure per range and unit.
export const TOP_READERS = [
  { rank: 1, name: 'Diego H.', stats: { week: { minutes: 214, books: 6 }, month: { minutes: 806, books: 21 } }, color: '#FFBC42' }, // prettier-ignore
  { rank: 2, name: 'Maya C.', isMe: true, stats: { week: { minutes: 198, books: 5 }, month: { minutes: 742, books: 19 } }, color: '#ACACAC' }, // prettier-ignore
  { rank: 3, name: 'Priya S.', stats: { week: { minutes: 165, books: 4 }, month: { minutes: 690, books: 17 } }, color: '#C2884F' }, // prettier-ignore
]

export const TOP_CLASSES = [
  { rank: 1, name: 'Room 14 · Grade 4', stats: { week: { minutes: 1840, books: 47 }, month: { minutes: 7120, books: 168 } }, color: '#FFBC42' }, // prettier-ignore
  { rank: 2, name: 'Room 9 · Grade 4', stats: { week: { minutes: 1610, books: 41 }, month: { minutes: 6380, books: 150 } }, color: '#ACACAC' }, // prettier-ignore
  { rank: 3, name: 'Room 21 · Grade 5', stats: { week: { minutes: 1275, books: 33 }, month: { minutes: 5010, books: 121 } }, color: '#C2884F' }, // prettier-ignore
]

// ─── The reader's word collection ────────────────────────────────────────────
// Collections > Words is the reader's own, not a challenge's: every word Maya
// has banked by logging, wherever she banked it. These came from earlier
// challenges and sit alongside the ones this path turns up.

const elsewhere = (word, say, part, meaning, example, bookId, from, challenge, date) => ({
  word,
  say,
  part,
  meaning,
  definition: meaning,
  example,
  check: { correct: example, wrong: [] },
  bookId,
  from,
  challenge,
  date,
})

export const WORDS_ELSEWHERE = [
  elsewhere(
    'ferocious',
    'fuh-ROH-shus',
    'adjective',
    'Fierce and violent — the kind of angry that makes people back away.',
    'The bear let out a ferocious roar and the whole clearing went quiet.',
    'wild-robot',
    'The Wild Robot',
    'Mystery Month',
    '2026-03-12',
  ),
  elsewhere(
    'stealthy',
    'STEL-thee',
    'adjective',
    'Moving so quietly and carefully that nobody notices you.',
    'One stealthy step at a time, he crossed the hall without a sound.',
    'spy-school',
    'Spy School',
    'Mystery Month',
    '2026-03-03',
  ),
  elsewhere(
    'peculiar',
    'pih-KYOOL-yer',
    'adjective',
    'Odd in a way you can’t quite explain.',
    'There was something peculiar about a hole that deep in the middle of nowhere.',
    'holes',
    'Holes',
    'Spring Into Reading',
    '2026-02-24',
  ),
  elsewhere(
    'triumph',
    'TRY-umf',
    'noun',
    'A win you really had to work for.',
    'After a season of losses, the last shot felt like a triumph.',
    'crossover',
    'The Crossover',
    'Spring Into Reading',
    '2026-02-09',
  ),
]

/** The books those came from, for the collection's own book lookup. */
const BOOKS_ELSEWHERE = Object.fromEntries(
  WORDS_ELSEWHERE.map((w) => [w.bookId, { id: w.bookId, title: w.from }]),
)

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** "April 18, 2026" → "2026-04-18". The log writes dates the way a reader says
 *  them; the collection sorts and groups on them, so it wants them ordered. */
export function toIso(date) {
  const m = /^([A-Za-z]+) (\d+), (\d{4})$/.exec(date ?? '')
  if (!m) return date ?? ''
  const month = String(MONTHS.indexOf(m[1]) + 1).padStart(2, '0')
  return `${m[3]}-${month}-${m[2].padStart(2, '0')}`
}

/**
 * Everything the reader has collected, **oldest first** — the shape
 * `words-with-benny`'s collection takes, since that is the surface this feeds:
 * `{ word, bookId, date, firstTry }`, with the challenge it came from kept
 * alongside for the filter.
 *
 * The collection is the reader's; a challenge is only where a word happened to
 * turn up. So this path's banked words fold in with the ones banked before it.
 */
export function wordCollection(path, collected = [], loggedOn = {}) {
  const here = VOCAB.filter((v) => collected.includes(v.word)).map((v) => {
    const from = path?.titles.find((t) => t.words.includes(v.word) && loggedOn[t.id])
    return {
      word: v.word,
      bookId: from?.id,
      date: toIso(from ? loggedOn[from.id] : ''),
      firstTry: true,
      challenge: DESTINATION.title,
    }
  })
  const before = WORDS_ELSEWHERE.map((w) => ({
    word: w.word,
    bookId: w.bookId,
    date: w.date,
    firstTry: w.word !== 'peculiar',
    challenge: w.challenge,
  }))
  return [...before, ...here].sort((a, b) => a.date.localeCompare(b.date))
}

/** The full record behind a collected word, wherever it was banked. */
export function wordFor(name) {
  return VOCAB.find((v) => v.word === name) ?? WORDS_ELSEWHERE.find((w) => w.word === name) ?? null
}

/** …and the book it came from — a title on the path, or one read before it. */
export function bookFor(path, id) {
  return path?.titles.find((t) => t.id === id) ?? BOOKS_ELSEWHERE[id] ?? null
}

// ─── The logging flow's catalog ──────────────────────────────────────────────
// The shared `LogFlow` searches a book map and offers shelves off it. A path's
// titles are that catalog here, so the reader logs the same book they are
// looking at rather than one from somebody else's fixture.

// `cover` is a full Open Library image URL; `BookCover` wants the numeric id.
const coverIdOf = (url) => {
  const m = /\/b\/id\/(\d+)-/.exec(url ?? '')
  return m ? m[1] : undefined
}

export function logBooksForPath(path) {
  return Object.fromEntries(
    path.titles.map((t) => [
      t.id,
      {
        id: t.id,
        title: t.title,
        author: t.author,
        coverId: coverIdOf(t.cover),
        cover: [path.color, path.color],
        // These are 24–32 page nonfiction titles: pages is what they're read in.
        measure: 'pages',
        pages: t.pages,
      },
    ]),
  )
}

/** The path, as the reading list the flow offers off its search screen. */
export function logListForPath(path, readTitleIds = []) {
  return {
    title: path.name,
    unit: 'titles',
    completed: readTitleIds,
    titles: path.titles.map((t) => t.id),
  }
}

// ─── Rewards ─────────────────────────────────────────────────────────────────
// `programs/_reward.html.haml`. A reward hangs off a badge — a reading one, an
// activity one, or the challenge itself — and it is three things: its title,
// **how it was unlocked** (or what will unlock it), and **what to do about it**,
// which is what the app puts behind an "Instructions" heading. A redeemed one
// keeps its place and loses its instructions; there is nothing left to do.

export const REWARDS = [
  {
    id: 'rw-first',
    name: 'Reading Champion Sticker',
    unlock: { badge: 'your first title' },
    instructions: 'Ask Mr. Reyes for it at the start of the next class.',
    on: 'April 18',
    redeemed: true,
    needs: { titles: 1 },
  },
  {
    id: 'rw-three',
    name: 'Front-of-the-Line Library Pass',
    unlock: { log: '3 titles from your path' },
    instructions: 'Show this screen at the library desk and go straight to the front.',
    needs: { titles: 3 },
  },
  {
    id: 'rw-activities',
    name: 'Choose the Class Read-Aloud',
    unlock: { badge: 'both extension activities' },
    instructions: 'Tell Mr. Reyes which book you want — he reads it to the class next Friday.',
    needs: { activities: 'all' },
  },
  {
    id: 'rw-capstone',
    name: 'Words of Motion Certificate',
    unlock: { program: 'completion' },
    instructions: 'Open it from this tab and print it, or ask Mr. Reyes to print it for you.',
    needs: { capstone: true },
  },
]

/**
 * The reward list against a reader's progress. `needs` is what each one asks
 * for, and it is checked the same way the badges are — off the reading and the
 * activities rather than a stored flag.
 */
export function rewardsForPath(path, readTitleIds, doneActivityIds, capstoneEarned) {
  const read = new Set(readTitleIds)
  const done = new Set(doneActivityIds)
  const readCount = path.titles.filter((t) => read.has(t.id)).length
  const allDone = path.activities.every((a) => done.has(a.id))

  return REWARDS.map((r) => {
    const earned = r.needs.capstone
      ? Boolean(capstoneEarned)
      : r.needs.activities === 'all'
        ? allDone
        : readCount >= (r.needs.titles ?? 0)
    return { ...r, earned, redeemed: earned && r.redeemed }
  })
}

/** `programs/_reward` writes a sentence for each case; this is the same set. */
export function rewardUnlockLine(r) {
  const { log, badge, program } = r.unlock ?? {}
  if (r.earned) {
    if (program === 'completion') return `Unlocked by completing this challenge${on(r)}.`
    if (log) return `Unlocked${on(r)} for logging ${log}.`
    return `Unlocked${on(r)} with ${badge}.`
  }
  if (program === 'completion') return 'Complete this challenge to unlock this reward.'
  if (log) return `Log ${log} to unlock this reward.`
  return `Finish ${badge} to unlock this reward.`
}

const on = (r) => (r.on ? ` on ${r.on}` : '')

// ─── Badge model ──────────────────────────────────────────────────────────────
// Badges are derived from progress so there's one source of truth. A path shows:
//   • one reading badge     — per title, earned as soon as that title is read
//   • one activity badge    — per extension activity by default, but an
//     activity can name another activity's id as its `badgeId` to join that
//     badge instead; the badge is earned once every activity in its group is
//     done (typically a group of one)
//   • one destination badge — the capstone, earned once the student has read
//     REQUIRED_READS titles (any of them) and finished every activity

// A path's shelf is ~10 deep but a student only has to read this many of them —
// the depth is choice, not workload.
export const REQUIRED_READS = 3

export function badgesForPath(path, readTitleIds, doneActivityIds) {
  const read = new Set(readTitleIds)
  const done = new Set(doneActivityIds)
  const readCount = path.titles.filter((t) => read.has(t.id)).length
  const enoughRead = readCount >= Math.min(REQUIRED_READS, path.titles.length)
  const allDone = path.activities.every((a) => done.has(a.id))

  const reading = path.titles.map((t) => ({
    id: `badge-read-${t.id}`,
    kind: 'reading',
    name: t.title,
    sub: 'Read this title',
    icon: 'book',
    art: BADGE_ART.reading,
    color: path.color,
    earned: read.has(t.id),
  }))

  const activityGroups = new Map()
  for (const a of path.activities) {
    const badgeId = a.badgeId ?? a.id
    if (!activityGroups.has(badgeId)) activityGroups.set(badgeId, [])
    activityGroups.get(badgeId).push(a)
  }

  const activity = [...activityGroups].map(([badgeId, group]) => {
    const lead = group[0] // a shared badge takes its name/icon from the first activity in its group
    return {
      id: `badge-${badgeId}`,
      kind: 'activity',
      name: lead.name,
      sub: group.length > 1 ? `Complete ${group.length} activities` : 'Complete this activity',
      icon: lead.icon,
      art: BADGE_ART[badgeId],
      color: path.color,
      earned: group.every((a) => done.has(a.id)),
    }
  })

  const capstone = {
    id: `badge-dest-${path.id}`,
    kind: 'destination',
    name: 'Words of Motion Explorer',
    sub: `Read any ${REQUIRED_READS} titles + finish every activity`,
    icon: 'bolt',
    art: BADGE_ART.capstone,
    color: DESTINATION.color,
    earned: enoughRead && allDone,
  }

  return [...reading, ...activity, capstone]
}
