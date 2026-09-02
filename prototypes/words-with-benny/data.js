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
export { READER, BOOKS, coverUrl, STREAK, DAILY_GOAL } from '../logging-flow/data'

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
  'dog-man': [
    w(
      'loyal',
      'LOY-il',
      'adjective',
      'Sticking by someone no matter what happens.',
      'Dog Man is half police officer, half dog, and one hundred percent loyal.',
      'Her loyal friend waited outside the whole time.',
      ['He loyaled the frisbee across the yard.', 'The loyal was made of stainless steel.'],
    ),
    w(
      'scheme',
      'SKEEM',
      'noun or verb',
      'A sneaky plan — or the plotting that goes into one.',
      'Petey the cat has a new scheme in every single chapter.',
      'His scheme to skip chores fell apart in about four minutes.',
      ['The scheme was taller than the fence.', 'She schemed her cereal with milk.'],
    ),
  ],
  amulet: [
    w(
      'ominous',
      'OM-i-nis',
      'adjective',
      'Giving you the feeling that something bad is about to happen.',
      'The house Emily’s family moves into is ominous from the very first page.',
      'An ominous rumble came from behind the door.',
      ['She ominoused the cake into eight slices.', 'The ominous was due back at the library.'],
    ),
    w(
      'guardian',
      'GAR-dee-in',
      'noun',
      'Someone — or something — whose job is to protect and watch over.',
      'The amulet talks to Emily like a guardian with an agenda of its own.',
      'The dog became the guardian of the whole front porch.',
      ['He guardianed the corner in under a minute.', 'The guardian tasted faintly of lemon.'],
    ),
  ],
  'scholastic-news': [
    w(
      'pollinate',
      'POL-uh-nate',
      'verb',
      'To carry pollen from flower to flower so plants can make seeds.',
      '"Save the Bees!" is about what happens when there’s nobody left to pollinate the crops.',
      'Bees pollinate about a third of the food we eat.',
      ['He pollinated the driveway with a shovel.', 'The pollinate was blue and very loud.'],
    ),
    w(
      'habitat',
      'HAB-i-tat',
      'noun',
      'The place where a plant or animal naturally lives.',
      'The bee article keeps coming back to shrinking habitat.',
      'Draining the wetland destroyed the frogs’ habitat.',
      ['She habitated the answer on her test.', 'The habitat rang twice and stopped.'],
    ),
  ],
  storyworks: [
    w(
      'suspense',
      'suh-SPENS',
      'noun',
      'The nervous, can’t-stop-reading feeling of not knowing what happens next.',
      '"The Mystery at Cabin 9" runs on suspense — the author holds the answer back on purpose.',
      'The author built suspense by ending every chapter mid-sentence.',
      ['He suspensed the rope to the ceiling.', 'The suspense was six inches deep.'],
    ),
    w(
      'evidence',
      'EV-i-dins',
      'noun',
      'Facts or clues that show whether something is true.',
      'Solving Cabin 9 means sorting real evidence from a good guess.',
      'The muddy footprints were the first real evidence they had.',
      ['She evidenced the window shut before the storm.', 'The evidence sang two verses.'],
    ),
  ],
  superscience: [
    w(
      'eruption',
      'i-RUP-shin',
      'noun',
      'A sudden, forceful burst — for a volcano, rock and gas blasting out.',
      '"Inside a Volcano" walks you through an eruption from the magma up.',
      'The eruption sent ash almost twenty miles into the sky.',
      ['He erupted the paper into a neat square.', 'The eruption cost four dollars.'],
    ),
    w(
      'molten',
      'MOLE-tin',
      'adjective',
      'Melted by heat into a thick liquid — usually rock or metal.',
      'The molten rock in that cutaway diagram is magma.',
      'Molten rock glowed orange at the bottom of the crater.',
      ['She molten her shoes before the race.', 'The molten was written in cursive.'],
    ),
  ],
  scope: [
    w(
      'perseverance',
      'per-suh-VEER-ints',
      'noun',
      'Keeping at something hard for a long time without quitting.',
      'Every survival story in this issue is really a story about perseverance.',
      'It took perseverance to finish a hike that long.',
      ['He perseveranced the tent into the ground.', 'The perseverance was folded into thirds.'],
    ),
    w(
      'endure',
      'in-DOOR',
      'verb',
      'To get through something painful or difficult and come out the other side.',
      'The climbers in "Survival Stories" endure eleven days on the mountain.',
      'They endured three days without fresh water.',
      ['She endured the bread with butter.', 'The endure parked behind the gym.'],
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

// Deliberately one word short of exhausting each book: whichever title the
// demo logs against, Benny still has a real word from it to hand over rather
// than falling through to the general-interest pool.
export const SEED_COLLECTION = [
  collected('perseverance', 'scope', '2026-06-01'),
  collected('eruption', 'superscience', '2026-06-03'),
  collected('suspense', 'storyworks', '2026-06-05'),
  collected('pollinate', 'scholastic-news', '2026-06-08'),
  collected('loyal', 'dog-man', '2026-06-10'),
  collected('ominous', 'amulet', '2026-06-11', false),
  collected('destiny', 'rump', '2026-06-12'),
  collected('bargain', 'rump', '2026-06-14'),
  collected('coincidence', 'lucky-cap', '2026-06-17'),
  collected('conform', 'lesbianas-guide', '2026-06-18', false),
  collected('melancholy', 'darius', '2026-06-20'),
  collected('heritage', 'darius', '2026-06-22'),
  collected('earnest', 'she-gets-the-girl', '2026-06-23'),
  collected('reluctant', 'she-gets-the-girl', '2026-06-24', false),
  collected('clandestine', 'telegraph-club', '2026-06-25'),
  collected('suspicion', 'telegraph-club', '2026-06-26'),
]

// ─── The educator side ───────────────────────────────────────────────────────
// One teacher, one class. The brief asks for "student and classroom level", so
// the roster carries the per-student numbers the roll-up aggregates.

export const TEACHER = { name: 'Mr. Reyes', initials: 'JR', school: 'Lincoln Middle School' }

export const CLASS = {
  id: 'room-14',
  name: 'Room 14 · 6th Grade ELA',
  students: 24,
  term: 'This school year',
}

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
    16,
    6,
    81,
    'suspicion',
    'telegraph-club',
    41,
  ),
  student('noah', 'Noah Martinez', 'NM', '#7C5CFA', 28, 6, 90, 'ominous', 'amulet', 58),
  student('mia', 'Mia Chen', 'MC', '#0DA7BC', 27, 7, 94, 'defiance', 'telegraph-club', 62),
  student('liam', 'Liam Park', 'LP', '#16A97A', 27, 4, 78, 'scheme', 'dog-man', 49),
  student('ava', 'Ava Thompson', 'AT', '#E8734A', 22, 5, 86, 'earnest', 'she-gets-the-girl', 44),
  student('ethan', 'Ethan Brooks', 'EB', '#5B7CFA', 12, 0, 71, 'loyal', 'dog-man', 26),
  student('sofia', 'Sofia Ramirez', 'SR', '#D946A0', 26, 6, 88, 'resilient', 'lesbianas-guide', 53),
  student('jayden', 'Jayden Cole', 'JC', '#0EA5A5', 9, 0, 64, 'habitat', 'scholastic-news', 19),
  student('harper', 'Harper Quinn', 'HQ', '#F0A024', 25, 5, 84, 'evidence', 'storyworks', 47),
  student('mateo', 'Mateo Silva', 'MS', '#8B5CF6', 20, 4, 80, 'molten', 'superscience', 38),
  student('zoe', 'Zoe Nakamura', 'ZN', '#14B8A6', 28, 8, 92, 'melancholy', 'darius', 66),
  student('caleb', 'Caleb Owens', 'CO', '#F472B6', 6, 0, 58, 'vivid', null, 11),
  student('amara', 'Amara Bello', 'AB', '#22C55E', 28, 6, 87, 'guardian', 'amulet', 51),
  student('lucas', 'Lucas Fenn', 'LF', '#3B82F6', 17, 3, 76, 'bargain', 'rump', 34),
  student('nora', 'Nora Ellis', 'NE', '#EF4444', 24, 5, 82, 'perseverance', 'scope', 45),
  student('idris', 'Idris Haddad', 'IH', '#A855F7', 15, 4, 74, 'peculiar', 'rump', 31),
  student('lena', 'Lena Petrov', 'LP', '#06B6D4', 26, 7, 91, 'infatuated', 'she-gets-the-girl', 59),
  student('omar', 'Omar Aziz', 'OA', '#F59E0B', 11, 0, 68, 'pollinate', 'scholastic-news', 22),
  student('grace', 'Grace Whitfield', 'GW', '#EC4899', 26, 5, 85, 'conform', 'lesbianas-guide', 48),
  student('tobias', 'Tobias Reyes', 'TR', '#10B981', 21, 4, 79, 'motive', null, 40),
  student('priya', 'Priya Raman', 'PR', '#6366F1', 27, 6, 89, 'suspense', 'storyworks', 55),
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

/** Words the class has collected most — the "word wall" an educator can point to. */
export const CLASS_TOP_WORDS = [
  { word: 'perseverance', students: 21 },
  { word: 'evidence', students: 19 },
  { word: 'suspense', students: 18 },
  { word: 'habitat', students: 17 },
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
